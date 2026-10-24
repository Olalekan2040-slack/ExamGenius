# 🚀 EduLab ExamPrep - Visual Start Guide

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║                    EduLab ExamPrep Frontend v1.0.0                         ║
║              JAMB CBT Preparation Platform - Frontend                 ║
║                                                                       ║
║                  🎓 Built for Nigerian Students 🎓                    ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## ⚡ Quick Start (3 Commands)

### Terminal 1: Start Backend
```bash
cd C:\Users\DELL\Desktop\examgenius
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Terminal 2: Start Frontend
```bash
cd C:\Users\DELL\Desktop\examgenius\frontend
python -m http.server 8080
```
**Expected Output:**
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

### Browser: Open Application
```
http://localhost:8080/launcher.html
```
**OR directly:**
```
http://localhost:8080/index.html
```

---

## 📁 Project Structure

```
examgenius/
│
├── 🔧 BACKEND (Already Built - Your Work)
│   ├── main.py
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   └── services/
│   ├── jamb_questions.db
│   └── requirements.txt
│
└── 🎨 FRONTEND (Just Created - This Deliverable)
    ├── launcher.html ................. Test launcher
    ├── index.html .................... Main app
    ├── README.md ..................... Full documentation
    ├── QUICK_START.md ................ Getting started
    ├── IMPLEMENTATION_SUMMARY.md ..... What was built
    ├── FILE_LIST.md .................. Complete file list
    │
    ├── css/
    │   └── styles.css ................ All styles
    │
    └── js/
        ├── config.js ................. API settings
        ├── utils.js .................. Helper functions
        ├── api.js .................... API service
        ├── auth.js ................... Auth manager
        ├── router.js ................. Navigation
        ├── app.js .................... Bootstrap
        │
        ├── components/
        │   └── navbar.js ............. Navigation bar
        │
        └── screens/
            ├── auth-screens.js ....... Login, register, etc.
            ├── dashboard.js .......... Main dashboard
            ├── learn.js .............. Learn topics
            ├── year-practice.js ...... Year practice
            ├── cbt.js ................ Full CBT exam
            └── profile.js ............ User profile
```

---

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│  LANDING PAGE                                               │
│  • Hero section with call-to-action                         │
│  • Features showcase                                        │
│  • About section                                            │
│  • Footer with links                                        │
│                                                             │
│  [Get Started] ──────┐      [Login] ──────┐                │
└─────────────────────┼────────────────────┼─────────────────┘
                      │                     │
                      ▼                     ▼
              ┌───────────────┐     ┌──────────────┐
              │  REGISTER     │     │   LOGIN      │
              │  • Name       │     │   • Email    │
              │  • Email      │     │   • Password │
              │  • Password   │     └──────┬───────┘
              └───────┬───────┘            │
                      │                    │
                      ▼                    │
              ┌───────────────┐            │
              │ VERIFY EMAIL  │            │
              │ • Check inbox │            │
              │ • Click link  │            │
              └───────┬───────┘            │
                      │                    │
                      └────────┬───────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │   DASHBOARD      │
                     │  • Stats cards   │
                     │  • Streak 🔥     │
                     │  • Quick actions │
                     │  • Weak topics   │
                     │  • Recent acts   │
                     └────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │   LEARN    │  │    YEAR    │  │    CBT     │
     │   TOPICS   │  │  PRACTICE  │  │   EXAM     │
     └────────────┘  └────────────┘  └────────────┘
              │               │               │
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │  PRACTICE  │  │  PRACTICE  │  │ 160 QUES   │
     │ QUESTIONS  │  │ QUESTIONS  │  │ 3 HOURS    │
     └────────────┘  └────────────┘  └────────────┘
              │               │               │
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │  RESULTS   │  │  RESULTS   │  │  RESULTS   │
     │ + REVIEW   │  │ + REVIEW   │  │ + REVIEW   │
     └────────────┘  └────────────┘  └────────────┘
```

