"""
Admin Content Management API Endpoints
Handles question management, learning materials, and content verification
"""
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, UploadFile, File, Query
from typing import Optional
import json
import csv
import io
from datetime import datetime

from app.core.security import current_user_id
from app.services.ai.email_service import send_role_change_email, send_ban_notification_email
from app.schemas.admin import (
    QuestionCreate, QuestionUpdate, QuestionResponse,
    LearningVideoCreate, LearningNoteCreate,
    ContentSubjectCreate, ContentTopicCreate,
    BulkUploadResponse
)
from app.db.database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

# Helper: Check admin role using DB + current user id
def require_admin(
    db = Depends(get_db),
    user_id: int = Depends(current_user_id)
):
    cur = db.cursor()
    cur.execute("SELECT id, role FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    role = row[1]
    if role not in ("admin", "moderator"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return {"id": row[0], "role": role}

# ============================================================================
# CONTENT HIERARCHY MANAGEMENT
# ============================================================================

@router.post("/subjects", response_model=dict, status_code=201)
async def create_subject(
    subject: ContentSubjectCreate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Create a new subject category"""
    query = """
        INSERT INTO content_subjects (name, icon, description, order_priority)
        VALUES (?, ?, ?, ?)
        RETURNING id
    """
    try:
        cursor = db.execute(query, (
            subject.name, subject.icon, subject.description, subject.order_priority
        ))
        result = cursor.fetchone()
        subject_id = result[0] if result else None
        db.commit()
        return {
            "id": subject_id,
            "name": subject.name,
            "message": "Subject created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subjects")
async def list_subjects(db = Depends(get_db)):
    """List all subjects"""
    query = """
        SELECT id, name, icon, description, order_priority, is_active
        FROM content_subjects
        WHERE is_active = 1
        ORDER BY order_priority
    """
    subjects = db.execute(query).fetchall()
    return [
        {
            "id": s[0], "name": s[1], "icon": s[2],
            "description": s[3], "order_priority": s[4]
        }
        for s in subjects
    ]

@router.post("/topics", response_model=dict, status_code=201)
async def create_topic(
    topic: ContentTopicCreate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Create a new topic under a subject"""
    query = """
        INSERT INTO content_topics (subject_id, name, description, order_priority)
        VALUES (?, ?, ?, ?)
        RETURNING id
    """
    try:
        cursor = db.execute(query, (
            topic.subject_id, topic.name, topic.description, topic.order_priority
        ))
        result = cursor.fetchone()
        topic_id = result[0] if result else None
        db.commit()
        return {
            "id": topic_id,
            "name": topic.name,
            "message": "Topic created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ============================================================================
# PAST QUESTIONS MANAGEMENT
# ============================================================================

@router.post("/questions", response_model=dict, status_code=201)
async def create_question(
    question: QuestionCreate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Create a single past question with options"""
    try:
        # Insert question
        q_query = """
            INSERT INTO past_questions 
            (question_text, subject_id, topic_id, subtopic_id, year, 
             exam_type, difficulty, explanation, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
        """
        cursor = db.execute(q_query, (
            question.question_text,
            question.subject_id,
            question.topic_id,
            question.subtopic_id,
            question.year,
            question.exam_type or "JAMB",
            question.difficulty,
            question.explanation,
            admin["id"]
        ))
        result = cursor.fetchone()
        question_id = result[0] if result else None
        
        # Insert options
        opt_query = """
            INSERT INTO question_options (question_id, option_key, option_text, is_correct)
            VALUES (?, ?, ?, ?)
        """
        for key, text in question.options.items():
            is_correct = 1 if key == question.correct_answer else 0
            db.execute(opt_query, (question_id, key, text, is_correct))
        
        db.commit()
        return {
            "id": question_id,
            "message": "Question created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/questions/{question_id}", response_model=dict)
async def get_question(
    question_id: int,
    db = Depends(get_db)
):
    """Get a specific question with all options"""
    q_query = """
        SELECT id, question_text, subject_id, topic_id, subtopic_id, 
               year, exam_type, difficulty, explanation, is_verified
        FROM past_questions WHERE id = ?
    """
    question = db.execute(q_query, (question_id,)).fetchone()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    opt_query = "SELECT option_key, option_text, is_correct FROM question_options WHERE question_id = ?"
    options = db.execute(opt_query, (question_id,)).fetchall()
    
    correct_answer = next((o[0] for o in options if o[2]), None)
    
    return {
        "id": question[0],
        "question_text": question[1],
        "subject_id": question[2],
        "topic_id": question[3],
        "subtopic_id": question[4],
        "year": question[5],
        "exam_type": question[6],
        "difficulty": question[7],
        "explanation": question[8],
        "is_verified": question[9],
        "options": {o[0]: o[1] for o in options},
        "correct_answer": correct_answer
    }

@router.put("/questions/{question_id}", response_model=dict)
async def update_question(
    question_id: int,
    question: QuestionUpdate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Update an existing question"""
    try:
        # Update question
        q_query = """
            UPDATE past_questions
            SET question_text=?, difficulty=?, explanation=?, updated_by=?, updated_at=CURRENT_TIMESTAMP
            WHERE id = ?
        """
        db.execute(q_query, (
            question.question_text,
            question.difficulty,
            question.explanation,
            admin["id"],
            question_id
        ))
        
        # Update options if provided
        if question.options:
            db.execute("DELETE FROM question_options WHERE question_id = ?", (question_id,))
            opt_query = """
                INSERT INTO question_options (question_id, option_key, option_text, is_correct)
                VALUES (?, ?, ?, ?)
            """
            for key, text in question.options.items():
                is_correct = 1 if key == question.correct_answer else 0
                db.execute(opt_query, (question_id, key, text, is_correct))
        
        db.commit()
        return {"message": "Question updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/questions/bulk-upload", response_model=dict)
async def bulk_upload_questions(
    file: UploadFile = File(...),
    subject_id: int = Query(...),
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Bulk upload questions via CSV file"""
    try:
        # Create bulk upload record
        upload_query = """
            INSERT INTO bulk_uploads (uploaded_by, content_type, file_name, status)
            VALUES (?, ?, ?, ?)
            RETURNING id
        """
        cursor = db.execute(upload_query, (admin["id"], 'questions', file.filename, 'processing'))
        result = cursor.fetchone()
        upload_id = result[0] if result else None
        
        # Parse CSV
        content = await file.read()
        stream = io.StringIO(content.decode('utf-8'))
        reader = csv.DictReader(stream)
        
        successful = 0
        failed = 0
        errors = []
        
        for idx, row in enumerate(reader, 1):
            try:
                # Insert question
                q_query = """
                    INSERT INTO past_questions 
                    (question_text, subject_id, topic_id, year, difficulty, explanation, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    RETURNING id
                """
                q_cursor = db.execute(q_query, (
                    row.get('question'),
                    subject_id,
                    row.get('topic_id'),
                    int(row.get('year', 0)),
                    row.get('difficulty', 'medium'),
                    row.get('explanation', ''),
                    admin["id"]
                ))
                result = q_cursor.fetchone()
                question_id = result[0] if result else None
                
                # Insert options (A, B, C, D)
                for opt_key in ['A', 'B', 'C', 'D']:
                    opt_text = row.get(f'option_{opt_key}')
                    if opt_text:
                        is_correct = 1 if opt_key == row.get('correct_answer') else 0
                        opt_query = """
                            INSERT INTO question_options (question_id, option_key, option_text, is_correct)
                            VALUES (?, ?, ?, ?)
                        """
                        db.execute(opt_query, (question_id, opt_key, opt_text, is_correct))
                
                successful += 1
            except Exception as e:
                failed += 1
                errors.append(f"Row {idx}: {str(e)}")
        
        # Update bulk upload record
        db.execute("""
            UPDATE bulk_uploads
            SET status='completed', successful_records=?, failed_records=?, error_log=?, completed_at=CURRENT_TIMESTAMP
            WHERE id=?
        """, (successful, failed, json.dumps(errors[:10]), upload_id))
        
        db.commit()
        
        return {
            "upload_id": upload_id,
            "total_records": idx,
            "successful": successful,
            "failed": failed,
            "message": f"Uploaded {successful} questions successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ============================================================================
# LEARNING MATERIALS MANAGEMENT
# ============================================================================

@router.post("/videos", response_model=dict, status_code=201)
async def create_video(
    video: LearningVideoCreate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Create a learning video"""
    query = """
        INSERT INTO learning_videos 
        (subject_id, topic_id, subtopic_id, title, description, url, platform, duration_seconds, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    """
    try:
        cursor = db.execute(query, (
            video.subject_id,
            video.topic_id,
            video.subtopic_id,
            video.title,
            video.description,
            video.url,
            video.platform,
            video.duration_seconds,
            admin["id"]
        ))
        result = cursor.fetchone()
        video_id = result[0] if result else None
        db.commit()
        return {
            "id": video_id,
            "title": video.title,
            "message": "Video created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/notes", response_model=dict, status_code=201)
async def create_note(
    note: LearningNoteCreate,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Create learning notes"""
    query = """
        INSERT INTO learning_notes 
        (subject_id, topic_id, subtopic_id, title, content, format, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    """
    try:
        cursor = db.execute(query, (
            note.subject_id,
            note.topic_id,
            note.subtopic_id,
            note.title,
            note.content,
            note.format,
            admin["id"]
        ))
        result = cursor.fetchone()
        note_id = result[0] if result else None
        db.commit()
        return {
            "id": note_id,
            "title": note.title,
            "message": "Note created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ============================================================================
# CONTENT VERIFICATION / APPROVAL
# ============================================================================

@router.get("/pending-verification")
async def get_pending_content(
    content_type: str = Query(..., description="questions, videos, notes"),
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Get unverified content pending admin approval"""
    if content_type == "questions":
        query = """
            SELECT id, question_text, year, difficulty, is_verified
            FROM past_questions
            WHERE is_verified = 0
            LIMIT 20
        """
        results = db.execute(query).fetchall()
        return [
            {
                "id": r[0],
                "text": r[1],
                "year": r[2],
                "difficulty": r[3],
                "verified": r[4] == 1
            }
            for r in results
        ]
    return []

@router.post("/verify/{content_type}/{content_id}", response_model=dict)
async def verify_content(
    content_type: str,
    content_id: int,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Mark content as verified by admin"""
    try:
        if content_type == "questions":
            db.execute("""
                UPDATE past_questions
                SET is_verified = 1, verified_by = ?
                WHERE id = ?
            """, (admin["id"], content_id))
        elif content_type == "videos":
            db.execute("""
                UPDATE learning_videos
                SET is_verified = 1, verified_by = ?
                WHERE id = ?
            """, (admin["id"], content_id))
        elif content_type == "notes":
            db.execute("""
                UPDATE learning_notes
                SET is_verified = 1, verified_by = ?
                WHERE id = ?
            """, (admin["id"], content_id))
        
        db.commit()
        return {"message": f"{content_type} verified successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ============================================================================
# STATISTICS & INSIGHTS
# ============================================================================

@router.get("/stats/content")
async def get_content_stats(
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Get content statistics for dashboard"""
    stats = {}
    
    stats['total_questions'] = db.execute(
        "SELECT COUNT(*) FROM past_questions"
    ).fetchone()[0]
    
    stats['verified_questions'] = db.execute(
        "SELECT COUNT(*) FROM past_questions WHERE is_verified = 1"
    ).fetchone()[0]
    
    stats['total_videos'] = db.execute(
        "SELECT COUNT(*) FROM learning_videos"
    ).fetchone()[0]
    
    stats['total_notes'] = db.execute(
        "SELECT COUNT(*) FROM learning_notes"
    ).fetchone()[0]
    
    stats['by_subject'] = {}
    subjects = db.execute("""
        SELECT cs.name, COUNT(pq.id)
        FROM content_subjects cs
        LEFT JOIN past_questions pq ON cs.id = pq.subject_id
        GROUP BY cs.id
    """).fetchall()
    
    for subject_name, count in subjects:
        stats['by_subject'][subject_name] = count
    
    return stats


# ============================================================================
# USER MANAGEMENT (SUPERUSER)
# ============================================================================

@router.get("/users")
async def list_users(
    db = Depends(get_db),
    admin: dict = Depends(require_admin),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
):
    """List all users with stats (admin only)"""
    offset = (page - 1) * limit
    conditions = []
    params = []

    if search:
        conditions.append("(u.name ILIKE ? OR u.email ILIKE ?)")
        params += [f"%{search}%", f"%{search}%"]
    if role:
        conditions.append("u.role = ?")
        params.append(role)

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    users = db.execute(f"""
        SELECT u.id, u.name, u.email, u.role,
               COALESCE(u.is_banned, 0) AS is_banned,
               u.banned_reason,
               u.is_verified,
               u.created_at,
               (SELECT COALESCE(SUM(ge.points), 0)
                FROM gamification_events ge WHERE ge.user_id = u.id) AS points,
               (SELECT COALESCE(SUM(us.total_attempts), 0)
                FROM user_stats us WHERE us.user_id = u.id) AS questions_answered,
               (SELECT COUNT(DISTINCT date_trunc('day', pa.attempted_at))
                FROM practice_attempts pa WHERE pa.user_id = u.id) AS active_days
        FROM users u
        {where}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
    """, params + [limit, offset]).fetchall()

    total = db.execute(f"""
        SELECT COUNT(*) FROM users u {where}
    """, params).fetchone()[0]

    return {
        "users": [
            {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3] or "student",
                "is_banned": bool(row[4]),
                "banned_reason": row[5],
                "is_verified": bool(row[6]),
                "created_at": str(row[7]),
                "points": row[8],
                "questions_answered": row[9],
                "active_days": row[10],
            }
            for row in users
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    db = Depends(get_db),
    admin: dict = Depends(require_admin),
    new_role: str = Query(..., regex="^(student|moderator|admin)$")
):
    """Change a user's role (admin only)"""
    # Cannot demote yourself
    if user_id == admin["id"] and new_role != "admin":
        raise HTTPException(status_code=400, detail="Cannot change your own admin role")

    cur = db.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    old_role = user[3] or "student"
    cur.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    db.commit()

    # Send notification email in background
    try:
        send_role_change_email(user[2], user[1], old_role, new_role)
    except Exception as e:
        print(f"[WARN] Role change email failed: {e}")

    return {
        "success": True,
        "user_id": user_id,
        "name": user[1],
        "email": user[2],
        "old_role": old_role,
        "new_role": new_role,
        "message": f"Role updated from '{old_role}' to '{new_role}'"
    }


@router.patch("/users/{user_id}/ban")
async def toggle_ban_user(
    user_id: int,
    db = Depends(get_db),
    admin: dict = Depends(require_admin),
    banned: bool = Query(...),
    reason: Optional[str] = Query(None)
):
    """Ban or unban a user (admin only)"""
    if user_id == admin["id"]:
        raise HTTPException(status_code=400, detail="Cannot ban yourself")

    cur = db.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user[3] == "admin":
        raise HTTPException(status_code=403, detail="Cannot ban another admin")

    ban_val = 1 if banned else 0
    cur.execute(
        "UPDATE users SET is_banned = ?, banned_reason = ? WHERE id = ?",
        (ban_val, reason if banned else None, user_id)
    )
    # Invalidate refresh tokens on ban
    if banned:
        cur.execute("UPDATE users SET refresh_token = NULL WHERE id = ?", (user_id,))
    db.commit()

    action = "banned" if banned else "unbanned"

    # Send notification email in background
    try:
        send_ban_notification_email(user[2], user[1], banned, reason)
    except Exception as e:
        print(f"[WARN] Ban notification email failed: {e}")

    return {
        "success": True,
        "user_id": user_id,
        "name": user[1],
        "email": user[2],
        "is_banned": banned,
        "reason": reason,
        "message": f"User {action} successfully"
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Permanently delete a user account (admin only)"""
    if user_id == admin["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    cur = db.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user[3] == "admin":
        raise HTTPException(status_code=403, detail="Cannot delete an admin account")

    cur.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()

    return {
        "success": True,
        "message": f"User '{user[1]}' ({user[2]}) deleted permanently"
    }


@router.get("/stats/platform")
async def get_platform_stats(
    db = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Get platform-wide statistics (admin only)"""
    stats = {}

    # User counts
    stats['total_users'] = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    stats['verified_users'] = db.execute(
        "SELECT COUNT(*) FROM users WHERE is_verified = 1 OR is_verified = true"
    ).fetchone()[0]
    stats['banned_users'] = db.execute(
        "SELECT COUNT(*) FROM users WHERE is_banned = 1 OR is_banned = true"
    ).fetchone()[0]
    stats['admin_count'] = db.execute(
        "SELECT COUNT(*) FROM users WHERE role = 'admin'"
    ).fetchone()[0]

    # New users over last 7 days
    stats['new_users_7d'] = db.execute("""
        SELECT COUNT(*) FROM users
        WHERE created_at >= NOW() - INTERVAL '7 days'
    """).fetchone()[0]

    # Active users (last 7 days = practiced or learned)
    stats['active_users_7d'] = db.execute("""
        SELECT COUNT(DISTINCT user_id)
        FROM (
            SELECT user_id FROM practice_attempts
            WHERE attempted_at >= NOW() - INTERVAL '7 days'
            UNION
            SELECT user_id FROM learning_progress
            WHERE updated_at >= NOW() - INTERVAL '7 days'
        ) active
    """).fetchone()[0]

    # Daily active users for chart (last 14 days)
    daily_active = db.execute("""
        SELECT date_trunc('day', activity_date) AS day, COUNT(DISTINCT user_id) AS active
        FROM (
            SELECT user_id, attempted_at AS activity_date FROM practice_attempts
            WHERE attempted_at >= NOW() - INTERVAL '14 days'
            UNION ALL
            SELECT user_id, updated_at FROM learning_progress
            WHERE updated_at >= NOW() - INTERVAL '14 days'
        ) combined
        GROUP BY 1
        ORDER BY 1
    """).fetchall()
    stats['daily_active_14d'] = [
        {"date": str(row[0])[:10], "active_users": row[1]}
        for row in daily_active
    ]

    # New registrations per day (last 14 days)
    daily_registrations = db.execute("""
        SELECT date_trunc('day', created_at) AS day, COUNT(*) AS count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY 1
        ORDER BY 1
    """).fetchall()
    stats['daily_registrations_14d'] = [
        {"date": str(row[0])[:10], "registrations": row[1]}
        for row in daily_registrations
    ]

    # Questions stats
    stats['total_questions'] = db.execute(
        "SELECT COUNT(*) FROM questions"
    ).fetchone()[0]

    stats['questions_by_subject'] = {}
    q_by_subject = db.execute("""
        SELECT subject, COUNT(*) FROM questions GROUP BY subject ORDER BY COUNT(*) DESC
    """).fetchall()
    for subject, count in q_by_subject:
        stats['questions_by_subject'][subject] = count

    # Practice attempts stats
    stats['total_practice_attempts'] = db.execute(
        "SELECT COUNT(*) FROM practice_attempts"
    ).fetchone()[0]
    stats['correct_answers'] = db.execute(
        "SELECT COUNT(*) FROM practice_attempts WHERE is_correct = true"
    ).fetchone()[0]
    if stats['total_practice_attempts'] > 0:
        stats['overall_accuracy_pct'] = round(
            stats['correct_answers'] / stats['total_practice_attempts'] * 100, 1
        )
    else:
        stats['overall_accuracy_pct'] = 0

    return stats
