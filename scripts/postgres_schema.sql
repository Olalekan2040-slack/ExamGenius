-- EduLab ExamPrep PostgreSQL Schema
-- All tables required for the application

-- Users table (authentication)
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
    is_banned INTEGER DEFAULT 0,
    banned_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles (extended information)
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
);

-- User subjects (exactly 4 subjects for JAMB)
CREATE TABLE IF NOT EXISTS user_subjects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    position INTEGER CHECK(position IN (1, 2, 3, 4)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject),
    UNIQUE(user_id, position)
);

-- Content hierarchy: Subjects
CREATE TABLE IF NOT EXISTS content_subjects (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    order_priority INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content hierarchy: Topics
CREATE TABLE IF NOT EXISTS content_topics (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES content_subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_priority INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, name)
);

-- Content hierarchy: Subtopics
CREATE TABLE IF NOT EXISTS content_subtopics (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES content_topics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_priority INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(topic_id, name)
);

-- Questions table (main question bank)
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
    predicted_subtopics TEXT,
    table_html TEXT,
    passage TEXT
);

-- Options for questions (main question bank)
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct INTEGER DEFAULT 0,
    UNIQUE(question_id, option_key)
);

-- Past Questions Management (admin content)
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
);

-- Options for past_questions (admin content)
CREATE TABLE IF NOT EXISTS question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES past_questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct INTEGER DEFAULT 0,
    UNIQUE(question_id, option_key)
);

-- Practice attempts (topic, year, and CBT practice)
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
);

-- Exam sessions (CBT exams)
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
);

-- Session questions (questions in a CBT session)
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
);

-- User stats (aggregated by subject/topic)
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
);

-- User streaks (daily activity)
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_active_days INTEGER DEFAULT 0
);

-- Topic lessons (AI-generated or cached)
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
);

-- Topic videos (admin-managed)
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
);

-- Learning videos (admin content management)
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
);

-- Learning notes
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
);

-- Recommended readings
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
);

-- AI-generated questions (for CBT slot 3)
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
);

-- Invalidated tokens (logout)
CREATE TABLE IF NOT EXISTS invalidated_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    invalidated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question explanations cache
CREATE TABLE IF NOT EXISTS question_explanations (
    question_id TEXT PRIMARY KEY REFERENCES questions(id),
    explanation TEXT NOT NULL,
    language TEXT DEFAULT 'english',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Syllabus topics (for AI context)
CREATE TABLE IF NOT EXISTS syllabus_topics (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    topic_number INTEGER NOT NULL,
    topic_name TEXT NOT NULL,
    full_topic TEXT NOT NULL,
    keywords TEXT,
    objectives TEXT,
    UNIQUE(subject, topic_number)
);

-- Bulk uploads tracking
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
);

-- Registration requests (admin approval)
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
);

-- Content performance analytics
CREATE TABLE IF NOT EXISTS content_performance (
    id SERIAL PRIMARY KEY,
    content_type TEXT,
    content_id INTEGER,
    user_id INTEGER REFERENCES users(id),
    interaction_type TEXT CHECK(interaction_type IN ('view', 'learn', 'practice', 'rate')),
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    time_spent_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning progress (guided learning objective tracking)
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
);

-- Objective explanations cache (AI-generated explanations)
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
);

-- Objective Q&A cache (AI-generated answers to student questions)
CREATE TABLE IF NOT EXISTS objective_qa_cache (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    subtopic_name TEXT NOT NULL,
    objective_text TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification events (points and achievements)
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
);

-- Year Practice Sessions (summary record per completed year practice)
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
);

CREATE INDEX IF NOT EXISTS idx_year_practice_sessions_user ON year_practice_sessions(user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(subject, topic);
CREATE INDEX IF NOT EXISTS idx_questions_year ON questions(year);
CREATE INDEX IF NOT EXISTS idx_options_question_id ON options(question_id);
CREATE INDEX IF NOT EXISTS idx_practice_user_subject ON practice_attempts(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_practice_topic ON practice_attempts(subject, topic);
CREATE INDEX IF NOT EXISTS idx_user_stats_accuracy ON user_stats(user_id, accuracy);
CREATE INDEX IF NOT EXISTS idx_session_user ON exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_questions_session ON session_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_subjects ON user_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_past_questions_subject_topic ON past_questions(subject_id, topic_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_learning_videos_subject_topic ON learning_videos(subject_id, topic_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_learning_notes_subject_topic ON learning_notes(subject_id, topic_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_invalidated_tokens_token ON invalidated_tokens(token);
