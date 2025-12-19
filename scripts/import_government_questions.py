"""
Import Government questions from JAMB folder (2010-2024) and map to syllabus topics.
"""

import sqlite3
import json
import os
import re

# Government Syllabus Topics mapped to JAMB format
GOVERNMENT_SYLLABUS = {
    # PART I: ELEMENTS OF GOVERNMENT
    "1. Basic Concepts in Government": {
        "keywords": ["power", "authority", "legitimacy", "sovereignty", "society", "state", "nation", 
                     "nation-state", "political socialization", "political participation", "political culture",
                     "political process"],
        "objectives": [
            "Identify the fundamental concepts in governance",
            "Analyse various political processes"
        ]
    },
    "2. Forms of Government": {
        "keywords": ["monarchy", "aristocracy", "oligarchy", "autocracy", "republicanism", "democracy",
                     "democratic", "dictator", "tyrant", "totalitarian"],
        "objectives": [
            "Distinguish between different forms of government"
        ]
    },
    "3. Arms of Government": {
        "keywords": ["legislature", "executive", "judiciary", "separation of power", "lawmaking",
                     "bill", "act", "parliament", "congress", "cabinet", "court", "judge",
                     "delegated legislation", "checks and balances"],
        "objectives": [
            "Identify the duties and obligations of the various arms of government",
            "Relate each arm to its functions",
            "Appreciate how these arms interrelate"
        ]
    },
    "4. Structures of Governance": {
        "keywords": ["unitary", "federal", "federalism", "confederal", "confederation", "centralization",
                     "devolution", "regionalism"],
        "objectives": [
            "Compare the various political structures of governance"
        ]
    },
    "5. Systems of Governance": {
        "keywords": ["presidential", "parliamentary", "monarchical", "cabinet system", "prime minister",
                     "president", "head of state", "head of government", "westminster"],
        "objectives": [
            "Distinguish between the different systems of governance"
        ]
    },
    "6. Political Ideologies": {
        "keywords": ["communalism", "feudalism", "capitalism", "socialism", "communism", "totalitarianism",
                     "fascism", "nazism", "marxism", "ideology", "left wing", "right wing"],
        "objectives": [
            "Differentiate between the major political ideologies",
            "Contrast modes of production"
        ]
    },
    "7. Constitution": {
        "keywords": ["constitution", "constitutional", "written constitution", "unwritten", "rigid",
                     "flexible", "amendment", "supremacy", "fundamental rights"],
        "objectives": [
            "Define and identify sources and functions of constitutions",
            "Compare the nature of constitutions"
        ]
    },
    "8. Principles of Democratic Government": {
        "keywords": ["rule of law", "separation of power", "checks and balances", "accountability",
                     "transparency", "collective responsibility", "individual responsibility",
                     "constitutionalism", "representative government", "ethics"],
        "objectives": [
            "Identify the principles of democratic government",
            "Determine the application of these principles"
        ]
    },
    "9. Processes of Legislation": {
        "keywords": ["legislation", "bill", "act", "edict", "bye-law", "decree", "reading",
                     "assent", "veto", "lawmaking process"],
        "objectives": [
            "Analyse the processes involved in the making of laws"
        ]
    },
    "10. Citizenship": {
        "keywords": ["citizenship", "citizen", "naturalization", "birth", "registration", "dual citizenship",
                     "renunciation", "deprivation", "rights", "duties", "obligations", "alien", "immigrant"],
        "objectives": [
            "Differentiate between the various methods of acquiring citizenship",
            "Specify the rights and responsibilities of a citizen",
            "Assess the obligations of the state"
        ]
    },
    "11. Electoral Process": {
        "keywords": ["election", "electoral", "voting", "suffrage", "franchise", "ballot", "polling",
                     "constituency", "gerrymandering", "electoral commission", "INEC", "proportional",
                     "first-past-the-post", "secret ballot"],
        "objectives": [
            "Distinguish the different types of franchise",
            "Identify and explain the types of electoral systems",
            "Analyse the various electoral processes"
        ]
    },
    "12. Political Parties and Party Systems": {
        "keywords": ["political party", "party system", "one party", "two party", "multi-party",
                     "opposition", "ruling party", "manifesto", "campaign", "primary election"],
        "objectives": [
            "Assess the role of political parties",
            "Distinguish between types of party systems"
        ]
    },
    "13. Pressure Groups": {
        "keywords": ["pressure group", "interest group", "lobby", "trade union", "NLC", "civil society",
                     "NGO", "advocacy"],
        "objectives": [
            "Evaluate the functions and modus operandi of pressure groups",
            "Distinguish between pressure groups and political parties"
        ]
    },
    "14. Public Opinion": {
        "keywords": ["public opinion", "opinion poll", "referendum", "plebiscite", "propaganda",
                     "mass media", "survey"],
        "objectives": [
            "Compare methods of assessing public opinion",
            "Assess the functions of public opinion",
            "Analyse the limitations of public opinion"
        ]
    },
    "15. The Civil Service": {
        "keywords": ["civil service", "civil servant", "bureaucracy", "permanent secretary", "ministry",
                     "neutrality", "anonymity", "tenure", "red tape"],
        "objectives": [
            "Analyse the significance of civil service in governance"
        ]
    },
    
    # PART II: POLITICAL DEVELOPMENT IN NIGERIA
    "16. Pre-Colonial Polities": {
        "keywords": ["pre-colonial", "hausa", "emirate", "igbo", "yoruba", "tiv", "obi", "oba",
                     "emir", "sultan", "traditional", "clan", "age grade", "eze"],
        "objectives": [
            "Appreciate the effectiveness of the pre-colonial political systems",
            "Compare pre-colonial systems of governance"
        ]
    },
    "17. Imperialist Penetration": {
        "keywords": ["colonialism", "colonial", "british", "french", "indirect rule", "direct rule",
                     "assimilation", "association", "crown colony", "protectorate", "missionary",
                     "scramble for africa", "berlin conference", "lugard", "warrant chief"],
        "objectives": [
            "Trace the processes of imperialist penetration",
            "Assess the impact of British and French policies",
            "Distinguish between British and French colonial practices"
        ]
    },
    "18. Process of Decolonization": {
        "keywords": ["nationalism", "nationalist", "independence", "decolonization", "macaulay",
                     "azikiwe", "awolowo", "ahmadu bello", "tafawa balewa", "aminu kano",
                     "NCNC", "AG", "NPC", "pan-african", "self-government"],
        "objectives": [
            "Evaluate the process of decolonization",
            "Assess the roles of nationalist leaders and parties",
            "Assess the impact of external forces and ideas"
        ]
    },
    "19. Constitutional Development in Nigeria": {
        "keywords": ["clifford", "richards", "macpherson", "lyttleton", "1922", "1946", "1951", "1954",
                     "1960 constitution", "independence constitution"],
        "objectives": [
            "Compare the various constitutional developments"
        ]
    },
    "20. Post-Independence Constitutions": {
        "keywords": ["1963 constitution", "1979 constitution", "1989 constitution", "1999 constitution",
                     "republican", "presidential system"],
        "objectives": [
            "Assess the workings of the various constitutions"
        ]
    },
    "21. Institutions of Government in Post-Independence Nigeria": {
        "keywords": ["national assembly", "senate", "house of representatives", "state assembly",
                     "governor", "president", "supreme court", "court of appeal", "federal"],
        "objectives": [
            "Evaluate the operations of the arms of government and their agencies"
        ]
    },
    "22. Public Commissions": {
        "keywords": ["civil service commission", "public complaints commission", "INEC", "electoral commission",
                     "boundary commission", "EFCC", "ICPC", "ombudsman"],
        "objectives": [
            "Evaluate the operations of public commissions",
            "Assess the problems of the Public Commissions"
        ]
    },
    "23. Political Parties in Post-Independence Nigeria": {
        "keywords": ["first republic", "second republic", "third republic", "fourth republic",
                     "NPN", "UPN", "NPP", "GNPP", "PRP", "SDP", "NRC", "PDP", "APC", "APP",
                     "AD", "ANPP", "ACN"],
        "objectives": [
            "Contrast political processes in the republics",
            "Evaluate the ideologies, structure and composition of political parties"
        ]
    },
    "24. Nigerian Federalism": {
        "keywords": ["federalism", "federal system", "state creation", "revenue allocation",
                     "fiscal federalism", "federal character", "census", "resource control"],
        "objectives": [
            "Examine the workings of Nigerian federalism",
            "Identify its problems",
            "Evaluate the corrective measures adopted"
        ]
    },
    "25. Public Corporations and Parastatals": {
        "keywords": ["public corporation", "parastatal", "privatization", "commercialization",
                     "deregulation", "NNPC", "NEPA", "PHCN", "NTA"],
        "objectives": [
            "Examine the operations of public corporations and parastatals",
            "Identify the processes involved in privatization and commercialization"
        ]
    },
    "26. Local Government": {
        "keywords": ["local government", "local council", "1976 reform", "traditional ruler",
                     "councilor", "chairman", "ward", "grassroot"],
        "objectives": [
            "Trace the evolution and structure of local government",
            "Identify the major problems faced by local governments"
        ]
    },
    "27. Military in Nigerian Politics": {
        "keywords": ["military", "coup", "junta", "martial law", "decree", "civil war",
                     "gowon", "murtala", "obasanjo", "buhari", "babangida", "abacha", "abdulsalami",
                     "SAP", "transition"],
        "objectives": [
            "Evaluate the reasons for military intervention",
            "Assess the achievements of military rule",
            "Determine the conditions that necessitated withdrawal"
        ]
    },
    
    # PART III & IV: FOREIGN POLICY AND INTERNATIONAL ORGANIZATIONS
    "28. Foreign Policy": {
        "keywords": ["foreign policy", "diplomacy", "diplomatic", "ambassador", "embassy",
                     "bilateral", "multilateral", "treaty"],
        "objectives": [
            "Define foreign policy and identify its determinants"
        ]
    },
    "29. Nigeria's Foreign Policy": {
        "keywords": ["nigeria foreign policy", "afrocentric", "africa centerpiece", "non-alignment",
                     "technical aid corps", "TAC", "good neighborliness"],
        "objectives": [
            "Identify the major objectives of Nigeria's foreign policy",
            "Analyse Nigeria's non-aligned posture"
        ]
    },
    "30. Nigeria and African Affairs": {
        "keywords": ["africa centerpiece", "NEPAD", "frontline states", "apartheid", "liberation",
                     "south africa", "angola"],
        "objectives": [
            "Evaluate the role of Nigeria in continental affairs",
            "Assess the role of NEPAD in developing Africa"
        ]
    },
    "31. International Organizations": {
        "keywords": ["UN", "united nations", "commonwealth", "OAU", "AU", "african union",
                     "ECOWAS", "OPEC", "security council", "general assembly", "UNESCO",
                     "WHO", "IMF", "world bank", "ECOMOG"],
        "objectives": [
            "Evaluate the operations of international organizations",
            "Assess the role of these organizations in world affairs",
            "Appreciate the challenges of these organizations"
        ]
    }
}

