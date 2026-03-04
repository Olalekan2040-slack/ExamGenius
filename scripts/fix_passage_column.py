#!/usr/bin/env python3
"""
Simple script to add 'passage' column to questions table.
Reads DATABASE_URL directly from .env file — no FastAPI imports needed.
"""
import os
import re
import psycopg2

ENV_FILE = '/home/ubuntu/examgenius/.env'

# Load .env manually
db_url = None
if os.path.exists(ENV_FILE):
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, _, val = line.partition('=')
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key == 'DATABASE_URL':
                    db_url = val
                    break

if not db_url:
    # Fallback: check environment variable
    db_url = os.environ.get('DATABASE_URL', '')

if not db_url:
    print("ERROR: DATABASE_URL not found in .env or environment")
    exit(1)

print(f"Connecting to: {db_url[:40]}...")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()

    # Check current columns
    cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name='questions'
        ORDER BY ordinal_position
    """)
    cols = [r[0] for r in cur.fetchall()]
    print(f"questions columns ({len(cols)}): {cols}")

    if 'passage' not in cols:
        cur.execute("ALTER TABLE questions ADD COLUMN passage TEXT")
        print("SUCCESS: passage column added to questions table")
    else:
        print("OK: passage column already exists — no change needed")

    conn.close()
    print("Done.")

except Exception as e:
    print(f"ERROR: {e}")
    exit(1)
