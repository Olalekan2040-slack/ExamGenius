"""
retag_physics_chemistry.py
--------------------------
Re-tags Chemistry and Physics questions in the PostgreSQL DB with accurate
topic and subtopic names that match the rebuilt syllabus JSONs.

Chemistry: normalises numbered topic names, merges Air/Water/Solubility,
           assigns subtopics from keyword matching.
Physics:   reclassifies 7 broad bucket topics -> 28 specific JAMB topics,
           assigns subtopics from keyword matching.

Run from project root:
    python scripts/retag_physics_chemistry.py

Flags:
    --dry-run    Print coverage report only, make no DB changes
    --subject    'Chemistry' or 'Physics' (default: both)
"""

import sys
import json
import re
import argparse
from pathlib import Path
from collections import Counter

# Add project root to path so app imports work
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.database import get_connection


# ──────────────────────────────────────────────────────────────
# CHEMISTRY MAPPINGS
# ──────────────────────────────────────────────────────────────

# Old topic name (in DB) → new canonical name
CHEMISTRY_TOPIC_RENAME = {
    "1. Separation of Mixtures and Purification": "Separation of Mixtures and Purification of Chemical Substances",
    "Separation of Mixtures and Purification": "Separation of Mixtures and Purification of Chemical Substances",
    "2. Chemical Combination": "Chemical Combination",
    "Chemical Combination": "Chemical Combination",
    "3. Kinetic Theory and Gas Laws": "Kinetic Theory of Matter and Gas Laws",
    "Kinetic Theory and Gas Laws": "Kinetic Theory of Matter and Gas Laws",
    "4. Atomic Structure and Bonding": "Atomic Structure and Bonding",
    "Atomic Structure and Bonding": "Atomic Structure and Bonding",
    # Air, Water, Solubility merge
    "5. Air": "Air, Water, Solubility",
    "Air": "Air, Water, Solubility",
    "6. Water": "Air, Water, Solubility",
    "Water": "Air, Water, Solubility",
    "7. Solubility": "Air, Water, Solubility",
    "Solubility": "Air, Water, Solubility",
    "8. Environmental Pollution": "Environmental Pollution",
    "Environmental Pollution": "Environmental Pollution",
    "9. Acids, Bases and Salts": "Acids, Bases, and Salts",
    "Acids, Bases and Salts": "Acids, Bases, and Salts",
    "Acids, Bases, and Salts": "Acids, Bases, and Salts",
    "10. Oxidation and Reduction": "Oxidation and Reduction - Redox",
    "Oxidation and Reduction": "Oxidation and Reduction - Redox",
    "11. Electrolysis": "Electrolysis",
    "Electrolysis": "Electrolysis",
    "12. Energy Changes": "Energy Changes",
    "Energy Changes": "Energy Changes",
    "13. Rates of Chemical Reaction": "Rates of Chemical Reaction",
    "Rates of Chemical Reaction": "Rates of Chemical Reaction",
    "14. Chemical Equilibrium": "Chemical Equilibrium",
    "Chemical Equilibrium": "Chemical Equilibrium",
    "15. Non-Metals and Their Compounds": "Non-metals and Their Compounds",
    "Non-Metals and Their Compounds": "Non-metals and Their Compounds",
    "Non-metals and Their Compounds": "Non-metals and Their Compounds",
    "16. Metals and Their Compounds": "Metals and Their Compounds",
    "Metals and Their Compounds": "Metals and Their Compounds",
    "17. Organic Compounds": "Organic Compounds",
    "Organic Compounds": "Organic Compounds",
    "18. Chemistry and Industry": "Chemistry and Industry",
    "Chemistry and Industry": "Chemistry and Industry",
}

