"""
retag_biology_government.py
---------------------------
Re-tags Biology and Government questions in the PostgreSQL DB with accurate
topic and subtopic names that match the rebuilt syllabus JSONs.

Government: strips trailing colons (e.g. "Forms of Government:" → "Forms of Government"),
            normalises dash-spacing, maps Part II/III/IV topics.
Biology:    light re-tag — normalises any name variants, assigns subtopics
            from keyword matching.

Run from project root:
    python scripts/retag_biology_government.py

Flags:
    --dry-run    Print coverage report only, make no DB changes
    --subject    'Biology' or 'Government' (default: both)
"""

import sys
import argparse
from pathlib import Path
from collections import Counter
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection


# ──────────────────────────────────────────────────────────────
# GOVERNMENT MAPPINGS
# ──────────────────────────────────────────────────────────────

# Old topic name (in DB) → new canonical name
GOVERNMENT_TOPIC_RENAME = {
    # Part I — names WITH trailing colon
    "Basic Concepts in Government:": "Basic Concepts in Government",
    "Basic Concepts In Government:": "Basic Concepts in Government",
    "Forms of Government:": "Forms of Government",
    "Arms of Government:": "Arms of Government",
    "Structures of Governance:": "Structures of Governance",
    "Systems of Governance:": "Systems of Governance",
    "Political Ideologies:": "Political Ideologies",
    "Constitution:": "Constitution",
    "Principles of Democratic Government:": "Principles of Democratic Government",
    "Processes of Legislation:": "Processes of Legislation",
    "Citizenship:": "Citizenship",
    "The Electoral Process:": "The Electoral Process",
    "Political Parties and Party Systems:": "Political Parties and Party Systems",
    "Pressure Groups:": "Pressure Groups",
    "Public Opinion:": "Public Opinion",
    "The Civil Service:": "The Civil Service",
    # Part II — names WITH trailing colon + spacing variants
    "Pre - colonial Polities:": "Pre-colonial Polities",
    "Pre-colonial Polities:": "Pre-colonial Polities",
    "Pre - Colonial Polities:": "Pre-colonial Polities",
    "Imperialist Penetration:": "Imperialist Penetration",
    "Process of Decolonization:": "Process of Decolonization",
    "Constitutional Development in Nigeria:": "Constitutional Development in Nigeria",
    "Post - Independence Constitutions:": "Post-Independence Constitutions",
    "Post-Independence Constitutions:": "Post-Independence Constitutions",
    "Post - independence Constitutions:": "Post-Independence Constitutions",
    "Institutions of Government in the Post - Independence Nigeria:":
        "Institutions of Government in Post-Independence Nigeria",
    "Institutions of Government in the Post-Independence Nigeria:":
        "Institutions of Government in Post-Independence Nigeria",
    "Institutions of Government in Post - Independence Nigeria:":
        "Institutions of Government in Post-Independence Nigeria",
    "Public Commissions Established by the 1979 and Subsequent Constitutions:":
        "Public Commissions in Nigeria",
    "Public Commissions Established by the 1979 and subsequent Constitutions:":
        "Public Commissions in Nigeria",
    "Political Parties and Party Politics in Post-Independence Nigeria:":
        "Political Parties in Post-Independence Nigeria",
    "Political Parties and Party Politics in Post - Independence Nigeria:":
        "Political Parties in Post-Independence Nigeria",
    "The Structure and Workings of Nigerian Federalism:":
        "Structure and Workings of Nigerian Federalism",
    "Structure and Workings of Nigerian Federalism:":
        "Structure and Workings of Nigerian Federalism",
    "Public Corporations and Parastatals:": "Public Corporations and Parastatals",
    "Local Government:": "Local Government",
    "The Military in Nigerian Politics:": "The Military in Nigerian Politics",
    # Part III
    "Foreign Policy:": "Foreign Policy",
    "Nigeria's Foreign Policy:": "Nigeria's Foreign Policy",
    "Nigeria's Foreign Policy:": "Nigeria's Foreign Policy",
    "Relations with African Countries:": "Relations with African Countries",
    "Nigeria in International Organizations": "International Organizations",
    # Part IV
    "International Organizations:": "International Organizations",
    # Names already correct (no-op ensures they stay)
    "Basic Concepts in Government": "Basic Concepts in Government",
    "Forms of Government": "Forms of Government",
    "Arms of Government": "Arms of Government",
    "Structures of Governance": "Structures of Governance",
    "Systems of Governance": "Systems of Governance",
    "Political Ideologies": "Political Ideologies",
    "Constitution": "Constitution",
    "Principles of Democratic Government": "Principles of Democratic Government",
    "Processes of Legislation": "Processes of Legislation",
    "Citizenship": "Citizenship",
    "The Electoral Process": "The Electoral Process",
    "Political Parties and Party Systems": "Political Parties and Party Systems",
    "Pressure Groups": "Pressure Groups",
    "Public Opinion": "Public Opinion",
    "The Civil Service": "The Civil Service",
    "Pre-colonial Polities": "Pre-colonial Polities",
    "Imperialist Penetration": "Imperialist Penetration",
    "Process of Decolonization": "Process of Decolonization",
    "Constitutional Development in Nigeria": "Constitutional Development in Nigeria",
    "Post-Independence Constitutions": "Post-Independence Constitutions",
    "Institutions of Government in Post-Independence Nigeria":
        "Institutions of Government in Post-Independence Nigeria",
    "Public Commissions in Nigeria": "Public Commissions in Nigeria",
    "Political Parties in Post-Independence Nigeria":
        "Political Parties in Post-Independence Nigeria",
    "Structure and Workings of Nigerian Federalism":
        "Structure and Workings of Nigerian Federalism",
    "Public Corporations and Parastatals": "Public Corporations and Parastatals",
    "Local Government": "Local Government",
    "The Military in Nigerian Politics": "The Military in Nigerian Politics",
    "Foreign Policy": "Foreign Policy",
    "Nigeria's Foreign Policy": "Nigeria's Foreign Policy",
    "Relations with African Countries": "Relations with African Countries",
    "International Organizations": "International Organizations",
}

