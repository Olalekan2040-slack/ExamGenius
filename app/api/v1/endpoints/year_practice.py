"""
Year Practice Router
Handles past JAMB practice by year and subject with random sampling
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import random
import json
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.ai.gemini_service import generate_question_explanation
from app.services.analytics import AnalyticsService
from app.utils.text_formatter import sanitize_question_data

router = APIRouter(prefix="/year-practice", tags=["Year Practice"])

# Static fallback years — used when questions table is empty
STATIC_JAMB_YEARS = list(range(2024, 2009, -1))  # 2024 down to 2010
STATIC_JAMB_SUBJECTS_LIST = sorted([
    "Accounting", "Agricultural Science", "Art",
    "Biology", "Chemistry", "Commerce",
    "CRK", "Economics", "English Language",
    "French", "Further Mathematics", "Geography",
    "Government", "Hausa", "History",
    "Igbo", "IRK", "Literature in English",
    "Mathematics", "Music", "Physics",
])


def _ensure_year_practice_sessions_table(cursor):
    """Create year_practice_sessions table if it doesn't exist"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS year_practice_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            year INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            accuracy REAL NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            results_json TEXT
        )
    """)
    # Add results_json column if it was created before this migration
    try:
        cursor.execute("""
            ALTER TABLE year_practice_sessions
            ADD COLUMN IF NOT EXISTS results_json TEXT
        """)
    except Exception:
        pass
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

        # If questions table is empty, return static fallback so dropdowns still work
        if not years:
            years = STATIC_JAMB_YEARS
            # Build a placeholder pool so subjects show up in the UI
            pools = {
                subj: {yr: 0 for yr in STATIC_JAMB_YEARS}
                for subj in STATIC_JAMB_SUBJECTS_LIST
            }

        return {
            "available_years": years,
            "min_pool_size_required": 100,
            "subject_pools": pools
        }

    except Exception as e:
        # Even on error, return static data so UI doesn't break
        return {
            "available_years": STATIC_JAMB_YEARS,
            "min_pool_size_required": 100,
            "subject_pools": {
                subj: {yr: 0 for yr in STATIC_JAMB_YEARS}
                for subj in STATIC_JAMB_SUBJECTS_LIST
            }
        }


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
                   q.year, q.subject, NULL as passage
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

            question_data = {
                "question_id": question_id,
                "number": q[1],
                "question": q[2],
                "topic": q[3],
                "image_path": q[4],
                "correct_answer": q[5],
                "year": q[6],
                "subject": q[7],
                "passage": q[8] if q[8] else None,
                "options": options
            }
            formatted_questions.append(sanitize_question_data(question_data))

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

        if total_count == 0:
            raise HTTPException(status_code=400, detail="No answers provided")

        # ── Bulk-fetch all question data in 2 queries ────────────────────
        question_ids = [a.get("question_id") for a in request.answers]
        placeholders = ",".join(["?" for _ in question_ids])

        cursor.execute(f"""
            SELECT id, correct_option_key, question, topic, subject
            FROM questions
            WHERE id IN ({placeholders})
        """, question_ids)
        questions_map = {row[0]: row for row in cursor.fetchall()}

        cursor.execute(f"""
            SELECT question_id, option_key, option_text
            FROM options
            WHERE question_id IN ({placeholders})
            ORDER BY option_key
        """, question_ids)
        options_map: dict = {}
        for row in cursor.fetchall():
            options_map.setdefault(row[0], {})[row[1]] = row[2]
        # ─────────────────────────────────────────────────────────────────

        topic_stats: dict = {}

        # Build practice_attempts insert batch
        attempt_rows = []

        for answer_data in request.answers:
            question_id = answer_data.get("question_id")
            user_answer = answer_data.get("user_answer")

            q_row = questions_map.get(question_id)
            if not q_row:
                continue

            _, correct_answer, question_text, topic, subject = q_row
            is_correct = (user_answer == correct_answer)

            if is_correct:
                correct_count += 1

            if topic not in topic_stats:
                topic_stats[topic] = {"correct": 0, "total": 0}
            topic_stats[topic]["total"] += 1
            if is_correct:
                topic_stats[topic]["correct"] += 1

            options = options_map.get(question_id, {})
            explanation = f"The correct answer is {correct_answer}: {options.get(correct_answer, '')}"

            attempt_rows.append((
                user_id, subject, topic, question_id, user_answer, correct_answer,
                1 if is_correct else 0, datetime.utcnow().isoformat()
            ))

            results.append({
                "question_id": question_id,
                "question": question_text,
                "options": options,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "topic": topic,
                "subject": subject,
                "explanation": explanation
            })

        # ── Bulk insert practice_attempts ─────────────────────────────────
        cursor.executemany("""
            INSERT INTO practice_attempts
                (user_id, practice_type, subject, topic, question_id,
                 user_answer, correct_answer, is_correct, created_at)
            VALUES (?, 'year', ?, ?, ?, ?, ?, ?, ?)
        """, attempt_rows)

        # Update stats by topic — sort by topic name to prevent deadlocks from inconsistent lock ordering
        for topic in sorted(topic_stats.keys()):
            stats = topic_stats[topic]
            accuracy = (stats["correct"] / stats["total"]
                        * 100) if stats["total"] > 0 else 0

            # Retry up to 3 times on deadlock (PostgreSQL error code 40P01)
            for attempt in range(3):
                try:
                    cursor.execute("""
                        INSERT INTO user_stats (user_id, subject, topic, total_attempts, correct_attempts, accuracy, last_practiced)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(user_id, subject, topic) DO UPDATE SET
                            total_attempts = user_stats.total_attempts + ?,
                            correct_attempts = user_stats.correct_attempts + ?,
                            accuracy = (CAST(user_stats.correct_attempts + ? AS REAL) / (user_stats.total_attempts + ?)) * 100,
                            last_practiced = ?
                    """, (
                        user_id, request.subject, topic, stats["total"], stats["correct"], accuracy,
                        datetime.utcnow().isoformat(),
                        stats["total"], stats["correct"], stats["correct"], stats["total"],
                        datetime.utcnow().isoformat()
                    ))
                    break  # success
                except Exception as e:
                    if "deadlock" in str(e).lower() and attempt < 2:
                        import time
                        time.sleep(0.1 * (attempt + 1))  # 100ms, 200ms backoff
                        conn.rollback()
                        continue
                    raise  # re-raise on non-deadlock or 3rd attempt

        AnalyticsService.update_user_streak(cursor, user_id)

        # ── Save year practice session record ──────────────────────────────
        try:
            _ensure_year_practice_sessions_table(cursor)
            cursor.execute("""
                INSERT INTO year_practice_sessions
                    (user_id, subject, year, total_questions, correct_answers, accuracy, completed_at, results_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id, request.subject, request.year,
                total_count, correct_count,
                round((correct_count / total_count * 100) if total_count > 0 else 0, 2),
                datetime.utcnow().isoformat(),
                json.dumps(results)
            ))
        except Exception as e:
            print(f"Warning: Could not save year practice session: {e}")

        conn.commit()

        overall_accuracy = (correct_count / total_count * 100) if total_count > 0 else 0

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
            "topic_analysis": {},
            "strengths_weaknesses": {},
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


