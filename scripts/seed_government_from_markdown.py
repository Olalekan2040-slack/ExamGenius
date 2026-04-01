"""
Seed objective_explanations table with expert Government content from markdown files.

This script reads the rich, teacher-quality Government content from
contents/Government/*.md and caches it in the objective_explanations DB table
for every objective in the JAMB Government syllabus.

Usage (from project root, with venv activated):
    python scripts/seed_government_from_markdown.py [--force] [--topic N]

Options:
    --force     Overwrite entries that already exist in the DB
    --topic N   Only process topic number N (1-31)
    --dry-run   Show what would be written without touching the DB
"""

import sys
import json
import re
import html
import argparse
import pathlib

# ── path bootstrap -------------------------------------------------------
ROOT = pathlib.Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.db.database import get_connection

SUBJECT       = "Government"
CONTENT_DIR   = ROOT / "contents" / "Government"
SYLLABUS_FILE = ROOT / "syllabus" / "parsed" / "government_syllabus.json"

# ── Topic-number -> markdown filename mapping ---------------------------
TOPIC_FILE_MAP = {
    1:  "Elements_of_government.md",
    2:  "forms_of_government.md",
    3:  "arms_of_government.md",
    4:  "structure_of_government.md",
    5:  "systems_of_government.md",
    6:  "political_ideologies.md",
    7:  "constitution.md",
    8:  "principles_of_democratic_government.md",
    9:  "processes_of_legislation.md",
    10: "citizenship.md",
    11: "Electoral_process_and_party_system.md",
    12: "political_parties_and_party_system.md",
    13: "pressure_group.md",
    14: "public_opinion.md",
    15: "civil_service.md",
    16: "precolonial_polities.md",
    17: "imperealists_penetration.md",
    18: "process_of_decolonization.md",
    19: "constitutional_development.md",
    20: "Post_Independence_Constitutions.md",
    21: "Institutions of_Government_in_the_Post_Independence_Nigeria.md",
    22: "Public Commissions Established by the 1979 and Subsequent Constitutions.md",
    23: "Political Parties and Party Politics in Post-Independence Nigeria.md",
    24: "The Structure and Workings of Nigerian Federalism.md",
    25: "public_corporations.md",
    26: "local_government.md",       # primary file; II merged below
    27: "the_military_in_nigeiran_politics.md",
    28: "foreign_policy.md",
    29: "Nigerian_foreign_policy.md",
    30: "relations_with_african_countries.md",
    31: "international_organisations.md",
}

# Topic 26 has TWO files - we concatenate them
TOPIC_EXTRA_FILE = {
    26: "local_governmentII.md",
    28: "foreign_policy2.md",         # supplement
    29: "nigerian_with_international_organisation.md",  # supplement
}


# ── Markdown -> HTML conversion -----------------------------------------

def _escape_tag_content(text: str) -> str:
    """Escape HTML special chars in plain text (not in existing tags)."""
    return html.escape(text, quote=False)


