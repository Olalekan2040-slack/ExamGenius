/**
 * Static Learning Content for Physics - Motion Topic
 * This provides pre-built content without needing AI generation
 */

const MOTION_LEARNING_CONTENT = {
    subject: "Physics",
    topic: "Motion",
    
    // Topic Introduction
    introduction: {
        title: "Motion",
        description: "This topic tests how well you understand movement, speed, acceleration, and how objects move under gravity.",
        jambInfo: "JAMB usually asks 3–5 questions from this topic.",
        estimatedTime: "45 minutes"
    },
    
    // Subtopics with objectives
    subtopics: [
        {
            name: "Types of Motion",
            objectives: [
                {
                    title: "Distinguish types of motion",
                    explanation: `<p><strong>Linear motion</strong> is movement along a straight line, for example a car moving on a straight road.</p>
                    
<p><strong>Circular motion</strong> is movement along a circular path, like a stone tied to a string and whirled round.</p>

<p><strong>Oscillatory motion</strong> is repeated back-and-forth movement, like a pendulum.</p>

<p><strong>Random motion</strong> has no fixed path, like the movement of gas particles.</p>`,
                    
                    visuals: [
                        {
                            type: "icon-grid",
                            items: [
                                { icon: "fa-arrow-right", label: "Linear Motion", description: "Straight line path" },
                                { icon: "fa-sync-alt", label: "Circular Motion", description: "Circular path" },
                                { icon: "fa-exchange-alt", label: "Oscillatory Motion", description: "Back and forth" },
                                { icon: "fa-random", label: "Random Motion", description: "No fixed path" }
                            ]
                        }
                    ],
                    
                    question: {
                        text: "The motion of the bob of a simple pendulum is",
                        options: {
                            "A": "linear",
                            "B": "circular",
                            "C": "oscillatory",
                            "D": "random"
                        },
                        correctAnswer: "C",
                        explanation: "The bob moves to and fro about a fixed position, which is oscillatory motion. It swings back and forth repeatedly along the same arc."
                    },
                    
                    commonMistakes: "Students often confuse circular and oscillatory motion. Remember: circular motion goes round continuously, while oscillatory motion goes back and forth."
                }
            ]
        },
        {
            name: "Equations of Motion",
            objectives: [
                {
                    title: "Apply equations of uniformly accelerated motion",
                    explanation: `<p><strong>Uniform acceleration</strong> means the velocity changes at a constant rate.</p>

<p>The three equations used in JAMB are:</p>

<div class="equation-box">
    <div class="equation">v = u + at</div>
    <div class="equation">s = ut + ½at²</div>
    <div class="equation">v² = u² + 2as</div>
</div>

<p>Where:</p>
<ul>
    <li><strong>u</strong> = initial velocity (m/s)</li>
    <li><strong>v</strong> = final velocity (m/s)</li>
    <li><strong>a</strong> = acceleration (m/s²)</li>
    <li><strong>t</strong> = time (s)</li>
    <li><strong>s</strong> = displacement (m)</li>
</ul>`,
                    
                    workedExample: {
                        problem: "A body starts from rest and accelerates uniformly at 2 m/s² for 5 s. Find the final velocity.",
                        solution: `<p><strong>Given:</strong> u = 0 (starts from rest), a = 2 m/s², t = 5 s</p>
<p><strong>Find:</strong> v = ?</p>
<p><strong>Using:</strong> v = u + at</p>
<p><strong>Solution:</strong> v = 0 + (2 × 5) = 10 m/s</p>
<p><strong>Answer:</strong> The final velocity is <strong>10 m/s</strong></p>`
                    },
                    
                    visuals: [
                        {
                            type: "formula-cards",
                            items: [
                                { formula: "v = u + at", use: "When displacement (s) is not given" },
                                { formula: "s = ut + ½at²", use: "When final velocity (v) is not given" },
                                { formula: "v² = u² + 2as", use: "When time (t) is not given" }
                            ]
                        }
                    ],
                    
                    question: {
                        text: "A car moving with an initial velocity of 10 m/s accelerates uniformly at 2 m/s². What is its velocity after 5 s?",
                        options: {
                            "A": "15 m/s",
                            "B": "20 m/s",
                            "C": "25 m/s",
                            "D": "30 m/s"
                        },
                        correctAnswer: "B",
                        explanation: "Using v = u + at: v = 10 + (2 × 5) = 10 + 10 = 20 m/s"
                    },
                    
                    jambTip: "Always identify what is given and what is unknown first. Then choose the equation that contains all your knowns and only one unknown."
                }
            ]
        },
        {
            name: "Motion Graphs",
            objectives: [
                {
                    title: "Analyze motion graphs (displacement-time, velocity-time)",
                    explanation: `<p>Motion can be represented using graphs. The two main types are:</p>

<p><strong>Displacement-Time Graph:</strong></p>
<ul>
    <li>The <strong>slope</strong> (gradient) represents <strong>velocity</strong></li>
    <li>A steeper slope means faster motion</li>
    <li>A horizontal line means the object is stationary</li>
</ul>

<p><strong>Velocity-Time Graph:</strong></p>
<ul>
    <li>The <strong>slope</strong> represents <strong>acceleration</strong></li>
    <li>The <strong>area under the graph</strong> represents <strong>distance traveled</strong></li>
    <li>A horizontal line means constant velocity (no acceleration)</li>
</ul>`,
                    
                    visuals: [
                        {
                            type: "graph-comparison",
                            graphs: [
                                {
                                    title: "Displacement-Time Graph",
                                    description: "Slope = Velocity",
                                    svgIcon: "displacement-time"
                                },
                                {
                                    title: "Velocity-Time Graph", 
                                    description: "Slope = Acceleration, Area = Distance",
                                    svgIcon: "velocity-time"
                                }
                            ]
                        }
                    ],
                    
                    question: {
                        text: "The slope of a velocity-time graph represents",
                        options: {
                            "A": "speed",
                            "B": "distance",
                            "C": "acceleration",
                            "D": "displacement"
                        },
                        correctAnswer: "C",
                        explanation: "The slope of a velocity-time graph gives the rate of change of velocity, which is acceleration. Remember: slope of displacement-time = velocity, slope of velocity-time = acceleration."
                    },
                    
                    jambTip: "JAMB loves asking about graph slopes and areas. Memorize: displacement-time slope = velocity, velocity-time slope = acceleration, velocity-time area = distance."
                }
            ]
        },
        {
            name: "Motion under Gravity",
            objectives: [
                {
                    title: "Apply equations of motion under gravity",
                    explanation: `<p>When objects fall freely or are thrown vertically, they experience <strong>acceleration due to gravity (g)</strong>.</p>

<p>On Earth, <strong>g ≈ 10 m/s²</strong> (or 9.8 m/s² for more precision).</p>

<p>The equations of motion still apply, but we replace <strong>a</strong> with <strong>g</strong>:</p>

<div class="equation-box">
    <div class="equation">v = u + gt</div>
    <div class="equation">h = ut + ½gt²</div>
    <div class="equation">v² = u² + 2gh</div>
</div>

<p><strong>Important:</strong></p>
<ul>
    <li>For <strong>falling objects</strong>: g is positive (+10 m/s²)</li>
    <li>For <strong>objects thrown upward</strong>: g is negative (-10 m/s²)</li>
    <li>At <strong>maximum height</strong>: v = 0</li>
</ul>`,
                    
                    workedExample: {
                        problem: "A ball is dropped from a height. Calculate its velocity after falling for 3 seconds. (Take g = 10 m/s²)",
                        solution: `<p><strong>Given:</strong> u = 0 (dropped), t = 3 s, g = 10 m/s²</p>
<p><strong>Find:</strong> v = ?</p>
<p><strong>Using:</strong> v = u + gt</p>
<p><strong>Solution:</strong> v = 0 + (10 × 3) = 30 m/s</p>
<p><strong>Answer:</strong> The velocity after 3 seconds is <strong>30 m/s</strong></p>`
                    },
                    
                    visuals: [
                        {
                            type: "icon-grid",
                            items: [
                                { icon: "fa-arrow-down", label: "Falling Object", description: "g = +10 m/s²" },
                                { icon: "fa-arrow-up", label: "Thrown Upward", description: "g = -10 m/s²" },
                                { icon: "fa-dot-circle", label: "Maximum Height", description: "v = 0" }
                            ]
                        }
                    ],
                    
                    question: {
                        text: "A stone is dropped from a cliff and takes 4 seconds to reach the ground. What is its final velocity? (g = 10 m/s²)",
                        options: {
                            "A": "20 m/s",
                            "B": "30 m/s",
                            "C": "40 m/s",
                            "D": "50 m/s"
                        },
                        correctAnswer: "C",
                        explanation: "Using v = u + gt: v = 0 + (10 × 4) = 40 m/s. The stone started from rest (u = 0) and accelerated due to gravity."
                    },
                    
                    jambTip: "When a question says 'dropped', it means initial velocity u = 0. When it says 'thrown upward', the object will eventually stop (v = 0) at maximum height before falling back down."
                }
            ]
        },
        {
            name: "Projectiles",
            objectives: [
                {
                    title: "Solve problems on projectiles (range, height, time of flight)",
                    explanation: `<p>A <strong>projectile</strong> is an object thrown at an angle to the horizontal. It follows a curved path called a <strong>parabola</strong>.</p>

<p>Projectile motion has two independent components:</p>
<ul>
    <li><strong>Horizontal motion:</strong> Constant velocity (no acceleration)</li>
    <li><strong>Vertical motion:</strong> Accelerated motion (due to gravity)</li>
</ul>

<p><strong>Key formulas for projectile launched at angle θ with initial velocity u:</strong></p>

<div class="equation-box">
    <div class="equation">Time of flight: T = 2u sin θ / g</div>
    <div class="equation">Maximum height: H = u² sin² θ / 2g</div>
    <div class="equation">Range: R = u² sin 2θ / g</div>
</div>

<p><strong>Special case:</strong> Maximum range occurs when θ = 45°</p>`,
                    
                    workedExample: {
                        problem: "A ball is projected with a velocity of 20 m/s at an angle of 30° to the horizontal. Calculate the time of flight. (g = 10 m/s², sin 30° = 0.5)",
                        solution: `<p><strong>Given:</strong> u = 20 m/s, θ = 30°, g = 10 m/s²</p>
<p><strong>Find:</strong> Time of flight T = ?</p>
<p><strong>Using:</strong> T = 2u sin θ / g</p>
<p><strong>Solution:</strong> T = (2 × 20 × 0.5) / 10 = 20/10 = 2 s</p>
<p><strong>Answer:</strong> Time of flight is <strong>2 seconds</strong></p>`
                    },
                    
                    visuals: [
                        {
                            type: "projectile-diagram",
                            description: "Parabolic path of a projectile showing maximum height and range"
                        }
                    ],
                    
                    question: {
                        text: "At what angle should a projectile be launched to achieve maximum range?",
                        options: {
                            "A": "30°",
                            "B": "45°",
                            "C": "60°",
                            "D": "90°"
                        },
                        correctAnswer: "B",
                        explanation: "Maximum range is achieved at 45° because sin 2θ is maximum (sin 90° = 1) when θ = 45°. This is a commonly tested fact in JAMB."
                    },
                    
                    jambTip: "For projectile questions, JAMB often asks about maximum range (answer: 45°) or what happens at maximum height (answer: vertical velocity = 0, but horizontal velocity remains unchanged)."
                }
            ]
        }
    ],
    
    // Topic Summary
    summary: {
        keyPoints: [
            "Four types of motion: linear, circular, oscillatory, and random",
            "Three equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as",
            "Graph slopes: displacement-time → velocity, velocity-time → acceleration",
            "Free fall: acceleration = g ≈ 10 m/s²",
            "Projectile: maximum range at 45°, T = 2u sin θ / g"
        ],
        
        commonJambQuestions: [
            "Identifying types of motion (especially pendulum = oscillatory)",
            "Calculating final velocity or distance using equations of motion",
            "Interpreting motion graphs (slope and area meanings)",
            "Problems involving free fall and thrown objects",
            "Projectile range and time of flight calculations"
        ]
    }
};

// Export for use
window.MOTION_LEARNING_CONTENT = MOTION_LEARNING_CONTENT;
