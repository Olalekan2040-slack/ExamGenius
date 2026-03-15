"""
retag_remaining_subjects.py
---------------------------
Re-tags Mathematics, English Language, Literature in English, Economics,
Commerce, and Geography questions in the PostgreSQL DB so that q.topic
matches the exact topic names in the rebuilt syllabus JSONs.

Strategy: keyword matching on question text + existing (broad) topic label.
For Commerce/Geography which have empty topic strings we rely entirely on
question-text keyword matching.

Run from project root:
    python scripts/retag_remaining_subjects.py

Flags:
    --dry-run         Print coverage report only, make no DB changes
    --subject NAME    Process only one subject (default: all six)
"""

import sys
import re
import argparse
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection


# ════════════════════════════════════════════════════════════════
# MATHEMATICS
# Broad DB topics: "Section I: Number and Numeration" …"Section V: Statistics"
# Target: 17 JAMB syllabus topic names
# ════════════════════════════════════════════════════════════════

MATH_RULES = [
    # (keywords, topic, subtopic)
    # ── Section I – Number and Numeration ──────────────────────
    (["number base", "base 10", "base 8", "base 2", "base 5", "convert.*base",
      "octal", "binary", "hexadecimal", "denary"],
     "Number Bases", "Number Base Conversion"),

    (["fraction", "decimal", "percentage", "approximat", "recurring decimal",
      "significant figure", "decimal place", "ratio", "proportion",
      "profit and loss", "simple interest", "compound interest", "discount",
      "commission", "hire purchase", "value added tax", "vat"],
     "Fractions, Decimals, Approximations and Percentages",
     "Fractions and Percentages"),

    (["index", "indices", "logarithm", "log ", "log10", "antilog", "surd",
      "square root of", "cube root", "exponent", "laws of indices", "index form"],
     "Indices, Logarithms and Surds", "Laws of Indices"),

    (["set", "union", "intersection", "subset", "complement", "venn diagram",
      "universal set", "empty set", "null set", "element.*set", "roster"],
     "Sets", "Set Theory"),

    # ── Section II – Algebra ──────────────────────────────────
    (["polynomial", "factor theorem", "remainder theorem", "synthetic division",
      "degree of polynomial", "algebraic expression"],
     "Polynomials", "Factor Theorem"),

    (["variation", "direct variation", "inverse variation", "joint variation",
      "partial variation", "varies directly", "varies inversely"],
     "Variation", "Direct and Inverse Variation"),

    (["inequalit", "inequality", "linear inequality", "quadratic inequality",
      "number line", "solution set"],
     "Inequalities", "Linear Inequalities"),

    (["arithmetic progression", "geometric progression", "common difference",
      "common ratio", "nth term", "sum of n terms", "a.p", "g.p",
      "ap and gp", "tn ="],
     "Progression", "Arithmetic and Geometric Progressions"),

    (["binary operation", "closure", "associative", "commutative", "distributive",
      "identity element", "inverse element", "modulo"],
     "Binary Operations", "Properties of Binary Operations"),

    (["matrix", "matrices", "determinant", "inverse matrix", "transpose",
      "2x2 matrix", "singular matrix"],
     "Matrices and Determinants", "Matrix Operations"),

    (["simultaneous equation", "quadratic equation", "linear equation",
      "complete the square", "discriminant", "roots of equation", "word problem"],
     "Polynomials", "Equations and Word Problems"),

    # ── Section III – Geometry and Trigonometry ───────────────
    (["triangle", "angle", "circle theorem", "polygon", "quadrilateral",
      "parallel line", "transversal", "exterior angle", "interior angle",
      "similar triangle", "congruent", "bisect", "perpendicular", "proof"],
     "Euclidean Geometry", "Triangles and Circle Theorems"),

    (["area of", "volume of", "perimeter", "circumference", "surface area",
      "cylinder", "cone", "sphere", "pyramid", "cube", "cuboid",
      "trapezium", "mensuration"],
     "Mensuration", "Areas and Volumes"),

    (["locus", "loci", "equidistant", "set of points", "path of a point"],
     "Loci", "Loci Constructions"),

    (["gradient", "midpoint", "distance between", "coordinate", "straight line",
      "equation of a line", "x-intercept", "y-intercept", "slope"],
     "Coordinate Geometry", "Straight Line Geometry"),

    (["sin", "cos", "tan", "trigonometry", "trigonometric", "bearing",
      "elevation", "depression", "soh cah toa", "pythagoras", "right angle",
      "angle of elevation", "angle of depression"],
     "Trigonometry", "Trigonometric Ratios"),

    # ── Section IV – Calculus ─────────────────────────────────
    (["differentiat", "dy/dx", "derivative", "gradient function", "rate of change",
      "maximum", "minimum", "turning point", "integrate", "integration",
      "area under curve", "definite integral", "calculus"],
     "Calculus", "Differentiation and Integration"),

    # ── Section V – Statistics ────────────────────────────────
    (["mean", "median", "mode", "frequency", "histogram", "bar chart",
      "pie chart", "cumulative frequency", "ogive", "standard deviation",
      "variance", "probability", "range", "interquartile", "statistics",
      "average"],
     "Statistics", "Statistics and Probability"),
]

