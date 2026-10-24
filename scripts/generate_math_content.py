"""
Generate frontend/public/content/mathematics-content.js
from the three EduLab ExamPrep JAMB Maths docx volumes.
"""

import sys, io, zipfile, xml.etree.ElementTree as ET, re, json, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# ── 1. Extract plain text from each .docx ──────────────────────────────────

def extract_docx(path: str) -> str:
    with zipfile.ZipFile(path) as z:
        xml_bytes = z.read("word/document.xml")
    root = ET.fromstring(xml_bytes)
    ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    lines = []
    for para in root.iter(ns + "p"):
        parts = [t.text for t in para.iter(ns + "t") if t.text]
        lines.append("".join(parts))
    return "\n".join(lines)


BASE = r"c:\Users\DELL\Desktop\examgenius\contents\mathematics"
vol1 = extract_docx(os.path.join(BASE, "ExamGenius_JAMB_Maths_Vol1_v2.md"))
vol2 = extract_docx(os.path.join(BASE, "ExamGenius_JAMB_Maths_Vol2_v2.md"))
vol3 = extract_docx(os.path.join(BASE, "ExamGenius_JAMB_Maths_Vol3_v2.md"))
full_text = vol1 + "\n" + vol2 + "\n" + vol3

# ── 2. Split into TOPIC blocks ─────────────────────────────────────────────

# Each topic block starts at "TOPIC N\n<NAME>"
TOPIC_RE = re.compile(r"^TOPIC \d+\s*\n([A-Z][^\n]+)", re.MULTILINE)
topic_splits = list(TOPIC_RE.finditer(full_text))

def get_topic_block(i: int) -> str:
    start = topic_splits[i].start()
    end = topic_splits[i + 1].start() if i + 1 < len(topic_splits) else len(full_text)
    return full_text[start:end]


# ── 3. Split a topic block into subtopic sections ──────────────────────────

SUBTOPIC_RE = re.compile(r"^(\d+\.\d+)\s+([A-Z][^\n]+)", re.MULTILINE)

def split_subtopics(topic_block: str):
    """Return list of (number, name, content_text)."""
    splits = list(SUBTOPIC_RE.finditer(topic_block))
    result = []
    for idx, m in enumerate(splits):
        number = m.group(1)
        name = m.group(2).strip()
        start = m.end()
        end = splits[idx + 1].start() if idx + 1 < len(splits) else len(topic_block)
        content = topic_block[start:end].strip()
        result.append((number, name, content))
    return result


# ── 4. Parse JAMB Practice Questions from a subtopic block ────────────────

Q_BLOCK_RE = re.compile(
    r"JAMB Practice Question Q\d+\s*\n"
    r"(.*?)\n"
    r"A\.\s*(.*?)\n"
    r"B\.\s*(.*?)\n"
    r"C\.\s*(.*?)\n"
    r"D\.\s*(.*?)\n"
    r"✓ Correct Answer:\s*([A-D])[^\n]*\n"
    r"Explanation:\s*(.*?)(?=JAMB Practice Question Q|\Z)",
    re.DOTALL,
)

def parse_questions(text: str):
    questions = []
    for m in Q_BLOCK_RE.finditer(text):
        q_text = m.group(1).strip()
        options = {
            "A": m.group(2).strip(),
            "B": m.group(3).strip(),
            "C": m.group(4).strip(),
            "D": m.group(5).strip(),
        }
        correct = m.group(6).strip()
        explanation = m.group(7).strip()
        questions.append({
            "text": q_text,
            "options": options,
            "correctAnswer": correct,
            "explanation": explanation,
        })
    return questions


# ── 5. Build explanation HTML from subtopic body ────────────────────────────

