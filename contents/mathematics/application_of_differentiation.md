TOPIC: Application of DifferentiationIntroductionApplication of Differentiation is the practical use of derivatives (gradients/rates of change) to solve real-life and mathematical problems. It is one of the most powerful tools in calculus and appears frequently in JAMB, WAEC, NECO, and international exams like Cambridge IGCSE and A-Level.For a complete beginner:
The derivative tells us how fast something is changing at any instant (e.g., speed of a car, rate of growth of a plant, rate at which profit changes with sales).
We use it for two main things:Rate of change problems (how quantities change over time or with respect to each other)  
Optimization problems (finding maximum profit, minimum cost, largest area, etc.)

This topic is very high-scoring in JAMB Mathematics – usually 4–8 questions every year.
Questions test:Interpreting derivatives as rates (speed, velocity, acceleration, growth)  
Finding instantaneous vs average rates  
Locating maximum/minimum points using first and second derivatives  
Solving real-life optimization problems (area, volume, profit, cost)

World-standard learning objectives (aligned with Cambridge A-Level, IB, WAEC, NECO, and JAMB):
Candidates should be able to:Understand the derivative as the instantaneous rate of change of a function with respect to its variable
Distinguish between average rate of change (secant slope) and instantaneous rate of change (tangent slope/derivative)
Apply differentiation to calculate rates of change in physical, biological, economic, and geometric contexts (speed, velocity, acceleration, growth rates, marginal cost/profit)
Locate stationary points by setting the first derivative equal to zero
Use the first derivative test (sign change around critical points) and second derivative test (concavity: d²y/dx² > 0 → minimum, < 0 → maximum) to classify maxima and minima
Solve optimization problems involving maximum/minimum values (e.g., maximum area for fixed perimeter, minimum cost for given volume, maximum profit)
Interpret solutions correctly in real-life context (e.g., turning points represent maximum profit or minimum distance)

Here are very important visual aids to help you understand applications of differentiation:This diagram shows the difference between average rate (secant line) and instantaneous rate (tangent line) – key for rate of change.This graph illustrates a function with a local maximum (first derivative = 0, second derivative < 0) and local minimum (second derivative > 0).This picture shows a real-life optimization problem: maximizing area of a rectangular field with fixed fencing (classic JAMB question).This visual explains how velocity = dy/dt (first derivative) and acceleration = d²y/dt² (second derivative) in motion problems.This chart summarizes the first and second derivative tests with sign tables.SUBTOPIC 1: Rate of ChangeObjective: Explain and calculate rates of change using differentiationExplanation (very simple for beginners):Average rate of change → total change ÷ total time (secant slope)
Instantaneous rate of change → the derivative dy/dx or f'(x) at a specific point (tangent slope)Key Steps for Rate Problems:Express the relationship as y = f(x)  
Find dy/dx (derivative)  
Substitute the given value of x or t  
Interpret: positive = increasing, negative = decreasing

Visual Type: graph with secant vs tangent
Visual Items:  Secant line (average) vs tangent line (instantaneous)  
Example of distance-time graph → velocity = gradient

Example Question Pattern (simple to hard – JAMB style):Simple: The distance s (in metres) travelled by a car is s = 5t² + 3t. Find the speed (rate of change of distance) at t = 2 seconds.
Answer: ds/dt = 10t + 3 → at t = 2 → 20 + 3 = 23 m/s
Medium: The volume V of water in a tank is V = 4t³ – 12t² + 9t + 50 (litres) after t minutes. Find the rate at which water is flowing out at t = 3 minutes.
Answer: dV/dt = 12t² – 24t + 9 → at t = 3 → 108 – 72 + 9 = 45 litres/min (positive = inflow)
Hard: A population P grows according to P = 200e^(0.05t). Find the rate of growth when t = 10 years.
Answer: dP/dt = 200 × 0.05 e^(0.05t) = 10 e^(0.05t) → at t = 10 → 10e^(0.5) ≈ 16.49 people/year
Advanced (JAMB real-life): The cost C (in naira) of producing x units of a commodity is C = 0.01x³ – 0.6x² + 15x + 2000. Find the marginal cost (rate of change of cost) when x = 50.
Answer: dC/dx = 0.03x² – 1.2x + 15 → at x = 50 → 0.03(2500) – 1.2(50) + 15 = 75 – 60 + 15 = 30 naira/unit

