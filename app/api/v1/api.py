"""
API v1 Router Configuration
Aggregates all API endpoints for version 1
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    user,
    profile,
    learn,
    year_practice,
    cbt,
    dashboard,
    jamb,
    admin,
    performance,
    guided_learning,
)

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
# Note: Routers define their own prefixes via APIRouter(prefix=...)
api_router.include_router(auth.router)
api_router.include_router(user.router)
api_router.include_router(profile.router)
api_router.include_router(learn.router)
api_router.include_router(year_practice.router)
api_router.include_router(cbt.router)
api_router.include_router(dashboard.router)
api_router.include_router(jamb.router)
api_router.include_router(admin.router)
api_router.include_router(performance.router)
api_router.include_router(guided_learning.router)
