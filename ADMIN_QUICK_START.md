# Admin System Quick Start Guide

Get the admin content management system up and running in minutes.

## Installation (5 minutes)

### 1. Run Database Migration

```bash
cd examgenius
python scripts/migrate_admin_content.py
```

Output should show:
```
✓ content_subjects table ready
✓ content_topics table ready
✓ past_questions table ready
✓ question_options table ready
✓ learning_videos table ready
✓ learning_notes table ready
✓ bulk_uploads table ready
✓ Created performance indexes

✅ Admin Content Management Migration Complete!
```

### 2. Run Setup Script

```bash
python scripts/setup_admin_system.py admin@example.com yourpassword123
```

This will:
- ✅ Create admin user account
- ✅ Create 9 default subjects (Biology, Chemistry, Physics, etc.)
- ✅ Create ~45 default topics
- ✅ Verify everything is set up correctly

Output should end with:
```
✅ Admin system ready!
🎉 EXAMGENIUS ADMIN SYSTEM READY!
```

### 3. Verify API is Running

```bash
curl http://localhost:8000/api/v1/admin/subjects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return list of subjects.

---

## First Login & Testing

### 1. Access Admin Dashboard
- Go to: `http://localhost:8000/admin`
- Log in with your admin credentials
- You should see the Dashboard with stats

### 2. Create Your First Question

**Via Dashboard (Easiest)**
1. Click "Questions" in sidebar
2. Fill in the form:
   - Subject: Biology
   - Topic: Cell Structure and Organization
   - Question: "What is the basic unit of life?"
   - Options: A=Tissue, B=Cell, C=Organ, D=Organelle
   - Correct: B
   - Difficulty: Easy
3. Click "Create Question"

**Via API (For Automation)**
```bash
curl -X POST http://localhost:8000/api/v1/admin/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "What is the basic unit of life?",
    "subject_id": 1,
    "topic_id": 1,
    "difficulty": "easy",
    "explanation": "The cell is the basic unit of life.",
    "options": {
      "A": "Tissue",
      "B": "Cell",
      "C": "Organ",
      "D": "Organelle"
    },
    "correct_answer": "B"
  }'
```

### 3. Approve Your Question

1. Click "Pending Approval" in sidebar
2. Select "Questions" tab
3. See your question in the list
4. Click "✅ Approve"
5. Question is now visible to students!

---

## Common Tasks

### Add Multiple Questions (Bulk Upload)

1. **Create CSV File** (`questions.csv`):
```csv
question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id
"What is photosynthesis?","Breakdown","Making food","Storage","Consumption","B","Process plants use to make food",2023,"easy",2
"What is the mitochondria?","Nucleus","Powerhouse","Chloroplast","Ribosome","B","It's the powerhouse of the cell",2023,"medium",1
```

2. **Upload via Dashboard**:
   - Click "Bulk Upload"
   - Select subject: "Biology"
   - Choose your CSV file
   - Click "Upload"
   - View results and approve

### Add Learning Video

1. Click "Videos" tab
2. Fill in:
   - Subject: Biology
   - Topic: Cell Structure
   - Title: "Cells Explained"
   - URL: `https://drive.google.com/file/d/FILEID/view`
   - Platform: Google Drive
   - Duration: 900 (seconds)
3. Click "Add Video"
4. Approve in "Pending Approval"

### Create Study Notes

1. Click "Learning Notes"
2. Fill in:
   - Subject: Biology
   - Topic: Cell Structure
   - Title: "Cell Components"
   - Content: (Markdown-formatted notes)
   - Format: markdown
3. Click "Create Note"

### Create New Subject

1. Click "Subjects & Topics"
2. Under "Create Subject":
   - Name: "Economics"
   - Icon: "💰"
   - Description: "Study of economics"
3. Click "Add Subject"

---

## Monitor & Analytics

### View Dashboard Statistics

