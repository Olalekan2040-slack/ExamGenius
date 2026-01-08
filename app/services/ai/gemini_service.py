"""
AI Service for ExamGenius (via OpenRouter)
Handles lesson generation, question generation, and explanation generation
Uses Google Gemini 2.0 Flash (FREE) model
"""

import os
import json
import random
import requests
from typing import Dict, List, Optional
from datetime import datetime
from app.core.config import settings
from app.db.database import get_connection


def get_syllabus_objectives(subject: str, topic: str) -> Optional[str]:
    """
    Fetch syllabus objectives for a topic from the database.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Try exact match first
        cursor.execute(
            "SELECT objectives FROM syllabus_topics WHERE subject = ? AND topic_name = ?",
            (subject, topic)
        )
        result = cursor.fetchone()
        
        if not result:
            # Try partial match
            cursor.execute(
                "SELECT objectives FROM syllabus_topics WHERE subject = ? AND topic_name LIKE ?",
                (subject, f"%{topic}%")
            )
            result = cursor.fetchone()
        
        conn.close()
        # Handle psycopg2 tuple results
        if not result:
            return None
        return result[0]
    except Exception:
        return None

# Configure AI API via OpenRouter (using FREE model)
OPENROUTER_API_KEY = settings.OPENROUTER_API_KEY
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY not configured in .env file")

# ============================================================
# EXAMGENIUS JAMB AI TUTOR SYSTEM PROMPT
# ============================================================
JAMB_TUTOR_SYSTEM_PROMPT = """You are ExamGenius, a private JAMB tutor helping Nigerian students pass JAMB.

Your sole purpose is to explain JAMB topics and questions in a way that helps students answer questions correctly in the exam.

GENERAL RULES:
- Write in very simple English suitable for a Nigerian secondary school student.
- Be short, clear, and practical. Avoid long explanations.
- Do NOT teach like a textbook or lecturer.
- Do NOT give definitions unless they help answer a JAMB question.
- Do NOT explain history or theory unless JAMB tests it directly.
- Do NOT use advanced grammar or academic language.
- Do NOT greet the student or introduce yourself.
- Do NOT use unnecessary headings or decorative formatting.
- Avoid symbols that may not render well. Use plain math when possible.

JAMB-FOCUSED RULES:
- Always explain topics from the angle of how JAMB asks questions.
- Clearly state what JAMB usually tests in the topic.
- Highlight common tricks and traps used in JAMB questions.
- Mention common mistakes students make in this topic.
- Use real-style JAMB examples, not abstract ones.
- If calculations are involved, show only the necessary steps.
- Keep worked examples short and exam-focused.

STYLE RULES:
- Your tone should sound like a calm private tutor sitting beside the student.
- Write as if the student wants to understand quickly and move on.
- Every sentence must help the student score marks.

LENGTH RULE:
- Your full response must fit comfortably on a mobile screen.
- If the explanation feels long, shorten it.

