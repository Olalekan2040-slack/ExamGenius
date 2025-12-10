# ExamGenius Backend - Quick Start Guide

## What's Been Built

A complete FastAPI backend for JAMB exam preparation with:

### Core Features Implemented
1. **Authentication** - Email/password registration, JWT tokens, email verification
2. **Profile Management** - Forced profile completion (name, phone, class, 4 subjects)
3. **AI Lessons** - Gemini-powered topic explanations (English/Pidgin)
4. **Topic Practice** - Up to 30 questions per topic with AI explanations
5. **Year Practice** - JAMB past papers by year with pool validation
6. **Full CBT** - 160-question exam (40 per subject), slot 3 uses AI questions
7. **Analytics** - Dashboard with stats, trends, recommendations, grade predictor

### Database
- 15 tables created with proper relationships
- Pre-populated with JAMB 2020-2025 questions
- Tracks user progress, attempts, stats, sessions

### API Endpoints Created
- `/api/profile/*` - Profile management (5 endpoints)
- `/api/learn/*` - Topics and lesson generation (5 endpoints)
- `/api/practice/*` - Year practice (3 endpoints)
- `/api/exam/cbt/*` - Full CBT sessions (4 endpoints)
- `/api/dashboard/*` - Analytics (5 endpoints)
- `/api/jamb/*` - Question queries (5 endpoints)
- `/auth/*` - Authentication (6 endpoints, existing)

**Total: 33+ API endpoints fully implemented**

## How to Start

### 1. Install Dependencies
```bash
cd c:\Users\DELL\Desktop\examgenius
pip install -r requirements.txt
```

### 2. Add Gemini API Key
```
Edit .env file:
GEMINI_API_KEY=your-actual-gemini-key-here
```

### 3. Initialize Database (if needed)
```bash
python init_db_schema.py
```

### 4. Run Server
```bash
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

## Test a Complete User Flow

### 1. Register
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"test123456"}'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123456"}'
```
Get `access_token` from response.

### 3. Complete Profile (use token in Authorization header)
```bash
curl -X POST http://localhost:8000/api/profile/complete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name":"John Doe",
    "phone_number":"+2341234567890",
    "class_level":"SS3",
    "subjects":["Biology","Chemistry","Physics","English Language"]
  }'
```

### 4. Get Dashboard Stats
```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Get Topics in Biology
```bash
curl -X GET http://localhost:8000/api/learn/topics/Biology \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Get AI Lesson for Topic
```bash
curl -X GET "http://localhost:8000/api/learn/lesson/Biology/Cell%20Biology?language=english" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Get Topic Practice Questions
```bash
curl -X GET "http://localhost:8000/api/learn/practice/topic?subject=Biology&topic=Cell%20Biology&limit=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 8. Submit Practice Answers
```bash
curl -X POST http://localhost:8000/api/learn/practice/topic/submit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject":"Biology",
    "topic":"Cell Biology",
    "answers":[
      {"question_id":"JAMB_Biology_2020_1","user_answer":"A"},
      {"question_id":"JAMB_Biology_2020_2","user_answer":"B"}
    ]
  }'
```

### 9. Create Full CBT Session
```bash
curl -X POST http://localhost:8000/api/exam/cbt/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subjects":["Biology","Chemistry","Physics","English Language"]}'
```
Get `session_id` from response.

### 10. Get CBT Questions
```bash
curl -X GET http://localhost:8000/api/exam/cbt/{session_id}/questions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## File Organization

```
examgenius/
├── main.py              (FastAPI app + auth endpoints)
├── database.py          (SQLite connection)
├── auth.py              (JWT & password management)
├── init_db_schema.py    (Database initialization)
├── requirements.txt     (Python packages)
├── .env                 (Configuration)
├── ai/
│   ├── gemini_service.py    (AI: lessons, questions, explanations)
│   └── email_service.py     (Email verification)
├── routers/
│   ├── profile.py       (Profile & subject management)
│   ├── learn.py         (Learn Topics & topic practice)
│   ├── year_practice.py (Year-based practice)
│   ├── cbt.py           (Full CBT sessions)
│   └── dashboard.py     (Analytics & stats)
├── jamb_router.py       (JAMB question queries)
└── jamb_questions.db    (SQLite database)
```

## Key Design Decisions

### 1. Subject 3 Uses AI Questions
CBT session distributes 40 questions across 4 subjects:
- Subject 1: 40 real JAMB questions from DB
- Subject 2: 40 real JAMB questions from DB
- Subject 3: 40 **AI-generated questions** (using Gemini)
- Subject 4: 40 real JAMB questions from DB

### 2. Database Flags
- `partial_topic_set` → Topic has < requested questions
- `incomplete_year_data` → Year has < 100 questions
- `generated_by` → "ai" or "db" source for questions
- `profile_completed` → User setup done

### 3. Stats Tracking
After every attempt:
- Records question, answer, correctness
- Updates per-topic accuracy
- Calculates weakest topics
- Updates streak counter

### 4. Lesson Caching
AI lessons are cached in database by (subject, topic, language) to avoid regeneration.

## API Response Patterns

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* operation-specific data */ }
}
```

### Error Response
```json
{
  "detail": "Error message explaining what went wrong"
}
```

### List Response
```json
{
  "items": [{ /* item 1 */ }, { /* item 2 */ }],
  "count": 2
}
```

## Important Notes

1. **Profile Completion is Forced**
   - After first login, must POST `/api/profile/complete`
   - Must select exactly 4 subjects
   - Triggers user stats initialization

2. **AI Generation Requires API Key**
   - Set `GEMINI_API_KEY` in .env
   - If missing, fallback to simple text
   - Rate limit recommendations: max 1 generation per minute

3. **Session Expiry**
   - CBT sessions expire after 180 minutes (3 hours)
   - Session token validates on every request

4. **No Duplicate Questions**
   - Questions sampled without replacement within session
   - Across sessions, duplicates possible but minimized

5. **Database Pre-populated**
   - Has JAMB 2020-2025 questions
   - Add more via SQL INSERT if needed

## Troubleshooting

### App won't start
- Check all imports: `python -c "from main import app"`
- Verify .env exists with GEMINI_API_KEY
- Check database exists at `jamb_questions.db`

### AI generation fails
- Verify GEMINI_API_KEY is valid
- Check internet connection
- See error logs for details

### Database errors
- Run `python init_db_schema.py` to recreate tables
- Backup data before reinitializing
- Check file permissions on jamb_questions.db

### Tokens expire
- Access token: 15 minutes
- Refresh token: 7 days
- Use refresh endpoint to get new access token

## Next Steps

1. **Frontend Integration**
   - Connect React/Vue app to these endpoints
   - Handle Bearer token auth in headers

2. **Testing**
   - Write unit tests for each endpoint
   - Test edge cases (no questions, timer expiry, etc.)

3. **Performance**
   - Monitor API response times
   - Add caching for frequently accessed data
   - Consider connection pooling for high load

4. **Production**
   - Use environment-specific configs
   - Enable logging and monitoring
   - Set up automated backups
   - Use production-grade database

## Support & Documentation

- API docs: http://localhost:8000/docs (Swagger UI)
- API alt docs: http://localhost:8000/redoc
- See API_DOCUMENTATION.md for full endpoint reference
- See IMPLEMENTATION_COMPLETE.md for implementation details
