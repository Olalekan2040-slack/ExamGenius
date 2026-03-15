"""Quick script to show topic distribution for Chemistry and Physics"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.db.database import get_connection

conn = get_connection()
c = conn.cursor()
for subj in ['Chemistry', 'Physics']:
    c.execute("SELECT topic, COUNT(*) FROM questions WHERE subject=%s GROUP BY topic ORDER BY topic", (subj,))
    rows = c.fetchall()
    total = sum(r[1] for r in rows)
    print(f"\n--- {subj} ({total} total, {len(rows)} topics) ---")
    for t, n in rows:
        print(f"  {n:4d}  {t}")
conn.close()
