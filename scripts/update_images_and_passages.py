"""
Update Questions with Images and Passages from JAMB Copy Folder

This script:
1. Scans all subject/year folders in JAMB copy
2. Updates image_path for questions that have images (based on naming convention)
3. Updates passage field for questions with passages
4. Copies images to static/images folder for serving

Image naming convention: Subject_Year_qNumber_hash.jpeg
Example: Physics_2018_q17_f47b6716.jpeg -> Question number 17 for Physics 2018
"""

import os
import json
import shutil
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import psycopg2
from psycopg2.extras import DictCursor

# Add parent directory to path to import app config
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings

# Database configuration - use app settings
DATABASE_URL = settings.DATABASE_URL

# Paths
JAMB_COPY_DIR = Path(__file__).parent.parent / "JAMB copy"
STATIC_IMAGES_DIR = Path(__file__).parent.parent / "static" / "images" / "questions"


def get_connection():
    """Get database connection"""
    return psycopg2.connect(DATABASE_URL)


def ensure_static_images_dir():
    """Create static images directory if it doesn't exist"""
    STATIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Static images directory: {STATIC_IMAGES_DIR}")


def parse_image_filename(filename: str) -> Optional[Tuple[str, int, str]]:
    """
    Parse image filename to extract subject, year, and question number.
    
    Format: Subject_Year_qNumber_hash.extension
    Example: Physics_2018_q17_f47b6716.jpeg
    
    Returns: (subject, year, question_number) or None if parsing fails
    """
    # Pattern: Subject_Year_qNumber_hash.extension
    pattern = r'^([A-Za-z\s]+)_(\d{4})_q(\d+)_[a-f0-9]+\.(jpeg|jpg|png|gif)$'
    match = re.match(pattern, filename, re.IGNORECASE)
    
    if match:
        subject = match.group(1).strip()
        year = int(match.group(2))
        question_number = match.group(3)
        return (subject, year, question_number)
    
    return None


def copy_image_to_static(src_path: Path, subject: str, year: int, question_number: str) -> str:
    """
    Copy image to static folder with standardized naming.
    
    Returns the relative URL path for serving.
    """
    # Standardize filename
    extension = src_path.suffix.lower()
    new_filename = f"{subject}_{year}_q{question_number}{extension}"
    dest_path = STATIC_IMAGES_DIR / new_filename
    
    try:
        shutil.copy2(src_path, dest_path)
        # Return URL path (relative to static)
        return f"/static/images/questions/{new_filename}"
    except Exception as e:
        print(f"  Error copying {src_path}: {e}")
        return None


def scan_and_update_images():
    """Scan JAMB copy folders and update image paths in database"""
    ensure_static_images_dir()
    
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    total_images_found = 0
    total_images_updated = 0
    total_images_copied = 0
    
    print("\n" + "="*70)
    print("SCANNING FOR QUESTION IMAGES")
    print("="*70)
    
    if not JAMB_COPY_DIR.exists():
        print(f"JAMB copy directory not found: {JAMB_COPY_DIR}")
        return
    
    # Iterate through subject folders
    for subject_dir in sorted(JAMB_COPY_DIR.iterdir()):
        if not subject_dir.is_dir() or subject_dir.name == 'images':
            continue
        
        subject = subject_dir.name
        subject_images = 0
        
        # Iterate through year folders
        for year_folder in sorted(subject_dir.iterdir()):
            if not year_folder.is_dir():
                continue
            
            year = year_folder.name
            images_dir = year_folder / "images"
            
            if not images_dir.exists():
                continue
            
            # Process each image in the images folder
            for image_file in images_dir.iterdir():
                if not image_file.is_file():
                    continue
                
                total_images_found += 1
                
                # Parse the filename
                parsed = parse_image_filename(image_file.name)
                if not parsed:
                    # Try alternative pattern: just extract question number
                    alt_match = re.search(r'q(\d+)', image_file.name, re.IGNORECASE)
                    if alt_match:
                        parsed = (subject, int(year), alt_match.group(1))
                    else:
                        continue
                
                img_subject, img_year, q_number = parsed
                
                # Copy image to static folder
                url_path = copy_image_to_static(image_file, subject, int(year), q_number)
                if not url_path:
                    continue
                
                total_images_copied += 1
                
                # Update database - find matching question
                question_id = f"JAMB_{subject}_{year}_{q_number}"
                
                try:
                    # Try exact match first
                    cursor.execute(
                        """UPDATE questions 
                        SET image_path = %s 
                        WHERE id = %s AND image_path IS NULL""",
                        (url_path, question_id)
                    )
                    
                    if cursor.rowcount == 0:
                        # Try matching by subject, year, number
                        cursor.execute(
                            """UPDATE questions 
                            SET image_path = %s 
                            WHERE subject = %s AND year = %s AND number = %s AND image_path IS NULL""",
                            (url_path, subject, int(year), q_number)
                        )
                    
                    if cursor.rowcount > 0:
                        total_images_updated += 1
                        subject_images += 1
                
                except Exception as e:
                    print(f"  Error updating {question_id}: {e}")
                    conn.rollback()
                    continue
            
            conn.commit()
        
        if subject_images > 0:
            print(f"  {subject}: {subject_images} images linked")
    
    conn.close()
    
    print(f"\nImages found: {total_images_found}")
    print(f"Images copied: {total_images_copied}")
    print(f"Database updated: {total_images_updated}")


