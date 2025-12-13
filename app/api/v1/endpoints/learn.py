"""
Learn Topics and Topic Practice Router
Handles AI lesson generation, topic-based practice, and question explanations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import random
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.ai.gemini_service import generate_topic_lesson, generate_question_explanation, ask_ai_tutor
from app.services.analytics import AnalyticsService
from app.services.ai_content import ai_content_service


def _get_topic_videos(cursor, subject: str, topic: str):
    """Fetch admin-managed videos for a subject/topic"""
    try:
        cursor.execute(
            """
            SELECT title, description, url, duration_seconds, created_at
            FROM topic_videos
            WHERE subject = ? AND topic = ?
            ORDER BY created_at DESC
            """,
            (subject, topic),
        )
        videos = []
        for row in cursor.fetchall():
            videos.append(
                {
                    "title": row[0],
                    "description": row[1],
                    "url": row[2],
                    "duration_seconds": row[3],
                    "created_at": row[4],
                }
            )
        return videos
    except Exception:
        # If the table is missing or any other issue, return empty list gracefully
        return []

router = APIRouter(prefix="/learn", tags=["Learn"])


# Pydantic Models
class PracticeAnswer(BaseModel):
    question_id: str  # Can be string ID from database
    user_answer: Optional[str] = None


class SubmitTopicPracticeRequest(BaseModel):
    subject: str
    topic: str
    # [{"question_id": 123, "user_answer": "A"}, ...]
    answers: List[PracticeAnswer]


class AskTutorRequest(BaseModel):
    subject: str
    topic: str
    question: str
    lesson_context: Optional[Dict] = None
    chat_history: Optional[List[Dict]] = None


@router.get("/topics/{subject}")
async def get_topics_by_subject(subject: str, user_id: int = Depends(current_user_id)):
    """Get all topics for a subject with question counts and user's last practice score"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get topics with question counts
        cursor.execute("""
            SELECT topic, COUNT(*) as question_count
            FROM questions
            WHERE exam = 'JAMB' AND subject = ?
            GROUP BY topic
            ORDER BY topic
        """, (subject,))

        topics = []
        for row in cursor.fetchall():
            topic_name = row[0]
            question_count = row[1]

            # Get user's stats for this topic
            cursor.execute("""
                SELECT accuracy, total_attempts, last_practiced
                FROM user_stats
                WHERE user_id = ? AND subject = ? AND topic = ?
            """, (user_id, subject, topic_name))

            stats_row = cursor.fetchone()

            topics.append({
                "topic": topic_name,
                "question_count": question_count,
                "last_score": round(stats_row[0], 2) if stats_row else None,
                "attempts": stats_row[1] if stats_row else 0,
                "last_practiced": stats_row[2] if stats_row else None
            })

        return {
            "subject": subject,
            "topics": topics
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch topics: {str(e)}"
        )


