"""
Add new columns to user_profiles table
"""

import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent.parent / "jamb_questions.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    try:
        # Check existing columns
        cursor.execute("PRAGMA table_info(user_profiles)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Current columns: {columns}")

        # Add missing columns
        if 'age' not in columns:
            cursor.execute("ALTER TABLE user_profiles ADD COLUMN age INTEGER")
            print("✓ Added 'age' column")
        else:
            print("- 'age' column already exists")

        if 'department' not in columns:
            cursor.execute("ALTER TABLE user_profiles ADD COLUMN department TEXT")
            print("✓ Added 'department' column")
        else:
            print("- 'department' column already exists")

        if 'state' not in columns:
            cursor.execute("ALTER TABLE user_profiles ADD COLUMN state TEXT")
            print("✓ Added 'state' column")
        else:
            print("- 'state' column already exists")

        if 'local_government' not in columns:
            cursor.execute("ALTER TABLE user_profiles ADD COLUMN local_government TEXT")
            print("✓ Added 'local_government' column")
        else:
            print("- 'local_government' column already exists")

        conn.commit()
        print("\n✅ Migration completed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