FINAL RULE:
- If you are unsure whether something helps in JAMB, leave it out.
"""


def make_deepseek_request(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2000, retries: int = 4) -> str:
    """
    Make a request to Gemini 2.0 Flash (FREE) via OpenRouter with retry logic
    """
    import time
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://examgenius.ng",
        "X-Title": "ExamGenius",
    }

    payload = {
        "model": "google/gemini-2.0-flash-exp:free",
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
                timeout=90,  # 90 second timeout
                verify=True
            )
            
            # Handle rate limiting (429)
            if response.status_code == 429:
                wait_time = (attempt + 1) * 8  # 8s, 16s, 24s, 32s
                print(f"Rate limited, waiting {wait_time}s before retry...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()

            result = response.json()
            message = result['choices'][0]['message']
            return message.get('content', '')

        except requests.exceptions.SSLError as e:
            last_error = f"SSL error: {str(e)}"
            if attempt < retries - 1:
                time.sleep(2)
                continue
        except requests.exceptions.Timeout as e:
            last_error = f"Timeout error: {str(e)}"
            if attempt < retries - 1:
                time.sleep(2)
                continue
        except requests.exceptions.RequestException as e:
            last_error = f"Request error: {str(e)}"
            if attempt < retries - 1:
                time.sleep(3)
                continue
        except (KeyError, IndexError, ValueError) as e:
            last_error = f"Parse error: {str(e)}"
            break
    
    raise Exception(f"OpenRouter API failed after {retries} attempts: {last_error}")


def make_gemini_request(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2000) -> str:
    """
    Make a request to Google Gemini as a fallback when DeepSeek is unavailable.
    """
    if not settings.GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY not configured")

    # Convert chat-style messages into a single prompt string
    prompt_lines = []
    for m in messages:
        role = m.get("role", "user").upper()
        content = m.get("content", "")
        prompt_lines.append(f"{role}: {content}")
    prompt_text = "\n\n".join(prompt_lines)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=90)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates")
        if not candidates:
            raise Exception("Gemini returned no candidates")
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts or "text" not in parts[0]:
            raise Exception("Gemini response missing text")
        return parts[0]["text"]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Gemini API error: {str(e)}")
    except (KeyError, IndexError, ValueError) as e:
        raise Exception(f"Failed to parse Gemini response: {str(e)}")


def make_ai_request(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2000, retries: int = 3) -> str:
    """
    Primary AI request helper. Tries DeepSeek first, falls back to Gemini if configured.
    """
    try:
        return make_deepseek_request(messages, temperature=temperature, max_tokens=max_tokens, retries=retries)
    except Exception as deepseek_error:
        if settings.GEMINI_API_KEY:
            try:
                return make_gemini_request(messages, temperature=temperature, max_tokens=max_tokens)
            except Exception as gemini_error:
                raise Exception(f"DeepSeek failed ({deepseek_error}); Gemini fallback failed ({gemini_error})")
        raise


def generate_topic_lesson(subject: str, topic: str, language: str = "english", sample_questions: List[Dict] = None) -> Dict:
    """
    Generate AI lesson for a specific topic following JAMB tutor structure.
    Now includes syllabus objectives, JAMB patterns, and suggested questions.

    Args:
        subject: Subject name (e.g., "Physics")
        topic: Topic name (e.g., "Mechanics")
        language: "english" or "pidgin"
        sample_questions: Optional list of sample questions for context

    Returns:
        Dict with lesson structure including objectives and suggested questions
    """
    language_instruction = "simple English" if language == "english" else "Nigerian Pidgin English"

    # Fetch syllabus objectives from database
    syllabus_objectives = get_syllabus_objectives(subject, topic)
    objectives_context = ""
    if syllabus_objectives:
        objectives_context = f"\nJAMB SYLLABUS OBJECTIVES for this topic:\n{syllabus_objectives}\n"

    # Extract what JAMB actually asks from sample questions
    sample_context = ""
    if sample_questions:
        sample_context = "\nReal JAMB questions on this topic:\n"
        for i, q in enumerate(sample_questions[:3], 1):
            sample_context += f"{i}. {q.get('question', '')[:150]}...\n"

    prompt = f"""{JAMB_TUTOR_SYSTEM_PROMPT}

TOPIC: {topic} ({subject})
Use {language_instruction}.
{objectives_context}
{sample_context}

STRUCTURE FOR THIS TOPIC (follow EXACTLY this order):

1. LEARNING OBJECTIVES - What you will learn (use the syllabus objectives above if provided)
2. WHAT JAMB TESTS - Specific things JAMB asks about this topic
3. KEY CONCEPTS - Short bullet points of must-know facts
4. WORKED EXAMPLE - One typical JAMB question with step-by-step solution
5. COMMON MISTAKES - 2-3 mistakes that cost students marks
6. EXAM TIP - One quick tip to score marks
7. QUESTIONS TO ASK - 3 good follow-up questions a student might want to ask

Return as JSON:
{{
    "objectives": "What you will learn from this topic (bullet points)",
    "what_jamb_tests": "Specific patterns JAMB uses in this topic",
    "key_concepts": "Bullet points of must-know facts",
    "worked_example": "One worked JAMB-style example with solution",
    "common_mistakes": "2-3 mistakes that cost marks",
    "exam_tip": "One quick tip to score marks",
    "suggested_questions": ["Question 1 student might ask", "Question 2", "Question 3"]
}}

