"""
Dashboard Analytics Router
Provides user statistics, progress tracking, and recommendations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.db.database import get_connection
from app.core.security import current_user_id
from app.services.ai.gemini_service import generate_recommendations

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(user_id: int = Depends(current_user_id)):
    """
    Get comprehensive dashboard statistics with personalized recommendations
    
    Returns:
    - Overall stats: total attempts, accuracy, active days
    - Streak data: current, longest, last activity
    - User profile: department (Science/Commercial/Art), registered subjects
    - Weakest topics: topics with lowest accuracy
    - Recommended topics: personalized topics based on:
        1. User's chosen department
        2. Registered subjects
        3. Performance (weakest areas get recommended first)
    - Recent attempts and CBT history
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Clear any aborted transaction state from prior errors
    try:
        conn.rollback()
    except Exception:
        pass

    try:
        # Get overall stats
        cursor.execute("""
            SELECT COUNT(*) as total_attempts,
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts
            FROM practice_attempts
            WHERE user_id = ?
        """, (user_id,))

        stats_row = cursor.fetchone()
        total_attempts = stats_row[0] if stats_row else 0
        correct_attempts = stats_row[1] if stats_row else 0
        overall_accuracy = (correct_attempts / total_attempts *
                            100) if total_attempts > 0 else 0.0

        # Get streak info
        cursor.execute("""
            SELECT current_streak, longest_streak, total_active_days, last_activity_date
            FROM user_streaks
            WHERE user_id = ?
        """, (user_id,))

        streak_row = cursor.fetchone()
        current_streak = streak_row[0] if streak_row else 0
        longest_streak = streak_row[1] if streak_row else 0
        total_active_days = streak_row[2] if streak_row else 0
        last_activity = streak_row[3] if streak_row else None

        # Get user's department and registered subjects
        cursor.execute("""
            SELECT department, user_subjects.subject
            FROM user_profiles
            LEFT JOIN user_subjects ON user_profiles.user_id = user_subjects.user_id
            WHERE user_profiles.user_id = ?
            ORDER BY user_subjects.position
        """, (user_id,))

        profile_rows = cursor.fetchall()
        department = profile_rows[0][0] if profile_rows else None
        registered_subjects = [row[1] for row in profile_rows if row[1]]

        # Get weakest topics (bottom 5)
        cursor.execute("""
            SELECT subject, topic, accuracy, total_attempts
            FROM user_stats
            WHERE user_id = ? AND accuracy IS NOT NULL
            ORDER BY accuracy ASC
            LIMIT 5
        """, (user_id,))

        weakest_topics = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2),
                "attempts": row[3]
            }
            for row in cursor.fetchall()
        ]

        # Get recommended topics with fallback logic
        # Try 1: Weakest topics from registered subjects
        recommended_topics = [t for t in weakest_topics if t["subject"] in registered_subjects][:3]

        # Try 2: If no registered subjects or no practice in registered subjects, use ANY weakest topics
        if not recommended_topics and weakest_topics:
            recommended_topics = weakest_topics[:3]

        # Try 3: If no practice history at all, suggest starting topics
        if not recommended_topics:
            if registered_subjects:
                placeholders = ','.join(['?'] * len(registered_subjects))
                cursor.execute(f"""
                    SELECT DISTINCT subject, topic
                    FROM questions
                    WHERE subject IN ({placeholders})
                    LIMIT 3
                """, registered_subjects)
            else:
                # No registered subjects - suggest from common JAMB subjects
                cursor.execute("""
                    SELECT DISTINCT subject, topic
                    FROM questions
                    WHERE subject IN ('English Language', 'Mathematics')
                    LIMIT 3
                """)
            
            recommended_topics = [
                {"subject": row[0], "topic": row[1], "accuracy": None, "attempts": 0}
                for row in cursor.fetchall()
            ]

        # Get recent attempts (last 10)
        cursor.execute("""
            SELECT subject, topic, is_correct, practice_type, created_at
            FROM practice_attempts
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 10
        """, (user_id,))

        recent_attempts = [
            {
                "subject": row[0],
                "topic": row[1],
                "is_correct": bool(row[2]),
                "practice_type": row[3],
                "timestamp": row[4]
            }
            for row in cursor.fetchall()
        ]

        # Get CBT session history
        cursor.execute("""
            SELECT id, score, total_questions, completed_at
            FROM exam_sessions
            WHERE user_id = ? AND status = 'completed'
            ORDER BY completed_at DESC
            LIMIT 5
        """, (user_id,))

        cbt_history = [
            {
                "session_id": row[0],
                "score": row[1],
                "total": row[2],
                "accuracy": round(row[1] / row[2] * 100, 2) if row[2] > 0 else 0,
                "date": row[3]
            }
            for row in cursor.fetchall()
        ]

        # Get registered subjects
        cursor.execute("""
            SELECT subject, position
            FROM user_subjects
            WHERE user_id = ?
            ORDER BY position
        """, (user_id,))

        registered_subjects_with_pos = [
            {"subject": row[0], "position": row[1]} for row in cursor.fetchall()]

        return {
            "overall_stats": {
                "total_attempts": total_attempts,
                "correct_attempts": correct_attempts,
                "overall_accuracy": round(overall_accuracy, 2),
                "total_active_days": total_active_days
            },
            "streak": {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "last_activity": last_activity
            },
            "profile": {
                "department": department,
                "registered_subjects": registered_subjects_with_pos
            },
            "weakest_topics": weakest_topics,
            "recommended_topics": recommended_topics,
            "recent_attempts": recent_attempts,
            "cbt_history": cbt_history
        }

    except Exception as e:
        # Reset any aborted transaction and surface a clean error
        try:
            conn.rollback()
        except Exception:
            pass
        import traceback
        error_trace = traceback.format_exc()
        print(f"Dashboard error: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@router.get("/accuracy-trend")
async def get_accuracy_trend(
    subject: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=365),
    user_id: int = Depends(current_user_id)
):
    """
    Get accuracy trend over time
    Returns daily/weekly aggregated accuracy for charting
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Clear any aborted transaction state from prior errors
    try:
        conn.rollback()
    except Exception:
        pass

    try:
        start_date = (datetime.utcnow() - timedelta(days=days)).date()

        # Get attempts aggregated by date
        if subject:
            cursor.execute("""
                SELECT DATE(created_at) as date,
                       COUNT(*) as total,
                       SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
                FROM practice_attempts
                WHERE user_id = ? AND subject = ? AND DATE(created_at) >= ?
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at)
            """, (user_id, subject, start_date.isoformat()))
        else:
            cursor.execute("""
                SELECT DATE(created_at) as date,
                       COUNT(*) as total,
                       SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
                FROM practice_attempts
                WHERE user_id = ? AND DATE(created_at) >= ?
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at)
            """, (user_id, start_date.isoformat()))

        trend = [
            {
                "date": row[0],
                "total_questions": row[1],
                "correct": row[2],
                "accuracy": round(row[2] / row[1] * 100, 2) if row[1] > 0 else 0
            }
            for row in cursor.fetchall()
        ]

        return {
            "subject": subject,
            "period_days": days,
            "data_points": len(trend),
            "trend": trend
        }

    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch trend: {str(e)}"
        )


@router.get("/subject-breakdown")
async def get_subject_breakdown(user_id: int = Depends(current_user_id)):
    """
    Get accuracy and stats by subject
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Clear any aborted transaction state from prior errors
    try:
        conn.rollback()
    except Exception:
        pass

    try:
        cursor.execute("""
            SELECT subject,
                   COUNT(*) as total_attempts,
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts
            FROM practice_attempts
            WHERE user_id = ?
            GROUP BY subject
            ORDER BY subject
        """, (user_id,))

        breakdown = []
        for row in cursor.fetchall():
            subject = row[0]
            total = row[1]
            correct = row[2]
            accuracy = (correct / total * 100) if total > 0 else 0

            # Get topic count for this subject
            cursor.execute("""
                SELECT COUNT(DISTINCT topic)
                FROM user_stats
                WHERE user_id = ? AND subject = ?
            """, (user_id, subject))

            topic_count = cursor.fetchone()[0]

            breakdown.append({
                "subject": subject,
                "total_attempts": total,
                "correct_attempts": correct,
                "accuracy": round(accuracy, 2),
                "topics_practiced": topic_count
            })

        return {
            "subjects": breakdown
        }

    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch breakdown: {str(e)}"
        )


