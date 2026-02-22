# ExamGenius Frontend

Modern, mobile-first web application for JAMB CBT preparation.

## 🚀 Features

- **Authentication Flow**: Complete register → verify → login flow
- **Learn by Topics**: AI-powered lessons + practice questions
- **Year Practice**: Practice past questions by specific year (2010-2024)
- **Full CBT Simulation**: 160 questions, 3-hour timer, real exam experience
- **Dashboard**: Performance analytics, streaks, weak topics, recommendations
- **Profile Management**: View stats, update profile, manage account
- **Mobile-First Design**: Responsive across phone, tablet, desktop
- **Real-time Updates**: Live timer, progress tracking, instant feedback

## 📁 Project Structure 
This is the structure

```
frontend/
├── index.html              # Main entry point
├── css/
│   └── styles.css          # All styles (mobile-first)
├── js/
│   ├── config.js           # API configuration
│   ├── utils.js            # Utility functions
│   ├── api.js              # API service layer
│   ├── auth.js             # Authentication manager
│   ├── router.js           # Client-side routing
│   ├── app.js              # Application bootstrap
│   ├── components/
│   │   └── navbar.js       # Navigation component
│   └── screens/
│       ├── auth-screens.js # Login, register, verify, reset
│       ├── dashboard.js    # Main dashboard
│       ├── learn.js        # Learn topics flow
│       ├── year-practice.js # Year practice flow
│       ├── cbt.js          # Full CBT simulation
│       └── profile.js      # Profile management
```

## 🎨 Design System

### Colors
- **Primary Yellow**: `#FFC107` (brand color)
- **Yellow Dark**: `#FFA000` (hover states)
- **Yellow Light**: `#FFECB3` (backgrounds)
- **White**: `#FFFFFF` (cards, backgrounds)
- **Black/Greys**: Text and UI elements

### Typography
- System font stack for optimal performance
- Clear hierarchy with 48px → 36px → 20px → 16px → 14px

### Components
- Cards with 12px border radius
- Buttons with hover animations
- Toast notifications (top-right)
- Loading overlay
- Modal dialogs
- Progress bars

## 🔧 Setup & Installation

### Prerequisites
- Backend API running at `http://127.0.0.1:8000`
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running Locally

1. **Option 1: Simple HTTP Server (Python)**
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Open: http://localhost:8080

2. **Option 2: Node.js HTTP Server**
   ```bash
   npx http-server frontend -p 8080
   ```

3. **Option 3: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

### Configuration

