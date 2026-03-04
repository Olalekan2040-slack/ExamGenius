"""
Core Configuration Settings
Environment variables and app configuration
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App Info
    APP_NAME: str = "ExamGenius API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str = "change-this-in-production-use-env-file"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database - MUST be set via environment variable in production
    DATABASE_URL: str = ""

    # CORS - includes both development and production origins
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8080",
        "https://exam.mooo.com",
        "http://exam.mooo.com",
        "https://examgenius.mooo.com",
        "http://examgenius.mooo.com",
        "https://examgenius.ng",
        "http://examgenius.ng",
        "https://www.examgenius.ng",
    ]

    # AI API Keys
    OPENROUTER_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    # Email Configuration
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_PORT: int = 587
    MAIL_SERVER: Optional[str] = None
    MAIL_FROM_NAME: str = "ExamGenius"

    # App URLs and modes
    BASE_URL: str = "http://localhost:8000"
    DEV_MODE: bool = True

    # SMTP sender credentials
    SENDER_EMAIL: Optional[str] = None
    SENDER_PASSWORD: Optional[str] = None

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60

    # CBT gating
    CBT_PRACTICE_WARNING: bool = True

    # Database Auto-Sync
    DB_AUTO_SYNC: bool = False  # Set to True in production to auto-import questions

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
