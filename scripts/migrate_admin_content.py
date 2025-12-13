"""
Admin Content Management Migration
Adds comprehensive content management tables for past questions, learning materials, and AI integration
"""
import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent / "jamb_questions.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    try:
        # 1. Add admin role to users table
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        if 'role' not in columns:
            cursor.execute("""
                ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student' 
                CHECK(role IN ('student', 'admin', 'moderator'))
            """)
            print("✓ Added role column to users")

        # 2. Content hierarchy tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content_subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                icon TEXT,
                description TEXT,
                order_priority INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✓ content_subjects table ready")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content_topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                order_priority INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES content_subjects(id) ON DELETE CASCADE,
                UNIQUE(subject_id, name)
            )
        """)
        print("✓ content_topics table ready")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content_subtopics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                order_priority INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (topic_id) REFERENCES content_topics(id) ON DELETE CASCADE,
                UNIQUE(topic_id, name)
            )
        """)
        print("✓ content_subtopics table ready")

        # 3. Past Questions Management
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS past_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_text TEXT NOT NULL,
                subject_id INTEGER NOT NULL,
                topic_id INTEGER,
                subtopic_id INTEGER,
                year INTEGER,
                exam_type TEXT DEFAULT 'JAMB',
                difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
                explanation TEXT,
                image_url TEXT,
                diagram_url TEXT,
                created_by INTEGER,
                updated_by INTEGER,
                is_verified INTEGER DEFAULT 0,
                verified_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES content_subjects(id),
                FOREIGN KEY (topic_id) REFERENCES content_topics(id),
                FOREIGN KEY (subtopic_id) REFERENCES content_subtopics(id),
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (updated_by) REFERENCES users(id),
                FOREIGN KEY (verified_by) REFERENCES users(id)
            )
        """)
        print("✓ past_questions table ready")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS question_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_id INTEGER NOT NULL,
                option_key TEXT NOT NULL,
                option_text TEXT NOT NULL,
                is_correct INTEGER DEFAULT 0,
                FOREIGN KEY (question_id) REFERENCES past_questions(id) ON DELETE CASCADE,
                UNIQUE(question_id, option_key)
            )
        """)
        print("✓ question_options table ready")

        # 4. Learning Materials (Videos + Notes)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER NOT NULL,
                topic_id INTEGER,
                subtopic_id INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                url TEXT NOT NULL,
                platform TEXT CHECK(platform IN ('youtube', 'vimeo', 'gdrive', 'custom')),
                duration_seconds INTEGER,
                thumbnail_url TEXT,
                created_by INTEGER,
                is_verified INTEGER DEFAULT 0,
                verified_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES content_subjects(id),
                FOREIGN KEY (topic_id) REFERENCES content_topics(id),
                FOREIGN KEY (subtopic_id) REFERENCES content_subtopics(id),
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (verified_by) REFERENCES users(id)
            )
        """)
        print("✓ learning_videos table ready")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER NOT NULL,
                topic_id INTEGER,
                subtopic_id INTEGER,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                format TEXT DEFAULT 'markdown' CHECK(format IN ('markdown', 'html', 'plain')),
                created_by INTEGER,
                is_verified INTEGER DEFAULT 0,
                verified_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES content_subjects(id),
                FOREIGN KEY (topic_id) REFERENCES content_topics(id),
                FOREIGN KEY (subtopic_id) REFERENCES content_subtopics(id),
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (verified_by) REFERENCES users(id)
            )
        """)
        print("✓ learning_notes table ready")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS recommended_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER NOT NULL,
                topic_id INTEGER,
                subtopic_id INTEGER,
                title TEXT NOT NULL,
                author TEXT,
                source_url TEXT,
                isbn TEXT,
                description TEXT,
                created_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES content_subjects(id),
                FOREIGN KEY (topic_id) REFERENCES content_topics(id),
                FOREIGN KEY (subtopic_id) REFERENCES content_subtopics(id),
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        """)
        print("✓ recommended_readings table ready")

        # 5. Bulk Upload Tracking
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bulk_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uploaded_by INTEGER NOT NULL,
                content_type TEXT NOT NULL CHECK(content_type IN ('questions', 'videos', 'notes')),
                file_name TEXT,
                total_records INTEGER,
                successful_records INTEGER,
                failed_records INTEGER,
                status TEXT DEFAULT 'processing' CHECK(status IN ('processing', 'completed', 'failed')),
                error_log TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                completed_at TEXT,
                FOREIGN KEY (uploaded_by) REFERENCES users(id)
            )
        """)
        print("✓ bulk_uploads table ready")

        # 6. User Registration Requests (for admin approval)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registration_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                class_level TEXT,
                department TEXT,
                state TEXT,
                local_government TEXT,
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
                rejection_reason TEXT,
                reviewed_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TEXT,
                FOREIGN KEY (reviewed_by) REFERENCES users(id)
            )
        """)
        print("✓ registration_requests table ready")

        # 7. Content Analytics (for AI to track what works)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content_type TEXT,
                content_id INTEGER,
                user_id INTEGER,
                interaction_type TEXT CHECK(interaction_type IN ('view', 'learn', 'practice', 'rate')),
                rating INTEGER CHECK(rating >= 1 AND rating <= 5),
                time_spent_seconds INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        print("✓ content_performance table ready")

        # Create indexes for performance
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_past_questions_subject_topic 
            ON past_questions(subject_id, topic_id, subtopic_id)
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_learning_videos_subject_topic 
            ON learning_videos(subject_id, topic_id, subtopic_id)
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_learning_notes_subject_topic 
            ON learning_notes(subject_id, topic_id, subtopic_id)
        """)
        print("✓ Created performance indexes")

        conn.commit()
        print("\n✅ Admin Content Management Migration Complete!")

    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
