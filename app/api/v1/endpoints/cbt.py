"""
Full CBT (Computerized Based Test) Router
Handles complete 4-subject JAMB exam sessions with timed practice
Subject slot 3 uses AI-generated questions
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random
import uuid
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.ai.gemini_service import (
    generate_ai_question,
    generate_question_explanation,
    batch_generate_ai_questions
)
from app.services.analytics import AnalyticsService
from app.utils.text_formatter import sanitize_question_data

router = APIRouter(prefix="/cbt", tags=["CBT Exams"])


# Pydantic Models
class CreateCBTSessionRequest(BaseModel):
    subjects: List[str]


class SubmitCBTRequest(BaseModel):
    # [{"question_id": "...", "user_answer": "A"}, ...]
    answers: List[Dict[str, str]]


def generate_session_id():
    """Generate unique session ID"""
    return f"CBT_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"


@router.post("/create")
async def create_cbt_session(request: CreateCBTSessionRequest, user_id: int = Depends(current_user_id)):
    """
    Create a new CBT session with 4 subjects (40 questions each = 160 total)

    Subject slots:
    - Slots 1, 2, 4: Real past JAMB questions from DB
    - Slot 3: AI-generated questions
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

        # Validate subjects exist
        placeholders = ','.join(['?'] * len(request.subjects))
        cursor.execute(
            f"SELECT DISTINCT subject FROM questions WHERE subject IN ({placeholders})",
            request.subjects
        )
        valid_subjects = [row[0] for row in cursor.fetchall()]

        invalid = set(request.subjects) - set(valid_subjects)
        if invalid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid subjects: {', '.join(invalid)}"
            )

        # Create session record
        session_id = generate_session_id()
        expires_at = (datetime.utcnow() + timedelta(hours=3)).isoformat()

        cursor.execute("""
            INSERT INTO exam_sessions (id, user_id, status, total_questions, time_limit_minutes, expires_at)
            VALUES (?, ?, 'in_progress', 160, 180, ?)
        """, (session_id, user_id, expires_at))

        # Build question set: 40 questions per subject
        session_questions = []
        question_number = 1

        for subject_position, subject in enumerate(request.subjects, 1):
            questions_for_subject = []

            if subject_position == 3:
                # Slot 3: Try AI questions, fallback to DB on timeout/error
                print(f"Attempting AI generation for {subject}...")

                # Get sample questions for AI context
                cursor.execute("""
                    SELECT id, question, topic, correct_option_key
                    FROM questions
                    WHERE subject = ? AND exam = 'JAMB'
                    LIMIT 10
                """, (subject,))

                samples = [
                    {
                        "question": row[1],
                        "topic": row[2],
                        "correct_option": row[3]
                    }
                    for row in cursor.fetchall()
                ]

                # Generate AI questions (with built-in retry logic)
                ai_questions = []
                try:
                    ai_questions = batch_generate_ai_questions(
                        subject, "mixed", samples, count=40)

                    if ai_questions and len(ai_questions) >= 20:  # Got enough questions
                        print(f"Generated {len(ai_questions)} AI questions")
                        for ai_q in ai_questions:
                            # Insert into ai_generated_questions table
                            ai_question_id = f"AI_{session_id}_{subject}_{ai_q['question_number']}"

                            cursor.execute("""
                                INSERT INTO ai_generated_questions (
                                    id, subject, topic, question_text,
                                    option_a, option_b, option_c, option_d,
                                    correct_option, difficulty, explanation, generated_at
                                )
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (
                                ai_question_id, subject, ai_q.get(
                                    'topic', 'General'),
                                ai_q['question_text'],
                                ai_q['option_a'], ai_q['option_b'],
                                ai_q['option_c'], ai_q['option_d'],
                                ai_q['correct_option'], ai_q.get(
                                    'difficulty', 'medium'),
                                ai_q.get('explanation', ''),
                                datetime.utcnow().isoformat()
                            ))

                            # Add to session
                            cursor.execute("""
                                INSERT INTO session_questions (
                                    session_id, question_id, subject, subject_position,
                                    question_number, generated_by
                                )
                                VALUES (?, ?, ?, ?, ?, 'ai')
                            """, (session_id, ai_question_id, subject, subject_position, question_number))

                            question_number += 1
                    else:
                        print(f"AI generated only {len(ai_questions)} questions, using DB fallback")
                        raise Exception("Insufficient AI questions")

                except Exception as e:
                    print(f"AI generation failed ({str(e)}), using DB questions")
                    # Fallback: Use DB questions
                    cursor.execute("""
                        SELECT id FROM questions
                        WHERE subject = ? AND exam = 'JAMB'
                        ORDER BY RANDOM()
                        LIMIT 40
                    """, (subject,))

                    for row in cursor.fetchall():
                        cursor.execute("""
                            INSERT INTO session_questions (
                                session_id, question_id, subject, subject_position,
                                question_number, generated_by
                            )
                            VALUES (?, ?, ?, ?, ?, 'db')
                        """, (session_id, row[0], subject, subject_position, question_number))

                        question_number += 1

            else:
                # Slots 1, 2, 4: Real JAMB questions
                cursor.execute("""
                    SELECT id FROM questions
                    WHERE subject = ? AND exam = 'JAMB'
                    ORDER BY RANDOM()
                    LIMIT 40
                """, (subject,))

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
            "subjects": request.subjects,
            "total_questions": 160,
            "questions_per_subject": 40,
            "time_limit_minutes": 180,
            "expires_at": expires_at
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

        # Check expiry
        if datetime.fromisoformat(session[2]) < datetime.utcnow():
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

            if generated_by == 'ai':
                # Get AI question
                cursor.execute("""
                    SELECT id, question_text, option_a, option_b, option_c, option_d,
                           correct_option, topic, difficulty
                    FROM ai_generated_questions
                    WHERE id = ?
                """, (question_id,))

                q = cursor.fetchone()
                if q:
                    question_data = {
                        "question_id": q[0],
                        "question_number": row[1],
                        "subject": row[2],
                        "question": q[1],
                        "options": {
                            "A": q[2],
                            "B": q[3],
                            "C": q[4],
                            "D": q[5]
                        },
                        "topic": q[7],
                        "generated_by": "ai",
                        "marked_for_review": bool(row[5])
                    }
                    formatted.append(sanitize_question_data(question_data))
            else:
                # Get DB question
                cursor.execute("""
                    SELECT q.id, q.question, q.image_path, q.topic
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
                        "question": q[1],
                        "image_path": q[3],
                        "topic": q[3],
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
            question_id = answer_data.get("question_id")
            user_answer = answer_data.get("user_answer")
            question_number = answer_data.get("question_number")

            # Update session question with answer
            cursor.execute("""
                UPDATE session_questions
                SET user_answer = ?
                WHERE session_id = ? AND question_id = ?
            """, (user_answer, session_id, question_id))

            # Get correct answer and metadata
            if question_id.startswith("AI_"):
                # AI question
                cursor.execute("""
                    SELECT correct_option, question_text, subject, topic, explanation
                    FROM ai_generated_questions
                    WHERE id = ?
                """, (question_id,))

                q_row = cursor.fetchone()
                if q_row:
                    correct_answer = q_row[0]
                    question_text = q_row[1]
                    subject = q_row[2]
                    topic = q_row[3]
                    explanation = q_row[4]
                    generated_by = "ai"
            else:
                # DB question
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
                generated_by = "db"

                # Get options
                cursor.execute("""
                    SELECT option_key, option_text
                    FROM options
                    WHERE question_id = ?
                """, (question_id,))
                options = {opt[0]: opt[1] for opt in cursor.fetchall()}

                # Generate explanation
                try:
                    explanation = generate_question_explanation(
                        question_text, options, correct_answer, topic
                    )
                except:
                    explanation = f"The correct answer is {correct_answer}."

            is_correct = (user_answer == correct_answer)

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
                "generated_by": generated_by,
                "explanation": explanation
            })

        # Calculate subject scores
        subject_breakdown = {}
        for subject, scores in subject_scores.items():
            accuracy = (scores["correct"] / scores["total"]
                        * 100) if scores["total"] > 0 else 0
            subject_breakdown[subject] = {
                "correct": scores["correct"],
                "total": scores["total"],
                "accuracy": round(accuracy, 2),
                # Simple scoring
                "score": int(scores["correct"] / scores["total"] * 100)
            }

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
                    total_attempts = total_attempts + ?,
                    correct_attempts = correct_attempts + ?,
                    accuracy = (CAST(correct_attempts + ? AS REAL) / (total_attempts + ?)) * 100,
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
            "correct_answers": correct_count,
            "overall_accuracy": round(overall_accuracy, 2),
            "performance_level": _get_performance_level(round(overall_accuracy, 2)),
            "subject_breakdown": subject_breakdown,
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
            FROM session_questions
            WHERE session_id = ?
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
                        "correct_answer": q_row[1],
                        "topic": q_row[2]
                    })

        return {
            "session_id": session_id,
            "score": session[1],
            "total_questions": session[2],
            "accuracy": round(accuracy, 2),
            "completed_at": session[3],
            "reviews": reviews
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Review failed: {str(e)}"
        )
