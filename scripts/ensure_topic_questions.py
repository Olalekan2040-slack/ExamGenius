"""
ensure_topic_questions.py
-------------------------
Guarantees a minimum number of JAMB-style questions per topic for each of
the 11 priority subjects.  For topics below the threshold it generates new
AI questions (JAMB-style, multiple-choice) and inserts them into the
`questions` + `options` tables as source='AI'.

Run from project root:
    python scripts/ensure_topic_questions.py

Flags:
    --min         Minimum questions per topic  (default: 15)
    --subjects    Comma-separated list          (default: all 11)
    --dry-run     Print gaps only, insert nothing
    --subject     Single subject to process
"""

import sys
import json
import time
import argparse
import re
import uuid
from pathlib import Path
from typing import List, Dict, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection
from app.core.config import settings

SYLLABUS_DIR = BASE_DIR / "syllabus" / "parsed"

SUBJECT_SLUG_MAP = {
    "Mathematics": "mathematics_syllabus",
    # DB stores subject as "English" (folder name from JAMB copy)
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

DEFAULT_MIN = 15
DELAY = 3.0  # seconds between AI calls


# ─────────────────────────────────────────────────────────────────────
# AI generation (minimal dependency, uses requests + settings)
# ─────────────────────────────────────────────────────────────────────

def _call_openrouter(prompt: str) -> str:
    import requests

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://examgenius.ng",
    }
    body = {
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }
    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=body,
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _extract_json(text: str):
    """Extract first JSON array or object from a string."""
    # Try ```json … ``` fence first
    m = re.search(r"```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```", text)
    if m:
        return json.loads(m.group(1))
    # Try bare JSON array/object
    m = re.search(r"(\[[\s\S]*?\]|\{[\s\S]*?\})", text)
    if m:
        return json.loads(m.group(1))
    raise ValueError("No JSON found in response")


def generate_ai_questions(
    subject: str, topic: str, subtopic: str, objectives: List[str], n: int
) -> List[Dict]:
    """Generate n JAMB-style MCQ questions via AI."""
    objectives_text = "\n".join(f"- {o}" for o in objectives[:6])
    prompt = f"""You are a JAMB exam question writer for Nigerian secondary school students.

SUBJECT: {subject}
TOPIC: {topic}
SUBTOPIC: {subtopic}
OBJECTIVES:
{objectives_text}

Generate EXACTLY {n} JAMB-style multiple-choice questions that test the objectives above.
Each question must have 4 options (A, B, C, D) with exactly one correct answer.
Questions should be exam-ready, clear, and appropriate for JAMB difficulty.

Return ONLY a valid JSON array (no prose, no markdown fence):
[
  {{
    "question": "Question text here",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "correct_answer": "A",
    "explanation": "Brief reason"
  }}
]"""

    raw = _call_openrouter(prompt)
    return _extract_json(raw)


# ─────────────────────────────────────────────────────────────────────
# DB helpers
# ─────────────────────────────────────────────────────────────────────

def count_questions(cursor, subject: str, topic: str) -> int:
    cursor.execute(
        "SELECT COUNT(*) FROM questions WHERE subject = ? AND topic = ?",
        (subject, topic),
    )
    row = cursor.fetchone()
    return row[0] if row else 0


def insert_question(cursor, conn, subject: str, topic: str, subtopic: str,
                    qdata: Dict) -> Optional[str]:
    """Insert a generated question and its options; return the new question id."""
    try:
        # questions.id is TEXT — generate a unique id
        qid = f"AI_{subject[:4].upper()}_{uuid.uuid4().hex[:12]}"

        cursor.execute(
            """
            INSERT INTO questions
                (id, subject, topic, subtopic, question, correct_option_key, year, exam, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'JAMB', 'AI')
            """,
            (
                qid,
                subject,
                topic,
                subtopic,
                qdata["question"],
                qdata["correct_answer"],
                2024,
            ),
        )

        for key, text in qdata["options"].items():
            cursor.execute(
                "INSERT INTO options (question_id, option_key, option_text) VALUES (?, ?, ?)",
                (qid, key, text),
            )
        conn.commit()
        return qid
    except Exception as e:
        conn.rollback()
        print(f"    ! Insert error: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────
# Core logic
# ─────────────────────────────────────────────────────────────────────

def load_syllabus(slug: str) -> dict:
    path = SYLLABUS_DIR / f"{slug}.json"
    if not path.exists():
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def process_subject(subject: str, slug: str, min_q: int, dry_run: bool, conn):
    cursor = conn.cursor()
    syllabus = load_syllabus(slug)
    if not syllabus:
        print(f"  ! Syllabus missing for {subject} — skipping")
        return

    topics = syllabus.get("topics", [])
    print(f"\n{'[DRY RUN] ' if dry_run else ''}{subject}: {len(topics)} topics")

    total_inserted = 0
    total_gaps = 0

    for t in topics:
        topic_name = t["name"]
        have = count_questions(cursor, subject, topic_name)
        need = max(0, min_q - have)

        if need == 0:
            continue

        total_gaps += need

        # Collect objectives across ALL subtopics for this topic
        all_objectives: List[str] = []
        all_subtopics = t.get("subtopics", [])
        first_subtopic = all_subtopics[0]["name"] if all_subtopics else topic_name
        for st in all_subtopics:
            all_objectives.extend(st.get("objectives", []))

        print(f"  Topic '{topic_name}': have {have}, need {need} more")

        if dry_run:
            continue

        # Generate in batches of up to 5 to keep prompt manageable
        inserted = 0
        remaining = need
        while remaining > 0:
            batch = min(remaining, 5)
            try:
                questions = generate_ai_questions(
                    subject, topic_name, first_subtopic,
                    all_objectives[:8], batch
                )
                for qd in questions:
                    if not isinstance(qd, dict):
                        continue
                    if not qd.get("question") or not qd.get("options") or not qd.get("correct_answer"):
                        continue
                    qid = insert_question(cursor, conn, subject, topic_name,
                                          first_subtopic, qd)
                    if qid:
                        inserted += 1
                remaining -= batch
                time.sleep(DELAY)
            except Exception as e:
                print(f"    ! Generation error: {e}")
                break

        total_inserted += inserted
        print(f"    → inserted {inserted}/{need} questions")

    if not dry_run:
        print(f"  ✓ {subject}: {total_inserted} new questions inserted (gaps: {total_gaps})")
    else:
        print(f"  [DRY RUN] {subject}: {total_gaps} questions would be generated")

    cursor.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--min", type=int, default=DEFAULT_MIN,
                        dest="min_q", help="Min questions per topic")
    parser.add_argument("--subjects",
                        default=",".join(SUBJECT_SLUG_MAP.keys()))
    parser.add_argument("--subject", default=None, help="Single subject")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.subject:
        subjects = {args.subject: SUBJECT_SLUG_MAP[args.subject]}
    else:
        subjects = {
            s.strip(): SUBJECT_SLUG_MAP[s.strip()]
            for s in args.subjects.split(",")
            if s.strip() in SUBJECT_SLUG_MAP
        }

    conn = get_connection()
    for subject, slug in subjects.items():
        process_subject(subject, slug, args.min_q, args.dry_run, conn)
    conn.close()
    print("\nAll done.")


if __name__ == "__main__":
    main()