# Subtopic keyword rules for Chemistry: (canonical_topic, subtopic_name) keyed by keywords
CHEMISTRY_SUBTOPIC_RULES = {
    "Separation of Mixtures and Purification of Chemical Substances": [
        (["pure substance", "purity", "melting point", "boiling point", "criterion"], "Pure and Impure Substances"),
        (["distillat", "filtrat", "chromatograph", "sublim", "crystalli", "solvent extract", "evaporat"], "Separation Techniques"),
        (["purif"], "Purification Methods"),
    ],
    "Chemical Combination": [
        (["conservation of mass", "definite proportion", "multiple proportion", "law of"], "Laws of Chemical Combination"),
        (["mole", "avogadro", "molar mass", "stoichiometr", "empirical formula", "molecular formula",
          "percentage composition", "mole ratio", "molar"], "Mole Concept and Stoichiometry"),
    ],
    "Kinetic Theory of Matter and Gas Laws": [
        (["boyle", "charles", "graham", "dalton", "partial pressure", "gas law", "pressure law", "pv=nrt",
          "pv = nrt", "ideal gas"], "Gas Laws"),
        (["kinetic", "brownian", "diffusion", "state of matter", "solid", "liquid", "gas"], "Kinetic Theory and States of Matter"),
        (["general gas equation", "pv/t", "absolute zero", "pv = nrt"], "Ideal Gas Equation"),
    ],
    "Atomic Structure and Bonding": [
        (["proton", "neutron", "electron", "atomic number", "mass number", "isotope", "electron config",
          "electronic configuration", "shell", "orbital", "atom"], "Atomic Structure"),
        (["ionic bond", "covalent bond", "metallic bond", "hydrogen bond", "van der waals", "bond"], "Types of Chemical Bonding"),
        (["shape", "tetrahedral", "linear", "polar", "electronegativity", "molecular shape", "bent",
          "pyramidal", "intermolecular"], "Molecular Shapes and Intermolecular Forces"),
    ],
    "Air, Water, Solubility": [
        (["oxygen", "nitrogen", "air", "rust", "composition of air", "burning"], "Composition and Properties of Air"),
        (["hard water", "soft water", "water purif", "water treatment", "distilled water", "water supply",
          "temporary hardness", "permanent hardness"], "Water and Its Properties"),
        (["solub", "saturated", "unsaturated", "supersaturated", "solubility curve"], "Solubility and Solutions"),
    ],
    "Environmental Pollution": [
        (["acid rain", "greenhouse", "pollutant", "pollution", "carbon monoxide", "sulfur dioxide",
          "ozone", "eutrophication", "toxic", "effluent"], "Types and Sources of Pollution"),
        (["effect of pollution", "health", "control pollution", "legislation", "environmental impact",
          "waste disposal"], "Effects and Control of Pollution"),
    ],
    "Acids, Bases, and Salts": [
        (["ph", "indicator", "acid", "base", "alkali", "lewis acid", "bronsted", "arrhenius"], "Acids and Bases"),
        (["salt", "neutrali", "titrat", "normal salt", "acidic salt", "basic salt", "preparation of salt",
          "making salts"], "Salts and Neutralization"),
        (["buffer", "hydrolysis", "hydrolyse"], "Buffer Solutions and Hydrolysis"),
    ],
    "Oxidation and Reduction - Redox": [
        (["oxidation state", "oxidation number", "oxidising agent", "reducing agent", "electron transfer",
          "oxidised", "reduced", "redox", "electron loss", "electron gain"], "Oxidation and Reduction Concepts"),
        (["half equation", "balance redox", "ion-electron", "ionic equation", "bleach", "rusting",
          "combustion"], "Redox Reactions and Balancing"),
    ],
    "Electrolysis": [
        (["electrode", "anode", "cathode", "electrolyte", "electrolysis", "electroplat", "ion movement",
          "electrolytic cell", "electrochemical cell"], "Principles of Electrolysis"),
        (["faraday", "mass deposit", "volume of gas", "coulomb", "current", "96500"], "Faraday's Laws and Applications"),
    ],
    "Energy Changes": [
        (["exotherm", "endotherm", "activation energy", "catalyst", "enthalpy", "energy profile",
          "energy diagram", "energy level"], "Exothermic and Endothermic Reactions"),
        (["hess", "bond energy", "standard enthalpy", "heat of combustion", "heat of formation",
          "heat of reaction", "enthalpy chang", "calorimetr"], "Enthalpy Changes and Hess Law"),
    ],
    "Rates of Chemical Reaction": [
        (["concentration", "temperature effect", "surface area", "catalyst effect", "rate of reaction",
          "rate-time", "collision frequency"], "Factors Affecting Reaction Rates"),
        (["collision theory", "rate constant", "order of reaction", "rate equation", "activation energy",
          "rate expression", "rate determin"], "Collision Theory and Rate Equations"),
    ],
    "Chemical Equilibrium": [
        (["le chatelier", "dynamic equilibrium", "reversible", "equilibrium position", "shift equilibrium"],
         "Dynamic Equilibrium and Le Chatelier Principle"),
        (["kc", "kp", "equilibrium constant", "equilibrium expression"], "Equilibrium Constants"),
    ],
    "Non-metals and Their Compounds": [
        (["halogen", "chlorine", "bromine", "iodine", "fluorine", "hydrogen chloride", "hydrochloric",
          "bleach", "disinfect", "halide"], "Halogens and Their Compounds"),
        (["nitrogen", "ammonia", "nitrogen oxide", "oxygen", "carbon", "diamond", "graphite",
          "fullerene", "nitrogen cycle", "allotrope of carbon"], "Oxygen, Nitrogen, and Carbon Compounds"),
        (["sulfur", "sulphur", "sulfuric acid", "sulphuric acid", "contact process", "phosphorus",
          "allotrope of s"], "Sulfur and Phosphorus Compounds"),
    ],
    "Metals and Their Compounds": [
        (["reactivity series", "displacement", "metal react", "metal with acid", "metal with water",
          "metal property", "physical property of metal"], "Properties and Reactivity of Metals"),
        (["blast furnace", "extract", "smelting", "electrolytic extract", "aluminium extract",
          "iron extract", "iron ore"], "Extraction of Metals"),
        (["alloy", "steel", "brass", "bronze", "corrosion", "aluminium compound", "calcium compound",
          "sodium compound", "iron compound"], "Metal Compounds and Alloys"),
    ],
    "Organic Compounds": [
        (["alkane", "alkene", "alkyne", "hydrocarbon", "iupac", "homologous series", "isomer",
          "methane", "ethane", "ethene", "ethyne", "propane", "butane", "benzene",
          "arene", "aromatic"], "Hydrocarbons"),
        (["alcohol", "aldehyde", "ketone", "carboxylic acid", "ester", "esterification",
          "saponification", "functional group", "methanol", "ethanol", "acetic acid",
          "ethanoic acid"], "Functional Group Compounds"),
        (["addition reaction", "substitution reaction", "elimination", "condensation react",
          "fermentation", "cracking", "combustion of organic"], "Reactions of Organic Compounds"),
        (["polymer", "polymerisation", "plastic", "nylon", "polyethene", "crude oil",
          "fractional distillation of oil", "petroleum", "refining"], "Polymers and Industrial Organic Chemistry"),
    ],
    "Chemistry and Industry": [
        (["haber process", "contact process", "solvay", "industrial production", "industrial process",
          "manufacture of ammonia", "manufacture of sulfuric", "manufacturing"], "Industrial Processes"),
        (["petroleum", "crude oil", "kerosene", "diesel", "petrol refin", "cracking petroleum",
          "reforming"], "Petroleum and Its Products"),
        (["fertiliser", "fertilizer", "biotechnology", "microorganism", "industrial microb",
          "biogas", "ethanol production", "ferment"], "Biotechnology and Fertilizers"),
    ],
}


