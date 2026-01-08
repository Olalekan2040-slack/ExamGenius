"""
Add options table for the main questions table (TEXT IDs)
"""
import psycopg2

# Connect to database
conn = psycopg2.connect(
    dbname="ExamgeniusDB",
    user="postgres",
    password="Policewomen@007",
    host="localhost",
    port=5432
)

cursor = conn.cursor()

# Create options table for main questions (TEXT ID)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        option_key TEXT NOT NULL,
        option_text TEXT NOT NULL,
        is_correct INTEGER DEFAULT 0,
        UNIQUE(question_id, option_key)
    )
""")

conn.commit()
print("✓ Created 'options' table for questions with TEXT IDs")

# Check if it was created
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'options'
""")

if cursor.fetchone():
    print("✓ Table 'options' exists")
else:
    print("✗ Table 'options' does NOT exist")

cursor.close()
conn.close()
