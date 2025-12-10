# ExamGenius API

Complete FastAPI backend for exam preparation platform supporting JAMB, WAEC, and NECO exams.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Seed Database (First Time Only)
```bash
python seed_exams_simple.py
```

### 3. Run Server
```bash
python -m uvicorn main:app --reload
```

Server runs at: `http://127.0.0.1:8000`  
API Documentation: `http://127.0.0.1:8000/docs`

---

## 📁 Project Structure

```
examgenius/
├── main.py                    # FastAPI app with auth & profile endpoints
├── database.py                # SQLite database with dual support (sqlite3 + SQLAlchemy)
├── models.py                  # SQLAlchemy ORM models (Exam, Subject, Topic, Question)
├── schemas.py                 # Pydantic schemas for validation
├── auth.py                    # JWT authentication & authorization
│
├── routers/
│   └── exams.py              # 40+ exam endpoints (exams, subjects, topics, questions)
│
├── ai/
│   └── email_service.py      # Email verification & password reset
│
├── data/
│   └── examgenius.db         # SQLite database (auto-created)
│
├── past_questions_with_answers/  # 353 JSON files (14,672 questions)
│   ├── JAMB_Biology_2010_objective.json
│   └── ...
│
├── static/
│   └── uploads/profiles/     # User profile pictures
│
├── templates/                 # Jinja2 HTML templates
│   ├── dashboard.html
│   └── learn/subjects.html
│
├── seed_exams_simple.py      # Database seeder script
├── topics.md                  # Topic reference for all subjects
├── test_auth.py              # Auth endpoint tests
├── test_profile.py           # Profile endpoint tests
└── requirements.txt          # Python dependencies
```

---

## 🗄️ Database Schema

### Core Tables
- **exams** - Exam types (JAMB, WAEC, NECO)
- **subjects** - Biology, Chemistry, Commerce, English, Government, Math, Physics
- **topics** - Hierarchical topics per subject
- **questions_orm** - 14,672 past questions with answers and topics
- **exam_subjects** - Many-to-many: exams ↔ subjects
- **subject_topics** - Many-to-many: subjects ↔ topics

### User Tables
- **users** - User accounts with profiles
- **exam_sessions** - Practice session history
- **user_stats** - Performance tracking
- **invalidated_tokens** - JWT token blacklist

---

## 🔑 API Endpoints

### Authentication (12 endpoints)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Google OAuth login
- `POST /auth/verify-email` - Verify email address
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate token
- `GET /auth/me` - Get current user info
- And more...

### Profile Management (10 endpoints)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/picture` - Upload profile picture
- `GET /profile/stats` - Get user statistics
- And more...

### Exams Module (40+ endpoints)

#### Exams (5 endpoints)
- `GET /api/exams/exams` - List all exams
- `GET /api/exams/exams/{exam}` - Get exam metadata
- `POST /api/exams/exams` - Create exam (admin)
- `PUT /api/exams/exams/{exam}` - Update exam (admin)
- `DELETE /api/exams/exams/{exam}` - Delete exam (admin)

#### Subjects (5 endpoints)
- `GET /api/exams/exams/{exam}/subjects` - List subjects
- `GET /api/exams/exams/{exam}/subjects/{subject}` - Subject metadata
- `POST /api/exams/exams/{exam}/subjects` - Add subject (admin)
- `PUT /api/exams/exams/{exam}/subjects/{subject}` - Update subject (admin)
- `DELETE /api/exams/exams/{exam}/subjects/{subject}` - Delete subject (admin)

#### Topics (5 endpoints)
- `GET /api/exams/exams/{exam}/subjects/{subject}/topics` - List topics
- `GET /api/exams/exams/{exam}/subjects/{subject}/topics/{topic_id}` - Topic statistics
- `POST /api/exams/exams/{exam}/subjects/{subject}/topics` - Add topic (admin)
- `PUT /api/exams/exams/{exam}/subjects/{subject}/topics/{topic_id}` - Update topic (admin)
- `DELETE /api/exams/exams/{exam}/subjects/{subject}/topics/{topic_id}` - Delete topic (admin)

#### Questions
- `POST /api/exams/exams/{exam}/subjects/{subject}/questions/year/{year}` - Get year questions
- `POST /api/exams/exams/{exam}/subjects/{subject}/questions/topic/{topic_id}` - Topic questions (Learn Mode)
- `POST /api/exams/exams/{exam}/subjects/{subject}/questions/random` - Random questions

#### Utilities
- `GET /api/exams/exams/{exam}/subjects/{subject}/years` - Available years
- `GET /api/exams/exams/{exam}/subjects/{subject}/topics/{topic_id}/years` - Topic years

---

## 🎯 Key Features

### Question Retrieval Modes

**1. Year-Based Questions**
```json
POST /api/exams/exams/JAMB/subjects/Biology/questions/year/2024
{
  "question_type": "objective"
}
```
- JAMB: Returns exactly 40 questions
- WAEC/NECO: Returns 50 objective + 5-7 theory
- Flags incomplete years with `incomplete_year_data: true`

**2. Topic-Based Learning**
```json
POST /api/exams/exams/JAMB/subjects/Mathematics/questions/topic/15
{
  "limit": 30,
  "question_type": "all"
}
```
- Learn Mode: Focus on specific topics
- Limit: 1-100 questions (default: 30)
- Flags partial sets with `partial_topic_set: true`

**3. Random Practice**
```json
POST /api/exams/exams/JAMB/subjects/Chemistry/questions/random
{
  "limit": 40,
  "question_type": "objective"
}
```
- JAMB: Allowed limits [10, 20, 40, 60, 100, 160]
- WAEC/NECO: Allowed limits [10, 20, 30, 50]
- Returns coverage: `years_covered`, `topics_covered`

### Admin Access Control
All admin endpoints require JWT Bearer token with `is_admin: true`

---

## 📊 Database Statistics

- **3 Exams**: JAMB, WAEC, NECO
- **7 Subjects**: Biology, Chemistry, Commerce, English, Government, Math, Physics
- **100+ Topics**: Hierarchical topics across subjects
- **14,672 Questions**: From 2010-2024
  - 41.1% have verified answers
  - 72.7% have topic classifications
  - Mix of objective and theory questions

---

## 🔧 Development

### Run Tests
```bash
python test_auth.py
python test_profile.py
```

### Re-seed Database
```bash
python seed_exams_simple.py
```
Note: Seeder skips existing data, run only when adding new JSON files

### Database Location
`data/examgenius.db`

---

## 🌐 CORS Configuration

Currently allows all origins for development.  
**Production**: Update CORS settings in `main.py`

---

## 📝 Environment Variables

Create `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
SECRET_KEY=your_secret_key_for_jwt
```

---

## 📚 Technologies

- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **SQLite** - Database
- **JWT** - Authentication
- **Argon2** - Password hashing
- **Jinja2** - Template rendering

---

## 📖 Documentation

- Interactive API Docs: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- Project Bible: `EXAMGENIUS_PROJECT_BIBLE.md`
- Testing Guide: `TESTING_GUIDE.md`

---

## 🚢 Deployment Ready

All endpoints tested and production-ready. See `TESTING_GUIDE.md` for deployment checklist.

---

**Built with ❤️ for Nigerian Students**