@router.get("/lesson/{subject}/{topic}")
async def get_topic_lesson(
    subject: str,
    topic: str,
    language: str = Query("english", regex="^(english|pidgin)$"),
    user_id: int = Depends(current_user_id)
):
    """
    Get or generate AI lesson for a topic
    Caches lessons in database for reuse
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if lesson already exists in cache
        cursor.execute("""
            SELECT key_idea, example, steps, quick_tip, full_content, diagrams
            FROM topic_lessons
            WHERE subject = ? AND topic = ? AND language = ?
        """, (subject, topic, language))

        cached = cursor.fetchone()

        if cached:
            videos = _get_topic_videos(cursor, subject, topic)
            return {
                "subject": subject,
                "topic": topic,
                "language": language,
                "cached": True,
                "lesson": {
                    "key_idea": cached[0],
                    "example": cached[1],
                    "steps": cached[2],
                    "quick_tip": cached[3],
                    "full_content": cached[4],
                    "diagrams": cached[5]
                },
                "videos": videos
            }

        # Get sample questions for context
        cursor.execute("""
            SELECT question, topic
            FROM questions
            WHERE subject = ? AND topic = ? AND exam = 'JAMB'
            LIMIT 5
        """, (subject, topic))

        sample_questions = [
            {"question": row[0], "topic": row[1]}
            for row in cursor.fetchall()
        ]

        # Generate new lesson
        lesson = generate_topic_lesson(
            subject, topic, language, sample_questions)

        # Cache the lesson
        cursor.execute("""
            INSERT INTO topic_lessons (subject, topic, language, key_idea, example, steps, quick_tip, full_content, diagrams, generated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            subject, topic, language,
            lesson.get('key_idea'),
            lesson.get('example'),
            lesson.get('steps'),
            lesson.get('quick_tip'),
            lesson.get('full_content'),
            lesson.get('diagrams', ''),
            datetime.utcnow().isoformat()
        ))
        conn.commit()

        videos = _get_topic_videos(cursor, subject, topic)

        return {
            "subject": subject,
            "topic": topic,
            "language": language,
            "cached": False,
            "lesson": lesson,
            "videos": videos
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lesson generation failed: {str(e)}"
        )


@router.get("/questions/{subject}/{topic}")
async def get_practice_questions_by_path(
    subject: str,
    topic: str,
    count: int = Query(10, ge=1, le=50),
    user_id: int = Depends(current_user_id)
):
    """
    Get practice questions for a specific topic
    Path-based endpoint for frontend compatibility
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get all questions for this topic
        cursor.execute("""
            SELECT q.id, q.number, q.question, q.topic, q.image_path, q.correct_option_key,
                   q.year, q.subject
            FROM questions q
            WHERE q.subject = ? AND q.topic = ? AND q.exam = 'JAMB'
            ORDER BY RANDOM()
        """, (subject, topic))

        all_questions = cursor.fetchall()
        total_available = len(all_questions)

        # Check if we have fewer than requested
        partial_set = total_available < count
        questions_to_return = all_questions[:
                                            count] if count < total_available else all_questions

        # Format questions with options
        formatted_questions = []
        for q in questions_to_return:
            question_id = q[0]

            # Get options
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
                ORDER BY option_key
            """, (question_id,))

            options = {row[0]: row[1] for row in cursor.fetchall()}

            formatted_questions.append({
                "question_id": question_id,
                "number": q[1],
                "question": q[2],
                "topic": q[3],
                "image_path": q[4],
                "correct_answer": q[5],
                "year": q[6],
                "subject": q[7],
                "options": options
            })

        return {
            "subject": subject,
            "topic": topic,
            "total_available": total_available,
            "returned": len(formatted_questions),
            "partial_topic_set": partial_set,
            "questions": formatted_questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch questions: {str(e)}"
        )


@router.get("/practice/topic")
async def get_topic_practice_questions(
    subject: str = Query(...),
    topic: str = Query(...),
    limit: int = Query(30, ge=1, le=50),
    user_id: int = Depends(current_user_id)
):
    """
    Get practice questions for a specific topic (up to 30)
    Returns partial_topic_set flag if fewer questions available
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get all questions for this topic
        cursor.execute("""
            SELECT q.id, q.number, q.question, q.topic, q.image_path, q.correct_option_key,
                   q.year, q.subject
            FROM questions q
            WHERE q.subject = ? AND q.topic = ? AND q.exam = 'JAMB'
            ORDER BY RANDOM()
        """, (subject, topic))

        all_questions = cursor.fetchall()
        total_available = len(all_questions)

        # Check if we have fewer than requested
        partial_set = total_available < limit
        questions_to_return = all_questions[:
                                            limit] if limit < total_available else all_questions

        # Format questions with options
        formatted_questions = []
        for q in questions_to_return:
            question_id = q[0]

            # Get options
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
                ORDER BY option_key
            """, (question_id,))

            options = {row[0]: row[1] for row in cursor.fetchall()}

            formatted_questions.append({
                "question_id": question_id,
                "number": q[1],
                "question": q[2],
                "topic": q[3],
                "image_path": q[4],
                "correct_answer": q[5],
                "year": q[6],
                "subject": q[7],
                "options": options
            })

        return {
            "subject": subject,
            "topic": topic,
            "total_available": total_available,
            "returned": len(formatted_questions),
            "partial_topic_set": partial_set,
            "questions": formatted_questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch questions: {str(e)}"
        )


