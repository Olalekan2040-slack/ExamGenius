"""
Guided Learning API Router
Handles objective-by-objective learning flow with AI explanations
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Union
from datetime import datetime
import json
import os
from pathlib import Path
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.analytics import AnalyticsService
from app.services.ai.guided_learning_ai import (
    generate_objective_explanation,
    explain_question_answer,
    get_related_questions,
    generate_subtopic_quiz
)

router = APIRouter(prefix="/guided-learn", tags=["Guided Learning"])


# ============================================================
# PYDANTIC MODELS
# ============================================================

class AskQuestionRequest(BaseModel):
    subject: str
    topic: str
    subtopic: str
    objective: str
    explanation_context: str
    question: str


class AnswerObjectiveQuestionRequest(BaseModel):
    subject: str
    topic: str
    subtopic: str
    objective: str
    question_id: Union[int, str]  # str for AI-generated questions (e.g. "ai_0")
    user_answer: str


class SaveProgressRequest(BaseModel):
    subject: str
    topic: str
    subtopic_index: int
    objective_index: int
    status: str  # 'started', 'completed'
    answered_correctly: Optional[bool] = None
    time_spent_seconds: int = 0


class ReExplainRequest(BaseModel):
    subject: str
    topic: str
    subtopic: str
    objective: str


# ============================================================
# SYLLABUS STRUCTURE ENDPOINTS
# ============================================================

def load_syllabus_json(subject: str) -> Optional[Dict]:
    """Load parsed syllabus JSON for a subject"""
    base_dir = Path(__file__).parent.parent.parent.parent.parent

    # Map subject names to filenames - case insensitive
    subject_lower = subject.lower().strip()

    subject_map = {
        'physics': 'physics_syllabus.json',
        'mathematics': 'mathematics_syllabus.json',
        'maths': 'mathematics_syllabus.json',
        'english': 'english_language_syllabus.json',
        'english language': 'english_language_syllabus.json',
        'biology': 'biology_syllabus.json',
        'chemistry': 'chemistry_syllabus.json',
        'economics': 'economics_syllabus.json',
        'government': 'government_syllabus.json',
        'literature': 'literature_in_english_syllabus.json',
        'literature in english': 'literature_in_english_syllabus.json',
        'commerce': 'commerce_syllabus.json',
        'accounting': 'accounting.json',
        'computer studies': 'computer_studies.json',
        'computer science': 'computer_studies.json',
        'geography': 'geography_syllabus.json',
        'history': 'history_syllabus.json',
        'french': 'french_syllabus.json',
        'arabic': 'arabic_syllabus.json',
        'hausa': 'hausa_syllabus.json',
        'music': 'music_syllabus.json',
        'agricultural science': 'agricultural_science_syllabus.json',
        'agric': 'agricultural_science_syllabus.json',
        'christian religious knowledge': 'christian_religious_knowledge_crk_syllabus.json',
        'crk': 'christian_religious_knowledge_crk_syllabus.json',
        'islamic religious knowledge': 'islamic_religious_knowledge_irk_syllabus.json',
        'irk': 'islamic_religious_knowledge_irk_syllabus.json',
    }

    filename = subject_map.get(subject_lower)
    if not filename:
        return None

    filepath = base_dir / 'syllabus' / 'parsed' / filename
    if not filepath.exists():
        return None

    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.get("/subjects")
async def get_available_subjects():
    """Get list of subjects with parsed syllabus"""
    base_dir = Path(__file__).parent.parent.parent.parent.parent
    parsed_dir = base_dir / 'syllabus' / 'parsed'

    subjects = []
    if parsed_dir.exists():
        for f in parsed_dir.glob('*.json'):
            with open(f, 'r', encoding='utf-8') as file:
                data = json.load(file)
                subjects.append({
                    'name': data.get('subject', f.stem),
                    'topic_count': len(data.get('topics', []))
                })

    return {"subjects": subjects}


@router.get("/topics/{subject}")
async def get_subject_topics(subject: str, user_id: int = Depends(current_user_id)):
    """Get all topics for a subject with progress info"""
    syllabus = load_syllabus_json(subject)
    if not syllabus:
        raise HTTPException(
            status_code=404, detail=f"Syllabus not found for {subject}")

    conn = get_connection()
    cursor = conn.cursor()

    topics = []
    for topic in syllabus.get('topics', []):
        topic_name = topic.get('name', '')
        subtopics = topic.get('subtopics', [])

        # Count total objectives
        total_objectives = sum(len(st.get('objectives', []))
                               for st in subtopics)

        # Get user's progress for this topic
        cursor.execute("""
            SELECT COUNT(*) as completed,
                   SUM(CASE WHEN is_weakness THEN 1 ELSE 0 END) as weaknesses
            FROM learning_progress
            WHERE user_id = ? AND subject = ? AND topic_name = ? AND status = 'completed'
        """, (user_id, subject, topic_name))

        row = cursor.fetchone()
        completed = row[0] if row else 0
        weaknesses = row[1] if row else 0

        # Calculate progress percent and cap at 100% to handle cases where
        # static content has more objectives than the syllabus JSON
        progress = (completed / total_objectives *
                    100) if total_objectives > 0 else 0
        progress_percent = min(round(progress, 1), 100.0)

        topics.append({
            'number': topic.get('number'),
            'name': topic_name,
            'subtopic_count': len(subtopics),
            'objective_count': total_objectives,
            'completed_objectives': completed,
            'weakness_count': weaknesses,
            'progress_percent': progress_percent
        })

    return {
        "subject": subject,
        "topics": topics
    }


@router.get("/topic/{subject}/{topic_name}")
async def get_topic_structure(
    subject: str,
    topic_name: str,
    user_id: int = Depends(current_user_id)
):
    """Get full topic structure with subtopics and objectives"""
    syllabus = load_syllabus_json(subject)
    if not syllabus:
        raise HTTPException(
            status_code=404, detail=f"Syllabus not found for {subject}")

    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break

    if not topic_data:
        raise HTTPException(
            status_code=404, detail=f"Topic '{topic_name}' not found")

    conn = get_connection()
    cursor = conn.cursor()

    # Build structure with progress
    subtopics = []
    for st_idx, subtopic in enumerate(topic_data.get('subtopics', [])):
        objectives = []
        for obj_idx, obj in enumerate(subtopic.get('objectives', [])):
            # Check progress
            cursor.execute("""
                SELECT status, answered_correctly, is_weakness
                FROM learning_progress
                WHERE user_id = ? AND subject = ? AND topic_name = ? 
                      AND subtopic_index = ? AND objective_index = ?
            """, (user_id, subject, topic_name, st_idx, obj_idx))

            row = cursor.fetchone()

            objectives.append({
                'index': obj_idx,
                'text': obj,
                'status': row[0] if row else 'not_started',
                'answered_correctly': row[1] if row else None,
                'is_weakness': row[2] if row else False
            })

        subtopics.append({
            'index': st_idx,
            'name': subtopic.get('name', ''),
            'objectives': objectives,
            'completed_count': sum(1 for o in objectives if o['status'] == 'completed')
        })

    return {
        "subject": subject,
        "topic": {
            "number": topic_data.get('number'),
            "name": topic_data.get('name'),
            "subtopics": subtopics
        }
    }


# ============================================================
# LEARNING FLOW ENDPOINTS
# ============================================================

@router.get("/objective/{subject}/{topic_name}/{subtopic_index}/{objective_index}")
async def get_objective_content(
    subject: str,
    topic_name: str,
    subtopic_index: int,
    objective_index: int,
    user_id: int = Depends(current_user_id)
):
    """
    Get complete content for a single objective:
    - AI explanation (cached if available)
    - Related past questions
    - Progress status
    """
    syllabus = load_syllabus_json(subject)
    if not syllabus:
        raise HTTPException(
            status_code=404, detail=f"Syllabus not found for {subject}")

    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break

    if not topic_data:
        raise HTTPException(
            status_code=404, detail=f"Topic '{topic_name}' not found")

    subtopics = topic_data.get('subtopics', [])
    if subtopic_index >= len(subtopics):
        raise HTTPException(status_code=404, detail="Subtopic not found")

    subtopic = subtopics[subtopic_index]
    objectives = subtopic.get('objectives', [])

    if objective_index >= len(objectives):
        raise HTTPException(status_code=404, detail="Objective not found")

    objective_text = objectives[objective_index]
    subtopic_name = subtopic.get('name', topic_name)

    conn = get_connection()
    cursor = conn.cursor()

    # Check for cached explanation
    cursor.execute("""
        SELECT explanation, diagram_url
        FROM objective_explanations
        WHERE subject = ? AND topic_name = ? AND subtopic_name = ? AND objective_text = ?
    """, (subject, topic_name, subtopic_name, objective_text))

    cached = cursor.fetchone()

    if cached:
        explanation_data = {
            "explanation": cached[0],
            "diagram_url": cached[1],
            "cached": True
        }
    else:
        # Generate new explanation
        try:
            ai_response = generate_objective_explanation(
                subject, topic_name, subtopic_name, objective_text
            )

            # Cache it
            cursor.execute("""
                INSERT INTO objective_explanations 
                (subject, topic_name, subtopic_name, objective_text, explanation, diagram_url)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT (subject, topic_name, subtopic_name, objective_text)
                DO UPDATE SET explanation = EXCLUDED.explanation, updated_at = CURRENT_TIMESTAMP
            """, (
                subject, topic_name, subtopic_name, objective_text,
                json.dumps(ai_response),
                ai_response.get('diagram_description')
            ))
            conn.commit()

            explanation_data = {
                **ai_response,
                "cached": False
            }
        except Exception as e:
            explanation_data = {
                "explanation": f"Could not generate explanation: {str(e)}",
                "cached": False,
                "error": True
            }

    # Get related questions
    questions = get_related_questions(
        cursor, subject, topic_name, subtopic_name, objective_text, limit=2)

    # Get/update user progress
    cursor.execute("""
        SELECT status, answered_correctly, is_weakness
        FROM learning_progress
        WHERE user_id = ? AND subject = ? AND topic_name = ? 
              AND subtopic_index = ? AND objective_index = ?
    """, (user_id, subject, topic_name, subtopic_index, objective_index))

    progress_row = cursor.fetchone()

    if not progress_row:
        # Mark as started
        cursor.execute("""
            INSERT INTO learning_progress 
            (user_id, subject, topic_name, subtopic_index, objective_index, status, started_at)
            VALUES (?, ?, ?, ?, ?, 'in_progress', ?)
        """, (user_id, subject, topic_name, subtopic_index, objective_index, datetime.utcnow()))
        conn.commit()
        progress = {'status': 'in_progress',
                    'answered_correctly': None, 'is_weakness': False}
    else:
        progress = {
            'status': progress_row[0],
            'answered_correctly': progress_row[1],
            'is_weakness': progress_row[2]
        }

    # Calculate navigation info
    total_objectives = sum(len(st.get('objectives', [])) for st in subtopics)
    current_position = sum(len(subtopics[i].get('objectives', [])) for i in range(
        subtopic_index)) + objective_index + 1

    # Determine next/prev
    has_next = not (subtopic_index == len(subtopics) -
                    1 and objective_index == len(objectives) - 1)
    has_prev = not (subtopic_index == 0 and objective_index == 0)

    # Calculate next indices
    next_subtopic = subtopic_index
    next_objective = objective_index + 1
    subtopic_complete = False

    if next_objective >= len(objectives):
        subtopic_complete = True
        next_subtopic = subtopic_index + 1
        next_objective = 0

    return {
        "subject": subject,
        "topic_name": topic_name,
        "subtopic_name": subtopic_name,
        "subtopic_index": subtopic_index,
        "objective_index": objective_index,
        "objective_text": objective_text,
        "explanation": explanation_data,
        "questions": questions,
        "progress": progress,
        "navigation": {
            "current_position": current_position,
            "total_objectives": total_objectives,
            "has_next": has_next,
            "has_prev": has_prev,
            "next_subtopic_index": next_subtopic if has_next else None,
            "next_objective_index": next_objective if has_next else None,
            "subtopic_complete": subtopic_complete
        }
    }


# ============================================================
# RE-EXPLAIN AND SUBTOPIC QUIZ ENDPOINTS
# ============================================================

@router.get("/subtopic-quiz/{subject}/{topic_name}/{subtopic_index}")
async def get_subtopic_quiz(
    subject: str,
    topic_name: str,
    subtopic_index: int,
    limit: int = Query(default=5, ge=3, le=10),
    user_id: int = Depends(current_user_id)
):
    """
    Get a quiz for a completed subtopic.
    Returns 3-5 questions (JAMB past questions + AI-generated if needed).
    """
    syllabus = load_syllabus_json(subject)
    if not syllabus:
        raise HTTPException(
            status_code=404, detail=f"Syllabus not found for {subject}")

    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break

    if not topic_data:
        raise HTTPException(
            status_code=404, detail=f"Topic '{topic_name}' not found")

    subtopics = topic_data.get('subtopics', [])
    if subtopic_index >= len(subtopics):
        raise HTTPException(status_code=404, detail="Subtopic not found")

    subtopic = subtopics[subtopic_index]
    subtopic_name = subtopic.get('name', topic_name)
    objectives = subtopic.get('objectives', [])

    conn = get_connection()
    cursor = conn.cursor()

    try:
        questions = generate_subtopic_quiz(
            cursor, subject, topic_name, subtopic_name, objectives, limit=limit
        )

        return {
            "subject": subject,
            "topic_name": topic_name,
            "subtopic_name": subtopic_name,
            "subtopic_index": subtopic_index,
            "questions": questions,
            "total_questions": len(questions)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate subtopic quiz: {str(e)}"
        )


@router.post("/answer-question")
async def answer_objective_question(
    request: AnswerObjectiveQuestionRequest,
    user_id: int = Depends(current_user_id)
):
    """Check answer and provide explanation"""
    conn = get_connection()
    cursor = conn.cursor()

    # AI-generated questions have string IDs like "ai_0" — not in DB
    if isinstance(request.question_id, str) and str(request.question_id).startswith("ai_"):
        is_correct = request.user_answer.upper() == (request.user_answer.upper())  # can't verify
        return {
            "is_correct": None,
            "correct_answer": None,
            "user_answer": request.user_answer,
            "explanation": "This was a practice question. Keep studying!"
        }

    # Get the question
    cursor.execute("""
        SELECT q.question, q.correct_option_key
        FROM questions q
        WHERE q.id = ?
    """, (request.question_id,))

    q_row = cursor.fetchone()
    if not q_row:
        raise HTTPException(status_code=404, detail="Question not found")

    question_text = q_row[0]
    correct_answer = q_row[1]

    # Get options
    cursor.execute("""
        SELECT option_key, option_text
        FROM options
        WHERE question_id = ?
        ORDER BY option_key
    """, (request.question_id,))

    options = {row[0]: row[1] for row in cursor.fetchall()}

    is_correct = request.user_answer == correct_answer

    # Generate explanation
    try:
        explanation = explain_question_answer(
            question_text,
            options,
            correct_answer,
            request.user_answer,
            request.objective
        )
    except Exception:
        explanation = f"The correct answer is {correct_answer}." + (
            " Well done!" if is_correct else f" You selected {request.user_answer}."
        )

    return {
        "is_correct": is_correct,
        "correct_answer": correct_answer,
        "user_answer": request.user_answer,
        "explanation": explanation
    }


@router.post("/save-progress")
async def save_learning_progress(
    request: SaveProgressRequest,
    user_id: int = Depends(current_user_id)
):
    """Save user's progress on an objective"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        is_weakness = request.answered_correctly == False

        # Check if this objective was already completed (to avoid duplicate points)
        cursor.execute("""
            SELECT status FROM learning_progress
            WHERE user_id = ? AND subject = ? AND topic_name = ? 
            AND subtopic_index = ? AND objective_index = ?
        """, (user_id, request.subject, request.topic, request.subtopic_index, request.objective_index))

        existing = cursor.fetchone()
        was_already_completed = existing and existing[0] == 'completed'

        cursor.execute("""
            INSERT INTO learning_progress 
            (user_id, subject, topic_name, subtopic_index, objective_index, 
             status, question_answered, answered_correctly, is_weakness, 
             completed_at, time_spent_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (user_id, subject, topic_name, subtopic_index, objective_index)
            DO UPDATE SET 
                status = EXCLUDED.status,
                question_answered = COALESCE(EXCLUDED.question_answered, learning_progress.question_answered),
                answered_correctly = COALESCE(EXCLUDED.answered_correctly, learning_progress.answered_correctly),
                is_weakness = EXCLUDED.is_weakness,
                completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN CURRENT_TIMESTAMP ELSE learning_progress.completed_at END,
                time_spent_seconds = learning_progress.time_spent_seconds + EXCLUDED.time_spent_seconds
        """, (
            user_id, request.subject, request.topic, request.subtopic_index,
            request.objective_index, request.status,
            request.answered_correctly is not None, request.answered_correctly,
            is_weakness, datetime.utcnow() if request.status == 'completed' else None,
            request.time_spent_seconds
        ))

        # Award points if objective completed correctly and not already completed
        points_awarded = 0
        if request.status == 'completed' and not was_already_completed:
            if request.answered_correctly:
                points_awarded = 10  # 10 points for correct answer
            else:
                points_awarded = 5   # 5 points for completing even if incorrect

            # Insert gamification event
            cursor.execute("""
                INSERT INTO gamification_events 
                (user_id, event_type, points, subject, topic, subtopic, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                'objective_complete',
                points_awarded,
                request.subject,
                request.topic,
                None,
                f"Completed objective {request.objective_index + 1} in {request.topic}"
            ))

            # Update total points in user_profiles
            cursor.execute("""
                UPDATE user_profiles 
                SET learning_points = COALESCE(learning_points, 0) + ?
                WHERE user_id = ?
            """, (points_awarded, user_id))

        # ── Update streak whenever the user completes an objective ────────
        if request.status == 'completed':
            try:
                AnalyticsService.update_user_streak(cursor, user_id)
            except Exception:
                pass  # non-critical

        # ── Update user_stats so guided-learning answers feed dashboard
        #    strengths / weaknesses / recent-topics analytics ──────────
        if request.status == 'completed' and request.answered_correctly is not None:
            correct_int = 1 if request.answered_correctly else 0
            cursor.execute("""
                INSERT INTO user_stats
                    (user_id, subject, topic, total_attempts, correct_attempts, accuracy, last_practiced)
                VALUES (?, ?, ?, 1, ?, ?, ?)
                ON CONFLICT(user_id, subject, topic) DO UPDATE SET
                    total_attempts   = user_stats.total_attempts + 1,
                    correct_attempts = user_stats.correct_attempts + ?,
                    accuracy         = (CAST(user_stats.correct_attempts + ? AS REAL) /
                                        CAST(user_stats.total_attempts + 1 AS REAL)) * 100,
                    last_practiced   = ?
            """, (
                user_id, request.subject, request.topic,
                correct_int,
                100.0 if request.answered_correctly else 0.0,
                datetime.utcnow().isoformat(),
                correct_int, correct_int,
                datetime.utcnow().isoformat(),
            ))

        conn.commit()

        return {
            "success": True,
            "points_awarded": points_awarded
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/progress/{subject}/{topic_name}")
async def get_topic_progress(
    subject: str,
    topic_name: str,
    user_id: int = Depends(current_user_id)
):
    """Get user's current progress in a topic"""
    conn = get_connection()
    cursor = conn.cursor()

    # Get last position
    cursor.execute("""
        SELECT subtopic_index, objective_index, status
        FROM learning_progress
        WHERE user_id = ? AND subject = ? AND topic_name = ?
        ORDER BY subtopic_index DESC, objective_index DESC
        LIMIT 1
    """, (user_id, subject, topic_name))

    last = cursor.fetchone()

    # Get completion stats
    cursor.execute("""
        SELECT 
            COUNT(*) as total_started,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN is_weakness THEN 1 ELSE 0 END) as weaknesses,
            SUM(time_spent_seconds) as total_time
        FROM learning_progress
        WHERE user_id = ? AND subject = ? AND topic_name = ?
    """, (user_id, subject, topic_name))

    stats = cursor.fetchone()

    return {
        "subject": subject,
        "topic_name": topic_name,
        "last_position": {
            "subtopic_index": last[0] if last else 0,
            "objective_index": last[1] if last else 0,
            "status": last[2] if last else 'not_started'
        },
        "stats": {
            "started": stats[0] if stats else 0,
            "completed": stats[1] if stats else 0,
            "weaknesses": stats[2] if stats else 0,
            "time_spent_seconds": stats[3] if stats else 0
        }
    }


@router.get("/weaknesses/{subject}")
async def get_subject_weaknesses(
    subject: str,
    user_id: int = Depends(current_user_id)
):
    """Get all weakness objectives for focused practice"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT topic_name, subtopic_index, objective_index
        FROM learning_progress
        WHERE user_id = ? AND subject = ? AND is_weakness = TRUE
        ORDER BY topic_name, subtopic_index, objective_index
    """, (user_id, subject))

    weaknesses = []
    syllabus = load_syllabus_json(subject)

    for row in cursor.fetchall():
        topic_name = row[0]
        st_idx = row[1]
        obj_idx = row[2]

        # Find objective text from syllabus
        obj_text = ""
        if syllabus:
            for t in syllabus.get('topics', []):
                if t.get('name', '').lower() == topic_name.lower():
                    subtopics = t.get('subtopics', [])
                    if st_idx < len(subtopics):
                        objectives = subtopics[st_idx].get('objectives', [])
                        if obj_idx < len(objectives):
                            obj_text = objectives[obj_idx]
                    break

        weaknesses.append({
            "topic": topic_name,
            "subtopic_index": st_idx,
            "objective_index": obj_idx,
            "objective_text": obj_text
        })

    return {
        "subject": subject,
        "weakness_count": len(weaknesses),
        "weaknesses": weaknesses
    }


