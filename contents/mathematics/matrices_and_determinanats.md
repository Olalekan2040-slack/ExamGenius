TOPIC: Matrices and DeterminantsIntroductionMatrices are rectangular arrays of numbers arranged in rows and columns. They are used to represent and solve systems of linear equations, transformations, computer graphics, economics, and many real-life applications.
Determinants are special scalar values calculated from square matrices that tell us whether the matrix is invertible and help solve equations.For a complete beginner:
A matrix is like a table of numbers.
Example: A 2×2 matrix looks like this:

[ a  b ]
[ c  d ]

A 3×3 matrix has 3 rows and 3 columns.
We perform operations on matrices just like numbers, but with special rules.This topic is very high-scoring in JAMB Mathematics – usually 4–7 questions every year.
Questions focus on:Matrix addition, subtraction, scalar multiplication, and multiplication
Calculating determinants (2×2 and 3×3)
Finding inverses of 2×2 matrices
Solving simple matrix equations

World-standard learning objectives (aligned with Cambridge IGCSE, WAEC, NECO, IB MYP, and A-Level foundation):
Candidates should be able to:Perform addition, subtraction, scalar multiplication, and matrix multiplication for matrices up to 3×3
Calculate determinants of 2×2 and 3×3 matrices using the standard formula
Find the inverse of a 2×2 matrix using the formula (1/det) × adjugate matrix
Understand the conditions for a matrix to be invertible (determinant ≠ 0)
Solve simple matrix equations of the form AX = B by finding A⁻¹
Interpret matrices as transformations (rotation, scaling, reflection) in basic contexts

Here are very clear visual aids to help you understand matrices and determinants quickly:This diagram shows a 2×2 and 3×3 matrix with rows and columns labelled.This picture illustrates matrix multiplication rule (row × column).This chart shows the determinant formula for 2×2 and 3×3 matrices.This visual explains the inverse of a 2×2 matrix step by step.SUBTOPIC: Algebra of Matrices (Operations)Objective 1: Perform basic operations on matrices (up to 3×3)Explanation (step-by-step for beginners):Addition & Subtraction  Same size only  
Add/subtract corresponding elements

Scalar Multiplication  Multiply every element by the scalar

Matrix Multiplication  Number of columns of first matrix = number of rows of second  
Result element (i,j) = row i of first × column j of second  
Order matters: AB ≠ BA in general

Key Points:Addition/subtraction: commutative (A + B = B + A)  
Multiplication: not commutative, but associative (A(BC) = (AB)C)  
Distributive over addition: A(B + C) = AB + AC

Visual Type: step-by-step diagrams
Visual Items:  Matrix addition example  
Matrix multiplication row-by-column process  
3×3 multiplication worked example

Example Question Pattern (simple to hard – JAMB style):Simple: If A = [2 3; 1 4] and B = [5 1; 0 2], find A + B.
Answer: [7 4; 1 6]
Medium: Calculate 3A – 2B where A = [1 2 3; 4 5 6] (2×3), B = [7 8 9; 10 11 12].
Answer: [–11 –10 –9; –8 –7 –6]
Hard: Find AB where A = [1 2; 3 4] and B = [5 6; 7 8].
Answer: [19 22; 43 50]
Advanced: If A = [2 1 0; 0 3 4; 1 0 5] (3×3), compute A² (square).
(Multiply A by itself – JAMB often asks this for verification)

Common Mistakes:Adding matrices of different sizes  
Wrong order in multiplication (row × column)

SUBTOPIC: Determinants of MatricesObjective 2: Calculate determinants of matrices (up to 3×3)Explanation:2×2 Determinant:
For matrix [a b; c d]
det = ad – bc3×3 Determinant:
For matrix
[a b c]
[d e f]
[g h i]  det = a(ei – fh) – b(di – fg) + c(dh – eg)
(Use the “cross method” or expansion along first row)Key Points:Determinant = 0 → matrix is singular (no inverse)  
Used to check if system of equations has unique solution

Visual Type: determinant formula cards
Visual Items:  2×2 determinant formula with example  
3×3 determinant expansion rule (Sarrus method)

Example Question Pattern:Simple: Find det of [3 4; 1 2].
Answer: (3×2) – (4×1) = 6 – 4 = 2
Medium: Calculate det of
[1 2 3]
[0 4 5]
[2 1 0]
Answer: 1(4×0 – 5×1) – 2(0×0 – 5×2) + 3(0×1 – 4×2) = –5 + 20 – 24 = –9
Hard: If det(A) = 12 for 3×3 matrix A, find det(2A).
Answer: det(2A) = 2³ × det(A) = 8 × 12 = 96
Advanced: Show that det(AB) = det(A) × det(B) for 2×2 matrices (property).

Common Mistakes:Wrong sign in 3×3 expansion (+ – +)  
Forgetting to multiply by the first-row elements

SUBTOPIC: Inverses of 2×2 MatricesObjective 3: Compute inverses of 2×2 matricesExplanation (formula you must memorise):For matrix A = [a b; c d]
Inverse A⁻¹ exists only if det(A) ≠ 0
A⁻¹ = (1/det(A)) × [d –b; –c a]Steps:Calculate det = ad – bc  
If det = 0 → no inverse  
Swap a and d, change signs of b and c  
Multiply by 1/det

Key Points:Inverse satisfies A × A⁻¹ = A⁻¹ × A = I (identity matrix)  
Used to solve matrix equations AX = B → X = A⁻¹B

Visual Type: step-by-step inverse calculation
Visual Items:  Inverse formula with example  
Verification by multiplication

Example Question Pattern:Simple: Find inverse of [1 2; 3 4].
Answer: det = 1×4 – 2×3 = –2
Inverse = (–1/2) [4 –2; –3 1] = [–2 1; 1.5 –0.5]
Medium: If A = [5 3; 2 1], find A⁻¹.
Answer: det = 5–6 = –1
Inverse = –1 [1 –3; –2 5] = [–1 3; 2 –5]
Hard: Solve the system using inverse:
2x + 3y = 8
4x + 5y = 14
Answer: Matrix A = [2 3; 4 5], det = 10–12 = –2
A⁻¹ = (–1/2) [5 –3; –4 2] = [–2.5 1.5; 2 –1]
[x; y] = A⁻¹ [8; 14] = [–2.5×8 + 1.5×14; 2×8 –1×14] = [–20 + 21; 16 – 14] = [1; 2]
Advanced: Show that (AB)⁻¹ = B⁻¹A⁻¹ for invertible 2×2 matrices.

Common Mistakes:Forgetting to divide by determinant  
Wrong signs when swapping elements

Final High-Level Tips for JAMB Success:Memorise the 2×2 inverse formula – it appears in almost every question  
Always check det ≠ 0 before finding inverse  
Practice matrix multiplication – most errors come here  
Solve at least 30 questions: 10 operations, 10 determinants, 10 inverses  
Draw 2×2 and 3×3 matrices clearly with brackets

Matrices and determinants are among the most predictable and highest-scoring topics in JAMB when you practice the formulas and tables carefully.You are doing very well! Keep revising with the visual aids and solving mixed questions daily.
The next topics will continue in this same high-standard guided format.Good luck in your JAMB Mathematics – you will perform excellently!  Keep going!