Return ONLY valid JSON, no markdown or code blocks."""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ])

        lesson_text = response_text.strip()
        if lesson_text.startswith("```json"):
            lesson_text = lesson_text.replace("```json", "").replace("```", "").strip()
        elif lesson_text.startswith("```"):
            lesson_text = lesson_text.replace("```", "").strip()

        lesson_data = json.loads(lesson_text)

        # Ensure suggested_questions is a list
        suggested_questions = lesson_data.get('suggested_questions', [])
        if isinstance(suggested_questions, str):
            suggested_questions = [q.strip() for q in suggested_questions.split('\n') if q.strip()]
        
        # Build mobile-friendly content with objectives first
        full_content = f"""📚 Learning Objectives:
{lesson_data.get('objectives', 'N/A')}

🎯 What JAMB Tests:
{lesson_data.get('what_jamb_tests', 'N/A')}

💡 Key Concepts:
{lesson_data.get('key_concepts', 'N/A')}

📝 Worked Example:
{lesson_data.get('worked_example', 'N/A')}

⚠️ Common Mistakes:
{lesson_data.get('common_mistakes', 'N/A')}

✅ Exam Tip:
{lesson_data.get('exam_tip', 'N/A')}"""

        # Map to expected frontend fields
        lesson_data['full_content'] = full_content
        lesson_data['key_idea'] = lesson_data.get('what_jamb_tests', '')
        lesson_data['steps'] = lesson_data.get('key_concepts', '')
        lesson_data['quick_tip'] = lesson_data.get('exam_tip', '')
        lesson_data['example'] = lesson_data.get('worked_example', '')
        lesson_data['diagrams'] = ''
        lesson_data['suggested_questions'] = suggested_questions[:3] if suggested_questions else [
            f"What are the most common JAMB questions on {topic}?",
            f"Can you explain {topic} with more examples?",
            f"What mistakes should I avoid in {topic}?"
        ]
        
        return lesson_data

    except json.JSONDecodeError:
        return {
            "objectives": f"Understand the key concepts of {topic}",
            "key_idea": f"Understanding {topic} in {subject}",
            "example": response_text[:200] if response_text else "No example available",
            "steps": "1. Study the concept\n2. Practice questions\n3. Review mistakes",
            "quick_tip": f"Focus on understanding {topic} fundamentals",
            "diagrams": "",
            "full_content": response_text if response_text else "Lesson generation failed",
            "suggested_questions": [
                f"What are the most common JAMB questions on {topic}?",
                f"Can you explain {topic} with more examples?",
                f"What mistakes should I avoid in {topic}?"
            ]
        }
    except Exception as e:
        raise Exception(f"Lesson generation failed: {str(e)}")


def generate_ai_question(subject: str, topic: str, sample_questions: List[Dict], difficulty: str = "medium") -> Dict:
    """
    Generate JAMB-style objective question using AI

    Args:
        subject: Subject name
        topic: Topic name
        sample_questions: Sample past JAMB questions for reference
        difficulty: "easy", "medium", or "hard"

    Returns:
        Dict with question structure: question_text, option_a, option_b, option_c, option_d, 
        correct_option, explanation, difficulty
    """

    # Format sample questions for context
    samples_text = "\n\n".join([
        f"Question: {q.get('question', '')}\nA. {q.get('option_a', '')}\nB. {q.get('option_b', '')}\nC. {q.get('option_c', '')}\nD. {q.get('option_d', '')}\nCorrect: {q.get('correct_option', '')}"
        for q in sample_questions[:5]
    ])

    prompt = f"""You are a JAMB question writer. Generate ONE new objective question for {subject}, topic: {topic}.

Difficulty level: {difficulty}

Here are some sample JAMB questions on this topic for style reference:

{samples_text}

Generate a NEW question that:
1. Follows JAMB format and style
2. Has EXACTLY 4 options (A, B, C, D)
3. Has ONE clearly correct answer
4. Has 3 plausible but incorrect distractors
5. Tests understanding, not just memorization