# ════════════════════════════════════════════════════════════════
# ENGLISH LANGUAGE
# Broad DB topics: "Section A: Comprehension and Summary",
#   "Section B: Lexis and Structure", "Section C: Oral Forms",
#   "Section D: Literature (The Life Changer)"
# ════════════════════════════════════════════════════════════════

ENGLISH_RULES = [
    # Comprehension / Summary
    (["passage", "according to the passage", "writer.*suggest", "summary",
      "main idea", "author.*attitude", "tone of the passage", "the passage"],
     "Comprehension", "Reading for Comprehension"),

    # Oral / Phonology
    (["stress", "syllable", "vowel", "consonant", "phoneme", "diphthong",
      "intonation", "phonology", "pronounc", "nasal", "fricative", "plosive",
      "rhyme", "alliteration", "sound"],
     "Phonology and Sound Patterns", "English Vowel Sounds"),

    # Figures of speech
    (["figure of speech", "simile", "metaphor", "personification",
      "hyperbole", "irony", "oxymoron", "synecdoche", "metonymy",
      "onomatopoeia", "assonance", "alliteration as a figure", "litotes"],
     "Figures of Speech and Literary Devices", "Figures of Speech"),

    # Concord / agreement
    (["concord", "subject.verb agreement", "agreement", "collective noun",
      "neither.*nor", "either.*or", "verb form", "has or have", "is or are"],
     "Concord and Agreement", "Subject-Verb Concord"),

    # Tenses
    (["tense", "past tense", "present tense", "future tense", "perfect",
      "progressive", "had been", "has been", "will have"],
     "Grammar: Parts of Speech", "Verbs and Tenses"),

    # Parts of speech – pronouns / nouns
    (["pronoun", "antecedent", "himself", "herself", "themselves",
      "who or whom", "whose", "relative pronoun"],
     "Grammar: Parts of Speech", "Nouns and Pronouns"),

    # Parts of speech – adjectives / adverbs
    (["adjective", "adverb", "comparative", "superlative", "more", "most",
      "modify", "attribute"],
     "Grammar: Parts of Speech", "Adjectives and Adverbs"),

    # Clauses
    (["clause", "main clause", "subordinate", "relative clause", "noun clause",
      "adjectival clause", "adverbial clause", "defining clause"],
     "Grammar: Clauses and Phrases", "Clauses"),

    # Vocabulary – contextual
    (["closest in meaning", "opposite in meaning", "synonym", "antonym",
      "word that best", "phrase that best", "fill in.*blank", "vocabulary",
      "collocation", "phrasal verb", "idiom"],
     "Lexis and Structure", "Vocabulary in Context"),

    # Writing / composition
    (["letter", "formal letter", "report", "speech", "essay", "writing",
      "paragraph", "composition"],
     "Written Composition", "Formal Writing"),
]

# ════════════════════════════════════════════════════════════════
# LITERATURE IN ENGLISH
# Broad DB topics: "Section 1: Drama", "Section 2: Prose",
#   "Section 3: Poetry", "Section 4: General Literary Principles",
#   "Section 5: Literary Appreciation"
# ════════════════════════════════════════════════════════════════