@router.get("/history")
async def get_year_practice_history(
    user_id: int = Depends(current_user_id)
):
    """
    Get history of all year practice sessions for the current user.
    Returns sessions ordered by most recent first.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        _ensure_year_practice_sessions_table(cursor)
        conn.commit()
        cursor.execute("""
            SELECT id, subject, year, total_questions, correct_answers, accuracy, completed_at
            FROM year_practice_sessions
            WHERE user_id = ?
            ORDER BY completed_at DESC
            LIMIT 50
        """, (user_id,))
        history = [
            {
                "id": row[0],
                "subject": row[1],
                "year": row[2],
                "total_questions": row[3],
                "correct_answers": row[4],
                "accuracy": round(row[5], 2) if row[5] else 0,
                "performance_level": _get_performance_level(row[5] or 0),
                "date": row[6]
            }
            for row in cursor.fetchall()
        ]
        return {"history": history, "total": len(history)}
    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


@router.get("/session/{session_id}/review")
async def get_year_practice_session_review(
    session_id: int,
    user_id: int = Depends(current_user_id)
):
    """
    Get full question-by-question review of a past year practice session.
    Returns stored question text, options, user's answer and correct answer.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        _ensure_year_practice_sessions_table(cursor)
        conn.commit()
        cursor.execute("""
            SELECT id, subject, year, total_questions, correct_answers, accuracy, completed_at, results_json
            FROM year_practice_sessions
            WHERE id = ? AND user_id = ?
        """, (session_id, user_id))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        stored_results = []
        if row[7]:
            try:
                stored_results = json.loads(row[7])
            except Exception:
                stored_results = []
        return {
            "session_id": row[0],
            "subject": row[1],
            "year": row[2],
            "total_questions": row[3],
            "correct_answers": row[4],
            "accuracy": round(row[5], 2) if row[5] else 0,
            "completed_at": row[6],
            "results": stored_results
        }
    except HTTPException:
        raise
    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")
