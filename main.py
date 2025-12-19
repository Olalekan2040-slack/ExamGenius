"""
ExamGenius API - JAMB Exam Preparation Platform
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi
import os

from app.core.config import settings
from app.api.v1.api import api_router


def create_application() -> FastAPI:
    """
    Application factory pattern
    Creates and configures the FastAPI application

    Returns:
        FastAPI: Configured application instance
    """
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Comprehensive JAMB Exam Preparation Platform with AI-powered learning",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        swagger_ui_parameters={"persistAuthorization": True}
    )

    # Configure CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API v1 router
    application.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # Mount static files for serving question images
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    if os.path.exists(static_dir):
        application.mount("/static", StaticFiles(directory=static_dir), name="static")

    # Customize OpenAPI schema for Bearer authentication
    def custom_openapi():
        if application.openapi_schema:
            return application.openapi_schema

        openapi_schema = get_openapi(
            title=application.title,
            version=application.version,
            description=application.description,
            routes=application.routes,
        )

        # Add security scheme
        openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})["BearerAuth"] = {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token"
        }
        openapi_schema["security"] = [{"BearerAuth": []}]

        application.openapi_schema = openapi_schema
        return application.openapi_schema

    application.openapi = custom_openapi

    return application


# Create app instance
app = create_application()


@app.get("/", tags=["Root"])
async def root():
    """API root endpoint - health check"""
    return {
        "message": "Welcome to ExamGenius API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api": settings.API_V1_PREFIX
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
