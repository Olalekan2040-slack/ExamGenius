"""
Import all JAMB questions (all subjects/years) from the new JAMB copy folder into the database.
Handles questions, options, topics, subtopics, and image paths.
"""
import sqlite3
import json
from pathlib import Path
import os

def import_all_jamb_questions():
    db_path = Path(__file__).parent.parent / "jamb_questions.db"
    jamb_root = Path(__file__).parent.parent / "JAMB copy"

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Ensure subtopic and explanation columns exist
    cursor.execute("PRAGMA table_info(questions)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'subtopic' not in columns:
        cursor.execute("ALTER TABLE questions ADD COLUMN subtopic TEXT")
        conn.commit()
    if 'explanation' not in columns:
        cursor.execute("ALTER TABLE questions ADD COLUMN explanation TEXT")
        conn.commit()

    subjects = [d for d in jamb_root.iterdir() if d.is_dir() and d.name.lower() not in ("images",)]
    total_inserted = 0
    total_updated = 0

    for subject_dir in subjects:
        subject = subject_dir.name
        print(f"\n=== Importing subject: {subject} ===")
        year_folders = [y for y in subject_dir.iterdir() if y.is_dir()]
        for year_folder in year_folders:
            year = year_folder.name
            questions_file = year_folder / "questions.json"
            if not questions_file.exists():
                continue
            with open(questions_file, 'r', encoding='utf-8') as f:
                try:
                    questions = json.load(f)
                except Exception as e:
                    print(f"  Error reading {questions_file}: {e}")
                    continue
            print(f"  {subject} {year}: {len(questions)} questions")
            for q in questions:
                question_id = q.get('id') or f"JAMB_{subject}_{year}_{q.get('number', '0')}"
                cursor.execute("SELECT id FROM questions WHERE id = ?", (question_id,))
                exists = cursor.fetchone()
                # Prefer 'image' or 'image_path' key, else None
                image_path = q.get('image') or q.get('image_path')
                # Prepare predicted_topics and predicted_subtopics as JSON strings
                predicted_topics = q.get('predicted_topics')
                predicted_subtopics = q.get('predicted_subtopics')
                import json as _json
                predicted_topics_str = _json.dumps(predicted_topics) if predicted_topics is not None else None
                predicted_subtopics_str = _json.dumps(predicted_subtopics) if predicted_subtopics is not None else None

                # Insert or update question
                if exists:
                    cursor.execute("""
                        UPDATE questions SET exam=?, subject=?, year=?, number=?, question=?, topic=?, subtopic=?, source=?, image_path=?, correct_option_key=?, explanation=?, predicted_topics=?, predicted_subtopics=? WHERE id=?
                    """, (
                        q.get('exam', 'JAMB'), subject, year, q.get('number'), q.get('question'),
                        q.get('topic'), q.get('subtopic'), q.get('source'), image_path,
                        q.get('correct_answer'), q.get('explanation'),
                        predicted_topics_str, predicted_subtopics_str, question_id
                    ))
                    total_updated += 1
                else:
                    cursor.execute("""
                        INSERT INTO questions (id, exam, subject, year, number, question, topic, subtopic, source, image_path, correct_option_key, explanation, predicted_topics, predicted_subtopics)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        question_id, q.get('exam', 'JAMB'), subject, year, q.get('number'), q.get('question'),
                        q.get('topic'), q.get('subtopic'), q.get('source'), image_path,
                        q.get('correct_answer'), q.get('explanation'),
                        predicted_topics_str, predicted_subtopics_str
                    ))
                    # Insert options
                    options = q.get('options', {})
                    correct_answer = q.get('correct_answer', '')
                    for key, text in options.items():
                        cursor.execute("""
                            INSERT INTO options (question_id, option_key, option_text, is_correct)
                            VALUES (?, ?, ?, ?)
                        """, (question_id, key, text.strip() if isinstance(text, str) else str(text), 1 if key == correct_answer else 0))
                    total_inserted += 1
            conn.commit()
    print(f"\n{'='*50}")
    print(f"JAMB Import Complete!")
    print(f"  New questions inserted: {total_inserted}")
    print(f"  Existing questions updated: {total_updated}")
    conn.close()

if __name__ == "__main__":
    import_all_jamb_questions()
