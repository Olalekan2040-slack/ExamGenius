"""
Import all JAMB questions into PostgreSQL database
Handles questions, options, topics, and subtopics from JAMB folder
"""
from app.core.config import settings
import psycopg2
import json
from pathlib import Path
from urllib.parse import urlparse
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def import_all_jamb_questions():
    """Import all JAMB questions from the JAMB folder into PostgreSQL"""

    # Connect using DATABASE_URL from settings
    conn = psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)
    cursor = conn.cursor()

    # Get JAMB directory — support both "JAMB copy" (local) and "JAMB" (server after rename)
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    if not jamb_root.exists():
        # Try plain "JAMB" as fallback (in case folder was renamed on server)
        jamb_root = Path(__file__).parent.parent / "JAMB"

    if not jamb_root.exists():
        print(
            f"ERROR: JAMB directory not found at {jamb_root} (tried 'JAMB copy' and 'JAMB')")
        return

    subjects = [d for d in jamb_root.iterdir() if d.is_dir()
                and d.name.lower() not in ("images",)]
    total_inserted = 0
    total_updated = 0
    total_errors = 0

    print(f"Found {len(subjects)} subjects to import")
    print("="*60)

    for subject_dir in subjects:
        subject = subject_dir.name
        print(f"\n=== Importing subject: {subject} ===")

        year_folders = [y for y in subject_dir.iterdir() if y.is_dir()]

        for year_folder in year_folders:
            year = year_folder.name
            questions_file = year_folder / "questions.json"

            if not questions_file.exists():
                continue

            try:
                with open(questions_file, 'r', encoding='utf-8') as f:
                    questions = json.load(f)
            except Exception as e:
                print(f"  Error reading {questions_file}: {e}")
                total_errors += 1
                continue

            print(f"  {subject} {year}: {len(questions)} questions")

            for q in questions:
                try:
                    question_id = q.get(
                        'id') or f"JAMB_{subject}_{year}_{q.get('number', '0')}"

                    # Check if question exists
                    cursor.execute(
                        "SELECT id FROM questions WHERE id = %s", (question_id,))
                    exists = cursor.fetchone()

                    # Get image path
                    image_path = q.get('image') or q.get('image_path')

                    # Prepare predicted topics/subtopics as JSON strings
                    predicted_topics = q.get('predicted_topics')
                    predicted_subtopics = q.get('predicted_subtopics')
                    predicted_topics_str = json.dumps(
                        predicted_topics) if predicted_topics else None
                    predicted_subtopics_str = json.dumps(
                        predicted_subtopics) if predicted_subtopics else None

                    if exists:
                        # Update existing question
                        cursor.execute("""
                            UPDATE questions 
                            SET exam=%s, subject=%s, year=%s, number=%s, question=%s, 
                                topic=%s, subtopic=%s, source=%s, image_path=%s, 
                                correct_option_key=%s, explanation=%s, 
                                predicted_topics=%s, predicted_subtopics=%s
                            WHERE id=%s
                        """, (
                            q.get('exam', 'JAMB'), subject, int(
                                year) if year.isdigit() else None,
                            q.get('number'), q.get('question'),
                            q.get('topic'), q.get('subtopic'), q.get(
                                'source'), image_path,
                            q.get('correct_answer'), q.get('explanation'),
                            predicted_topics_str, predicted_subtopics_str, question_id
                        ))
                        conn.commit()  # Commit after each update
                        total_updated += 1
                    else:
                        # Insert new question
                        cursor.execute("""
                            INSERT INTO questions 
                            (id, exam, subject, year, number, question, topic, subtopic, 
                             source, image_path, correct_option_key, explanation, 
                             predicted_topics, predicted_subtopics)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (
                            question_id, q.get('exam', 'JAMB'), subject,
                            int(year) if year.isdigit() else None,
                            q.get('number'), q.get('question'),
                            q.get('topic'), q.get('subtopic'), q.get(
                                'source'), image_path,
                            q.get('correct_answer'), q.get('explanation'),
                            predicted_topics_str, predicted_subtopics_str
                        ))

                        # Insert options
                        options = q.get('options', {})
                        correct_answer = q.get('correct_answer', '')

                        for key, text in options.items():
                            cursor.execute("""
                                INSERT INTO options (question_id, option_key, option_text, is_correct)
                                VALUES (%s, %s, %s, %s)
                            """, (
                                question_id, key,
                                text.strip() if isinstance(text, str) else str(text),
                                1 if key == correct_answer else 0
                            ))

                        conn.commit()  # Commit after each insert
                        total_inserted += 1

                except Exception as e:
                    conn.rollback()  # Rollback on error
                    print(
                        f"    Error importing question {q.get('id', 'unknown')}: {e}")
                    total_errors += 1
                    continue

    print("\n" + "="*60)
    print("JAMB Import Complete!")
    print(f"  New questions inserted: {total_inserted}")
    print(f"  Existing questions updated: {total_updated}")
    if total_errors > 0:
        print(f"  Errors encountered: {total_errors}")

    # Get totals
    cursor.execute("SELECT COUNT(*) FROM questions")
    total_questions = cursor.fetchone()[0]
    print(f"\nTotal questions in database: {total_questions}")

    # Get subject breakdown
    cursor.execute("""
        SELECT subject, COUNT(*) as count 
        FROM questions 
        GROUP BY subject 
        ORDER BY subject
    """)
    print("\nQuestions by subject:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} questions")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    print("Starting JAMB Questions Import to PostgreSQL...")
    print("="*60)
    import_all_jamb_questions()