Common Mistakes:Using average rate instead of instantaneous  
Forgetting chain rule for exponential functions

SUBTOPIC 2: Maxima and MinimaObjective: Solve optimization problems using first and second derivativesExplanation (step-by-step method):Stationary points → where dy/dx = 0 (gradient = 0, horizontal tangent)First derivative test:If dy/dx changes from + to – → local maximum  
If dy/dx changes from – to + → local minimum

Second derivative test (faster for JAMB):At stationary point:  d²y/dx² > 0 → minimum (concave up)  
d²y/dx² < 0 → maximum (concave down)  
d²y/dx² = 0 → inconclusive

Steps for optimization:Express quantity to maximize/minimize as y = f(x)  
Find dy/dx and set = 0 → find critical points  
Use second derivative test to classify  
Check endpoints if domain is restricted  
Interpret answer in context

Visual Type: graph with turning points
Visual Items:  Curve showing local max and min  
Sign table for first derivative  
Second derivative test summary

Example Question Pattern (simple to hard – JAMB style):Simple: For y = x³ – 3x² + 2x, find stationary points and their nature.
Answer: dy/dx = 3x² – 6x + 2 = 0 → x = 1 ± √(1/3)
d²y/dx² = 6x – 6 → at x=1+ → positive (min), at x=1– → negative (max)
Medium: The profit P (in thousands of naira) from selling x units is P = –0.01x² + 5x – 50. Find maximum profit and number of units.
Answer: dP/dx = –0.02x + 5 = 0 → x = 250
d²P/dx² = –0.02 < 0 → maximum
Max profit = P(250) = –0.01(62500) + 5(250) – 50 = 1175 thousand naira
Hard (classic JAMB): A rectangular field is fenced on three sides, with the fourth side being a river. Total fencing available = 200 m. Find the dimensions for maximum area.
Answer: Let width (parallel to river) = x, length = y
2x + y = 200 → y = 200 – 2x
Area A = x(200 – 2x) = 200x – 2x²
dA/dx = 200 – 4x = 0 → x = 50 m
y = 100 m
d²A/dx² = –4 < 0 → maximum
Max area = 50 × 100 = 5000 m²
Advanced: A closed cylindrical can is to have volume 500 cm³. Find radius and height for minimum surface area.
Answer: V = πr²h = 500 → h = 500/(πr²)
Surface area S = 2πr² + 2πrh = 2πr² + 2πr(500/(πr²)) = 2πr² + 1000/r
dS/dr = 4πr – 1000/r² = 0 → 4πr³ = 1000 → r³ = 1000/(4π) → r ≈ 4.3 cm
h ≈ 8.6 cm (second derivative positive → minimum)

Common Mistakes:Forgetting to check second derivative or sign change  
Not expressing everything in terms of one variable  
Ignoring domain restrictions

Final High-Level Tips for JAMB Success:Memorise: dy/dx = 0 for stationary points
Second derivative > 0 → min, < 0 → max  
Always draw a small sketch for optimization problems  
For real-life: identify variable to maximize/minimize, express others in terms of it  
Practice 40+ questions: 15 rates, 25 optimization (area, volume, profit, cost)  
Check units and context in final answer

Application of differentiation is one of the most practical and highest-scoring topics in JAMB when you practice setting up equations and using the derivative tests correctly.You are doing excellently! Keep solving optimization problems daily and drawing graphs to visualize maxima/minima.
The next topics will continue in this same high-standard guided format.Good luck in your JAMB Mathematics – you will perform brilliantly!  Keep going!

