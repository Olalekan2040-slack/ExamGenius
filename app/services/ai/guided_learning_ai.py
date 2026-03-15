"""
AI Service for Guided Learning
────────────────────────────────────────────────────────────────────
Content strategy
  • Topic / subtopic EXPLANATIONS  → fetched from Wikipedia (online)
  • "Ask about this concept"       → Google Gemini AI
  • Subtopic quiz generation       → Google Gemini AI
  • Answer explanations            → Google Gemini AI
  • Re-explain                     → Wikipedia (different query angle)
────────────────────────────────────────────────────────────────────
"""

import json
import re
import time
import requests
from typing import Dict, List, Optional
from urllib.parse import quote

# ── Google Gemini API (used ONLY for interactive AI features) ────────
GEMINI_API_KEY = "REDACTED_GEMINI_KEY"
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta"
    "/models/gemini-2.0-flash:generateContent"
)


def make_gemini_request(
    prompt: str,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    retries: int = 3,
) -> str:
    """Call Google Gemini REST API directly."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }
    last_err: Optional[str] = None
    for attempt in range(retries):
        try:
            resp = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json=payload,
                timeout=60,
            )
            if resp.status_code == 429:
                time.sleep((attempt + 1) * 5)
                continue
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except requests.exceptions.Timeout:
            last_err = "Request timeout"
            time.sleep(2)
        except Exception as e:
            last_err = str(e)
            time.sleep(2)
    raise Exception(f"Gemini API failed: {last_err}")


# ── Wikipedia helpers ────────────────────────────────────────────────

_WIKI_HEADERS = {"User-Agent": "ExamGenius/1.0 (examgenius.ng; educational)"}


def _wiki_search(query: str, limit: int = 5) -> Optional[str]:
    """Return the best-matching Wikipedia article title for a query."""
    try:
        r = requests.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "list": "search",
                "srsearch": query,
                "srlimit": limit,
                "format": "json",
            },
            timeout=10,
            headers=_WIKI_HEADERS,
        )
        results = r.json().get("query", {}).get("search", [])
        if results:
            return results[0]["title"]
    except Exception:
        pass
    return None


def _wiki_fetch(title: str) -> Optional[Dict]:
    """Fetch a Wikipedia article's summary and plain-text extract."""
    try:
        r1 = requests.get(
            f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(title)}",
            timeout=10,
            headers=_WIKI_HEADERS,
        )
        summary_data = r1.json()

        r2 = requests.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "titles": title,
                "prop": "extracts",
                "explaintext": True,
                "exsectionformat": "plain",
                "exchars": 7000,
                "format": "json",
            },
            timeout=10,
            headers=_WIKI_HEADERS,
        )
        pages = r2.json().get("query", {}).get("pages", {})
        full_text = next(iter(pages.values()), {}).get("extract", "")
        desktop_url = (
            summary_data.get("content_urls", {})
            .get("desktop", {})
            .get("page", "")
        )
        return {
            "title": summary_data.get("title", title),
            "summary": summary_data.get("extract", "")[:700],
            "content": full_text,
            "url": desktop_url,
        }
    except Exception:
        return None


def _clean_paragraphs(text: str, min_len: int = 60) -> List[str]:
    """Split plain text into non-trivial paragraphs."""
    raw = [p.strip() for p in text.split("\n") if p.strip()]
    return [p for p in raw if len(p) >= min_len]


def _extract_key_points(
    paragraphs: List[str], keywords: List[str], n: int = 4
) -> List[str]:
    """Pull concise keyword-relevant sentences as key points."""
    kws = [k.lower() for k in keywords if len(k) > 4]
    points: List[str] = []
    for para in paragraphs:
        for sent in re.split(r"(?<=[.!?])\s+", para):
            sent = sent.strip()
            if 30 < len(sent) < 220 and any(k in sent.lower() for k in kws):
                points.append(sent.rstrip("."))
                if len(points) >= n:
                    return points
    # Fallback: first sentence of each paragraph
    for para in paragraphs[:6]:
        first = re.split(r"(?<=[.!?])\s+", para)[0].strip()
        if 30 < len(first) < 220:
            points.append(first.rstrip("."))
            if len(points) >= n:
                break
    return points


