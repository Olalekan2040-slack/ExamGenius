"""
Full Schema Migration for ExamGenius
Safely creates all missing tables, adds missing columns, and creates indexes.
Idempotent - safe to run multiple times.
"""

import psycopg2
import psycopg2.extras
from pathlib import Path
import sys


def load_database_url():
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        for line in open(env_path).readlines():
            line = line.strip()
            if line.startswith('DATABASE_URL='):
                return line.split('=', 1)[1].strip().strip('"').strip("'")
    import os
    return os.environ.get('DATABASE_URL', '')


def get_existing_tables(cur):
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    return {r[0] for r in cur.fetchall()}


def get_table_columns(cur, table_name):
    cur.execute(
        "SELECT column_name FROM information_schema.columns WHERE table_name=%s AND table_schema='public'",
        (table_name,)
    )
    return {r[0] for r in cur.fetchall()}


def add_column_if_missing(cur, conn, table, column, col_type):
    cols = get_table_columns(cur, table)
    if column not in cols:
        print(f"  Adding column '{column}' to '{table}'...")
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")
        conn.commit()
        print(f"  => Added.")
    else:
        print(f"  Column '{column}' in '{table}' already exists.")


def run_safe(cur, conn, sql, description=""):
    try:
        cur.execute(sql)
        conn.commit()
        if description:
            print(f"  => {description}: OK")
    except psycopg2.errors.DuplicateTable:
        conn.rollback()
        print(f"  => {description}: already exists, skipped.")
    except psycopg2.errors.DuplicateObject:
        conn.rollback()
        print(f"  => {description}: already exists, skipped.")
    except Exception as e:
        conn.rollback()
        print(f"  => ERROR on {description}: {e}")