# ──────────────────────────────────────────────────────────────
# PHYSICS MAPPINGS
# ──────────────────────────────────────────────────────────────

# Original broad topic + subtopic  → final specific topic
# Priority mapping: use the existing subtopic field as primary hint
PHYSICS_SUBTOPIC_HINT = {
    "linear motion and equations": "Motion",
    "projectile motion": "Motion",
    "circular motion": "Motion",
    "motion graphs": "Motion",
    "work, energy and power": "Work, Energy, and Power",
    "work energy and power": "Work, Energy, and Power",
    "temperature and heat": None,   # ambiguous — use keyword scoring
    "wave properties and types": None,  # ambiguous
    "electric charges and fields": None,  # ambiguous
    "atomic structure": "Atomic and Nuclear Physics",
    "light reflection": "Reflection of Light",
    "density and pressure": "Pressure",
    "friction and equilibrium": "Friction",
    "current electricity": "Current Electricity",
    "sound waves": "Sound Waves",
    "change of state": "Quantity of Heat",
    "magnetic fields": "Magnetism",
    "newton's laws of motion": "Equilibrium of Forces",
    "newtons laws of motion": "Equilibrium of Forces",
    "heat transfer methods": "Heat Transfer",
    "gravitational field": "Electrostatics",   # rare, best fit
    "momentum and impulse": "Equilibrium of Forces",
    "light refraction": "Refraction of Light",
    "lenses and optical instruments": "Refraction of Light",
    "electromagnetic induction": "Electromagnetic Induction",
    "physical quantities": "Measurements and Units",
    "measurement techniques": "Measurements and Units",
    "measurement": "Measurements and Units",
    "thermal expansion": "Thermal Expansion",
    "simple machines": "Simple Machines",
    "nuclear reactions": "Atomic and Nuclear Physics",
    "radioactivity": "Atomic and Nuclear Physics",
    "surface tension": "Liquids at Rest",
    "gas laws": "Gas Laws",
    "capillarity": "Liquids at Rest",
    "archimedes": "Liquids at Rest",
    "upthrust": "Liquids at Rest",
    "elasticity": "Elasticity",
    "hooke": "Elasticity",
    "scalars and vectors": "Scalars and Vectors",
    "vectors": "Scalars and Vectors",
    "alternating current": "Alternating Current (A.C.) Circuits",
    "a.c. circuits": "Alternating Current (A.C.) Circuits",
    "transformer": "Electromagnetic Induction",
    "generator": "Electromagnetic Induction",
    "dispersion": "Dispersion of Light and Colours",
    "colour": "Dispersion of Light and Colours",
    "photoelectric": "Modern Physics",
    "semiconductor": "Modern Physics",
    "diode": "Modern Physics",
    "transistor": "Modern Physics",
}

