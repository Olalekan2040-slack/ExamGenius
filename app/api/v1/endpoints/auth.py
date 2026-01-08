"""
Authentication and User Management Endpoints
"""
from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
from fastapi.responses import RedirectResponse, JSONResponse
import os

from app.db.database import get_connection
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    verify_google_token,
    generate_verification_token,
    generate_reset_token,
    get_current_user_from_request,
    is_token_invalidated,
    invalidate_refresh_token,
    VERIFICATION_TOKEN_EXPIRE_HOURS,
    RESET_TOKEN_EXPIRE_HOURS,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)
from app.services.ai.email_service import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_OAUTH_REDIRECT_URL = "http://localhost:8000/auth/google/callback"


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @property
    def dict(self):
        return {"name": self.name, "email": self.email, "password": self.password}


class VerifyEmailRequest(BaseModel):
    token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class RequestPasswordResetRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class GoogleMobileRequest(BaseModel):
    id_token: str


# ============================================================================
# AUTH ENDPOINTS
# ============================================================================

@router.post("/register")
async def register(request: RegisterRequest):
    """
    Create a new account using email + password.
    Sends verification email.
    """
    db = get_connection()
    cursor = db.cursor()

    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = ?",
                       (request.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash password and generate verification token
        hashed_password = hash_password(request.password)
        verification_token = generate_verification_token()

        # Create user
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, reset_token)
            VALUES (?, ?, ?, ?)
            RETURNING id
        """, (request.name, request.email, hashed_password, verification_token))
        result = cursor.fetchone()
        user_id = result[0] if result else None
        db.commit()

        # Send verification email
        try:
            send_verification_email(
                request.email, request.name, verification_token)
        except Exception as e:
            print(f"Email send failed: {e}")

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "success": True,
                "message": "Account created. Verification email sent.",
                "user_id": user_id,
                "email": request.email
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/verify-email")
async def verify_email(request: VerifyEmailRequest):
    """
    Verify user email using verification token from email link.
    """
    db = get_connection()
    cursor = db.cursor()

    # Find user with this verification token
    cursor.execute(
        "SELECT id, email FROM users WHERE reset_token = ?",
        (request.token,)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    # Mark email as verified
    cursor.execute("""
        UPDATE users SET is_verified = 1, email_verified_at = ?, reset_token = NULL 
        WHERE id = ?
    """, (datetime.utcnow().isoformat(), user["id"]))
    db.commit()

    return {
        "success": True,
        "message": "Email verified successfully. You can now login.",
        "email": user["email"]
    }


@router.get("/verify-email")
async def verify_email_link(token: str):
    """Handle verification link clicks via GET with query param token."""
    db = get_connection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT id, email FROM users WHERE reset_token = ?",
        (token,)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    cursor.execute("""
        UPDATE users SET is_verified = 1, email_verified_at = ?, reset_token = NULL 
        WHERE id = ?
    """, (datetime.utcnow().isoformat(), user["id"]))
    db.commit()

    return {
        "success": True,
        "message": "Email verified successfully. You can now login.",
        "email": user["email"]
    }


@router.post("/login")
async def login(request: LoginRequest):
    """
    Login using email + password.
    Returns access_token (15 min) and refresh_token (7 days).
    """
    db = get_connection()
    cursor = db.cursor()

    # Find user by email
    cursor.execute(
        "SELECT id, name, password_hash, is_verified FROM users WHERE email = ?",
        (request.email,)
    )
    user = cursor.fetchone()

    # Validate credentials
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if email is verified
    if not user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your inbox."
        )

    # Create tokens
    access_token = create_access_token({"sub": user["id"]})
    refresh_token = create_refresh_token({"sub": user["id"]})

    # Store refresh token in database
    cursor.execute("""
        UPDATE users SET refresh_token = ? WHERE id = ?
    """, (refresh_token, user["id"]))
    db.commit()

    return {
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # seconds
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": request.email
        }
    }


@router.post("/refresh")
async def refresh_tokens(request: RefreshRequest):
    """
    Refresh JWT access token using refresh token.
    Returns new access_token.
    """
    db = get_connection()
    cursor = db.cursor()

    # Verify refresh token
    try:
        user_id = verify_token(request.refresh_token, token_type="refresh")
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    # Check if token is invalidated (logged out)
    if is_token_invalidated(request.refresh_token, user_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been invalidated. Please login again."
        )

    # Check if token matches stored token
    cursor.execute(
        "SELECT refresh_token FROM users WHERE id = ?",
        (user_id,)
    )
    user = cursor.fetchone()

    if not user or user["refresh_token"] != request.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Create new access token
    new_access_token = create_access_token({"sub": user_id})

    return {
        "success": True,
        "message": "Token refreshed",
        "access_token": new_access_token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/request-password-reset")
@router.post("/request-reset")
async def request_password_reset(request: RequestPasswordResetRequest):
    """
    Request password reset email.
    """
    db = get_connection()
    cursor = db.cursor()

    # Find user by email
    cursor.execute(
        "SELECT id, name FROM users WHERE email = ?",
        (request.email,)
    )
    user = cursor.fetchone()

    if not user:
        # Don't reveal if email exists (security)
        return {
            "success": True,
            "message": "If this email is registered, you'll receive a password reset link"
        }

    # Generate reset token
    reset_token = generate_reset_token()
    reset_expires = datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRE_HOURS)

    # Store reset token
    cursor.execute("""
        UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?
    """, (reset_token, reset_expires.isoformat(), user["id"]))
    db.commit()

    # Send reset email
    try:
        send_password_reset_email(request.email, user["name"], reset_token)
    except Exception as e:
        print(f"Email send failed: {e}")

    return {
        "success": True,
        "message": "If this email is registered, you'll receive a password reset link"
    }


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """
    Reset password using token from email.
    """
    db = get_connection()
    cursor = db.cursor()

    # Find user with valid reset token
    cursor.execute("""
        SELECT id FROM users 
        WHERE reset_token = ? AND reset_token_expires > ?
    """, (request.token, datetime.utcnow().isoformat()))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Hash new password and update
    hashed_password = hash_password(request.new_password)
    cursor.execute("""
        UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL 
        WHERE id = ?
    """, (hashed_password, user["id"]))
    db.commit()

    return {
        "success": True,
        "message": "Password reset successfully. You can now login with your new password."
    }


@router.get("/reset-password")
async def reset_password_link(token: str, new_password: Optional[str] = None):
    """
    Handle password reset link clicks via GET.
    If new_password is provided, reset it; otherwise return a form prompt or instructions.
    """
    db = get_connection()
    cursor = db.cursor()

    # Validate token
    cursor.execute("""
        SELECT id, email FROM users 
        WHERE reset_token = ? AND reset_token_expires > ?
    """, (token, datetime.utcnow().isoformat()))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # If new_password provided via query param, reset immediately (simple flow)
    if new_password:
        hashed_password = hash_password(new_password)
        cursor.execute("""
            UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL 
            WHERE id = ?
        """, (hashed_password, user["id"]))
        db.commit()
        return {
            "success": True,
            "message": "Password reset successfully. You can now login with your new password.",
            "email": user["email"]
        }

    # Token is valid; redirect to frontend reset password page
    frontend_url = f"http://localhost:8080/reset-password.html?token={token}&email={user['email']}"
    return RedirectResponse(url=frontend_url)


@router.post("/resend-verification-email")
async def resend_verification_email(request: ResendVerificationRequest):
    """
    Resend email verification link.
    """
    db = get_connection()
    cursor = db.cursor()

    # Find user by email
    cursor.execute(
        "SELECT id, name, is_verified FROM users WHERE email = ?",
        (request.email,)
    )
    user = cursor.fetchone()

    if not user:
        # Don't reveal if email exists (security)
        return {
            "success": True,
            "message": "If this email is registered, verification link will be resent"
        }

    # Check if already verified
    if user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified. You can login now."
        )

    # Generate new verification token
    verification_token = generate_verification_token()

    # Store new token
    cursor.execute("""
        UPDATE users SET reset_token = ? WHERE id = ?
    """, (verification_token, user["id"]))
    db.commit()

    # Send verification email
    try:
        send_verification_email(
            request.email, user["name"], verification_token)
    except Exception as e:
        print(f"Email send failed: {e}")

    return {
        "success": True,
        "message": "Verification link resent to your email"
    }


# ============================================================================
# GOOGLE OAUTH ENDPOINTS
# ============================================================================

@router.get("/google/login")
async def google_login():
    """
    Redirect user to Google OAuth login page.
    """
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_OAUTH_REDIRECT_URL}&"
        "response_type=code&"
        "scope=openid%20profile%20email"
    )
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str, state: Optional[str] = None):
    """
    Google redirects here after user authorizes.
    Exchange code for ID token and create/login user.

    Note: In production, exchange code for tokens on server side.
    For now, assume frontend handles token exchange.
    """
    return {
        "success": False,
        "message": "This endpoint requires server-side token exchange. Use POST /auth/google/mobile instead."
    }


@router.post("/google/mobile")
async def google_mobile_auth(request: GoogleMobileRequest):
    """
    Google mobile/web client authentication.
    Takes Google ID token and creates/logs in user.
    """
    db = get_connection()
    cursor = db.cursor()

    try:
        # Verify Google ID token
        idinfo = verify_google_token(request.id_token)
    except HTTPException:
        raise

    google_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name", "User")
    picture = idinfo.get("picture")

    if not google_id or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google token: missing required fields"
        )

    # Check if user already exists
    cursor.execute(
        "SELECT id, name FROM users WHERE google_id = ?", (google_id,))
    user = cursor.fetchone()

    if user:
        user_id = user["id"]
        user_name = user["name"]
    else:
        # Create new user
        cursor.execute("""
            INSERT INTO users (name, email, google_id, profile_pic_url, is_verified, email_verified_at)
            VALUES (?, ?, ?, ?, 1, ?)
            RETURNING id
        """, (name, email, google_id, picture, datetime.utcnow().isoformat()))
        result = cursor.fetchone()
        user_id = result[0] if result else None
        user_name = name
        db.commit()

    # Create tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})

    # Store refresh token
    refresh_expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    cursor.execute("""
        UPDATE users SET refresh_token = ?, refresh_token_expires = ? WHERE id = ?
    """, (refresh_token, refresh_expires.isoformat(), user_id))
    db.commit()

    return {
        "success": True,
        "message": f"Welcome, {user_name}!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id": user_id,
            "name": user_name,
            "email": email,
            "picture": picture
        }
    }


@router.post("/logout")
async def logout(request: Request):
    """
    Logout user by invalidating refresh token.
    Requires Authorization header: "Bearer <access_token>"
    """
    user_id = get_current_user_from_request(request)

    db = get_connection()
    cursor = db.cursor()

    # Get refresh token
    cursor.execute("SELECT refresh_token FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if user and user["refresh_token"]:
        # Invalidate refresh token
        invalidate_refresh_token(user["refresh_token"], user_id)

        # Clear refresh token from database
        cursor.execute("""
            UPDATE users SET refresh_token = NULL 
            WHERE id = ?
        """, (user_id,))
        db.commit()

    return {
        "success": True,
        "message": "Logged out successfully"
    }
