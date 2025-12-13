# Admin & AI Content Management API Reference

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All admin endpoints require JWT Bearer token:
```
Authorization: Bearer {access_token}
```

## Content Hierarchy Management

### Create Subject
```
POST /admin/subjects
Content-Type: application/json

{
  "name": "Biology",
  "icon": "🧬",
  "description": "Study of living organisms",
  "order_priority": 1
}

Response:
{
  "id": 1,
  "name": "Biology",
  "message": "Subject created successfully"
}
```

### List Subjects
```
GET /admin/subjects

Response:
[
  {
    "id": 1,
    "name": "Biology",
    "icon": "🧬",
    "description": "Study of living organisms",
    "order_priority": 1
  },
  ...
]
```

### Create Topic
```
POST /admin/topics
Content-Type: application/json

{
  "subject_id": 1,
  "name": "Cell Structure and Organization",
  "description": "Understanding cell components",
  "order_priority": 1
}

Response:
{
  "id": 5,
  "name": "Cell Structure and Organization",
  "message": "Topic created successfully"
}
```

## Question Management

### Create Single Question
```
POST /admin/questions
Content-Type: application/json

{
  "question_text": "What is the basic unit of life?",
  "subject_id": 1,
  "topic_id": 5,
  "subtopic_id": null,
  "year": 2023,
  "exam_type": "JAMB",
  "difficulty": "easy",
  "explanation": "The cell is the basic unit of life. All living organisms are composed of cells.",
  "image_url": null,
  "options": {
    "A": "Tissue",
    "B": "Cell",
    "C": "Organ",
    "D": "Organelle"
  },
  "correct_answer": "B"
}

Response:
{
  "id": 123,
  "message": "Question created successfully"
}
```

### Get Question Details
```
GET /admin/questions/123

Response:
{
  "id": 123,
  "question_text": "What is the basic unit of life?",
  "subject_id": 1,
  "topic_id": 5,
  "subtopic_id": null,
  "year": 2023,
  "exam_type": "JAMB",
  "difficulty": "easy",
  "explanation": "The cell is the basic unit of life...",
  "is_verified": false,
  "options": {
    "A": "Tissue",
    "B": "Cell",
    "C": "Organ",
    "D": "Organelle"
  },
  "correct_answer": "B"
}
```

### Update Question
```
PUT /admin/questions/123
Content-Type: application/json

{
  "question_text": "What is the basic unit of life? (Updated)",
  "difficulty": "medium",
  "explanation": "Updated explanation...",
  "options": {
    "A": "Tissue",
    "B": "Cell",
    "C": "Organ",
    "D": "Organelle"
  },
  "correct_answer": "B"
}

Response:
{
  "message": "Question updated successfully"
}
```

### Bulk Upload Questions
```
POST /admin/questions/bulk-upload
Content-Type: multipart/form-data

Parameters:
- file: (CSV file)
- subject_id: 1

CSV Format:
question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id
"What is photosynthesis?","Breakdown of food","Making of food","Storage of energy","Consumption","B","Photosynthesis is the process by which plants make their own food.",2023,"medium",6

Response:
{
  "upload_id": 45,
  "total_records": 50,
  "successful": 49,
  "failed": 1,
  "message": "Uploaded 49 questions successfully"
}
```

## Learning Materials Management

### Create Video
```
POST /admin/videos
Content-Type: application/json

{
  "subject_id": 1,
  "topic_id": 5,
  "subtopic_id": null,
  "title": "Cell Structure Explained",
  "description": "A comprehensive video on cell components",
  "url": "https://drive.google.com/file/d/1a2b3c4d/view",
  "platform": "gdrive",
  "duration_seconds": 1200,
  "thumbnail_url": null
}

Response:
{
  "id": 78,
  "title": "Cell Structure Explained",
  "message": "Video created successfully"
}
```

### Create Learning Notes
```
POST /admin/notes
Content-Type: application/json

{
  "subject_id": 1,
  "topic_id": 5,
  "subtopic_id": null,
  "title": "Cell Structure Notes",
  "content": "# Cell Structure\n\n## Components\n- Nucleus: Controls cell activities\n- Mitochondria: Powerhouse of the cell\n- Chloroplast: Photosynthesis in plants",
  "format": "markdown"
}

Response:
{
  "id": 34,
  "title": "Cell Structure Notes",
  "message": "Note created successfully"
}
```

