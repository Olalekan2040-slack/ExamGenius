#!/usr/bin/env python3
"""Add passage column to questions table on the server."""
from app.core.config import settings
import psycopg2
import sys
sys.path.insert(0, '/home/ubuntu/examgenius')

conn = psycopg2.connect(settings.DATABASE_URL)
conn.autocommit = True
cur = conn.cursor()

cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='questions' ORDER BY ordinal_position")
cols = [r[0] for r in cur.fetchall()]
print("questions columns:", cols)

if 'passage' not in cols:
    cur.execute("ALTER TABLE questions ADD COLUMN passage TEXT")
    print("SUCCESS: passage column added")
else:
    print("OK: passage column already exists")

conn.close()
print("Done")
