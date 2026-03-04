"""
Dashboard Analytics Router
Provides user statistics, progress tracking, and recommendations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.db.database import get_connection
from app.core.security import current_user_id

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Department-to-subjects mapping for filtering recommendations
DEPARTMENT_SUBJECTS = {
    'Science': ['English', 'Physics', 'Chemistry', 'Biology', 'Mathematics'],
    'Commercial': ['English', 'Commerce', 'Accounting', 'Economics', 'Mathematics'],
    'Art': ['English', 'Government', 'Literature in English', 'Economics', 'History',
            'Geography', 'Hausa', 'Igbo', 'French', 'Music', 'Art']
}


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

        # Get weakest topics from practice attempts (bottom 8)
        cursor.execute("""
            SELECT subject, topic, accuracy, total_attempts
            FROM user_stats
            WHERE user_id = ? AND accuracy IS NOT NULL
            ORDER BY accuracy ASC
            LIMIT 8
        """, (user_id,))

        weakest_topics = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2),
                "attempts": row[3],
                "source": "practice"
            }
            for row in cursor.fetchall()
        ]

        # Get incomplete learning progress topics (started but not completed)
        cursor.execute("""
            SELECT subject, topic_name, 
                   CAST(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / 
                   NULLIF(CAST(COUNT(*) AS FLOAT), 0) * 100 as completion_rate,
                   COUNT(*) as total_objectives
            FROM learning_progress
            WHERE user_id = ?
            GROUP BY subject, topic_name
            HAVING CAST(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / 
                   NULLIF(CAST(COUNT(*) AS FLOAT), 0) * 100 < 100
            ORDER BY CAST(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / 
                   NULLIF(CAST(COUNT(*) AS FLOAT), 0) * 100 ASC
            LIMIT 6
        """, (user_id,))

        incomplete_learning = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2) if row[2] else 0,
                "attempts": row[3],
                "source": "learning"
            }
            for row in cursor.fetchall()
        ]

        # Get weak topics from CBT sessions (join with questions to get topic)
        cursor.execute("""
            SELECT sq.subject, q.topic,
                   ROUND(CAST(SUM(CASE WHEN sq.is_correct = 1 THEN 1 ELSE 0 END) AS NUMERIC) /
                   NULLIF(CAST(COUNT(*) AS NUMERIC), 0) * 100, 2) as accuracy,
                   COUNT(*) as attempts
            FROM session_questions sq
            JOIN exam_sessions es ON sq.session_id = es.id
            JOIN questions q ON sq.question_id = q.id
            WHERE es.user_id = ? AND es.status = 'completed' AND q.topic IS NOT NULL
            GROUP BY sq.subject, q.topic
            HAVING CAST(SUM(CASE WHEN sq.is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) /
                   NULLIF(CAST(COUNT(*) AS FLOAT), 0) < 0.7
            ORDER BY accuracy ASC
            LIMIT 6
        """, (user_id,))

        cbt_weak_topics = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": row[2] if row[2] else 0,
                "attempts": row[3],
                "source": "cbt"
            }
            for row in cursor.fetchall()
        ]

        # Get weak topics from year practice (practice_type = 'year')
        cursor.execute("""
            SELECT subject, topic,
                   ROUND(CAST(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS NUMERIC) /
                   NULLIF(CAST(COUNT(*) AS NUMERIC), 0) * 100, 2) as accuracy,
                   COUNT(*) as attempts
            FROM practice_attempts
            WHERE user_id = ? AND practice_type = 'year' AND topic IS NOT NULL
            GROUP BY subject, topic
            HAVING CAST(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) /
                   NULLIF(CAST(COUNT(*) AS FLOAT), 0) < 0.7
            ORDER BY accuracy ASC
            LIMIT 6
        """, (user_id,))

        year_practice_weak = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": row[2] if row[2] else 0,
                "attempts": row[3],
                "source": "year_practice"
            }
            for row in cursor.fetchall()
        ]

        # Combine all weakness sources and build recommendations
        # Priority: incomplete learning > practice weak > CBT weak > year practice weak
        all_weak = incomplete_learning + weakest_topics + \
            cbt_weak_topics + year_practice_weak

        # Determine allowed subjects based on department
        allowed_subjects = set(registered_subjects)
        if department and department in DEPARTMENT_SUBJECTS:
            allowed_subjects = allowed_subjects | set(
                DEPARTMENT_SUBJECTS[department])

        # Filter by department-appropriate subjects (Art students won't see Physics, etc.)
        recommended_topics = []
        seen_keys = set()
        for t in all_weak:
            key = f"{t['subject']}:{t['topic']}"
            if key in seen_keys:
                continue
            if allowed_subjects and t['subject'] not in allowed_subjects:
                continue
            seen_keys.add(key)
            recommended_topics.append(t)
            if len(recommended_topics) >= 8:
                break

        # Fallback: if less than 8, add from registered subjects that haven't been practiced
        if len(recommended_topics) < 8 and registered_subjects:
            placeholders = ','.join(['?'] * len(registered_subjects))
            cursor.execute(f"""
                SELECT subject, topic FROM (
                    SELECT DISTINCT subject, topic
                    FROM questions
                    WHERE subject IN ({placeholders})
                ) sub
                ORDER BY RANDOM()
                LIMIT ?
            """, registered_subjects + [8 - len(recommended_topics)])

            for row in cursor.fetchall():
                key = f"{row[0]}:{row[1]}"
                if key not in seen_keys:
                    recommended_topics.append({
                        "subject": row[0], "topic": row[1],
                        "accuracy": None, "attempts": 0, "source": "suggested"
                    })
                    seen_keys.add(key)
                    if len(recommended_topics) >= 8:
                        break

        # Fallback: if still empty, use department subjects
        if not recommended_topics and department and department in DEPARTMENT_SUBJECTS:
            dept_subjects = DEPARTMENT_SUBJECTS[department]
            placeholders = ','.join(['?'] * len(dept_subjects))
            cursor.execute(f"""
                SELECT subject, topic FROM (
                    SELECT DISTINCT subject, topic
                    FROM questions
                    WHERE subject IN ({placeholders})
                ) sub
                ORDER BY RANDOM()
                LIMIT 8
            """, dept_subjects)

            recommended_topics = [
                {"subject": row[0], "topic": row[1], "accuracy": None,
                    "attempts": 0, "source": "suggested"}
                for row in cursor.fetchall()
            ]

        # ── Explicit STRENGTHS: topics ≥ 70% accuracy with ≥ 3 attempts ────
        cursor.execute("""
            SELECT subject, topic, accuracy, total_attempts
            FROM user_stats
            WHERE user_id = ? AND accuracy >= 70 AND total_attempts >= 3
            ORDER BY accuracy DESC
            LIMIT 8
        """, (user_id,))

        strengths = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2),
                "attempts": row[3]
            }
            for row in cursor.fetchall()
        ]

        # ── Explicit WEAKNESSES: topics < 70% accuracy with ≥ 2 attempts ───
        cursor.execute("""
            SELECT subject, topic, accuracy, total_attempts
            FROM user_stats
            WHERE user_id = ? AND accuracy < 70 AND total_attempts >= 2
            ORDER BY accuracy ASC
            LIMIT 8
        """, (user_id,))

        weaknesses = [
            {
                "subject": row[0],
                "topic": row[1],
                "accuracy": round(row[2], 2),
                "attempts": row[3]
            }
            for row in cursor.fetchall()
        ]

        # ── RECENT ACTIVITY from practice_attempts (CBT + year) ─────────────
        cursor.execute("""
            SELECT subject, topic, is_correct, practice_type, created_at
            FROM practice_attempts
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 30
        """, (user_id,))

        recent_from_attempts = [
            {
                "subject": row[0],
                "topic": row[1],
                "is_correct": bool(row[2]),
                "practice_type": row[3],
                "timestamp": row[4]
            }
            for row in cursor.fetchall()
        ]

        # ── RECENT ACTIVITY from guided learning (learning_progress) ─────────
        cursor.execute("""
            SELECT subject, topic_name, answered_correctly, completed_at
            FROM learning_progress
            WHERE user_id = ? AND status = 'completed' AND completed_at IS NOT NULL
            ORDER BY completed_at DESC
            LIMIT 30
        """, (user_id,))

        recent_from_guided = [
            {
                "subject": row[0],
                "topic": row[1],
                "is_correct": bool(row[2]) if row[2] is not None else None,
                "practice_type": "guided",
                "timestamp": row[3]
            }
            for row in cursor.fetchall()
        ]

        # Merge and sort all recent activity (individual attempts), keep top 20
        all_recent = recent_from_attempts + recent_from_guided
        all_recent.sort(key=lambda x: (x.get('timestamp') or ''), reverse=True)
        recent_attempts = all_recent[:20]

        # ── RECENT TOPICS: distinct subjects+topics, most recently practiced ──
        cursor.execute("""
            SELECT subject, topic, MAX(last_practiced) as last_practiced
            FROM user_stats
            WHERE user_id = ? AND last_practiced IS NOT NULL
            GROUP BY subject, topic
            ORDER BY MAX(last_practiced) DESC
            LIMIT 5
        """, (user_id,))

        recent_topics = [
            {
                "subject": row[0],
                "topic": row[1],
                "last_practiced": row[2]
            }
            for row in cursor.fetchall()
        ]

        # ── CBT SESSION HISTORY ───────────────────────────────────────────────
        cursor.execute("""
            SELECT id, score, total_questions, completed_at
            FROM exam_sessions
            WHERE user_id = ? AND status = 'completed'
            ORDER BY completed_at DESC
            LIMIT 20
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

        # ── YEAR PRACTICE SESSION HISTORY ─────────────────────────────────────
        try:
            # Ensure table exists before querying (avoids aborting the transaction)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS year_practice_sessions (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    subject TEXT NOT NULL,
                    year INTEGER NOT NULL,
                    total_questions INTEGER NOT NULL,
                    correct_answers INTEGER NOT NULL,
                    accuracy REAL NOT NULL,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute("""
                SELECT id, subject, year, total_questions, correct_answers, accuracy, completed_at
                FROM year_practice_sessions
                WHERE user_id = ?
                ORDER BY completed_at DESC
                LIMIT 20
            """, (user_id,))
            year_practice_history = [
                {
                    "id": row[0],
                    "subject": row[1],
                    "year": row[2],
                    "total_questions": row[3],
                    "correct_answers": row[4],
                    "accuracy": round(row[5], 2) if row[5] else 0,
                    "date": row[6]
                }
                for row in cursor.fetchall()
            ]
        except Exception as yp_err:
            print(f"year_practice_history fetch warning: {yp_err}")
            year_practice_history = []
            # Reset aborted transaction so subsequent queries can continue
            try:
                conn.rollback()
            except Exception:
                pass

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
            "strengths": strengths,
            "weaknesses": weaknesses,
            "weakest_topics": weakest_topics,
            "recommended_topics": recommended_topics,
            "recent_attempts": recent_attempts,
            "recent_topics": recent_topics,
            "cbt_history": cbt_history,
            "year_practice_history": year_practice_history
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
                    {"subject": row[0], "topic": row[1],
                        "accuracy": None, "attempts": 0}
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
            weak_subject_topics = [
                f"{t['subject']}: {t['topic']}" for t in weak_topics_filtered[:3]]
            recommendation_msg.append(
                f"Your weakest areas are {', '.join(weak_subject_topics)}. Start with these for maximum improvement."
            )

        if urgent_focus:
            urgent_topics = [
                f"{t['subject']}: {t['topic']}" for t in urgent_focus]
            recommendation_msg.append(
                f"⚠️ Urgent focus needed: {', '.join(urgent_topics)}"
            )

        if not recommendation_msg:
            recommendation_msg.append(
                "Keep practicing consistently to track improvement!")

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


@router.get("/points")
async def get_unified_points(user_id: int = Depends(current_user_id)):
    """
    Get unified points from all sources:
    1. Learning points (correct answers in guided learning)
    2. CBT scores (total correct in completed CBT sessions)
    3. Year practice scores (correct answers in year practice)
    4. Daily streak bonus (streak * 5 points per day)
    """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        conn.rollback()
    except Exception:
        pass

    try:
        # 1. Learning points from user_profiles (accumulated from guided learning)
        cursor.execute("""
            SELECT COALESCE(learning_points, 0) FROM user_profiles WHERE user_id = ?
        """, (user_id,))
        result = cursor.fetchone()
        learning_points = result[0] if result else 0

        # 2. CBT points: total correct answers across all completed CBT sessions (* 2 points each)
        cursor.execute("""
            SELECT COALESCE(SUM(score), 0) FROM exam_sessions
            WHERE user_id = ? AND status = 'completed'
        """, (user_id,))
        result = cursor.fetchone()
        cbt_correct = result[0] if result else 0
        cbt_points = cbt_correct * 2

        # 3. Year practice points: correct answers in year practice (* 1 point each)
        cursor.execute("""
            SELECT COALESCE(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END), 0)
            FROM practice_attempts
            WHERE user_id = ? AND practice_type = 'year'
        """, (user_id,))
        result = cursor.fetchone()
        year_practice_points = result[0] if result else 0

        # 4. Topic practice points: correct answers in topic practice (* 1 point each)
        cursor.execute("""
            SELECT COALESCE(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END), 0)
            FROM practice_attempts
            WHERE user_id = ? AND practice_type = 'topic'
        """, (user_id,))
        result = cursor.fetchone()
        topic_practice_points = result[0] if result else 0

        # 5. Streak bonus: current_streak * 5
        cursor.execute("""
            SELECT COALESCE(current_streak, 0), COALESCE(total_active_days, 0)
            FROM user_streaks WHERE user_id = ?
        """, (user_id,))
        result = cursor.fetchone()
        current_streak = result[0] if result else 0
        total_active_days = result[1] if result else 0
        streak_points = current_streak * 5

        # Total
        total_points = learning_points + cbt_points + \
            year_practice_points + topic_practice_points + streak_points

        # Calculate level
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
            1: "Beginner", 2: "Learner", 3: "Student", 4: "Scholar",
            5: "Expert", 6: "Master", 8: "Genius", 10: "Legend"
        }

        return {
            "total_points": total_points,
            "level": level,
            "level_name": level_names.get(level, "Beginner"),
            "breakdown": {
                "learning": learning_points,
                "cbt": cbt_points,
                "year_practice": year_practice_points,
                "topic_practice": topic_practice_points,
                "streak_bonus": streak_points
            },
            "streak": {
                "current": current_streak,
                "active_days": total_active_days
            }
        }

    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate points: {str(e)}"
        )