LITERATURE_RULES = [
    # Drama
    (["play", "playwright", "drama", "tragedy", "comedy", "protagonist",
      "antagonist", "soliloquy", "aside", "scene", "act", "stage direction",
      "dramatic irony", "dialogue"],
     "Drama", "Types of Drama"),

    # Poetry
    (["poem", "poet", "poetry", "rhyme", "rhyme scheme", "stanza", "verse",
      "sonnet", "ode", "ballad", "lyric", "metaphor.*poem", "imagery.*poem",
      "persona"],
     "Poetry", "Types of Poetry"),

    # Prose
    (["novel", "novella", "fiction", "narrator", "narrative", "plot",
      "climax", "denouement", "setting", "characteris", "prose", "chapter"],
     "Prose", "Types of Prose"),

    # Figures of speech / literary devices
    (["simile", "metaphor", "personification", "hyperbole", "irony",
      "symbolism", "allusion", "oxymoron", "onomatopoeia", "figure of speech",
      "literary device"],
     "Aspects of Literature", "Language and Style"),

    # Theme / plot / conflict
    (["theme", "conflict", "plot", "exposition", "rising action", "resolution",
      "man vs", "antagonist", "protagonist"],
     "Aspects of Literature", "Theme, Plot, and Setting"),

    # Appreciation / evaluation
    (["appreciation", "evaluate", "critical", "diction", "tone", "mood",
      "passage.*discuss", "comment on"],
     "Literary Appreciation", "Critical Evaluation"),

    # African literature
    (["african", "chinua achebe", "soyinka", "ngugi", "emecheta",
      "post.colonial", "nigeria", "colonialism", "identity.*literature"],
     "Literary Appreciation", "African Literature"),
]

# ════════════════════════════════════════════════════════════════
# ECONOMICS
# Broad DB topics: "Section 1: Basic Concepts and Microeconomics"
#   "Section 2: Macroeconomics and Finance"
#   "Section 3: Nigerian Economy and Development"
#   "Section 4: International Economics"
# ════════════════════════════════════════════════════════════════

ECONOMICS_RULES = [
    # Intro / scarcity / PPF
    (["scarcity", "choice", "scale of preference", "opportunity cost",
      "production possibility", "ppf", "economic problem", "wants",
      "economics is", "microeconomics", "macroeconomics"],
     "Introduction to Economics", "Definition and Scope of Economics"),

    # Demand
    (["demand", "law of demand", "demand curve", "quantity demanded",
      "demand schedule", "demand elasticity", "price elasticity of demand",
      "income elasticity", "cross elasticity", "inferior good",
      "giffen good", "normal good"],
     "Demand Theory", "Meaning and Determinants of Demand"),

    # Consumer behaviour / utility
    (["utility", "marginal utility", "total utility", "law of diminishing",
      "consumer equilibrium", "indifference curve", "budget line",
      "consumer surplus"],
     "Consumer Behaviour", "Utility Theory"),

    # Supply
    (["supply", "law of supply", "supply curve", "quantity supplied",
      "supply schedule", "price elasticity of supply", "shift in supply"],
     "Supply Theory", "Meaning and Determinants of Supply"),

    # Price mechanism / equilibrium
    (["equilibrium price", "equilibrium quantity", "price ceiling",
      "price floor", "surplus", "shortage", "black market", "price control"],
     "Price Determination", "Market Equilibrium"),

    # Production theory / factors
    (["factor of production", "land", "labour", "capital", "entrepreneur",
      "law of diminishing returns", "returns to scale", "division of labour",
      "specialisation"],
     "Theory of Production", "Factors of Production"),

    # Cost and revenue
    (["fixed cost", "variable cost", "total cost", "average cost",
      "marginal cost", "average revenue", "marginal revenue", "total revenue",
      "break-even", "profit maximis"],
     "Costs and Revenue", "Cost Concepts"),

    # Market structures
    (["perfect competition", "monopoly", "oligopoly", "monopolistic",
      "market structure", "price taker", "price maker", "kinked demand"],
     "Market Structures", "Perfect Competition"),

    # National income
    (["gdp", "gnp", "national income", "gross domestic", "gross national",
      "nnp", "net national", "disposable income", "nominal", "real income",
      "income measurement"],
     "National Income", "National Income Concepts"),

    # Money and banking / inflation
    (["money", "inflation", "deflation", "monetary policy", "interest rate",
      "money supply", "commercial bank", "central bank", "cbn", "credit",
      "demand deposit", "savings"],
     "Money and Banking", "Money: Functions and Types"),

    # Financial institutions / public finance
    (["tax", "taxation", "income tax", "budget", "fiscal policy",
      "government revenue", "government expenditure", "public debt",
      "stock exchange", "insurance", "capital market"],
     "Financial Institutions", "Public Finance"),

    # Economic development / Nigeria
    (["economic development", "economic growth", "human development",
      "hdi", "standard of living", "developing country", "agriculture.*nigeria",
      "industriali", "oil", "petroleum.*nigeria"],
     "Economic Development", "Economic Growth vs Development"),

    # International trade
    (["international trade", "comparative advantage", "balance of trade",
      "balance of payment", "exchange rate", "tariff", "quota", "export",
      "import", "ecowas", "wto", "imf", "world bank"],
     "International Trade", "Basis and Benefits of International Trade"),

    # Population / labour
    (["population", "birth rate", "death rate", "migration", "urbanisation",
      "malthus", "labour force", "wage", "trade union", "unemployment",
      "employment"],
     "Population and Labour", "Population Theory"),

    # Business organisation
    (["sole proprietor", "partnership", "limited company", "cooperative",
      "public enterprise", "privatisation", "multinational"],
     "Business Organisations", "Forms of Business Organisation"),
]

