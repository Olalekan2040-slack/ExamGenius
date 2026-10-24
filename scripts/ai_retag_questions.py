"""
ai_retag_questions.py
---------------------
Retags JAMB questions with syllabus-aligned (topic, subtopic) using Gemini
AI classification against each subject's parsed syllabus taxonomy.

Updates BOTH the year JSON files under "JAMB copy/<Subject>/<Year>/questions.json"
and the PostgreSQL `questions` table (ids are identical in both).

Classifications are checkpointed to scripts/.retag_cache/<subject>.jsonl so an
interrupted run (quota, network) resumes where it stopped.

Usage:
    python scripts/ai_retag_questions.py --subject Biology --dry-run
    python scripts/ai_retag_questions.py --subject Biology          # classify + apply
    python scripts/ai_retag_questions.py --subject all
    python scripts/ai_retag_questions.py --subject Economics --limit 40   # test run
"""

import sys
import io
import os
import json
import time
import argparse
import re
from pathlib import Path
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

import requests
from dotenv import dotenv_values

from app.db.database import get_connection

SYLLABUS_DIR = BASE_DIR / "syllabus" / "parsed"
QUESTIONS_DIR = BASE_DIR / "JAMB copy"
CACHE_DIR = Path(__file__).resolve().parent / ".retag_cache"

GEMINI_API_KEY = (
    os.environ.get("GEMINI_API_KEY")
    or dotenv_values(BASE_DIR / ".env").get("GEMINI_API_KEY")
)
GEMINI_MODEL = "gemini-flash-latest"
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta"
    f"/models/{GEMINI_MODEL}:generateContent"
)

SUBJECT_SLUG_MAP = {
    "English": "english_language_syllabus",
    "Biology": "biology_syllabus",
    "Physics": "physics_syllabus",
    "Chemistry": "chemistry_syllabus",
    "Government": "government_syllabus",
    "Economics": "economics_syllabus",
    "Commerce": "commerce_syllabus",
    "Geography": "geography_syllabus",
    "Accounting": "accounting",
    "Literature in English": "literature_in_english_syllabus",
}

DEFAULT_BATCH_SIZE = 50
DELAY_BETWEEN_CALLS = 2.0

# Free-tier limit is 20 requests/minute; 4s spacing => ~15/min, safely under.
MIN_SECONDS_BETWEEN_CALLS = 4.0
_last_call_ts = 0.0


def _throttle():
    """Space out calls to respect the per-minute rate limit."""
    global _last_call_ts
    wait = MIN_SECONDS_BETWEEN_CALLS - (time.time() - _last_call_ts)
    if wait > 0:
        time.sleep(wait)
    _last_call_ts = time.time()


# ──────────────────────────────────────────────────────────────────────────────
# Gemini call (JSON mode, thinking disabled for speed + quota)
# ──────────────────────────────────────────────────────────────────────────────

def gemini_classify(prompt: str, retries: int = 6) -> str:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
        },
    }
    last_err = None
    for attempt in range(retries):
        try:
            _throttle()
            resp = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, timeout=60
            )
            if resp.status_code == 429:
                # Respect the API's "retry in Xs" hint when present.
                wait = 20
                m = re.search(r"retry in ([\d.]+)s", resp.text)
                if m:
                    wait = float(m.group(1)) + 2
                print(f"    429 rate-limited; waiting {wait:.0f}s ...", flush=True)
                time.sleep(wait)
                continue
            if resp.status_code in (500, 503):
                wait = (attempt + 1) * 8
                print(f"    {resp.status_code} server error; waiting {wait}s ...")
                time.sleep(wait)
                last_err = f"{resp.status_code} server error"
                continue
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except requests.exceptions.Timeout:
            last_err = "timeout"
            time.sleep(5)
        except Exception as e:
            last_err = str(e)
            time.sleep(5)
    raise RuntimeError(f"Gemini API failed after {retries} attempts: {last_err}")


