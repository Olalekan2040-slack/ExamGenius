# ExamGenius API Documentation
**Complete API Reference for Frontend Developers**

---

## Table of Contents
1. [Base Information](#base-information)
2. [Authentication System](#authentication-system)
3. [Auth Endpoints](#auth-endpoints)
4. [Profile Endpoints](#profile-endpoints)
5. [Exams API Endpoints](#exams-api-endpoints)
6. [Error Handling](#error-handling)
7. [Common Patterns](#common-patterns)

---

## Base Information

### API Base URL
```
http://127.0.0.1:8000
```

### Response Format
All responses are **JSON**. Success responses include a `success` field (boolean), and most include relevant data.

### Authentication
All profile-related endpoints and some exam endpoints require an **Authorization header**:
```
Authorization: Bearer <access_token>
```

**Example:**
```javascript
fetch('/profile', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

---

## Authentication System

### Overview
ExamGenius uses **JWT (JSON Web Tokens)** for authentication:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens when expired

### Token Storage (Frontend)
Store tokens in **localStorage**:
```javascript
// After login/signup
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);
```

### Token Retrieval (Frontend)
```javascript
const token = localStorage.getItem('access_token');
const headers = {
  'Authorization': `Bearer ${token}`
};
```

### Auto-Refresh Flow (Frontend)
When receiving a **401 Unauthorized** response:
1. Get refresh token from localStorage
2. Call `POST /auth/refresh` with refresh token
3. Store new access token
4. Retry original request

---

## Auth Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Purpose:** Create a new user account. A verification email will be sent automatically.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: Required, any string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created. Verification email sent.",
  "user_id": 42,
  "email": "john@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Email already registered, password too short
- `500 Internal Server Error`: Registration failed, email send failed

**Frontend Usage:**
```javascript
async function signup(name, email, password) {
  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  if (res.ok) {
    const data = await res.json();
    alert('Check your email for verification link!');
    return data.user_id;
  } else {
    const error = await res.json();
    alert(error.detail || 'Signup failed');
  }
}
```

**UI Considerations:**
- Show email input with validation
- Password strength indicator
- Show loading state while sending
- Display "Check your email" message on success
- Offer resend verification email link if needed

---

### 2. Email Verification

**Endpoint:** `POST /auth/verify-email`

**Purpose:** Verify the user's email using a token sent via email. This must be done before login is allowed.

**Request Body:**
```json
{
  "token": "abc123def456..."
}
```

**Token Source:**
- Sent via email link: `http://yourapp.com/verify?token=abc123def456`
- Can be auto-filled from URL params: `?token=abc123`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login.",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token

**Frontend Usage:**
```javascript
async function verifyEmail(token) {
  const res = await fetch('/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  if (res.ok) {
    alert('Email verified! You can now login.');
    window.location.href = '/login';
  }
}

// Auto-fill token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) document.getElementById('token').value = token;
```

**UI Considerations:**
- Display token input field with paste area
- Show "Verifying..." state
- Auto-redirect to login on success
- Offer "Resend verification email" button

---

### 3. User Login

**Endpoint:** `POST /auth/login`

**Purpose:** Authenticate user with email and password. Returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- Email must be verified before login
- Credentials must match

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome back, John Doe!",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: Email not verified (user must verify before login)

**Frontend Usage:**
```javascript
async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  
  if (res.ok) {
    // Store tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    alert(data.detail);
  }
}
```

**UI Considerations:**
- Email and password inputs
- "Remember me" checkbox (optional, manage via localStorage)
- "Forgot password?" link
- Loading state during submission
- Show specific error messages (unverified email vs invalid credentials)
- Option to resend verification email from error message

---

### 4. Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Purpose:** Get a new access token using refresh token (when old one expires).

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid/expired refresh token, or token invalidated (user logged out)

**Frontend Usage:**
```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    window.location.href = '/login';
    return;
  }
  
  const res = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  } else {
    // Refresh token invalid, force re-login
    localStorage.clear();
    window.location.href = '/login';
  }
}

// Call this on 401 response
async function apiCall(url, options = {}) {
  let res = await fetch(url, options);
  
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      options.headers = options.headers || {};
      options.headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, options);
    }
  }
  
  return res;
}
```

**UI Considerations:**
- Transparent to user; handle in background
- If refresh fails, redirect to login
- Show "Session expired, please login again" message

---

### 5. Request Password Reset

**Endpoint:** `POST /auth/request-password-reset`

**Purpose:** Send a password reset email if email is registered.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "If this email is registered, you'll receive a password reset link"
}
```

**Security Note:** Response is always 200 and says "If email is registered" to prevent email enumeration attacks.

**Frontend Usage:**
```javascript
async function requestPasswordReset(email) {
  const res = await fetch('/auth/request-password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (res.ok) {
    alert('If your email is registered, a reset link has been sent.');
    // Offer to check email or resend
  }
}
```

**UI Considerations:**
- Email input field
- Show same "Check your email" message for all inputs (security)
- Link to this flow from login page ("Forgot password?")
- Option to resend reset link

---

### 6. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Purpose:** Reset password using a token from the reset email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePass456"
}
```

**Validation:**
- `token`: Must be valid and not expired (1 hour expiry)
- `new_password`: Minimum 6 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token

**Frontend Usage:**
```javascript
async function resetPassword(token, newPassword) {
  const res = await fetch('/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword })
  });
  
  if (res.ok) {
    alert('Password reset! Redirecting to login...');
    window.location.href = '/login';
  } else {
    const error = await res.json();
    alert(error.detail);
  }
}
```

**UI Considerations:**
- Auto-fill token from URL: `?token=abc123`
- Password input with strength indicator
- Show confirmation password field (client-side validation)
- Loading state during submission

---

### 7. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification-email`

**Purpose:** Send a new verification email if user hasn't verified yet.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification link resent to your email"
}
```

**Error Responses:**
- `400 Bad Request`: Email already verified

**Frontend Usage:**
```javascript
async function resendVerificationEmail(email) {
  const res = await fetch('/auth/resend-verification-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (res.ok) {
    alert('Verification email sent!');
  }
}
```

**UI Considerations:**
- Show link/button in login error message when email unverified
- Add rate limiting on frontend (disable button for 60 seconds after click)

---

### 8. Google OAuth Login

**Endpoint:** `POST /auth/google/mobile`

**Purpose:** Authenticate using Google ID token (for web and mobile).

**Prerequisites:**
1. User clicks "Sign in with Google" button
2. Google returns an `id_token`
3. Frontend sends `id_token` to this endpoint

**Request Body:**
```json
{
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjExIn0..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome, John Doe!",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid Google token

**Frontend Usage (with Google Sign-In SDK):**
```javascript
// Initialize Google Sign-In
google.accounts.id.initialize({
  client_id: 'YOUR_GOOGLE_CLIENT_ID'
});

google.accounts.id.renderButton(
  document.getElementById('google-signin-button'),
  { theme: 'outline', size: 'large' }
);

// Handle sign-in response
async function handleGoogleSignIn(response) {
  const idToken = response.credential; // JWT token from Google
  
  const res = await fetch('/auth/google/mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken })
  });
  
  const data = await res.json();
  
  if (res.ok) {
    // Auto-creates account if first login
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    window.location.href = '/dashboard';
  }
}
```

**UI Considerations:**
- Add Google Sign-In button on login/signup page
- Show loading state
- Email auto-verified when using Google
- Profile picture auto-set from Google

---

### 9. Get Current User Info

**Endpoint:** `GET /auth/me`

**Purpose:** Get authenticated user's profile summary.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_pic_url": "/static/uploads/profiles/user_42_12345.jpg",
    "is_verified": true,
    "created_at": "2025-12-08T10:30:00"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

**Frontend Usage:**
```javascript
async function getCurrentUser() {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    const data = await res.json();
    return data.user;
  } else if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
}
```

**UI Considerations:**
- Call on app load to check if user logged in
- Update user name/profile pic in nav bar
- Used for session verification

---

### 10. Logout

**Endpoint:** `POST /auth/logout`

**Purpose:** Logout user by invalidating their refresh token.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

**Frontend Usage:**
```javascript
async function logout() {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok || res.status === 401) {
    // Always clear tokens regardless of response
    localStorage.clear();
    window.location.href = '/login';
  }
}
```

**UI Considerations:**
- Add logout button in user menu/nav
- Clear all localStorage on logout
- Redirect to login page
- Show "Logged out" message

---

## Profile Endpoints

### 1. Get User Profile

**Endpoint:** `GET /profile`

**Purpose:** Get complete user profile with statistics summary.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+234701234567",
    "class_level": "SS3",
    "preferred_exam": "JAMB",
    "profile_pic_url": "/static/uploads/profiles/user_42_12345.jpg",
    "joined_date": "2025-12-08T10:30:00"
  },
  "stats_summary": {
    "total_questions_answered": 450,
    "correct_answers": 342,
    "incorrect_answers": 108,
    "current_streak": 12,
    "accuracy": 76.0
  }
}
```

**Frontend Usage:**
```javascript
async function loadProfile() {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    const data = await res.json();
    displayProfile(data.profile);
    displayStats(data.stats_summary);
  }
}
```

**UI Considerations:**
- Display on profile/account settings page
- Show profile picture, name, email
- Display quick stats (accuracy, streak, questions done)
- Link to detailed stats page

---

### 2. Update User Profile

**Endpoint:** `PUT /profile`

**Purpose:** Update profile fields (name, phone, class, exam preference, etc).

**Authentication:** Required (Bearer token)

**Request Body (all optional, send only fields to update):**
```json
{
  "full_name": "John Doe",
  "phone_number": "+234701234567",
  "class_level": "SS3",
  "preferred_exam": "JAMB",
  "date_of_birth": "2005-12-08",
  "gender": "Male"
}
```

**Valid Values:**
- `class_level`: `SS1` | `SS2` | `SS3` | `JAMB`
- `preferred_exam`: `WAEC` | `JAMB` | `NECO`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+234701234567",
    "class_level": "SS3",
    "preferred_exam": "JAMB",
    "profile_pic_url": "/static/uploads/profiles/user_42_12345.jpg"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid class_level or preferred_exam value

**Frontend Usage:**
```javascript
async function updateProfile(updates) {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (res.ok) {
    const data = await res.json();
    alert('Profile updated!');
    localStorage.setItem('user', JSON.stringify(data.profile));
  }
}

// Example: Update only class level
updateProfile({ class_level: 'SS3' });
```

**UI Considerations:**
- Show editable form with current values pre-filled
- Dropdown for class_level and preferred_exam
- Date picker for date_of_birth
- Save button with loading state
- Show confirmation message on success

---

### 3. Upload Profile Picture

**Endpoint:** `POST /profile/upload-picture`

**Purpose:** Upload or change profile photo.

**Authentication:** Required (Bearer token)

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted types: `jpeg`, `png`, `gif`, `webp`
- Max size: (check server limits, typically 5-10MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "profile_pic_url": "/static/uploads/profiles/user_42_1702107600.jpg"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file type
- `413 Payload Too Large`: File too big

**Frontend Usage:**
```javascript
async function uploadProfilePicture(file) {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/profile/upload-picture', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  if (res.ok) {
    const data = await res.json();
    document.getElementById('profilePic').src = data.profile_pic_url;
    alert('Photo uploaded!');
  }
}

// Use with file input
document.getElementById('picInput').addEventListener('change', (e) => {
  if (e.target.files[0]) {
    uploadProfilePicture(e.target.files[0]);
  }
});
```

**UI Considerations:**
- File input with image preview
- Drag-and-drop area
- Show loading spinner during upload
- Display uploaded image immediately
- Show file size warning

---

### 4. Get Profile Statistics

**Endpoint:** `GET /profile/stats`

**Purpose:** Get detailed performance analytics and predictions.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_questions_answered": 450,
    "correct_answers": 342,
    "incorrect_answers": 108,
    "accuracy_percentage": 76.0,
    "current_streak": 12,
    "longest_streak": 28,
    "weakest_subjects": ["Government", "Chemistry", "English Language"],
    "strongest_subjects": ["Biology", "Mathematics", "Physics"],
    "predicted_grade": "B"
  }
}
```

**Frontend Usage:**
```javascript
async function loadStats() {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/profile/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    const data = await res.json();
    displayStats(data.stats);
  }
}
```

**UI Considerations:**
- Create dashboard with:
  - Accuracy percentage chart
  - Streak counter with fire icon
  - Subject performance grid
  - Predicted grade badge
  - Questions answered progress bar

---

### 5. Get Exam History

**Endpoint:** `GET /profile/history`

**Purpose:** Get paginated list of past exam sessions.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit`: Number of results per page (default: 50)
- `offset`: Pagination offset (default: 0)

**Example:** `GET /profile/history?limit=20&offset=0`

**Success Response (200):**
```json
{
  "success": true,
  "total": 150,
  "limit": 20,
  "offset": 0,
  "sessions": [
    {
      "session_id": 5,
      "exam_type": "JAMB",
      "subject": "Biology",
      "score": 38,
      "total_questions": 40,
      "accuracy": 95.0,
      "timestamp": "2025-12-07T14:30:00"
    },
    {
      "session_id": 4,
      "exam_type": "JAMB",
      "subject": "Chemistry",
      "score": 28,
      "total_questions": 40,
      "accuracy": 70.0,
      "timestamp": "2025-12-06T10:15:00"
    }
  ]
}
```

**Frontend Usage:**
```javascript
async function loadExamHistory(page = 1, limit = 20) {
  const token = localStorage.getItem('access_token');
  const offset = (page - 1) * limit;
  
  const res = await fetch(`/profile/history?limit=${limit}&offset=${offset}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    const data = await res.json();
    displaySessionList(data.sessions);
    displayPagination(data.total, limit, page);
  }
}
```

**UI Considerations:**
- Display as table or card list
- Show date, exam type, subject, score, accuracy
- Add pagination (prev/next buttons)
- Add filters (exam type, subject, date range)
- Click row to see detailed session info
- Sort by date (newest first)

---

### 6. Get Single Session Details

**Endpoint:** `GET /profile/history/{session_id}`

**Purpose:** Get detailed information about a specific exam session.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `session_id`: ID of the exam session (integer)

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "session_id": 5,
    "exam_type": "JAMB",
    "subject": "Biology",
    "score": 38,
    "total_questions": 40,
    "correct_answers": 38,
    "incorrect_answers": 2,
    "accuracy": 95.0,
    "duration_seconds": 1800,
    "created_at": "2025-12-07T14:30:00"
  }
}
```

**Error Responses:**
- `404 Not Found`: Session doesn't exist or user doesn't own it

**Frontend Usage:**
```javascript
async function loadSessionDetails(sessionId) {
  const token = localStorage.getItem('access_token');
  
  const res = await fetch(`/profile/history/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    const data = await res.json();
    displaySessionDetail(data.session);
  }
}
```

**UI Considerations:**
- Show complete session summary
- Breakdown: correct/incorrect/total
- Duration in minutes:seconds format
- Accuracy percentage with visual indicator
- "View Questions" button to review answers

---

### 7. Delete Account

**Endpoint:** `DELETE /profile`

**Purpose:** Permanently delete user account and all associated data.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully. All data has been removed."
}
```

**Frontend Usage:**
```javascript
async function deleteAccount() {
  const confirmed = confirm(
    'Are you sure? This action is PERMANENT and cannot be undone.\nAll your data will be deleted.'
  );
  
  if (!confirmed) return;
  
  const token = localStorage.getItem('access_token');
  
  const res = await fetch('/profile', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    alert('Account deleted. Goodbye!');
    localStorage.clear();
    window.location.href = '/';
  }
}
```

**UI Considerations:**
- Add to account settings with warning message
- Require double confirmation
- Show countdown timer before button activates (e.g., 5 seconds)
- Explain consequences clearly
- Redirect to home/login after deletion

---

## Exams API Endpoints

### Base Information
- **Base URL:** `/api/exams`
- **Authentication:** Not required for basic endpoints (like listing); required for admin operations

### 1. Get All Exams

**Endpoint:** `GET /api/exams`

**Purpose:** List all available exam types.

**Success Response (200):**
```json
{
  "exams": [
    {
      "id": 1,
      "name": "JAMB",
      "description": "Joint Admissions and Matriculation Board",
      "has_theory": false,
      "objective_questions_per_year": 40,
      "theory_questions_per_year": 0,
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    },
    {
      "id": 2,
      "name": "WAEC",
      "description": "West African Examinations Council",
      "has_theory": true,
      "objective_questions_per_year": 50,
      "theory_questions_per_year": 7,
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    },
    {
      "id": 3,
      "name": "NECO",
      "description": "National Examination Council",
      "has_theory": true,
      "objective_questions_per_year": 50,
      "theory_questions_per_year": 7,
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    }
  ],
  "total": 3
}
```

**Frontend Usage:**
```javascript
async function loadExams() {
  const res = await fetch('/api/exams');
  
  if (res.ok) {
    const data = await res.json();
    return data.exams; // [JAMB, WAEC, NECO]
  }
}
```

**UI Considerations:**
- Display as cards or buttons for exam selection
- Show exam name and description
- Use in navigation/menu for exam selection

---

### 2. Get Exam Metadata

**Endpoint:** `GET /api/exams/{exam}`

**Purpose:** Get exam details including subjects, available years, and question counts.

**Path Parameters:**
- `exam`: Exam name (case-insensitive) - `JAMB`, `WAEC`, or `NECO`

**Success Response (200):**
```json
{
  "exam_name": "JAMB",
  "has_theory": false,
  "objective_per_year": 40,
  "theory_per_year": 0,
  "total_subjects": 7,
  "total_questions": 2800,
  "available_years": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "subjects_with_counts": {
    "Biology": 400,
    "Chemistry": 400,
    "Mathematics": 400,
    "Physics": 400,
    "English Language": 400,
    "Government": 400,
    "Commerce": 400
  }
}
```

**Frontend Usage:**
```javascript
async function loadExamInfo(examName) {
  const res = await fetch(`/api/exams/${examName}`);
  
  if (res.ok) {
    const data = await res.json();
    return data; // Use for displaying available years/subjects
  }
}
```

**UI Considerations:**
- Show exam summary (subjects, years available, total questions)
- Use to populate year selector in practice mode
- Display question counts per subject

---

### 3. Get Subjects Under Exam

**Endpoint:** `GET /api/exams/{exam}/subjects`

**Purpose:** List all subjects for a given exam.

**Path Parameters:**
- `exam`: Exam name - `JAMB`, `WAEC`, or `NECO`

**Success Response (200):**
```json
{
  "subject": "JAMB",
  "subjects": [
    {
      "id": 1,
      "name": "Biology",
      "code": "BIO",
      "description": "Study of living organisms",
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    },
    {
      "id": 2,
      "name": "Chemistry",
      "code": "CHM",
      "description": "Study of matter and reactions",
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    }
  ],
  "total": 7
}
```

**Frontend Usage:**
```javascript
async function loadSubjects(examName) {
  const res = await fetch(`/api/exams/${examName}/subjects`);
  
  if (res.ok) {
    const data = await res.json();
    return data.subjects;
  }
}
```

**UI Considerations:**
- Display as list or grid of subject cards
- Show subject name and description
- Use for navigation (click to view topics/questions)
- Store selected subject for further queries

---

### 4. Get Subject Metadata

**Endpoint:** `GET /api/exams/{exam}/subjects/{subject}`

**Purpose:** Get detailed subject information including question counts and available years.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name

**Success Response (200):**
```json
{
  "subject_name": "Biology",
  "code": "BIO",
  "total_topics": 15,
  "total_questions": 400,
  "objective_questions": 400,
  "theory_questions": 0,
  "available_years": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "has_theory": false
}
```

**Frontend Usage:**
```javascript
async function loadSubjectInfo(examName, subjectName) {
  const res = await fetch(`/api/exams/${examName}/subjects/${subjectName}`);
  
  if (res.ok) {
    const data = await res.json();
    return data;
  }
}
```

**UI Considerations:**
- Show subject overview stats
- Display available years for practice
- Show number of topics for learning mode
- Used for Learn / Practice mode selection

---

### 5. Get Topics Under Subject

**Endpoint:** `GET /api/exams/{exam}/subjects/{subject}/topics`

**Purpose:** List all topics for a subject (for Learn Mode).

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "topics": [
    {
      "id": 1,
      "name": "Cell Structure and Function",
      "description": "Study of cell components and their functions",
      "subtopics": ["Cell membrane", "Cell wall", "Nucleus"],
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    },
    {
      "id": 2,
      "name": "Genetics",
      "description": "Inheritance and genetic variation",
      "subtopics": ["Mendelian laws", "DNA structure", "Mutations"],
      "is_active": true,
      "created_at": "2025-12-01T10:00:00",
      "updated_at": "2025-12-01T10:00:00"
    }
  ],
  "total": 15
}
```

**Frontend Usage:**
```javascript
async function loadTopics(examName, subjectName) {
  const res = await fetch(`/api/exams/${examName}/subjects/${subjectName}/topics`);
  
  if (res.ok) {
    const data = await res.json();
    return data.topics;
  }
}
```

**UI Considerations:**
- Display as collapsible list or accordion
- Show topic name and subtopics
- Click to enter Learn Mode (see topic questions)
- Add progress indicator (optional)

---

### 6. Get Topic Statistics

**Endpoint:** `GET /api/exams/{exam}/subjects/{subject}/topics/{topic_id}`

**Purpose:** Get detailed topic information and question statistics.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name
- `topic_id`: Topic ID (integer)

**Success Response (200):**
```json
{
  "topic_name": "Cell Structure and Function",
  "total_questions": 24,
  "objective_count": 24,
  "theory_count": 0,
  "available_years": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "subtopics_count": 3,
  "difficulty_distribution": {
    "easy": 8,
    "medium": 12,
    "hard": 4
  }
}
```

**Frontend Usage:**
```javascript
async function loadTopicInfo(examName, subjectName, topicId) {
  const res = await fetch(`/api/exams/${examName}/subjects/${subjectName}/topics/${topicId}`);
  
  if (res.ok) {
    const data = await res.json();
    return data;
  }
}
```

**UI Considerations:**
- Show topic overview with statistics
- Display difficulty distribution chart
- Show number of questions available
- Use to inform user before starting quiz

---

### 7. Get Questions for Topic (Learn Mode)

**Endpoint:** `POST /api/exams/{exam}/subjects/{subject}/questions/topic/{topic_id}`

**Purpose:** Get questions for a specific topic across all years. Used for Learn Mode.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name
- `topic_id`: Topic ID

**Request Body (optional):**
```json
{
  "limit": 30,
  "question_type": "all",
  "include_explanation": false
}
```

**Parameters:**
- `limit`: Number of questions (1-100, default 30)
- `question_type`: `objective` | `theory` | `all` (default `all`)
- `include_explanation`: Include answer explanations (default `false`)

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "topic": "Cell Structure and Function",
  "total_available": 24,
  "total_returned": 24,
  "objective_count": 24,
  "theory_count": 0,
  "partial_topic_set": false,
  "years_covered": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "questions": [
    {
      "id": 1,
      "number": 1,
      "question_text": "The cell membrane is composed mainly of...",
      "options": {
        "A": "Proteins and cellulose",
        "B": "Lipids and proteins",
        "C": "Carbohydrates and lipids",
        "D": "Proteins and carbohydrates"
      },
      "answer": "B",
      "topic": "Cell Structure and Function",
      "year": 2010,
      "question_type": "objective",
      "difficulty": "easy",
      "explanation": "The cell membrane is a phospholipid bilayer with embedded proteins...",
      "source_url": null
    }
  ]
}
```

**Frontend Usage:**
```javascript
async function loadTopicQuestions(examName, subjectName, topicId, limit = 30) {
  const res = await fetch(
    `/api/exams/${examName}/subjects/${subjectName}/questions/topic/${topicId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, question_type: 'all' })
    }
  );
  
  if (res.ok) {
    const data = await res.json();
    return data.questions;
  }
}
```

**UI Considerations:**
- Display questions in quiz/learning interface
- Show question number, text, and options A-D
- Provide answer checking functionality
- Show explanation when answer is checked
- Navigation (prev/next question)
- Progress bar (X of Y questions)

---

### 8. Get Questions for Year (Practice Mode)

**Endpoint:** `POST /api/exams/{exam}/subjects/{subject}/questions/year/{year}`

**Purpose:** Get all questions for a specific year. Used for Practice Mode (past questions).

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name
- `year`: Year (integer, e.g., 2024)

**Request Body (optional):**
```json
{
  "question_type": "all",
  "include_explanation": false
}
```

**Parameters:**
- `question_type`: `objective` | `theory` | `all` (default `all`)
- `include_explanation`: Include explanations (default `false`)

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "year": 2024,
  "total_questions": 40,
  "objective_questions": 40,
  "theory_questions": 0,
  "expected_objective": 40,
  "expected_theory": 0,
  "incomplete_year_data": false,
  "questions": [
    {
      "id": 101,
      "number": 1,
      "question_text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "A",
      "topic": "Cell Structure",
      "year": 2024,
      "question_type": "objective",
      "difficulty": "easy",
      "explanation": "...",
      "source_url": null
    }
  ]
}
```

**Flags:**
- `incomplete_year_data`: `true` if fewer questions than expected (indicates data is incomplete for that year)

**Frontend Usage:**
```javascript
async function loadYearQuestions(examName, subjectName, year) {
  const res = await fetch(
    `/api/exams/${examName}/subjects/${subjectName}/questions/year/${year}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_type: 'all' })
    }
  );
  
  if (res.ok) {
    const data = await res.json();
    if (data.incomplete_year_data) {
      alert(`Warning: Only ${data.total_questions} questions found (expected ${data.expected_objective})`);
    }
    return data.questions;
  }
}
```

**UI Considerations:**
- Show full past exam paper
- Display question number prominently
- Show all 40 questions in one view or paginated
- Timed quiz feature (set timer for exam duration)
- Show warning if data incomplete
- Submit button to grade quiz

---

### 9. Get Random Questions

**Endpoint:** `POST /api/exams/{exam}/subjects/{subject}/questions/random`

**Purpose:** Get random questions for a subject. Great for quick drills.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name

**Request Body:**
```json
{
  "limit": 40,
  "question_type": "all",
  "include_explanation": false
}
```

**Parameters:**
- `limit`: Number of questions
  - JAMB: [10, 20, 40, 60, 100, 160]
  - WAEC/NECO: [10, 20, 30, 50]
  - Default: 40 (auto-corrects to nearest valid value)
- `question_type`: `objective` | `theory` | `all` (default `all`)
- `include_explanation`: Include explanations (default `false`)

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "total_requested": 40,
  "total_returned": 40,
  "objective_count": 40,
  "theory_count": 0,
  "years_covered": [2010, 2011, 2015, 2016, 2020, 2023, 2024],
  "topics_covered": ["Biodiversity", "Cell Structure", "Ecology", "Genetics", "Photosynthesis"],
  "questions": [
    {
      "id": 245,
      "number": 1,
      "question_text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "C",
      "topic": "Genetics",
      "year": 2020,
      "question_type": "objective",
      "difficulty": "medium",
      "explanation": "...",
      "source_url": null
    }
  ]
}
```

**Frontend Usage:**
```javascript
async function loadRandomQuestions(examName, subjectName, limit = 40) {
  const res = await fetch(
    `/api/exams/${examName}/subjects/${subjectName}/questions/random`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, question_type: 'all' })
    }
  );
  
  if (res.ok) {
    const data = await res.json();
    console.log(`Questions from: ${data.topics_covered.join(', ')}`);
    return data.questions;
  }
}
```

**UI Considerations:**
- Quick drill button
- Show dropdown for question count (10, 20, 40, etc.)
- Display topics and years covered (for context)
- Quick quiz with immediate feedback
- Shuffle questions on load

---

### 10. Get Available Years for Subject

**Endpoint:** `GET /api/exams/{exam}/subjects/{subject}/years`

**Purpose:** Get list of available years for a subject with question counts.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "available_years": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "year_question_counts": {
    "2010": 40,
    "2011": 40,
    "2012": 40,
    "2013": 40,
    "2014": 40,
    "2015": 40,
    "2016": 40,
    "2017": 40,
    "2018": 40,
    "2019": 40,
    "2020": 40,
    "2021": 40,
    "2022": 40,
    "2023": 40,
    "2024": 40
  }
}
```

