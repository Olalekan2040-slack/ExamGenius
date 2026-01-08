"""
ML-based Physics Question Tagging System
Automatically tags physics questions with correct topics and subtopics from syllabus
"""

import psycopg2
import re
from collections import defaultdict
from typing import List, Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Database configuration
DB_CONFIG = {
    'dbname': 'ExamgeniusDB',
    'user': 'postgres',
    'password': 'Policewomen@007',
    'host': 'localhost',
    'port': 5432
}

# Physics Syllabus Structure
PHYSICS_SYLLABUS = {
    "Measurements and Units": {
        "subtopics": [
            "Length, area, and volume",
            "Mass",
            "Time",
            "Fundamental and derived quantities and units",
            "Dimensions",
            "Limitations of measurements"
        ],
        "keywords": ["measurement", "unit", "length", "area", "volume", "mass", "time", "metre", "vernier", 
                    "micrometer", "dimension", "fundamental", "derived", "accuracy", "error", "precision",
                    "calibration", "gauge", "scale", "SI unit"]
    },
    "Scalars and Vectors": {
        "subtopics": [
            "Scalar quantities",
            "Vector quantities",
            "Vector addition, resolution, and resultant"
        ],
        "keywords": ["scalar", "vector", "magnitude", "direction", "resultant", "resolution", "component",
                    "addition", "displacement", "velocity", "force vector", "parallelogram", "triangle law"]
    },
    "Motion": {
        "subtopics": [
            "Types of motion",
            "Causes and effects of motion",
            "Relative motion",
            "Equations of motion",
            "Motion under gravity",
            "Projectiles"
        ],
        "keywords": ["motion", "velocity", "acceleration", "displacement", "speed", "distance", "uniform",
                    "projectile", "trajectory", "gravity", "free fall", "equations of motion", "kinematics",
                    "linear motion", "circular motion", "oscillatory", "relative motion", "range", "height"]
    },
    "Equilibrium of Forces": {
        "subtopics": [
            "Newton's laws of motion",
            "Equilibrium",
            "Centre of gravity and stability",
            "Simple harmonic motion"
        ],
        "keywords": ["newton", "force", "equilibrium", "inertia", "momentum", "reaction", "centre of gravity",
                    "stability", "moment", "torque", "couple", "simple harmonic", "SHM", "pendulum", 
                    "oscillation", "amplitude", "period", "frequency", "spring"]
    },
    "Work, Energy, and Power": {
        "subtopics": [
            "Work done",
            "Energy",
            "Power",
            "Energy transformations"
        ],
        "keywords": ["work", "energy", "power", "kinetic", "potential", "conservation", "joule", "watt",
                    "efficiency", "transformation", "mechanical energy", "gravitational potential"]
    },
    "Friction": {
        "subtopics": [
            "Static and dynamic friction",
            "Coefficient of friction",
            "Advantages and disadvantages"
        ],
        "keywords": ["friction", "static", "dynamic", "kinetic", "coefficient", "rough surface", "smooth",
                    "frictional force", "limiting friction", "sliding"]
    },
    "Simple Machines": {
        "subtopics": [
            "Types",
            "Mechanical advantage, velocity ratio, efficiency"
        ],
        "keywords": ["machine", "lever", "pulley", "inclined plane", "wheel and axle", "screw", "wedge",
                    "mechanical advantage", "velocity ratio", "efficiency", "load", "effort"]
    },
    "Elasticity": {
        "subtopics": [
            "Elastic properties",
            "Young's modulus, stress, strain"
        ],
        "keywords": ["elasticity", "hooke", "stress", "strain", "young's modulus", "elastic limit",
                    "deformation", "spring constant", "extension", "compression", "elastic material"]
    },
    "Pressure": {
        "subtopics": [
            "Atmospheric pressure",
            "Pressure in liquids",
            "Upthrust and flotation"
        ],
        "keywords": ["pressure", "atmospheric", "pascal", "archimedes", "upthrust", "buoyancy", "flotation",
                    "density", "hydraulic", "barometer", "manometer", "liquid pressure", "depth"]
    },
    "Liquids at Rest": {
        "subtopics": [
            "Surface tension",
            "Viscosity",
            "Capillarity"
        ],
        "keywords": ["surface tension", "viscosity", "capillarity", "cohesion", "adhesion", "meniscus",
                    "liquid", "fluid", "droplet"]
    },
    "Temperature and Thermometers": {
        "subtopics": [
            "Temperature scales",
            "Thermometers"
        ],
        "keywords": ["temperature", "thermometer", "celsius", "fahrenheit", "kelvin", "scale", "calibration",
                    "clinical", "mercury", "alcohol thermometer"]
    },
    "Thermal Expansion": {
        "subtopics": [
            "Expansion of solids, liquids, gases",
            "Anomalous expansion of water",
            "Applications"
        ],
        "keywords": ["expansion", "thermal", "linear", "area", "volume", "coefficient", "anomalous", "water",
                    "contract", "bimetallic strip"]
    },
    "Heat Transfer": {
        "subtopics": [
            "Conduction, convection, radiation",
            "Heat capacity and specific heat"
        ],
        "keywords": ["heat", "conduction", "convection", "radiation", "conductor", "insulator", "thermal",
                    "heat capacity", "specific heat", "calorimeter", "temperature"]
    },
    "Gas Laws": {
        "subtopics": [
            "Boyle's, Charles's, Pressure laws",
            "Ideal gas equation"
        ],
        "keywords": ["boyle", "charles", "pressure law", "gay-lussac", "ideal gas", "PV", "temperature",
                    "volume", "gas law", "kelvin", "absolute"]
    },
    "Quantity of Heat": {
        "subtopics": [
            "Latent heat",
            "Phase changes"
        ],
        "keywords": ["latent heat", "fusion", "vaporization", "melting", "boiling", "evaporation",
                    "condensation", "phase change", "specific latent heat"]
    },
    "Waves": {
        "subtopics": [
            "Properties of waves",
            "Types of waves",
            "Wave equation"
        ],
        "keywords": ["wave", "amplitude", "wavelength", "frequency", "period", "transverse", "longitudinal",
                    "progressive", "stationary", "wave speed", "crest", "trough", "compression", "rarefaction"]
    },
    "Sound Waves": {
        "subtopics": [
            "Sources and propagation",
            "Pitch, loudness, quality",
            "Echoes, reverberation",
            "Vibrations in strings and pipes"
        ],
        "keywords": ["sound", "pitch", "loudness", "quality", "echo", "reverberation", "acoustics",
                    "string", "pipe", "vibration", "resonance", "fundamental", "overtone", "harmonic"]
    },
    "Propagation of Sound Waves": {
        "subtopics": [
            "Speed of sound",
            "Factors affecting speed"
        ],
        "keywords": ["sound speed", "propagation", "medium", "air", "solid", "liquid", "sonic"]
    },
    "Light Energy": {
        "subtopics": [
            "Sources",
            "Propagation",
            "Shadows and eclipses"
        ],
        "keywords": ["light", "luminous", "non-luminous", "source", "rectilinear", "shadow", "eclipse",
                    "umbra", "penumbra", "ray", "beam"]
    },
    "Reflection of Light": {
        "subtopics": [
            "Laws of reflection",
            "Plane and curved mirrors",
            "Image formation"
        ],
        "keywords": ["reflection", "mirror", "plane", "concave", "convex", "spherical", "image", "virtual",
                    "real", "focal length", "radius of curvature", "magnification", "law of reflection"]
    },
    "Refraction of Light": {
        "subtopics": [
            "Laws of refraction",
            "Refractive index",
            "Lenses",
            "Optical instruments"
        ],
        "keywords": ["refraction", "lens", "refractive index", "snell", "converging", "diverging", "focal",
                    "optical", "microscope", "telescope", "camera", "prism", "total internal reflection",
                    "critical angle", "power of lens", "dioptre"]
    },
    "Dispersion of Light and Colours": {
        "subtopics": [
            "Primary/secondary colours",
            "Rainbow formation"
        ],
        "keywords": ["dispersion", "spectrum", "colour", "rainbow", "prism", "primary", "secondary",
                    "wavelength", "red", "violet", "ROYGBIV"]
    },
    "Fields": {
        "subtopics": [
            "Gravitational field",
            "Electric field",
            "Magnetic field"
        ],
        "keywords": ["field", "gravitational", "electric", "magnetic", "field lines", "field strength",
                    "newton law of gravitation", "field pattern"]
    },
    "Electrostatics": {
        "subtopics": [
            "Charges",
            "Electric field lines",
            "Capacitors"
        ],
        "keywords": ["electrostatic", "charge", "electron", "proton", "capacitor", "capacitance", "farad",
                    "charging", "discharging", "coulomb", "electric field", "potential difference"]
    },
    "Current Electricity": {
        "subtopics": [
            "Electric current",
            "Potential difference",
            "Resistance",
            "Electrical energy and power"
        ],
        "keywords": ["current", "voltage", "resistance", "ohm", "circuit", "series", "parallel", "ampere",
                    "volt", "resistor", "electrical power", "energy", "watt", "kilowatt-hour", "EMF"]
    },
    "Electrical Measuring Instruments": {
        "subtopics": [
            "Ammeter, voltmeter, etc."
        ],
        "keywords": ["ammeter", "voltmeter", "galvanometer", "ohmmeter", "multimeter", "shunt", "multiplier",
                    "measuring instrument"]
    },
    "Magnetism": {
        "subtopics": [
            "Magnetic fields",
            "Magnetic materials"
        ],
        "keywords": ["magnet", "magnetic", "pole", "north", "south", "field", "ferromagnetic", "domain",
                    "attraction", "repulsion", "magnetic material", "bar magnet", "horseshoe"]
    },
    "Electromagnetic Induction": {
        "subtopics": [
            "Faraday's law",
            "Lenz's law",
            "Transformers",
            "Inductance"
        ],
        "keywords": ["electromagnetic", "induction", "faraday", "lenz", "transformer", "induced", "EMF",
                    "flux", "generator", "alternator", "step-up", "step-down", "primary", "secondary"]
    },
    "Alternating Current (A.C.) Circuits": {
        "subtopics": [
            "A.C. sources",
            "Peak and RMS values",
            "Series circuits"
        ],
        "keywords": ["alternating current", "AC", "DC", "peak", "RMS", "frequency", "cycle", "sine wave",
                    "capacitor", "inductor", "resistor", "impedance", "reactance"]
    },
    "Atomic and Nuclear Physics": {
        "subtopics": [
            "Structure of the atom",
            "Radioactivity",
            "Nuclear reactions",
            "Half-life"
        ],
        "keywords": ["atom", "nucleus", "electron", "proton", "neutron", "radioactive", "alpha", "beta",
                    "gamma", "decay", "half-life", "fission", "fusion", "isotope", "radiation"]
    },
    "Simple Models of the Atom": {
        "subtopics": [
            "Bohr's model",
            "Energy levels"
        ],
        "keywords": ["bohr", "atomic model", "energy level", "quantum", "orbit", "shell", "electron configuration",
                    "ground state", "excited state"]
    },
    "Modern Physics": {
        "subtopics": [
            "X-rays",
            "Photoelectric effect",
            "Wave-particle duality"
        ],
        "keywords": ["x-ray", "photoelectric", "photon", "einstein", "planck", "quantum", "wave-particle",
                    "duality", "electromagnetic radiation", "threshold frequency", "work function"]
    }
}


