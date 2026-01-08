"""
AI Content Query Service
Enables AI to retrieve relevant learning materials by subject/topic/difficulty
"""
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class AIContentService:
    """Service for AI to query and retrieve learning content for tutoring"""
    
    @staticmethod
    def get_content_context(
        db,
        subject_id: Optional[int] = None,
        topic_id: Optional[int] = None,
        subtopic_id: Optional[int] = None,
        difficulty: Optional[str] = None,
        limit: int = 5
    ) -> Dict:
        """
        Get comprehensive content context for AI tutoring
        Returns questions, explanations, videos, and notes relevant to query
        """
        context = {
            "questions": [],
            "videos": [],
            "notes": [],
            "readings": []
        }
        
        # Build dynamic WHERE clause
        where_clauses = ["is_verified = 1"]
        params = []
        
        if subject_id:
            where_clauses.append("subject_id = ?")
            params.append(subject_id)
        if topic_id:
            where_clauses.append("topic_id = ?")
            params.append(topic_id)
        if subtopic_id:
            where_clauses.append("subtopic_id = ?")
            params.append(subtopic_id)
        if difficulty:
            where_clauses.append("difficulty = ?")
            params.append(difficulty)
        
        where_sql = " AND ".join(where_clauses)
        
        # Fetch questions with explanations
        q_query = f"""
            SELECT pq.id, pq.question_text, pq.explanation, pq.difficulty,
                   string_agg(qo.option_key || ':' || qo.option_text, '|' ORDER BY qo.option_key) as options
            FROM past_questions pq
            LEFT JOIN question_options qo ON pq.id = qo.question_id
            WHERE {where_sql}
            GROUP BY pq.id
            LIMIT ?
        """
        questions = db.execute(q_query, params + [limit]).fetchall()
        context["questions"] = [
            {
                "id": q[0],
                "question": q[1],
                "explanation": q[2],
                "difficulty": q[3],
                "options": dict(opt.split(':') for opt in q[4].split('|') if q[4])
            }
            for q in questions
        ]
        
        # Fetch videos
        v_query = f"""
            SELECT id, title, description, url, platform, duration_seconds
            FROM learning_videos
            WHERE {where_sql}
            LIMIT ?
        """
        videos = db.execute(v_query, params + [limit]).fetchall()
        context["videos"] = [
            {
                "id": v[0],
                "title": v[1],
                "description": v[2],
                "url": v[3],
                "platform": v[4],
                "duration_minutes": v[5] // 60 if v[5] else None
            }
            for v in videos
        ]
        
        # Fetch notes
        n_query = f"""
            SELECT id, title, content, format
            FROM learning_notes
            WHERE {where_sql}
            LIMIT ?
        """
        notes = db.execute(n_query, params + [limit]).fetchall()
        context["notes"] = [
            {
                "id": n[0],
                "title": n[1],
                "content": n[2][:500],  # First 500 chars for context
                "format": n[3]
            }
            for n in notes
        ]
        
        # Fetch readings
        r_query = f"""
            SELECT id, title, author, source_url, isbn, description
            FROM recommended_readings
            WHERE {where_sql}
            LIMIT ?
        """
        readings = db.execute(r_query, params + [limit]).fetchall()
        context["readings"] = [
            {
                "id": r[0],
                "title": r[1],
                "author": r[2],
                "source": r[3],
                "isbn": r[4],
                "summary": r[5]
            }
            for r in readings
        ]
        
        return context
    
    @staticmethod
    def get_topic_questions(
        db,
        subject_id: int,
        topic_id: int,
        limit: int = 10,
        difficulty: Optional[str] = None
    ) -> List[Dict]:
        """Get practice questions for a specific topic"""
        where_clauses = [
            "subject_id = ?",
            "topic_id = ?",
            "is_verified = 1"
        ]
        params = [subject_id, topic_id]
        
        if difficulty:
            where_clauses.append("difficulty = ?")
            params.append(difficulty)
        
        where_sql = " AND ".join(where_clauses)
        
        query = f"""
            SELECT pq.id, pq.question_text, pq.explanation, pq.difficulty, pq.year,
                   string_agg(qo.option_key || ':' || qo.option_text, '|' ORDER BY qo.option_key) as options,
                   MAX(CASE WHEN qo.is_correct = 1 THEN qo.option_key END) as correct_answer
            FROM past_questions pq
            LEFT JOIN question_options qo ON pq.id = qo.question_id
            WHERE {where_sql}
            GROUP BY pq.id, pq.question_text, pq.explanation, pq.difficulty, pq.year
            LIMIT ?
        """
        
        questions = db.execute(query, params + [limit]).fetchall()
        return [
            {
                "id": q[0],
                "question": q[1],
                "explanation": q[2],
                "difficulty": q[3],
                "year": q[4],
                "options": dict(opt.split(':') for opt in q[5].split('|') if q[5]),
                "correct_answer": q[6]
            }
            for q in questions
        ]
    
    @staticmethod
    def get_related_videos(
        db,
        subject_id: int,
        topic_id: Optional[int] = None,
        limit: int = 5
    ) -> List[Dict]:
        """Get related video materials for a subject/topic"""
        where_clauses = ["subject_id = ?", "is_verified = 1"]
        params = [subject_id]
        
        if topic_id:
            where_clauses.append("topic_id = ?")
            params.append(topic_id)
        
        where_sql = " AND ".join(where_clauses)
        
        query = f"""
            SELECT id, title, description, url, platform, duration_seconds, thumbnail_url
            FROM learning_videos
            WHERE {where_sql}
            ORDER BY created_at DESC
            LIMIT ?
        """
        
        videos = db.execute(query, params + [limit]).fetchall()
        return [
            {
                "id": v[0],
                "title": v[1],
                "description": v[2],
                "url": v[3],
                "platform": v[4],
                "duration_minutes": v[5] // 60 if v[5] else None,
                "thumbnail": v[6]
            }
            for v in videos
        ]
    
    @staticmethod
    def log_content_interaction(
        db,
        user_id: int,
        content_type: str,
        content_id: int,
        interaction_type: str,
        time_spent_seconds: Optional[int] = None,
        rating: Optional[int] = None
    ) -> None:
        """Log user interaction with content for analytics"""
        try:
            query = """
                INSERT INTO content_performance 
                (content_type, content_id, user_id, interaction_type, time_spent_seconds, rating)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            db.execute(query, (content_type, content_id, user_id, interaction_type, time_spent_seconds, rating))
            db.commit()
        except Exception as e:
            logger.error(f"Failed to log content interaction: {e}")
            db.rollback()

# Global instance
ai_content_service = AIContentService()