---

## 🎨 Color Palette

```
Primary Colors:
┌─────────────┬─────────────┬─────────────┐
│   YELLOW    │ YELLOW DARK │ YELLOW LIGHT│
│   #FFC107   │   #FFA000   │   #FFECB3   │
│   ███████   │   ███████   │   ███████   │
└─────────────┴─────────────┴─────────────┘

Neutrals:
┌─────────────┬─────────────┬─────────────┐
│    WHITE    │    BLACK    │  TEXT GREY  │
│   #FFFFFF   │   #000000   │   #757575   │
│   ███████   │   ███████   │   ███████   │
└─────────────┴─────────────┴─────────────┘

Feedback Colors:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   SUCCESS   │    ERROR    │   WARNING   │    INFO     │
│   #4CAF50   │   #F44336   │   #FF9800   │   #2196F3   │
│   ███████   │   ███████   │   ███████   │   ███████   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 📱 Screen Sizes

```
Mobile            Tablet           Desktop
┌────────┐       ┌───────────┐    ┌──────────────────┐
│        │       │           │    │                  │
│  📱    │       │    📱     │    │       💻         │
│        │       │           │    │                  │
│        │       │           │    │                  │
└────────┘       └───────────┘    └──────────────────┘
< 768px          768-1024px       > 1024px

All screens are RESPONSIVE and MOBILE-FIRST!
```

---

## 🔐 Authentication Flow

```
1. REGISTER
   ┌─────────────────────┐
   │ Name: John Doe      │
   │ Email: john@ex.com  │
   │ Password: ********  │
   └──────────┬──────────┘
              │
              ▼
2. EMAIL SENT
   ┌─────────────────────┐
   │  📧 Check Your Email│
   │  Verification link  │
   │  has been sent to:  │
   │  john@example.com   │
   └──────────┬──────────┘
              │
              ▼
3. VERIFY (Click Email Link)
   ┌─────────────────────┐
   │  ✅ Email Verified! │
   │  You can now login  │
   └──────────┬──────────┘
              │
              ▼
4. LOGIN
   ┌─────────────────────┐
   │ Email: john@ex.com  │
   │ Password: ********  │
   └──────────┬──────────┘
              │
              ▼
5. DASHBOARD
   ┌─────────────────────┐
   │ Welcome, John! 👋   │
   │ [Your Stats Here]   │
   └─────────────────────┘
```

---

## ⏱️ CBT Exam Timer

```
Start:  3:00:00  ┌──────────────────────┐
                 │ ⏱️  3:00:00          │ Green
After 1hr: 2:00:00  │ ⏱️  2:00:00          │ Green
After 2hrs: 1:00:00 │ ⏱️  1:00:00          │ Yellow
Last 5 min: 0:04:32 │ ⏱️  0:04:32  (BLINK)│ Red
Time Up: 0:00:00    │ 🚨 AUTO-SUBMIT!     │ Red
                 └──────────────────────┘
```

---

## 📊 Dashboard Preview

```
╔══════════════════════════════════════════════════════════════╗
║ Welcome back, John! 👋                                       ║
║                                                              ║
║ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           ║
║ │  245    │ │  77.1%  │ │  189    │ │   15    │           ║
║ │Attempts │ │Accuracy │ │ Correct │ │  Days   │           ║
║ └─────────┘ └─────────┘ └─────────┘ └─────────┘           ║
║                                                              ║
║ 🔥 7 Day Streak! (Longest: 12 days)                         ║
║                                                              ║
║ Quick Actions:                                               ║
║ [Learn Topics] [Year Practice] [Start CBT]                   ║
║                                                              ║
║ ⚠️ Topics That Need Attention:                              ║
║ • Chemistry - Organic Chemistry (45.5% accuracy)             ║
║ • Physics - Electricity (52.3% accuracy)                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🧪 Testing Checklist