# ──────────────────────────────────────────────────────────────────────────────
# Taxonomy
# ──────────────────────────────────────────────────────────────────────────────

def load_taxonomy(subject: str):
    """Return (code→(topic, subtopic) dict, taxonomy prompt block)."""
    slug = SUBJECT_SLUG_MAP[subject]
    with open(SYLLABUS_DIR / f"{slug}.json", encoding="utf-8") as f:
        syl = json.load(f)

    codes = {}
    lines = []
    for ti, topic in enumerate(syl["topics"], 1):
        lines.append(f"T{ti}: {topic['name']}")
        for si, sub in enumerate(topic["subtopics"], 1):
            code = f"T{ti}.S{si}"
            codes[code] = (topic["name"], sub["name"])
            lines.append(f"  {code}: {sub['name']}")
    return codes, "\n".join(lines)


# ──────────────────────────────────────────────────────────────────────────────
# Question loading
# ──────────────────────────────────────────────────────────────────────────────

def load_questions(subject: str):
    """Load all questions for a subject from the year JSON files."""
    qdir = QUESTIONS_DIR / subject
    questions = []
    for year_dir in sorted(qdir.iterdir()):
        qf = year_dir / "questions.json"
        if not qf.exists():
            continue
        with open(qf, encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            data = list(data.values())
        questions.extend(data)
    return questions


def question_payload(q: dict, include_old_subtopic: bool) -> str:
    """Compact one-question block for the prompt."""
    text = (q.get("question") or "").strip()[:450]
    opts = q.get("options") or {}
    opts_str = " | ".join(f"{k}: {str(v)[:120]}" for k, v in opts.items())
    parts = [f"QUESTION: {text}"]
    passage = (q.get("passage") or "").strip()
    if passage:
        parts.insert(0, f"PASSAGE (excerpt): {passage[:350]}")
    if opts_str:
        parts.append(f"OPTIONS: {opts_str}")
    if include_old_subtopic and q.get("subtopic"):
        parts.append(f"PREVIOUS TAG HINT: {q['subtopic']}")
    return "\n".join(parts)


def build_prompt(subject: str, taxonomy_block: str, batch: list, include_hint: bool) -> str:
    q_blocks = []
    for i, q in enumerate(batch, 1):
        q_blocks.append(f"--- Q{i} ---\n{question_payload(q, include_hint)}")
    questions_text = "\n".join(q_blocks)

    return f"""You are an expert JAMB (Nigerian university entrance exam) {subject} tutor.
Classify each past question below into EXACTLY ONE subtopic of the official
JAMB {subject} syllabus taxonomy. Choose the code whose subtopic best matches
the skill/knowledge the question tests.

TAXONOMY:
{taxonomy_block}

QUESTIONS:
{questions_text}

Respond with ONLY a JSON array, one object per question, in the same order:
[{{"n": 1, "code": "T3.S2"}}, {{"n": 2, "code": "T1.S1"}}, ...]
Every "code" MUST be one of the Tx.Sy codes listed in the taxonomy. Classify
all {len(batch)} questions."""


def parse_response(raw: str, batch_len: int):
    """Return {n: code} from the model response.

    Tries strict JSON first; on truncation/malformation, falls back to
    regex-extracting every {"n": .., "code": ".."} pair so a partial
    response still yields usable classifications.
    """
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
    out = {}
    try:
        data = json.loads(raw)
        for item in data:
            n = int(item["n"])
            if 1 <= n <= batch_len:
                out[n] = str(item["code"]).strip().upper()
        return out
    except Exception:
        pass

    # Regex fallback: pull out (n, code) pairs regardless of surrounding syntax
    for m in re.finditer(
        r'"n"\s*:\s*(\d+)\s*,\s*"code"\s*:\s*"([^"]+)"', raw
    ):
        n = int(m.group(1))
        if 1 <= n <= batch_len:
            out[n] = m.group(2).strip().upper()
    return out


# ──────────────────────────────────────────────────────────────────────────────
# Cache
# ──────────────────────────────────────────────────────────────────────────────

def cache_path(subject: str) -> Path:
    return CACHE_DIR / f"{SUBJECT_SLUG_MAP[subject]}.jsonl"


def load_cache(subject: str) -> dict:
    path = cache_path(subject)
    cached = {}
    if path.exists():
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                cached[rec["id"]] = (rec["topic"], rec["subtopic"])
    return cached


def append_cache(subject: str, records: list):
    CACHE_DIR.mkdir(exist_ok=True)
    with open(cache_path(subject), "a", encoding="utf-8") as f:
        for qid, topic, subtopic in records:
            f.write(json.dumps(
                {"id": qid, "topic": topic, "subtopic": subtopic},
                ensure_ascii=False) + "\n")


# ──────────────────────────────────────────────────────────────────────────────
# Classification driver
# ──────────────────────────────────────────────────────────────────────────────

def classify_subject(subject: str, batch_size: int, limit: int | None):
    codes, taxonomy_block = load_taxonomy(subject)
    questions = load_questions(subject)
    cached = load_cache(subject)

    todo = [q for q in questions if q["id"] not in cached]
    if limit:
        todo = todo[:limit]

    print(f"\n=== {subject}: {len(questions)} questions, "
          f"{len(cached)} cached, {len(todo)} to classify ===")

    include_hint = subject == "English"  # existing English subtopics are trustworthy
    failed = []

    batches = [todo[i:i + batch_size] for i in range(0, len(todo), batch_size)]
    for bi, batch in enumerate(batches, 1):
        prompt = build_prompt(subject, taxonomy_block, batch, include_hint)
        try:
            raw = gemini_classify(prompt)
            mapping = parse_response(raw, len(batch))
        except Exception as e:
            print(f"  batch {bi}/{len(batches)} FAILED: {e}")
            failed.extend(q["id"] for q in batch)
            time.sleep(DELAY_BETWEEN_CALLS)
            continue

        records = []
        for i, q in enumerate(batch, 1):
            code = mapping.get(i)
            if code in codes:
                topic, subtopic = codes[code]
                records.append((q["id"], topic, subtopic))
            else:
                failed.append(q["id"])
        append_cache(subject, records)
        print(f"  batch {bi}/{len(batches)}: {len(records)}/{len(batch)} classified", flush=True)

    # One retry pass for failures (smaller batches)
    if failed:
        print(f"  retrying {len(failed)} failed questions ...")
        by_id = {q["id"]: q for q in questions}
        retry_qs = [by_id[qid] for qid in failed if qid in by_id]
        still_failed = []
        for i in range(0, len(retry_qs), 10):
            batch = retry_qs[i:i + 10]
            try:
                raw = gemini_classify(build_prompt(subject, taxonomy_block, batch, include_hint))
                mapping = parse_response(raw, len(batch))
            except Exception as e:
                print(f"  retry batch failed: {e}")
                still_failed.extend(q["id"] for q in batch)
                continue
            records = []
            for j, q in enumerate(batch, 1):
                code = mapping.get(j)
                if code in codes:
                    topic, subtopic = codes[code]
                    records.append((q["id"], topic, subtopic))
                else:
                    still_failed.append(q["id"])
            append_cache(subject, records)
            time.sleep(DELAY_BETWEEN_CALLS)
        if still_failed:
            CACHE_DIR.mkdir(exist_ok=True)
            review = CACHE_DIR / f"{SUBJECT_SLUG_MAP[subject]}_review.json"
            with open(review, "w", encoding="utf-8") as f:
                json.dump(still_failed, f, indent=2)
            print(f"  {len(still_failed)} questions unresolved -> {review}")


def report_distribution(subject: str):
    cached = load_cache(subject)
    questions = load_questions(subject)
    topic_c = Counter()
    sub_c = Counter()
    untagged = 0
    for q in questions:
        if q["id"] in cached:
            t, s = cached[q["id"]]
            topic_c[t] += 1
            sub_c[f"{t} > {s}"] += 1
        else:
            untagged += 1
    print(f"\n── {subject}: classified {sum(topic_c.values())} / {len(questions)} "
          f"(unclassified: {untagged}) ──")
    codes, _ = load_taxonomy(subject)
    syllabus_topics = list(dict.fromkeys(t for t, _s in codes.values()))
    for t in syllabus_topics:
        print(f"  {topic_c.get(t, 0):5d}  {t}")
    extra = set(topic_c) - set(syllabus_topics)
    if extra:
        print(f"  !! topics outside syllabus: {extra}")


def sync_analytics(subject: str):
    """Re-derive practice_attempts.topic from the retagged questions.

    Historical attempts store the topic string as it was when answered; after
    retagging those are stale. Each attempt carries the question_id, so we can
    copy the authoritative new topic straight from the questions table. This
    keeps per-topic analytics consistent with the new taxonomy.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE practice_attempts pa
        SET topic = q.topic
        FROM questions q
        WHERE pa.question_id = q.id
          AND pa.subject = %s
          AND q.topic IS NOT NULL
          AND pa.topic IS DISTINCT FROM q.topic
        """,
        (subject,),
    )
    conn.commit()
    print(f"{subject}: analytics synced — practice_attempts.topic aligned to questions")
    conn.close()