# ════════════════════════════════════════════════════════════════
# COMMERCE
# DB topic: "" (empty string) — all keyword-based
# ════════════════════════════════════════════════════════════════

COMMERCE_RULES = [
    (["commerce", "trade", "aids to trade", "scope.*commerce", "occupation",
      "primary.*secondary.*tertiary", "division of labour",
      "specialisation.*commerce"],
     "Nature and Scope of Commerce", "Commerce and Trade"),

    (["chain of distribution", "wholesaler", "retailer", "middleman",
      "producer.*consumer", "agent", "distributor", "disintermediation"],
     "Production", "Chain of Distribution"),

    (["factor of production", "land.*labour.*capital", "scale of production",
      "large.scale", "small.scale", "manufacturing"],
     "Production", "Types and Factors of Production"),

    (["retail", "wholesale", "supermarket", "department store", "market",
      "cooperative store", "hawker", "market trader"],
     "Home and Foreign Trade", "Home Trade: Retail and Wholesale"),

    (["invoice", "pro forma", "bill of lading", "letter of credit",
      "delivery note", "statement of account", "debit note", "credit note",
      "trade document", "waybill", "consignment", "receipt"],
     "Home and Foreign Trade", "Trade Documents"),

    (["international trade", "foreign trade", "balance of trade",
      "balance of payment", "ecowas", "tariif", "quota", "export.*import"],
     "Home and Foreign Trade", "Foreign Trade"),

    (["advertising", "advertisement", "media of advertising", "persuasive",
      "informative", "reminder advertising", "commercial"],
     "Advertising", "Types and Objectives of Advertising"),

    (["bank", "cheque", "clearing", "bill of exchange", "promissory note",
      "crossing.*cheque", "cbn", "cbnn", "commercial bank", "central bank"],
     "Banking", "Types of Banks and Their Functions"),

    (["insurance", "insurable interest", "indemnity", "utmost good faith",
      "subrogation", "life assurance", "fire insurance", "marine insurance",
      "motor insurance", "premium", "policy", "proposal form"],
     "Insurance", "Principles of Insurance"),

    (["transport", "transportation", "road transport", "rail", "air",
      "water transport", "pipeline", "freight", "cargo"],
     "Transportation and Communication", "Modes of Transportation"),

    (["communication", "telephone", "email", "postal", "telegram",
      "e-commerce", "internet.*trade", "ict.*commerce"],
     "Transportation and Communication", "Communication in Commerce"),

    (["warehouse", "bonded warehouse", "public warehouse", "cold storage",
      "storage", "warehousing"],
     "Warehousing", "Functions and Types of Warehouses"),

    (["sole proprietor", "partnership", "limited liability", "plc",
      "public company", "private company", "cooperative.*society",
      "business organisation"],
     "Business Organisations", "Forms of Business Ownership"),

    (["source of finance", "debenture", "share", "capital", "stock exchange",
      "microfinance", "bank loan", "retained profit"],
     "Financing Business", "Sources of Business Finance"),

    (["marketing", "market research", "4p", "product", "price", "place",
      "promotion", "consumer behaviour", "brand"],
     "Marketing", "Marketing Mix"),

    (["tourism", "tourist", "domestic tourism", "international tourism",
      "hotel", "travel agency", "ecotourism"],
     "Tourism", "Tourism and Its Importance"),

    (["money", "medium of exchange", "store of value", "unit of account",
      "barter", "characteristics of money", "token money"],
     "Money", "Functions and Characteristics of Money"),
]

# ════════════════════════════════════════════════════════════════
# GEOGRAPHY
# DB topic: "" (empty string) — all keyword-based
# ════════════════════════════════════════════════════════════════

