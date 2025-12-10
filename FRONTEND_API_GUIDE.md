# ExamGenius API Documentation for Frontend Developers

**Base URL:** `http://localhost:8000`  
**API Version:** v1  
**All API routes are prefixed with:** `/api/v1/`

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [User Profile Management](#user-profile-management)
3. [JAMB Questions (Public)](#jamb-questions-public)
4. [Learn & Topic Practice](#learn--topic-practice)
5. [Year Practice](#year-practice)
6. [CBT (Full Exam Simulation)](#cbt-full-exam-simulation)
7. [Dashboard & Analytics](#dashboard--analytics)
8. [Profile & Subject Management](#profile--subject-management)

---

## Authentication & Authorization

### How Authentication Works
1. **Register** → Get user_id
2. **Verify Email** → Use token from email link
3. **Login** → Receive `access_token` (15 min) and `refresh_token` (7 days)
4. **Protected Routes** → Send `Authorization: Bearer <access_token>` header
5. **Token Refresh** → Use refresh_token to get new access_token when expired

---

### 1. Register New User
**POST** `/api/v1/auth/register`

Creates a new user account and sends verification email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created. Verification email sent.",
  "user_id": 123,
  "email": "john@example.com"
}
```

**Frontend Actions:**
- Show success message
- Redirect to "Check your email" page
- Store user_id temporarily for verification flow

**Errors:**
- `400` - Email already registered
- `500` - Registration failed

---

### 2. Verify Email
**POST** `/api/v1/auth/verify-email`

Verifies user email using token from email link.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login.",
  "email": "john@example.com"
}
```

**Frontend Actions:**
- Parse token from URL query parameter (e.g., `/verify?token=xyz`)
- Auto-submit verification
- Show success message
- Redirect to login page

---

### 3. Login
**POST** `/api/v1/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome back, John Doe!",
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Frontend Actions:**
- Store `access_token` in memory/state (NOT localStorage for security)
- Store `refresh_token` in httpOnly cookie or secure storage
- Store user info in app state
- Redirect to dashboard/home
- Set up token refresh mechanism

**Errors:**
- `401` - Invalid email or password
- `403` - Email not verified

---

### 4. Refresh Access Token
**POST** `/api/v1/auth/refresh`

Get new access_token using refresh_token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGci..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "access_token": "new_eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Frontend Actions:**
- Call this automatically when access_token expires (every 15 min)
- Update stored access_token
- Retry failed request with new token

---

### 5. Logout
**POST** `/api/v1/auth/logout`

Invalidates refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGci..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Actions:**
- Clear all stored tokens
- Clear user state
- Redirect to login page

---

### 6. Request Password Reset
**POST** `/api/v1/auth/request-reset`

Sends password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 7. Reset Password
**POST** `/api/v1/auth/reset-password`

Resets password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## User Profile Management

All endpoints require `Authorization: Bearer <access_token>` header.

### 8. Get Current User Profile
**GET** `/api/v1/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_pic_url": null,
    "joined_date": "2025-12-01 10:30:00"
  },
  "stats_summary": {
    "total_questions_answered": 245,
    "correct_answers": 189,
    "incorrect_answers": 56,
    "subjects_studied": 4,
    "accuracy": 77.14
  }
}
```

**Frontend Actions:**
- Display in profile page/header
- Show stats on dashboard
- Cache user info

---

### 9. Update Profile
**PUT** `/api/v1/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "full_name": "John Updated Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": 123,
    "name": "John Updated Doe",
    "email": "john@example.com",
    "profile_pic_url": null
  }
}
```

---

### 10. Upload Profile Picture
**POST** `/api/v1/users/avatar`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', imageFile); // File object from <input type="file">
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "profile_pic_url": "/static/uploads/profiles/user_123_1234567890.jpg"
}
```

**Frontend Actions:**
- Use file input to select image
- Validate file type (jpeg, png, gif, webp)
- Upload using FormData
- Display uploaded image immediately

---

## JAMB Questions (Public)

These endpoints do NOT require authentication.

### 11. Get Available Subjects
**GET** `/api/v1/jamb/subjects`

**Response (200 OK):**
```json
{
  "subjects": [
    "Biology",
    "Chemistry",
    "Commerce",
    "English Language",
    "Mathematics",
    "Physics"
  ]
}
```

**Frontend Actions:**
- Use for subject selection dropdowns
- Cache in app state

---

### 12. Get Available Years
**GET** `/api/v1/jamb/years`

**Response (200 OK):**
```json
{
  "years": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]
}
```

---

### 13. Get Topics by Subject
**GET** `/api/v1/jamb/topics?subject=Biology`

**Query Parameters:**
- `subject` (required) - Subject name

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "topics": [
    "Cell Biology",
    "Ecology",
    "Genetics & Evolution",
    "Organization of Life",
    "Reproduction"
  ]
}
```

---

### 14. Get Questions (with Filters)
**GET** `/api/v1/jamb/questions?subject=Biology&year=2024&limit=20`

**Query Parameters:**
- `subject` (required) - Subject name
- `year` (optional) - Exam year
- `topic` (optional) - Topic name
- `limit` (optional, default: 10, max: 100) - Number of questions

**Response (200 OK):**
```json
{
  "questions": [
    {
      "id": "Q123",
      "number": 1,
      "question": "What is photosynthesis?",
      "topic": "Cell Biology",
      "image_path": null,
      "correct_answer": "B",
      "options": {
        "A": "Respiration in plants",
        "B": "Food production using sunlight",
        "C": "Cell division",
        "D": "Water absorption"
      }
    }
  ]
}
```

**Frontend Actions:**
- Build quiz interface
- Don't show `correct_answer` until after submission
- Display images if `image_path` is not null

---

## Learn & Topic Practice

All endpoints require authentication.

### 15. Get Topics with User Stats
**GET** `/api/v1/learn/topics/Biology`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `subject` - Subject name (Biology, Chemistry, etc.)

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "topics": [
    {
      "topic": "Cell Biology",
      "question_count": 45,
      "last_score": 78.5,
      "attempts": 3,
      "last_practiced": "2025-12-09 14:30:00"
    },
    {
      "topic": "Genetics & Evolution",
      "question_count": 32,
      "last_score": null,
      "attempts": 0,
      "last_practiced": null
    }
  ]
}
```

**Frontend Actions:**
- Display topics in cards/list
- Show progress indicators (last_score, attempts)
- Highlight never-practiced topics
- Enable topic selection for practice

---

### 16. Get AI Lesson for Topic
**GET** `/api/v1/learn/lesson/Biology/Cell%20Biology?language=english`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `subject` - Subject name
- `topic` - Topic name (URL encoded)

**Query Parameters:**
- `language` (optional, default: "english") - "english" or "pidgin"

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "topic": "Cell Biology",
  "language": "english",
  "cached": true,
  "lesson": {
    "key_idea": "The cell is the basic unit of life...",
    "example": "Think of a cell like a factory...",
    "steps": "1. Cell membrane controls entry\n2. Nucleus stores DNA...",
    "quick_tip": "Remember: Mitochondria = powerhouse of the cell!",
    "full_content": "Comprehensive explanation...",
    "diagrams": ""
  }
}
```

**Frontend Actions:**
- Display lesson in reading view
- Show "Study" button before practice
- Format lesson sections nicely
- Cache lessons locally

---

### 17. Get Practice Questions for Topic
**GET** `/api/v1/learn/questions/Biology/Cell%20Biology?count=10`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `subject` - Subject name
- `topic` - Topic name (URL encoded)

**Query Parameters:**
- `count` (optional, default: 10, max: 40) - Number of questions

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "topic": "Cell Biology",
  "count": 10,
  "questions": [
    {
      "question_id": "Q456",
      "number": 1,
      "question": "What is the function of mitochondria?",
      "image_path": null,
      "options": {
        "A": "Protein synthesis",
        "B": "Energy production",
        "C": "Cell division",
        "D": "Photosynthesis"
      }
    }
  ]
}
```

