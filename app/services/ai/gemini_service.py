"""
DeepSeek AI Service for ExamGenius (via OpenRouter)
Handles lesson generation, question generation, and explanation generation
Uses DeepSeek V3.2 model with reasoning capabilities
"""

import os
import json
import random
import requests
from typing import Dict, List, Optional
from datetime import datetime
from app.core.config import settings

# Configure DeepSeek API via OpenRouter
OPENROUTER_API_KEY = settings.OPENROUTER_API_KEY
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY not configured in .env file")


def make_deepseek_request(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2000, retries: int = 3) -> str:
    """
    Make a request to DeepSeek V3.2 via OpenRouter with retry logic

    Args:
        messages: List of message dicts with role and content
        temperature: Model temperature (0-2)
        max_tokens: Maximum tokens to generate
        retries: Number of retry attempts on failure

    Returns:
        Model response text
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "deepseek/deepseek-v3.2",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "reasoning": {"enabled": True}  # Enable reasoning for better quality
    }

    last_error = None
    for attempt in range(retries):
        try:
            response = requests.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=45,  # Increased timeout
                verify=True  # Explicit SSL verification
            )
            response.raise_for_status()

            result = response.json()
            message = result['choices'][0]['message']

            # Return just the content, reasoning is handled internally
            return message.get('content', '')

        except requests.exceptions.SSLError as e:
            last_error = f"SSL error: {str(e)}"
            if attempt < retries - 1:
                import time
                time.sleep(2)  # Wait before retry
                continue
        except requests.exceptions.Timeout as e:
            last_error = f"Timeout error: {str(e)}"
            if attempt < retries - 1:
                continue
        except requests.exceptions.RequestException as e:
            last_error = f"Request error: {str(e)}"
            if attempt < retries - 1:
                import time
                time.sleep(1)
                continue
        except (KeyError, IndexError, ValueError) as e:
            last_error = f"Parse error: {str(e)}"
            break  # Don't retry parse errors
    
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
        response = requests.post(url, json=payload, timeout=45)
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
    Generate AI lesson for a specific topic

    Args:
        subject: Subject name (e.g., "Biology")
        topic: Topic name (e.g., "Cell Biology")
        language: "english" or "pidgin"
        sample_questions: Optional list of sample questions for context

    Returns:
        Dict with lesson structure: key_idea, example, steps, quick_tip, full_content
    """
    language_instruction = "simple English" if language == "english" else "Nigerian Pidgin English"

    sample_context = ""
    if sample_questions:
        sample_context = "\n\nHere are some sample JAMB questions on this topic for context:\n"
        for i, q in enumerate(sample_questions[:3], 1):
            sample_context += f"{i}. {q.get('question', '')}\n"

    prompt = f"""You are an expert JAMB tutor for Nigerian SS3 students. Create a comprehensive lesson for the topic "{topic}" in {subject}.

{sample_context}

Please structure your response in this EXACT JSON format:
{{
    "key_idea": "A 2-3 sentence summary of the core concept in {language_instruction}",
    "example": "A clear, relatable example that SS3 students can understand",
    "steps": "Step-by-step breakdown of how to approach problems in this topic (use numbered list)",
    "quick_tip": "One memorable tip or mnemonic to help students remember this topic",
    "diagrams": "List of diagram descriptions that would help illustrate this topic (if applicable)"
}}

Make it engaging, clear, and focused on JAMB exam requirements. Use {language_instruction} throughout.
Return ONLY the JSON, no markdown formatting."""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ])

        lesson_text = response_text.strip()
        # Try to parse as JSON
        # Remove markdown code blocks if present
        if lesson_text.startswith("```json"):
            lesson_text = lesson_text.replace(
                "```json", "").replace("```", "").strip()
        elif lesson_text.startswith("```"):
            lesson_text = lesson_text.replace("```", "").strip()

        lesson_data = json.loads(lesson_text)

        # Construct full content
        full_content = f"""**Key Idea:**
{lesson_data.get('key_idea', 'N/A')}

**Example:**
{lesson_data.get('example', 'N/A')}

**Steps:**
{lesson_data.get('steps', 'N/A')}

**Quick Tip:**
{lesson_data.get('quick_tip', 'N/A')}
"""

        lesson_data['full_content'] = full_content
        return lesson_data

    except json.JSONDecodeError:
        # Fallback: structure the response manually
        return {
            "key_idea": f"Understanding {topic} in {subject}",
            "example": response_text[:200] if response_text else "No example available",
            "steps": "1. Study the concept\n2. Practice questions\n3. Review mistakes",
            "quick_tip": f"Focus on understanding {topic} fundamentals",
            "diagrams": "No diagrams available",
            "full_content": response_text if response_text else "Lesson generation failed"
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
6. Is appropriate for SS3 students

Return ONLY valid JSON in this EXACT format (no markdown, no code blocks):
{{
    "question_text": "Your question here",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_option": "A",
    "explanation": "Brief explanation why this answer is correct",
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
    Generate AI explanation for a question's answer

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

    prompt = f"""You are a JAMB tutor. Explain why the correct answer is right for this question.

Question: {question}

Options:
{options_text}

Correct Answer: {correct_answer}. {options.get(correct_answer, '')}

Topic: {topic}

Provide a clear, concise explanation in {language_instruction} that:
1. States why the correct answer is right
2. Briefly mentions why other options are incorrect (if relevant)
3. Links to the key concept from the topic
4. Is 2-4 sentences maximum

Return only the explanation text, no JSON, no formatting.
"""

    try:
        explanation = make_ai_request([
            {"role": "user", "content": prompt}
        ])
        return explanation.strip()

    except Exception as e:
        return f"The correct answer is {correct_answer}. {options.get(correct_answer, '')} (Explanation generation failed)"


def generate_recommendations(weak_topics: List[Dict], recent_attempts: List[Dict]) -> Dict:
    """
    Generate personalized study recommendations based on performance

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

    prompt = f"""You are a JAMB study advisor. Based on this student's performance, create a short study recommendation.

Weakest Topics:
{weak_topics_text}

Generate a brief recommendation in JSON format:
{{
    "recommended_topics": ["topic1", "topic2", "topic3"],
    "study_plan": "Brief 2-3 sentence study plan",
    "estimated_time": "Time estimate (e.g., '2-3 hours')"
}}

Focus on the top 2-3 most critical topics. Be encouraging but realistic.
Return ONLY the JSON."""

    try:
        response_text = make_ai_request([
            {"role": "user", "content": prompt}
        ])

        rec_text = response_text.strip()

        if rec_text.startswith("```json"):
            rec_text = rec_text.replace(
                "```json", "").replace("```", "").strip()
        elif rec_text.startswith("```"):
            rec_text = rec_text.replace("```", "").strip()

        recommendations = json.loads(rec_text)
        return recommendations

    except Exception as e:
        # Fallback
        return {
            "recommended_topics": [t.get('topic', 'Study') for t in weak_topics[:3]],
            "study_plan": f"Focus on improving {weak_topics[0].get('topic', 'weak topics')} through targeted practice.",
            "estimated_time": "2-3 hours"
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
    Interactive AI tutor that answers student questions about a topic

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
Here's the lesson content for reference:
- Key Idea: {lesson_context.get('key_idea', 'N/A')}
- Example: {lesson_context.get('example', 'N/A')}
- Steps: {lesson_context.get('steps', 'N/A')}
- Quick Tip: {lesson_context.get('quick_tip', 'N/A')}
"""

    # Build messages including chat history
    messages = []

    # System message
    messages.append({
        "role": "user",
        "content": f"""You are an expert JAMB tutor for Nigerian SS3 students. 
You are teaching about {topic} in {subject}.

{lesson_info}

Your role is to:
1. Answer student questions clearly and concisely
2. Give relatable examples for Nigerian students
3. Connect answers to the lesson content
4. Encourage understanding over memorization
5. Use simple English when possible

The student is now asking you a question. Answer it helpfully and in the context of {subject} - {topic}."""
    })

    # Add previous messages if any
    if chat_history:
        for msg in chat_history:
            messages.append(msg)

    # Add current question
    messages.append({
        "role": "user",
        "content": question
    })

    try:
        response = make_ai_request(
            messages, temperature=0.7, max_tokens=1500)
        return response

    except Exception as e:
        print(f"AI Tutor error: {e}")
        return f"I apologize, I'm having trouble responding. Please try again. Error: {str(e)}"
