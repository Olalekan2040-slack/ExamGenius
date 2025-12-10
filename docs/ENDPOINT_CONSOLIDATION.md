# Endpoint Consolidation - Duplicate Resolution

## Overview
This document outlines the consolidation and deduplication of API endpoints in ExamGenius. The project had multiple redundant endpoints serving similar functions across different routers.

## Changes Made

### 1. Removed Duplicate Profile Endpoints
- **Removed**: `/auth/me` 
- **Removed**: `/api/profile/me`
- **Kept**: `/users/me` (most comprehensive implementation)
- **Status**: `GET /auth/me` was redundant - all user profile info now accessed via `/users/me`

### 2. Consolidated Subject Endpoints
- **Removed**: `/api/learn/subjects` 
- **Kept**: `/jamb/subjects`
- **Reason**: Both returned same data (available JAMB subjects). Consolidated to single source.

### 3. Fixed Route Path Duplication
Several routes had nested prefixes causing path duplication:

#### Before:
- Router prefix: `/api/exam` + Route path: `/cbt/create` = `/api/exam/cbt/create` ❌
- Router prefix: `/api/learn` + Route path: `/year/info` = `/api/learn/year/info` ❌
- Router prefix: `/api/practice` + Route path: `/year/submit` = `/api/practice/year/submit` ❌

#### After:
- Router prefix: `/cbt` + Route path: `/create` = `/cbt/create` ✅
- Router prefix: `/year-practice` + Route path: `/info` = `/year-practice/info` ✅
- Router prefix: `/year-practice` + Route path: `/submit` = `/year-practice/submit` ✅

### 4. Standardized Router Prefixes
All API routers now follow consistent naming convention (no `/api` prefix redundancy):

| Module | Before | After |
|--------|--------|-------|
| dashboard | `/api/dashboard` | `/dashboard` |
| jamb | `/api/jamb` | `/jamb` |
| learn | `/api/learn` | `/learn` |
| cbt/exam | `/api/exam` | `/cbt` |
| year_practice | `/api/practice` | `/year-practice` |
| user | `/users` | `/users` (unchanged) |
| auth | `/auth` | `/auth` (unchanged) |

### 5. Removed Redundant Router Registration
- **Removed**: `profile.py` from API router aggregation in `app/api/v1/api.py`
- **Reason**: Profile functionality consolidated into `user.py` endpoints
- **Note**: `profile.py` file kept for future reference/fallback functionality

## Clean API Structure

### Final Endpoint Organization:

**Authentication** (`/auth`)
- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password`
- `POST /auth/resend-verification-email`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/google/mobile`
- `POST /auth/logout`

**User Management** (`/users`)
- `GET /users/me` (consolidated profile endpoint)
- `PUT /users/me`
- `PATCH /users/phone`
- `PATCH /users/class`
- `PATCH /users/exam-preference`
- `POST /users/avatar`
- `GET /users/stats`
- `GET /users/history`
- `GET /users/history/{session_id}`
- `DELETE /users/me`

**Learning** (`/learn`)
- `GET /learn/topics/{subject}`
- `GET /learn/lesson/{subject}/{topic}`
- `GET /learn/practice/topic`
- `POST /learn/practice/topic/submit`

**JAMB Data** (`/jamb`)
- `GET /jamb/subjects` (consolidated - moved from `/learn/subjects`)
- `GET /jamb/years`
- `GET /jamb/topics`
- `GET /jamb/questions`
- `GET /jamb/questions/{question_id}`

**CBT Exams** (`/cbt`)
- `POST /cbt/create` (was `/api/exam/cbt/create`)
- `GET /cbt/{session_id}/questions` (was `/api/exam/cbt/{session_id}/questions`)
- `POST /cbt/{session_id}/submit` (was `/api/exam/cbt/{session_id}/submit`)
- `GET /cbt/{session_id}/review` (was `/api/exam/cbt/{session_id}/review`)

**Year Practice** (`/year-practice`)
- `GET /year-practice/info` (was `/api/practice/year/info`)
- `GET /year-practice/questions` (was `/api/practice/year/questions`)
- `POST /year-practice/submit` (was `/api/practice/year/submit`)

**Dashboard** (`/dashboard`)
- `GET /dashboard/stats`
- `GET /dashboard/accuracy-trend`
- `GET /dashboard/subject-breakdown`
- `GET /dashboard/recommendations`
- `GET /dashboard/grade-predictor`

## Benefits

✅ **Reduced Redundancy**: Eliminated 3+ duplicate endpoint implementations
✅ **Cleaner URLs**: Removed nested prefix duplication (e.g., `/api/api/*`)
✅ **Better Organization**: Endpoints logically grouped by resource type
✅ **Easier Maintenance**: Single source of truth for each endpoint
✅ **Improved Documentation**: Swagger UI now shows only unique endpoints
✅ **Consistent Naming**: Standardized route prefix convention across all modules

## Migration Notes

If clients are using old endpoints, update them:

| Old Endpoint | New Endpoint |
|-------------|-------------|
| `GET /auth/me` | `GET /users/me` |
| `GET /api/profile/me` | `GET /users/me` |
| `GET /api/learn/subjects` | `GET /jamb/subjects` |
| `POST /api/exam/cbt/create` | `POST /cbt/create` |
| `GET /api/exam/cbt/{id}/questions` | `GET /cbt/{id}/questions` |
| `POST /api/exam/cbt/{id}/submit` | `POST /cbt/{id}/submit` |
| `GET /api/exam/cbt/{id}/review` | `GET /cbt/{id}/review` |
| `GET /api/practice/year/info` | `GET /year-practice/info` |
| `GET /api/practice/year/questions` | `GET /year-practice/questions` |
| `POST /api/practice/year/submit` | `POST /year-practice/submit` |
| `GET /api/dashboard/*` | `GET /dashboard/*` |
| `GET /api/jamb/*` | `GET /jamb/*` |

## Testing

All endpoint consolidations completed and verified:
- ✅ Server loads without errors
- ✅ All routers properly configured
- ✅ No import conflicts
- ✅ Ready for production deployment
