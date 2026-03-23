"""
Full CBT (Computerized Based Test) Router
Handles complete 4-subject JAMB exam sessions with timed practice
Uses random past questions from all available years
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random
import uuid
from app.db.database import get_connection
from app.core.security import current_user_id
from app.core.config import settings
from app.services.analytics import AnalyticsService
from app.utils.text_formatter import sanitize_question_data

router = APIRouter(prefix="/cbt", tags=["CBT Exams"])

ENGLISH_VARIANTS = {"English", "English Language", "Use of English"}

# All valid JAMB subjects - validate here so CBT works even before questions are imported
VALID_JAMB_SUBJECTS = {
    "Mathematics", "English", "English Language", "Use of English",
    "Biology", "Physics", "Chemistry",
    "Economics", "Commerce", "Accounting",
    "Government", "History", "Geography",
    "Literature", "Literature in English",
    "Art", "Music", "French", "Hausa", "Igbo",
    "CRK", "Christian Religious Knowledge",
    "IRK", "Islamic Religious Knowledge",
    "Agricultural Science", "Further Mathematics",
}


# Pydantic Models
class CreateCBTSessionRequest(BaseModel):
    subjects: List[str]


class AnswerItem(BaseModel):
    question_id: str
    user_answer: Optional[str] = None
    question_number: Optional[int] = None


class SubmitCBTRequest(BaseModel):
    # Array of answers from the client
    answers: List[AnswerItem]


def generate_session_id():
    """Generate unique session ID"""
    return f"CBT_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"


def normalize_subject_name(subject: str) -> str:
    """Map English variants to the canonical DB value."""
    return "English" if subject in ENGLISH_VARIANTS else subject


@router.post("/create")
async def create_cbt_session(request: CreateCBTSessionRequest, user_id: int = Depends(current_user_id)):
    """
    Create a new CBT session: English=60 questions, other 3 subjects=40 each (180 total, 2 hours)
    Uses random past JAMB questions from all available years
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Validate exactly 4 subjects
        if len(request.subjects) != 4:
            raise HTTPException(
                status_code=400,
                detail="Must provide exactly 4 subjects"
            )

        # Normalize subject names (English variants) before validation
        normalized_subjects = [
            normalize_subject_name(s) for s in request.subjects]

        # Validate subjects exist, exclude "Literature", and require English
        if "Literature" in normalized_subjects:
            raise HTTPException(
                status_code=400,
                detail="Literature is no longer available. Use 'Literature in English' instead."
            )

        if "English" not in normalized_subjects:
            raise HTTPException(
                status_code=400,
                detail="English is mandatory for all CBT exams"
            )

        # Validate subjects against known JAMB subject list
        invalid = set(normalized_subjects) - VALID_JAMB_SUBJECTS
        if invalid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid subjects: {', '.join(invalid)}. Valid subjects: {', '.join(sorted(VALID_JAMB_SUBJECTS))}"
            )

        practice_notice = None
        if settings.CBT_PRACTICE_WARNING:
            cursor.execute(
                "SELECT COUNT(*) FROM practice_attempts WHERE user_id = ?",
                (user_id,),
            )
            fetch = cursor.fetchone()
            practice_attempts = fetch[0] if fetch else 0
            if not practice_attempts:
                practice_notice = "No practice history found; complete topic practice before CBT for better results."

        # Create session record
        session_id = generate_session_id()
        expires_at = (datetime.utcnow() + timedelta(hours=2)).isoformat()

        cursor.execute("""
            INSERT INTO exam_sessions (id, user_id, status, total_questions, time_limit_minutes, expires_at)
            VALUES (?, ?, 'in_progress', 180, 120, ?)
        """, (session_id, user_id, expires_at))

        # Build question set: English=60 questions, other subjects=40 questions (JAMB standard)
        question_number = 1

        for subject_position, subject in enumerate(normalized_subjects, 1):
            # English/Use of English gets 60 questions; all other subjects get 40
            questions_for_subject = 60 if subject == "English" else 40
            cursor.execute("""
                SELECT id FROM questions
                WHERE subject = ? AND exam = 'JAMB'
                ORDER BY RANDOM()
                LIMIT ?
            """, (subject, questions_for_subject))

            for row in cursor.fetchall():
                cursor.execute("""
                    INSERT INTO session_questions (
                        session_id, question_id, subject, subject_position,
                        question_number, generated_by
                    )
                    VALUES (?, ?, ?, ?, ?, 'db')
                """, (session_id, row[0], subject, subject_position, question_number))

                question_number += 1

        conn.commit()

        return {
            "success": True,
            "session_id": session_id,
            "subjects": normalized_subjects,
            "total_questions": 180,
            "english_questions": 60,
            "other_questions": 40,
            "time_limit_minutes": 120,
            "expires_at": expires_at,
            "notice": practice_notice
        }

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Session creation failed: {str(e)}"
        )


