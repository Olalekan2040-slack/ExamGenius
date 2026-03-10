"""
Import all JAMB copy questions into PostgreSQL database
Fixed version: Properly handles transactions and INSERT errors
"""
import psycopg2
from psycopg2.extras import DictCursor
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings


def get_connection():
    """Create a fresh database connection"""
    return psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)


def import_jamb_copy_questions():
    """Import all JAMB copy questions from the JAMB copy folder into PostgreSQL"""
    
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    
    if not jamb_root.exists():
        print(f"ERROR: JAMB copy directory not found at {jamb_root}")
        return
    
    subjects = sorted([d for d in jamb_root.iterdir() if d.is_dir() and d.name.lower() not in ("images",)])
    total_inserted = 0
    total_updated = 0
    total_errors = 0
    
    print("="*70)
    print("JAMB COPY QUESTION IMPORT")
    print("="*70)
    print(f"Found {len(subjects)} subjects to import")
    print("="*70)
    
    for subject_dir in subjects:
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
            
            year_inserted = 0
            year_updated = 0
            year_errors = 0
            
            try:
                with open(questions_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if not isinstance(data, list):
                    print(f"  [ERROR] {year}: Invalid format (not a list)")
                    subject_errors += 1
                    total_errors += 1
                    continue
                
                # Use fresh connection for each year
                conn = get_connection()
                cursor = conn.cursor(cursor_factory=DictCursor)
                
                for question_data in data:
                    try:
                        # Extract fields
                        exam = question_data.get('exam', 'JAMB')
                        year_int = int(year)
                        number = str(question_data.get('number', '')).strip()
                        question_text = (question_data.get('question', '') or '').strip()
                        options = question_data.get('options', {}) or {}
                        correct_option_key = (question_data.get('correct_answer', '') or '').strip()
                        explanation = question_data.get('explanation', '')
                        topic = question_data.get('topic', '')
                        subtopic = question_data.get('subtopic', '')
                        source = question_data.get('source', '')
                        image_path = question_data.get('image', None)
                        table_html = question_data.get('table_html') or None
                        passage    = question_data.get('passage')    or None
                        if passage and not passage.strip():
                            passage = None

                        if not question_text:
                            year_errors += 1
                            continue

                        # Build deterministic question_id (use provided id if present)
                        question_id = question_data.get('id') or f"JAMB_{subject}_{year}_{number}"

                        # Upsert question
                        cursor.execute(
                            "SELECT id FROM questions WHERE id=%s",
                            (question_id,)
                        )
                        existing = cursor.fetchone()

                        if existing:
                            cursor.execute(
                                """UPDATE questions 
                                SET exam=%s, subject=%s, year=%s, number=%s, question=%s, topic=%s, subtopic=%s,
                                    source=%s, image_path=%s, correct_option_key=%s, explanation=%s,
                                    table_html=%s, passage=%s
                                WHERE id=%s""",
                                (
                                    exam, subject, year_int, number, question_text, topic, subtopic,
                                    source, image_path, correct_option_key, explanation,
                                    table_html, passage, question_id
                                )
                            )
                            year_updated += 1
                        else:
                            cursor.execute(
                                """INSERT INTO questions 
                                (id, exam, subject, year, number, question, topic, subtopic, source, image_path, correct_option_key, explanation, table_html, passage)
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """,
                                (
                                    question_id, exam, subject, year_int, number, question_text, topic,
                                    subtopic, source, image_path, correct_option_key, explanation,
                                    table_html, passage
                                )
                            )
                            year_inserted += 1

                        # Refresh options: replace existing with dataset options
                        cursor.execute("DELETE FROM options WHERE question_id=%s", (question_id,))
                        for opt_key, opt_text in options.items():
                            cursor.execute(
                                """INSERT INTO options (question_id, option_key, option_text, is_correct)
                                VALUES (%s, %s, %s, %s)""",
                                (question_id, opt_key, opt_text, 1 if opt_key == correct_option_key else 0)
                            )

                    except Exception as e:
                        conn.rollback()
                        year_errors += 1
                        continue
                
                # Commit at end of year
                conn.commit()
                conn.close()
                
                if len(data) > 0:
                    print(f"  [{year}] {len(data):4} questions | new: {year_inserted:3} | updated: {year_updated:3} | errors: {year_errors:3}")
                
                subject_inserted += year_inserted
                subject_updated += year_updated
                subject_errors += year_errors
                
            except json.JSONDecodeError as e:
                print(f"  [ERROR] {year}: Invalid JSON - {e}")
                subject_errors += 1
                total_errors += 1
            except Exception as e:
                print(f"  [ERROR] {year}: {e}")
                subject_errors += 1
                total_errors += 1
        
        print(f"  Summary: {subject_inserted} inserted, {subject_updated} updated, {subject_errors} errors")
        total_inserted += subject_inserted
        total_updated += subject_updated
        total_errors += subject_errors
    
    print("\n" + "="*70)
    print("IMPORT SUMMARY")
    print("="*70)
    print(f"Total Inserted: {total_inserted}")
    print(f"Total Updated: {total_updated}")
    print(f"Total Errors: {total_errors}")
    print("="*70)
    
    # Now tag Physics questions if we added any
    if total_inserted > 0 or total_updated > 0:
        print("\n" + "="*70)
        print("CHECKING PHYSICS QUESTION TAGS")
        print("="*70)
        tag_physics_questions()


def tag_physics_questions():
    """Tag Physics questions with topics and subtopics using ML"""
    try:
        from scripts.tag_physics_questions import PhysicsQuestionTagger  # type: ignore[import]
    except ImportError:
        print("scripts.tag_physics_questions not found – skipping ML tagging")
        return
    
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        
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
            conn.close()
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
                conn.commit()
        
        # Final commit
        conn.commit()
        conn.close()
        
        print(f"[OK] Successfully tagged {tagged_count} Physics questions")
        
        # Show tag distribution
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        
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
        
        conn.close()
        
    except Exception as e:
        print(f"Error tagging Physics questions: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    import_jamb_copy_questions()
