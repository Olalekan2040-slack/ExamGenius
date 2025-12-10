# ExamGenius Codebase Architecture

## Project Structure (Refactored)

```
examgenius/
├── main.py                         # ✅ REFACTORED: Now 65 lines (app initialization + router registration)
│
├── routers/                        # ✅ NEW: Modular endpoint organization
│   ├── __init__.py
│   ├── auth.py                    # Authentication & OAuth (12 endpoints, 450 lines)
│   ├── user.py                    # User management (8 endpoints, 350 lines)
│   ├── profile.py                 # Profile setup & completion (5 endpoints, 300 lines)
│   ├── learn.py                   # Learning & lessons (5 endpoints, 350 lines)
│   ├── year_practice.py           # Year-based practice (3 endpoints, 250 lines)
│   ├── cbt.py                     # Full CBT sessions (4 endpoints, 500 lines)
│   └── dashboard.py               # Analytics & insights (5 endpoints, 400 lines)
│
├── jamb_router.py                 # JAMB question endpoints (5 endpoints)
│
├── ai/                            # AI services
│   ├── __init__.py
│   ├── gemini_service.py          # Google Gemini integration
│   └── email_service.py           # Email verification & password reset
│
├── database.py                    # SQLite connection singleton
├── auth.py                        # JWT authentication, token generation, hashing
│
├── past_questions/                # Pre-populated JAMB questions (JSON files)
│   ├── JAMB_Biology_2010_objective.json
│   ├── JAMB_Chemistry_2010_objective.json
│   ├── ... (50+ question files)
│
├── static/                        # Static files (uploads, images)
│   └── uploads/
│       └── profiles/              # User profile pictures
│
├── requirements.txt               # Python dependencies
├── .env                           # Environment variables
├── .gitignore
│
└── Documentation/                 # Generated documentation
    ├── REFACTORING_REPORT.md      # ✅ This refactoring summary
    ├── ENDPOINT_REFERENCE.md      # All endpoints documented
    ├── API_DOCUMENTATION.md       # Comprehensive API reference
    ├── FINAL_REPORT.md            # Project completion status
    └── ... (other docs)
```

---

## Router Organization (New)

### `/routers/auth.py` (12 endpoints)
**Purpose:** User authentication and authorization

**Endpoints:**
- `POST /auth/register` - Create new account
- `POST /auth/verify-email` - Email verification
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Complete password reset
- `POST /auth/resend-verification-email` - Resend verification
- `GET /auth/google/login` - Google OAuth redirect
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/google/mobile` - Mobile OAuth
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

**Import Pattern:**
```python
from routers.auth import router as auth_router
app.include_router(auth_router)
```

---

### `/routers/user.py` (8 endpoints)
**Purpose:** User account management

**Endpoints:**
- `GET /users/me` - Get user profile
- `PUT /users/me` - Update profile
- `DELETE /users/me` - Delete account
- `PATCH /users/phone` - Update phone number
- `PATCH /users/class` - Update class level
- `PATCH /users/exam-preference` - Update exam preference
- `POST /users/avatar` - Upload profile picture
- `GET /users/stats` - Get user statistics
- `GET /users/history` - Exam history
- `GET /users/history/{session_id}` - Session details

**Import Pattern:**
```python
from routers.user import router as user_router
app.include_router(user_router)
```

---

### `/routers/profile.py` (5 endpoints)
**Purpose:** Forced profile completion flow

**Endpoints:**
- `POST /api/profile/complete` - Forced profile setup
- `GET /api/profile/me` - Get profile with stats
- `PUT /api/profile/update` - Update profile info
- `PUT /api/profile/subjects` - Change 4 subjects
- `GET /api/profile/check-completion` - Check setup status

**Import Pattern:**
```python
from routers.profile import router as profile_router
app.include_router(profile_router, prefix="/api/profile")
```

---

### `/routers/learn.py` (5 endpoints)
**Purpose:** Learning topics and lessons

**Endpoints:**
- `GET /api/learn/subjects` - All subjects with counts
- `GET /api/learn/topics/{subject}` - Topics with user stats
- `GET /api/learn/lesson/{subject}/{topic}` - Cached AI lessons
- `GET /api/learn/practice/topic` - Topic practice questions
- `POST /api/learn/practice/topic/submit` - Grade answers

**Key Features:**
- AI lesson generation and caching
- Per-topic accuracy tracking
- Partial topic set flag

**Import Pattern:**
```python
from routers.learn import router as learn_router
app.include_router(learn_router, prefix="/api/learn")
```

---

### `/routers/year_practice.py` (3 endpoints)
**Purpose:** Year-based practice from past JAMB papers

**Endpoints:**
- `GET /api/practice/year/info` - Years and pool info
- `GET /api/practice/year/questions` - Practice questions
- `POST /api/practice/year/submit` - Submit and grade

**Key Features:**
- Pool validation (≥100 questions minimum)
- Incomplete year data flag
- Per-topic accuracy breakdown

**Import Pattern:**
```python
from routers.year_practice import router as year_practice_router
app.include_router(year_practice_router, prefix="/api/practice")
```

---

### `/routers/cbt.py` (4 endpoints)
**Purpose:** Full CBT exam sessions with AI integration

**Endpoints:**
- `POST /api/exam/cbt/create` - Create 160-question session
- `GET /api/exam/cbt/{session_id}/questions` - Get questions
- `POST /api/exam/cbt/{session_id}/submit` - Submit answers
- `GET /api/exam/cbt/{session_id}/review` - Review results

**Key Features:**
- 160 questions (40 each from 4 subjects)
- AI-generated slot 3 questions
- Session token expiry (180 minutes)
- No duplicate questions within session
- Subject-wise score breakdown

**Import Pattern:**
```python
from routers.cbt import router as cbt_router
app.include_router(cbt_router, prefix="/api/exam")
```

---

### `/routers/dashboard.py` (5 endpoints)
**Purpose:** User analytics and insights

**Endpoints:**
- `GET /api/dashboard/stats` - Overall statistics
- `GET /api/dashboard/accuracy-trend` - Accuracy trends
- `GET /api/dashboard/subject-breakdown` - Per-subject stats
- `GET /api/dashboard/recommendations` - AI recommendations
- `GET /api/dashboard/grade-predictor` - Grade mapping

**Key Features:**
- Streak tracking (current/longest)
- Weakness identification
- Trend analysis (30/60/90 days)
- AI-powered study recommendations
- Grade prediction (A-E)

**Import Pattern:**
```python
from routers.dashboard import router as dashboard_router
app.include_router(dashboard_router, prefix="/api/dashboard")
```

---

### `/jamb_router.py` (5 endpoints)
**Purpose:** JAMB question database access

**Endpoints:**
- `GET /api/jamb/subjects` - All subjects
- `GET /api/jamb/years` - Available years
- `GET /api/jamb/topics` - Topics by subject
- `GET /api/jamb/questions` - Filtered questions
- `GET /api/jamb/questions/{question_id}` - Single question

**Import Pattern:**
```python
from jamb_router import router as jamb_router
app.include_router(jamb_router, prefix="/api/jamb")
```

---

## Main.py Simplification

**Before Refactoring:** 1096 lines
```python
# ~100 imports
# ~30 Pydantic models
# 33 endpoint decorators
# Massive monolithic file
```

**After Refactoring:** 65 lines
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv

# Import routers (clean!)
from routers.auth import router as auth_router
from routers.user import router as user_router
# ... other routers

app = FastAPI(...)

# CORS
app.add_middleware(CORSMiddleware, ...)

# Register routers (clean!)
app.include_router(auth_router)
app.include_router(user_router)
# ... other routers

# OpenAPI customization
def custom_openapi(): ...

app.openapi = custom_openapi
```