**Frontend Actions:**
- Build quiz interface
- Track user answers locally
- Submit all answers together when done

---

### 18. Submit Topic Practice Answers
**POST** `/api/v1/learn/submit`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Biology",
  "topic": "Cell Biology",
  "answers": [
    {
      "question_id": "Q456",
      "user_answer": "B"
    },
    {
      "question_id": "Q457",
      "user_answer": "A"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "summary": {
    "total": 10,
    "correct": 8,
    "incorrect": 2,
    "score": 80.0
  },
  "updated_stats": {
    "total_attempts": 4,
    "accuracy": 79.25
  },
  "results": [
    {
      "question_id": "Q456",
      "correct": true,
      "correct_answer": "B",
      "user_answer": "B"
    },
    {
      "question_id": "Q457",
      "correct": false,
      "correct_answer": "C",
      "user_answer": "A"
    }
  ]
}
```

**Frontend Actions:**
- Show results page with score
- Display correct/incorrect indicators
- Show explanations for wrong answers
- Update user stats
- Offer "Practice Again" option

---

## Year Practice

Practice past JAMB questions by specific year.

### 19. Get Year Practice Info
**GET** `/api/v1/year-practice/info`

**Response (200 OK):**
```json
{
  "available_years": [2024, 2023, 2022, 2021, 2020],
  "min_pool_size_required": 100,
  "subject_pools": {
    "Biology": {
      "2024": 150,
      "2023": 145,
      "2022": 120
    },
    "Chemistry": {
      "2024": 130,
      "2023": 125
    }
  }
}
```

**Frontend Actions:**
- Display available years
- Show pool sizes per subject
- Warn if pool size < 100 (incomplete data)

---

### 20. Get Year Practice Questions
**GET** `/api/v1/year-practice/questions?subject=Biology&year=2024&count=20`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject` (required) - Subject name
- `year` (required) - Exam year
- `count` (optional, default: 10, min: 10, max: 40) - Number of questions

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "year": 2024,
  "pool_size": 150,
  "min_pool_required": 100,
  "incomplete_year_data": false,
  "returned_count": 20,
  "questions": [
    {
      "question_id": "Q789",
      "number": 1,
      "question": "Which organelle is responsible for...",
      "topic": "Cell Biology",
      "image_path": null,
      "correct_answer": "C",
      "year": 2024,
      "subject": "Biology",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      }
    }
  ]
}
```

**Frontend Actions:**
- Check `incomplete_year_data` flag
- Show warning if pool too small
- Display questions in quiz format

---

### 21. Submit Year Practice Answers
**POST** `/api/v1/year-practice/submit`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Biology",
  "year": 2024,
  "answers": [
    {
      "question_id": "Q789",
      "user_answer": "C"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "summary": {
    "total": 20,
    "correct": 16,
    "incorrect": 4,
    "score": 80.0
  },
  "results": [
    {
      "question_id": "Q789",
      "correct": true,
      "correct_answer": "C",
      "user_answer": "C",
      "explanation": "AI-generated explanation..."
    }
  ]
}
```