def _build_explanation_html(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    wiki: Optional[Dict],
) -> str:
    """Assemble readable HTML from Wikipedia content."""
    if not wiki or not wiki.get("content"):
        return (
            "<div class='gl-web-content'>"
            f"<p>Detailed content for <strong>{subtopic}</strong> is not yet "
            "available online. Please consult your textbook or ask your "
            "teacher directly.</p></div>"
        )

    title   = wiki["title"]
    summary = wiki["summary"]
    content = wiki["content"]
    url     = wiki.get("url", "")

    paragraphs = _clean_paragraphs(content)
    body = [p for p in paragraphs if p.strip() != summary.strip() and len(p) >= 80][:7]

    parts = ["<div class='gl-web-content'>"]
    parts.append(f"<h4>{title}</h4>")
    if summary:
        parts.append(f"<p><strong>Overview:</strong> {summary}</p>")
    if body:
        parts.append("<hr/>")
        parts.append("<h5>Detailed Explanation</h5>")
        for p in body:
            parts.append(f"<p>{p}</p>")
    if url:
        parts.append(
            f"<p class='source-ref'><small>"
            f"📖 Source: <a href='{url}' target='_blank' rel='noopener'>"
            f"Wikipedia – {title}</a></small></p>"
        )
    parts.append("</div>")
    return "\n".join(parts)


def _make_explanation_dict(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    wiki: Optional[Dict],
) -> Dict:
    """Return the full explanation dictionary using web content."""
    html = _build_explanation_html(subject, topic, subtopic, objective, wiki)
    keywords = (objective + " " + subtopic + " " + topic).split()
    key_points: List[str] = []
    summary_text = ""
    if wiki and wiki.get("content"):
        paras = _clean_paragraphs(wiki["content"])
        key_points = _extract_key_points(paras, keywords)
        summary_text = wiki["summary"][:350]

    jamb_tip = (
        f"JAMB frequently tests definitions, examples, and applications of "
        f"{subtopic}. Study both the concept and its real-world uses."
    )
    return {
        "explanation_html":  html,
        "explanation":       html,   # legacy
        "key_points":        key_points,
        "worked_example":    None,
        "svg_diagram":       None,
        "diagram_caption":   None,
        "jamb_tip":          jamb_tip,
        "common_mistakes":   [],
        "summary":           summary_text,
        "example":           None,   # legacy
        "needs_diagram":     False,  # legacy
        "diagram_description": None, # legacy
    }


# ── Mathematics: Gemini-generated step-by-step calculated explanations ─────

_MATH_SYSTEM = (
    "You are an expert Mathematics teacher preparing Nigerian JAMB students. "
    "Always show full step-by-step calculations and workings. "
    "Use simple, clear language. Format with proper HTML."
)