# ============================================================
# TOPIC PRACTICE QUIZ ENDPOINT
# ============================================================

# Minimum questions threshold for practice — supplement from fallback topics if below this
_MIN_PRACTICE_QUESTIONS = 20

# Fallback topic pairs: if a topic has fewer than _MIN_PRACTICE_QUESTIONS questions,
# supplement from these related topics (tried in order until threshold is met).
_TOPIC_FALLBACKS = {
    # Physics fallbacks
    "Measurements and Units": ["Scalars and Vectors", "Motion"],
    "Scalars and Vectors": ["Measurements and Units", "Motion"],
    "Friction": ["Equilibrium of Forces", "Work, Energy, and Power"],
    "Simple Machines": ["Work, Energy, and Power", "Friction"],
    "Elasticity": ["Pressure", "Liquids at Rest"],
    "Liquids at Rest": ["Pressure", "Elasticity"],
    "Light Energy": ["Reflection of Light", "Refraction of Light"],
    "Dispersion of Light and Colours": ["Refraction of Light", "Reflection of Light"],
    "Magnetism": ["Electromagnetic Induction", "Current Electricity"],
    "Electromagnetic Induction": ["Magnetism", "Current Electricity"],
    "Alternating Current (A.C.) Circuits": ["Current Electricity", "Electromagnetic Induction"],
    "Modern Physics": ["Atomic and Nuclear Physics"],
    "Gas Laws": ["Quantity of Heat", "Temperature and Thermometers"],
    "Thermal Expansion": ["Temperature and Thermometers", "Quantity of Heat"],
    "Temperature and Thermometers": ["Thermal Expansion", "Quantity of Heat"],
    "Heat Transfer": ["Quantity of Heat", "Temperature and Thermometers"],
    "Refraction of Light": ["Reflection of Light", "Light Energy"],
    "Equilibrium of Forces": ["Motion", "Work, Energy, and Power"],
    # Chemistry fallbacks
    "Environmental Pollution": ["Air, Water, Solubility"],
    "Rates of Chemical Reaction": ["Chemical Equilibrium", "Energy Changes"],
    "Chemistry and Industry": ["Non-metals and Their Compounds", "Metals and Their Compounds"],
    # Biology fallbacks
    "Growth": ["Reproduction", "Living Organisms"],
    "Internal Structure of a Flowering Plant": ["Nutrition", "Transport"],
    "Excretion": ["Nutrition", "Transport"],
    "Support and Movement": ["Respiration", "Excretion"],
    "Evolution and Advancement of Organisms": ["Variety of Organisms", "Genetics and Variation"],
    "Co-ordination and Control": ["Genetics and Variation", "Reproduction"],
    # Government fallbacks
    "Pre-colonial Polities": ["Basic Concepts in Government", "Structures of Governance"],
    "Imperialist Penetration": ["Process of Decolonization", "Constitutional Development in Nigeria"],
    "Process of Decolonization": ["Constitutional Development in Nigeria", "Imperialist Penetration"],
    "Constitutional Development in Nigeria": ["Post-Independence Constitutions"],
    "Public Commissions in Nigeria": [
        "Institutions of Government in Post-Independence Nigeria",
        "Political Parties in Post-Independence Nigeria",
    ],
    "Political Parties in Post-Independence Nigeria": [
        "Political Parties and Party Systems",
        "Structure and Workings of Nigerian Federalism",
    ],
    "The Military in Nigerian Politics": [
        "Political Parties in Post-Independence Nigeria",
        "Post-Independence Constitutions",
    ],
    "Foreign Policy": ["Nigeria's Foreign Policy", "Relations with African Countries"],
    "Relations with African Countries": ["Nigeria's Foreign Policy", "International Organizations"],
    "International Organizations": ["Nigeria's Foreign Policy", "Relations with African Countries"],
    "Public Corporations and Parastatals": ["The Civil Service", "Local Government"],
    "Processes of Legislation": ["Arms of Government", "Principles of Democratic Government"],
    "Public Opinion": ["Pressure Groups", "Political Parties and Party Systems"],
    # English fallbacks
    "Comprehension & Summary": ["Grammar & Usage", "Vocabulary"],
    "Vocabulary": ["Grammar & Usage", "Comprehension & Summary"],
    "Grammar & Usage": ["Vocabulary", "Comprehension & Summary"],
    "Oral English": ["Vocabulary", "Grammar & Usage"],
    "Literature (The Life Changer)": ["Comprehension & Summary"],
}


