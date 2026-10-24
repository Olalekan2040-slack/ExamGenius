"""
attach_novel_contexts.py
========================
Scans every JAMB English Language and Literature-in-English question in the
"JAMB copy" source JSON files, detects which novel / play / poem the question
refers to, then writes a helpful context string into the `passage` column of
the `questions` table.

Run from the project root:
    python scripts/attach_novel_contexts.py          # dry-run (prints stats)
    python scripts/attach_novel_contexts.py --apply  # writes to DB
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent.parent))

import psycopg2
from app.core.config import settings


# ─────────────────────────────────────────────────────────────────────────────
# 1.  CONTEXT CATALOGUE
#     Each entry:  (title, author, short_label, context_text, keywords)
#     keywords – list of strings; any match in question+options triggers context.
#     Context text is written into the `passage` column exactly as-is.
# ─────────────────────────────────────────────────────────────────────────────

CONTEXTS = {

    # ── USE OF ENGLISH NOVELS ─────────────────────────────────────────────────

    "successors": {
        "title": "The Successors",
        "author": "Jerry Agada",
        "years": "2010–2014",
        "subject": "Use of English",
        "passage": (
            "Novel: \"The Successors\" by Jerry Agada — JAMB Use of English text (2010–2014).\n"
            "\n"
            "Summary: Two hardworking men — Okoh Ameh and Terkura Atsen — build their lives in parallel. Their children David (Okoh's son) and Ifenne (Terkura's son) represent the next generation of leadership, carrying forward the values of industry and integrity.\n"
            "\n"
            "Key Characters:\n"
            "• Okoh Ameh — one of the two central figures; a hardworking, principled man.\n"
            "• Terkura Atsen — the other central figure; his story runs parallel to Okoh's.\n"
            "• David — Okoh's son; a successor figure representing hard work and ambition.\n"
            "• Ifenne — Terkura's son; the other successor; both young men carry the story forward.\n"
            "\n"
            "Themes: Succession, hard work, integrity, leadership, generational values, ambition."
        ),
        "keywords": [
            "the successors", "okoh ameh", "terkura atsen", "jerry agada",
            "ifenne", "successes", "eze was terkura",
        ],
        "eng_year_range": range(2010, 2015),
    },

    "forcados": {
        "title": "The Last Days at Forcados High School",
        "author": "A. H. Mohammed",
        "years": "2015–2016",
        "subject": "Use of English",
        "passage": (
            "Novel: \"The Last Days at Forcados High School\" by A. H. Mohammed — JAMB Use of English text (2015–2016).\n"
            "\n"
            "Summary: Jimi Solade is in his final days at Forcados High School in Delta State. His older brother Wole has been disowned by their strict father Mr Solade for financial misconduct. Jimi must navigate family crisis, friendship, school authority, child abuse, and the transition from adolescence to adulthood. Efua Coker, daughter of another family, is a major character whose life intertwines with Jimi's.\n"
            "\n"
            "Key Characters:\n"
            "• Jimi Solade — protagonist; a student facing family and school pressures in his final term.\n"
            "• Efua Coker — female lead; a student whose story parallels Jimi's; not always in teachers' good books.\n"
            "• Wole Solade — Jimi's older brother; disowned for financial misconduct.\n"
            "• Mr Solade — Jimi's strict, authoritative father.\n"
            "• Mrs Solade — Jimi's mother; more understanding.\n"
            "• Peter — Jimi's close friend at school.\n"
            "• Lana — another key student character.\n"
            "\n"
            "Themes: Youth, friendship, family crisis, parental authority, child abuse, school life, consequences of misconduct."
        ),
        "keywords": [
            "forcados", "jimi solade", "efua coker", "wole solade", "a.h. mohammed",
            "a. h. mohammed", "last days at forcados", "last days", "solade",
            "jimi", "efua", "seyi lawal", "nene",
        ],
        "eng_year_range": range(2015, 2017),
    },

    "in_dependence": {
        "title": "In Dependence",
        "author": "Sarah Ladipo Manyika",
        "years": "2017–2018",
        "subject": "Use of English",
        "passage": (
            "Novel: \"In Dependence\" by Sarah Ladipo Manyika — JAMB Use of English text (2017–2018).\n"
            "\n"
            "Summary: A love story set against Nigeria's independence era. Tayo Ajayi, a young Nigerian student at Oxford University in the 1960s, falls in love with Vanessa, an English woman. Their lives diverge across decades and continents. The title is a deliberate double meaning: 'independence' (of a nation) and 'in dependence' (on others, on history, on love).\n"
            "\n"
            "Key Characters:\n"
            "• Tayo Ajayi — Nigerian protagonist; an Oxford student full of ambition and hope for post-independence Nigeria.\n"
            "• Vanessa — English woman; Tayo's love interest at Oxford.\n"
            "• Pamela — Vanessa's friend; contrasts with Vanessa in attitude toward Tayo.\n"
            "• Robert — another character in Tayo's Oxford circle.\n"
            "• Dr Badmos — Nigerian character representing the older generation's perspective.\n"
            "\n"
            "Themes: Love across cultures, post-colonialism, identity, ambition, Nigeria's independence, disillusionment, belonging."
        ),
        "keywords": [
            "in dependence", "tayo ajayi", "vanessa", "sarah ladipo manyika",
            "dr badmos", "pamela", "ladipo manyika", "oxford",
        ],
        "eng_year_range": range(2017, 2019),
    },

    "sweet_sixteen": {
        "title": "Sweet Sixteen",
        "author": "Bolaji Abdullahi",
        "years": "2019–2020",
        "subject": "Use of English",
        "passage": (
            "Novel: \"Sweet Sixteen\" by Bolaji Abdullahi — JAMB Use of English text (2019–2020).\n"
            "\n"
            "Summary: On Aliya's 16th birthday, her father Mr Bello — a public relations officer — gives her a birthday letter (one page for each year of her life) instead of a card. Over a weekend of drives and conversations, he guides her through life lessons on womanhood, career choices, dating, social media, self-esteem, and moral decision-making. Aliya is assertive and insists she is 'a young adult, not a child.'\n"
            "\n"
            "Key Characters:\n"
            "• Aliya — the 16-year-old protagonist; intelligent, assertive, questions everything. Being called 'a child' is, to her, the same as being called 'not intelligent.'\n"
            "• Mr Bello — Aliya's father; a public relations officer; strict but philosophical and funny. Introduces her to the Gandhi Test.\n"
            "• Aliya's mother — a nurse; loving and practical.\n"
            "• Akin — the 'gold medalist in rascality and smartness' among Aliya's peers.\n"
            "• Iyabo — one of Aliya's friends.\n"
            "• Sade — another peer character.\n"
            "\n"
            "Key concept — The Gandhi Test: An action is right only if you would be happy for everyone to know you did it (from Mahatma Gandhi).\n"
            "The letter opens with: 'How time flies.'\n"
            "Chapter titles: The Letter, The Drive, Work, The Gandhi Test, Dating, Stereotype, Beauty.\n"
            "\n"
            "Themes: Coming of age, parenting, gender roles, self-esteem, moral decision-making, education, social media, father-daughter relationships."
        ),
        "keywords": [
            "sweet sixteen", "aliya", "mr bello", "bolaji abdullahi", "gandhi test",
            "iyabo", "kotl", "body shaming",
            # "akin" and "sade" removed — too common as Nigerian names in grammar samples
            # "gandhi" removed — could appear in any social science question
        ],
        "eng_year_range": range(2019, 2021),
    },

    "life_changer": {
        "title": "The Life Changer",
        "author": "Khadija Abubakar Jalli",
        "years": "2021–2024",
        "subject": "Use of English",
        "passage": (
            "Novel: \"The Life Changer\" by Khadija Abubakar Jalli — JAMB Use of English text (2021–2024).\n"
            "\n"
            "Summary: Salma and her university roommates navigate turbulent campus life at a Nigerian university. The novel exposes academic fraud (secret 'cheat notes'), cultism, drug abuse, and sexual exploitation. The story is framed by Ummi — Salma's mother — narrating episodes to her younger children at home. The title reflects how the university experience permanently changes lives, for better or worse.\n"
            "\n"
            "Key Characters:\n"
            "• Salma — the central student character; navigates campus challenges with integrity.\n"
            "• Talle — Salma's brother; provides a male perspective on campus life.\n"
            "• Ummi — Salma's mother; the frame narrator who tells the story to her younger children.\n"
            "• Bint — one of Salma's roommates.\n"
            "• Omar — a male student character involved in campus intrigues; called 'Omar Esquire' mockingly.\n"
            "• Habib — another male student character.\n"
            "• Laila — a roommate who faces serious moral challenges.\n"
            "• Lekki — a campus bad boy / cult-adjacent figure.\n"
            "• Dike — another male campus character.\n"
            "• The Dean of Students — represents institutional authority.\n"
            "• Dr Samuel Johnson — a notable lecturer on campus.\n"
            "\n"
            "The 'Note of Salvation' = the colloquial term for cheat notes (illegal exam aids).\n"
            "\n"
            "Themes: University life, cultism, drug abuse, sexual exploitation, moral choices, academic fraud, peer pressure, female agency, integrity, redemption."
        ),
        "keywords": [
            "life changer", "salma", "talle", "ummi", "bint", "omar",
            "habib", "laila", "lekki", "dike", "khadija", "abubakar jalli",
            "note of salvation", "omar esquire", "dean of students",
            "dr. samuel johnson", "dr samuel johnson",
        ],
        "eng_year_range": range(2021, 2025),
    },

    "lekki_headmaster": {
        "title": "The Lekki Headmaster",
        "author": "Kabir Alabi Garba",
        "years": "2025–2026",
        "subject": "Use of English",
        "passage": (
            "Novella: \"The Lekki Headmaster\" by Kabir Alabi Garba — JAMB Use of English text (2025–2026).\n"
            "\n"
            "Summary: A principled headmaster at a school in Lekki, Lagos transforms the lives of students and the surrounding community through an unorthodox but morally grounded approach to education. The novella challenges societal norms and emphasises the transformative power of education and individual character.\n"
            "\n"
            "Key Characters:\n"
            "• The Headmaster — the central figure; represents visionary, principled leadership in education.\n"
            "• Students — an ensemble of student characters whose lives are shaped by the headmaster.\n"
            "• Community members — represent society's response to educational transformation.\n"
            "\n"
            "Themes: Education as transformation, moral values, leadership, societal norms, community, integrity, individual growth."
        ),
        "keywords": [
            # NOTE: "headmaster" alone is too generic (appears in any grammar question).
            # Only match on the full title or the author's name.
            "lekki headmaster", "kabir alabi garba", "kabir garba",
        ],
        "eng_year_range": range(2025, 2027),
    },

    # ── LITERATURE-IN-ENGLISH: DRAMA ──────────────────────────────────────────

    "harvest_of_corruption": {
        "title": "Harvest of Corruption",
        "author": "Frank Ogodo Ogbeche",
        "years": "Perennial JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Play: \"Harvest of Corruption\" by Frank Ogodo Ogbeche — perennial JAMB Literature-in-English text.\n"
            "\n"
            "Summary: A Nigerian play that exposes the cancer of corruption in public life. Chief Haladu Ade-Amaka is a powerful, corrupt official who abuses his position for personal gain and exploitation of women. Ogeyi is a principled female journalist who refuses to be compromised and fights to expose the truth. The play shows how corruption destroys institutions — and how moral courage can resist it.\n"
            "\n"
            "Key Characters:\n"
            "• Chief Haladu Ade-Amaka — the central villain; a corrupt, powerful government official who exploits women and abuses power.\n"
            "• Ogeyi — the female protagonist; an honest journalist with moral integrity; resists corruption at great personal cost.\n"
            "• Aloho — employed as the Chief's secretary/assistant; drawn into his schemes.\n"
            "• Madam Hoha — a corrupt businesswoman who benefits from the corrupt system.\n"
            "• Ochacho — one of Ade-Amaka's corrupt associates.\n"
            "• Ukoro — another corrupt associate.\n"
            "\n"
            "Themes: Corruption, bribery, press freedom, justice, moral courage, abuse of power, politics, role of women, hide-and-seek of corruption."
        ),
        "keywords": [
            "harvest of corruption", "ogbeche", "ade-amaka", "haladu", "ogeyi",
            "madam hoha", "ochacho", "ukoro", "aloho", "chief haladu",
            "frank ogodo",
        ],
    },

    "othello": {
        "title": "Othello",
        "author": "William Shakespeare",
        "years": "Perennial JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Play: \"Othello\" by William Shakespeare — perennial JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Othello, a Black Moorish general in the Venetian army, secretly marries Desdemona, a white Venetian noblewoman. Iago — his ensign, passed over for promotion — engineers a conspiracy to destroy Othello by making him believe Desdemona is having an affair with Cassio. Through brilliant manipulation, Othello descends into jealous rage, murders Desdemona, then kills himself when he discovers the truth.\n"
            "\n"
            "Key Characters:\n"
            "• Othello — the protagonist; a noble Moorish general; his tragic flaw is misplaced trust and susceptibility to jealousy.\n"
            "• Desdemona — Othello's wife; innocent, loyal, loving; victim of both Iago's scheme and Othello's jealousy.\n"
            "• Iago — the villain; Othello's ensign; driven by envy after being denied promotion; one of literature's greatest manipulators.\n"
            "• Cassio — Othello's lieutenant; framed by Iago as Desdemona's lover.\n"
            "• Emilia — Iago's wife and Desdemona's attendant; eventually exposes Iago's plot.\n"
            "• Roderigo — a wealthy Venetian who loves Desdemona; manipulated and used by Iago.\n"
            "• Brabantio — Desdemona's father; furious about the secret marriage.\n"
            "• Bianca — a courtesan in Cyprus who loves Cassio; used by Iago in his plot.\n"
            "\n"
            "Key symbol: The handkerchief — Othello's first gift to Desdemona; Iago plants it with Cassio as fabricated 'proof' of adultery.\n"
            "\n"
            "Themes: Jealousy, race and racism, betrayal, manipulation, appearance vs reality, honour and reputation, love, gender, power."
        ),
        "keywords": [
            "othello", "iago", "desdemona", "cassio", "emilia", "roderigo",
            "brabantio", "bianca", "handkerchief", "moor", "venetian",
            "shakespeare", "shakespheare", "othello's",
        ],
    },

    # ── LITERATURE-IN-ENGLISH: PROSE ─────────────────────────────────────────

    "faceless": {
        "title": "Faceless",
        "author": "Amma Darko",
        "years": "Perennial JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Faceless\" by Amma Darko (Ghanaian) — perennial JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Set in Sodom and Gomorra — a real slum in Accra, Ghana — Fofo is a 14-year-old street girl living in desperate poverty. Her older sister Baby T has died under disturbing circumstances involving abuse and prostitution at the hands of their neighbour Onko. Fofo, essentially invisible ('faceless') to society, sets out to find justice. Kabria — a middle-class woman at an NGO called MUTE — investigates the case and brings attention to the plight of street children.\n"
            "\n"
            "Key Characters:\n"
            "• Fofo — protagonist; a 14-year-old street girl; brave and determined to find justice for Baby T.\n"
            "• Baby T — Fofo's older sister; died as a result of abuse and child prostitution; her death drives the entire plot.\n"
            "• Maa Tsuru — Fofo and Baby T's negligent mother; represents systemic failure of parenting in poverty.\n"
            "• Onko — the neighbour who abused Baby T; represents predatory exploitation of street children.\n"
            "• Kabria — a middle-class woman at MUTE NGO; investigates Baby T's death; bridges the gap between the slum and society.\n"
            "• Dina — Kabria's colleague at MUTE who assists in the investigation.\n"
            "• Poison — a dangerous figure in the slum who controls street girls.\n"
            "• Odarley — another street girl; Fofo's peer.\n"
            "\n"
            "Setting: Sodom and Gomorra slum, Accra, Ghana.\n"
            "MUTE = the NGO working on children's rights (motto: 'Mute But Not Blind').\n"
            "\n"
            "Themes: Child abuse, girl-child rights, urban poverty, street children, justice, neglect, NGO intervention, survival, invisibility of the poor."
        ),
        "keywords": [
            "faceless", "amma darko", "fofo", "baby t", "kabria", "maa tsuru",
            "onko", "odarley", "poison", "mute", "sodom and gomorra",
            "sodom", "gomorra",
        ],
    },

    "lonely_days": {
        "title": "Lonely Days",
        "author": "Bayo Adebowale",
        "years": "JAMB Literature text (multiple years)",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Lonely Days\" by Bayo Adebowale (Nigerian) — JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Set in a traditional Yoruba village, the novel follows Yaremi — a widow whose husband Ajumobi has died. Village custom demands she remarry, specifically to one of Ajumobi's brothers. Yaremi firmly refuses, asserting her right to live independently. Her resistance challenges deep-rooted patriarchal tradition and explores what it means for a woman to define her own identity.\n"
            "\n"
            "Key Characters:\n"
            "• Yaremi — the protagonist; a strong-willed widow who defies cultural pressure to remarry; defines her identity on her own terms.\n"
            "• Ajumobi — Yaremi's deceased husband; remembered lovingly; his memory sustains her independence.\n"
            "• Segi — Yaremi's granddaughter; represents the next generation and the future.\n"
            "• Depo — one of the village men pressuring Yaremi to remarry.\n"
            "• Femi — another village character involved in the social pressure on Yaremi.\n"
            "\n"
            "Narrative technique: Third-person limited perspective, close to Yaremi's inner experience.\n"
            "\n"
            "Themes: Widowhood, gender oppression, cultural tradition vs personal freedom, resilience, women's rights, identity, community pressure, love and memory."
        ),
        "keywords": [
            "lonely days", "yaremi", "ajumobi", "bayo adebowale", "adebowale",
            "segi", "depo",
        ],
    },

    "native_son": {
        "title": "Native Son",
        "author": "Richard Wright",
        "years": "Perennial JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Native Son\" by Richard Wright (American) — perennial JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Set in Chicago in the 1930s, Bigger Thomas is a young Black man trapped by poverty and racial segregation on the city's South Side. He gets a job as a chauffeur for the wealthy Dalton family. He accidentally smothers Mary Dalton (the daughter) while trying to prevent her being discovered drunk by her blind mother, then burns the body to hide the crime. The novel follows his capture, trial, and execution — and argues that racist society shaped his fate long before any crime was committed.\n"
            "\n"
            "Key Characters:\n"
            "• Bigger Thomas — the protagonist; a young Black man shaped entirely by racism and poverty; both perpetrator and victim.\n"
            "• Mary Dalton — the white daughter of Bigger's employer; accidentally killed by Bigger.\n"
            "• Jan Erlone — Mary's communist boyfriend; later tries to help Bigger during the trial.\n"
            "• Bessie Mears — Bigger's girlfriend; he kills her to prevent her from testifying.\n"
            "• Mr Dalton — Bigger's wealthy employer; hypocritically donates to Black causes while maintaining segregated housing.\n"
            "• Mrs Dalton — Mr Dalton's blind wife; her blindness symbolises society's inability to see Bigger as a full human being.\n"
            "• Boris Max — Bigger's communist defence lawyer; argues at trial that society created Bigger.\n"
            "• Buckley — the racist state attorney who prosecutes Bigger.\n"
            "\n"
            "Narrative technique: Third-person limited (tightly focused on Bigger's consciousness).\n"
            "\n"
            "Themes: Race and racism, systemic oppression, fear, identity, violence, poverty, justice, determinism, the American Dream's exclusion of Black Americans."
        ),
        "keywords": [
            "native son", "bigger thomas", "bigger", "richard wright",
            "mary dalton", "jan erlone", "bessie mears", "mr dalton",
            "mrs dalton", "boris max", "buckley", "dalton",
        ],
    },

    "second_class_citizen": {
        "title": "Second Class Citizen",
        "author": "Buchi Emecheta",
        "years": "JAMB Literature text (multiple years)",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Second Class Citizen\" by Buchi Emecheta (Nigerian) — JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Adah grows up in Lagos, fiercely ambitious for education despite her family's neglect of her as a girl. She moves to 1960s London with her husband Francis, hoping for a better life. Instead she faces racism in Britain, Francis's domineering control, forced repeated pregnancies, and the destruction of her novel manuscript — burned by Francis out of spite. She eventually breaks free and begins an independent life as a writer.\n"
            "\n"
            "Key Characters:\n"
            "• Adah — the protagonist; a determined, educated Nigerian woman fighting for independence in London.\n"
            "• Francis — Adah's husband; lazy, controlling, burns her manuscript; resentful of her ambitions.\n"
            "• Pa Noble — a Nigerian man in London; represents an older generation of Nigerian migrants.\n"
            "• Ma Noble — Pa Noble's wife.\n"
            "• Trudy — a white English neighbour who befriends Adah; offers some kindness.\n"
            "• Bill — Trudy's husband.\n"
            "\n"
            "The setting spans Lagos (Nigeria) and London (England), 1960s.\n"
            "\n"
            "Themes: Gender oppression, racism, migration, independence, education, colonial aspirations, resilience, domestic abuse, motherhood, the immigrant experience."
        ),
        "keywords": [
            "second class citizen", "adah", "francis", "buchi emecheta",
            "emecheta", "pa noble", "ma noble", "trudy",
        ],
    },

    "unexpected_joy": {
        "title": "Unexpected Joy at Dawn",
        "author": "Alex Agyei-Agyiri",
        "years": "JAMB Literature text (multiple years)",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Unexpected Joy at Dawn\" by Alex Agyei-Agyiri (Ghanaian) — JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Set in 1969 during Ghana's Alien Compliance Order — which required all undocumented non-Ghanaian residents to leave the country — the novel follows Nii and his community of Nigerians living in Ghana who face forced expulsion. Though rooted in Ghana, they must confront the crisis of displacement, belonging, and national identity. The title reflects the unexpected hope that emerges from the hardship of exile.\n"
            "\n"
            "Key Characters:\n"
            "• Nii — the protagonist; a man of Nigerian origin living in Ghana who faces expulsion under the Order.\n"
            "• Mama Orojo — a maternal figure representing the Nigerian community affected by the Order.\n"
            "• Joel — another key character in the displaced community.\n"
            "• Naa Okaley — a Ghanaian character representing the host community's response.\n"
            "• Laale — another community member.\n"
            "• Father Bernard — a religious figure offering moral guidance during the crisis.\n"
            "\n"
            "Historical context: In 1969, the Ghanaian government issued the Alien Compliance Order, forcing out hundreds of thousands of non-Ghanaians, predominantly Nigerians.\n"
            "\n"
            "Themes: Migration, xenophobia, belonging and displacement, national identity, hope, community, human rights, politics of citizenship."
        ),
        "keywords": [
            "unexpected joy at dawn", "nii tackie", "nii", "alex agyei-agyiri",
            "agyei-agyiri", "mama orojo", "joel", "naa okaley", "laale",
            "father bernard", "alien compliance", "aliens compliance",
        ],
    },

    "invisible_man": {
        "title": "Invisible Man",
        "author": "Ralph Ellison",
        "years": "JAMB Literature text (multiple years)",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Invisible Man\" by Ralph Ellison (American) — JAMB Literature-in-English text.\n"
            "\n"
            "Summary: An unnamed Black narrator recounts his life from a Southern college — where he is expelled after an incident involving a white trustee — to Harlem, New York, where he joins a political organisation called the Brotherhood. Throughout, society refuses to truly see him as a full human being: he is socially 'invisible.' The novel blends realism with surreal, symbolic imagery to explore Black identity in America.\n"
            "\n"
            "Key Characters:\n"
            "• The Narrator (unnamed) — a young Black man seeking identity and recognition in a society that renders him invisible.\n"
            "• Dr Bledsoe — the Black president of the narrator's Southern college; pragmatically accommodates white power to maintain his own position.\n"
            "• Brother Jack — leader of the Brotherhood (a political/communist-style organisation); uses the narrator for political ends.\n"
            "• Tod Clifton — a fellow Brotherhood member who drops out in disillusionment; his death is a turning point.\n"
            "• Ras the Exhorter / Ras the Destroyer — a Black nationalist who opposes the Brotherhood; represents militant separatism.\n"
            "• Mary Rambo — a kind Harlem woman who shelters the narrator.\n"
            "\n"
            "Themes: Race, identity, social invisibility, power, self-discovery, political manipulation, the American Dream, the Black experience in America."
        ),
        "keywords": [
            "invisible man", "ralph ellison", "ellison", "bledsoe", "brother jack",
            "tod clifton", "ras the exhorter", "ras the destroyer", "mary rambo",
            "brotherhood",
        ],
    },

    "wuthering_heights": {
        "title": "Wuthering Heights",
        "author": "Emily Brontë",
        "years": "JAMB Literature text (multiple years)",
        "subject": "Literature in English",
        "passage": (
            "Novel: \"Wuthering Heights\" by Emily Brontë (British) — JAMB Literature-in-English text.\n"
            "\n"
            "Summary: Set on the Yorkshire Moors, the novel follows the destructive love between Heathcliff — a foundling of unknown origin brought home by Mr Earnshaw — and Catherine Earnshaw. When Catherine chooses to marry the genteel Edgar Linton instead of Heathcliff, Heathcliff devotes decades to systematic revenge against both families, creating suffering that spans two generations. The story is narrated retrospectively by the housekeeper Nelly Dean to a tenant called Lockwood.\n"
            "\n"
            "Key Characters:\n"
            "• Heathcliff — the brooding anti-hero; an orphan of mysterious origin; his great love for Catherine curdles into obsessive, all-consuming revenge.\n"
            "• Catherine Earnshaw (Cathy) — Heathcliff's great love; chooses social class and security over true love by marrying Edgar; dies young.\n"
            "• Edgar Linton — Catherine's husband; gentle, civilised, represents social convention and respectability.\n"
            "• Isabella Linton — Edgar's sister; naively falls in love with Heathcliff and suffers terribly as his wife.\n"
            "• Hindley Earnshaw — Catherine's brother; torments and degrades Heathcliff in childhood, planting the seeds of revenge.\n"
            "• Nelly Dean — the housekeeper; the primary narrator; witness to all events across both generations.\n"
            "• Lockwood — the frame narrator; a tenant who records Nelly's account.\n"
            "• Young Cathy — Catherine's daughter by Edgar; central to the second-generation plot.\n"
            "• Linton Heathcliff — Heathcliff's sickly son by Isabella; exploited by Heathcliff in his revenge scheme.\n"
            "\n"
            "Themes: Obsessive love, class and social mobility, revenge, nature vs civilisation, generational trauma, the supernatural, isolation, cruelty."
        ),
        "keywords": [
            "wuthering heights", "heathcliff", "catherine earnshaw", "edgar linton",
            "isabella linton", "hindley", "nelly dean", "lockwood",
            "emily brontë", "emily bronte", "brontë", "bronte",
            "linton heathcliff",
        ],
    },

    # ── POETRY (context injected when poem title or poet is mentioned) ─────────

    "vanity_diop": {
        "title": "Vanity",
        "author": "Birago Diop",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"Vanity\" by Birago Diop (Senegalese) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "A meditation on death and the ultimate futility of earthly pride and possessions. The poem draws on African philosophical traditions, seeing the dead not as gone but as ever-present — watching the living and reminding them of mortality. The central message: all earthly wealth, power, and beauty are 'vanity' — they pass away.\n"
            "\n"
            "Themes: Mortality, humility, African philosophy of life and death, the futility of material pride, ancestor-consciousness."
        ),
        "keywords": ["birago diop", "diop's vanity", "vanity by diop"],
    },

    "ambush_adeoti": {
        "title": "Ambush",
        "author": "Gbemisola Adeoti",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"Ambush\" by Gbemisola Adeoti (Nigerian) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "The poem uses the image of a chameleon — patient, still, hidden, then suddenly striking — as a metaphor for corruption or a predatory political system lying in wait. The danger is silent and unseen until it strikes; no one in society is truly safe from it.\n"
            "\n"
            "Themes: Corruption, hidden danger, political predation, patience of evil, social critique."
        ),
        "keywords": ["gbemisola adeoti", "adeoti", "ambush"],
    },

    "piano_and_drums": {
        "title": "Piano and Drums",
        "author": "Gabriel Okara",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"Piano and Drums\" by Gabriel Okara (Nigerian) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "The poem contrasts two symbols: the drums (African tradition, nature, the village, ancestral rhythms) and the piano (Western modernity, European education, formal civilisation). The speaker is torn between the two worlds, unable to fully belong to either. It captures the dilemma of the educated African caught between tradition and modernity.\n"
            "\n"
            "Themes: Cultural conflict, African identity, colonialism, tradition vs modernity, duality, the dilemma of the educated African."
        ),
        "keywords": ["gabriel okara", "okara", "piano and drums"],
    },

    "dining_table": {
        "title": "The Dining Table",
        "author": "Gbanabam Hallowell",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Dining Table\" by Gbanabam Hallowell (Sierra Leonean) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "The dining table is used as a symbol of family unity, shared culture, and belonging. The poem meditates on what is lost when family members scatter — death, migration, modern life — and what the gathering around the table once meant. It captures African communal life and the grief of its passing.\n"
            "\n"
            "Themes: Family, belonging, loss, African communal life, unity, memory."
        ),
        "keywords": ["gbanabam hallowell", "hallowell", "dining table"],
    },

    "panic_of_growing_older": {
        "title": "The Panic of Growing Older",
        "author": "Lenrie Peters",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Panic of Growing Older\" by Lenrie Peters (Gambian) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "A personal meditation on ageing, the relentless passage of time, and the existential fear of growing old and closer to death. The speaker reflects with a mix of anxiety and resignation on the changes that age brings.\n"
            "\n"
            "Themes: Ageing, time, existential fear, mortality, identity, introspection."
        ),
        "keywords": ["lenrie peters", "lenrie peter", "panic of growing older"],
    },

    "anvil_and_hammer": {
        "title": "The Anvil and the Hammer",
        "author": "Kofi Awoonor",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Anvil and the Hammer\" by Kofi Awoonor (Ghanaian) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "The anvil represents Africa's traditional identity and cultural heritage; the hammer represents the colonial and external forces that have beaten and shaped it. The poem explores how African identity has been formed, deformed, and transformed under the pressure of colonialism — yet ultimately shows resilience and the possibility of a new identity forged from both.\n"
            "\n"
            "Themes: African identity, colonialism, cultural resilience, transformation, tradition and change."
        ),
        "keywords": ["kofi awoonor", "awoonor", "anvil and the hammer", "anvil and hammer"],
    },

    "crossing_the_bar": {
        "title": "Crossing the Bar",
        "author": "Alfred Lord Tennyson",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"Crossing the Bar\" by Alfred Lord Tennyson (British) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "The poem uses the extended metaphor of a ship crossing the sandbar at the mouth of a harbour (moving from the sheltered waters of life into the open sea of death/eternity) to describe death as a calm, peaceful crossing. The 'bar' is the sandbar. The speaker asks that there be no mourning when he crosses, expressing faith that he will meet his 'Pilot' (God/the divine) face to face.\n"
            "\n"
            "Themes: Death, faith, peace, acceptance, hope for eternity, calm resignation."
        ),
        "keywords": ["crossing the bar", "tennyson"],
    },

    "the_pulley": {
        "title": "The Pulley",
        "author": "George Herbert",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Pulley\" by George Herbert (British) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "God bestows on humans all His blessings — strength, beauty, wisdom, honour, pleasure — but deliberately withholds Rest. Without Rest, humans will always be restless, and that restlessness (like a pulley) will eventually draw them back to God. The central conceit: God uses human restlessness as a spiritual mechanism to keep humanity tethered to the divine.\n"
            "\n"
            "Themes: Religion, human restlessness, God's design, the relationship between humans and the divine, spiritual longing."
        ),
        "keywords": ["the pulley", "george herbert", "herbert"],
    },

    "school_boy": {
        "title": "The School Boy",
        "author": "William Blake",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The School Boy\" by William Blake (British) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "A boy laments being forced to go to school on a beautiful summer morning when he would rather be free in nature. He argues that forcing children to learn in dreary classrooms destroys their natural joy, just as a bird cannot sing sweetly in a cage. Blake criticises the educational system of his time as oppressive and deadening.\n"
            "\n"
            "Themes: Childhood freedom, oppressive education, nature, joy, the destruction of innocence by institutions."
        ),
        "keywords": ["the school boy", "school boy", "william blake", "blake"],
    },

    "proud_king": {
        "title": "The Proud King",
        "author": "William Morris",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Proud King\" by William Morris (British) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "A narrative poem about a proud, arrogant king who is humbled by divine power. The king's pride and overconfidence in his earthly authority is met with a divine lesson in humility. The poem reflects on the limits of human power, the dangers of arrogance, and the justice of God/fate.\n"
            "\n"
            "Themes: Pride, humility, power, divine justice, the limits of earthly authority."
        ),
        "keywords": ["the proud king", "proud king", "william morris", "morris"],
    },

    "good_morrow": {
        "title": "The Good Morrow",
        "author": "John Donne",
        "years": "Recurring JAMB Literature text",
        "subject": "Literature in English",
        "passage": (
            "Poem: \"The Good Morrow\" by John Donne (British, Metaphysical) — recurring JAMB Literature-in-English poetry text.\n"
            "\n"
            "A love poem celebrating the awakening of true love. Before this love, the speaker and his beloved were merely sleeping — their lives before were like childish dreams or fancies. Now, in their love, they have truly awakened to the world. Their love creates its own complete world; they no longer need to explore elsewhere.\n"
            "\n"
            "Themes: Love, spiritual awakening, the completeness of love, unity of souls, the Metaphysical conceit."
        ),
        "keywords": ["the good morrow", "good morrow", "john donne", "donne"],
    },

}


# ─────────────────────────────────────────────────────────────────────────────
# 2.  DETECTION ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def _text_for_question(q: dict) -> str:
    """Return searchable text: question + all options combined, lower-cased."""
    parts = [q.get("question", "")]
    opts = q.get("options", {})
    if isinstance(opts, dict):
        parts.extend(opts.values())
    elif isinstance(opts, list):
        for o in opts:
            if isinstance(o, dict):
                parts.append(o.get("text", ""))
            else:
                parts.append(str(o))
    return " ".join(str(p) for p in parts).lower()


def _question_text_only(q: dict) -> str:
    """Return only the question text (not options), lower-cased."""
    return q.get("question", "").lower()


def _kw_match(keyword: str, text: str) -> bool:
    """
    Word-boundary aware keyword match.
    Multi-word phrases use simple substring; single words use \\b boundaries
    so 'akin' doesn't match inside 'merrymaking'.
    """
    kw = keyword.lower()
    if " " in kw:
        return kw in text
    return bool(re.search(r'\b' + re.escape(kw) + r'\b', text))


def detect_context(q: dict, year: int, subject: str) -> Optional[str]:
    """
    Return the passage string to attach, or None if no match.

    Priority:
      1. Explicit title mention in question text (e.g. "based on Othello")
      2. Distinctive keyword / character name in question+options (word-boundary safe)
      3. English Language year-range: year maps to a novel AND keyword appears
         in the question text (NOT just options, to avoid grammar-sample names)
    """
    full_text = _text_for_question(q)       # question + options
    q_text    = _question_text_only(q)      # question only

    # ── Priority 1: explicit title or author mention ─────────────────────────
    for key, ctx in CONTEXTS.items():
        title_lc  = ctx["title"].lower()
        author_lc = ctx["author"].lower()
        if title_lc in full_text or author_lc in full_text:
            return ctx["passage"]

    # ── Priority 2: character / keyword match (word-boundary safe) ───────────
    for key, ctx in CONTEXTS.items():
        for kw in ctx["keywords"]:
            if _kw_match(kw, full_text):
                return ctx["passage"]

    # ── Priority 3: English Language year-range + keyword in question text ───
    # Only triggers if the keyword appears in the QUESTION SENTENCE itself
    # (not just in options), so sample names like "Akin" in vocab sentences
    # are ignored when the question sentence doesn't reference the novel.
    if "english" in subject.lower() and not "literature" in subject.lower():
        for key, ctx in CONTEXTS.items():
            yr_range = ctx.get("eng_year_range")
            if yr_range and year in yr_range:
                for kw in ctx["keywords"]:
                    # Only fire on keywords ≥ 4 chars appearing in question text
                    if len(kw) >= 4 and _kw_match(kw, q_text):
                        return ctx["passage"]
                # Also check options — but only for character names that appear
                # as standalone words (likely to be the actual character)
                opts_text = " ".join(
                    v for v in (q.get("options", {}) or {}).values()
                ).lower()
                for kw in ctx["keywords"]:
                    if len(kw) >= 4 and _kw_match(kw, opts_text):
                        return ctx["passage"]

    return None


# ─────────────────────────────────────────────────────────────────────────────
# 3.  MAIN RUNNER
# ─────────────────────────────────────────────────────────────────────────────

def run(apply: bool = False):
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    if not jamb_root.exists():
        print(f"ERROR: 'JAMB copy' directory not found at {jamb_root}")
        sys.exit(1)

    subjects_to_scan = ["English", "Literature in English"]
    # map folder name → DB subject name
    subject_map = {
        "English": "English Language",
        "Literature in English": "Literature in English",
    }

    # Collect all updates: { question_id: (passage_text, subject, year) }
    updates: dict = {}
    skipped = 0
    already_has_passage = 0

    for folder in subjects_to_scan:
        subject_dir = jamb_root / folder
        if not subject_dir.exists():
            continue
        db_subject = subject_map[folder]

        for year_dir in sorted(subject_dir.iterdir()):
            if not year_dir.is_dir():
                continue
            try:
                year_int = int(year_dir.name)
            except ValueError:
                continue

            qfile = year_dir / "questions.json"
            if not qfile.exists():
                continue

            try:
                questions = json.load(open(qfile, encoding="utf-8"))
            except Exception as e:
                print(f"  [SKIP] {qfile}: {e}")
                continue

            for q in questions:
                qid = q.get("id")
                if not qid:
                    continue

                # Skip questions that already have a non-empty passage from source
                existing = (q.get("passage") or "").strip()
                if existing:
                    already_has_passage += 1
                    continue

                ctx = detect_context(q, year_int, db_subject)
                if ctx:
                    updates[qid] = (ctx, db_subject, year_int)
                else:
                    skipped += 1

    print(f"\n{'DRY RUN — ' if not apply else ''}Summary:")
    print(f"  Questions to update   : {len(updates)}")
    print(f"  Already had passage   : {already_has_passage}")
    print(f"  No context found      : {skipped}")

    if not updates:
        print("Nothing to do.")
        return

    # Print a sample of what will be written
    print("\nSample updates:")
    for qid, (passage, subj, yr) in list(updates.items())[:5]:
        print(f"  [{subj} {yr}] {qid}")
        preview = passage[:80].replace("\n", " ")
        print(f"    => {preview}...")

    if not apply:
        print("\nRe-run with --apply to write to the database.")
        return

    # ── Write to database ────────────────────────────────────────────────────
    print(f"\nConnecting to database...")
    conn = psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)
    cur = conn.cursor()

    # First ensure columns exist
    cur.execute("""
        ALTER TABLE questions
        ADD COLUMN IF NOT EXISTS passage   TEXT,
        ADD COLUMN IF NOT EXISTS table_html TEXT
    """)
    conn.commit()
    print("  Columns ensured.")

    updated_count = 0
    not_found = 0
    batch = []
    for qid, (passage, subj, yr) in updates.items():
        batch.append((passage, qid))
        if len(batch) >= 500:
            cur.executemany(
                "UPDATE questions SET passage = %s WHERE id = %s AND (passage IS NULL OR passage = '')",
                batch
            )
            updated_count += cur.rowcount
            conn.commit()
            batch = []

    if batch:
        cur.executemany(
            "UPDATE questions SET passage = %s WHERE id = %s AND (passage IS NULL OR passage = '')",
            batch
        )
        updated_count += cur.rowcount
        conn.commit()

    cur.close()
    conn.close()

    print(f"\nDone!")
    print(f"  Rows updated in DB    : {updated_count}")
    print(f"  Questions not in DB   : {len(updates) - updated_count}")


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    run(apply=apply)