# Subtopic keyword rules for Government
GOVERNMENT_SUBTOPIC_RULES = {
    "Basic Concepts in Government": [
        (["power", "authority", "legitimacy", "sovereignty", "charismatic", "traditio", "legal-rational"],
         "Power, Authority, Legitimacy, and Sovereignty"),
        (["society", "state", "nation", "nation-state", "political socialization", "political culture",
          "political participation", "politic"], "State, Society, Nation, and Political Processes"),
    ],
    "Forms of Government": [
        (["democracy", "monarchy", "oligarchy", "aristocracy", "theocracy", "direct democracy",
          "representative", "republican"], "Democratic and Non-Democratic Systems"),
        (["totalitarian", "fascism", "fascist", "military government", "authoritarian", "dictatorship"],
         "Totalitarianism, Fascism, and Military Government"),
    ],
    "Arms of Government": [
        (["legislature", "parliament", "national assembly", "law-making", "bill", "executive", "president",
          "prime minister", "cabinet"], "Legislature and Executive"),
        (["judiciary", "court", "judge", "separation of power", "checks and balance", "judicial"],
         "The Judiciary and Separation of Powers"),
    ],
    "Structures of Governance": [
        (["unitary", "federal", "federalism", "central government", "devol"], "Unitary and Federal Systems"),
        (["confederal", "confederation", "devolution"], "Confederal System and Devolution of Power"),
    ],
    "Systems of Governance": [
        (["presidential", "parliamentary", "prime minister", "fusion of power", "head of state"],
         "Presidential and Parliamentary Systems"),
        (["constitutional monarchy", "hybrid", "monarchy"], "Constitutional Monarchy and Hybrid Systems"),
    ],
    "Political Ideologies": [
        (["capitalism", "socialism", "communism", "marxis", "mode of production", "bourgeois", "proletariat"],
         "Capitalism, Socialism, and Communism"),
        (["liberalism", "conservatism", "fascism", "liberal", "conservative", "ideology"],
         "Liberalism, Conservatism, and Fascism"),
    ],
    "Constitution": [
        (["source", "function", "written", "unwritten", "definition of constitution", "what is constitution"],
         "Definition, Sources, and Functions of Constitutions"),
        (["rigid", "flexible", "amendment", "entrench"], "Rigid and Flexible Constitutions"),
    ],
    "Principles of Democratic Government": [
        (["rule of law", "fundamental right", "constitutionalism", "habeas corpus", "equality before"],
         "Rule of Law, Fundamental Rights, and Constitutionalism"),
        (["free and fair", "election", "accountability", "transparency", "periodic election"],
         "Free and Fair Elections, and Accountability"),
    ],
    "Processes of Legislation": [
        (["first reading", "second reading", "third reading", "bill", "public bill", "private bill", "stage",
          "reading", "assent", "passage", "enact"], "Stages of a Bill"),
        (["delegated legislation", "statutory instrument", "bye-law", "types of law", "customary law"],
         "Types of Laws and Legislative Powers"),
    ],
    "Citizenship": [
        (["birth", "naturali", "registrat", "acquire", "citizenship by", "jus soli", "jus sanguinis",
          "alien", "stateless", "renounce", "revoke"], "Acquisition and Loss of Citizenship"),
        (["right", "duty", "obligation", "responsibilities", "civic", "voting", "tax"],
         "Rights, Duties, and Obligations"),
    ],
    "The Electoral Process": [
        (["franchise", "suffrage", "universal adult", "proportional", "first-past-the-post", "electora",
          "voting system", "gerrymandering", "constituency"], "Franchise and Electoral Systems"),
        (["inec", "electoral commission", "voter register", "election commission", "declaration",
          "returning officer", "electoral body"], "Electoral Commissions and Electoral Processes"),
    ],
    "Political Parties and Party Systems": [
        (["function", "role of political party", "recruit", "formation", "organizati", "manifesto"],
         "Functions and Organization of Political Parties"),
        (["one-party", "two-party", "multi-party", "single party", "party system", "bipartisan"],
         "Party Systems: One-Party, Two-Party, Multi-Party"),
    ],
    "Pressure Groups": [
        (["pressure group", "interest group", "function of pressure", "lobbying", "lobby", "protective",
          "promotional"], "Functions and Modus Operandi of Pressure Groups"),
        (["pressure group vs", "difference between", "political party and pressure"],
         "Pressure Groups vs Political Parties"),
    ],
    "Public Opinion": [
        (["public opinion", "poll", "survey", "formation", "assessment", "gallup"],
         "Formation and Measurement of Public Opinion"),
        (["media", "propaganda", "limitation of public opinion", "manipulation", "mass media"],
         "Limitations and Role of the Media"),
    ],
    "The Civil Service": [
        (["civil service", "bureaucracy", "neutrality", "permanence", "anonymity", "merit", "impartiality",
          "civil servant", "structure", "hierarchy"], "Structure, Functions, and Principles of the Civil Service"),
        (["reform", "privatiz", "challenge", "problem of civil service", "udoji", "dotun"],
         "Civil Service Reforms and Challenges"),
    ],
    "Pre-colonial Polities": [
        (["hausa", "yoruba", "igbo", "fulani", "emirate", "oyo", "benin", "obi", "oba", "emirs",
          "pre-colonial", "pre colonial", "traditional"], "Hausa, Yoruba, and Igbo Pre-colonial Systems"),
        (["nupe", "tiv", "kanuri", "segmentar", "acephalous", "decentralized"],
         "Other Nigerian Pre-colonial States"),
    ],
    "Imperialist Penetration": [
        (["indirect rule", "assimilation", "french", "british", "lugard", "colonial policy"],
         "British and French Colonial Policies"),
        (["amalgamation", "1914", "colonial administration", "lugard", "protectorate"],
         "Amalgamation and Colonial Administration in Nigeria"),
    ],
    "Process of Decolonization": [
        (["nationalism", "independen", "nationalist", "nnamdi azikiwe", "awolowo", "ahmadu bello",
          "pan-african", "back-to-africa"], "Nationalism and Independence Movements"),
        (["world war", "united nations", "un", "external force", "international pressure"],
         "External Forces and the Push for Independence"),
    ],
    "Constitutional Development in Nigeria": [
        (["clifford", "richards", "macpherson", "1922", "1946", "1951"],
         "Clifford, Richards, and Macpherson Constitutions"),
        (["lyttleton", "1954", "1960", "independence constitution", "federal constitution"],
         "Lyttleton Constitution and Independence Constitution"),
    ],
    "Post-Independence Constitutions": [
        (["1963", "republican constitution", "decree 34", "unification decree", "first republic"],
         "Republican Constitution of 1963 and Decree 34 of 1966"),
        (["1979", "1989", "1999", "second republic", "third republic", "fourth republic"],
         "1979, 1989, and 1999 Constitutions"),
    ],
    "Institutions of Government in Post-Independence Nigeria": [
        (["national assembly", "senate", "house of representatives", "state assembly", "speaker",
          "president", "governor", "executive arm"], "Legislature, Executive, and Judiciary in Post-Independence Nigeria"),
        (["armed forces", "police", "army", "navy", "air force", "security", "nscdc"],
         "Security Agencies and Administrative Bodies"),
    ],
    "Public Commissions in Nigeria": [
        (["inec", "rmafc", "npc", "fdac", "economic", "commission", "functions of commission"],
         "Functions and Operations of Public Commissions"),
        (["problem", "challenge", "constrain", "independence of commission", "interference"],
         "Challenges and Constraints of Public Commissions"),
    ],
    "Political Parties in Post-Independence Nigeria": [
        (["ncnc", "ag", "npc", "gbnc", "first republic", "second republic", "npp", "npn", "unp",
          "gnpp"], "First and Second Republic Political Parties"),
        (["third republic", "fourth republic", "pdp", "apc", "all progressives", "babangida",
          "abacha transition"], "Third and Fourth Republic Political Parties"),
    ],
    "Structure and Workings of Nigerian Federalism": [
        (["federalism", "exclusive list", "concurrent list", "residual", "revenue allocation",
          "devolution", "fiscal federal"], "Features and Principles of Nigerian Federalism"),
        (["problem of federal", "resource control", "state creation", "corrective measure",
          "true federalism", "restructuring"], "Problems and Corrective Measures in Nigerian Federalism"),
    ],
    "Public Corporations and Parastatals": [
        (["public corporation", "parastatal", "nnpc", "nepa", "nerc", "npa", "government enterprise"],
         "Operations and Purpose of Public Corporations"),
        (["privatiz", "commercializ", "deregulation", "bureau of public enterprise"],
         "Privatization and Commercialization"),
    ],
    "Local Government": [
        (["local government", "council", "1976 reform", "structure of local", "evolution of local",
          "chieftaincy"], "Evolution, Structure, and Functions of Local Government"),
        (["problem of local", "challenges of local", "state interference", "underfunding",
          "local government reform"], "Problems and Reforms of Local Government"),
    ],
    "The Military in Nigerian Politics": [
        (["military coup", "coup d'etat", "reason for military", "military intervention", "january 1966",
          "july 1966", "1975", "1983", "1985", "1993"], "Reasons for Military Intervention"),
        (["achievement of military", "withdrawal", "transition", "democratiz", "nadeco", "abiola",
          "june 12"], "Achievements and Withdrawal of Military Rule"),
    ],
    "Foreign Policy": [
        (["definition of foreign", "determinant", "national interest", "diplomacy", "instrument of foreign"],
         "Definition and Determinants of Foreign Policy"),
        (["bilateral", "multilateral", "goal", "objective of foreign", "international law"],
         "Types and Goals of Foreign Policy"),
    ],
    "Nigeria's Foreign Policy": [
        (["objective of nigeria", "africa as centrepiece", "non-aligned", "non aligned", "technical aid",
          "foreign policy objective"], "Objectives and Principles of Nigeria's Foreign Policy"),
        (["peacekeep", "conflict resolution", "economic diplomacy", "trade relation", "ecomog",
          "liberia", "sierra leone"], "Nigeria's Foreign Policy in Practice"),
    ],
    "Relations with African Countries": [
        (["oau", "african union", "au", "ecowas", "ecomog", "continental affair", "africa"],
         "Nigeria's Role in Continental African Affairs"),
        (["nepad", "new partnership", "regional development", "africa development"],
         "NEPAD and Regional Development"),
    ],
    "International Organizations": [
        (["united nation", "un ", "security council", "general assembly", "un charter", "veto",
          "trusteeship", "UNESCO", "WHO", "UNICEF", "ILO"],
         "United Nations and its Specialized Agencies"),
        (["ecowas", " au ", "african union", "commonwealth", "non-aligned movement", "nam ",
          "opec", "nato", "g7", "g8", "g20"],
         "AU, ECOWAS, Commonwealth, and Other Bodies"),
    ],
}