**Frontend Usage:**
```javascript
async function loadAvailableYears(examName, subjectName) {
  const res = await fetch(`/api/exams/${examName}/subjects/${subjectName}/years`);
  
  if (res.ok) {
    const data = await res.json();
    return data.available_years; // Use for year selector dropdown
  }
}
```

**UI Considerations:**
- Populate year dropdown in practice mode
- Show question count per year
- Disable years with 0 questions
- Sort years in reverse (newest first, typically)

---

### 11. Get Years for Topic

**Endpoint:** `GET /api/exams/{exam}/subjects/{subject}/topics/{topic_id}/years`

**Purpose:** Get available years for a specific topic.

**Path Parameters:**
- `exam`: Exam name
- `subject`: Subject name
- `topic_id`: Topic ID

**Success Response (200):**
```json
{
  "exam": "JAMB",
  "subject": "Biology",
  "topic": "Cell Structure and Function",
  "available_years": [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  "year_question_counts": {
    "2010": 2,
    "2011": 1,
    "2012": 2,
    "2013": 1,
    "2014": 2,
    "2015": 1,
    "2016": 2,
    "2017": 1,
    "2018": 2,
    "2019": 1,
    "2020": 2,
    "2021": 1,
    "2022": 2,
    "2023": 1,
    "2024": 2
  }
}
```

