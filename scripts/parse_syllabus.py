"""
Parse syllabus markdown files into structured JSON format
Extracts topics, subtopics, and learning objectives
"""

import re
import json
import os
from pathlib import Path


def parse_syllabus_file(filepath: str) -> dict:
    """Parse a syllabus markdown file into structured format"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subject from filename
    filename = os.path.basename(filepath)
    subject = filename.replace('_syllabus.md', '').replace('.md', '').replace('_', ' ').title()
    # Clean up subject name
    subject = subject.replace(' Syllabus', '').strip()
    if 'Physics' in subject:
        subject = 'Physics'
    elif 'Math' in subject:
        subject = 'Mathematics'
    elif 'English' in subject.lower():
        subject = 'English'
    elif 'Biology' in subject:
        subject = 'Biology'
    elif 'Chemistry' in subject:
        subject = 'Chemistry'
    
    topics = []
    
    # Split by topic numbers (1. Topic Name, 2. Topic Name, etc.)
    # Pattern matches: "1. Topic Name" at start of line - capture until next newline or "Subtopics"
    topic_pattern = r'^(\d+)\.\s*([A-Za-z][^\n]+?)(?:Subtopics?:|$|\n)'
    
    # Find all topics
    topic_matches = list(re.finditer(topic_pattern, content, re.MULTILINE))
    
    for i, match in enumerate(topic_matches):
        topic_num = int(match.group(1))
        topic_name = match.group(2).strip()
        
        # Get content until next topic
        start_pos = match.end()
        end_pos = topic_matches[i + 1].start() if i + 1 < len(topic_matches) else len(content)
        topic_content = content[start_pos:end_pos]
        
        # Parse subtopics
        subtopics = []
        
        # Look for "Subtopics:" section
        subtopics_match = re.search(r'Subtopics?:\s*\n?(.*?)(?=Objectives?:|$)', topic_content, re.DOTALL | re.IGNORECASE)
        if subtopics_match:
            subtopics_text = subtopics_match.group(1).strip()
            # Each line is a subtopic
            for line in subtopics_text.split('\n'):
                line = line.strip()
                if line and not line.lower().startswith('objective'):
                    # Clean up the subtopic text
                    subtopic = re.sub(r'^[-•*]\s*', '', line)
                    if subtopic:
                        subtopics.append({
                            'name': subtopic,
                            'objectives': []
                        })
        
        # Parse objectives
        objectives = []
        objectives_match = re.search(r'Objectives?:\s*(?:Candidates should be able to:?)?\s*(.*?)$', topic_content, re.DOTALL | re.IGNORECASE)
        if objectives_match:
            objectives_text = objectives_match.group(1).strip()
            for line in objectives_text.split('\n'):
                line = line.strip()
                if line:
                    # Clean up objective text
                    objective = re.sub(r'^[-•*]\s*', '', line)
                    objective = re.sub(r'^\d+\.\s*', '', objective)
                    if objective and len(objective) > 5:
                        objectives.append(objective)
        
        # Distribute objectives across subtopics if we have both
        if subtopics and objectives:
            obj_per_subtopic = max(1, len(objectives) // len(subtopics))
            obj_idx = 0
            for st in subtopics:
                st['objectives'] = objectives[obj_idx:obj_idx + obj_per_subtopic]
                obj_idx += obj_per_subtopic
            # Add remaining objectives to last subtopic
            if obj_idx < len(objectives):
                subtopics[-1]['objectives'].extend(objectives[obj_idx:])
        elif objectives and not subtopics:
            # Create a default subtopic with all objectives
            subtopics = [{
                'name': topic_name,
                'objectives': objectives
            }]
        
        topics.append({
            'number': topic_num,
            'name': topic_name,
            'subtopics': subtopics
        })
    
    return {
        'subject': subject,
        'topics': topics
    }


def parse_all_syllabi(syllabus_dir: str, output_dir: str):
    """Parse all syllabus files and save as JSON"""
    syllabus_path = Path(syllabus_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    for md_file in syllabus_path.glob('*.md'):
        print(f"Parsing {md_file.name}...")
        try:
            data = parse_syllabus_file(str(md_file))
            
            # Save as JSON
            output_file = output_path / f"{md_file.stem}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"  -> Saved {output_file.name} ({len(data['topics'])} topics)")
        except Exception as e:
            print(f"  -> Error: {e}")


if __name__ == '__main__':
    import sys
    base_dir = Path(__file__).parent.parent
    syllabus_dir = base_dir / 'syllabus'
    output_dir = base_dir / 'syllabus' / 'parsed'
    
    parse_all_syllabi(str(syllabus_dir), str(output_dir))
    print("\nDone! Parsed syllabus files saved to syllabus/parsed/")
