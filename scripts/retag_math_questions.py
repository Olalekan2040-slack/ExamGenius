"""
retag_math_questions.py
-----------------------
Retags all Mathematics questions in the PostgreSQL DB and JSON source files
using the 20-topic / 54-subtopic structure from EduLab ExamPrep JAMB Maths Vol 1-3.

Run:
    python scripts/retag_math_questions.py           # apply to DB + JSON
    python scripts/retag_math_questions.py --dry-run  # report only
"""

import sys, io, re, json, os, argparse
from pathlib import Path
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection

# ──────────────────────────────────────────────────────────────────────────────
# TOPIC + SUBTOPIC TAXONOMY
# (topic_name, [subtopic_name, ...])
# ──────────────────────────────────────────────────────────────────────────────

TAXONOMY = [
    ("Number Bases", [
        "Understanding Place Value in Non-Decimal Bases",
        "Converting from Base 10 to Another Base",
        "Arithmetic in Non-Decimal Bases",
        "Converting Between Bases via Base 10",
    ]),
    ("Fractions, Decimals & Percentages", [
        "Operations on Fractions",
        "Decimal Places and Significant Figures",
        "Standard Form (Scientific Notation)",
        "Percentages, Profit, Loss and Interest",
    ]),
    ("Indices, Logarithms & Surds", [
        "Laws of Indices",
        "Logarithms — Definition and Laws",
        "Surds — Simplification and Rationalisation",
    ]),
    ("Sets", [
        "Set Notation and Set Operations",
        "Two-Set Venn Diagram Problems",
        "Three-Set Venn Diagram Problems",
    ]),
    ("Polynomials", [
        "Expansion of Algebraic Expressions",
        "Factorisation",
        "Remainder and Factor Theorems",
        "Quadratic Equations",
    ]),
    ("Variation", [
        "Direct Variation",
        "Inverse Variation",
        "Joint Variation",
        "Partial Variation",
    ]),
    ("Inequalities", [
        "Linear Inequalities",
        "Quadratic Inequalities",
    ]),
    ("Progression", [
        "Arithmetic Progression (AP)",
        "Geometric Progression (GP)",
    ]),
    ("Binary Operations", [
        "Evaluating Binary Operations",
        "Properties of Binary Operations",
    ]),
    ("Matrices & Determinants", [
        "Matrix Addition and Scalar Multiplication",
        "Matrix Multiplication",
        "Determinant of a 2×2 Matrix",
        "Inverse of a 2×2 Matrix and Solving Equations",
    ]),
    ("Euclidean Geometry", [
        "Lines, Angles and Parallel Lines",
        "Triangles",
        "Circle Theorems",
    ]),
    ("Mensuration", [
        "Area and Perimeter of 2D Shapes",
        "Volume and Surface Area of 3D Shapes",
    ]),
    ("Loci", [
        "Standard Loci",
        "Constructing Loci and Finding Intersections",
    ]),
    ("Coordinate Geometry", [
        "Distance Formula and Midpoint",
        "Equation of a Straight Line",
        "Equation of a Circle",
    ]),
    ("Trigonometry", [
        "SOHCAHTOA and Special Angles",
        "CAST Rule — Angles in All Quadrants",
        "Sine Rule and Cosine Rule",
        "Bearings",
    ]),
    ("Differentiation", [
        "Differentiation by the Power Rule",
        "Chain Rule for Composite Functions",
        "Maximum and Minimum Points",
    ]),
    ("Integration", [
        "Indefinite Integration — Power Rule",
        "Definite Integrals and Area Under Curve",
    ]),
    ("Statistics", [
        "Frequency Tables and Histograms",
        "Mean, Median, Mode",
        "Measures of Dispersion",
    ]),
    ("Permutation & Combination", [
        "Permutations",
        "Combinations",
    ]),
    ("Probability", [
        "Basic Probability",
        "Independent and Mutually Exclusive Events",
    ]),
]

