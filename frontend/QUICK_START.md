# ExamGenius Frontend - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend
```bash
cd examgenius
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
Backend will run at: http://127.0.0.1:8000

### Step 2: Start the Frontend
Open a new terminal:
```bash
cd examgenius/frontend
python -m http.server 8080
```
Frontend will run at: http://localhost:8080

### Step 3: Open in Browser
Navigate to: http://localhost:8080

## 📋 First-Time User Flow

1. **Landing Page** → Click "Get Started" or "Register"
2. **Register** → Fill name, email, password → Submit
3. **Check Email** → Look for verification email in backend logs
4. **Verify Email** → Click link (or manually navigate with token)
5. **Login** → Enter email and password
6. **Dashboard** → Explore the platform!

## 🔑 Test Account (If Available)

If you have a verified test account:
- Email: `test@example.com`
- Password: `Test123!`

## 📱 Main Features to Test

### 1️⃣ Learn Topics
Dashboard → "Learn Topics" → Select Subject → Pick Topic → Read Lesson → Practice

### 2️⃣ Year Practice
Dashboard → "Year Practice" → Select Subject + Year → Practice → Submit

### 3️⃣ Full CBT Exam
Dashboard → "Start CBT" → Select 4 Subjects → Begin Exam (3-hour timer)

### 4️⃣ Profile
Click profile avatar (top right) → View stats → Edit profile

## 🎨 UI Overview

### Landing Page
- Hero section with features
- "Get Started" and "Login" buttons
- Features showcase
- About section

### Dashboard (After Login)
- **Top**: User avatar, name, navigation
- **Sidebar**: Dashboard, Learn Topics, Year Practice, CBT, Profile
- **Main**: Stats cards, streak, quick actions, weak topics, recent activity

### Question Screens
- Progress indicator (Question X of Y)
- Question text with optional image
- Multiple choice options (A, B, C, D)
- Previous/Next navigation
- Submit button on last question

## 🧪 Quick Testing Checklist

- [ ] Register new account
- [ ] Verify email (check backend logs for verification link)
- [ ] Login with verified account
- [ ] View dashboard stats
- [ ] Select a subject in Learn Topics
- [ ] Read a topic lesson
- [ ] Practice 10 questions
- [ ] Submit and view results
- [ ] Try Year Practice
- [ ] Start a CBT exam (can exit early)
- [ ] Update profile name
- [ ] Logout and login again

## ⚙️ Configuration

### Change Backend URL
Edit `frontend/js/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://your-backend-url:8000',
    API_VERSION: '/api/v1',
};
```

### Change Frontend Port
```bash
python -m http.server 3000  # Use port 3000 instead
```

## 🐛 Troubleshooting

### "Failed to fetch" errors
✅ **Solution**: Ensure backend is running at http://127.0.0.1:8000

### Blank screen after login
✅ **Solution**: Check browser console (F12) for errors

### "Unauthorized" errors
✅ **Solution**: 
1. Verify email is verified in database
2. Clear browser localStorage
3. Re-login

### Questions not loading
✅ **Solution**:
1. Check backend has questions in database
2. Verify API endpoints return data (use backend Swagger: http://127.0.0.1:8000/docs)

### Timer not working in CBT
✅ **Solution**: 
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Try in different browser

## 📊 Expected Behavior

### Login Flow
1. Enter email/password → Click "Sign In"
2. Loading overlay appears
3. Redirects to Dashboard on success
4. Toast notification: "Login successful! Welcome back."

### Practice Flow
1. Select subject → Loading overlay
2. Topic list appears with progress bars
3. Click topic → AI lesson loads
4. Click "Start Practice" → 10 questions load
5. Answer questions → Click "Submit Answers"
6. Results screen shows score and review

### CBT Flow
1. Select exactly 4 subjects → "Start CBT Exam"
2. Timer starts at 3:00:00
3. 160 questions load (40 per subject)
4. Switch subjects using top buttons
5. Answer questions → "Submit"
6. Detailed results with subject breakdown

## 🎯 Key Features Highlights

### Real-time Timer (CBT)
- Counts down from 3 hours
- Turns red in last 5 minutes
- Auto-submits when time runs out

### Streak Counter
- Shows current streak 🔥
- Displays longest streak
- Updates with daily practice

### AI Lessons
- Key ideas
- Examples
- Step-by-step explanations
- Quick tips

### Progress Tracking
- Accuracy percentages
- Questions attempted
- Correct/incorrect breakdown
- Subject-wise performance

## 📱 Mobile Testing

### On Phone/Tablet
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Start frontend with:
   ```bash
   python -m http.server 8080 --bind 0.0.0.0
   ```

3. On mobile browser, navigate to:
   ```
   http://YOUR_COMPUTER_IP:8080
   ```

### Mobile Features
- Hamburger menu for navigation
- Touch-friendly buttons
- Responsive grid layouts
- Optimized for smaller screens

## 🔒 Security Notes

### Tokens
- **Access Token**: Valid for 15 minutes (stored in memory)
- **Refresh Token**: Valid for 7 days (stored in localStorage)
- Auto-refresh happens on 401 errors

### Logout
- Clears all tokens
- Redirects to landing page
- Must login again to access protected routes

## 📈 Performance Tips

### For Best Experience
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Clear browser cache if issues occur

### Data Usage
- Minimal: Text-based questions
- Images load only when present
- Efficient API calls

## 🆘 Support

### Check These First
1. Browser console (F12 → Console tab)
2. Network tab (F12 → Network tab)
3. Backend logs (terminal running uvicorn)

### Common Console Errors
- `Failed to fetch`: Backend not running
- `401 Unauthorized`: Not logged in or token expired
- `404 Not Found`: Wrong API endpoint
- `CORS error`: Backend CORS not configured

## 📚 Next Steps

After testing:
1. Review `README.md` for detailed documentation
2. Check `FRONTEND_API_GUIDE.md` for API reference
3. Explore code in `frontend/js/screens/` for implementation details
4. Customize colors in `frontend/css/styles.css`

---

## 🎉 You're All Set!

The frontend is ready to use with your backend API. Happy testing! 🚀

**Questions? Issues?**
- Check browser console for errors
- Verify backend is running and healthy
- Review API documentation in FRONTEND_API_GUIDE.md
