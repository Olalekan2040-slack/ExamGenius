"""
Import/Update Physics questions from JAMB folder to database.
- Adds new years (2010-2019) 
- Updates existing years with subtopic/explanation data
- Adds subtopic column if missing
"""
import sqlite3
import json
from pathlib import Path


def update_physics_questions():
    db_path = Path(__file__).parent.parent / "jamb_questions.db"
    jamb_path = Path(__file__).parent.parent / "JAMB" / "Physics"
    
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Check if subtopic column exists, add if not
    cursor.execute("PRAGMA table_info(questions)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'subtopic' not in columns:
        print("Adding subtopic column to questions table...")
        cursor.execute("ALTER TABLE questions ADD COLUMN subtopic TEXT")
        conn.commit()
    
    if 'explanation' not in columns:
        print("Adding explanation column to questions table...")
        cursor.execute("ALTER TABLE questions ADD COLUMN explanation TEXT")
        conn.commit()
    
    # Get all year folders
    year_folders = sorted([f for f in jamb_path.iterdir() if f.is_dir()])
    
    total_inserted = 0
    total_updated = 0
    
    for year_folder in year_folders:
        year = int(year_folder.name)
        questions_file = year_folder / "questions.json"
        
        if not questions_file.exists():
            print(f"  Skipping {year}: no questions.json")
            continue
        
        with open(questions_file, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        print(f"\nProcessing Physics {year}: {len(questions)} questions")
        
        for q in questions:
            question_id = q.get('id', f"JAMB_Physics_{year}_{q.get('number', '0')}")
            
            # Check if question exists
            cursor.execute("SELECT id FROM questions WHERE id = ?", (question_id,))
            exists = cursor.fetchone()
            
            if exists:
                # Update with new subtopic/explanation
                cursor.execute("""
                    UPDATE questions 
                    SET subtopic = ?, explanation = ?, topic = ?
                    WHERE id = ?
                """, (
                    q.get('subtopic'),
                    q.get('explanation'),
                    q.get('topic'),
                    question_id
                ))
                total_updated += 1
            else:
                # Insert new question
                cursor.execute("""
                    INSERT INTO questions (id, exam, subject, year, number, question, topic, subtopic, source, image_path, correct_option_key, explanation)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    question_id,
                    q.get('exam', 'JAMB'),
                    q.get('subject', 'Physics'),
                    year,
                    q.get('number'),
                    q.get('question'),
                    q.get('topic'),
                    q.get('subtopic'),
                    q.get('source'),
                    q.get('image') or q.get('image_path'),
                    q.get('correct_answer'),
                    q.get('explanation')
                ))
                
                # Insert options
                options = q.get('options', {})
                correct_answer = q.get('correct_answer', '')
                for key, text in options.items():
                    cursor.execute("""
                        INSERT INTO options (question_id, option_key, option_text, is_correct)
                        VALUES (?, ?, ?, ?)
                    """, (question_id, key, text, 1 if key == correct_answer else 0))
                
                total_inserted += 1
        
        conn.commit()
        print(f"  Year {year}: done")
    
    # Summary
    cursor.execute("SELECT COUNT(*) FROM questions WHERE subject = 'Physics'")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT DISTINCT year FROM questions WHERE subject = 'Physics' ORDER BY year")
    years = [r[0] for r in cursor.fetchall()]
    
    print(f"\n{'='*50}")
    print(f"Physics Import Complete!")
    print(f"  New questions inserted: {total_inserted}")
    print(f"  Existing questions updated: {total_updated}")
    print(f"  Total Physics questions: {total}")
    print(f"  Years covered: {years}")
    print(f"{'='*50}")
    
    conn.close()


if __name__ == "__main__":
    update_physics_questions()
