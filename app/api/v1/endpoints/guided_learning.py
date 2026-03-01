"""
Guided Learning API Router
Handles objective-by-objective learning flow with AI explanations
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import json
import os
from pathlib import Path
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.analytics import AnalyticsService
from app.services.ai.guided_learning_ai import (
    generate_objective_explanation,
    answer_student_question,
    explain_question_answer,
    get_related_questions,
    generate_subtopic_quiz,
    regenerate_explanation
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
    question_id: int
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
        raise HTTPException(status_code=404, detail=f"Syllabus not found for {subject}")
    
    conn = get_connection()
    cursor = conn.cursor()
    
    topics = []
    for topic in syllabus.get('topics', []):
        topic_name = topic.get('name', '')
        subtopics = topic.get('subtopics', [])
        
        # Count total objectives
        total_objectives = sum(len(st.get('objectives', [])) for st in subtopics)
        
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
        progress = (completed / total_objectives * 100) if total_objectives > 0 else 0
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
        raise HTTPException(status_code=404, detail=f"Syllabus not found for {subject}")
    
    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break
    
    if not topic_data:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_name}' not found")
    
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
        raise HTTPException(status_code=404, detail=f"Syllabus not found for {subject}")
    
    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break
    
    if not topic_data:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_name}' not found")
    
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
    questions = get_related_questions(cursor, subject, topic_name, subtopic_name, objective_text, limit=2)
    
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
        progress = {'status': 'in_progress', 'answered_correctly': None, 'is_weakness': False}
    else:
        progress = {
            'status': progress_row[0],
            'answered_correctly': progress_row[1],
            'is_weakness': progress_row[2]
        }
    
    # Calculate navigation info
    total_objectives = sum(len(st.get('objectives', [])) for st in subtopics)
    current_position = sum(len(subtopics[i].get('objectives', [])) for i in range(subtopic_index)) + objective_index + 1
    
    # Determine next/prev
    has_next = not (subtopic_index == len(subtopics) - 1 and objective_index == len(objectives) - 1)
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

@router.post("/re-explain")
async def re_explain_objective(
    request: ReExplainRequest,
    user_id: int = Depends(current_user_id)
):
    """
    Generate a fresh explanation for an objective using a different teaching approach.
    Does NOT cache the result - always generates fresh content.
    """
    try:
        new_explanation = regenerate_explanation(
            request.subject,
            request.topic,
            request.subtopic,
            request.objective
        )
        
        return {
            "status": "success",
            "explanation": new_explanation,
            "is_regenerated": True
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate re-explanation: {str(e)}"
        )


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
        raise HTTPException(status_code=404, detail=f"Syllabus not found for {subject}")
    
    # Find the topic
    topic_data = None
    for t in syllabus.get('topics', []):
        if t.get('name', '').lower() == topic_name.lower():
            topic_data = t
            break
    
    if not topic_data:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_name}' not found")
    
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


@router.post("/ask-question")
async def ask_objective_question(
    request: AskQuestionRequest,
    user_id: int = Depends(current_user_id)
):
    """Handle student question about current objective"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check cache first
    cursor.execute("""
        SELECT answer FROM objective_qa_cache
        WHERE subject = ? AND topic_name = ? AND subtopic_name = ? 
              AND objective_text = ? AND LOWER(question) = LOWER(?)
    """, (request.subject, request.topic, request.subtopic, 
          request.objective, request.question))
    
    cached = cursor.fetchone()
    if cached:
        return {"response": cached[0], "cached": True}
    
    # Generate response
    try:
        response = answer_student_question(
            request.subject,
            request.topic,
            request.subtopic,
            request.objective,
            request.explanation_context,
            request.question
        )
        
        # Cache it
        cursor.execute("""
            INSERT INTO objective_qa_cache 
            (subject, topic_name, subtopic_name, objective_text, question, answer)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (request.subject, request.topic, request.subtopic,
              request.objective, request.question, response))
        conn.commit()
        
        return {"response": response, "cached": False}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/answer-question")
async def answer_objective_question(
    request: AnswerObjectiveQuestionRequest,
    user_id: int = Depends(current_user_id)
):
    """Check answer and provide explanation"""
    conn = get_connection()
    cursor = conn.cursor()
    
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
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Try to match topic name flexibly
        # First try exact match
        cursor.execute("""
            SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
            FROM questions 
            WHERE exam='JAMB' AND subject=? AND topic=?
            ORDER BY RANDOM()
            LIMIT ?
        """, (subject, topic, limit))
        
        questions = cursor.fetchall()
        
        # If no exact match, try partial match
        if not questions:
            cursor.execute("""
                SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
                FROM questions 
                WHERE exam='JAMB' AND subject=? AND topic LIKE ?
                ORDER BY RANDOM()
                LIMIT ?
            """, (subject, f"%{topic}%", limit))
            questions = cursor.fetchall()
        
        # If still no match, try matching key words from topic
        if not questions:
            # Extract key words (first 2-3 meaningful words)
            words = [w for w in topic.split() if len(w) > 3][:3]
            if words:
                like_pattern = f"%{words[0]}%"
                cursor.execute("""
                    SELECT id, question, topic, subject, year, image_path, correct_option_key, explanation
                    FROM questions 
                    WHERE exam='JAMB' AND subject=? AND topic LIKE ?
                    ORDER BY RANDOM()
                    LIMIT ?
                """, (subject, like_pattern, limit))
                questions = cursor.fetchall()
        
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
    event_type: str  # 'objective_complete', 'subtopic_complete', 'topic_complete', 'correct_answer'
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
