"""
Final comprehensive LaTeX cleanup for all question sources
Handles remaining patterns like \(^2\), \(^{-1}\), etc.
"""

import json
import re
import sqlite3
from pathlib import Path

def clean_latex_comprehensive(text):
    """Remove all LaTeX formatting comprehensively"""
    if not text or not isinstance(text, str):
        return text
    
    # Store original for comparison
    original = text
    
    # Pattern 1: \(^2\) -> ² or ^2
    text = re.sub(r'\\\((\^[\d\-]+)\\\)', r'\1', text)
    text = re.sub(r'\\\((\^{[\d\-]+})\\\)', lambda m: m.group(1), text)
    
    # Pattern 2: Full inline math \(...\)
    text = re.sub(r'\\\((.*?)\\\)', lambda m: clean_math_content(m.group(1)), text)
    
    # Pattern 3: Display math \[...\]
    text = re.sub(r'\\\[(.*?)\\\]', lambda m: clean_math_content(m.group(1)), text)
    
    # Pattern 4: Remaining backslash commands
    text = re.sub(r'\\([a-zA-Z]+)({.*?})?', lambda m: clean_command(m.group(1), m.group(2)), text)
    
    # Pattern 5: Curly braces without commands
    text = re.sub(r'{([^{}]*)}', r'\1', text)
    
    # Clean up multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def clean_math_content(content):
    """Clean content inside math delimiters"""
    # Fractions
    content = re.sub(r'\\frac{([^}]+)}{([^}]+)}', r'(\1/\2)', content)
    
    # Superscripts and subscripts
    content = re.sub(r'\^{([^}]+)}', r'^\1', content)
    content = re.sub(r'_{([^}]+)}', r'_\1', content)
    content = re.sub(r'\^(\d+)', r'^\1', content)
    content = re.sub(r'_(\d+)', r'_\1', content)
    
    # Greek letters and symbols
    symbols = {
        'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'epsilon': 'ε',
        'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ', 'sigma': 'σ',
        'omega': 'ω', 'Omega': 'Ω', 'Delta': 'Δ', 'Sigma': 'Σ',
        'times': '×', 'div': '÷', 'pm': '±', 'leq': '≤', 'geq': '≥',
        'neq': '≠', 'approx': '≈', 'infty': '∞', 'partial': '∂',
        'sqrt': '√', 'sum': 'Σ', 'int': '∫', 'cdot': '·'
    }
    
    for cmd, symbol in symbols.items():
        content = content.replace(f'\\{cmd}', symbol)
    
    # Remove remaining backslashes
    content = re.sub(r'\\([a-zA-Z]+)', r'\1', content)
    
    # Clean up spaces and braces
    content = re.sub(r'{([^{}]*)}', r'\1', content)
    content = re.sub(r'\s+', ' ', content).strip()
    
    return content

def clean_command(cmd, arg):
    """Clean LaTeX commands"""
    # Common text commands
    text_commands = {
        'text': arg[1:-1] if arg else '',
        'mathrm': arg[1:-1] if arg else '',
        'textbf': arg[1:-1] if arg else '',
        'textit': arg[1:-1] if arg else '',
    }
    
    if cmd in text_commands:
        return text_commands[cmd]
    
    # Math symbols
    symbols = {
        'degree': '°', 'celsius': '°C', 'ohm': 'Ω', 'alpha': 'α',
        'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'pi': 'π',
        'theta': 'θ', 'mu': 'μ', 'sigma': 'σ', 'omega': 'ω'
    }
    
    if cmd in symbols:
        return symbols[cmd]
    
    return arg[1:-1] if arg else ''

def process_json_file(filepath):
    """Process a single JSON file"""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes = 0
    
    for item in data:
        if isinstance(item, dict):
            # Clean question text
            if 'question' in item:
                original = item['question']
                cleaned = clean_latex_comprehensive(original)
                if cleaned != original:
                    item['question'] = cleaned
                    changes += 1
            
            # Clean options
            if 'options' in item and isinstance(item['options'], dict):
                for key, value in item['options'].items():
                    original = value
                    cleaned = clean_latex_comprehensive(value)
                    if cleaned != original:
                        item['options'][key] = cleaned
                        changes += 1
            
            # Clean explanation if present
            if 'explanation' in item:
                original = item['explanation']
                cleaned = clean_latex_comprehensive(original)
                if cleaned != original:
                    item['explanation'] = cleaned
                    changes += 1
    
    if changes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"  ✓ Updated {changes} items")
    else:
        print(f"  - No changes needed")
    
    return changes

def clean_database():
    """Clean LaTeX from database questions"""
    db_path = Path(__file__).parent / 'examgenius.db'
    
    if not db_path.exists():
        print("Database not found, skipping...")
        return 0
    
    print("\nCleaning database...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all questions
    cursor.execute("""
        SELECT question_id, question_text 
        FROM questions
    """)
    questions = cursor.fetchall()
    
    question_changes = 0
    for qid, text in questions:
        cleaned = clean_latex_comprehensive(text)
        if cleaned != text:
            cursor.execute("""
                UPDATE questions 
                SET question_text = ? 
                WHERE question_id = ?
            """, (cleaned, qid))
            question_changes += 1
    
    # Get all options
    cursor.execute("""
        SELECT option_id, option_text 
        FROM question_options
    """)
    options = cursor.fetchall()
    
    option_changes = 0
    for oid, text in options:
        cleaned = clean_latex_comprehensive(text)
        if cleaned != text:
            cursor.execute("""
                UPDATE question_options 
                SET option_text = ? 
                WHERE option_id = ?
            """, (cleaned, oid))
            option_changes += 1
    
    conn.commit()
    conn.close()
    
    print(f"  ✓ Updated {question_changes} questions")
    print(f"  ✓ Updated {option_changes} options")
    
    return question_changes + option_changes

def main():
    """Main cleanup process"""
    print("=" * 60)
    print("COMPREHENSIVE LATEX CLEANUP")
    print("=" * 60)
    
    # Process JSON files
    past_questions_dir = Path(__file__).parent / 'past_questions'
    
    if past_questions_dir.exists():
        json_files = list(past_questions_dir.rglob('*.json'))
        print(f"\nFound {len(json_files)} JSON files")
        
        total_changes = 0
        for filepath in json_files:
            changes = process_json_file(filepath)
            total_changes += changes
        
        print(f"\n✓ Total JSON changes: {total_changes}")
    
    # Process database
    db_changes = clean_database()
    
    print("\n" + "=" * 60)
    print("CLEANUP COMPLETE!")
    print(f"Total changes: {total_changes + db_changes}")
    print("=" * 60)

if __name__ == "__main__":
    main()