# ──────────────────────────────────────────────────────────────
# BIOLOGY MAPPINGS
# ──────────────────────────────────────────────────────────────

BIOLOGY_TOPIC_RENAME = {
    # Ensure canonical names match syllabus JSON exactly
    "Living Organisms": "Living Organisms",
    "Evolution and Advancement of Organisms": "Evolution and Advancement of Organisms",
    "Variety of Organisms": "Variety of Organisms",
    "Internal Structure of a Flowering Plant": "Internal Structure of a Flowering Plant",
    "Nutrition": "Nutrition",
    "Transport": "Transport",
    "Respiration": "Respiration",
    "Excretion": "Excretion",
    "Support and Movement": "Support and Movement",
    "Reproduction": "Reproduction",
    "Growth": "Growth",
    "Co-ordination and Control": "Co-ordination and Control",
    "Ecology": "Ecology",
    "Genetics and Variation": "Genetics and Variation",
    # Common DB name variants
    "Genetics": "Genetics and Variation",
    "Genetics and variation": "Genetics and Variation",
    "Genetic and Variation": "Genetics and Variation",
    "Co-ordination": "Co-ordination and Control",
    "Coordination and Control": "Co-ordination and Control",
    "Coordination": "Co-ordination and Control",
    "Support & Movement": "Support and Movement",
    "Internal Structure of Flowering Plant": "Internal Structure of a Flowering Plant",
    "Structure of Flowering Plant": "Internal Structure of a Flowering Plant",
    "Cell": "Living Organisms",
    "Cell Biology": "Living Organisms",
    "Cell Structure": "Living Organisms",
    "Evolution": "Evolution and Advancement of Organisms",
    "Classification": "Variety of Organisms",
    "Taxonomy": "Variety of Organisms",
    "Photosynthesis": "Nutrition",
    "Nutrition and Feeding": "Nutrition",
    "Transport in Plants": "Transport",
    "Transport in Animals": "Transport",
    "Aerobic Respiration": "Respiration",
    "Anaerobic Respiration": "Respiration",
    "Excretion and Osmoregulation": "Excretion",
    "Sexual Reproduction": "Reproduction",
    "Asexual Reproduction": "Reproduction",
    "Growth and Development": "Growth",
    "Population Ecology": "Ecology",
    "Ecological Studies": "Ecology",
    "Heredity": "Genetics and Variation",
    "Heredity and Variation": "Genetics and Variation",
    "Mendelian Genetics": "Genetics and Variation",
}