@router.get("/{session_id}/questions")
async def get_cbt_questions(
    session_id: str,
    subject_position: Optional[int] = Query(None, ge=1, le=4),
    user_id: int = Depends(current_user_id)
):
    """
    Get questions for a CBT session
    Optionally filter by subject position
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Verify session ownership
        cursor.execute("""
            SELECT user_id, status, expires_at
            FROM exam_sessions
            WHERE id = ?
        """, (session_id,))

        session = cursor.fetchone()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if session[0] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        if session[1] != 'in_progress':
            raise HTTPException(
                status_code=400, detail=f"Session is {session[1]}")

        # Check expiry (handle both datetime and string formats)
        expires_val = session[2]
        expires_dt = datetime.fromisoformat(expires_val) if isinstance(
            expires_val, str) else expires_val
        if expires_dt < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Session expired")

        # Build query
        query = """
            SELECT sq.question_id, sq.question_number, sq.subject, sq.subject_position,
                   sq.generated_by, sq.marked_for_review
            FROM session_questions sq
            WHERE sq.session_id = ?
        """
        params = [session_id]

        if subject_position:
            query += " AND sq.subject_position = ?"
            params.append(subject_position)

        query += " ORDER BY sq.question_number"

        cursor.execute(query, params)
        question_rows = cursor.fetchall()

        # Format responses
        formatted = []
        for row in question_rows:
            question_id = row[0]
            generated_by = row[4]

            # All questions are from database
            cursor.execute("""
                SELECT q.id, q.question, q.image_path, q.topic,
                       COALESCE(q.passage, '')    AS passage,
                       COALESCE(q.table_html, '') AS table_html
                FROM questions q
                WHERE q.id = ?
            """, (question_id,))

            q = cursor.fetchone()
            if q:
                cursor.execute("""
                    SELECT option_key, option_text
                    FROM options
                    WHERE question_id = ?
                    ORDER BY option_key
                """, (question_id,))

                options = {opt[0]: opt[1] for opt in cursor.fetchall()}

                question_data = {
                    "question_id": q[0],
                    "question_number": row[1],
                    "subject": row[2],
                    "subject_position": row[3],
                    "question": q[1],
                    "image_path": q[2],
                    "topic": q[3],
                    "passage":    q[4] if q[4] else None,
                    "table_html": q[5] if q[5] else None,
                    "options": options,
                    "generated_by": "db",
                    "marked_for_review": bool(row[5])
                }
                formatted.append(sanitize_question_data(question_data))

        return {
            "session_id": session_id,
            "subject_position": subject_position,
            "total_returned": len(formatted),
            "questions": formatted
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch questions: {str(e)}"
        )


@router.post("/{session_id}/submit")
async def submit_cbt(session_id: str, request: SubmitCBTRequest, user_id: int = Depends(current_user_id)):
    """
    Submit CBT answers and get detailed grading
    Returns subject-wise scores, weak topics, and recommendations
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Verify session
        cursor.execute("""
            SELECT user_id, status
            FROM exam_sessions
            WHERE id = ?
        """, (session_id,))

        session = cursor.fetchone()
        if not session or session[0] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        if session[1] != 'in_progress':
            raise HTTPException(
                status_code=400, detail="Session already submitted")

        # Grade answers
        results = []
        correct_count = 0
        subject_scores = {}
        topic_stats = {}

        for answer_data in request.answers:
            question_id = answer_data.question_id
            user_answer = answer_data.user_answer
            question_number = answer_data.question_number

            # Update session question with answer
            cursor.execute("""
                UPDATE session_questions
                SET user_answer = ?
                WHERE session_id = ? AND question_id = ?
            """, (user_answer, session_id, question_id))

            # Get correct answer and metadata from DB questions
            cursor.execute("""
                SELECT q.correct_option_key, q.question, q.subject, q.topic
                FROM questions q
                WHERE q.id = ?
            """, (question_id,))

            q_row = cursor.fetchone()
            if not q_row:
                continue

            correct_answer = q_row[0]
            question_text = q_row[1]
            subject = q_row[2]
            topic = q_row[3]

            # Get options
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
            """, (question_id,))
            options = {opt[0]: opt[1] for opt in cursor.fetchall()}

            # Use stored explanation or provide simple one
            explanation = f"The correct answer is {correct_answer}."

            is_correct = (user_answer == correct_answer)

            # Log to practice_attempts for analytics
            cursor.execute(
                """
                INSERT INTO practice_attempts (user_id, practice_type, subject, topic, question_id,
                                              user_answer, correct_answer, is_correct, time_spent, created_at)
                VALUES (?, 'cbt', ?, ?, ?, ?, ?, ?, NULL, ?)
                """,
                (
                    user_id,
                    subject,
                    topic,
                    question_id,
                    user_answer,
                    correct_answer,
                    1 if is_correct else 0,
                    datetime.utcnow().isoformat(),
                ),
            )

            if is_correct:
                correct_count += 1

            # Track by subject
            if subject not in subject_scores:
                subject_scores[subject] = {"correct": 0, "total": 0}
            subject_scores[subject]["total"] += 1
            if is_correct:
                subject_scores[subject]["correct"] += 1

            # Track by topic
            if topic not in topic_stats:
                topic_stats[topic] = {"correct": 0,
                                      "total": 0, "subject": subject}
            topic_stats[topic]["total"] += 1
            if is_correct:
                topic_stats[topic]["correct"] += 1

            # Mark as correct in session
            cursor.execute("""
                UPDATE session_questions
                SET is_correct = ?
                WHERE session_id = ? AND question_id = ?
            """, (1 if is_correct else 0, session_id, question_id))

            results.append({
                "question_id": question_id,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "subject": subject,
                "topic": topic,
                "generated_by": "db",
                "explanation": explanation
            })

        # Calculate subject scores (as a list for frontend)
        subject_breakdown_list = []
        for subject, scores in subject_scores.items():
            accuracy = (scores["correct"] / scores["total"]
                        * 100) if scores["total"] > 0 else 0
            subject_breakdown_list.append({
                "subject": subject,
                "correct": scores["correct"],
                "total": scores["total"],
                "accuracy": round(accuracy, 2)
            })

        # Identify weakest topics (bottom 5)
        topic_accuracies = []
        for topic, stats in topic_stats.items():
            accuracy = (stats["correct"] / stats["total"]
                        * 100) if stats["total"] > 0 else 0
            topic_accuracies.append({
                "topic": topic,
                "subject": stats["subject"],
                "accuracy": accuracy,
                "attempts": stats["total"]
            })

        topic_accuracies.sort(key=lambda x: x["accuracy"])
        weakest_topics = topic_accuracies[:5]

        # Update user stats by topic
        for topic, stats in topic_stats.items():
            accuracy = (stats["correct"] / stats["total"]
                        * 100) if stats["total"] > 0 else 0

            cursor.execute("""
                INSERT INTO user_stats (user_id, subject, topic, total_attempts, correct_attempts, accuracy, last_practiced)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, subject, topic) DO UPDATE SET
                    total_attempts = user_stats.total_attempts + ?,
                    correct_attempts = user_stats.correct_attempts + ?,
                    accuracy = (CAST(user_stats.correct_attempts + ? AS REAL) / (user_stats.total_attempts + ?)) * 100,
                    last_practiced = ?
            """, (
                user_id, topic_stats[topic]["subject"], topic,
                stats["total"], stats["correct"], accuracy,
                datetime.utcnow().isoformat(),
                stats["total"], stats["correct"], stats["correct"], stats["total"],
                datetime.utcnow().isoformat()
            ))

        # Update session
        overall_accuracy = (correct_count / len(request.answers)
                            * 100) if request.answers else 0
        cursor.execute("""
            UPDATE exam_sessions
            SET status = 'completed', score = ?, answered_count = ?, completed_at = ?
            WHERE id = ?
        """, (int(correct_count), len(request.answers), datetime.utcnow().isoformat(), session_id))

        AnalyticsService.update_user_streak(cursor, user_id)

        conn.commit()

        # Get comprehensive CBT analytics
        cbt_analysis = AnalyticsService.get_cbt_analysis(session_id)
        overall_sw = AnalyticsService.identify_strengths_weaknesses(user_id)

        return {
            "success": True,
            "session_id": session_id,
            "total_questions": len(request.answers),
            "overall_score": correct_count,
            "overall_accuracy": round(overall_accuracy, 2),
            "performance_level": _get_performance_level(round(overall_accuracy, 2)),
            "subject_breakdown": subject_breakdown_list,
            "weakest_topics": weakest_topics,
            "cbt_analysis": cbt_analysis,
            "strengths_weaknesses": overall_sw,
            "results": results
        }

    except HTTPException:
        raise
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


@router.get("/{session_id}/review")
async def get_cbt_review(session_id: str, user_id: int = Depends(current_user_id)):
    """Get detailed review of completed CBT session"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get session
        cursor.execute("""
            SELECT status, score, answered_count, completed_at
            FROM exam_sessions
            WHERE id = ? AND user_id = ?
        """, (session_id, user_id))

        session = cursor.fetchone()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if session[0] != 'completed':
            raise HTTPException(
                status_code=400, detail="Session not completed")

        accuracy = (session[1] / session[2] * 100) if session[2] > 0 else 0

        # Get all answers with feedback
        cursor.execute("""
            SELECT sq.question_id, sq.question_number, sq.user_answer, sq.is_correct,
                   sq.subject, sq.subject_position, sq.generated_by
            FROM session_questions sq
            WHERE sq.session_id = ?
            ORDER BY sq.question_number
        """, (session_id,))

        reviews = []
        for row in cursor.fetchall():
            question_id = row[0]

            if row[6] == 'ai':
                # AI question
                cursor.execute("""
                    SELECT question_text, correct_option, topic, explanation
                    FROM ai_generated_questions
                    WHERE id = ?
                """, (question_id,))

                q_row = cursor.fetchone()
                if q_row:
                    reviews.append({
                        "question_number": row[1],
                        "question_id": question_id,
                        "user_answer": row[2],
                        "is_correct": bool(row[3]),
                        "subject": row[4],
                        "generated_by": "ai",
                        "correct_answer": q_row[1],
                        "topic": q_row[2],
                        "explanation": q_row[3]
                    })
            else:
                # DB question
                cursor.execute("""
                    SELECT q.question, q.correct_option_key, q.topic
                    FROM questions q
                    WHERE q.id = ?
                """, (question_id,))

                q_row = cursor.fetchone()
                if q_row:
                    reviews.append({
                        "question_number": row[1],
                        "question_id": question_id,
                        "user_answer": row[2],
                        "is_correct": bool(row[3]),
                        "subject": row[4],
                        "generated_by": "db",
                        "question": q_row[0],
                        "correct_answer": q_row[1],
                        "topic": q_row[2]
                    })

        return {
            "session_id": session_id,
            "score": session[1],
            "total_questions": session[2],
            "accuracy": round(accuracy, 2),
            "completed_at": session[3],
            "reviews": reviews,
            "questions_with_answers": reviews
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Review failed: {str(e)}"
        )