# Keyword → Physics topic mapping (keyword search in question text)
PHYSICS_KEYWORD_RULES = [
    # Each entry: ([keywords], topic, subtopic)
    # HIGH confidence specifics first

    # Measurements
    (["vernier caliper", "micrometer", "screw gauge", "error in measurement", "systematic error",
      "random error", "percentage error", "significant figure", "physical quantity", "si unit",
      "fundamental unit", "derived unit", "dimensional analysis", "standard form"],
     "Measurements and Units", "Measurement Techniques and Errors"),

    # Scalars and Vectors
    (["scalar", "vector", "resultant", "resolve force", "components of a vector",
      "triangle law", "parallelogram law"],
     "Scalars and Vectors", "Vector Addition and Resolution"),

    # Projectile → Motion
    (["projectile", "range of projectile", "time of flight", "maximum height", "angle of projection"],
     "Motion", "Projectile Motion"),

    # Motion graphs
    (["velocity-time graph", "displacement-time", "v-t graph", "s-t graph", "speed-time graph",
      "area under graph", "gradient of graph"],
     "Motion", "Motion Graphs"),

    # Equations of motion / kinematics
    (["v = u + at", "s = ut", "v^2 = u^2", "equations of motion", "uniformly accelerated",
      "deceleration", "retardation", "acceleration due to gravity", "free fall",
      "velocity", "acceleration", "displacement", "uniform velocity"],
     "Motion", "Types of Motion and Equations"),

    # Newton's Laws / Equilibrium
    (["newton's law", "newton's first", "newton's second", "newton's third",
      "f = ma", "inertia", "action and reaction"],
     "Equilibrium of Forces", "Newton's Laws of Motion"),

    # Momentum and impulse
    (["momentum", "impulse", "conservation of momentum", "elastic collision",
      "inelastic collision", "collision", "recoil"],
     "Equilibrium of Forces", "Momentum and Impulse"),

    # Torque / moments / equilibrium
    (["moment of force", "torque", "couple", "principle of moment", "equilibrium condition",
      "conditions for equilibrium", "center of gravity", "centre of gravity", "beam balance"],
     "Equilibrium of Forces", "Conditions for Equilibrium"),

    # Work, Energy, Power
    (["work done", "kinetic energy", "potential energy", "conservation of energy",
      "mechanical energy", "power", "p = fv", "efficiency", "w = fd"],
     "Work, Energy, and Power", "Work and Energy"),

    # Friction
    (["friction", "coefficient of friction", "static friction", "kinetic friction",
      "laws of friction", "limiting friction", "rough surface"],
     "Friction", "Types and Laws of Friction"),

    # Simple Machines
    (["simple machine", "mechanical advantage", "velocity ratio", "pulley system",
      "lever", "inclined plane", "wheel and axle", "screw", "gear", "effort", "load"],
     "Simple Machines", "Types of Simple Machines"),

    # Elasticity
    (["hooke's law", "elastic limit", "spring constant", "extension", "young's modulus",
      "stress", "strain", "elastic", "plastic deformation", "force-extension"],
     "Elasticity", "Hooke's Law and Elastic Properties"),

    # Pressure
    (["pressure", "pascal's principle", "hydraulic press", "p = f/a",
      "pressure in liquid", "barometer", "manometer", "atmospheric pressure",
      "gauge pressure", "rho*g*h", "density and pressure"],
     "Pressure", "Pressure in Solids and Fluids"),

    # Liquids at Rest
    (["archimedes", "upthrust", "buoyancy", "floating", "sinking", "surface tension",
      "capillary", "viscosity", "meniscus", "density of liquid"],
     "Liquids at Rest", "Archimedes' Principle and Buoyancy"),

    # Temperature / Thermometers
    (["thermometer", "fixed point", "lower fixed point", "upper fixed point",
      "celsius", "fahrenheit", "kelvin", "temperature scale", "absolute zero",
      "thermocouple", "resistance thermometer", "thermometric substance"],
     "Temperature and Thermometers", "Temperature Scales and Fixed Points"),

    # Thermal Expansion
    (["thermal expansion", "linear expansion", "cubical expansion", "coefficient of expansion",
      "bimetallic strip", "thermostat", "anomalous expansion of water",
      "expansion of solid", "expansion of liquid"],
     "Thermal Expansion", "Linear, Area, and Volume Expansion"),

    # Heat Transfer
    (["conduction", "convection", "radiation", "heat transfer", "thermal conduct",
      "newton's law of cooling", "infrared", "stefan", "black body", "greenhouse effect",
      "insulation", "heat loss"],
     "Heat Transfer", "Conduction and Convection"),

    # Gas Laws
    (["boyle's law", "charles's law", "pressure law", "gay-lussac", "pv = nrt",
      "ideal gas", "pv/t", "absolute temperature", "gas equation", "graham's law",
      "dalton's law of partial pressure", "diffusion of gas"],
     "Gas Laws", "Boyle's and Charles's Laws"),

    # Quantity of Heat / Calorimetry
    (["specific heat capacity", "heat capacity", "latent heat", "latent heat of fusion",
      "latent heat of vaporization", "calorimeter", "q = mc", "change of state",
      "melting", "boiling point", "evaporation", "condensation", "freezing",
      "heating curve", "cooling curve"],
     "Quantity of Heat", "Specific Heat Capacity"),

    # Waves — Sound
    (["pitch", "loudness", "echo", "resonance", "sound wave", "speed of sound",
      "open pipe", "closed pipe", "fundamental frequency", "harmonic", "overtone",
      "string vibration", "beats", "ultrasound", "doppler"],
     "Sound Waves", "Properties and Propagation of Sound"),

    # Waves — Light dispersion
    (["prism", "dispersion", "spectrum", "rainbow", "colour of light",
      "white light", "colour filter", "complementary colour", "primary colour"],
     "Dispersion of Light and Colours", "Dispersion and the Spectrum"),

    # Waves — Light reflection
    (["plane mirror", "image in mirror", "concave mirror", "convex mirror",
      "curved mirror", "mirror formula", "focal length of mirror", "radius of curvature",
      "laws of reflection", "image formed by mirror", "real image", "virtual image",
      "magnification"],
     "Reflection of Light", "Curved Mirror Reflection"),

    # Waves — Light refraction / lenses
    (["snell's law", "refractive index", "critical angle", "total internal reflection",
      "optical fibre", "lens", "converging lens", "diverging lens", "lens formula",
      "1/f = 1/u + 1/v", "image by lens", "focal length of lens", "refraction",
      "apparent depth", "real depth", "power of lens"],
     "Refraction of Light", "Snell's Law and Refractive Index"),

    # Waves — Light energy (straight-line propagation)
    (["pinhole camera", "rectilinear propagation", "shadow", "eclipse", "umbra",
      "penumbra", "illuminance", "inverse square law of light", "candela", "lux"],
     "Light Energy", "Nature and Propagation of Light"),

    # Waves — General wave properties
    (["transverse wave", "longitudinal wave", "amplitude", "wavelength", "frequency",
      "period", "wave speed", "v = f", "superposition", "interference", "diffraction",
      "stationary wave", "standing wave", "progressive wave"],
     "Waves", "Wave Properties and Types"),

    # Electrostatics
    (["coulomb's law", "electric charge", "charge distribution", "electrostatic",
      "electric field", "electric potential", "capacitance", "capacitor",
      "dielectric", "energy stored in capacitor", "charge", "coulomb"],
     "Electrostatics", "Electric Charges and Coulomb's Law"),

    # Current Electricity
    (["ohm's law", "resistance", "resistor", "emf", "internal resistance",
      "terminal voltage", "series circuit", "parallel circuit", "kirchhoff",
      "power dissipation", "electrical energy", "p = i^2r", "p = v^2/r",
      "ammeter", "voltmeter", "galvanometer", "wheatstone bridge", "potentiometer"],
     "Current Electricity", "Ohm's Law and Resistance"),

    # Magnetism
    (["magnet", "magnetic field", "magnetic force", "magnetic flux", "domain theory",
      "poles", "compass", "ferromagnetic", "paramagnetic", "force on conductor",
      "motor", "dc motor", "flemings left"],
     "Magnetism", "Magnetic Fields and Properties"),

    # Electromagnetic Induction
    (["faraday's law", "lenz's law", "induced emf", "mutual induction",
      "self induction", "transformer", "turns ratio", "ac generator", "dynamo",
      "electromagnetic induction", "flux linkage"],
     "Electromagnetic Induction", "Faraday's and Lenz's Laws"),

    # AC Circuits
    (["alternating current", "peak voltage", "rms", "root mean square",
      "reactance", "impedance", "lcr circuit", "resonant frequency",
      "rectification", "half-wave", "full-wave", "smoothing", "diode rectifier",
      "a.c. circuit", "ac supply"],
     "Alternating Current (A.C.) Circuits", "AC Quantities and Rectification"),

    # Atomic and Nuclear Physics
    (["rutherford", "bohr model", "line spectrum", "emission spectrum",
      "energy level", "radioactivity", "radioactive decay", "half-life",
      "alpha particle", "beta particle", "gamma ray", "fission", "fusion",
      "mass defect", "binding energy", "nuclear reaction", "radioactive",
      "proton number", "nucleon number", "nuclear"],
     "Atomic and Nuclear Physics", "Atomic Structure and Models"),

    # Modern Physics
    (["photoelectric effect", "photon", "photon energy", "e = hf", "work function",
      "threshold frequency", "quantum", "de broglie", "wave-particle duality",
      "semiconductor", "p-type", "n-type", "p-n junction", "diode", "transistor",
      "logic gate", "led", "laser"],
     "Modern Physics", "Photoelectric Effect and Quantum Theory"),
]