@router.get("/recommendations")
async def get_recommendations(user_id: int = Depends(current_user_id)):
    """
    Get personalized study recommendations based on:
    1. User's department choice
    2. Weakest topics (lowest accuracy)
    3. Recent performance patterns
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Clear any aborted transaction state from prior errors
    try:
        conn.rollback()
    except Exception:
        pass

    try:
        # Get user's department
        cursor.execute("""
            SELECT department, user_subjects.subject
            FROM user_profiles
            LEFT JOIN user_subjects ON user_profiles.user_id = user_subjects.user_id
            WHERE user_profiles.user_id = ?
            ORDER BY user_subjects.position
        """, (user_id,))

        rows = cursor.fetchall()
        department = rows[0][0] if rows else None
        registered_subjects = [row[1] for row in rows if row[1]]

        # Get weakest topics (bottom 10)
        cursor.execute("""
            SELECT subject, topic, accuracy, total_attempts
            FROM user_stats
            WHERE user_id = ? AND accuracy IS NOT NULL
            ORDER BY accuracy ASC
            LIMIT 10
        """, (user_id,))

        all_weak_topics = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2),
                "attempts": row[3]
            }
            for row in cursor.fetchall()
        ]

        # Filter weak topics by registered subjects for focused recommendations
        weak_topics_filtered = [
            t for t in all_weak_topics if t["subject"] in registered_subjects
        ][:5]

        # If no practice history exists, recommend foundational topics
        if not weak_topics_filtered:
            # Get foundational topics from registered subjects
            if registered_subjects:
                placeholders = ','.join(['?'] * len(registered_subjects))
                cursor.execute(f"""
                    SELECT DISTINCT subject, topic
                    FROM questions
                    WHERE subject IN ({placeholders})
                    LIMIT 10
                """, registered_subjects)
                
                foundational = [
                    {"subject": row[0], "topic": row[1], "accuracy": None, "attempts": 0}
                    for row in cursor.fetchall()
                ]
                weak_topics_filtered = foundational[:5]

        # Get recent attempt patterns
        cursor.execute("""
            SELECT subject, topic, is_correct, practice_type, created_at
            FROM practice_attempts
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        """, (user_id,))

        recent = [
            {
                "subject": row[0],
                "topic": row[1],
                "is_correct": bool(row[2]),
                "practice_type": row[3]
            }
            for row in cursor.fetchall()
        ]

        # Calculate improvement areas
        improvement_areas = {}
        for attempt in recent:
            key = f"{attempt['subject']}:{attempt['topic']}"
            if key not in improvement_areas:
                improvement_areas[key] = {"correct": 0, "total": 0}
            improvement_areas[key]["total"] += 1
            if attempt["is_correct"]:
                improvement_areas[key]["correct"] += 1

        # Identify topics with <50% accuracy in recent practice
        urgent_focus = [
            {
                "subject": k.split(":")[0],
                "topic": k.split(":")[1],
                "recent_accuracy": round(v["correct"] / v["total"] * 100, 2)
            }
            for k, v in improvement_areas.items()
            if v["total"] >= 3 and v["correct"] / v["total"] < 0.5
        ][:3]

        # Generate recommendation message
        recommendation_msg = []
        if department:
            recommendation_msg.append(
                f"Based on your {department} department choice, focus on topics critical for your stream."
            )
        
        if weak_topics_filtered:
            weak_subject_topics = [f"{t['subject']}: {t['topic']}" for t in weak_topics_filtered[:3]]
            recommendation_msg.append(
                f"Your weakest areas are {', '.join(weak_subject_topics)}. Start with these for maximum improvement."
            )
        
        if urgent_focus:
            urgent_topics = [f"{t['subject']}: {t['topic']}" for t in urgent_focus]
            recommendation_msg.append(
                f"⚠️ Urgent focus needed: {', '.join(urgent_topics)}"
            )
        
        if not recommendation_msg:
            recommendation_msg.append("Keep practicing consistently to track improvement!")

        return {
            "success": True,
            "department": department,
            "registered_subjects": registered_subjects,
            "weakest_topics": weak_topics_filtered,
            "urgent_focus_areas": urgent_focus,
            "recommendation_message": " ".join(recommendation_msg),
            "suggested_action": "Start with the weakest topics using the 'Learn by Topics' feature, then practice with 'Year Practice'",
            "study_focus": {
                "primary_focus": weak_topics_filtered[0] if weak_topics_filtered else None,
                "secondary_focuses": weak_topics_filtered[1:3] if len(weak_topics_filtered) > 1 else []
            }
        }

    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@router.get("/grade-predictor")
async def get_grade_predictor(user_id: int = Depends(current_user_id)):
    """
    Simple grade predictor based on current accuracy
    Maps accuracy % to expected JAMB performance
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Clear any aborted transaction state from prior errors
    try:
        conn.rollback()
    except Exception:
        pass

    try:
        # Get overall accuracy
        cursor.execute("""
            SELECT COUNT(*) as total,
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
            FROM practice_attempts
            WHERE user_id = ?
        """, (user_id,))

        row = cursor.fetchone()
        total = row[0] if row else 0
        correct = row[1] if row else 0

        if total == 0:
            return {
                "accuracy": 0,
                "predicted_score": "N/A",
                "interpretation": "Start practicing to get accurate predictions",
                "confidence": "low"
            }

        accuracy = (correct / total * 100)

        # Simple prediction model
        if accuracy >= 90:
            predicted = "A (Excellent)"
            interpretation = "Excellent performance - likely to score above 250"
            confidence = "high"
        elif accuracy >= 80:
            predicted = "B (Good)"
            interpretation = "Good performance - likely to score 200-250"
            confidence = "high"
        elif accuracy >= 70:
            predicted = "C (Fair)"
            interpretation = "Fair performance - likely to score 150-200"
            confidence = "medium"
        elif accuracy >= 60:
            predicted = "D (Pass)"
            interpretation = "Passing performance - likely to score 120-150"
            confidence = "medium"
        else:
            predicted = "E (Need Improvement)"
            interpretation = "Need more practice - focus on weak topics"
            confidence = "low"

        return {
            "current_accuracy": round(accuracy, 2),
            "total_questions_practiced": total,
            "correct_answers": correct,
            "predicted_grade": predicted,
            "interpretation": interpretation,
            "confidence_level": confidence
        }

    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate prediction: {str(e)}"
        )
