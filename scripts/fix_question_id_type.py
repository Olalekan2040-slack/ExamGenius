"""
Fix question_id type mismatch
question_id should accept both int and str since DB IDs are strings
"""
import sys

with open('app/api/v1/endpoints/learn.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the PracticeAnswer model
old_code = '''class PracticeAnswer(BaseModel):
    question_id: int
    user_answer: Optional[str] = None'''

new_code = '''class PracticeAnswer(BaseModel):
    question_id: str  # Can be string ID from database
    user_answer: Optional[str] = None'''

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('app/api/v1/endpoints/learn.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Fixed question_id type from int to str")
else:
    print("❌ Could not find PracticeAnswer model")
    sys.exit(1)
