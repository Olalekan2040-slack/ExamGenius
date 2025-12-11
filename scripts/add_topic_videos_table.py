"""
Migration: add topic_videos table for per-topic video links.
"""
import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent / "jamb_questions.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    try:
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
        conn.commit()
        print("✅ topic_videos table ready")
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
