# Troubleshooting: Recommended Topics Not Showing

## Quick Fix Steps

1. **Clear Browser Cache**
   - Press `Ctrl+Shift+Delete` (Windows)
   - Select "All time" and check "Cached images and files"
   - Click "Clear data"
   - Refresh the dashboard page (F5)

2. **Hard Refresh**
   - Press `Ctrl+F5` (Windows) to do a hard refresh
   - Or `Ctrl+Shift+R` in some browsers

3. **Check Browser Console**
   - Open Developer Tools: `F12`
   - Go to Console tab
   - You should see log messages:
     ```
     Dashboard stats received: {...}
     Recommended topics: [...]
     ```
   - If you see errors, they'll be displayed in red

4. **Verify API is Returning Data**
   - Open Developer Tools: `F12`
   - Go to Network tab
   - Refresh the page
   - Look for request to `/dashboard/stats`
   - Click it and check the Response
   - Look for `"recommended_topics":` field

## Expected Response Structure

```json
{
  "recommended_topics": [
    {
      "subject": "Accounting",
      "topic": "Trading/Profit & Loss Account",
      "accuracy": 0.0,
      "attempts": 0
    },
    ...
  ]
}
```

## If Still Not Showing

1. **Check if user has data**
   ```
   - Log in with olalekanquadri101@yahoo.com
   - Check if dashboard loads at all
   - Check overall stats (should show 60 attempts, 25 correct)
   ```

2. **Check Python logs** (Uvicorn terminal)
   ```
   - Look for any errors starting with "ERROR" or red text
   - Copy any error messages
   ```

3. **Force Backend Reload**
   - Stop Uvicorn (Ctrl+C in the terminal)
   - Run: `uvicorn app.main:app --reload`
   - Wait for it to say "Uvicorn running on..."

4. **Check Database**
   ```python
   # In PowerShell:
   python -c "
   import sqlite3
   conn = sqlite3.connect('jamb_questions.db')
   cursor = conn.cursor()
   cursor.execute('SELECT COUNT(*) FROM user_stats WHERE user_id = 3')
   print(f'Topics practiced: {cursor.fetchone()[0]}')
   "
   ```

## What Should Happen

1. User logs in with email/password
2. Dashboard page loads
3. Shows "Welcome back, [Name]!"
4. Shows stats cards (Total Attempts, Accuracy, etc.)
5. **Shows "Recommended Topics for You" section with 3 cards**
6. Each card shows:
   - Priority number (1, 2, 3)
   - Subject name
   - Topic name
   - Accuracy percentage (if practiced) OR "Start learning this topic" (if new)

## Cards Should Look Like This

```
┌────────────────────────────────┐
│ 1️⃣ Accounting                  │
│ Trading/Profit & Loss Account   │
│ Current Accuracy: 0.0%          │
│ (clickable - goes to Learn)     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 2️⃣ Mathematics                 │
│ Mensuration                     │
│ Start learning this topic       │
│ (clickable - goes to Learn)     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 3️⃣ Mathematics                 │
│ Trigonometry                    │
│ Start learning this topic       │
│ (clickable - goes to Learn)     │
└────────────────────────────────┘
```

## Code Changes Made

### Backend (`app/api/v1/endpoints/dashboard.py`)
- Enhanced `/dashboard/stats` endpoint
- Added recommendation logic with 3-tier fallback:
  1. Weakest topics from registered subjects
  2. ANY weakest topics if no registered subjects
  3. Foundational topics from common subjects if no practice

### Frontend (`frontend/js/screens/dashboard.js`)
- Added "Recommended Topics for You" section
- Shows 3 recommended topic cards
- Each card is clickable and navigates to Learn screen
- Handles both practiced and unpracticed topics

## Testing Data

Currently logged-in admin user (ID: 3) has:
- Department: Science
- Registered Subjects: None (empty)
- Practice History: 60 attempts in Accounting, Mathematics, Government
- Should recommend: Weakest topics (0% accuracy topics)

Expected recommendations for this user:
1. Accounting: Trading/Profit & Loss Account (0.0%)
2. Mathematics: Mensuration (0.0%)
3. Mathematics: Trigonometry (0.0%)
