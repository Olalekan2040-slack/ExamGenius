"""
Script to update image paths for all questions from JSON files
Scans all JAMB JSON files and updates database with correct image paths
"""

import sqlite3
import json
from pathlib import Path

JAMB_DIR = Path(__file__).parent.parent / "JAMB"
DB_PATH = Path(__file__).parent.parent / "jamb_questions.db"
STATIC_IMAGES_DIR = Path(__file__).parent.parent / "static" / "images"

def update_image_paths():
    """Scan JSON files and update database with correct image paths"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    subjects = ["Physics", "Biology", "Chemistry", "Mathematics", "Economics", 
                "Government", "Commerce", "English", "Literature", "Accounting"]
    
    updated = 0
    not_found = 0
    
    for subject in subjects:
        subject_dir = JAMB_DIR / subject
        if not subject_dir.exists():
            continue
            
        for year_dir in sorted(subject_dir.iterdir()):
            if not year_dir.is_dir():
                continue
                
            json_file = year_dir / "questions.json"
            if not json_file.exists():
                continue
                
            year = year_dir.name
            
            try:
                with open(json_file, encoding='utf-8') as f:
                    questions = json.load(f)
            except:
                try:
                    with open(json_file, encoding='utf-8-sig') as f:
                        questions = json.load(f)
                except Exception as e:
                    print(f"Error reading {json_file}: {e}")
                    continue
            
            for q in questions:
                image_ref = q.get('image')
                images_array = q.get('images', [])
                q_number = q.get('number')
                q_id = f"JAMB_{subject}_{year}_{q_number}"
                
                # Determine the image filename
                image_filename = None
                
                if image_ref:
                    # Extract filename from path like "images/JAMB_Physics_2024_3.png"
                    image_filename = Path(image_ref).name
                elif images_array:
                    # Use the first image from the array
                    image_filename = images_array[0].get('filename')
                
                if image_filename:
                    # Check if file exists in static/images
                    static_path = STATIC_IMAGES_DIR / image_filename
                    
                    if static_path.exists():
                        # Update database
                        new_path = f"/static/images/{image_filename}"
                        cursor.execute(
                            "UPDATE questions SET image_path = ? WHERE id = ?",
                            (new_path, q_id)
                        )
                        if cursor.rowcount > 0:
                            updated += 1
                    else:
                        # Try alternative filename patterns
                        alt_patterns = [
                            f"JAMB_{subject}_{year}_{q_number}.png",
                            f"JAMB_{subject}_{year}_{q_number}.jpg",
                            f"JAMB_{subject}_{year}_{q_number}.jpeg",
                            f"{subject}_{year}_q{q_number}_*.png",
                            f"{subject}_{year}_q{q_number}_*.jpg",
                        ]
                        
                        found = False
                        for pattern in alt_patterns[:3]:  # Try exact patterns first
                            test_path = STATIC_IMAGES_DIR / pattern
                            if test_path.exists():
                                new_path = f"/static/images/{pattern}"
                                cursor.execute(
                                    "UPDATE questions SET image_path = ? WHERE id = ?",
                                    (new_path, q_id)
                                )
                                if cursor.rowcount > 0:
                                    updated += 1
                                    found = True
                                    break
                        
                        if not found:
                            # Try glob patterns
                            for pattern in [f"JAMB_{subject}_{year}_{q_number}.*", f"{subject}_{year}_q{q_number}*"]:
                                matches = list(STATIC_IMAGES_DIR.glob(pattern))
                                if matches:
                                    new_path = f"/static/images/{matches[0].name}"
                                    cursor.execute(
                                        "UPDATE questions SET image_path = ? WHERE id = ?",
                                        (new_path, q_id)
                                    )
                                    if cursor.rowcount > 0:
                                        updated += 1
                                        found = True
                                        break
                        
                        if not found:
                            not_found += 1
    
    conn.commit()
    
    # Print summary
    cursor.execute("SELECT COUNT(*) FROM questions WHERE image_path IS NOT NULL AND image_path != ''")
    total_with_images = cursor.fetchone()[0]
    
    print(f"\n✅ Updated {updated} image paths")
    print(f"⚠️ {not_found} images referenced but not found")
    print(f"📊 Total questions with images: {total_with_images}")
    
    # Show sample paths
    cursor.execute("SELECT id, image_path FROM questions WHERE image_path IS NOT NULL AND image_path != '' ORDER BY RANDOM() LIMIT 5")
    print("\n📝 Sample image paths:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
    
    conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Updating Question Image Paths")
    print("=" * 60)
    update_image_paths()
