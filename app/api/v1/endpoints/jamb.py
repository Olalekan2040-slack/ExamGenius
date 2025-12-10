"""
JAMB Questions Router
Provides endpoints to fetch questions from the pre-populated jamb_questions.db
"""

from fastapi import APIRouter, HTTPException, Query
from app.db.database import get_connection
from typing import List, Optional

router = APIRouter(prefix="/jamb", tags=["JAMB Questions"])


@router.get("/subjects")
def get_subjects():
    """Get all available JAMB subjects"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DISTINCT subject FROM questions WHERE exam='JAMB' ORDER BY subject"
        )
        subjects = [row[0] for row in cursor.fetchall()]
        return {"subjects": subjects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/years")
def get_years():
    """Get all available JAMB exam years (2020-2025)"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DISTINCT year FROM questions WHERE exam='JAMB' ORDER BY year DESC"
        )
        years = [row[0] for row in cursor.fetchall()]
        return {"years": years}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/topics")
def get_topics(subject: str):
    """Get all topics for a specific subject"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DISTINCT topic FROM questions WHERE exam='JAMB' AND subject=? ORDER BY topic",
            (subject,),
        )
        topics = [row[0] for row in cursor.fetchall()]
        return {"subject": subject, "topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/questions")
def get_questions(
    subject: str,
    year: Optional[int] = None,
    topic: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
):
    """
    Get JAMB questions filtered by subject, year, and/or topic

    Parameters:
    - subject: Subject name (required)
    - year: Exam year (optional, 2020-2025)
    - topic: Topic within subject (optional)
    - limit: Number of questions to return (default: 10, max: 100)
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Build query
        query = "SELECT id, number, question, topic, image_path, correct_option_key FROM questions WHERE exam='JAMB' AND subject=?"
        params = [subject]

        if year:
            query += " AND year=?"
            params.append(year)

        if topic:
            query += " AND topic=?"
            params.append(topic)

        query += f" LIMIT {limit}"

        cursor.execute(query, params)
        questions = cursor.fetchall()

        # Convert to list of dicts
        result = []
        for q in questions:
            result.append(
                {
                    "id": q[0],
                    "number": q[1],
                    "question": q[2],
                    "topic": q[3],
                    "image_path": q[4],
                    "correct_option_key": q[5],
                }
            )

        return {"subject": subject, "year": year, "topic": topic, "questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/questions/{question_id}")
def get_question_detail(question_id: str):
    """
    Get detailed question with all options

    Parameters:
    - question_id: Question ID (e.g., 'JAMB_Accounting_2020_1')
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get question details
        cursor.execute(
            "SELECT id, number, question, topic, subject, year, image_path, correct_option_key FROM questions WHERE id=?",
            (question_id,),
        )
        q = cursor.fetchone()

        if not q:
            conn.close()
            raise HTTPException(status_code=404, detail="Question not found")

        # Get options
        cursor.execute(
            "SELECT option_key, option_text, is_correct FROM options WHERE question_id=? ORDER BY option_key",
            (question_id,),
        )
        options = [
            {"key": opt[0], "text": opt[1], "is_correct": bool(opt[2])}
            for opt in cursor.fetchall()
        ]

        return {
            "id": q[0],
            "number": q[1],
            "question": q[2],
            "topic": q[3],
            "subject": q[4],
            "year": q[5],
            "image_path": q[6],
            "correct_option_key": q[7],
            "options": options,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
