"""
Test the dashboard stats endpoint directly
"""
import sqlite3
import json
from datetime import datetime, timedelta

def test_dashboard_stats(user_id=3):
    conn = sqlite3.connect('jamb_questions.db')
    cursor = conn.cursor()
    
    print(f"\n=== TESTING DASHBOARD STATS FOR USER {user_id} ===\n")
    
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
    overall_accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0.0
    
    print(f"✓ Overall Stats: {total_attempts} attempts, {correct_attempts} correct, {overall_accuracy:.2f}% accuracy")
    
    # Get weakest topics
    cursor.execute("""
        SELECT subject, topic, accuracy, total_attempts
        FROM user_stats
        WHERE user_id = ? AND accuracy IS NOT NULL
        ORDER BY accuracy ASC
        LIMIT 5
    """, (user_id,))
    
    weakest_topics = cursor.fetchall()
    print(f"\n✓ Weakest Topics ({len(weakest_topics)} found):")
    for row in weakest_topics:
        print(f"  - {row[0]}: {row[1]} ({row[2]}%)")
    
    # Get registered subjects
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
    
    print(f"\n✓ Profile: Department={department}, Registered Subjects={registered_subjects}")
    
    # Simulate recommendation logic
    weakest_list = [
        {
            "subject": row[0],
            "topic": row[1],
            "accuracy": round(row[2], 2),
            "attempts": row[3]
        }
        for row in weakest_topics
    ]
    
    # Try 1: Weakest topics from registered subjects
    recommended = [t for t in weakest_list if t["subject"] in registered_subjects][:3]
    print(f"\n✓ Try 1 (from registered): {len(recommended)} topics found")
    
    # Try 2: If no registered subjects or no practice, use ANY weakest topics
    if not recommended and weakest_list:
        recommended = weakest_list[:3]
        print(f"✓ Try 2 (fallback to any): {len(recommended)} topics found")
    
    # Try 3: If no practice history, suggest starting topics
    if not recommended:
        print("✓ Try 3 (no practice): Would suggest foundational topics")
    
    print(f"\n✓ FINAL RECOMMENDATIONS ({len(recommended)} topics):")
    for i, t in enumerate(recommended, 1):
        acc_str = f"{t['accuracy']}%" if t['accuracy'] is not None else "N/A"
        print(f"  {i}. {t['subject']}: {t['topic']} ({acc_str})")
    
    conn.close()
    return {
        "overall_accuracy": overall_accuracy,
        "total_attempts": total_attempts,
        "recommended_count": len(recommended),
        "recommended_topics": recommended,
        "department": department,
        "registered_subjects": registered_subjects
    }

if __name__ == '__main__':
    result = test_dashboard_stats(3)
    print("\n" + "="*50)
    print("READY TO DISPLAY" if result["recommended_count"] > 0 else "NO RECOMMENDATIONS")
    print("="*50)