**Frontend Usage:**
```javascript
async function loadTopicYears(examName, subjectName, topicId) {
  const res = await fetch(
    `/api/exams/${examName}/subjects/${subjectName}/topics/${topicId}/years`
  );
  
  if (res.ok) {
    const data = await res.json();
    return data.year_question_counts;
  }
}
```

**UI Considerations:**
- Show which years a topic appears in
- Useful for tracking topic coverage across years
- Display question count per year

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When Returned |
|------|---------|---|
| 200 | OK | Successful GET/POST/PUT |
| 201 | Created | Successful user registration |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input/validation errors |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Lacks permission (email unverified, admin-only) |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | File upload too big |
| 500 | Internal Server Error | Server error |

### Error Response Format

**Example Error Response:**
```json
{
  "detail": "Invalid email or password"
}
```

or

```json
{
  "detail": "Email already registered"
}
```

### Frontend Error Handling Example

```javascript
async function makeApiCall(url, options = {}) {
  try {
    let res = await fetch(url, options);
    
    // Auto-refresh token on 401
    if (res.status === 401 && options.headers?.Authorization) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        options.headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, options);
      } else {
        redirectToLogin();
      }
    }
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error(data.detail || 'Request failed');
      return { error: data.detail };
    }
    
    return data;
  } catch (e) {
    console.error('Network error:', e);
    return { error: 'Network error' };
  }
}
```