def md_to_html(md: str) -> str:
    """
    Convert the project's Government markdown files to clean HTML.

    The files use:
      **bold**               -> <strong>
      ### heading 3         -> <h4>
      ## heading 2          -> <h3>
      # heading 1           -> <h2>
      - bullet              -> <ul><li>
      1. numbered item      -> <ol><li>
      ---                   -> <hr/>
      blank line            -> paragraph break
    """
    lines   = md.splitlines()
    out     = []
    in_ul   = False
    in_ol   = False
    in_para = False

    def close_list():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append("</ul>")
            in_ul = False
        if in_ol:
            out.append("</ol>")
            in_ol = False

    def close_para():
        nonlocal in_para
        if in_para:
            out.append("</p>")
            in_para = False

    def inline(text: str) -> str:
        """Apply inline markdown (bold, italic) to a line."""
        # **bold**
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        # *italic*  OR  _italic_
        text = re.sub(r'\*(.+?)\*',     r'<em>\1</em>',         text)
        text = re.sub(r'_(.+?)_',       r'<em>\1</em>',         text)
        # `code`
        text = re.sub(r'`(.+?)`',       r'<code>\1</code>',     text)
        return text

    for raw_line in lines:
        line = raw_line.rstrip()

        # Horizontal rule
        if re.match(r'^---+$', line):
            close_list()
            close_para()
            out.append("<hr/>")
            continue

        # Headings
        h4 = re.match(r'^####\s+(.*)', line)
        h3 = re.match(r'^###\s+(.*)',  line)
        h2 = re.match(r'^##\s+(.*)',   line)
        h1 = re.match(r'^#\s+(.*)',    line)
        if h4 or h3 or h2 or h1:
            close_list()
            close_para()
            txt = (h4 or h3 or h2 or h1).group(1)
            tag = "h5" if h4 else "h4" if h3 else "h3" if h2 else "h3"
            out.append(f"<{tag}>{inline(txt)}</{tag}>")
            continue

        # Bullet list
        bul = re.match(r'^[*\-]\s+(.*)', line)
        if bul:
            close_para()
            if not in_ul:
                if in_ol:
                    out.append("</ol>")
                    in_ol = False
                out.append("<ul>")
                in_ul = True
            out.append(f"  <li>{inline(bul.group(1))}</li>")
            continue

        # Numbered list
        num = re.match(r'^\d+\.\s+(.*)', line)
        if num:
            close_para()
            if not in_ol:
                if in_ul:
                    out.append("</ul>")
                    in_ul = False
                out.append("<ol>")
                in_ol = True
            out.append(f"  <li>{inline(num.group(1))}</li>")
            continue

        # Blank line -> close lists / paragraphs
        if not line.strip():
            close_list()
            close_para()
            continue

        # Normal paragraph text
        close_list()
        if not in_para:
            out.append("<p>")
            in_para = True
        else:
            out[-1] = out[-1] + " "   # join continuation lines
            out.append(inline(line))
            continue
        out.append(inline(line))

    close_list()
    close_para()
    return "\n".join(out)


# ── Read markdown files --------------------------------------------------

def read_content_file(filename: str) -> str:
    path = CONTENT_DIR / filename
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def get_topic_content(topic_number: int) -> str:
    """Return combined markdown text for a given topic number."""
    primary = TOPIC_FILE_MAP.get(topic_number, "")
    if not primary:
        return ""
    content = read_content_file(primary)

    extra = TOPIC_EXTRA_FILE.get(topic_number)
    if extra:
        extra_text = read_content_file(extra)
        if extra_text:
            content += "\n\n" + extra_text
    return content


# ── Build explanation dict -----------------------------------------------

def build_explanation_dict(
    topic_name: str,
    subtopic_name: str,
    objective_text: str,
    html_content: str,
) -> dict:
    """
    Build the same dict structure that guided_learning_ai.py returns,
    so the frontend renders it consistently.
    """
    # Extract 4-5 key sentences as key_points
    plain = re.sub(r'<[^>]+>', ' ', html_content)
    sentences = re.split(r'(?<=[.!?])\s+', plain)
    key_points = [
        s.strip().rstrip('.')
        for s in sentences
        if 50 < len(s.strip()) < 220
    ][:5]

    jamb_tip = (
        f"JAMB frequently tests {subtopic_name} — know definitions, "
        f"features, merits, demerits, and Nigerian examples. "
        f"Focus on: {objective_text}"
    )

    return {
        "explanation_html":    html_content,
        "explanation":         html_content,
        "key_points":          key_points,
        "worked_example":      None,
        "svg_diagram":         None,
        "diagram_caption":     None,
        "jamb_tip":            jamb_tip,
        "common_mistakes":     [],
        "summary": (
            f"Complete coverage of {subtopic_name} under {topic_name}. "
            f"Study definitions, historical context, features, "
            f"merits/demerits, and Nigerian examples."
        ),
        "example":             None,
        "needs_diagram":       False,
        "diagram_description": None,
    }


# ── DB helpers -----------------------------------------------------------

def upsert(cursor, topic_name, subtopic_name, objective_text, explanation_json):
    cursor.execute(
        """
        INSERT INTO objective_explanations
            (subject, topic_name, subtopic_name, objective_text, explanation, diagram_url)
        VALUES (?, ?, ?, ?, ?, NULL)
        ON CONFLICT (subject, topic_name, subtopic_name, objective_text)
        DO UPDATE SET
            explanation = EXCLUDED.explanation,
            updated_at  = CURRENT_TIMESTAMP
        """,
        (SUBJECT, topic_name, subtopic_name, objective_text, explanation_json),
    )


