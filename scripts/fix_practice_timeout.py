"""
Fix for practice submission timeout
Removes AI explanation generation that was causing delays
"""
import sys

# Read the file
with open('app/api/v1/endpoints/learn.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the explanation generation block
old_code = '''            # Generate explanation
            try:
                explanation = generate_question_explanation(
                    question_text, options, correct_answer, topic
                )
            except:
                explanation = f"The correct answer is {correct_answer}. {options.get(correct_answer, '')}"'''

new_code = '''            # Simple explanation (AI generation removed to prevent timeout)
            explanation = f"The correct answer is {correct_answer}: {options.get(correct_answer, '')}"'''

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('app/api/v1/endpoints/learn.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Fixed practice submission timeout - AI explanation removed")
else:
    print("❌ Could not find the code to replace")
    sys.exit(1)
