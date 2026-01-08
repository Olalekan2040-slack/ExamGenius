#!/usr/bin/env python3
"""
Verify that all subjects have proper topic tagging for Learn Topics view
Tests that empty-topic issues have been resolved with fallback strategy
"""

import psycopg2
import sys
from collections import defaultdict

def main():
    try:
        conn = psycopg2.connect(
            dbname='ExamgeniusDB',
            user='postgres',
            password='Policewomen@007',
            host='localhost',
            port=5432
        )
        cur = conn.cursor()

        print("=" * 80)
        print("LEARN TOPICS VERIFICATION REPORT")
        print("=" * 80)
        
        # 1. Check total questions per subject
        print("\n1. QUESTION DISTRIBUTION BY SUBJECT:")
        print("-" * 80)
        cur.execute("""
            SELECT subject, COUNT(*) as total
            FROM questions
            WHERE exam = 'JAMB'
            GROUP BY subject
            ORDER BY total DESC
        """)
        total_questions = 0
        for row in cur.fetchall():
            print(f"   {row[0]:20} {row[1]:6} questions")
            total_questions += row[1]
        print(f"\n   TOTAL: {total_questions} questions")

        # 2. Check empty topics (CRITICAL!)
        print("\n2. EMPTY TOPIC VERIFICATION:")
        print("-" * 80)
        cur.execute("""
            SELECT subject, COUNT(*) as empty_count
            FROM questions
            WHERE exam = 'JAMB' AND (topic IS NULL OR topic = '')
            GROUP BY subject
        """)
        empty_rows = cur.fetchall()
        if not empty_rows:
            print("   ✅ PASS: No empty topics found!")
        else:
            print("   ❌ FAIL: Found empty topics:")
            for row in empty_rows:
                print(f"   {row[0]:20} {row[1]:6} empty topics")
        
        # 3. Topic count per subject
        print("\n3. TOPICS PER SUBJECT (for Learn Topics view):")
        print("-" * 80)
        cur.execute("""
            SELECT subject, COUNT(DISTINCT topic) as topic_count, COUNT(*) as question_count
            FROM questions
            WHERE exam = 'JAMB'
            GROUP BY subject
            ORDER BY topic_count DESC
        """)
        for row in cur.fetchall():
            print(f"   {row[0]:20} {row[1]:2} topics  ({row[2]:5} questions)")

        # 4. Topic distribution for key subjects
        print("\n4. TOP 5 TOPICS PER SUBJECT (sample):")
        print("-" * 80)
        subjects_to_check = ['Physics', 'Art', 'French', 'Geography', 'History']
        for subj in subjects_to_check:
            cur.execute("""
                SELECT topic, COUNT(*) as cnt
                FROM questions
                WHERE exam = 'JAMB' AND subject = %s
                GROUP BY topic
                ORDER BY cnt DESC
                LIMIT 5
            """, (subj,))
            
            print(f"\n   {subj}:")
            for row in cur.fetchall():
                print(f"      {row[0]:35} {row[1]:4} questions")

        # 5. API Response simulation (what /learn/topics/{subject} would return)
        print("\n5. API RESPONSE SIMULATION (Physics):")
        print("-" * 80)
        cur.execute("""
            SELECT topic, COUNT(*) as question_count
            FROM questions
            WHERE exam = 'JAMB' AND subject = 'Physics'
            GROUP BY topic
            ORDER BY topic
            LIMIT 5
        """)
        print('   GET /api/v1/learn/topics/Physics')
        print('   Response:')
        topics = cur.fetchall()
        for row in topics:
            print(f'     - topic: "{row[0]}"')
            print(f'       question_count: {row[1]}')
            print(f'       last_score: null')
            print(f'       attempts: 0')
        print(f'   ... and {len(cur.fetchall())} more topics' if len(topics) > 5 else '')

        # 6. Summary validation
        print("\n" + "=" * 80)
        print("VALIDATION SUMMARY:")
        print("=" * 80)
        
        cur.execute("SELECT COUNT(*) FROM questions WHERE exam='JAMB'")
        total = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM questions WHERE exam='JAMB' AND (topic IS NULL OR topic='')")
        empty = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(DISTINCT subject) FROM questions WHERE exam='JAMB'")
        subjects = cur.fetchone()[0]
        
        print(f"✅ Total questions: {total}")
        print(f"✅ Empty topics: {empty}")
        print(f"✅ Subjects with topics: {subjects}")
        print(f"✅ Learn Topics view ready: {'YES - All {total} questions tagged' if empty == 0 else 'NO - Fix required'}")
        
        conn.close()
        return 0 if empty == 0 else 1

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
