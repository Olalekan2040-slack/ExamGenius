"""
Initialize PostgreSQL database schema for ExamGenius
Creates all necessary tables for user management, practice, and analytics
"""

import psycopg2
from pathlib import Path
import sys


def init_postgres_schema():
    """Initialize PostgreSQL schema"""
    
    # Database connection parameters
    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'ExamgeniusDB',
        'user': 'postgres',
        'password': 'Policewomen@007'
    }
    
    try:
        print("Connecting to PostgreSQL...")
        conn = psycopg2.connect(**db_config)
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
        
        # Create a test admin user
        print("\nCreating test admin user...")
        from datetime import datetime
        import hashlib
        
        test_email = "admin@examgenius.ng"
        test_password = "admin123"  # Change this!
        hashed_pwd = hashlib.sha256(test_password.encode()).hexdigest()
        
        try:
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, is_verified, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO NOTHING
                RETURNING id
            """, ("Admin User", test_email, hashed_pwd, "admin", 1, datetime.now()))
            
            result = cursor.fetchone()
            if result:
                print(f"=> Admin user created: {test_email} / {test_password}")
            else:
                print(f"INFO: Admin user already exists: {test_email}")
            
            conn.commit()
        except Exception as e:
            print(f"WARNING: Could not create admin user: {e}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("DATABASE INITIALIZATION COMPLETE!")
        print("="*60)
        print(f"""
Database: {db_config['database']}
Host: {db_config['host']}:{db_config['port']}
Total Tables: {len(tables)}

Test Admin Credentials:
  Email: {test_email}
  Password: {test_password}

WARNING: Change the admin password in production!

Next Steps:
1. Update your .env file with DATABASE_URL
2. Import existing data if migrating from SQLite
3. Start the FastAPI server: uvicorn app.main:app --reload
        """)
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
