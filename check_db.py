import psycopg2
from urllib.parse import urlparse
from app.core.config import settings

# Parse the database URL
parsed_url = urlparse(settings.DATABASE_URL)

# Connect to database
conn = psycopg2.connect(
    dbname=parsed_url.path.lstrip('/'),
    user=parsed_url.username,
    password=parsed_url.password,
    host=parsed_url.hostname,
    port=parsed_url.port or 5432
)

cursor = conn.cursor()

# Get all tables
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
""")

tables = cursor.fetchall()
print("=== Database Tables ===")
for table in tables:
    print(f"- {table[0]}")

# Check specific tables
required_tables = ['users', 'user_streaks', 'user_profiles', 'user_subjects', 'practice_attempts', 'exam_sessions', 'user_stats']
print("\n=== Required Tables Status ===")
table_names = [t[0] for t in tables]
for req_table in required_tables:
    status = "✓" if req_table in table_names else "✗ MISSING"
    print(f"{status} {req_table}")

# Check user_streaks table data
if 'user_streaks' in table_names:
    cursor.execute("SELECT COUNT(*) FROM user_streaks")
    count = cursor.fetchone()[0]
    print(f"\nuser_streaks rows: {count}")
else:
    print("\n⚠️ user_streaks table is missing!")

cursor.close()
conn.close()
