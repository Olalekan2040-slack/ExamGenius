/**
 * Economics Learning Content — JAMB
 * Topic keys and subtopic names match syllabus/parsed/economics_syllabus.json.
 */

const ECONOMICS_LEARNING_CONTENT = {

  "Basic Economic Concepts and Problems": {
    subject: "Economics",
    topic: "Basic Economic Concepts and Problems",
    introduction: {
      title: "Basic Economic Concepts and Problems",
      description: "Economics studies how people use scarce resources to satisfy unlimited wants. This foundation topic covers scarcity, choice, scale of preference, opportunity cost and the three basic economic problems every society must solve.",
      jambInfo: "Almost every JAMB paper opens with 3-4 questions here, especially on opportunity cost and scarcity."
    },
    subtopics: [
      {
        name: "Economics as a Science and Basic Concepts",
        objectives: [
          {
            title: "Define economics and explain scarcity, choice and opportunity cost",
            explanation: `<p><strong>Economics</strong> is the social science that studies how individuals and societies allocate <em>scarce</em> resources to satisfy <em>unlimited</em> human wants.</p>
<div class="key-points">
  <h4>Core Concepts</h4>
  <ul>
    <li><strong>Scarcity</strong> — resources are limited relative to wants; the fundamental economic problem.</li>
    <li><strong>Choice</strong> — because we cannot have everything, we must choose.</li>
    <li><strong>Scale of preference</strong> — a list of wants ranked in order of importance.</li>
    <li><strong>Opportunity cost</strong> — the next best alternative forgone when a choice is made.</li>
  </ul>
</div>
<div class="example-box"><h4>Example</h4><p>If a student uses ₦5,000 to buy a textbook instead of a pair of shoes, the shoes (the next best alternative) are the opportunity cost of the textbook.</p></div>`,
            question: {
              text: "The next best alternative forgone when a choice is made is called",
              options: { "A": "scarcity", "B": "opportunity cost", "C": "scale of preference", "D": "money cost" },
              correctAnswer: "B",
              explanation: "Opportunity cost is the value of the next best alternative that is given up when a particular choice is made."
            }
          }
        ]
      },
      {
        name: "Basic Economic Problems of Society",
        objectives: [
          {
            title: "State the basic economic problems and the production possibility curve",
            explanation: `<p>Because of scarcity, every society must answer three basic questions:</p>
<div class="key-points">
  <ul>
    <li><strong>What to produce</strong> and in what quantities.</li>
    <li><strong>How to produce</strong> — which methods and resources.</li>
    <li><strong>For whom to produce</strong> — how output is distributed.</li>
  </ul>
</div>
<p>The <strong>production possibility curve (PPC)</strong> shows the maximum combinations of two goods an economy can produce with its resources fully employed. A point inside the curve shows unemployment/inefficiency; a point outside is unattainable with current resources.</p>`,
            question: {
              text: "A point inside the production possibility curve indicates that resources are",
              options: { "A": "fully and efficiently employed", "B": "under-utilised", "C": "over-utilised", "D": "unattainable" },
              correctAnswer: "B",
              explanation: "A point inside the PPC means some resources are idle or inefficiently used — the economy is producing less than it could (under-utilisation)."
            }
          }
        ]
      }
    ]
  },

  "Economic Systems": {
    subject: "Economics",
    topic: "Economic Systems",
    introduction: {
      title: "Economic Systems",
      description: "An economic system is the way a society organises the production and distribution of goods and services. This topic compares capitalism, socialism and the mixed economy.",
      jambInfo: "2-3 questions, usually on the features of a named system or how it answers the basic economic questions."
    },
    subtopics: [
      {
        name: "Types of Economic Systems",
        objectives: [
          {
            title: "Compare capitalism, socialism and mixed economy",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Capitalism (free market)</strong> — private ownership, profit motive, price mechanism allocates resources. E.g. USA.</li>
    <li><strong>Socialism (command/planned)</strong> — state ownership, central planning, production for social welfare. E.g. former USSR.</li>
    <li><strong>Mixed economy</strong> — both private and public sectors operate; most countries, including Nigeria, use this.</li>
  </ul>
</div>
<div class="warning-box"><h4>Key Point</h4><p>Under capitalism the <strong>price mechanism (forces of demand and supply)</strong> decides what is produced; under socialism the <strong>state</strong> decides.</p></div>`,
            question: {
              text: "In a capitalist economy, resources are allocated mainly by",
              options: { "A": "government planning", "B": "the price mechanism", "C": "tradition", "D": "the central bank" },
              correctAnswer: "B",
              explanation: "In a pure capitalist (free-market) economy, the price mechanism — the interaction of demand and supply — allocates resources."
            }
          }
        ]
      },
      {
        name: "Economic Systems in Africa and Nigeria",
        objectives: [
          {
            title: "Explain the mixed economy and the roles of the two sectors",
            explanation: `<p>Nigeria and most African countries operate a <strong>mixed economy</strong>, combining private enterprise with government participation.</p>
<div class="key-points">
  <ul>
    <li><strong>Private sector</strong> — owned by individuals/firms, driven by profit (trade, manufacturing, farming).</li>
    <li><strong>Public sector</strong> — owned by government, provides essential services and regulates the economy (roads, defence, education, utilities).</li>
  </ul>
</div>`,
            question: {
              text: "The economic system operated in Nigeria is best described as",
              options: { "A": "pure capitalism", "B": "pure socialism", "C": "a mixed economy", "D": "subsistence economy" },
              correctAnswer: "C",
              explanation: "Nigeria runs a mixed economy in which both the private sector and government (public sector) take part in economic activities."
            }
          }
        ]
      }
    ]
  },

  "Methods and Tools of Economic Analysis": {
    subject: "Economics",
    topic: "Methods and Tools of Economic Analysis",
    introduction: {
      title: "Methods and Tools of Economic Analysis",
      description: "Economists use data and simple statistics to analyse behaviour. This topic covers positive vs normative economics, data presentation, and measures of central tendency and dispersion.",
      jambInfo: "2-3 questions, often a quick calculation of mean, median or mode from a data set."
    },
    subtopics: [
      {
        name: "Scientific Approach and Basic Tools",
        objectives: [
          {
            title: "Distinguish positive from normative economics",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Positive economics</strong> deals with facts — statements that can be tested and verified ("A rise in price reduces quantity demanded").</li>
    <li><strong>Normative economics</strong> deals with opinions and value judgements ("Government should reduce fuel prices").</li>
  </ul>
</div>
<p>Basic tools of presentation include tables, bar charts, pie charts, line graphs and equations.</p>`,
            question: {
              text: "Which of the following is a normative economic statement?",
              options: { "A": "Inflation rose by 5% last year", "B": "The government should subsidise education", "C": "Demand fell when price increased", "D": "Nigeria's GDP is over ₦200 trillion" },
              correctAnswer: "B",
              explanation: "A normative statement expresses an opinion or value judgement about what ought to be. 'The government should subsidise education' is normative; the others state verifiable facts."
            }
          }
        ]
      },
      {
        name: "Measures of Central Tendency and Dispersion",
        objectives: [
          {
            title: "Calculate mean, median and mode",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Mean</strong> = sum of values ÷ number of values.</li>
    <li><strong>Median</strong> = middle value when data are arranged in order.</li>
    <li><strong>Mode</strong> = the most frequently occurring value.</li>
  </ul>
</div>
<div class="example-box"><h4>Example</h4><p>Data: 2, 4, 4, 6, 9. Mean = (2+4+4+6+9)/5 = 25/5 = <strong>5</strong>. Median = <strong>4</strong> (middle). Mode = <strong>4</strong> (appears twice).</p></div>`,
            question: {
              text: "Find the median of the data set: 7, 3, 9, 5, 11.",
              options: { "A": "5", "B": "7", "C": "9", "D": "11" },
              correctAnswer: "B",
              explanation: "Arrange in order: 3, 5, 7, 9, 11. The middle value is 7, so the median is 7."
            }
          }
        ]
      }
    ]
  },

  "Theory of Demand": {
    subject: "Economics",
    topic: "Theory of Demand",
    introduction: {
      title: "Theory of Demand",
      description: "Demand is the quantity of a good consumers are willing and able to buy at various prices. This topic covers the law of demand, the demand curve, its determinants, and elasticity of demand.",
      jambInfo: "A high-yield topic — 3-5 questions, especially on the law of demand, shifts vs movements, and elasticity."
    },
    subtopics: [
      {
        name: "Demand: Concepts, Schedule and Curve",
        objectives: [
          {
            title: "State the law of demand and distinguish shifts from movements",
            explanation: `<p><strong>Law of demand:</strong> other things being equal, the higher the price, the lower the quantity demanded, and vice versa. This gives a demand curve sloping <strong>downward</strong> from left to right.</p>
<div class="key-points">
  <ul>
    <li>A <strong>change in quantity demanded</strong> (a movement along the curve) is caused by a change in the good's own price.</li>
    <li>A <strong>change in demand</strong> (a shift of the whole curve) is caused by other factors: income, prices of related goods, taste, population, expectations.</li>
  </ul>
</div>`,
            question: {
              text: "A movement along a demand curve is caused by a change in the",
              options: { "A": "consumers' income", "B": "price of the commodity", "C": "taste of consumers", "D": "population" },
              correctAnswer: "B",
              explanation: "A change in the commodity's own price causes a movement along the demand curve (a change in quantity demanded). The other factors shift the entire curve."
            }
          }
        ]
      },
      {
        name: "Elasticity of Demand",
        objectives: [
          {
            title: "Calculate and interpret price elasticity of demand",
            explanation: `<p><strong>Price elasticity of demand (PED)</strong> measures how responsive quantity demanded is to a change in price.</p>
<div class="key-points"><ul><li>PED = %&nbsp;change in quantity demanded ÷ %&nbsp;change in price.</li>
  <li>PED &gt; 1: <strong>elastic</strong>; PED &lt; 1: <strong>inelastic</strong>; PED = 1: <strong>unitary</strong>.</li></ul></div>
<div class="example-box"><h4>Example</h4><p>Price falls 10% and quantity demanded rises 20%. PED = 20% ÷ 10% = <strong>2</strong> (elastic).</p></div>`,
            question: {
              text: "If a 10% fall in price leads to a 5% rise in quantity demanded, demand is",
              options: { "A": "elastic", "B": "inelastic", "C": "unitary", "D": "perfectly elastic" },
              correctAnswer: "B",
              explanation: "PED = 5% ÷ 10% = 0.5, which is less than 1, so demand is inelastic (quantity is not very responsive to price)."
            }
          }
        ]
      }
    ]
  },

  "Consumer Behaviour and Utility": {
    subject: "Economics",
    topic: "Consumer Behaviour and Utility",
    introduction: {
      title: "Consumer Behaviour and Utility",
      description: "This topic explains how consumers get satisfaction (utility) from goods and how they reach equilibrium, using both the utility and indifference-curve approaches.",
      jambInfo: "2-3 questions, most often on the law of diminishing marginal utility."
    },
    subtopics: [
      {
        name: "Utility Theory",
        objectives: [
          {
            title: "Explain total and marginal utility and the law of diminishing marginal utility",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Utility</strong> — satisfaction derived from consuming a good.</li>
    <li><strong>Total utility (TU)</strong> — total satisfaction from all units consumed.</li>
    <li><strong>Marginal utility (MU)</strong> — the extra utility from one more unit.</li>
  </ul>
</div>
<p><strong>Law of diminishing marginal utility:</strong> as more units of a good are consumed, the extra satisfaction from each additional unit falls. TU is maximum when MU = 0.</p>`,
            question: {
              text: "As a consumer eats more units of a good, the satisfaction from each additional unit tends to",
              options: { "A": "increase", "B": "remain constant", "C": "decrease", "D": "become infinite" },
              correctAnswer: "C",
              explanation: "This is the law of diminishing marginal utility — each successive unit consumed yields less additional satisfaction than the one before."
            }
          }
        ]
      },
      {
        name: "Indifference Curve Analysis",
        objectives: [
          {
            title: "Explain indifference curves and consumer equilibrium",
            explanation: `<div class="key-points">
  <ul>
    <li>An <strong>indifference curve</strong> joins combinations of two goods that give the consumer equal satisfaction.</li>
    <li>It slopes downward and is convex to the origin (diminishing marginal rate of substitution).</li>
    <li>The <strong>budget line</strong> shows combinations the consumer can afford. Equilibrium is where the budget line is <strong>tangent</strong> to the highest attainable indifference curve.</li>
  </ul>
</div>`,
            question: {
              text: "Consumer equilibrium in indifference curve analysis occurs where the budget line",
              options: { "A": "cuts the indifference curve twice", "B": "is tangent to the highest attainable indifference curve", "C": "lies below all indifference curves", "D": "is vertical" },
              correctAnswer: "B",
              explanation: "The consumer is in equilibrium where the budget line just touches (is tangent to) the highest indifference curve he can reach, maximising satisfaction within his income."
            }
          }
        ]
      }
    ]
  },

  "Theory of Supply": {
    subject: "Economics",
    topic: "Theory of Supply",
    introduction: {
      title: "Theory of Supply",
      description: "Supply is the quantity of a good producers are willing to offer for sale at various prices. This topic covers the law of supply, the supply curve, its determinants and elasticity of supply.",
      jambInfo: "2-4 questions, often paired with demand for equilibrium analysis."
    },
    subtopics: [
      {
        name: "Supply: Concepts, Schedule and Curve",
        objectives: [
          {
            title: "State the law of supply and its determinants",
            explanation: `<p><strong>Law of supply:</strong> other things being equal, the higher the price, the greater the quantity supplied. The supply curve slopes <strong>upward</strong> from left to right.</p>
<div class="key-points"><h4>Determinants of Supply (shift factors)</h4>
  <ul><li>Cost of production, technology, prices of related goods, taxes and subsidies, weather (for farm goods), number of producers.</li></ul></div>`,
            question: {
              text: "The supply curve normally slopes upward from left to right because",
              options: { "A": "higher prices reduce output", "B": "producers supply more at higher prices", "C": "demand rises with price", "D": "costs always fall" },
              correctAnswer: "B",
              explanation: "By the law of supply, producers are willing to offer more for sale as price rises, giving an upward-sloping supply curve."
            }
          }
        ]
      },
      {
        name: "Elasticity of Supply",
        objectives: [
          {
            title: "Calculate price elasticity of supply",
            explanation: `<p><strong>Price elasticity of supply (PES)</strong> = %&nbsp;change in quantity supplied ÷ %&nbsp;change in price.</p>
<div class="key-points"><ul>
  <li>PES &gt; 1 elastic; PES &lt; 1 inelastic; PES = 1 unitary.</li>
  <li>Supply is more elastic when producers can adjust output easily and when there is more time.</li>
</ul></div>`,
            question: {
              text: "If price rises by 20% and quantity supplied rises by 20%, the elasticity of supply is",
              options: { "A": "0", "B": "0.5", "C": "1", "D": "2" },
              correctAnswer: "C",
              explanation: "PES = 20% ÷ 20% = 1, which is unitary elasticity of supply."
            }
          }
        ]
      }
    ]
  },

  "Price Determination and Market Equilibrium": {
    subject: "Economics",
    topic: "Price Determination and Market Equilibrium",
    introduction: {
      title: "Price Determination and Market Equilibrium",
      description: "The interaction of demand and supply determines the market price. This topic covers equilibrium price and quantity, and the effects of government price control.",
      jambInfo: "3-4 questions, including reading equilibrium off a schedule and the effects of price ceilings/floors."
    },
    subtopics: [
      {
        name: "Equilibrium Price and Quantity",
        objectives: [
          {
            title: "Determine equilibrium price and quantity",
            explanation: `<p><strong>Equilibrium</strong> occurs where quantity demanded equals quantity supplied — the demand and supply curves intersect.</p>
<div class="key-points">
  <ul>
    <li>Above equilibrium price → <strong>surplus</strong> (excess supply), pushing price down.</li>
    <li>Below equilibrium price → <strong>shortage</strong> (excess demand), pushing price up.</li>
  </ul>
</div>`,
            question: {
              text: "Market equilibrium is reached when",
              options: { "A": "supply exceeds demand", "B": "demand exceeds supply", "C": "quantity demanded equals quantity supplied", "D": "price is fixed by government" },
              correctAnswer: "C",
              explanation: "Equilibrium exists where quantity demanded equals quantity supplied, so there is neither surplus nor shortage."
            }
          }
        ]
      },
      {
        name: "Price Control",
        objectives: [
          {
            title: "Explain price ceiling and price floor",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Price ceiling (maximum price)</strong> — set <em>below</em> equilibrium to protect consumers; causes <strong>shortages</strong> and black markets.</li>
    <li><strong>Price floor (minimum price)</strong> — set <em>above</em> equilibrium to protect producers (e.g. minimum wage, farm price support); causes <strong>surpluses</strong>.</li>
  </ul>
</div>`,
            question: {
              text: "A government-imposed maximum price set below the equilibrium price usually leads to",
              options: { "A": "a surplus", "B": "a shortage", "C": "equilibrium", "D": "higher supply" },
              correctAnswer: "B",
              explanation: "A price ceiling below equilibrium makes quantity demanded exceed quantity supplied, creating a shortage (and often a black market)."
            }
          }
        ]
      }
    ]
  },

  "Theory of Production": {
    subject: "Economics",
    topic: "Theory of Production",
    introduction: {
      title: "Theory of Production",
      description: "Production is the creation of goods and services to satisfy wants. This topic covers types of production, the factors of production and their rewards, and the law of diminishing returns.",
      jambInfo: "3-4 questions, especially on factors of production and their rewards."
    },
    subtopics: [
      {
        name: "Production: Concepts and Factors",
        objectives: [
          {
            title: "Identify the factors of production and their rewards",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Land</strong> — natural resources; reward is <strong>rent</strong>.</li>
    <li><strong>Labour</strong> — human effort; reward is <strong>wages/salary</strong>.</li>
    <li><strong>Capital</strong> — man-made aids to production; reward is <strong>interest</strong>.</li>
    <li><strong>Entrepreneurship</strong> — organises the other factors and bears risk; reward is <strong>profit</strong>.</li>
  </ul>
</div>`,
            question: {
              text: "The reward for entrepreneurship as a factor of production is",
              options: { "A": "rent", "B": "wages", "C": "interest", "D": "profit" },
              correctAnswer: "D",
              explanation: "The entrepreneur organises the other factors and bears business risk; the reward for this is profit."
            }
          }
        ]
      },
      {
        name: "Production Functions and Returns",
        objectives: [
          {
            title: "State the law of diminishing returns",
            explanation: `<p><strong>Law of diminishing returns (variable proportions):</strong> as more of a variable factor is added to a fixed factor, total product first rises at an increasing rate, then at a decreasing rate, and may eventually fall. Marginal product eventually declines.</p>
<div class="warning-box"><h4>Note</h4><p>This is a short-run law because at least one factor (usually land or capital) is fixed.</p></div>`,
            question: {
              text: "The law of diminishing returns operates in the",
              options: { "A": "long run only", "B": "short run", "C": "very long run", "D": "market period only" },
              correctAnswer: "B",
              explanation: "Diminishing returns is a short-run law: it applies when at least one factor of production is fixed and only the variable factor is increased."
            }
          }
        ]
      }
    ]
  },

  "Costs and Revenue": {
    subject: "Economics",
    topic: "Costs and Revenue",
    introduction: {
      title: "Costs and Revenue",
      description: "Firms weigh costs against revenue to decide output and measure profit. This topic covers fixed, variable, average and marginal cost, and total, average and marginal revenue.",
      jambInfo: "3-4 questions, often a calculation of average or marginal cost/revenue."
    },
    subtopics: [
      {
        name: "Cost Concepts",
        objectives: [
          {
            title: "Distinguish fixed, variable, average and marginal cost",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Fixed cost (FC)</strong> — does not change with output (rent, insurance).</li>
    <li><strong>Variable cost (VC)</strong> — changes with output (raw materials, wages).</li>
    <li><strong>Total cost (TC)</strong> = FC + VC.</li>
    <li><strong>Average cost (AC)</strong> = TC ÷ output.</li>
    <li><strong>Marginal cost (MC)</strong> = change in TC from producing one more unit.</li>
  </ul>
</div>
<div class="example-box"><h4>Example</h4><p>If TC of 10 units is ₦500, AC = 500 ÷ 10 = <strong>₦50</strong>.</p></div>`,
            question: {
              text: "Which of the following is a fixed cost?",
              options: { "A": "Wages of casual workers", "B": "Cost of raw materials", "C": "Rent on factory building", "D": "Electricity used in production" },
              correctAnswer: "C",
              explanation: "Rent on the factory building must be paid regardless of output, so it is a fixed cost. The others vary with the level of production."
            }
          }
        ]
      },
      {
        name: "Revenue Concepts and Profit",
        objectives: [
          {
            title: "Define total, average and marginal revenue",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Total revenue (TR)</strong> = price × quantity sold.</li>
    <li><strong>Average revenue (AR)</strong> = TR ÷ quantity = price.</li>
    <li><strong>Marginal revenue (MR)</strong> = change in TR from selling one more unit.</li>
    <li><strong>Profit</strong> = TR − TC; the firm maximises profit where MR = MC.</li>
  </ul>
</div>`,
            question: {
              text: "If a firm sells 20 units at ₦15 each, its total revenue is",
              options: { "A": "₦35", "B": "₦300", "C": "₦150", "D": "₦200" },
              correctAnswer: "B",
              explanation: "Total revenue = price × quantity = ₦15 × 20 = ₦300."
            }
          }
        ]
      }
    ]
  },

  "Market Structures": {
    subject: "Economics",
    topic: "Market Structures",
    introduction: {
      title: "Market Structures",
      description: "Market structure describes the competitive environment of a firm. This topic covers perfect competition and the imperfect markets: monopoly, monopolistic competition and oligopoly.",
      jambInfo: "3-4 questions on the features of each structure, especially perfect competition and monopoly."
    },
    subtopics: [
      {
        name: "Perfect Competition",
        objectives: [
          {
            title: "State the features of perfect competition",
            explanation: `<div class="key-points">
  <ul>
    <li>Many buyers and sellers; each is a <strong>price taker</strong>.</li>
    <li>Homogeneous (identical) products.</li>
    <li>Free entry and exit of firms.</li>
    <li>Perfect knowledge of the market.</li>
    <li>The firm's demand curve is perfectly elastic (horizontal); AR = MR = price.</li>
  </ul>
</div>`,
            question: {
              text: "A distinguishing feature of a perfectly competitive market is that",
              options: { "A": "there is a single seller", "B": "products are differentiated", "C": "firms are price takers", "D": "entry is restricted" },
              correctAnswer: "C",
              explanation: "In perfect competition there are so many firms selling identical products that no single firm can influence price — each is a price taker."
            }
          }
        ]
      },
      {
        name: "Imperfect Markets: Monopoly, Monopolistic Competition and Oligopoly",
        objectives: [
          {
            title: "Distinguish monopoly, monopolistic competition and oligopoly",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Monopoly</strong> — a single seller with no close substitutes; a price maker protected by barriers to entry.</li>
    <li><strong>Monopolistic competition</strong> — many firms selling <em>differentiated</em> products (branding, advertising). E.g. soap, toothpaste.</li>
    <li><strong>Oligopoly</strong> — a few large firms dominate; interdependent decisions; may collude. E.g. telecoms, cement.</li>
  </ul>
</div>`,
            question: {
              text: "A market dominated by a single seller with no close substitute is called",
              options: { "A": "oligopoly", "B": "monopoly", "C": "monopolistic competition", "D": "perfect competition" },
              correctAnswer: "B",
              explanation: "A monopoly exists where there is only one seller of a product that has no close substitutes, giving the firm price-making power."
            }
          }
        ]
      }
    ]
  },

  "National Income": {
    subject: "Economics",
    topic: "National Income",
    introduction: {
      title: "National Income",
      description: "National income measures the total value of goods and services produced by a country. This topic covers GDP, GNP and related concepts, methods of measurement, and the circular flow.",
      jambInfo: "3-4 questions on national-income concepts and measurement problems."
    },
    subtopics: [
      {
        name: "National Income Concepts and Measurement",
        objectives: [
          {
            title: "Define GDP, GNP and the methods of measurement",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>GDP</strong> — value of all goods and services produced <em>within</em> a country in a year.</li>
    <li><strong>GNP</strong> = GDP + net income from abroad.</li>
    <li><strong>NNP</strong> = GNP − depreciation.</li>
  </ul>
  <h4>Three Methods of Measurement</h4>
  <ul><li>Output (product) method, income method, expenditure method — all should give the same total.</li></ul>
</div>`,
            question: {
              text: "Gross National Product (GNP) is equal to GDP plus",
              options: { "A": "depreciation", "B": "net income from abroad", "C": "indirect taxes", "D": "subsidies" },
              correctAnswer: "B",
              explanation: "GNP = GDP + net income earned by a country's citizens from abroad (income received from abroad minus income paid abroad)."
            }
          }
        ]
      },
      {
        name: "Uses and Determinants of National Income",
        objectives: [
          {
            title: "Explain the circular flow and the multiplier",
            explanation: `<div class="key-points">
  <ul>
    <li>The <strong>circular flow of income</strong> shows money moving between households (who supply factors) and firms (who pay incomes and sell goods).</li>
    <li><strong>Injections</strong> (investment, government spending, exports) raise income; <strong>leakages</strong> (savings, taxes, imports) reduce it.</li>
    <li>The <strong>multiplier</strong> shows that a change in injections causes a larger change in national income.</li>
  </ul>
</div>`,
            question: {
              text: "Which of the following is a leakage from the circular flow of income?",
              options: { "A": "Investment", "B": "Government spending", "C": "Savings", "D": "Exports" },
              correctAnswer: "C",
              explanation: "Savings, taxes and imports are leakages (withdrawals) from the circular flow; investment, government spending and exports are injections."
            }
          }
        ]
      }
    ]
  },

  "Money and Inflation": {
    subject: "Economics",
    topic: "Money and Inflation",
    introduction: {
      title: "Money and Inflation",
      description: "Money oils the wheels of exchange. This topic covers the nature and functions of money and the causes, effects and control of inflation and deflation.",
      jambInfo: "3-4 questions, very commonly on the functions of money and types/causes of inflation."
    },
    subtopics: [
      {
        name: "Money: Nature and Functions",
        objectives: [
          {
            title: "State the functions and characteristics of money",
            explanation: `<div class="key-points">
  <h4>Functions of Money</h4>
  <ul>
    <li><strong>Medium of exchange</strong> — solves the double coincidence of wants of barter.</li>
    <li><strong>Measure/unit of value</strong> — a common yardstick for prices.</li>
    <li><strong>Store of value</strong> — wealth can be kept in money form.</li>
    <li><strong>Standard of deferred payment</strong> — used for credit and future payments.</li>
  </ul>
  <h4>Characteristics</h4>
  <ul><li>Acceptability, durability, portability, divisibility, homogeneity, relative scarcity.</li></ul>
</div>`,
            question: {
              text: "The primary function of money that solves the problem of double coincidence of wants is its use as a",
              options: { "A": "store of value", "B": "medium of exchange", "C": "measure of value", "D": "standard of deferred payment" },
              correctAnswer: "B",
              explanation: "As a medium of exchange, money removes the need for a double coincidence of wants that hampered the barter system."
            }
          }
        ]
      },
      {
        name: "Inflation and Deflation",
        objectives: [
          {
            title: "Explain types, causes and control of inflation",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Inflation</strong> — a persistent rise in the general price level.</li>
    <li><strong>Demand-pull</strong> — too much money chasing too few goods.</li>
    <li><strong>Cost-push</strong> — rising production costs push up prices.</li>
    <li><strong>Control:</strong> monetary policy (reduce money supply), fiscal policy (raise taxes/cut spending), increase output.</li>
  </ul>
</div>`,
            question: {
              text: "Inflation caused by an increase in the cost of raw materials and wages is called",
              options: { "A": "demand-pull inflation", "B": "cost-push inflation", "C": "hyperinflation", "D": "creeping inflation" },
              correctAnswer: "B",
              explanation: "Cost-push inflation results from rising costs of production (raw materials, wages), which force producers to raise prices."
            }
          }
        ]
      }
    ]
  },

  "Financial Institutions": {
    subject: "Economics",
    topic: "Financial Institutions",
    introduction: {
      title: "Financial Institutions",
      description: "Financial institutions mobilise savings and provide credit. This topic covers commercial banks and credit creation, the central bank and monetary policy, and the money and capital markets.",
      jambInfo: "3-4 questions on functions of the central bank, credit creation and monetary policy instruments."
    },
    subtopics: [
      {
        name: "Commercial Banks and Other Financial Institutions",
        objectives: [
          {
            title: "Explain the functions of commercial banks and credit creation",
            explanation: `<div class="key-points">
  <h4>Functions of Commercial Banks</h4>
  <ul><li>Accept deposits, give loans and overdrafts, provide payment services, and create credit.</li></ul>
</div>
<p><strong>Credit creation</strong> is the ability of banks to expand the money supply by lending out a large part of the deposits they receive, keeping only a fraction as reserves.</p>`,
            question: {
              text: "The ability of commercial banks to expand the money supply through lending is known as",
              options: { "A": "open market operation", "B": "credit creation", "C": "rediscounting", "D": "clearing" },
              correctAnswer: "B",
              explanation: "Credit creation is the process by which commercial banks multiply deposits into a larger money supply by lending out most of the money deposited."
            }
          }
        ]
      },
      {
        name: "The Central Bank and Monetary Policy",
        objectives: [
          {
            title: "Explain the functions of the central bank and monetary policy tools",
            explanation: `<div class="key-points">
  <h4>Functions of the Central Bank (CBN)</h4>
  <ul><li>Issues currency, banker to government and to banks, lender of last resort, manages monetary policy and foreign reserves.</li></ul>
  <h4>Monetary Policy Instruments</h4>
  <ul><li>Open market operations (OMO), bank/discount rate, cash reserve ratio, liquidity ratio, moral suasion, special directives.</li></ul>
</div>`,
            question: {
              text: "Which of the following is a function of the Central Bank?",
              options: { "A": "Accepting deposits from the public", "B": "Issuing legal-tender currency", "C": "Retail lending to individuals", "D": "Selling shares on the stock exchange" },
              correctAnswer: "B",
              explanation: "Issuing the nation's legal-tender currency is a core function of the central bank. Retail deposits and lending to the public are done by commercial banks."
            }
          }
        ]
      },
      {
        name: "Money and Capital Markets",
        objectives: [
          {
            title: "Distinguish money market from capital market",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Money market</strong> — deals in <em>short-term</em> funds and instruments (treasury bills, call money, commercial paper).</li>
    <li><strong>Capital market</strong> — deals in <em>long-term</em> funds (shares, stocks, bonds/debentures); the Nigerian Exchange is the main institution.</li>
  </ul>
</div>`,
            question: {
              text: "Treasury bills are instruments traded on the",
              options: { "A": "capital market", "B": "money market", "C": "foreign exchange market", "D": "commodity market" },
              correctAnswer: "B",
              explanation: "Treasury bills are short-term government securities, so they are traded on the money market, not the long-term capital market."
            }
          }
        ]
      }
    ]
  },

  "Public Finance": {
    subject: "Economics",
    topic: "Public Finance",
    introduction: {
      title: "Public Finance",
      description: "Public finance studies how government raises and spends money. This topic covers taxation, government revenue and expenditure, and budgets as fiscal-policy tools.",
      jambInfo: "3-4 questions on types of tax, canons of taxation, and types of budget."
    },
    subtopics: [
      {
        name: "Taxation",
        objectives: [
          {
            title: "Distinguish direct from indirect taxes and tax systems",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Direct tax</strong> — levied on income/wealth, paid directly (PAYE, company tax).</li>
    <li><strong>Indirect tax</strong> — levied on goods/services, paid indirectly (VAT, customs/excise duty).</li>
    <li><strong>Progressive</strong> — rate rises with income; <strong>proportional</strong> — same rate; <strong>regressive</strong> — rate falls as income rises.</li>
  </ul>
</div>`,
            question: {
              text: "Value Added Tax (VAT) is an example of a",
              options: { "A": "direct tax", "B": "indirect tax", "C": "progressive income tax", "D": "capital gains tax" },
              correctAnswer: "B",
              explanation: "VAT is levied on the consumption of goods and services and is collected through sellers, making it an indirect tax."
            }
          }
        ]
      },
      {
        name: "Government Revenue, Expenditure and Budgets",
        objectives: [
          {
            title: "Explain types of budget as fiscal-policy tools",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Balanced budget</strong> — revenue = expenditure.</li>
    <li><strong>Surplus budget</strong> — revenue &gt; expenditure; used to fight inflation.</li>
    <li><strong>Deficit budget</strong> — expenditure &gt; revenue; used to fight unemployment/recession, financed by borrowing.</li>
  </ul>
</div>`,
            question: {
              text: "A budget in which government's proposed expenditure exceeds its expected revenue is a",
              options: { "A": "balanced budget", "B": "surplus budget", "C": "deficit budget", "D": "capital budget" },
              correctAnswer: "C",
              explanation: "A deficit budget is one where planned expenditure exceeds expected revenue; it is often used to stimulate a depressed economy."
            }
          }
        ]
      }
    ]
  },

  "Economic Growth and Development": {
    subject: "Economics",
    topic: "Economic Growth and Development",
    introduction: {
      title: "Economic Growth and Development",
      description: "This topic distinguishes growth from development, identifies indicators of development and the features of developing economies, and covers development planning.",
      jambInfo: "2-3 questions, often on the difference between growth and development or characteristics of developing countries."
    },
    subtopics: [
      {
        name: "Concepts of Growth and Development",
        objectives: [
          {
            title: "Distinguish economic growth from economic development",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Economic growth</strong> — a quantitative increase in national output (real GDP) over time.</li>
    <li><strong>Economic development</strong> — growth <em>plus</em> improvements in welfare: structural change, better health, education, income distribution and reduced poverty.</li>
  </ul>
</div>
<div class="warning-box"><h4>Key</h4><p>All development involves growth, but growth alone (rising GDP) is not development if living standards do not improve.</p></div>`,
            question: {
              text: "Which of the following best distinguishes economic development from economic growth?",
              options: { "A": "A rise in real GDP", "B": "Improvement in the general welfare and structure of the economy", "C": "An increase in population", "D": "A rise in the price level" },
              correctAnswer: "B",
              explanation: "Development goes beyond a mere rise in output (growth) to include qualitative improvements in welfare, structure and living standards."
            }
          }
        ]
      },
      {
        name: "Development Planning",
        objectives: [
          {
            title: "Explain development planning and its problems in Nigeria",
            explanation: `<p><strong>Development planning</strong> is a deliberate government effort to coordinate the use of resources to achieve stated economic goals over a period.</p>
<div class="key-points"><h4>Problems in Nigeria</h4>
  <ul><li>Inadequate data, shortage of funds and skilled manpower, corruption, political instability, and over-dependence on oil revenue.</li></ul></div>`,
            question: {
              text: "A major problem of development planning in Nigeria is",
              options: { "A": "abundance of accurate statistical data", "B": "inadequate funds and unreliable data", "C": "surplus of skilled manpower", "D": "political stability" },
              correctAnswer: "B",
              explanation: "Development plans in Nigeria are hampered by inadequate funds, unreliable statistical data, shortage of skilled manpower and corruption."
            }
          }
        ]
      }
    ]
  },

  "Agriculture in the Nigerian Economy": {
    subject: "Economics",
    topic: "Agriculture in the Nigerian Economy",
    introduction: {
      title: "Agriculture in the Nigerian Economy",
      description: "Agriculture employs a large share of Nigerians. This topic covers its contributions, systems, marketing, problems and government policies.",
      jambInfo: "2-3 questions on the contributions and problems of agriculture in Nigeria."
    },
    subtopics: [
      {
        name: "Role and Systems of Agriculture",
        objectives: [
          {
            title: "Explain the contributions of agriculture",
            explanation: `<div class="key-points">
  <h4>Contributions of Agriculture</h4>
  <ul>
    <li>Provides food for the population and raw materials for industry.</li>
    <li>Employment and income for the rural population.</li>
    <li>Source of foreign exchange (cash crops) and government revenue.</li>
    <li>A market for industrial goods.</li>
  </ul>
</div>`,
            question: {
              text: "Which of the following is NOT a contribution of agriculture to the Nigerian economy?",
              options: { "A": "Provision of food", "B": "Supply of raw materials to industry", "C": "Provision of foreign exchange", "D": "Printing of the national currency" },
              correctAnswer: "D",
              explanation: "Printing currency is a function of the central bank, not agriculture. Agriculture provides food, raw materials, employment and foreign exchange."
            }
          }
        ]
      },
      {
        name: "Problems and Policies of Agriculture",
        objectives: [
          {
            title: "Identify problems of agriculture and government policies",
            explanation: `<div class="key-points">
  <h4>Problems</h4>
  <ul><li>Land tenure system, poor storage/processing, inadequate finance, use of crude tools, poor transport, pests and diseases, rural-urban migration.</li></ul>
  <h4>Policies/Programmes</h4>
  <ul><li>Operation Feed the Nation, River Basin Development Authorities, Agricultural Credit Guarantee Scheme, Anchor Borrowers' Programme.</li></ul>
</div>`,
            question: {
              text: "Which of the following is a problem facing agriculture in Nigeria?",
              options: { "A": "Adequate storage facilities", "B": "The land tenure system", "C": "Cheap and abundant credit", "D": "Modern mechanised farming everywhere" },
              correctAnswer: "B",
              explanation: "The land tenure system, which fragments land and makes large-scale farming difficult, is a major problem facing Nigerian agriculture."
            }
          }
        ]
      }
    ]
  },

  "Industry and Industrialization": {
    subject: "Economics",
    topic: "Industry and Industrialization",
    introduction: {
      title: "Industry and Industrialization",
      description: "This topic covers the meaning of industry, factors influencing the location of industries, industrialization strategies and the role of small and medium enterprises.",
      jambInfo: "2-3 questions, often on factors of industrial location or localisation."
    },
    subtopics: [
      {
        name: "Industrial Concepts and Location",
        objectives: [
          {
            title: "Explain factors influencing industrial location",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Raw materials</strong> — weight-losing industries locate near materials.</li>
    <li><strong>Power and water</strong> supply.</li>
    <li><strong>Labour</strong> — availability and cost.</li>
    <li><strong>Market</strong> — perishable/weight-gaining goods locate near consumers.</li>
    <li><strong>Transport, capital and government policy.</strong></li>
  </ul>
</div>`,
            question: {
              text: "Industries that use heavy, weight-losing raw materials tend to locate near the",
              options: { "A": "market", "B": "source of raw materials", "C": "seaport", "D": "airport" },
              correctAnswer: "B",
              explanation: "Weight-losing industries lose much of their raw material's weight in processing, so they locate near the raw materials to save transport costs."
            }
          }
        ]
      },
      {
        name: "Industrialization Strategies and Problems",
        objectives: [
          {
            title: "Explain import substitution and export promotion",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Import substitution</strong> — producing locally goods that were formerly imported, to save foreign exchange.</li>
    <li><strong>Export promotion</strong> — producing manufactured goods for export to earn foreign exchange.</li>
  </ul>
  <h4>Problems of Industrialization in Nigeria</h4>
  <ul><li>Inadequate power, capital and infrastructure; over-dependence on imported inputs; low local demand.</li></ul>
</div>`,
            question: {
              text: "An industrialization strategy aimed at producing locally the goods formerly imported is called",
              options: { "A": "export promotion", "B": "import substitution", "C": "privatization", "D": "commercialization" },
              correctAnswer: "B",
              explanation: "Import substitution industrialization replaces imported goods with locally produced ones to conserve foreign exchange and build local industry."
            }
          }
        ]
      }
    ]
  },

  "Natural Resources and the Nigerian Economy": {
    subject: "Economics",
    topic: "Natural Resources and the Nigerian Economy",
    introduction: {
      title: "Natural Resources and the Nigerian Economy",
      description: "This topic covers Nigeria's natural resources, especially petroleum, and the contributions of the manufacturing and service sectors.",
      jambInfo: "2-3 questions, frequently on the role of petroleum and the dangers of over-dependence on oil."
    },
    subtopics: [
      {
        name: "Petroleum and Other Mineral Resources",
        objectives: [
          {
            title: "Explain the role of petroleum and dangers of over-dependence",
            explanation: `<div class="key-points">
  <ul>
    <li>Petroleum is Nigeria's main foreign-exchange earner and largest source of government revenue.</li>
    <li><strong>OPEC</strong> regulates output and prices among oil-exporting nations; <strong>NNPC</strong> manages Nigeria's oil.</li>
  </ul>
  <h4>Dangers of Over-Dependence on Oil</h4>
  <ul><li>Vulnerability to price shocks, neglect of agriculture and manufacturing, "Dutch disease", and environmental damage.</li></ul>
</div>`,
            question: {
              text: "A major danger of Nigeria's over-dependence on petroleum is",
              options: { "A": "stable government revenue", "B": "vulnerability to oil price fluctuations", "C": "growth of the agricultural sector", "D": "reduced pollution" },
              correctAnswer: "B",
              explanation: "Relying heavily on oil exposes the economy to sharp swings in government revenue whenever world oil prices fall, and encourages neglect of other sectors."
            }
          }
        ]
      },
      {
        name: "Manufacturing and Service Sectors",
        objectives: [
          {
            title: "Describe the contributions of manufacturing and services",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Manufacturing</strong> adds value to raw materials, creates jobs and reduces imports.</li>
    <li><strong>Services</strong> (banking, telecoms, transport, tourism) are a growing share of Nigeria's GDP and provide widespread employment.</li>
  </ul>
</div>`,
            question: {
              text: "Banking, insurance and telecommunications belong to which sector of the economy?",
              options: { "A": "Primary sector", "B": "Secondary sector", "C": "Tertiary (service) sector", "D": "Extractive sector" },
              correctAnswer: "C",
              explanation: "Banking, insurance and telecommunications provide services rather than extract or manufacture goods, so they belong to the tertiary (service) sector."
            }
          }
        ]
      }
    ]
  },

  "Business Organizations": {
    subject: "Economics",
    topic: "Business Organizations",
    introduction: {
      title: "Business Organizations",
      description: "Businesses take different legal forms. This topic covers private business organizations and public enterprises, including privatization and commercialization.",
      jambInfo: "2-3 questions on the features of business units, especially limited liability companies."
    },
    subtopics: [
      {
        name: "Private Business Organizations",
        objectives: [
          {
            title: "Compare sole proprietorship, partnership and companies",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Sole proprietorship</strong> — one owner, unlimited liability, easy to form.</li>
    <li><strong>Partnership</strong> — 2–20 owners, shared profits and unlimited liability (except limited partners).</li>
    <li><strong>Limited liability company</strong> — separate legal entity, limited liability, owned by shareholders; can be private (Ltd) or public (Plc).</li>
  </ul>
</div>
<div class="warning-box"><h4>Limited Liability</h4><p>Shareholders can lose only the amount they invested — their personal assets are protected.</p></div>`,
            question: {
              text: "A major advantage of a limited liability company over a sole proprietorship is",
              options: { "A": "ease of formation", "B": "unlimited liability", "C": "limited liability of owners", "D": "secrecy of accounts" },
              correctAnswer: "C",
              explanation: "In a limited liability company, shareholders' liability is limited to their investment, unlike a sole proprietor who has unlimited liability."
            }
          }
        ]
      },
      {
        name: "Public Enterprises and Privatization",
        objectives: [
          {
            title: "Explain privatization and commercialization",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Privatization</strong> — transfer of ownership of public enterprises to private hands.</li>
    <li><strong>Commercialization</strong> — reorganising a public enterprise to run profitably like a private firm while remaining government-owned.</li>
  </ul>
  <h4>Reasons</h4>
  <ul><li>Improve efficiency, reduce the burden on government, raise revenue and encourage private investment.</li></ul>
</div>`,
            question: {
              text: "The transfer of ownership of a government enterprise to private individuals is called",
              options: { "A": "commercialization", "B": "nationalization", "C": "privatization", "D": "indigenization" },
              correctAnswer: "C",
              explanation: "Privatization is the sale or transfer of ownership of public (government) enterprises to private individuals or companies."
            }
          }
        ]
      }
    ]
  },

  "Population and Labour": {
    subject: "Economics",
    topic: "Population and Labour",
    introduction: {
      title: "Population and Labour",
      description: "This topic covers population theories, structure and distribution, and the labour market including wages and unemployment.",
      jambInfo: "3-4 questions on population theories (Malthus), optimum population and types of unemployment."
    },
    subtopics: [
      {
        name: "Population Theories, Structure and Distribution",
        objectives: [
          {
            title: "Explain the Malthusian theory and optimum population",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Malthus</strong> argued population grows geometrically (1,2,4,8…) while food grows arithmetically (1,2,3,4…), leading to famine unless checked.</li>
    <li><strong>Optimum population</strong> — the population size that gives the highest output per head given available resources.</li>
    <li><strong>Over-population</strong> exceeds optimum; <strong>under-population</strong> is below it.</li>
  </ul>
</div>`,
            question: {
              text: "According to Malthus, population tends to grow in a ______ progression while food supply grows in an ______ progression.",
              options: { "A": "arithmetic; geometric", "B": "geometric; arithmetic", "C": "constant; rising", "D": "falling; rising" },
              correctAnswer: "B",
              explanation: "Malthus held that population grows geometrically (doubling) while food supply grows only arithmetically, so population would outrun food."
            }
          }
        ]
      },
      {
        name: "Labour Market and Unemployment",
        objectives: [
          {
            title: "Identify types and causes of unemployment",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Frictional</strong> — short-term, between jobs.</li>
    <li><strong>Structural</strong> — skills no longer match available jobs.</li>
    <li><strong>Cyclical (demand-deficient)</strong> — caused by recession/low demand.</li>
    <li><strong>Seasonal</strong> — work available only part of the year.</li>
    <li><strong>Disguised</strong> — more workers than needed (common in farming).</li>
  </ul>
</div>`,
            question: {
              text: "Unemployment that arises when workers' skills no longer match the jobs available is called",
              options: { "A": "frictional unemployment", "B": "seasonal unemployment", "C": "structural unemployment", "D": "cyclical unemployment" },
              correctAnswer: "C",
              explanation: "Structural unemployment occurs when changes in the economy leave workers with skills that no longer match the available jobs."
            }
          }
        ]
      }
    ]
  },

  "International Trade": {
    subject: "Economics",
    topic: "International Trade",
    introduction: {
      title: "International Trade",
      description: "International trade is the exchange of goods and services across national borders. This topic covers the basis for trade, comparative advantage, protectionism, and the balance of payments and exchange rates.",
      jambInfo: "3-4 questions on comparative advantage, balance of payments and terms of trade."
    },
    subtopics: [
      {
        name: "Basis and Theory of International Trade",
        objectives: [
          {
            title: "Explain comparative advantage and protectionism",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Comparative advantage:</strong> a country should specialise in and export goods it can produce at a lower <em>opportunity cost</em>, even if another country is better at producing everything.</li>
    <li><strong>Protectionism</strong> restricts imports using <strong>tariffs</strong> (taxes on imports), <strong>quotas</strong> (quantity limits) and embargoes, to protect local industries.</li>
  </ul>
</div>`,
            question: {
              text: "A tax imposed on imported goods is called a",
              options: { "A": "quota", "B": "tariff", "C": "subsidy", "D": "embargo" },
              correctAnswer: "B",
              explanation: "A tariff is a tax or duty imposed on imported goods, used to raise revenue and protect domestic industries. A quota limits quantity; an embargo bans trade."
            }
          }
        ]
      },
      {
        name: "Balance of Payments and Exchange Rates",
        objectives: [
          {
            title: "Distinguish balance of trade from balance of payments; explain devaluation",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Balance of trade</strong> — the difference between the value of <em>visible</em> exports and imports only.</li>
    <li><strong>Balance of payments</strong> — a record of <em>all</em> transactions (visible + invisible + capital) between a country and the rest of the world.</li>
    <li><strong>Devaluation</strong> — a deliberate reduction in the value of a currency to make exports cheaper and imports dearer.</li>
  </ul>
</div>`,
            question: {
              text: "The balance of trade refers to the difference between a country's",
              options: { "A": "total revenue and expenditure", "B": "visible exports and visible imports", "C": "savings and investment", "D": "exports of services only" },
              correctAnswer: "B",
              explanation: "The balance of trade is the difference between the value of visible (goods) exports and visible imports. Adding invisibles and capital flows gives the balance of payments."
            }
          }
        ]
      }
    ]
  },

  "International Economic Organizations": {
    subject: "Economics",
    topic: "International Economic Organizations",
    introduction: {
      title: "International Economic Organizations",
      description: "Countries cooperate through global and regional bodies. This topic covers the IMF, World Bank, WTO, OPEC and regional groups such as ECOWAS and the African Union.",
      jambInfo: "2-3 questions on the objectives and functions of these organizations."
    },
    subtopics: [
      {
        name: "Global Economic Organizations",
        objectives: [
          {
            title: "State the functions of the IMF, World Bank and WTO",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>IMF</strong> — promotes monetary cooperation, exchange-rate stability and provides short-term balance-of-payments support.</li>
    <li><strong>World Bank</strong> — provides long-term loans for development projects.</li>
    <li><strong>WTO</strong> — promotes and regulates free international trade among members.</li>
    <li><strong>OPEC</strong> — coordinates petroleum policies and prices among oil-exporting countries.</li>
  </ul>
</div>`,
            question: {
              text: "The international organization that provides long-term loans for development projects is the",
              options: { "A": "IMF", "B": "World Bank", "C": "WTO", "D": "OPEC" },
              correctAnswer: "B",
              explanation: "The World Bank provides long-term finance for development projects, whereas the IMF gives short-term balance-of-payments support."
            }
          }
        ]
      },
      {
        name: "Regional Economic Organizations",
        objectives: [
          {
            title: "State the objectives of ECOWAS and the AU",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>ECOWAS</strong> (1975) — promotes economic integration and free movement of people and goods in West Africa.</li>
    <li><strong>African Union (AU)</strong> — promotes unity, peace and development across Africa; its bank is the African Development Bank (AfDB).</li>
  </ul>
</div>`,
            question: {
              text: "The main aim of ECOWAS is to promote",
              options: { "A": "military alliance", "B": "economic integration in West Africa", "C": "religious unity", "D": "a single world currency" },
              correctAnswer: "B",
              explanation: "ECOWAS was formed to promote economic integration and cooperation among West African states, including free movement of goods and people."
            }
          }
        ]
      }
    ]
  }

};

window.ECONOMICS_LEARNING_CONTENT = ECONOMICS_LEARNING_CONTENT;
