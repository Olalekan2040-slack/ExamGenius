"""
Text formatting utilities for cleaning LaTeX and mathematical notation
"""
import re


def sanitize_latex(text: str) -> str:
    """
    Remove LaTeX formatting and convert to plain text
    
    Handles:
    - Superscripts: \\(^2\\) → ^2
    - Subscripts: \\(_2\\) → _2  
    - Inline math: \\(...\\) → content
    - Display math: \\[...\\] → content
    - Common symbols: \\alpha → alpha, \\pi → π, etc.
    - Fractions: \\frac{a}{b} → a/b
    
    Args:
        text: Text potentially containing LaTeX
        
    Returns:
        Cleaned plain text
    """
    if not text:
        return text
    
    # Replace common LaTeX superscripts → HTML <sup>
    text = re.sub(r'\\\(\^(\d+)\\\)', r'<sup>\1</sup>', text)
    text = re.sub(r'\\\(\^-(\d+)\\\)', r'<sup>-\1</sup>', text)
    text = re.sub(r'\\\(\^{(\d+)}\\\)', r'<sup>\1</sup>', text)
    text = re.sub(r'\\\(\^{-(\d+)}\\\)', r'<sup>-\1</sup>', text)
    
    # Replace common LaTeX subscripts → HTML <sub>
    text = re.sub(r'\\\(_(\d+)\\\)', r'<sub>\1</sub>', text)
    text = re.sub(r'\\\(_{(\d+)}\\\)', r'<sub>\1</sub>', text)
    
    # Convert standalone _digit notation to <sub>digit</sub> (e.g. H_2O → H<sub>2</sub>O)
    text = re.sub(r'_(\d+)', r'<sub>\1</sub>', text)
    # Convert standalone ^digit notation to <sup>digit</sup> (e.g. x^2 → x<sup>2</sup>)
    text = re.sub(r'\^(-?\d+)', r'<sup>\1</sup>', text)
    
    # Handle fractions
    text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'\1/\2', text)
    
    # Remove inline math delimiters but keep content
    text = re.sub(r'\\\(([^)]+)\\\)', r'\1', text)
    text = re.sub(r'\\\[([^\]]+)\\\]', r'\1', text)
    
    # Clean up common symbols
    symbol_map = {
        r'\\alpha': 'α',
        r'\\beta': 'β',
        r'\\gamma': 'γ',
        r'\\delta': 'δ',
        r'\\pi': 'π',
        r'\\theta': 'θ',
        r'\\lambda': 'λ',
        r'\\mu': 'μ',
        r'\\sigma': 'σ',
        r'\\omega': 'ω',
        r'\\Omega': 'Ω',
        r'\\times': '×',
        r'\\div': '÷',
        r'\\pm': '±',
        r'\\leq': '≤',
        r'\\geq': '≥',
        r'\\neq': '≠',
        r'\\approx': '≈',
        r'\\sqrt': '√',
        r'\\infty': '∞',
        r'\\degree': '°',
        r'\\celsius': '°C',
    }
    
    for latex, symbol in symbol_map.items():
        text = text.replace(latex, symbol)
    
    # Remove common LaTeX commands
    text = re.sub(r'\\text\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\mathrm\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\mathbf\{([^}]+)\}', r'\1', text)
    
    # Clean up remaining backslashes before single chars
    text = re.sub(r'\\([a-zA-Z])', r'\1', text)
    
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text


def sanitize_question_data(question_dict: dict) -> dict:
    """
    Sanitize all text fields in a question dictionary
    
    Args:
        question_dict: Question data with 'question', options, etc.
        
    Returns:
        Cleaned question dictionary
    """
    # Clean question text
    if 'question' in question_dict:
        question_dict['question'] = sanitize_latex(question_dict['question'])
    
    # Clean options (could be dict or individual fields)
    if 'options' in question_dict and isinstance(question_dict['options'], dict):
        for key in question_dict['options']:
            question_dict['options'][key] = sanitize_latex(question_dict['options'][key])
    
    # Clean individual option fields
    for opt in ['A', 'B', 'C', 'D', 'option_a', 'option_b', 'option_c', 'option_d']:
        if opt in question_dict:
            question_dict[opt] = sanitize_latex(question_dict[opt])
    
    # Clean explanation if present
    if 'explanation' in question_dict:
        question_dict['explanation'] = sanitize_latex(question_dict['explanation'])
    
    return question_dict