Edit `js/config.js` if backend URL differs:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000', // Change if needed
    API_VERSION: '/api/v1',
    TIMEOUT: 30000,
};
```

## 📱 Screen Guide

### 1. Landing Page
- Hero section with CTA
- Features overview
- About section
- Navigation to login/register

### 2. Authentication
- **Login**: Email + password
- **Register**: Name, email, password with validation
- **Email Verification**: Auto-verify from email link
- **Password Reset**: Request + reset flow

### 3. Dashboard
- Stats cards (attempts, accuracy, active days)
- Streak counter with fire icon
- Quick actions (Learn, Year Practice, CBT)
- Weakest topics to focus on
- Recent activity timeline
- CBT exam history

### 4. Learn Topics
- Subject selection with icons
- Topic list with progress indicators
- AI lesson viewer (key idea, example, steps, tips)
- Practice questions (10 per session)
- Results with explanations

### 5. Year Practice
- Select subject + year + question count
- Practice interface with navigation
- Submit and review with explanations

### 6. Full CBT
- Select 4 subjects
- 160 questions (40 per subject)
- 3-hour countdown timer (auto-submit)
- Subject switching
- Detailed results with subject breakdown
- Answer review

### 7. Profile
- View profile info and stats
- Edit name
- Account settings
- Logout

## 🔐 Authentication Flow

```
1. User registers → Backend sends verification email
2. User clicks email link → Frontend auto-verifies
3. User logs in → Receives access_token (15 min) + refresh_token (7 days)
4. Access token stored in memory
5. Refresh token stored in localStorage
6. Auto-refresh when access token expires
7. Logout clears all tokens
```

## 📊 API Integration

All endpoints from `FRONTEND_API_GUIDE.md` are implemented:

- ✅ 7 Authentication endpoints
- ✅ 3 User profile endpoints
- ✅ 4 JAMB public endpoints
- ✅ 5 Learn topic endpoints
- ✅ 3 Year practice endpoints
- ✅ 5 CBT endpoints
- ✅ 6 Dashboard endpoints
- ✅ 3 Profile management endpoints

## 🎯 Key Features Implementation

### Token Management
- Access token in memory (security)
- Refresh token in localStorage
- Auto-refresh on 401 errors
- Automatic retry with new token

### State Management
- Separate state objects per screen
- Persistent across navigation within screen
- Reset on screen exit

### Error Handling
- Toast notifications for all errors
- Loading states for all async operations
- Validation before API calls
- User-friendly error messages

### Performance
- Minimal dependencies (vanilla JS)
- Efficient DOM updates
- CSS animations (GPU accelerated)
- Lazy loading screens

### Mobile Optimization
- Touch-friendly buttons (min 44px)
- Responsive grid layouts
- Mobile menu for navigation
- Optimized for low data usage

## 🧪 Testing Checklist

### Authentication
- [ ] Register new account
- [ ] Verify email (check backend logs for token)
- [ ] Login with verified account
- [ ] Token refresh works
- [ ] Logout clears session

### Learn Topics
- [ ] Load subjects
- [ ] View topic list with stats
- [ ] Read AI lesson
- [ ] Practice questions
- [ ] Submit and see results

### Year Practice
- [ ] Select subject and year
- [ ] Load questions
- [ ] Navigate between questions
- [ ] Submit and review

### CBT
- [ ] Select 4 subjects
- [ ] Start exam with timer
- [ ] Switch between subjects
- [ ] Auto-submit on time up
- [ ] View detailed results

### Dashboard
- [ ] View all stats
- [ ] See streak counter
- [ ] Check weak topics
- [ ] Recent activity loads

### Profile
- [ ] View profile
- [ ] Update name
- [ ] Stats display correctly

## 🐛 Common Issues

### "Failed to fetch" errors
- Ensure backend is running at http://127.0.0.1:8000
- Check browser console for CORS errors
- Verify API_CONFIG.BASE_URL is correct

### "Unauthorized" errors
- Clear localStorage and re-login
- Check if email is verified
- Verify backend token generation works

### Blank screens
- Check browser console for errors
- Ensure all JS files are loaded
- Check network tab for failed requests

## 🚀 Deployment

### For Production:
1. Update `API_CONFIG.BASE_URL` to production backend URL
2. Enable HTTPS
3. Add environment-based config
4. Minify CSS/JS
5. Add service worker for offline support
6. Configure CDN for static assets

### CORS Configuration
Backend must allow your frontend domain in CORS settings.

## 📝 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 🔒 Security Notes

- Access tokens stored in memory only (cleared on page refresh)
- Refresh tokens in localStorage (7-day expiry)
- No sensitive data in URLs
- CSRF protection via tokens
- Input validation before submission

## 📚 Documentation

- Full API documentation: `../FRONTEND_API_GUIDE.md`
- Backend documentation: `../docs/`
- Project structure: `../EXAMGENIUS_PROJECT_BIBLE.md`

## 🤝 Contributing

This is the frontend for ExamGenius JAMB preparation platform.

**Do NOT:**
- Modify backend logic
- Change API contracts
- Hardcode data from endpoints

**Do:**
- Improve UI/UX
- Add animations
- Optimize performance
- Fix bugs
- Enhance accessibility

## 📄 License

© 2025 ExamGenius. All rights reserved.

---

**Built with ❤️ for Nigerian students preparing for JAMB UTME**