def classify_physics_question(question_text: str, original_subtopic: str) -> tuple:
    """Return (topic, subtopic) for a Physics question."""
    text = (question_text or "").lower()
    orig = (original_subtopic or "").lower().strip()

    # 1. Use subtopic hint map if unambiguous
    for hint_key, topic in PHYSICS_SUBTOPIC_HINT.items():
        if topic and hint_key in orig:
            # Find matching subtopic for this topic from keyword rules
            for keywords, rule_topic, rule_subtopic in PHYSICS_KEYWORD_RULES:
                if rule_topic == topic:
                    for kw in keywords:
                        if kw in text:
                            return (topic, rule_subtopic)
            # Default subtopic for this topic
            default_subtopics = {
                "Motion": "Types of Motion and Equations",
                "Work, Energy, and Power": "Work and Energy",
                "Equilibrium of Forces": "Newton's Laws of Motion",
                "Reflection of Light": "Curved Mirror Reflection",
                "Pressure": "Pressure in Solids and Fluids",
                "Friction": "Types and Laws of Friction",
                "Current Electricity": "Ohm's Law and Resistance",
                "Sound Waves": "Properties and Propagation of Sound",
                "Quantity of Heat": "Specific Heat Capacity",
                "Magnetism": "Magnetic Fields and Properties",
                "Measurements and Units": "Measurement Techniques and Errors",
                "Thermal Expansion": "Linear, Area, and Volume Expansion",
                "Simple Machines": "Types of Simple Machines",
                "Atomic and Nuclear Physics": "Radioactivity and Nuclear Reactions",
                "Liquids at Rest": "Archimedes' Principle and Buoyancy",
                "Elasticity": "Hooke's Law and Elastic Properties",
                "Scalars and Vectors": "Vector Addition and Resolution",
                "Electromagnetic Induction": "Faraday's and Lenz's Laws",
                "Refraction of Light": "Snell's Law and Refractive Index",
            }
            return (topic, default_subtopics.get(topic, topic))

    # 2. Keyword scoring on question text
    best_topic = None
    best_subtopic = None
    best_score = 0

    for keywords, topic, subtopic in PHYSICS_KEYWORD_RULES:
        score = sum(1 for kw in keywords if kw in text)
        if score > best_score:
            best_score = score
            best_topic = topic
            best_subtopic = subtopic

    if best_topic and best_score >= 1:
        return (best_topic, best_subtopic)

    # 3. Fall back using old topic bucket
    BUCKET_DEFAULTS = {
        "Mechanics": "Motion",
        "Heat & Thermodynamics": "Quantity of Heat",
        "Waves & Optics": "Waves",
        "Electricity & Magnetism": "Current Electricity",
        "Atomic & Nuclear Physics": "Atomic and Nuclear Physics",
        "Properties of Matter": "Pressure",
        "Measurements": "Measurements and Units",
    }
    return (None, None)  # will be resolved by caller


