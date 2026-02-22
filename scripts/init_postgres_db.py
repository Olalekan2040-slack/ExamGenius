"""
Initialize PostgreSQL database schema for ExamGenius
Creates all necessary tables from postgres_schema.sql
Reads DATABASE_URL from .env file
"""

import psycopg2
from pathlib import Path
import sys
import os


def load_database_url():
    """Load DATABASE_URL from .env file"""
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('DATABASE_URL='):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    
    # Fallback to environment variable
    return os.environ.get('DATABASE_URL', '')


def init_postgres_schema():
    """Initialize PostgreSQL schema"""
    
    db_url = load_database_url()
    if not db_url:
        print("ERROR: DATABASE_URL not found in .env file or environment variables")
        print("Expected format: DATABASE_URL=postgresql://user:password@host:5432/dbname")
        return False
    
    try:
        print("Connecting to PostgreSQL...")
        conn = psycopg2.connect(db_url, connect_timeout=10)
        cursor = conn.cursor()
        print("=> Connected successfully!")
        
        # Read schema file
        schema_path = Path(__file__).parent / "postgres_schema.sql"
        if not schema_path.exists():
            print(f"ERROR: Schema file not found: {schema_path}")
            return False
            
        print(f"\nReading schema from: {schema_path}")
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        print("\nCreating tables...")
        cursor.execute(schema_sql)
        conn.commit()
        print("=> Schema created successfully!")
        
        # Verify tables
        print("\nVerifying tables...")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        
        print(f"\nTotal tables created: {len(tables)}")
        for table in tables:
            print(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        
        # Parse host info for display (hide password)
        display_url = db_url.split('@')[1] if '@' in db_url else 'configured host'
        
        print("\n" + "="*60)
        print("DATABASE INITIALIZATION COMPLETE!")
        print("="*60)
        print(f"  Host: {display_url}")
        print(f"  Total Tables: {len(tables)}")
        print("\nNext Steps:")
        print("  1. Import questions: python scripts/import_jamb_postgres.py")
        print("  2. Start the server: uvicorn main:app --reload")
        print("="*60)
        
        return True
        
    except psycopg2.Error as e:
        print(f"\nPostgreSQL Error: {e}")
        return False
    except Exception as e:
        print(f"\nUnexpected Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = init_postgres_schema()
    sys.exit(0 if success else 1)