---

## Common Patterns

### Pattern 1: Authenticated API Calls

```javascript
async function authenticatedFetch(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(endpoint, options);
  
  if (res.status === 401) {
    // Try to refresh token
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      window.location.href = '/login';
      return null;
    }
    // Retry with new token
    return authenticatedFetch(endpoint, method, body);
  }
  
  return res.ok ? await res.json() : null;
}
```

### Pattern 2: Loading Questions

```javascript
async function loadQuiz(examName, subjectName, topicId) {
  // Load questions
  const res = await fetch(
    `/api/exams/${examName}/subjects/${subjectName}/questions/topic/${topicId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 30, question_type: 'all' })
    }
  );
  
  const data = await res.json();
  
  return {
    questions: data.questions,
    totalQuestions: data.total_available,
    yearsCovered: data.years_covered,
    topicsInfo: `From ${data.years_covered.length} years`
  };
}
```

### Pattern 3: Paginated History

```javascript
class ExamHistory {
  constructor(itemsPerPage = 20) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.total = 0;
  }
  
  async loadPage(pageNum = 1) {
    const offset = (pageNum - 1) * this.itemsPerPage;
    const token = localStorage.getItem('access_token');
    
    const res = await fetch(
      `/profile/history?limit=${this.itemsPerPage}&offset=${offset}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const data = await res.json();
    this.total = data.total;
    this.currentPage = pageNum;
    return data.sessions;
  }
  
  get totalPages() {
    return Math.ceil(this.total / this.itemsPerPage);
  }
}
```

### Pattern 4: Subject Navigation

```javascript
class SubjectSelector {
  async init() {
    // Get exams
    const examsRes = await fetch('/api/exams');
    const { exams } = await examsRes.json();
    
    // User selects exam
    const selectedExam = exams[0].name; // JAMB
    
    // Get subjects for exam
    const subjectsRes = await fetch(`/api/exams/${selectedExam}/subjects`);
    const { subjects } = await subjectsRes.json();
    
    return { exams, subjects };
  }
}
```

---

## Quick Reference

### Most Common Endpoints (For Frontend Dev)

| Feature | Endpoint | Method | Auth |
|---------|----------|--------|------|
| Register | `POST /auth/register` | POST | No |
| Login | `POST /auth/login` | POST | No |
| Verify Email | `POST /auth/verify-email` | POST | No |
| Get Profile | `GET /profile` | GET | Yes |
| Get Stats | `GET /profile/stats` | GET | Yes |
| List Exams | `GET /api/exams` | GET | No |
| List Subjects | `GET /api/exams/{exam}/subjects` | GET | No |
| List Topics | `GET /api/exams/{exam}/subjects/{subject}/topics` | GET | No |
| Get Topic Questions | `POST /api/exams/{exam}/subjects/{subject}/questions/topic/{id}` | POST | No |
| Get Year Questions | `POST /api/exams/{exam}/subjects/{subject}/questions/year/{year}` | POST | No |
| Get Random Questions | `POST /api/exams/{exam}/subjects/{subject}/questions/random` | POST | No |

---

## Testing Endpoints

### Using cURL

```bash
# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Get profile (replace TOKEN with actual access token)
curl -X GET http://localhost:8000/profile \
  -H "Authorization: Bearer TOKEN"

# List exams
curl -X GET http://localhost:8000/api/exams

# Get JAMB subjects
curl -X GET http://localhost:8000/api/exams/JAMB/subjects

# Get Biology topics for JAMB
curl -X GET http://localhost:8000/api/exams/JAMB/subjects/Biology/topics

# Get random questions
curl -X POST http://localhost:8000/api/exams/JAMB/subjects/Biology/questions/random \
  -H "Content-Type: application/json" \
  -d '{"limit": 20}'
```

### Using JavaScript/Fetch

```javascript
// Register
fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    password: 'Test123'
  })
}).then(r => r.json()).then(console.log);

// Login and save tokens
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123'
  })
}).then(r => r.json()).then(data => {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
});
```

---

**Last Updated:** December 8, 2025  
**API Version:** 1.0  
**Status:** Production Ready
