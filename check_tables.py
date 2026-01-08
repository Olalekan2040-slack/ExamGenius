from app.db.database import get_connection

conn = get_connection()
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("=== Database Tables ===")
for table in tables:
    print(f"- {table[0]}")

# Check if user_streaks table exists and has data
if 'user_streaks' in [t[0] for t in tables]:
    cursor.execute("SELECT COUNT(*) FROM user_streaks")
    count = cursor.fetchone()[0]
    print(f"\n=== user_streaks table: {count} rows ===")
else:
    print("\n⚠️ user_streaks table does NOT exist!")

# Check user_profiles table
if 'user_profiles' in [t[0] for t in tables]:
    cursor.execute("SELECT COUNT(*) FROM user_profiles")
    count = cursor.fetchone()[0]
    print(f"user_profiles table: {count} rows")
else:
    print("⚠️ user_profiles table does NOT exist!")

# Check user_subjects table
if 'user_subjects' in [t[0] for t in tables]:
    cursor.execute("SELECT COUNT(*) FROM user_subjects")
    count = cursor.fetchone()[0]
    print(f"user_subjects table: {count} rows")
else:
    print("⚠️ user_subjects table does NOT exist!")

conn.close()