def _generate_math_explanation(topic: str, subtopic: str, objective: str) -> Dict:
    """
    Generate a detailed, calculation-based Mathematics explanation using Gemini.
    Returns HTML matching the same structure as Wikipedia explanations.
    """
    prompt = f"""You are teaching a JAMB Mathematics topic to a Nigerian secondary school student.

TOPIC: {topic}
SUBTOPIC: {subtopic}
OBJECTIVE: {objective}

Write a DETAILED, CALCULATION-BASED explanation. Structure it as follows:

1. CONCEPT DEFINITION — Clear, simple explanation of what this is (2–3 sentences)
2. KEY FORMULA(S) — State ALL relevant formulas clearly, e.g. "a² + b² = c²"
3. STEP-BY-STEP WORKED EXAMPLE — Solve a realistic JAMB-style problem completely:
   - State the problem first
   - Show EVERY calculation step labeled Step 1, Step 2 ...
   - Box/highlight the final answer
4. SECOND WORKED EXAMPLE — A slightly harder example with full working
5. JAMB EXAM TIP — One specific thing JAMB always tests on this topic
6. COMMON MISTAKES — 2 mistakes students make with this concept

FORMAT: Return as HTML only (no JSON, no markdown). Use:
- <h4> for section headings
- <p> for paragraphs
- <ul><li> for lists
- <strong> for formulas, key terms, final answers
- <div class='worked-example'> to wrap each worked example
- <div class='step'><span class='step-label'>Step N:</span> ... </div> for each step

Be thorough — show actual numbers, actual calculations, actual answers."""

    try:
        html = make_gemini_request(
            prompt,
            temperature=0.3,   # low temp = consistent, precise calculations
            max_tokens=2500,
        )
        # Wrap in our standard container
        wrapped = f"<div class='gl-web-content gl-math-content'>\n{html}\n</div>"

        # Extract key points from text (simple sentence extraction)
        import re as _re
        sentences = _re.split(r'(?<=[.!?])\s+', _re.sub(r'<[^>]+>', ' ', html))
        key_points = [
            s.strip().rstrip('.')
            for s in sentences
            if 30 < len(s.strip()) < 180
        ][:4]

        return {
            "explanation_html":  wrapped,
            "explanation":       wrapped,
            "key_points":        key_points,
            "worked_example":    None,
            "svg_diagram":       None,
            "diagram_caption":   None,
            "jamb_tip":          f"JAMB always includes at least one {subtopic} question — master the formula and practice with different numbers.",
            "common_mistakes":   [],
            "summary":           f"Understand {subtopic} within {topic}: know the formulas, follow the steps, check your arithmetic.",
            "example":           None,
            "needs_diagram":     False,
            "diagram_description": None,
        }
    except Exception as e:
        return _make_explanation_dict("Mathematics", topic, subtopic, objective, None)


# ── Public explanation functions ─────────────────────────────────────────────

def generate_objective_explanation(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
) -> Dict:
    """
    Generate a detailed explanation for a learning objective.
    - Mathematics → Gemini AI with step-by-step calculations
    - All other subjects → Wikipedia (online encyclopaedic content)
    """
    if subject.lower() in ("mathematics", "maths"):
        return _generate_math_explanation(topic, subtopic, objective)

    # Wikipedia path for all other subjects
    obj_phrase = " ".join([w for w in objective.split() if len(w) > 4][:5])
    queries = [
        topic,
        f"{topic} {subject}",
        subtopic,
    ]
    if obj_phrase and obj_phrase.lower() not in topic.lower():
        queries.append(obj_phrase)

    wiki = None
    for q in queries:
        if not q.strip():
            continue
        title = _wiki_search(q)
        if title:
            candidate = _wiki_fetch(title)
            if candidate and candidate.get("content"):
                wiki = candidate
                break

    return _make_explanation_dict(subject, topic, subtopic, objective, wiki)


def regenerate_explanation(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    previous_explanation: str = "",
) -> Dict:
    """
    Fetch explanation from a different angle (for 'Explain differently' button).
    Mathematics: Gemini regenerates with a different worked example.
    Others: Wikipedia with a different search angle.
    """
    if subject.lower() in ("mathematics", "maths"):
        # Gemini with explicit instruction to use a different worked example
        prompt = f"""You are re-teaching a JAMB Mathematics objective to a student who wants a FRESH explanation.

TOPIC: {topic}
SUBTOPIC: {subtopic}
OBJECTIVE: {objective}

Use a COMPLETELY DIFFERENT worked example from before. Try a different approach:
- Different numbers / problem context
- Explain using a real-life analogy if possible
- Still show full step-by-step calculations

Same HTML structure:
1. Quick concept recap (1–2 sentences)
2. Key formula(s)
3. NEW worked example with full step-by-step working (different from the first time)
4. Another variation example
5. Memory trick or shortcut

Return HTML only. Use <div class='worked-example'>, <div class='step'>, <strong> for formulas and answers."""
        try:
            html = make_gemini_request(prompt, temperature=0.6, max_tokens=2000)
            wrapped = f"<div class='gl-web-content gl-math-content'>\n{html}\n</div>"
            return {
                "explanation_html":  wrapped,
                "explanation":       wrapped,
                "key_points":        [],
                "worked_example":    None,
                "svg_diagram":       None,
                "diagram_caption":   None,
                "jamb_tip":          f"Practice {subtopic} with varied examples — JAMB changes the numbers each year.",
                "common_mistakes":   [],
                "summary":           f"A fresh look at {subtopic}: same concept, different examples.",
                "example":           None,
                "needs_diagram":     False,
                "diagram_description": None,
            }
        except Exception:
            return _generate_math_explanation(topic, subtopic, objective)

    # Wikipedia path for all other subjects
    obj_phrase = " ".join([w for w in objective.split() if len(w) > 4][:6])
    queries = [
        subtopic,
        f"{subject} {topic}",
        obj_phrase,
        f"{subtopic} definition",
        topic,
    ]

    wiki = None
    for q in queries:
        if not q.strip():
            continue
        title = _wiki_search(q)
        if title:
            candidate = _wiki_fetch(title)
            if candidate and candidate.get("content"):
                wiki = candidate
                break

    return _make_explanation_dict(subject, topic, subtopic, objective, wiki)