def classify_chemistry_subtopic(topic: str, question_text: str) -> str:
    """Return subtopic name for a Chemistry question given its (new) topic."""
    text = (question_text or "").lower()
    rules = CHEMISTRY_SUBTOPIC_RULES.get(topic, [])
    for keywords, subtopic in rules:
        for kw in keywords:
            if kw in text:
                return subtopic
    # Return first subtopic as default
    if rules:
        return rules[0][1]
    return topic  # fallback: same as topic


# ──────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────

def retag_chemistry(cursor, dry_run: bool):
    print("\n" + "=" * 60)
    print("CHEMISTRY RE-TAGGING")
    print("=" * 60)

    cursor.execute("""
        SELECT id, question, topic, subtopic
        FROM questions
        WHERE subject='Chemistry' AND exam='JAMB'
    """)
    rows = cursor.fetchall()
    print(f"Total Chemistry questions: {len(rows)}")

    updates = []
    unmapped = []

    for row in rows:
        qid, qtext, old_topic, old_subtopic = row
        old_topic_s = (old_topic or "").strip()

        # Map to new topic
        new_topic = CHEMISTRY_TOPIC_RENAME.get(old_topic_s)
        if not new_topic:
            # Try stripping number prefix pattern "N. "
            stripped = re.sub(r'^\d+\.\s*', '', old_topic_s)
            new_topic = CHEMISTRY_TOPIC_RENAME.get(stripped)
        if not new_topic:
            # Try partial match
            for k, v in CHEMISTRY_TOPIC_RENAME.items():
                if k.lower() in old_topic_s.lower() or old_topic_s.lower() in k.lower():
                    new_topic = v
                    break
        if not new_topic:
            unmapped.append((qid, old_topic_s))
            new_topic = old_topic_s  # keep original if unknown

        # Assign subtopic
        new_subtopic = classify_chemistry_subtopic(new_topic, qtext)

        updates.append((new_topic, new_subtopic, qid))

    # Coverage report
    topic_counts = Counter(t for t, _, _ in updates)
    print("\nFinal topic distribution:")
    for topic, count in sorted(topic_counts.items()):
        flag = " ⚠️  < 20" if count < 20 else ""
        print(f"  {count:4d}  {topic}{flag}")

    if unmapped:
        print(f"\nUnmapped topics ({len(unmapped)}):")
        for qid, t in unmapped[:20]:
            print(f"  ID={qid}  '{t}'")

    if not dry_run:
        cursor.executemany("""
            UPDATE questions SET topic=?, subtopic=? WHERE id=?
        """, updates)
        print(f"\nUpdated {len(updates)} Chemistry questions in DB.")
    else:
        print("\n[DRY RUN] No changes made.")

    return updates


