TOPIC: Number BasesIntroductionNumber bases (also called radix or positional numeral systems) show how we write and use numbers using different bases. In everyday life we use base 10 (decimal) with digits 0–9. Computers use base 2 (binary) with only 0 and 1. Other common bases are 8 (octal) and 16 (hexadecimal).For a complete JAMB beginner:
Think of number bases like different languages for counting. The same quantity can be written differently depending on the "language" (base) you use.Very important facts for JAMB:Base b uses digits from 0 to (b–1)
Examples:  Base 2 → digits 0,1  
Base 5 → digits 0,1,2,3,4  
Base 10 → digits 0–9  
Base 16 → digits 0–9 and A=10, B=11, C=12, D=13, E=14, F=15

JAMB asks 3–5 questions on this topic every year.
They test:Addition, subtraction, multiplication, division in different bases  
Conversion from any base to base 10 (and back)  
Sometimes fractional (decimal) parts

Here are simple pictures to help you understand number bases quickly:This picture shows how the same number 13 looks in different bases (very useful for beginners).This chart compares counting from 0 to 15 in base 2, 8, 10, and 16 side by side.This diagram explains place values in different bases (very important!).SUBTOPIC: Conversion Between Number BasesObjective 1: Convert from one base to another (including to base 10 and back)Explanation (very simple step-by-step):A. Any base → base 10 (easiest method)
Multiply each digit by its place value (power of the base) and add them up.Example: Convert 1011₂ (base 2) to base 10
= (1×2³) + (0×2²) + (1×2¹) + (1×2⁰)
= (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11₁₀Example: Convert 2B₁₆ (base 16) to base 10
B = 11
= (2×16¹) + (11×16⁰) = (2×16) + (11×1) = 32 + 11 = 43₁₀B. Base 10 → any other base
Keep dividing the number by the new base and record the remainders from bottom to top.Example: Convert 47₁₀ to base 5
47 ÷ 5 = 9 remainder 2
9 ÷ 5 = 1 remainder 4
1 ÷ 5 = 0 remainder 1
Answer: 142₅ (read remainders from bottom to top)C. Fractional part conversion (to base 10)
Multiply the fractional part by the base repeatedly and take the integer part each time.Example: Convert 0.101₂ to base 10
0.1 × 2 = 0.2 → integer 0
0.2 × 2 = 0.4 → integer 0
0.4 × 2 = 0.8 → integer 0
0.8 × 2 = 1.6 → integer 1
So ≈ 0.625₁₀ (stop when accurate enough)Here are clear step-by-step diagrams for conversions:This picture shows the division method to convert from base 10 to any base (very important!).This one shows place value method for converting any base to base 10.This diagram explains fractional conversion using multiplication method.Example Question Pattern (JAMB style):  Question 1: "Convert 1101₂ to base 10"
Answer: 13₁₀  
Question 2: "Convert 35₁₀ to base 4"
Answer: 203₄  
Question 3: "What is the value of 1A3₁₆ in base 10?" (A=10)
Answer: (1×256) + (10×16) + 3 = 256 + 160 + 3 = 419₁₀

Common Mistakes Beginners Make:  Forgetting to start remainders from the bottom when converting to new base  
Using digits bigger than the base (e.g., writing 8 in base 7 – not allowed)  
Wrong place values (powers start from right: base⁰, base¹, base²…)

SUBTOPIC: Operations in Different BasesObjective 2: Perform four basic operations (addition, subtraction, multiplication, division) in different basesExplanation (very simple rules):1. Addition & Subtraction  Work column by column from right to left  
Carry over when sum ≥ base (same as normal addition but carry to next column when you reach the base)

Example: Add 1011₂ + 110₂ (both base 2)  

   1 0 1 1
+    1 1 0
------------
   1 0 0 0 1   (answer = 10001₂)

2. Multiplication  Multiply like normal, but use the base rules for carrying  
Add all partial products (shift left each time)

Example: 11₂ × 101₂
First: 11₂ × 1 = 11₂
Second: 11₂ × 0 = 00₂ (shift one place left)
Third: 11₂ × 1 = 11₂ (shift two places left)
Then add them up.3. Division  Divide like normal long division  
Subtract multiples of divisor, record remainders in the base

Here are very clear worked examples with pictures:This picture shows step-by-step addition in base 5 (very common JAMB question).This one shows multiplication in base 8 – carry when sum ≥ 8.This diagram shows division in base 3 – very clear long division method.Example Question Pattern:  Question 1: "Simplify 234₅ + 143₅"
Answer: 432₅  
Question 2: "Calculate 1101₂ – 101₂"
Answer: 1000₂  
Question 3: "Multiply 13₅ × 4₅"
Answer: 112₅

Common Mistakes:  Forgetting to carry when the sum is equal to or greater than the base  
Doing subtraction without borrowing correctly (very common error)  
Mixing up the base during calculation

Quick Tips for JAMB Success:Always write the base at the top right of your answer (e.g. 101₂)  
Convert everything to base 10 first if you get confused – solve – then convert back  
Practice at least 20 questions on addition/subtraction in base 2, 3, 5, 8  
Learn the conversion methods perfectly – they appear in almost every question

Study these diagrams and practice writing the steps yourself many times.
Number bases is usually one of the easiest and most scoring topics in JAMB Mathematics if you practice well!You can do this – even as a complete beginner, after 2–3 days of practice you will find it very easy!  Good luck in your JAMB! Keep revising!  You will succeed!