GEOGRAPHY_RULES = [
    (["topographical map", "conventional sign", "map symbol", "contour line",
      "sketch map", "map reading", "types of map"],
     "Practical Geography: Maps and Scale", "Maps: Types and Uses"),

    (["scale", "representative fraction", "linear scale", "statement scale",
      "map scale", "enlarge.*map", "reduce.*map", "area.*map",
      "distance.*map"],
     "Practical Geography: Maps and Scale", "Scale and Measurement"),

    (["cross section", "profile", "bearing", "grid reference",
      "direction.*map", "north.*map"],
     "Practical Geography: Maps and Scale",
     "Map Reading and Interpretation"),

    (["bar graph", "pie chart", "line graph", "dot map", "choropleth",
      "flow map", "histogram.*geography", "statistical diagram"],
     "Statistical Data Interpretation", "Graphs, Charts and Diagrams"),

    (["gis", "remote sensing", "satellite", "gps", "geographic information",
      "digitising"],
     "Geographic Information System (GIS)", "GIS Components and Applications"),

    (["solar system", "planet", "orbit", "rotation", "revolution", "axis",
      "day and night", "equinox", "solstice", "season"],
     "The Earth as a Planet", "Earth in the Solar System"),

    (["latitude", "longitude", "meridian", "parallel", "equator", "tropic",
      "arctic", "antarctic", "time zone", "international date line",
      "greenwich"],
     "The Earth as a Planet", "Latitudes and Longitudes"),

    (["earth.*structure", "crust", "mantle", "core", "lithosphere",
      "atmosphere", "biosphere", "hydrosphere"],
     "The Earth's Crust", "Structure of the Earth"),

    (["igneous", "sedimentary", "metamorphic", "rock cycle", "granite",
      "basalt", "limestone", "sandstone", "rock formation"],
     "The Earth's Crust", "Rocks"),

    (["fold", "fault", "horst", "rift valley", "graben", "anticline",
      "syncline", "fold mountain"],
     "The Earth's Crust", "Earth Movements and Landforms"),

    (["volcano", "volcanic", "eruption", "lava", "magma", "crater",
      "shield volcano", "composite", "cinder cone"],
     "Volcanism and Earthquakes", "Volcanic Activity"),

    (["earthquake", "seismic", "epicentre", "focus", "richter", "tremor",
      "fault line"],
     "Volcanism and Earthquakes", "Earthquakes"),

    (["weathering", "physical weathering", "chemical weathering",
      "biological weathering", "exfoliation", "freeze.thaw",
      "carbonation", "hydration"],
     "Weathering and Erosion", "Weathering"),

    (["erosion", "agent of erosion", "wind erosion", "water erosion",
      "sea erosion", "deposition", "transportation.*erosion"],
     "Weathering and Erosion", "Erosion and Transportation"),

    (["river", "drainage", "tributary", "meander", "oxbow lake", "delta",
      "gorge", "waterfall", "floodplain", "youthful", "mature.*river",
      "old age.*river"],
     "Drainage and Water Bodies", "Rivers and River Action"),

    (["ocean current", "coastal", "cliff", "bay", "beach", "spit", "lagoon",
      "lake", "estuary", "coral reef", "wave"],
     "Drainage and Water Bodies", "Oceans, Lakes and Coasts"),

    (["weather", "climate", "temperature", "rainfall", "humidity",
      "wind", "pressure", "element.*climate", "factor.*climate",
      "monsoon", "koppen", "tropical"],
     "Weather and Climate", "Elements and Factors of Climate"),

    (["climate change", "global warming", "greenhouse", "carbon dioxide",
      "deforestation.*climate"],
     "Weather and Climate", "Climate Change"),

    (["vegetation", "rainforest", "savanna", "mangrove", "guinea savanna",
      "sudan savanna", "sahel", "forest.*zone"],
     "Vegetation and Soils", "Vegetation Zones"),

    (["soil", "soil horizon", "humus", "soil texture", "soil erosion",
      "soil conservation", "laterite", "alluvial", "soil formation"],
     "Vegetation and Soils", "Soils"),

    (["population distribution", "population growth", "birth rate",
      "death rate", "migration", "under-population", "over-population",
      "optimum population", "demographic"],
     "Population", "Population Distribution and Growth"),

    (["settlement", "urban", "rural", "nucleated", "dispersed", "linear",
      "urbanisation", "slum", "shanty"],
     "Settlements", "Types and Patterns of Settlement"),

    (["farming", "agriculture.*geography", "subsistence", "commercial farm",
      "cash crop", "food crop", "livestock", "irrigation"],
     "Economic Activities", "Agriculture"),

    (["industry", "industrial", "manufacturing", "factor.*location",
      "primary.*industry", "secondary.*industry", "tertiary.*industry"],
     "Economic Activities", "Industry and Trade"),

    (["nigeria", "west africa", "ecowas", "niger", "benue", "sahara",
      "guinea coast", "lake chad", "nigerian", "abuja", "lagos"],
     "Nigeria and West Africa", "Physical and Human Geography of Nigeria"),
]


