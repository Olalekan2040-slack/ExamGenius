"""
Promote a user to admin role in jamb_questions.db
Usage:
  python scripts/promote_admin.py <email>
"""
import sqlite3
from pathlib import Path
import sys

DB_PATH = Path(__file__).resolve().parents[1] / "jamb_questions.db"

def promote(email: str) -> int:
    if not DB_PATH.exists():
        print(f"❌ Database not found at {DB_PATH}")
        return 2

    con = sqlite3.connect(str(DB_PATH))
    cur = con.cursor()

    # Ensure role column exists
    cols = [r[1] for r in cur.execute("PRAGMA table_info(users)")]
    if "role" not in cols:
        print("ℹ️ Adding role column to users table...")
        cur.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student'")
        con.commit()

    cur.execute("UPDATE users SET role='admin' WHERE email=?", (email,))
    con.commit()
    updated = cur.rowcount

    row = cur.execute("SELECT id, email, role FROM users WHERE email=?", (email,)).fetchone()
    con.close()

    if updated == 0:
        print(f"❌ User not found for email: {email}")
        return 1

    print(f"✅ Promoted to admin: id={row[0]}, email={row[1]}, role={row[2]}")
    return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/promote_admin.py <email>")
        return 2
    email = sys.argv[1].strip()
    return promote(email)

if __name__ == "__main__":
    raise SystemExit(main())
