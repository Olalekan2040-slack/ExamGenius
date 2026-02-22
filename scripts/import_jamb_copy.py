"""
Import all JAMB copy questions into PostgreSQL database
Handles questions, options, topics, and subtopics from JAMB copy folder
Automatically tags Physics questions with proper topics/subtopics
"""
import psycopg2
import json
from pathlib import Path
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings


def import_jamb_copy_questions():
    """Import all JAMB copy questions from the JAMB copy folder into PostgreSQL"""
    
    # Connect using DATABASE_URL from settings
    try:
        conn = psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)
    except psycopg2.Error as e:
        print(f"ERROR: Cannot connect to database: {e}")
        return
    
    cursor = conn.cursor()
    
    # Get JAMB copy directory
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    
    if not jamb_root.exists():
        print(f"ERROR: JAMB copy directory not found at {jamb_root}")
        return
    
    subjects = [d for d in jamb_root.iterdir() if d.is_dir() and d.name.lower() not in ("images",)]
    total_inserted = 0
    total_updated = 0
    total_errors = 0
    
    print("="*70)
    print("JAMB COPY QUESTION IMPORT")
    print("="*70)
    print(f"Found {len(subjects)} subjects to import")
    print("="*70)
    
    for subject_dir in sorted(subjects):
        subject = subject_dir.name
        print(f"\n=== Processing: {subject} ===")
        
        year_folders = sorted([y for y in subject_dir.iterdir() if y.is_dir()])
        subject_inserted = 0
        subject_updated = 0
        subject_errors = 0
        
        for year_folder in year_folders:
            year = year_folder.name
            questions_file = year_folder / "questions.json"
            
            if not questions_file.exists():
                continue
            
            try:
                with open(questions_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Reset transaction if it's broken
                try:
                    conn.rollback()
                except:
                    pass
                
                if not isinstance(data, list):
                    print(f"  [ERROR] {year}: Invalid format (not a list)")
                    subject_errors += 1
                    total_errors += 1
                    continue
                
                for question_data in data:
                    try:
                        # Extract fields
                        exam = question_data.get('exam', 'JAMB')
                        year_int = int(year)
                        number = question_data.get('number', '')
                        question_text = question_data.get('question', '').strip()
                        options = question_data.get('options', {})
                        correct_option_key = question_data.get('correct_answer', '')
                        explanation = question_data.get('explanation', '')
                        topic = question_data.get('topic', '')
                        subtopic = question_data.get('subtopic', '')
                        
                        if not question_text:
                            subject_errors += 1
                            total_errors += 1
                            continue
                        
                        # Check if question already exists
                        cursor.execute(
                            "SELECT id FROM questions WHERE subject=%s AND year=%s AND number=%s",
                            (subject, year_int, number)
                        )
                        existing = cursor.fetchone()
                        
                        if existing:
                            # Update existing question
                            cursor.execute(
                                """UPDATE questions 
                                SET question=%s, correct_option_key=%s, explanation=%s, topic=%s, subtopic=%s
                                WHERE id=%s""",
                                (question_text, correct_option_key, explanation, topic, subtopic, existing[0])
                            )
                            subject_updated += 1
                            total_updated += 1
                        else:
                            # Insert new question (without id, let DB generate it)
                            cursor.execute(
                                """INSERT INTO questions 
                                (exam, subject, year, number, question, correct_option_key, explanation, topic, subtopic)
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                                (exam, subject, year_int, number, question_text, correct_option_key, explanation, topic, subtopic)
                            )
                            subject_inserted += 1
                            total_inserted += 1
                        
                    except Exception as e:
                        subject_errors += 1
                        total_errors += 1
                        if subject_errors <= 3:  # Print first few errors only
                            print(f"        Error in question: {e}")
                        continue
                
                if len(data) > 0:
                    print(f"  [OK] {year}: {len(data)} questions (new: {subject_inserted}, updated: {subject_updated})")
                
            except json.JSONDecodeError as e:
                print(f"  [ERROR] {year}: Invalid JSON - {e}")
                subject_errors += 1
                total_errors += 1
                continue
            except Exception as e:
                print(f"  [ERROR] {year}: Error - {e}")
                subject_errors += 1
                total_errors += 1
                continue
        
        print(f"  Summary: {subject_inserted} inserted, {subject_updated} updated, {subject_errors} errors")
    
    # Commit changes
    conn.commit()
    
    print("\n" + "="*70)
    print("IMPORT SUMMARY")
    print("="*70)
    print(f"Total Inserted: {total_inserted}")
    print(f"Total Updated: {total_updated}")
    print(f"Total Errors: {total_errors}")
    print("="*70)
    
    # Close connection
    cursor.close()
    conn.close()
    
    # Now tag Physics questions
    if total_inserted > 0 or total_updated > 0:
        print("\n" + "="*70)
        print("TAGGING PHYSICS QUESTIONS")
        print("="*70)
        tag_physics_questions()


def tag_physics_questions():
    """Tag Physics questions with topics and subtopics using ML"""
    from app.db.database import PostgresConnectionCompat
    from app.core.config import settings
    
    try:
        db = PostgresConnectionCompat(settings.DATABASE_URL)
        cursor = db.cursor()
        
        # Import the tagging system
        from scripts.tag_physics_questions import PhysicsQuestionTagger
        
        tagger = PhysicsQuestionTagger()
        
        # Get all untagged Physics questions
        cursor.execute("""
            SELECT id, question 
            FROM questions 
            WHERE subject='Physics' AND (topic IS NULL OR topic = '')
            ORDER BY id
        """)
        
        questions = cursor.fetchall()
        print(f"Found {len(questions)} untagged Physics questions")
        
        if len(questions) == 0:
            print("No untagged Physics questions found")
            return
        
        # Tag questions
        tagged_count = 0
        for i, row in enumerate(questions, 1):
            question_id = row['id']
            question_text = row['question']
            
            # Get topic and subtopic
            topic, subtopic = tagger.predict_topic(question_text)
            
            if topic:
                # Update question
                cursor.execute("""
                    UPDATE questions 
                    SET topic=%s, subtopic=%s 
                    WHERE id=%s
                """, (topic, subtopic, question_id))
                tagged_count += 1
            
            if i % 100 == 0:
                print(f"  Processed {i}/{len(questions)} questions...")
                db.commit()
        
        # Final commit
        db.commit()
        
        print(f"[OK] Successfully tagged {tagged_count} Physics questions")
        
        # Get tag distribution
        cursor.execute("""
            SELECT topic, COUNT(*) as count 
            FROM questions 
            WHERE subject='Physics' AND topic IS NOT NULL 
            GROUP BY topic 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print("\nTop 10 Physics Topics:")
        for row in cursor.fetchall():
            print(f"  {row['topic']:45} | {row['count']:3} questions")
        
        db.close()
        
    except Exception as e:
        print(f"Error tagging Physics questions: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    import_jamb_copy_questions()
