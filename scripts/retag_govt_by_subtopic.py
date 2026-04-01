"""
Retag ALL Government questions by extracting the correct topic name from their subtopic column.
Run: python scripts/retag_govt_by_subtopic.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.db.database import get_connection

# Maps substring in subtopic text -> canonical topic name (order matters: more specific first)
SUBTOPIC_TOPIC_MAP = [
    ("Basic Concepts in Government", "Basic Concepts in Government"),
    ("Forms of Government", "Forms of Government"),
    ("Arms of Government", "Arms of Government"),
    ("Structures of Governance", "Structures of Governance"),
    ("Systems of Governance", "Systems of Governance"),
    ("Political Ideologies", "Political Ideologies"),
    ("Principles of Democratic Government", "Principles of Democratic Government"),
    ("Processes of Legislation", "Processes of Legislation"),
    ("Electoral Process", "The Electoral Process"),
    ("Political Parties and Party Systems", "Political Parties and Party Systems"),
    ("Political Parties in Post-Independence", "Political Parties in Post-Independence Nigeria"),
    ("Pressure Groups", "Pressure Groups"),
    ("Public Opinion", "Public Opinion"),
    ("Civil Service", "The Civil Service"),
    ("Constitution", "Constitution"),
    ("Citizenship", "Citizenship"),
    ("Pre-Colonial Polities", "Pre-colonial Polities"),
    ("Pre-colonial Polities", "Pre-colonial Polities"),
    ("Imperialist Penetration", "Imperialist Penetration"),
    ("Process of Decolonization", "Process of Decolonization"),
    ("Constitutional Development", "Constitutional Development in Nigeria"),
    ("Post-Independence Constitutions", "Post-Independence Constitutions"),
    ("Institutions of Government", "Institutions of Government in Post-Independence Nigeria"),
    ("Public Commissions", "Public Commissions in Nigeria"),
    ("Nigerian Federalism", "Structure and Workings of Nigerian Federalism"),
    ("Public Corporations and Parastatals", "Public Corporations and Parastatals"),
    ("Local Government", "Local Government"),
    ("Military in Nigerian Politics", "The Military in Nigerian Politics"),
    ("ECOWAS", "International Organizations"),
    ("OAU", "International Organizations"),
    ("Commonwealth", "International Organizations"),
    ("OPEC", "International Organizations"),
    ("UNO", "International Organizations"),
    ("Nigeria's Foreign Policy", "Nigeria's Foreign Policy"),
    ("Foreign Policy", "Foreign Policy"),
    ("African Countries", "Relations with African Countries"),
]


def subtopic_to_topic(subtopic_text):
    if not subtopic_text:
        return None
    s = subtopic_text.lower()
    for keyword, topic in SUBTOPIC_TOPIC_MAP:
        if keyword.lower() in s:
            return topic
    return None


def main():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, topic, subtopic FROM questions WHERE subject=%s", ("Government",))
    rows = c.fetchall()
    print(f"Total Government questions: {len(rows)}")

    updated = 0
    skipped = 0
    unmapped = []

    for qid, old_topic, subtopic in rows:
        new_topic = subtopic_to_topic(subtopic)
        if new_topic and new_topic != old_topic:
            c.execute("UPDATE questions SET topic=%s WHERE id=%s", (new_topic, qid))
            updated += 1
        elif not new_topic:
            unmapped.append((qid, old_topic, subtopic))
            skipped += 1
        else:
            skipped += 1

    conn.commit()
    print(f"Updated: {updated}, Skipped (already correct): {skipped}")

    if unmapped:
        print(f"\nUnmapped questions ({len(unmapped)}) - no subtopic match:")
        for qid, old_topic, sub in unmapped[:10]:
            print(f"  id={qid}  topic=[{old_topic}]  subtopic=[{sub}]")

    print("\nNew topic distribution:")
    c.execute(
        "SELECT topic, COUNT(*) FROM questions WHERE subject=%s GROUP BY topic ORDER BY COUNT(*) DESC",
        ("Government",)
    )
    for t, n in c.fetchall():
        print(f"  {n:4d}  [{t}]")

    conn.close()


if __name__ == "__main__":
    main()