@router.post("/practice/topic/submit")
async def submit_topic_practice(request: SubmitTopicPracticeRequest, user_id: int = Depends(current_user_id)):
    """
    Submit topic practice answers and get immediate grading with AI explanations
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        results = []
        correct_count = 0
        total_count = len(request.answers)

        for answer_data in request.answers:
            question_id = answer_data.question_id
            user_answer = answer_data.user_answer

            # Get correct answer and question details
            cursor.execute("""
                SELECT q.correct_option_key, q.question, q.topic, q.subject
                FROM questions q
                WHERE q.id = ?
            """, (question_id,))

            q_row = cursor.fetchone()
            if not q_row:
                continue

            correct_answer = q_row[0]
            question_text = q_row[1]
            topic = q_row[2]
            subject = q_row[3]
            is_correct = (user_answer == correct_answer)

            if is_correct:
                correct_count += 1

            # Get options for explanation
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
            """, (question_id,))
            options = {row[0]: row[1] for row in cursor.fetchall()}

            # Simple explanation (AI generation removed to prevent timeout)
            explanation = f"The correct answer is {correct_answer}: {options.get(correct_answer, '')}"

            # Record attempt
            cursor.execute("""
                INSERT INTO practice_attempts (user_id, practice_type, subject, topic, question_id,
                                              user_answer, correct_answer, is_correct, created_at)
                VALUES (?, 'topic', ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, subject, topic, question_id, user_answer, correct_answer,
                  1 if is_correct else 0, datetime.utcnow().isoformat()))

            results.append({
                "question_id": question_id,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                # keep "correct" for frontend compatibility
                "correct": is_correct,
                "explanation": explanation
            })

        # Update user stats
        accuracy = (correct_count / total_count *
                    100) if total_count > 0 else 0

        cursor.execute("""
            INSERT INTO user_stats (user_id, subject, topic, total_attempts, correct_attempts, accuracy, last_practiced)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, subject, topic) DO UPDATE SET
                total_attempts = total_attempts + ?,
                correct_attempts = correct_attempts + ?,
                accuracy = (CAST(correct_attempts + ? AS REAL) / (total_attempts + ?)) * 100,
                last_practiced = ?
        """, (
            user_id, request.subject, request.topic, total_count, correct_count, accuracy,
            datetime.utcnow().isoformat(),
            total_count, correct_count, correct_count, total_count,
            datetime.utcnow().isoformat()
        ))

        # Get updated stats so the frontend can display them directly
        cursor.execute("""
            SELECT total_attempts, correct_attempts, accuracy
            FROM user_stats
            WHERE user_id = ? AND subject = ? AND topic = ?
        """, (user_id, request.subject, request.topic))

        stats_row = cursor.fetchone()
        updated_stats = {
            "total_attempts": stats_row[0] if stats_row else total_count,
            "correct_attempts": stats_row[1] if stats_row else correct_count,
            "accuracy": stats_row[2] if stats_row else accuracy
        }

        AnalyticsService.update_user_streak(cursor, user_id)

        conn.commit()

        # Get comprehensive analytics for this practice session
        attempt_results = []
        for r in results:
            attempt_results.append({
                'question_id': r['question_id'],
                'is_correct': r['is_correct']
            })

        topic_analysis = AnalyticsService.calculate_topic_analysis(
            user_id, request.subject, request.topic, attempt_results
        )

        return {
            "success": True,
            "total_questions": total_count,
            "correct_answers": correct_count,
            "accuracy": round(accuracy, 2),
            "summary": {
                "score": round(accuracy, 2),
                "correct": correct_count,
                "incorrect": total_count - correct_count,
                "total": total_count,
                "performance_level": _get_performance_level(round(accuracy, 2))
            },
            "updated_stats": updated_stats,
            "topic_analysis": topic_analysis,
            "strengths_weaknesses": AnalyticsService.identify_strengths_weaknesses(
                user_id, request.subject
            ),
            "results": results
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Submission failed: {str(e)}"
        )


def _get_performance_level(accuracy: float) -> str:
    """Determine performance level based on accuracy"""
    if accuracy >= 90:
        return "excellent"
    elif accuracy >= 75:
        return "good"
    elif accuracy >= 60:
        return "fair"
    elif accuracy >= 40:
        return "poor"
    else:
        return "needs_improvement"


@router.get("/analytics")
async def get_learning_analytics(user_id: int = Depends(current_user_id)):
    """
    Get comprehensive learning analytics for dashboard
    Includes strengths, weaknesses, trends, and performance insights
    """
    try:
        analytics = AnalyticsService.get_comprehensive_dashboard_stats(user_id)
        return analytics
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch analytics: {str(e)}"
        )

@router.post("/ask-tutor")
async def ask_ai_tutor_endpoint(request: AskTutorRequest, user_id: int = Depends(current_user_id)):
    """
    Interactive AI tutor for asking questions about topics
    Maintains conversation history for context-aware responses
    """
    try:
        response = ask_ai_tutor(
            subject=request.subject,
            topic=request.topic,
            question=request.question,
            lesson_context=request.lesson_context,
            chat_history=request.chat_history or []
        )

        return {
            "response": response,
            "subject": request.subject,
            "topic": request.topic
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Tutor failed: {str(e)}"
        )

@router.get("/ai/content")
async def get_ai_content_context(
    subject_id: Optional[int] = Query(None),
    topic_id: Optional[int] = Query(None),
    subtopic_id: Optional[int] = Query(None),
    difficulty: Optional[str] = Query(None, regex="^(easy|medium|hard)$"),
    limit: int = Query(5, ge=1, le=20),
    content_types: Optional[str] = Query("all", description="Comma-separated: questions,videos,notes,readings or 'all'"),
    user_id: int = Depends(current_user_id),
    db=Depends(get_connection)
):
    """
    AI Content Query Endpoint
    Retrieve learning materials organized by subject/topic/difficulty for AI tutoring
    
    Used by AI services to fetch relevant context when generating explanations or tutoring.
    Returns questions with explanations, videos, notes, and readings.
    
    Example:
    - GET /learn/ai/content?subject_id=1&topic_id=5&difficulty=medium
    - GET /learn/ai/content?subject_id=1&content_types=questions,videos
    """
    
    try:
        # Use injected db connection
        
        context = ai_content_service.get_content_context(
            db=db,
            subject_id=subject_id,
            topic_id=topic_id,
            subtopic_id=subtopic_id,
            difficulty=difficulty,
            limit=limit
        )
        
        # Filter content types if specified
        if content_types != "all":
            requested_types = [ct.strip() for ct in content_types.split(",")]
            filtered_context = {}
            for ct in requested_types:
                if ct in context:
                    filtered_context[ct] = context[ct]
            context = filtered_context
        
        # Log content access for analytics
        ai_content_service.log_content_interaction(
            db=db,
            user_id=user_id,
            content_type="ai_query",
            content_id=0,
            interaction_type="ai_content_query"
        )
        
        return {
            "query_params": {
                "subject_id": subject_id,
                "topic_id": topic_id,
                "subtopic_id": subtopic_id,
                "difficulty": difficulty
            },
            "results": context,
            "total_questions": len(context.get("questions", [])),
            "total_videos": len(context.get("videos", [])),
            "total_notes": len(context.get("notes", [])),
            "total_readings": len(context.get("readings", []))
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch AI content context: {str(e)}"
        )
