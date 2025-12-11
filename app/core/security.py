from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request, Header
from google.auth.transport import requests
from google.oauth2 import id_token
import os
import secrets
from functools import wraps
from app.db.database import get_connection

# Use argon2 for password hashing (no 72-byte limit)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Token settings
VERIFICATION_TOKEN_EXPIRE_HOURS = 24
RESET_TOKEN_EXPIRE_HOURS = 1


def hash_password(password: str) -> str:
    """Hash password using argon2"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token (15 minutes)"""
    to_encode = data.copy()
    # Convert sub to string if it's an integer (JWT spec requires string)
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token (7 days)"""
    to_encode = data.copy()
    # Convert sub to string if it's an integer (JWT spec requires string)
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, token_type: str = "access"):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Check token type
        if payload.get("type") != token_type:
            raise JWTError(
                f"Invalid token type. Expected {token_type}, got {payload.get('type')}")

        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise JWTError("Invalid token: missing user_id")

        # Convert back to integer
        user_id = int(user_id_str)
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTClaimsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token claims: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_google_token(token: str):
    """Verify Google ID token and return claims"""
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID)
        return idinfo
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )


def generate_verification_token() -> str:
    """Generate a secure verification token"""
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """Generate a secure password reset token"""
    return secrets.token_urlsafe(32)


def get_current_user(authorization: str = None) -> int:
    """
    Dependency to get current user from Bearer token in Authorization header
    Usage: @app.get("/protected")
           def protected_route(user_id: int = Depends(get_current_user)):
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authorization header format. Expected 'Bearer <token>', got '{authorization[:50]}...'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]
    return verify_token(token, token_type="access")


def get_current_user_from_request(request: Request) -> int:
    """
    Get current user from Authorization header in request
    Usage: @app.get("/protected")
           @require_auth()
           def protected_route(request: Request, current_user: int):
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )

    return get_current_user(auth_header)


async def current_user_id(authorization: str = Header(None)) -> int:
    """FastAPI dependency that returns the authenticated user id from a Bearer token."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return get_current_user(authorization)


def require_auth():
    """
    Decorator for protecting routes using Bearer token from Authorization header
    Usage:
        @app.get("/protected")
        @require_auth()
        def protected_route(request: Request, current_user: int):
            return {"user_id": current_user}
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing authorization header"
                )

            user_id = get_current_user(auth_header)
            kwargs["current_user"] = user_id
            return await func(request, *args, **kwargs)

        return wrapper
    return decorator


def is_token_invalidated(refresh_token: str, user_id: int) -> bool:
    """Check if refresh token has been invalidated (logged out)"""
    db = get_connection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM invalidated_tokens WHERE user_id = ? AND token = ?",
        (user_id, refresh_token)
    )

    return cursor.fetchone() is not None


def invalidate_refresh_token(refresh_token: str, user_id: int):
    """Invalidate a refresh token (on logout)"""
    db = get_connection()
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO invalidated_tokens (user_id, token) VALUES (?, ?)",
        (user_id, refresh_token)
    )
    db.commit()
