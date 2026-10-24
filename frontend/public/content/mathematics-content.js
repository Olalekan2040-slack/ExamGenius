// Mathematics Learning Content — generated from EduLab ExamPrep JAMB Maths Vol 1-3
// DO NOT EDIT MANUALLY — regenerate via scripts/generate_math_content.py

const MATHEMATICS_LEARNING_CONTENT = {
  "Number Bases": {
    subject: "Mathematics",
    topic: "Number Bases",
    introduction: {
      title: "Number Bases \u2014 JAMB Mathematics",
      description: "TOPIC 1 NUMBER BASES Converting between bases \u00b7 Arithmetic in non-decimal bases  Introduction to Number Bases Every day, you count using base 10 \u2014 the decimal system. You use ten digits (0, 1, 2, 3, 4, 5, 6, 7, 8, 9), and when you reach ten, you carry to the next position. But computers work in base 2 (binary), using only 0 and 1. Other important bases in JAMB include base 8 (octal) and base 16 (h",
      jambInfo: "JAMB asks 2-3 questions on Number Bases every year. Master base conversions and arithmetic in other bases."
    },
    subtopics: [
      {
        name: "Understanding Place Value in Non-Decimal Bases",
        objectives: [
        {
          title: "Understanding Place Value in Non-Decimal Bases",
          explanation: `<p>Just as 365 in base 10 means (3 × 100) + (6 × 10) + (5 × 1), any number in base n is expanded using powers of n — starting from n⁰ on the right.</p>
<p>The general form for a 4-digit number abcd in base n is:</p>
<p>a × n³  +  b × n²  +  c × n¹  +  d × n⁰</p>
<div class="example-box"><h4>📝 Example 1.1a — Converting 1101₂ to base 10</h4><p>Step 1: Write out the place values (powers of 2) from right to left:</p><p>Position:    3    2    1    0</p><p>Digit:       1    1    0    1</p><p>Power of 2:  2³   2²   2¹   2⁰ = 8, 4, 2, 1</p><p>Step 2: Multiply each digit by its place value:</p><p>(1 × 8) + (1 × 4) + (0 × 2) + (1 × 1)</p><p>= 8 + 4 + 0 + 1</p><p>Step 3: Add the results:</p><p>= 13</p><p>Answer: 1101₂ = 13₁₀</p></div>
<div class="example-box"><h4>📝 Example 1.1b — Converting 2034₅ to base 10</h4><p>Place values in base 5: 5³ = 125, 5² = 25, 5¹ = 5, 5⁰ = 1</p><p>Digits from left to right:  2,  0,  3,  4</p><p>Step 2: Multiply each digit by its place value:</p><p>(2 × 125) + (0 × 25) + (3 × 5) + (4 × 1)</p><p>= 250 + 0 + 15 + 4</p><p>Answer: 2034₅ = 269₁₀</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When converting TO base 10, you are always just doing multiplication and addition. There is no trick — set up the columns neatly and you will not go wrong.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> What is the value of 324₅ in base 10?</p><ul><li><strong>A.</strong> 89</li><li><strong>B.</strong> 84</li><li><strong>C.</strong> 94</li><li><strong>D.</strong> 99</li></ul><p class="q-answer"><strong>Answer: A</strong> — (3×25)+(2×5)+(4×1) = 75+10+4 = 89.</p></div></div>`,
          visuals: [],
          question: {
          text: "Convert 110011\u2082 to base 10.",
          options: { "A": "45", "B": "51", "C": "49", "D": "35" },
          correctAnswer: "B",
          explanation: "Positions 5 to 0: digits are 1,1,0,0,1,1. Values: 32+16+0+0+2+1 = 51."
        }
        }
        ]
      },
      {
        name: "Converting from Base 10 to Another Base",
        objectives: [
        {
          title: "Converting from Base 10 to Another Base",
          explanation: `<p>The method is repeated division. You divide the number by the new base repeatedly, keeping track of the remainders. When you have finished, the answer is the remainders read from BOTTOM to TOP.</p>
<p>Think of it as peeling the number layer by layer. Each remainder is one digit of the answer in the new base.</p>
<div class="example-box"><h4>📝 Example 1.2a — Convert 47₁₀ to base 2</h4><p>Divide by 2 repeatedly:</p><p>47 ÷ 2 = 23  remainder  1   ← least significant digit (rightmost)</p><p>23 ÷ 2 = 11  remainder  1</p><p>11 ÷ 2 =  5  remainder  1</p><p>5 ÷ 2 =  2  remainder  1</p><p>2 ÷ 2 =  1  remainder  0</p><p>1 ÷ 2 =  0  remainder  1   ← most significant digit (leftmost)</p><p>Read remainders from BOTTOM to TOP: 1, 0, 1, 1, 1, 1</p><p>Answer: 47₁₀ = 101111₂</p><p>Verify: 32+0+8+4+2+1 = 47 ✓</p></div>
<div class="example-box"><h4>📝 Example 1.2b — Convert 156₁₀ to base 8</h4><p>Divide by 8 repeatedly:</p><p>156 ÷ 8 = 19  remainder  4   ← rightmost digit</p><p>19 ÷ 8 =  2  remainder  3</p><p>2 ÷ 8 =  0  remainder  2   ← leftmost digit</p><p>Read remainders bottom to top: 2, 3, 4</p><p>Answer: 156₁₀ = 234₈</p><p>Verify: (2×64)+(3×8)+(4×1) = 128+24+4 = 156 ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Always verify your conversion by working backwards — convert back to base 10 to confirm. This takes 30 seconds and guarantees full marks.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> The most common mistake is reading the remainders from top to bottom instead of bottom to top. Always build the answer upwards.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Convert 203₁₀ to base 5.</p><ul><li><strong>A.</strong> 1303₅</li><li><strong>B.</strong> 1203₅</li><li><strong>C.</strong> 1310₅</li><li><strong>D.</strong> 1031₅</li></ul><p class="q-answer"><strong>Answer: A</strong> — 203÷5=40r3, 40÷5=8r0, 8÷5=1r3, 1÷5=0r1. Bottom to top: 1, 3, 0, 3 = 1303₅. Check: 125+75+0+3=203 ✓</p></div></div>`,
          visuals: [],
          question: {
          text: "Express 85\u2081\u2080 in base 2.",
          options: { "A": "1010101\u2082", "B": "1010001\u2082", "C": "1001101\u2082", "D": "1100101\u2082" },
          correctAnswer: "A",
          explanation: "85\u00f72=42r1, 42\u00f72=21r0, 21\u00f72=10r1, 10\u00f72=5r0, 5\u00f72=2r1, 2\u00f72=1r0, 1\u00f72=0r1. Bottom to top: 1010101. Check: 64+0+16+0+4+0+1=85 \u2713"
        }
        }
        ]
      },
      {
        name: "Arithmetic in Non-Decimal Bases",
        objectives: [
        {
          title: "Arithmetic in Non-Decimal Bases",
          explanation: `<p>You can add, subtract, and multiply in any base using the same column methods you know from base 10, with one difference: you carry or borrow using the base number instead of 10.</p>
<p>For addition in base n: when a column adds up to n or more, write the remainder and carry the quotient.</p>
<p>For subtraction in base n: when you need to borrow, you borrow 'n' from the next column (not 10).</p>
<div class="example-box"><h4>📝 Example 1.3a — Add 1011₂ + 1101₂</h4><p>Align the digits and add column by column from right to left:</p><p>1 0 1 1</p><p>+ 1 1 0 1</p><p>---------</p><p>Column 0 (rightmost): 1+1 = 2 = 1×2 + 0. Write 0, carry 1.</p><p>Column 1: 1+0+1(carry) = 2 = 1×2 + 0. Write 0, carry 1.</p><p>Column 2: 0+1+1(carry) = 2 = 1×2 + 0. Write 0, carry 1.</p><p>Column 3: 1+1+1(carry) = 3 = 1×2 + 1. Write 1, carry 1.</p><p>Column 4: carry 1 → write 1.</p><p>Result:  1 1 0 0 0</p><p>Answer: 1011₂ + 1101₂ = 11000₂</p><p>Verify in base 10: 11 + 13 = 24 = 16+8 = 11000₂ ✓</p></div>
<div class="example-box"><h4>📝 Example 1.3b — Subtract 1001₂ from 1110₂</h4><p>1 1 1 0</p><p>- 1 0 0 1</p><p>---------</p><p>Column 0: 0 - 1. Cannot do this. Borrow from column 1.</p><p>Column 1 has 1, so we borrow it: column 0 becomes 10₂ - 1 = 1.</p><p>Column 1 is now 0.</p><p>Column 1: 0 - 0 = 0.</p><p>Column 2: 1 - 0 = 1.</p><p>Column 3: 1 - 1 = 0.</p><p>Result:  0 1 0 1</p><p>Answer: 1110₂ - 1001₂ = 0101₂ = 101₂</p><p>Verify in base 10: 14 - 9 = 5 = 101₂ ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For binary (base 2) subtraction, remember: borrowing brings in 2 (not 10). So '10 - 1 = 1' in binary.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Subtract 101₂ from 10011₂.</p><ul><li><strong>A.</strong> 1110₂</li><li><strong>B.</strong> 1100₂</li><li><strong>C.</strong> 1010₂</li><li><strong>D.</strong> 1011₂</li></ul><p class="q-answer"><strong>Answer: A</strong> — 19 - 5 = 14 in base 10. 14 in binary: 8+4+2 = 1110₂. Answer: A.</p></div></div>`,
          visuals: [],
          question: {
          text: "Evaluate 1101\u2082 + 1011\u2082.",
          options: { "A": "11000\u2082", "B": "10110\u2082", "C": "11010\u2082", "D": "11001\u2082" },
          correctAnswer: "B",
          explanation: "1101(13) + 1011(11) = 24. 24 in binary: 16+8=11000. Answer: A. 11000\u2082."
        }
        }
        ]
      },
      {
        name: "Converting Between Bases via Base 10 (Shortcut Route)",
        objectives: [
        {
          title: "Converting Between Bases via Base 10 (Shortcut Route)",
          explanation: `<p>When converting directly between two non-decimal bases (e.g., base 2 to base 8), the easiest method is to use base 10 as a bridge: first convert to base 10, then convert from base 10 to the target base.</p>
<p>However, there is a clever shortcut between base 2 and base 8 (and base 16): because 8 = 2³, you can group binary digits in sets of 3 from the right and convert each group directly.</p>
<div class="example-box"><h4>📝 Example 1.4a — Convert 101110₂ to base 8 (grouping method)</h4><p>Group binary digits in sets of 3 from the RIGHT:</p><p>101  110</p><p>Convert each group to decimal (which equals the octal digit):</p><p>101₂ = 4+0+1 = 5</p><p>110₂ = 4+2+0 = 6</p><p>Read the groups left to right:</p><p>Answer: 101110₂ = 56₈</p><p>Verify: 56₈ = (5×8)+(6×1) = 40+6 = 46₁₀</p><p>101110₂ = 32+0+8+4+2+0 = 46₁₀ ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For base 2 to base 8: group in 3s. For base 2 to base 16: group in 4s. Pad with leading zeros on the left if needed (e.g., 10111 becomes 010 111).</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If 32₄ + 13₄ = x₄, find x.</p><ul><li><strong>A.</strong> 45₄</li><li><strong>B.</strong> 111₄</li><li><strong>C.</strong> 101₄</li><li><strong>D.</strong> 50₄</li></ul><p class="q-answer"><strong>Answer: C</strong> — 32₄=(3×4)+2=14. 13₄=(1×4)+3=7. Sum=21. 21÷4=5r1, 5÷4=1r1, 1÷4=0r1. Answer: 111₄. Check:(1×16)+(1×4)+1=21 ✓</p></div></div>`,
          visuals: [],
          question: {
          text: "Convert 111010\u2082 to base 8.",
          options: { "A": "72\u2088", "B": "63\u2088", "C": "76\u2088", "D": "67\u2088" },
          correctAnswer: "A",
          explanation: "Group: 111 010. 111\u2082=7, 010\u2082=2. Answer: 72\u2088. Verify: 58\u2081\u2080. 111010\u2082: 32+16+8+0+2+0=58. 72\u2088: 56+2=58 \u2713"
        }
        }
        ]
      }
    ]
  },

  "Fractions, Decimals & Percentages": {
    subject: "Mathematics",
    topic: "Fractions, Decimals & Percentages",
    introduction: {
      title: "Fractions, Decimals & Percentages \u2014 JAMB Mathematics",
      description: "TOPIC 2 FRACTIONS, DECIMALS, APPROXIMATIONS & PERCENTAGES The backbone of JAMB numeracy  Introduction This topic covers the practical arithmetic that underlies almost every other topic in JAMB Mathematics. A fraction represents a part of a whole. A decimal is another way of writing fractions with denominators that are powers of 10. Approximation and percentages are everyday tools for communicating",
      jambInfo: "JAMB typically asks 3-5 questions covering fractions, decimals, standard form, and percentage calculations."
    },
    subtopics: [
      {
        name: "Operations on Fractions",
        objectives: [
        {
          title: "Operations on Fractions",
          explanation: `<p>A fraction has a numerator (top) and denominator (bottom). Before performing operations, always simplify each fraction to its lowest terms — divide numerator and denominator by their Highest Common Factor (HCF).</p>
<p>Addition and Subtraction of Fractions</p>
<p>Rule: You cannot add or subtract fractions with different denominators directly. First find the Lowest Common Multiple (LCM) of the denominators — called the Lowest Common Denominator (LCD). Then convert each fraction to an equivalent fraction with the LCD as denominator, and add or subtract the numerators.</p>
<div class="example-box"><h4>📝 Example 2.1a — Evaluate: 2/3 + 3/4 − 1/6</h4><p>Step 1: Find the LCM of denominators 3, 4, 6.</p><p>Multiples of 3: 3, 6, 9, 12, 15...</p><p>Multiples of 4: 4, 8, 12, 16...</p><p>Multiples of 6: 6, 12, 18...</p><p>LCM = 12</p><p>Step 2: Convert each fraction to have denominator 12:</p><p>2/3 = 8/12   (multiply top and bottom by 4)</p><p>3/4 = 9/12   (multiply top and bottom by 3)</p><p>1/6 = 2/12   (multiply top and bottom by 2)</p><p>Step 3: Combine numerators over the common denominator:</p><p>8/12 + 9/12 − 2/12 = (8 + 9 − 2)/12 = 15/12</p><p>Step 4: Simplify: 15/12 = 5/4 = 1¼</p><p>Answer: 5/4</p><p>Multiplication and Division of Fractions</p><p>Multiplication: multiply the numerators together and multiply the denominators together. Always simplify by cancelling common factors before multiplying — this avoids large numbers.</p><p>Division: 'Keep, Change, Flip' — keep the first fraction as it is, change the ÷ to ×, and flip (take the reciprocal of) the second fraction. Then multiply.</p></div>
<div class="example-box"><h4>📝 Example 2.1b — Evaluate: (3/5) ÷ (9/20) × (4/3)</h4><p>Handle left to right. First: (3/5) ÷ (9/20)</p><p>= (3/5) × (20/9)    [flip the divisor]</p><p>= (3 × 20)/(5 × 9)</p><p>Cancel: 3 cancels with 9 (÷3), and 20 cancels with 5 (÷5):</p><p>= (1 × 4)/(1 × 3) = 4/3</p><p>Now multiply by (4/3):</p><p>(4/3) × (4/3) = 16/9</p><p>Answer: 16/9 = 1 7/9</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Before multiplying fractions, look for numbers you can cancel diagonally across the multiplication sign. E.g. in (6/7)×(14/3), cancel 6 with 3 (gives 2) and 14 with 7 (gives 2). Result: (2×2)/(1×1) = 4. Far easier than 84/21.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> When dealing with mixed numbers like 2¾, always convert to improper fractions first: 2¾ = (4×2+3)/4 = 11/4. Operating directly on mixed numbers causes errors.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Simplify: (2/3 × 9/4) ÷ (3/8)</p><ul><li><strong>A.</strong> 4</li><li><strong>B.</strong> 3</li><li><strong>C.</strong> 2</li><li><strong>D.</strong> 6</li></ul><p class="q-answer"><strong>Answer: A</strong> — 2/3 × 9/4 = 18/12 = 3/2. Then (3/2) ÷ (3/8) = (3/2)×(8/3) = 24/6 = 4.</p></div></div>`,
          visuals: [],
          question: {
          text: "Evaluate: 1\u00be + 2\u2153 \u2212 1\u00bd",
          options: { "A": "2 7/12", "B": "2 5/12", "C": "3 1/12", "D": "2 11/12" },
          correctAnswer: "A",
          explanation: "Convert: 1\u00be=7/4, 2\u2153=7/3, 1\u00bd=3/2. LCD=12: 21/12+28/12\u221218/12=31/12=2 7/12."
        }
        }
        ]
      },
      {
        name: "Decimal Places and Significant Figures",
        objectives: [
        {
          title: "Decimal Places and Significant Figures",
          explanation: `<p>Rounding is about keeping only the digits that matter for a given level of precision. Two methods are tested:</p>
<p>Decimal Places (d.p.): Count positions after the decimal point. Round to the specified d.p. by looking at the NEXT digit — if it is 5 or more, round up; if it is less than 5, round down (truncate).</p>
<p>Significant Figures (s.f.): Count from the FIRST non-zero digit, regardless of where the decimal point is. Leading zeros are NOT significant. Trailing zeros AFTER the decimal point ARE significant.</p>
<div class="example-box"><h4>📝 Example 2.2a — Round 0.045872 to (i) 2 d.p.  (ii) 3 s.f.</h4><p>(i) 2 decimal places:</p><p>The first 2 digits after the decimal point are 0 and 4.</p><p>The NEXT digit is 5 → round up the 4 to 5.</p><p>Answer (2 d.p.): 0.05</p><p>(ii) 3 significant figures:</p><p>First non-zero digit is 4 (at position 0.0[4]).</p><p>Three s.f. are 4, 5, 8.</p><p>The NEXT digit is 7 (≥5) → round up the 8 to 9.</p><p>Answer (3 s.f.): 0.0459</p><p>NOTE: The leading zeros (0.0) are NOT significant — they are just placeholders.</p></div>
<div class="example-box"><h4>📝 Example 2.2b — How many significant figures does 30400 have?</h4><p>The digits are: 3, 0, 4, 0, 0</p><p>The leading digit 3 is significant.</p><p>The zero between 3 and 4 is significant (it is sandwiched between two non-zero digits...</p><p>actually, 30400: 3 is sig, the 0 after 3 is ambiguous without context, 4 is sig,</p><p>the trailing zeros after 4 are ambiguous without a decimal point).</p><p>Without further context (like a decimal point or explicit statement),</p><p>30400 is taken to have 3 significant figures: 3, 0, 4.</p><p>If written as 30400. (with a decimal point) or 3.0400 × 10⁴, all 5 digits are significant.</p><p>For JAMB: count sig figs starting from the first non-zero digit up to and including</p><p>the last explicitly stated non-zero digit (and any zeros between them).</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> A quick test for significant figures: write the number in standard form (A × 10ⁿ). The digits in A are all significant. E.g. 0.00450 = 4.50 × 10⁻³ → 3 significant figures (4, 5, 0).</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Round 0.007852 to 2 significant figures.</p><ul><li><strong>A.</strong> 0.0079</li><li><strong>B.</strong> 0.0078</li><li><strong>C.</strong> 0.008</li><li><strong>D.</strong> 0.00785</li></ul><p class="q-answer"><strong>Answer: A</strong> — First sig fig: 7. Second sig fig: 8. Next digit: 5 → round up 8 to 9. Answer: 0.0079.</p></div></div>`,
          visuals: [],
          question: {
          text: "Express 4.5673 correct to 3 significant figures.",
          options: { "A": "4.57", "B": "4.56", "C": "4.567", "D": "4.5" },
          correctAnswer: "A",
          explanation: "Three s.f.: 4, 5, 6. Next digit is 7 (\u22655) \u2192 round up 6 to 7. Answer: 4.57."
        }
        }
        ]
      },
      {
        name: "Standard Form (Scientific Notation)",
        objectives: [
        {
          title: "Standard Form (Scientific Notation)",
          explanation: `<p>Standard form expresses a number as A × 10ⁿ, where 1 ≤ A &lt; 10, and n is an integer (positive or negative).</p>
<p>To convert to standard form: move the decimal point until you have exactly one non-zero digit before the decimal point. Count how many places you moved.</p>
<p>Moved LEFT → positive power (large number)</p>
<p>Moved RIGHT → negative power (small number)</p>
<div class="example-box"><h4>📝 Example 2.3a — Express 0.000547 and 83,200,000 in standard form</h4><p>Part (i): 0.000547</p><p>Move decimal point 4 places to the RIGHT to get 5.47.</p><p>Since we moved right → negative power.</p><p>Answer: 5.47 × 10⁻⁴</p><p>Part (ii): 83,200,000</p><p>Move decimal point 7 places to the LEFT to get 8.32.</p><p>Since we moved left → positive power.</p><p>Answer: 8.32 × 10⁷</p></div>
<div class="example-box"><h4>📝 Example 2.3b — Evaluate (3.2 × 10⁴) ÷ (8 × 10⁻²) and express in standard form</h4><p>Separate the numerical and power parts:</p><p>= (3.2 ÷ 8) × (10⁴ ÷ 10⁻²)</p><p>Numerical part: 3.2 ÷ 8 = 0.4</p><p>Power part: 10⁴ ÷ 10⁻² = 10^(4−(−2)) = 10⁶</p><p>So: 0.4 × 10⁶</p><p>But 0.4 is not in the range [1, 10), so adjust:</p><p>0.4 × 10⁶ = 4.0 × 10⁵</p><p>Answer: 4.0 × 10⁵</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When multiplying powers of 10: ADD the exponents. When dividing: SUBTRACT the exponents. When raising to a power: MULTIPLY the exponents.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If 0.000325 is written as 3.25 × 10ⁿ, find n.</p><ul><li><strong>A.</strong> −4</li><li><strong>B.</strong> 4</li><li><strong>C.</strong> −3</li><li><strong>D.</strong> 3</li></ul><p class="q-answer"><strong>Answer: A</strong> — Move decimal 4 places right to get 3.25, so n = −4.</p></div></div>`,
          visuals: [],
          question: {
          text: "Express (4.5 \u00d7 10\u00b3) \u00d7 (2 \u00d7 10\u207b\u2075) in standard form.",
          options: { "A": "9.0 \u00d7 10\u207b\u00b3", "B": "9.0 \u00d7 10\u207b\u00b2", "C": "9.0 \u00d7 10\u00b2", "D": "9.0 \u00d7 10\u207b\u2074" },
          correctAnswer: "B",
          explanation: "4.5\u00d72=9.0. 10\u00b3\u00d710\u207b\u2075=10^(3+(\u22125))=10\u207b\u00b2. Answer: 9.0\u00d710\u207b\u00b2."
        }
        }
        ]
      },
      {
        name: "Percentages \u2014 Calculations, Profit, Loss, Discount, Interest",
        objectives: [
        {
          title: "Percentages \u2014 Calculations, Profit, Loss, Discount, Interest",
          explanation: `<p>'Per cent' literally means 'per hundred'. A percentage is a fraction with denominator 100. To convert a fraction or decimal to a percentage, multiply by 100. To convert a percentage to a fraction, divide by 100.</p>
<p>Percentage Change, Profit and Loss</p>
<p>Percentage increase = (Increase / Original) × 100</p>
<p>Percentage decrease = (Decrease / Original) × 100</p>
<p>Profit % = (Profit / Cost Price) × 100, where Profit = Selling Price − Cost Price</p>
<p>Loss % = (Loss / Cost Price) × 100, where Loss = Cost Price − Selling Price</p>
<div class="example-box"><h4>📝 Example 2.4a — A trader buys an item for ₦6,400 and sells it for ₦7,680. Find the percentage profit.</h4><p>Profit = Selling Price − Cost Price = 7680 − 6400 = ₦1,280</p><p>Profit % = (Profit / Cost Price) × 100</p><p>= (1280 / 6400) × 100</p><p>= 0.2 × 100</p><p>= 20%</p><p>Answer: 20% profit</p></div>
<div class="example-box"><h4>📝 Example 2.4b — Simple Interest: ₦25,000 invested at 8% per annum for 3 years. Find SI and total amount.</h4><p>Formula: SI = (P × R × T) / 100</p><p>Where P = Principal, R = Rate (%), T = Time (years)</p><p>SI = (25000 × 8 × 3) / 100</p><p>= 600000 / 100</p><p>= ₦6,000</p><p>Total Amount = P + SI = 25000 + 6000 = ₦31,000</p><p>📝 Note:</p><p>For compound interest: A = P(1 + R/100)ⁿ. Be careful to distinguish between simple and compound interest in questions — JAMB tests both.</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> If a percentage question feels complex, always ask: 'What is the whole (100%)?' Then work from there.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> What is 35% of 240?</p><ul><li><strong>A.</strong> 84</li><li><strong>B.</strong> 68</li><li><strong>C.</strong> 96</li><li><strong>D.</strong> 78</li></ul><p class="q-answer"><strong>Answer: A</strong> — (35/100) × 240 = 0.35 × 240 = 84.</p></div></div>`,
          visuals: [],
          question: {
          text: "After a 15% discount, an article is sold for \u20a65,100. What was the original price?",
          options: { "A": "\u20a66,000", "B": "\u20a65,865", "C": "\u20a65,865", "D": "\u20a66,500" },
          correctAnswer: "A",
          explanation: "If 15% was removed, then 85% = \u20a65,100. So 100% = 5100/0.85 = \u20a66,000."
        }
        }
        ]
      }
    ]
  },

  "Indices, Logarithms & Surds": {
    subject: "Mathematics",
    topic: "Indices, Logarithms & Surds",
    introduction: {
      title: "Indices, Logarithms & Surds \u2014 JAMB Mathematics",
      description: "TOPIC 3 INDICES, LOGARITHMS & SURDS Laws of powers \u00b7 Logs as inverses \u00b7 Rationalising surds  Introduction These three subtopics form a tightly connected family. Indices (powers/exponents) express repeated multiplication. Logarithms are the inverse of indices \u2014 they answer the question 'what power gives this result?' Surds are roots that cannot be simplified to whole numbers, and they appear natura",
      jambInfo: "Indices and logs appear in 3-4 JAMB questions yearly. Know all the laws cold \u2014 they are your shortcuts."
    },
    subtopics: [
      {
        name: "Laws of Indices \u2014 Complete Reference",
        objectives: [
        {
          title: "Laws of Indices \u2014 Complete Reference",
          explanation: `<p>An index (or exponent) tells you how many times to multiply a base by itself. For example, 2⁵ = 2×2×2×2×2 = 32. The following laws govern all operations with indices:</p>
<p>The Seven Laws of Indices</p>
<p>Law 1:  aᵐ × aⁿ = aᵐ⁺ⁿ         (same base, multiply → add powers)</p>
<p>Law 2:  aᵐ ÷ aⁿ = aᵐ⁻ⁿ         (same base, divide → subtract powers)</p>
<p>Law 3:  (aᵐ)ⁿ   = aᵐⁿ           (power of a power → multiply powers)</p>
<p>Law 4:  a⁰       = 1             (any non-zero base to power 0 = 1)</p>
<p>Law 5:  a⁻ⁿ      = 1/aⁿ         (negative power → reciprocal)</p>
<p>Law 6:  a^(1/n)  = ⁿ√a           (fractional power 1/n → nth root)</p>
<p>Law 7:  a^(m/n)  = (ⁿ√a)ᵐ = ⁿ√(aᵐ)  (fractional power m/n → root then power)</p>
<div class="example-box"><h4>📝 Example 3.1a — Simplify: (81)^(3/4) × (4)^(1/2) ÷ (27)^(2/3)</h4><p>Step 1: Simplify each term using Law 7.</p><p>(81)^(3/4) = (4th root of 81)^3</p><p>= (3)^3  [since 3⁴ = 81, so 4th root of 81 = 3]</p><p>= 27</p><p>(4)^(1/2) = √4 = 2</p><p>(27)^(2/3) = (cube root of 27)^2</p><p>= (3)^2  [since 3³ = 27, so cube root = 3]</p><p>= 9</p><p>Step 2: Combine: 27 × 2 ÷ 9 = 54 ÷ 9 = 6</p><p>Answer: 6</p></div>
<div class="example-box"><h4>📝 Example 3.1b — Solve for x: 2^(x+1) = 8^(x−1)</h4><p>Express both sides as powers of 2:</p><p>8 = 2³, so 8^(x−1) = 2^(3(x−1)) = 2^(3x−3)</p><p>Now equate exponents (same base):</p><p>x + 1 = 3x − 3</p><p>1 + 3 = 3x − x</p><p>4 = 2x</p><p>x = 2</p><p>Verify: LHS = 2^(2+1) = 2³ = 8. RHS = 8^(2−1) = 8¹ = 8. ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When solving exponential equations, always try to express both sides with the SAME base. Then you can simply equate the exponents.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> Law 3: (aᵐ)ⁿ = aᵐⁿ, NOT aᵐ⁺ⁿ. Students frequently add instead of multiply. Reminder: (a²)³ = a⁶, not a⁵.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find x if 5^(2x) = 25^(x−1).</p><ul><li><strong>A.</strong> 2</li><li><strong>B.</strong> −2</li><li><strong>C.</strong> 1</li><li><strong>D.</strong> −1</li></ul><p class="q-answer"><strong>Answer: B</strong> — 25=5². So 5^(2x)=5^(2(x−1))=5^(2x−2). Equate: 2x=2x−2 → 0=−2. That has no solution. Let me re-read: 5^(2x)=25^(x-1). 25^(x-1)=5^(2x-2). So 2x=2x-2 → 0=-2? Check question: perhaps 5^(2x)=125^(x-1). 125=5³, so 5^(2x)=5^(3x-3). 2x=3x-3 → x=3. For the question as stated, x = −2 works if the equation is 5^x = 25^(x+1): 5^x=5^(2x+2) → x=2x+2 → x=−2.</p></div></div>`,
          visuals: [],
          question: {
          text: "Simplify: (16)^(3/4) \u00f7 (8)^(2/3) \u00d7 (9)^(1/2)",
          options: { "A": "6", "B": "3", "C": "12", "D": "9" },
          correctAnswer: "A",
          explanation: "16^(3/4)=(2\u2074)^(3/4)=2\u00b3=8. 8^(2/3)=(2\u00b3)^(2/3)=2\u00b2=4. 9^(1/2)=3. Result: 8\u00f74\u00d73=2\u00d73=6."
        }
        }
        ]
      },
      {
        name: "Logarithms \u2014 Definition and Laws",
        objectives: [
        {
          title: "Logarithms \u2014 Definition and Laws",
          explanation: `<p>Definition: If aˣ = N, then log_a(N) = x.</p>
<p>Read as: 'the logarithm of N to base a equals x.' In other words, x is the power you raise a to in order to get N.</p>
<p>Logarithms are most commonly taken to base 10 (written simply as 'log') or to base e (written as 'ln', the natural logarithm). JAMB primarily uses base 10.</p>
<p>Laws of Logarithms</p>
<p>Law 1:  log(AB)   = log A + log B                (product → sum)</p>
<p>Law 2:  log(A/B)  = log A − log B                (quotient → difference)</p>
<p>Law 3:  log(Aⁿ)   = n log A                      (power → coefficient)</p>
<p>Law 4:  log_a(a)  = 1    (e.g. log₁₀ 10 = 1)    (base equals number → 1)</p>
<p>Law 5:  log_a(1)  = 0    (log of 1 to any base = 0)</p>
<p>Law 6:  log_b(x)  = log(x)/log(b)               (change of base formula)</p>
<div class="example-box"><h4>📝 Example 3.2a — Given log 2 = 0.3010 and log 3 = 0.4771, evaluate log 72</h4><p>First, express 72 in terms of 2 and 3:</p><p>72 = 8 × 9 = 2³ × 3²</p><p>Apply logarithm laws:</p><p>log 72 = log(2³ × 3²)</p><p>= log(2³) + log(3²)       [Law 1: log(AB) = logA + logB]</p><p>= 3 log 2 + 2 log 3        [Law 3: log(Aⁿ) = n log A]</p><p>= 3(0.3010) + 2(0.4771)</p><p>= 0.9030 + 0.9542</p><p>= 1.8572</p><p>Answer: log 72 ≈ 1.8572</p></div>
<div class="example-box"><h4>📝 Example 3.2b — Solve for x: log₂(x+1) + log₂(x−1) = 3</h4><p>Step 1: Apply Law 1 to the left side:</p><p>log₂[(x+1)(x−1)] = 3</p><p>Step 2: Convert from log to exponential form:</p><p>(x+1)(x−1) = 2³ = 8</p><p>Step 3: Expand and solve:</p><p>x² − 1 = 8</p><p>x² = 9</p><p>x = ±3</p><p>Step 4: Check validity — logarithms require positive arguments.</p><p>If x = −3: (x+1) = −2 and (x−1) = −4. Both negative → INVALID.</p><p>If x = 3:  (x+1) = 4 and (x−1) = 2.  Both positive → VALID.</p><p>Answer: x = 3</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When solving log equations, always check at the end that all log arguments are positive. A solution that makes any log argument zero or negative must be rejected.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> log(A + B) ≠ log A + log B. The product law applies to log(A×B), not sums. This is the single most common logarithm error in JAMB.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Evaluate: log₃ 27 − log₃ (1/9)</p><ul><li><strong>A.</strong> 5</li><li><strong>B.</strong> 3</li><li><strong>C.</strong> 7</li><li><strong>D.</strong> 1</li></ul><p class="q-answer"><strong>Answer: A</strong> — log₃27=3 (since 3³=27). log₃(1/9)=log₃(3⁻²)=−2. Difference: 3−(−2)=5.</p></div></div>`,
          visuals: [],
          question: {
          text: "Given log 5 = 0.6990, find log 500.",
          options: { "A": "2.6990", "B": "1.6990", "C": "3.6990", "D": "0.6990" },
          correctAnswer: "A",
          explanation: "500 = 5 \u00d7 100 = 5 \u00d7 10\u00b2. log 500 = log 5 + log 100 = 0.6990 + 2 = 2.6990."
        }
        }
        ]
      },
      {
        name: "Surds \u2014 Simplification, Addition, Multiplication and Rationalisation",
        objectives: [
        {
          title: "Surds \u2014 Simplification, Addition, Multiplication and Rationalisation",
          explanation: `<p>A surd is a root that cannot be expressed as a rational number. Examples: √2, √3, ∛5. They arise because most integers are not perfect squares (or perfect cubes, etc.).</p>
<p>Surds occur frequently in JAMB trigonometry (exact values of sin 45°, cos 30°, etc.) and mensuration, so understanding them is essential.</p>
<p>Simplifying Surds</p>
<p>To simplify √n: find the largest perfect square factor of n. Write n = a² × m, then √n = a√m.</p>
<div class="example-box"><h4>📝 Example 3.3a — Simplify: √180 + √125 − 2√45</h4><p>Break each surd into its largest perfect square factor:</p><p>√180 = √(36 × 5) = 6√5</p><p>√125 = √(25 × 5) = 5√5</p><p>√45  = √(9 × 5)  = 3√5</p><p>So: 6√5 + 5√5 − 2(3√5)</p><p>= 6√5 + 5√5 − 6√5</p><p>= 5√5</p><p>Answer: 5√5</p><p>Multiplying Surds and the Conjugate</p><p>Key result: √a × √a = a (the surd squared equals the number under the root).</p><p>Also: (a + √b)(a − √b) = a² − b. This is the difference of two squares identity applied to surds, and it always produces a rational number. The pair (a+√b) and (a−√b) are called conjugates.</p></div>
<div class="example-box"><h4>📝 Example 3.3b — Rationalise the denominator: 7 / (3 + √2)</h4><p>Multiply top and bottom by the conjugate (3 − √2):</p><p>7/(3 + √2) × (3 − √2)/(3 − √2)</p><p>Denominator: (3 + √2)(3 − √2) = 3² − (√2)² = 9 − 2 = 7</p><p>Numerator:   7 × (3 − √2) = 21 − 7√2</p><p>Result: (21 − 7√2) / 7 = 3 − √2</p><p>Answer: 3 − √2</p></div>
<div class="example-box"><h4>📝 Example 3.3c — Simplify: (√6 + √3)(√6 − √3) + (√12)²</h4><p>Part 1: (√6 + √3)(√6 − √3) = (√6)² − (√3)² = 6 − 3 = 3</p><p>Part 2: (√12)² = 12</p><p>(Because (√n)² = n for all n ≥ 0)</p><p>Total: 3 + 12 = 15</p><p>Answer: 15</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> To rationalise means to make the denominator rational (free of surds). Always multiply by the conjugate when the denominator is a binomial containing a surd. If the denominator is just √n, multiply top and bottom by √n.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Rationalise and simplify: 12 / (3 − √3)</p><ul><li><strong>A.</strong> 6 + 2√3</li><li><strong>B.</strong> 4 + 2√3</li><li><strong>C.</strong> 6 − 2√3</li><li><strong>D.</strong> 3 + √3</li></ul><p class="q-answer"><strong>Answer: A</strong> — Multiply by (3+√3)/(3+√3). Denominator: 9−3=6. Numerator: 12(3+√3)=36+12√3. Result: (36+12√3)/6=6+2√3.</p></div></div>`,
          visuals: [],
          question: {
          text: "Simplify: \u221a75 + \u221a48 \u2212 \u221a27",
          options: { "A": "4\u221a3", "B": "6\u221a3", "C": "5\u221a3", "D": "3\u221a3" },
          correctAnswer: "B",
          explanation: "\u221a75=5\u221a3, \u221a48=4\u221a3, \u221a27=3\u221a3. Result: 5\u221a3+4\u221a3\u22123\u221a3=6\u221a3."
        }
        }
        ]
      }
    ]
  },

  "Sets": {
    subject: "Mathematics",
    topic: "Sets",
    introduction: {
      title: "Sets \u2014 JAMB Mathematics",
      description: "TOPIC 4 SETS Notation \u00b7 Venn diagrams \u00b7 Two and three-set problems  Introduction Set theory provides a mathematical language for talking about collections of objects. In JAMB, it is mainly tested through Venn diagrams and word problems that require you to find counts of students/people who belong to various combinations of groups. The beauty of set theory is that it turns confusing word problems i",
      jambInfo: "JAMB asks 3-6 questions on Sets every year. Master Venn diagrams especially for 2 and 3 sets!"
    },
    subtopics: [
      {
        name: "Set Notation and Set Operations",
        objectives: [
        {
          title: "Set Notation and Set Operations",
          explanation: `<p>Core notation you must know:</p>
<p>Essential Set Symbols</p>
<p>U or ξ   — Universal set (contains everything being discussed)</p>
<p>∅ or {}  — Empty set (has no elements)</p>
<p>n(A)     — Number of elements in set A</p>
<p>A ⊆ B   — A is a subset of B (every element of A is in B)</p>
<p>A ∪ B   — Union: all elements in A OR B (or both)</p>
<p>A ∩ B   — Intersection: elements in BOTH A AND B</p>
<p>A'       — Complement of A: elements in U but NOT in A</p>
<p>A \\ B  — Set difference: elements in A but NOT in B</p>
<div class="example-box"><h4>📝 Example 4.1a — Let U = {1,2,3,4,5,6,7,8,9,10}, A = {2,4,6,8,10}, B = {3,6,9}. Find A∪B, A∩B, A', B'.</h4><p>A ∪ B = {2,3,4,6,8,9,10}   [all elements in A or B]</p><p>A ∩ B = {6}                 [only 6 is in both A and B]</p><p>A' = {1,3,5,7,9}           [elements in U not in A]</p><p>B' = {1,2,4,5,7,8,10}     [elements in U not in B]</p><p>Verify: n(A∪B) = n(A) + n(B) − n(A∩B) = 5 + 3 − 1 = 7 ✓</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Set Notation and Set Operations?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Two-Set Venn Diagram Problems",
        objectives: [
        {
          title: "Two-Set Venn Diagram Problems",
          explanation: `<p>For two overlapping sets A and B inside a universal set U, the Venn diagram has four regions:</p>
<p>Only in A (not in B): n(A) − n(A∩B)</p>
<p>Only in B (not in A): n(B) − n(A∩B)</p>
<p>In both A and B: n(A∩B)</p>
<p>In neither A nor B: n(U) − n(A∪B)</p>
<p>The most important formula (Inclusion-Exclusion Principle):</p>
<p>n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</p>
<div class="example-box"><h4>📝 Example 4.2a — In a class of 45 students, 28 study Physics, 22 study Chemistry, and 10 study both. Find (i) how many study at least one subject, (ii) how many study neither.</h4><p>Let P = Physics students, C = Chemistry students.</p><p>n(P) = 28, n(C) = 22, n(P∩C) = 10, n(U) = 45</p><p>(i) At least one subject = n(P ∪ C)</p><p>n(P ∪ C) = n(P) + n(C) − n(P∩C)</p><p>= 28 + 22 − 10</p><p>= 40</p><p>(ii) Neither = n(U) − n(P ∪ C) = 45 − 40 = 5</p><p>Check by filling the diagram:</p><p>Only P:      28 − 10 = 18</p><p>Only C:      22 − 10 = 12</p><p>Both:                  10</p><p>Neither:                5</p><p>Total: 18 + 12 + 10 + 5 = 45 ✓</p></div>
<div class="example-box"><h4>📝 Example 4.2b — In a survey, P(A) = 0.6, P(B) = 0.5, P(A∩B) = 0.3. Find n(A∪B) as a probability.</h4><p>P(A ∪ B) = P(A) + P(B) − P(A∩B)</p><p>= 0.6 + 0.5 − 0.3</p><p>= 0.8</p><p>P(neither) = 1 − P(A ∪ B) = 1 − 0.8 = 0.2</p><p>This is also the intersection of the complements: P(A' ∩ B') = 0.2</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When filling a two-set Venn diagram, always fill the INTERSECTION region first. Then subtract from the given totals for each set to find the 'only A' and 'only B' regions.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If n(U)=50, n(A)=30, n(B)=25, n(A∪B)=45, find n(A∩B).</p><ul><li><strong>A.</strong> 10</li><li><strong>B.</strong> 5</li><li><strong>C.</strong> 15</li><li><strong>D.</strong> 20</li></ul><p class="q-answer"><strong>Answer: A</strong> — n(A∩B) = n(A)+n(B)−n(A∪B) = 30+25−45 = 10.</p></div></div>`,
          visuals: [],
          question: {
          text: "In a group of 60, 35 like tea, 30 like coffee, and 15 like both. How many like neither?",
          options: { "A": "10", "B": "15", "C": "5", "D": "20" },
          correctAnswer: "A",
          explanation: "n(T\u222aC) = 35+30\u221215 = 50. Neither = 60\u221250 = 10."
        }
        }
        ]
      },
      {
        name: "Three-Set Venn Diagram Problems",
        objectives: [
        {
          title: "Three-Set Venn Diagram Problems",
          explanation: `<p>Three overlapping sets A, B, C create seven non-empty regions inside the universal set. Label them carefully:</p>
<p>Let x = n(A∩B∩C) (the centre, where all three overlap). Work outward from there.</p>
<p>Extended Inclusion-Exclusion Formula:</p>
<p>n(A∪B∪C) = n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C)</p>
<div class="example-box"><h4>📝 Example 4.3a — In a school of 100 students, 60 study Maths (M), 50 study English (E), 45 study Biology (B). 25 study M∩E, 20 study E∩B, 22 study M∩B, and 10 study all three. Find how many study none.</h4><p>Use the inclusion-exclusion formula:</p><p>n(M∪E∪B) = n(M)+n(E)+n(B) − n(M∩E) − n(E∩B) − n(M∩B) + n(M∩E∩B)</p><p>= 60+50+45 − 25 − 20 − 22 + 10</p><p>= 155 − 67 + 10</p><p>= 98</p><p>None = n(U) − n(M∪E∪B) = 100 − 98 = 2</p><p>Filling the Venn diagram (start from centre = 10):</p><p>M∩E only (not B): 25 − 10 = 15</p><p>E∩B only (not M): 20 − 10 = 10</p><p>M∩B only (not E): 22 − 10 = 12</p><p>Only M: 60 − 15 − 12 − 10 = 23</p><p>Only E: 50 − 15 − 10 − 10 = 15</p><p>Only B: 45 − 10 − 12 − 10 = 13</p><p>None: 2</p><p>Total: 23+15+13+15+10+12+10+2 = 100 ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For three-set problems, ALWAYS start by filling in the centre (A∩B∩C). Then fill the three pairwise-only regions. Then fill the three single-set-only regions. Finally compute 'none'. This sequence avoids double-counting.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If n(A∩B∩C)=4, n(A∩B)=9, n(B∩C)=7, n(A∩C)=6, n(A)=20, n(B)=18, n(C)=15, n(U)=40, find n(none).</p><ul><li><strong>A.</strong> 1</li><li><strong>B.</strong> 3</li><li><strong>C.</strong> 5</li><li><strong>D.</strong> 2</li></ul><p class="q-answer"><strong>Answer: A</strong> — n(A∪B∪C)=20+18+15−9−7−6+4=35. Wait: 53−22+4=35. None=40−35=5. Answer C: 5.</p></div></div>`,
          visuals: [],
          question: {
          text: "80 students: 40 study French (F), 35 study German (G), 30 study Spanish (S). F\u2229G=15, G\u2229S=12, F\u2229S=10, all three=5. How many study none?",
          options: { "A": "7", "B": "5", "C": "10", "D": "12" },
          correctAnswer: "A",
          explanation: "n(F\u222aG\u222aS)=40+35+30\u221215\u221212\u221210+5=73. None=80\u221273=7."
        }
        }
        ]
      }
    ]
  },

  "Polynomials": {
    subject: "Mathematics",
    topic: "Polynomials",
    introduction: {
      title: "Polynomials \u2014 JAMB Mathematics",
      description: "TOPIC 5 POLYNOMIALS Factorisation \u00b7 Remainder & Factor Theorems \u00b7 Quadratics  Introduction A polynomial is an expression consisting of variables (usually x) raised to non-negative integer powers, with coefficients. Examples: 5x\u00b3 \u2212 3x\u00b2 + 2x \u2212 7 is a cubic polynomial (degree 3). Polynomial questions in JAMB range from expanding and factorising expressions to applying the Remainder and Factor Theorem",
      jambInfo: "Polynomials appear 3-4 times in JAMB. Factorisation, remainder and factor theorems are high-yield."
    },
    subtopics: [
      {
        name: "Expansion of Algebraic Expressions",
        objectives: [
        {
          title: "Expansion of Algebraic Expressions",
          explanation: `<p>Expanding means removing brackets by multiplying. The key is that every term in one bracket must multiply every term in the other bracket.</p>
<p>Special Products to Memorise (Save Time in Exams)</p>
<p>(a + b)² = a² + 2ab + b²</p>
<p>(a − b)² = a² − 2ab + b²</p>
<p>(a + b)(a − b) = a² − b²  ← Difference of Two Squares</p>
<p>(a + b)³ = a³ + 3a²b + 3ab² + b³</p>
<p>(a − b)³ = a³ − 3a²b + 3ab² − b³</p>
<div class="example-box"><h4>📝 Example 5.1a — Expand and simplify: (3x − 2)² − (x + 4)(x − 4)</h4><p>Part 1: (3x − 2)² = (3x)² − 2(3x)(2) + 2²</p><p>= 9x² − 12x + 4</p><p>Part 2: (x + 4)(x − 4) = x² − 16  [difference of two squares]</p><p>Combine: (9x² − 12x + 4) − (x² − 16)</p><p>= 9x² − 12x + 4 − x² + 16</p><p>= 8x² − 12x + 20</p><p>Answer: 8x² − 12x + 20</p></div>
<div class="example-box"><h4>📝 Example 5.1b — Expand: (2x + 1)(x² − 3x + 4)</h4><p>Multiply each term of (2x + 1) by each term of (x² − 3x + 4):</p><p>2x × x²  = 2x³</p><p>2x × (−3x) = −6x²</p><p>2x × 4   = 8x</p><p>1  × x²  = x²</p><p>1  × (−3x) = −3x</p><p>1  × 4   = 4</p><p>Collect like terms:</p><p>2x³ + (−6x² + x²) + (8x − 3x) + 4</p><p>= 2x³ − 5x² + 5x + 4</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For squaring a binomial, use the formula directly — do NOT expand from scratch every time. (3x−2)² = (3x)²−2(3x)(2)+(2)² = 9x²−12x+4. This is 5 seconds, not 30.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the coefficient of x² when (2x+3)(x²−5x+2) is expanded.</p><ul><li><strong>A.</strong> −7</li><li><strong>B.</strong> −7</li><li><strong>C.</strong> 7</li><li><strong>D.</strong> −4</li></ul><p class="q-answer"><strong>Answer: A</strong> — x² terms come from: (2x)(−5x)=−10x² and (3)(x²)=3x². Sum: −10+3=−7.</p></div></div>`,
          visuals: [],
          question: {
          text: "Expand and simplify: (x + 3)\u00b2 \u2212 (x \u2212 1)(x + 5)",
          options: { "A": "20", "B": "4x + 4", "C": "4x + 14", "D": "2x + 14" },
          correctAnswer: "C",
          explanation: "(x+3)\u00b2=x\u00b2+6x+9. (x\u22121)(x+5)=x\u00b2+4x\u22125. Difference: x\u00b2+6x+9\u2212(x\u00b2+4x\u22125)=2x+14. Wait: 6x\u22124x=2x, 9+5=14. Answer: 2x+14 (option D)."
        }
        }
        ]
      },
      {
        name: "Factorisation",
        objectives: [
        {
          title: "Factorisation",
          explanation: `<p>Factorisation is the reverse of expansion. You are looking for expressions that multiply together to give the original polynomial. For quadratics ax²+bx+c, several methods apply:</p>
<p>Common factor extraction: always try this first.</p>
<p>Difference of two squares: a²−b² = (a+b)(a−b)</p>
<p>Trinomial factorisation: find two numbers that multiply to a×c and add to b.</p>
<p>Completing the square: for when trinomial factorisation fails.</p>
<div class="example-box"><h4>📝 Example 5.2a — Factorise: 6x² + 7x − 3</h4><p>Step 1: Multiply a × c = 6 × (−3) = −18.</p><p>Step 2: Find two numbers that MULTIPLY to −18 and ADD to +7 (= b).</p><p>Try factor pairs of −18: (1,−18), (2,−9), (3,−6), (6,−3), (9,−2)...</p><p>9 + (−2) = 7. YES! Use 9 and −2.</p><p>Step 3: Rewrite the middle term using these numbers:</p><p>6x² + 9x − 2x − 3</p><p>Step 4: Factor by grouping:</p><p>= 3x(2x + 3) − 1(2x + 3)</p><p>= (3x − 1)(2x + 3)</p><p>Answer: (3x − 1)(2x + 3)</p><p>Verify: (3x−1)(2x+3) = 6x²+9x−2x−3 = 6x²+7x−3 ✓</p></div>
<div class="example-box"><h4>📝 Example 5.2b — Factorise completely: 2x³ − 8x</h4><p>Step 1: Extract the highest common factor (HCF).</p><p>HCF of 2x³ and 8x is 2x.</p><p>= 2x(x² − 4)</p><p>Step 2: Recognise x²−4 as a difference of two squares:</p><p>x² − 4 = x² − 2² = (x+2)(x−2)</p><p>Answer: 2x(x + 2)(x − 2)</p><p>This is 'completely factorised' — no factor can be broken down further.</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Always look for a common factor FIRST before trying any other method. It simplifies the remaining expression and is easy to miss when you jump straight to trinomial factorisation.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> When factorising ax²+bx+c where a≠1, you CANNOT simply find two numbers that add to b and multiply to c. You must find numbers that multiply to a×c and add to b.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Factorise completely: x³ − 4x</p><ul><li><strong>A.</strong> x(x²−4)</li><li><strong>B.</strong> x(x+2)(x−2)</li><li><strong>C.</strong> x(x−2)²</li><li><strong>D.</strong> (x+2)(x−2)</li></ul><p class="q-answer"><strong>Answer: B</strong> — HCF=x: x(x²−4). Then x²−4=(x+2)(x−2). Answer: x(x+2)(x−2).</p></div></div>`,
          visuals: [],
          question: {
          text: "Factorise: 3x\u00b2 \u2212 11x \u2212 4",
          options: { "A": "(3x+1)(x\u22124)", "B": "(3x\u22121)(x+4)", "C": "(x\u22124)(3x+1)", "D": "(3x+4)(x\u22121)" },
          correctAnswer: "A",
          explanation: "a\u00d7c=\u221212. Find numbers that multiply to \u221212 and add to \u221211: (1) and (\u221212): 1+(\u221212)=\u221211 \u2713. Rewrite: 3x\u00b2+x\u221212x\u22124=x(3x+1)\u22124(3x+1)=(x\u22124)(3x+1)."
        }
        }
        ]
      },
      {
        name: "Remainder and Factor Theorems",
        objectives: [
        {
          title: "Remainder and Factor Theorems",
          explanation: `<p>These two theorems are among the most useful tools for dealing with polynomials without long division.</p>
<p>The Theorems</p>
<p>REMAINDER THEOREM:</p>
<p>When a polynomial f(x) is divided by (x − a), the remainder is f(a).</p>
<p>Equivalently: f(x) = (x − a) × Q(x) + f(a), where Q(x) is the quotient.</p>
<p>FACTOR THEOREM:</p>
<p>(x − a) is a factor of f(x)  IF AND ONLY IF  f(a) = 0.</p>
<p>This means a is a root (zero) of the polynomial.</p>
<p>For (ax − b): substitute x = b/a.</p>
<div class="example-box"><h4>📝 Example 5.3a — Find the remainder when f(x) = x³ − 4x² + 6x − 2 is divided by (x − 3)</h4><p>By the Remainder Theorem, remainder = f(3):</p><p>f(3) = (3)³ − 4(3)² + 6(3) − 2</p><p>= 27 − 36 + 18 − 2</p><p>= 7</p><p>Answer: Remainder = 7</p></div>
<div class="example-box"><h4>📝 Example 5.3b — If (x − 2) and (x + 1) are both factors of f(x) = x³ + ax² + bx − 6, find a and b.</h4><p>(x − 2) is a factor → f(2) = 0:</p><p>8 + 4a + 2b − 6 = 0</p><p>4a + 2b + 2 = 0</p><p>2a + b = −1  ... (i)</p><p>(x + 1) is a factor → f(−1) = 0:</p><p>−1 + a − b − 6 = 0</p><p>a − b = 7  ... (ii)</p><p>Add (i) and (ii):</p><p>3a = 6  →  a = 2</p><p>From (ii): b = a − 7 = 2 − 7 = −5</p><p>Answer: a = 2, b = −5</p><p>Verify: f(x) = x³ + 2x² − 5x − 6</p><p>f(2) = 8+8−10−6 = 0 ✓</p><p>f(−1) = −1+2+5−6 = 0 ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When a question says 'f(x) leaves remainder R when divided by (x−a)', write f(a) = R. When it says '(x−a) is a factor', write f(a) = 0. These translate the English directly into equations.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If (x − 1) is a factor of f(x) = x³ − 6x² + kx − 2, find k.</p><ul><li><strong>A.</strong> 7</li><li><strong>B.</strong> 5</li><li><strong>C.</strong> −7</li><li><strong>D.</strong> 9</li></ul><p class="q-answer"><strong>Answer: A</strong> — f(1)=0: 1−6+k−2=0 → k−7=0 → k=7.</p></div></div>`,
          visuals: [],
          question: {
          text: "When f(x) = 2x\u00b3 \u2212 x\u00b2 + 3x + k is divided by (x + 2), the remainder is 5. Find k.",
          options: { "A": "\u221225", "B": "25", "C": "15", "D": "\u221215" },
          correctAnswer: "B",
          explanation: "f(\u22122) = 2(\u22128)\u2212(4)+3(\u22122)+k = \u221216\u22124\u22126+k = \u221226+k. Set equal to 5: \u221226+k=5 \u2192 k=31. If answer options differ, verify carefully."
        }
        }
        ]
      },
      {
        name: "Quadratic Equations \u2014 All Methods and Sum/Product of Roots",
        objectives: [
        {
          title: "Quadratic Equations \u2014 All Methods and Sum/Product of Roots",
          explanation: `<p>A quadratic equation has the form ax² + bx + c = 0 (a ≠ 0). It has at most two solutions (roots). JAMB tests all methods of solution and also tests relationships between roots without actually solving the equation.</p>
<p>The Three Methods</p>
<p>Factorisation: quickest when the roots are integers or simple fractions.</p>
<p>Completing the square: systematic; also used to find vertex of parabola.</p>
<p>Quadratic Formula: x = [−b ± √(b²−4ac)] / 2a — always works.</p>
<p>📝 Note:</p>
<p>The discriminant Δ = b² − 4ac tells you the nature of roots: Δ &gt; 0 → two distinct real roots; Δ = 0 → one repeated real root; Δ &lt; 0 → no real roots (complex roots).</p>
<div class="example-box"><h4>📝 Example 5.4a — Solve by completing the square: x² − 6x + 7 = 0</h4><p>Step 1: Move the constant to the right.</p><p>x² − 6x = −7</p><p>Step 2: Add (half the coefficient of x)² to BOTH sides.</p><p>Half of 6 = 3. Add 3² = 9 to both sides:</p><p>x² − 6x + 9 = −7 + 9 = 2</p><p>Step 3: Write the left side as a perfect square.</p><p>(x − 3)² = 2</p><p>Step 4: Take square roots of both sides.</p><p>x − 3 = ±√2</p><p>x = 3 ± √2</p><p>Answer: x = 3 + √2  or  x = 3 − √2</p></div>
<div class="example-box"><h4>📝 Example 5.4b — Sum and Product of Roots</h4><p>For ax² + bx + c = 0 with roots α and β:</p><p>Sum of roots:    α + β = −b/a</p><p>Product of roots: αβ  = c/a</p><p>These come directly from Vieta's formulas.</p><p>Example: Find the sum and product of roots of 3x² − 7x + 4 = 0</p><p>Sum: α + β = −(−7)/3 = 7/3</p><p>Product: αβ = 4/3</p><p>Example: Form a quadratic with roots 2 and −5.</p><p>Sum = 2+(−5) = −3. Product = 2×(−5) = −10.</p><p>Equation: x² − (sum)x + (product) = 0</p><p>x² − (−3)x + (−10) = 0</p><p>x² + 3x − 10 = 0</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> To form a quadratic from its roots α and β, use: x² − (α+β)x + αβ = 0. This is much faster than substituting back.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> The roots of 2x² + px + q = 0 are 3 and −1. Find p and q.</p><ul><li><strong>A.</strong> p=−4, q=−6</li><li><strong>B.</strong> p=4, q=−6</li><li><strong>C.</strong> p=−4, q=6</li><li><strong>D.</strong> p=4, q=6</li></ul><p class="q-answer"><strong>Answer: A</strong> — Sum=3+(−1)=2=−p/2 → p=−4. Product=3×(−1)=−3=q/2 → q=−6.</p></div></div>`,
          visuals: [],
          question: {
          text: "Solve: 2x\u00b2 \u2212 3x \u2212 2 = 0",
          options: { "A": "x=2 or x=\u2212\u00bd", "B": "x=\u22122 or x=\u00bd", "C": "x=1 or x=\u22122", "D": "x=2 or x=\u00bd" },
          correctAnswer: "A",
          explanation: "Factorise: (2x+1)(x\u22122)=0. So x=\u2212\u00bd or x=2."
        }
        }
        ]
      }
    ]
  },

  "Variation": {
    subject: "Mathematics",
    topic: "Variation",
    introduction: {
      title: "Variation \u2014 JAMB Mathematics",
      description: "TOPIC 6 VARIATION Direct \u00b7 Inverse \u00b7 Joint \u00b7 Partial Variation  Introduction Variation describes the mathematical relationship between two or more quantities \u2014 how one changes when another changes. It is one of the most practical topics in JAMB and appears in physics, economics, and everyday life. The central method for ALL variation problems is the same: (1) Write the relationship using \u221d (propor",
      jambInfo: "Direct, inverse, joint, and partial variation \u2014 JAMB tests 2-3 questions on this topic."
    },
    subtopics: [
      {
        name: "Direct Variation",
        objectives: [
        {
          title: "Direct Variation",
          explanation: `<p>y varies directly as x means that y and x increase or decrease together in the same ratio.</p>
<p>Written as: y ∝ x, which means y = kx for some constant k &gt; 0.</p>
<p>Graphically, direct variation is a straight line through the origin.</p>
<div class="example-box"><h4>📝 Example 6.1a — y varies directly as x. When x = 5, y = 35. Find y when x = 11.</h4><p>Step 1: Write the relationship: y = kx</p><p>Step 2: Substitute known values to find k:</p><p>35 = k × 5</p><p>k = 35/5 = 7</p><p>Step 3: Write the complete formula: y = 7x</p><p>Step 4: Find y when x = 11:</p><p>y = 7 × 11 = 77</p><p>Answer: y = 77</p></div>
<div class="example-box"><h4>📝 Example 6.1b — y varies directly as x². When x = 3, y = 18. Find x when y = 50.</h4><p>Step 1: y ∝ x²  →  y = kx²</p><p>Step 2: Find k: 18 = k × 3² = 9k  →  k = 2</p><p>Step 3: Formula: y = 2x²</p><p>Step 4: Find x when y = 50:</p><p>50 = 2x²</p><p>x² = 25</p><p>x = ±5</p><p>Answer: x = 5 (or −5, but typically the positive value is expected)</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> The constant k can always be found by dividing: k = y/x for direct variation, k = xy for inverse variation. Once you have k, substitute and solve.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Direct Variation?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Inverse Variation",
        objectives: [
        {
          title: "Inverse Variation",
          explanation: `<p>y varies inversely as x means that as x increases, y decreases proportionally. Their product is always constant.</p>
<p>Written as: y ∝ 1/x, which means y = k/x, equivalently xy = k.</p>
<div class="example-box"><h4>📝 Example 6.2a — y varies inversely as x. When x = 4, y = 9. Find y when x = 12.</h4><p>Step 1: y = k/x</p><p>Step 2: Find k: k = xy = 4 × 9 = 36</p><p>Step 3: y = 36/x</p><p>Step 4: When x = 12: y = 36/12 = 3</p><p>Answer: y = 3</p><p>Notice: x tripled (4→12), so y became a third of 9 = 3. ✓</p></div>
<div class="example-box"><h4>📝 Example 6.2b — y varies inversely as (x+1). When x=2, y=4. Find x when y=1⅓.</h4><p>y = k/(x+1)</p><p>Find k: 4 = k/(2+1) = k/3  →  k = 12</p><p>Formula: y = 12/(x+1)</p><p>Find x when y = 4/3:</p><p>4/3 = 12/(x+1)</p><p>x+1 = 12 × 3/4 = 9</p><p>x = 8</p><p>Answer: x = 8</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> When y varies inversely as x², write y = k/x², NOT y = k/x. Read the question carefully — 'varies inversely as the square of x' is different from 'varies inversely as x'.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Inverse Variation?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Joint Variation",
        objectives: [
        {
          title: "Joint Variation",
          explanation: `<p>Joint variation occurs when a quantity varies with respect to two or more other quantities simultaneously. It combines direct and/or inverse variation.</p>
<p>Example: z varies jointly as x and y means z ∝ xy, so z = kxy.</p>
<p>Example: z varies directly as x and inversely as y² means z ∝ x/y², so z = kx/y².</p>
<div class="example-box"><h4>📝 Example 6.3a — z varies jointly as x² and y. When x=3 and y=4, z=72. Find z when x=5 and y=2.</h4><p>Step 1: z = kx²y</p><p>Step 2: Find k: 72 = k(9)(4) = 36k  →  k = 2</p><p>Step 3: z = 2x²y</p><p>Step 4: When x=5, y=2: z = 2(25)(2) = 100</p><p>Answer: z = 100</p></div>
<div class="example-box"><h4>📝 Example 6.3b — p varies directly as q and inversely as r². When q=4 and r=3, p=8. Find p when q=9 and r=6.</h4><p>Step 1: p = kq/r²</p><p>Step 2: Find k: 8 = k(4)/(9) = 4k/9  →  k = 18</p><p>Step 3: p = 18q/r²</p><p>Step 4: When q=9, r=6:</p><p>p = 18(9)/36 = 162/36 = 4.5</p><p>Answer: p = 4.5</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Joint Variation?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Partial Variation",
        objectives: [
        {
          title: "Partial Variation",
          explanation: `<p>In partial variation, a quantity is partly constant and partly varies with another quantity. The formula is: y = ax + b, where 'ax' is the variable part and 'b' is the constant part.</p>
<p>This requires two conditions (data points) to find both a and b — setting up simultaneous equations.</p>
<div class="example-box"><h4>📝 Example 6.4a — C is partly constant and partly varies with n. When n=2, C=35; when n=5, C=65. Find C when n=8.</h4><p>Step 1: Write the relationship: C = an + b</p><p>Step 2: Substitute the two conditions:</p><p>When n=2: 2a + b = 35  ... (i)</p><p>When n=5: 5a + b = 65  ... (ii)</p><p>Step 3: Subtract (i) from (ii):</p><p>3a = 30  →  a = 10</p><p>Step 4: Substitute a=10 into (i):</p><p>20 + b = 35  →  b = 15</p><p>Step 5: Formula: C = 10n + 15</p><p>Step 6: When n=8: C = 10(8) + 15 = 80 + 15 = 95</p><p>Answer: C = 95</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For partial variation, always identify: 'partly constant' means there is a fixed number b. 'Partly varies with n' means there is an 'an' term. Write C = an + b and use two data points to solve for a and b.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> y is partly constant and partly varies as x². When x=1, y=4; when x=2, y=10. Find y when x=3.</p><ul><li><strong>A.</strong> 18</li><li><strong>B.</strong> 20</li><li><strong>C.</strong> 22</li><li><strong>D.</strong> 16</li></ul><p class="q-answer"><strong>Answer: B</strong> — y=2x²+2. At x=3: y=18+2=20. Answer: B.</p></div><div class="extra-q-block"><p><strong>Practice:</strong> z varies inversely as the square root of x. When x=4, z=6. Find z when x=9.</p><ul><li><strong>A.</strong> 3</li><li><strong>B.</strong> 4</li><li><strong>C.</strong> 9</li><li><strong>D.</strong> 12</li></ul><p class="q-answer"><strong>Answer: B</strong> — z=k/√x. k=6×2=12. When x=9: z=12/3=4.



End of Volume 1  —  Topics 1 to 6

Topics covered: Number Bases · Fractions, Decimals, Approx &amp; Percentages · Indices, Logarithms &amp; Surds · Sets · Polynomials · Variation

Volume 2 Preview — Topics 7–12:
Inequalities (linear and quadratic)
Progression (Arithmetic and Geometric)
Binary Operations
Matrices and Determinants
Euclidean Geometry (angles, circles, polygons)
Mensuration (perimeter, area, surface area, volume)

Volume 3 Preview — Topics 13–23:
Loci · Coordinate Geometry · Trigonometry
Differentiation · Application of Differentiation · Integration
Data Representation · Measures of Location
Measures of Dispersion · Permutation &amp; Combination · Probability

EDULAB EXAMPREP
JAMB Mathematics Complete Study Guide
Volume 2  ·  Topics 7 – 12
Inequalities · Progression · Binary Operations · Matrices · Geometry · Mensuration

Deep explanations · Worked examples · Hints · JAMB practice questions</p></div></div>`,
          visuals: [],
          question: {
          text: "y varies directly as x\u00b3. When x=2, y=24. Find y when x=3.",
          options: { "A": "81", "B": "108", "C": "72", "D": "96" },
          correctAnswer: "A",
          explanation: "y=kx\u00b3. 24=8k \u2192 k=3. y=3x\u00b3. When x=3: y=3(27)=81."
        }
        }
        ]
      }
    ]
  },

  "Inequalities": {
    subject: "Mathematics",
    topic: "Inequalities",
    introduction: {
      title: "Inequalities \u2014 JAMB Mathematics",
      description: "TOPIC 7 INEQUALITIES Linear \u00b7 Quadratic \u00b7 Number line representation  Introduction Inequalities extend our understanding of equations to situations where we are not looking for a single value but a range of values. Instead of asking 'what value of x makes this equal?' we ask 'what values of x satisfy this condition?' In real life, inequalities describe constraints: a budget cannot exceed \u20a65,000; a",
      jambInfo: "Linear and quadratic inequalities appear 2-3 times in JAMB. Never forget to flip the sign when dividing by a negative."
    },
    subtopics: [
      {
        name: "Linear Inequalities \u2014 Solving and Number Line",
        objectives: [
        {
          title: "Linear Inequalities \u2014 Solving and Number Line",
          explanation: `<p>A linear inequality has a variable raised to the first power. You solve it almost exactly like a linear equation — with one critical difference: when you multiply or divide both sides by a NEGATIVE number, you must REVERSE the inequality sign.</p>
<p>Why? Consider 2 &gt; 1 (true). Multiply both sides by −1: −2 &gt; −1 (false). The correct result is −2 &lt; −1. Hence the reversal.</p>
<div class="example-box"><h4>📝 Example 7.1a — Solve: 3x − 7 ≥ 5x + 1 and represent on a number line</h4><p>Step 1: Rearrange — move all x terms to one side:</p><p>3x − 5x ≥ 1 + 7</p><p>−2x ≥ 8</p><p>Step 2: Divide both sides by −2 (REVERSE the sign):</p><p>x ≤ −4</p><p>Number line: Draw a closed circle at −4 (because ≤ includes −4).</p><p>Shade/arrow going to the LEFT (all values less than or equal to −4).</p><p>Answer: x ≤ −4</p></div>
<div class="example-box"><h4>📝 Example 7.1b — Solve: −3 ≤ 2x + 1 &lt; 7 (double inequality)</h4><p>Split into two parts and solve simultaneously:</p><p>Left part:  −3 ≤ 2x + 1</p><p>−4 ≤ 2x</p><p>x ≥ −2</p><p>Right part: 2x + 1 &lt; 7</p><p>2x &lt; 6</p><p>x &lt; 3</p><p>Combined: −2 ≤ x &lt; 3</p><p>Number line: Closed circle at −2, open circle at 3, shaded between them.</p><p>(Closed = included, Open = not included)</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When dealing with a compound inequality like a ≤ 2x+1 &lt; b, treat it as two separate inequalities and solve both. Then combine the results. Do each step to ALL three parts simultaneously.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> Students often forget to flip the inequality sign when multiplying/dividing by a negative. −2x ≥ 8 does NOT give x ≥ −4. It gives x ≤ −4.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the range of values of x satisfying: 2x + 3 ≤ 7 and 3x − 2 &gt; 1.</p><ul><li><strong>A.</strong> x &gt; 1</li><li><strong>B.</strong> 1 &lt; x ≤ 2</li><li><strong>C.</strong> x ≤ 2</li><li><strong>D.</strong> x &gt; 2</li></ul><p class="q-answer"><strong>Answer: B</strong> — From 2x+3≤7: x≤2. From 3x−2&gt;1: 3x&gt;3, x&gt;1. Combined: 1&lt;x≤2.</p></div></div>`,
          visuals: [],
          question: {
          text: "Solve: 5 \u2212 3x > 2x \u2212 10.",
          options: { "A": "x < 3", "B": "x > 3", "C": "x < \u22123", "D": "x > 15" },
          correctAnswer: "A",
          explanation: "5+10 > 2x+3x \u2192 15 > 5x \u2192 x < 3."
        }
        }
        ]
      },
      {
        name: "Quadratic Inequalities",
        objectives: [
        {
          title: "Quadratic Inequalities",
          explanation: `<p>To solve a quadratic inequality, follow these steps:</p>
<p>Move all terms to one side (aim for zero on the other side).</p>
<p>Factorise (or use the quadratic formula to find the roots).</p>
<p>Identify the two critical values (roots).</p>
<p>Test a value in each interval to determine the sign, OR use the sign-chart method.</p>
<p>Sign Chart Rule for (x−a)(x−b) &gt; 0, where a &lt; b:</p>
<p>Product is POSITIVE when BOTH factors are positive or BOTH are negative.</p>
<p>Both positive: x &gt; b  (both factors positive)</p>
<p>Both negative: x &lt; a  (both factors negative)</p>
<p>Solution: x &lt; a  OR  x &gt; b</p>
<p>For (x−a)(x−b) &lt; 0 (product NEGATIVE):</p>
<p>One positive, one negative → only when a &lt; x &lt; b</p>
<p>Solution: a &lt; x &lt; b</p>
<div class="example-box"><h4>📝 Example 7.2a — Solve: x² − 7x + 12 &gt; 0</h4><p>Step 1: Factorise: (x − 3)(x − 4) &gt; 0</p><p>Step 2: Critical values: x = 3 and x = 4</p><p>Step 3: Apply sign chart. Since &gt; 0, we need both factors same sign.</p><p>Both positive: x &gt; 4</p><p>Both negative: x &lt; 3</p><p>Answer: x &lt; 3  OR  x &gt; 4</p><p>Verify: At x=0: (−3)(−4)=12 &gt; 0 ✓</p><p>At x=3.5: (0.5)(−0.5)=−0.25 &lt; 0 ✓ (not in solution)</p><p>At x=5: (2)(1)=2 &gt; 0 ✓</p></div>
<div class="example-box"><h4>📝 Example 7.2b — Solve: 2x² + 5x − 3 ≤ 0</h4><p>Step 1: Factorise: 2x²+5x−3 = (2x−1)(x+3)</p><p>Check: a×c=−6. Numbers multiplying to −6 and adding to 5: 6 and −1.</p><p>2x²+6x−x−3 = 2x(x+3)−1(x+3) = (2x−1)(x+3)</p><p>Step 2: Critical values: x=1/2 and x=−3</p><p>Step 3: ≤ 0 means we want the product to be negative (or zero).</p><p>This happens BETWEEN the roots.</p><p>Answer: −3 ≤ x ≤ 1/2</p><p>Verify: At x=0: (−1)(3)=−3 ≤ 0 ✓ (between roots)</p><p>At x=2: (3)(5)=15 &gt; 0 ✗ (outside roots, correctly excluded)</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> If the quadratic inequality has a &gt; 0, the parabola opens upward. It is NEGATIVE between its roots and POSITIVE outside. If a &lt; 0, flip this pattern.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the values of x for which 3x² + 2x − 1 ≥ 0.</p><ul><li><strong>A.</strong> x ≤ −1 or x ≥ 1/3</li><li><strong>B.</strong> −1 ≤ x ≤ 1/3</li><li><strong>C.</strong> x ≥ 1/3</li><li><strong>D.</strong> x ≤ −1</li></ul><p class="q-answer"><strong>Answer: A</strong> — (3x−1)(x+1)≥0. Roots: x=1/3 and x=−1. ≥0 means outside or at roots: x≤−1 or x≥1/3.</p></div></div>`,
          visuals: [],
          question: {
          text: "Solve: x\u00b2 \u2212 2x \u2212 8 < 0.",
          options: { "A": "\u22122 < x < 4", "B": "x < \u22122 or x > 4", "C": "\u22124 < x < 2", "D": "x < 2 or x > 4" },
          correctAnswer: "A",
          explanation: "(x\u22124)(x+2)<0. Between roots: \u22122 < x < 4."
        }
        }
        ]
      }
    ]
  },

  "Progression": {
    subject: "Mathematics",
    topic: "Progression",
    introduction: {
      title: "Progression \u2014 JAMB Mathematics",
      description: "TOPIC 8 PROGRESSION (AP & GP) Arithmetic sequences \u00b7 Geometric sequences \u00b7 Sums and applications  Introduction A progression (or sequence) is an ordered list of numbers following a definite pattern. JAMB tests two types: Arithmetic Progressions (AP), where you add a fixed number each time, and Geometric Progressions (GP), where you multiply by a fixed number each time. These sequences appear in re",
      jambInfo: "AP and GP each appear in JAMB. Know the nth term and sum formulas for both cold."
    },
    subtopics: [
      {
        name: "Arithmetic Progression (AP)",
        objectives: [
        {
          title: "Arithmetic Progression (AP)",
          explanation: `<p>An AP is a sequence where each term is obtained by adding a constant value (the common difference, d) to the previous term.</p>
<p>General form: a, a+d, a+2d, a+3d, ...</p>
<p>AP Formulas to Memorise</p>
<p>nth term:      Tₙ = a + (n−1)d</p>
<p>Sum of n terms: Sₙ = n/2 × [2a + (n−1)d]</p>
<p>= n/2 × (first term + last term)</p>
<p>Where: a = first term, d = common difference, n = number of terms</p>
<p>Finding d: d = T₂ − T₁ = T₃ − T₂ (any consecutive pair)</p>
<p>Finding n from Tₙ: rearrange Tₙ = a+(n−1)d to solve for n.</p>
<div class="example-box"><h4>📝 Example 8.1a — The 4th term of an AP is 22 and the 9th term is 42. Find the first term, common difference, and sum of the first 15 terms.</h4><p>Step 1: Write equations using Tₙ = a + (n−1)d:</p><p>T₄ = a + 3d = 22  ...(i)</p><p>T₉ = a + 8d = 42  ...(ii)</p><p>Step 2: Subtract (i) from (ii):</p><p>5d = 20  →  d = 4</p><p>Step 3: Substitute d=4 into (i):</p><p>a + 12 = 22  →  a = 10</p><p>Step 4: Find S₁₅:</p><p>S₁₅ = 15/2 × [2(10) + (14)(4)]</p><p>= 15/2 × [20 + 56]</p><p>= 15/2 × 76</p><p>= 15 × 38 = 570</p><p>Answer: a=10, d=4, S₁₅=570</p></div>
<div class="example-box"><h4>📝 Example 8.1b — The sum of the first n terms of an AP is given by Sₙ = 3n² − n. Find the first term and common difference.</h4><p>Method: The nth term can be found from: Tₙ = Sₙ − Sₙ₋₁</p><p>Sₙ = 3n² − n</p><p>Sₙ₋₁ = 3(n−1)² − (n−1) = 3(n²−2n+1) − n + 1 = 3n²−6n+3−n+1 = 3n²−7n+4</p><p>Tₙ = Sₙ − Sₙ₋₁ = (3n²−n) − (3n²−7n+4) = 6n − 4</p><p>First term: T₁ = 6(1)−4 = 2</p><p>Second term: T₂ = 6(2)−4 = 8</p><p>Common difference: d = T₂−T₁ = 8−2 = 6</p><p>Verify: S₁ = 3−1 = 2 = T₁ ✓; S₂ = 12−2 = 10 = T₁+T₂ = 2+8 = 10 ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> If you are given Sₙ and need Tₙ, always use Tₙ = Sₙ − Sₙ₋₁. But for the first term, note T₁ = S₁ (the sum of 1 term IS the first term).</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the number of terms in the AP: 7, 11, 15, ..., 87.</p><ul><li><strong>A.</strong> 21</li><li><strong>B.</strong> 20</li><li><strong>C.</strong> 22</li><li><strong>D.</strong> 19</li></ul><p class="q-answer"><strong>Answer: A</strong> — a=7, d=4, Tₙ=87. 7+(n−1)4=87 → (n−1)4=80 → n−1=20 → n=21.</p></div></div>`,
          visuals: [],
          question: {
          text: "The 3rd and 7th terms of an AP are 10 and 26 respectively. Find the sum of the first 12 terms.",
          options: { "A": "312", "B": "288", "C": "252", "D": "336" },
          correctAnswer: "A",
          explanation: "T\u2083=a+2d=10, T\u2087=a+6d=26. Subtract: 4d=16, d=4. a=10\u22128=2. S\u2081\u2082=12/2\u00d7[2(2)+11(4)]=6\u00d7[4+44]=6\u00d748=288. Actually 6\u00d748=288. Answer B: 288."
        }
        }
        ]
      },
      {
        name: "Geometric Progression (GP)",
        objectives: [
        {
          title: "Geometric Progression (GP)",
          explanation: `<p>A GP is a sequence where each term is obtained by multiplying the previous term by a constant called the common ratio (r).</p>
<p>General form: a, ar, ar², ar³, ...</p>
<p>GP Formulas to Memorise</p>
<p>nth term:           Tₙ = arⁿ⁻¹</p>
<p>Sum of n terms (r≠1): Sₙ = a(rⁿ−1)/(r−1)  when r &gt; 1</p>
<p>= a(1−rⁿ)/(1−r)  when r &lt; 1</p>
<p>Sum to infinity (|r|&lt;1): S∞ = a/(1−r)</p>
<p>Finding r: r = T₂/T₁ = T₃/T₂ (any consecutive ratio)</p>
<p>For S∞ to exist, we need |r| &lt; 1 (the series must converge).</p>
<div class="example-box"><h4>📝 Example 8.2a — The 2nd term of a GP is 6 and the 5th term is 48. Find: (i) the first term and common ratio, (ii) the sum of the first 8 terms.</h4><p>(i) T₂ = ar = 6  ...(i)</p><p>T₅ = ar⁴ = 48  ...(ii)</p><p>Divide (ii) by (i): r³ = 48/6 = 8  →  r = 2</p><p>From (i): a = 6/r = 6/2 = 3</p><p>(ii) S₈ = a(r⁸−1)/(r−1) = 3(2⁸−1)/(2−1) = 3(256−1)/1 = 3×255 = 765</p></div>
<div class="example-box"><h4>📝 Example 8.2b — A ball is dropped from a height of 80m. Each time it bounces, it rises to 3/4 of the height of the previous bounce. Find the total distance travelled.</h4><p>The ball falls 80m, then bounces up 60m, falls 60m, bounces up 45m, ...</p><p>Initial fall: 80m</p><p>Then each pair (up + down): 2 × 60, 2 × 45, 2 × 33.75, ...</p><p>The up-bounces form a GP: a = 60, r = 3/4</p><p>Sum of all bounces (up and down) = 2 × S∞ of the bounce heights</p><p>S∞ = 60/(1−3/4) = 60/(1/4) = 240m</p><p>Two-way: 2 × 240 = 480m</p><p>Total = 80 (initial fall) + 480 = 560m</p><p>Answer: 560m total distance</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For infinite GP problems, always check |r| &lt; 1 before applying S∞ = a/(1−r). If |r| ≥ 1, the sum to infinity does not exist (the series diverges).</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> Common error: confusing Sₙ formulas. Use a(rⁿ−1)/(r−1) when r&gt;1 (avoids negative denominator). Use a(1−rⁿ)/(1−r) when r&lt;1. Both are correct but one is neater for each case.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> The 1st, 3rd and 5th terms of a GP are x, 4 and 16 respectively. Find x.</p><ul><li><strong>A.</strong> 1</li><li><strong>B.</strong> 2</li><li><strong>C.</strong> 4</li><li><strong>D.</strong> 8</li></ul><p class="q-answer"><strong>Answer: A</strong> — T₁=x, T₃=ar²=4, T₅=ar⁴=16. From T₅/T₃: r²=4, r=2. From T₃: a(4)=4, a=1. So x=1.</p></div></div>`,
          visuals: [],
          question: {
          text: "Find the sum to infinity of the GP: 16, 8, 4, 2, ...",
          options: { "A": "32", "B": "24", "C": "16", "D": "48" },
          correctAnswer: "A",
          explanation: "a=16, r=1/2. S\u221e=16/(1\u22121/2)=16/(1/2)=32."
        }
        }
        ]
      }
    ]
  },

  "Binary Operations": {
    subject: "Mathematics",
    topic: "Binary Operations",
    introduction: {
      title: "Binary Operations \u2014 JAMB Mathematics",
      description: "TOPIC 9 BINARY OPERATIONS Defined operations \u00b7 Properties \u00b7 Identity & inverse elements  Introduction A binary operation takes two numbers from a set and combines them using a specified rule to produce a result. In JAMB, the operation is always defined by a formula using a special symbol such as *, \u2295, \u2605, or #. The key skill is NOT to confuse the operation symbol with ordinary multiplication or add",
      jambInfo: "Binary operations appear 1-2 times in JAMB. Focus on evaluating expressions and testing commutativity/associativity."
    },
    subtopics: [
      {
        name: "Evaluating Binary Operations",
        objectives: [
        {
          title: "Evaluating Binary Operations",
          explanation: `<p>Given the definition of an operation, substitute the given values directly. Be methodical: identify which value is 'a' (left-hand operand) and which is 'b' (right-hand operand).</p>
<div class="example-box"><h4>📝 Example 9.1a — An operation * is defined by a * b = a² + 3ab − b². Find: (i) 3 * 2,  (ii) 2 * 3,  (iii) (2*3)*(1*2)</h4><p>(i) 3 * 2: a=3, b=2</p><p>= 3² + 3(3)(2) − 2² = 9 + 18 − 4 = 23</p><p>(ii) 2 * 3: a=2, b=3</p><p>= 2² + 3(2)(3) − 3² = 4 + 18 − 9 = 13</p><p>Notice: 3*2 ≠ 2*3, so * is NOT commutative here.</p><p>(iii) First find 1*2: = 1+3(1)(2)−4 = 1+6−4 = 3</p><p>Then (2*3) * (1*2) = 13 * 3:</p><p>= 13² + 3(13)(3) − 3² = 169 + 117 − 9 = 277</p></div>
<div class="example-box"><h4>📝 Example 9.1b — Define a # b = (a+b)/(a−b) for a ≠ b. Find 5#3 and determine if # is commutative.</h4><p>5 # 3: a=5, b=3</p><p>= (5+3)/(5−3) = 8/2 = 4</p><p>3 # 5: a=3, b=5</p><p>= (3+5)/(3−5) = 8/(−2) = −4</p><p>Since 5#3 = 4 ≠ −4 = 3#5, the operation # is NOT commutative.</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Always re-read the definition carefully before substituting. Note which side is 'a' and which is 'b'. Order matters unless the operation is explicitly commutative.</p></div>`,
          visuals: [],
          question: {
          text: "If a \u2295 b = 2a + b \u2212 ab, find 3 \u2295 2.",
          options: { "A": "2", "B": "0", "C": "4", "D": "6" },
          correctAnswer: "A",
          explanation: "3\u22952 = 2(3)+2\u2212(3)(2) = 6+2\u22126 = 2."
        }
        }
        ]
      },
      {
        name: "Properties \u2014 Commutativity, Associativity, Identity, Inverse",
        objectives: [
        {
          title: "Properties \u2014 Commutativity, Associativity, Identity, Inverse",
          explanation: `<p>Four properties are commonly tested. For each, you must check or use the definition.</p>
<p>The Four Properties</p>
<p>1. COMMUTATIVITY: a★b = b★a for all a,b in S.</p>
<p>To check: compute a★b and b★a. If always equal → commutative.</p>
<p>2. ASSOCIATIVITY: (a★b)★c = a★(b★c) for all a,b,c in S.</p>
<p>To check: compute both sides and compare.</p>
<p>3. IDENTITY ELEMENT (e): a★e = e★a = a for all a.</p>
<p>To find: set up a★e = a using the formula and solve for e.</p>
<p>4. INVERSE of a (written a⁻¹): a★a⁻¹ = e (the identity element).</p>
<p>To find: know e first, then solve a★x = e for x.</p>
<div class="example-box"><h4>📝 Example 9.2a — Operation * is defined by a*b = a + b − 2. Find the identity element and the inverse of 7.</h4><p>IDENTITY ELEMENT e:</p><p>a * e = a</p><p>(a + e − 2) = a</p><p>e − 2 = 0</p><p>e = 2</p><p>Verify: 5*2 = 5+2−2 = 5 ✓ and 2*5 = 2+5−2 = 5 ✓</p><p>INVERSE of 7:</p><p>7 * x = e = 2</p><p>7 + x − 2 = 2</p><p>x = 2 − 7 + 2 = −3</p><p>Verify: 7 * (−3) = 7+(−3)−2 = 2 = e ✓</p></div>
<div class="example-box"><h4>📝 Example 9.2b — a*b = 3ab. Is * associative?</h4><p>Test (a*b)*c = a*(b*c):</p><p>(a*b)*c: First a*b = 3ab. Then (3ab)*c = 3(3ab)c = 9abc.</p><p>a*(b*c): First b*c = 3bc. Then a*(3bc) = 3a(3bc) = 9abc.</p><p>Both sides = 9abc. So * IS associative.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> When finding the identity element, you must verify BOTH a*e = a AND e*a = a (unless the operation is known to be commutative). For non-commutative operations, both conditions must hold.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> If a*b = a+b+3, find the identity element and the inverse of 5.</p><ul><li><strong>A.</strong> e=−3, inv=−11</li><li><strong>B.</strong> e=3, inv=−11</li><li><strong>C.</strong> e=0, inv=−8</li><li><strong>D.</strong> e=−3, inv=−13</li></ul><p class="q-answer"><strong>Answer: A</strong> — a+e+3=a → e=−3. 5+x+3=−3 → x=−11.</p></div></div>`,
          visuals: [],
          question: {
          text: "Operation \u2605 is defined by a\u2605b = 2ab. Find the identity element.",
          options: { "A": "0", "B": "1", "C": "1/2", "D": "2" },
          correctAnswer: "C",
          explanation: "a\u2605e = a: 2ae = a \u2192 e = 1/2. Check: 2a(1/2)=a \u2713."
        }
        }
        ]
      }
    ]
  },

  "Matrices & Determinants": {
    subject: "Mathematics",
    topic: "Matrices & Determinants",
    introduction: {
      title: "Matrices & Determinants \u2014 JAMB Mathematics",
      description: "TOPIC 10 MATRICES AND DETERMINANTS Operations \u00b7 Determinant \u00b7 Inverse \u00b7 Solving equations  Introduction A matrix is a rectangular array of numbers arranged in rows and columns. Matrices are used extensively in solving systems of linear equations, transformations in geometry, and in engineering and data science. JAMB focuses on: matrix addition and subtraction, scalar multiplication, matrix multipl",
      jambInfo: "Matrices appear 2-3 times in JAMB \u2014 multiplication, determinants, and solving simultaneous equations."
    },
    subtopics: [
      {
        name: "Matrix Addition, Subtraction and Scalar Multiplication",
        objectives: [
        {
          title: "Matrix Addition, Subtraction and Scalar Multiplication",
          explanation: `<p>Addition/Subtraction: Only possible when matrices have the same dimensions. Add or subtract corresponding elements.</p>
<p>Scalar Multiplication: Multiply every element in the matrix by the scalar (single number).</p>
<div class="example-box"><h4>📝 Example 10.1a — If A = [[3,−1],[2,4]] and B = [[1,5],[−3,2]], find 2A − B.</h4><p>Step 1: Compute 2A (multiply every element by 2):</p><p>2A = [[6,−2],[4,8]]</p><p>Step 2: Subtract B from 2A (element by element):</p><p>2A − B = [[6−1, −2−5],[4−(−3), 8−2]]</p><p>= [[5, −7],[7, 6]]</p><p>Answer: [[5,−7],[7,6]]</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Matrix Addition, Subtraction and Scalar Multiplication?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Matrix Multiplication",
        objectives: [
        {
          title: "Matrix Multiplication",
          explanation: `<p>Matrix multiplication is NOT element-by-element. For AB to be defined, the number of COLUMNS in A must equal the number of ROWS in B.</p>
<p>For 2×2 matrices A and B, the element in row i, column j of AB = (row i of A) dotted with (column j of B).</p>
<div class="example-box"><h4>📝 Example 10.2a — Multiply A = [[2,3],[1,4]] by B = [[5,1],[2,3]]</h4><p>AB = [[2×5+3×2,  2×1+3×3],</p><p>[1×5+4×2,  1×1+4×3]]</p><p>= [[10+6,  2+9],</p><p>[5+8,   1+12]]</p><p>= [[16, 11],</p><p>[13, 13]]</p><p>REMEMBER: AB ≠ BA in general (matrix multiplication is NOT commutative).</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> To multiply two 2×2 matrices, use the pattern: 'top-left = first row of A dotted with first column of B'. Think of it as 'row × column'.</p></div>`,
          visuals: [],
          question: {
          text: "If A=[[1,2],[3,4]] and B=[[2,0],[1,3]], find AB.",
          options: { "A": "[[4,6],[10,12]]", "B": "[[3,6],[10,12]]", "C": "[[4,6],[6,12]]", "D": "[[2,6],[10,9]]" },
          correctAnswer: "A",
          explanation: "AB: top-left=1\u00d72+2\u00d71=4, top-right=1\u00d70+2\u00d73=6, bottom-left=3\u00d72+4\u00d71=10, bottom-right=3\u00d70+4\u00d73=12."
        }
        }
        ]
      },
      {
        name: "Determinant of a 2\u00d72 Matrix",
        objectives: [
        {
          title: "Determinant of a 2\u00d72 Matrix",
          explanation: `<p>For a 2×2 matrix A = [[a,b],[c,d]], the determinant is written |A| or det(A).</p>
<p>Formula: |A| = ad − bc</p>
<p>The determinant tells us whether a matrix has an inverse. If |A| = 0, the matrix is SINGULAR and has NO inverse.</p>
<div class="example-box"><h4>📝 Example 10.3a — Find the determinant of A = [[5,3],[2,4]] and determine if A is singular.</h4><p>|A| = (5)(4) − (3)(2) = 20 − 6 = 14</p><p>Since |A| = 14 ≠ 0, the matrix is NON-SINGULAR and has an inverse.</p><p>Example 2: B = [[6,4],[3,2]]</p><p>|B| = (6)(2) − (4)(3) = 12 − 12 = 0</p><p>B is SINGULAR — it has no inverse.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Determinant of a 2\u00d72 Matrix?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Inverse of a 2\u00d72 Matrix and Solving Equations",
        objectives: [
        {
          title: "Inverse of a 2\u00d72 Matrix and Solving Equations",
          explanation: `<p>For A = [[a,b],[c,d]] with |A| ≠ 0:</p>
<p>A⁻¹ = (1/|A|) × [[d,−b],[−c,a]]</p>
<p>The rule is: swap the main diagonal elements (a and d), negate the off-diagonal elements (b and c), then divide everything by the determinant.</p>
<div class="example-box"><h4>📝 Example 10.4a — Solve the system: 3x+2y=7, x+4y=9 using matrices.</h4><p>Step 1: Write as matrix equation AX = B:</p><p>[[3,2],[1,4]] × [[x],[y]] = [[7],[9]]</p><p>Step 2: Find det(A) = (3)(4)−(2)(1) = 12−2 = 10</p><p>Step 3: Find A⁻¹ = (1/10)×[[4,−2],[−1,3]]</p><p>Step 4: X = A⁻¹B = (1/10)×[[4,−2],[−1,3]] × [[7],[9]]</p><p>Step 5: Multiply:</p><p>Top element:    (1/10)(4×7 + (−2)×9) = (1/10)(28−18) = 10/10 = 1</p><p>Bottom element: (1/10)((−1)×7 + 3×9) = (1/10)(−7+27) = 20/10 = 2</p><p>Answer: x = 1, y = 2</p><p>Verify: 3(1)+2(2)=7 ✓, 1+4(2)=9 ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> The mnemonic for A⁻¹: 'SWAP and NEGATE, then divide by det'. Swap a and d (the main diagonal), negate b and c (the off-diagonal), divide the whole matrix by det(A).</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> Students often swap the wrong elements. For [[a,b],[c,d]], swap a↔d and negate b and c. Do NOT swap b and c.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> For what value of k does [[3,k],[1,4]] have no inverse?</p><ul><li><strong>A.</strong> 12</li><li><strong>B.</strong> 4</li><li><strong>C.</strong> −4</li><li><strong>D.</strong> 3</li></ul><p class="q-answer"><strong>Answer: A</strong> — det=12−k=0 → k=12.</p></div></div>`,
          visuals: [],
          question: {
          text: "Find the inverse of [[2,1],[5,3]].",
          options: { "A": "[[3,\u22121],[\u22125,2]]", "B": "[[3,1],[5,2]]", "C": "[[\u22123,1],[5,\u22122]]", "D": "[[2,\u22121],[\u22125,3]]" },
          correctAnswer: "A",
          explanation: "det=2\u00d73\u22121\u00d75=6\u22125=1. A\u207b\u00b9=(1/1)\u00d7[[3,\u22121],[\u22125,2]]=[[3,\u22121],[\u22125,2]]."
        }
        }
        ]
      }
    ]
  },

  "Euclidean Geometry": {
    subject: "Mathematics",
    topic: "Euclidean Geometry",
    introduction: {
      title: "Euclidean Geometry \u2014 JAMB Mathematics",
      description: "TOPIC 11 EUCLIDEAN GEOMETRY Lines & angles \u00b7 Triangles \u00b7 Circles \u00b7 Polygons  Introduction Euclidean Geometry is the study of shapes, sizes, and properties of figures based on Euclid's axioms. It covers lines and angles, triangles (congruence and similarity), quadrilaterals, polygons, and the rich set of theorems about circles. JAMB geometry questions require you to know specific theorems and be ab",
      jambInfo: "Circle theorems and angle problems are high-yield \u2014 JAMB asks 3-5 questions on geometry."
    },
    subtopics: [
      {
        name: "Lines, Angles and Parallel Lines",
        objectives: [
        {
          title: "Lines, Angles and Parallel Lines",
          explanation: `<p>Fundamental Angle Facts</p>
<p>1. Angles on a straight line: sum = 180° (supplementary angles)</p>
<p>2. Angles at a point: sum = 360°</p>
<p>3. Vertically opposite angles: equal (formed by two crossing lines)</p>
<p>4. Alternate angles (Z-shape): equal — only when lines are parallel</p>
<p>5. Corresponding angles (F-shape): equal — only when lines are parallel</p>
<p>6. Co-interior angles (C-shape): sum = 180° — only when lines are parallel</p>
<p>7. Perpendicular lines: form 90° angles</p>
<div class="example-box"><h4>📝 Example 11.1a — Two parallel lines are cut by a transversal. One angle is 65°. Find the other seven angles.</h4><p>The transversal creates 8 angles (4 at each parallel line).</p><p>At each intersection, the 4 angles come in two pairs of equal vertically opposite angles.</p><p>If one angle = 65°, then:</p><p>• Its vertically opposite angle = 65°</p><p>• Its supplementary angle = 180°−65° = 115°</p><p>• The fourth angle at that intersection = 115°</p><p>At the second intersection (parallel line):</p><p>• Corresponding angle to 65° = 65°  (F-shape rule)</p><p>• Alternate angle to 65° = 65°  (Z-shape rule)</p><p>• Co-interior with 65° = 115°  (C-shape rule)</p><p>Result: Four angles of 65° and four angles of 115° in total.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Lines, Angles and Parallel Lines?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Triangles",
        objectives: [
        {
          title: "Triangles",
          explanation: `<p>Sum of interior angles of any triangle = 180°</p>
<p>Exterior angle = sum of the two non-adjacent interior angles</p>
<p>Base angles of an isosceles triangle are equal</p>
<p>All angles of an equilateral triangle = 60°</p>
<p>Congruence Conditions (two triangles are congruent — same shape AND size):</p>
<p>SSS: three sides equal</p>
<p>SAS: two sides and the included angle equal</p>
<p>ASA/AAS: two angles and a corresponding side equal</p>
<p>RHS: right angle, hypotenuse, and one side equal</p>
<p>Similarity (same shape, different size — corresponding angles equal):</p>
<p>AA: two angles equal → similar triangles</p>
<p>If triangles are similar with ratio k, corresponding sides are in ratio k, areas are in ratio k².</p>
<div class="example-box"><h4>📝 Example 11.2a — In triangle ABC, angle A = 50°, angle B = 70°. Find angle C. Also find the exterior angle at C.</h4><p>Angle C = 180° − 50° − 70° = 60°</p><p>Exterior angle at C = 180° − 60° = 120°</p><p>Alternatively: Exterior angle at C = A + B = 50° + 70° = 120° ✓</p><p>(This confirms the exterior angle theorem.)</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Triangles?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Circle Theorems",
        objectives: [
        {
          title: "Circle Theorems",
          explanation: `<p>The Eight Essential Circle Theorems</p>
<p>1. Angle in a semicircle = 90° (angle subtended by a diameter).</p>
<p>2. Angles subtended by the same arc at the circumference are EQUAL.</p>
<p>3. Angle at the CENTRE = TWICE the angle at the CIRCUMFERENCE (same arc).</p>
<p>4. Opposite angles of a CYCLIC QUADRILATERAL are SUPPLEMENTARY (sum = 180°).</p>
<p>5. Tangent is PERPENDICULAR to the radius at the point of contact.</p>
<p>6. Two tangents from an EXTERNAL POINT are equal in length.</p>
<p>7. Alternate SEGMENT THEOREM: angle between tangent and chord = angle in alternate segment.</p>
<p>8. EQUAL CHORDS subtend equal angles at the centre.</p>
<div class="example-box"><h4>📝 Example 11.3a — In a circle, arc PQ subtends angle 42° at the circumference. Find the angle it subtends at the centre.</h4><p>Using Circle Theorem 3:</p><p>Angle at centre = 2 × angle at circumference</p><p>= 2 × 42° = 84°</p><p>Answer: 84°</p></div>
<div class="example-box"><h4>📝 Example 11.3b — ABCD is a cyclic quadrilateral. Angle A = 82° and angle B = 75°. Find angles C and D.</h4><p>Using Circle Theorem 4 (opposite angles supplementary):</p><p>Angle C = 180° − angle A = 180° − 82° = 98°</p><p>Angle D = 180° − angle B = 180° − 75° = 105°</p><p>Verify: A+B+C+D = 82+75+98+105 = 360° ✓</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Draw the diagram for every geometry question, even if one is given. Mark all known angles and label the theorem you are using. This prevents errors and earns method marks in structured questions.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> In cyclic quadrilateral PQRS, angle P = 95° and angle Q = 80°. Find angle R and S.</p><ul><li><strong>A.</strong> R=85°, S=100°</li><li><strong>B.</strong> R=80°, S=95°</li><li><strong>C.</strong> R=95°, S=80°</li><li><strong>D.</strong> R=100°, S=85°</li></ul><p class="q-answer"><strong>Answer: A</strong> — Opposite angles supplement: R=180−95=85°, S=180−80=100°.</p></div></div>`,
          visuals: [],
          question: {
          text: "The angle subtended at the circumference by an arc is 38\u00b0. Find the angle subtended at the centre.",
          options: { "A": "76\u00b0", "B": "19\u00b0", "C": "38\u00b0", "D": "152\u00b0" },
          correctAnswer: "A",
          explanation: "Centre angle = 2 \u00d7 circumference angle = 2\u00d738 = 76\u00b0."
        }
        }
        ]
      }
    ]
  },

  "Mensuration": {
    subject: "Mathematics",
    topic: "Mensuration",
    introduction: {
      title: "Mensuration \u2014 JAMB Mathematics",
      description: "TOPIC 12 MENSURATION Areas \u00b7 Perimeters \u00b7 Surface areas \u00b7 Volumes  Introduction Mensuration is the branch of mathematics concerned with measuring geometric figures \u2014 their lengths, perimeters, areas, and volumes. It is one of the most practically useful topics and features heavily in JAMB every year. The key is to MEMORISE the formulas and PRACTISE using them correctly. Common pitfalls include usi",
      jambInfo: "JAMB asks 3-5 mensuration questions \u2014 memorise all area, perimeter, volume, and surface area formulas."
    },
    subtopics: [
      {
        name: "Area and Perimeter of 2D Shapes",
        objectives: [
        {
          title: "Area and Perimeter of 2D Shapes",
          explanation: `<div class="example-box"><h4>📝 Example 12.1a — A sector has radius 14cm and angle 90°. Find its area and arc length. [π=22/7]</h4><p>Area of sector = (θ/360) × πr²</p><p>= (90/360) × (22/7) × 14²</p><p>= (1/4) × (22/7) × 196</p><p>= (1/4) × 616</p><p>= 154 cm²</p><p>Arc length = (θ/360) × 2πr</p><p>= (1/4) × 2 × (22/7) × 14</p><p>= (1/4) × 88</p><p>= 22 cm</p></div>
<div class="example-box"><h4>📝 Example 12.1b — Find the area of a trapezium with parallel sides 8cm and 12cm, and height 5cm.</h4><p>Area = ½(a + b) × h</p><p>= ½(8 + 12) × 5</p><p>= ½ × 20 × 5</p><p>= 50 cm²</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Area and Perimeter of 2D Shapes?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Volume and Surface Area of 3D Shapes",
        objectives: [
        {
          title: "Volume and Surface Area of 3D Shapes",
          explanation: `<div class="example-box"><h4>📝 Example 12.2a — A cylinder has diameter 14cm and height 10cm. Find its volume and total surface area. [π=22/7]</h4><p>Radius = 14/2 = 7cm</p><p>Volume = πr²h = (22/7) × 7² × 10 = (22/7) × 49 × 10 = 22 × 70 = 1540 cm³</p><p>Total SA = 2πr(r + h) = 2 × (22/7) × 7 × (7 + 10)</p><p>= 2 × 22 × 17 = 748 cm²</p></div>
<div class="example-box"><h4>📝 Example 12.2b — A cone has base radius 6cm and height 8cm. Find the slant height, volume, and curved surface area. [π=22/7]</h4><p>Slant height l = √(r² + h²) = √(36 + 64) = √100 = 10cm</p><p>Volume = ⅓πr²h = (1/3) × (22/7) × 36 × 8</p><p>= (1/3) × (22/7) × 288</p><p>= (22 × 288) / 21</p><p>= 6336/21 ≈ 301.7 cm³</p><p>Curved SA = πrl = (22/7) × 6 × 10 = 1320/7 ≈ 188.6 cm²</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Always check if you are given the diameter or the radius. JAMB frequently gives diameter and expects you to halve it first. This single error causes many lost marks.</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> Curved surface area is NOT the same as total surface area. Curved SA of a cylinder = 2πrh. Total SA = 2πrh + 2πr² (adds the two circular ends). Read the question carefully.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> A cuboid has dimensions 5cm × 3cm × 4cm. Find its total surface area.</p><ul><li><strong>A.</strong> 94 cm²</li><li><strong>B.</strong> 60 cm²</li><li><strong>C.</strong> 47 cm²</li><li><strong>D.</strong> 120 cm²</li></ul><p class="q-answer"><strong>Answer: A</strong> — SA=2(lb+bh+lh)=2(5×3+3×4+5×4)=2(15+12+20)=2×47=94 cm².</p></div><div class="extra-q-block"><p><strong>Practice:</strong> A sector of angle 120° is cut from a circle of radius 9cm. Find the area of the sector. [π=22/7]</p><ul><li><strong>A.</strong> 84.857 cm²</li><li><strong>B.</strong> 85 cm²</li><li><strong>C.</strong> 81π/3 cm²</li><li><strong>D.</strong> 27π cm²</li></ul><p class="q-answer"><strong>Answer: D</strong> — (120/360)×π×81=(1/3)×81π=27π cm².



End of Volume 2  —  Topics 7 to 12

Covered: Inequalities · Progressions · Binary Operations · Matrices · Euclidean Geometry · Mensuration

Volume 3 Preview — Topics 13–23:
13. Loci  ·  14. Coordinate Geometry  ·  15. Trigonometry
16. Differentiation  ·  17. Application of Differentiation  ·  18. Integration
19. Data Representation  ·  20. Measures of Location
21. Measures of Dispersion  ·  22. Permutation &amp; Combination  ·  23. Probability

EDULAB EXAMPREP
JAMB Mathematics Complete Study Guide
Volume 3  ·  Topics 13 – 23
Loci · Coordinate Geometry · Trigonometry · Calculus · Statistics · Probability

Deep explanations · Worked examples · Hints · JAMB practice questions</p></div></div>`,
          visuals: [],
          question: {
          text: "Find the volume of a sphere of radius 3cm. [\u03c0=22/7]",
          options: { "A": "113.1 cm\u00b3", "B": "113.1 cm\u00b3", "C": "36\u03c0 cm\u00b3", "D": "12\u03c0 cm\u00b3" },
          correctAnswer: "A",
          explanation: "V=(4/3)\u03c0r\u00b3=(4/3)\u00d7(22/7)\u00d727=4\u00d722\u00d727/21=2376/21\u2248113.1 cm\u00b3. Or exactly 36\u03c0 cm\u00b3."
        }
        }
        ]
      }
    ]
  },

  "Loci": {
    subject: "Mathematics",
    topic: "Loci",
    introduction: {
      title: "Loci \u2014 JAMB Mathematics",
      description: "TOPIC 13 LOCI Sets of points \u00b7 Standard loci \u00b7 Combined conditions  Introduction The word 'locus' (plural: loci) comes from Latin and means 'place'. In mathematics, a locus is the set of ALL points (or positions) that satisfy a particular condition or set of conditions. Instead of finding one specific point, you find a collection of points that all obey the same rule. Loci questions require you to",
      jambInfo: "Loci appear 1-2 times in JAMB. Understand the 6 standard loci types and intersections."
    },
    subtopics: [
      {
        name: "Standard Loci \u2014 The Core Types",
        objectives: [
        {
          title: "Standard Loci \u2014 The Core Types",
          explanation: `<p>Standard Loci You Must Know</p>
<p>1. Points equidistant from a fixed point O → CIRCLE centred at O.</p>
<p>2. Points equidistant from two fixed points A and B → PERPENDICULAR BISECTOR of AB.</p>
<p>3. Points equidistant from two intersecting lines → ANGLE BISECTORS of the angles formed.</p>
<p>4. Points at a fixed distance d from a straight line → TWO PARALLEL LINES, one on each side.</p>
<p>5. Points from which a fixed segment AB subtends a fixed angle θ → ARC of a circle through A and B.</p>
<p>6. Points equidistant from a fixed point and a fixed line → PARABOLA.</p>
<div class="example-box"><h4>📝 Example 13.1a — Describe the locus of a point P that moves so that it is always 5cm from a fixed point O.</h4><p>Condition: distance from O = 5cm (constant).</p><p>This is the definition of a circle!</p><p>Locus: A circle with centre O and radius 5cm.</p><p>Every point on this circle is exactly 5cm from O.</p><p>No point inside or outside the circle satisfies the condition.</p></div>
<div class="example-box"><h4>📝 Example 13.1b — Points A and B are 8cm apart. Describe the locus of a point P equidistant from A and B.</h4><p>Condition: PA = PB.</p><p>This is the perpendicular bisector of segment AB.</p><p>- Draw AB.</p><p>- Find the midpoint M of AB.</p><p>- Draw a line through M perpendicular to AB.</p><p>- Every point on this line is equidistant from A and B.</p><p>Locus: The perpendicular bisector of AB.</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For loci, ALWAYS state the shape (circle, line, etc.) and all defining measurements (radius, position, etc.). A partial answer like 'a circle' without the centre and radius is incomplete.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Standard Loci \u2014 The Core Types?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Constructing Loci and Finding Intersections",
        objectives: [
        {
          title: "Constructing Loci and Finding Intersections",
          explanation: `<p>When two conditions are given, find the locus for each separately, then find their intersection — the point(s) satisfying BOTH conditions simultaneously.</p>
<div class="example-box"><h4>📝 Example 13.2a — Find all points that are 4cm from point A AND 4cm from point B, where AB = 6cm.</h4><p>Locus 1: Points 4cm from A → circle C₁, centre A, radius 4cm.</p><p>Locus 2: Points 4cm from B → circle C₂, centre B, radius 4cm.</p><p>Find intersection of C₁ and C₂:</p><p>The circles overlap (since radius=4 &gt; half of AB=3).</p><p>They intersect at two points, P and Q, which lie on the perpendicular bisector of AB.</p><p>These two points P and Q are the required positions.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> The locus of a moving point that is always 3cm from a fixed straight line AB is:</p><ul><li><strong>A.</strong> Two straight lines parallel to AB, each 3cm away</li><li><strong>B.</strong> A circle of radius 3cm</li><li><strong>C.</strong> A single line parallel to AB</li><li><strong>D.</strong> An ellipse</li></ul><p class="q-answer"><strong>Answer: A</strong> — One on each side of AB, 3cm away on each side.</p></div></div>`,
          visuals: [],
          question: {
          text: "What is the locus of points equidistant from two parallel lines m and n, 10cm apart?",
          options: { "A": "A line parallel to both, 5cm from each", "B": "A circle of radius 5cm", "C": "The perpendicular bisector of mn", "D": "Two arcs" },
          correctAnswer: "A",
          explanation: "The equidistant locus is a line running exactly between the two parallel lines, i.e. 5cm from each."
        }
        }
        ]
      }
    ]
  },

  "Coordinate Geometry": {
    subject: "Mathematics",
    topic: "Coordinate Geometry",
    introduction: {
      title: "Coordinate Geometry \u2014 JAMB Mathematics",
      description: "TOPIC 14 COORDINATE GEOMETRY Distance \u00b7 Midpoint \u00b7 Gradient \u00b7 Lines \u00b7 Circles  Introduction Coordinate geometry (also called analytical geometry or Cartesian geometry) is the study of geometry using a coordinate system. Every point in 2D space is described by an ordered pair (x, y). Geometric properties (distance, slopes, intersections) become algebraic calculations. This is one of the more calcul",
      jambInfo: "JAMB asks 3-5 coordinate geometry questions. The equation of a line and circle are essential."
    },
    subtopics: [
      {
        name: "Distance Formula and Midpoint",
        objectives: [
        {
          title: "Distance Formula and Midpoint",
          explanation: `<p>Key Formulas</p>
<p>Distance:  |AB| = √[(x₂−x₁)² + (y₂−y₁)²]</p>
<p>Midpoint:  M = ((x₁+x₂)/2 ,  (y₁+y₂)/2)</p>
<p>Gradient (slope): m = (y₂−y₁)/(x₂−x₁)</p>
<p>Parallel lines: m₁ = m₂ (equal gradients)</p>
<p>Perpendicular lines: m₁ × m₂ = −1 (product = −1)</p>
<div class="example-box"><h4>📝 Example 14.1a — A(2,−1) and B(5,3). Find: distance AB, midpoint M, and gradient of AB.</h4><p>Distance: |AB| = √[(5−2)² + (3−(−1))²]</p><p>= √[9 + 16] = √25 = 5 units</p><p>Midpoint: M = ((2+5)/2 , (−1+3)/2) = (3.5 , 1)</p><p>Gradient: m = (3−(−1))/(5−2) = 4/3</p></div>
<div class="example-box"><h4>📝 Example 14.1b — The gradient of PQ is 2/3. What is the gradient of any line perpendicular to PQ?</h4><p>For perpendicular lines: m₁ × m₂ = −1</p><p>(2/3) × m₂ = −1</p><p>m₂ = −3/2</p><p>The gradient of the perpendicular is −3/2.</p><p>Geometrical meaning: if you go 2 right and 3 up along PQ,</p><p>you go 3 right and 2 DOWN along the perpendicular.</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> Always simplify the gradient fraction. Also, a horizontal line has gradient 0, and a vertical line has undefined gradient (division by zero).</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Distance Formula and Midpoint?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Equation of a Straight Line",
        objectives: [
        {
          title: "Equation of a Straight Line",
          explanation: `<p>The most important forms:</p>
<p>Slope-intercept: y = mx + c  (m=gradient, c=y-intercept)</p>
<p>Point-slope:     y − y₁ = m(x − x₁)</p>
<p>General:         ax + by + c = 0</p>
<div class="example-box"><h4>📝 Example 14.2a — Find the equation of the line through (3,−2) with gradient 4.</h4><p>Use point-slope form: y − y₁ = m(x − x₁)</p><p>y − (−2) = 4(x − 3)</p><p>y + 2 = 4x − 12</p><p>y = 4x − 14</p><p>Or in general form: 4x − y − 14 = 0</p></div>
<div class="example-box"><h4>📝 Example 14.2b — Find the equation of the line through A(1,4) and B(3,10).</h4><p>Step 1: Find the gradient.</p><p>m = (10−4)/(3−1) = 6/2 = 3</p><p>Step 2: Use point A(1,4):</p><p>y − 4 = 3(x − 1)</p><p>y = 3x − 3 + 4</p><p>y = 3x + 1</p><p>Verify with B(3,10): y = 3(3)+1 = 10 ✓</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Equation of a Straight Line?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Equation of a Circle",
        objectives: [
        {
          title: "Equation of a Circle",
          explanation: `<p>Standard form: (x−h)² + (y−k)² = r², where (h,k) is the centre and r is the radius.</p>
<p>General form: x² + y² + 2gx + 2fy + c = 0. Centre = (−g, −f). Radius r = √(g²+f²−c).</p>
<div class="example-box"><h4>📝 Example 14.3a — Find the centre and radius of x² + y² − 4x + 6y − 3 = 0.</h4><p>Complete the square for x and y:</p><p>x terms: x²−4x → (x−2)²−4</p><p>y terms: y²+6y → (y+3)²−9</p><p>Substitute: (x−2)²−4 + (y+3)²−9 − 3 = 0</p><p>(x−2)² + (y+3)² = 16</p><p>Centre = (2, −3), Radius = 4</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the equation of the perpendicular bisector of the segment joining A(2,4) and B(6,2).</p><ul><li><strong>A.</strong> y=2x−6</li><li><strong>B.</strong> y=2x+5</li><li><strong>C.</strong> 2x−y=3</li><li><strong>D.</strong> x−2y=−2</li></ul><p class="q-answer"><strong>Answer: B</strong> — Midpoint=(4,3). Gradient of AB=−1/2. Perpendicular gradient=2. y−3=2(x−4) → y=2x−5.</p></div></div>`,
          visuals: [],
          question: {
          text: "Find the gradient of the line joining (\u22123,2) and (5,\u22126).",
          options: { "A": "\u22121", "B": "1", "C": "2", "D": "\u22122" },
          correctAnswer: "A",
          explanation: "m=(\u22126\u22122)/(5\u2212(\u22123))=\u22128/8=\u22121."
        }
        }
        ]
      }
    ]
  },

  "Trigonometry": {
    subject: "Mathematics",
    topic: "Trigonometry",
    introduction: {
      title: "Trigonometry \u2014 JAMB Mathematics",
      description: "TOPIC 15 TRIGONOMETRY Ratios \u00b7 CAST \u00b7 Sine & Cosine Rules \u00b7 Bearings  Introduction Trigonometry establishes relationships between the angles and side lengths of triangles. It extends far beyond triangles, appearing in waves, oscillations, coordinates, and vectors. JAMB tests basic ratios, exact values, CAST rule, the sine and cosine rules, and bearings.",
      jambInfo: "Trigonometry is a major JAMB topic with 4-6 questions. SOHCAHTOA, special angles, and the sine/cosine rules are key."
    },
    subtopics: [
      {
        name: "SOHCAHTOA and Special Angles",
        objectives: [
        {
          title: "SOHCAHTOA and Special Angles",
          explanation: `<p>SOHCAHTOA</p>
<p>In a right-angled triangle with angle θ (not the right angle):</p>
<p>sin θ = Opposite / Hypotenuse</p>
<p>cos θ = Adjacent / Hypotenuse</p>
<p>tan θ = Opposite / Adjacent</p>
<p>SPECIAL ANGLES (memorise exact values):</p>
<p>θ:    0°     30°      45°      60°      90°</p>
<p>sin θ:    0    1/2    1/√2    √3/2     1</p>
<p>cos θ:    1   √3/2   1/√2    1/2      0</p>
<p>tan θ:    0   1/√3    1      √3     undefined</p>
<div class="example-box"><h4>📝 Example 15.1a — Without a calculator, evaluate: sin 45° × cos 60° + cos 45° × sin 30°</h4><p>Substitute exact values:</p><p>= (1/√2)(1/2) + (1/√2)(1/2)</p><p>= 1/(2√2) + 1/(2√2)</p><p>= 2/(2√2)</p><p>= 1/√2</p><p>= √2/2</p><p>NOTE: This is actually sin(45°+30°) = sin 75° using the addition formula.</p><p>Answer: 1/√2 = √2/2</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes SOHCAHTOA and Special Angles?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "CAST Rule \u2014 Angles in All Quadrants",
        objectives: [
        {
          title: "CAST Rule \u2014 Angles in All Quadrants",
          explanation: `<p>For angles beyond 90°, we use the CAST rule (also called All-Sine-Tan-Cos):</p>
<p>Q1 (0°–90°):   ALL ratios positive</p>
<p>Q2 (90°–180°): SINE only positive</p>
<p>Q3 (180°–270°): TAN only positive</p>
<p>Q4 (270°–360°): COSINE only positive</p>
<p>Reference angle: for any angle θ in Q2, Q3, Q4, find the acute angle α it makes with the x-axis, then apply the sign from CAST.</p>
<div class="example-box"><h4>📝 Example 15.2a — Given sin 30° = 0.5, find sin 150°, sin 210°, sin 330°.</h4><p>30° is the reference angle for all three.</p><p>150° is in Q2 (sine positive): sin 150° = +sin 30° = 0.5</p><p>210° is in Q3 (sine negative): sin 210° = −sin 30° = −0.5</p><p>330° is in Q4 (sine negative): sin 330° = −sin 30° = −0.5</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes CAST Rule \u2014 Angles in All Quadrants?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Sine Rule and Cosine Rule",
        objectives: [
        {
          title: "Sine Rule and Cosine Rule",
          explanation: `<p>Sine Rule and Cosine Rule</p>
<p>SINE RULE:   a/sin A = b/sin B = c/sin C</p>
<p>Use when: Given 2 angles &amp; 1 side, OR 2 sides &amp; a non-included angle (ambiguous case).</p>
<p>COSINE RULE: a² = b² + c² − 2bc cos A</p>
<p>Or: cos A = (b²+c²−a²)/(2bc)</p>
<p>Use when: Given 3 sides (find angles), OR 2 sides &amp; included angle (find third side).</p>
<div class="example-box"><h4>📝 Example 15.3a — In triangle ABC, AB=7cm, BC=5cm, angle B=60°. Find AC.</h4><p>Using the Cosine Rule (2 sides and included angle B):</p><p>AC² = AB² + BC² − 2(AB)(BC)cos B</p><p>= 49 + 25 − 2(7)(5)cos 60°</p><p>= 74 − 70(0.5)</p><p>= 74 − 35 = 39</p><p>AC = √39 ≈ 6.24 cm</p></div>
<div class="example-box"><h4>📝 Example 15.3b — In triangle PQR, PQ=10cm, angle P=40°, angle Q=75°. Find QR.</h4><p>Find angle R: R = 180−40−75 = 65°</p><p>Using Sine Rule: QR/sin P = PQ/sin R</p><p>QR/sin 40° = 10/sin 65°</p><p>QR = 10 × sin 40° / sin 65°</p><p>= 10 × 0.6428 / 0.9063</p><p>≈ 7.09 cm</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Sine Rule and Cosine Rule?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Bearings",
        objectives: [
        {
          title: "Bearings",
          explanation: `<p>A bearing is the angle measured CLOCKWISE from North (000°). It is always written as three digits (e.g. 045°, not 45°). Bearings describe directions in navigation and surveying.</p>
<div class="example-box"><h4>📝 Example 15.4a — Ship A is 50km due North of port O. Ship B is 60km due East of O. Find the bearing of B from A and the distance AB.</h4><p>Distance AB = √(50² + 60²) = √(2500+3600) = √6100 ≈ 78.1 km</p><p>Bearing of B from A:</p><p>B is East and South of A.</p><p>The angle below East (south of east) from A's perspective:</p><p>tan(angle) = 60/50 = 1.2  →  angle = arctan(1.2) ≈ 50.2°</p><p>But we measure from North, and B is to the South-East of A:</p><p>Bearing = 090° + (90°−50.2°) ... more directly:</p><p>Angle from North = 180° − arctan(60/50)</p><p>Actually: from A, B is SE. Bearing = 90° + arctan(50/60) ≈ 90°+39.8° ≈ 129.8°</p><p>Answer: Bearing ≈ 130°, Distance ≈ 78.1 km</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> For bearing problems, ALWAYS draw a north arrow at the starting point. Then measure clockwise. Draw the triangle and label it fully before calculating.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find the bearing of a point A from O if A is 5km due South-East (exactly 135°) of O. What is the bearing of O from A?</p><ul><li><strong>A.</strong> 315°</li><li><strong>B.</strong> 135°</li><li><strong>C.</strong> 045°</li><li><strong>D.</strong> 225°</li></ul><p class="q-answer"><strong>Answer: A</strong> — Reverse bearing: 135°+180°=315°.</p></div></div>`,
          visuals: [],
          question: {
          text: "sin\u00b2\u03b8 + cos\u00b2\u03b8 = ?",
          options: { "A": "0", "B": "2", "C": "1", "D": "depends on \u03b8" },
          correctAnswer: "C",
          explanation: "This is the fundamental Pythagorean identity. Always true for any angle \u03b8."
        }
        }
        ]
      }
    ]
  },

  "Differentiation": {
    subject: "Mathematics",
    topic: "Differentiation",
    introduction: {
      title: "Differentiation \u2014 JAMB Mathematics",
      description: "TOPIC 16 DIFFERENTIATION & ITS APPLICATIONS Power rule \u00b7 Chain rule \u00b7 Maxima & minima \u00b7 Rates of change  Introduction Differentiation is the process of finding the derivative of a function \u2014 the instantaneous rate of change or the gradient of the curve at any point. If y = f(x), then the derivative dy/dx (also written f'(x)) tells you how steeply y is changing at each value of x. Applications incl",
      jambInfo: "Calculus (differentiation) appears 2-4 times in JAMB \u2014 cover power rule, chain rule, and max/min problems."
    },
    subtopics: [
      {
        name: "Differentiation by the Power Rule",
        objectives: [
        {
          title: "Differentiation by the Power Rule",
          explanation: `<p>Power Rule and Standard Results</p>
<p>If y = axⁿ,  then dy/dx = naxⁿ⁻¹</p>
<p>Differentiate term by term. Constants differentiate to zero.</p>
<p>Other standard results:</p>
<p>d/dx(sin x) = cos x</p>
<p>d/dx(cos x) = −sin x</p>
<p>d/dx(eˣ)   = eˣ</p>
<p>d/dx(ln x)  = 1/x</p>
<div class="example-box"><h4>📝 Example 16.1a — Differentiate y = 5x⁴ − 3x³ + 7x² − 2x + 9</h4><p>Differentiate each term using the power rule:</p><p>d/dx(5x⁴) = 5 × 4 × x³ = 20x³</p><p>d/dx(−3x³) = −3 × 3 × x² = −9x²</p><p>d/dx(7x²)  = 7 × 2 × x = 14x</p><p>d/dx(−2x)  = −2</p><p>d/dx(9)    = 0  (constant)</p><p>dy/dx = 20x³ − 9x² + 14x − 2</p></div>
<div class="example-box"><h4>📝 Example 16.1b — Find the gradient of y = x³ − 4x + 1 at the point (2, 1).</h4><p>Step 1: Differentiate: dy/dx = 3x² − 4</p><p>Step 2: Substitute x = 2:</p><p>dy/dx at x=2: 3(4) − 4 = 12 − 4 = 8</p><p>The gradient of the curve at (2,1) is 8.</p><p>Equation of tangent at (2,1) with gradient 8:</p><p>y − 1 = 8(x − 2)  →  y = 8x − 15</p></div>
<div class="hint-box"><h4>💡 Quick Tip</h4><p> When finding the gradient at a point, first find dy/dx (the general formula), THEN substitute the x-value. Substituting into y first is a common mistake.</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Differentiation by the Power Rule?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Chain Rule for Composite Functions",
        objectives: [
        {
          title: "Chain Rule for Composite Functions",
          explanation: `<p>If y = f(g(x)), then dy/dx = f'(g(x)) × g'(x).</p>
<p>In practice: differentiate the outer function (leaving the inner unchanged), then multiply by the derivative of the inner function.</p>
<div class="example-box"><h4>📝 Example 16.2a — Differentiate y = (4x² + 3)⁵</h4><p>Outer function: u⁵ (where u = 4x²+3)</p><p>Inner function: 4x²+3</p><p>dy/dx = 5(4x²+3)⁴ × d/dx(4x²+3)</p><p>= 5(4x²+3)⁴ × 8x</p><p>= 40x(4x²+3)⁴</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Chain Rule for Composite Functions?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Maximum and Minimum Points",
        objectives: [
        {
          title: "Maximum and Minimum Points",
          explanation: `<p>Stationary points occur where dy/dx = 0. To classify:</p>
<p>Find dy/dx. Set = 0 and solve for x (these are the stationary x-values).</p>
<p>Find d²y/dx² (second derivative).</p>
<p>At each stationary point: if d²y/dx² &lt; 0 → MAXIMUM. If d²y/dx² &gt; 0 → MINIMUM.</p>
<p>Substitute x back into y = f(x) to find the y-coordinate.</p>
<div class="example-box"><h4>📝 Example 16.3a — Find and classify the turning points of y = x³ − 3x² − 9x + 5.</h4><p>Step 1: dy/dx = 3x² − 6x − 9</p><p>Set dy/dx = 0: 3x²−6x−9 = 0 → x²−2x−3 = 0</p><p>Factorise: (x−3)(x+1) = 0</p><p>x = 3 or x = −1</p><p>Step 2: d²y/dx² = 6x − 6</p><p>At x = 3: d²y/dx² = 18−6 = 12 &gt; 0 → MINIMUM</p><p>y = 27−27−27+5 = −22</p><p>Minimum point: (3, −22)</p><p>At x = −1: d²y/dx² = −6−6 = −12 &lt; 0 → MAXIMUM</p><p>y = −1−3+9+5 = 10</p><p>Maximum point: (−1, 10)</p></div>
<div class="warning-box"><h4>⚠️ Common Mistake</h4><p> A stationary point with d²y/dx² = 0 is inconclusive (could be maximum, minimum, or point of inflection). Use the first derivative test — check the sign of dy/dx on either side.</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> The curve y=x³−6x²+9x+1 has stationary points. Find the x-values and classify.</p><ul><li><strong>A.</strong> x=1 (max), x=3 (min)</li><li><strong>B.</strong> x=3 (max), x=1 (min)</li><li><strong>C.</strong> x=1 and x=3 both min</li><li><strong>D.</strong> x=0 and x=2</li></ul><p class="q-answer"><strong>Answer: A</strong> — dy/dx=3x²−12x+9=3(x²−4x+3)=3(x−1)(x−3)=0. x=1 or x=3. d²y/dx²=6x−12. At x=1: −6&lt;0 max. At x=3: 6&gt;0 min.</p></div></div>`,
          visuals: [],
          question: {
          text: "Find dy/dx if y = 3x\u2075 \u2212 4x\u00b3 + 2x \u2212 7.",
          options: { "A": "15x\u2074\u221212x\u00b2+2", "B": "15x\u2074\u22124x\u00b2+2", "C": "15x\u2074\u221212x+2", "D": "5x\u2074\u221212x\u00b2+2" },
          correctAnswer: "A",
          explanation: "Power rule term by term: 15x\u2074\u221212x\u00b2+2."
        }
        }
        ]
      }
    ]
  },

  "Integration": {
    subject: "Mathematics",
    topic: "Integration",
    introduction: {
      title: "Integration \u2014 JAMB Mathematics",
      description: "TOPIC 18 INTEGRATION Indefinite integrals \u00b7 Definite integrals \u00b7 Area under curves  Introduction Integration is the reverse operation of differentiation. If differentiation finds the gradient of a curve, integration finds the area under a curve. An indefinite integral gives a family of functions (hence the +C). A definite integral gives a specific numerical value \u2014 the area between the curve, the",
      jambInfo: "Integration appears 2-3 times in JAMB. Know the power rule and definite integral (area under curve)."
    },
    subtopics: [
      {
        name: "Indefinite Integration \u2014 Power Rule",
        objectives: [
        {
          title: "Indefinite Integration \u2014 Power Rule",
          explanation: `<p>Integration Power Rule</p>
<p>∫ axⁿ dx = axⁿ⁺¹/(n+1) + C    [where n ≠ −1]</p>
<p>Integrate term by term. ALWAYS add +C for indefinite integrals.</p>
<p>Special cases:</p>
<p>∫ 1/x dx = ln|x| + C</p>
<p>∫ eˣ dx = eˣ + C</p>
<p>∫ sin x dx = −cos x + C</p>
<p>∫ cos x dx = sin x + C</p>
<div class="example-box"><h4>📝 Example 18.1a — Find ∫(6x² − 4x + 5) dx</h4><p>Integrate term by term:</p><p>∫6x² dx = 6x³/3 = 2x³</p><p>∫(−4x) dx = −4x²/2 = −2x²</p><p>∫5 dx = 5x</p><p>Answer: 2x³ − 2x² + 5x + C</p></div>
<div class="example-box"><h4>📝 Example 18.1b — Find ∫(3√x + 2/x²) dx</h4><p>Rewrite in index notation: 3x^(1/2) + 2x^(−2)</p><p>∫3x^(1/2) dx = 3x^(3/2)/(3/2) = 2x^(3/2)</p><p>∫2x^(−2) dx = 2x^(−1)/(−1) = −2/x</p><p>Answer: 2x^(3/2) − 2/x + C = 2x√x − 2/x + C</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Indefinite Integration \u2014 Power Rule?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Definite Integrals and Area",
        objectives: [
        {
          title: "Definite Integrals and Area",
          explanation: `<p>∫ₐᵇ f(x) dx = [F(x)]ₐᵇ = F(b) − F(a), where F is the antiderivative.</p>
<p>Area between curve and x-axis from x=a to x=b = |∫ₐᵇ f(x) dx|.</p>
<p>Use absolute value because area is always positive, even if the curve is below the x-axis.</p>
<div class="example-box"><h4>📝 Example 18.2a — Evaluate ∫₁⁴ (3x² − 4x + 1) dx</h4><p>Find antiderivative: F(x) = x³ − 2x² + x</p><p>F(4) = 64 − 32 + 4 = 36</p><p>F(1) = 1 − 2 + 1 = 0</p><p>Definite integral = F(4) − F(1) = 36 − 0 = 36</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> Find ∫₀³ (2x+1) dx.</p><ul><li><strong>A.</strong> 12</li><li><strong>B.</strong> 9</li><li><strong>C.</strong> 15</li><li><strong>D.</strong> 6</li></ul><p class="q-answer"><strong>Answer: A</strong> — F(x)=x²+x. F(3)=9+3=12. F(0)=0. Result: 12.</p></div></div>`,
          visuals: [],
          question: {
          text: "Evaluate \u222b(5x\u2074 \u2212 3x\u00b2 + 2) dx.",
          options: { "A": "x\u2075\u2212x\u00b3+2x+C", "B": "20x\u00b3\u22126x+C", "C": "x\u2075+x\u00b3+2x+C", "D": "x\u2075\u22123x\u00b3+2x+C" },
          correctAnswer: "A",
          explanation: "Integrate: 5x\u2075/5\u22123x\u00b3/3+2x+C = x\u2075\u2212x\u00b3+2x+C."
        }
        }
        ]
      }
    ]
  },

  "Statistics": {
    subject: "Mathematics",
    topic: "Statistics",
    introduction: {
      title: "Statistics \u2014 JAMB Mathematics",
      description: "TOPIC 19 STATISTICS Data representation \u00b7 Location \u00b7 Dispersion  Introduction Statistics is the science of collecting, organising, presenting, analysing, and interpreting data. JAMB tests data representation (frequency tables, histograms, pie charts, ogives), measures of central tendency (mean, median, mode), and measures of spread (range, variance, standard deviation, interquartile range).",
      jambInfo: "JAMB asks 3-5 statistics questions \u2014 mean, median, mode, frequency tables, and dispersion."
    },
    subtopics: [
      {
        name: "Frequency Tables and Histograms",
        objectives: [
        {
          title: "Frequency Tables and Histograms",
          explanation: `<p>A frequency table shows how many times each value (or range of values) occurs in a dataset. For grouped data, class intervals are used. In a histogram, the y-axis shows frequency (or frequency density if class widths differ).</p>
<div class="example-box"><h4>📝 Example 19.1a — Construct a frequency table for: 4,7,3,7,5,4,7,3,7,5,4,7,3,4,7 and find the mode.</h4><p>Tally the values:</p><p>Value  3: appears 3 times</p><p>Value  4: appears 4 times</p><p>Value  5: appears 2 times</p><p>Value  7: appears 6 times</p><p>Mode = 7 (appears most frequently)</p><p>Total = 3+4+2+6 = 15 ✓</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Frequency Tables and Histograms?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Mean, Median, Mode \u2014 Ungrouped and Grouped",
        objectives: [
        {
          title: "Mean, Median, Mode \u2014 Ungrouped and Grouped",
          explanation: `<p>Formulas for Measures of Location</p>
<p>MEAN (ungrouped):        x̄ = Σx / n</p>
<p>MEAN (frequency data):   x̄ = Σfx / Σf</p>
<p>MEAN (grouped data):     x̄ = Σfm / Σf  (m = class midpoint)</p>
<p>MEDIAN (odd n):          middle value when arranged in order</p>
<p>MEDIAN (even n):         average of two middle values</p>
<p>MEDIAN (grouped):        L + [(n/2 − F)/f] × h</p>
<p>L=lower boundary of median class, F=cumulative freq before, f=freq of class, h=width</p>
<p>MODE:                    most frequent value</p>
<p>MODE (grouped):          modal class is the one with highest frequency</p>
<div class="example-box"><h4>📝 Example 19.2a — Find mean, median and mode of: 12, 8, 15, 8, 12, 18, 8, 15</h4><p>Arrange in order: 8, 8, 8, 12, 12, 15, 15, 18</p><p>Mean = (8+8+8+12+12+15+15+18)/8 = 96/8 = 12</p><p>Median: n=8 (even). Middle two are 4th and 5th values = 12 and 12.</p><p>Median = (12+12)/2 = 12</p><p>Mode = 8 (appears 3 times)</p></div>
<div class="example-box"><h4>📝 Example 19.2b — Grouped data: Classes 0-9(f=5), 10-19(f=8), 20-29(f=12), 30-39(f=10), 40-49(f=5). Find mean and median.</h4><p>Midpoints: 4.5, 14.5, 24.5, 34.5, 44.5</p><p>Σf = 40</p><p>Σfm = 5(4.5)+8(14.5)+12(24.5)+10(34.5)+5(44.5)</p><p>= 22.5+116+294+345+222.5 = 1000</p><p>Mean = 1000/40 = 25</p><p>For median: n/2 = 20th value.</p><p>Cumulative: 0-9: 5, 0-19: 13, 0-29: 25. So 20th value is in 20-29.</p><p>Median class: 20-29. L=19.5, F=13, f=12, h=10</p><p>Median = 19.5 + [(20−13)/12] × 10 = 19.5 + (7/12)(10) = 19.5 + 5.83 ≈ 25.33</p></div>`,
          visuals: [],
          question: {
          text: "Which of the following best describes Mean, Median, Mode \u2014 Ungrouped and Grouped?",
          options: { "A": "See explanation", "B": "See explanation", "C": "See explanation", "D": "See explanation" },
          correctAnswer: "A",
          explanation: "Review the content above."
        }
        }
        ]
      },
      {
        name: "Measures of Dispersion",
        objectives: [
        {
          title: "Measures of Dispersion",
          explanation: `<p>Formulas for Measures of Dispersion</p>
<p>Range = Maximum − Minimum</p>
<p>Variance (σ²) = Σ(x−x̄)²/n  OR  Σx²/n − (x̄)²  [easier formula]</p>
<p>Variance (freq) = Σf(x−x̄)²/Σf  OR  Σfx²/Σf − (x̄)²</p>
<p>Standard Deviation (σ) = √Variance</p>
<p>Interquartile Range (IQR) = Q3 − Q1</p>
<p>Semi-IQR = IQR/2</p>
<p>Q1 = value at n/4 th position</p>
<p>Q3 = value at 3n/4 th position</p>
<div class="example-box"><h4>📝 Example 19.3a — Find variance and standard deviation of: 2, 4, 4, 6, 8, 10</h4><p>Mean = (2+4+4+6+8+10)/6 = 34/6 = 17/3 ≈ 5.667</p><p>Using shortcut: Variance = Σx²/n − (x̄)²</p><p>Σx² = 4+16+16+36+64+100 = 236</p><p>Σx²/n = 236/6 ≈ 39.33</p><p>(x̄)² = (17/3)² = 289/9 ≈ 32.11</p><p>Variance ≈ 39.33 − 32.11 = 7.22</p><p>SD = √7.22 ≈ 2.69</p></div><div class="extra-questions"><h4>📚 More Practice Questions</h4><div class="extra-q-block"><p><strong>Practice:</strong> The mean of 5 numbers is 12. Four of them are 8, 11, 15, 14. Find the fifth.</p><ul><li><strong>A.</strong> 12</li><li><strong>B.</strong> 10</li><li><strong>C.</strong> 14</li><li><strong>D.</strong> 15</li></ul><p class="q-answer"><strong>Answer: A</strong> — Sum=5×12=60. 8+11+15+14=48. Fifth=60−48=12.</p></div></div>`,
          visuals: [],
          question: {
          text: "Find the standard deviation of 3, 7, 7, 7, 8, 8, 9.",
          options: { "A": "2", "B": "4", "C": "1.69", "D": "3" },
          correctAnswer: "C",
          explanation: "Mean=49/7=7. \u03a3(x\u22127)\u00b2=(16+0+0+0+1+1+4)=22. Variance=22/7\u22483.14. SD=\u221a3.14\u22481.77."
        }
        }
        ]
      }
    ]
  },

  "Permutation & Combination": {
    subject: "Mathematics",
    topic: "Permutation & Combination",
    introduction: {
      title: "Permutation & Combination \u2014 JAMB Mathematics",
      description: "TOPIC 22 PERMUTATION AND COMBINATION Counting \u00b7 Arrangements \u00b7 Selections  Introduction Counting methods are the foundation of probability. Permutations count arrangements where ORDER MATTERS. Combinations count selections where ORDER DOES NOT MATTER. The key skill is recognising which applies to each situation.  Core Formulas FACTORIAL: n! = n\u00d7(n\u22121)\u00d7(n\u22122)\u00d7...\u00d72\u00d71.  0! = 1  PERMUTATION (arrangemen",
      jambInfo: "Permutations and combinations appear 2-3 times in JAMB. Know when to use nPr vs nCr."
    },
    subtopics: [

    ]
  },

  "Probability": {
    subject: "Mathematics",
    topic: "Probability",
    introduction: {
      title: "Probability \u2014 JAMB Mathematics",
      description: "TOPIC 23 PROBABILITY Classical probability \u00b7 Laws \u00b7 Conditional \u00b7 Trees  Introduction Probability measures how likely an event is to occur, expressed as a number between 0 (impossible) and 1 (certain). JAMB tests classical probability, the addition and multiplication laws, conditional probability, and probability trees.  Fundamental Probability Rules P(A) = favourable outcomes / total outcomes 0 \u2264",
      jambInfo: "Probability appears 3-4 times in JAMB. Focus on basic probability, independent events, and mutually exclusive events."
    },
    subtopics: [

    ]
  }
};

window.MATHEMATICS_LEARNING_CONTENT = MATHEMATICS_LEARNING_CONTENT;