---

## CBT (Full Exam Simulation)

Simulates complete 4-subject JAMB exam (160 questions, 3 hours).

### 22. Create CBT Session
**POST** `/api/v1/cbt/create`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subjects": ["English Language", "Mathematics", "Biology", "Chemistry"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "session_id": "CBT_20251210143025_abc123",
  "message": "CBT session created with 160 questions",
  "subjects": ["English Language", "Mathematics", "Biology", "Chemistry"],
  "total_questions": 160,
  "time_limit_minutes": 180,
  "expires_at": "2025-12-10 17:30:25",
  "questions": [
    {
      "id": 1,
      "question_id": "Q123",
      "subject": "English Language",
      "subject_position": 1,
      "question": "Choose the correct option...",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "image_path": null,
      "topic": "Grammar"
    }
    // ... 159 more questions
  ]
}
```

**Important Notes:**
- Subject in position 3 uses AI-generated questions
- Session expires after 3 hours
- Questions are randomly selected (40 per subject)

**Frontend Actions:**
- Start timer for 180 minutes
- Display questions in tabs by subject
- Save answers locally
- Show warning before time expires
- Auto-submit when time runs out

---

### 23. Resume CBT Session
**GET** `/api/v1/cbt/resume/{session_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `session_id` - Session ID from create endpoint

**Response (200 OK):**
```json
{
  "session_id": "CBT_20251210143025_abc123",
  "status": "in_progress",
  "questions": [ /* all 160 questions */ ],
  "time_remaining_minutes": 145,
  "created_at": "2025-12-10 14:30:25"
}
```

**Frontend Actions:**
- Resume timer with remaining time
- Load questions
- Restore saved answers from local storage

---

### 24. Submit CBT Exam
**POST** `/api/v1/cbt/{session_id}/submit`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**
- `session_id` - Session ID

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "Q123",
      "user_answer": "B"
    },
    {
      "question_id": "Q124",
      "user_answer": "C"
    }
    // ... all 160 answers
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "session_id": "CBT_20251210143025_abc123",
  "overall_score": 135,
  "total_questions": 160,
  "overall_accuracy": 84.38,
  "subject_breakdown": [
    {
      "subject": "English Language",
      "position": 1,
      "correct": 35,
      "total": 40,
      "accuracy": 87.5
    },
    {
      "subject": "Mathematics",
      "position": 2,
      "correct": 32,
      "total": 40,
      "accuracy": 80.0
    }
  ],
  "topic_performance": [
    {
      "subject": "Biology",
      "topic": "Cell Biology",
      "correct": 8,
      "total": 10,
      "accuracy": 80.0
    }
  ],
  "completed_at": "2025-12-10 16:45:30"
}
```

**Frontend Actions:**
- Show overall score prominently
- Display subject breakdown chart
- Show topic-level performance
- Offer "Review Answers" option
- Save result to history

---

### 25. Review CBT Answers
**GET** `/api/v1/cbt/{session_id}/review`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "session_id": "CBT_20251210143025_abc123",
  "score": 135,
  "total": 160,
  "accuracy": 84.38,
  "questions_with_answers": [
    {
      "question_number": 1,
      "subject": "English Language",
      "question_id": "Q123",
      "question": "Choose the correct option...",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct_answer": "B",
      "user_answer": "B",
      "is_correct": true,
      "explanation": "Explanation of answer..."
    }
  ]
}
```