### Create Recommended Reading
```
POST /admin/readings
Content-Type: application/json

{
  "subject_id": 1,
  "topic_id": 5,
  "title": "Essential Biology",
  "author": "Dr. Smith",
  "source_url": "https://example.com/biology",
  "isbn": "978-0-123456-78-9",
  "description": "Comprehensive biology textbook"
}

Response:
{
  "id": 12,
  "title": "Essential Biology",
  "message": "Reading added successfully"
}
```

## Content Verification & Approval

### Get Pending Content
```
GET /admin/pending-verification?content_type=questions

Parameters:
- content_type: questions|videos|notes

Response:
[
  {
    "id": 123,
    "text": "What is the basic unit of life?",
    "year": 2023,
    "difficulty": "easy",
    "verified": false
  },
  ...
]
```

### Verify Content
```
POST /admin/verify/questions/123

Response:
{
  "message": "questions verified successfully"
}
```

### Reject Content
```
POST /admin/reject/questions/123
Content-Type: application/json

{
  "reason": "Incorrect explanation provided"
}

Response:
{
  "message": "Content rejected"
}
```

## Statistics & Analytics

### Get Content Statistics
```
GET /admin/stats/content

Response:
{
  "total_questions": 1234,
  "verified_questions": 1200,
  "total_videos": 45,
  "total_notes": 28,
  "by_subject": {
    "Biology": 245,
    "Chemistry": 198,
    "Physics": 215,
    ...
  }
}
```

## AI Content Query Endpoint

### Get Content Context for AI
```
GET /learn/ai/content?subject_id=1&topic_id=5&difficulty=medium&limit=10&content_types=all

Parameters:
- subject_id: (optional) Subject ID
- topic_id: (optional) Topic ID
- subtopic_id: (optional) Subtopic ID
- difficulty: (optional) easy|medium|hard
- limit: (optional, default 5, max 20)
- content_types: (optional, default all) questions|videos|notes|readings or comma-separated

Response:
{
  "query_params": {
    "subject_id": 1,
    "topic_id": 5,
    "difficulty": "medium"
  },
  "results": {
    "questions": [
      {
        "id": 123,
        "question": "What is photosynthesis?",
        "explanation": "Process by which plants make food...",
        "difficulty": "medium",
        "options": {
          "A": "Option A",
          "B": "Option B",
          ...
        }
      },
      ...
    ],
    "videos": [
      {
        "id": 45,
        "title": "Photosynthesis Explained",
        "description": "...",
        "url": "https://...",
        "platform": "gdrive",
        "duration_minutes": 10
      },
      ...
    ],
    "notes": [
      {
        "id": 12,
        "title": "Photosynthesis Notes",
        "content": "# Main points\n...",
        "format": "markdown"
      },
      ...
    ],
    "readings": [
      {
        "id": 5,
        "title": "Advanced Biology",
        "author": "Dr. Smith",
        "isbn": "978-..."
      },
      ...
    ]
  },
  "total_questions": 15,
  "total_videos": 3,
  "total_notes": 2,
  "total_readings": 1
}
```

## Error Responses

All endpoints follow standard error format:

```json
{
  "detail": "Error description"
}
```

### Common Error Codes

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Admin access required (non-admin user)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Request/Response Examples

### Example: Complete Workflow

1. Create Subject
```bash
curl -X POST http://localhost:8000/api/v1/admin/subjects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Biology",
    "icon": "🧬"
  }'
```

2. Create Topic
```bash
curl -X POST http://localhost:8000/api/v1/admin/topics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject_id": 1,
    "name": "Cell Biology"
  }'
```

3. Add Question
```bash
curl -X POST http://localhost:8000/api/v1/admin/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "What is a cell?",
    "subject_id": 1,
    "topic_id": 5,
    "difficulty": "easy",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correct_answer": "B"
  }'
```

4. Approve Content
```bash
curl -X POST http://localhost:8000/api/v1/admin/verify/questions/123 \
  -H "Authorization: Bearer $TOKEN"
```

5. Query for AI
```bash
curl http://localhost:8000/api/v1/learn/ai/content?subject_id=1&topic_id=5 \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limiting
Currently not implemented. Plan to add rate limiting in future versions.

## Pagination
For endpoints returning lists, use standard query parameters (when implemented):
- `skip`: Offset (default 0)
- `limit`: Items per page (default 10, max 100)

## Versioning
API v1 is current. Breaking changes will result in v2 endpoints.
