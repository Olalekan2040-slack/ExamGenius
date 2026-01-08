"""
Quick verification script for tagged physics questions
"""
import psycopg2
from psycopg2.extras import DictCursor

def verify_tagging():
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        database='ExamgeniusDB',
        user='postgres',
        password='Policewomen@007',
        cursor_factory=DictCursor
    )
    
    try:
        cur = conn.cursor()
        
        # Get topic distribution
        print("\n" + "="*70)
        print("PHYSICS QUESTION TAGGING VERIFICATION")
        print("="*70)
        
        # Total Physics questions
        cur.execute("SELECT COUNT(*) FROM questions WHERE subject='Physics'")
        total = cur.fetchone()[0]
        print(f"\nTotal Physics Questions: {total}")
        
        # Tagged questions
        cur.execute("SELECT COUNT(*) FROM questions WHERE subject='Physics' AND topic IS NOT NULL")
        tagged = cur.fetchone()[0]
        print(f"Tagged Questions: {tagged}")
        print(f"Untagged Questions: {total - tagged}")
        print(f"Tagging Coverage: {(tagged/total)*100:.1f}%")
        
        # Topic distribution
        print("\n" + "-"*70)
        print("TOP 15 TOPICS BY QUESTION COUNT")
        print("-"*70)
        cur.execute("""
            SELECT topic, COUNT(*) as count 
            FROM questions 
            WHERE subject='Physics' AND topic IS NOT NULL 
            GROUP BY topic 
            ORDER BY count DESC 
            LIMIT 15
        """)
        
        for i, row in enumerate(cur.fetchall(), 1):
            print(f"{i:2}. {row['topic'][:45]:45} | {row['count']:3} questions")
        
        # Sample tagged questions
        print("\n" + "-"*70)
        print("SAMPLE TAGGED QUESTIONS")
        print("-"*70)
        cur.execute("""
            SELECT question, topic, subtopic 
            FROM questions 
            WHERE subject='Physics' AND topic IS NOT NULL 
            LIMIT 5
        """)
        
        for i, row in enumerate(cur.fetchall(), 1):
            print(f"\n{i}. Question: {row['question'][:80]}...")
            print(f"   Topic: {row['topic']}")
            print(f"   Subtopic: {row['subtopic'] or 'N/A'}")
        
        print("\n" + "="*70)
        print("✅ Verification Complete!")
        print("="*70 + "\n")
        
    finally:
        conn.close()

if __name__ == "__main__":
    verify_tagging()