TOPIC_NAMES = [t for t, _ in TAXONOMY]

# ──────────────────────────────────────────────────────────────────────────────
# KEYWORD RULES  —  (topic, subtopic, [keywords/phrases to match in question text])
# Listed most-specific FIRST so the first match wins.
# ──────────────────────────────────────────────────────────────────────────────

def kw(*words):
    """Return a list of lowercase keyword strings."""
    return list(words)


RULES = [
    # ── Number Bases ───────────────────────────────────────────────────────
    ("Number Bases", "Arithmetic in Non-Decimal Bases",
     kw("add in base", "subtract in base", "multiply in base", "addition in base",
        "base 2 add", "base 2 subtract", "+ 1012", "evaluate in base",
        "base addition", "base subtraction", "base arithmetic")),

    ("Number Bases", "Converting Between Bases via Base 10",
     kw("base 2 to base 8", "base 2 to base 16", "convert.*base.*base",
        "binary to octal", "octal to binary", "hexadecimal")),

    ("Number Bases", "Converting from Base 10 to Another Base",
     kw("convert.*to base", "express.*in base", "decimal to base",
        "in base 2", "in base 5", "in base 8", "to binary")),

    ("Number Bases", "Understanding Place Value in Non-Decimal Bases",
     kw("base 10", "place value", "number base", "base-", "₂", "₅", "₈",
        "base 2", "base 3", "base 4", "base 5", "base 6", "base 7", "base 8",
        "number base", "numeral")),

    # ── Fractions, Decimals & Percentages ─────────────────────────────────
    ("Fractions, Decimals & Percentages", "Standard Form (Scientific Notation)",
     kw("standard form", "scientific notation", "× 10", "x 10^", "10⁻", "10⁺")),

    ("Fractions, Decimals & Percentages", "Decimal Places and Significant Figures",
     kw("decimal place", "significant figure", "correct to", "nearest", "approximat",
        "round off", "rounding")),

    ("Fractions, Decimals & Percentages", "Percentages, Profit, Loss and Interest",
     kw("percent", "%", "profit", "loss", "discount", "interest", "commission",
        "selling price", "cost price", "marked price", "simple interest",
        "compound interest", "depreciation")),

    ("Fractions, Decimals & Percentages", "Operations on Fractions",
     kw("fraction", "numerator", "denominator", "simplify", "evaluate",
        "rationalize", "rationalise", "surd", "√", "lowest term", "mixed number")),

    # ── Indices, Logarithms & Surds ────────────────────────────────────────
    ("Indices, Logarithms & Surds", "Surds — Simplification and Rationalisation",
     kw("surd", "√", "rationali", "irrational", "simplify.*root", "square root",
        "cube root")),

    ("Indices, Logarithms & Surds", "Logarithms — Definition and Laws",
     kw("log", "logarithm", "antilog", "ln ", "log₁₀", "log2", "log 2")),

    ("Indices, Logarithms & Surds", "Laws of Indices",
     kw("indic", "power", "exponent", "x^", "⁻¹", "⁻²", "^(1/", "^(-",
        "simplify.*^", "evaluate.*^")),

    # ── Sets ───────────────────────────────────────────────────────────────
    ("Sets", "Three-Set Venn Diagram Problems",
     kw("three set", "3 set", "venn diagram.*three", "three group",
        "only all three", "exactly two", "at least two", "survey.*three")),

    ("Sets", "Two-Set Venn Diagram Problems",
     kw("venn diagram", "union", "intersection", "n(a∪b)", "n(a∩b)",
        "complement", "a'", "b'", "elements in", "how many.*set",
        "subset")),

    ("Sets", "Set Notation and Set Operations",
     kw("set", "∈", "∉", "⊂", "⊆", "universal set", "empty set",
        "power set", "finite set", "infinite set", "disjoint")),

    # ── Polynomials ────────────────────────────────────────────────────────
    ("Polynomials", "Quadratic Equations",
     kw("quadratic", "roots of", "sum of roots", "product of roots",
        "solve.*equation", "ax²", "x² +", "x²-", "x² -",
        "complete the square", "discriminant", "real root", "equal root")),

    ("Polynomials", "Remainder and Factor Theorems",
     kw("remainder theorem", "factor theorem", "remainder when", "divisible by",
        "f(x) divided", "remainder.*divid", "factor of")),

    ("Polynomials", "Factorisation",
     kw("factoris", "factoriz", "factor completely", "common factor",
        "difference of two square", "perfect square", "expand and simplify")),

    ("Polynomials", "Expansion of Algebraic Expressions",
     kw("expand", "expression", "simplify.*expression", "algebraic",
        "binomial", "(x+", "(x-", "polynomial")),

    # ── Variation ──────────────────────────────────────────────────────────
    ("Variation", "Partial Variation",
     kw("partial variation", "partly.*constant", "partly direct",
        "partly.*vary")),

    ("Variation", "Joint Variation",
     kw("joint variation", "varies jointly", "jointly as")),

    ("Variation", "Inverse Variation",
     kw("inverse", "inversely", "varies inversely", "indirect variation")),

    ("Variation", "Direct Variation",
     kw("direct variation", "directly proportion", "varies directly",
        "proportional to")),

    # ── Inequalities ───────────────────────────────────────────────────────
    ("Inequalities", "Quadratic Inequalities",
     kw("quadratic inequality", "x² ≤", "x² ≥", "x² >", "x² <",
        "solve.*x².*≤", "solve.*x².*≥")),

    ("Inequalities", "Linear Inequalities",
     kw("inequalit", "≤", "≥", "number line", "range of value",
        "satisfying", "solution set", ">", "<")),

    # ── Progression ────────────────────────────────────────────────────────
    ("Progression", "Geometric Progression (GP)",
     kw("geometric", "gp", "common ratio", "g.p.", "geometric sequence",
        "geometric series", "sum to infinity", "convergent")),

    ("Progression", "Arithmetic Progression (AP)",
     kw("arithmetic progression", "ap", "common difference", "a.p.",
        "arithmetic sequence", "arithmetic series", "nth term of.*progression",
        "first term.*progression")),

    # ── Binary Operations ──────────────────────────────────────────────────
    ("Binary Operations", "Properties of Binary Operations",
     kw("commutative", "associative", "identity element", "inverse element",
        "distributive.*binary")),

    ("Binary Operations", "Evaluating Binary Operations",
     kw("binary operation", "a*b", "a★b", "a◦b", "operation.*defined",
        "defined.*a∗b", "a ∗ b", "a ⊕ b", "a ⊗ b")),

    # ── Matrices & Determinants ────────────────────────────────────────────
    ("Matrices & Determinants", "Inverse of a 2×2 Matrix and Solving Equations",
     kw("inverse of.*matrix", "matrix equation", "solve.*matrix",
        "matrix.*inverse", "simultaneous.*matrix")),

    ("Matrices & Determinants", "Determinant of a 2×2 Matrix",
     kw("determinant", "det", "|a|", "|matrix", "singular matrix")),

    ("Matrices & Determinants", "Matrix Multiplication",
     kw("matrix.*product", "product of.*matrix", "multiply.*matrix",
        "matrix.*multipli", "ab =", "a × b")),

    ("Matrices & Determinants", "Matrix Addition and Scalar Multiplication",
     kw("matrix", "matrices")),

    # ── Euclidean Geometry ─────────────────────────────────────────────────
    ("Euclidean Geometry", "Circle Theorems",
     kw("circle", "chord", "tangent", "arc", "sector", "angle in a semicircle",
        "subtend", "cyclic", "inscribed", "circumscribed", "diameter",
        "radius", "centre of circle")),

    ("Euclidean Geometry", "Triangles",
     kw("triangle", "congruent", "similar triangle", "pythagoras", "right angle triangle",
        "isosceles", "equilateral", "scalene", "altitude", "median of triangle",
        "angle sum")),

    ("Euclidean Geometry", "Lines, Angles and Parallel Lines",
     kw("parallel", "transversal", "alternate angle", "corresponding angle",
        "co-interior", "vertically opposite", "polygon", "quadrilateral",
        "rectangle", "rhombus", "parallelogram", "trapezium", "angle",
        "exterior angle", "interior angle")),

    # ── Mensuration ────────────────────────────────────────────────────────
    ("Mensuration", "Volume and Surface Area of 3D Shapes",
     kw("volume", "surface area", "sphere", "cylinder", "cone", "cube",
        "cuboid", "prism", "pyramid", "hemisphere", "total surface")),

    ("Mensuration", "Area and Perimeter of 2D Shapes",
     kw("area", "perimeter", "circumference", "sector", "segment", "trapezium area",
        "square.*area", "rectangle.*area", "triangle.*area", "circle.*area")),

    # ── Loci ───────────────────────────────────────────────────────────────
    ("Loci", "Constructing Loci and Finding Intersections",
     kw("locus.*intersect", "two loci", "combined loci", "loci.*condition")),

    ("Loci", "Standard Loci",
     kw("locus", "loci", "equidistant", "moves such that", "trace")),

    # ── Coordinate Geometry ────────────────────────────────────────────────
    ("Coordinate Geometry", "Equation of a Circle",
     kw("equation of.*circle", "circle.*equation", "circle.*centre.*radius",
        "x² + y²", "(x-h)²", "(x+h)²")),

    ("Coordinate Geometry", "Equation of a Straight Line",
     kw("equation of.*line", "gradient of.*line", "slope of.*line",
        "y = mx", "y-intercept", "x-intercept", "perpendicular.*line",
        "parallel.*line.*gradient", "straight line")),

    ("Coordinate Geometry", "Distance Formula and Midpoint",
     kw("distance between", "midpoint", "coordinate", "point.*line",
        "distance from.*to", "collinear")),

    # ── Trigonometry ───────────────────────────────────────────────────────
    ("Trigonometry", "Bearings",
     kw("bearing", "north", "south", "east", "west", "direction",
        "n60°w", "s30°e", "compass")),

    ("Trigonometry", "Sine Rule and Cosine Rule",
     kw("sine rule", "cosine rule", "cosine formula", "ambiguous case",
        "a/sin a", "b/sin b", "triangle.*angle.*side")),

    ("Trigonometry", "CAST Rule — Angles in All Quadrants",
     kw("quadrant", "cast", "obtuse angle.*sin", "cos.*obtuse",
        "sin.*cos.*tan.*angle", "general solution", "360.*angle",
        "180.*angle", "reference angle")),

    ("Trigonometry", "SOHCAHTOA and Special Angles",
     kw("sin", "cos", "tan", "trigonometric", "sohcahtoa", "30°", "45°", "60°",
        "sec", "cosec", "cot", "adjacent", "opposite", "hypotenuse",
        "angle of elevation", "angle of depression", "height.*tower",
        "height.*building")),

    # ── Differentiation ────────────────────────────────────────────────────
    ("Differentiation", "Maximum and Minimum Points",
     kw("maximum", "minimum", "stationary point", "turning point",
        "rate of change", "increasing", "decreasing", "d²y/dx²",
        "second derivative")),

    ("Differentiation", "Chain Rule for Composite Functions",
     kw("chain rule", "composite function", "function of function",
        "differentiate.*bracket")),

    ("Differentiation", "Differentiation by the Power Rule",
     kw("differentiat", "dy/dx", "d/dx", "gradient at", "derivative",
        "f'(x)", "first derivative")),

    # ── Integration ────────────────────────────────────────────────────────
    ("Integration", "Definite Integrals and Area Under Curve",
     kw("definite integral", "area under", "area.*curve", "∫.*dx.*limit",
        "evaluate.*∫", "bounded by")),

    ("Integration", "Indefinite Integration — Power Rule",
     kw("integrat", "∫", "antiderivative", "indefinite")),

    # ── Statistics ─────────────────────────────────────────────────────────
    ("Statistics", "Measures of Dispersion",
     kw("standard deviation", "variance", "range of.*data", "mean deviation",
        "interquartile", "quartile deviation", "dispersion")),

    ("Statistics", "Mean, Median, Mode",
     kw("mean", "median", "mode", "average", "arithmetic mean",
        "frequency distribution", "weighted mean", "grouped data")),

    ("Statistics", "Frequency Tables and Histograms",
     kw("histogram", "frequency table", "bar chart", "pie chart",
        "frequency polygon", "cumulative frequency", "ogive",
        "class interval", "tally", "data representation")),

    # ── Permutation & Combination ──────────────────────────────────────────
    ("Permutation & Combination", "Combinations",
     kw("combination", "ncr", "nCr", "choose", "select", "committee",
        "ways of choosing", "ways of selecting")),

    ("Permutation & Combination", "Permutations",
     kw("permutation", "npr", "nPr", "arrange", "arrangement", "ways of arranging",
        "circular arrangement", "word.*letter.*arrange")),

    # ── Probability ────────────────────────────────────────────────────────
    ("Probability", "Independent and Mutually Exclusive Events",
     kw("independent event", "mutually exclusive", "p(a∩b)", "p(a and b)",
        "p(a or b)", "p(a∪b)", "conditional probability", "p(b|a)")),

    ("Probability", "Basic Probability",
     kw("probabilit", "chance", "likelihood", "sample space",
        "equally likely", "at random", "drawn at random")),
]


