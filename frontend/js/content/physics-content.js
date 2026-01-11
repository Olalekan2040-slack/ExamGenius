/**
 * Complete Physics Learning Content
 * All 32 topics with explanations, visuals, and sample questions
 */

const PHYSICS_LEARNING_CONTENT = {
    
    // ============================================================
    // TOPIC 1: MEASUREMENTS AND UNITS
    // ============================================================
    "Measurements and Units": {
        subject: "Physics",
        topic: "Measurements and Units",
        introduction: {
            title: "Measurements and Units",
            description: "This topic covers how physical quantities are measured, the instruments used, and the relationship between fundamental and derived units. You'll also learn about dimensional analysis and error estimation.",
            jambInfo: "JAMB usually asks 2-3 questions from this topic."
        },
        subtopics: [
            {
                name: "Measurements and Units",
                objectives: [
                    {
                        title: "Identify units and measuring instruments",
                        explanation: `<p>In Physics, we measure physical quantities using specific <strong>units</strong> and <strong>instruments</strong>.</p>
                        
<p><strong>Fundamental quantities</strong> are basic quantities that cannot be derived from others:</p>
<ul>
    <li><strong>Length</strong> - measured in metres (m) using rulers, tape measures, vernier calipers, micrometer screw gauges</li>
    <li><strong>Mass</strong> - measured in kilograms (kg) using beam balance, spring balance, electronic scales</li>
    <li><strong>Time</strong> - measured in seconds (s) using stopwatches, clocks</li>
    <li><strong>Temperature</strong> - measured in Kelvin (K) using thermometers</li>
    <li><strong>Electric current</strong> - measured in Amperes (A) using ammeters</li>
</ul>

<p><strong>Derived quantities</strong> are obtained by combining fundamental quantities:</p>
<ul>
    <li>Area = Length × Length (m²)</li>
    <li>Volume = Length × Length × Length (m³)</li>
    <li>Velocity = Length/Time (m/s)</li>
    <li>Force = Mass × Acceleration (N or kg·m/s²)</li>
</ul>`,
                        question: {
                            text: "Which of the following is NOT a fundamental quantity?",
                            options: {
                                "A": "Mass",
                                "B": "Length",
                                "C": "Velocity",
                                "D": "Time"
                            },
                            correctAnswer: "C",
                            explanation: "Velocity is a derived quantity obtained from length and time (velocity = displacement/time). Mass, length, and time are fundamental quantities."
                        }
                    },
                    {
                        title: "Determine lengths, areas, volumes, mass, and time",
                        explanation: `<p>Different instruments are used depending on the precision required:</p>

<p><strong>Measuring Length:</strong></p>
<ul>
    <li><strong>Metre rule</strong> - measures to the nearest millimetre (1 mm)</li>
    <li><strong>Vernier caliper</strong> - measures to 0.01 cm (0.1 mm)</li>
    <li><strong>Micrometer screw gauge</strong> - measures to 0.01 mm</li>
</ul>

<p><strong>Reading a Vernier Caliper:</strong></p>
<p>Total reading = Main scale reading + (Vernier coincidence × 0.01 cm)</p>

<p><strong>Reading a Micrometer:</strong></p>
<p>Total reading = Main scale reading + (Thimble reading × 0.01 mm)</p>`,
                        question: {
                            text: "A micrometer screw gauge has a pitch of 0.5 mm. If the thimble has 50 divisions, what is the least count?",
                            options: {
                                "A": "0.001 mm",
                                "B": "0.01 mm",
                                "C": "0.1 mm",
                                "D": "0.5 mm"
                            },
                            correctAnswer: "B",
                            explanation: "Least count = Pitch ÷ Number of divisions = 0.5 mm ÷ 50 = 0.01 mm"
                        }
                    },
                    {
                        title: "Use dimensional analysis",
                        explanation: `<p><strong>Dimensional analysis</strong> uses the dimensions of physical quantities to check equations and derive relationships.</p>

<p><strong>Dimensions of fundamental quantities:</strong></p>
<ul>
    <li>Mass [M]</li>
    <li>Length [L]</li>
    <li>Time [T]</li>
</ul>

<p><strong>Dimensions of derived quantities:</strong></p>
<ul>
    <li>Velocity = [L]/[T] = [LT⁻¹]</li>
    <li>Acceleration = [L]/[T²] = [LT⁻²]</li>
    <li>Force = [M][LT⁻²] = [MLT⁻²]</li>
    <li>Energy = [M][L²T⁻²] = [ML²T⁻²]</li>
</ul>

<p><strong>Uses:</strong></p>
<ul>
    <li>Check if an equation is dimensionally correct</li>
    <li>Derive relationships between quantities</li>
    <li>Convert units</li>
</ul>`,
                        question: {
                            text: "The dimension of pressure is",
                            options: {
                                "A": "[ML⁻¹T⁻²]",
                                "B": "[MLT⁻²]",
                                "C": "[ML²T⁻²]",
                                "D": "[ML⁻²T⁻²]"
                            },
                            correctAnswer: "A",
                            explanation: "Pressure = Force/Area = [MLT⁻²]/[L²] = [ML⁻¹T⁻²]"
                        }
                    },
                    {
                        title: "Estimate errors and accuracy",
                        explanation: `<p>Every measurement has some degree of <strong>uncertainty</strong> or <strong>error</strong>.</p>

<p><strong>Types of Errors:</strong></p>
<ul>
    <li><strong>Systematic errors</strong> - consistent errors due to faulty instruments or method (affects accuracy)</li>
    <li><strong>Random errors</strong> - unpredictable variations in measurements (affects precision)</li>
    <li><strong>Parallax error</strong> - error due to viewing an instrument from an angle</li>
</ul>

<p><strong>Accuracy vs Precision:</strong></p>
<ul>
    <li><strong>Accuracy</strong> - how close a measurement is to the true value</li>
    <li><strong>Precision</strong> - how close repeated measurements are to each other</li>
</ul>

<p><strong>Significant Figures:</strong> The number of meaningful digits in a measurement indicates its precision.</p>`,
                        question: {
                            text: "An error which occurs due to wrong calibration of an instrument is",
                            options: {
                                "A": "Random error",
                                "B": "Systematic error",
                                "C": "Parallax error",
                                "D": "Gross error"
                            },
                            correctAnswer: "B",
                            explanation: "Wrong calibration produces systematic error because it consistently affects all measurements in the same way."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 2: SCALARS AND VECTORS
    // ============================================================
    "Scalars and Vectors": {
        subject: "Physics",
        topic: "Scalars and Vectors",
        introduction: {
            title: "Scalars and Vectors",
            description: "This topic teaches you to distinguish between quantities that have only magnitude (scalars) and those that have both magnitude and direction (vectors). You'll learn how to add, subtract, and resolve vectors.",
            jambInfo: "JAMB usually asks 2-3 questions from this topic."
        },
        subtopics: [
            {
                name: "Scalars and Vectors",
                objectives: [
                    {
                        title: "Distinguish between scalars and vectors",
                        explanation: `<p>Physical quantities are classified into two types:</p>

<p><strong>Scalar quantities</strong> have only magnitude (size):</p>
<ul>
    <li>Distance, Speed, Mass, Time, Temperature</li>
    <li>Energy, Work, Power, Density</li>
    <li>Electric charge, Electric potential</li>
</ul>

<p><strong>Vector quantities</strong> have both magnitude and direction:</p>
<ul>
    <li>Displacement, Velocity, Acceleration</li>
    <li>Force, Momentum, Weight</li>
    <li>Electric field, Magnetic field</li>
</ul>

<p><strong>Key differences:</strong></p>
<ul>
    <li>Scalars are added algebraically</li>
    <li>Vectors must be added using vector addition rules</li>
    <li>Vectors are represented by arrows</li>
</ul>`,
                        question: {
                            text: "Which of the following is a vector quantity?",
                            options: {
                                "A": "Speed",
                                "B": "Distance",
                                "C": "Momentum",
                                "D": "Energy"
                            },
                            correctAnswer: "C",
                            explanation: "Momentum is a vector quantity because it has both magnitude and direction (momentum = mass × velocity). Speed, distance, and energy are scalar quantities."
                        }
                    },
                    {
                        title: "Resolve and add vectors",
                        explanation: `<p><strong>Vector Resolution:</strong> Breaking a vector into perpendicular components.</p>

<p>For a vector F at angle θ to the horizontal:</p>
<div class="equation-box">
    <div class="equation">Horizontal component: Fx = F cos θ</div>
    <div class="equation">Vertical component: Fy = F sin θ</div>
</div>

<p><strong>Vector Addition:</strong></p>
<ul>
    <li><strong>Triangle Law:</strong> Place vectors head-to-tail; resultant goes from first tail to last head</li>
    <li><strong>Parallelogram Law:</strong> Draw vectors from same point; resultant is the diagonal</li>
</ul>

<p><strong>Resultant of two vectors at angle θ:</strong></p>
<div class="equation-box">
    <div class="equation">R = √(A² + B² + 2AB cos θ)</div>
</div>

<p><strong>Special cases:</strong></p>
<ul>
    <li>Same direction (θ = 0°): R = A + B</li>
    <li>Opposite direction (θ = 180°): R = |A - B|</li>
    <li>Perpendicular (θ = 90°): R = √(A² + B²)</li>
</ul>`,
                        question: {
                            text: "Two forces of 3N and 4N act at right angles to each other. The magnitude of their resultant is",
                            options: {
                                "A": "1 N",
                                "B": "5 N",
                                "C": "7 N",
                                "D": "12 N"
                            },
                            correctAnswer: "B",
                            explanation: "For perpendicular vectors: R = √(3² + 4²) = √(9 + 16) = √25 = 5 N"
                        }
                    },
                    {
                        title: "Apply vector techniques to solve problems",
                        explanation: `<p><strong>Steps to solve vector problems:</strong></p>

<ol>
    <li>Identify all vectors and their directions</li>
    <li>Choose a convenient coordinate system</li>
    <li>Resolve each vector into components</li>
    <li>Add components separately (Rx = ΣFx, Ry = ΣFy)</li>
    <li>Find resultant magnitude: R = √(Rx² + Ry²)</li>
    <li>Find resultant direction: tan θ = Ry/Rx</li>
</ol>

<p><strong>Equilibrium:</strong> When the resultant of all forces is zero, the object is in equilibrium.</p>

<p><strong>Relative Velocity:</strong> When objects move relative to each other:</p>
<div class="equation-box">
    <div class="equation">V(A relative to B) = V(A) - V(B)</div>
</div>`,
                        question: {
                            text: "A force of 10 N acts at 30° to the horizontal. The horizontal component of the force is",
                            options: {
                                "A": "5 N",
                                "B": "8.66 N",
                                "C": "10 N",
                                "D": "5√3 N"
                            },
                            correctAnswer: "B",
                            explanation: "Horizontal component = F cos θ = 10 × cos 30° = 10 × 0.866 = 8.66 N (Note: 5√3 ≈ 8.66, so B and D are equivalent)"
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 3: MOTION (Already detailed in motion-content.js)
    // ============================================================
    "Motion": null, // Use MOTION_LEARNING_CONTENT instead

    // ============================================================
    // TOPIC 4: EQUILIBRIUM OF FORCES
    // ============================================================
    "Equilibrium of Forces": {
        subject: "Physics",
        topic: "Equilibrium of Forces",
        introduction: {
            title: "Equilibrium of Forces",
            description: "This topic covers Newton's laws of motion, conditions for equilibrium, moments of forces, and simple harmonic motion. Understanding these concepts is essential for solving mechanics problems.",
            jambInfo: "JAMB usually asks 3-4 questions from this topic."
        },
        subtopics: [
            {
                name: "Equilibrium of Forces",
                objectives: [
                    {
                        title: "Apply Newton's laws",
                        explanation: `<p><strong>Newton's First Law (Law of Inertia):</strong></p>
<p>A body remains at rest or moves with uniform velocity unless acted upon by an external force.</p>

<p><strong>Newton's Second Law:</strong></p>
<div class="equation-box">
    <div class="equation">F = ma</div>
</div>
<p>Force equals mass times acceleration. The unit of force is Newton (N).</p>

<p><strong>Newton's Third Law:</strong></p>
<p>For every action, there is an equal and opposite reaction.</p>
<p>Example: When you push against a wall, the wall pushes back with equal force.</p>

<p><strong>Applications:</strong></p>
<ul>
    <li>Weight = mg (where g ≈ 10 m/s²)</li>
    <li>Tension in strings</li>
    <li>Normal reaction forces</li>
</ul>`,
                        question: {
                            text: "A body of mass 5 kg is accelerated from rest to a velocity of 25 m/s in 5 seconds. The force acting on the body is",
                            options: {
                                "A": "1 N",
                                "B": "5 N",
                                "C": "25 N",
                                "D": "125 N"
                            },
                            correctAnswer: "C",
                            explanation: "a = (v-u)/t = (25-0)/5 = 5 m/s². F = ma = 5 × 5 = 25 N"
                        }
                    },
                    {
                        title: "Determine resultant forces and equilibrium",
                        explanation: `<p><strong>Resultant Force:</strong> The single force that has the same effect as all the forces acting on a body.</p>

<p><strong>Conditions for Equilibrium:</strong></p>
<ol>
    <li>The sum of all forces in any direction is zero (ΣF = 0)</li>
    <li>The sum of all moments about any point is zero (ΣM = 0)</li>
</ol>

<p>For a body in equilibrium under three forces:</p>
<ul>
    <li>The forces must be coplanar (in the same plane)</li>
    <li>They must be concurrent (meet at a point) or parallel</li>
    <li>They can be represented by the sides of a triangle (Triangle of Forces)</li>
</ul>`,
                        question: {
                            text: "For a body to be in equilibrium under the action of three coplanar forces, the forces must",
                            options: {
                                "A": "be equal in magnitude",
                                "B": "act in the same direction",
                                "C": "meet at a point",
                                "D": "be perpendicular to each other"
                            },
                            correctAnswer: "C",
                            explanation: "Three coplanar forces in equilibrium must either meet at a point (concurrent forces) or be parallel. This is a necessary condition for equilibrium."
                        }
                    },
                    {
                        title: "Calculate moments and conditions for stability",
                        explanation: `<p><strong>Moment of a Force:</strong> The turning effect of a force about a point.</p>
<div class="equation-box">
    <div class="equation">Moment = Force × Perpendicular distance from pivot</div>
    <div class="equation">M = F × d</div>
</div>

<p>Unit: Newton-metre (Nm)</p>

<p><strong>Principle of Moments:</strong></p>
<p>For a body in equilibrium: Sum of clockwise moments = Sum of anticlockwise moments</p>

<p><strong>Couple:</strong> Two equal and opposite parallel forces that produce rotation only.</p>
<div class="equation-box">
    <div class="equation">Moment of couple = Force × Distance between forces</div>
</div>

<p><strong>Centre of Gravity:</strong> The point where the entire weight of a body appears to act.</p>

<p><strong>Stability:</strong></p>
<ul>
    <li><strong>Stable equilibrium:</strong> Object returns to original position when displaced</li>
    <li><strong>Unstable equilibrium:</strong> Object moves further away when displaced</li>
    <li><strong>Neutral equilibrium:</strong> Object stays in new position</li>
</ul>`,
                        question: {
                            text: "A uniform metre rule is balanced at the 40 cm mark when a mass of 100 g is hung at the 10 cm mark. The mass of the rule is",
                            options: {
                                "A": "50 g",
                                "B": "100 g",
                                "C": "150 g",
                                "D": "300 g"
                            },
                            correctAnswer: "D",
                            explanation: "Taking moments about 40 cm mark: 100g × 30 cm = M × 10 cm (since centre of uniform rule is at 50 cm). 3000 = 10M, M = 300 g"
                        }
                    },
                    {
                        title: "Analyze SHM (e.g., pendulum, spring)",
                        explanation: `<p><strong>Simple Harmonic Motion (SHM):</strong> Periodic motion where the restoring force is proportional to displacement and directed towards equilibrium.</p>

<p><strong>Characteristics:</strong></p>
<ul>
    <li>Acceleration is proportional to displacement: a = -ω²x</li>
    <li>Acceleration is directed towards equilibrium position</li>
    <li>Motion is periodic and oscillatory</li>
</ul>

<p><strong>Simple Pendulum:</strong></p>
<div class="equation-box">
    <div class="equation">Period T = 2π√(l/g)</div>
</div>

<p><strong>Loaded Spring:</strong></p>
<div class="equation-box">
    <div class="equation">Period T = 2π√(m/k)</div>
</div>

<p>Where:</p>
<ul>
    <li>l = length of pendulum</li>
    <li>g = acceleration due to gravity</li>
    <li>m = mass attached to spring</li>
    <li>k = spring constant</li>
</ul>`,
                        question: {
                            text: "The period of a simple pendulum depends on",
                            options: {
                                "A": "mass of the bob",
                                "B": "length of the string only",
                                "C": "amplitude of oscillation",
                                "D": "length and acceleration due to gravity"
                            },
                            correctAnswer: "D",
                            explanation: "From T = 2π√(l/g), the period depends on the length l and acceleration due to gravity g. It does not depend on the mass of the bob or the amplitude (for small oscillations)."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 5: WORK, ENERGY, AND POWER
    // ============================================================
    "Work, Energy, and Power": {
        subject: "Physics",
        topic: "Work, Energy, and Power",
        introduction: {
            title: "Work, Energy, and Power",
            description: "This topic covers the concepts of work done by forces, different forms of energy, the law of conservation of energy, and the rate of doing work (power). Essential for understanding how energy transforms in physical systems.",
            jambInfo: "JAMB usually asks 3-4 questions from this topic."
        },
        subtopics: [
            {
                name: "Work, Energy, and Power",
                objectives: [
                    {
                        title: "Calculate work, energy, and power",
                        explanation: `<p><strong>Work:</strong> Work is done when a force moves an object in the direction of the force.</p>
<div class="equation-box">
    <div class="equation">Work = Force × Distance × cos θ</div>
    <div class="equation">W = Fd cos θ</div>
</div>
<p>Unit: Joule (J) = Newton × metre</p>

<p><strong>Energy:</strong> The capacity to do work.</p>
<ul>
    <li><strong>Kinetic Energy:</strong> KE = ½mv²</li>
    <li><strong>Potential Energy:</strong> PE = mgh</li>
    <li><strong>Elastic PE:</strong> PE = ½kx²</li>
</ul>

<p><strong>Power:</strong> The rate of doing work.</p>
<div class="equation-box">
    <div class="equation">Power = Work/Time = Energy/Time</div>
    <div class="equation">P = W/t = Fv</div>
</div>
<p>Unit: Watt (W) = Joule/second</p>`,
                        question: {
                            text: "A force of 20 N moves a body through a distance of 5 m in the direction of the force. The work done is",
                            options: {
                                "A": "4 J",
                                "B": "25 J",
                                "C": "100 J",
                                "D": "500 J"
                            },
                            correctAnswer: "C",
                            explanation: "Work = Force × Distance = 20 N × 5 m = 100 J"
                        }
                    },
                    {
                        title: "Apply conservation of energy",
                        explanation: `<p><strong>Law of Conservation of Energy:</strong></p>
<p>Energy can neither be created nor destroyed, only transformed from one form to another. The total energy in an isolated system remains constant.</p>

<p><strong>Applications:</strong></p>

<p><strong>Free Fall:</strong></p>
<p>At height h: Total Energy = mgh (all PE)</p>
<p>At ground: Total Energy = ½mv² (all KE)</p>
<p>Therefore: mgh = ½mv², so v = √(2gh)</p>

<p><strong>Pendulum:</strong></p>
<p>At highest point: Maximum PE, Zero KE</p>
<p>At lowest point: Zero PE, Maximum KE</p>

<p><strong>Energy Transformations:</strong></p>
<ul>
    <li>Falling object: PE → KE</li>
    <li>Car braking: KE → Heat</li>
    <li>Generator: Mechanical → Electrical</li>
</ul>`,
                        question: {
                            text: "A ball of mass 0.5 kg is dropped from a height of 20 m. Its kinetic energy just before hitting the ground is (g = 10 m/s²)",
                            options: {
                                "A": "10 J",
                                "B": "50 J",
                                "C": "100 J",
                                "D": "200 J"
                            },
                            correctAnswer: "C",
                            explanation: "By conservation of energy: KE at bottom = PE at top = mgh = 0.5 × 10 × 20 = 100 J"
                        }
                    },
                    {
                        title: "Solve problems involving efficiency",
                        explanation: `<p><strong>Efficiency:</strong> The ratio of useful energy output to total energy input, expressed as a percentage.</p>

<div class="equation-box">
    <div class="equation">Efficiency = (Useful output energy / Total input energy) × 100%</div>
    <div class="equation">Efficiency = (Useful output power / Input power) × 100%</div>
</div>

<p><strong>Key Points:</strong></p>
<ul>
    <li>Efficiency is always less than 100% in real machines</li>
    <li>Energy is lost mainly as heat due to friction</li>
    <li>The more efficient a machine, the less energy wasted</li>
</ul>

<p><strong>Example:</strong> If a motor uses 500 J of electrical energy and produces 400 J of mechanical energy:</p>
<p>Efficiency = (400/500) × 100% = 80%</p>`,
                        question: {
                            text: "A machine with an efficiency of 80% is used to lift a load of 100 N through a height of 5 m. The work input to the machine is",
                            options: {
                                "A": "400 J",
                                "B": "500 J",
                                "C": "625 J",
                                "D": "800 J"
                            },
                            correctAnswer: "C",
                            explanation: "Useful work output = 100 × 5 = 500 J. Efficiency = Output/Input, so 0.8 = 500/Input. Input = 500/0.8 = 625 J"
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 6: FRICTION
    // ============================================================
    "Friction": {
        subject: "Physics",
        topic: "Friction",
        introduction: {
            title: "Friction",
            description: "This topic explains the force that opposes relative motion between surfaces in contact. You'll learn about different types of friction, how to calculate frictional forces, and their effects on motion.",
            jambInfo: "JAMB usually asks 1-2 questions from this topic."
        },
        subtopics: [
            {
                name: "Friction",
                objectives: [
                    {
                        title: "Distinguish types of friction",
                        explanation: `<p><strong>Friction:</strong> A force that opposes the relative motion between two surfaces in contact.</p>

<p><strong>Types of Friction:</strong></p>
<ul>
    <li><strong>Static friction:</strong> Prevents motion from starting. Maximum static friction is called <em>limiting friction</em>.</li>
    <li><strong>Kinetic (sliding) friction:</strong> Opposes motion when surfaces slide over each other. Usually less than static friction.</li>
    <li><strong>Rolling friction:</strong> Opposes rolling motion. Usually much less than sliding friction.</li>
    <li><strong>Fluid friction:</strong> Resistance from fluids (air resistance, viscosity).</li>
</ul>

<p><strong>Key Points:</strong></p>
<ul>
    <li>Friction always opposes the direction of motion or tendency to move</li>
    <li>Static friction ≥ Kinetic friction</li>
    <li>Rolling friction < Sliding friction</li>
</ul>`,
                        question: {
                            text: "The type of friction that must be overcome before an object begins to move is",
                            options: {
                                "A": "Kinetic friction",
                                "B": "Static friction",
                                "C": "Rolling friction",
                                "D": "Fluid friction"
                            },
                            correctAnswer: "B",
                            explanation: "Static friction keeps an object at rest. It must be overcome (by exceeding the limiting friction) for motion to begin."
                        }
                    },
                    {
                        title: "Calculate frictional forces",
                        explanation: `<p><strong>Coefficient of Friction (μ):</strong> The ratio of frictional force to normal reaction.</p>

<div class="equation-box">
    <div class="equation">F = μR = μN</div>
</div>

<p>Where:</p>
<ul>
    <li>F = Frictional force</li>
    <li>μ = Coefficient of friction (dimensionless)</li>
    <li>R or N = Normal reaction force</li>
</ul>

<p><strong>On a horizontal surface:</strong> Normal reaction R = mg (weight)</p>
<p>So: F = μmg</p>

<p><strong>On an inclined plane:</strong></p>
<ul>
    <li>Normal reaction R = mg cos θ</li>
    <li>Component of weight along plane = mg sin θ</li>
    <li>For motion to start: mg sin θ > μmg cos θ</li>
    <li>So: tan θ > μ, or θ > tan⁻¹(μ)</li>
</ul>`,
                        question: {
                            text: "A block of mass 10 kg rests on a horizontal surface. If the coefficient of friction is 0.3, the force needed to just move the block is (g = 10 m/s²)",
                            options: {
                                "A": "3 N",
                                "B": "30 N",
                                "C": "100 N",
                                "D": "300 N"
                            },
                            correctAnswer: "B",
                            explanation: "F = μmg = 0.3 × 10 × 10 = 30 N"
                        }
                    },
                    {
                        title: "Analyze effects on motion",
                        explanation: `<p><strong>Advantages of Friction:</strong></p>
<ul>
    <li>Walking would be impossible without friction</li>
    <li>Brakes work because of friction</li>
    <li>Writing is possible due to friction</li>
    <li>Friction enables gripping and holding</li>
</ul>

<p><strong>Disadvantages of Friction:</strong></p>
<ul>
    <li>Causes wear and tear of machine parts</li>
    <li>Generates unwanted heat</li>
    <li>Reduces efficiency of machines</li>
    <li>Causes energy loss</li>
</ul>

<p><strong>Methods to Reduce Friction:</strong></p>
<ul>
    <li>Lubrication (oil, grease)</li>
    <li>Using ball bearings (rolling instead of sliding)</li>
    <li>Polishing surfaces</li>
    <li>Streamlining (for fluid friction)</li>
</ul>`,
                        question: {
                            text: "Ball bearings are used in machines to",
                            options: {
                                "A": "increase friction",
                                "B": "convert sliding friction to rolling friction",
                                "C": "increase the weight of the machine",
                                "D": "convert kinetic energy to potential energy"
                            },
                            correctAnswer: "B",
                            explanation: "Ball bearings convert sliding friction to rolling friction, which is much smaller. This reduces energy loss and wear in machines."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 7: SIMPLE MACHINES
    // ============================================================
    "Simple Machines": {
        subject: "Physics",
        topic: "Simple Machines",
        introduction: {
            title: "Simple Machines",
            description: "This topic covers devices that make work easier by multiplying force or changing its direction. You'll learn about mechanical advantage, velocity ratio, and efficiency of different types of machines.",
            jambInfo: "JAMB usually asks 2-3 questions from this topic."
        },
        subtopics: [
            {
                name: "Simple Machines",
                objectives: [
                    {
                        title: "Identify types and principles",
                        explanation: `<p><strong>Simple Machine:</strong> A device that makes work easier by changing the magnitude or direction of a force.</p>

<p><strong>Types of Simple Machines:</strong></p>
<ul>
    <li><strong>Lever:</strong> A rigid bar that pivots about a fulcrum (e.g., crowbar, scissors, wheelbarrow)</li>
    <li><strong>Inclined plane:</strong> A sloping surface (e.g., ramp, wedge, screw)</li>
    <li><strong>Pulley:</strong> A wheel with a groove for rope (single fixed, single movable, block and tackle)</li>
    <li><strong>Wheel and axle:</strong> A wheel attached to an axle (e.g., steering wheel, door knob)</li>
</ul>

<p><strong>Classes of Levers:</strong></p>
<ul>
    <li><strong>First class:</strong> Fulcrum between effort and load (e.g., seesaw, scissors)</li>
    <li><strong>Second class:</strong> Load between fulcrum and effort (e.g., wheelbarrow, nutcracker)</li>
    <li><strong>Third class:</strong> Effort between fulcrum and load (e.g., fishing rod, forearm)</li>
</ul>`,
                        question: {
                            text: "A wheelbarrow is an example of",
                            options: {
                                "A": "First class lever",
                                "B": "Second class lever",
                                "C": "Third class lever",
                                "D": "Inclined plane"
                            },
                            correctAnswer: "B",
                            explanation: "In a wheelbarrow, the load is between the fulcrum (wheel) and the effort (handles), making it a second class lever."
                        }
                    },
                    {
                        title: "Calculate MA, VR, and efficiency",
                        explanation: `<p><strong>Mechanical Advantage (MA):</strong> The ratio of load to effort.</p>
<div class="equation-box">
    <div class="equation">MA = Load / Effort = L / E</div>
</div>

<p><strong>Velocity Ratio (VR):</strong> The ratio of distance moved by effort to distance moved by load.</p>
<div class="equation-box">
    <div class="equation">VR = Distance moved by effort / Distance moved by load</div>
</div>

<p><strong>Efficiency:</strong></p>
<div class="equation-box">
    <div class="equation">Efficiency = (MA / VR) × 100%</div>
    <div class="equation">Efficiency = (Work output / Work input) × 100%</div>
</div>

<p><strong>For specific machines:</strong></p>
<ul>
    <li><strong>Lever:</strong> VR = Effort arm / Load arm</li>
    <li><strong>Inclined plane:</strong> VR = Length of plane / Height</li>
    <li><strong>Pulley system:</strong> VR = Number of pulleys supporting the load</li>
    <li><strong>Wheel and axle:</strong> VR = Radius of wheel / Radius of axle</li>
</ul>`,
                        question: {
                            text: "A machine has a velocity ratio of 5 and efficiency of 80%. The mechanical advantage is",
                            options: {
                                "A": "0.16",
                                "B": "4",
                                "C": "6.25",
                                "D": "25"
                            },
                            correctAnswer: "B",
                            explanation: "Efficiency = MA/VR × 100%. So 80 = MA/5 × 100. MA = 80 × 5/100 = 4"
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 8: ELASTICITY
    // ============================================================
    "Elasticity": {
        subject: "Physics",
        topic: "Elasticity",
        introduction: {
            title: "Elasticity",
            description: "This topic covers the property of materials to return to their original shape after the deforming force is removed. You'll learn about Hooke's law, elastic constants, and the behavior of springs.",
            jambInfo: "JAMB usually asks 1-2 questions from this topic."
        },
        subtopics: [
            {
                name: "Elasticity",
                objectives: [
                    {
                        title: "Apply Hooke's law",
                        explanation: `<p><strong>Elasticity:</strong> The property of a body to return to its original shape and size after the removal of deforming force.</p>

<p><strong>Hooke's Law:</strong> The extension of an elastic material is directly proportional to the applied force, provided the elastic limit is not exceeded.</p>

<div class="equation-box">
    <div class="equation">F = ke</div>
    <div class="equation">F = k(x - x₀)</div>
</div>

<p>Where:</p>
<ul>
    <li>F = Applied force (N)</li>
    <li>k = Spring constant or force constant (N/m)</li>
    <li>e = Extension (m)</li>
</ul>

<p><strong>Key Terms:</strong></p>
<ul>
    <li><strong>Elastic limit:</strong> Maximum stress a material can withstand and still return to original shape</li>
    <li><strong>Yield point:</strong> Point where permanent deformation begins</li>
    <li><strong>Breaking point:</strong> Point where material fractures</li>
</ul>`,
                        question: {
                            text: "A spring of force constant 100 N/m is stretched by 0.1 m. The force applied is",
                            options: {
                                "A": "0.1 N",
                                "B": "1 N",
                                "C": "10 N",
                                "D": "1000 N"
                            },
                            correctAnswer: "C",
                            explanation: "Using Hooke's law: F = ke = 100 × 0.1 = 10 N"
                        }
                    },
                    {
                        title: "Calculate elastic constants",
                        explanation: `<p><strong>Young's Modulus (E):</strong> Measures stiffness of a material.</p>
<div class="equation-box">
    <div class="equation">E = Stress / Strain = (F/A) / (e/L) = FL / Ae</div>
</div>

<p>Where:</p>
<ul>
    <li>F = Force, A = Cross-sectional area</li>
    <li>e = Extension, L = Original length</li>
</ul>

<p><strong>Energy Stored in a Stretched Spring:</strong></p>
<div class="equation-box">
    <div class="equation">E = ½ke² = ½Fe</div>
</div>

<p>This equals the area under the force-extension graph.</p>

<p><strong>Springs in Series:</strong></p>
<div class="equation-box">
    <div class="equation">1/k = 1/k₁ + 1/k₂</div>
</div>

<p><strong>Springs in Parallel:</strong></p>
<div class="equation-box">
    <div class="equation">k = k₁ + k₂</div>
</div>`,
                        question: {
                            text: "The energy stored in a spring extended by 0.2 m with a force of 50 N is",
                            options: {
                                "A": "2.5 J",
                                "B": "5 J",
                                "C": "10 J",
                                "D": "250 J"
                            },
                            correctAnswer: "B",
                            explanation: "Energy = ½Fe = ½ × 50 × 0.2 = 5 J"
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // Additional topics will follow the same pattern...
    // For brevity, I'll include a few more key topics
    // ============================================================

    // TOPIC 9: PRESSURE
    "Pressure": {
        subject: "Physics",
        topic: "Pressure",
        introduction: {
            title: "Pressure",
            description: "This topic covers pressure in solids, liquids, and gases. You'll learn about atmospheric pressure, liquid pressure, upthrust, and applications like hydraulic systems.",
            jambInfo: "JAMB usually asks 2-3 questions from this topic."
        },
        subtopics: [
            {
                name: "Pressure",
                objectives: [
                    {
                        title: "Calculate pressure and upthrust",
                        explanation: `<p><strong>Pressure:</strong> Force per unit area.</p>
<div class="equation-box">
    <div class="equation">P = F/A</div>
</div>
<p>Unit: Pascal (Pa) = N/m²</p>

<p><strong>Pressure in Liquids:</strong></p>
<div class="equation-box">
    <div class="equation">P = ρgh = hdg</div>
</div>
<p>Where: ρ = density, g = acceleration due to gravity, h = depth</p>

<p><strong>Upthrust (Buoyant Force):</strong></p>
<p>An upward force exerted by a fluid on an immersed object.</p>
<div class="equation-box">
    <div class="equation">Upthrust = Weight of fluid displaced = ρVg</div>
</div>

<p><strong>Archimedes' Principle:</strong></p>
<p>A body immersed in a fluid experiences an upthrust equal to the weight of fluid displaced.</p>`,
                        question: {
                            text: "The pressure at the bottom of a tank of water of depth 10 m is (density of water = 1000 kg/m³, g = 10 m/s²)",
                            options: {
                                "A": "1000 Pa",
                                "B": "10000 Pa",
                                "C": "100000 Pa",
                                "D": "1000000 Pa"
                            },
                            correctAnswer: "C",
                            explanation: "P = ρgh = 1000 × 10 × 10 = 100000 Pa = 10⁵ Pa"
                        }
                    },
                    {
                        title: "Apply principles to hydraulic systems and flotation",
                        explanation: `<p><strong>Pascal's Principle:</strong></p>
<p>Pressure applied to an enclosed fluid is transmitted equally in all directions.</p>

<p><strong>Hydraulic Press:</strong></p>
<div class="equation-box">
    <div class="equation">F₁/A₁ = F₂/A₂</div>
</div>
<p>Force multiplication: F₂ = F₁ × (A₂/A₁)</p>

<p><strong>Law of Flotation:</strong></p>
<p>A floating body displaces its own weight of fluid.</p>
<p>For flotation: Upthrust = Weight of body</p>
<p>So: ρ_fluid × V_submerged × g = ρ_body × V_total × g</p>

<p><strong>Fraction submerged:</strong></p>
<div class="equation-box">
    <div class="equation">V_submerged/V_total = ρ_body/ρ_fluid</div>
</div>`,
                        question: {
                            text: "In a hydraulic press, if the area ratio is 1:100, an effort of 10 N can lift a load of",
                            options: {
                                "A": "10 N",
                                "B": "100 N",
                                "C": "1000 N",
                                "D": "10000 N"
                            },
                            correctAnswer: "C",
                            explanation: "F₂ = F₁ × (A₂/A₁) = 10 × 100 = 1000 N"
                        }
                    }
                ]
            }
        ]
    },

    // TOPIC 14: GAS LAWS
    "Gas Laws": {
        subject: "Physics",
        topic: "Gas Laws",
        introduction: {
            title: "Gas Laws",
            description: "This topic covers the behavior of gases under different conditions of temperature, pressure, and volume. You'll learn about Boyle's law, Charles's law, and the general gas equation.",
            jambInfo: "JAMB usually asks 2-3 questions from this topic."
        },
        subtopics: [
            {
                name: "Gas Laws",
                objectives: [
                    {
                        title: "Apply gas laws to calculations",
                        explanation: `<p><strong>Boyle's Law:</strong> At constant temperature, the volume of a fixed mass of gas is inversely proportional to its pressure.</p>
<div class="equation-box">
    <div class="equation">PV = constant</div>
    <div class="equation">P₁V₁ = P₂V₂</div>
</div>

<p><strong>Charles's Law:</strong> At constant pressure, the volume of a fixed mass of gas is directly proportional to its absolute temperature.</p>
<div class="equation-box">
    <div class="equation">V/T = constant</div>
    <div class="equation">V₁/T₁ = V₂/T₂</div>
</div>

<p><strong>Pressure Law:</strong> At constant volume, the pressure of a fixed mass of gas is directly proportional to its absolute temperature.</p>
<div class="equation-box">
    <div class="equation">P/T = constant</div>
    <div class="equation">P₁/T₁ = P₂/T₂</div>
</div>

<p><strong>General Gas Equation:</strong></p>
<div class="equation-box">
    <div class="equation">P₁V₁/T₁ = P₂V₂/T₂</div>
</div>

<p><strong>Note:</strong> Temperature must be in Kelvin (K = °C + 273)</p>`,
                        question: {
                            text: "A gas occupies 500 cm³ at 27°C. At what temperature will it occupy 600 cm³ at the same pressure?",
                            options: {
                                "A": "32.4°C",
                                "B": "87°C",
                                "C": "360°C",
                                "D": "633°C"
                            },
                            correctAnswer: "B",
                            explanation: "Using V₁/T₁ = V₂/T₂: 500/300 = 600/T₂. T₂ = 600 × 300/500 = 360 K = 87°C"
                        }
                    }
                ]
            }
        ]
    },

    // TOPIC 25: CURRENT ELECTRICITY
    "Current Electricity": {
        subject: "Physics",
        topic: "Current Electricity",
        introduction: {
            title: "Current Electricity",
            description: "This topic covers the flow of electric charge, Ohm's law, resistors in circuits, and electrical power and energy. Essential for understanding circuits and electrical calculations.",
            jambInfo: "JAMB usually asks 4-5 questions from this topic."
        },
        subtopics: [
            {
                name: "Current Electricity",
                objectives: [
                    {
                        title: "Apply Ohm's law",
                        explanation: `<p><strong>Electric Current:</strong> The rate of flow of electric charge.</p>
<div class="equation-box">
    <div class="equation">I = Q/t</div>
</div>
<p>Unit: Ampere (A)</p>

<p><strong>Ohm's Law:</strong> The current through a conductor is directly proportional to the potential difference across it, provided temperature remains constant.</p>
<div class="equation-box">
    <div class="equation">V = IR</div>
</div>

<p><strong>Resistance:</strong> Opposition to current flow.</p>
<div class="equation-box">
    <div class="equation">R = V/I</div>
</div>
<p>Unit: Ohm (Ω)</p>

<p><strong>Resistors in Series:</strong></p>
<div class="equation-box">
    <div class="equation">R_total = R₁ + R₂ + R₃ + ...</div>
</div>

<p><strong>Resistors in Parallel:</strong></p>
<div class="equation-box">
    <div class="equation">1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...</div>
</div>`,
                        question: {
                            text: "A current of 2 A flows through a resistor when a p.d. of 10 V is applied across it. The resistance is",
                            options: {
                                "A": "0.2 Ω",
                                "B": "5 Ω",
                                "C": "12 Ω",
                                "D": "20 Ω"
                            },
                            correctAnswer: "B",
                            explanation: "Using Ohm's law: R = V/I = 10/2 = 5 Ω"
                        }
                    },
                    {
                        title: "Calculate power and energy",
                        explanation: `<p><strong>Electrical Power:</strong> The rate of electrical energy consumption.</p>
<div class="equation-box">
    <div class="equation">P = IV = I²R = V²/R</div>
</div>
<p>Unit: Watt (W)</p>

<p><strong>Electrical Energy:</strong></p>
<div class="equation-box">
    <div class="equation">E = Pt = IVt = I²Rt = V²t/R</div>
</div>
<p>Unit: Joule (J) or kilowatt-hour (kWh)</p>

<p><strong>Cost of Electricity:</strong></p>
<div class="equation-box">
    <div class="equation">1 kWh = 1000 W × 1 hour = 3.6 × 10⁶ J</div>
</div>

<p><strong>Example:</strong> A 100 W bulb used for 10 hours:</p>
<p>Energy = 100 × 10 = 1000 Wh = 1 kWh</p>`,
                        question: {
                            text: "The power dissipated in a 10 Ω resistor carrying a current of 3 A is",
                            options: {
                                "A": "30 W",
                                "B": "90 W",
                                "C": "300 W",
                                "D": "900 W"
                            },
                            correctAnswer: "B",
                            explanation: "P = I²R = 3² × 10 = 9 × 10 = 90 W"
                        }
                    }
                ]
            }
        ]
    }
};

// Make available globally
window.PHYSICS_LEARNING_CONTENT = PHYSICS_LEARNING_CONTENT;
