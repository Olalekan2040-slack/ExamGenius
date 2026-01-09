"""
Database migration script to add guided learning tables
"""

from app.db.database import get_connection


def run_migration():
    """Create tables for guided learning system"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Table 1: Parsed syllabus structure (topics, subtopics, objectives)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS syllabus_structure (
            id SERIAL PRIMARY KEY,
            subject VARCHAR(100) NOT NULL,
            topic_number INTEGER NOT NULL,
            topic_name VARCHAR(255) NOT NULL,
            subtopic_index INTEGER NOT NULL,
            subtopic_name VARCHAR(255) NOT NULL,
            objective_index INTEGER NOT NULL,
            objective_text TEXT NOT NULL,
            requires_diagram BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic_number, subtopic_index, objective_index)
        )
    """)
    
    # Table 2: Cached AI explanations for objectives
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS objective_explanations (
            id SERIAL PRIMARY KEY,
            subject VARCHAR(100) NOT NULL,
            topic_name VARCHAR(255) NOT NULL,
            subtopic_name VARCHAR(255) NOT NULL,
            objective_text TEXT NOT NULL,
            explanation TEXT NOT NULL,
            diagram_url TEXT,
            diagram_cached BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic_name, subtopic_name, objective_text)
        )
    """)
    
    # Table 3: Objective-linked questions (manual mapping)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS objective_questions (
            id SERIAL PRIMARY KEY,
            subject VARCHAR(100) NOT NULL,
            topic_name VARCHAR(255) NOT NULL,
            subtopic_name VARCHAR(255) NOT NULL,
            objective_text TEXT NOT NULL,
            question_id INTEGER NOT NULL,
            relevance_score REAL DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subject, topic_name, subtopic_name, objective_text, question_id)
        )
    """)
    
    # Table 4: User learning progress
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS learning_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            subject VARCHAR(100) NOT NULL,
            topic_name VARCHAR(255) NOT NULL,
            subtopic_index INTEGER NOT NULL,
            objective_index INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'not_started',
            question_answered BOOLEAN DEFAULT FALSE,
            answered_correctly BOOLEAN DEFAULT NULL,
            is_weakness BOOLEAN DEFAULT FALSE,
            started_at TIMESTAMP,
            completed_at TIMESTAMP,
            time_spent_seconds INTEGER DEFAULT 0,
            UNIQUE(user_id, subject, topic_name, subtopic_index, objective_index)
        )
    """)
    
    # Table 5: Cached Q&A responses for objectives
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS objective_qa_cache (
            id SERIAL PRIMARY KEY,
            subject VARCHAR(100) NOT NULL,
            topic_name VARCHAR(255) NOT NULL,
            subtopic_name VARCHAR(255) NOT NULL,
            objective_text TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create indexes for faster queries
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_syllabus_subject_topic 
        ON syllabus_structure(subject, topic_name)
    """)
    
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_learning_progress_user 
        ON learning_progress(user_id, subject, topic_name)
    """)
    
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_objective_explanations_lookup 
        ON objective_explanations(subject, topic_name, subtopic_name)
    """)
    
    conn.commit()
    print("✅ Guided learning tables created successfully!")
    
    return True


if __name__ == '__main__':
    run_migration()
