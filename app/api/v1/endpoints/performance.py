"""
Performance and weakness tracking endpoints.
Additive: logs attempts, summarizes performance, surfaces weak topics, and pulls weak-topic questions for revision.
"""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.db.database import get_connection
from app.core.security import current_user_id
from app.utils.text_formatter import sanitize_question_data

router = APIRouter(prefix="/performance", tags=["Performance"])


class LogRequest(BaseModel):
    practice_type: str = Field(..., pattern="^(topic|year|cbt|revision)$")
    subject: str
    topic: Optional[str] = None
    year: Optional[int] = None
    question_id: str
    user_answer: Optional[str] = None
    correct_answer: Optional[str] = None
    is_correct: bool
    time_spent: Optional[int] = Field(None, ge=0)


@router.post("/log")
async def log_attempt(payload: LogRequest, user_id: int = Depends(current_user_id)):
    """Log a practice/CBT attempt for downstream analytics."""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO practice_attempts (
                user_id, practice_type, subject, topic, year, question_id,
                user_answer, correct_answer, is_correct, time_spent, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                payload.practice_type,
                payload.subject,
                payload.topic,
                payload.year,
                payload.question_id,
                payload.user_answer,
                payload.correct_answer or "",
                1 if payload.is_correct else 0,
                payload.time_spent,
                datetime.utcnow().isoformat(),
            ),
        )
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to log attempt: {str(e)}")


@router.get("/summary")
async def get_performance_summary(
    subject: Optional[str] = Query(None),
    user_id: int = Depends(current_user_id),
):
    """Return per-topic performance summary (accuracy, attempts, avg time)."""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        params = [user_id]
        subject_clause = ""
        if subject:
            subject_clause = " AND subject = ?"
            params.append(subject)

        cursor.execute(
            f"""
            SELECT topic, subject,
                   COUNT(*) as attempts,
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
                   AVG(COALESCE(time_spent, 0)) as avg_time
            FROM practice_attempts
            WHERE user_id = ?{subject_clause}
            GROUP BY topic, subject
            ORDER BY subject, topic
            """,
            params,
        )

        per_topic = []
        overall_attempts = 0
        overall_correct = 0
        for row in cursor.fetchall():
            topic, subj, attempts, correct, avg_time = row
            accuracy = (correct / attempts * 100) if attempts else 0
            per_topic.append(
                {
                    "subject": subj,
                    "topic": topic,
                    "attempts": attempts,
                    "correct": correct,
                    "accuracy": round(accuracy, 2),
                    "avg_time_seconds": round(avg_time or 0, 2),
                }
            )
            overall_attempts += attempts
            overall_correct += correct

        overall_accuracy = (overall_correct / overall_attempts * 100) if overall_attempts else 0
        return {
            "overall_attempts": overall_attempts,
            "overall_correct": overall_correct,
            "overall_accuracy": round(overall_accuracy, 2),
            "topics": per_topic,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch performance summary: {str(e)}")


@router.get("/weak-topics")
async def get_weak_topics(
    subject: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    min_attempts: int = Query(3, ge=1, le=50),
    threshold: float = Query(70.0, ge=0, le=100),
    user_id: int = Depends(current_user_id),
):
    """Return ranked weak topics based on accuracy and minimum attempts."""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        topics = _compute_weak_topics(cursor, user_id, subject, min_attempts, threshold, limit)
        return {"weak_topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weak topics: {str(e)}")


@router.get("/revision/weak-questions")
async def get_weak_questions_for_revision(
    subject: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    min_attempts: int = Query(3, ge=1, le=50),
    threshold: float = Query(70.0, ge=0, le=100),
    user_id: int = Depends(current_user_id),
):
    """Pull questions only from weak topics for targeted revision."""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        weak_topics = _compute_weak_topics(cursor, user_id, subject, min_attempts, threshold, limit)
        topic_list = [wt["topic"] for wt in weak_topics]
        if not topic_list:
            return {"questions": [], "weak_topics": []}

        # Build query for questions from weak topics
        placeholders = ",".join(["?"] * len(topic_list))
        params = topic_list
        subject_clause = ""
        if subject:
            subject_clause = " AND subject = ?"
            params.append(subject)

        cursor.execute(
            f"""
            SELECT q.id, q.number, q.question, q.topic, q.image_path, q.correct_option_key,
                   q.year, q.subject
            FROM questions q
            WHERE q.topic IN ({placeholders}){subject_clause} AND q.exam = 'JAMB'
            ORDER BY RANDOM()
            LIMIT ?
            """,
            params + [limit],
        )

        questions = []
        for q in cursor.fetchall():
            question_id = q[0]
            cursor.execute(
                """
                SELECT option_key, option_text
                FROM options
                WHERE question_id = ?
                ORDER BY option_key
                """,
                (question_id,),
            )
            options = {row[0]: row[1] for row in cursor.fetchall()}

            question_data = {
                "question_id": question_id,
                "number": q[1],
                "question": q[2],
                "topic": q[3],
                "image_path": q[4],
                "correct_answer": q[5],
                "year": q[6],
                "subject": q[7],
                "options": options,
            }
            questions.append(sanitize_question_data(question_data))

        return {"questions": questions, "weak_topics": weak_topics}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch revision questions: {str(e)}")


def _compute_weak_topics(cursor, user_id: int, subject: Optional[str], min_attempts: int, threshold: float, limit: int):
    params = [user_id]
    subject_clause = ""
    if subject:
        subject_clause = " AND subject = ?"
        params.append(subject)

    cursor.execute(
        f"""
        SELECT topic, subject,
               COUNT(*) as attempts,
               SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
               AVG(COALESCE(time_spent, 0)) as avg_time
        FROM practice_attempts
        WHERE user_id = ?{subject_clause}
        GROUP BY topic, subject
        HAVING attempts >= ?
        ORDER BY (CAST(correct AS FLOAT) / attempts) ASC
        LIMIT ?
        """,
        params + [min_attempts, limit],
    )

    weak = []
    for row in cursor.fetchall():
        topic, subj, attempts, correct, avg_time = row
        accuracy = (correct / attempts * 100) if attempts else 0
        if accuracy >= threshold:
            continue
        weak.append(
            {
                "subject": subj,
                "topic": topic,
                "attempts": attempts,
                "correct": correct,
                "accuracy": round(accuracy, 2),
                "avg_time_seconds": round(avg_time or 0, 2),
            }
        )
    return weak