Return ONLY valid JSON in this EXACT format (no markdown, no code blocks):
{{
    "question_text": "Your question here",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_option": "A",
    "explanation": "1-2 sentence coach-style explanation: 'The trick here is...' or 'You need to remember...'",
    "diagram_required": false
}}
"""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ])

        question_text = response_text.strip()
        # Clean up response
        if question_text.startswith("```json"):
            question_text = question_text.replace(
                "```json", "").replace("```", "").strip()
        elif question_text.startswith("```"):
            question_text = question_text.replace("```", "").strip()

        question_data = json.loads(question_text)

        # Validate required fields
        required_fields = ["question_text", "option_a",
                           "option_b", "option_c", "option_d", "correct_option"]
        for field in required_fields:
            if field not in question_data:
                raise ValueError(f"Missing required field: {field}")

        # Validate correct_option
        if question_data["correct_option"] not in ["A", "B", "C", "D"]:
            raise ValueError("correct_option must be A, B, C, or D")

        question_data['difficulty'] = difficulty
        question_data['topic'] = topic
        question_data['subject'] = subject

        return question_data

    except json.JSONDecodeError as e:
        raise Exception(f"AI generated invalid JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Question generation failed: {str(e)}")


def generate_question_explanation(question: str, options: Dict, correct_answer: str, topic: str, language: str = "english") -> str:
    """
    Generate AI explanation for a question's answer - JAMB tutor style.

    Args:
        question: Question text
        options: Dict with keys A, B, C, D
        topic: Topic name
        language: "english" or "pidgin"

    Returns:
        Explanation string
    """
    language_instruction = "simple English" if language == "english" else "Nigerian Pidgin English"

    options_text = "\n".join([f"{k}. {v}" for k, v in options.items()])

    prompt = f"""{JAMB_TUTOR_SYSTEM_PROMPT}

The student got this question wrong. Explain why the correct answer is right.

Question: {question}

Options:
{options_text}

Correct Answer: {correct_answer}

Use {language_instruction}.

Explain in this order:
1. Why wrong options are wrong (1 sentence)
2. Why correct answer is correct (1-2 sentences)  
3. Quick tip to remember (1 sentence)

Keep it short - must fit on mobile screen. No headings."""

    try:
        explanation = make_ai_request([
            {"role": "user", "content": prompt}
        ], max_tokens=300)
        return explanation.strip()

    except Exception as e:
        return f"The correct answer is {correct_answer}. Review {topic} to understand why."


def generate_recommendations(weak_topics: List[Dict], recent_attempts: List[Dict]) -> Dict:
    """
    Generate personalized study recommendations - JAMB tutor style.

    Args:
        weak_topics: List of weakest topics with accuracy data
        recent_attempts: Recent practice attempts

    Returns:
        Dict with recommended_topics, study_plan, estimated_time
    """
    weak_topics_text = "\n".join([
        f"- {t.get('subject', 'Unknown')}: {t.get('topic', 'Unknown')} (Accuracy: {t.get('accuracy', 0):.1f}%)"
        for t in weak_topics[:5]
    ])

    prompt = f"""{JAMB_TUTOR_SYSTEM_PROMPT}

The student has these weak topics:
{weak_topics_text}

Give a short, direct study recommendation. What should they focus on first?

Return JSON only:
{{
    "recommended_topics": ["topic1", "topic2"],
    "study_plan": "2-sentence action plan",
    "estimated_time": "30-45 mins"
}}"""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ])

        rec_text = response_text.strip()
        if rec_text.startswith("```json"):
            rec_text = rec_text.replace("```json", "").replace("```", "").strip()
        elif rec_text.startswith("```"):
            rec_text = rec_text.replace("```", "").strip()

        recommendations = json.loads(rec_text)
        return recommendations

    except Exception as e:
        return {
            "recommended_topics": [t.get('topic', 'Study') for t in weak_topics[:3]],
            "study_plan": f"Focus on {weak_topics[0].get('topic', 'weak topics')} - do 20 questions today.",
            "estimated_time": "30-45 mins"
        }


def batch_generate_ai_questions(subject: str, topic: str, sample_questions: List[Dict], count: int = 40) -> List[Dict]:
    """
    Generate multiple AI questions for a CBT subject slot using a SINGLE optimized API call

    Args:
        subject: Subject name
        topic: Can be "mixed" for varied topics
        sample_questions: Sample questions for reference
        count: Number of questions to generate (default 40)

    Returns:
        List of generated question dicts
    """
    
    # Extract topics from samples for variety
    topics_list = []
    if sample_questions:
        topics_list = list(set([q.get('topic', 'General') for q in sample_questions[:10]]))
    
    sample_context = ""
    if sample_questions:
        sample_context = "\n\nHere are example JAMB questions for reference:\n"
        for i, q in enumerate(sample_questions[:3], 1):
            sample_context += f"{i}. Topic: {q.get('topic', 'N/A')}\n   Q: {q.get('question', '')}\n"
    
    topics_hint = f"Cover these topics: {', '.join(topics_list)}" if topics_list else f"Cover various {subject} topics"
    
    prompt = f"""You are a JAMB question generator. Generate EXACTLY {count} unique multiple-choice questions for {subject}.

