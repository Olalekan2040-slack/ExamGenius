"""
AI Service for Guided Learning (via OpenRouter)
Handles objective explanations, SVG diagram generation, subtopic quizzes, and student Q&A
Uses OpenRouter API with configurable models
"""

import json
import time
import requests
from typing import Dict, List, Optional
from app.core.config import settings

# API Configuration - Use OpenRouter
OPENROUTER_API_KEY = settings.OPENROUTER_API_KEY or "REDACTED_OPENROUTER_KEY"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Model selection - use a capable model for rich educational content
AI_MODEL = "google/gemini-2.0-flash-exp:free"


def make_openrouter_request(prompt: str, temperature: float = 0.7, max_tokens: int = 3000, retries: int = 3, system_prompt: str = None) -> str:
    """Make a request to OpenRouter API"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://examgenius.ng",
        "X-Title": "ExamGenius Guided Learning",
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": AI_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    last_error = None
    for attempt in range(retries):
        try:
            response = requests.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=90,
            )

            if response.status_code == 429:
                wait_time = (attempt + 1) * 5
                print(f"Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            data = response.json()

            content = data['choices'][0]['message'].get('content', '')
            if not content:
                raise Exception("Empty response from API")

            return content

        except requests.exceptions.Timeout:
            last_error = "Request timeout"
            time.sleep(2)
        except requests.exceptions.RequestException as e:
            last_error = str(e)
            time.sleep(2)
        except (KeyError, IndexError) as e:
            last_error = f"Parse error: {str(e)}"
            break
        except Exception as e:
            last_error = str(e)
            break

    raise Exception(f"OpenRouter API failed: {last_error}")


GUIDED_LEARNING_SYSTEM_PROMPT = """You are ExamGenius, an expert JAMB tutor for Nigerian students. 
You explain topics in a clear, structured, and engaging way that helps students truly understand concepts.
Your explanations follow the JAMB syllabus and are optimized for exam preparation.
You use simple English that secondary school students can easily understand.
When diagrams help understanding, you create them using SVG format that can be rendered in a web browser."""


def generate_objective_explanation(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str
) -> Dict:
    """
    Generate a rich, comprehensive explanation for a learning objective.
    Includes structured content, SVG diagrams where needed, and JAMB-focused tips.
    Returns HTML-formatted content ready for display.
    """

    prompt = f"""You are explaining a JAMB learning objective to a Nigerian secondary school student.

SUBJECT: {subject}
TOPIC: {topic}
SUBTOPIC: {subtopic}
OBJECTIVE: {objective}

Generate a comprehensive, well-structured explanation. Follow this exact JSON format:

{{
    "explanation_html": "<div class='ai-lesson-content'>Your full HTML explanation here</div>",
    "key_points": ["Key point 1", "Key point 2", "Key point 3"],
    "worked_example": {{
        "problem": "A worked example problem relevant to JAMB",
        "solution_html": "<div>Step by step solution in HTML</div>"
    }},
    "svg_diagram": "<svg>...</svg> or null if no diagram needed",
    "diagram_caption": "Caption for the diagram or null",
    "jamb_tip": "One important exam tip about how JAMB tests this",
    "common_mistakes": ["Mistake 1 students make", "Mistake 2"],
    "summary": "A 2-3 sentence summary of the key takeaway"
}}

CRITICAL RULES for explanation_html:
1. Use proper HTML tags: <p>, <strong>, <em>, <ul>, <li>, <h4>, <h5>
2. Break content into clear sections with headings
3. Use <strong> for important terms and definitions
4. Use bullet lists <ul><li> for listing items
5. Include real-world examples Nigerian students can relate to
6. Keep language simple but thorough - explain like you're teaching, not lecturing
7. Each paragraph should teach ONE idea clearly
8. Use analogies and relatable comparisons where helpful
9. Content should be 300-500 words (substantial but not overwhelming)

CRITICAL RULES for svg_diagram (when the concept benefits from a visual):
1. Create a proper SVG with viewBox="0 0 400 300"
2. Use clear labels, arrows, and colors
3. Keep it simple and educational
4. Use these colors: #4F46E5 (primary), #10B981 (success), #F59E0B (accent), #EF4444 (danger)
5. Include text labels directly in the SVG
6. Set svg width="100%" and height="auto" for responsive display
7. For concepts like structures, processes, cycles, forces, circuits - ALWAYS include a diagram
8. For pure text/definition concepts, set svg_diagram to null

