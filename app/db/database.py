"""
Database Connection Management
Handles connections to PostgreSQL database for JAMB questions and user data
"""

from typing import Optional
import psycopg2
import psycopg2.extras
from psycopg2 import extensions as pg_ext
from app.core.config import settings

# Singleton connection
_connection: Optional['PostgresConnectionCompat'] = None


class PostgresCursorCompat:
    """Wrapper to make psycopg2 cursor compatible with SQLite-style ? placeholders"""
    def __init__(self, cursor):
        self._cursor = cursor

    def execute(self, query: str, params=None):
        # Convert SQLite "?" placeholders to psycopg2 "%s"
        if "?" in query:
            query = query.replace("?", "%s")
        return self._cursor.execute(query, params or ())

    def executemany(self, query: str, seq_of_params):
        if "?" in query:
            query = query.replace("?", "%s")
        return self._cursor.executemany(query, seq_of_params)

    def fetchone(self):
        return self._cursor.fetchone()

    def fetchall(self):
        return self._cursor.fetchall()

    @property
    def rowcount(self):
        return self._cursor.rowcount

    @property
    def lastrowid(self):
        # PostgreSQL doesn't have lastrowid, but we can get it via RETURNING
        return None

    def close(self):
        return self._cursor.close()


class PostgresConnectionCompat:
    """PostgreSQL connection wrapper with compatibility methods"""
    def __init__(self, db_url):
        self._db_url = db_url
        self._conn = None
        self._connect()

    def _connect(self):
        """Establish database connection"""
        try:
            self._conn = psycopg2.connect(self._db_url, connect_timeout=10)
        except Exception as e:
            raise Exception(f"Failed to connect to PostgreSQL: {e}")

    def cursor(self):
        """Get a cursor, creating new connection if needed"""
        # Check if connection is alive, if not reconnect
        if self._conn is None:
            self._connect()
        
        try:
            # If previous statement failed, clear aborted transaction so next queries work
            if self._conn.get_transaction_status() == pg_ext.TRANSACTION_STATUS_INERROR:
                self._conn.rollback()
            # Try to use existing connection
            real_cursor = self._conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            return PostgresCursorCompat(real_cursor)
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            # Connection died, reconnect and try again
            try:
                self._connect()
                if self._conn.get_transaction_status() == pg_ext.TRANSACTION_STATUS_INERROR:
                    self._conn.rollback()
                real_cursor = self._conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
                return PostgresCursorCompat(real_cursor)
            except Exception as e:
                raise Exception(f"Failed to get cursor: {e}")

    def execute(self, query: str, params=None):
        cur = self.cursor()
        cur.execute(query, params)
        return cur

    def commit(self):
        if self._conn:
            return self._conn.commit()

    def rollback(self):
        if self._conn:
            return self._conn.rollback()

    def close(self):
        if self._conn:
            try:
                self._conn.close()
            except:
                pass
            self._conn = None

    @property
    def row_factory(self):
        return None

    @row_factory.setter
    def row_factory(self, value):
        pass  # PostgreSQL doesn't use row_factory


def get_db_connection():
    """
    Get or create a PostgreSQL database connection

    Returns:
        PostgresConnectionCompat: Database connection

    Raises:
        Exception: If PostgreSQL connection fails
    """
    global _connection
    if _connection is None:
        db_url = settings.DATABASE_URL
        
        # Validate DATABASE_URL is set
        if not db_url:
            raise Exception(
                "DATABASE_URL environment variable is not set. "
                "Please create a .env file with DATABASE_URL=postgresql://user:password@host:5432/dbname"
            )
        
        try:
            _connection = PostgresConnectionCompat(db_url)
        except Exception as e:
            raise Exception(f"Failed to connect to PostgreSQL: {e}")

    return _connection


def get_db():
    """
    Dependency function for FastAPI to get database connection

    Yields:
        PostgresConnectionCompat: Database connection
    """
    conn = get_db_connection()
    try:
        yield conn
    finally:
        pass  # Don't close singleton connection


def get_connection():
    """
    Get database connection for queries

    Returns:
        PostgresConnectionCompat: Database connection
    """
    return get_db_connection()


def close_db():
    """Close the database connection"""
    global _connection
    if _connection:
        _connection.close()
        _connection = None
