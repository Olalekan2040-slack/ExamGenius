"""Write the new english-content.js file with practical, exam-focused explanations."""
import pathlib

JS = r"""/**
 * English Language Learning Content
 * JAMB-aligned guided learning for all 5 English topics.
 * Each objective has `question: true` — the Practice button fetches
 * real JAMB past questions from the DB via /questions/by-subtopic.
 */

const ENGLISH_LEARNING_CONTENT = {

    // ================================================================
    // TOPIC 1: COMPREHENSION & SUMMARY
    // ================================================================
    "Comprehension & Summary": {
        subject: "English",
        topic: "Comprehension & Summary",
        introduction: {
            title: "Comprehension & Summary",
            description: "Comprehension is Section A of your JAMB English paper. You read a passage and answer questions about it — what it says, what it implies, and what certain words mean in context. You also fill in a cloze passage where words have been removed. Think of it as detective reading: use only clues inside the passage.",
            jambInfo: "JAMB typically gives one or two passages with 10–15 questions total. Read the passage once for the big picture before looking at the questions — this saves time and prevents confusion."
        },
        subtopics: [
            {
                name: "Reading comprehension",
                objectives: [
                    {
                        title: "Find the main idea of a passage",
                        explanation: `<p>Every passage makes one central point — that is the <strong>main idea</strong>. Everything else (examples, statistics, descriptions) is there to support or prove it. JAMB often asks: <em>"The passage is mainly about…"</em> or <em>"The best title for the passage is…"</em></p>

<div class="example-box">
    <h4>Read this passage — then find its main idea:</h4>
    <p style="font-style:italic; background:#f9f9f9; padding:12px; border-left:3px solid #aaa; border-radius:4px;">
        "Every year in Nigeria, millions of students sit for public examinations, yet study habits remain poor. Many candidates spend more time discussing exam tips than actually reading their textbooks. Teachers complain that students want shortcuts — model answers, predicted topics, and expo. Meanwhile, real understanding requires consistent daily effort, not last-minute cramming. Students who perform best are those who built steady reading habits long before the examination season began."
    </p>
    <p><strong>Main idea:</strong> Good examination results come from consistent study habits, not last-minute shortcuts.</p>
    <p><strong>Supporting details:</strong> millions sitting exams without proper study; tips-hunting instead of reading; teachers' complaints; cramming vs. sustained effort.</p>
</div>

<div class="key-points">
    <h4>How to Find the Main Idea in Any JAMB Passage:</h4>
    <ul>
        <li><strong>Step 1 — Read the first and last sentence of each paragraph.</strong> The main idea is often stated there.</li>
        <li><strong>Step 2 — Ask:</strong> "What is the whole passage arguing or describing?" Your answer is the main idea.</li>
        <li><strong>Step 3 — Test it:</strong> Does every paragraph connect to that point? If yes, you found it.</li>
        <li><strong>Step 4 — Eliminate narrow options.</strong> "Students discuss exam tips" is a detail, not the main idea.</li>
    </ul>
</div>

<div class="warning-box">
    <h4>The Most Common JAMB Trap:</h4>
    <p>Wrong options are usually true statements from the passage but they cover only one detail. The correct answer always covers the <em>entire</em> passage — not just one paragraph or one example.</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Answer inference questions from a passage",
                        explanation: `<p>An <strong>inference question</strong> asks about something the passage strongly suggests but never directly says. JAMB uses phrases like: <em>"It can be inferred that…"</em> or <em>"From the passage, which of the following can be deduced?"</em></p>

<div class="example-box">
    <h4>Read this passage, then answer the inference question below it:</h4>
    <p style="font-style:italic; background:#f9f9f9; padding:12px; border-left:3px solid #aaa; border-radius:4px;">
        "When the principal announced the examination results, Chinyere stepped out of the hall quietly, staring at the floor. Her friends were celebrating loudly behind her. She sat down under the mango tree alone and did not join them for lunch."
    </p>
    <p><strong>Question:</strong> From the passage, which of the following can be inferred about Chinyere?</p>
    <p>A. She was delighted with her results.</p>
    <p>B. She was disappointed with her results.</p>
    <p>C. She was indifferent to the announcement.</p>
    <p>D. She preferred to eat alone.</p>
    <p><strong>Answer: B.</strong> The passage never uses the word "disappointed" but every clue points to it — she walked out quietly, stared at the floor, sat alone, and did not celebrate with friends.</p>
</div>

<div class="key-points">
    <h4>How to Answer Inference Questions:</h4>
    <ul>
        <li><strong>Only use the passage.</strong> Never bring in outside knowledge — even if it is true in real life.</li>
        <li><strong>Look for evidence.</strong> The correct inference is directly supported by at least one sentence in the passage.</li>
        <li><strong>Eliminate extremes.</strong> Options using "always", "never", "all" are almost always wrong.</li>
        <li><strong>Pick what the passage supports most strongly</strong> — not what is merely possible.</li>
    </ul>
</div>

<div class="warning-box">
    <h4>The "Outside Knowledge" Trap:</h4>
    <p>JAMB sometimes offers an option that is true in real life but not supported by the passage. That option is always wrong. Your answer must come from inside the passage only.</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Work out what a word means from its context in the passage",
                        explanation: `<p>JAMB questions on vocabulary-in-context look like this: <em>"As used in the passage, the word <u>audacious</u> most nearly means…"</em> The correct answer fits the <strong>tone and meaning of the passage</strong> — not just any definition of the word.</p>

<div class="example-box">
    <h4>Worked Example:</h4>
    <p style="font-style:italic; background:#f9f9f9; padding:12px; border-left:3px solid #aaa; border-radius:4px;">
        "The community health worker moved <u>meticulously</u> through each home, checking water storage, food handling, and sanitation before writing her report."
    </p>
    <p><strong>Question:</strong> As used in the passage, "meticulously" most nearly means:</p>
    <p>A. carelessly &ensp; B. quickly &ensp; C. with great care and detail &ensp; D. with great speed</p>
    <p><strong>Answer: C.</strong> The passage tells us she checked water, food, and sanitation before writing her report — she was thorough and detailed. "Meticulously" = with very careful attention to detail. Nothing in the passage suggests she was quick or careless.</p>
</div>

<div class="key-points">
    <h4>3-Step Method:</h4>
    <ul>
        <li><strong>Step 1:</strong> Cover the options. Read the full sentence. What do you think the word means here?</li>
        <li><strong>Step 2:</strong> Eliminate options that clearly do not fit the tone — a positive word in a negative context is wrong.</li>
        <li><strong>Step 3:</strong> Substitute the remaining options into the sentence — which one sounds most natural?</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Multiple-Meaning Trap:</h4>
    <p>A word like "cool" can mean cold, calm, or admirable. The passage tells you which meaning is intended. Trust the context over any other definition you know.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Cloze passage",
                objectives: [
                    {
                        title: "Choose the right word for each blank in a cloze passage",
                        explanation: `<p>A <strong>cloze passage</strong> is a paragraph where several words have been removed and numbered as blanks — (1), (2), (3) etc. JAMB gives four options for each blank. You must choose the word that fits both <em>grammatically</em> and <em>logically</em> in the passage.</p>

<div class="example-box">
    <h4>Sample Cloze Passage — Work Through It:</h4>
    <p style="font-style:italic; background:#f9f9f9; padding:12px; border-left:3px solid #aaa; border-radius:4px;">
        "Learning a skill <span style="color:#c0392b; font-weight:bold;">(1)___</span> time and patience. You cannot become an expert overnight. Most people give up too quickly <span style="color:#c0392b; font-weight:bold;">(2)___</span> they do not see results immediately. However, those who persist <span style="color:#c0392b; font-weight:bold;">(3)___</span> that steady effort always produces results in the end."
    </p>
    <p><strong>(1)</strong> Options: A. takes &ensp; B. take &ensp; C. is taking &ensp; D. took<br>
    → "Learning a skill" is a gerund phrase — singular subject → singular present tense → <strong>takes</strong> (A)</p>
    <p><strong>(2)</strong> Options: A. since &ensp; B. so &ensp; C. because &ensp; D. although<br>
    → Why do they give up? Because they see no results → reason connector → <strong>because</strong> (C)</p>
    <p><strong>(3)</strong> Options: A. discover &ensp; B. discovered &ensp; C. are discovering &ensp; D. had discovered<br>
    → General truth about people who persist → simple present → <strong>discover</strong> (A)</p>
</div>

<div class="key-points">
    <h4>5 Steps for Every Cloze Passage:</h4>
    <ul>
        <li><strong>Step 1 — Read the full passage first</strong> without stopping at blanks. Get the overall meaning.</li>
        <li><strong>Step 2 — Check part of speech:</strong> Is each blank a verb? Conjunction? Preposition? Adjective?</li>
        <li><strong>Step 3 — Check tense:</strong> Does the verb match the tense used in the rest of the paragraph?</li>
        <li><strong>Step 4 — Check agreement:</strong> Does the verb form agree with the subject?</li>
        <li><strong>Step 5 — Check logic:</strong> For conjunctions — does the logical relationship (cause, contrast, result) match?</li>
    </ul>
</div>

<div class="warning-box">
    <h4>The Most Common Cloze Errors:</h4>
    <p>Choosing "although" when the logic needs "because" (connectors). Choosing wrong tense ("took" when a general present truth is needed). Always ask: does this word fit both the logic AND the grammar of the sentence?</p>
</div>`,
                        question: true
                    }
                ]
            }
        ]
    },

    // ================================================================
    // TOPIC 2: VOCABULARY
    // ================================================================
    "Vocabulary": {
        subject: "English",
        topic: "Vocabulary",
        introduction: {
            title: "Vocabulary",
            description: "Vocabulary questions in JAMB test your knowledge of word meanings — specifically synonyms (words that mean the same), antonyms (words that mean the opposite), and idioms (fixed expressions with non-literal meanings). These appear in Section B (Lexis and Structure) and carry consistent marks every year.",
            jambInfo: "JAMB tests about 5 synonym questions and 5 antonym questions per paper. Idioms appear in sentence completion and passage questions. A strong vocabulary directly boosts your score across every section."
        },
        subtopics: [
            {
                name: "Synonyms",
                objectives: [
                    {
                        title: "Choose the correct synonym for an underlined word",
                        explanation: `<p>Synonym questions in JAMB look like this: <em>"Choose the option that is <u>nearest in meaning</u> to the underlined word."</em> The word always appears in a sentence — read the full sentence before you choose, because the same word can have different meanings in different contexts.</p>

<div class="example-box">
    <h4>How JAMB Synonym Questions Work:</h4>
    <p><em>"The professor's <u>verbose</u> lecture left the students yawning."</em></p>
    <p>A. brief &ensp; B. technical &ensp; C. long-winded &ensp; D. passionate</p>
    <p><strong>Answer: C (long-winded)</strong></p>
    <p>"Verbose" means using far more words than necessary. The context gives it away — students were yawning, which means the lecture was excessively long. "Long-winded" is the closest synonym here. "Brief" is an antonym. "Technical" and "passionate" are unrelated to the meaning.</p>
</div>

<div class="key-points">
    <h4>High-Frequency JAMB Synonym Pairs — Memorise These:</h4>
    <ul>
        <li><strong>garrulous</strong> → talkative, loquacious, verbose</li>
        <li><strong>austere</strong> → stern, strict, harsh, severe</li>
        <li><strong>benevolent</strong> → generous, kind, charitable, magnanimous</li>
        <li><strong>clandestine</strong> → secret, covert, hidden, underhand</li>
        <li><strong>elated</strong> → overjoyed, thrilled, ecstatic, jubilant</li>
        <li><strong>erratic</strong> → unpredictable, irregular, inconsistent, capricious</li>
        <li><strong>fastidious</strong> → fussy, meticulous, particular, exacting</li>
        <li><strong>ignominious</strong> → shameful, disgraceful, humiliating</li>
        <li><strong>intrepid</strong> → fearless, brave, daring, bold, courageous</li>
        <li><strong>nonchalant</strong> → indifferent, casual, unconcerned, detached</li>
        <li><strong>ostentatious</strong> → showy, flashy, pretentious, flamboyant</li>
        <li><strong>pragmatic</strong> → practical, sensible, realistic, down-to-earth</li>
        <li><strong>prolific</strong> → productive, fertile, productive, abundant</li>
        <li><strong>reticent</strong> → reserved, quiet, silent, withdrawn</li>
        <li><strong>turbulent</strong> → stormy, chaotic, violent, rough, tempestuous</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Context Always Wins:</h4>
    <p>Some words have multiple meanings. "Cool" can mean cold, calm, or stylish. "Engage" can mean hire, fight, or attract. Always pick the synonym that fits the tone and context of the actual sentence, not just any meaning of the word.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Antonyms",
                objectives: [
                    {
                        title: "Choose the correct antonym for an underlined word",
                        explanation: `<p>Antonym questions ask: <em>"Choose the option that is <u>most nearly opposite</u> in meaning."</em> You must pick the word most directly opposite — not just different or unrelated to the original word.</p>

<div class="example-box">
    <h4>How JAMB Antonym Questions Work:</h4>
    <p><em>"The minister's <u>magnanimous</u> gesture surprised everyone in the room."</em></p>
    <p>A. generous &ensp; B. petty &ensp; C. powerful &ensp; D. rude</p>
    <p><strong>Answer: B (petty)</strong></p>
    <p>"Magnanimous" means noble and generous in spirit. Its direct opposite is "petty" — small-minded and mean. "Rude" is unpleasant but not the direct opposite of magnanimous. "Generous" is actually a synonym — a classic JAMB trap. "Powerful" is unrelated.</p>
</div>

<div class="key-points">
    <h4>High-Frequency JAMB Antonym Pairs — Memorise These:</h4>
    <ul>
        <li><strong>garrulous</strong> ↔ taciturn, reticent, silent</li>
        <li><strong>austere</strong> ↔ lavish, lenient, indulgent</li>
        <li><strong>benevolent</strong> ↔ malevolent, cruel, selfish, mean</li>
        <li><strong>elated</strong> ↔ dejected, downcast, despondent, miserable</li>
        <li><strong>erratic</strong> ↔ consistent, steady, regular, predictable</li>
        <li><strong>fastidious</strong> ↔ careless, slovenly, slapdash, negligent</li>
        <li><strong>intrepid</strong> ↔ timid, cowardly, fearful, faint-hearted</li>
        <li><strong>magnanimous</strong> ↔ petty, mean, vindictive, selfish</li>
        <li><strong>nonchalant</strong> ↔ concerned, anxious, eager, attentive</li>
        <li><strong>ostentatious</strong> ↔ modest, unassuming, restrained, simple</li>
        <li><strong>prolific</strong> ↔ barren, unproductive, scarce, sterile</li>
        <li><strong>reticent</strong> ↔ outspoken, forthcoming, talkative, garrulous</li>
        <li><strong>turbulent</strong> ↔ peaceful, calm, tranquil, serene</li>
        <li><strong>verbose</strong> ↔ concise, terse, succinct, brief</li>
    </ul>
</div>

<div class="warning-box">
    <h4>The Synonym Trap (Very Common in JAMB):</h4>
    <p>JAMB often places a <em>synonym</em> of the underlined word as one of the four options — specifically to catch people who misread "opposite" as "same meaning." Always re-read the question: it says "most nearly <strong>opposite</strong>." Do not choose the option that means the same.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Idioms and expressions",
                objectives: [
                    {
                        title: "Understand the meaning of idioms used in sentences",
                        explanation: `<p>An <strong>idiom</strong> is a phrase whose meaning is completely different from the literal meaning of its individual words. <em>"She let the cat out of the bag"</em> has nothing to do with a cat — it means she accidentally revealed a secret. JAMB tests whether you know what common idioms actually mean when used in sentences.</p>

<div class="example-box">
    <h4>JAMB-Style Idiom Question:</h4>
    <p><em>"Alhaji Musa told his daughter to stop beating around the bush and just tell him what really happened."</em></p>
    <p>"Beating around the bush" means:</p>
    <p>A. walking in the forest &ensp; B. avoiding the main point &ensp; C. speaking very loudly &ensp; D. pretending to work</p>
    <p><strong>Answer: B</strong> — To "beat around the bush" means to talk around a subject without making your point directly. In the sentence, the father wants a direct answer — so his daughter was clearly being indirect. Option B fits perfectly.</p>
</div>

<div class="key-points">
    <h4>Common JAMB Idioms and Their Meanings — Learn All of These:</h4>
    <ul>
        <li><strong>beat around the bush</strong> — avoid the main subject; speak indirectly</li>
        <li><strong>bite the bullet</strong> — endure something painful or difficult with courage</li>
        <li><strong>bite off more than you can chew</strong> — take on more than you can handle</li>
        <li><strong>break the ice</strong> — do something to ease tension or start a conversation</li>
        <li><strong>burn one's bridges</strong> — permanently destroy a relationship or opportunity</li>
        <li><strong>call it a day</strong> — decide to stop working on something</li>
        <li><strong>cost an arm and a leg</strong> — be extremely expensive</li>
        <li><strong>get cold feet</strong> — become nervous and back out of something</li>
        <li><strong>hit the nail on the head</strong> — say or do exactly the right thing</li>
        <li><strong>kill two birds with one stone</strong> — achieve two goals with one action</li>
        <li><strong>let the cat out of the bag</strong> — accidentally reveal a secret</li>
        <li><strong>miss the boat</strong> — miss an opportunity</li>
        <li><strong>once in a blue moon</strong> — very rarely; almost never</li>
        <li><strong>on the fence</strong> — undecided; taking no side</li>
        <li><strong>pull someone's leg</strong> — tease or joke with someone</li>
        <li><strong>spill the beans</strong> — reveal confidential or secret information</li>
        <li><strong>the ball is in your court</strong> — it is your turn to act or decide</li>
        <li><strong>the last straw</strong> — the final event that makes a bad situation unbearable</li>
        <li><strong>under the weather</strong> — feeling slightly unwell</li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Strategy for Idioms:</h4>
    <p>Even if you have never seen an idiom before, read the sentence carefully — the context often helps you guess. The correct option will always make logical sense when placed back into the sentence. Test all four options this way.</p>
</div>`,
                        question: true
                    }
                ]
            }
        ]
    },

    // ================================================================
    // TOPIC 3: GRAMMAR & USAGE
    // ================================================================
    "Grammar & Usage": {
        subject: "English",
        topic: "Grammar & Usage",
        introduction: {
            title: "Grammar & Usage",
            description: "Grammar and Usage is the backbone of JAMB English. It covers how English sentences are correctly constructed — including prepositions, subject-verb agreement (concord), tense forms, question tags, and reported speech. These appear in Section B (Lexis and Structure) as sentence completion questions.",
            jambInfo: "Sentence completion carries 10 questions in every JAMB English paper. This is the most predictable, high-scoring section — master concord, tenses, and prepositions and you gain easy marks every year."
        },
        subtopics: [
            {
                name: "Prepositions",
                objectives: [
                    {
                        title: "Use prepositions of time (at, in, on, since, for) correctly",
                        explanation: `<p>Prepositions of time are some of the most tested items in JAMB because they are rules that many candidates either never properly learned or easily confuse. Getting these right earns you consistent marks.</p>

<div class="key-points">
    <h4>AT — IN — ON for Time (The Core Rule):</h4>
    <ul>
        <li><strong>AT</strong> → specific clock times and fixed expressions<br>
            at 8 o'clock, at noon, at midnight, at dawn, at night, at the weekend</li>
        <li><strong>IN</strong> → longer periods — months, years, centuries, seasons, parts of the day<br>
            in January, in 2020, in the 19th century, in summer, in the morning</li>
        <li><strong>ON</strong> → specific days and dates<br>
            on Monday, on Christmas Day, on 1st October, on his birthday</li>
    </ul>
    <h4>SINCE vs. FOR — Both Used with Perfect Tenses:</h4>
    <ul>
        <li><strong>SINCE</strong> → a specific starting point in the past (a moment, date, or event)<br>
            "I have lived here <em>since 2015</em>." / "She has been sick <em>since Monday</em>."</li>
        <li><strong>FOR</strong> → a duration of time (how long something has lasted)<br>
            "I have lived here <em>for ten years</em>." / "He has been waiting <em>for two hours</em>."</li>
    </ul>
</div>

<div class="example-box">
    <h4>Fill in — Test Yourself:</h4>
    <p>"The match will start ___ 4 pm ___ Sunday." → <strong>at</strong> 4 pm <strong>on</strong> Sunday</p>
    <p>"She was born ___ December ___ 1998." → <strong>in</strong> December <strong>in</strong> 1998</p>
    <p>"He has not eaten ___ yesterday morning." → <strong>since</strong> yesterday morning (specific point)</p>
    <p>"We were stuck in traffic ___ three hours." → <strong>for</strong> three hours (duration)</p>
</div>

<div class="warning-box">
    <h4>Errors JAMB Candidates Make Most:</h4>
    <p>"in Monday" → WRONG → <strong>on Monday</strong><br>
    "at January" → WRONG → <strong>in January</strong><br>
    "on 8 o'clock" → WRONG → <strong>at 8 o'clock</strong><br>
    "since two years" → WRONG → <strong>for two years</strong> (two years = duration, not a point in time)</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Use correct verb-preposition and adjective-preposition collocations",
                        explanation: `<p>Many verbs and adjectives always pair with a specific preposition. Using the wrong one is a grammar error — and JAMB tests these specifically. These fixed pairings are called <strong>collocations</strong> and must be memorised.</p>

<div class="key-points">
    <h4>Essential Verb + Preposition Pairs for JAMB:</h4>
    <ul>
        <li>accuse someone <strong>of</strong> a crime</li>
        <li>agree <strong>with</strong> a person / agree <strong>to</strong> a proposal</li>
        <li>apologise <strong>to</strong> someone <strong>for</strong> something</li>
        <li>apply <strong>for</strong> a job / apply <strong>to</strong> a school</li>
        <li>believe <strong>in</strong> something</li>
        <li>blame someone <strong>for</strong> something</li>
        <li>congratulate someone <strong>on</strong> their success</li>
        <li>consist <strong>of</strong> parts or elements</li>
        <li>depend <strong>on</strong> someone</li>
        <li>die <strong>of</strong> a disease / die <strong>from</strong> an injury</li>
        <li>graduate <strong>from</strong> a university</li>
        <li>insist <strong>on</strong> something</li>
        <li>interfere <strong>with</strong> something</li>
        <li>listen <strong>to</strong> someone</li>
        <li>rely <strong>on</strong> someone</li>
        <li>succeed <strong>in</strong> doing something</li>
    </ul>
    <h4>Essential Adjective + Preposition Pairs:</h4>
    <ul>
        <li>afraid <strong>of</strong></li>
        <li>angry <strong>with</strong> a person / angry <strong>about</strong> a situation</li>
        <li>capable <strong>of</strong></li>
        <li>familiar <strong>with</strong></li>
        <li>guilty <strong>of</strong></li>
        <li>interested <strong>in</strong></li>
        <li>proud <strong>of</strong></li>
        <li>responsible <strong>for</strong></li>
        <li>satisfied <strong>with</strong></li>
        <li>tired <strong>of</strong></li>
    </ul>
</div>

<div class="warning-box">
    <h4>The Three Most Common JAMB Preposition Errors:</h4>
    <p>"He was accused <u>for</u> stealing" → WRONG → "accused <strong>of</strong> stealing"<br>
    "She apologised <u>for</u> the teacher" → WRONG → "apologised <strong>to</strong> the teacher <strong>for</strong> being late"<br>
    "He died <u>from</u> malaria" → WRONG → "died <strong>of</strong> malaria" (diseases use <em>of</em>)</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Sentence completion",
                objectives: [
                    {
                        title: "Apply subject-verb concord (agreement) rules",
                        explanation: `<p><strong>Concord</strong> means the verb must match its subject in number — singular subject takes a singular verb, plural subject takes a plural verb. This is the most tested grammar rule in JAMB, and it has several tricky situations that cause errors.</p>

<div class="key-points">
    <h4>All the Concord Rules You Need for JAMB:</h4>
    <ul>
        <li><strong>Rule 1 — Basic:</strong> Singular subject → singular verb; plural → plural.<br>
            "The boy runs." / "The boys run."</li>
        <li><strong>Rule 2 — "And" compounds → plural verb.</strong><br>
            "Emeka and Fatima <em>are</em> here."</li>
        <li><strong>Rule 3 — "Or" / "nor" / "either…or" / "neither…nor" → agree with the nearer subject.</strong><br>
            "Neither the students nor their teacher <em>was</em> ready." (teacher = nearer, singular)<br>
            "Neither the teacher nor the students <em>were</em> ready." (students = nearer, plural)</li>
        <li><strong>Rule 4 — Collective nouns → usually singular.</strong><br>
            "The committee <em>has</em> reached a decision." / "The team <em>is</em> travelling."</li>
        <li><strong>Rule 5 — Indefinite pronouns → singular verb.</strong><br>
            each, every, everyone, nobody, someone, no one, anyone, each one → singular<br>
            "Each of the students <em>is</em> expected to attend."</li>
        <li><strong>Rule 6 — Intervening phrases do not change the subject.</strong><br>
            "The price <em>of goods</em> has risen." (subject = price, not goods)<br>
            "The group <em>of students</em> is noisy." (subject = group, not students)</li>
        <li><strong>Rule 7 — "A number of" vs "The number of".</strong><br>
            "A number of students <em>were</em> absent." (a number = several, plural meaning)<br>
            "The number of students <em>is</em> increasing." (the number = one figure, singular)</li>
        <li><strong>Rule 8 — "As well as", "together with", "in addition to" do NOT make plural.</strong><br>
            "The president, as well as his ministers, <em>is</em> attending." (subject = president)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Practice Sentences:</h4>
    <p>"The standard of living in many cities ___ declined." → <strong>has</strong> (subject = standard)</p>
    <p>"Neither Kemi nor her parents ___ at home." → <strong>were</strong> (nearer = parents, plural)</p>
    <p>"Every staff member ___ required to sign." → <strong>is</strong> (every → singular)</p>
    <p>"A number of schools ___ been closed." → <strong>have</strong> (a number of = several)</p>
</div>

<div class="warning-box">
    <h4>The Intervening Phrase Trap:</h4>
    <p>Many candidates see "of students" or "of books" and choose a plural verb. But the subject is never inside the "of" phrase. Find the real subject — it comes before the phrase — and agree with that.</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Use the correct tense form in sentence completion",
                        explanation: `<p>Tense questions test whether you choose the right verb form to complete a sentence. Errors usually happen with perfect tenses, conditional sentences, and reported speech — because candidates go by sound rather than by the grammar rule.</p>

<div class="key-points">
    <h4>Tense Rules JAMB Tests Most Often:</h4>
    <ul>
        <li><strong>Present Perfect (have/has + past participle):</strong> For actions that started in the past and are still relevant to now.<br>
            "She <em>has worked</em> here since 2018."</li>
        <li><strong>Past Perfect (had + past participle):</strong> For an action that happened BEFORE another past action.<br>
            "He <em>had already eaten</em> before she arrived."</li>
        <li><strong>Type 1 Conditional (real/possible):</strong> If + present simple → will + base verb.<br>
            "If you revise well, you <em>will pass</em>."</li>
        <li><strong>Type 2 Conditional (hypothetical now):</strong> If + past simple → would + base verb.<br>
            "If I <em>were</em> you, I <em>would apologise</em>."</li>
        <li><strong>Type 3 Conditional (impossible — past regret):</strong> If + past perfect → would have + past participle.<br>
            "If she <em>had studied</em>, she <em>would have passed</em>."</li>
        <li><strong>Wish + past tense (for present regret):</strong> "I wish I <em>were</em> taller." / "I wish he <em>were</em> here."</li>
        <li><strong>Reported speech tense shift:</strong> Present → Past: "I am tired" → He said he <em>was</em> tired.</li>
        <li><strong>Future Perfect:</strong> "By next year, she <em>will have completed</em> her degree."</li>
    </ul>
</div>

<div class="example-box">
    <h4>JAMB-Style Completions:</h4>
    <p>"By the time Ade finishes his degree, he ___ in this city for six years."<br>
    → <strong>will have lived</strong> (future perfect — completed before a future point)</p>
    <p>"If they had left earlier, they ___ the traffic." → <strong>would have avoided</strong> (Type 3)</p>
    <p>"I ___ him since we were in primary school." → <strong>have known</strong> (present perfect with "since")</p>
</div>

<div class="warning-box">
    <h4>The "was" vs "were" Subjunctive Trap:</h4>
    <p>In hypothetical or wish sentences, JAMB expects <strong>were</strong> for all subjects — not just plural ones.<br>
    "If I <strong>were</strong> rich…" (NOT "was") &ensp; / &ensp; "I wish he <strong>were</strong> here." (NOT "was")<br>
    Using "was" in these contexts is marked wrong in JAMB.</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Form correct question tags",
                        explanation: `<p>A <strong>question tag</strong> is the short question added at the end of a statement: "She is coming, <em>isn't she?</em>" JAMB tests this frequently, especially the exceptions that most candidates do not know.</p>

<div class="key-points">
    <h4>The One Core Rule:</h4>
    <p><strong>Positive statement → Negative tag &ensp;|&ensp; Negative statement → Positive tag</strong></p>
    <ul>
        <li>"She is coming, <em>isn't she?</em>"</li>
        <li>"They won't attend, <em>will they?</em>"</li>
        <li>"He can swim, <em>can't he?</em>"</li>
        <li>"You don't know her, <em>do you?</em>"</li>
    </ul>
    <h4>Special Cases — JAMB Loves Testing These:</h4>
    <ul>
        <li><strong>"I am" → tag is "aren't I?"</strong> (NOT "amn't I?" — that form does not exist in standard English)<br>
            "I am the captain here, <em>aren't I?</em>"</li>
        <li><strong>"Let's" → tag is "shall we?"</strong><br>
            "Let's go now, <em>shall we?</em>"</li>
        <li><strong>Negative words (nobody, nothing, never, hardly, scarcely, rarely) → positive tag</strong><br>
            "Nobody came, <em>did they?</em>" (nobody is already negative → positive tag)<br>
            "She never attends, <em>does she?</em>"</li>
        <li><strong>Imperative (command) → "will you?"</strong><br>
            "Open the window, <em>will you?</em>"</li>
        <li><strong>"Have to" (obligation) → use "do", not "have"</strong><br>
            "She has to leave, <em>doesn't she?</em>" (NOT "hasn't she?")</li>
    </ul>
</div>

<div class="warning-box">
    <h4>The "I am" Rule — Guaranteed JAMB Test:</h4>
    <p>When a sentence starts "I am...", the tag is <strong>"aren't I?"</strong> — not "am I not?" (too formal) or "isn't I?" (wrong). This exact pattern appears regularly in JAMB and is frequently answered wrongly.</p>
</div>`,
                        question: true
                    }
                ]
            }
        ]
    },

    // ================================================================
    // TOPIC 4: ORAL ENGLISH
    // ================================================================
    "Oral English": {
        subject: "English",
        topic: "Oral English",
        introduction: {
            title: "Oral English (Phonetics and Phonology)",
            description: "Section C of JAMB tests the sound system of English — how words are actually pronounced, not how they are spelled. The four areas tested are: vowel sounds, consonant sounds, word and emphatic stress, and rhyming words. Many students neglect this section and lose 10 marks that are completely avoidable.",
            jambInfo: "JAMB gives 10 questions in Oral English: roughly 2–3 on vowel sounds, 2–3 on consonant sounds, 3–4 on stress (including emphatic stress), and 1–2 on rhymes. Consistent practice is the only way to score well."
        },
        subtopics: [
            {
                name: "Vowel sounds",
                objectives: [
                    {
                        title: "Identify words that share the same vowel sound",
                        explanation: `<p>JAMB asks you to pick the word that has the <strong>same vowel sound</strong> as the given word. The challenge is that English spelling is unreliable — words that look completely different can share the same vowel sound, and words that look similar can sound completely different.</p>

<div class="key-points">
    <h4>The Main Vowel Sounds with Examples (Including Common Nigerian Traps):</h4>
    <ul>
        <li><strong>/iː/ — "ee" sound:</strong> seat, key, machine, receive, people, quay<br>
            ⚠ "quay" is spelled oddly but pronounced /kiː/ — same as "key"</li>
        <li><strong>/ɪ/ — short "i":</strong> sit, gym, pretty, women, build, busy<br>
            ⚠ "women" is pronounced /ˈwɪmɪn/ — the "o" sounds like "i"</li>
        <li><strong>/e/ — short "e":</strong> bed, head, said, friend, bury, any<br>
            ⚠ "said" is pronounced /sed/ — not /seɪd/</li>
        <li><strong>/ɑː/ — "ah" sound:</strong> car, heart, calm, palm, father, half<br>
            ⚠ "half" = /hɑːf/ — the L is completely silent</li>
        <li><strong>/ɒ/ — short "o":</strong> hot, what, want, wash, cough<br>
            ⚠ "what" is /wɒt/ — not /wæt/ as many people say</li>
        <li><strong>/ɔː/ — "aw" sound:</strong> law, more, thought, caught, floor, warm<br>
            ⚠ "thought", "caught", and "floor" have identical vowel sounds despite completely different spellings</li>
        <li><strong>/uː/ — long "oo":</strong> moon, blue, shoe, through, flew, who, fruit<br>
            ⚠ "through", "shoe", "blue", "flew" all share /uː/ despite different spellings</li>
        <li><strong>/ʌ/ — short "u":</strong> but, love, blood, come, done, money, country<br>
            ⚠ "love", "blood", and "money" all have /ʌ/ — one of the biggest JAMB trap groups</li>
        <li><strong>/ɜː/ — "er" sound:</strong> bird, word, heard, earth, turn, journey, colonel<br>
            ⚠ "colonel" is pronounced /ˈkɜːnl/ — a notorious JAMB trap</li>
    </ul>
</div>

<div class="example-box">
    <h4>JAMB Sample Question:</h4>
    <p>"Which word has the same vowel sound as <u>blood</u>?"</p>
    <p>A. food &ensp; B. wood &ensp; C. flood &ensp; D. hood</p>
    <p><strong>Answer: C (flood)</strong> — "blood" = /blʌd/, "flood" = /flʌd/ — both have /ʌ/.<br>
    "Food" = /fuːd/ (long oo). "Wood" and "hood" = /ʊ/ (short oo). All three are different from "blood".</p>
</div>

<div class="warning-box">
    <h4>The Golden Rule for Vowel Questions:</h4>
    <p>Never judge a vowel sound by spelling. Say each word aloud (or in your head) and focus on what your mouth actually does — not what the letters look like. The sound is what matters.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Consonant sounds",
                objectives: [
                    {
                        title: "Identify words that share the same consonant sound",
                        explanation: `<p>Consonant sound questions ask you to find the word that shares the same consonant sound as the given word. The difficulty comes from three sources: <strong>silent letters</strong>, <strong>unexpected pronunciations</strong>, and <strong>different letter combinations making the same sound</strong>.</p>

<div class="key-points">
    <h4>Consonant Sounds JAMB Tests Most Frequently:</h4>
    <ul>
        <li><strong>/θ/ — voiceless "th":</strong> think, three, both, truth, cloth, month, author<br>
            This is the "th" made by placing your tongue lightly between your teeth and blowing. Your voice is OFF.</li>
        <li><strong>/ð/ — voiced "th":</strong> this, the, those, father, breathe, either, then<br>
            Same tongue position as /θ/ but your voice is ON. "The" always uses /ð/, never /θ/.</li>
        <li><strong>/ʃ/ — "sh" sound:</strong> she, ship, nation, station, ocean, machine, sugar, chef, conscious<br>
            ⚠ "nation", "station", "ocean" all produce /ʃ/ even though they have no letters "sh"</li>
        <li><strong>/ʒ/ — "zh" sound:</strong> measure, vision, pleasure, usual, television, garage, leisure<br>
            This sound is like the middle of "measure" — voiced but soft</li>
        <li><strong>/dʒ/ — "j" sound:</strong> judge, gem, adjust, bridge, soldier, education<br>
            ⚠ "gem" and "soldier" both contain /dʒ/ even without the letter "j"</li>
        <li><strong>/ŋ/ — "ng" sound:</strong> sing, ring, think, bank, tongue, finger, anchor<br>
            ⚠ "think" contains /ŋk/, not /nk/ as many candidates assume</li>
        <li><strong>Silent consonants — VERY common in JAMB:</strong><br>
            Silent K: know, knight, knock, kneel, knot, knave<br>
            Silent W: write, wrist, wrong, wrap, wrestle<br>
            Silent B: comb, lamb, bomb, thumb, debt, doubt<br>
            Silent GH: night, light, fight, right, though, through<br>
            Silent L: calm, palm, half, talk, walk, folk, could, would, should</li>
    </ul>
</div>

<div class="example-box">
    <h4>JAMB Sample Questions:</h4>
    <p>"The underlined consonant in <u>th</u>umb has the same sound as in:"</p>
    <p>A. <u>th</u>en &ensp; B. <u>th</u>ink &ensp; C. <u>th</u>eir &ensp; D. <u>th</u>ey</p>
    <p><strong>Answer: B (think)</strong> — "thumb" uses the voiceless /θ/ (tongue between teeth, no voice). "Think" also uses /θ/. "Then", "their", "they" all use the voiced /ð/.</p>
    <hr>
    <p>"The consonant sound in <u>nation</u> [the underlined part] is the same as in:"</p>
    <p>A. notion &ensp; B. machine &ensp; C. noon &ensp; D. nice</p>
    <p><strong>Answer: B (machine)</strong> — "nation" contains /ʃ/ in "-tion". "Machine" also contains /ʃ/ in "-ch".</p>
</div>

<div class="warning-box">
    <h4>Preparation Strategy:</h4>
    <p>Focus especially on: /θ/ vs /ð/ (both called "th"), /ʃ/ appearing in "-tion"/"-sion"/"ch" words, silent letters (K, B, L, GH), and /s/ vs /z/ in plural endings. These appear almost every year.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Word stress",
                objectives: [
                    {
                        title: "Identify which word carries emphatic stress in a sentence",
                        explanation: `<p><strong>Emphatic stress</strong> is one of the most distinctive JAMB Oral English questions. JAMB gives you a sentence with ONE word in CAPITAL LETTERS — that word is being deliberately emphasised. Your task is to pick the response (from four options) that correctly addresses the emphasised word.</p>

<div class="key-points">
    <h4>The Core Principle — Stress Changes Meaning:</h4>
    <p>Stressing a different word in the same sentence shifts its focus. The correct response must question, contradict, or clarify <strong>exactly the capitalised word</strong> — and no other part of the sentence.</p>
</div>

<div class="example-box">
    <h4>One Sentence — Four Different Emphases:</h4>
    <p style="background:#f9f9f9; padding:10px; border-left:3px solid #3498db; border-radius:4px;">
        <strong>Version 1: "TUNDE drove the principal to Lagos yesterday."</strong><br>
        → Stress on WHO drove → Correct response: "Was it Tunde who drove? I thought it was Emeka."
    </p>
    <p style="background:#f9f9f9; padding:10px; border-left:3px solid #e67e22; border-radius:4px; margin-top:8px;">
        <strong>Version 2: "Tunde DROVE the principal to Lagos yesterday."</strong><br>
        → Stress on THE ACTION → Correct response: "Did he drive? I thought he only accompanied him."
    </p>
    <p style="background:#f9f9f9; padding:10px; border-left:3px solid #27ae60; border-radius:4px; margin-top:8px;">
        <strong>Version 3: "Tunde drove THE PRINCIPAL to Lagos yesterday."</strong><br>
        → Stress on WHO WAS DRIVEN → Correct response: "The principal? I thought he drove the deputy."
    </p>
    <p style="background:#f9f9f9; padding:10px; border-left:3px solid #c0392b; border-radius:4px; margin-top:8px;">
        <strong>Version 4: "Tunde drove the principal to LAGOS yesterday."</strong><br>
        → Stress on THE DESTINATION → Correct response: "To Lagos? I thought it was Abuja he drove him to."
    </p>
</div>

<div class="key-points">
    <h4>3-Step Solving Method:</h4>
    <ul>
        <li><strong>Step 1:</strong> Identify the capitalised word. What category is it? (person, action, place, time, object?)</li>
        <li><strong>Step 2:</strong> Ask — "Which response questions or contradicts ONLY that specific word?"</li>
        <li><strong>Step 3:</strong> Eliminate responses that focus on any other part of the sentence — those are distractors placed to confuse you.</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Why Candidates Get This Wrong:</h4>
    <p>JAMB deliberately places three responses that each address a different part of the sentence — only one addresses the capitalised word. Candidates who read too quickly pick any response that mentions something from the sentence. Read carefully and match ONLY to the stressed word.</p>
</div>`,
                        question: true
                    },
                    {
                        title: "Apply syllable stress rules for two-syllable words",
                        explanation: `<p>Every English word with more than one syllable has one syllable that is spoken a bit louder and longer — that is the <strong>stressed syllable</strong>. JAMB tests this mainly through the famous <strong>noun-verb stress shift</strong> pattern and some suffix-based rules.</p>

<div class="key-points">
    <h4>The Noun-Verb Stress Shift Rule (Most Tested in JAMB):</h4>
    <p>Many two-syllable words can be used as both a noun and a verb. When used as a <strong>noun</strong>, stress the <strong>first syllable</strong>. When used as a <strong>verb</strong>, stress the <strong>second syllable</strong>.</p>
    <table style="width:100%; border-collapse:collapse; margin:10px 0; font-size:0.95em;">
        <tr style="background:#eef3fb;">
            <th style="padding:7px 10px; border:1px solid #ccc; text-align:left;">Word</th>
            <th style="padding:7px 10px; border:1px solid #ccc; text-align:left;">As NOUN (stress 1st)</th>
            <th style="padding:7px 10px; border:1px solid #ccc; text-align:left;">As VERB (stress 2nd)</th>
        </tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">record</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>RE</strong>-cord</td><td style="padding:6px 10px; border:1px solid #ddd;">re-<strong>CORD</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">present</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>PRE</strong>-sent</td><td style="padding:6px 10px; border:1px solid #ddd;">pre-<strong>SENT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">permit</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>PER</strong>-mit</td><td style="padding:6px 10px; border:1px solid #ddd;">per-<strong>MIT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">object</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>OB</strong>-ject</td><td style="padding:6px 10px; border:1px solid #ddd;">ob-<strong>JECT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">contract</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>CON</strong>-tract</td><td style="padding:6px 10px; border:1px solid #ddd;">con-<strong>TRACT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">insult</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>IN</strong>-sult</td><td style="padding:6px 10px; border:1px solid #ddd;">in-<strong>SULT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">increase</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>IN</strong>-crease</td><td style="padding:6px 10px; border:1px solid #ddd;">in-<strong>CREASE</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">desert</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>DES</strong>-ert</td><td style="padding:6px 10px; border:1px solid #ddd;">de-<strong>SERT</strong></td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;">protest</td><td style="padding:6px 10px; border:1px solid #ddd;"><strong>PRO</strong>-test</td><td style="padding:6px 10px; border:1px solid #ddd;">pro-<strong>TEST</strong></td></tr>
    </table>
    <h4>Other Stress Pattern Rules:</h4>
    <ul>
        <li>Words ending in <strong>-tion / -sion / -cian</strong> → stress the syllable BEFORE the suffix<br>
            "na-<strong>TION</strong>", "de-<strong>CI</strong>-sion", "mu-<strong>SI</strong>-cian"</li>
        <li>Words ending in <strong>-ic</strong> → stress the syllable BEFORE -ic<br>
            "e-<strong>CO</strong>-no-mic", "re-a-<strong>LIS</strong>-tic", "pho-<strong>NET</strong>-ic"</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Read the Sentence First:</h4>
    <p>"They signed the <em>CON-tract</em> this morning." → noun → stress 1st syllable<br>
    "They may <em>con-TRACT</em> the disease if not careful." → verb → stress 2nd syllable<br>
    The sentence tells you which role the word is playing.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "Rhymes",
                objectives: [
                    {
                        title: "Identify words that rhyme based on their sound, not their spelling",
                        explanation: `<p>Two words <strong>rhyme</strong> when their final stressed vowel sound and every sound after it are identical — regardless of how they are spelled. JAMB gives you a word and asks which of four options rhymes with it. The key skill is ignoring the spelling and focusing purely on sound.</p>

<div class="example-box">
    <h4>Why Spelling Misleads — Real Examples:</h4>
    <table style="width:100%; border-collapse:collapse; margin:10px 0; font-size:0.95em;">
        <tr style="background:#eef3fb;">
            <th style="padding:7px 10px; border:1px solid #ccc;">Pair</th>
            <th style="padding:7px 10px; border:1px solid #ccc;">Do They Rhyme?</th>
            <th style="padding:7px 10px; border:1px solid #ccc;">Why</th>
        </tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>crate / weight</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:green;">YES ✓</td><td style="padding:6px 10px; border:1px solid #ddd;">Both end in /eɪt/</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>through / shoe</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:green;">YES ✓</td><td style="padding:6px 10px; border:1px solid #ddd;">Both end in /uː/</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>love / dove</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:green;">YES ✓</td><td style="padding:6px 10px; border:1px solid #ddd;">Both end in /ʌv/</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>fret / sweat</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:green;">YES ✓</td><td style="padding:6px 10px; border:1px solid #ddd;">Both end in /et/ — "sweat" = /swet/</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>risen / prison</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:green;">YES ✓</td><td style="padding:6px 10px; border:1px solid #ddd;">Both end in /ɪzən/</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>pint / mint</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:red;">NO ✗</td><td style="padding:6px 10px; border:1px solid #ddd;">"pint" = /paɪnt/; "mint" = /mɪnt/ — different sounds</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>comb / bomb</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:red;">NO ✗</td><td style="padding:6px 10px; border:1px solid #ddd;">"comb" = /koʊm/; "bomb" = /bɒm/ — very different</td></tr>
        <tr><td style="padding:6px 10px; border:1px solid #ddd;"><strong>love / move</strong></td><td style="padding:6px 10px; border:1px solid #ddd; color:red;">NO ✗</td><td style="padding:6px 10px; border:1px solid #ddd;">"love" = /lʌv/; "move" = /muːv/ — different vowels</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Common Rhyme Groups for JAMB:</h4>
    <ul>
        <li><strong>/eɪ/ group:</strong> day, say, grey, weigh, vein, rein, reign, plane, plain, crane</li>
        <li><strong>/aɪ/ group:</strong> my, die, high, sigh, tie, buy, bye, fly, eye, thigh, sky</li>
        <li><strong>/əʊ/ group:</strong> go, toe, sew, though, flow, know, row (rowing), dough, foe</li>
        <li><strong>/uː/ group:</strong> blue, shoe, through, flew, dew, true, you, do, two, who</li>
        <li><strong>/ʌ/ group:</strong> love, dove, above, shove, glove, blood, flood, mud, bud, cut, but</li>
        <li><strong>/ɔː/ group:</strong> law, more, floor, paw, core, saw, war, draw, shore, four</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Solving Method:</h4>
    <p>Say the given word quietly in your head. Focus only on the sound from the last stressed vowel onward. Now test each option the same way. Which one ends with the exact same sound? Ignore spelling completely — it is irrelevant here.</p>
</div>`,
                        question: true
                    }
                ]
            }
        ]
    },

    // ================================================================
    // TOPIC 5: LITERATURE (THE LIFE CHANGER)
    // ================================================================
    "Literature (The Life Changer)": {
        subject: "English",
        topic: "Literature (The Life Changer)",
        introduction: {
            title: "Literature: The Life Changer",
            description: "The Life Changer by Khadija Abubakar Jalli is the JAMB prescribed novel for 2022–2025. Section D of JAMB tests your knowledge of the novel's plot, characters, themes, and setting. This section carries 15–20 questions. You must read the actual novel — general knowledge is not enough.",
            jambInfo: "JAMB questions on The Life Changer ask about specific events, exact character names and roles, the themes the novel explores, the setting (ABU Zaria and Kano), and the author's message. Vague and general answers lose marks — know the details."
        },
        subtopics: [
            {
                name: "The Life Changer - Plot and themes",
                objectives: [
                    {
                        title: "Trace the key events of the plot from beginning to end",
                        explanation: `<p><em>The Life Changer</em> is set up as a story-within-a-story. <strong>Ummi</strong>, a principled mother in Kano, tells her curious young son <strong>Nafe</strong> stories about what university life is really like. Through these stories, we follow the experiences of her older children and their peers at Ahmadu Bello University (ABU) Zaria.</p>

<div class="key-points">
    <h4>The Full Plot — Event by Event:</h4>
    <ol>
        <li><strong>The setup:</strong> Nafe questions his mother Ummi about university. To prepare him for what he will face, she begins telling him real stories from his siblings' experiences.</li>
        <li><strong>Layla arrives at ABU and meets Binta:</strong> Layla, Ummi's daughter, is assigned <strong>Binta</strong> as her dormitory roommate. Binta is dishonest, promiscuous, and uses sex to get money and favours from male students and lecturers. She also engages in exam malpractice.</li>
        <li><strong>Layla's test of character:</strong> Despite pressure, social ridicule, and Binta's persistent influence, Layla refuses to compromise. She studies hard, keeps to herself, and maintains her values.</li>
        <li><strong>Habib enters:</strong> <strong>Habib</strong>, a principled and intelligent male student, becomes aware of Layla. He is attracted to her intelligence and character. Their relationship develops with mutual respect — he does not push her boundaries.</li>
        <li><strong>Talle falls:</strong> Ummi's son <strong>Talle</strong> reaches university with potential but quickly falls in with the wrong crowd. He joins other students involved in internet fraud (yahoo-yahoo/cybercrime). He spends money recklessly, neglects his studies, and brings shame to the family.</li>
        <li><strong>Dr Kabiru's abuse:</strong> <strong>Dr Kabiru</strong>, a senior lecturer, habitually harasses female students sexually, using grades as leverage. He represents the corruption that exists within the university system itself.</li>
        <li><strong>Salma's path:</strong> <strong>Salma</strong> is another student who is deceptive and materialistic. She contrasts sharply with Layla — her choices illustrate the consequences of prioritising material gain over character.</li>
        <li><strong>Resolution:</strong> Students who maintained integrity — Layla, Habib, Omar — succeed academically and personally. Those who chose shortcuts — Talle, Binta, Salma — face consequences. Nafe receives these stories as moral preparation for his own future.</li>
    </ol>
</div>

<div class="example-box">
    <h4>Direct JAMB Fact Questions — Know These Answers:</h4>
    <p>"Who narrates the stories in the novel?" → <strong>Ummi</strong></p>
    <p>"Who was Layla's roommate at ABU?" → <strong>Binta</strong></p>
    <p>"What crime did Talle commit at university?" → <strong>Cybercrime / internet fraud (yahoo-yahoo)</strong></p>
    <p>"To whom does Ummi tell the stories?" → <strong>Nafe (her youngest son)</strong></p>
    <p>"Who harassed female students in the novel?" → <strong>Dr Kabiru</strong></p>
</div>`,
                        question: true
                    },
                    {
                        title: "Identify and explain the major themes with evidence from the novel",
                        explanation: `<p>A <strong>theme</strong> is a central idea the novel explores through its characters and events. JAMB may ask: <em>"Which theme is illustrated by…"</em> or <em>"The central concern of the passage/novel is…"</em> You must link each theme to specific characters and events — vague answers are not enough.</p>

<div class="key-points">
    <h4>The Major Themes — With Evidence:</h4>
    <ul>
        <li><strong>1. Education as a Life Changer (the title's meaning)</strong><br>
            The novel's title is itself the central theme. Education has the power to transform lives — but only when pursued with genuine effort and integrity. Layla embodies this. Talle's failure shows what happens when university becomes a place of fraud instead of learning.</li>
        <li><strong>2. Moral Values and Upbringing</strong><br>
            Ummi is the moral backbone of the novel. Her children's behaviour at university traces back to the values she raised them with. Layla's resilience comes directly from her upbringing. Talle's collapse happens partly because he abandoned the values he was given.</li>
        <li><strong>3. Peer Pressure and Bad Influence</strong><br>
            Binta consistently normalises dishonesty, promiscuity, and malpractice to Layla — who resists. Talle succumbs to his yahoo-yahoo friends — who don't. The novel makes a clear argument: the company you keep at university defines who you become.</li>
        <li><strong>4. Corruption in Nigerian Universities</strong><br>
            Dr Kabiru's sexual harassment, exam malpractice by students like Binta, ghost students, and bribery are all depicted honestly. The author does not pretend these problems do not exist — she confronts them head-on.</li>
        <li><strong>5. Cybercrime and Its Destruction</strong><br>
            Talle's involvement in internet fraud is shown as degrading and ultimately destructive — not cool or glamorous. He loses his academic future, his dignity, and causes his family pain. The novel is an indirect but clear warning about yahoo-yahoo culture.</li>
        <li><strong>6. Healthy vs. Exploitative Relationships</strong><br>
            Habib and Layla model a respectful relationship rooted in shared values. This stands in sharp contrast to Binta's transactional relationships with men, and Dr Kabiru's exploitation of female students.</li>
        <li><strong>7. The Role and Strength of Mothers</strong><br>
            Ummi is arguably the most important figure in the novel. She holds the family together morally. The novel honors Nigerian motherhood — while also acknowledging its limits when children go out into the world.</li>
    </ul>
</div>

<div class="warning-box">
    <h4>How to Answer Theme Questions in JAMB:</h4>
    <p>When JAMB asks "which theme is best illustrated by…", always link your answer to a specific character or event. <br>
    Theme of peer pressure → Talle with yahoo-yahoo friends / Binta pressuring Layla.<br>
    Theme of integrity → Layla refusing malpractice / Habib's honest courtship.<br>
    The correct option always connects theme to evidence.</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "The Life Changer - Characters",
                objectives: [
                    {
                        title: "Identify the roles and personalities of the main characters",
                        explanation: `<p>JAMB regularly tests character knowledge with questions like: <em>"Who said…?", "What did X do when…?", "Which character best represents the theme of…?"</em> You must know each character's name, personality, role in the story, and what they represent.</p>

<div class="key-points">
    <h4>Full Character Profiles:</h4>
    <ul>
        <li><strong>UMMI</strong><br>
            Role: Central narrator and mother of Layla and Talle. She is educated, principled, devout, and deeply committed to her children's moral formation. She tells Nafe stories specifically to prepare him for what he will encounter. She represents the ideal of the wise, loving, morally grounded Nigerian mother.</li>
        <li><strong>LAYLA</strong><br>
            Role: Ummi's daughter at ABU Zaria. She is hardworking, intelligent, and morally disciplined. She resists Binta's bad influence, refuses malpractice, avoids promiscuity, and succeeds through genuine effort. She is the novel's central moral example among the student characters.</li>
        <li><strong>TALLE</strong><br>
            Role: Ummi's son. He arrives at university with potential but is quickly corrupted by peer pressure. He gets involved in internet fraud, wastes money, neglects his studies, and causes his family shame and pain. He serves as a cautionary contrast to Layla.</li>
        <li><strong>HABIB</strong><br>
            Role: A male student at ABU who develops feelings for Layla. He is respectful, academically disciplined, and honest. He courts Layla with integrity — appreciating her mind and character, not just her appearance. He contrasts directly with Dr Kabiru's exploitative behaviour.</li>
        <li><strong>BINTA (BINT)</strong><br>
            Role: Layla's dormitory roommate and the novel's principal source of moral temptation. She is promiscuous, dishonest, materialistic, and engaged in exam malpractice. She normalises bad behaviour and represents the corrupting influence of campus peer pressure.</li>
        <li><strong>OMAR</strong><br>
            Role: A diligent, principled male student who serves as a positive example. He shows that hardworking, honest male students exist on campus — providing a contrast to Talle and Dr Kabiru.</li>
        <li><strong>SALMA</strong><br>
            Role: A deceptive, materialistic female student who uses her appearance to gain favours. Her story illustrates the wrong path — contrasting with Layla's principled approach.</li>
        <li><strong>DR KABIRU</strong><br>
            Role: A senior lecturer who sexually harasses female students, using academic grades as leverage. He represents institutional corruption — the abuse of power by those in authority within the university system.</li>
        <li><strong>NAFE</strong><br>
            Role: Ummi's youngest child. He is curious and innocent. His questions trigger Ummi's storytelling. He represents the next generation — the young person who must be morally prepared before entering university life.</li>
    </ul>
</div>

<div class="example-box">
    <h4>Key Character Contrasts JAMB Uses:</h4>
    <p><strong>Layla vs Binta:</strong> moral strength vs moral weakness; integrity vs corruption<br>
    <strong>Talle vs Omar:</strong> yielding to peer pressure vs resisting it<br>
    <strong>Habib vs Dr Kabiru:</strong> respectful love vs exploitative power<br>
    <strong>Ummi vs the university environment:</strong> the values of home challenged by campus freedom</p>
</div>`,
                        question: true
                    }
                ]
            },
            {
                name: "The Life Changer - Setting and context",
                objectives: [
                    {
                        title: "Describe the setting of the novel and explain why it matters",
                        explanation: `<p>The <strong>setting</strong> is where and when the story takes place. In <em>The Life Changer</em>, the two settings are not just background — they carry meaning. The contrast between <strong>home (Kano)</strong> and <strong>university (ABU Zaria)</strong> is the novel's central dramatic tension.</p>

<div class="key-points">
    <h4>The Two Main Settings:</h4>
    <ul>
        <li><strong>KANO — The Home Setting</strong><br>
            Ummi and her youngest son Nafe remain in Kano throughout the novel. Kano represents structure, family, Islamic values, moral grounding, and parental oversight. It is the world of rules, protection, and guidance. Characters who stay rooted in these values (especially Layla) manage to navigate university with their character intact.</li>
        <li><strong>AHMADU BELLO UNIVERSITY (ABU), ZARIA — The Campus Setting</strong><br>
            ABU Zaria in Kaduna State is one of Nigeria's oldest and largest universities. The campus setting represents freedom, independence, temptation, and danger — specifically the danger of living far from home without parental supervision. It is where characters must make their own choices, and where those choices reveal their true character. This is where Talle falls, where Binta corrupts, and where Layla's integrity is tested and proven.</li>
    </ul>
    <h4>Time and Social Context:</h4>
    <ul>
        <li><strong>Contemporary Nigeria</strong> — early 21st century, during the period when internet fraud became widespread and university corruption was a visible social problem.</li>
        <li><strong>Northern Nigerian Muslim society</strong> — the novel reflects values around family honour, female education, modesty, and the pressure between traditional expectations and modern campus culture. The author, Khadija Abubakar Jalli, writes from deep familiarity with this world.</li>
    </ul>
</div>

<div class="example-box">
    <h4>The Setting as the Novel's Argument:</h4>
    <p><strong>Kano:</strong> structured, supervised, moral, protective<br>
    <strong>ABU campus:</strong> free, unsupervised, tempting, potentially corrupting<br><br>
    The novel's argument is clear: university is a life changer — but whether it changes your life for good or ill depends entirely on the values you carry with you from home. Layla succeeds because she carries Kano's values to Zaria. Talle fails because he leaves them behind.</p>
</div>

<div class="warning-box">
    <h4>JAMB Direct-Fact Questions on Setting — Know These Exactly:</h4>
    <p>"The university setting in the novel is ___" → <strong>Ahmadu Bello University (ABU), Zaria</strong><br>
    "ABU is located in which state?" → <strong>Kaduna State</strong><br>
    "The home city of Ummi's family is ___" → <strong>Kano</strong><br>
    "The author of The Life Changer is ___" → <strong>Khadija Abubakar Jalli</strong></p>
</div>`,
                        question: true
                    }
                ]
            }
        ]
    }
};
"""

pathlib.Path('frontend/js/content/english-content.js').write_text(JS, encoding='utf-8')
lines = JS.count('\n')
print(f'Written successfully. Lines: {lines}')
