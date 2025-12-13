"""
Pydantic schemas for admin API endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

# ============================================================================
# CONTENT HIERARCHY SCHEMAS
# ============================================================================

class ContentSubjectCreate(BaseModel):
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None
    order_priority: int = 0

class ContentTopicCreate(BaseModel):
    subject_id: int
    name: str
    description: Optional[str] = None
    order_priority: int = 0

class ContentSubtopicCreate(BaseModel):
    topic_id: int
    name: str
    description: Optional[str] = None
    order_priority: int = 0

# ============================================================================
# PAST QUESTIONS SCHEMAS
# ============================================================================

class QuestionCreate(BaseModel):
    question_text: str
    subject_id: int
    topic_id: Optional[int] = None
    subtopic_id: Optional[int] = None
    year: Optional[int] = None
    exam_type: Optional[str] = "JAMB"
    difficulty: str = Field(..., description="easy, medium, or hard")
    explanation: Optional[str] = None
    image_url: Optional[str] = None
    
    # Options must be a dict with keys A, B, C, D
    options: Dict[str, str] = Field(..., example={"A": "Option A text", "B": "Option B text", "C": "Option C text", "D": "Option D text"})
    correct_answer: str = Field(..., description="Key of correct option (A, B, C, or D)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question_text": "What is the capital of France?",
                "subject_id": 1,
                "topic_id": 5,
                "year": 2023,
                "difficulty": "easy",
                "explanation": "Paris is the capital city of France.",
                "options": {
                    "A": "London",
                    "B": "Paris",
                    "C": "Berlin",
                    "D": "Madrid"
                },
                "correct_answer": "B"
            }
        }

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    difficulty: Optional[str] = None
    explanation: Optional[str] = None
    options: Optional[Dict[str, str]] = None
    correct_answer: Optional[str] = None

class QuestionResponse(BaseModel):
    id: int
    question_text: str
    subject_id: int
    topic_id: Optional[int]
    subtopic_id: Optional[int]
    year: Optional[int]
    exam_type: str
    difficulty: str
    explanation: Optional[str]
    is_verified: bool
    options: Dict[str, str]
    correct_answer: str

# ============================================================================
# LEARNING MATERIALS SCHEMAS
# ============================================================================

class LearningVideoCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    subtopic_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    url: str
    platform: str = Field(..., description="youtube, vimeo, gdrive, or custom")
    duration_seconds: Optional[int] = None
    thumbnail_url: Optional[str] = None

class LearningVideoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    url: str
    platform: str
    duration_seconds: Optional[int]
    is_verified: bool

class LearningNoteCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    subtopic_id: Optional[int] = None
    title: str
    content: str
    format: str = Field(default="markdown", description="markdown, html, or plain")

class LearningNoteResponse(BaseModel):
    id: int
    title: str
    content: str
    format: str
    is_verified: bool

class RecommendedReadingCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    subtopic_id: Optional[int] = None
    title: str
    author: Optional[str] = None
    source_url: Optional[str] = None
    isbn: Optional[str] = None
    description: Optional[str] = None

# ============================================================================
# BULK UPLOAD SCHEMAS
# ============================================================================

class BulkUploadResponse(BaseModel):
    upload_id: int
    total_records: int
    successful: int
    failed: int
    message: str

class BulkUploadStatus(BaseModel):
    id: int
    status: str
    total_records: int
    successful_records: int
    failed_records: int
    error_log: Optional[list] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

# ============================================================================
# ADMIN STATISTICS SCHEMAS
# ============================================================================

class ContentStats(BaseModel):
    total_questions: int
    verified_questions: int
    total_videos: int
    total_notes: int
    by_subject: Dict[str, int]

class PendingContent(BaseModel):
    id: int
    text: str
    type: str
    created_at: datetime
    created_by: str