1. Click "Dashboard" in sidebar
2. See:
   - Total Questions
   - Total Videos
   - Total Notes
   - Questions by Subject

### Check What's Pending

1. Click "Pending Approval"
2. See all unverified content
3. Review and approve/reject

### View Analytics

1. Click "Analytics"
2. Coming soon: Detailed insights

---

## API Examples

### Query Content for AI

Get all Biology questions about cells:
```bash
curl "http://localhost:8000/api/v1/learn/ai/content?subject_id=1&topic_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

Response includes:
- Questions with explanations
- Related videos
- Study notes
- Recommended readings

### Get Question Details

```bash
curl http://localhost:8000/api/v1/admin/questions/123 \
  -H "Authorization: Bearer $TOKEN"
```

### Approve Content

```bash
curl -X POST http://localhost:8000/api/v1/admin/verify/questions/123 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

### "Admin access required" Error
- Check user role: `SELECT role FROM users WHERE email='...';`
- Update role: `UPDATE users SET role='admin' WHERE email='...';`
- Log out and back in

### CSV Upload Fails
- Download template from dashboard
- Check column names exactly match
- Ensure no empty required columns
- Try with 2-3 rows first to test

### Content Not Showing to Students
- Check in "Pending Approval" if unverified
- Click "Approve" if pending
- Verify subject_id and topic_id exist
- Check topic_videos table if adding videos

### Get Better Error Messages
- Check browser console for API errors
- Check admin.js console.log() output
- Review network tab in DevTools

---

## CSV Template Downloads

Download from Dashboard → Bulk Upload section, or create manually:

### Questions Template
```csv
question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id
"Sample question 1","A1","B1","C1","D1","A","Explanation 1",2023,"easy",1
"Sample question 2","A2","B2","C2","D2","B","Explanation 2",2023,"medium",2
```

### Videos Template
```csv
title,description,url,platform,duration_seconds,subject_id,topic_id
"Video Title","Description text","https://drive.google.com/file/d/.../view",gdrive,600,1,1
```

### Notes Template
```csv
title,content,format,subject_id,topic_id
"Note Title","# Header\nContent here",markdown,1,1
```

---

## Best Practices

### Content Quality
✅ Always provide detailed explanations
✅ Verify answers before uploading
✅ Use proper formatting in notes
✅ Include relevant videos and readings

### Organization
✅ Classify by subject/topic/subtopic
✅ Set difficulty accurately (JAMB standards)
✅ Tag by year for historical context
✅ Use consistent naming conventions

### Bulk Uploads
✅ Test with small batches first
✅ Check error logs for issues
✅ Don't duplicate if already uploaded
✅ Keep backup of original CSV

---

## Support

For detailed documentation:
- **Complete Guide**: See `ADMIN_CONTENT_MANAGEMENT.md`
- **API Reference**: See `ADMIN_API_REFERENCE.md`
- **Implementation Details**: See `ADMIN_IMPLEMENTATION_COMPLETE.md`

For help:
1. Check documentation first
2. Review error messages in browser console
3. Test with API examples provided
4. Check database directly if needed

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/api/v1/endpoints/admin.py` | Admin API endpoints |
| `app/services/ai_content.py` | AI content query service |
| `frontend/js/screens/admin.js` | Admin dashboard UI |
| `frontend/css/admin.css` | Admin dashboard styling |
| `scripts/migrate_admin_content.py` | Database setup |
| `scripts/setup_admin_system.py` | Initial configuration |

---

## What's Next?

After setup:
1. ✅ Add your first 10-20 questions
2. ✅ Review and approve them
3. ✅ Add 2-3 related videos
4. ✅ Create summary study notes
5. ✅ Test that students can see approved content
6. ✅ Verify AI can query the content
7. ✅ Bulk upload remaining questions
8. ✅ Set up regular content review process

---

**You're ready to go!** Start with the Dashboard and explore from there. 🚀
