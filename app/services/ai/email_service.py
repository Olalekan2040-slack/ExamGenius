import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import secrets
import os

from app.core.config import settings

# Prefer settings (loads .env) with sensible fallbacks
SMTP_SERVER = settings.MAIL_SERVER or "smtp.gmail.com"
SMTP_PORT = settings.MAIL_PORT or 587
SENDER_EMAIL = settings.SENDER_EMAIL or settings.MAIL_USERNAME or os.getenv("SENDER_EMAIL") or os.getenv("MAIL_USERNAME") or ""
SENDER_PASSWORD = settings.SENDER_PASSWORD or settings.MAIL_PASSWORD or os.getenv("SENDER_PASSWORD") or os.getenv("MAIL_PASSWORD") or ""
BASE_URL = settings.BASE_URL
API_PREFIX = settings.API_V1_PREFIX if hasattr(settings, "API_V1_PREFIX") else "/api/v1"
PROJECT_NAME = "ExamGenius"
DEV_MODE = bool(settings.DEV_MODE)


def generate_verification_token() -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)


def send_verification_email(email: str, name: str, token: str) -> tuple[bool, str]:
    """Send email verification link to user. Returns (success, link)"""
    try:
        verification_link = f"{BASE_URL}{API_PREFIX}/auth/verify-email?token={token}"

        # In development mode, just log the link
        if DEV_MODE:
            print(f"\n{'='*60}")
            print(f"DEV MODE: Email would be sent to {email}")
            print(f"Name: {name}")
            print(f"Verification Link: {verification_link}")
            print(f"{'='*60}\n")
            return True, verification_link

        if not SENDER_EMAIL or not SENDER_PASSWORD:
            raise ValueError("SMTP credentials missing: set SENDER_EMAIL and SENDER_PASSWORD (or MAIL_USERNAME/MAIL_PASSWORD)")

        subject = f"Verify Your {PROJECT_NAME} Email"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to {PROJECT_NAME}! 👋</h2>
                <p>Hi {name},</p>
                <p>Thank you for signing up! To activate your account, please verify your email address.</p>
                <p>
                    <a href="{verification_link}" 
                       style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                       Verify Email
                    </a>
                </p>
                <p>Or copy this link: {verification_link}</p>
                <p>This link expires in 24 hours.</p>
                <p>Best regards,<br>The {PROJECT_NAME} Team</p>
            </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        print(f"[OK] Verification email sent to {email}")
        return True, verification_link
    except smtplib.SMTPAuthenticationError:
        print(f"[ERROR] SMTP Authentication failed: Check email/password")
        print(f"[FALLBACK] Verification link for {email}:")
        verification_link = f"{BASE_URL}{API_PREFIX}/auth/verify-email?token={token}"
        print(f"   {verification_link}")
        return False, verification_link
    except smtplib.SMTPException as e:
        print(f"[ERROR] SMTP error: {e}")
        print(f"[FALLBACK] Verification link for {email}:")
        verification_link = f"{BASE_URL}{API_PREFIX}/auth/verify-email?token={token}"
        print(f"   {verification_link}")
        return False, verification_link
    except Exception as e:
        print(f"[ERROR] Error sending verification email: {e}")
        print(f"[FALLBACK] Verification link for {email}:")
        verification_link = f"{BASE_URL}{API_PREFIX}/auth/verify-email?token={token}"
        print(f"   {verification_link}")
        return False, verification_link


def send_password_reset_email(email: str, name: str, token: str) -> tuple[bool, str]:
    """Send password reset link to user. Returns (success, link)"""
    try:
        reset_link = f"{BASE_URL}{API_PREFIX}/auth/reset-password?token={token}"

        # In development mode, just log the link
        if DEV_MODE:
            print(f"\n{'='*60}")
            print(f"DEV MODE: Password reset email would be sent to {email}")
            print(f"Name: {name}")
            print(f"Reset Link: {reset_link}")
            print(f"{'='*60}\n")
            return True, reset_link

        if not SENDER_EMAIL or not SENDER_PASSWORD:
            raise ValueError("SMTP credentials missing: set SENDER_EMAIL and SENDER_PASSWORD (or MAIL_USERNAME/MAIL_PASSWORD)")

        subject = f"Reset Your {PROJECT_NAME} Password"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>{PROJECT_NAME} Password Reset 🔐</h2>
                <p>Hi {name},</p>
                <p>We received a request to reset your password. Click the link below to set a new password.</p>
                <p>
                    <a href="{reset_link}" 
                       style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
                       Reset Password
                    </a>
                </p>
                <p>Or copy this link: {reset_link}</p>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, ignore this email.</p>
                <p>Best regards,<br>The {PROJECT_NAME} Team</p>
            </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        print(f"[OK] Password reset email sent to {email}")
        return True, reset_link
    except smtplib.SMTPAuthenticationError:
        print(f"[ERROR] SMTP Authentication failed: Check email/password")
        print(f"[FALLBACK] Password reset link for {email}:")
        reset_link = f"{BASE_URL}{API_PREFIX}/auth/reset-password?token={token}"
        print(f"   {reset_link}")
        return False, reset_link
    except smtplib.SMTPException as e:
        print(f"[ERROR] SMTP error: {e}")
        print(f"[FALLBACK] Password reset link for {email}:")
        reset_link = f"{BASE_URL}{API_PREFIX}/auth/reset-password?token={token}"
        print(f"   {reset_link}")
        return False, reset_link
    except Exception as e:
        print(f"[ERROR] Error sending password reset email: {e}")
        print(f"[FALLBACK] Password reset link for {email}:")
        reset_link = f"{BASE_URL}{API_PREFIX}/auth/reset-password?token={token}"
        print(f"   {reset_link}")
        return False, reset_link