# ──────────────────────────────────────────────────────────────────────────────
# CLASSIFICATION ENGINE
# ──────────────────────────────────────────────────────────────────────────────

def classify(question_text: str, options_text: str = "") -> tuple[str, str]:
    """Return (topic, subtopic) for a question."""
    combined = (question_text + " " + options_text).lower()

    for topic, subtopic, keywords in RULES:
        for kword in keywords:
            # Use regex word-boundary for single tokens, substring for phrases
            if " " in kword:
                if kword in combined:
                    return topic, subtopic
            else:
                if re.search(r"\b" + re.escape(kword) + r"\b", combined):
                    return topic, subtopic

    # Fallback: return the first subtopic of the matched broad topic based on old tags
    return "Polynomials", "Expansion of Algebraic Expressions"


# ──────────────────────────────────────────────────────────────────────────────
# OLD-SUBTOPIC → TOPIC OVERRIDE (guarantees correct broad topic even if
# keyword rules miss the exact subtopic)
# ──────────────────────────────────────────────────────────────────────────────

SUBTOPIC_TOPIC_OVERRIDE = {
    "number bases":                                  "Number Bases",
    "fractions, decimals and percentages":           "Fractions, Decimals & Percentages",
    "indices, logarithms and surds":                 "Indices, Logarithms & Surds",
    "sets and venn diagrams":                        "Sets",
    "polynomials and factorization":                 None,   # let keyword rule decide
    "variation (direct, inverse, joint, partial)":  "Variation",
    "inequalities":                                  "Inequalities",
    "sequences and series (ap and gp)":              "Progression",
    "binary operations":                             "Binary Operations",
    "matrices and determinants":                     "Matrices & Determinants",
    "euclidean geometry (angles, lines, polygons)":  "Euclidean Geometry",
    "circle theorems":                               "Euclidean Geometry",
    "mensuration (areas and volumes)":               "Mensuration",
    "loci":                                          "Loci",
    "coordinate geometry":                           "Coordinate Geometry",
    "trigonometry and bearings":                     "Trigonometry",
    "differentiation":                               "Differentiation",
    "application of differentiation (maxima, minima, rate of change)": "Differentiation",
    "integration and area under curve":              "Integration",
    "data representation (histogram, bar chart, pie chart)": "Statistics",
    "measures of central tendency (mean, median, mode)": "Statistics",
    "measures of dispersion (range, variance, standard deviation)": "Statistics",
    "permutation and combination":                   "Permutation & Combination",
    "probability":                                   "Probability",
}