def apply_tags(subject: str):
    """Write cached classifications to JSON files and the DB."""
    cached = load_cache(subject)
    if not cached:
        print(f"{subject}: nothing cached to apply")
        return

    # JSON files
    qdir = QUESTIONS_DIR / subject
    json_updates = 0
    for year_dir in sorted(qdir.iterdir()):
        qf = year_dir / "questions.json"
        if not qf.exists():
            continue
        with open(qf, encoding="utf-8") as f:
            data = json.load(f)
        changed = False
        for q in data:
            tag = cached.get(q.get("id"))
            if tag and (q.get("topic") != tag[0] or q.get("subtopic") != tag[1]):
                q["topic"], q["subtopic"] = tag
                changed = True
                json_updates += 1
        if changed:
            with open(qf, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    # DB
    conn = get_connection()
    cur = conn.cursor()
    updates = [(t, s, qid) for qid, (t, s) in cached.items()]
    cur.executemany(
        "UPDATE questions SET topic = %s, subtopic = %s WHERE id = %s", updates
    )
    conn.commit()
    conn.close()
    print(f"{subject}: applied — {json_updates} JSON updates, "
          f"{len(updates)} DB rows targeted")


# ──────────────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--subject", required=True,
                    help='Subject name (e.g. "Biology") or "all"')
    ap.add_argument("--dry-run", action="store_true",
                    help="Classify + report only; do not write JSON/DB")
    ap.add_argument("--report-only", action="store_true",
                    help="Only print distribution from cache; no API calls")
    ap.add_argument("--apply-cached", action="store_true",
                    help="Apply already-cached tags to DB/JSON and sync analytics; no API calls")
    ap.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    ap.add_argument("--limit", type=int, default=None,
                    help="Classify at most N uncached questions (testing)")
    args = ap.parse_args()

    if not GEMINI_API_KEY:
        sys.exit("GEMINI_API_KEY not found in environment or .env")

    subjects = (list(SUBJECT_SLUG_MAP) if args.subject.lower() == "all"
                else [args.subject])
    for s in subjects:
        if s not in SUBJECT_SLUG_MAP:
            sys.exit(f"Unknown subject: {s}. Choose from {list(SUBJECT_SLUG_MAP)}")

    for subject in subjects:
        if args.apply_cached:
            report_distribution(subject)
            apply_tags(subject)
            sync_analytics(subject)
            continue
        if not args.report_only:
            classify_subject(subject, args.batch_size, args.limit)
        report_distribution(subject)
        if not args.dry_run and not args.report_only:
            apply_tags(subject)
            sync_analytics(subject)


if __name__ == "__main__":
    main()
