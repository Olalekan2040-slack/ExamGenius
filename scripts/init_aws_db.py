"""
Initialize PostgreSQL database schema for ExamGenius (Production Ready)
Uses DATABASE_URL from environment or .env file
Creates all necessary tables for user management, practice, and analytics
"""

import os
import sys
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Note: python-dotenv not installed, using environment variables only")

import psycopg2


def init_schema():
    """Initialize PostgreSQL schema using DATABASE_URL from environment"""
    
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        print("ERROR: DATABASE_URL environment variable is not set!")
        print("\nPlease set it in your .env file or environment:")
        print("  DATABASE_URL=postgresql://user:password@host:5432/dbname")
        return False
    
    try:
        print(f"Connecting to PostgreSQL...")
        print(f"  URL: {database_url.split('@')[1] if '@' in database_url else 'hidden'}")
        
        conn = psycopg2.connect(database_url)
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
        
        print(f"\n{'='*50}")
        print(f"Total tables created: {len(tables)}")
        print(f"{'='*50}")
        for table in tables:
            print(f"  ✓ {table[0]}")
        
        cursor.close()
        conn.close()
        
        print(f"\n{'='*50}")
        print("DATABASE INITIALIZATION COMPLETE!")
        print(f"{'='*50}")
        return True
        
    except Exception as e:
        print(f"\nERROR: Failed to initialize database!")
        print(f"  {e}")
        return False


if __name__ == "__main__":
    success = init_schema()
    sys.exit(0 if success else 1)