def generate_diagram_prompt(subject: str, topic: str, objective: str, description: str) -> str:
    """Returns a diagram description string (no AI generation)."""
    return f"Diagram showing {description} for {subject} – {topic}"


# ── Gemini-powered interactive features ─────────────────────────────

GUIDED_LEARNING_SYSTEM_PROMPT = (
    "You are ExamGenius, a friendly JAMB tutor for Nigerian secondary school "
    "students. Be concise, clear, and always relate answers back to JAMB exam."
)


def answer_student_question(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    explanation_context: str,
    student_question: str,
) -> str:
    """
    Answer a student's question using Gemini AI.
    This is the ONLY function that uses AI generation in guided learning.
    """
    prompt = f"""You are a calm, friendly JAMB tutor answering a student's question.

CONTEXT:
- Subject: {subject}
- Topic: {topic}
- Subtopic: {subtopic}
- Current objective: {objective}
- What was just taught: {explanation_context[:500]}

STUDENT'S QUESTION: {student_question}

RULES:
1. Answer ONLY in context of this objective
2. Do NOT introduce unrelated topics
3. Use simple English a Nigerian SS student can understand
4. Be conversational and encouraging
5. If the question is off-topic, gently redirect
6. Keep response to 2-4 sentences max
7. If the student seems confused, try a fresh analogy

Respond directly without any prefix like "AI:" or "Tutor:"."""

    try:
        return make_gemini_request(prompt, temperature=0.6, max_tokens=400)
    except Exception:
        return (
            "I'm sorry, I couldn't process your question right now. "
            "Please try again in a moment."
        )


def explain_question_answer(
    question_text: str,
    options: Dict[str, str],
    correct_answer: str,
    student_answer: str,
    objective_context: str,
) -> str:
    """Explain why an answer is correct or wrong (Gemini AI)."""
    is_correct = student_answer == correct_answer
    options_text = "\n".join([f"{k}: {v}" for k, v in options.items()])

    prompt = f"""A Nigerian student just answered a JAMB question {"correctly" if is_correct else "incorrectly"}.

QUESTION: {question_text}

OPTIONS:
{options_text}

CORRECT ANSWER: {correct_answer}
STUDENT'S ANSWER: {student_answer}
OBJECTIVE: {objective_context}

TASK: {"Confirm why the answer is correct and reinforce the concept." if is_correct else "Kindly explain why the correct answer is right and where the student may have gone wrong."}

RULES:
1. Be {"encouraging" if is_correct else "supportive and non-critical"}
2. Use simple language
3. Keep it to 2-3 sentences
4. Connect back to the learning objective
5. Do not repeat the full question

Respond directly:"""

    try:
        return make_gemini_request(prompt, temperature=0.5, max_tokens=300)
    except Exception:
        return f"The correct answer is {correct_answer}. Review {objective_context} to understand why."