def _fetch_questions_for_topic(cursor, subject: str, topic: str, limit: int, exclude_ids: set = None):
    """Fetch questions for a topic using exact → partial → keyword cascade."""
    exclude_ids = exclude_ids or set()

    def _filter(rows):
        return [r for r in rows if r[0] not in exclude_ids]

    # 1. Exact match
    cursor.execute("""
        SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
        FROM questions
        WHERE exam='JAMB' AND subject=? AND topic=?
        ORDER BY RANDOM()
        LIMIT ?
    """, (subject, topic, limit))
    rows = _filter(cursor.fetchall())
    if rows:
        return rows

    # 2. Partial LIKE match
    cursor.execute("""
        SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
        FROM questions
        WHERE exam='JAMB' AND subject=? AND topic LIKE ?
        ORDER BY RANDOM()
        LIMIT ?
    """, (subject, f"%{topic}%", limit))
    rows = _filter(cursor.fetchall())
    if rows:
        return rows

    # 3. First meaningful keyword match
    words = [w for w in topic.split() if len(w) > 3][:3]
    if words:
        cursor.execute("""
            SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
            FROM questions
            WHERE exam='JAMB' AND subject=? AND topic LIKE ?
            ORDER BY RANDOM()
            LIMIT ?
        """, (subject, f"%{words[0]}%", limit))
        rows = _filter(cursor.fetchall())
        if rows:
            return rows

    return []