{sample_context}

Requirements:
- {topics_hint}
- Mix difficulty: {count//3} easy, {count//3} medium, {count//3} hard
- Each question must have 4 options (A, B, C, D)
- Each question must have ONE correct answer
- Questions should match JAMB exam format and difficulty

Return your response as a JSON array of {count} question objects. Each object must have this EXACT structure:
{{
    "question_text": "The question text",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_option": "A" (or B, C, D),
    "topic": "Topic name",
    "difficulty": "easy" (or medium, hard),
    "explanation": "Brief explanation"
}}

Return ONLY the JSON array, no additional text. Format: [{{...}}, {{...}}, ...]
"""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ], temperature=0.8, max_tokens=8000, retries=2)  # Only 2 retries for batch to avoid long waits

        # Clean response more aggressively
        
        # Remove code blocks
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1).strip()
        if response_text.startswith("```"):
            response_text = response_text.replace("```", "", 1).strip()
        if response_text.endswith("```"):
            response_text = response_text.rsplit("```", 1)[0].strip()
        
        # Try to find JSON array in response
        start_idx = response_text.find('[')
        end_idx = response_text.rfind(']')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            response_text = response_text[start_idx:end_idx + 1]
        
        # Try to parse JSON
        try:
            questions_data = json.loads(response_text)
        except json.JSONDecodeError as je:
            print(f"JSON parse error at position {je.pos}: {je.msg}")
            print(f"Response excerpt: {response_text[:500]}...")
            raise ValueError(f"Invalid JSON from AI: {je.msg}")
        
        if not isinstance(questions_data, list):
            raise ValueError("AI response is not a JSON array")

        # Validate and number questions
        validated = []
        for i, q in enumerate(questions_data[:count], 1):
            # Validate required fields
            required = ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_option"]
            if all(field in q for field in required):
                # Ensure correct_option is valid
                if q['correct_option'] not in ['A', 'B', 'C', 'D']:
                    print(f"Warning: Invalid correct_option '{q['correct_option']}' in question {i}, skipping")
                    continue
                    
                q['question_number'] = i
                q['subject'] = subject
                if 'topic' not in q or not q['topic']:
                    q['topic'] = topics_list[i % len(topics_list)] if topics_list else 'General'
                if 'difficulty' not in q:
                    q['difficulty'] = ['easy', 'medium', 'hard'][i % 3]
                if 'explanation' not in q:
                    q['explanation'] = f"The correct answer is {q['correct_option']}"
                validated.append(q)
            else:
                print(f"Warning: Question {i} missing required fields, skipping")

        print(f"Successfully validated {len(validated)}/{len(questions_data)} AI questions")
        return validated

    except Exception as e:
        print(f"Batch AI generation failed: {str(e)}")
        # Fallback: return empty list to trigger DB fallback
        return []


def ask_ai_tutor(subject: str, topic: str, question: str, lesson_context: Optional[Dict] = None, chat_history: Optional[List[Dict]] = None) -> str:
    """
    Interactive AI tutor that answers student questions - JAMB tutor style.

    Args:
        subject: Subject name
        topic: Topic name
        question: Student's question
        lesson_context: The lesson content for context
        chat_history: Previous conversation messages

    Returns:
        AI tutor's response
    """

    # Build context string from lesson
    lesson_info = ""
    if lesson_context:
        lesson_info = f"""
Current lesson context:
- Topic: {topic}
- What JAMB tests: {lesson_context.get('what_jamb_tests', lesson_context.get('key_idea', 'N/A'))}
"""

    # Build messages
    messages = []

    # System message with JAMB tutor prompt
    messages.append({
        "role": "user",
        "content": f"""{JAMB_TUTOR_SYSTEM_PROMPT}

Subject: {subject}
Topic: {topic}
{lesson_info}

The student is asking you a question. Answer it following ALL the rules above.
Remember: short, simple, JAMB-focused. Must fit on mobile screen.

Student's question: {question}"""
    })

    # Add chat history if any
    if chat_history:
        for msg in chat_history:
            messages.append(msg)

    try:
        response = make_ai_request(messages, temperature=0.7, max_tokens=400)
        return response

    except Exception as e:
        print(f"AI Tutor error: {e}")
        return "Having trouble right now. Try asking again?"
