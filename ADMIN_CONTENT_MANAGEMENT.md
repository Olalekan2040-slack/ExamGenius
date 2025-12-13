# Admin Content Management System Documentation

## Overview

The Admin Content Management System is a comprehensive platform for managing JAMB exam preparation content, including past questions, learning materials (videos, notes), and student progress. It enables admins to curate, verify, and organize educational content while maintaining AI-ready data structures for intelligent tutoring.

## Architecture

### Database Schema

#### Core Hierarchy Tables
- **content_subjects**: Subject categories (Biology, Chemistry, etc.)
- **content_topics**: Topics within each subject
- **content_subtopics**: Detailed subtopics for specific learning units

#### Content Tables
- **past_questions**: Individual exam questions with metadata
- **question_options**: Multiple-choice options for each question
- **learning_videos**: Video resources organized by subject/topic
- **learning_notes**: Study notes and detailed explanations
- **recommended_readings**: References and textbooks

#### Admin & Operations
- **bulk_uploads**: Tracks CSV/JSON import operations
- **registration_requests**: Student signup requests pending admin review
- **content_performance**: Analytics on content engagement and effectiveness
- **users (modified)**: Added `role` field (student/admin/moderator)

### API Endpoints

#### Content Management

**Questions**
```
POST   /api/v1/admin/questions              - Create single question
GET    /api/v1/admin/questions/{id}         - Get question details
PUT    /api/v1/admin/questions/{id}         - Update question
POST   /api/v1/admin/questions/bulk-upload  - Upload questions via CSV
```

**Videos**
```
POST   /api/v1/admin/videos                 - Create video entry
PUT    /api/v1/admin/videos/{id}            - Update video
```

**Learning Materials**
```
POST   /api/v1/admin/notes                  - Create study notes
POST   /api/v1/admin/readings               - Add recommended reading
```

#### Content Hierarchy
```
POST   /api/v1/admin/subjects               - Create subject
GET    /api/v1/admin/subjects               - List all subjects
POST   /api/v1/admin/topics                 - Create topic
```

#### Verification & Approval
```
GET    /api/v1/admin/pending-verification   - Get unverified content
POST   /api/v1/admin/verify/{type}/{id}    - Approve content
POST   /api/v1/admin/reject/{type}/{id}    - Reject with reason
```

#### Statistics
```
GET    /api/v1/admin/stats/content         - Content statistics
GET    /api/v1/admin/stats/usage           - User engagement metrics
```

### AI Content Query Service

**Purpose**: Enable AI services to retrieve relevant learning context

```python
from app.services.ai_content import ai_content_service

# Get comprehensive context for AI tutoring
context = ai_content_service.get_content_context(
    db=db,
    subject_id=1,
    topic_id=5,
    difficulty="medium",
    limit=10
)
# Returns: {
#   "questions": [...],
#   "videos": [...],
#   "notes": [...],
#   "readings": [...]
# }

# Get topic-specific questions
questions = ai_content_service.get_topic_questions(
    db=db,
    subject_id=1,
    topic_id=5,
    difficulty="hard"
)

# Log user interactions for analytics
ai_content_service.log_content_interaction(
    db=db,
    user_id=user_id,
    content_type="question",
    content_id=123,
    interaction_type="practice",
    time_spent_seconds=300,
    rating=4
)
```

**API Endpoint for AI**:
```
GET /api/v1/learn/ai/content?subject_id=1&topic_id=5&difficulty=medium
```

Returns:
```json
{
  "query_params": {...},
  "results": {
    "questions": [...],
    "videos": [...],
    "notes": [...],
    "readings": [...]
  },
  "total_questions": 15,
  "total_videos": 8,
  "total_notes": 5,
  "total_readings": 3
}
```

## Frontend Admin Dashboard

### Access & Security

- Only users with `role` = 'admin' or 'moderator' can access
- Protected by JWT token verification
- Role-based view filtering

### Sections

#### 1. Dashboard
- Content statistics (total questions, videos, notes, subjects)
- Questions per subject breakdown
- Quick action buttons

#### 2. Question Management
- Create individual questions with options
- Set difficulty level (easy/medium/hard)
- Add year and explanation
- Mark correct answer

#### 3. Video Management
- Add learning videos from Google Drive, YouTube, Vimeo
- Organize by subject/topic
- Track video duration and metadata

#### 4. Learning Notes
- Create markdown/HTML study notes
- Organize by subject/topic/subtopic
- Support for formatted content

#### 5. Subject & Topic Hierarchy
- Define subject categories
- Create topics within subjects
- Manage subtopic organization

#### 6. Bulk Upload
- CSV import for questions (10+ questions at once)
- CSV import for videos and notes
- Download CSV template for standardization
- Progress tracking and error reporting
- Rollback on validation failure

#### 7. Pending Approval
- Review unverified content
- Approve/reject with reasons
- Filter by content type (questions/videos/notes)
- Audit trail of approvals

#### 8. Analytics
- Content performance metrics
- User engagement statistics
- Topic popularity
- Learning progress trends

## CSV Upload Format

### Questions CSV Template

```
question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id
"What is photosynthesis?","A process of decay","Process of making food","Storage of energy","None","B","Photosynthesis is the process by which plants make their own food using sunlight.",2023,"medium",5
```

**Required Columns**:
- `question` - Question text
- `option_a, option_b, option_c, option_d` - Answer choices
- `correct_answer` - Which option is correct (A/B/C/D)
- `difficulty` - easy/medium/hard
- `year` - Exam year

