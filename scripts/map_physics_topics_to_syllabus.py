"""
Map Physics questions to UTME 2025 Syllabus topics (39 topics).
This script updates the 'topic' field to match official syllabus structure.
"""

import sqlite3

# UTME 2025 Physics Syllabus - 39 Topics with keywords for mapping
SYLLABUS_TOPICS = {
    "1. Measurements and Units": {
        "keywords": ["measurement", "vernier", "micrometer", "caliper", "metre rule", 
                     "dimension", "significant figure", "standard form", "error", 
                     "fundamental quantities", "derived quantities", "units", "accuracy",
                     "precision", "displacement", "distance"],
        "subtopics": ["Measurement techniques", "Physical quantities"]
    },
    "2. Scalars and Vectors": {
        "keywords": ["scalar", "vector", "resultant", "resolution", "relative velocity",
                     "magnitude", "direction", "graphical method"],
        "subtopics": []
    },
    "3. Motion": {
        "keywords": ["velocity", "acceleration", "speed", "motion", "equations of motion",
                     "free fall", "gravity", "projectile", "range", "trajectory",
                     "newton's law", "inertia", "momentum", "impulse", "collision",
                     "circular motion", "centripetal", "centrifugal", "angular",
                     "simple harmonic", "s.h.m", "oscillation", "pendulum", "amplitude",
                     "period", "frequency", "vibration", "resonance"],
        "subtopics": ["Linear motion and equations", "Projectile motion", "Circular motion",
                      "Newton's laws of motion", "Momentum and impulse"]
    },
    "4. Gravitational Field": {
        "keywords": ["gravitational", "universal gravitation", "escape velocity", 
                     "parking orbit", "weightlessness", "satellite", "g variation",
                     "mass and weight"],
        "subtopics": ["Gravitational field"]
    },
    "5. Equilibrium of Forces": {
        "keywords": ["equilibrium", "moment", "torque", "couple", "lami", "polygon of forces",
                     "triangle of forces", "resultant", "equilibrant", "centre of gravity",
                     "stability", "stable", "unstable", "neutral", "balance", "lever"],
        "subtopics": ["Friction and equilibrium"]
    },
    "6. Work, Energy, and Power": {
        "keywords": ["work done", "energy", "power", "kinetic energy", "potential energy",
                     "conservation of energy", "renewable", "non-renewable", "solar",
                     "nuclear energy", "joule", "watt", "efficiency"],
        "subtopics": ["Work, energy and power"]
    },
    "7. Friction": {
        "keywords": ["friction", "coefficient", "static friction", "dynamic friction",
                     "limiting friction", "viscosity", "terminal velocity", "stoke"],
        "subtopics": ["Friction and equilibrium"]
    },
    "8. Simple Machines": {
        "keywords": ["machine", "lever", "pulley", "inclined plane", "wheel and axle",
                     "mechanical advantage", "velocity ratio", "efficiency"],
        "subtopics": ["Simple machines"]
    },
    "9. Elasticity": {
        "keywords": ["elastic", "hooke", "young's modulus", "spring", "extension",
                     "compression", "strain", "stress", "elastic limit", "yield point"],
        "subtopics": []
    },
    "10. Pressure": {
        "keywords": ["pressure", "atmospheric", "barometer", "manometer", "pascal",
                     "altimeter", "hydraulic"],
        "subtopics": ["Density and pressure"]
    },
    "11. Liquids at Rest": {
        "keywords": ["density", "relative density", "upthrust", "archimedes", "flotation",
                     "buoyancy", "hydrometer", "ship"],
        "subtopics": ["Density and pressure"]
    },
    "12. Temperature and Its Measurement": {
        "keywords": ["temperature", "thermometer", "celsius", "kelvin", "fahrenheit",
                     "thermometric", "calibration", "fixed point"],
        "subtopics": ["Temperature and heat"]
    },
    "13. Thermal Expansion": {
        "keywords": ["expansion", "expansivity", "linear expansion", "volume expansion",
                     "area expansion", "bimetallic", "anomalous expansion"],
        "subtopics": ["Thermal expansion"]
    },
    "14. Gas Laws": {
        "keywords": ["boyle", "charles", "pressure law", "gas law", "ideal gas",
                     "absolute zero", "pv=nrt", "van der waals", "isothermal", "isobaric"],
        "subtopics": ["Gas laws"]
    },
    "15. Quantity of Heat": {
        "keywords": ["heat capacity", "specific heat", "method of mixtures", 
                     "calorimeter", "newton's law of cooling"],
        "subtopics": ["Temperature and heat"]
    },
    "16. Change of State": {
        "keywords": ["latent heat", "fusion", "vaporization", "melting", "boiling",
                     "evaporation", "condensation", "freezing", "sublimation"],
        "subtopics": ["Change of state"]
    },
    "17. Vapours": {
        "keywords": ["vapour", "saturated", "unsaturated", "s.v.p", "dew point",
                     "humidity", "relative humidity", "hygrometer", "dew", "mist", "fog"],
        "subtopics": []
    },
    "18. Structure of Matter and Kinetic Theory": {
        "keywords": ["molecule", "atom", "brownian motion", "diffusion", "surface tension",
                     "capillarity", "adhesion", "cohesion", "kinetic theory", "meniscus"],
        "subtopics": ["Surface tension"]
    },
    "19. Heat Transfer": {
        "keywords": ["conduction", "convection", "radiation", "thermal conductivity",
                     "temperature gradient", "thermos flask", "heat flux", "black body",
                     "land breeze", "sea breeze", "engine"],
        "subtopics": ["Heat transfer methods"]
    },
    "20. Waves": {
        "keywords": ["wave", "wavelength", "frequency", "amplitude", "progressive wave",
                     "stationary wave", "standing wave", "transverse", "longitudinal",
                     "mechanical wave", "electromagnetic wave", "phase", "superposition",
                     "interference", "diffraction", "doppler", "beat"],
        "subtopics": ["Wave properties and types"]
    },
    "21. Propagation of Sound Waves": {
        "keywords": ["sound", "echo", "reverberation", "speed of sound", "audible"],
        "subtopics": ["Sound waves"]
    },
    "22. Characteristics of Sound Waves": {
        "keywords": ["pitch", "loudness", "quality", "musical note", "noise", "overtone",
                     "harmonic", "fundamental frequency", "resonance", "vibrating string",
                     "pipe", "organ pipe"],
        "subtopics": ["Sound waves"]
    },
    "23. Light Energy": {
        "keywords": ["light source", "luminous", "non-luminous", "shadow", "eclipse",
                     "umbra", "penumbra", "pinhole camera", "rectilinear propagation"],
        "subtopics": []
    },
    "24. Reflection of Light at Plane and Curved Surfaces": {
        "keywords": ["reflection", "mirror", "plane mirror", "concave", "convex mirror",
                     "image", "magnification", "focal length", "periscope", "kaleidoscope"],
        "subtopics": ["Light reflection"]
    },
    "25. Refraction of Light Through Plane and Curved Surfaces": {
        "keywords": ["refraction", "snell", "refractive index", "critical angle",
                     "total internal reflection", "optical fibre", "prism", "lens",
                     "converging", "diverging", "real depth", "apparent depth", "mirage"],
        "subtopics": ["Light refraction", "Lenses and optical instruments"]
    },
    "26. Optical Instruments": {
        "keywords": ["microscope", "telescope", "camera", "projector", "eye", 
                     "power of lens", "angular magnification", "near point", "far point",
                     "myopia", "hypermetropia", "short sight", "long sight", "spectacle"],
        "subtopics": ["Lenses and optical instruments"]
    },
    "27. Dispersion of Light and Colours": {
        "keywords": ["dispersion", "spectrum", "colour", "primary colour", "secondary colour",
                     "rainbow", "filter", "electromagnetic spectrum", "infrared", "ultraviolet",
                     "x-ray", "gamma", "radio wave", "microwave"],
        "subtopics": []
    },
    "28. Electrostatics": {
        "keywords": ["electrostatic", "charge", "coulomb", "electric field", "potential",
                     "electroscope", "induction", "friction charging", "lightning", "earthing"],
        "subtopics": ["Electric charges and fields"]
    },
    "29. Capacitors": {
        "keywords": ["capacitor", "capacitance", "farad", "parallel plate", "dielectric",
                     "energy stored", "series capacitor", "parallel capacitor"],
        "subtopics": ["Electric charges and fields"]
    },
    "30. Electric Cells": {
        "keywords": ["cell", "battery", "voltaic", "daniel cell", "leclanche", "lead-acid",
                     "accumulator", "e.m.f", "internal resistance", "primary cell", 
                     "secondary cell", "dry cell"],
        "subtopics": ["Current electricity"]
    },
    "31. Current Electricity": {
        "keywords": ["current", "ohm", "resistance", "resistor", "resistivity", "conductivity",
                     "meter bridge", "potentiometer", "kirchhoff", "series circuit",
                     "parallel circuit", "p.d", "voltage", "ammeter", "voltmeter", "galvanometer"],
        "subtopics": ["Current electricity"]
    },
    "32. Electrical Energy and Power": {
        "keywords": ["electrical power", "electrical energy", "kilowatt", "kwh", "fuse",
                     "wiring", "heating effect", "transmission", "transformer"],
        "subtopics": ["Current electricity"]
    },
    "33. Magnets and Magnetic Fields": {
        "keywords": ["magnet", "magnetic field", "magnetic flux", "flux density", 
                     "soft iron", "steel", "earth's magnetic", "declination", "dip",
                     "compass", "solenoid", "domain"],
        "subtopics": ["Magnetic fields"]
    },
    "34. Force on a Current-Carrying Conductor in a Magnetic Field": {
        "keywords": ["fleming", "motor", "electromagnetic", "moving coil", "galvanometer",
                     "ammeter conversion", "voltmeter conversion", "shunt", "multiplier"],
        "subtopics": ["Magnetic fields", "Electromagnetic induction"]
    },
    "35. Electromagnetic Induction": {
        "keywords": ["faraday", "lenz", "induced emf", "generator", "dynamo", "transformer",
                     "induction coil", "inductance", "eddy current", "a.c. generator"],
        "subtopics": ["Electromagnetic induction"]
    },
    "36. Simple A.C. Circuits": {
        "keywords": ["a.c", "alternating current", "r.m.s", "peak value", "reactance",
                     "impedance", "phase angle", "power factor", "resonance frequency",
                     "r-l-c", "capacitive", "inductive"],
        "subtopics": []
    },
    "37. Conduction of Electricity Through Liquids and Gases": {
        "keywords": ["electrolysis", "electrolyte", "electroplating", "faraday's law",
                     "cathode", "anode", "ion", "discharge tube", "gas discharge"],
        "subtopics": []
    },
    "38. Elementary Modern Physics": {
        "keywords": ["atomic model", "bohr", "rutherford", "energy level", "spectrum",
                     "photoelectric", "thermionic", "work function", "threshold frequency",
                     "stopping potential", "x-ray", "radioactive", "radioactivity",
                     "half-life", "decay", "alpha", "beta", "gamma", "fission", "fusion",
                     "binding energy", "mass defect", "isotope", "nucleus", "nuclear",
                     "wave-particle", "uncertainty", "de broglie"],
        "subtopics": ["Atomic structure", "Radioactivity", "Nuclear reactions"]
    },
    "39. Introductory Electronics": {
        "keywords": ["semiconductor", "diode", "transistor", "rectification", "amplification",
                     "p-type", "n-type", "doping", "hole", "electron carrier", "band gap",
                     "intrinsic", "extrinsic", "junction"],
        "subtopics": []
    }
}

