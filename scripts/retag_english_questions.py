"""
Retag English JAMB questions to clean topic names for guided learning.

Topic mapping:
  Section A: Comprehension and Summary  → Comprehension & Summary
  Section C: Oral Forms                 → Oral English
  Section D: Literature (...)           → Literature (The Life Changer)
  Section B subtopics Antonyms/Synonyms/Idioms → Vocabulary
  Section B subtopics Prepositions/Sentence completion → Grammar & Usage
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.db.database import get_connection

conn = get_connection()
c = conn.cursor()

print("Retagging English JAMB questions...")

# 1. Oral English
c.execute(
    "UPDATE questions SET topic=%s WHERE subject=%s AND exam=%s AND topic=%s",
    ("Oral English", "English", "JAMB", "Section C: Oral Forms")
)
print(f"  Oral English:                  {c.rowcount} rows")

# 2. Comprehension & Summary
c.execute(
    "UPDATE questions SET topic=%s WHERE subject=%s AND exam=%s AND topic=%s",
    ("Comprehension & Summary", "English", "JAMB", "Section A: Comprehension and Summary")
)
print(f"  Comprehension & Summary:       {c.rowcount} rows")

# 3. Literature (The Life Changer)
c.execute(
    "UPDATE questions SET topic=%s WHERE subject=%s AND exam=%s AND topic=%s",
    ("Literature (The Life Changer)", "English", "JAMB", "Section D: Literature (The Life Changer)")
)
print(f"  Literature (The Life Changer): {c.rowcount} rows")

# 4. Vocabulary (from Section B by subtopic)
c.execute(
    "UPDATE questions SET topic=%s WHERE subject=%s AND exam=%s AND subtopic = ANY(%s)",
    ("Vocabulary", "English", "JAMB", ["Antonyms", "Synonyms", "Idioms and expressions"])
)
print(f"  Vocabulary:                    {c.rowcount} rows")

# 5. Grammar & Usage (from Section B by subtopic)
c.execute(
    "UPDATE questions SET topic=%s WHERE subject=%s AND exam=%s AND subtopic = ANY(%s)",
    ("Grammar & Usage", "English", "JAMB", ["Prepositions", "Sentence completion"])
)
print(f"  Grammar & Usage:               {c.rowcount} rows")

conn.commit()

print()
print("Final topic distribution:")
c.execute(
    "SELECT topic, COUNT(*) FROM questions WHERE subject=%s AND exam=%s GROUP BY topic ORDER BY COUNT(*) DESC",
    ("English", "JAMB")
)
for topic, count in c.fetchall():
    print(f"  {count:4d}  [{topic}]")

conn.close()
print("\nDone.")
