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


def make_deepseek_request(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2000) -> str:
    """
    Make a request to DeepSeek V3.2 via OpenRouter
    
    Args:
        messages: List of message dicts with role and content
        temperature: Model temperature (0-2)
        max_tokens: Maximum tokens to generate
    
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
    
    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        message = result['choices'][0]['message']
        
        # Return just the content, reasoning is handled internally
        return message.get('content', '')
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"OpenRouter API error: {str(e)}")
    except (KeyError, IndexError, ValueError) as e:
        raise Exception(f"Failed to parse API response: {str(e)}")


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
        response_text = make_deepseek_request([
            {"role": "user", "content": prompt}
        ])
        
        lesson_text = response_text.strip()

        # Try to parse as JSON
        # Remove markdown code blocks if present
        if lesson_text.startswith("```json"):
            lesson_text = lesson_text.replace("```json", "").replace("```", "").strip()
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
        response_text = make_deepseek_request([
            {"role": "user", "content": prompt}
        ])
        
        question_text = response_text.strip()

        # Clean up response
        if question_text.startswith("```json"):
            question_text = question_text.replace("```json", "").replace("```", "").strip()
        elif question_text.startswith("```"):
            question_text = question_text.replace("```", "").strip()

        question_data = json.loads(question_text)

        # Validate required fields
        required_fields = ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_option"]
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
        correct_answer: Correct option key (A, B, C, or D)
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
        explanation = make_deepseek_request([
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
        response_text = make_deepseek_request([
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
        # Fallback
        return {
            "recommended_topics": [t.get('topic', 'Study') for t in weak_topics[:3]],
            "study_plan": f"Focus on improving {weak_topics[0].get('topic', 'weak topics')} through targeted practice.",
            "estimated_time": "2-3 hours"
        }


def batch_generate_ai_questions(subject: str, topic: str, sample_questions: List[Dict], count: int = 40) -> List[Dict]:
    """
    Generate multiple AI questions for a CBT subject slot

    Args:
        subject: Subject name
        topic: Can be "mixed" for varied topics
        sample_questions: Sample questions for reference
        count: Number of questions to generate (default 40)

    Returns:
        List of generated question dicts
    """
    generated = []
    difficulties = ["easy", "medium", "hard"]

    # Generate questions in batches
    for i in range(count):
        try:
            # Vary difficulty
            difficulty = difficulties[i % len(difficulties)]

            # If mixed topic, pick random from samples
            if topic == "mixed" and sample_questions:
                sample_topic = random.choice(
                    sample_questions).get('topic', topic)
            else:
                sample_topic = topic

            question = generate_ai_question(
                subject, sample_topic, sample_questions, difficulty)
            question['question_number'] = i + 1
            generated.append(question)

        except Exception as e:
            print(f"Warning: Failed to generate question {i+1}: {e}")
            continue

    return generated


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
        response = make_deepseek_request(messages, temperature=0.7, max_tokens=1500)
        return response
    
    except Exception as e:
        print(f"AI Tutor error: {e}")
        return f"I apologize, I'm having trouble responding. Please try again. Error: {str(e)}"