def find_best_topic(question_text, current_subtopic):
    """Find the best matching syllabus topic based on question text and subtopic."""
    question_lower = question_text.lower()
    subtopic_lower = current_subtopic.lower() if current_subtopic else ""
    
    best_match = None
    best_score = 0
    
    for topic_name, topic_data in SYLLABUS_TOPICS.items():
        score = 0
        
        # Check if current subtopic matches any in this topic
        for sub in topic_data["subtopics"]:
            if sub.lower() in subtopic_lower or subtopic_lower in sub.lower():
                score += 10
        
        # Check keywords in question text
        for keyword in topic_data["keywords"]:
            if keyword.lower() in question_lower:
                score += 2
        
        if score > best_score:
            best_score = score
            best_match = topic_name
    
    return best_match, best_score

def main():
    conn = sqlite3.connect('jamb_questions.db')
    cursor = conn.cursor()
    
    # Get all Physics questions
    cursor.execute("""
        SELECT id, topic, subtopic, question 
        FROM questions 
        WHERE subject = 'Physics'
    """)
    questions = cursor.fetchall()
    
    print(f"Processing {len(questions)} Physics questions...\n")
    
    # Track mapping stats
    topic_counts = {}
    unmapped = []
    
    for q_id, old_topic, subtopic, question_text in questions:
        new_topic, score = find_best_topic(question_text, subtopic)
        
        if new_topic and score > 0:
            # Update the topic
            cursor.execute("""
                UPDATE questions 
                SET topic = ? 
                WHERE id = ?
            """, (new_topic, q_id))
            
            topic_counts[new_topic] = topic_counts.get(new_topic, 0) + 1
        else:
            # Keep old topic if no match found
            unmapped.append((q_id, old_topic, subtopic, question_text[:80]))
    
    conn.commit()
    
    # Print results
    print("=" * 60)
    print("MAPPING RESULTS - Questions per Syllabus Topic:")
    print("=" * 60)
    
    for topic in sorted(topic_counts.keys()):
        print(f"{topic}: {topic_counts[topic]} questions")
    
    print(f"\nTotal mapped: {sum(topic_counts.values())}")
    print(f"Unmapped: {len(unmapped)}")
    
    if unmapped:
        print("\nUnmapped questions (first 10):")
        for item in unmapped[:10]:
            print(f"  ID {item[0]}: [{item[1]}] {item[2]} - {item[3]}...")
    
    conn.close()
    print("\n✓ Physics topics updated to match UTME 2025 Syllabus!")

if __name__ == "__main__":
    main()