For worked_example:
1. Use a realistic JAMB-style question
2. Show clear step-by-step solution
3. Use HTML formatting for clarity

Return ONLY valid JSON. No markdown code blocks."""

    try:
        response = make_openrouter_request(
            prompt,
            temperature=0.5,
            max_tokens=3000,
            system_prompt=GUIDED_LEARNING_SYSTEM_PROMPT
        )

        # Parse JSON from response
        json_match = response.strip()
        if json_match.startswith('```json'):
            json_match = json_match[7:]
        if json_match.startswith('```'):
            json_match = json_match[3:]
        if json_match.endswith('```'):
            json_match = json_match[:-3]

        data = json.loads(json_match.strip())

        # Ensure required fields exist
        data.setdefault('explanation_html',
                        '<p>Explanation could not be generated.</p>')
        data.setdefault('key_points', [])
        data.setdefault('worked_example', None)
        data.setdefault('svg_diagram', None)
        data.setdefault('diagram_caption', None)
        data.setdefault('jamb_tip', None)
        data.setdefault('common_mistakes', [])
        data.setdefault('summary', '')

        # Legacy compatibility fields
        data['explanation'] = data['explanation_html']
        data['example'] = data['worked_example']['problem'] if data['worked_example'] else None
        data['needs_diagram'] = data['svg_diagram'] is not None
        data['diagram_description'] = data['diagram_caption']

        return data

    except json.JSONDecodeError:
        # Return with whatever text we got
        return {
            "explanation_html": f"<div class='ai-lesson-content'><p>{response}</p></div>",
            "explanation": response,
            "key_points": [],
            "worked_example": None,
            "svg_diagram": None,
            "diagram_caption": None,
            "jamb_tip": None,
            "common_mistakes": [],
            "summary": "",
            "example": None,
            "needs_diagram": False,
            "diagram_description": None
        }
    except Exception as e:
        return {
            "explanation_html": f"<p>Could not generate explanation: {str(e)}</p>",
            "explanation": f"Could not generate explanation: {str(e)}",
            "key_points": [],
            "worked_example": None,
            "svg_diagram": None,
            "diagram_caption": None,
            "jamb_tip": None,
            "common_mistakes": [],
            "summary": "",
            "example": None,
            "needs_diagram": False,
            "diagram_description": None,
            "error": True
        }


def generate_diagram_prompt(
    subject: str,
    topic: str,
    objective: str,
    description: str
) -> str:
    """Generate a text description for an image generation API"""

    prompt = f"""Create a simple, clear educational diagram for a JAMB exam student.

SUBJECT: {subject}
TOPIC: {topic}
CONCEPT: {objective}
WHAT TO SHOW: {description}

Requirements:
- Simple, clean diagram suitable for exam preparation
- Clear labels on all important parts
- No complex or cluttered elements
- Educational style, not artistic
- White background

Return a detailed image prompt for an AI image generator."""

    return make_openrouter_request(prompt, temperature=0.3, max_tokens=300)


def answer_student_question(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    explanation_context: str,
    student_question: str
) -> str:
    """
    Answer a student's question in context of the current objective.
    Stays focused and does not introduce new topics.
    """

    prompt = f"""You are a calm, friendly JAMB tutor answering a student's question.

CONTEXT:
- Subject: {subject}
- Topic: {topic}
- Subtopic: {subtopic}
- Current objective: {objective}
- What you just taught: {explanation_context[:500]}

STUDENT'S QUESTION: {student_question}

RULES:
1. Answer ONLY in context of this objective
2. Do NOT introduce new topics or concepts
3. Use very simple English
4. Be conversational and encouraging
5. If the question is off-topic, gently redirect
6. Keep response short (2-4 sentences max)
7. If the student seems confused, try a different angle

