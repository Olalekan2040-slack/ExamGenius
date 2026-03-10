"""
retag_biology_government.py
---------------------------
Re-tags Biology and Government questions in the PostgreSQL DB.

The DB currently stores broad SECTION names (e.g. 'B: Form and Functions',
'Part I: Elements of Government'). This script uses keyword analysis on the
question text to assign each question a specific TOPIC and SUBTOPIC that
matches the rebuilt syllabus JSONs.

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
# BIOLOGY — section → (topic, subtopic) keyword rules
# ──────────────────────────────────────────────────────────────
# Each rule: (keywords_list, topic_name, subtopic_name)

BIOLOGY_RULES = {
    "A: Variety of Organisms": [
        (["cell organelle", "cell membrane", "plasma membrane", "cell wall", "cytoplasm",
          "nucleus", "mitochondria", "chloroplast", "ribosome", "vacuole", "endoplasmic",
          "golgi", "prokaryot", "eukaryot", "cell structure", "cell theory",
          "characteristics of living", "living thing", "irritability", "homeostasis"],
         "Living Organisms", "Cell Structure and Organisation"),
        (["classification", "kingdom", "phylum", "class", "order", "family", "genus", "species",
          "binomial", "nomenclature", "taxonomy", "five kingdom", "monera", "protista",
          "fungi", "plantae", "animalia", "virus", "bacteria", "protozoa"],
         "Variety of Organisms", "Classification of Organisms into Kingdoms"),
        (["vertebrate", "invertebrate", "annelida", "arthropod", "mollusca", "echinoderm",
          "chordata", "mammal", "reptile", "amphibian", "fish", "bird", "insect", "worm"],
         "Variety of Organisms", "Animal Diversity"),
        (["dicot", "monocot", "bryophyta", "pteridoph", "gymnosperm", "angiosperm", "fern", "moss",
          "dicotyledon", "monocotyledon"],
         "Variety of Organisms", "Plant Diversity"),
        (["darwin", "natural selection", "evolution", "lamarck", "adaptation", "survival of",
          "speciation", "fossil", "homologous", "analogous", "comparative anatomy",
          "embryolog", "geographical distribut"],
         "Evolution and Advancement of Organisms", "Theories of Evolution"),
    ],

    "B: Form and Functions": [
        (["root hair", "root tip", "cortex of root", "vascular bundle", "xylem", "phloem",
          "stem structure", "leaf structure", "transverse section", "cross section of",
          "mineral salt", "deficiency", "npk", "fertilizer"],
         "Internal Structure of a Flowering Plant", "Tissues and Vascular System"),
        (["photosynthesis", "chlorophyll", "light reaction", "dark reaction", "calvin",
          "carbon dioxide fixation", "autotroph", "heterotroph", "producer"],
         "Nutrition", "Photosynthesis and Autotrophic Nutrition"),
        (["digestion", "alimentary canal", "stomach", "intestine", "oesophag", "liver",
          "pancreas", "enzyme", "carbohydrate", "protein", "fat", "lipid", "vitamin",
          "balanced diet", "amylase", "pepsin", "lipase", "bile", "absorption of food",
          "peristalsis", "villus", "villi"],
         "Nutrition", "Heterotrophic and Holozoic Nutrition"),
        (["symbiosis", "parasiti", "mutualism", "commensalism", "saprophyt", "holozoic",
          "saprophytic mode"],
         "Nutrition", "Saprophytic and Parasitic Nutrition"),
        (["transpiration", "translocation", "root pressure", "cohesion tension", "osmosis",
          "water potential", "turgor", "plasmolysis", "xylem transport", "phloem transport"],
         "Transport", "Transport in Plants"),
        (["blood", "heart", "artery", "vein", "capillary", "haemoglobin", "red blood cell",
          "white blood cell", "platelet", "circulat", "cardiac cycle", "pulse",
          "blood pressure", "lymph", "aorta", "atrium", "ventricle", "valve"],
         "Transport", "Transport in Animals (Circulatory System)"),
        (["aerobic", "krebs cycle", "oxidative phosphorylation", "atp", "energy release",
          "oxygen consumption", "glucose oxidat", "pyruvate", "acetyl coa"],
         "Respiration", "Aerobic Respiration"),
        (["anaerobic", "fermentation", "lactic acid", "ethanol", "oxygen debt", "yeast",
          "without oxygen", "anaerobic respiration"],
         "Respiration", "Anaerobic Respiration and Fermentation"),
        (["kidney", "nephron", "urine", "urea", "glomerulus", "bowman", "ureter", "bladder",
          "renal", "filtration", "reabsorption", "osmoregulat"],
         "Excretion", "Excretion in Animals (Kidney)"),
        (["lung excret", "skin excret", "stomata", "plant excret", "sweat gland",
          "nitrogenous waste", "ammonia", "uric acid"],
         "Excretion", "Excretion in Plants and Other Organs"),
        (["skeleton", "bone", "cartilage", "joint", "ligament", "tendon", "endoskeleton",
          "exoskeleton", "vertebrae", "skull", "femur", "tibia", "hinge joint", "ball socket"],
         "Support and Movement", "Skeletal System and Support"),
        (["muscle", "contraction", "antagonistic", "flexor", "extensor", "locomotion",
          "tropism", "turgidity", "muscular"],
         "Support and Movement", "Muscular System and Movement"),
        (["asexual reproduct", "binary fission", "budding", "vegetative propagat", "spore",
          "fragmentation", "parthenogenesis"],
         "Reproduction", "Asexual Reproduction"),
        (["sexual reproduct", "gamete", "fertilisation", "fertilization", "flower", "pollination",
          "seed", "fruit", "meiosis", "ovum", "sperm", "menstrual", "pregnancy", "gestation",
          "placenta", "embryo", "ovule", "stamen", "pistil", "pollen"],
         "Reproduction", "Sexual Reproduction"),
        (["sigmoid", "growth curve", "growth rate", "germination", "epigeal", "hypogeal",
          "seed germination"],
         "Growth", "Growth and Development"),
        (["metamorphosis", "complete metamorphosis", "incomplete metamorphosis", "larva",
          "pupa", "secondary growth", "cambium", "annual ring", "meristem"],
         "Growth", "Metamorphosis, Regeneration, and Secondary Growth"),
        (["nervous system", "neuron", "nerve", "reflex arc", "synapse", "brain", "spinal cord",
          "sense organ", "eye", "ear", "receptor", "stimulus", "effector", "impulse"],
         "Co-ordination and Control", "The Nervous System"),
        (["hormone", "insulin", "glucagon", "adrenaline", "thyroxine", "endocrine", "pituitary",
          "oestrogen", "testosterone", "homeostasis", "oxytocin"],
         "Co-ordination and Control", "Hormonal Co-ordination"),
    ],

    "C: Ecology": [
        (["ecosystem", "community", "population", "habitat", "niche", "abiotic", "biotic",
          "food chain", "food web", "energy flow", "trophic", "producer", "consumer",
          "decomposer", "pyramid of number", "pyramid of biomass"],
         "Ecology", "Ecosystem and Energy Flow"),
        (["population growth", "competition", "predation", "carrying capacity", "birth rate",
          "death rate", "density", "biotic potential", "ecological succession"],
         "Ecology", "Population Ecology"),
        (["conservation", "pollution", "deforestation", "erosion", "overgrazing", "biodiversity",
          "endangered", "renewable", "non-renewable", "afforestation"],
         "Ecology", "Conservation and Environmental Management"),
        (["nutrient cycle", "nitrogen cycle", "carbon cycle", "water cycle", "phosphorus",
          "decompos", "cycling of"],
         "Ecology", "Nutrient Cycling"),
    ],

    "D: Heredity and Variations": [
        (["mendel", "monohybrid", "dihybrid", "dominant", "recessive", "phenotype", "genotype",
          "allele", "heterozygous", "homozygous", "ratio", "punnett", "f1", "f2",
          "law of segregation", "law of independent"],
         "Genetics and Variation", "Mendelian Genetics"),
        (["dna", "rna", "gene", "chromosome", "mutation", "continuous variation",
          "discontinuous", "sex-linked", "blood group", "down syndrome", "sickle cell",
          "sex determination", "x chromosome", "y chromosome"],
         "Genetics and Variation", "DNA, Chromosomes, and Variation"),
    ],

    "E: Evolution": [
        (["darwin", "natural selection", "evolution", "lamarck", "adaptation", "survival of",
          "speciation", "fossil", "homologous", "analogous", "comparative anatomy",
          "embryolog", "geographical distribut", "organic evolution"],
         "Evolution and Advancement of Organisms", "Theories of Evolution"),
        (["fossil record", "palaeontolog", "radiocarbon", "geological", "sedimentary rock",
          "vestigial", "biogeograph"],
         "Evolution and Advancement of Organisms", "Evidence for Evolution"),
    ],
}

BIOLOGY_SECTION_DEFAULTS = {
    "A: Variety of Organisms": ("Variety of Organisms", "Classification of Organisms into Kingdoms"),
    "B: Form and Functions": ("Nutrition", "Heterotrophic and Holozoic Nutrition"),
    "C: Ecology": ("Ecology", "Ecosystem and Energy Flow"),
    "D: Heredity and Variations": ("Genetics and Variation", "Mendelian Genetics"),
    "E: Evolution": ("Evolution and Advancement of Organisms", "Theories of Evolution"),
}


# ──────────────────────────────────────────────────────────────
# GOVERNMENT — section → (topic, subtopic) keyword rules
# ──────────────────────────────────────────────────────────────

GOVERNMENT_RULES = {
    "Part I: Elements of Government": [
        (["power", "authority", "legitimacy", "sovereignty", "political culture",
          "political socialization", "society", "nation-state", "charismatic",
          "legal-rational"],
         "Basic Concepts in Government", "Power, Authority, Legitimacy, and Sovereignty"),
        (["democracy", "monarchy", "oligarchy", "aristocracy", "theocracy", "direct democracy",
          "representative democracy", "totalitarian", "fascism", "autocracy", "dictatorship",
          "form of government"],
         "Forms of Government", "Democratic and Non-Democratic Systems"),
        (["legislature", "parliament", "national assembly", "house of rep", "senate",
          "executive", "cabinet", "prime minister", "arm of government",
          "judiciary", "court", "judge", "separation of power", "checks and balance"],
         "Arms of Government", "Legislature and Executive"),
        (["unitary", "federalism", "federal state", "central government", "devol",
          "confederal"],
         "Structures of Governance", "Unitary and Federal Systems"),
        (["presidential system", "parliamentary system", "fusion of power",
          "constitutional monarchy", "hybrid system"],
         "Systems of Governance", "Presidential and Parliamentary Systems"),
        (["capitalism", "socialism", "communism", "marxis", "mode of production", "liberalism",
          "conservatism", "fascist ideolog"],
         "Political Ideologies", "Capitalism, Socialism, and Communism"),
        (["constitution", "written constitution", "unwritten constitution", "rigid",
          "flexible constitution", "constitutional", "source of constitution", "entrench",
          "amendment"],
         "Constitution", "Definition, Sources, and Functions of Constitutions"),
        (["rule of law", "fundamental right", "constitutionalism", "habeas corpus",
          "equality before the law", "democratic principle"],
         "Principles of Democratic Government",
         "Rule of Law, Fundamental Rights, and Constitutionalism"),
        (["bill", "law making", "stage of a bill", "first reading", "second reading",
          "third reading", "delegated legislation", "statutory instrument", "bye-law"],
         "Processes of Legislation", "Stages of a Bill"),
        (["citizenship", "naturaliz", "birth right", "jus soli", "jus sanguinis",
          "alien", "stateless", "rights of citizens", "civic duty"],
         "Citizenship", "Acquisition and Loss of Citizenship"),
        (["franchise", "suffrage", "universal adult", "proportional representation",
          "first-past-the-post", "electoral system", "electoral commission",
          "inec", "voter", "electoral", "ballot"],
         "The Electoral Process", "Franchise and Electoral Systems"),
        (["political party", "one-party", "two-party", "multi-party", "party system",
          "party manifesto", "party organization"],
         "Political Parties and Party Systems",
         "Functions and Organization of Political Parties"),
        (["pressure group", "interest group", "lobby", "protective group", "promotional group"],
         "Pressure Groups", "Functions and Modus Operandi of Pressure Groups"),
        (["public opinion", "poll", "survey", "propaganda", "formation of public opinion"],
         "Public Opinion", "Formation and Measurement of Public Opinion"),
        (["civil service", "bureaucracy", "civil servant", "neutrality of civil", "permanence",
          "anonymity", "merit", "hierarchy of civil"],
         "The Civil Service",
         "Structure, Functions, and Principles of the Civil Service"),
    ],

    "Part II: Political Development in Nigeria": [
        (["hausa", "yoruba", "igbo", "fulani", "emirate", "oyo", "benin kingdom", "tiv",
          "nupe", "kanuri", "pre-colonial", "pre colonial", "traditional ruler",
          "segmentar", "acephalous"],
         "Pre-colonial Polities", "Hausa, Yoruba, and Igbo Pre-colonial Systems"),
        (["indirect rule", "assimilation", "lugard", "amalgamation", "1914",
          "british colonial", "french colonial", "colonial policy", "protectorate"],
         "Imperialist Penetration", "British and French Colonial Policies"),
        (["nationalism", "decolonization", "nationalist", "nnamdi azikiwe", "awolowo",
          "ahmadu bello", "pan-africa", "independence movement"],
         "Process of Decolonization", "Nationalism and Independence Movements"),
        (["clifford constitution", "richards constitution", "macpherson constitution",
          "lyttleton constitution", "1922", "1946", "1951", "1954",
          "constitutional development", "1960 constitution"],
         "Constitutional Development in Nigeria",
         "Clifford, Richards, and Macpherson Constitutions"),
        (["1963 constitution", "1979 constitution", "1989 constitution", "1999 constitution",
          "republican constitution", "decree 34", "second republic", "third republic",
          "fourth republic", "post-independence constitution"],
         "Post-Independence Constitutions",
         "Republican Constitution of 1963 and Decree 34 of 1966"),
        (["public commission", "inec commission", "rmafc", "federal character commission",
          "revenue mobilization"],
         "Public Commissions in Nigeria",
         "Functions and Operations of Public Commissions"),
        (["ncnc", "ag ", "npc ", "npp ", "gnpp", "npn ",  "pdp", "apc",
          "all progressives", "first republic party", "second republic party",
          "political party in nigeria"],
         "Political Parties in Post-Independence Nigeria",
         "First and Second Republic Political Parties"),
        (["federalism", "exclusive list", "concurrent list", "residual list",
          "revenue allocation", "nigerian federalism", "fiscal federalism",
          "resource control", "derivation"],
         "Structure and Workings of Nigerian Federalism",
         "Features and Principles of Nigerian Federalism"),
        (["public corporation", "parastatal", "nnpc", "nepa", "npa", "privatiz",
          "commercializ", "deregulation", "public enterprise"],
         "Public Corporations and Parastatals",
         "Operations and Purpose of Public Corporations"),
        (["local government", "local council", "1976 reform", "grassroot", "local authority"],
         "Local Government",
         "Evolution, Structure, and Functions of Local Government"),
        (["military coup", "coup d'etat", "military rule", "military intervention",
          "military regime", "january 1966", "july 1966", "december 1983",
          "august 1985", "military government"],
         "The Military in Nigerian Politics", "Reasons for Military Intervention"),
        # Fallback for Part II
        (["national assembly", "senate", "house of rep", "president of nigeria",
          "state governor", "supreme court of nigeria"],
         "Institutions of Government in Post-Independence Nigeria",
         "Legislature, Executive, and Judiciary in Post-Independence Nigeria"),
    ],

    "Part III: Foreign Policy and Nigeria's International Relations": [
        (["determinant of foreign policy", "definition of foreign policy",
          "instrument of foreign", "national interest", "diplomacy"],
         "Foreign Policy", "Definition and Determinants of Foreign Policy"),
        (["nigeria's foreign policy", "nigeria foreign policy", "nigerian foreign",
          "africa as centrepiece", "non-aligned", "peacekeep", "ecomog",
          "liberia", "sierra leone"],
         "Nigeria's Foreign Policy",
         "Objectives and Principles of Nigeria's Foreign Policy"),
        (["ecowas", "oau", "african union", "nepad", "continental affair",
          "nigeria and africa", "relations with africa"],
         "Relations with African Countries",
         "Nigeria's Role in Continental African Affairs"),
    ],

    "Part IV: International Organizations": [
        (["united nation", "security council", "general assembly", "un charter",
          "veto power", "trustee", "UNESCO", "WHO", "UNICEF", "ILO", "IMF",
          "world bank"],
         "International Organizations", "United Nations and its Specialized Agencies"),
        (["ecowas", "african union", "commonwealth", "non-aligned movement",
          "nam ", "opec", "nato", "g7", "g8", "g20"],
         "International Organizations", "AU, ECOWAS, Commonwealth, and Other Bodies"),
    ],
}

GOVERNMENT_SECTION_DEFAULTS = {
    "Part I: Elements of Government": (
        "Arms of Government", "Legislature and Executive"),
    "Part II: Political Development in Nigeria": (
        "Post-Independence Constitutions", "1979, 1989, and 1999 Constitutions"),
    "Part III: Foreign Policy and Nigeria's International Relations": (
        "Nigeria's Foreign Policy",
        "Objectives and Principles of Nigeria's Foreign Policy"),
    "Part IV: International Organizations": (
        "International Organizations", "United Nations and its Specialized Agencies"),
}


# ──────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────

def _classify(text: str, rules: list, default: tuple) -> tuple:
    """Return (topic, subtopic) by keyword matching; fall back to default."""
    text_l = text.lower()
    for keywords, topic, subtopic in rules:
        if any(kw.lower() in text_l for kw in keywords):
            return topic, subtopic
    return default


def _retag_subject(conn, subject: str, section_rules: dict,
                   section_defaults: dict, dry_run: bool) -> None:
    cur = conn.cursor()

    cur.execute("""
        SELECT id, question, topic, subtopic
        FROM questions
        WHERE exam='JAMB' AND subject=%s
    """, (subject,))
    rows = cur.fetchall()

    print(f"\n{'='*60}")
    print(f"{subject.upper()}: {len(rows)} questions found")
    print(f"{'='*60}")

    section_counts = Counter(r[2] for r in rows)
    print(f"\nSections in DB ({len(section_counts)}):")
    for s, c in sorted(section_counts.items(), key=lambda x: -x[1]):
        status = "MAPPED  " if s in section_rules else "UNMAPPED"
        print(f"  {status}  {s!r:<72} ({c})")

    if dry_run:
        print("\nSample topic classification (up to 5 topics per section):")
        for section, rules in section_rules.items():
            sec_rows = [r for r in rows if r[2] == section]
            if not sec_rows:
                continue
            default = section_defaults.get(section, ("Unknown", "Unknown"))
            topic_counter: Counter = Counter()
            for _, q, _, _ in sec_rows:
                t, _ = _classify(q or "", rules, default)
                topic_counter[t] += 1
            print(f"\n  Section: {section!r} ({len(sec_rows)} qs)")
            for t, c in topic_counter.most_common(8):
                print(f"    → {t!r}: {c}")
        print("\n[dry-run] No changes made.")
        return

    updated = 0
    for qid, question, old_topic, _old_sub in rows:
        rules = section_rules.get(old_topic)
        default = section_defaults.get(old_topic, (old_topic, old_topic))

        if rules is None:
            continue   # section not in our map — leave unchanged

        new_topic, new_subtopic = _classify(question or "", rules, default)

        if new_topic != old_topic or new_subtopic != _old_sub:
            cur.execute("""
                UPDATE questions SET topic=%s, subtopic=%s WHERE id=%s
            """, (new_topic, new_subtopic, qid))
            updated += 1

    conn.commit()
    print(f"\nUpdated {updated}/{len(rows)} questions.")
    print("New topic distribution:")
    cur.execute("""
        SELECT topic, count(*) FROM questions
        WHERE exam='JAMB' AND subject=%s
        GROUP BY topic ORDER BY count(*) DESC
    """, (subject,))
    for row in cur.fetchall():
        print(f"  {row[0]!r:<60} {row[1]}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--subject", default="both",
                        choices=["Biology", "Government", "both"])
    args = parser.parse_args()

    conn = get_connection()

    subjects = []
    if args.subject in ("Biology", "both"):
        subjects.append(("Biology", BIOLOGY_RULES, BIOLOGY_SECTION_DEFAULTS))
    if args.subject in ("Government", "both"):
        subjects.append(("Government", GOVERNMENT_RULES, GOVERNMENT_SECTION_DEFAULTS))

    for subj, rules, defaults in subjects:
        _retag_subject(conn, subj, rules, defaults, args.dry_run)

    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
