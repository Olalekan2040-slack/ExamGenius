"""
Dependency Injection Functions
Common dependencies used across endpoints
"""

from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.core.config import settings
from app.db.database import get_db_connection


# Security scheme
security = HTTPBearer()


def get_db() -> Generator:
    """Database dependency"""
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    conn = Depends(get_db)
) -> dict:
    """
    Validates JWT token and returns current user

    Args:
        credentials: Bearer token from request header
        conn: Database connection

    Returns:
        dict: Current user data

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Get user from database
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if user is None:
        raise credentials_exception

    # Convert to dict
    columns = [column[0] for column in cursor.description]
    user_dict = dict(zip(columns, user))

    return user_dict


async def get_current_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Ensures user account is active

    Args:
        current_user: Current authenticated user

    Returns:
        dict: Active user data

    Raises:
        HTTPException: If user account is inactive
    """
    if not current_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user
