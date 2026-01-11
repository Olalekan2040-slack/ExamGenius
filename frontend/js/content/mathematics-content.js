/**
 * Mathematics Learning Content
 * Topics with explanations, visuals, and sample questions
 * Aligned with JAMB, WAEC, NECO, Cambridge IGCSE, and IB MYP standards
 */

const MATHEMATICS_LEARNING_CONTENT = {
    
    // ============================================================
    // TOPIC 1: SETS
    // ============================================================
    "Sets": {
        subject: "Mathematics",
        topic: "Sets",
        introduction: {
            title: "Sets - The Foundation of Modern Mathematics",
            description: "Sets are one of the most fundamental concepts in mathematics. A set is simply a well-defined collection of distinct objects called elements or members. This topic covers types of sets, set notation, operations on sets, and Venn diagrams - all essential for JAMB success.",
            jambInfo: "JAMB asks 3-6 questions on Sets every year. Master Venn diagrams especially for 2 and 3 sets!"
        },
        subtopics: [
            {
                name: "Types of Sets",
                objectives: [
                    {
                        title: "Identify and define different types of sets",
                        explanation: `<p>A <strong>set</strong> is a well-defined collection of distinct objects. Think of it as a bag containing different items where order doesn't matter and no item is repeated.</p>

<div class="key-points">
    <h4>Main Types of Sets:</h4>
    <ul>
        <li><strong>Empty set (∅ or {})</strong> - has no elements. Example: Set of months with 32 days</li>
        <li><strong>Singleton set</strong> - has exactly one element. Example: {7}</li>
        <li><strong>Finite set</strong> - has a countable number of elements. Example: {1, 2, 3, 4, 5}</li>
        <li><strong>Infinite set</strong> - goes on forever. Example: ℕ = {1, 2, 3, ...}</li>
        <li><strong>Universal set (U)</strong> - contains all elements under consideration</li>
        <li><strong>Subset (⊆)</strong> - every element of A is also in B</li>
        <li><strong>Proper subset (⊂)</strong> - A ⊆ B but A ≠ B</li>
        <li><strong>Equal sets</strong> - have exactly the same elements</li>
        <li><strong>Disjoint sets</strong> - have no element in common (A ∩ B = ∅)</li>
        <li><strong>Complement (A′)</strong> - all elements in U that are not in A</li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li>Set of vowels = {a, e, i, o, u} - <em>Finite set with 5 elements</em></li>
        <li>Set of even numbers = {2, 4, 6, 8, ...} - <em>Infinite set</em></li>
        <li>If A = {1, 2} and B = {1, 2, 3}, then A ⊂ B - <em>A is a proper subset of B</em></li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking { } has one element (it has zero elements)</li>
        <li>Forgetting that order doesn't matter: {a, b} = {b, a}</li>
        <li>Confusing ∈ (element of) with ⊆ (subset of)</li>
    </ul>
</div>`,
                        visuals: [
                            {
                                type: "icon-grid",
                                items: [
                                    { icon: "fa-circle", label: "Empty Set ∅", description: "Zero elements" },
                                    { icon: "fa-dot-circle", label: "Singleton", description: "One element" },
                                    { icon: "fa-th", label: "Finite Set", description: "Countable" },
                                    { icon: "fa-infinity", label: "Infinite Set", description: "Uncountable" }
                                ]
                            }
                        ],
                        question: {
                            text: "If A = {1, 2, 3} and B = {1, 2, 3, 4, 5}, which statement is TRUE?",
                            options: {
                                "A": "A = B",
                                "B": "B ⊂ A",
                                "C": "A ⊂ B",
                                "D": "A and B are disjoint"
                            },
                            correctAnswer: "C",
                            explanation: "A is a proper subset of B because every element in A is also in B, but B has additional elements (4 and 5). So A ⊂ B is correct."
                        }
                    },
                    {
                        title: "Use correct set notation and symbols",
                        explanation: `<p>Set notation is the mathematical language for describing sets. JAMB tests your understanding of these symbols frequently.</p>

<div class="key-points">
    <h4>Essential Set Symbols:</h4>
    <ul>
        <li><strong>∈</strong> means "is an element of". Example: 3 ∈ {1, 2, 3}</li>
        <li><strong>∉</strong> means "is not an element of". Example: 5 ∉ {1, 2, 3}</li>
        <li><strong>⊆</strong> means "is a subset of" (can be equal)</li>
        <li><strong>⊂</strong> means "is a proper subset of" (not equal)</li>
        <li><strong>∪</strong> means "union" (elements in A OR B)</li>
        <li><strong>∩</strong> means "intersection" (elements in A AND B)</li>
        <li><strong>A′</strong> means "complement of A" (elements NOT in A)</li>
        <li><strong>∅</strong> means "empty set"</li>
        <li><strong>n(A)</strong> means "cardinality" (number of elements in A)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Reading Set Notation:</h4>
    <ul>
        <li>A = {x : x is a prime number less than 10} means A = {2, 3, 5, 7}</li>
        <li>B = {x | x ∈ ℕ, x ≤ 5} means B = {1, 2, 3, 4, 5}</li>
    </ul>
</div>

<div class="formula-box">
    <h4>Set-Builder Notation:</h4>
    <p><strong>{x : condition}</strong> or <strong>{x | condition}</strong></p>
    <p>Read as: "the set of all x such that [condition]"</p>
</div>`,
                        question: {
                            text: "If U = {1, 2, 3, 4, 5, 6, 7, 8} and A = {2, 4, 6, 8}, what is A′?",
                            options: {
                                "A": "{1, 3, 5, 7}",
                                "B": "{2, 4, 6, 8}",
                                "C": "{1, 2, 3, 4, 5, 6, 7, 8}",
                                "D": "∅"
                            },
                            correctAnswer: "A",
                            explanation: "A′ (complement of A) contains all elements in the universal set U that are NOT in A. Since A = {2, 4, 6, 8}, then A′ = {1, 3, 5, 7}."
                        }
                    }
                ]
            },
            {
                name: "Set Operations and Cardinality",
                objectives: [
                    {
                        title: "Perform set operations: union, intersection, difference, and complement",
                        explanation: `<p>Set operations combine or compare sets to create new sets. These are fundamental operations tested heavily in JAMB.</p>

<div class="key-points">
    <h4>Main Set Operations:</h4>
    <ul>
        <li><strong>Union (A ∪ B)</strong> - all elements in A OR B or BOTH</li>
        <li><strong>Intersection (A ∩ B)</strong> - elements that are in BOTH A AND B</li>
        <li><strong>Difference (A − B)</strong> - elements in A but NOT in B</li>
        <li><strong>Complement (A′)</strong> - elements in U but NOT in A</li>
    </ul>
</div>

<div class="example-box">
    <h4>Worked Example:</h4>
    <p>Let A = {1, 2, 3, 4} and B = {3, 4, 5, 6}</p>
    <ul>
        <li><strong>A ∪ B</strong> = {1, 2, 3, 4, 5, 6}</li>
        <li><strong>A ∩ B</strong> = {3, 4}</li>
        <li><strong>A − B</strong> = {1, 2}</li>
        <li><strong>B − A</strong> = {5, 6}</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-plus-circle"></i>
            <p><strong>Union A ∪ B</strong></p>
            <p>Everything combined</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-times-circle"></i>
            <p><strong>Intersection A ∩ B</strong></p>
            <p>Only the overlap</p>
        </div>
    </div>
</div>`,
                        question: {
                            text: "If P = {a, b, c, d} and Q = {c, d, e, f}, find P ∩ Q",
                            options: {
                                "A": "{a, b, c, d, e, f}",
                                "B": "{c, d}",
                                "C": "{a, b}",
                                "D": "{e, f}"
                            },
                            correctAnswer: "B",
                            explanation: "P ∩ Q (intersection) contains elements that appear in BOTH sets. The common elements are c and d, so P ∩ Q = {c, d}."
                        }
                    },
                    {
                        title: "Calculate cardinality using the inclusion-exclusion principle",
                        explanation: `<p>Cardinality n(A) is the number of elements in a set. The <strong>inclusion-exclusion principle</strong> helps calculate the cardinality of unions.</p>

<div class="formula-box">
    <h4>Cardinality Formulas (VERY IMPORTANT):</h4>
    <p><strong>Two Sets:</strong></p>
    <p class="formula">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</p>
    
    <p><strong>Three Sets:</strong></p>
    <p class="formula">n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C)</p>
</div>

<div class="example-box">
    <h4>JAMB-Style Example:</h4>
    <p>If n(A) = 12, n(B) = 15, and n(A ∩ B) = 5, find n(A ∪ B)</p>
    <p><strong>Solution:</strong> n(A ∪ B) = 12 + 15 − 5 = <strong>22</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to subtract the intersection when calculating union</li>
        <li>Adding instead of subtracting in the formula</li>
    </ul>
</div>`,
                        question: {
                            text: "In a class of 50 students, 30 study Mathematics and 25 study English. If 10 study both subjects, how many study neither?",
                            options: {
                                "A": "5",
                                "B": "10",
                                "C": "15",
                                "D": "45"
                            },
                            correctAnswer: "A",
                            explanation: "Using n(M ∪ E) = n(M) + n(E) − n(M ∩ E) = 30 + 25 − 10 = 45. Students studying neither = Total − n(M ∪ E) = 50 − 45 = 5."
                        }
                    }
                ]
            },
            {
                name: "Venn Diagrams",
                objectives: [
                    {
                        title: "Use Venn diagrams to solve problems with 2 sets",
                        explanation: `<p>Venn diagrams are visual representations of sets using overlapping circles. They help solve problems about membership and relationships between sets.</p>

<div class="key-points">
    <h4>How to Draw a 2-Set Venn Diagram:</h4>
    <ol>
        <li>Draw two overlapping circles inside a rectangle (universal set)</li>
        <li>The overlap represents A ∩ B</li>
        <li>The remaining parts of each circle represent elements only in that set</li>
        <li>Outside both circles but inside the rectangle = elements in neither set</li>
    </ol>
</div>

<div class="example-box">
    <h4>Step-by-Step Method:</h4>
    <ol>
        <li>Start from the <strong>intersection</strong> (middle) - fill this first</li>
        <li>Fill the <strong>"only A"</strong> region = n(A) − n(A ∩ B)</li>
        <li>Fill the <strong>"only B"</strong> region = n(B) − n(A ∩ B)</li>
        <li>Calculate <strong>outside</strong> = Total − (all regions)</li>
    </ol>
</div>

<div class="visual-section">
    <div class="venn-diagram">
        <p>🔵 ∩ 🟢 = Intersection</p>
        <p>🔵 only = A − B</p>
        <p>🟢 only = B − A</p>
    </div>
</div>`,
                        question: {
                            text: "In a survey, 40 people like tea, 35 like coffee, and 15 like both. How many people like only tea?",
                            options: {
                                "A": "40",
                                "B": "25",
                                "C": "15",
                                "D": "55"
                            },
                            correctAnswer: "B",
                            explanation: "People who like only tea = Total who like tea − Those who like both = 40 − 15 = 25."
                        }
                    },
                    {
                        title: "Use Venn diagrams to solve problems with 3 sets",
                        explanation: `<p>Three-set Venn diagrams have 8 distinct regions and are very common in JAMB exams. Master the systematic approach!</p>

<div class="key-points">
    <h4>The 8 Regions of a 3-Set Venn Diagram:</h4>
    <ol>
        <li><strong>A ∩ B ∩ C</strong> - all three (center)</li>
        <li><strong>A ∩ B only</strong> - A and B but not C</li>
        <li><strong>A ∩ C only</strong> - A and C but not B</li>
        <li><strong>B ∩ C only</strong> - B and C but not A</li>
        <li><strong>A only</strong> - only in A</li>
        <li><strong>B only</strong> - only in B</li>
        <li><strong>C only</strong> - only in C</li>
        <li><strong>None</strong> - outside all circles</li>
    </ol>
</div>

<div class="formula-box">
    <h4>Step-by-Step Method (ALWAYS follow this order):</h4>
    <ol>
        <li>Fill the <strong>center first</strong> (all three)</li>
        <li>Calculate each <strong>double intersection</strong> = given value − center</li>
        <li>Calculate each <strong>"only"</strong> region = total in set − (all overlaps)</li>
        <li>Find <strong>none</strong> = Universal − (sum of all regions)</li>
    </ol>
</div>

<div class="example-box">
    <h4>JAMB Classic Example:</h4>
    <p>In a survey of 100 students: 40 like Football, 35 like Basketball, 30 like Volleyball, 15 like F&B, 10 like F&V, 8 like B&V, 5 like all three.</p>
    <p><strong>How many like none?</strong></p>
    <p>All three = 5</p>
    <p>F&B only = 15 − 5 = 10</p>
    <p>F&V only = 10 − 5 = 5</p>
    <p>B&V only = 8 − 5 = 3</p>
    <p>F only = 40 − 10 − 5 − 5 = 20</p>
    <p>B only = 35 − 10 − 3 − 5 = 17</p>
    <p>V only = 30 − 5 − 3 − 5 = 17</p>
    <p>Total = 5 + 10 + 5 + 3 + 20 + 17 + 17 = 77</p>
    <p>None = 100 − 77 = <strong>23</strong></p>
</div>`,
                        question: {
                            text: "In a class, 25 students play football, 20 play basketball, 18 play volleyball. 8 play both football and basketball, 6 play both football and volleyball, 5 play both basketball and volleyball, and 3 play all three. How many play at least one sport if the total is 50?",
                            options: {
                                "A": "47",
                                "B": "44",
                                "C": "50",
                                "D": "41"
                            },
                            correctAnswer: "A",
                            explanation: "Using the formula: n(F∪B∪V) = 25 + 20 + 18 − 8 − 6 − 5 + 3 = 47. So 47 students play at least one sport."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 2: NUMBER BASES
    // ============================================================
    "Number Bases": {
        subject: "Mathematics",
        topic: "Number Bases",
        introduction: {
            title: "Number Bases - Different Ways to Count",
            description: "Number bases (also called radix or positional numeral systems) show how we write and use numbers in different counting systems. In everyday life we use base 10 (decimal), computers use base 2 (binary), and other common bases include 8 (octal) and 16 (hexadecimal).",
            jambInfo: "JAMB asks 3-5 questions on Number Bases every year. Master conversions and arithmetic operations!"
        },
        subtopics: [
            {
                name: "Understanding Number Bases",
                objectives: [
                    {
                        title: "Understand place values in different bases",
                        explanation: `<p>In any base <strong>b</strong>, we use digits from 0 to (b−1). The place value of each digit depends on its position and the base.</p>

<div class="key-points">
    <h4>Common Bases:</h4>
    <ul>
        <li><strong>Base 2 (Binary)</strong> - uses digits 0, 1</li>
        <li><strong>Base 5 (Quinary)</strong> - uses digits 0, 1, 2, 3, 4</li>
        <li><strong>Base 8 (Octal)</strong> - uses digits 0, 1, 2, 3, 4, 5, 6, 7</li>
        <li><strong>Base 10 (Decimal)</strong> - uses digits 0, 1, 2, 3, 4, 5, 6, 7, 8, 9</li>
        <li><strong>Base 16 (Hexadecimal)</strong> - uses 0-9 and A=10, B=11, C=12, D=13, E=14, F=15</li>
    </ul>
</div>

<div class="formula-box">
    <h4>Place Values:</h4>
    <p>For a number in base b, positions from right to left have values:</p>
    <p class="formula">b⁰, b¹, b², b³, ...</p>
    <p>Example in base 10: The number 452 = 4×10² + 5×10¹ + 2×10⁰</p>
</div>

<div class="example-box">
    <h4>Understanding 1011₂:</h4>
    <p>Reading from right: 1×2⁰ + 1×2¹ + 0×2² + 1×2³ = 1 + 2 + 0 + 8 = 11₁₀</p>
</div>`,
                        visuals: [
                            {
                                type: "icon-grid",
                                items: [
                                    { icon: "fa-divide", label: "Base 2", description: "Binary: 0, 1" },
                                    { icon: "fa-hand-paper", label: "Base 5", description: "0, 1, 2, 3, 4" },
                                    { icon: "fa-th-large", label: "Base 8", description: "Octal: 0-7" },
                                    { icon: "fa-calculator", label: "Base 10", description: "Decimal: 0-9" }
                                ]
                            }
                        ],
                        question: {
                            text: "What is the highest digit that can appear in a base 7 number?",
                            options: {
                                "A": "7",
                                "B": "6",
                                "C": "8",
                                "D": "5"
                            },
                            correctAnswer: "B",
                            explanation: "In base b, digits range from 0 to (b−1). So in base 7, the highest digit is 7−1 = 6."
                        }
                    }
                ]
            },
            {
                name: "Conversion Between Bases",
                objectives: [
                    {
                        title: "Convert from any base to base 10",
                        explanation: `<p>To convert any number to base 10, multiply each digit by its place value (power of the base) and add them all up.</p>

<div class="formula-box">
    <h4>Conversion Formula:</h4>
    <p class="formula">dₙ × bⁿ + dₙ₋₁ × bⁿ⁻¹ + ... + d₁ × b¹ + d₀ × b⁰</p>
    <p>where d = digit, b = base, and powers start from 0 on the right</p>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Convert 1101₂ to base 10</p>
    <p>= 1×2³ + 1×2² + 0×2¹ + 1×2⁰</p>
    <p>= 8 + 4 + 0 + 1 = <strong>13₁₀</strong></p>
    
    <p><strong>Example 2:</strong> Convert 234₅ to base 10</p>
    <p>= 2×5² + 3×5¹ + 4×5⁰</p>
    <p>= 50 + 15 + 4 = <strong>69₁₀</strong></p>
    
    <p><strong>Example 3:</strong> Convert 2B₁₆ to base 10 (B = 11)</p>
    <p>= 2×16¹ + 11×16⁰</p>
    <p>= 32 + 11 = <strong>43₁₀</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Starting powers from 1 instead of 0</li>
        <li>Forgetting that powers increase from right to left</li>
    </ul>
</div>`,
                        question: {
                            text: "Convert 1010₂ to base 10",
                            options: {
                                "A": "8",
                                "B": "10",
                                "C": "12",
                                "D": "5"
                            },
                            correctAnswer: "B",
                            explanation: "1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10₁₀"
                        }
                    },
                    {
                        title: "Convert from base 10 to any other base",
                        explanation: `<p>To convert from base 10 to another base, repeatedly divide by the new base and record the remainders from bottom to top.</p>

<div class="formula-box">
    <h4>Division Method:</h4>
    <ol>
        <li>Divide the number by the new base</li>
        <li>Record the remainder</li>
        <li>Divide the quotient by the base again</li>
        <li>Repeat until quotient = 0</li>
        <li>Read remainders from BOTTOM to TOP</li>
    </ol>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Convert 47₁₀ to base 5</p>
    <p>47 ÷ 5 = 9 remainder <strong>2</strong></p>
    <p>9 ÷ 5 = 1 remainder <strong>4</strong></p>
    <p>1 ÷ 5 = 0 remainder <strong>1</strong></p>
    <p>Reading bottom to top: <strong>142₅</strong></p>
    
    <p><strong>Example 2:</strong> Convert 25₁₀ to base 2</p>
    <p>25 ÷ 2 = 12 remainder <strong>1</strong></p>
    <p>12 ÷ 2 = 6 remainder <strong>0</strong></p>
    <p>6 ÷ 2 = 3 remainder <strong>0</strong></p>
    <p>3 ÷ 2 = 1 remainder <strong>1</strong></p>
    <p>1 ÷ 2 = 0 remainder <strong>1</strong></p>
    <p>Reading bottom to top: <strong>11001₂</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Reading remainders from top to bottom (should be bottom to top!)</li>
        <li>Stopping before the quotient reaches 0</li>
    </ul>
</div>`,
                        question: {
                            text: "Convert 35₁₀ to base 4",
                            options: {
                                "A": "203₄",
                                "B": "302₄",
                                "C": "123₄",
                                "D": "213₄"
                            },
                            correctAnswer: "A",
                            explanation: "35 ÷ 4 = 8 remainder 3; 8 ÷ 4 = 2 remainder 0; 2 ÷ 4 = 0 remainder 2. Reading from bottom: 203₄"
                        }
                    }
                ]
            },
            {
                name: "Operations in Different Bases",
                objectives: [
                    {
                        title: "Perform addition and subtraction in different bases",
                        explanation: `<p>Addition and subtraction in other bases follow the same rules as base 10, but you carry or borrow based on the base value.</p>

<div class="key-points">
    <h4>Key Rules:</h4>
    <ul>
        <li><strong>Addition:</strong> When sum ≥ base, carry 1 to the next column</li>
        <li><strong>Subtraction:</strong> When subtracting a larger digit, borrow from the next column (borrowing = adding the base value)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Addition Example (Base 5):</h4>
    <pre>
    2 3 4₅
  +   4 3₅
  -------
    3 3 2₅
    </pre>
    <p>Column 1: 4 + 3 = 7. In base 5: 7 = 1×5 + 2, so write 2, carry 1</p>
    <p>Column 2: 3 + 4 + 1 = 8. In base 5: 8 = 1×5 + 3, so write 3, carry 1</p>
    <p>Column 3: 2 + 0 + 1 = 3. Write 3</p>
</div>

<div class="example-box">
    <h4>Subtraction Example (Base 2):</h4>
    <pre>
    1 1 0 1₂
  -   1 0 1₂
  ---------
    1 0 0 0₂
    </pre>
    <p>Work right to left, borrowing when needed (borrow adds 2 in binary)</p>
</div>`,
                        question: {
                            text: "Calculate 1101₂ + 1011₂",
                            options: {
                                "A": "10100₂",
                                "B": "11000₂",
                                "C": "11100₂",
                                "D": "10110₂"
                            },
                            correctAnswer: "B",
                            explanation: "Adding column by column: 1+1=10 (write 0, carry 1), 0+1+1=10 (write 0, carry 1), 1+0+1=10 (write 0, carry 1), 1+1+1=11 (write 11). Result: 11000₂"
                        }
                    },
                    {
                        title: "Perform multiplication and division in different bases",
                        explanation: `<p>Multiplication and division in other bases use the same methods as base 10, but use the base rules for carrying.</p>

<div class="key-points">
    <h4>Multiplication Steps:</h4>
    <ol>
        <li>Multiply as in base 10</li>
        <li>When product ≥ base, divide by base to get carry and remainder</li>
        <li>Write remainder, carry the quotient</li>
    </ol>
</div>

<div class="example-box">
    <h4>Multiplication Example (Base 5):</h4>
    <p><strong>Calculate 13₅ × 4₅</strong></p>
    <p>3 × 4 = 12. In base 5: 12 ÷ 5 = 2 remainder 2. Write 2, carry 2</p>
    <p>1 × 4 = 4. Add carry: 4 + 2 = 6. In base 5: 6 ÷ 5 = 1 remainder 1. Write 11</p>
    <p>Answer: <strong>112₅</strong></p>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>If the calculation seems complex, convert to base 10, do the operation, and convert back!</p>
</div>`,
                        question: {
                            text: "Simplify 24₅ × 3₅",
                            options: {
                                "A": "122₅",
                                "B": "132₅",
                                "C": "72₅",
                                "D": "112₅"
                            },
                            correctAnswer: "B",
                            explanation: "24₅ = 2×5 + 4 = 14₁₀. 3₅ = 3₁₀. 14 × 3 = 42₁₀. Converting 42 to base 5: 42÷5=8r2, 8÷5=1r3, 1÷5=0r1. Reading from bottom: 132₅."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 3: INDICES, LOGARITHMS AND SURDS
    // ============================================================
    "Indices, Logarithms and Surds": {
        subject: "Mathematics",
        topic: "Indices, Logarithms and Surds",
        introduction: {
            title: "Indices, Logarithms and Surds - Powers and Roots",
            description: "Indices (exponents), logarithms, and surds are powerful mathematical tools for handling very large or small numbers, solving exponential equations, and simplifying complex expressions. These concepts are interconnected and form a significant part of JAMB Mathematics.",
            jambInfo: "JAMB asks 4-7 questions on this topic every year. Master the laws of indices and logarithms for guaranteed marks!"
        },
        subtopics: [
            {
                name: "Laws of Indices",
                objectives: [
                    {
                        title: "Apply the laws of indices in calculations",
                        explanation: `<p>Indices (also called exponents or powers) represent repeated multiplication. There are 7 fundamental laws you must memorize.</p>

<div class="formula-box">
    <h4>The 7 Laws of Indices (MEMORIZE THESE!):</h4>
    <ol>
        <li><strong>aᵐ × aⁿ = a^(m+n)</strong> - same base, add powers</li>
        <li><strong>aᵐ ÷ aⁿ = a^(m−n)</strong> - same base, subtract powers</li>
        <li><strong>(aᵐ)ⁿ = a^(m×n)</strong> - power of a power, multiply</li>
        <li><strong>a⁰ = 1</strong> - any number to power 0 equals 1</li>
        <li><strong>a^(−n) = 1/aⁿ</strong> - negative index = reciprocal</li>
        <li><strong>a^(m/n) = ⁿ√(aᵐ) = (ⁿ√a)ᵐ</strong> - fractional index = root & power</li>
        <li><strong>(ab)ⁿ = aⁿ × bⁿ</strong> and <strong>(a/b)ⁿ = aⁿ/bⁿ</strong></li>
    </ol>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Simplify 2³ × 2⁵ ÷ 2⁴</p>
    <p>= 2^(3+5−4) = 2⁴ = <strong>16</strong></p>
    
    <p><strong>Example 2:</strong> Evaluate 8^(−2/3)</p>
    <p>= (2³)^(−2/3) = 2^(3×−2/3) = 2^(−2) = 1/2² = <strong>1/4</strong></p>
    
    <p><strong>Example 3:</strong> Simplify (27)^(1/3)</p>
    <p>= ³√27 = <strong>3</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Adding indices when multiplying different bases (only works for SAME base)</li>
        <li>Forgetting that x⁰ = 1 (not 0)</li>
    </ul>
</div>`,
                        visuals: [
                            {
                                type: "formula-cards",
                                formulas: [
                                    { formula: "aᵐ × aⁿ = a^(m+n)", use: "Same base: ADD powers" },
                                    { formula: "aᵐ ÷ aⁿ = a^(m−n)", use: "Same base: SUBTRACT powers" },
                                    { formula: "(aᵐ)ⁿ = a^(mn)", use: "Power of power: MULTIPLY" },
                                    { formula: "a^(−n) = 1/aⁿ", use: "Negative: RECIPROCAL" }
                                ]
                            }
                        ],
                        question: {
                            text: "Simplify: 3² × 3⁴ ÷ 3³",
                            options: {
                                "A": "3",
                                "B": "9",
                                "C": "27",
                                "D": "81"
                            },
                            correctAnswer: "C",
                            explanation: "3² × 3⁴ ÷ 3³ = 3^(2+4−3) = 3³ = 27"
                        }
                    },
                    {
                        title: "Express numbers in standard form (scientific notation)",
                        explanation: `<p>Standard form (scientific notation) expresses numbers as A × 10ⁿ where 1 ≤ A < 10.</p>

<div class="formula-box">
    <h4>Standard Form Rules:</h4>
    <p><strong>Format:</strong> A × 10ⁿ where 1 ≤ A < 10</p>
    <ul>
        <li>Large numbers → positive power of 10</li>
        <li>Small numbers (decimals) → negative power of 10</li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p><strong>Large numbers:</strong></p>
    <ul>
        <li>450,000 = 4.5 × 10⁵</li>
        <li>7,200,000 = 7.2 × 10⁶</li>
    </ul>
    <p><strong>Small numbers:</strong></p>
    <ul>
        <li>0.00034 = 3.4 × 10⁻⁴</li>
        <li>0.000072 = 7.2 × 10⁻⁵</li>
    </ul>
</div>

<div class="key-points">
    <h4>Quick Method:</h4>
    <ul>
        <li>Count how many places you move the decimal point</li>
        <li>Move right → negative power</li>
        <li>Move left → positive power</li>
    </ul>
</div>`,
                        question: {
                            text: "Express 0.000045 in standard form",
                            options: {
                                "A": "4.5 × 10⁻⁵",
                                "B": "4.5 × 10⁻⁴",
                                "C": "4.5 × 10⁵",
                                "D": "45 × 10⁻⁶"
                            },
                            correctAnswer: "A",
                            explanation: "Move the decimal 5 places to the right to get 4.5. Since the original number is small, use negative power: 4.5 × 10⁻⁵"
                        }
                    }
                ]
            },
            {
                name: "Laws of Logarithms",
                objectives: [
                    {
                        title: "Understand the relationship between indices and logarithms",
                        explanation: `<p>Logarithms are the inverse of indices. If you know one, you can find the other!</p>

<div class="formula-box">
    <h4>The Fundamental Relationship:</h4>
    <p class="formula">If aˣ = b, then log_a(b) = x</p>
    <p>In words: "The logarithm base a of b equals x means a raised to power x equals b"</p>
</div>

<div class="example-box">
    <h4>Converting Between Forms:</h4>
    <ul>
        <li>2³ = 8 ↔ log₂(8) = 3</li>
        <li>10² = 100 ↔ log₁₀(100) = 2</li>
        <li>5⁰ = 1 ↔ log₅(1) = 0</li>
        <li>3⁻² = 1/9 ↔ log₃(1/9) = −2</li>
    </ul>
</div>

<div class="key-points">
    <h4>Special Values:</h4>
    <ul>
        <li><strong>log_a(1) = 0</strong> because a⁰ = 1</li>
        <li><strong>log_a(a) = 1</strong> because a¹ = a</li>
        <li><strong>log₁₀</strong> is called "common logarithm" (often written as just "log")</li>
    </ul>
</div>`,
                        question: {
                            text: "If log₃(x) = 4, what is the value of x?",
                            options: {
                                "A": "12",
                                "B": "64",
                                "C": "81",
                                "D": "27"
                            },
                            correctAnswer: "C",
                            explanation: "log₃(x) = 4 means 3⁴ = x. So x = 3⁴ = 81."
                        }
                    },
                    {
                        title: "Apply the laws of logarithms",
                        explanation: `<p>The laws of logarithms help simplify expressions and solve equations. They mirror the laws of indices!</p>

<div class="formula-box">
    <h4>The 4 Laws of Logarithms:</h4>
    <ol>
        <li><strong>log_a(xy) = log_a(x) + log_a(y)</strong> - product → sum</li>
        <li><strong>log_a(x/y) = log_a(x) − log_a(y)</strong> - quotient → difference</li>
        <li><strong>log_a(xⁿ) = n × log_a(x)</strong> - power → coefficient</li>
        <li><strong>log_a(a) = 1</strong> and <strong>log_a(1) = 0</strong></li>
    </ol>
</div>

<div class="formula-box">
    <h4>Change of Base Formula:</h4>
    <p class="formula">log_a(b) = log_c(b) / log_c(a)</p>
    <p>Usually c = 10 or c = e</p>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Simplify log₁₀(100) + log₁₀(10)</p>
    <p>= log₁₀(100 × 10) = log₁₀(1000) = log₁₀(10³) = <strong>3</strong></p>
    
    <p><strong>Example 2:</strong> Simplify log₂(32)</p>
    <p>= log₂(2⁵) = 5 × log₂(2) = 5 × 1 = <strong>5</strong></p>
    
    <p><strong>Example 3:</strong> Evaluate log₅(125)</p>
    <p>125 = 5³, so log₅(125) = <strong>3</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Thinking log(a + b) = log(a) + log(b) — WRONG! Only for multiplication</li>
        <li>Forgetting that log_a(a) = 1, not a</li>
    </ul>
</div>`,
                        question: {
                            text: "Simplify: log₁₀(50) + log₁₀(2)",
                            options: {
                                "A": "1",
                                "B": "2",
                                "C": "3",
                                "D": "100"
                            },
                            correctAnswer: "B",
                            explanation: "log₁₀(50) + log₁₀(2) = log₁₀(50 × 2) = log₁₀(100) = log₁₀(10²) = 2"
                        }
                    }
                ]
            },
            {
                name: "Surds",
                objectives: [
                    {
                        title: "Simplify surds",
                        explanation: `<p>Surds are irrational roots that cannot be simplified to whole numbers. Examples include √2, √3, √5, ∛7.</p>

<div class="formula-box">
    <h4>Rules for Simplifying Surds:</h4>
    <ul>
        <li><strong>√(a × b) = √a × √b</strong></li>
        <li><strong>√(a / b) = √a / √b</strong></li>
        <li>To simplify: look for perfect square factors inside</li>
    </ul>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Simplify √72</p>
    <p>= √(36 × 2) = √36 × √2 = <strong>6√2</strong></p>
    
    <p><strong>Example 2:</strong> Simplify √50</p>
    <p>= √(25 × 2) = √25 × √2 = <strong>5√2</strong></p>
    
    <p><strong>Example 3:</strong> Simplify √200</p>
    <p>= √(100 × 2) = √100 × √2 = <strong>10√2</strong></p>
</div>

<div class="key-points">
    <h4>Perfect Squares to Remember:</h4>
    <p>1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144</p>
</div>`,
                        question: {
                            text: "Simplify √98",
                            options: {
                                "A": "7√2",
                                "B": "49√2",
                                "C": "2√49",
                                "D": "14√2"
                            },
                            correctAnswer: "A",
                            explanation: "√98 = √(49 × 2) = √49 × √2 = 7√2"
                        }
                    },
                    {
                        title: "Rationalise the denominator",
                        explanation: `<p>Rationalisation removes surds from the denominator of a fraction by multiplying by an appropriate form of 1.</p>

<div class="formula-box">
    <h4>Rationalisation Techniques:</h4>
    <p><strong>Single surd:</strong> Multiply by √a/√a</p>
    <p><strong>Binomial surd:</strong> Multiply by conjugate (change the sign)</p>
    <p>Conjugate of (a + √b) is (a − √b)</p>
    <p>Conjugate of (√a + √b) is (√a − √b)</p>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Rationalise 5/√3</p>
    <p>= (5 × √3)/(√3 × √3) = 5√3/3</p>
    
    <p><strong>Example 2:</strong> Rationalise 1/(√5 + √3)</p>
    <p>Multiply by (√5 − √3)/(√5 − √3):</p>
    <p>= (√5 − √3)/((√5)² − (√3)²)</p>
    <p>= (√5 − √3)/(5 − 3) = <strong>(√5 − √3)/2</strong></p>
</div>

<div class="warning-box">
    <h4>Common Mistakes:</h4>
    <ul>
        <li>Forgetting to multiply BOTH top and bottom</li>
        <li>Using wrong conjugate (should change sign, not surd)</li>
    </ul>
</div>`,
                        question: {
                            text: "Rationalise the denominator: 6/(√3)",
                            options: {
                                "A": "2√3",
                                "B": "6√3",
                                "C": "6√3/3",
                                "D": "√3/6"
                            },
                            correctAnswer: "A",
                            explanation: "6/√3 = (6 × √3)/(√3 × √3) = 6√3/3 = 2√3"
                        }
                    },
                    {
                        title: "Perform operations on surds",
                        explanation: `<p>You can add, subtract, multiply, and divide surds, but addition/subtraction only works for LIKE surds (same number under the root).</p>

<div class="key-points">
    <h4>Rules for Operations:</h4>
    <ul>
        <li><strong>Addition/Subtraction:</strong> Only like surds can be combined</li>
        <li>3√2 + 5√2 = 8√2 ✓</li>
        <li>3√2 + 5√3 cannot be simplified ✗</li>
        <li><strong>Multiplication:</strong> √a × √b = √(ab)</li>
        <li><strong>Division:</strong> √a ÷ √b = √(a/b)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Worked Examples:</h4>
    <p><strong>Example 1:</strong> Simplify (√8 + √2)</p>
    <p>= 2√2 + √2 = <strong>3√2</strong></p>
    
    <p><strong>Example 2:</strong> Simplify (√3 + √2)²</p>
    <p>= (√3)² + 2(√3)(√2) + (√2)²</p>
    <p>= 3 + 2√6 + 2 = <strong>5 + 2√6</strong></p>
    
    <p><strong>Example 3:</strong> Simplify √12 + √27</p>
    <p>= 2√3 + 3√3 = <strong>5√3</strong></p>
</div>`,
                        question: {
                            text: "Simplify: √18 + √50",
                            options: {
                                "A": "8√2",
                                "B": "√68",
                                "C": "7√2",
                                "D": "5√2"
                            },
                            correctAnswer: "A",
                            explanation: "√18 = √(9×2) = 3√2 and √50 = √(25×2) = 5√2. So √18 + √50 = 3√2 + 5√2 = 8√2"
                        }
                    }
                ]
            }
        ]
    }
};

// Export to window for global access
window.MATHEMATICS_LEARNING_CONTENT = MATHEMATICS_LEARNING_CONTENT;
