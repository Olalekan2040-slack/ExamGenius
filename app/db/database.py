"""
Database Connection Management
Handles connections to SQLite databases for JAMB questions and user data
"""

import sqlite3
from pathlib import Path
from typing import Optional

# Database paths - using root directory where jamb_questions.db is located
BASE_DIR = Path(__file__).parent.parent.parent
DB_PATH = BASE_DIR / "jamb_questions.db"

# Singleton connection
_connection: Optional[sqlite3.Connection] = None


def get_db_connection() -> sqlite3.Connection:
    """
    Get or create a database connection

    Returns:
        sqlite3.Connection: Database connection

    Raises:
        FileNotFoundError: If database file doesn't exist
    """
    global _connection
    if _connection is None:
        # Check if database exists
        if not DB_PATH.exists():
            raise FileNotFoundError(
                f"Database not found at {DB_PATH}. "
                f"Please ensure jamb_questions.db exists in the project root."
            )

        _connection = sqlite3.connect(str(DB_PATH), check_same_thread=False)
        _connection.row_factory = sqlite3.Row

    return _connection


def get_db():
    """
    Dependency function for FastAPI to get database connection

    Yields:
        sqlite3.Connection: Database connection
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
        sqlite3.Connection: Database connection
    """
    return get_db_connection()


def close_db():
    """Close the database connection"""
    global _connection
    if _connection:
        _connection.close()
        _connection = None
