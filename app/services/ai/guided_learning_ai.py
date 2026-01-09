"""
Gemini AI Service for Guided Learning
Handles objective explanations, diagram generation, and student Q&A
Uses direct Google Gemini API
"""

import json
import time
import requests
from typing import Dict, List, Optional
from app.core.config import settings

# API Configuration - Use the provided Gemini API key
GEMINI_API_KEY = "REDACTED_GEMINI_KEY"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"


def make_gemini_request(prompt: str, temperature: float = 0.7, max_tokens: int = 1500, retries: int = 3) -> str:
    """Make a request to Google Gemini API"""
    
    url = f"{GEMINI_BASE_URL}/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }
    
    last_error = None
    for attempt in range(retries):
        try:
            response = requests.post(url, json=payload, timeout=60)
            
            if response.status_code == 429:
                wait_time = (attempt + 1) * 5
                print(f"Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            data = response.json()
            
            candidates = data.get("candidates", [])
            if not candidates:
                raise Exception("No candidates in response")
            
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts or "text" not in parts[0]:
                raise Exception("No text in response")
            
            return parts[0]["text"]
            
        except requests.exceptions.Timeout:
            last_error = "Request timeout"
            time.sleep(2)
        except requests.exceptions.RequestException as e:
            last_error = str(e)
            time.sleep(2)
        except Exception as e:
            last_error = str(e)
            break
    
    raise Exception(f"Gemini API failed: {last_error}")


def generate_objective_explanation(
    subject: str,
    topic: str,
    subtopic: str,
    objective: str
) -> Dict:
    """
    Generate a focused explanation for a single learning objective.
    Returns explanation text and whether a diagram is recommended.
    """
    
    prompt = f"""You are a JAMB tutor explaining ONE learning objective to a Nigerian student.

SUBJECT: {subject}
TOPIC: {topic}
SUBTOPIC: {subtopic}
OBJECTIVE: {objective}

RULES:
1. Explain ONLY what is needed to understand this objective
2. Use very simple English (secondary school level)
3. Keep it short - must fit on a mobile screen
4. Focus on how JAMB tests this concept
5. Include 1 practical example if helpful
6. Mention common tricks in JAMB questions
7. Do NOT give long definitions or history
8. Do NOT use fancy formatting or symbols

At the end, decide: Does this objective REQUIRE a diagram to understand?
(Physics diagrams: motion paths, circuits, ray diagrams, forces, waves)
(Biology diagrams: cell structure, organ systems, life cycles)
(Chemistry diagrams: molecular structures, lab setups)

Respond in this JSON format:
{{
    "explanation": "Your clear, short explanation here...",
    "example": "A quick worked example if applicable, or null",
    "jamb_tip": "One sentence about how JAMB tests this",
    "needs_diagram": true or false,
    "diagram_description": "If needs_diagram is true, describe what the diagram should show"
}}"""

    try:
        response = make_gemini_request(prompt, temperature=0.5, max_tokens=1000)
        
        # Parse JSON from response
        json_match = response.strip()
        if json_match.startswith('```json'):
            json_match = json_match[7:]
        if json_match.startswith('```'):
            json_match = json_match[3:]
        if json_match.endswith('```'):
            json_match = json_match[:-3]
        
        data = json.loads(json_match.strip())
        return data
        
    except json.JSONDecodeError:
        # Return plain text if JSON parsing fails
        return {
            "explanation": response,
            "example": None,
            "jamb_tip": None,
            "needs_diagram": False,
            "diagram_description": None
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

    return make_gemini_request(prompt, temperature=0.3, max_tokens=300)


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

    return make_gemini_request(prompt, temperature=0.6, max_tokens=400)


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

    return make_gemini_request(prompt, temperature=0.5, max_tokens=300)


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
        SELECT q.id, q.question, q.correct_option_key, q.year, q.image_path, q.passage
        FROM questions q
        WHERE q.subject = ? AND q.topic = ? AND q.exam = 'JAMB'
        ORDER BY RANDOM()
        LIMIT ?
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
            WHERE question_id = ?
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
