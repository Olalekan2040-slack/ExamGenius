"""
Year Practice Router
Handles past JAMB practice by year and subject with random sampling
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import random
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.ai.gemini_service import generate_question_explanation
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/year-practice", tags=["Year Practice"])


# Pydantic Models
class SubmitYearPracticeRequest(BaseModel):
    subject: str
    year: int
    # [{"question_id": "...", "user_answer": "A"}, ...]
    answers: List[Dict[str, str]]


@router.get("/info")
async def get_year_practice_info():
    """Get available years and minimum question pool info"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get years with question counts per subject
        cursor.execute("""
            SELECT DISTINCT year
            FROM questions
            WHERE exam = 'JAMB'
            ORDER BY year DESC
        """)

        years = [row[0] for row in cursor.fetchall()]

        # Check pool sizes
        cursor.execute("""
            SELECT subject, year, COUNT(*) as count
            FROM questions
            WHERE exam = 'JAMB'
            GROUP BY subject, year
            ORDER BY year DESC, subject
        """)

        pools = {}
        for row in cursor.fetchall():
            subject, year, count = row
            if subject not in pools:
                pools[subject] = {}
            pools[subject][year] = count

        return {
            "available_years": years,
            "min_pool_size_required": 100,
            "subject_pools": pools
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch year info: {str(e)}"
        )


@router.get("/questions")
async def get_year_practice_questions(
    subject: str = Query(...),
    year: int = Query(...),
    count: int = Query(10, ge=10, le=40),
    user_id: int = Depends(current_user_id)
):
    """
    Get random questions for year practice
    Validates minimum pool size (100 questions required)
    Returns incomplete_year_data flag if pool is too small
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check pool size
        cursor.execute("""
            SELECT COUNT(*) FROM questions
            WHERE exam = 'JAMB' AND subject = ? AND year = ?
        """, (subject, year))

        pool_size = cursor.fetchone()[0]
        min_required = 100

        incomplete_data = pool_size < min_required

        # Get random questions
        cursor.execute("""
            SELECT q.id, q.number, q.question, q.topic, q.image_path, q.correct_option_key,
                   q.year, q.subject
            FROM questions q
            WHERE q.subject = ? AND q.year = ? AND q.exam = 'JAMB'
            ORDER BY RANDOM()
            LIMIT ?
        """, (subject, year, count))

        all_questions = cursor.fetchall()

        if len(all_questions) < count:
            # Not enough questions, return what we have
            count = len(all_questions)

        # Format questions with options
        formatted_questions = []
        for q in all_questions:
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
            "year": year,
            "pool_size": pool_size,
            "min_pool_required": min_required,
            "incomplete_year_data": incomplete_data,
            "returned_count": len(formatted_questions),
            "questions": formatted_questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch questions: {str(e)}"
        )


@router.post("/submit")
async def submit_year_practice(request: SubmitYearPracticeRequest, user_id: int = Depends(current_user_id)):
    """
    Submit year practice answers and get grading with explanations
    Updates user stats by topic and year
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        results = []
        correct_count = 0
        total_count = len(request.answers)

        topic_stats = {}  # Track accuracy by topic

        for answer_data in request.answers:
            question_id = answer_data.get("question_id")
            user_answer = answer_data.get("user_answer")

            # Get question details
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

            # Track by topic
            if topic not in topic_stats:
                topic_stats[topic] = {"correct": 0, "total": 0}
            topic_stats[topic]["total"] += 1
            if is_correct:
                topic_stats[topic]["correct"] += 1

            # Get options
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
            """, (question_id,))
            options = {row[0]: row[1] for row in cursor.fetchall()}

            # Generate explanation
            try:
                explanation = generate_question_explanation(
                    question_text, options, correct_answer, topic
                )
            except:
                explanation = f"The correct answer is {correct_answer}."

            # Record attempt
            cursor.execute("""
                INSERT INTO practice_attempts (user_id, practice_type, subject, topic, question_id,
                                              user_answer, correct_answer, is_correct, created_at)
                VALUES (?, 'year', ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, subject, topic, question_id, user_answer, correct_answer,
                  1 if is_correct else 0, datetime.utcnow().isoformat()))

            results.append({
                "question_id": question_id,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "topic": topic,
                "explanation": explanation
            })

        # Update stats by topic
        for topic, stats in topic_stats.items():
            accuracy = (stats["correct"] / stats["total"]
                        * 100) if stats["total"] > 0 else 0

            cursor.execute("""
                INSERT INTO user_stats (user_id, subject, topic, total_attempts, correct_attempts, accuracy, last_practiced)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, subject, topic) DO UPDATE SET
                    total_attempts = total_attempts + ?,
                    correct_attempts = correct_attempts + ?,
                    accuracy = (CAST(correct_attempts + ? AS REAL) / (total_attempts + ?)) * 100,
                    last_practiced = ?
            """, (
                user_id, request.subject, topic, stats["total"], stats["correct"], accuracy,
                datetime.utcnow().isoformat(),
                stats["total"], stats["correct"], stats["correct"], stats["total"],
                datetime.utcnow().isoformat()
            ))

        AnalyticsService.update_user_streak(cursor, user_id)

        conn.commit()

        overall_accuracy = (correct_count / total_count *
                            100) if total_count > 0 else 0

        # Get analytics for year practice
        attempt_results = [{"question_id": r["question_id"], "is_correct": r["is_correct"]} for r in results]
        topic_analysis = AnalyticsService.calculate_topic_analysis(
            user_id, request.subject, f"Year {request.year}", attempt_results
        )
        overall_sw = AnalyticsService.identify_strengths_weaknesses(user_id, request.subject)

        return {
            "success": True,
            "subject": request.subject,
            "year": request.year,
            "total_questions": total_count,
            "correct_answers": correct_count,
            "accuracy": round(overall_accuracy, 2),
            "performance_level": _get_performance_level(round(overall_accuracy, 2)),
            "summary": {
                "score": round(overall_accuracy, 2),
                "correct": correct_count,
                "incorrect": total_count - correct_count,
                "total": total_count
            },
            "topic_analysis": topic_analysis,
            "strengths_weaknesses": overall_sw,
            "by_topic": {
                topic: {
                    "correct": stats["correct"],
                    "total": stats["total"],
                    "accuracy": round(stats["correct"] / stats["total"] * 100, 2)
                }
                for topic, stats in topic_stats.items()
            },
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
