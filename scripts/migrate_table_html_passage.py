"""
Migration: Add table_html and passage columns to questions table,
then backfill them from the JAMB copy JSON source files.

Run once on the server:
    python scripts/migrate_table_html_passage.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import psycopg2
from app.core.config import settings


def get_connection():
    return psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)


def run():
    conn = get_connection()
    cur = conn.cursor()

    # ── 1. Add columns (safe – uses IF NOT EXISTS) ──────────────────────────
    print("Adding columns if not present...")
    cur.execute("""
        ALTER TABLE questions
        ADD COLUMN IF NOT EXISTS table_html TEXT,
        ADD COLUMN IF NOT EXISTS passage    TEXT
    """)
    conn.commit()
    print("  Columns ready.")

    # ── 2. Backfill from JSON source files ──────────────────────────────────
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    if not jamb_root.exists():
        print(f"ERROR: 'JAMB copy' directory not found at {jamb_root}")
        sys.exit(1)

    total_updated = 0
    total_skipped = 0

    json_files = sorted(jamb_root.glob("**/questions.json"))
    print(f"Scanning {len(json_files)} question files...")

    for jf in json_files:
        try:
            questions = json.load(open(jf, encoding="utf-8"))
        except Exception as e:
            print(f"  [SKIP] {jf}: {e}")
            continue

        for q in questions:
            table_html = q.get("table_html") or None
            passage    = q.get("passage")  or None
            if passage and not passage.strip():
                passage = None

            if not table_html and not passage:
                total_skipped += 1
                continue

            qid = q.get("id")
            if not qid:
                total_skipped += 1
                continue

            cur.execute("""
                UPDATE questions
                SET table_html = %s,
                    passage    = %s
                WHERE id = %s
            """, (table_html, passage, qid))
            if cur.rowcount:
                total_updated += 1
            else:
                total_skipped += 1

    conn.commit()
    cur.close()
    conn.close()

    print(f"\nDone. Updated: {total_updated}  |  Skipped (no data / not in DB): {total_skipped}")


if __name__ == "__main__":
    run()