@router.get("/questions/by-topic")
async def get_questions_by_topic(
    subject: str,
    topic: str,
    limit: int = Query(10, ge=1, le=50),
    user_id: int = Depends(current_user_id)
):
    """
    Get randomized JAMB questions for a specific topic with all options.
    Used for practice quizzes after completing guided learning.
    If a topic has fewer than the minimum threshold, supplements with
    questions from related fallback topics.
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        questions = _fetch_questions_for_topic(cursor, subject, topic, limit)

        # Supplement with fallback topics when below threshold
        if len(questions) < _MIN_PRACTICE_QUESTIONS:
            seen_ids = {q[0] for q in questions}
            fallback_topics = _TOPIC_FALLBACKS.get(topic, [])
            for fb_topic in fallback_topics:
                if len(questions) >= _MIN_PRACTICE_QUESTIONS:
                    break
                needed = _MIN_PRACTICE_QUESTIONS - len(questions)
                extra = _fetch_questions_for_topic(cursor, subject, fb_topic, needed, seen_ids)
                questions.extend(extra)
                seen_ids.update(q[0] for q in extra)

        # Trim to requested limit if we now have more
        questions = questions[:limit]

        result = []
        for q in questions:
            question_id = q[0]

            # Get options for this question
            cursor.execute("""
                SELECT option_key, option_text
                FROM options
                WHERE question_id=?
                ORDER BY option_key
            """, (question_id,))
            options_rows = cursor.fetchall()

            options = {}
            for opt in options_rows:
                options[opt[0]] = opt[1]

            result.append({
                "id": question_id,
                "question_text": q[1],
                "topic": q[2],
                "subject": q[3],
                "year": q[4],
                "image_path": q[5],
                "correct_option_key": q[6],
                "explanation": q[7] if len(q) > 7 else None,
                "options": options
            })

        return {
            "subject": subject,
            "topic": topic,
            "count": len(result),
            "questions": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# ============================================================
# GAMIFICATION POINTS ENDPOINTS
# ============================================================

class AwardPointsRequest(BaseModel):
    subject: str
    topic: str
    subtopic: Optional[str] = None
    # 'objective_complete', 'subtopic_complete', 'topic_complete', 'correct_answer'
    event_type: str
    points: int
    description: Optional[str] = None


@router.post("/award-points")
async def award_learning_points(
    request: AwardPointsRequest,
    user_id: int = Depends(current_user_id)
):
    """Award points for learning achievements"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Insert gamification event
        cursor.execute("""
            INSERT INTO gamification_events 
            (user_id, event_type, points, subject, topic, subtopic, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, request.event_type, request.points,
            request.subject, request.topic, request.subtopic,
            request.description
        ))

        # Update total points in user_profiles
        cursor.execute("""
            UPDATE user_profiles 
            SET learning_points = COALESCE(learning_points, 0) + ?
            WHERE user_id = ?
        """, (request.points, user_id))

        # Get updated total points
        cursor.execute("""
            SELECT learning_points FROM user_profiles WHERE user_id = ?
        """, (user_id,))
        result = cursor.fetchone()
        total_points = result[0] if result else request.points

        conn.commit()

        return {
            "success": True,
            "points_awarded": request.points,
            "total_points": total_points,
            "event_type": request.event_type
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/points")
async def get_user_points(
    user_id: int = Depends(current_user_id)
):
    """Get user's total learning points and recent achievements"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get total points
        cursor.execute("""
            SELECT COALESCE(learning_points, 0) FROM user_profiles WHERE user_id = ?
        """, (user_id,))
        result = cursor.fetchone()
        total_points = result[0] if result else 0

        # Get points breakdown by event type
        cursor.execute("""
            SELECT event_type, SUM(points) as total, COUNT(*) as count
            FROM gamification_events
            WHERE user_id = ?
            GROUP BY event_type
        """, (user_id,))
        breakdown = cursor.fetchall()

        points_breakdown = {}
        for row in breakdown:
            points_breakdown[row[0]] = {
                "points": row[1],
                "count": row[2]
            }

        # Get recent achievements (last 10)
        cursor.execute("""
            SELECT event_type, points, subject, topic, description, created_at
            FROM gamification_events
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 10
        """, (user_id,))
        recent = cursor.fetchall()

        recent_achievements = []
        for row in recent:
            recent_achievements.append({
                "event_type": row[0],
                "points": row[1],
                "subject": row[2],
                "topic": row[3],
                "description": row[4],
                "timestamp": row[5].isoformat() if row[5] else None
            })

        # Calculate level based on points
        level = 1
        if total_points >= 5000:
            level = 10
        elif total_points >= 3000:
            level = 8
        elif total_points >= 2000:
            level = 6
        elif total_points >= 1000:
            level = 5
        elif total_points >= 500:
            level = 4
        elif total_points >= 250:
            level = 3
        elif total_points >= 100:
            level = 2

        level_names = {
            1: "Beginner",
            2: "Learner",
            3: "Student",
            4: "Scholar",
            5: "Expert",
            6: "Master",
            8: "Genius",
            10: "Legend"
        }

        return {
            "total_points": total_points,
            "level": level,
            "level_name": level_names.get(level, "Beginner"),
            "breakdown": points_breakdown,
            "recent_achievements": recent_achievements
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = Query(default=10, le=50),
    user_id: int = Depends(current_user_id)
):
    """Get top learners by points"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get top users by points
        cursor.execute("""
            SELECT u.id, u.name, COALESCE(p.learning_points, 0) as points
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            ORDER BY COALESCE(p.learning_points, 0) DESC
            LIMIT ?
        """, (limit,))

        leaders = cursor.fetchall()

        leaderboard = []
        for idx, row in enumerate(leaders):
            leaderboard.append({
                "rank": idx + 1,
                "user_id": row[0],
                "name": row[1],
                "points": row[2],
                "is_current_user": row[0] == user_id
            })

        # Get current user's rank
        cursor.execute("""
            SELECT COUNT(*) + 1 as rank
            FROM profiles 
            WHERE COALESCE(learning_points, 0) > (
                SELECT COALESCE(learning_points, 0) FROM profiles WHERE user_id = ?
            )
        """, (user_id,))
        rank_result = cursor.fetchone()
        user_rank = rank_result[0] if rank_result else 0

        return {
            "leaderboard": leaderboard,
            "current_user_rank": user_rank
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# ============================================================
# PAST JAMB QUESTIONS BY SUBTOPIC
# ============================================================

@router.get("/questions/by-subtopic")
async def get_questions_by_subtopic(
    subject: str,
    topic: str,
    subtopic: str,
    limit: int = Query(5, ge=1, le=15),
    user_id: int = Depends(current_user_id)
):
    """
    Get real JAMB past questions for a specific subtopic.
    Used at the end of every subtopic in guided learning.
    Strategy: exact subtopic match → keyword match on question text → topic-level fallback.
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        seen_ids: set = set()
        result_rows = []

        # 1. Exact subtopic column match (substring — subtopic col has verbose format)
        subtopic_kw = subtopic.split("(")[0].strip()  # strip parenthetical details
        cursor.execute("""
            SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
            FROM questions
            WHERE exam='JAMB' AND subject=? AND topic=?
              AND subtopic ILIKE ?
            ORDER BY RANDOM()
            LIMIT ?
        """, (subject, topic, f"%{subtopic_kw}%", limit * 2))
        result_rows = [r for r in cursor.fetchall() if r[0] not in seen_ids]
        seen_ids.update(r[0] for r in result_rows)

        # 2. Keyword match on question text using subtopic words
        if len(result_rows) < limit:
            keywords = [w for w in subtopic.split() if len(w) > 4 and w.isalpha()][:5]
            for kw in keywords:
                if len(result_rows) >= limit:
                    break
                cursor.execute("""
                    SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
                    FROM questions
                    WHERE exam='JAMB' AND subject=? AND topic=?
                      AND LOWER(question) LIKE ?
                    ORDER BY RANDOM()
                    LIMIT ?
                """, (subject, topic, f"%{kw.lower()}%", limit))
                for r in cursor.fetchall():
                    if r[0] not in seen_ids:
                        result_rows.append(r)
                        seen_ids.add(r[0])

        # 3. Fallback: any question from the topic
        if len(result_rows) < limit:
            needed = limit - len(result_rows)
            cursor.execute("""
                SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
                FROM questions
                WHERE exam='JAMB' AND subject=? AND topic=?
                ORDER BY RANDOM()
                LIMIT ?
            """, (subject, topic, needed * 3))
            for r in cursor.fetchall():
                if r[0] not in seen_ids and len(result_rows) < limit:
                    result_rows.append(r)
                    seen_ids.add(r[0])

        # 4. Fallback topic from _TOPIC_FALLBACKS
        if len(result_rows) < 3:
            for fb_topic in _TOPIC_FALLBACKS.get(topic, []):
                if len(result_rows) >= limit:
                    break
                needed = limit - len(result_rows)
                rows = _fetch_questions_for_topic(cursor, subject, fb_topic, needed, seen_ids)
                result_rows.extend(rows)
                seen_ids.update(r[0] for r in rows)

        result_rows = result_rows[:limit]

        # Build response with options
        questions_out = []
        for q in result_rows:
            qid = q[0]
            cursor.execute("""
                SELECT option_key, option_text FROM options
                WHERE question_id=? ORDER BY option_key
            """, (qid,))
            options = {row[0]: row[1] for row in cursor.fetchall()}
            if not options:
                continue
            questions_out.append({
                "id": qid,
                "question_text": q[1],
                "topic": q[2],
                "subject": q[3],
                "year": q[4],
                "image_path": q[5],
                "correct_option_key": q[6],
                "explanation": q[7] if len(q) > 7 else None,
                "options": options
            })

        return {
            "subject": subject,
            "topic": topic,
            "subtopic": subtopic,
            "count": len(questions_out),
            "questions": questions_out
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