class PhysicsQuestionTagger:
    """ML-based tagger for physics questions"""
    
    def __init__(self):
        self.conn = None
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=1000,
            stop_words='english',
            lowercase=True
        )
        self.topic_vectors = {}
        self.topic_names = list(PHYSICS_SYLLABUS.keys())
        
    def connect_db(self):
        """Connect to PostgreSQL database"""
        self.conn = psycopg2.connect(**DB_CONFIG)
        print("✓ Connected to database")
        
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        if not text:
            return ""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep important physics symbols
        text = re.sub(r'[^\w\s\-\+\=\(\)\[\]\/\*\.]', ' ', text)
        return text.lower().strip()
    
    def build_topic_profiles(self):
        """Build TF-IDF profiles for each topic"""
        print("\n=== Building Topic Profiles ===")
        
        # Create comprehensive text for each topic
        topic_texts = []
        for topic, data in PHYSICS_SYLLABUS.items():
            # Combine topic name, subtopics, and keywords
            text_components = [
                topic,
                " ".join(data["subtopics"]),
                " ".join(data["keywords"])
            ]
            topic_text = " ".join(text_components)
            topic_texts.append(self.preprocess_text(topic_text))
        
        # Fit vectorizer on topic texts
        self.topic_vectors = self.vectorizer.fit_transform(topic_texts)
        print(f"✓ Built profiles for {len(self.topic_names)} topics")
        
    def predict_topic(self, question_text: str, threshold: float = 0.1) -> Tuple[str, float, str]:
        """Predict topic and subtopic for a question"""
        # Preprocess question
        clean_question = self.preprocess_text(question_text)
        
        # Vectorize question
        question_vector = self.vectorizer.transform([clean_question])
        
        # Calculate similarity with all topics
        similarities = cosine_similarity(question_vector, self.topic_vectors)[0]
        
        # Get best match
        best_idx = np.argmax(similarities)
        best_score = similarities[best_idx]
        best_topic = self.topic_names[best_idx]
        
        # Determine subtopic using keyword matching
        subtopic = self.find_best_subtopic(clean_question, best_topic)
        
        if best_score < threshold:
            return None, 0.0, None
            
        return best_topic, best_score, subtopic
    
    def find_best_subtopic(self, question_text: str, topic: str) -> str:
        """Find the most relevant subtopic for a question"""
        subtopics = PHYSICS_SYLLABUS[topic]["subtopics"]
        
        # Score each subtopic based on keyword presence
        best_subtopic = subtopics[0]  # Default to first
        best_score = 0
        
        for subtopic in subtopics:
            score = 0
            subtopic_keywords = self.preprocess_text(subtopic).split()
            
            for keyword in subtopic_keywords:
                if keyword in question_text:
                    score += 1
            
            if score > best_score:
                best_score = score
                best_subtopic = subtopic
        
        return best_subtopic
    
    def fetch_physics_questions(self) -> List[Dict]:
        """Fetch all physics questions from database"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT id, question, topic, subtopic
            FROM questions
            WHERE subject = 'Physics'
            ORDER BY id
        """)
        
        questions = []
        for row in cursor.fetchall():
            questions.append({
                'id': row[0],
                'question': row[1],
                'current_topic': row[2],
                'current_subtopic': row[3]
            })
        
        cursor.close()
        return questions
    
    def update_question_tags(self, question_id: str, topic: str, subtopic: str):
        """Update a question's topic and subtopic in database"""
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE questions
            SET topic = %s, subtopic = %s
            WHERE id = %s
        """, (topic, subtopic, question_id))
        cursor.close()
    
    def tag_all_questions(self):
        """Main function to tag all physics questions"""
        print("\n=== Fetching Physics Questions ===")
        questions = self.fetch_physics_questions()
        print(f"✓ Found {len(questions)} physics questions")
        
        print("\n=== Tagging Questions ===")
        stats = {
            'total': len(questions),
            'tagged': 0,
            'skipped': 0,
            'updated': 0
        }
        
        topic_distribution = defaultdict(int)
        
        for i, q in enumerate(questions, 1):
            question_text = q['question']
            
            if not question_text:
                stats['skipped'] += 1
                continue
            
            # Predict topic and subtopic
            topic, confidence, subtopic = self.predict_topic(question_text)
            
            if topic:
                # Update database
                self.update_question_tags(q['id'], topic, subtopic)
                stats['tagged'] += 1
                stats['updated'] += 1
                topic_distribution[topic] += 1
                
                # Progress indicator
                if i % 50 == 0:
                    print(f"  Processed {i}/{len(questions)} questions...")
            else:
                stats['skipped'] += 1
        
        # Commit all changes
        self.conn.commit()
        
        # Print results
        print("\n=== Tagging Complete ===")
        print(f"Total questions: {stats['total']}")
        print(f"Successfully tagged: {stats['tagged']}")
        print(f"Skipped: {stats['skipped']}")
        print(f"Database updated: {stats['updated']}")
        
        print("\n=== Topic Distribution ===")
        for topic, count in sorted(topic_distribution.items(), key=lambda x: x[1], reverse=True):
            print(f"  {topic}: {count} questions")
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            print("\n✓ Database connection closed")


def main():
    """Main execution function"""
    print("=" * 60)
    print("Physics Question Tagging System")
    print("Using ML-based topic classification")
    print("=" * 60)
    
    tagger = PhysicsQuestionTagger()
    
    try:
        # Connect to database
        tagger.connect_db()
        
        # Build topic profiles
        tagger.build_topic_profiles()
        
        # Tag all questions
        tagger.tag_all_questions()
        
        print("\n✅ All physics questions have been tagged successfully!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        tagger.close()


if __name__ == "__main__":
    main()
