"""
Database Synchronization Service
Automatically imports questions and updates topics on startup
"""

import os
import sys
import logging
from pathlib import Path
from typing import Dict, List
import psycopg2
from psycopg2.extras import DictCursor
import re
from collections import defaultdict

# Setup logging
logger = logging.getLogger(__name__)

# Get project root
PROJECT_ROOT = Path(__file__).parent.parent.parent

DB_CONFIG = {
    'dbname': 'ExamgeniusDB',
    'user': 'postgres',
    'password': 'Policewomen@007',
    'host': 'localhost',
    'port': 5432
}


class DatabaseSyncService:
    """Handles automatic database synchronization on startup"""

    @staticmethod
    def should_sync() -> bool:
        """Check if DB sync should run based on environment variables"""
        # Only run in production or if explicitly enabled
        auto_sync = os.environ.get('DB_AUTO_SYNC', 'false').lower()
        return auto_sync in ('true', '1', 'yes')

    @staticmethod
    def check_questions_exist(conn) -> int:
        """Check how many questions exist in the database"""
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM questions WHERE exam='JAMB'")
            count = cursor.fetchone()[0]
            cursor.close()
            return count
        except Exception as e:
            logger.error(f"Error checking questions: {e}")
            return 0

    @staticmethod
    def import_questions(conn) -> Dict:
        """Import questions from JAMB copy folder"""
        logger.info("Starting question import from JAMB copy folder...")
        
        jamb_copy_dir = PROJECT_ROOT / "JAMB copy"
        if not jamb_copy_dir.exists():
            logger.warning(f"JAMB copy directory not found: {jamb_copy_dir}")
            return {'status': 'skipped', 'reason': 'no_data_folder'}

        stats = {
            'inserted': 0,
            'updated': 0,
            'subjects': 0,
            'errors': 0
        }

        cursor = conn.cursor()
        
        # Get all subject folders
        subject_folders = [f for f in jamb_copy_dir.iterdir() if f.is_dir()]
        stats['subjects'] = len(subject_folders)

        for subject_folder in subject_folders:
            subject = subject_folder.name
            logger.info(f"Processing subject: {subject}")

            # Process each year file
            year_files = list(subject_folder.glob("*.txt"))
            
            for year_file in year_files:
                try:
                    year = year_file.stem  # Extract year from filename
                    
                    with open(year_file, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Parse questions
                    questions = DatabaseSyncService._parse_questions(content, subject, year)
                    
                    for q_data in questions:
                        try:
                            question_id = q_data['id']
                            
                            # Check if question exists
                            cursor.execute("SELECT id FROM questions WHERE id = %s", (question_id,))
                            existing = cursor.fetchone()

                            if existing:
                                # Update existing
                                cursor.execute("""
                                    UPDATE questions 
                                    SET question=%s, topic=%s, subtopic=%s, correct_option_key=%s
                                    WHERE id=%s
                                """, (q_data['question'], q_data['topic'], q_data['subtopic'], 
                                      q_data['correct_option'], question_id))
                                
                                # Update options
                                cursor.execute("DELETE FROM options WHERE question_id=%s", (question_id,))
                                for opt_key, opt_text in q_data['options'].items():
                                    is_correct = 1 if opt_key == q_data['correct_option'] else 0
                                    cursor.execute("""
                                        INSERT INTO options (question_id, option_key, option_text, is_correct)
                                        VALUES (%s, %s, %s, %s)
                                    """, (question_id, opt_key, opt_text, is_correct))
                                
                                stats['updated'] += 1
                            else:
                                # Insert new
                                cursor.execute("""
                                    INSERT INTO questions 
                                    (id, exam, subject, year, number, question, topic, subtopic, 
                                     source, correct_option_key)
                                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """, (question_id, 'JAMB', subject, year, q_data['number'],
                                      q_data['question'], q_data['topic'], q_data['subtopic'],
                                      'JAMB Past Questions', q_data['correct_option']))
                                
                                # Insert options
                                for opt_key, opt_text in q_data['options'].items():
                                    is_correct = 1 if opt_key == q_data['correct_option'] else 0
                                    cursor.execute("""
                                        INSERT INTO options (question_id, option_key, option_text, is_correct)
                                        VALUES (%s, %s, %s, %s)
                                    """, (question_id, opt_key, opt_text, is_correct))
                                
                                stats['inserted'] += 1
                        
                        except Exception as e:
                            logger.error(f"Error importing question {q_data.get('id')}: {e}")
                            stats['errors'] += 1
                            continue

                except Exception as e:
                    logger.error(f"Error processing file {year_file}: {e}")
                    stats['errors'] += 1
                    continue

        conn.commit()
        cursor.close()
        
        logger.info(f"Import complete: {stats}")
        return stats

    @staticmethod
    def _parse_questions(content: str, subject: str, year: str) -> List[Dict]:
        """Parse questions from text content"""
        questions = []
        
        # Split by question numbers
        pattern = r'(\d+)\.\s+'
        parts = re.split(pattern, content)
        
        for i in range(1, len(parts), 2):
            if i + 1 >= len(parts):
                break
                
            q_num = parts[i].strip()
            q_text = parts[i + 1].strip()
            
            # Extract options
            options = {}
            option_pattern = r'([A-D])\.\s+([^\n]+)'
            option_matches = re.findall(option_pattern, q_text)
            
            for opt_key, opt_text in option_matches:
                options[opt_key] = opt_text.strip()
            
            # Remove options from question text
            question_text = re.sub(r'[A-D]\.\s+[^\n]+', '', q_text).strip()
            
            questions.append({
                'id': f"JAMB_{subject}_{year}_{q_num}",
                'number': int(q_num),
                'question': question_text,
                'options': options,
                'correct_option': 'A',  # Default, will be updated by tagging
                'topic': '',
                'subtopic': ''
            })
        
        return questions

    @staticmethod
    def tag_all_subjects(conn) -> Dict:
        """Tag all subjects with topics"""
        logger.info("Starting topic tagging...")
        
        cursor = conn.cursor(cursor_factory=DictCursor)
        
        # Subject topics mapping
        SUBJECT_TOPICS = {
            'Art': {
                'Art History & Movements': ['gothic', 'renaissance', 'baroque', 'impressionism', 'cubism', 'artist', 'period', 'movement'],
                'Drawing & Painting': ['color', 'brush', 'stroke', 'technique', 'canvas', 'paint', 'drawing'],
                'Sculpture & Design': ['sculpture', 'relief', 'carving', 'design', 'form', 'composition'],
            },
            'Commerce': {
                'Business Basics': ['business', 'trade', 'commerce', 'market', 'supply', 'demand', 'profit'],
                'Accounting & Finance': ['accounting', 'finance', 'balance', 'ledger', 'credit', 'debit', 'capital'],
                'Economics & Management': ['economics', 'management', 'cost', 'price', 'production', 'value'],
                'Insurance & Banking': ['insurance', 'bank', 'loan', 'premium', 'interest', 'investment'],
            },
            'French': {
                'Grammar & Vocabulary': ['verb', 'noun', 'grammar', 'conjugate', 'tense', 'article'],
                'Reading & Writing': ['read', 'text', 'write', 'essay', 'letter', 'comprehension'],
                'Culture & Literature': ['france', 'french', 'culture', 'literature', 'author'],
            },
            'Geography': {
                'Maps & Location': ['map', 'location', 'coordinate', 'latitude', 'longitude', 'direction'],
                'Physical Geography': ['mountain', 'river', 'ocean', 'climate', 'terrain', 'forest'],
                'Human & Society': ['population', 'city', 'country', 'economy', 'trade', 'settlement'],
            },
            'Hausa': {
                'Vocabulary': ['word', 'phrase', 'meaning', 'expression', 'conversation'],
                'Grammar': ['grammar', 'sentence', 'structure', 'verb', 'noun', 'tense'],
                'Communication': ['communication', 'dialogue', 'writing', 'translate'],
            },
            'History': {
                'Ancient History': ['ancient', 'egypt', 'rome', 'greece', 'civilization', 'empire'],
                'Medieval Period': ['medieval', 'kingdom', 'feudal', 'monarch', 'castle'],
                'Modern History': ['modern', 'revolution', 'industrial', 'world war', 'contemporary'],
                'African History': ['africa', 'african', 'colonial', 'independence', 'tradition'],
            },
            'Igbo': {
                'Language & Vocabulary': ['word', 'vocabulary', 'language', 'igbo', 'phrase'],
                'Grammar': ['grammar', 'sentence', 'structure', 'verb', 'noun'],
                'Culture & Tradition': ['tradition', 'culture', 'folklore', 'proverb', 'story'],
            },
            'Music': {
                'Theory & Notation': ['note', 'scale', 'chord', 'rhythm', 'melody', 'harmony'],
                'Instruments': ['instrument', 'piano', 'guitar', 'violin', 'drum', 'orchestra'],
                'History & Styles': ['classical', 'jazz', 'rock', 'genre', 'composer', 'style'],
            },
        }

        stats = {'subjects_tagged': 0, 'questions_tagged': 0}

        for subject, topics_dict in SUBJECT_TOPICS.items():
            try:
                # Get untagged questions
                cursor.execute("""
                    SELECT id, question FROM questions
                    WHERE subject=%s AND (topic IS NULL OR topic='')
                """, (subject,))
                
                questions = cursor.fetchall()
                if not questions:
                    continue

                logger.info(f"Tagging {len(questions)} {subject} questions...")

                for q in questions:
                    topic = DatabaseSyncService._predict_topic(q['question'], topics_dict)
                    cursor.execute("""
                        UPDATE questions SET topic=%s, subtopic=%s WHERE id=%s
                    """, (topic, topic, q['id']))
                    stats['questions_tagged'] += 1

                stats['subjects_tagged'] += 1
                conn.commit()

            except Exception as e:
                logger.error(f"Error tagging {subject}: {e}")
                conn.rollback()
                continue

        cursor.close()
        logger.info(f"Topic tagging complete: {stats}")
        return stats

    @staticmethod
    def _predict_topic(question_text: str, topics_dict: Dict) -> str:
        """Simple keyword-based topic prediction"""
        question_lower = question_text.lower()
        
        best_topic = None
        best_score = 0
        
        for topic, keywords in topics_dict.items():
            score = sum(1 for kw in keywords if kw in question_lower)
            if score > best_score:
                best_score = score
                best_topic = topic
        
        return best_topic or list(topics_dict.keys())[0]

    @staticmethod
    def sync_database():
        """Main sync function called on startup"""
        if not DatabaseSyncService.should_sync():
            logger.info("DB auto-sync disabled (set DB_AUTO_SYNC=true to enable)")
            return {'status': 'disabled'}

        logger.info("Starting database synchronization...")
        
        try:
            # Connect to database
            from app.core.config import settings
            
            # Parse DATABASE_URL
            db_url = settings.DATABASE_URL
            if db_url.startswith('postgresql://'):
                # Extract credentials
                parts = db_url.replace('postgresql://', '').split('@')
                user_pass = parts[0].split(':')
                host_port_db = parts[1].split('/')
                
                config = {
                    'user': user_pass[0],
                    'password': user_pass[1] if len(user_pass) > 1 else '',
                    'host': host_port_db[0].split(':')[0],
                    'port': int(host_port_db[0].split(':')[1]) if ':' in host_port_db[0] else 5432,
                    'dbname': host_port_db[1]
                }
            else:
                config = DB_CONFIG

            conn = psycopg2.connect(**config)
            
            # Check if questions exist
            question_count = DatabaseSyncService.check_questions_exist(conn)
            logger.info(f"Current question count: {question_count}")

            results = {'initial_count': question_count}

            # Import if needed (less than 20,000 questions)
            if question_count < 20000:
                logger.info("Question count low, importing...")
                import_stats = DatabaseSyncService.import_questions(conn)
                results['import'] = import_stats

            # Tag all subjects
            tag_stats = DatabaseSyncService.tag_all_subjects(conn)
            results['tagging'] = tag_stats

            # Get final count
            final_count = DatabaseSyncService.check_questions_exist(conn)
            results['final_count'] = final_count
            results['status'] = 'success'

            conn.close()
            
            logger.info(f"Database sync complete: {results}")
            return results

        except Exception as e:
            logger.error(f"Database sync failed: {e}", exc_info=True)
            return {'status': 'error', 'message': str(e)}
