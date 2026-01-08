"""
Generic Subject Question Tagging System
Auto-tags questions for subjects without topic data using keyword extraction
"""

import psycopg2
from psycopg2.extras import DictCursor
import re
from collections import defaultdict
from typing import Dict, List, Tuple

DB_CONFIG = {
    'dbname': 'ExamgeniusDB',
    'user': 'postgres',
    'password': 'Policewomen@007',
    'host': 'localhost',
    'port': 5432
}

# Topic mappings by subject (topic -> list of keywords)
SUBJECT_TOPICS = {
    'Art': {
        'Art History & Movements': ['gothic', 'renaissance', 'baroque', 'impressionism', 'cubism', 'artist', 'period', 'movement'],
        'Drawing & Painting': ['color', 'brush', 'stroke', 'technique', 'canvas', 'paint', 'drawing'],
        'Sculpture & Design': ['sculpture', 'relief', 'carving', 'design', 'form', 'composition'],
    },
    'Commerce': {
        'Business Basics': ['business', 'trade', 'commerce', 'market', 'supply', 'demand', 'profit'],
        'Accounting & Finance': ['accounting', 'finance', 'balance', 'ledger', 'credit', 'debit', 'capital'],
        'Economics & Management': ['economics', 'management', 'cost', 'price', 'production', 'value'],
        'Insurance & Banking': ['insurance', 'bank', 'loan', 'premium', 'interest', 'investment'],
    },
    'French': {
        'Grammar & Vocabulary': ['verb', 'noun', 'grammar', 'conjugate', 'tense', 'article'],
        'Reading & Writing': ['read', 'text', 'write', 'essay', 'letter', 'comprehension'],
        'Culture & Literature': ['france', 'french', 'culture', 'literature', 'author'],
    },
    'Geography': {
        'Maps & Location': ['map', 'location', 'coordinate', 'latitude', 'longitude', 'direction'],
        'Physical Geography': ['mountain', 'river', 'ocean', 'climate', 'terrain', 'forest'],
        'Human & Society': ['population', 'city', 'country', 'economy', 'trade', 'settlement'],
    },
    'Hausa': {
        'Vocabulary': ['word', 'phrase', 'meaning', 'expression', 'conversation'],
        'Grammar': ['grammar', 'sentence', 'structure', 'verb', 'noun', 'tense'],
        'Communication': ['communication', 'dialogue', 'writing', 'translate'],
    },
    'History': {
        'Ancient History': ['ancient', 'egypt', 'rome', 'greece', 'civilization', 'empire'],
        'Medieval Period': ['medieval', 'kingdom', 'feudal', 'monarch', 'castle'],
        'Modern History': ['modern', 'revolution', 'industrial', 'world war', 'contemporary'],
        'African History': ['africa', 'african', 'colonial', 'independence', 'tradition'],
    },
    'Igbo': {
        'Language & Vocabulary': ['word', 'vocabulary', 'language', 'igbo', 'phrase'],
        'Grammar': ['grammar', 'sentence', 'structure', 'verb', 'noun'],
        'Culture & Tradition': ['tradition', 'culture', 'folklore', 'proverb', 'story'],
    },
    'Music': {
        'Theory & Notation': ['note', 'scale', 'chord', 'rhythm', 'melody', 'harmony'],
        'Instruments': ['instrument', 'piano', 'guitar', 'violin', 'drum', 'orchestra'],
        'History & Styles': ['classical', 'jazz', 'rock', 'genre', 'composer', 'style'],
    },
}


class GenericSubjectTagger:
    """Tags questions for subjects without topic data"""
    
    def __init__(self):
        self.conn = None
        
    def connect_db(self):
        """Connect to database"""
        self.conn = psycopg2.connect(**DB_CONFIG)
        print("✓ Connected to database")
        
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s]', ' ', text)
        return text.lower().strip()
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        cleaned = self.preprocess_text(text)
        words = cleaned.split()
        
        stopwords = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'have',
            'has', 'had', 'do', 'does', 'did', 'can', 'could', 'will', 'would',
            'which', 'what', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
        }
        
        filtered = [w for w in words if len(w) > 2 and w not in stopwords]
        return filtered
    
    def predict_topic_for_question(self, question_text: str, subject: str) -> Tuple[str, str]:
        """Predict topic for a question"""
        if subject not in SUBJECT_TOPICS:
            return 'General', 'General Knowledge'
        
        keywords = self.extract_keywords(question_text)
        topics_dict = SUBJECT_TOPICS[subject]
        
        best_topic = None
        best_score = 0
        
        # Score each topic
        for topic, topic_keywords in topics_dict.items():
            score = sum(1 for kw in keywords if any(tk in kw or kw in tk for tk in topic_keywords))
            if score > best_score:
                best_score = score
                best_topic = topic
        
        # Fallback to first topic
        if not best_topic:
            best_topic = list(topics_dict.keys())[0]
        
        return best_topic, best_topic
    
    def tag_subject(self, subject: str) -> Dict:
        """Tag all questions in a subject"""
        cursor = self.conn.cursor(cursor_factory=DictCursor)
        
        # Get questions with empty topics
        cursor.execute("""
            SELECT id, question FROM questions
            WHERE subject = %s AND (topic IS NULL OR topic = '')
            ORDER BY id
        """, (subject,))
        
        questions = cursor.fetchall()
        print(f"\nTagging {subject}: {len(questions)} questions")
        
        stats = {
            'total': len(questions),
            'tagged': 0,
            'topics': defaultdict(int)
        }
        
        for i, q in enumerate(questions, 1):
            topic, subtopic = self.predict_topic_for_question(q['question'], subject)
            
            cursor.execute("""
                UPDATE questions
                SET topic = %s, subtopic = %s
                WHERE id = %s
            """, (topic, subtopic, q['id']))
            
            stats['tagged'] += 1
            stats['topics'][topic] += 1
            
            if (i % 200) == 0:
                print(f"  Processed {i}/{len(questions)}...")
        
        self.conn.commit()
        return stats
    
    def tag_all_subjects(self):
        """Tag all subjects with empty topics"""
        subjects_to_tag = list(SUBJECT_TOPICS.keys())
        
        print("=" * 70)
        print("GENERIC SUBJECT QUESTION TAGGING")
        print("=" * 70)
        
        overall_stats = {}
        
        for subject in subjects_to_tag:
            stats = self.tag_subject(subject)
            overall_stats[subject] = stats
            
            print(f"  Summary: {stats['tagged']}/{stats['total']} questions tagged")
            for topic, count in sorted(stats['topics'].items(), key=lambda x: x[1], reverse=True):
                print(f"    - {topic}: {count}")
        
        print("\n" + "=" * 70)
        print("TAGGING COMPLETE")
        print("=" * 70)
        total_tagged = sum(s['tagged'] for s in overall_stats.values())
        print(f"Total questions tagged: {total_tagged}")
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            print("\n✓ Database closed")


def main():
    tagger = GenericSubjectTagger()
    
    try:
        tagger.connect_db()
        tagger.tag_all_subjects()
        print("\n✅ All subjects tagged successfully!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        tagger.close()


if __name__ == "__main__":
    main()
