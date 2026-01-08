"""
Generic Subject Question Tagging System
Auto-tags questions for subjects without topic data using keyword extraction and clustering
"""

import psycopg2
from psycopg2.extras import DictCursor
import re
from collections import defaultdict
from typing import Dict, List, Tuple
import json

DB_CONFIG = {
    'dbname': 'ExamgeniusDB',
    'user': 'postgres',
    'password': 'Policewomen@007',
    'host': 'localhost',
    'port': 5432
}

# Subject-specific keyword groupings for fallback tagging
SUBJECT_TOPIC_KEYWORDS = {
    'Art': {
        'Art History & Movements': {
            'keywords': ['gothic', 'renaissance', 'baroque', 'impressionism', 'cubism', 'dadaism', 'art movement', 'historical period', 'artist', 'period']
        },
        'Drawing & Painting Techniques': {
            'keywords': ['color', 'brush', 'stroke', 'technique', 'medium', 'canvas', 'paint', 'charcoal', 'pastel', 'drawing']
        },
        'Sculpture & 3D Art': {
            'keywords': ['sculpture', 'relief', 'carving', 'cast', 'form', 'three-dimensional', '3d', 'statue', 'monument']
        },
        'Design & Composition': {
            'keywords': ['composition', 'balance', 'symmetry', 'perspective', 'proportion', 'layout', 'design', 'element', 'principle']
        },
    },
    'French': {
        'Vocabulary & Grammar': {
            'keywords': ['verb', 'noun', 'adjective', 'grammar', 'tense', 'conjugate', 'masculine', 'feminine', 'singular', 'plural', 'article', 'pronoun']
        },
        'Reading Comprehension': {
            'keywords': ['read', 'text', 'passage', 'comprehension', 'understand', 'meaning', 'interpret', 'excerpt']
        },
        'Writing & Expression': {
            'keywords': ['write', 'essay', 'letter', 'composition', 'express', 'communicate', 'describe', 'narrate']
        },
        'Culture & Literature': {
            'keywords': ['culture', 'french', 'france', 'custom', 'tradition', 'literature', 'poetry', 'novel', 'author']
        },
    },
    'Geography': {
        'Map Skills & Location': {
            'keywords': ['map', 'location', 'coordinate', 'latitude', 'longitude', 'direction', 'north', 'south', 'east', 'west', 'position']
        },
        'Physical Geography': {
            'keywords': ['mountain', 'river', 'ocean', 'climate', 'weather', 'terrain', 'landscape', 'geology', 'soil', 'vegetation', 'desert', 'forest']
        },
        'Human & Economic Geography': {
            'keywords': ['population', 'settlement', 'city', 'country', 'economy', 'trade', 'agriculture', 'industry', 'resource', 'culture']
        },
        'Environmental Studies': {
            'keywords': ['environment', 'conservation', 'ecosystem', 'pollution', 'climate change', 'sustainability', 'renewable', 'biodiversity']
        },
    },
    'Hausa': {
        'Vocabulary & Phrases': {
            'keywords': ['word', 'phrase', 'vocabulary', 'meaning', 'expression', 'greeting', 'conversation']
        },
        'Grammar & Structure': {
            'keywords': ['grammar', 'sentence', 'structure', 'tense', 'conjugate', 'noun', 'verb', 'adjective', 'syntax']
        },
        'Reading & Comprehension': {
            'keywords': ['read', 'text', 'comprehension', 'passage', 'understand', 'meaning']
        },
        'Writing & Communication': {
            'keywords': ['write', 'composition', 'letter', 'communication', 'express', 'translate']
        },
    },
    'History': {
        'Ancient History': {
            'keywords': ['ancient', 'egypt', 'rome', 'greece', 'civilization', 'pharaoh', 'empire', 'classical', 'bc', 'bce']
        },
        'Medieval History': {
            'keywords': ['medieval', 'kingdom', 'feudal', 'monarch', 'castle', 'knight', 'century', 'middle ages']
        },
        'Modern History': {
            'keywords': ['modern', 'industrial', 'revolution', 'century', 'nation', 'world war', 'independence', 'contemporary']
        },
        'African History': {
            'keywords': ['africa', 'african', 'slave', 'colonial', 'independence', 'kingdom', 'empire', 'tradition']
        },
        'Political & Social History': {
            'keywords': ['politics', 'political', 'social', 'government', 'war', 'conflict', 'movement', 'revolution']
        },
    },
    'Igbo': {
        'Vocabulary & Language': {
            'keywords': ['word', 'vocabulary', 'phrase', 'meaning', 'language', 'igbo', 'traditional']
        },
        'Grammar & Usage': {
            'keywords': ['grammar', 'sentence', 'structure', 'verb', 'noun', 'tense', 'conjugation']
        },
        'Oral Traditions': {
            'keywords': ['story', 'folklore', 'proverb', 'tradition', 'culture', 'wisdom', 'tale']
        },
        'Communication Skills': {
            'keywords': ['communication', 'conversation', 'dialogue', 'expression', 'writing', 'composition']
        },
    },
    'Music': {
        'Music Theory & Notation': {
            'keywords': ['note', 'scale', 'chord', 'rhythm', 'melody', 'harmony', 'theory', 'clef', 'key', 'time signature', 'staff']
        },
        'Instruments & Ensembles': {
            'keywords': ['instrument', 'piano', 'guitar', 'violin', 'drum', 'orchestra', 'band', 'ensemble', 'strings', 'woodwind', 'brass']
        },
        'Music History & Styles': {
            'keywords': ['music', 'style', 'classical', 'jazz', 'rock', 'traditional', 'genre', 'composer', 'history', 'period']
        },
        'Performance & Technique': {
            'keywords': ['performance', 'technique', 'practice', 'dynamics', 'tempo', 'expression', 'articulation', 'interpretation']
        },
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
        text = re.sub(r'[^\w\s\-]', ' ', text)
        return text.lower().strip()
    
    def extract_keywords(self, text: str, num_keywords: int = 5) -> List[str]:
        """Extract important keywords from text"""
        cleaned = self.preprocess_text(text)
        words = cleaned.split()
        
        # Filter out common words
        stopwords = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'have',
            'has', 'had', 'do', 'does', 'did', 'can', 'could', 'will', 'would',
            'which', 'what', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
            'both', 'few', 'more', 'most', 'other', 'some', 'such', 'this', 'that',
            'the', 'these', 'those', 'as', 'so', 'than', 'too', 'very', 'if', 'just'
        }
        
        filtered = [w for w in words if len(w) > 2 and w not in stopwords]
        return filtered[:num_keywords]
    
    def predict_topic_for_question(self, question_text: str, subject: str) -> Tuple[str, str]:
        """Predict topic and subtopic for a question in a subject"""
        if subject not in SUBJECT_TOPIC_KEYWORDS:
            return None, None
        
        keywords = self.extract_keywords(question_text)
        topic_keywords = SUBJECT_TOPIC_KEYWORDS[subject]
        
        # Score each subtopic based on keyword matches
        best_topic = None
        best_subtopic = None
        best_score = 0
        
        for topic, subtopics in topic_keywords.items():
            for subtopic, subtopic_data in subtopics.items():
                words = subtopic_data.get('keywords', [])
                # Count keyword matches
                score = sum(1 for kw in keywords if any(w in kw or kw in w for w in words))
                
                if score > best_score:
                    best_score = score
                    best_topic = topic
                    best_subtopic = subtopic
        
        # Fallback to first topic if no matches found
        if not best_topic:
            best_topic = list(topic_keywords.keys())[0]
            best_subtopic = list(topic_keywords[best_topic].keys())[0]
        
        return best_topic, best_subtopic
    
    def tag_subject(self, subject: str, dry_run: bool = False) -> Dict:
        """Tag all questions in a subject that have empty topics"""
        cursor = self.conn.cursor(cursor_factory=DictCursor)
        
        # Get questions with empty topics
        cursor.execute("""
            SELECT id, question FROM questions
            WHERE subject = %s AND (topic IS NULL OR topic = '')
            ORDER BY id
        """, (subject,))
        
        questions = cursor.fetchall()
        print(f"\nTagging {subject}: {len(questions)} questions without topics")
        
        stats = {
            'total': len(questions),
            'tagged': 0,
            'topics_created': defaultdict(int)
        }
        
        for i, q in enumerate(questions, 1):
            topic, subtopic = self.predict_topic_for_question(q['question'], subject)
            
            if topic:
                if not dry_run:
                    cursor.execute("""
                        UPDATE questions
                        SET topic = %s, subtopic = %s
                        WHERE id = %s
                    """, (topic, subtopic, q['id']))
                
                stats['tagged'] += 1
                stats['topics_created'][topic] += 1
                
                if (i % 100) == 0:
                    print(f"  Processed {i}/{len(questions)} questions...")
        
        if not dry_run:
            self.conn.commit()
        
        return stats
    
    def tag_all_subjects(self, dry_run: bool = False):
        """Tag all subjects with empty topics"""
        subjects_to_tag = list(SUBJECT_TOPIC_KEYWORDS.keys())
        
        print("=" * 70)
        print("GENERIC SUBJECT QUESTION TAGGING")
        print("=" * 70)
        
        overall_stats = {}
        
        for subject in subjects_to_tag:
            stats = self.tag_subject(subject, dry_run=dry_run)
            overall_stats[subject] = stats
            
            print(f"  Summary: {stats['tagged']}/{stats['total']} questions tagged")
            if stats['topics_created']:
                for topic, count in sorted(stats['topics_created'].items(), key=lambda x: x[1], reverse=True):
                    print(f"    - {topic}: {count} questions")
        
        print("\n" + "=" * 70)
        print("TAGGING COMPLETE")
        print("=" * 70)
        
        for subject, stats in overall_stats.items():
            print(f"{subject:25} {stats['tagged']}/{stats['total']} tagged")
        
        return overall_stats
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            print("\n✓ Database connection closed")


def main():
    """Main execution"""
    tagger = GenericSubjectTagger()
    
    try:
        tagger.connect_db()
        tagger.tag_all_subjects(dry_run=False)
        print("\n✅ All subjects have been tagged successfully!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        tagger.close()


if __name__ == "__main__":
    main()
