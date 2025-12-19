"""
Script to set up question images for ExamGenius
- Copies images from JAMB folder to static/images
- Updates database image_path to use correct static URL
"""

import os
import shutil
import sqlite3
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
JAMB_DIR = BASE_DIR / "JAMB"
STATIC_IMAGES_DIR = BASE_DIR / "static" / "images"
DB_PATH = BASE_DIR / "jamb_questions.db"

# Subjects that may have images
SUBJECTS = ["Physics", "Biology", "Chemistry", "Mathematics", "Economics", "Government", "Commerce", "English", "Literature", "Accounting"]

def setup_images():
    """Copy images from JAMB folder to static/images and update database"""
    
    # Create static/images directory
    STATIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {STATIC_IMAGES_DIR}")
    
    images_copied = 0
    images_found = []
    
    # Scan all subjects and years for images
    for subject in SUBJECTS:
        subject_dir = JAMB_DIR / subject
        if not subject_dir.exists():
            continue
            
        for year_dir in subject_dir.iterdir():
            if not year_dir.is_dir():
                continue
                
            images_dir = year_dir / "images"
            if not images_dir.exists():
                continue
                
            year = year_dir.name
            
            # Copy each image
            for image_file in images_dir.iterdir():
                if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
                    # Determine the proper filename pattern
                    # We want: JAMB_Subject_Year_Number.ext
                    filename = image_file.name
                    
                    # Copy to static/images
                    dest_path = STATIC_IMAGES_DIR / filename
                    if not dest_path.exists():
                        shutil.copy2(image_file, dest_path)
                        images_copied += 1
                        print(f"  Copied: {filename}")
                    
                    images_found.append({
                        'subject': subject,
                        'year': year,
                        'filename': filename,
                        'original_path': f"images/{filename}"
                    })
    
    print(f"\n✅ Copied {images_copied} images to {STATIC_IMAGES_DIR}")
    print(f"📁 Total images available: {len(images_found)}")
    
    # Update database to use correct static URLs
    update_database_paths()
    
    return images_found

def update_database_paths():
    """Update image_path in database to use /static/images/ prefix"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check current image paths
    cursor.execute("SELECT COUNT(*) FROM questions WHERE image_path IS NOT NULL AND image_path != ''")
    total_with_images = cursor.fetchone()[0]
    print(f"\n📊 Questions with image_path set: {total_with_images}")
    
    # Update paths that start with 'images/' to '/static/images/'
    cursor.execute("""
        UPDATE questions 
        SET image_path = '/static/' || image_path
        WHERE image_path IS NOT NULL 
        AND image_path != '' 
        AND image_path LIKE 'images/%'
        AND image_path NOT LIKE '/static/%'
    """)
    updated = cursor.rowcount
    conn.commit()
    
    print(f"✅ Updated {updated} image paths to use /static/ prefix")
    
    # Verify the update
    cursor.execute("SELECT id, image_path FROM questions WHERE image_path IS NOT NULL AND image_path != '' LIMIT 5")
    samples = cursor.fetchall()
    print("\n📝 Sample updated paths:")
    for sample in samples:
        print(f"  {sample[0]}: {sample[1]}")
    
    conn.close()

def verify_images():
    """Check which database image references have actual files"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, image_path FROM questions WHERE image_path IS NOT NULL AND image_path != ''")
    rows = cursor.fetchall()
    
    missing = []
    found = []
    
    for q_id, image_path in rows:
        # Convert path to actual file path
        if image_path.startswith('/static/'):
            file_path = BASE_DIR / image_path.lstrip('/')
        else:
            file_path = BASE_DIR / "static" / image_path
            
        if file_path.exists():
            found.append(q_id)
        else:
            missing.append((q_id, image_path, str(file_path)))
    
    print(f"\n🔍 Verification Results:")
    print(f"  ✅ Images found: {len(found)}")
    print(f"  ❌ Images missing: {len(missing)}")
    
    if missing:
        print("\n⚠️ Missing images (first 10):")
        for q_id, path, full_path in missing[:10]:
            print(f"  {q_id}: {path}")
    
    conn.close()
    return found, missing

if __name__ == "__main__":
    print("=" * 60)
    print("ExamGenius Question Images Setup")
    print("=" * 60)
    
    # Step 1: Copy images
    print("\n📂 Step 1: Copying images from JAMB folder...")
    setup_images()
    
    # Step 2: Verify images
    print("\n🔍 Step 2: Verifying image files...")
    verify_images()
    
    print("\n" + "=" * 60)
    print("✅ Image setup complete!")
    print("=" * 60)