Respond directly without any prefix like "AI:" or "Tutor:"."""

    return make_openrouter_request(prompt, temperature=0.6, max_tokens=400)


def explain_question_answer(
    question_text: str,
    options: Dict[str, str],
    correct_answer: str,
    student_answer: str,
    objective_context: str
) -> str:
    """
    Explain why an answer is correct or wrong for the objective question.
    """

    is_correct = student_answer == correct_answer

    options_text = "\n".join([f"{k}: {v}" for k, v in options.items()])

    prompt = f"""A student just answered a JAMB question {"correctly" if is_correct else "incorrectly"}.

QUESTION: {question_text}

OPTIONS:
{options_text}

CORRECT ANSWER: {correct_answer}
STUDENT'S ANSWER: {student_answer}

OBJECTIVE BEING TESTED: {objective_context}

TASK: {"Confirm why the answer is correct and reinforce the concept" if is_correct else "Explain why the correct answer is right and where the student may have gone wrong"}

RULES:
1. Be {"encouraging" if is_correct else "supportive, not critical"}
2. Use simple language
3. Keep it to 2-3 sentences
4. Connect it back to the learning objective
5. Do not repeat the full question

Respond directly:"""

    return make_openrouter_request(prompt, temperature=0.5, max_tokens=300)


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
    limit: int = 5
) -> List[Dict]:
    """
    Generate a quiz for a completed subtopic.
    First tries to find JAMB past questions from the database.
    If not enough questions found, generates AI questions based on objectives.

    Returns a list of quiz questions with options.
    """

    # Try to get questions from database first
    db_questions = []

    try:
        cursor.execute("""
            SELECT q.id, q.question, q.correct_option_key, q.year, q.image_path, NULL as passage
            FROM questions q
            WHERE q.subject = %s AND q.topic = %s AND q.exam = 'JAMB'
            ORDER BY RANDOM()
            LIMIT %s
        """, (subject, topic, limit * 2))

        candidates = cursor.fetchall()

        # Score by relevance to subtopic objectives
        all_keywords = []
        for obj in objectives:
            all_keywords.extend([w.lower() for w in obj.split() if len(w) > 4])

        scored = []
        for q in candidates:
            question_lower = q[1].lower()
            score = sum(1 for kw in all_keywords if kw in question_lower)
            scored.append((score, q))

        scored.sort(key=lambda x: x[0], reverse=True)

        for _, q in scored[:limit]:
            question_id = q[0]
            cursor.execute("""
                SELECT option_key, option_text
                FROM options WHERE question_id = %s ORDER BY option_key
            """, (question_id,))

            options = {row[0]: row[1] for row in cursor.fetchall()}

            if options:  # Only add if options exist
                db_questions.append({
                    "question_id": question_id,
                    "question": q[1],
                    "correct_answer": q[2],
                    "year": q[3],
                    "image_path": q[4],
                    "passage": q[5],
                    "options": options,
                    "source": "jamb"
                })
    except Exception as e:
        print(f"Error fetching DB questions for subtopic quiz: {e}")

    # If we have enough database questions, return them
    if len(db_questions) >= 3:
        return db_questions[:limit]

    # Generate AI questions for remaining slots
    needed = limit - len(db_questions)
    objectives_text = "\n".join([f"- {obj}" for obj in objectives])

    prompt = f"""Generate {needed} JAMB-style multiple choice questions for a Nigerian student.

SUBJECT: {subject}
TOPIC: {topic}
SUBTOPIC: {subtopic}
LEARNING OBJECTIVES:
{objectives_text}

Create questions that test understanding of these objectives.

Return ONLY a JSON array:
[
    {{
        "question": "The question text",
        "options": {{"A": "Option A text", "B": "Option B text", "C": "Option C text", "D": "Option D text"}},
        "correct_answer": "A",
        "explanation": "Brief explanation of why this is correct"
    }}
]

