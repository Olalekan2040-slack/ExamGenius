"""
Promote a user to admin role in PostgreSQL
Usage:
  python scripts/promote_admin.py <email>
"""
import psycopg2
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings


def promote(email: str) -> int:
    if not settings.DATABASE_URL:
        print("ERROR: DATABASE_URL not set in .env")
        return 2

    conn = psycopg2.connect(settings.DATABASE_URL, connect_timeout=10)
    cur = conn.cursor()

    cur.execute("UPDATE users SET role='admin' WHERE email=%s", (email,))
    conn.commit()
    updated = cur.rowcount

    cur.execute("SELECT id, email, role FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    conn.close()

    if updated == 0:
        print(f"User not found for email: {email}")
        return 1

    print(f"Promoted to admin: id={row[0]}, email={row[1]}, role={row[2]}")
    return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/promote_admin.py <email>")
        return 2
    email = sys.argv[1].strip()
    return promote(email)


if __name__ == "__main__":
    raise SystemExit(main())
