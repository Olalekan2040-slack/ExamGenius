"""
precache_gl_content.py
----------------------
Pre-generates AI explanations for ALL guided-learning objectives across the
11 priority subjects and stores them in the `objective_explanations` table.

This removes the on-demand latency students experience when hitting an
objective for the first time.

Run from project root (takes ~30-60 min for full run):
    python scripts/precache_gl_content.py

Flags:
    --subjects   Comma-separated list (default: all 11 priority subjects)
    --skip-cached   Skip objectives that already have a cached explanation
    --dry-run    Print planned work only, generate nothing
"""

import sys
import json
import time
import argparse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection
from app.services.ai.guided_learning_ai import generate_objective_explanation

SYLLABUS_DIR = BASE_DIR / "syllabus" / "parsed"

SUBJECT_SLUG_MAP = {
    "Mathematics": "mathematics_syllabus",
    # DB stores subject as "English" (folder name)
    "English": "english_language_syllabus",
    "Physics": "physics_syllabus",
    "Chemistry": "chemistry_syllabus",
    "Biology": "biology_syllabus",
    "Government": "government_syllabus",
    "Literature in English": "literature_in_english_syllabus",
    "Accounting": "accounting",
    "Economics": "economics_syllabus",
    "Commerce": "commerce_syllabus",
    "Geography": "geography_syllabus",
}

PRIORITY_SUBJECTS = list(SUBJECT_SLUG_MAP.keys())

# Seconds to wait between AI calls to avoid rate limits
DELAY_BETWEEN_CALLS = 2.0


def load_syllabus(slug: str) -> dict:
    """Load parsed syllabus JSON by slug."""
    path = SYLLABUS_DIR / f"{slug}.json"
    if not path.exists():
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def count_objectives(syllabus: dict) -> int:
    total = 0
    for t in syllabus.get("topics", []):
        for st in t.get("subtopics", []):
            total += len(st.get("objectives", []))
    return total


def get_cached_keys(cursor, subject: str) -> set:
    """Return set of (topic, subtopic, objective) tuples already cached."""
    cursor.execute(
        """
        SELECT topic_name, subtopic_name, objective_text
        FROM objective_explanations
        WHERE subject = ?
        """,
        (subject,),
    )
    return {(r[0], r[1], r[2]) for r in cursor.fetchall()}


def cache_explanation(cursor, conn, subject, topic, subtopic, objective, response):
    cursor.execute(
        """
        INSERT INTO objective_explanations
            (subject, topic_name, subtopic_name, objective_text, explanation, diagram_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT (subject, topic_name, subtopic_name, objective_text)
        DO UPDATE SET explanation = EXCLUDED.explanation,
                      updated_at = CURRENT_TIMESTAMP
        """,
        (
            subject,
            topic,
            subtopic,
            objective,
            json.dumps(response),
            response.get("diagram_description"),
        ),
    )
    conn.commit()


def process_subject(subject: str, slug: str, skip_cached: bool, dry_run: bool, conn):
    cursor = conn.cursor()
    syllabus = load_syllabus(slug)
    if not syllabus:
        print(f"  ! No syllabus found for {subject} ({slug}.json) — skipping")
        return

    total = count_objectives(syllabus)
    print(f"\n{'[DRY RUN] ' if dry_run else ''}{subject}: {total} objectives")

    cached_keys = get_cached_keys(cursor, subject) if skip_cached else set()

    generated = 0
    skipped = 0
    errors = 0

    for t in syllabus.get("topics", []):
        topic_name = t["name"]
        for st in t.get("subtopics", []):
            subtopic_name = st["name"]
            for objective in st.get("objectives", []):
                key = (topic_name, subtopic_name, objective)

                if skip_cached and key in cached_keys:
                    skipped += 1
                    continue

                if dry_run:
                    print(f"  WOULD generate: {topic_name} / {subtopic_name}")
                    generated += 1
                    continue

                try:
                    response = generate_objective_explanation(
                        subject, topic_name, subtopic_name, objective
                    )
                    cache_explanation(
                        cursor, conn, subject, topic_name, subtopic_name,
                        objective, response
                    )
                    generated += 1
                    print(f"  ✓ {topic_name[:40]} / {subtopic_name[:30]} [{generated}/{total}]")
                    time.sleep(DELAY_BETWEEN_CALLS)
                except Exception as e:
                    errors += 1
                    print(f"  ✗ Error for {objective[:60]}: {e}")
                    time.sleep(DELAY_BETWEEN_CALLS)

    print(
        f"  Summary — generated: {generated}, skipped: {skipped}, errors: {errors}"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--subjects",
        default=",".join(PRIORITY_SUBJECTS),
        help="Comma-separated subject names",
    )
    parser.add_argument("--skip-cached", action="store_true", default=True,
                        help="Skip already-cached objectives (default: True)")
    parser.add_argument("--no-skip-cached", dest="skip_cached", action="store_false")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    subjects = [s.strip() for s in args.subjects.split(",")]

    conn = get_connection()

    for subject in subjects:
        if subject not in SUBJECT_SLUG_MAP:
            print(f"Unknown subject: {subject}")
            continue
        slug = SUBJECT_SLUG_MAP[subject]
        process_subject(subject, slug, args.skip_cached, args.dry_run, conn)

    conn.close()
    print("\nPre-caching complete.")


if __name__ == "__main__":
    main()
