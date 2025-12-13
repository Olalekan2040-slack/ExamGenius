# Smart Topic Recommendation System

## Overview
Users now receive personalized topic recommendations when they log in to their dashboard based on:
1. **Department Choice** (Science, Commercial, or Art)
2. **Performance Data** (weakest topics with lowest accuracy)
3. **Registered Subjects** (4 subjects chosen during profile setup)

## How It Works

### 1. User Profile Setup
When a user completes their profile, they:
- Select a department (Science, Commercial, or Art)
- Choose 4 subjects for JAMB exam
- This data is stored in `user_profiles` and `user_subjects` tables

### 2. Recommendation Algorithm

**Backend: `GET /dashboard/stats`**

The endpoint performs these steps in sequence:

```
1. Fetch User Profile
   ├─ Department: Science | Commercial | Art
   └─ Registered Subjects: [Subject1, Subject2, Subject3, Subject4]

2. Get Performance Data
   ├─ Query all practice attempts and accuracy per topic
   └─ Sort by accuracy (ascending) to find weakest areas

3. Filter for Relevance
   ├─ Only recommend topics from registered subjects
   └─ Limit to top 3-5 weak topics for focus

4. Handle New Users
   ├─ If no practice history exists
   └─ Recommend foundational topics from registered subjects

5. Return Structured Data
   ├─ Profile info (department + subjects)
   ├─ Recommended topics (prioritized weak areas)
   └─ Weakest topics (for additional context)
```

### 3. Frontend Display

**Dashboard: `frontend/js/screens/dashboard.js`**

The dashboard displays:

**"Recommended Topics for You" Section**
- Visual cards with gradient backgrounds
- Shows department context: "Based on your [Science] department and your performance"
- Numbered cards (1, 2, 3) for each recommendation
- Current accuracy displayed (if practice history exists)
- One-click "Start Learning" button to navigate to Learn screen

**Card Layout**
```
┌─────────────────────────────────────────────┐
│ 🎯 Recommended Topics for You               │
│ Based on your Science department and your   │
│ performance                                 │
├─────────────────────────────────────────────┤
│ [1] Chemistry     [2] Biology     [3] Physics│
│     Stoichiometry     Genetics      Forces   │
│     60.5% accuracy    75.2% accuracy (New)   │
└─────────────────────────────────────────────┘
```

## API Endpoints

### Main Endpoint: Dashboard Stats
```
GET /dashboard/stats
```

**Response Structure:**
```json
{
  "overall_stats": {
    "total_attempts": 150,
    "correct_attempts": 105,
    "overall_accuracy": 70.0,
    "total_active_days": 45
  },
  "streak": {
    "current_streak": 7,
    "longest_streak": 14,
    "last_activity": "2025-12-12T10:30:00"
  },
  "profile": {
    "department": "Science",
    "registered_subjects": [
      {"subject": "Chemistry", "position": 1},
      {"subject": "Biology", "position": 2},
      {"subject": "Physics", "position": 3},
      {"subject": "English Language", "position": 4}
    ]
  },
  "recommended_topics": [
    {
      "subject": "Chemistry",
      "topic": "Stoichiometry",
      "accuracy": 60.5,
      "attempts": 12
    },
    {
      "subject": "Biology",
      "topic": "Genetics",
      "accuracy": 65.0,
      "attempts": 8
    },
    {
      "subject": "Physics",
      "topic": "Forces and Motion",
      "accuracy": 0,
      "attempts": 0
    }
  ],
  "weakest_topics": [...],
  "recent_attempts": [...],
  "cbt_history": [...]
}
```

### Standalone Recommendations Endpoint
```
GET /dashboard/recommendations
```

**Enhanced Response with Context:**
```json
{
  "success": true,
  "department": "Science",
  "registered_subjects": ["Chemistry", "Biology", "Physics", "English Language"],
  "weakest_topics": [
    {"subject": "Chemistry", "topic": "Stoichiometry", "accuracy": 60.5, "attempts": 12},
    ...
  ],
  "urgent_focus_areas": [
    {"subject": "Physics", "topic": "Waves and Oscillation", "recent_accuracy": 40.0}
  ],
  "recommendation_message": "Based on your Science department choice, focus on topics critical for your stream. Your weakest areas are Chemistry: Stoichiometry, Biology: Genetics, Physics: Thermodynamics. Start with these for maximum improvement.",
  "suggested_action": "Start with the weakest topics using the 'Learn by Topics' feature",
  "study_focus": {
    "primary_focus": {"subject": "Chemistry", "topic": "Stoichiometry"},
    "secondary_focuses": [...]
  }
}
```

## Department-Specific Recommendations

The system is aware of JAMB subject grouping by department:

### Science Department
- Chemistry
- Biology  
- Physics

### Commercial Department
- Economics
- Accounting
- Commerce

### Art Department
- English Language
- Literature in English
- History
- Government/Geography

## User Experience Flow

1. **User Logs In** → Dashboard loads
2. **Dashboard API Call** → `/dashboard/stats` fetches all data including recommendations
3. **Dashboard Renders** → Shows:
   - Welcome message
   - Overall stats cards
   - Streak tracker
   - **Recommended Topics Section** (NEW)
   - Quick action buttons
   - Recent activity & CBT history
4. **User Clicks Topic** → Navigates to Learn screen with pre-selected subject/topic
5. **Learn & Practice** → Performance data is recorded
6. **Next Login** → Dashboard shows updated recommendations based on new performance

## Database Schema

### Key Tables:
- `user_profiles`: Stores department and profile completion status
- `user_subjects`: Stores registered subjects with position (1-4)
- `user_stats`: Stores accuracy and attempts per subject-topic combination
- `practice_attempts`: Stores individual question attempts with results

### Query Optimization:
- Department and subjects are fetched once at dashboard load
- Accuracy calculations use `SUM(CASE WHEN...)` for efficiency
- Weak topics are sorted by accuracy in single query
- New users get foundational topics from single distinct query

## Features

✅ **Department-Aware Recommendations**
- System knows which subjects are relevant to each department
- Only recommends topics from user's registered subjects

✅ **Performance-Based Prioritization**
- Weakest topics (lowest accuracy) are recommended first
- Users focus on areas that need most improvement

✅ **New User Support**
- If user has no practice history, system recommends foundational topics
- Smooth onboarding experience

✅ **Visual Hierarchy**
- Numbered cards (1, 2, 3) show priority
- Color-coded accuracy indicators
- Clear call-to-action buttons

✅ **One-Click Navigation**
- Click topic card → Directly to Learn screen
- "Start Learning" button for quick access

## Testing

To test the recommendation system:

1. **Create a test user** and complete profile:
   - Select department (e.g., Science)
   - Choose 4 subjects (e.g., Chemistry, Biology, Physics, English)

2. **Practice some questions** in different topics

3. **Log in to dashboard** → Check "Recommended Topics" section
   - Should show topics from registered subjects only
   - Weakest topics should appear first
   - Accuracy percentages should match practice history

4. **Test with new user**:
   - Complete profile but don't practice any questions
   - Dashboard should show foundational topics from registered subjects

## Future Enhancements

- [ ] AI-powered learning paths based on weak topics
- [ ] Estimated time to mastery calculation
- [ ] Adaptive difficulty progression
- [ ] Topic prerequisites checking
- [ ] Performance improvement rate tracking
- [ ] Personalized study schedule recommendations