def scan_and_update_passages():
    """Scan questions.json files and update passages in database"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    total_passages_found = 0
    total_passages_updated = 0
    
    print("\n" + "="*70)
    print("SCANNING FOR QUESTION PASSAGES")
    print("="*70)
    
    if not JAMB_COPY_DIR.exists():
        print(f"JAMB copy directory not found: {JAMB_COPY_DIR}")
        return
    
    # Track passages by subject+year to avoid duplicating passages per question
    passage_cache: Dict[str, str] = {}
    
    # Iterate through subject folders
    for subject_dir in sorted(JAMB_COPY_DIR.iterdir()):
        if not subject_dir.is_dir() or subject_dir.name == 'images':
            continue
        
        subject = subject_dir.name
        subject_passages = 0
        
        # Iterate through year folders
        for year_folder in sorted(subject_dir.iterdir()):
            if not year_folder.is_dir():
                continue
            
            year = year_folder.name
            questions_file = year_folder / "questions.json"
            
            if not questions_file.exists():
                continue
            
            try:
                with open(questions_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if not isinstance(data, list):
                    continue
                
                for question_data in data:
                    passage = question_data.get('passage', '').strip()
                    
                    if not passage or len(passage) < 50:  # Skip empty or very short passages
                        continue
                    
                    total_passages_found += 1
                    
                    number = str(question_data.get('number', '')).strip()
                    question_id = question_data.get('id') or f"JAMB_{subject}_{year}_{number}"
                    
                    try:
                        # Update passage in database
                        cursor.execute(
                            """UPDATE questions 
                            SET passage = %s 
                            WHERE id = %s""",
                            (passage, question_id)
                        )
                        
                        if cursor.rowcount == 0:
                            # Try by subject, year, number
                            cursor.execute(
                                """UPDATE questions 
                                SET passage = %s 
                                WHERE subject = %s AND year = %s AND number = %s""",
                                (passage, subject, int(year), number)
                            )
                        
                        if cursor.rowcount > 0:
                            total_passages_updated += 1
                            subject_passages += 1
                    
                    except Exception as e:
                        print(f"  Error updating passage for {question_id}: {e}")
                        conn.rollback()
                        continue
                
                conn.commit()
                
            except json.JSONDecodeError as e:
                print(f"  [ERROR] {subject}/{year}: Invalid JSON - {e}")
            except Exception as e:
                print(f"  [ERROR] {subject}/{year}: {e}")
        
        if subject_passages > 0:
            print(f"  {subject}: {subject_passages} passages updated")
    
    conn.close()
    
    print(f"\nPassages found: {total_passages_found}")
    print(f"Database updated: {total_passages_updated}")


def update_images_from_json():
    """Update image paths from 'images' array in questions.json files"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    total_images_found = 0
    total_images_updated = 0
    
    print("\n" + "="*70)
    print("UPDATING IMAGES FROM JSON 'images' ARRAY")
    print("="*70)
    
    if not JAMB_COPY_DIR.exists():
        print(f"JAMB copy directory not found: {JAMB_COPY_DIR}")
        return
    
    # Iterate through subject folders
    for subject_dir in sorted(JAMB_COPY_DIR.iterdir()):
        if not subject_dir.is_dir() or subject_dir.name == 'images':
            continue
        
        subject = subject_dir.name
        subject_images = 0
        
        # Iterate through year folders
        for year_folder in sorted(subject_dir.iterdir()):
            if not year_folder.is_dir():
                continue
            
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
                    images_array = question_data.get('images', [])
                    
                    if not images_array:
                        continue
                    
                    total_images_found += 1
                    
                    # Get first image filename
                    first_image = images_array[0]
                    filename = first_image.get('filename', '')
                    
                    if not filename:
                        continue
                    
                    # Check if image file exists
                    image_path = images_dir / filename
                    if not image_path.exists():
                        continue
                    
                    number = str(question_data.get('number', '')).strip()
                    question_id = question_data.get('id') or f"JAMB_{subject}_{year}_{number}"
                    
                    # Copy image to static folder
                    url_path = copy_image_to_static(image_path, subject, int(year), number)
                    if not url_path:
                        continue
                    
                    try:
                        # Update image_path in database
                        cursor.execute(
                            """UPDATE questions 
                            SET image_path = %s 
                            WHERE id = %s""",
                            (url_path, question_id)
                        )
                        
                        if cursor.rowcount == 0:
                            # Try by subject, year, number
                            cursor.execute(
                                """UPDATE questions 
                                SET image_path = %s 
                                WHERE subject = %s AND year = %s AND number = %s""",
                                (url_path, subject, int(year), number)
                            )
                        
                        if cursor.rowcount > 0:
                            total_images_updated += 1
                            subject_images += 1
                    
                    except Exception as e:
                        print(f"  Error updating image for {question_id}: {e}")
                        conn.rollback()
                        continue
                
                conn.commit()
                
            except json.JSONDecodeError as e:
                print(f"  [ERROR] {subject}/{year}: Invalid JSON - {e}")
            except Exception as e:
                print(f"  [ERROR] {subject}/{year}: {e}")
        
        if subject_images > 0:
            print(f"  {subject}: {subject_images} images linked from JSON")
    
    conn.close()
    
    print(f"\nImages in JSON: {total_images_found}")
    print(f"Database updated: {total_images_updated}")


def main():
    """Main function to run all updates"""
    print("="*70)
    print("EXAMGENIUS - IMAGE AND PASSAGE UPDATE SCRIPT")
    print("="*70)
    
    # First update from images array in JSON
    update_images_from_json()
    
    # Then scan image folders for any missed images
    scan_and_update_images()
    
    # Finally update passages
    scan_and_update_passages()
    
    print("\n" + "="*70)
    print("UPDATE COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
