"""
User Profile and Account Management Endpoints
"""
from fastapi import APIRouter, HTTPException, status, Request, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
from typing import Optional

from app.db.database import get_connection
from app.core.security import get_current_user_from_request

router = APIRouter(prefix="/users", tags=["User Management"])


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None


# ============================================================================
# USER PROFILE ENDPOINTS
# ============================================================================

@router.get("/me")
async def get_profile(request: Request):
    """
    GET /users/me
    Return the authenticated user's complete profile.
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT id, name, email, profile_pic_url, created_at FROM users WHERE id = ?
    """, (user_id,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user stats aggregated from user_stats table (by subject/topic)
    cursor.execute("""
        SELECT SUM(total_attempts) as total_questions_answered,
               SUM(correct_attempts) as correct_answers,
               COUNT(DISTINCT subject) as subjects_studied
        FROM user_stats WHERE user_id = ?
    """, (user_id,))
    stats = cursor.fetchone()

    if stats and stats["total_questions_answered"]:
        total_attempted = stats["total_questions_answered"]
        correct_answers = stats["correct_answers"] or 0
        accuracy = (correct_answers / total_attempted *
                    100) if total_attempted > 0 else 0
        stats_summary = {
            "total_questions_answered": total_attempted,
            "correct_answers": correct_answers,
            "incorrect_answers": total_attempted - correct_answers,
            "subjects_studied": stats["subjects_studied"] or 0,
            "accuracy": round(accuracy, 2)
        }
    else:
        stats_summary = {
            "total_questions_answered": 0,
            "correct_answers": 0,
            "incorrect_answers": 0,
            "subjects_studied": 0,
            "accuracy": 0.0
        }

    return {
        "success": True,
        "profile": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "profile_pic_url": user["profile_pic_url"],
            "joined_date": user["created_at"]
        },
        "stats_summary": stats_summary
    }


@router.put("/me")
async def update_profile(request: Request, profile_update: UpdateProfileRequest):
    """
    PUT /users/me
    Update user profile fields: full_name, phone_number, class_level, 
    preferred_exam, date_of_birth, gender
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    # Build update query dynamically
    updates = {}
    if profile_update.full_name:
        updates["name"] = profile_update.full_name

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Build SQL update statement
    set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
    values = list(updates.values()) + [user_id]

    cursor.execute(f"""
        UPDATE users SET {set_clause} WHERE id = ?
    """, values)
    db.commit()

    # Return updated profile
    cursor.execute("""
        SELECT id, name, email, profile_pic_url FROM users WHERE id = ?
    """, (user_id,))
    updated_user = cursor.fetchone()

    return {
        "success": True,
        "message": "Profile updated successfully",
        "profile": {
            "id": updated_user["id"],
            "name": updated_user["name"],
            "email": updated_user["email"],
            "profile_pic_url": updated_user["profile_pic_url"]
        }
    }


@router.post("/avatar")
async def upload_profile_picture(request: Request, file: UploadFile = File(...)):
    """
    POST /users/avatar
    Upload or change profile photo.
    Multipart/form-data upload → returns local URL.
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed: jpeg, png, gif, webp"
        )

    # Create uploads directory if it doesn't exist
    upload_dir = Path("static/uploads/profiles")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Save file with user_id as filename
    file_extension = file.filename.split(
        ".")[-1] if "." in file.filename else "jpg"
    filename = f"user_{user_id}_{datetime.utcnow().timestamp()}.{file_extension}"
    file_path = upload_dir / filename

    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Update database with profile picture URL
    pic_url = f"/static/uploads/profiles/{filename}"
    db = get_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE users SET profile_pic_url = ? WHERE id = ?
    """, (pic_url, user_id))
    db.commit()

    return {
        "success": True,
        "message": "Profile picture uploaded successfully",
        "profile_pic_url": pic_url
    }


@router.get("/stats")
async def get_profile_stats(request: Request):
    """
    GET /users/stats
    Returns user progress analytics: total questions, accuracy, weakest/strongest subjects, 
    streak count, predicted grade.
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    # Aggregate user stats from user_stats table (per subject/topic rows)
    cursor.execute("""
        SELECT SUM(total_attempts) AS total_questions_answered,
               SUM(correct_attempts) AS correct_answers
        FROM user_stats
        WHERE user_id = ?
    """, (user_id,))
    stats = cursor.fetchone()

    total_questions = (stats["total_questions_answered"] or 0) if stats else 0
    correct_answers = (stats["correct_answers"] or 0) if stats else 0
    incorrect_answers = total_questions - correct_answers if total_questions else 0
    accuracy = (correct_answers / total_questions *
                100) if total_questions > 0 else 0

    # Get streak data from user_streaks table
    cursor.execute("""
        SELECT current_streak, longest_streak
        FROM user_streaks
        WHERE user_id = ?
    """, (user_id,))
    streak = cursor.fetchone()
    current_streak = streak["current_streak"] if streak else 0
    longest_streak = streak["longest_streak"] if streak else 0

    # Get subject performance from user_stats (by subject/topic)
    cursor.execute("""
        SELECT subject,
               SUM(total_attempts) AS attempts,
               SUM(correct_attempts) AS correct
        FROM user_stats
        WHERE user_id = ? AND subject IS NOT NULL
        GROUP BY subject
        HAVING attempts > 0
        ORDER BY (CAST(correct AS FLOAT) / attempts) DESC
    """, (user_id,))
    subject_performance = cursor.fetchall()

    strongest_subjects = [row["subject"]
                          for row in subject_performance[:3]] if subject_performance else []
    weakest_subjects = [row["subject"]
                        for row in subject_performance[-3:]] if subject_performance else []
    weakest_subjects.reverse()

    # Predict grade based on accuracy
    if accuracy >= 80:
        predicted_grade = "A"
    elif accuracy >= 70:
        predicted_grade = "B"
    elif accuracy >= 60:
        predicted_grade = "C"
    elif accuracy >= 50:
        predicted_grade = "D"
    else:
        predicted_grade = "E"

    return {
        "success": True,
        "stats": {
            "total_questions_answered": total_questions,
            "correct_answers": correct_answers,
            "incorrect_answers": incorrect_answers,
            "accuracy_percentage": round(accuracy, 2),
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "weakest_subjects": weakest_subjects,
            "strongest_subjects": strongest_subjects,
            "predicted_grade": predicted_grade
        }
    }