# Subtopic keyword rules for Biology
BIOLOGY_SUBTOPIC_RULES = {
    "Living Organisms": [
        (["characteristics", "cell structure", "cell organelle", "prokaryot", "eukaryot",
          "plasma membrane", "nucleus", "mitochondria", "chloroplast"], "Cell Structure and Organisation"),
        (["classification", "kingdom", "phylum", "class", "order", "family", "genus", "species",
          "binomial", "nomenclature"], "Classification of Living Organisms"),
        (["living", "non-living", "nutrition", "respiration", "excretion", "reproduction", "movement",
          "growth", "irritability", "homeostasis"], "Characteristics of Living Organisms"),
    ],
    "Evolution and Advancement of Organisms": [
        (["darwin", "natural selection", "evolution", "adaptation", "variation", "lamarck", "survival"],
         "Theories of Evolution"),
        (["evidence of evolution", "fossil", "comparative anatomy", "homologous", "analogous",
          "embryology", "geographical distribut"], "Evidence for Evolution"),
        (["speciation", "isolat", "reproductive isolat", "allopatric", "sympatric"],
         "Mechanisms of Evolution and Speciation"),
    ],
    "Variety of Organisms": [
        (["kingdom", "monera", "protista", "fungi", "plantae", "animalia", "five kingdom",
          "classification", "virus", "bacteria", "protozoa"], "Classification of Organisms into Kingdoms"),
        (["vertebrate", "invertebrate", "annelida", "arthropoda", "mollusca", "echinodermata",
          "chordata", "mammal", "reptile", "amphibian", "fish", "bird"], "Animal Diversity"),
        (["dicot", "monocot", "bryophyta", "pteridophyta", "gymnosperm", "angiosperm", "fern", "moss"],
         "Plant Diversity"),
    ],
    "Internal Structure of a Flowering Plant": [
        (["root", "stem", "leaf", "xylem", "phloem", "cortex", "epidermis", "vascular bundle",
          "transverse section", "cross section"], "Tissues and Vascular System"),
        (["mineral", "fertilizer", "npk", "nitrate", "phosphate", "potassium", "deficiency",
          "mineral salt"], "Mineral Nutrition and Soil"),
    ],
    "Nutrition": [
        (["photosynthesis", "chlorophyll", "light reaction", "dark reaction", "carbon dioxid",
          "glucose", "autotroph", "heterotroph"], "Photosynthesis and Autotrophic Nutrition"),
        (["digestion", "enzyme", "carbohydrate", "protein", "fat", "lipid", "vitamin", "mineral",
          "balanced diet", "alimentary canal", "stomach", "intestine", "mouth", "amylase", "pepsin"],
         "Heterotrophic and Holozoic Nutrition"),
        (["symbiosis", "parasiti", "mutualism", "commensalism", "saprophyt"],
         "Saprophytic and Parasitic Nutrition"),
    ],
    "Transport": [
        (["xylem", "phloem", "translocation", "transpiration", "osmosis", "root pressure",
          "cohesion tension", "water potential", "diffusion"], "Transport in Plants"),
        (["blood", "heart", "artery", "vein", "capillary", "haemoglobin", "red blood cell",
          "circulat", "cardiac cycle", "pulse", "blood pressure", "lymph"],
         "Transport in Animals (Circulatory System)"),
    ],
    "Respiration": [
        (["aerobic", "krebs cycle", "oxidative phosphorylation", "mitochondria", "atp", "oxygen",
          "glucose oxidat", "energy release"], "Aerobic Respiration"),
        (["anaerobic", "fermentation", "lactic acid", "ethanol", "oxygen debt", "yeast",
          "without oxygen"], "Anaerobic Respiration and Fermentation"),
    ],
    "Excretion": [
        (["kidney", "nephron", "urine", "urea", "filtration", "reabsorption", "ureter", "bladder",
          "glomerulus", "bowman", "osmoregulat"], "Excretion in Animals (Kidney)"),
        (["lung", "skin excretion", "stomata", "plant excretion", "liver", "bile", "sweating",
          "nitrogenous waste", "ammonia"], "Excretion in Plants and Other Organs"),
    ],
    "Support and Movement": [
        (["skeleton", "bone", "cartilage", "joint", "ligament", "tendon", "endoskeleton", "exoskeleton",
          "vertebrae", "skull", "femur", "tibia"], "Skeletal System and Support"),
        (["muscle", "contraction", "antagonistic", "flexor", "extensor", "locomotion",
          "movement in plant", "tropism", "turgidity"], "Muscular System and Movement"),
    ],
    "Reproduction": [
        (["asexual", "binary fission", "budding", "vegetative propagat", "spore",
          "fragmentation", "parthenogenesis"], "Asexual Reproduction"),
        (["sexual", "gamete", "fertilisation", "flower", "pollination", "seed", "fruit",
          "meiosis", "ovum", "sperm", "menstrual", "pregnancy", "gestation", "placenta"],
         "Sexual Reproduction"),
    ],
    "Growth": [
        (["sigmoid", "growth curve", "growth rate", "meristem", "primary growth",
          "germination", "seed germination", "epigeal", "hypogeal"], "Growth and Development"),
        (["metamorphosis", "complete metamorphosis", "incomplete metamorphosis", "larva",
          "pupa", "secondary growth", "cambium", "annual ring"],
         "Metamorphosis, Regeneration, and Secondary Growth"),
    ],
    "Co-ordination and Control": [
        (["nervous system", "neuron", "nerve", "reflex arc", "synapse", "brain", "spinal cord",
          "sense organ", "eye", "ear", "receptor", "stimulus"], "The Nervous System"),
        (["hormone", "insulin", "glucagon", "adrenaline", "thyroxine", "endocrine", "pituitary",
          "pancreas", "oestrogen", "testosterone", "homeostasis"],
         "Hormonal Co-ordination"),
    ],
    "Ecology": [
        (["ecosystem", "community", "population", "habitat", "niche", "abiotic", "biotic", "food chain",
          "food web", "energy flow", "trophic", "producer", "consumer", "decomposer"], "Ecosystem and Energy Flow"),
        (["population growth", "competition", "predation", "carrying capacity", "birth rate",
          "death rate", "density", "biotic potential", "ecological succession"], "Population Ecology"),
        (["conservation", "pollution", "deforestation", "erosion", "overgrazing", "biodiversity",
          "endangered", "renewable", "non-renewable"], "Conservation and Environmental Management"),
        (["nutrient cycle", "nitrogen cycle", "carbon cycle", "water cycle", "phosphorus cycle",
          "decompos"], "Nutrient Cycling"),
    ],
    "Genetics and Variation": [
        (["mendel", "monohybrid", "dihybrid", "dominant", "recessive", "phenotype", "genotype",
          "allele", "heterozygous", "homozygous", "ratio", "punnet"], "Mendelian Genetics"),
        (["dna", "rna", "gene", "chromosome", "mutation", "continuous variation", "discontinuous",
          "sex-linked", "blood group", "down syndrome", "sickle cell"],
         "DNA, Chromosomes, and Variation"),
    ],
}