def exists(cursor, topic_name, subtopic_name, objective_text):
    cursor.execute(
        """
        SELECT 1 FROM objective_explanations
        WHERE subject = ? AND topic_name = ? AND subtopic_name = ? AND objective_text = ?
        """,
        (SUBJECT, topic_name, subtopic_name, objective_text),
    )
    return cursor.fetchone() is not None


def needs_refresh(cursor, topic_name, subtopic_name, objective_text, min_size=2000):
    """Return True if entry is missing OR the cached explanation is very short (fallback)."""
    cursor.execute(
        """
        SELECT LENGTH(explanation) FROM objective_explanations
        WHERE subject = ? AND topic_name = ? AND subtopic_name = ? AND objective_text = ?
        """,
        (SUBJECT, topic_name, subtopic_name, objective_text),
    )
    row = cursor.fetchone()
    if row is None:
        return True          # Not cached at all
    return row[0] < min_size  # Cached but is a short fallback


# ── Main ----------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Seed Government guided-learning explanations from markdown files."
    )
    parser.add_argument("--force",   action="store_true", help="Overwrite all existing entries")
    parser.add_argument("--topic",   type=int,  default=None, help="Process only topic number N")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing to DB")
    args = parser.parse_args()

    with open(SYLLABUS_FILE, encoding="utf-8") as f:
        syllabus = json.load(f)

    topics = syllabus.get("topics", [])
    if args.topic:
        topics = [t for t in topics if t.get("number") == args.topic]
        if not topics:
            print(f"[ERROR] Topic {args.topic} not found.")
            sys.exit(1)

    conn   = get_connection()
    cursor = conn.cursor()

    total = sum(
        len(obj)
        for t in topics
        for st in t.get("subtopics", [])
        for obj in [st.get("objectives", [])]
    )

    print(f"\n{'='*65}")
    print(f"  ExamGenius - Government Markdown Seeder")
    print(f"  Topics: {len(topics)}   Objectives: {total}")
    print(f"  Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"  Force overwrite: {args.force}")
    print(f"{'='*65}\n")

    done = skipped = errors = 0

    for topic in topics:
        topic_number = topic.get("number")
        topic_name   = topic.get("name", "")
        subtopics    = topic.get("subtopics", [])

        print(f"[Topic {topic_number}] {topic_name}")
        print("-" * 55)

        # --- Load and convert the markdown for this topic ---
        md_text = get_topic_content(topic_number)
        if not md_text:
            print(f"  [WARN] No markdown file mapped for topic {topic_number} - skipping\n")
            errors += len([o for st in subtopics for o in st.get("objectives", [])])
            continue

        html_content = (
            "<div class='gl-web-content gl-govt-content'>\n"
            + md_to_html(md_text)
            + "\n</div>"
        )

        for st in subtopics:
            subtopic_name = st.get("name", topic_name)
            objectives    = st.get("objectives", [])
            print(f"  Subtopic: {subtopic_name}")

            for obj_idx, objective_text in enumerate(objectives):
                label = f"    Obj {obj_idx+1}: {objective_text[:65]}..."

                # Decide whether to write
                if not args.force and not needs_refresh(cursor, topic_name, subtopic_name, objective_text):
                    print(f"{label}\n      -> SKIP (good cache exists)")
                    skipped += 1
                    continue

                if args.dry_run:
                    print(f"{label}\n      -> [DRY RUN] would write {len(html_content):,} chars")
                    done += 1
                    continue

                try:
                    exp_dict = build_explanation_dict(
                        topic_name, subtopic_name, objective_text, html_content
                    )
                    exp_json = json.dumps(exp_dict, ensure_ascii=False)
                    upsert(cursor, topic_name, subtopic_name, objective_text, exp_json)
                    conn.commit()
                    done += 1
                    print(f"{label}\n      -> OK ({len(exp_json):,} chars)")
                except Exception as exc:
                    errors += 1
                    print(f"{label}\n      -> ERROR: {exc}")

        print()

    conn.close()

    print(f"{'='*65}")
    print(f"  COMPLETE")
    print(f"  Written  : {done}")
    print(f"  Skipped  : {skipped}")
    print(f"  Errors   : {errors}")
    print(f"{'='*65}\n")

    if not errors:
        print("[SUCCESS] All Government objectives are now seeded from markdown content!")
    else:
        print(f"[WARNING] {errors} failed. Check file mappings.")


if __name__ == "__main__":
    main()