**Frontend Actions:**
- Display all questions with correct/incorrect indicators
- Show explanations
- Allow filtering by subject/correct/incorrect

---

## Dashboard & Analytics

All endpoints require authentication.

### 26. Get Dashboard Stats
**GET** `/api/v1/dashboard/stats`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "overall_stats": {
    "total_attempts": 450,
    "correct_attempts": 360,
    "overall_accuracy": 80.0,
    "total_active_days": 15
  },
  "streak": {
    "current_streak": 7,
    "longest_streak": 12,
    "last_activity": "2025-12-10"
  },
  "weakest_topics": [
    {
      "subject": "Chemistry",
      "topic": "Organic Chemistry",
      "accuracy": 45.5,
      "attempts": 20
    }
  ],
  "recent_attempts": [
    {
      "subject": "Biology",
      "topic": "Cell Biology",
      "is_correct": true,
      "practice_type": "topic",
      "timestamp": "2025-12-10 14:30:00"
    }
  ],
  "cbt_history": [
    {
      "session_id": "CBT_123",
      "score": 135,
      "total": 160,
      "accuracy": 84.38,
      "date": "2025-12-09"
    }
  ],
  "registered_subjects": [
    {
      "subject": "Biology",
      "position": 1
    }
  ]
}
```

**Frontend Actions:**
- Display stats cards
- Show streak counter with fire icon
- Highlight weakest topics for focus
- Display recent activity timeline
- Show CBT history chart

---

### 27. Get Accuracy Trend
**GET** `/api/v1/dashboard/accuracy-trend?subject=Biology&days=30`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject` (optional) - Filter by subject
- `days` (optional, default: 30) - Number of days

**Response (200 OK):**
```json
{
  "subject": "Biology",
  "days": 30,
  "trend": [
    {
      "date": "2025-12-01",
      "accuracy": 75.0,
      "attempts": 20
    },
    {
      "date": "2025-12-02",
      "accuracy": 78.5,
      "attempts": 15
    }
  ]
}
```

**Frontend Actions:**
- Display line chart
- Show trend direction (improving/declining)

---

### 28. Get Subject Breakdown
**GET** `/api/v1/dashboard/subject-breakdown`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "subjects": [
    {
      "subject": "Biology",
      "total_attempts": 150,
      "correct_attempts": 120,
      "accuracy": 80.0,
      "topics_covered": 7,
      "last_practiced": "2025-12-10"
    }
  ]
}
```

---

### 29. Get AI Recommendations
**GET** `/api/v1/dashboard/recommendations`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "type": "weak_topic",
      "priority": "high",
      "subject": "Chemistry",
      "topic": "Organic Chemistry",
      "message": "Focus on Organic Chemistry - your accuracy is 45.5%",
      "action": "practice_topic"
    }
  ],
  "ai_summary": "You're doing great in Biology! Focus more on Chemistry..."
}
```

---

### 30. Get Grade Predictor
**GET** `/api/v1/dashboard/grade-predictor`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "predicted_score": 285,
  "max_score": 400,
  "percentage": 71.25,
  "grade": "B",
  "confidence": "medium",
  "subject_predictions": [
    {
      "subject": "Biology",
      "predicted_score": 75,
      "max_score": 100
    }
  ],
  "recommendation": "Practice more Chemistry to improve overall score"
}
```

---

## Profile & Subject Management

### 31. Complete Profile (First Time Setup)
**POST** `/api/v1/api/profile/complete`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone_number": "08012345678",
  "class_level": "SS3",
  "subjects": ["English Language", "Mathematics", "Biology", "Chemistry"]
}
```