def get_related_questions(
    cursor,
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    limit: int = 2
) -> List[Dict]:
    """
    Find questions that match the current objective.
    Uses keyword matching and topic filtering.
    """

    # Extract keywords from objective
    keywords = [w.lower() for w in objective.split() if len(w) > 4]

    # First try exact subtopic match
    cursor.execute("""
        SELECT q.id, q.question, q.correct_option_key, q.year, q.image_path, NULL as passage
        FROM questions q
        WHERE q.subject = %s AND q.topic = %s AND q.exam = 'JAMB'
        ORDER BY RANDOM()
        LIMIT %s
    """, (subject, topic, limit * 3))

    candidates = cursor.fetchall()

    # Score by keyword relevance
    scored = []
    for q in candidates:
        question_lower = q[1].lower()
        score = sum(1 for kw in keywords if kw in question_lower)
        scored.append((score, q))

    # Sort by score descending and take top N
    scored.sort(key=lambda x: x[0], reverse=True)

    results = []
    for _, q in scored[:limit]:
        question_id = q[0]

        # Get options
        cursor.execute("""
            SELECT option_key, option_text
            FROM options
            WHERE question_id = %s
            ORDER BY option_key
        """, (question_id,))

        options = {row[0]: row[1] for row in cursor.fetchall()}

        results.append({
            "question_id": question_id,
            "question": q[1],
            "correct_answer": q[2],
            "year": q[3],
            "image_path": q[4],
            "passage": q[5],
            "options": options
        })

    return results


def generate_subtopic_quiz(
    cursor,
    subject: str,
    topic: str,
    subtopic: str,
    objectives: List[str],
    limit: int = 5,
) -> List[Dict]:
    """
    Build a quiz for a completed subtopic.
    Prefers JAMB past questions from the DB; uses Gemini AI to fill gaps.
    """
    # ── 1. Pull from DB ──────────────────────────────────────────────
    db_questions: List[Dict] = []
    try:
        cursor.execute(
            """
            SELECT q.id, q.question, q.correct_option_key, q.year, q.image_path, NULL AS passage
            FROM questions q
            WHERE q.subject = %s AND q.topic = %s AND q.exam = 'JAMB'
            ORDER BY RANDOM()
            LIMIT %s
            """,
            (subject, topic, limit * 2),
        )
        candidates = cursor.fetchall()

        all_kws = [w.lower() for obj in objectives for w in obj.split() if len(w) > 4]
        scored = sorted(
            candidates,
            key=lambda q: sum(1 for kw in all_kws if kw in q[1].lower()),
            reverse=True,
        )

        for q in scored[:limit]:
            cursor.execute(
                "SELECT option_key, option_text FROM options "
                "WHERE question_id = %s ORDER BY option_key",
                (q[0],),
            )
            opts = {row[0]: row[1] for row in cursor.fetchall()}
            if opts:
                db_questions.append({
                    "question_id": q[0],
                    "question": q[1],
                    "correct_answer": q[2],
                    "year": q[3],
                    "image_path": q[4],
                    "passage": q[5],
                    "options": opts,
                    "source": "jamb",
                })
    except Exception as e:
        print(f"DB quiz fetch error: {e}")

    if len(db_questions) >= 3:
        return db_questions[:limit]

    # ── 2. Fill remaining slots with Gemini-generated questions ─────
    needed = limit - len(db_questions)
    objectives_text = "\n".join(f"- {o}" for o in objectives)

    prompt = f"""Generate {needed} JAMB-style multiple choice questions for a Nigerian student.

SUBJECT: {subject}
TOPIC: {topic}
SUBTOPIC: {subtopic}
LEARNING OBJECTIVES:
{objectives_text}

Return ONLY a JSON array (no markdown):
[
  {{
    "question": "The question text",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "correct_answer": "A",
    "explanation": "Brief reason"
  }}
]

Rules:
1. JAMB difficulty level
2. Exactly 4 options (A-D) per question
3. One correct answer per question
4. Test real understanding, not rote memorization"""

    try:
        raw = make_gemini_request(prompt, temperature=0.6, max_tokens=2000)
        j = raw.strip()
        for prefix in ("```json", "```"):
            if j.startswith(prefix):
                j = j[len(prefix):]
        if j.endswith("```"):
            j = j[:-3]

        ai_questions = json.loads(j.strip())
        for i, q in enumerate(ai_questions):
            q.setdefault("question_id", f"ai_{i}")
            q.setdefault("year", None)
            q.setdefault("image_path", None)
            q.setdefault("passage", None)
            q["source"] = "ai_generated"

        return db_questions + ai_questions[:needed]
    except Exception as e:
        print(f"Gemini quiz generation error: {e}")
        return db_questions