def escape_html(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def html_of_body(body: str, sub_number: str, sub_name: str) -> str:
    """Convert raw subtopic text (minus JAMB questions) into styled HTML."""
    # Remove JAMB Practice Question blocks (keep only the theory part)
    body = re.sub(
        r"JAMB Practice Question Q\d+.*?(?=JAMB Practice Question Q|\Z)",
        "",
        body,
        flags=re.DOTALL,
    ).strip()

    html_parts = []
    current_section = []

    def flush(css_class=""):
        nonlocal current_section
        if current_section:
            joined = "\n".join(current_section).strip()
            if joined:
                if css_class:
                    html_parts.append(f'<div class="{css_class}">{escape_html(joined)}</div>')
                else:
                    # wrap each non-empty paragraph in <p>
                    for para in re.split(r"\n{2,}", joined):
                        para = para.strip()
                        if para:
                            html_parts.append(f"<p>{escape_html(para)}</p>")
            current_section = []

    hint_lines = []
    mistake_lines = []
    example_blocks = []

    # Detect special blocks
    in_hint = False
    in_mistake = False
    in_example = False
    example_buffer = []
    normal_lines = []

    for line in body.splitlines():
        if line.strip().startswith("💡 Hint:") or line.strip() == "💡 Hint:":
            if in_example:
                example_blocks.append("\n".join(example_buffer))
                example_buffer = []
                in_example = False
            in_hint = True
            in_mistake = False
            hint_lines = [line.replace("💡 Hint:", "").strip()]
        elif line.strip().startswith("⚠️") and ("Common Mistake" in line or "Warning" in line):
            if in_example:
                example_blocks.append("\n".join(example_buffer))
                example_buffer = []
                in_example = False
            in_mistake = True
            in_hint = False
            mistake_lines = [line.replace("⚠️", "").replace("Common Mistake:", "").replace("Warning:", "").strip()]
        elif re.match(r"^Example \d+\.\d+[a-z]?", line.strip()):
            if in_hint:
                hint_lines = []
                in_hint = False
            if in_mistake:
                mistake_lines = []
                in_mistake = False
            if in_example:
                example_blocks.append("\n".join(example_buffer))
            in_example = True
            example_buffer = [line]
        else:
            if in_hint:
                if line.strip():
                    hint_lines.append(line.strip())
                else:
                    in_hint = False
            elif in_mistake:
                if line.strip():
                    mistake_lines.append(line.strip())
                else:
                    in_mistake = False
            elif in_example:
                if line.strip() or example_buffer:
                    example_buffer.append(line)
            else:
                normal_lines.append(line)

    if in_example and example_buffer:
        example_blocks.append("\n".join(example_buffer))

    # Build HTML sections
    # 1. Normal intro text
    intro_text = "\n".join(normal_lines).strip()
    if intro_text:
        paras = re.split(r"\n{2,}", intro_text)
        for p in paras:
            p = p.strip()
            if not p:
                continue
            # Check if it's a bullet list (lines starting with spaces or special chars)
            if "\n" in p and all(l.strip().startswith(("-", "•", "·", "*")) or not l.strip() for l in p.splitlines() if l.strip()):
                items = [l.strip().lstrip("-•·* ") for l in p.splitlines() if l.strip()]
                html_parts.append(
                    "<ul>" + "".join(f"<li>{escape_html(i)}</li>" for i in items) + "</ul>"
                )
            elif "\n" in p:
                # multi-line that isn't a list — use pre-style or paragraphs
                sub_lines = [l for l in p.splitlines()]
                for sl in sub_lines:
                    sl = sl.strip()
                    if sl:
                        html_parts.append(f"<p>{escape_html(sl)}</p>")
            else:
                html_parts.append(f"<p>{escape_html(p)}</p>")

    # 2. Examples
    for ex in example_blocks:
        lines_ex = [l for l in ex.splitlines() if l.strip()]
        if not lines_ex:
            continue
        title_line = escape_html(lines_ex[0])
        body_lines = lines_ex[1:]
        inner = "".join(
            f"<p>{escape_html(l.strip())}</p>" if l.strip() else ""
            for l in body_lines
        )
        html_parts.append(
            f'<div class="example-box"><h4>📝 {title_line}</h4>{inner}</div>'
        )

    # 3. Hint
    if hint_lines:
        hint_text = escape_html(" ".join(hint_lines))
        html_parts.append(
            f'<div class="hint-box"><h4>💡 Quick Tip</h4><p>{hint_text}</p></div>'
        )

    # 4. Common mistake
    if mistake_lines:
        mistake_text = escape_html(" ".join(mistake_lines))
        html_parts.append(
            f'<div class="warning-box"><h4>⚠️ Common Mistake</h4><p>{mistake_text}</p></div>'
        )

    return "\n".join(html_parts)


# ── 6. Build topic-level introduction from the block before first subtopic ─

def topic_intro(topic_block: str) -> str:
    m = SUBTOPIC_RE.search(topic_block)
    if m:
        return topic_block[: m.start()].strip()
    return topic_block.strip()


# ── 7. Map topic name → clean JS key ──────────────────────────────────────

TOPIC_KEY_MAP = {
    "NUMBER BASES": "Number Bases",
    "FRACTIONS, DECIMALS, APPROXIMATIONS & PERCENTAGES": "Fractions, Decimals & Percentages",
    "INDICES, LOGARITHMS & SURDS": "Indices, Logarithms & Surds",
    "SETS": "Sets",
    "POLYNOMIALS": "Polynomials",
    "VARIATION": "Variation",
    "INEQUALITIES": "Inequalities",
    "PROGRESSION (AP & GP)": "Progression",
    "BINARY OPERATIONS": "Binary Operations",
    "MATRICES AND DETERMINANTS": "Matrices & Determinants",
    "EUCLIDEAN GEOMETRY": "Euclidean Geometry",
    "MENSURATION": "Mensuration",
    "LOCI": "Loci",
    "COORDINATE GEOMETRY": "Coordinate Geometry",
    "TRIGONOMETRY": "Trigonometry",
    "DIFFERENTIATION & ITS APPLICATIONS": "Differentiation",
    "INTEGRATION": "Integration",
    "STATISTICS": "Statistics",
    "PERMUTATION AND COMBINATION": "Permutation & Combination",
    "PROBABILITY": "Probability",
}

JAMB_INFO_MAP = {
    "Number Bases": "JAMB asks 2-3 questions on Number Bases every year. Master base conversions and arithmetic in other bases.",
    "Fractions, Decimals & Percentages": "JAMB typically asks 3-5 questions covering fractions, decimals, standard form, and percentage calculations.",
    "Indices, Logarithms & Surds": "Indices and logs appear in 3-4 JAMB questions yearly. Know all the laws cold — they are your shortcuts.",
    "Sets": "JAMB asks 3-6 questions on Sets every year. Master Venn diagrams especially for 2 and 3 sets!",
    "Polynomials": "Polynomials appear 3-4 times in JAMB. Factorisation, remainder and factor theorems are high-yield.",
    "Variation": "Direct, inverse, joint, and partial variation — JAMB tests 2-3 questions on this topic.",
    "Inequalities": "Linear and quadratic inequalities appear 2-3 times in JAMB. Never forget to flip the sign when dividing by a negative.",
    "Progression": "AP and GP each appear in JAMB. Know the nth term and sum formulas for both cold.",
    "Binary Operations": "Binary operations appear 1-2 times in JAMB. Focus on evaluating expressions and testing commutativity/associativity.",
    "Matrices & Determinants": "Matrices appear 2-3 times in JAMB — multiplication, determinants, and solving simultaneous equations.",
    "Euclidean Geometry": "Circle theorems and angle problems are high-yield — JAMB asks 3-5 questions on geometry.",
    "Mensuration": "JAMB asks 3-5 mensuration questions — memorise all area, perimeter, volume, and surface area formulas.",
    "Loci": "Loci appear 1-2 times in JAMB. Understand the 6 standard loci types and intersections.",
    "Coordinate Geometry": "JAMB asks 3-5 coordinate geometry questions. The equation of a line and circle are essential.",
    "Trigonometry": "Trigonometry is a major JAMB topic with 4-6 questions. SOHCAHTOA, special angles, and the sine/cosine rules are key.",
    "Differentiation": "Calculus (differentiation) appears 2-4 times in JAMB — cover power rule, chain rule, and max/min problems.",
    "Integration": "Integration appears 2-3 times in JAMB. Know the power rule and definite integral (area under curve).",
    "Statistics": "JAMB asks 3-5 statistics questions — mean, median, mode, frequency tables, and dispersion.",
    "Permutation & Combination": "Permutations and combinations appear 2-3 times in JAMB. Know when to use nPr vs nCr.",
    "Probability": "Probability appears 3-4 times in JAMB. Focus on basic probability, independent events, and mutually exclusive events.",
}

# ── 8. Build the full JS content object ───────────────────────────────────

entries = {}

for i, tm in enumerate(topic_splits):
    raw_name = tm.group(1).strip()
    topic_block = get_topic_block(i)
    key = TOPIC_KEY_MAP.get(raw_name, raw_name.title())

    intro_text = topic_intro(topic_block)
    subtopic_list = split_subtopics(topic_block)

    # Build subtopics list
    sub_items = []
    for (sub_num, sub_name, sub_content) in subtopic_list:
        questions = parse_questions(sub_content)
        exp_html = html_of_body(sub_content, sub_num, sub_name)

        # Build extra questions HTML to embed
        extra_q_html = ""
        if len(questions) > 1:
            q_items = []
            for q in questions[1:]:
                opts = "".join(
                    f'<li><strong>{k}.</strong> {escape_html(v)}</li>'
                    for k, v in q["options"].items()
                )
                q_items.append(
                    f'<div class="extra-q-block">'
                    f'<p><strong>Practice:</strong> {escape_html(q["text"])}</p>'
                    f'<ul>{opts}</ul>'
                    f'<p class="q-answer"><strong>Answer: {q["correctAnswer"]}</strong> — {escape_html(q["explanation"])}</p>'
                    f'</div>'
                )
            extra_q_html = '<div class="extra-questions"><h4>📚 More Practice Questions</h4>' + "".join(q_items) + "</div>"

        full_exp = exp_html + extra_q_html

        primary_q = questions[0] if questions else {
            "text": f"Which of the following best describes {sub_name}?",
            "options": {"A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation"},
            "correctAnswer": "A",
            "explanation": "Review the content above.",
        }

        sub_items.append({
            "name": sub_name,
            "objectives": [{
                "title": sub_name,
                "explanation": full_exp,
                "visuals": [],
                "question": primary_q,
            }],
        })

    entries[key] = {
        "subject": "Mathematics",
        "topic": key,
        "introduction": {
            "title": f"{key} — JAMB Mathematics",
            "description": intro_text[:400].replace("\n", " ").strip() if intro_text else f"Master {key} for JAMB Mathematics.",
            "jambInfo": JAMB_INFO_MAP.get(key, f"This topic appears regularly in JAMB Mathematics."),
        },
        "subtopics": sub_items,
    }

# ── 9. Render to JavaScript ────────────────────────────────────────────────

def js_string(s: str) -> str:
    """Encode a Python string as a JS template literal."""
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return "`" + s + "`"

def render_question(q: dict) -> str:
    opts = ", ".join(
        f'{json.dumps(k)}: {json.dumps(v)}' for k, v in q["options"].items()
    )
    return (
        "{\n"
        f'          text: {json.dumps(q["text"])},\n'
        f"          options: {{ {opts} }},\n"
        f'          correctAnswer: {json.dumps(q["correctAnswer"])},\n'
        f'          explanation: {json.dumps(q["explanation"])}\n'
        "        }"
    )

def render_objective(obj: dict) -> str:
    return (
        "        {\n"
        f'          title: {json.dumps(obj["title"])},\n'
        f"          explanation: {js_string(obj['explanation'])},\n"
        "          visuals: [],\n"
        f"          question: {render_question(obj['question'])}\n"
        "        }"
    )

def render_subtopic(sub: dict) -> str:
    objs = ",\n".join(render_objective(o) for o in sub["objectives"])
    return (
        "      {\n"
        f'        name: {json.dumps(sub["name"])},\n'
        f"        objectives: [\n{objs}\n        ]\n"
        "      }"
    )

def render_entry(key: str, entry: dict) -> str:
    intro = entry["introduction"]
    subs = ",\n".join(render_subtopic(s) for s in entry["subtopics"])
    return (
        f'  {json.dumps(key)}: {{\n'
        f'    subject: "Mathematics",\n'
        f'    topic: {json.dumps(entry["topic"])},\n'
        f'    introduction: {{\n'
        f'      title: {json.dumps(intro["title"])},\n'
        f'      description: {json.dumps(intro["description"])},\n'
        f'      jambInfo: {json.dumps(intro["jambInfo"])}\n'
        f'    }},\n'
        f'    subtopics: [\n{subs}\n    ]\n'
        f'  }}'
    )

out_lines = [
    "// Mathematics Learning Content — generated from EduLab ExamPrep JAMB Maths Vol 1-3",
    "// DO NOT EDIT MANUALLY — regenerate via scripts/generate_math_content.py",
    "",
    "const MATHEMATICS_LEARNING_CONTENT = {",
]
entry_strs = [render_entry(k, v) for k, v in entries.items()]
out_lines.append(",\n\n".join(entry_strs))
out_lines.append("};")
out_lines.append("")
out_lines.append("window.MATHEMATICS_LEARNING_CONTENT = MATHEMATICS_LEARNING_CONTENT;")

out_path = r"c:\Users\DELL\Desktop\examgenius\frontend\public\content\mathematics-content.js"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print(f"Done. Written to {out_path}")
print(f"Topics: {len(entries)}")
total_subs = sum(len(v['subtopics']) for v in entries.values())
print(f"Subtopics: {total_subs}")
total_qs = sum(
    len(parse_questions(sc))
    for i in range(len(topic_splits))
    for (_, _, sc) in split_subtopics(get_topic_block(i))
)
print(f"JAMB questions embedded: {total_qs}")