# ──────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────

def _match_subtopic(text: str, rules: list) -> Optional[str]:
    """Return the first subtopic name whose keywords appear in text."""
    text_l = text.lower()
    for keywords, subtopic in rules:
        if any(kw.lower() in text_l for kw in keywords):
            return subtopic
    return None


def _retag_subject(conn, subject: str, topic_rename: dict,
                   subtopic_rules: dict, dry_run: bool):
    cur = conn.cursor()

    # Fetch all questions for subject
    cur.execute("""
        SELECT id, question, topic, subtopic
        FROM questions
        WHERE exam='JAMB' AND subject=%s
    """, (subject,))
    rows = cur.fetchall()
    print(f"\n{'='*60}")
    print(f"{subject.upper()}: {len(rows)} questions found")
    print(f"{'='*60}")

    old_topics = Counter(r[2] for r in rows)
    print(f"\nDistinct topics currently in DB ({len(old_topics)}):")
    for t, c in sorted(old_topics.items(), key=lambda x: -x[1]):
        mapped = topic_rename.get(t, f"[UNMAPPED] {t}")
        if mapped == t:
            print(f"  ✓  {t!r:<70} ({c})")
        else:
            print(f"  →  {t!r:<70} ({c}) → {mapped!r}")

    if dry_run:
        print("\n[dry-run] No changes made.")
        return

    updated = 0
    subtopic_miss = 0

    for qid, question, old_topic, _old_sub in rows:
        new_topic = topic_rename.get(old_topic)
        if new_topic is None:
            # Strip trailing colon as generic fallback
            stripped = old_topic.rstrip(":").strip()
            new_topic = topic_rename.get(stripped, stripped)

        rules = subtopic_rules.get(new_topic, [])
        combined_text = (question or "")
        new_subtopic = _match_subtopic(combined_text, rules) if rules else None
        if rules and new_subtopic is None:
            # Assign first subtopic as default
            new_subtopic = rules[0][1]
            subtopic_miss += 1

        if new_topic != old_topic or new_subtopic != _old_sub:
            cur.execute("""
                UPDATE questions SET topic=%s, subtopic=%s WHERE id=%s
            """, (new_topic, new_subtopic, qid))
            updated += 1

    conn.commit()
    print(f"\nUpdated {updated}/{len(rows)} questions.")
    print(f"Subtopic keyword misses (fell back to first): {subtopic_miss}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--subject", default="both",
                        choices=["Biology", "Government", "both"])
    args = parser.parse_args()

    conn = get_connection()

    subjects = []
    if args.subject in ("Biology", "both"):
        subjects.append(("Biology", BIOLOGY_TOPIC_RENAME, BIOLOGY_SUBTOPIC_RULES))
    if args.subject in ("Government", "both"):
        subjects.append(("Government", GOVERNMENT_TOPIC_RENAME, GOVERNMENT_SUBTOPIC_RULES))

    for subj, rename, rules in subjects:
        _retag_subject(conn, subj, rename, rules, args.dry_run)

    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
