"""
Profile and Subject Management Router
Handles profile completion, subject registration, and user preferences
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
from app.db.database import get_connection
from app.core.security import current_user_id

router = APIRouter(prefix="/profile", tags=["profile"])


# Pydantic Models
class CompleteProfileRequest(BaseModel):
    full_name: str
    phone_number: str
    class_level: str
    gender: Optional[str] = None
    age: Optional[int] = None
    department: Optional[str] = None
    state: Optional[str] = None
    local_government: Optional[str] = None
    subjects: List[str]

    @field_validator('class_level')
    @classmethod
    def validate_class(cls, v):
        if v not in ['SS1', 'SS2', 'SS3']:
            raise ValueError("class_level must be SS1, SS2, or SS3")
        return v
    
    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v):
        if v and v not in ['Male', 'Female', 'Other', 'Prefer not to say']:
            raise ValueError("Invalid gender option")
        return v
    
    @field_validator('department')
    @classmethod
    def validate_department(cls, v):
        if v and v not in ['Science', 'Commercial', 'Art']:
            raise ValueError("Department must be Science, Commercial, or Art")
        return v
    
    @field_validator('age')
    @classmethod
    def validate_age(cls, v):
        if v and (v < 10 or v > 100):
            raise ValueError("Age must be between 10 and 100")
        return v

    @field_validator('subjects')
    @classmethod
    def validate_subjects(cls, v):
        if len(v) != 4:
            raise ValueError("Must select exactly 4 subjects for JAMB")
        if len(v) != len(set(v)):
            raise ValueError("Subjects must be unique")
        if "Literature" in v:
            raise ValueError("Literature is no longer available. Use 'Literature in English' instead.")
        return v


class UpdateSubjectsRequest(BaseModel):
    subjects: List[str]

    @field_validator('subjects')
    @classmethod
    def validate_subjects(cls, v):
        if len(v) != 4:
            raise ValueError("Must select exactly 4 subjects for JAMB")
        if len(v) != len(set(v)):
            raise ValueError("Subjects must be unique")
        if "Literature" in v:
            raise ValueError("Literature is no longer available. Use 'Literature in English' instead.")
        return v


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    class_level: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    department: Optional[str] = None
    state: Optional[str] = None
    local_government: Optional[str] = None


@router.post("/complete")
async def complete_profile(request: CompleteProfileRequest, user_id: int = Depends(current_user_id)):
    """
    Complete user profile after first login (FORCED)
    Sets up full name, phone, class level, and exactly 4 subjects
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if profile already completed
        cursor.execute(
            "SELECT profile_completed FROM user_profiles WHERE user_id = ?", (user_id,))
        existing = cursor.fetchone()

        if existing and existing[0] == 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already completed"
            )

        # Validate subjects exist in database
        placeholders = ','.join(['?'] * len(request.subjects))
        cursor.execute(
            f"SELECT DISTINCT subject FROM questions WHERE subject IN ({placeholders})",
            request.subjects
        )
        valid_subjects = [row[0] for row in cursor.fetchall()]

        invalid = set(request.subjects) - set(valid_subjects)
        if invalid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid subjects: {', '.join(invalid)}"
            )

        # Create or update profile
        if existing:
            cursor.execute("""
                UPDATE user_profiles
                SET full_name = ?, phone_number = ?, class_level = ?, 
                    gender = ?, age = ?, department = ?, state = ?, local_government = ?,
                    profile_completed = 1, updated_at = ?
                WHERE user_id = ?
            """, (request.full_name, request.phone_number, request.class_level,
                  request.gender, request.age, request.department, request.state, request.local_government,
                  datetime.utcnow().isoformat(), user_id))
        else:
            cursor.execute("""
                INSERT INTO user_profiles (user_id, full_name, phone_number, class_level, 
                                          gender, age, department, state, local_government,
                                          preferred_exam, profile_completed, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'JAMB', 1, ?, ?)
            """, (user_id, request.full_name, request.phone_number, request.class_level,
                  request.gender, request.age, request.department, request.state, request.local_government,
                  datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))

        # Delete old subjects
        cursor.execute(
            "DELETE FROM user_subjects WHERE user_id = ?", (user_id,))

        # Insert new subjects with positions
        for position, subject in enumerate(request.subjects, 1):
            cursor.execute("""
                INSERT INTO user_subjects (user_id, subject, position, created_at)
                VALUES (?, ?, ?, ?)
            """, (user_id, subject, position, datetime.utcnow().isoformat()))

        # Initialize user stats for new subjects
        for subject in request.subjects:
            cursor.execute("""
                INSERT INTO user_stats (user_id, subject, topic, total_attempts, correct_attempts, accuracy)
                VALUES (?, ?, NULL, 0, 0, 0.0)
                ON CONFLICT(user_id, subject, topic) DO NOTHING
            """, (user_id, subject))

        # Initialize streak record
        cursor.execute("""
            INSERT INTO user_streaks (user_id, current_streak, longest_streak, 
                                               last_activity_date, total_active_days)
            VALUES (?, 0, 0, NULL, 0)
            ON CONFLICT(user_id) DO NOTHING
        """, (user_id,))

        conn.commit()

        return {
            "success": True,
            "message": "Profile completed successfully",
            "profile": {
                "full_name": request.full_name,
                "phone_number": request.phone_number,
                "class_level": request.class_level,
                "subjects": request.subjects
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile completion failed: {str(e)}"
        )


@router.get("/me")
async def get_profile(user_id: int = Depends(current_user_id)):
    """Get current user profile with subjects"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get user basic info
        cursor.execute("""
            SELECT u.id, u.name, u.email, u.profile_pic_url,
                   p.full_name, p.phone_number, p.class_level, p.gender, p.age, 
                   p.department, p.state, p.local_government, p.preferred_exam, p.profile_completed
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE u.id = ?
        """, (user_id,))

        user_row = cursor.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="User not found")

        # Get subjects
        cursor.execute("""
            SELECT subject, position
            FROM user_subjects
            WHERE user_id = ?
            ORDER BY position
        """, (user_id,))
        subjects = [{"subject": row[0], "position": row[1]}
                    for row in cursor.fetchall()]

        # Get overall stats
        cursor.execute("""
            SELECT 
                COUNT(*) as total_attempts,
                SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts
            FROM practice_attempts
            WHERE user_id = ?
        """, (user_id,))
        stats_row = cursor.fetchone()
        total_attempts = stats_row[0] if stats_row else 0
        correct_attempts = stats_row[1] if stats_row else 0
        accuracy = (correct_attempts / total_attempts *
                    100) if total_attempts > 0 else 0.0

        # Get streak
        cursor.execute("""
            SELECT current_streak, longest_streak, total_active_days
            FROM user_streaks
            WHERE user_id = ?
        """, (user_id,))
        streak_row = cursor.fetchone()

        return {
            "id": user_row[0],
            "name": user_row[1],
            "email": user_row[2],
            "profile_pic_url": user_row[3],
            "full_name": user_row[4],
            "phone_number": user_row[5],
            "class_level": user_row[6],
            "gender": user_row[7],
            "age": user_row[8],
            "department": user_row[9],
            "state": user_row[10],
            "local_government": user_row[11],
            "preferred_exam": user_row[12] or "JAMB",
            "profile_completed": bool(user_row[13]),
            "subjects": subjects,
            "stats": {
                "total_attempts": total_attempts,
                "correct_attempts": correct_attempts,
                "accuracy": round(accuracy, 2),
                "current_streak": streak_row[0] if streak_row else 0,
                "longest_streak": streak_row[1] if streak_row else 0,
                "total_active_days": streak_row[2] if streak_row else 0
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch profile: {str(e)}"
        )


@router.put("/update")
async def update_profile(request: UpdateProfileRequest, user_id: int = Depends(current_user_id)):
    """Update profile information (except subjects)"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Determine if profile exists
        cursor.execute("SELECT 1 FROM user_profiles WHERE user_id = ?", (user_id,))
        profile_exists = cursor.fetchone() is not None

        updates = []
        params = []

        if request.full_name:
            updates.append("full_name = ?")
            params.append(request.full_name)

        if request.phone_number:
            updates.append("phone_number = ?")
            params.append(request.phone_number)

        if request.class_level:
            if request.class_level not in ['SS1', 'SS2', 'SS3']:
                raise HTTPException(
                    status_code=400,
                    detail="class_level must be SS1, SS2, or SS3"
                )
            updates.append("class_level = ?")
            params.append(request.class_level)
        
        if request.gender:
            if request.gender not in ['Male', 'Female', 'Other', 'Prefer not to say']:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid gender option"
                )
            updates.append("gender = ?")
            params.append(request.gender)
        
        if request.age is not None:
            if request.age < 10 or request.age > 100:
                raise HTTPException(
                    status_code=400,
                    detail="Age must be between 10 and 100"
                )
            updates.append("age = ?")
            params.append(request.age)
        
        if request.department:
            if request.department not in ['Science', 'Commercial', 'Art']:
                raise HTTPException(
                    status_code=400,
                    detail="Department must be Science, Commercial, or Art"
                )
            updates.append("department = ?")
            params.append(request.department)
        
        if request.state:
            updates.append("state = ?")
            params.append(request.state)
        
        if request.local_government:
            updates.append("local_government = ?")
            params.append(request.local_government)

        if not updates:
            raise HTTPException(
                status_code=400,
                detail="No fields to update"
            )

        # Always mark profile as completed when updating info
        updates.append("profile_completed = 1")
        updates.append("updated_at = ?")
        params.append(datetime.utcnow().isoformat())

        if profile_exists:
            # Update existing profile
            params.append(user_id)
            query = f"UPDATE user_profiles SET {', '.join(updates)} WHERE user_id = ?"
            cursor.execute(query, params)
        else:
            # Insert new profile record
            columns = []
            placeholders = []
            insert_params = []

            field_map = {
                "full_name": request.full_name or "",
                "phone_number": request.phone_number or "",
                "class_level": request.class_level or "",
                "gender": request.gender,
                "age": request.age,
                "department": request.department,
                "state": request.state,
                "local_government": request.local_government,
                "preferred_exam": "JAMB",
                "profile_completed": 1,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }

            for col, val in field_map.items():
                if val is not None:
                    columns.append(col)
                    placeholders.append("?")
                    insert_params.append(val)

            # Always include user_id
            columns.insert(0, "user_id")
            placeholders.insert(0, "?")
            insert_params.insert(0, user_id)

            query = f"INSERT INTO user_profiles ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, insert_params)

        conn.commit()

        return {"success": True, "message": "Profile updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Update failed: {str(e)}"
        )


@router.put("/subjects")
async def update_subjects(request: UpdateSubjectsRequest, user_id: int = Depends(current_user_id)):
    """Update registered subjects (must still be exactly 4)"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
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

        # Delete old subjects
        cursor.execute(
            "DELETE FROM user_subjects WHERE user_id = ?", (user_id,))

        # Insert new subjects
        for position, subject in enumerate(request.subjects, 1):
            cursor.execute("""
                INSERT INTO user_subjects (user_id, subject, position, created_at)
                VALUES (?, ?, ?, ?)
            """, (user_id, subject, position, datetime.utcnow().isoformat()))

        conn.commit()

        return {
            "success": True,
            "message": "Subjects updated successfully",
            "subjects": request.subjects
        }

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Subject update failed: {str(e)}"
        )


@router.get("/check-completion")
async def check_profile_completion(user_id: int = Depends(current_user_id)):
    """Check if user has completed profile setup"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT profile_completed
            FROM user_profiles
            WHERE user_id = ?
        """, (user_id,))

        row = cursor.fetchone()
        completed = bool(row[0]) if row else False

        return {
            "profile_completed": completed,
            "requires_completion": not completed
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Check failed: {str(e)}"
        )