---

## Module Responsibilities

| Module | Responsibility | Lines | Endpoints |
|--------|-----------------|-------|-----------|
| `routers/auth.py` | Authentication & OAuth | 450+ | 12 |
| `routers/user.py` | Account management | 350+ | 8 |
| `routers/profile.py` | Profile setup | 300+ | 5 |
| `routers/learn.py` | Learning topics | 350+ | 5 |
| `routers/year_practice.py` | Year practice | 250+ | 3 |
| `routers/cbt.py` | Full exam sessions | 500+ | 4 |
| `routers/dashboard.py` | Analytics | 400+ | 5 |
| `jamb_router.py` | Question database | ~200 | 5 |
| `main.py` | App & router registration | 65 | 0 |
| `auth.py` | JWT & security | ~300 | 0 |
| `database.py` | DB connection | ~50 | 0 |
| `ai/` | AI services | ~500 | 0 |

**Total:** ~3500+ lines of organized code

---

## Dependency Graph

```
main.py
├── routers.auth (imports: auth, database, email_service)
├── routers.user (imports: auth, database)
├── routers.profile (imports: auth, database)
├── routers.learn (imports: auth, database, gemini_service)
├── routers.year_practice (imports: auth, database)
├── routers.cbt (imports: auth, database, gemini_service)
├── routers.dashboard (imports: auth, database, gemini_service)
└── jamb_router (imports: database)

auth.py
├── database
└── (external: passlib, python-jose)

database.py
└── (external: sqlite3)

ai/gemini_service.py
└── (external: google.generativeai)

ai/email_service.py
└── (external: smtplib)
```

---

## Benefits of This Architecture

✅ **Modularity** - Each router is independent and focused
✅ **Maintainability** - Easy to locate and modify code
✅ **Scalability** - Simple to add new routers
✅ **Readability** - Clear separation of concerns
✅ **Testability** - Can test routers in isolation
✅ **Reusability** - Common functions in auth.py, database.py
✅ **Organization** - Logical grouping by domain
✅ **Performance** - No impact on performance
✅ **Type Safety** - Models defined in each router

---

## Future Enhancements

The modular structure allows easy addition of:
- `routers/admin.py` - Admin dashboard endpoints
- `routers/social.py` - Social features (groups, challenges)
- `routers/notifications.py` - Notification management
- `routers/payments.py` - Subscription management
- `routers/analytics.py` - Advanced analytics

All without modifying core files.