def classify_with_override(question_text: str, options_text: str,
                           old_subtopic: str) -> tuple[str, str]:
    kw_topic, kw_subtopic = classify(question_text, options_text)

    old_key = (old_subtopic or "").lower().strip()
    forced_topic = SUBTOPIC_TOPIC_OVERRIDE.get(old_key)

    if forced_topic is None:
        # Keyword rules decide everything (covers "polynomials and factorization")
        return kw_topic, kw_subtopic

    # If keyword rule agrees with forced topic, use keyword result (more specific)
    if kw_topic == forced_topic:
        return kw_topic, kw_subtopic

    # Keyword rule got a different topic — trust forced_topic but still use
    # keyword's subtopic only if it belongs to forced_topic, else pick first subtopic
    for t, subs in TAXONOMY:
        if t == forced_topic:
            if kw_subtopic in subs:
                return forced_topic, kw_subtopic
            return forced_topic, subs[0]

    return kw_topic, kw_subtopic


# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT q.id, q.question, q.topic, q.subtopic,
               string_agg(o.option_text, ' ') AS opts_text
        FROM questions q
        LEFT JOIN options o ON o.question_id = q.id
        WHERE q.subject = 'Mathematics'
        GROUP BY q.id, q.question, q.topic, q.subtopic
    """)
    rows = cur.fetchall()
    print(f"Found {len(rows)} Mathematics questions in DB")

    topic_counter   = Counter()
    subtopic_counter = Counter()
    updates = []

    for row in rows:
        q_id, q_text, old_topic, old_subtopic, opts_text = row
        opts_text = opts_text or ""

        new_topic, new_subtopic = classify_with_override(
            q_text or "", opts_text, old_subtopic or ""
        )
        topic_counter[new_topic] += 1
        subtopic_counter[f"{new_topic} > {new_subtopic}"] += 1
        updates.append((new_topic, new_subtopic, q_id))

    print("\n── Topic distribution after retagging ──")
    for t in TOPIC_NAMES:
        print(f"  {topic_counter[t]:4d}  {t}")

    print("\n── Subtopic distribution ──")
    for key, count in sorted(subtopic_counter.items()):
        print(f"  {count:4d}  {key}")

    if args.dry_run:
        print("\nDry run — no changes written.")
        conn.close()
        return

    # Apply to DB
    cur.executemany(
        "UPDATE questions SET topic = %s, subtopic = %s WHERE id = %s",
        updates
    )
    conn.commit()
    print(f"\nDB updated: {len(updates)} rows")

    # Apply to JSON source files
    json_base = BASE_DIR / "JAMB copy" / "Mathematics"
    json_updated = 0

    for year_dir in sorted(json_base.iterdir()):
        qf = year_dir / "questions.json"
        if not qf.exists():
            continue
        with open(qf, encoding="utf-8") as f:
            questions = json.load(f)

        changed = False
        for q in questions:
            opts_text = " ".join(str(v) for v in (q.get("options") or {}).values())
            old_sub = q.get("subtopic", "") or ""
            new_topic, new_subtopic = classify_with_override(
                q.get("question", "") or "", opts_text, old_sub
            )
            if q.get("topic") != new_topic or q.get("subtopic") != new_subtopic:
                q["topic"] = new_topic
                q["subtopic"] = new_subtopic
                changed = True
                json_updated += 1

        if changed:
            with open(qf, "w", encoding="utf-8") as f:
                json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"JSON files updated: {json_updated} questions across {year_dir.parent} years")
    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
