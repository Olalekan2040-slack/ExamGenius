"""Add missing columns to questions table on the live server"""
import psycopg2
import sys
import os
sys.path.insert(0, '/home/ubuntu/examgenius')

# Load .env manually so settings picks it up
env_file = '/home/ubuntu/examgenius/.env'
if os.path.exists(env_file):
    for line in open(env_file):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


db_url = os.environ.get('DATABASE_URL', '')
if not db_url:
    print("ERROR: DATABASE_URL not found in environment")
    sys.exit(1)

print(f"Connecting to DB...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

# Add missing columns
missing_columns = [
    ("passage", "TEXT"),
]

for col, coltype in missing_columns:
    try:
        cur.execute(
            f"ALTER TABLE questions ADD COLUMN IF NOT EXISTS {col} {coltype}")
        print(f"Added column: questions.{col} {coltype}")
    except Exception as e:
        print(f"  Warning for {col}: {e}")

# Verify
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='questions' ORDER BY ordinal_position")
cols = [r[0] for r in cur.fetchall()]
print(f"\nquestions columns ({len(cols)}): {cols}")
conn.close()
print("Done.")
