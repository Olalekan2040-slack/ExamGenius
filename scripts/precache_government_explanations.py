"""
Pre-populate the objective_explanations table with world-class Government explanations.

Usage (from project root, with venv activated):
    python scripts/precache_government_explanations.py [--force] [--topic N]

Options:
    --force         Overwrite existing cached explanations
    --topic N       Only process topic number N (1-31), useful for resuming
    --dry-run       Print what would be done without actually calling Gemini

The script works through every topic -> subtopic -> objective in the JAMB
Government syllabus JSON, calls _generate_government_explanation(), and
upserts the result into objective_explanations.
"""

import sys
import json
import time
import argparse
import pathlib

# ── path bootstrap ───────────────────────────────────────────────────
ROOT = pathlib.Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.db.database import get_connection
from app.services.ai.guided_learning_ai import _generate_government_explanation

SUBJECT = "Government"
SYLLABUS_FILE = ROOT / "syllabus" / "parsed" / "government_syllabus.json"


# ── helpers ──────────────────────────────────────────────────────────

def load_syllabus() -> dict:
    with open(SYLLABUS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def upsert_explanation(cursor, topic_name: str, subtopic_name: str,
                        objective_text: str, explanation_json: str) -> None:
    cursor.execute(
        """
        INSERT INTO objective_explanations
            (subject, topic_name, subtopic_name, objective_text, explanation, diagram_url)
        VALUES (?, ?, ?, ?, ?, NULL)
        ON CONFLICT (subject, topic_name, subtopic_name, objective_text)
        DO UPDATE SET
            explanation  = EXCLUDED.explanation,
            updated_at   = CURRENT_TIMESTAMP
        """,
        (SUBJECT, topic_name, subtopic_name, objective_text, explanation_json),
    )


def explanation_exists(cursor, topic_name: str, subtopic_name: str,
                         objective_text: str) -> bool:
    cursor.execute(
        """
        SELECT 1 FROM objective_explanations
        WHERE subject = ? AND topic_name = ? AND subtopic_name = ? AND objective_text = ?
        """,
        (SUBJECT, topic_name, subtopic_name, objective_text),
    )
    return cursor.fetchone() is not None


# ── main ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Pre-cache Government guided-learning explanations in Gemini AI."
    )
    parser.add_argument(
        "--force", action="store_true",
        help="Overwrite already-cached explanations",
    )
    parser.add_argument(
        "--topic", type=int, default=None,
        help="Only process one topic number (1-31)",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print plan without calling Gemini or writing to DB",
    )
    args = parser.parse_args()

    syllabus = load_syllabus()
    topics = syllabus.get("topics", [])

    if args.topic:
        topics = [t for t in topics if t.get("number") == args.topic]
        if not topics:
            print(f"[ERROR] Topic {args.topic} not found in syllabus.")
            sys.exit(1)

    conn = get_connection()
    cursor = conn.cursor()

    total_objectives = sum(
        len(obj)
        for t in topics
        for st in t.get("subtopics", [])
        for obj in [st.get("objectives", [])]
    )

    done = 0
    skipped = 0
    errors = 0
    processed = 0

    print(f"\n{'='*65}")
    print(f"  EduLab ExamPrep — Government Explanation Pre-Cacher")
    print(f"  Topics: {len(topics)}   Total objectives: {total_objectives}")
    print(f"  Mode: {'DRY RUN' if args.dry_run else 'LIVE'}"
          f"  |  Force overwrite: {args.force}")
    print(f"{'='*65}\n")

    for topic in topics:
        topic_name = topic.get("name", "")
        topic_num  = topic.get("number", "?")
        print(f"\n[Topic {topic_num}] {topic_name}")
        print("-" * 55)

        for st_idx, subtopic in enumerate(topic.get("subtopics", [])):
            subtopic_name = subtopic.get("name", topic_name)
            objectives    = subtopic.get("objectives", [])

            print(f"  Subtopic {st_idx + 1}: {subtopic_name}")

            for obj_idx, objective_text in enumerate(objectives):
                processed += 1
                label = f"    Obj {obj_idx + 1}/{len(objectives)}: {objective_text[:70]}..."

                if not args.force and explanation_exists(
                    cursor, topic_name, subtopic_name, objective_text
                ):
                    print(f"{label}\n      -> SKIP (already cached)")
                    skipped += 1
                    continue

                if args.dry_run:
                    print(f"{label}\n      -> [DRY RUN] would generate")
                    done += 1
                    continue

                # ── Generate ────────────────────────────────────────
                print(f"{label}\n      -> Generating...", end="", flush=True)
                try:
                    result = _generate_government_explanation(
                        topic_name, subtopic_name, objective_text
                    )
                    explanation_json = json.dumps(result)
                    upsert_explanation(
                        cursor, topic_name, subtopic_name,
                        objective_text, explanation_json,
                    )
                    conn.commit()
                    done += 1
                    print(f" OK  ({len(explanation_json):,} chars)")
                except Exception as exc:
                    errors += 1
                    print(f" ERROR: {exc}")

                # Rate-limit: be polite to Gemini API
                time.sleep(1.5)

    conn.close()

    print(f"\n{'='*65}")
    print(f"  DONE")
    print(f"  Generated : {done}")
    print(f"  Skipped   : {skipped}")
    print(f"  Errors    : {errors}")
    print(f"  Total     : {processed}")
    print(f"{'='*65}\n")

    if errors:
        print(f"[WARNING] {errors} objective(s) failed. Re-run with --force to retry them.")
    else:
        print("[SUCCESS] All Government explanations are cached and ready!")


if __name__ == "__main__":
    main()