**Validation:**
- `class_level` must be: "SS1", "SS2", or "SS3"
- `subjects` must be exactly 4 unique subjects

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile completed successfully",
  "profile": {
    "full_name": "John Doe",
    "phone_number": "08012345678",
    "class_level": "SS3",
    "subjects": ["English Language", "Mathematics", "Biology", "Chemistry"]
  }
}
```

**Frontend Actions:**
- Show on first login after registration
- Force completion before accessing app features
- Store profile completion status

---

### 32. Check Profile Completion
**GET** `/api/v1/api/profile/check-completion`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "profile_completed": true,
  "full_name": "John Doe",
  "class_level": "SS3",
  "subjects": ["English Language", "Mathematics", "Biology", "Chemistry"]
}
```

**Frontend Actions:**
- Call on app load
- Redirect to profile completion if false

---

### 33. Update Subjects
**PUT** `/api/v1/api/profile/subjects`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subjects": ["English Language", "Mathematics", "Physics", "Chemistry"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subjects updated successfully",
  "subjects": ["English Language", "Mathematics", "Physics", "Chemistry"]
}
```

---

## Error Handling

All endpoints may return these common errors:

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "detail": "Missing authorization header"
}
```

### 403 Forbidden
```json
{
  "detail": "Email not verified. Please check your inbox."
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Best Practices for Frontend

### 1. Token Management
```javascript
// Store tokens securely
const tokenManager = {
  accessToken: null,
  refreshToken: null,
  
  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
    // Store refresh token in httpOnly cookie if possible
    localStorage.setItem('refresh_token', refresh);
  },
  
  async refreshAccessToken() {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });
    const data = await response.json();
    this.accessToken = data.access_token;
  }
};
```

### 2. Request Interceptor
```javascript
async function apiRequest(url, options = {}) {
  // Add auth header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${tokenManager.accessToken}`
  };
  
  let response = await fetch(url, { ...options, headers });
  
  // Auto-refresh on 401
  if (response.status === 401) {
    await tokenManager.refreshAccessToken();
    headers.Authorization = `Bearer ${tokenManager.accessToken}`;
    response = await fetch(url, { ...options, headers });
  }
  
  return response;
}
```

### 3. State Management Example
```javascript
const userState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  
  async login(email, password) {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      this.user = data.user;
      this.isAuthenticated = true;
      tokenManager.setTokens(data.access_token, data.refresh_token);
      await this.loadProfile();
    }
    
    return data;
  },
  
  async loadProfile() {
    const response = await apiRequest('/api/v1/users/me');
    this.profile = await response.json();
  }
};
```

### 4. Practice Flow Example
```javascript
class TopicPractice {
  constructor(subject, topic) {
    this.subject = subject;
    this.topic = topic;
    this.questions = [];
    this.answers = {};
  }
  
  async loadQuestions(count = 10) {
    const response = await apiRequest(
      `/api/v1/learn/questions/${this.subject}/${this.topic}?count=${count}`
    );
    const data = await response.json();
    this.questions = data.questions;
  }
  
  saveAnswer(questionId, answer) {
    this.answers[questionId] = answer;
    // Auto-save to localStorage
    localStorage.setItem('practice_answers', JSON.stringify(this.answers));
  }
  
  async submit() {
    const answersArray = Object.entries(this.answers).map(([id, ans]) => ({
      question_id: id,
      user_answer: ans
    }));
    
    const response = await apiRequest('/api/v1/learn/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: this.subject,
        topic: this.topic,
        answers: answersArray
      })
    });
    
    return await response.json();
  }
}
```

---

## Rate Limiting & Performance

- No rate limiting currently implemented
- Cache GET requests for subjects/years/topics (they don't change often)
- Use pagination for large lists (built into endpoints via `limit` parameter)
- Debounce search inputs

---

## Support & Questions

For issues or questions:
- Check API response `detail` field for error messages
- All datetime fields are in ISO 8601 format
- All endpoints return JSON
- Base URL may change in production

**Server Address:** http://localhost:8000  
**API Documentation:** http://localhost:8000/docs (Swagger UI)

---

**Last Updated:** December 10, 2025  
**API Version:** 1.0