def main():
    db_url = load_database_url()
    if not db_url:
        print("ERROR: DATABASE_URL not found in .env file")
        sys.exit(1)

    print("Connecting to PostgreSQL...")
    conn = psycopg2.connect(db_url, connect_timeout=10)
    conn.autocommit = False
    cur = conn.cursor()
    print("=> Connected!\n")

    existing = get_existing_tables(cur)
    print(f"Existing tables: {sorted(existing)}\n")

    # ----------------------------------------------------------------
    # 1. CORE TABLES (order matters - dependencies first)
    # ----------------------------------------------------------------
    print("=== Creating core tables ===")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            google_id TEXT UNIQUE,
            is_verified INTEGER DEFAULT 0,
            email_verified_at TIMESTAMP,
            reset_token TEXT,
            reset_token_expires TIMESTAMP,
            profile_pic_url TEXT,
            refresh_token TEXT,
            role TEXT DEFAULT 'student' CHECK(role IN ('student', 'admin', 'moderator')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "users")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            full_name TEXT,
            phone_number TEXT,
            class_level TEXT CHECK(class_level IN ('SS1', 'SS2', 'SS3')),
            date_of_birth DATE,
            gender TEXT CHECK(gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
            age INTEGER,
            department TEXT CHECK(department IN ('Science', 'Commercial', 'Art')),
            state TEXT,
            local_government TEXT,
            preferred_exam TEXT DEFAULT 'JAMB',
            profile_completed INTEGER DEFAULT 0,
            learning_points INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "user_profiles")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS user_subjects (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            subject TEXT NOT NULL,
            position INTEGER CHECK(position IN (1, 2, 3, 4)),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, subject),
            UNIQUE(user_id, position)
        )
    """, "user_subjects")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS content_subjects (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            icon TEXT,
            description TEXT,
            order_priority INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "content_subjects")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS content_topics (
            id SERIAL PRIMARY KEY,
            subject_id INTEGER NOT NULL REFERENCES content_subjects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            order_priority INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject_id, name)
        )
    """, "content_topics")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS content_subtopics (
            id SERIAL PRIMARY KEY,
            topic_id INTEGER NOT NULL REFERENCES content_topics(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            order_priority INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(topic_id, name)
        )
    """, "content_subtopics")

    # ----------------------------------------------------------------
    # 2. QUESTIONS TABLES
    # ----------------------------------------------------------------
    print("\n=== Creating question tables ===")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            exam TEXT,
            subject TEXT,
            year INTEGER,
            number TEXT,
            question TEXT,
            topic TEXT,
            subtopic TEXT,
            source TEXT,
            image_path TEXT,
            correct_option_key TEXT,
            explanation TEXT,
            predicted_topics TEXT,
            predicted_subtopics TEXT
        )
    """, "questions")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS options (
            id SERIAL PRIMARY KEY,
            question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            option_key TEXT NOT NULL,
            option_text TEXT NOT NULL,
            is_correct INTEGER DEFAULT 0,
            UNIQUE(question_id, option_key)
        )
    """, "options")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS past_questions (
            id SERIAL PRIMARY KEY,
            question_text TEXT NOT NULL,
            subject_id INTEGER NOT NULL REFERENCES content_subjects(id),
            topic_id INTEGER REFERENCES content_topics(id),
            subtopic_id INTEGER REFERENCES content_subtopics(id),
            year INTEGER,
            exam_type TEXT DEFAULT 'JAMB',
            difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
            explanation TEXT,
            image_url TEXT,
            diagram_url TEXT,
            created_by INTEGER REFERENCES users(id),
            updated_by INTEGER REFERENCES users(id),
            is_verified INTEGER DEFAULT 0,
            verified_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "past_questions")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS question_options (
            id SERIAL PRIMARY KEY,
            question_id INTEGER NOT NULL REFERENCES past_questions(id) ON DELETE CASCADE,
            option_key TEXT NOT NULL,
            option_text TEXT NOT NULL,
            is_correct INTEGER DEFAULT 0,
            UNIQUE(question_id, option_key)
        )
    """, "question_options")

    # ----------------------------------------------------------------
    # 3. FIX EXISTING practice_attempts - add missing columns
    # ----------------------------------------------------------------
    print("\n=== Ensuring practice_attempts has all required columns ===")

    # Create if not exists first (with all required FK)
    # We need questions to exist first (done above)
    if 'practice_attempts' not in existing:
        run_safe(cur, conn, """
            CREATE TABLE IF NOT EXISTS practice_attempts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                practice_type TEXT NOT NULL CHECK(practice_type IN ('topic', 'year', 'cbt')),
                subject TEXT NOT NULL,
                topic TEXT,
                year INTEGER,
                question_id TEXT NOT NULL,
                user_answer TEXT,
                correct_answer TEXT NOT NULL,
                is_correct INTEGER NOT NULL,
                time_spent INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (question_id) REFERENCES questions(id)
            )
        """, "practice_attempts")
    else:
        # Table exists - add any missing columns safely
        required_cols = {
            'practice_type': "TEXT",
            'subject': "TEXT",
            'topic': "TEXT",
            'year': "INTEGER",
            'question_id': "TEXT",
            'user_answer': "TEXT",
            'correct_answer': "TEXT",
            'is_correct': "INTEGER",
            'time_spent': "INTEGER",
            'created_at': "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
        for col, col_type in required_cols.items():
            add_column_if_missing(cur, conn, 'practice_attempts', col, col_type)

    # ----------------------------------------------------------------
    # 4. REMAINING TABLES
    # ----------------------------------------------------------------
    print("\n=== Creating remaining tables ===")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS exam_sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            session_type TEXT DEFAULT 'cbt',
            status TEXT DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed', 'expired')),
            total_questions INTEGER DEFAULT 160,
            answered_count INTEGER DEFAULT 0,
            score INTEGER,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            time_limit_minutes INTEGER DEFAULT 180,
            expires_at TIMESTAMP
        )
    """, "exam_sessions")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS session_questions (
            id SERIAL PRIMARY KEY,
            session_id TEXT NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
            question_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            subject_position INTEGER CHECK(subject_position IN (1, 2, 3, 4)),
            question_number INTEGER NOT NULL,
            user_answer TEXT,
            is_correct INTEGER,
            marked_for_review INTEGER DEFAULT 0,
            time_spent INTEGER,
            generated_by TEXT,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            UNIQUE(session_id, question_number)
        )
    """, "session_questions")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS user_stats (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            subject TEXT NOT NULL,
            topic TEXT,
            total_attempts INTEGER DEFAULT 0,
            correct_attempts INTEGER DEFAULT 0,
            accuracy REAL DEFAULT 0.0,
            last_practiced TIMESTAMP,
            UNIQUE(user_id, subject, topic)
        )
    """, "user_stats")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS user_streaks (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_activity_date DATE,
            total_active_days INTEGER DEFAULT 0
        )
    """, "user_streaks")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS topic_lessons (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            language TEXT DEFAULT 'english' CHECK(language IN ('english', 'pidgin')),
            key_idea TEXT,
            example TEXT,
            steps TEXT,
            quick_tip TEXT,
            full_content TEXT,
            diagrams TEXT,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic, language)
        )
    """, "topic_lessons")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS topic_videos (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT NOT NULL,
            duration_seconds INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic, url)
        )
    """, "topic_videos")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS learning_videos (
            id SERIAL PRIMARY KEY,
            subject_id INTEGER NOT NULL REFERENCES content_subjects(id),
            topic_id INTEGER REFERENCES content_topics(id),
            subtopic_id INTEGER REFERENCES content_subtopics(id),
            title TEXT NOT NULL,
            description TEXT,
            url TEXT NOT NULL,
            platform TEXT CHECK(platform IN ('youtube', 'vimeo', 'gdrive', 'custom')),
            duration_seconds INTEGER,
            thumbnail_url TEXT,
            created_by INTEGER REFERENCES users(id),
            is_verified INTEGER DEFAULT 0,
            verified_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "learning_videos")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS learning_notes (
            id SERIAL PRIMARY KEY,
            subject_id INTEGER NOT NULL REFERENCES content_subjects(id),
            topic_id INTEGER REFERENCES content_topics(id),
            subtopic_id INTEGER REFERENCES content_subtopics(id),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            format TEXT DEFAULT 'markdown' CHECK(format IN ('markdown', 'html', 'plain')),
            created_by INTEGER REFERENCES users(id),
            is_verified INTEGER DEFAULT 0,
            verified_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "learning_notes")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS recommended_readings (
            id SERIAL PRIMARY KEY,
            subject_id INTEGER NOT NULL REFERENCES content_subjects(id),
            topic_id INTEGER REFERENCES content_topics(id),
            subtopic_id INTEGER REFERENCES content_subtopics(id),
            title TEXT NOT NULL,
            author TEXT,
            source_url TEXT,
            isbn TEXT,
            description TEXT,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "recommended_readings")

    run_safe(cur, conn, """
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
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used_count INTEGER DEFAULT 0
        )
    """, "ai_generated_questions")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS invalidated_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            invalidated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "invalidated_tokens")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS question_explanations (
            question_id TEXT PRIMARY KEY REFERENCES questions(id),
            explanation TEXT NOT NULL,
            language TEXT DEFAULT 'english',
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "question_explanations")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS syllabus_topics (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            topic_number INTEGER NOT NULL,
            topic_name TEXT NOT NULL,
            full_topic TEXT NOT NULL,
            keywords TEXT,
            objectives TEXT,
            UNIQUE(subject, topic_number)
        )
    """, "syllabus_topics")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS bulk_uploads (
            id SERIAL PRIMARY KEY,
            uploaded_by INTEGER NOT NULL REFERENCES users(id),
            content_type TEXT NOT NULL CHECK(content_type IN ('questions', 'videos', 'notes')),
            file_name TEXT,
            total_records INTEGER,
            successful_records INTEGER,
            failed_records INTEGER,
            status TEXT DEFAULT 'processing' CHECK(status IN ('processing', 'completed', 'failed')),
            error_log TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    """, "bulk_uploads")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS registration_requests (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            class_level TEXT,
            department TEXT,
            state TEXT,
            local_government TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
            rejection_reason TEXT,
            reviewed_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reviewed_at TIMESTAMP
        )
    """, "registration_requests")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS content_performance (
            id SERIAL PRIMARY KEY,
            content_type TEXT,
            content_id INTEGER,
            user_id INTEGER REFERENCES users(id),
            interaction_type TEXT CHECK(interaction_type IN ('view', 'learn', 'practice', 'rate')),
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            time_spent_seconds INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "content_performance")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS learning_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            subject TEXT NOT NULL,
            topic_name TEXT NOT NULL,
            subtopic_index INTEGER NOT NULL,
            objective_index INTEGER NOT NULL,
            status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'completed')),
            question_answered BOOLEAN DEFAULT FALSE,
            answered_correctly BOOLEAN,
            is_weakness BOOLEAN DEFAULT FALSE,
            started_at TIMESTAMP,
            completed_at TIMESTAMP,
            time_spent_seconds INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, subject, topic_name, subtopic_index, objective_index)
        )
    """, "learning_progress")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS objective_explanations (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            topic_name TEXT NOT NULL,
            subtopic_name TEXT NOT NULL,
            objective_text TEXT NOT NULL,
            explanation TEXT NOT NULL,
            diagram_url TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic_name, subtopic_name, objective_text)
        )
    """, "objective_explanations")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS objective_qa_cache (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            topic_name TEXT NOT NULL,
            subtopic_name TEXT NOT NULL,
            objective_text TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "objective_qa_cache")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS gamification_events (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            event_type TEXT NOT NULL,
            points INTEGER DEFAULT 0,
            subject TEXT,
            topic TEXT,
            subtopic TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, "gamification_events")

    run_safe(cur, conn, """
        CREATE TABLE IF NOT EXISTS year_practice_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            subject TEXT NOT NULL,
            year INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            accuracy REAL NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            results_json TEXT
        )
    """, "year_practice_sessions")

    # ----------------------------------------------------------------
    # 5. INDEXES
    # ----------------------------------------------------------------
    print("\n=== Creating indexes ===")

    indexes = [
        ("idx_year_practice_sessions_user", "year_practice_sessions(user_id)"),
        ("idx_questions_subject", "questions(subject)"),
        ("idx_questions_topic", "questions(subject, topic)"),
        ("idx_questions_year", "questions(year)"),
        ("idx_options_question_id", "options(question_id)"),
        ("idx_practice_user_subject", "practice_attempts(user_id, subject)"),
        ("idx_practice_topic", "practice_attempts(subject, topic)"),
        ("idx_user_stats_accuracy", "user_stats(user_id, accuracy)"),
        ("idx_session_user", "exam_sessions(user_id)"),
        ("idx_session_questions_session", "session_questions(session_id)"),
        ("idx_user_subjects", "user_subjects(user_id)"),
        ("idx_past_questions_subject_topic", "past_questions(subject_id, topic_id, subtopic_id)"),
        ("idx_learning_videos_subject_topic", "learning_videos(subject_id, topic_id, subtopic_id)"),
        ("idx_learning_notes_subject_topic", "learning_notes(subject_id, topic_id, subtopic_id)"),
        ("idx_learning_progress_user", "learning_progress(user_id, subject)"),
        ("idx_gamification_user", "gamification_events(user_id)"),
        ("idx_invalidated_tokens_token", "invalidated_tokens(token)"),
    ]

    for idx_name, idx_expr in indexes:
        run_safe(cur, conn, f"CREATE INDEX IF NOT EXISTS {idx_name} ON {idx_expr}", idx_name)

    # ----------------------------------------------------------------
    # 6. FINAL REPORT
    # ----------------------------------------------------------------
    print("\n=== FINAL VERIFICATION ===")
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
    final_tables = [r[0] for r in cur.fetchall()]
    print(f"Total tables: {len(final_tables)}")
    for t in final_tables:
        print(f"  - {t}")

    conn.close()
    print("\n=== MIGRATION COMPLETE ===")


if __name__ == "__main__":
    main()