# ════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ════════════════════════════════════════════════════════════════

def compile_rules(rules):
    """Pre-compile regex patterns for each rule."""
    compiled = []
    for kws, topic, subtopic in rules:
        patterns = [re.compile(r'\b' + kw.strip() + r'\b', re.IGNORECASE)
                    if re.search(r'\w', kw) else
                    re.compile(kw, re.IGNORECASE)
                    for kw in kws]
        compiled.append((patterns, topic, subtopic))
    return compiled


def match_question(text: str, compiled_rules):
    """Return (topic, subtopic) for the first matching rule, or (None, None)."""
    for patterns, topic, subtopic in compiled_rules:
        for pat in patterns:
            if pat.search(text):
                return topic, subtopic
    return None, None


def get_question_text(row: dict) -> str:
    """Combine all text fields for keyword matching."""
    return " ".join([
        row.get("question_text", "") or "",
        row.get("topic", "") or "",
        row.get("subtopic", "") or "",
    ])


SUBJECT_CONFIG = {
    "Mathematics": {
        "db_name": "Mathematics",
        "rules": MATH_RULES,
    },
    # DB subject is "English" (folder name in JAMB copy)
    "English": {
        "db_name": "English",
        "rules": ENGLISH_RULES,
    },
    # DB has BOTH "Literature" and "Literature in English" folders
    "Literature in English": {
        "db_name": "Literature in English",
        "rules": LITERATURE_RULES,
    },
    "Literature": {
        "db_name": "Literature",
        "rules": LITERATURE_RULES,
    },
    "Economics": {
        "db_name": "Economics",
        "rules": ECONOMICS_RULES,
    },
    "Commerce": {
        "db_name": "Commerce",
        "rules": COMMERCE_RULES,
    },
    "Geography": {
        "db_name": "Geography",
        "rules": GEOGRAPHY_RULES,
    },
}


def process_subject(subj_key: str, config: dict, dry_run: bool, conn):
    db_name = config["db_name"]
    compiled = compile_rules(config["rules"])

    cur = conn.cursor()
    cur.execute(
        "SELECT id, question_text, topic, subtopic FROM questions WHERE subject = %s",
        (db_name,)
    )
    rows = cur.fetchall()

    matched = 0
    unmatched = 0
    updates = []
    unmatched_topics: Counter = Counter()

    for row in rows:
        qid, qtext, old_topic, old_sub = row
        text = " ".join([qtext or "", old_topic or "", old_sub or ""])
        new_topic, new_subtopic = match_question(text, compiled)

        if new_topic:
            matched += 1
            if new_topic != old_topic or new_subtopic != old_sub:
                updates.append((new_topic, new_subtopic, qid))
        else:
            unmatched += 1
            unmatched_topics[old_topic or "(empty)"] += 1

    total = len(rows)
    print(f"\n{'[DRY RUN] ' if dry_run else ''}{db_name}: {total} questions")
    print(f"  Matched: {matched}  ({matched*100//max(total,1)}%)")
    print(f"  Unmatched: {unmatched}")
    if unmatched > 0:
        print("  Top unmatched topic buckets:")
        for t, c in unmatched_topics.most_common(5):
            print(f"    {c:4}  {t}")

    if not dry_run and updates:
        cur.executemany(
            "UPDATE questions SET topic = %s, subtopic = %s WHERE id = %s",
            updates
        )
        conn.commit()
        print(f"  ✓ Updated {len(updates)} rows in DB")

    cur.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--subject",
        choices=list(SUBJECT_CONFIG.keys()),
        default=None,
        help="Process only one subject",
    )
    args = parser.parse_args()

    conn = get_connection()
    subjects = (
        {args.subject: SUBJECT_CONFIG[args.subject]}
        if args.subject
        else SUBJECT_CONFIG
    )

    for key, config in subjects.items():
        process_subject(key, config, args.dry_run, conn)

    conn.close()
    print("\nAll done.")


if __name__ == "__main__":
    main()
