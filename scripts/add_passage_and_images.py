"""
Add passage column to questions table and update import to handle images and passages
"""
import psycopg2
import json
import shutil
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def add_passage_column():
    """Add passage column to questions table if it doesn't exist"""
    try:
        conn = psycopg2.connect(
            dbname="ExamgeniusDB",
            user="postgres",
            password="Policewomen@007",
            host="localhost",
            port=5432
        )
    except psycopg2.Error as e:
        print(f"ERROR: Cannot connect to database: {e}")
        return False
    
    cursor = conn.cursor()
    
    try:
        # Check if passage column exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='questions' AND column_name='passage'
        """)
        
        if not cursor.fetchone():
            print("Adding 'passage' column to questions table...")
            cursor.execute("ALTER TABLE questions ADD COLUMN passage TEXT")
            conn.commit()
            print("[OK] Added 'passage' column")
        else:
            print("[OK] 'passage' column already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        conn.rollback()
        cursor.close()
        conn.close()
        return False


def copy_images_and_update_questions():
    """Copy images from JAMB copy folder to static folder and update questions with image paths and passages"""
    
    try:
        conn = psycopg2.connect(
            dbname="ExamgeniusDB",
            user="postgres",
            password="Policewomen@007",
            host="localhost",
            port=5432
        )
    except psycopg2.Error as e:
        print(f"ERROR: Cannot connect to database: {e}")
        return
    
    cursor = conn.cursor()
    
    # Paths
    jamb_root = Path(__file__).parent.parent / "JAMB copy"
    static_images = Path(__file__).parent.parent / "static" / "images" / "questions"
    
    # Create static images directory
    static_images.mkdir(parents=True, exist_ok=True)
    
    if not jamb_root.exists():
        print(f"ERROR: JAMB copy directory not found at {jamb_root}")
        return
    
    subjects = [d for d in jamb_root.iterdir() if d.is_dir() and d.name.lower() not in ("images",)]
    
    images_copied = 0
    passages_updated = 0
    questions_updated = 0
    
    print("="*70)
    print("UPDATING IMAGES AND PASSAGES")
    print("="*70)
    
    for subject_dir in sorted(subjects):
        subject = subject_dir.name
        year_folders = sorted([y for y in subject_dir.iterdir() if y.is_dir()])
        
        for year_folder in year_folders:
            year = year_folder.name
            questions_file = year_folder / "questions.json"
            images_dir = year_folder / "images"
            
            if not questions_file.exists():
                continue
            
            try:
                with open(questions_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if not isinstance(data, list):
                    continue
                
                for question_data in data:
                    try:
                        number = question_data.get('number', '')
                        image_path = question_data.get('image')
                        passage = question_data.get('passage', '')
                        
                        updates = []
                        params = []
                        
                        # Handle image
                        if image_path and images_dir.exists():
                            # Image path in JSON is like "images/JAMB_Physics_2020_8.jpeg"
                            image_filename = image_path.replace('images/', '')
                            source_image = images_dir / image_filename
                            
                            if source_image.exists():
                                # Create destination path: /static/images/questions/subject/year/filename
                                dest_dir = static_images / subject / year
                                dest_dir.mkdir(parents=True, exist_ok=True)
                                dest_path = dest_dir / image_filename
                                
                                # Copy image
                                shutil.copy2(source_image, dest_path)
                                images_copied += 1
                                
                                # Store relative path for API
                                api_path = f"/static/images/questions/{subject}/{year}/{image_filename}"
                                updates.append("image_path = %s")
                                params.append(api_path)
                        
                        # Handle passage
                        if passage and passage.strip():
                            updates.append("passage = %s")
                            params.append(passage.strip())
                            passages_updated += 1
                        
                        # Update database if we have changes
                        if updates:
                            params.extend([subject, int(year), str(number)])
                            cursor.execute(
                                f"UPDATE questions SET {', '.join(updates)} WHERE subject=%s AND year=%s AND number=%s",
                                params
                            )
                            questions_updated += 1
                        
                    except Exception as e:
                        continue
                
            except Exception as e:
                print(f"  [ERROR] {subject}/{year}: {e}")
                continue
    
    conn.commit()
    
    print(f"\n[OK] Images copied: {images_copied}")
    print(f"[OK] Passages updated: {passages_updated}")
    print(f"[OK] Questions updated: {questions_updated}")
    
    cursor.close()
    conn.close()


if __name__ == "__main__":
    print("Step 1: Adding passage column...")
    if add_passage_column():
        print("\nStep 2: Copying images and updating questions...")
        copy_images_and_update_questions()
    print("\nDone!")