```
Authentication:
☐ Register new account
☐ Receive verification email (check backend logs)
☐ Verify email (copy token from logs)
☐ Login with verified credentials
☐ Session persists on page refresh
☐ Logout works

Dashboard:
☐ Stats display correctly
☐ Streak counter shows
☐ Quick actions work
☐ Navigation sidebar works

Learn Topics:
☐ Select subject
☐ View topic list
☐ Read AI lesson
☐ Practice questions
☐ Submit answers
☐ View results

Year Practice:
☐ Select subject and year
☐ Load questions
☐ Answer questions
☐ Submit
☐ View detailed results

CBT Exam:
☐ Select 4 subjects
☐ Timer starts at 3:00:00
☐ Switch between subjects
☐ Answer questions
☐ Submit exam
☐ View subject breakdown

Profile:
☐ View profile
☐ Edit name
☐ View stats
☐ Logout
```

---

## 🎬 Getting Started - Step by Step

### Step 1: Prerequisites Check
```powershell
# Check Python version
python --version
# Should show: Python 3.x.x

# Check if backend is accessible
curl http://127.0.0.1:8000/api/v1/jamb/subjects
# Should return list of subjects
```

### Step 2: Start Backend
```powershell
cd C:\Users\DELL\Desktop\examgenius
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
**Wait for:** `Application startup complete.`

### Step 3: Start Frontend (New Terminal)
```powershell
cd C:\Users\DELL\Desktop\examgenius\frontend
python -m http.server 8080
```
**Wait for:** `Serving HTTP on...`

### Step 4: Open Browser
```
Chrome/Firefox/Edge → http://localhost:8080/launcher.html
```

### Step 5: Health Check
The launcher will:
- ✅ Check backend connection
- ✅ Show system info
- ✅ Enable "Launch" button if all OK

### Step 6: Launch App
Click **"🚀 Launch EduLab ExamPrep"**

### Step 7: Register
- Click "Get Started"
- Fill form with valid data
- Click "Create Account"

### Step 8: Verify Email
Check backend terminal for:
```
INFO: Verification token: abc123xyz...
```
Navigate to:
```
http://localhost:8080/index.html#verify-email?token=abc123xyz
```

### Step 9: Login
- Enter email and password
- Click "Sign In"
- You're in! 🎉

---

## 🔧 Configuration

### Backend URL (if different)
Edit `frontend/js/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://your-backend-url:8000',
    API_VERSION: '/api/v1',
};
```

### Frontend Port (if different)
```powershell
python -m http.server 3000  # Use port 3000
```

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch"
```
❌ Problem: Can't connect to backend
✅ Solution: Ensure backend is running at http://127.0.0.1:8000
```

### Issue: Blank screen after login
```
❌ Problem: JavaScript errors
✅ Solution: Open DevTools (F12), check Console for errors
```

### Issue: "Unauthorized" errors
```
❌ Problem: Email not verified or token expired
✅ Solution: 
   1. Verify email is verified in database
   2. Clear localStorage (DevTools → Application → Storage)
   3. Re-login
```

### Issue: Questions not loading
```
❌ Problem: No data in database
✅ Solution: Check backend has questions in jamb_questions.db
```

---

## 📞 Support

Need help?
1. Check browser console (F12 → Console)
2. Check backend logs in terminal
3. Review QUICK_START.md
4. Review README.md

---

## 🎉 You're Ready!

```
┌─────────────────────────────────────┐
│  ✅ Backend Running                 │
│  ✅ Frontend Running                │
│  ✅ Browser Opened                  │
│  ✅ Account Created & Verified      │
│  ✅ Logged In                       │
│                                     │
│  🎓 START PRACTICING! 🎓            │
└─────────────────────────────────────┘
```

**Good luck with your JAMB preparation! 🚀📚**

---

*EduLab ExamPrep Frontend - Visual Start Guide*
*Version 1.0.0 - December 10, 2025*
