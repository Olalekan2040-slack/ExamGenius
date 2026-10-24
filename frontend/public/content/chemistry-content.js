/**
 * Chemistry Learning Content
 * Topics with explanations, visuals, and sample questions
 */

const CHEMISTRY_LEARNING_CONTENT = {
    
    // ============================================================
    // TOPIC 1: SEPARATION OF MIXTURES AND PURIFICATION OF CHEMICAL SUBSTANCES
    // ============================================================
    "Separation of Mixtures and Purification of Chemical Substances": {
        subject: "Chemistry",
        topic: "Separation of Mixtures and Purification of Chemical Substances",
        introduction: {
            title: "Separation of Mixtures and Purification of Chemical Substances",
            description: "This topic explains how substances are classified and how mixtures are separated into their components. JAMB frequently tests this topic with objective questions on purity, types of substances, and correct separation methods. Questions are usually straightforward and based on understanding basic principles.",
            jambInfo: "JAMB usually asks 3-4 questions from this topic."
        },
        subtopics: [
            {
                name: "Pure and Impure Substances",
                objectives: [
                    {
                        title: "Distinguish between pure and impure substances",
                        explanation: `<p>A <strong>pure substance</strong> contains only one type of particle and has a fixed composition. An <strong>impure substance</strong> contains two or more substances mixed together.</p>
                        
<p>Pure substances have <strong>uniform properties</strong> throughout, while impure substances do not. In JAMB questions, purity is tested using composition and physical properties.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>Pure substances contain <strong>one type of substance</strong></li>
        <li>Impure substances contain <strong>more than one substance</strong></li>
        <li>Pure substances have <strong>uniform properties</strong></li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-circle"></i><i class="fas fa-circle"></i><i class="fas fa-circle"></i>
            <p><strong>Pure Substance</strong></p>
            <p>Identical particles only</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-circle"></i><i class="fas fa-square"></i><i class="fas fa-star"></i>
            <p><strong>Impure Substance</strong></p>
            <p>Different particles mixed together</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Assuming all clear substances are pure</li>
        <li>Thinking mixtures are always impure liquids</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is a pure substance?",
                            options: {
                                "A": "Air",
                                "B": "Salt solution",
                                "C": "Distilled water",
                                "D": "Soil"
                            },
                            correctAnswer: "C",
                            explanation: "Distilled water is a pure substance containing only H₂O molecules. Air is a mixture of gases, salt solution is a mixture of salt and water, and soil is a mixture of various substances."
                        }
                    },
                    {
                        title: "Use boiling and melting points as criteria for purity",
                        explanation: `<p>A <strong>pure substance melts or boils at a fixed temperature</strong>, while an <strong>impure substance melts or boils over a range of temperatures</strong>.</p>

<p>JAMB often presents temperature data and asks which sample is pure.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Sharp melting/boiling point</strong> indicates purity</li>
        <li><strong>Impurities affect</strong> melting and boiling points</li>
        <li><strong>Temperature range</strong> suggests impurity</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Pure Substance</h4>
            <div class="graph-representation">
                <p>📊 Sharp melting point at 80°C</p>
                <p>Temperature stays constant during melting</p>
            </div>
        </div>
        <div class="comparison-card">
            <h4>Impure Substance</h4>
            <div class="graph-representation">
                <p>📊 Melts from 75°C to 85°C</p>
                <p>Temperature rises during melting</p>
            </div>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li><strong>Pure water</strong> boils at exactly 100°C (at 1 atm)</li>
        <li><strong>Salt water</strong> boils above 100°C</li>
        <li><strong>Pure ice</strong> melts at exactly 0°C</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking higher boiling point means purity</li>
        <li>Ignoring the word "fixed" in questions</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following observations best indicates that a substance is pure?",
                            options: {
                                "A": "It melts over a wide temperature range",
                                "B": "It boils at different temperatures",
                                "C": "It melts at a fixed temperature",
                                "D": "It dissolves in water"
                            },
                            correctAnswer: "C",
                            explanation: "A pure substance melts at a fixed, sharp temperature. If it melts over a range, it contains impurities. Solubility in water is not a criterion for purity."
                        }
                    }
                ]
            },
            {
                name: "Elements, Compounds, and Mixtures",
                objectives: [
                    {
                        title: "Distinguish between elements, compounds, and mixtures",
                        explanation: `<p>An <strong>element</strong> consists of only one type of atom and cannot be broken down chemically. A <strong>compound</strong> contains two or more elements chemically combined in a fixed ratio. A <strong>mixture</strong> contains substances physically combined and can be separated by physical methods.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Elements</strong> cannot be broken down chemically</li>
        <li><strong>Compounds</strong> have fixed composition</li>
        <li><strong>Mixtures</strong> can be separated physically</li>
    </ul>
</div>

<div class="visual-section">
    <div class="icon-grid">
        <div class="grid-item">
            <div class="atom-visual">
                <span class="atom">O</span><span class="atom">O</span><span class="atom">O</span>
            </div>
            <p><strong>Element (Oxygen)</strong></p>
            <p>Single atom type</p>
        </div>
        <div class="grid-item">
            <div class="atom-visual">
                <span class="molecule">H-O-H</span>
            </div>
            <p><strong>Compound (Water)</strong></p>
            <p>Bonded different atoms</p>
        </div>
        <div class="grid-item">
            <div class="atom-visual">
                <span class="atom">O₂</span> <span class="atom">N₂</span> <span class="atom">CO₂</span>
            </div>
            <p><strong>Mixture (Air)</strong></p>
            <p>Unbonded mixed particles</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li><strong>Elements:</strong> Oxygen (O₂), Iron (Fe), Carbon (C)</li>
        <li><strong>Compounds:</strong> Water (H₂O), Salt (NaCl), Sugar (C₁₂H₂₂O₁₁)</li>
        <li><strong>Mixtures:</strong> Air, seawater, brass (alloy)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking alloys are compounds (they're mixtures)</li>
        <li>Confusing compounds with mixtures</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is a compound?",
                            options: {
                                "A": "Oxygen",
                                "B": "Brass",
                                "C": "Water",
                                "D": "Air"
                            },
                            correctAnswer: "C",
                            explanation: "Water (H₂O) is a compound formed by chemical combination of hydrogen and oxygen. Oxygen is an element, brass is an alloy (mixture), and air is a mixture of gases."
                        }
                    },
                    {
                        title: "Differentiate between chemical and physical changes",
                        explanation: `<p>A <strong>physical change</strong> does not produce a new substance and is usually reversible. A <strong>chemical change</strong> produces a new substance and is usually irreversible.</p>

<p>JAMB questions focus on identifying the nature of changes in common processes.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Physical change</strong> forms no new substance</li>
        <li><strong>Chemical change</strong> forms a new substance</li>
        <li>Chemical changes are often <strong>irreversible</strong></li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Physical Change</h4>
            <div class="change-examples">
                <p>🧊 Ice → Water</p>
                <p>💨 Boiling water</p>
                <p>✂️ Cutting paper</p>
                <p>🧲 Magnetizing iron</p>
            </div>
            <p class="change-note">Reversible, no new substance</p>
        </div>
        <div class="comparison-card">
            <h4>Chemical Change</h4>
            <div class="change-examples">
                <p>🔥 Burning wood</p>
                <p>🦀 Rusting iron</p>
                <p>🍞 Baking bread</p>
                <p>🥚 Cooking eggs</p>
            </div>
            <p class="change-note">Irreversible, new substance formed</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking all irreversible changes are chemical</li>
        <li>Confusing phase change with chemical change</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is a chemical change?",
                            options: {
                                "A": "Melting of ice",
                                "B": "Boiling of water",
                                "C": "Rusting of iron",
                                "D": "Dissolving sugar in water"
                            },
                            correctAnswer: "C",
                            explanation: "Rusting of iron is a chemical change producing a new substance (iron oxide). Melting ice, boiling water, and dissolving sugar are all physical changes - no new substances are formed."
                        }
                    }
                ]
            },
            {
                name: "Separation Processes",
                objectives: [
                    {
                        title: "Identify properties of mixture components used in separation",
                        explanation: `<p>Separation methods depend on differences in <strong>physical properties</strong> such as boiling point, solubility, magnetism, and particle size.</p>

<p>JAMB often tests which property makes a separation method suitable.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Boiling point difference</strong> → distillation</li>
        <li><strong>Solubility</strong> → crystallization</li>
        <li><strong>Magnetism</strong> → magnetic separation</li>
        <li><strong>Particle size</strong> → filtration</li>
    </ul>
</div>

<div class="visual-section">
    <div class="formula-cards">
        <div class="formula-card">
            <h4>Property-Method Mapping</h4>
            <div class="mapping-list">
                <p>🧲 <strong>Magnetic property</strong> → Magnetic separation</p>
                <p>💧 <strong>Solubility difference</strong> → Crystallization</p>
                <p>🌡️ <strong>Boiling point</strong> → Distillation</p>
                <p>📏 <strong>Particle size</strong> → Filtration</p>
                <p>⚡ <strong>Volatility</strong> → Evaporation</p>
                <p>🎨 <strong>Adsorption rate</strong> → Chromatography</p>
            </div>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Common Mixtures:</h4>
    <ul>
        <li><strong>Iron + Sand:</strong> Use magnetism (iron is magnetic)</li>
        <li><strong>Salt + Water:</strong> Use evaporation (water evaporates)</li>
        <li><strong>Ethanol + Water:</strong> Use distillation (different boiling points)</li>
        <li><strong>Sand + Water:</strong> Use filtration (sand is insoluble)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Selecting the method instead of the property</li>
        <li>Ignoring key descriptive words in questions</li>
    </ul>
</div>`,
                        question: {
                            text: "Which property is used to separate iron filings from sand?",
                            options: {
                                "A": "Solubility",
                                "B": "Boiling point",
                                "C": "Magnetism",
                                "D": "Density"
                            },
                            correctAnswer: "C",
                            explanation: "Iron is magnetic while sand is not. This difference in magnetic property allows iron filings to be separated from sand using a magnet."
                        }
                    },
                    {
                        title: "Specify principles involved in each separation method",
                        explanation: `<p>Each separation method works based on a <strong>specific principle</strong>:</p>

<div class="key-points">
    <h4>Key Methods & Principles:</h4>
    <ul>
        <li><strong>Evaporation:</strong> Removes volatile solvent, solid remains</li>
        <li><strong>Distillation:</strong> Separates liquids by boiling point differences</li>
        <li><strong>Filtration:</strong> Separates insoluble solids from liquids</li>
        <li><strong>Chromatography:</strong> Separates based on different rates of movement</li>
        <li><strong>Crystallization:</strong> Separates dissolved solid by cooling</li>
        <li><strong>Sublimation:</strong> Solid directly changes to vapor</li>
    </ul>
</div>

<div class="visual-section">
    <div class="diagram-cards">
        <div class="diagram-card">
            <h4>🔬 Simple Distillation</h4>
            <div class="apparatus-diagram">
                <p>Flask → Heat → Condenser → Receiver</p>
                <p><em>Principle:</em> Lower boiling point liquid evaporates first</p>
            </div>
        </div>
        <div class="diagram-card">
            <h4>🧪 Filtration</h4>
            <div class="apparatus-diagram">
                <p>Funnel → Filter paper → Residue/Filtrate</p>
                <p><em>Principle:</em> Insoluble particles trapped by filter</p>
            </div>
        </div>
        <div class="diagram-card">
            <h4>🌡️ Evaporation</h4>
            <div class="apparatus-diagram">
                <p>Solution → Heat → Vapor escapes → Solid remains</p>
                <p><em>Principle:</em> Liquid evaporates, solute crystallizes</p>
            </div>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>When to Use Each Method:</h4>
    <ul>
        <li><strong>Filtration:</strong> Sand from water (insoluble solid)</li>
        <li><strong>Distillation:</strong> Ethanol from water (different boiling points)</li>
        <li><strong>Evaporation:</strong> Salt from seawater (recover solid)</li>
        <li><strong>Chromatography:</strong> Ink dyes (colored components)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using filtration for dissolved substances</li>
        <li>Confusing simple and fractional distillation</li>
    </ul>
</div>`,
                        question: {
                            text: "Which method is best for separating ethanol from water?",
                            options: {
                                "A": "Filtration",
                                "B": "Evaporation",
                                "C": "Simple distillation",
                                "D": "Decantation"
                            },
                            correctAnswer: "C",
                            explanation: "Simple distillation is best because ethanol (boiling point 78°C) and water (boiling point 100°C) have different boiling points. Filtration is for insoluble solids, evaporation removes the liquid, and decantation is for immiscible liquids."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 2: CHEMICAL COMBINATION
    // ============================================================
    "Chemical Combination": {
        subject: "Chemistry",
        topic: "Chemical Combination",
        introduction: {
            title: "Chemical Combination",
            description: "Chemical combination explores the fundamental laws governing how elements and compounds interact and combine in fixed ratios, forming the basis for understanding chemical reactions and stoichiometry. It also introduces the mole concept, which quantifies substances at the atomic level for precise calculations in chemistry.",
            jambInfo: "JAMB typically includes 3-4 questions on this topic, emphasizing calculations involving laws of combination and mole-based stoichiometry."
        },
        subtopics: [
            {
                name: "Laws of Chemical Combination",
                objectives: [
                    {
                        title: "Perform calculations based on laws of chemical combination",
                        explanation: `<p>The <strong>laws of chemical combination</strong> are empirical rules derived from experiments that describe how elements combine to form compounds in predictable ways.</p>

<p>These laws ensure that chemical reactions follow consistent patterns, such as fixed mass ratios or conservation of mass, which are essential for balancing equations and predicting outcomes in reactions.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Law of Definite Proportions:</strong> A compound always contains the same elements in the same fixed ratio by mass, regardless of the source.</li>
        <li><strong>Law of Multiple Proportions:</strong> When two elements form more than one compound, the ratios of masses of one element combining with a fixed mass of the other are simple whole numbers.</li>
        <li><strong>Law of Conservation of Matter:</strong> In a chemical reaction, the total mass of reactants equals the total mass of products.</li>
        <li><strong>Law of Reciprocal Proportions:</strong> When two elements combine separately with a third element, their mass ratio is the same or a multiple of when they combine with each other.</li>
    </ul>
</div>

<div class="visual-section">
    <div class="formula-cards">
        <div class="formula-card">
            <h4>Law of Definite Proportions</h4>
            <p>In water (H₂O), hydrogen and oxygen always combine in a <strong>1:8 mass ratio</strong></p>
        </div>
        <div class="formula-card">
            <h4>Law of Multiple Proportions</h4>
            <p>In CO and CO₂, carbon combines with oxygen in <strong>1:1 and 1:2</strong> mass ratios</p>
        </div>
        <div class="formula-card">
            <h4>Law of Conservation</h4>
            <p>2H₂ + O₂ → 2H₂O<br><strong>Mass before = Mass after</strong></p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Confusing definite proportions with multiple proportions</li>
        <li>Ignoring units in mass ratio calculations</li>
        <li>Misapplying reciprocal proportions by not relating ratios correctly</li>
    </ul>
</div>`,
                        question: {
                            text: "If 4g of element A combines with 6g of element B to form compound AB, and mass is conserved, what mass of AB is formed?",
                            options: {
                                "A": "4g",
                                "B": "6g",
                                "C": "10g",
                                "D": "2g"
                            },
                            correctAnswer: "C",
                            explanation: "According to the Law of Conservation of Mass, total mass before = total mass after. So 4g + 6g = 10g of compound AB is formed."
                        }
                    }
                ]
            },
            {
                name: "Mole Concept and Avogadro's Number",
                objectives: [
                    {
                        title: "Use mole concept in stoichiometric calculations",
                        explanation: `<p>The <strong>mole concept</strong> represents a standard amount of substance (6.022 × 10²³ particles) that allows chemists to count atoms or molecules by weighing macroscopic quantities.</p>

<p><strong>Molar mass</strong> is the mass of one mole of a substance, enabling conversions between mass, moles, and particles.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>A <strong>mole</strong> is the amount of substance containing Avogadro's number of particles</li>
        <li><strong>Molar mass (M)</strong> is calculated from the periodic table (e.g., H₂O = 18 g/mol)</li>
        <li>Stoichiometric calculations involve mole ratios from balanced equations</li>
    </ul>
</div>

<div class="visual-section">
    <div class="formula-cards">
        <div class="formula-card">
            <h4>Mole Formula</h4>
            <div class="equation-box">
                <p>n = m / M</p>
                <p><small>Number of moles = mass ÷ molar mass</small></p>
            </div>
        </div>
        <div class="formula-card">
            <h4>Stoichiometry Example</h4>
            <p>2H₂ + O₂ → 2H₂O</p>
            <p>2 moles H₂ react with 1 mole O₂</p>
        </div>
        <div class="formula-card">
            <h4>Conversion Chain</h4>
            <p>Grams → Moles → Particles</p>
            <p>(using Avogadro's number)</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using atomic mass instead of molecular mass</li>
        <li>Misinterpreting mole ratios in unbalanced equations</li>
    </ul>
</div>`,
                        question: {
                            text: "How many moles are in 36g of water (H₂O, molar mass 18g/mol)?",
                            options: {
                                "A": "1",
                                "B": "2",
                                "C": "18",
                                "D": "36"
                            },
                            correctAnswer: "B",
                            explanation: "Using n = m/M: n = 36g ÷ 18g/mol = 2 moles"
                        }
                    },
                    {
                        title: "Relate Avogadro's number to particle quantities",
                        explanation: `<p><strong>Avogadro's number (6.022 × 10²³)</strong> is the constant that links the microscopic world of atoms to measurable macroscopic quantities, defining one mole.</p>

<p>It allows calculation of the number of atoms, ions, or molecules in a given mass of substance.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>Avogadro's number = <strong>6.022 × 10²³</strong> particles per mole</li>
        <li>Number of particles = moles × Avogadro's number</li>
        <li>1 mole of any gas occupies <strong>22.4 dm³</strong> at STP</li>
    </ul>
</div>

<div class="visual-section">
    <div class="diagram-cards">
        <div class="diagram-card">
            <h4>📊 Scale Comparison</h4>
            <p>1 mole of atoms = 6.022 × 10²³ atoms</p>
            <p>That's more than all grains of sand on Earth!</p>
        </div>
        <div class="diagram-card">
            <h4>🔄 Conversion Triangle</h4>
            <p>Moles ↔ Particles ↔ Mass</p>
            <p>Use Avogadro's number for Moles ↔ Particles</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using Avogadro's number without multiplying by moles</li>
        <li>Confusing Avogadro's number with molar volume</li>
    </ul>
</div>`,
                        question: {
                            text: "How many atoms are in 1 mole of carbon?",
                            options: {
                                "A": "12",
                                "B": "6.022 × 10²³",
                                "C": "1",
                                "D": "6.022 × 10¹²"
                            },
                            correctAnswer: "B",
                            explanation: "By definition, 1 mole of any substance contains exactly 6.022 × 10²³ particles (Avogadro's number)."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 3: KINETIC THEORY OF MATTER AND GAS LAWS
    // ============================================================
    "Kinetic Theory of Matter and Gas Laws": {
        subject: "Chemistry",
        topic: "Kinetic Theory of Matter and Gas Laws",
        introduction: {
            title: "Kinetic Theory of Matter and Gas Laws",
            description: "This topic explains how tiny particles (atoms or molecules) move and behave in solids, liquids, and gases, and how this movement controls the properties of gases like pressure, volume, and temperature. The kinetic theory helps us understand everyday things like why a tyre becomes harder when hot or why gases spread out quickly.",
            jambInfo: "JAMB usually asks 3-5 questions from this topic, focusing on explaining gas behaviour and calculations with gas laws."
        },
        subtopics: [
            {
                name: "Kinetic Theory",
                objectives: [
                    {
                        title: "Use kinetic theory to explain gas behaviour",
                        explanation: `<p>The <strong>kinetic theory</strong> says that all matter is made up of very small particles (atoms or molecules) that are always moving.</p>

<p>In gases, these particles move very fast in all directions, hit the walls of the container, and that is what causes <strong>pressure</strong>. The faster they move (higher temperature), the higher the pressure.</p>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>All matter consists of <strong>tiny moving particles</strong></li>
        <li>In gases, particles are <strong>far apart</strong> and move randomly at high speed</li>
        <li><strong>Pressure</strong> is caused by particles constantly hitting the walls</li>
        <li><strong>Temperature</strong> is a measure of the average kinetic energy of particles</li>
    </ul>
</div>

<div class="visual-section">
    <div class="diagram-cards">
        <div class="diagram-card">
            <h4>🔵 Gas Particles in Container</h4>
            <p>Particles move randomly in all directions</p>
            <p>They collide with walls → creates pressure</p>
            <p>Higher temperature → faster movement → higher pressure</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking pressure is caused by gravity instead of particle collisions</li>
        <li>Forgetting that gas particles have no attraction between them (ideal gas)</li>
        <li>Mixing up temperature with heat – temperature measures average kinetic energy</li>
    </ul>
</div>`,
                        question: {
                            text: "According to kinetic theory, the pressure of a gas increases when temperature rises because:",
                            options: {
                                "A": "Particles become bigger",
                                "B": "Particles move faster",
                                "C": "Particles become fewer",
                                "D": "Particles stop moving"
                            },
                            correctAnswer: "B",
                            explanation: "Higher temperature means particles have more kinetic energy and move faster. They hit the container walls harder and more frequently, causing higher pressure."
                        }
                    },
                    {
                        title: "Explain states of matter using kinetic theory",
                        explanation: `<p>The kinetic theory explains the <strong>three states of matter</strong>:</p>

<div class="key-points">
    <h4>States of Matter:</h4>
    <ul>
        <li><strong>Solids:</strong> Strong attraction, particles vibrate in fixed places</li>
        <li><strong>Liquids:</strong> Weaker attraction, particles slide past each other</li>
        <li><strong>Gases:</strong> Very weak or no attraction, particles move freely and far apart</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>🧊 Solid</h4>
            <p>Particles tightly packed</p>
            <p>Vibrate in fixed positions</p>
            <p>Fixed shape and volume</p>
        </div>
        <div class="comparison-card">
            <h4>💧 Liquid</h4>
            <p>Particles close together</p>
            <p>Can slide over each other</p>
            <p>Fixed volume, no fixed shape</p>
        </div>
        <div class="comparison-card">
            <h4>💨 Gas</h4>
            <p>Particles far apart</p>
            <p>Move freely and fast</p>
            <p>No fixed shape or volume</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying solids have no movement at all (they vibrate!)</li>
        <li>Thinking gas particles do not collide with each other</li>
    </ul>
</div>`,
                        question: {
                            text: "In which state of matter do particles have the highest kinetic energy?",
                            options: {
                                "A": "Solid",
                                "B": "Liquid",
                                "C": "Gas",
                                "D": "All the same"
                            },
                            correctAnswer: "C",
                            explanation: "Gas particles move the fastest and are farthest apart, so they have the highest kinetic energy. Solid particles only vibrate in place with the lowest kinetic energy."
                        }
                    }
                ]
            },
            {
                name: "Gas Laws",
                objectives: [
                    {
                        title: "Solve problems involving gas laws",
                        explanation: `<p><strong>Gas laws</strong> show the relationship between pressure (P), volume (V), and temperature (T).</p>

<div class="key-points">
    <h4>The Three Main Gas Laws:</h4>
    <ul>
        <li><strong>Boyle's Law:</strong> P₁V₁ = P₂V₂ (at constant temperature)</li>
        <li><strong>Charles's Law:</strong> V₁/T₁ = V₂/T₂ (at constant pressure, T in Kelvin)</li>
        <li><strong>Pressure Law:</strong> P₁/T₁ = P₂/T₂ (at constant volume, T in Kelvin)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="formula-cards">
        <div class="formula-card">
            <h4>📉 Boyle's Law</h4>
            <p>P ∝ 1/V (inverse relationship)</p>
            <p>↑ Pressure = ↓ Volume</p>
        </div>
        <div class="formula-card">
            <h4>📈 Charles's Law</h4>
            <p>V ∝ T (direct relationship)</p>
            <p>↑ Temperature = ↑ Volume</p>
        </div>
        <div class="formula-card">
            <h4>🌡️ Pressure Law</h4>
            <p>P ∝ T (direct relationship)</p>
            <p>↑ Temperature = ↑ Pressure</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>⚠️ Important:</h4>
    <p>Always convert temperature to <strong>Kelvin</strong> before calculations!</p>
    <p>K = °C + 273</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to convert °C to Kelvin</li>
        <li>Using wrong formula (P ∝ V instead of P ∝ 1/V for Boyle's Law)</li>
    </ul>
</div>`,
                        question: {
                            text: "A gas occupies 400 cm³ at 2 atm. What will be its volume at 1 atm if temperature is constant?",
                            options: {
                                "A": "200 cm³",
                                "B": "800 cm³",
                                "C": "400 cm³",
                                "D": "100 cm³"
                            },
                            correctAnswer: "B",
                            explanation: "Using Boyle's Law: P₁V₁ = P₂V₂ → 2 × 400 = 1 × V₂ → V₂ = 800 cm³. When pressure decreases, volume increases."
                        }
                    },
                    {
                        title: "Perform calculations with ideal gas equation",
                        explanation: `<p>The <strong>ideal gas equation</strong> PV = nRT combines all gas laws into one formula.</p>

<div class="key-points">
    <h4>Key Formulas:</h4>
    <ul>
        <li><strong>Ideal Gas Equation:</strong> PV = nRT</li>
        <li><strong>R</strong> = 0.0821 dm³ atm mol⁻¹ K⁻¹ (or 8.314 J mol⁻¹ K⁻¹)</li>
        <li><strong>Dalton's Law:</strong> P_total = P₁ + P₂ + P₃...</li>
        <li><strong>Graham's Law:</strong> Rate₁/Rate₂ = √(M₂/M₁)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="formula-cards">
        <div class="formula-card">
            <h4>🧪 Ideal Gas Equation</h4>
            <div class="equation-box">
                <p><strong>PV = nRT</strong></p>
                <p>P = pressure, V = volume</p>
                <p>n = moles, T = temperature (K)</p>
            </div>
        </div>
        <div class="formula-card">
            <h4>💨 Graham's Law</h4>
            <p>Lighter gases diffuse <strong>faster</strong></p>
            <p>Rate ∝ 1/√M</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Example: Graham's Law</h4>
    <p>H₂ (M=2) vs O₂ (M=32)</p>
    <p>Rate ratio = √(32/2) = √16 = <strong>4:1</strong></p>
    <p>Hydrogen diffuses 4× faster than oxygen!</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using wrong value of R or forgetting units</li>
        <li>In Graham's law, lighter gas has HIGHER rate</li>
        <li>Forgetting temperature must be in Kelvin</li>
    </ul>
</div>`,
                        question: {
                            text: "If hydrogen (H₂, M=2) and oxygen (O₂, M=32) diffuse, what is the ratio of their diffusion rates?",
                            options: {
                                "A": "1:4",
                                "B": "4:1",
                                "C": "1:16",
                                "D": "16:1"
                            },
                            correctAnswer: "B",
                            explanation: "Using Graham's Law: Rate₁/Rate₂ = √(M₂/M₁) = √(32/2) = √16 = 4. So hydrogen diffuses 4 times faster than oxygen, giving a ratio of 4:1."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 4: ATOMIC STRUCTURE AND BONDING
    // ============================================================
    "Atomic Structure and Bonding": {
        subject: "Chemistry",
        topic: "Atomic Structure and Bonding",
        introduction: {
            title: "Atomic Structure and Bonding",
            description: "This topic explains what an atom really looks like inside (its parts and how electrons are arranged) and how atoms join together to form compounds through different types of bonds. It is very important because almost everything in chemistry depends on understanding atoms and bonding.",
            jambInfo: "JAMB normally asks 4-6 questions from this topic."
        },
        subtopics: [
            {
                name: "Atomic Structure",
                objectives: [
                    {
                        title: "Describe atomic structure and electron configuration",
                        explanation: `<p>An <strong>atom</strong> is the smallest part of an element that can take part in a chemical reaction. It has three main particles:</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-plus-circle" style="color: #e74c3c;"></i>
            <p><strong>Protons</strong></p>
            <p>Positive charge, in nucleus</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-circle" style="color: #95a5a6;"></i>
            <p><strong>Neutrons</strong></p>
            <p>No charge, in nucleus</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-minus-circle" style="color: #3498db;"></i>
            <p><strong>Electrons</strong></p>
            <p>Negative charge, in shells</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Atomic number (Z)</strong> = number of protons = number of electrons in neutral atom</li>
        <li><strong>Mass number (A)</strong> = protons + neutrons</li>
        <li><strong>Isotopes</strong> = atoms of same element with different neutrons</li>
        <li><strong>Electron configuration</strong> = how electrons fill shells (2, 8, 8, 18...)</li>
    </ul>
</div>

<div class="info-box">
    <h4>Electron Configuration Examples:</h4>
    <ul>
        <li>Carbon (Z=6): 2, 4</li>
        <li>Sodium (Z=11): 2, 8, 1</li>
        <li>Chlorine (Z=17): 2, 8, 7</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Confusing atomic number with mass number</li>
        <li>Forgetting maximum electrons per shell (2, 8, 18...)</li>
        <li>Thinking isotopes have different atomic numbers</li>
    </ul>
</div>`,
                        question: {
                            text: "The atomic number of an element is 11. What is its electron configuration?",
                            options: {
                                "A": "2, 8, 2",
                                "B": "2, 8, 1",
                                "C": "2, 9",
                                "D": "2, 1, 8"
                            },
                            correctAnswer: "B",
                            explanation: "Atomic number 11 means 11 electrons. First shell holds 2, second shell holds 8, third shell gets the remaining 1. So the configuration is 2, 8, 1 (this is sodium)."
                        }
                    },
                    {
                        title: "Explain types of bonding and their properties",
                        explanation: `<p>Atoms join together to become stable by <strong>sharing, giving, or receiving electrons</strong>. There are different types of chemical bonds:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>🔗 Ionic Bond</h4>
            <p><strong>Transfer</strong> of electrons between metal and non-metal</p>
            <p>Example: NaCl (Na gives e⁻ to Cl)</p>
            <p>High melting point, conducts when molten</p>
        </div>
        <div class="comparison-card">
            <h4>🤝 Covalent Bond</h4>
            <p><strong>Sharing</strong> of electrons between non-metals</p>
            <p>Example: H₂O (H shares with O)</p>
            <p>Usually low melting point, doesn't conduct</p>
        </div>
    </div>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>⚡ Metallic Bond</h4>
            <p>Free <strong>delocalized</strong> electrons in metal</p>
            <p>Example: Copper wire</p>
            <p>Good conductor, malleable, ductile</p>
        </div>
        <div class="comparison-card">
            <h4>💧 Hydrogen Bond</h4>
            <p>Attraction between H and O/N/F</p>
            <p>Example: Water molecules</p>
            <p>Explains high boiling point of water</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li><strong>Ionic:</strong> Metal + Non-metal → Transfer electrons → Form ions</li>
        <li><strong>Covalent:</strong> Non-metal + Non-metal → Share electrons</li>
        <li><strong>Metallic:</strong> Metal atoms with free electrons</li>
        <li><strong>Hydrogen bonding:</strong> Explains water's unique properties</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying covalent compounds conduct electricity (they usually don't)</li>
        <li>Forgetting ionic compounds only conduct when dissolved or molten</li>
        <li>Confusing hydrogen bonding with covalent bonding</li>
    </ul>
</div>`,
                        question: {
                            text: "Which type of bond involves complete transfer of electrons?",
                            options: {
                                "A": "Covalent",
                                "B": "Ionic",
                                "C": "Metallic",
                                "D": "Hydrogen"
                            },
                            correctAnswer: "B",
                            explanation: "Ionic bonding involves complete transfer of electrons from a metal atom to a non-metal atom, forming positive and negative ions that attract each other."
                        }
                    }
                ]
            },
            {
                name: "Molecular Shapes",
                objectives: [
                    {
                        title: "Predict shapes of simple molecules using VSEPR theory",
                        explanation: `<p>The <strong>VSEPR theory</strong> (Valence Shell Electron Pair Repulsion) predicts molecular shapes. Electron pairs push each other away to be as far apart as possible.</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <p>🔵 — 🔵</p>
            <p><strong>Linear (180°)</strong></p>
            <p>CO₂, BeCl₂</p>
        </div>
        <div class="visual-card">
            <p>🔵<br>⬡<br>🔵 🔵</p>
            <p><strong>Trigonal Planar (120°)</strong></p>
            <p>BF₃</p>
        </div>
        <div class="visual-card">
            <p>⬡<br>🔵🔵🔵🔵</p>
            <p><strong>Tetrahedral (109.5°)</strong></p>
            <p>CH₄</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Key Points - Molecular Shapes:</h4>
    <ul>
        <li><strong>2 electron pairs:</strong> Linear (180°) — Example: CO₂</li>
        <li><strong>3 electron pairs:</strong> Trigonal planar (120°) — Example: BF₃</li>
        <li><strong>4 electron pairs:</strong> Tetrahedral (109.5°) — Example: CH₄</li>
        <li><strong>4 pairs with 1 lone pair:</strong> Trigonal pyramidal — Example: NH₃</li>
        <li><strong>4 pairs with 2 lone pairs:</strong> Bent/Angular — Example: H₂O</li>
    </ul>
</div>

<div class="info-box">
    <h4>Important Examples:</h4>
    <ul>
        <li><strong>Methane (CH₄):</strong> Tetrahedral, 109.5°</li>
        <li><strong>Ammonia (NH₃):</strong> Trigonal pyramidal (1 lone pair)</li>
        <li><strong>Water (H₂O):</strong> Bent, 104.5° (2 lone pairs)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying water is linear (it's bent due to 2 lone pairs)</li>
        <li>Forgetting to count lone pairs when predicting shape</li>
        <li>Using 90° instead of 109.5° for tetrahedral</li>
    </ul>
</div>`,
                        question: {
                            text: "What is the shape of a methane (CH₄) molecule?",
                            options: {
                                "A": "Linear",
                                "B": "Tetrahedral",
                                "C": "Bent",
                                "D": "Trigonal pyramidal"
                            },
                            correctAnswer: "B",
                            explanation: "Methane has 4 bonding pairs around the central carbon atom with no lone pairs. According to VSEPR theory, 4 electron pairs arrange themselves in a tetrahedral shape with bond angles of 109.5°."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 5: ACIDS, BASES, AND SALTS
    // ============================================================
    "Acids, Bases, and Salts": {
        subject: "Chemistry",
        topic: "Acids, Bases, and Salts",
        introduction: {
            title: "Acids, Bases, and Salts",
            description: "This topic explains what acids and bases are, how they behave, and how they react to form salts. Acids taste sour (like lemon), bases feel soapy and taste bitter, while salts are neutral products from their reaction.",
            jambInfo: "This is one of the most important topics - usually 4-6 questions in every JAMB paper."
        },
        subtopics: [
            {
                name: "Acid-Base Theories",
                objectives: [
                    {
                        title: "Distinguish between Arrhenius, Bronsted-Lowry, and Lewis theories",
                        explanation: `<p>There are three main theories that explain what acids and bases are:</p>

<div class="visual-section">
    <div class="comparison-cards">
                        <div class="comparison-card">
            <h4>📗 Arrhenius Theory</h4>
            <p><strong>Acid:</strong> Produces H⁺ ions in water</p>
            <p><strong>Base:</strong> Produces OH⁻ ions in water</p>
            <p>Example: HCl → H⁺ + Cl⁻</p>
            <p><em>Limited to aqueous solutions</em></p>
        </div>
        <div class="comparison-card">
            <h4>📘 Bronsted-Lowry Theory</h4>
            <p><strong>Acid:</strong> Proton (H⁺) donor</p>
            <p><strong>Base:</strong> Proton (H⁺) acceptor</p>
            <p>Example: NH₃ accepts H⁺ → NH₄⁺</p>
            <p><em>Works in any solvent</em></p>
        </div>
    </div>
</div>

<div class="visual-section">
    <div class="visual-card" style="max-width: 400px; margin: 0 auto;">
        <h4>📙 Lewis Theory (Widest)</h4>
        <p><strong>Acid:</strong> Electron pair acceptor</p>
        <p><strong>Base:</strong> Electron pair donor</p>
        <p>Example: BF₃ + NH₃ → BF₃NH₃</p>
    </div>
</div>

<div class="key-points">
    <h4>Properties of Acids and Bases:</h4>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="background: #e8f5e9;">
            <th style="padding: 8px; border: 1px solid #ddd;">Acids</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Bases</th>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Sour taste</td>
            <td style="padding: 8px; border: 1px solid #ddd;">Bitter taste, soapy feel</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Turn blue litmus RED</td>
            <td style="padding: 8px; border: 1px solid #ddd;">Turn red litmus BLUE</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">pH < 7</td>
            <td style="padding: 8px; border: 1px solid #ddd;">pH > 7</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking Arrhenius works for all acids/bases (only in water)</li>
        <li>Confusing proton donor/acceptor in Bronsted-Lowry</li>
        <li>Saying Lewis acid donates electrons (it accepts!)</li>
    </ul>
</div>`,
                        question: {
                            text: "According to Bronsted-Lowry theory, NH₃ acts as a base because it:",
                            options: {
                                "A": "Produces OH⁻",
                                "B": "Accepts H⁺",
                                "C": "Accepts electron pair",
                                "D": "Donates H⁺"
                            },
                            correctAnswer: "B",
                            explanation: "In Bronsted-Lowry theory, a base is a proton (H⁺) acceptor. NH₃ accepts a proton to form NH₄⁺, making it a Bronsted-Lowry base."
                        }
                    }
                ]
            },
            {
                name: "Salts",
                objectives: [
                    {
                        title: "Classify and prepare different types of salts",
                        explanation: `<p><strong>Salts</strong> are ionic compounds formed when acids react with bases (neutralisation). They are classified by how they form:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Normal Salts</h4>
            <p>Complete neutralisation</p>
            <p>No H⁺ or OH⁻ left</p>
            <p>Examples: NaCl, CuSO₄, K₂SO₄</p>
        </div>
        <div class="comparison-card">
            <h4>Acidic Salts</h4>
            <p>Still have replaceable H⁺</p>
            <p>From polyprotic acids</p>
            <p>Examples: NaHSO₄, NaHCO₃</p>
        </div>
        <div class="comparison-card">
            <h4>Basic Salts</h4>
            <p>Have extra OH⁻ or basic oxide</p>
            <p>Incomplete neutralisation</p>
            <p>Example: Mg(OH)Cl</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Methods of Preparing Salts:</h4>
    <ul>
        <li><strong>Acid + Base → Salt + Water</strong> (Titration method)</li>
        <li><strong>Acid + Metal → Salt + H₂</strong></li>
        <li><strong>Acid + Carbonate → Salt + CO₂ + H₂O</strong></li>
        <li><strong>Acid + Metal Oxide → Salt + H₂O</strong></li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li>HCl + NaOH → <strong>NaCl</strong> + H₂O</li>
        <li>2HCl + Zn → <strong>ZnCl₂</strong> + H₂↑</li>
        <li>2HCl + CaCO₃ → <strong>CaCl₂</strong> + CO₂↑ + H₂O</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Calling NaHCO₃ a normal salt (it's acidic - has H⁺)</li>
        <li>Forgetting to evaporate and crystallise after neutralisation</li>
        <li>Mixing up acidic and basic salts</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is an acidic salt?",
                            options: {
                                "A": "NaCl",
                                "B": "NaHSO₄",
                                "C": "K₂SO₄",
                                "D": "CaCO₃"
                            },
                            correctAnswer: "B",
                            explanation: "NaHSO₄ (sodium hydrogen sulphate) is an acidic salt because it still has a replaceable hydrogen (H) that can donate a proton. NaCl and K₂SO₄ are normal salts with no replaceable H⁺."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 6: OXIDATION AND REDUCTION (REDOX)
    // ============================================================
    "Oxidation and Reduction – Redox": {
        subject: "Chemistry",
        topic: "Oxidation and Reduction – Redox",
        introduction: {
            title: "Oxidation and Reduction (Redox)",
            description: "Redox reactions involve the transfer of electrons between substances. One substance loses electrons (oxidation) while another gains electrons (reduction). They always happen together!",
            jambInfo: "JAMB asks 3-5 questions from this topic almost every year."
        },
        subtopics: [
            {
                name: "Redox Definitions",
                objectives: [
                    {
                        title: "Identify oxidation and reduction using electron transfer",
                        explanation: `<p>In redox reactions, electrons are transferred between substances. Use these memory aids:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="background: linear-gradient(135deg, #ffebee 0%, #fff 100%); border-color: #e57373;">
            <h4>🔴 OIL - Oxidation Is Loss</h4>
            <p>Oxidation = <strong>LOSS</strong> of electrons</p>
            <p>The substance becomes more positive</p>
            <p>Example: Mg → Mg²⁺ + 2e⁻</p>
        </div>
        <div class="comparison-card" style="background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%); border-color: #64b5f6;">
            <h4>🔵 RIG - Reduction Is Gain</h4>
            <p>Reduction = <strong>GAIN</strong> of electrons</p>
            <p>The substance becomes more negative</p>
            <p>Example: O₂ + 4e⁻ → 2O²⁻</p>
        </div>
    </div>
</div>

<div class="info-box" style="background: #fff3e0; border-left: 4px solid #ff9800;">
    <h4>🦁 LEO says GER</h4>
    <p><strong>L</strong>oss of <strong>E</strong>lectrons = <strong>O</strong>xidation</p>
    <p><strong>G</strong>ain of <strong>E</strong>lectrons = <strong>R</strong>eduction</p>
</div>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>Oxidation and reduction <strong>always happen together</strong></li>
        <li>The substance that gets reduced is the <strong>oxidising agent</strong></li>
        <li>The substance that gets oxidised is the <strong>reducing agent</strong></li>
    </ul>
</div>

<div class="example-box">
    <h4>Example: Mg + O₂ → MgO</h4>
    <ul>
        <li>Mg loses electrons → Mg is <strong>oxidised</strong> → Mg is the <strong>reducing agent</strong></li>
        <li>O₂ gains electrons → O is <strong>reduced</strong> → O₂ is the <strong>oxidising agent</strong></li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking oxidation needs oxygen (it's about electron loss!)</li>
        <li>Saying oxidising agent gets oxidised (no, it gets reduced!)</li>
        <li>Forgetting that both must happen together</li>
    </ul>
</div>`,
                        question: {
                            text: "In the reaction 2Mg + O₂ → 2MgO, which substance is oxidised?",
                            options: {
                                "A": "Oxygen",
                                "B": "Magnesium",
                                "C": "Magnesium oxide",
                                "D": "None"
                            },
                            correctAnswer: "B",
                            explanation: "Magnesium loses electrons (Mg → Mg²⁺ + 2e⁻), so it is oxidised. Remember: OIL - Oxidation Is Loss of electrons."
                        }
                    },
                    {
                        title: "Identify oxidising and reducing agents",
                        explanation: `<p>The <strong>oxidising agent</strong> and <strong>reducing agent</strong> are named based on what they CAUSE to happen to the other substance:</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Substance</th>
            <th style="padding: 12px; border: 1px solid #ddd;">What happens to it</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Called</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Loses electrons</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Gets <strong>oxidised</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Reducing agent</strong></td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">Gains electrons</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Gets <strong>reduced</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Oxidising agent</strong></td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Common Examples:</h4>
    <ul>
        <li><strong>Strong oxidising agents:</strong> KMnO₄ (purple), K₂Cr₂O₇, H₂O₂, Cl₂</li>
        <li><strong>Strong reducing agents:</strong> Metals (Zn, Mg, Fe), H₂S, C, CO</li>
    </ul>
</div>

<div class="example-box">
    <h4>Example: Zn + Cu²⁺ → Zn²⁺ + Cu</h4>
    <ul>
        <li>Zn loses 2e⁻ → Zn is oxidised → <strong>Zn is the reducing agent</strong></li>
        <li>Cu²⁺ gains 2e⁻ → Cu²⁺ is reduced → <strong>Cu²⁺ is the oxidising agent</strong></li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying the reducing agent is reduced (no - it gets oxidised!)</li>
        <li>Confusing which one causes which effect</li>
    </ul>
</div>`,
                        question: {
                            text: "In the reaction Fe + Cu²⁺ → Fe²⁺ + Cu, the oxidising agent is:",
                            options: {
                                "A": "Fe",
                                "B": "Cu²⁺",
                                "C": "Fe²⁺",
                                "D": "Cu"
                            },
                            correctAnswer: "B",
                            explanation: "Cu²⁺ gains electrons (gets reduced), so it is the oxidising agent. It causes Fe to lose electrons (get oxidised)."
                        }
                    }
                ]
            },
            {
                name: "Balancing Redox Equations",
                objectives: [
                    {
                        title: "Balance simple redox equations using the half-reaction method",
                        explanation: `<p>The <strong>half-reaction method</strong> breaks redox equations into two separate reactions - one for oxidation and one for reduction - then combines them.</p>

<div class="key-points">
    <h4>Steps to Balance Redox Equations:</h4>
    <ol>
        <li>Write two half-reactions (oxidation and reduction)</li>
        <li>Balance atoms other than H and O</li>
        <li>Balance O by adding H₂O</li>
        <li>Balance H by adding H⁺ (acidic) or OH⁻ (basic)</li>
        <li>Balance charge by adding electrons (e⁻)</li>
        <li>Multiply to make electrons equal</li>
        <li>Add half-reactions and cancel</li>
    </ol>
</div>

<div class="example-box">
    <h4>Example: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic)</h4>
    <p><strong>Oxidation:</strong> Fe²⁺ → Fe³⁺ + e⁻ (×5)</p>
    <p><strong>Reduction:</strong> MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O</p>
    <hr>
    <p><strong>Balanced:</strong> MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O</p>
</div>

<div class="info-box">
    <h4>Remember:</h4>
    <ul>
        <li>In acidic medium: Add <strong>H⁺</strong> to balance hydrogen</li>
        <li>In basic medium: Add <strong>OH⁻</strong> to balance</li>
        <li>Electrons lost = Electrons gained</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to multiply so electrons are equal</li>
        <li>Adding OH⁻ in acidic medium instead of H⁺</li>
        <li>Not balancing charge after balancing atoms</li>
    </ul>
</div>`,
                        question: {
                            text: "When balancing redox equations in acidic medium, we add:",
                            options: {
                                "A": "OH⁻",
                                "B": "H⁺",
                                "C": "H₂O only",
                                "D": "e⁻ only"
                            },
                            correctAnswer: "B",
                            explanation: "In acidic medium, we add H⁺ ions to balance hydrogen atoms after balancing oxygen with H₂O. In basic medium, we would add OH⁻ instead."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 7: ELECTROLYSIS
    // ============================================================
    "Electrolysis": {
        subject: "Chemistry",
        topic: "Electrolysis",
        introduction: {
            title: "Electrolysis",
            description: "Electrolysis is the process of using electricity to break down compounds into their elements. It's like using electric power to force a chemical reaction that wouldn't happen on its own.",
            jambInfo: "JAMB usually asks 3-5 questions on Faraday's laws, electrodes, and applications like electroplating."
        },
        subtopics: [
            {
                name: "Faraday's Laws",
                objectives: [
                    {
                        title: "Apply Faraday's laws to calculate mass deposited",
                        explanation: `<p><strong>Faraday's Laws</strong> help us calculate how much substance is produced during electrolysis.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>📗 First Law</h4>
            <p>Mass deposited ∝ Quantity of electricity</p>
            <p><strong>More current × time = More substance</strong></p>
        </div>
        <div class="comparison-card">
            <h4>📘 Second Law</h4>
            <p>Same electricity produces different masses for different substances</p>
            <p><strong>Depends on molar mass and valency</strong></p>
        </div>
    </div>
</div>

<div class="key-points" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <h4>🔢 The Formula (Learn by Heart!):</h4>
    <p style="font-size: 20px; text-align: center; font-weight: bold;">m = (Q × M) / (n × F)</p>
    <ul>
        <li><strong>m</strong> = mass deposited (grams)</li>
        <li><strong>Q</strong> = charge = Current (I) × Time (t) in seconds</li>
        <li><strong>M</strong> = molar mass of substance</li>
        <li><strong>n</strong> = number of electrons (valency)</li>
        <li><strong>F</strong> = Faraday constant = <strong>96,500 C/mol</strong></li>
    </ul>
</div>

<div class="example-box">
    <h4>Example Calculation:</h4>
    <p>2 amperes for 965 seconds through CuSO₄ (Cu=63.5, n=2)</p>
    <p>Q = 2 × 965 = 1930 C</p>
    <p>m = (1930 × 63.5) / (2 × 96500) = <strong>0.635 g</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to convert time to seconds (minutes × 60!)</li>
        <li>Using wrong n value (Cu²⁺ → n=2, Ag⁺ → n=1)</li>
        <li>Forgetting units in the formula</li>
    </ul>
</div>`,
                        question: {
                            text: "To deposit 1 mole of silver (Ag⁺, n=1), how many coulombs are needed?",
                            options: {
                                "A": "48,250 C",
                                "B": "96,500 C",
                                "C": "193,000 C",
                                "D": "32,000 C"
                            },
                            correctAnswer: "B",
                            explanation: "For a monovalent ion like Ag⁺ (n=1), one mole requires 1 Faraday of charge, which is 96,500 coulombs. For Cu²⁺ (n=2), it would need 2 × 96,500 = 193,000 C."
                        }
                    }
                ]
            },
            {
                name: "Electrolytic vs Electrochemical Cells",
                objectives: [
                    {
                        title: "Distinguish between electrolytic and electrochemical cells",
                        explanation: `<p>There are two types of cells that use electricity and chemistry together:</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Feature</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Electrolytic Cell</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Electrochemical (Galvanic)</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Energy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">⚡→ Electricity IN → Reaction</td>
            <td style="padding: 12px; border: 1px solid #ddd;">🔋→ Reaction → Electricity OUT</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Reaction Type</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Non-spontaneous (forced)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Spontaneous</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Anode</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Positive (+)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Negative (-)</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Cathode</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Negative (-)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Positive (+)</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Example</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Electroplating, electrolysis</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Batteries, dry cells</td>
        </tr>
    </table>
</div>

<div class="info-box">
    <h4>Remember:</h4>
    <p><strong>Anode = Always where Oxidation happens</strong> (lose electrons)</p>
    <p><strong>Cathode = Always where Reduction happens</strong> (gain electrons)</p>
    <p>Memory trick: <strong>AN OX</strong> (Anode-Oxidation), <strong>RED CAT</strong> (Reduction-Cathode)</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Mixing up anode signs between cell types</li>
        <li>Forgetting that oxidation ALWAYS happens at anode</li>
    </ul>
</div>`,
                        question: {
                            text: "In an electrolytic cell, the anode is:",
                            options: {
                                "A": "Negative",
                                "B": "Positive",
                                "C": "Neutral",
                                "D": "Either positive or negative"
                            },
                            correctAnswer: "B",
                            explanation: "In an electrolytic cell, the anode is connected to the positive terminal of the battery. Remember: the signs are opposite in electrochemical (galvanic) cells."
                        }
                    }
                ]
            },
            {
                name: "Applications of Electrolysis",
                objectives: [
                    {
                        title: "Explain electroplating and purification of metals",
                        explanation: `<p>Electrolysis has important industrial applications:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>✨ Electroplating</h4>
            <p>Coating a cheap metal with expensive metal</p>
            <ul>
                <li><strong>Object to plate = Cathode (-)</strong></li>
                <li><strong>Coating metal = Anode (+)</strong></li>
                <li>Solution contains coating metal ions</li>
            </ul>
            <p><em>Example: Silver-plating an iron spoon</em></p>
        </div>
        <div class="comparison-card">
            <h4>🔧 Purification of Copper</h4>
            <p>Making pure copper for electrical wires</p>
            <ul>
                <li><strong>Impure copper = Anode</strong> (dissolves)</li>
                <li><strong>Pure copper = Cathode</strong> (grows)</li>
                <li>Impurities fall as "anode sludge"</li>
            </ul>
            <p><em>Electrolyte: CuSO₄ solution</em></p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Other Applications:</h4>
    <ul>
        <li><strong>Extraction of reactive metals:</strong> Al from bauxite ore</li>
        <li><strong>Electrolysis of water:</strong> 2H₂O → 2H₂ + O₂</li>
        <li><strong>Production of chlorine:</strong> From brine (NaCl solution)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking object to be plated is anode (NO - it's cathode!)</li>
        <li>Forgetting impurities collect as anode sludge</li>
    </ul>
</div>`,
                        question: {
                            text: "In electroplating of silver on iron, the iron object is connected to:",
                            options: {
                                "A": "Anode",
                                "B": "Cathode",
                                "C": "Both electrodes",
                                "D": "Neither electrode"
                            },
                            correctAnswer: "B",
                            explanation: "The object to be plated is always the cathode (negative electrode). Metal ions in solution gain electrons at the cathode and deposit on the object."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 8: ENERGY CHANGES
    // ============================================================
    "Energy Changes": {
        subject: "Chemistry",
        topic: "Energy Changes",
        introduction: {
            title: "Energy Changes in Reactions",
            description: "This topic explains how energy is involved in chemical reactions. Some reactions release heat (exothermic) while others absorb heat (endothermic). Understanding these changes helps predict if reactions will happen spontaneously.",
            jambInfo: "JAMB asks 3-5 questions on ∆H values, Hess's law, and spontaneity."
        },
        subtopics: [
            {
                name: "Exothermic and Endothermic Reactions",
                objectives: [
                    {
                        title: "Distinguish between exothermic and endothermic reactions",
                        explanation: `<p>Every reaction involves energy change called <strong>enthalpy change (∆H)</strong>.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="background: linear-gradient(135deg, #ffebee 0%, #fff 100%); border-color: #f44336;">
            <h4>🔥 Exothermic (Heat OUT)</h4>
            <p><strong>∆H is NEGATIVE (−)</strong></p>
            <p>Heat is released to surroundings</p>
            <p>Container feels <strong>HOT</strong></p>
            <p><em>Examples: Burning fuel, neutralisation, respiration</em></p>
        </div>
        <div class="comparison-card" style="background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%); border-color: #2196f3;">
            <h4>❄️ Endothermic (Heat IN)</h4>
            <p><strong>∆H is POSITIVE (+)</strong></p>
            <p>Heat is absorbed from surroundings</p>
            <p>Container feels <strong>COLD</strong></p>
            <p><em>Examples: Photosynthesis, dissolving NH₄NO₃</em></p>
        </div>
    </div>
</div>

<div class="info-box" style="background: #fff3e0; border-left: 4px solid #ff9800;">
    <h4>Memory Trick:</h4>
    <p><strong>EXO = EXIT</strong> → Heat exits → ∆H negative (−)</p>
    <p><strong>ENDO = ENTER</strong> → Heat enters → ∆H positive (+)</p>
</div>

<div class="key-points">
    <h4>Energy Level Diagrams:</h4>
    <p>📉 <strong>Exothermic:</strong> Products lower than reactants (energy released)</p>
    <p>📈 <strong>Endothermic:</strong> Products higher than reactants (energy absorbed)</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking negative ∆H = endothermic (NO - negative = exothermic!)</li>
        <li>Confusing "reaction absorbs heat" with "surroundings absorb heat"</li>
    </ul>
</div>`,
                        question: {
                            text: "If ∆H = −890 kJ/mol for a reaction, the reaction is:",
                            options: {
                                "A": "Endothermic",
                                "B": "Exothermic",
                                "C": "Neutral",
                                "D": "Reversible"
                            },
                            correctAnswer: "B",
                            explanation: "A negative ∆H value means heat is released to the surroundings, making it an exothermic reaction. The negative sign indicates energy is lost from the system."
                        }
                    }
                ]
            },
            {
                name: "Hess's Law",
                objectives: [
                    {
                        title: "Use Hess's law to calculate enthalpy changes",
                        explanation: `<p><strong>Hess's Law</strong> states that the total enthalpy change for a reaction is the same whether it occurs in one step or multiple steps.</p>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>Hess's Law in Simple Words:</h4>
    <p>It doesn't matter which route you take from A to B - the total energy change is always the same!</p>
    <p>This is useful when we can't measure a reaction directly.</p>
</div>

<div class="key-points">
    <h4>How to Use Hess's Law:</h4>
    <ol>
        <li>Write the target equation you need ∆H for</li>
        <li>Find alternative equations that add up to the target</li>
        <li>If you reverse an equation, <strong>change the sign of ∆H</strong></li>
        <li>If you multiply an equation, <strong>multiply ∆H too</strong></li>
        <li>Add up all the ∆H values</li>
    </ol>
</div>

<div class="example-box">
    <h4>Example: Finding ∆H for C + ½O₂ → CO</h4>
    <p>Given:</p>
    <p>(1) C + O₂ → CO₂ ... ∆H = −393 kJ</p>
    <p>(2) CO + ½O₂ → CO₂ ... ∆H = −283 kJ</p>
    <hr>
    <p>Target = Equation (1) − Equation (2)</p>
    <p>∆H = −393 − (−283) = <strong>−110 kJ</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to reverse the sign when reversing a reaction</li>
        <li>Not multiplying ∆H when multiplying equation coefficients</li>
    </ul>
</div>`,
                        question: {
                            text: "According to Hess's law, the enthalpy change of a reaction depends on:",
                            options: {
                                "A": "The path taken",
                                "B": "Initial and final states only",
                                "C": "Temperature only",
                                "D": "Presence of catalyst"
                            },
                            correctAnswer: "B",
                            explanation: "Hess's law states that enthalpy change depends only on the initial and final states, not the path. Whether you go directly or through multiple steps, the total ∆H is the same."
                        }
                    }
                ]
            },
            {
                name: "Spontaneity and Gibbs Free Energy",
                objectives: [
                    {
                        title: "Relate ∆H, ∆S, and ∆G to predict spontaneity",
                        explanation: `<p>Not all exothermic reactions happen spontaneously. We use <strong>Gibbs Free Energy (∆G)</strong> to predict if a reaction will occur on its own.</p>

<div class="key-points" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <h4>🔢 The Equation:</h4>
    <p style="font-size: 24px; text-align: center; font-weight: bold;">∆G = ∆H − T∆S</p>
    <ul>
        <li><strong>∆G</strong> = Gibbs free energy change</li>
        <li><strong>∆H</strong> = Enthalpy change</li>
        <li><strong>T</strong> = Temperature (in Kelvin!)</li>
        <li><strong>∆S</strong> = Entropy change (disorder)</li>
    </ul>
</div>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">∆G Value</th>
            <th style="padding: 12px; border: 1px solid #ddd;">What Happens</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">∆G < 0 (negative)</td>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>SPONTANEOUS</strong> - happens on its own ✅</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">∆G > 0 (positive)</td>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>NOT SPONTANEOUS</strong> - needs energy ❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">∆G = 0</td>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>EQUILIBRIUM</strong> - no net change ⚖️</td>
        </tr>
    </table>
</div>

<div class="info-box">
    <h4>What is Entropy (∆S)?</h4>
    <p><strong>Entropy = Disorder/Randomness</strong></p>
    <ul>
        <li>More disorder (solid → gas) → ∆S positive (+)</li>
        <li>Less disorder (gas → solid) → ∆S negative (−)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using Celsius instead of Kelvin for T</li>
        <li>Thinking all exothermic reactions are spontaneous</li>
    </ul>
</div>`,
                        question: {
                            text: "A reaction with ∆H negative and ∆S positive is:",
                            options: {
                                "A": "Non-spontaneous",
                                "B": "Spontaneous at all temperatures",
                                "C": "Spontaneous only at low temperature",
                                "D": "At equilibrium"
                            },
                            correctAnswer: "B",
                            explanation: "When ∆H is negative (exothermic) and ∆S is positive (more disorder), ∆G = ∆H − T∆S will always be negative regardless of temperature, making the reaction spontaneous at all temperatures."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 9: RATES OF CHEMICAL REACTION
    // ============================================================
    "Rates of Chemical Reaction": {
        subject: "Chemistry",
        topic: "Rates of Chemical Reaction",
        introduction: {
            title: "Rates of Chemical Reaction",
            description: "This topic explains how fast or slow chemical reactions occur and what factors affect the speed. Some reactions are instant (like explosions) while others take years (like rusting).",
            jambInfo: "JAMB asks 3-5 questions on factors affecting rate, collision theory, and rate graphs."
        },
        subtopics: [
            {
                name: "Factors Affecting Rate",
                objectives: [
                    {
                        title: "Explain factors that affect reaction rate",
                        explanation: `<p>A reaction happens when particles <strong>collide with enough energy</strong>. Anything that increases successful collisions speeds up the reaction.</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-compress-arrows-alt" style="color: #e91e63; font-size: 28px;"></i>
            <p><strong>Concentration ↑</strong></p>
            <p>More particles = more collisions</p>
            <p>Rate <strong>increases</strong></p>
        </div>
        <div class="visual-card">
            <i class="fas fa-thermometer-full" style="color: #f44336; font-size: 28px;"></i>
            <p><strong>Temperature ↑</strong></p>
            <p>Faster, harder collisions</p>
            <p>Rate <strong>increases a lot</strong></p>
        </div>
        <div class="visual-card">
            <i class="fas fa-magic" style="color: #9c27b0; font-size: 28px;"></i>
            <p><strong>Catalyst</strong></p>
            <p>Lowers activation energy</p>
            <p>Rate <strong>increases</strong></p>
        </div>
        <div class="visual-card">
            <i class="fas fa-cubes" style="color: #ff9800; font-size: 28px;"></i>
            <p><strong>Surface Area ↑</strong></p>
            <p>More exposed particles</p>
            <p>Rate <strong>increases</strong></p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Key Facts:</h4>
    <ul>
        <li><strong>Temperature:</strong> 10°C rise roughly doubles the rate!</li>
        <li><strong>Catalyst:</strong> Provides alternative path with lower activation energy</li>
        <li><strong>Activation energy:</strong> Minimum energy needed for reaction</li>
    </ul>
</div>

<div class="info-box">
    <h4>Examples:</h4>
    <ul>
        <li>Powder dissolves faster than lumps (more surface area)</li>
        <li>Food cooks faster at higher temperature</li>
        <li>MnO₂ catalyst speeds up H₂O₂ decomposition</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking catalyst is "used up" (it remains unchanged)</li>
        <li>Saying higher concentration makes particles move faster (NO - just more collisions)</li>
    </ul>
</div>`,
                        question: {
                            text: "A catalyst increases reaction rate by:",
                            options: {
                                "A": "Increasing temperature",
                                "B": "Lowering activation energy",
                                "C": "Changing the products",
                                "D": "Being used up"
                            },
                            correctAnswer: "B",
                            explanation: "A catalyst provides an alternative pathway with lower activation energy, allowing more particles to have enough energy to react successfully. The catalyst is not consumed in the reaction."
                        }
                    }
                ]
            },
            {
                name: "Collision Theory",
                objectives: [
                    {
                        title: "Explain collision theory and its application",
                        explanation: `<p><strong>Collision Theory</strong> explains why reactions happen and what affects their rate.</p>

<div class="key-points" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>For a Reaction to Occur, Particles Must:</h4>
    <ol>
        <li><strong>Collide</strong> with each other</li>
        <li>Have <strong>enough energy</strong> (≥ activation energy)</li>
        <li>Collide in the <strong>correct orientation</strong></li>
    </ol>
</div>

<div class="info-box">
    <h4>Why Are Some Reactions Slow?</h4>
    <p>Not all collisions are successful! Only collisions with:</p>
    <ul>
        <li>Energy ≥ activation energy</li>
        <li>Correct orientation (particles hit the right way)</li>
    </ul>
    <p>...lead to a reaction. Most collisions just bounce off!</p>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>✅ Successful Collision</h4>
            <p>High energy + correct orientation</p>
            <p>→ Reaction occurs!</p>
        </div>
        <div class="comparison-card">
            <h4>❌ Unsuccessful Collision</h4>
            <p>Low energy OR wrong orientation</p>
            <p>→ Particles just bounce away</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking every collision causes a reaction</li>
        <li>Forgetting that orientation matters</li>
    </ul>
</div>`,
                        question: {
                            text: "According to collision theory, reactions are faster at higher temperature because:",
                            options: {
                                "A": "Particles become bigger",
                                "B": "Particles collide more often and with more energy",
                                "C": "Particles change colour",
                                "D": "Activation energy increases"
                            },
                            correctAnswer: "B",
                            explanation: "At higher temperatures, particles move faster, leading to more frequent collisions AND more collisions with energy greater than or equal to the activation energy."
                        }
                    }
                ]
            },
            {
                name: "Rate Graphs",
                objectives: [
                    {
                        title: "Interpret concentration-time and rate graphs",
                        explanation: `<p>Graphs help us understand and measure reaction rates.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>📉 Concentration vs Time</h4>
            <p>Curve goes DOWN (reactant decreases)</p>
            <ul>
                <li><strong>Steep</strong> = fast reaction</li>
                <li><strong>Flat</strong> = slow/finished</li>
                <li>Rate = slope of curve at any point</li>
            </ul>
        </div>
        <div class="comparison-card">
            <h4>📈 Rate vs Concentration</h4>
            <p>Shows how rate depends on concentration</p>
            <ul>
                <li><strong>Straight line through origin</strong> = First order</li>
                <li>Rate ∝ [concentration]</li>
            </ul>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Reading Concentration-Time Graphs:</h4>
    <ul>
        <li><strong>Initial rate</strong> = steepest part (at the beginning)</li>
        <li><strong>Average rate</strong> = total change ÷ total time</li>
        <li>Reaction <strong>slows down</strong> as reactants are used up</li>
    </ul>
</div>

<div class="info-box">
    <h4>Finding Rate from Graph:</h4>
    <p>Draw a tangent to the curve at any point</p>
    <p>Rate = gradient (slope) of that tangent</p>
    <p>Steeper tangent = faster rate</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Reading graph backwards (flat part is NOT fast)</li>
        <li>Thinking rate increases as concentration decreases</li>
    </ul>
</div>`,
                        question: {
                            text: "In a concentration vs time graph, the reaction is fastest:",
                            options: {
                                "A": "At the end (flat part)",
                                "B": "At the beginning (steep part)",
                                "C": "In the middle",
                                "D": "Always the same throughout"
                            },
                            correctAnswer: "B",
                            explanation: "The reaction is fastest at the beginning when the concentration is highest. The steep slope at the start indicates a high rate. As reactants are consumed, the rate decreases and the curve flattens."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 10: CHEMICAL EQUILIBRIUM
    // ============================================================
    "Chemical Equilibrium": {
        subject: "Chemistry",
        topic: "Chemical Equilibrium",
        introduction: {
            title: "Chemical Equilibrium",
            description: "Chemical equilibrium is when a reversible reaction goes both ways at the same time and the amounts of reactants and products stop changing. It looks like nothing is happening, but forward and backward reactions are still going on at the same speed!",
            jambInfo: "JAMB asks 4-6 questions on Le Chatelier's principle and equilibrium constants every year."
        },
        subtopics: [
            {
                name: "Reversible Reactions",
                objectives: [
                    {
                        title: "Understand reversible reactions and dynamic equilibrium",
                        explanation: `<p>A <strong>reversible reaction</strong> can go both ways: reactants → products AND products → reactants. We write it with a double arrow ⇌</p>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>🎯 What is Dynamic Equilibrium?</h4>
    <p>At equilibrium:</p>
    <ul>
        <li>Forward rate = Backward rate</li>
        <li>Concentrations become <strong>constant</strong> (not zero!)</li>
        <li>Reactions <strong>never stop</strong> - they continue equally</li>
    </ul>
</div>

<div class="example-box">
    <h4>Analogy: Tug of War</h4>
    <p>Imagine two teams pulling with exactly the same strength. The rope doesn't move - but both teams are still pulling hard!</p>
    <p>That's equilibrium - activity without visible change.</p>
</div>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>Equilibrium can be reached from <strong>either direction</strong></li>
        <li>The same equilibrium position is reached</li>
        <li>Temperature affects equilibrium position</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking equilibrium means reactions stop (NO - they continue!)</li>
        <li>Saying all reactants are used up (NO - some always remain)</li>
    </ul>
</div>`,
                        question: {
                            text: "In dynamic equilibrium:",
                            options: {
                                "A": "Forward reaction stops",
                                "B": "Both reactions continue at the same rate",
                                "C": "No reaction happens",
                                "D": "Only backward reaction continues"
                            },
                            correctAnswer: "B",
                            explanation: "Dynamic equilibrium means both forward and backward reactions continue at equal rates. The concentrations stay constant because the rates balance out."
                        }
                    }
                ]
            },
            {
                name: "Le Chatelier's Principle",
                objectives: [
                    {
                        title: "Apply Le Chatelier's principle to predict equilibrium shifts",
                        explanation: `<p><strong>Le Chatelier's Principle:</strong> If you change the conditions of an equilibrium system, it will shift to <strong>oppose</strong> the change.</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-flask" style="color: #9c27b0; font-size: 28px;"></i>
            <p><strong>Concentration</strong></p>
            <p>Add reactant → Shifts RIGHT</p>
            <p>Add product → Shifts LEFT</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-thermometer-half" style="color: #f44336; font-size: 28px;"></i>
            <p><strong>Temperature</strong></p>
            <p>↑ Temp → Shifts ENDOTHERMIC</p>
            <p>↓ Temp → Shifts EXOTHERMIC</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-compress-alt" style="color: #2196f3; font-size: 28px;"></i>
            <p><strong>Pressure (gases)</strong></p>
            <p>↑ Pressure → Fewer moles side</p>
            <p>↓ Pressure → More moles side</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Haber Process: N₂ + 3H₂ ⇌ 2NH₃ (exothermic)</h4>
    <p><strong>To get more ammonia:</strong></p>
    <ul>
        <li>↑ Pressure (4 moles → 2 moles) ✅</li>
        <li>↓ Temperature (exothermic favored) ✅</li>
        <li>Remove NH₃ as formed ✅</li>
    </ul>
</div>

<div class="info-box" style="background: #fff3e0; border-left: 4px solid #ff9800;">
    <h4>⚠️ Important:</h4>
    <p><strong>Catalyst does NOT change equilibrium position!</strong></p>
    <p>It only makes equilibrium reached faster.</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking catalyst shifts equilibrium (it doesn't!)</li>
        <li>Forgetting to count gas moles for pressure effect</li>
    </ul>
</div>`,
                        question: {
                            text: "In the reaction N₂ + 3H₂ ⇌ 2NH₃ (exothermic), to get more ammonia we should:",
                            options: {
                                "A": "Increase temperature",
                                "B": "Decrease pressure",
                                "C": "Increase pressure",
                                "D": "Add a catalyst"
                            },
                            correctAnswer: "C",
                            explanation: "Increasing pressure shifts equilibrium to the side with fewer gas molecules. Left side has 4 moles (1+3), right side has 2 moles, so high pressure favors ammonia production."
                        }
                    }
                ]
            },
            {
                name: "Equilibrium Constant (Kc)",
                objectives: [
                    {
                        title: "Write and calculate equilibrium constant expressions",
                        explanation: `<p>The <strong>equilibrium constant (Kc)</strong> tells us how far a reaction goes toward products.</p>

<div class="key-points" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <h4>🔢 The Formula:</h4>
    <p>For reaction: aA + bB ⇌ cC + dD</p>
    <p style="font-size: 20px; text-align: center; font-weight: bold;">Kc = [C]<sup>c</sup>[D]<sup>d</sup> / [A]<sup>a</sup>[B]<sup>b</sup></p>
    <p>Products on top, reactants on bottom</p>
</div>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Kc Value</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Meaning</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Kc >> 1 (very large)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Products favored at equilibrium</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">Kc << 1 (very small)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Reactants favored at equilibrium</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Kc ≈ 1</td>
            <td style="padding: 12px; border: 1px solid #ddd;">About equal amounts</td>
        </tr>
    </table>
</div>

<div class="info-box">
    <h4>Rules for Kc:</h4>
    <ul>
        <li>Only include <strong>(aq) and (g)</strong> - NOT solids or pure liquids</li>
        <li>Kc only changes with <strong>temperature</strong></li>
        <li>Changing concentration shifts position but NOT Kc value</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to raise concentrations to coefficient powers</li>
        <li>Including solids in Kc expression (never!)</li>
    </ul>
</div>`,
                        question: {
                            text: "For the reaction 2SO₂ + O₂ ⇌ 2SO₃, the expression for Kc is:",
                            options: {
                                "A": "[SO₃]² / [SO₂]²[O₂]",
                                "B": "[SO₂]²[O₂] / [SO₃]²",
                                "C": "[SO₃] / [SO₂][O₂]",
                                "D": "[SO₃]²"
                            },
                            correctAnswer: "A",
                            explanation: "Kc = products/reactants with coefficients as powers. So Kc = [SO₃]² / ([SO₂]² × [O₂])"
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 11: ORGANIC COMPOUNDS
    // ============================================================
    "Organic Compounds": {
        subject: "Chemistry",
        topic: "Organic Compounds",
        introduction: {
            title: "Organic Compounds",
            description: "Organic chemistry is the study of carbon-containing compounds. Carbon is special because it can form long chains and rings, creating millions of different compounds including fuels, plastics, medicines, and food!",
            jambInfo: "This is one of the biggest topics - JAMB asks 6-8 questions on naming, functional groups, and reactions."
        },
        subtopics: [
            {
                name: "Classification and Functional Groups",
                objectives: [
                    {
                        title: "Classify organic compounds and identify functional groups",
                        explanation: `<p>Organic compounds are classified by their <strong>functional groups</strong> - special arrangements of atoms that give them characteristic properties.</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 10px; border: 1px solid #ddd;">Family</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Formula</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Functional Group</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Example</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Ending</th>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Alkanes</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CₙH₂ₙ₊₂</td>
            <td style="padding: 10px; border: 1px solid #ddd;">None (single bonds)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CH₄ Methane</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>-ane</strong></td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Alkenes</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CₙH₂ₙ</td>
            <td style="padding: 10px; border: 1px solid #ddd;">C=C (double bond)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">C₂H₄ Ethene</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>-ene</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Alkynes</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CₙH₂ₙ₋₂</td>
            <td style="padding: 10px; border: 1px solid #ddd;">C≡C (triple bond)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">C₂H₂ Ethyne</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>-yne</strong></td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Alcohols</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CₙH₂ₙ₊₁OH</td>
            <td style="padding: 10px; border: 1px solid #ddd;">–OH (hydroxyl)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">C₂H₅OH Ethanol</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>-ol</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Carboxylic Acids</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CₙH₂ₙ₊₁COOH</td>
            <td style="padding: 10px; border: 1px solid #ddd;">–COOH (carboxyl)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">CH₃COOH</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>-oic acid</strong></td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Hydrocarbons (only C and H):</h4>
    <ul>
        <li><strong>Saturated:</strong> Alkanes (single bonds only) - less reactive</li>
        <li><strong>Unsaturated:</strong> Alkenes/Alkynes (double/triple bonds) - more reactive</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Confusing alkene (C=C, -ene) with alkane (single bonds, -ane)</li>
        <li>Wrong formula: Alkene is CₙH₂ₙ, NOT CₙH₂ₙ₊₂</li>
    </ul>
</div>`,
                        question: {
                            text: "The functional group in ethanol (C₂H₅OH) is:",
                            options: {
                                "A": "–COOH",
                                "B": "–OH",
                                "C": "C=C",
                                "D": "C≡C"
                            },
                            correctAnswer: "B",
                            explanation: "Ethanol is an alcohol, and the functional group of alcohols is the hydroxyl group (–OH). This is what gives alcohols their characteristic properties."
                        }
                    }
                ]
            },
            {
                name: "IUPAC Nomenclature and Isomerism",
                objectives: [
                    {
                        title: "Name organic compounds using IUPAC rules",
                        explanation: `<p>IUPAC naming follows systematic rules to give every compound a unique name.</p>

<div class="key-points">
    <h4>IUPAC Naming Steps:</h4>
    <ol>
        <li><strong>Find longest carbon chain</strong> → base name (meth-, eth-, prop-, but-, pent-)</li>
        <li><strong>Number the chain</strong> so functional group gets lowest number</li>
        <li><strong>Name branches</strong> with position (2-methyl-, 3-ethyl-)</li>
        <li><strong>Add suffix</strong> for functional group (-ol, -ene, -oic acid)</li>
    </ol>
</div>

<div class="info-box">
    <h4>Carbon Chain Prefixes:</h4>
    <p><strong>1=Meth</strong>, <strong>2=Eth</strong>, <strong>3=Prop</strong>, <strong>4=But</strong>, <strong>5=Pent</strong>, <strong>6=Hex</strong></p>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li>CH₃–CH₂–CH₃ → <strong>Propane</strong></li>
        <li>CH₃–CH=CH₂ → <strong>Propene</strong></li>
        <li>CH₃–CH₂–OH → <strong>Ethanol</strong></li>
        <li>CH₃–CH(CH₃)–CH₃ → <strong>2-Methylpropane</strong></li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Structural Isomers</h4>
            <p>Same formula, <strong>different connectivity</strong></p>
            <p>Example: Butane vs 2-Methylpropane</p>
            <p>Both are C₄H₁₀</p>
        </div>
        <div class="comparison-card">
            <h4>Geometric Isomers</h4>
            <p>Same formula, <strong>different spatial arrangement</strong></p>
            <p>Example: cis-but-2-ene vs trans-but-2-ene</p>
            <p>Only in alkenes with different groups</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Numbering from wrong end (give lowest number to functional group!)</li>
        <li>Forgetting to name branch positions</li>
    </ul>
</div>`,
                        question: {
                            text: "Compounds with the same molecular formula but different structural arrangement are called:",
                            options: {
                                "A": "Allotropes",
                                "B": "Isotopes",
                                "C": "Isomers",
                                "D": "Polymers"
                            },
                            correctAnswer: "C",
                            explanation: "Isomers have the same molecular formula but different arrangements of atoms. Isotopes are atoms with different neutrons, allotropes are different forms of an element."
                        }
                    }
                ]
            },
            {
                name: "Reactions of Organic Compounds",
                objectives: [
                    {
                        title: "Describe important reactions of hydrocarbons and alcohols",
                        explanation: `<p>Different organic compounds undergo characteristic reactions:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>🔥 Alkanes</h4>
            <p><strong>Combustion:</strong> CₙH₂ₙ₊₂ + O₂ → CO₂ + H₂O</p>
            <p><strong>Substitution:</strong> CH₄ + Cl₂ → CH₃Cl + HCl (in light)</p>
            <p><em>Relatively unreactive</em></p>
        </div>
        <div class="comparison-card">
            <h4>⚡ Alkenes</h4>
            <p><strong>Addition reactions:</strong></p>
            <ul style="text-align: left; font-size: 13px;">
                <li>+ H₂ → Alkane (hydrogenation)</li>
                <li>+ Br₂ → Dibromoalkane (decolourises bromine!)</li>
                <li>+ H₂O → Alcohol (hydration)</li>
            </ul>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Important Reactions:</h4>
    <ul>
        <li><strong>Test for unsaturation:</strong> Alkenes decolourise bromine water (brown → colourless)</li>
        <li><strong>Esterification:</strong> Alcohol + Acid ⇌ Ester + Water</li>
        <li><strong>Oxidation of alcohols:</strong> Primary alcohol → Aldehyde → Carboxylic acid</li>
        <li><strong>Polymerization:</strong> Many alkene molecules → Polymer (e.g., ethene → polyethene)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Esterification Example:</h4>
    <p>CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O</p>
    <p>(Ethanoic acid + Ethanol → Ethyl ethanoate + Water)</p>
    <p>Catalyst: Concentrated H₂SO₄</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Confusing substitution (alkanes) with addition (alkenes)</li>
        <li>Forgetting alkenes decolourise bromine water - key test!</li>
    </ul>
</div>`,
                        question: {
                            text: "The reaction CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br is an example of:",
                            options: {
                                "A": "Substitution",
                                "B": "Addition",
                                "C": "Polymerization",
                                "D": "Oxidation"
                            },
                            correctAnswer: "B",
                            explanation: "This is an addition reaction where bromine adds across the double bond of ethene. The double bond breaks to allow bromine atoms to attach to each carbon."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 12: METALS AND THEIR COMPOUNDS
    // ============================================================
    "Metals and Their Compounds": {
        subject: "Chemistry",
        topic: "Metals and Their Compounds",
        introduction: {
            title: "Metals and Their Compounds",
            description: "Metals are elements that are shiny, conduct electricity, and can be hammered into shapes. This topic covers their properties, the reactivity series, and how metals are extracted from ores.",
            jambInfo: "JAMB asks 4-6 questions on properties, reactivity series, and extraction methods."
        },
        subtopics: [
            {
                name: "Properties of Metals",
                objectives: [
                    {
                        title: "Describe physical and chemical properties of metals",
                        explanation: `<p>Metals have characteristic properties due to their structure with <strong>free (delocalized) electrons</strong>.</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-sun" style="color: #ffc107; font-size: 28px;"></i>
            <p><strong>Lustrous</strong></p>
            <p>Shiny when polished</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-bolt" style="color: #ff9800; font-size: 28px;"></i>
            <p><strong>Conductors</strong></p>
            <p>Heat and electricity</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-hammer" style="color: #795548; font-size: 28px;"></i>
            <p><strong>Malleable</strong></p>
            <p>Can be hammered into sheets</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-grip-lines" style="color: #607d8b; font-size: 28px;"></i>
            <p><strong>Ductile</strong></p>
            <p>Can be drawn into wires</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Chemical Properties:</h4>
    <ul>
        <li>Lose electrons easily → Form <strong>positive ions (cations)</strong></li>
        <li>Form <strong>basic oxides</strong> (some amphoteric like Al, Zn)</li>
        <li>React with oxygen, water, acids (depending on reactivity)</li>
    </ul>
</div>

<div class="info-box">
    <h4>Exceptions:</h4>
    <ul>
        <li><strong>Mercury</strong> - only liquid metal at room temperature</li>
        <li><strong>Alkali metals</strong> - soft, low density, low melting point</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying metals are brittle (NO - non-metals are brittle!)</li>
        <li>Forgetting malleability vs ductility</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is NOT a property of metals?",
                            options: {
                                "A": "Good conductor of electricity",
                                "B": "Malleable",
                                "C": "Brittle",
                                "D": "Ductile"
                            },
                            correctAnswer: "C",
                            explanation: "Brittleness is a property of non-metals, not metals. Metals are malleable (can be hammered) and ductile (can be drawn into wires)."
                        }
                    }
                ]
            },
            {
                name: "Reactivity Series",
                objectives: [
                    {
                        title: "Apply the reactivity series to predict reactions",
                        explanation: `<p>The <strong>reactivity series</strong> arranges metals from most reactive to least reactive.</p>

<div class="key-points" style="background: linear-gradient(180deg, #ffebee 0%, #e8f5e9 100%); padding: 20px; border-radius: 8px;">
    <h4>🔽 Reactivity Series (Most → Least):</h4>
    <p style="font-size: 16px; text-align: center; font-weight: 600; letter-spacing: 2px;">
        K → Na → Ca → Mg → Al → (C) → Zn → Fe → Sn → Pb → (H) → Cu → Ag → Au
    </p>
    <p style="font-size: 12px; text-align: center; color: #666;">
        (C = carbon, H = hydrogen - for reference only)
    </p>
</div>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Position</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Reaction with Water</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Extraction Method</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">K, Na, Ca</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Violent reaction → H₂</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Electrolysis</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">Mg, Al</td>
            <td style="padding: 12px; border: 1px solid #ddd;">React with steam</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Electrolysis</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Zn, Fe, Sn, Pb</td>
            <td style="padding: 12px; border: 1px solid #ddd;">React with steam slowly</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Reduction with carbon</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">Cu, Ag, Au</td>
            <td style="padding: 12px; border: 1px solid #ddd;">No reaction</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Found native or heating</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Displacement Reaction:</h4>
    <p>A more reactive metal displaces a less reactive metal from its compound:</p>
    <p><strong>Zn + CuSO₄ → ZnSO₄ + Cu</strong></p>
    <p>(Zinc displaces copper because Zn is more reactive than Cu)</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking carbon is a metal (it's just placed for comparison)</li>
        <li>Forgetting K is more reactive than Na</li>
    </ul>
</div>`,
                        question: {
                            text: "Which metal can displace iron from iron(II) sulphate solution?",
                            options: {
                                "A": "Copper",
                                "B": "Silver",
                                "C": "Zinc",
                                "D": "Gold"
                            },
                            correctAnswer: "C",
                            explanation: "Zinc is above iron in the reactivity series, so it can displace iron. Copper, silver, and gold are all below iron and cannot displace it."
                        }
                    }
                ]
            },
            {
                name: "Groups of Metals",
                objectives: [
                    {
                        title: "Describe properties of alkali, alkaline earth, and transition metals",
                        explanation: `<p>Metals are grouped in the periodic table with similar properties:</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-color: #e91e63;">
            <h4>Group 1: Alkali Metals</h4>
            <p>Li, Na, K, Rb, Cs</p>
            <ul style="text-align: left; font-size: 13px;">
                <li>Very soft (cut with knife)</li>
                <li>Low density (float on water)</li>
                <li>Very reactive with water</li>
                <li>Stored under oil/kerosene</li>
            </ul>
        </div>
        <div class="comparison-card" style="border-color: #9c27b0;">
            <h4>Group 2: Alkaline Earth</h4>
            <p>Be, Mg, Ca, Sr, Ba</p>
            <ul style="text-align: left; font-size: 13px;">
                <li>Harder than group 1</li>
                <li>Less reactive than group 1</li>
                <li>React with water (slower)</li>
                <li>Form hydroxides</li>
            </ul>
        </div>
        <div class="comparison-card" style="border-color: #ff9800;">
            <h4>Transition Metals</h4>
            <p>Fe, Cu, Zn, Cr, Ni...</p>
            <ul style="text-align: left; font-size: 13px;">
                <li>Variable oxidation states</li>
                <li>Form coloured compounds</li>
                <li>Good catalysts</li>
                <li>High melting points</li>
            </ul>
        </div>
    </div>
</div>

<div class="info-box">
    <h4>Transition Metal Colours:</h4>
    <ul>
        <li>Cu²⁺ compounds: <strong style="color: #2196f3;">Blue</strong> (CuSO₄)</li>
        <li>Fe²⁺ compounds: <strong style="color: #4caf50;">Green</strong> (FeSO₄)</li>
        <li>Fe³⁺ compounds: <strong style="color: #ff9800;">Brown/Yellow</strong> (FeCl₃)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking transition metals are soft (they're hard!)</li>
        <li>Forgetting alkali metals react violently with water</li>
    </ul>
</div>`,
                        question: {
                            text: "Which group of metals are stored under kerosene?",
                            options: {
                                "A": "Transition metals",
                                "B": "Alkali metals",
                                "C": "Alkaline earth metals",
                                "D": "Noble metals"
                            },
                            correctAnswer: "B",
                            explanation: "Alkali metals (Group 1) are so reactive that they must be stored under oil or kerosene to prevent reaction with air and moisture."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 13: AIR, WATER, SOLUBILITY
    // ============================================================
    "Air, Water, Solubility": {
        subject: "Chemistry",
        topic: "Air, Water, Solubility",
        introduction: {
            title: "Air, Water, Solubility",
            description: "This topic covers the everyday substances we depend on: air (the atmosphere around us), water (essential for life), and how substances dissolve in water (solubility). It explains their composition, how they are obtained or purified, and why some things dissolve while others do not.",
            jambInfo: "JAMB usually asks 3-5 questions on air composition, water properties, hardness, and solubility curves."
        },
        subtopics: [
            {
                name: "Air",
                objectives: [
                    {
                        title: "Explain the composition and uses of air",
                        explanation: `<p>Air is a <strong>mixture of gases</strong>, not a compound. The main gases are nitrogen (about 78%), oxygen (21%), and small amounts of argon, carbon dioxide, and others.</p>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card" style="background: linear-gradient(135deg, #3f51b5 0%, #1a237e 100%); color: white;">
            <p style="font-size: 32px; font-weight: bold;">78%</p>
            <p><strong>Nitrogen</strong></p>
            <p style="font-size: 12px;">Fertilizers, food packaging</p>
        </div>
        <div class="visual-card" style="background: linear-gradient(135deg, #4caf50 0%, #1b5e20 100%); color: white;">
            <p style="font-size: 32px; font-weight: bold;">21%</p>
            <p><strong>Oxygen</strong></p>
            <p style="font-size: 12px;">Respiration, combustion</p>
        </div>
        <div class="visual-card" style="background: linear-gradient(135deg, #9c27b0 0%, #4a148c 100%); color: white;">
            <p style="font-size: 32px; font-weight: bold;">~1%</p>
            <p><strong>Argon + Others</strong></p>
            <p style="font-size: 12px;">Light bulbs, CO₂</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Separation of Air Components:</h4>
    <p><strong>Fractional distillation of liquid air:</strong></p>
    <ol>
        <li>Cool air to very low temperature until it becomes liquid</li>
        <li>Warm slowly - gases boil at different temperatures</li>
        <li>Nitrogen boils first at -196°C</li>
        <li>Oxygen boils at -183°C</li>
    </ol>
</div>

<div class="info-box" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <h4>Uses of Air Components:</h4>
    <ul>
        <li><strong>Oxygen:</strong> Respiration, welding, hospitals</li>
        <li><strong>Nitrogen:</strong> Making ammonia, food preservation</li>
        <li><strong>Argon:</strong> Light bulbs (prevents filament burning)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying air is a compound (it's a MIXTURE!)</li>
        <li>Thinking oxygen is the major gas (nitrogen is!)</li>
    </ul>
</div>`,
                        question: {
                            text: "What is the major component of air by volume?",
                            options: {
                                "A": "Oxygen",
                                "B": "Nitrogen",
                                "C": "Carbon dioxide",
                                "D": "Argon"
                            },
                            correctAnswer: "B",
                            explanation: "Nitrogen makes up about 78% of air by volume, making it the major component. Oxygen is second at about 21%."
                        }
                    },
                    {
                        title: "Explain air pollution and its control",
                        explanation: `<p><strong>Air pollution</strong> occurs when harmful substances from factories, cars, and burning waste enter the air and affect health and environment.</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Pollutant</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Source</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Effect</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Carbon monoxide (CO)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Incomplete combustion</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Reduces oxygen in blood</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;">Sulphur dioxide (SO₂)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Burning coal</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Acid rain</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Nitrogen oxides (NOₓ)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Vehicle exhausts</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Smog, acid rain</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Control Methods:</h4>
    <ul>
        <li>Use <strong>catalytic converters</strong> in cars</li>
        <li>Use cleaner fuels (unleaded petrol)</li>
        <li>Plant trees (absorb CO₂)</li>
        <li>Enforce emission standards</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking all gases in air are pollutants</li>
    </ul>
</div>`,
                        question: {
                            text: "Which gas causes acid rain?",
                            options: {
                                "A": "Carbon monoxide (CO)",
                                "B": "Sulphur dioxide (SO₂)",
                                "C": "Oxygen (O₂)",
                                "D": "Nitrogen (N₂)"
                            },
                            correctAnswer: "B",
                            explanation: "Sulphur dioxide (SO₂) dissolves in rain water to form sulphuric acid, causing acid rain which damages buildings, trees, and aquatic life."
                        }
                    }
                ]
            },
            {
                name: "Water",
                objectives: [
                    {
                        title: "Explain the structure and properties of water",
                        explanation: `<p>Water (H₂O) has one oxygen and two hydrogen atoms joined by covalent bonds. The molecule is <strong>bent (V-shaped)</strong> with bond angle about 104.5°.</p>

<div class="visual-section">
    <div class="visual-card" style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">💧</div>
        <p style="font-size: 24px; font-weight: bold;">H-O-H</p>
        <p>Bond angle: <strong>104.5°</strong></p>
        <p>Shape: <strong>Bent/V-shaped</strong></p>
    </div>
</div>

<div class="key-points">
    <h4>Special Properties of Water:</h4>
    <ul>
        <li><strong>High boiling point (100°C)</strong> - due to hydrogen bonding</li>
        <li><strong>Universal solvent</strong> - dissolves many substances</li>
        <li><strong>High specific heat capacity</strong> - absorbs heat without big temperature change</li>
        <li><strong>Ice is less dense than water</strong> - ice floats!</li>
    </ul>
</div>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>Why Ice Floats:</h4>
    <p>Water expands when it freezes. The hydrogen bonds in ice form a rigid, open structure that is less dense than liquid water.</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying water molecule is linear (NO - it's bent!)</li>
        <li>Thinking ice is denser than water</li>
    </ul>
</div>`,
                        question: {
                            text: "The bond angle in a water molecule is approximately:",
                            options: {
                                "A": "180°",
                                "B": "109.5°",
                                "C": "104.5°",
                                "D": "120°"
                            },
                            correctAnswer: "C",
                            explanation: "The water molecule has a bond angle of about 104.5°, giving it a bent or V-shape. This is due to the two lone pairs on oxygen which repel the bonding pairs."
                        }
                    },
                    {
                        title: "Describe hardness, treatment, and purification of water",
                        explanation: `<p><strong>Hard water</strong> contains dissolved calcium and magnesium salts. It causes soap to lather poorly and forms scale in kettles/pipes.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-color: #ff9800;">
            <h4>Temporary Hardness</h4>
            <p>Caused by <strong>bicarbonates</strong></p>
            <p>Ca(HCO₃)₂, Mg(HCO₃)₂</p>
            <p><strong>Removed by boiling</strong></p>
            <p style="font-size: 12px;">Heat breaks down bicarbonates</p>
        </div>
        <div class="comparison-card" style="border-color: #f44336;">
            <h4>Permanent Hardness</h4>
            <p>Caused by <strong>sulphates/chlorides</strong></p>
            <p>CaSO₄, MgCl₂</p>
            <p><strong>Not removed by boiling</strong></p>
            <p style="font-size: 12px;">Add washing soda (Na₂CO₃)</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Water Purification Methods:</h4>
    <ul>
        <li><strong>Filtration:</strong> Removes suspended dirt/particles</li>
        <li><strong>Chlorination:</strong> Kills bacteria and germs</li>
        <li><strong>Distillation:</strong> Produces pure water</li>
        <li><strong>Boiling:</strong> Removes temporary hardness, kills germs</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking all hardness is removed by boiling (only temporary!)</li>
    </ul>
</div>`,
                        question: {
                            text: "Hard water causes:",
                            options: {
                                "A": "Good lathering with soap",
                                "B": "Scale in boilers",
                                "C": "Low boiling point",
                                "D": "No effect"
                            },
                            correctAnswer: "B",
                            explanation: "Hard water forms scale (calcium carbonate deposits) in boilers, kettles, and pipes. It also wastes soap because it doesn't lather easily."
                        }
                    }
                ]
            },
            {
                name: "Solubility",
                objectives: [
                    {
                        title: "Describe solubility and related calculations",
                        explanation: `<p><strong>Solubility</strong> is how much solute can dissolve in a solvent (usually water) at a given temperature.</p>

<div class="key-points" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <h4>🔢 Solubility Formula:</h4>
    <p style="font-size: 18px; text-align: center; font-weight: bold;">Solubility = Mass of solute / 100g of solvent</p>
</div>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Solution Type</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Description</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Unsaturated</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Can dissolve MORE solute</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Saturated</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Maximum solute dissolved (at that temp)</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Supersaturated</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">More than saturated (unstable, crystals form)</td>
        </tr>
    </table>
</div>

<div class="info-box" style="background: #fff3e0; border-left: 4px solid #ff9800;">
    <h4>⚠️ Important for Solubility Curves:</h4>
    <ul>
        <li><strong>Most solids:</strong> Solubility INCREASES with temperature</li>
        <li><strong>Gases:</strong> Solubility DECREASES with temperature</li>
        <li><strong>Gases:</strong> Solubility INCREASES with pressure</li>
    </ul>
</div>

<div class="example-box">
    <h4>Reading Solubility Curves:</h4>
    <p>KNO₃ solubility rises sharply with temperature</p>
    <p>NaCl solubility is almost flat (doesn't change much)</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking all solubilities increase with temperature (gases decrease!)</li>
        <li>Confusing saturated with supersaturated</li>
    </ul>
</div>`,
                        question: {
                            text: "A solution that can dissolve more solute is:",
                            options: {
                                "A": "Saturated",
                                "B": "Unsaturated",
                                "C": "Supersaturated",
                                "D": "Concentrated"
                            },
                            correctAnswer: "B",
                            explanation: "An unsaturated solution has not reached its maximum capacity and can still dissolve more solute. A saturated solution cannot dissolve any more."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 14: ENVIRONMENTAL POLLUTION
    // ============================================================
    "Environmental Pollution": {
        subject: "Chemistry",
        topic: "Environmental Pollution",
        introduction: {
            title: "Environmental Pollution",
            description: "Environmental pollution refers to the contamination of the natural environment (air, water, soil) by harmful substances, making it unsafe for living things. It is caused mainly by human activities like industries, transportation, and poor waste management.",
            jambInfo: "JAMB asks 2-4 questions focusing on types of pollution, sources, effects, and control measures."
        },
        subtopics: [
            {
                name: "Sources and Types of Pollution",
                objectives: [
                    {
                        title: "Identify sources and effects of pollution",
                        explanation: `<p>Pollution is divided into three main types based on where it happens: <strong>air, water, and soil/land</strong>.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-color: #9e9e9e;">
            <h4>💨 Air Pollution</h4>
            <p><strong>Sources:</strong> Vehicle exhaust, factory smoke, gas flaring</p>
            <p><strong>Pollutants:</strong> CO, SO₂, NOₓ, particulates</p>
            <p><strong>Effects:</strong> Respiratory problems, acid rain, global warming</p>
        </div>
        <div class="comparison-card" style="border-color: #2196f3;">
            <h4>💧 Water Pollution</h4>
            <p><strong>Sources:</strong> Oil spills, sewage, industrial waste</p>
            <p><strong>Pollutants:</strong> Oil, heavy metals, bacteria, plastics</p>
            <p><strong>Effects:</strong> Cholera, fish death, eutrophication</p>
        </div>
        <div class="comparison-card" style="border-color: #795548;">
            <h4>🌍 Soil Pollution</h4>
            <p><strong>Sources:</strong> Waste dumps, pesticides, oil leaks</p>
            <p><strong>Pollutants:</strong> Heavy metals, plastics, chemicals</p>
            <p><strong>Effects:</strong> Contaminated crops, loss of fertility</p>
        </div>
    </div>
</div>

<div class="info-box" style="background: #fff3e0; border-left: 4px solid #ff9800;">
    <h4>🇳🇬 Nigeria Context:</h4>
    <ul>
        <li><strong>Gas flaring</strong> in Niger Delta - major air pollution</li>
        <li><strong>Oil spillage</strong> - affects water and soil</li>
        <li><strong>Plastic waste</strong> - everywhere!</li>
    </ul>
</div>

<div class="key-points">
    <h4>Key Terms:</h4>
    <ul>
        <li><strong>Eutrophication:</strong> Excess nutrients cause algae overgrowth, depleting oxygen and killing fish</li>
        <li><strong>Acid rain:</strong> SO₂ + NOₓ dissolve in rain, damage buildings and plants</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking only factories cause pollution (vehicles and homes too!)</li>
        <li>Saying oil spillage only affects water (soil too!)</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is a major source of air pollution in Nigeria?",
                            options: {
                                "A": "Oil spillage",
                                "B": "Gas flaring",
                                "C": "Sewage discharge",
                                "D": "Plastic dumping"
                            },
                            correctAnswer: "B",
                            explanation: "Gas flaring in Nigeria's oil-producing regions is a major source of air pollution. Oil spillage affects water and soil, while sewage and plastic affect water and land."
                        }
                    }
                ]
            },
            {
                name: "Control Measures",
                objectives: [
                    {
                        title: "Suggest control methods for pollution",
                        explanation: `<p>Pollution can be reduced or prevented using various methods:</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Pollution Type</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Control Methods</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Air</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Catalytic converters, low-sulphur fuels, tree planting, emission standards</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Water</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Treat sewage before discharge, prevent oil spills, use biodegradable detergents</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Soil</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Organic farming, proper waste disposal, recycling, bioremediation</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>General Control Measures:</h4>
    <ul>
        <li>Use cleaner fuels (LPG instead of firewood)</li>
        <li>Plant trees (afforestation) to absorb CO₂</li>
        <li>Proper waste management (recycling)</li>
        <li>Education and awareness</li>
        <li>Enforce environmental laws</li>
    </ul>
</div>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>🌱 Bioremediation:</h4>
    <p>Using microorganisms to clean up oil spills and contaminated soil. This is a natural, eco-friendly method.</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking only government can solve pollution (individuals can help!)</li>
        <li>Suggesting burning waste as solution (causes more air pollution!)</li>
    </ul>
</div>`,
                        question: {
                            text: "Which method is most effective in reducing air pollution from vehicles?",
                            options: {
                                "A": "Planting trees",
                                "B": "Using catalytic converters",
                                "C": "Dumping waste",
                                "D": "Burning tyres"
                            },
                            correctAnswer: "B",
                            explanation: "Catalytic converters in vehicles convert harmful gases (CO, NOₓ) into less harmful ones (CO₂, N₂, H₂O) before they are released into the air."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 15: NON-METALS AND THEIR COMPOUNDS
    // ============================================================
    "Non-metals and Their Compounds": {
        subject: "Chemistry",
        topic: "Non-metals and Their Compounds",
        introduction: {
            title: "Non-metals and Their Compounds",
            description: "Non-metals are elements that are usually poor conductors of heat and electricity, brittle, and many are gases. Important non-metals for JAMB are hydrogen, halogens, oxygen, nitrogen, and carbon.",
            jambInfo: "JAMB asks 4-6 questions on laboratory preparation of gases, properties, and tests."
        },
        subtopics: [
            {
                name: "Hydrogen and Halogens",
                objectives: [
                    {
                        title: "Describe properties and preparation of hydrogen and halogens",
                        explanation: `<p><strong>Hydrogen (H₂)</strong> is the lightest element. It is colourless, odourless, and very flammable.</p>

<div class="key-points">
    <h4>Hydrogen:</h4>
    <ul>
        <li><strong>Lab preparation:</strong> Zn + 2HCl → ZnCl₂ + H₂↑</li>
        <li><strong>Test:</strong> Burns with a "pop" sound</li>
        <li><strong>Collection:</strong> Over water (downward displacement)</li>
        <li><strong>Uses:</strong> Fuel, making ammonia, margarine</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Halogens (Group 17):</h4>
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 10px; border: 1px solid #ddd;">Halogen</th>
            <th style="padding: 10px; border: 1px solid #ddd;">State</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Colour</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Use</th>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Fluorine (F₂)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Gas</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Pale yellow</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Toothpaste</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Chlorine (Cl₂)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Gas</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Greenish-yellow</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Water treatment</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Bromine (Br₂)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Liquid</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Red-brown</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Dyes, medicines</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Iodine (I₂)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Solid</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Shiny black (purple vapour)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Antiseptic</td>
        </tr>
    </table>
</div>

<div class="info-box">
    <h4>Key Point:</h4>
    <p>Reactivity <strong>decreases</strong> down the group: F > Cl > Br > I</p>
    <p>Bromine is the ONLY liquid halogen at room temperature!</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Using concentrated acid for H₂ preparation (use dilute!)</li>
        <li>Saying iodine is a gas (solid at room temp!)</li>
    </ul>
</div>`,
                        question: {
                            text: "Which halogen is a liquid at room temperature?",
                            options: {
                                "A": "Chlorine",
                                "B": "Bromine",
                                "C": "Iodine",
                                "D": "Fluorine"
                            },
                            correctAnswer: "B",
                            explanation: "Bromine is the only halogen that is a liquid at room temperature. Fluorine and chlorine are gases, while iodine is a solid."
                        }
                    }
                ]
            },
            {
                name: "Oxygen and Nitrogen",
                objectives: [
                    {
                        title: "Describe properties and preparation of oxygen and nitrogen",
                        explanation: `<p><strong>Oxygen (O₂)</strong> is a colourless, odourless gas that supports combustion.</p>

<div class="key-points">
    <h4>Oxygen:</h4>
    <ul>
        <li><strong>Lab preparation:</strong> 2KClO₃ → 2KCl + 3O₂↑ (with MnO₂ catalyst)</li>
        <li><strong>Test:</strong> Relights a glowing splint</li>
        <li><strong>Uses:</strong> Breathing (hospitals), welding, steel making</li>
    </ul>
</div>

<div class="key-points">
    <h4>Nitrogen and Ammonia:</h4>
    <ul>
        <li>Nitrogen (N₂) is 78% of air - very stable, doesn't burn</li>
        <li><strong>Ammonia (NH₃):</strong> Colourless gas with pungent smell</li>
        <li><strong>Haber Process:</strong> N₂ + 3H₂ ⇌ 2NH₃</li>
    </ul>
</div>

<div class="example-box">
    <h4>Haber Process Conditions:</h4>
    <ul>
        <li>High pressure (200-300 atm)</li>
        <li>Medium temperature (400-450°C)</li>
        <li><strong>Iron catalyst</strong></li>
    </ul>
    <p><strong>Uses of Ammonia:</strong> Fertilizers, refrigerant, cleaning agents</p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting the catalyst for O₂ preparation is MnO₂</li>
        <li>Thinking Haber process uses very high temperature (medium!)</li>
    </ul>
</div>`,
                        question: {
                            text: "The gas that relights a glowing splint is:",
                            options: {
                                "A": "Hydrogen",
                                "B": "Oxygen",
                                "C": "Carbon dioxide",
                                "D": "Nitrogen"
                            },
                            correctAnswer: "B",
                            explanation: "Oxygen relights a glowing splint because it supports combustion. This is the standard test for oxygen gas."
                        }
                    }
                ]
            },
            {
                name: "Carbon and Its Compounds",
                objectives: [
                    {
                        title: "Describe allotropes of carbon and carbon dioxide",
                        explanation: `<p>Carbon has <strong>allotropes</strong> - different forms of the same element with different structures.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
                            <h4>💎 Diamond</h4>
            <ul style="text-align: left; font-size: 13px;">
                <li>Hardest natural substance</li>
                <li>Does NOT conduct electricity</li>
                <li>Each carbon bonded to 4 others</li>
                <li>Used in cutting tools</li>
            </ul>
        </div>
        <div class="comparison-card">
            <h4>✏️ Graphite</h4>
            <ul style="text-align: left; font-size: 13px;">
                <li>Soft and slippery</li>
                <li>CONDUCTS electricity</li>
                <li>Layers that slide over each other</li>
                <li>Used in pencils, electrodes</li>
            </ul>
        </div>
        <div class="comparison-card">
            <h4>⚽ Fullerene (C₆₀)</h4>
            <ul style="text-align: left; font-size: 13px;">
                <li>Soccer ball shape</li>
                <li>60 carbon atoms</li>
                <li>Modern nanomaterial</li>
            </ul>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Carbon Dioxide (CO₂):</h4>
    <ul>
        <li><strong>Preparation:</strong> CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑</li>
        <li><strong>Test:</strong> Turns limewater <strong>milky</strong></li>
        <li><strong>Uses:</strong> Fire extinguisher, carbonated drinks, photosynthesis</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Saying diamond conducts electricity (NO - graphite does!)</li>
        <li>Forgetting limewater test for CO₂ (turns milky)</li>
    </ul>
</div>`,
                        question: {
                            text: "The allotrope of carbon used as a lubricant is:",
                            options: {
                                "A": "Diamond",
                                "B": "Graphite",
                                "C": "Charcoal",
                                "D": "Coke"
                            },
                            correctAnswer: "B",
                            explanation: "Graphite is used as a lubricant because its layered structure allows layers to slide over each other easily. Diamond is too hard to be a lubricant."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 16: CHEMISTRY AND INDUSTRY
    // ============================================================
    "Chemistry and Industry": {
        subject: "Chemistry",
        topic: "Chemistry and Industry",
        introduction: {
            title: "Chemistry and Industry",
            description: "Chemistry and industry shows how chemical knowledge is used to make useful products on a large scale. Chemical industries turn raw materials into everyday products like fertilizers, acids, plastics, and fuels.",
            jambInfo: "JAMB asks 2-4 questions on chemical industries, Haber process, Contact process, and biotechnology."
        },
        subtopics: [
            {
                name: "Chemical Industries and Raw Materials",
                objectives: [
                    {
                        title: "Classify industries and identify raw materials",
                        explanation: `<p>Chemical industries are grouped by what they produce:</p>

<div class="visual-section">
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: var(--primary-green); color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">Industry Type</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Products</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Raw Materials</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Petrochemical</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Fuels, plastics, solvents</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Crude oil, natural gas</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Fertilizer</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Ammonia, urea, NPK</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Air, natural gas, phosphates</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Heavy Inorganic</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">H₂SO₄, NaOH, Cl₂</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Sulphur, salt, water</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Pharmaceutical</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Drugs, medicines</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Various chemicals</td>
        </tr>
    </table>
</div>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>🇳🇬 Nigeria Context:</h4>
    <p>Nigeria is rich in <strong>crude oil and natural gas</strong> - important raw materials for the petrochemical industry.</p>
</div>

<div class="key-points">
    <h4>Main Raw Materials:</h4>
    <ul>
        <li><strong>Air:</strong> For nitrogen (ammonia production)</li>
        <li><strong>Water:</strong> Universal raw material</li>
        <li><strong>Crude oil:</strong> Petrochemicals, fuels</li>
        <li><strong>Natural gas:</strong> Hydrogen for ammonia</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking air is only for oxygen (mainly for nitrogen!)</li>
    </ul>
</div>`,
                        question: {
                            text: "The major raw material for petrochemical industries is:",
                            options: {
                                "A": "Air",
                                "B": "Water",
                                "C": "Crude oil",
                                "D": "Limestone"
                            },
                            correctAnswer: "C",
                            explanation: "Crude oil (petroleum) is the major raw material for petrochemical industries. It is refined and processed to produce fuels, plastics, and many other products."
                        }
                    }
                ]
            },
            {
                name: "Important Industrial Processes",
                objectives: [
                    {
                        title: "Explain Haber and Contact processes",
                        explanation: `<p>Two of the most important industrial processes are the <strong>Haber process</strong> (making ammonia) and the <strong>Contact process</strong> (making sulphuric acid).</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-color: #2196f3;">
            <h4>🔵 Haber Process (NH₃)</h4>
            <p><strong>Equation:</strong> N₂ + 3H₂ ⇌ 2NH₃</p>
            <ul style="text-align: left; font-size: 13px;">
                <li>Pressure: 200-300 atm</li>
                <li>Temperature: 400-450°C</li>
                <li>Catalyst: <strong>Iron</strong></li>
            </ul>
            <p><strong>Uses:</strong> Fertilizers, cleaning</p>
        </div>
        <div class="comparison-card" style="border-color: #ff9800;">
            <h4>🟠 Contact Process (H₂SO₄)</h4>
            <p><strong>Steps:</strong></p>
            <ol style="text-align: left; font-size: 12px;">
                <li>S → SO₂ (burn sulphur)</li>
                <li>SO₂ → SO₃ (V₂O₅ catalyst)</li>
                <li>SO₃ + H₂SO₄ → oleum</li>
                <li>Oleum + H₂O → H₂SO₄</li>
            </ol>
            <p><strong>Catalyst: V₂O₅</strong></p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Uses of Sulphuric Acid (H₂SO₄):</h4>
    <ul>
        <li>Making fertilizers (superphosphate)</li>
        <li>Lead-acid batteries</li>
        <li>Detergents and paints</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Confusing catalysts: Haber = <strong>Iron</strong>, Contact = <strong>V₂O₅</strong></li>
        <li>Thinking Haber uses very high temperature (450°C is medium!)</li>
    </ul>
</div>`,
                        question: {
                            text: "The catalyst used in the Haber process is:",
                            options: {
                                "A": "V₂O₅",
                                "B": "Iron",
                                "C": "Platinum",
                                "D": "Nickel"
                            },
                            correctAnswer: "B",
                            explanation: "Iron is the catalyst used in the Haber process for making ammonia. V₂O₅ (vanadium pentoxide) is used in the Contact process for making sulphuric acid."
                        }
                    }
                ]
            },
            {
                name: "Biotechnology",
                objectives: [
                    {
                        title: "Relate chemical processes to biotechnology",
                        explanation: `<p><strong>Biotechnology</strong> uses living things (microbes, enzymes) to make useful products. It is "green" chemistry - uses mild conditions (room temperature, no harsh chemicals).</p>

<div class="example-box">
    <h4>🍺 Ethanol Production (Biofuel):</h4>
    <ul>
        <li><strong>Raw material:</strong> Sugarcane, cassava, corn</li>
        <li><strong>Microbe:</strong> Yeast (Saccharomyces)</li>
        <li><strong>Process:</strong> Fermentation</li>
    </ul>
    <p style="text-align: center; font-size: 18px; font-weight: bold; margin-top: 10px;">
        C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂
    </p>
    <p style="text-align: center; font-size: 12px;">(Glucose → Ethanol + Carbon dioxide)</p>
</div>

<div class="key-points">
    <h4>Biotechnology Products:</h4>
    <ul>
        <li><strong>Ethanol:</strong> Biofuel, alcoholic drinks</li>
        <li><strong>Antibiotics:</strong> Penicillin from moulds</li>
        <li><strong>Enzymes:</strong> For detergents</li>
        <li><strong>Lactic acid:</strong> For plastics</li>
    </ul>
</div>

<div class="info-box" style="background: #e8f5e9; border-left: 4px solid var(--primary-green);">
    <h4>🌱 Why Biotechnology is "Green":</h4>
    <ul>
        <li>Uses mild conditions (room temperature)</li>
        <li>Less energy than Haber/Contact processes</li>
        <li>Renewable raw materials (plants)</li>
        <li>Nigeria uses cassava for bioethanol!</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking fermentation needs high temperature (yeast works at 25-35°C!)</li>
        <li>Confusing fermentation with distillation</li>
    </ul>
</div>`,
                        question: {
                            text: "The process used to produce ethanol from cassava is:",
                            options: {
                                "A": "Distillation",
                                "B": "Fermentation",
                                "C": "Cracking",
                                "D": "Reforming"
                            },
                            correctAnswer: "B",
                            explanation: "Fermentation is the process where yeast converts sugars (from cassava starch) into ethanol and carbon dioxide. Distillation is used to purify the ethanol after fermentation."
                        }
                    }
                ]
            }
        ]
    }
};

// Make available globally
window.CHEMISTRY_LEARNING_CONTENT = CHEMISTRY_LEARNING_CONTENT;
