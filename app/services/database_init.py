"""
Database initialization service for automatic table creation
Ensures database schema is ready on application startup
"""

import psycopg2
import logging
from pathlib import Path
from typing import Dict, Any

from app.db.database import get_db_connection
from app.core.config import settings

logger = logging.getLogger(__name__)


class DatabaseInitService:
    """Service for automatic database initialization"""

    @staticmethod
    def check_tables_exist() -> bool:
        """
        Check if essential tables exist in the database

        Returns:
            bool: True if all essential tables exist
        """
        essential_tables = [
            'users', 'user_profiles', 'user_subjects',
            'questions', 'options',
            'exam_sessions', 'session_questions', 'practice_attempts'
        ]

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Check if essential tables exist
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = ANY(%s)
            """, (essential_tables,))

            existing_tables = [row[0] for row in cursor.fetchall()]
            cursor.close()
            conn.close()

            missing_tables = set(essential_tables) - set(existing_tables)

            if missing_tables:
                logger.info(
                    f"Missing tables detected: {', '.join(missing_tables)}")
                return False

            logger.info("All essential tables exist")
            return True

        except Exception as e:
            logger.error(f"Error checking table existence: {e}")
            return False

    @staticmethod
    def create_schema() -> Dict[str, Any]:
        """
        Create database schema from postgres_schema.sql

        Returns:
            Dict with status and details
        """
        try:
            # Get schema file path
            schema_path = Path(__file__).parent.parent.parent / \
                "scripts" / "postgres_schema.sql"

            if not schema_path.exists():
                return {
                    'status': 'error',
                    'message': f'Schema file not found: {schema_path}'
                }

            # Read schema SQL
            with open(schema_path, 'r', encoding='utf-8') as f:
                schema_sql = f.read()

            # Execute schema creation
            conn = get_db_connection()
            cursor = conn.cursor()

            logger.info("Creating database schema...")
            cursor.execute(schema_sql)
            conn.commit()

            # Verify tables created
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """)
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]

            cursor.close()
            conn.close()

            logger.info(
                f"Database schema created successfully! {len(tables)} tables ready.")

            return {
                'status': 'success',
                'tables_created': len(tables),
                'table_names': table_names
            }

        except psycopg2.Error as e:
            logger.error(f"PostgreSQL error during schema creation: {e}")
            return {
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }
        except Exception as e:
            logger.error(f"Unexpected error during schema creation: {e}")
            return {
                'status': 'error',
                'message': f'Unexpected error: {str(e)}'
            }

    @staticmethod
    def run_column_migrations() -> None:
        """
        Add any columns that were introduced after the initial schema creation.
        Each ALTER is idempotent (IF NOT EXISTS) so it is safe to run on every startup.
        """
        migrations = [
            # questions: rich-content columns added in schema v2
            "ALTER TABLE questions ADD COLUMN IF NOT EXISTS table_html TEXT",
            "ALTER TABLE questions ADD COLUMN IF NOT EXISTS passage TEXT",
            # year_practice_sessions: results_json added after initial table creation
            "ALTER TABLE year_practice_sessions ADD COLUMN IF NOT EXISTS results_json TEXT",
        ]
        try:
            conn = get_db_connection()
            for ddl in migrations:
                try:
                    cursor = conn.cursor()
                    cursor.execute("SAVEPOINT col_migration")
                    cursor.execute(ddl)
                    cursor.execute("RELEASE SAVEPOINT col_migration")
                except Exception as col_err:
                    try:
                        cursor.execute("ROLLBACK TO SAVEPOINT col_migration")
                    except Exception:
                        pass
                    logger.warning(f"Column migration skipped ({col_err}): {ddl}")
            conn.commit()
            logger.info("✓ Column migrations applied")
        except Exception as e:
            logger.error(f"Column migration error: {e}")

    @staticmethod
    def initialize_database() -> Dict[str, Any]:
        """
        Main initialization method - checks and creates schema if needed

        Returns:
            Dict with initialization status
        """
        logger.info("Starting database initialization check...")

        try:
            # Test database connection first
            conn = get_db_connection()
            conn.close()
            logger.info("✓ Database connection successful")
        except Exception as e:
            logger.error(f"✗ Database connection failed: {e}")
            return {
                'status': 'error',
                'message': f'Cannot connect to database: {str(e)}'
            }

        # Check if tables exist
        if DatabaseInitService.check_tables_exist():
            logger.info("✓ Database schema is ready")
            # Always run column migrations so new columns are added to existing DBs
            DatabaseInitService.run_column_migrations()
            return {
                'status': 'ready',
                'message': 'Database schema already exists'
            }

        # Create schema if tables are missing
        logger.info("⚙️ Creating database schema...")
        result = DatabaseInitService.create_schema()

        if result['status'] == 'success':
            logger.info("✓ Database initialization completed successfully")
            logger.info(f"  - Tables created: {result['tables_created']}")
            # Run column migrations after fresh schema creation too
            DatabaseInitService.run_column_migrations()
        else:
            logger.error(
                f"✗ Database initialization failed: {result['message']}")

        return result