Rules:
1. Questions should be at JAMB difficulty level
2. Each question should have exactly 4 options (A, B, C, D)
3. Only one correct answer per question
4. Questions should test real understanding, not just memorization
5. Include a mix of straightforward and application questions
6. Return ONLY valid JSON array, no markdown."""

    try:
        response = make_openrouter_request(
            prompt, temperature=0.6, max_tokens=2000)

        json_text = response.strip()
        if json_text.startswith('```json'):
            json_text = json_text[7:]
        if json_text.startswith('```'):
            json_text = json_text[3:]
        if json_text.endswith('```'):
            json_text = json_text[:-3]

        ai_questions = json.loads(json_text.strip())

        for i, q in enumerate(ai_questions):
            q['question_id'] = f"ai_{i}"
            q['year'] = None
            q['image_path'] = None
            q['passage'] = None
            q['source'] = 'ai_generated'

        return db_questions + ai_questions[:needed]

    except Exception as e:
        print(f"Error generating AI quiz questions: {e}")
        return db_questions  # Return whatever DB questions we have


def regenerate_explanation(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str,
    previous_explanation: str = ""
) -> Dict:
    """
    Generate a fresh explanation with a different approach/angle.
    Used when user requests re-explanation.
    """

    prompt = f"""You are explaining a JAMB learning objective to a Nigerian student who needs a DIFFERENT explanation.

SUBJECT: {subject}
TOPIC: {topic}  
SUBTOPIC: {subtopic}
OBJECTIVE: {objective}

The student has already seen an explanation and wants a fresh take. Use a COMPLETELY different approach:
- Use different analogies and examples
- Try a different teaching angle (visual, practical, storytelling, etc.)
- If the previous was formal, be more conversational
- Include different real-world examples

Generate the same JSON format:
{{
    "explanation_html": "<div class='ai-lesson-content'>Your fresh HTML explanation here</div>",
    "key_points": ["Key point 1", "Key point 2", "Key point 3"],
    "worked_example": {{
        "problem": "A different worked example",
        "solution_html": "<div>Step by step solution</div>"
    }},
    "svg_diagram": "<svg>...</svg> or null",
    "diagram_caption": "Caption or null",
    "jamb_tip": "A different exam tip",
    "common_mistakes": ["Different mistake 1", "Different mistake 2"],
    "summary": "Fresh 2-3 sentence summary"
}}

Use HTML tags: <p>, <strong>, <em>, <ul>, <li>, <h4>, <h5>
For SVG: viewBox="0 0 400 300", width="100%", colors: #4F46E5, #10B981, #F59E0B, #EF4444
Content should be 300-500 words.
Return ONLY valid JSON."""

    try:
        response = make_openrouter_request(
            prompt,
            temperature=0.8,  # Higher temperature for more variety
            max_tokens=3000,
            system_prompt=GUIDED_LEARNING_SYSTEM_PROMPT
        )

        json_match = response.strip()
        if json_match.startswith('```json'):
            json_match = json_match[7:]
        if json_match.startswith('```'):
            json_match = json_match[3:]
        if json_match.endswith('```'):
            json_match = json_match[:-3]

        data = json.loads(json_match.strip())
        data.setdefault('explanation_html',
                        '<p>Explanation could not be generated.</p>')
        data.setdefault('key_points', [])
        data.setdefault('worked_example', None)
        data.setdefault('svg_diagram', None)
        data.setdefault('diagram_caption', None)
        data.setdefault('jamb_tip', None)
        data.setdefault('common_mistakes', [])
        data.setdefault('summary', '')

        # Legacy compatibility
        data['explanation'] = data['explanation_html']
        data['example'] = data['worked_example']['problem'] if data['worked_example'] else None
        data['needs_diagram'] = data['svg_diagram'] is not None
        data['diagram_description'] = data['diagram_caption']

        return data

    except json.JSONDecodeError:
        return {
            "explanation_html": f"<div class='ai-lesson-content'><p>{response}</p></div>",
            "explanation": response,
            "key_points": [],
            "worked_example": None,
            "svg_diagram": None,
            "diagram_caption": None,
            "jamb_tip": None,
            "common_mistakes": [],
            "summary": "",
            "example": None,
            "needs_diagram": False,
            "diagram_description": None
        }
    except Exception as e:
        return {
            "explanation_html": f"<p>Could not generate re-explanation: {str(e)}</p>",
            "explanation": str(e),
            "key_points": [],
            "worked_example": None,
            "svg_diagram": None,
            "diagram_caption": None,
            "jamb_tip": None,
            "common_mistakes": [],
            "summary": "",
            "example": None,
            "needs_diagram": False,
            "diagram_description": None,
            "error": True
        }
