"""
Initialize database schema for ExamGenius
Creates all necessary tables for user management, practice, and analytics
"""

import sqlite3
from pathlib import Path


def init_schema():
    db_path = Path(__file__).parent / "jamb_questions.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    # Users table (for authentication and basic profile)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            google_id TEXT UNIQUE,
            is_verified INTEGER DEFAULT 0,
            email_verified_at TEXT,
            reset_token TEXT,
            reset_token_expires TEXT,
            profile_pic_url TEXT,
            refresh_token TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # User profiles (extended profile information)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INTEGER PRIMARY KEY,
            full_name TEXT,
            phone_number TEXT,
            class_level TEXT CHECK(class_level IN ('SS1', 'SS2', 'SS3')),
            date_of_birth TEXT,
            gender TEXT CHECK(gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
            age INTEGER,
            department TEXT CHECK(department IN ('Science', 'Commercial', 'Art')),
            state TEXT,
            local_government TEXT,
            preferred_exam TEXT DEFAULT 'JAMB',
            profile_completed INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # User subjects (exactly 4 subjects for JAMB)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            position INTEGER CHECK(position IN (1, 2, 3, 4)),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, subject),
            UNIQUE(user_id, position)
        )
    """)

    # Practice attempts (for topic and year practice)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS practice_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            practice_type TEXT NOT NULL CHECK(practice_type IN ('topic', 'year', 'cbt')),
            subject TEXT NOT NULL,
            topic TEXT,
            year INTEGER,
            question_id TEXT NOT NULL,
            user_answer TEXT,
            correct_answer TEXT NOT NULL,
            is_correct INTEGER NOT NULL,
            time_spent INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )
    """)

    # Exam sessions (for full CBT exams)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exam_sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            session_type TEXT DEFAULT 'cbt',
            status TEXT DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed', 'expired')),
            total_questions INTEGER DEFAULT 160,
            answered_count INTEGER DEFAULT 0,
            score INTEGER,
            started_at TEXT DEFAULT CURRENT_TIMESTAMP,
            completed_at TEXT,
            time_limit_minutes INTEGER DEFAULT 180,
            expires_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Session questions (questions for a specific exam session)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS session_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            subject_position INTEGER CHECK(subject_position IN (1, 2, 3, 4)),
            question_number INTEGER NOT NULL,
            user_answer TEXT,
            is_correct INTEGER,
            marked_for_review INTEGER DEFAULT 0,
            time_spent INTEGER,
            generated_by TEXT,
            FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            UNIQUE(session_id, question_number)
        )
    """)

    # User stats (aggregated statistics by subject and topic)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            topic TEXT,
            total_attempts INTEGER DEFAULT 0,
            correct_attempts INTEGER DEFAULT 0,
            accuracy REAL DEFAULT 0.0,
            last_practiced TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, subject, topic)
        )
    """)

    # Topic lessons (AI-generated or cached lessons)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topic_lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            language TEXT DEFAULT 'english' CHECK(language IN ('english', 'pidgin')),
            key_idea TEXT,
            example TEXT,
            steps TEXT,
            quick_tip TEXT,
            full_content TEXT,
            diagrams TEXT,
            generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic, language)
        )
    """)

    # Topic videos (admin-managed video links per topic)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topic_videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT NOT NULL,
            duration_seconds INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic, url)
        )
    """)

    # AI-generated questions (for slot 3 in CBT)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ai_generated_questions (
            id TEXT PRIMARY KEY,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL CHECK(correct_option IN ('A', 'B', 'C', 'D')),
            difficulty TEXT,
            explanation TEXT,
            diagram_url TEXT,
            diagram_required INTEGER DEFAULT 0,
            generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            used_count INTEGER DEFAULT 0
        )
    """)

    # User streaks (daily activity tracking)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_streaks (
            user_id INTEGER PRIMARY KEY,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_activity_date TEXT,
            total_active_days INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Invalidated tokens (for logout)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS invalidated_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            invalidated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Question explanations cache (AI-generated explanations)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS question_explanations (
            question_id TEXT PRIMARY KEY,
            explanation TEXT NOT NULL,
            language TEXT DEFAULT 'english',
            generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )
    """)

    # Create indexes for performance
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_practice_user_subject ON practice_attempts(user_id, subject)")
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_practice_topic ON practice_attempts(subject, topic)")
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_user_stats_accuracy ON user_stats(user_id, accuracy)")
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_session_user ON exam_sessions(user_id)")
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_session_questions_session ON session_questions(session_id)")
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_user_subjects ON user_subjects(user_id)")

    conn.commit()
    print("Database schema initialized successfully!")

    # Verify tables
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = cursor.fetchall()
    print(f"\nTotal tables: {len(tables)}")
    for table in tables:
        print(f"  - {table[0]}")

    conn.close()


if __name__ == "__main__":
    init_schema()