def clean_text(text):
    """Clean whitespace and newlines from text."""
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.strip())

def find_best_topic(question_text, current_topic, current_subtopic):
    """Find the best matching syllabus topic."""
    text_to_check = f"{question_text} {current_topic} {current_subtopic}".lower()
    
    best_match = None
    best_score = 0
    
    for topic_name, topic_data in GOVERNMENT_SYLLABUS.items():
        score = 0
        for keyword in topic_data["keywords"]:
            if keyword.lower() in text_to_check:
                score += 2
        
        if score > best_score:
            best_score = score
            best_match = topic_name
    
    # Default to a general topic if no match
    if not best_match or best_score < 2:
        if "element" in current_topic.lower() or "part i" in current_topic.lower():
            best_match = "1. Basic Concepts in Government"
        elif "nigeria" in current_topic.lower() or "part ii" in current_topic.lower():
            best_match = "16. Pre-Colonial Polities"
        elif "foreign" in current_topic.lower() or "international" in current_topic.lower():
            best_match = "31. International Organizations"
        else:
            best_match = "1. Basic Concepts in Government"
    
    return best_match

def import_government_questions():
    """Import Government questions from JAMB folder."""
    conn = sqlite3.connect('jamb_questions.db')
    cursor = conn.cursor()
    
    # Add subtopic and explanation columns if they don't exist
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN subtopic TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN explanation TEXT")
    except:
        pass
    
    jamb_folder = "JAMB/Government"
    years = range(2010, 2025)
    
    inserted = 0
    updated = 0
    
    for year in years:
        json_path = os.path.join(jamb_folder, str(year), "questions.json")
        
        if not os.path.exists(json_path):
            print(f"  Skipping {year}: file not found")
            continue
        
        with open(json_path, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        print(f"  Processing {year}: {len(questions)} questions")
        
        for q in questions:
            q_id = q.get('id', f"JAMB_Government_{year}_{q.get('number', 0)}")
            question_text = clean_text(q.get('question', ''))
            options = q.get('options', {})
            correct = q.get('correct_answer', '')
            old_topic = q.get('topic', '')
            subtopic = clean_text(q.get('subtopic', ''))
            explanation = clean_text(q.get('explanation', ''))
            
            # Map to syllabus topic
            new_topic = find_best_topic(question_text, old_topic, subtopic)
            
            # Clean options
            opt_a = clean_text(options.get('A', ''))
            opt_b = clean_text(options.get('B', ''))
            opt_c = clean_text(options.get('C', ''))
            opt_d = clean_text(options.get('D', ''))
            
            # Check if question exists
            cursor.execute("SELECT id FROM questions WHERE id = ?", (q_id,))
            exists = cursor.fetchone()
            
            if exists:
                # Update existing
                cursor.execute("""
                    UPDATE questions 
                    SET question = ?, topic = ?, subtopic = ?, explanation = ?,
                        correct_option_key = ?
                    WHERE id = ?
                """, (question_text, new_topic, subtopic, explanation, correct, q_id))
                updated += 1
            else:
                # Insert new
                cursor.execute("""
                    INSERT INTO questions (id, exam, subject, year, number, topic, subtopic, question, correct_option_key, explanation)
                    VALUES (?, 'JAMB', 'Government', ?, ?, ?, ?, ?, ?, ?)
                """, (q_id, year, q.get('number', ''), new_topic, subtopic, question_text, correct, explanation))
                
                new_q_id = cursor.lastrowid if not q_id else q_id
                
                # Insert options
                for opt_key, opt_val in [('A', opt_a), ('B', opt_b), ('C', opt_c), ('D', opt_d)]:
                    if opt_val:
                        cursor.execute("""
                            INSERT OR REPLACE INTO options (question_id, option_key, option_text)
                            VALUES (?, ?, ?)
                        """, (q_id, opt_key, opt_val))
                
                inserted += 1
    
    conn.commit()
    
    # Show distribution
    cursor.execute("""
        SELECT topic, COUNT(*) as cnt 
        FROM questions 
        WHERE subject = 'Government' 
        GROUP BY topic 
        ORDER BY cnt DESC
    """)
    results = cursor.fetchall()
    
    print(f"\n{'='*60}")
    print("GOVERNMENT QUESTIONS BY SYLLABUS TOPIC:")
    print('='*60)
    for r in results:
        print(f"  {r[0]}: {r[1]} questions")
    
    total = sum(r[1] for r in results)
    print(f"\nTotal: {total} questions")
    print(f"Inserted: {inserted}, Updated: {updated}")
    
    conn.close()
    return inserted, updated

def create_syllabus_table():
    """Create Government syllabus topics in database."""
    conn = sqlite3.connect('jamb_questions.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS syllabus_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            topic_number INTEGER NOT NULL,
            topic_name TEXT NOT NULL,
            full_topic TEXT NOT NULL,
            keywords TEXT,
            objectives TEXT,
            UNIQUE(subject, topic_number)
        )
    """)
    
    for full_topic, data in GOVERNMENT_SYLLABUS.items():
        topic_num = int(full_topic.split('.')[0])
        topic_name = full_topic.split('. ', 1)[1] if '. ' in full_topic else full_topic
        keywords = ', '.join(data['keywords'][:10])
        objectives = '; '.join(data['objectives'])
        
        cursor.execute("""
            INSERT OR REPLACE INTO syllabus_topics 
            (subject, topic_number, topic_name, full_topic, keywords, objectives)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("Government", topic_num, topic_name, full_topic, keywords, objectives))
    
    conn.commit()
    
    cursor.execute("SELECT COUNT(*) FROM syllabus_topics WHERE subject = 'Government'")
    count = cursor.fetchone()[0]
    print(f"\nCreated {count} Government syllabus topics")
    
    conn.close()

if __name__ == "__main__":
    print("Importing Government questions from JAMB folder...")
    import_government_questions()
    print("\nCreating Government syllabus topics...")
    create_syllabus_table()
    print("\nDone!")