@router.get("/history")
async def get_exam_history(request: Request, limit: int = 50, offset: int = 0):
    """
    GET /users/history
    Returns full exam practice history with pagination.
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    # Get total count
    cursor.execute(
        "SELECT COUNT(*) as count FROM exam_sessions WHERE user_id = ?", (user_id,))
    total = cursor.fetchone()["count"]

    # Get paginated history
    cursor.execute("""
        SELECT id, exam_type, subject, score, total_questions, accuracy, created_at
        FROM exam_sessions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    """, (user_id, limit, offset))

    sessions = []
    for row in cursor.fetchall():
        sessions.append({
            "session_id": row["id"],
            "exam_type": row["exam_type"],
            "subject": row["subject"],
            "score": row["score"],
            "total_questions": row["total_questions"],
            "accuracy": row["accuracy"],
            "timestamp": row["created_at"]
        })

    return {
        "success": True,
        "total": total,
        "limit": limit,
        "offset": offset,
        "sessions": sessions
    }


@router.get("/history/{session_id}")
async def get_session_details(request: Request, session_id: int):
    """
    GET /users/history/{session_id}
    Return details of a specific past exam session.
    Requires Bearer token.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT id, exam_type, subject, score, total_questions, correct_answers, 
               incorrect_answers, accuracy, duration_seconds, created_at
        FROM exam_sessions 
        WHERE id = ? AND user_id = ?
    """, (session_id, user_id))

    session = cursor.fetchone()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "success": True,
        "session": {
            "session_id": session["id"],
            "exam_type": session["exam_type"],
            "subject": session["subject"],
            "score": session["score"],
            "total_questions": session["total_questions"],
            "correct_answers": session["correct_answers"],
            "incorrect_answers": session["incorrect_answers"],
            "accuracy": session["accuracy"],
            "duration_seconds": session["duration_seconds"],
            "created_at": session["created_at"]
        }
    }


@router.delete("/me")
async def delete_account(request: Request):
    """
    DELETE /users/me
    Delete user account + all associated data.
    Requires Bearer token.
    This action is permanent and cannot be undone.
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    try:
        # Delete all user data in cascade order (foreign keys)
        cursor.execute(
            "DELETE FROM invalidated_tokens WHERE user_id = ?", (user_id,))
        cursor.execute(
            "DELETE FROM exam_sessions WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM user_stats WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))

        db.commit()

        return {
            "success": True,
            "message": "Account deleted successfully. All data has been removed."
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete account: {str(e)}"
        )