**Optional Columns**:
- `explanation` - Why this answer is correct
- `topic_id` - Topic classification
- `image_url` - Image for the question
- `diagram_url` - Diagram for the question

### Videos CSV Template

```
title,description,url,platform,duration_seconds,subject_id,topic_id
"Photosynthesis Explained","Animation of photosynthesis process","https://drive.google.com/file/d/...",gdrive,600,1,5
```

### Notes CSV Template

```
title,content,format,subject_id,topic_id
"Photosynthesis Notes","# Main Points\n- Plants make food\n- Uses sunlight",markdown,1,5
```

## Admin Workflow

### Adding Content Step-by-Step

1. **Create Hierarchy (if new)**
   - Navigate to "Subjects & Topics"
   - Create subject (e.g., "Biology")
   - Create topics under subject (e.g., "Cell Biology")

2. **Add Content**
   - **Single Item**: Use form in Questions/Videos/Notes tab
   - **Bulk Items**: Use "Bulk Upload" with CSV file

3. **Verification**
   - Navigate to "Pending Approval"
   - Review content details
   - Click "Approve" or "Reject"

4. **Monitor**
   - Check "Dashboard" for content stats
   - Review analytics for performance metrics

## Security & Access Control

### Role-Based Access

- **Student**: Can view and practice with verified content only
- **Admin**: Full access to all management functions
- **Moderator**: Can approve/reject content but not create

### Content Verification

- All user-submitted content marked as unverified by default
- Admin must explicitly approve before students see it
- Approved content flagged with `is_verified = 1`

### Audit Trail

- All changes logged with timestamp and admin user ID
- Track created_by, updated_by, verified_by
- Support for rollback of bulk imports if errors detected

## Integration with AI Services

### How AI Uses Content

1. **Lesson Generation**
   - AI queries topics to understand what's already covered
   - Uses verified questions as context
   - Generates complementary explanations

2. **Tutoring Mode**
   - Student asks a question about a topic
   - AI retrieves related questions, notes, videos from database
   - Provides contextual, accurate answers

3. **Adaptive Learning**
   - AI tracks student performance by topic
   - Suggests relevant videos/notes based on weak areas
   - Recommends practice questions at appropriate difficulty

### Content Quality Impact on AI

- **Better curated content** → More accurate AI responses
- **Complete topic coverage** → AI can generate comprehensive lessons
- **Difficulty hierarchy** → AI can adjust challenge level
- **Explanations** → AI can learn from expert explanations and replicate quality

## Best Practices for Admins

### Content Quality

1. **Ensure accuracy**
   - Verify all questions have correct answers
   - Check explanations are pedagogically sound
   - Review calculations and scientific correctness

2. **Maintain consistency**
   - Use standard formatting across notes
   - Keep explanations at appropriate level
   - Ensure option descriptions are balanced

3. **Organization**
   - Properly classify by subject/topic/subtopic
   - Use clear, descriptive titles
   - Tag difficulty appropriately (based on JAMB standards)

4. **Completeness**
   - Provide explanations for all questions
   - Link related video/note resources
   - Include past years for each topic

### Bulk Upload Tips

1. **Validation**
   - Test CSV with 5-10 rows first
   - Verify column names match exactly
   - Check for special characters that break import

2. **Error Handling**
   - Check error log after upload
   - Fix and re-upload only failed rows
   - Don't duplicate if unsure - check stats first

3. **Organization**
   - Import by subject/year for easy tracking
   - Use consistent difficulty ratings
   - Pre-verify topic_ids exist in system

## Troubleshooting

### Bulk Upload Fails

**Issue**: CSV upload shows 0 successful, all failed
- Check column names match exactly (case-sensitive)
- Verify CSV format is UTF-8
- Ensure no extra whitespace in data
- Check that subject_id/topic_id values exist

**Issue**: Some rows succeed, some fail
- Review error log for specific row issues
- Common: Missing required columns, invalid data types
- Fix data and re-import only the failed rows

### Content Not Appearing to Students

**Issue**: Uploaded content doesn't show in student view
- Check if content is `is_verified = 1`
- Navigate to "Pending Approval" and approve it
- Verify subject/topic hierarchy exists
- Check user role permissions

### AI Getting Wrong Answers

**Issue**: AI suggestions or explanations are inaccurate
- Review question explanations for accuracy
- Ensure correct_answer field is accurate
- Check if conflicting information in notes
- Add more detailed explanation text

## Performance Optimization

### Database Indexes

The system automatically creates indexes on:
- past_questions(subject_id, topic_id, subtopic_id)
- learning_videos(subject_id, topic_id, subtopic_id)
- learning_notes(subject_id, topic_id, subtopic_id)

### Recommended Content Targets

- **Minimum for launch**: 50 questions per subject
- **Optimal coverage**: 5+ questions per topic
- **Recommended videos**: 2-3 per topic
- **Study notes**: 1-2 comprehensive notes per topic

## Future Enhancements

1. **Advanced Analytics**
   - Student performance heatmaps by topic
   - Content effectiveness scoring
   - Difficulty validation against student performance

2. **AI Content Analysis**
   - Auto-detect and flag incorrect answers
   - Suggest better explanations using AI
   - Identify knowledge gaps in coverage

3. **Collaborative Editing**
   - Multiple admins editing same content
   - Version control and rollback
   - Approval workflow with comments

4. **Content Templates**
   - Question templates for consistency
   - Auto-generation of variations
   - Multi-language support

## Support & Questions

For issues or questions about the admin system:
1. Check this documentation
2. Review error messages in "Pending Approval"
3. Check "Analytics" for troubleshooting insights
4. Contact platform administrator