def retag_physics(cursor, dry_run: bool):
    print("\n" + "=" * 60)
    print("PHYSICS RE-TAGGING")
    print("=" * 60)

    cursor.execute("""
        SELECT id, question, topic, subtopic
        FROM questions
        WHERE subject='Physics' AND exam='JAMB'
    """)
    rows = cursor.fetchall()
    print(f"Total Physics questions: {len(rows)}")

    # Bucket fallbacks when keyword matching fails
    BUCKET_DEFAULTS = {
        "Mechanics": ("Motion", "Types of Motion and Equations"),
        "Heat & Thermodynamics": ("Quantity of Heat", "Specific Heat Capacity"),
        "Waves & Optics": ("Waves", "Wave Properties and Types"),
        "Electricity & Magnetism": ("Current Electricity", "Ohm's Law and Resistance"),
        "Atomic & Nuclear Physics": ("Atomic and Nuclear Physics", "Radioactivity and Nuclear Reactions"),
        "Properties of Matter": ("Pressure", "Pressure in Solids and Fluids"),
        "Measurements": ("Measurements and Units", "Measurement Techniques and Errors"),
    }

    updates = []
    unmatched = []

    for row in rows:
        qid, qtext, old_topic, old_subtopic = row
        old_topic_s = (old_topic or "").strip()

        new_topic, new_subtopic = classify_physics_question(qtext, old_subtopic or "")

        if not new_topic:
            # Use bucket default
            bucket_result = BUCKET_DEFAULTS.get(old_topic_s)
            if bucket_result:
                new_topic, new_subtopic = bucket_result
            else:
                new_topic = old_topic_s
                new_subtopic = old_subtopic or old_topic_s
                unmatched.append((qid, old_topic_s, (qtext or "")[:80]))

        updates.append((new_topic, new_subtopic, qid))

    # Coverage report
    topic_counts = Counter(t for t, _, _ in updates)
    print("\nFinal topic distribution:")
    for topic, count in sorted(topic_counts.items()):
        flag = " ⚠️  < 20" if count < 20 else ""
        print(f"  {count:4d}  {topic}{flag}")

    if unmatched:
        print(f"\nUnmatched questions ({len(unmatched)}):")
        for qid, t, preview in unmatched[:10]:
            print(f"  ID={qid}  bucket='{t}'  preview='{preview}'")

    if not dry_run:
        cursor.executemany("""
            UPDATE questions SET topic=?, subtopic=? WHERE id=?
        """, updates)
        print(f"\nUpdated {len(updates)} Physics questions in DB.")
    else:
        print("\n[DRY RUN] No changes made.")

    return updates


def main():
    parser = argparse.ArgumentParser(description="Retag Chemistry and Physics questions")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print coverage report only, make no DB changes")
    parser.add_argument("--subject", choices=["Chemistry", "Physics", "both"],
                        default="both", help="Which subject to retag")
    args = parser.parse_args()

    # Use the app's PostgreSQL connection layer
    conn = get_connection()
    cursor = conn.cursor()

    print("Connected to database successfully.")

    try:
        if args.subject in ("Chemistry", "both"):
            retag_chemistry(cursor, args.dry_run)

        if args.subject in ("Physics", "both"):
            retag_physics(cursor, args.dry_run)

        if not args.dry_run:
            conn.commit()
            print("\nAll changes committed to DB.")
        else:
            print("\n[DRY RUN COMPLETE] No changes committed.")
    except Exception as e:
        conn.rollback()
        print(f"\nERROR: {e}")
        raise


if __name__ == "__main__":
    main()
