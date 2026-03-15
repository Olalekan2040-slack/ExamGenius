"""
build_missing_syllabi.py
------------------------
Rebuilds proper syllabus JSON files for subjects that have 0 objectives.
Targets: Geography, English, Literature in English, Economics, Commerce.

Run from project root:
    python scripts/build_missing_syllabi.py
"""

import json
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "syllabus" / "parsed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def write(subject_slug: str, data: dict):
    path = OUTPUT_DIR / f"{subject_slug}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    topics = len(data.get("topics", []))
    objs = sum(
        sum(len(st.get("objectives", [])) for st in t.get("subtopics", []))
        for t in data.get("topics", [])
    )
    print(f"  ✓ {subject_slug}.json — {topics} topics, {objs} objectives")


# ─────────────────────────────────────────────────────────────────────
# ECONOMICS
# ─────────────────────────────────────────────────────────────────────
ECONOMICS = {
    "subject": "Economics",
    "topics": [
        {
            "number": 1, "name": "Introduction to Economics",
            "subtopics": [
                {"name": "Definition and Scope of Economics", "objectives": [
                    "Define economics and explain its relevance to everyday life",
                    "Identify the basic economic problems of scarcity, choice, and opportunity cost",
                    "Distinguish between microeconomics and macroeconomics",
                ]},
                {"name": "Economic Systems", "objectives": [
                    "Describe the characteristics of capitalism, socialism, and mixed economies",
                    "Compare the advantages and disadvantages of each economic system",
                    "Explain how Nigeria's economy is classified",
                ]},
                {"name": "Production Possibility Frontier", "objectives": [
                    "Draw and interpret a Production Possibility Frontier (PPF)",
                    "Use the PPF to illustrate opportunity cost and trade-offs",
                    "Explain what causes the PPF to shift outward or inward",
                ]},
            ]
        },
        {
            "number": 2, "name": "Demand Theory",
            "subtopics": [
                {"name": "Meaning and Determinants of Demand", "objectives": [
                    "Define demand and distinguish it from want or need",
                    "List and explain the determinants of demand",
                    "Construct a demand schedule and draw a demand curve",
                ]},
                {"name": "Law of Demand and Demand Elasticity", "objectives": [
                    "State and explain the law of demand with examples",
                    "Calculate price elasticity of demand (PED) and interpret the result",
                    "Distinguish between elastic, inelastic, and unitary demand",
                    "Explain income elasticity and cross elasticity of demand",
                ]},
                {"name": "Shifts in the Demand Curve", "objectives": [
                    "Differentiate between a change in quantity demanded and a change in demand",
                    "Identify factors that cause the demand curve to shift",
                    "Analyse consumer response to price changes",
                ]},
            ]
        },
        {
            "number": 3, "name": "Consumer Behaviour",
            "subtopics": [
                {"name": "Utility Theory", "objectives": [
                    "Define utility, total utility (TU), and marginal utility (MU)",
                    "State and apply the law of diminishing marginal utility",
                    "Explain consumer equilibrium using the marginal utility approach",
                ]},
                {"name": "Indifference Curve Analysis", "objectives": [
                    "Draw and interpret an indifference curve and a budget line",
                    "Explain consumer equilibrium using indifference curve analysis",
                    "Describe income and substitution effects of a price change",
                ]},
            ]
        },
        {
            "number": 4, "name": "Supply Theory",
            "subtopics": [
                {"name": "Meaning and Determinants of Supply", "objectives": [
                    "Define supply and list its determinants",
                    "Construct a supply schedule and draw a supply curve",
                    "State and explain the law of supply with examples",
                ]},
                {"name": "Elasticity of Supply", "objectives": [
                    "Define price elasticity of supply (PES) and calculate it",
                    "Distinguish between elastic and inelastic supply",
                    "Identify factors that determine elasticity of supply",
                ]},
            ]
        },
        {
            "number": 5, "name": "Price Determination",
            "subtopics": [
                {"name": "Market Equilibrium", "objectives": [
                    "Explain how equilibrium price and quantity are determined in a market",
                    "Use demand and supply diagrams to show equilibrium",
                    "Analyse the effects of shifts in demand and supply on equilibrium",
                ]},
                {"name": "Price Controls", "objectives": [
                    "Define price ceiling and price floor and give Nigerian examples",
                    "Explain the effects of price controls on markets",
                    "Describe the black market as a consequence of price controls",
                ]},
            ]
        },
        {
            "number": 6, "name": "Theory of Production",
            "subtopics": [
                {"name": "Factors of Production", "objectives": [
                    "Identify and describe the four factors of production: land, labour, capital, entrepreneur",
                    "Explain the rewards to each factor of production",
                    "Distinguish between fixed and variable factors",
                ]},
                {"name": "Laws of Production", "objectives": [
                    "Explain the law of diminishing returns with an example",
                    "Distinguish between short-run and long-run production",
                    "Explain returns to scale: increasing, constant, decreasing",
                ]},
            ]
        },
        {
            "number": 7, "name": "Costs and Revenue",
            "subtopics": [
                {"name": "Cost Concepts", "objectives": [
                    "Define and calculate fixed cost, variable cost, and total cost",
                    "Calculate average cost (AC), average variable cost (AVC), and marginal cost (MC)",
                    "Draw and interpret short-run cost curves",
                ]},
                {"name": "Revenue Concepts", "objectives": [
                    "Define total revenue (TR), average revenue (AR), and marginal revenue (MR)",
                    "Relate revenue curves to demand elasticity",
                    "Determine the profit-maximising output using TR and TC",
                ]},
            ]
        },
        {
            "number": 8, "name": "Market Structures",
            "subtopics": [
                {"name": "Perfect Competition", "objectives": [
                    "List the features of a perfectly competitive market",
                    "Explain how price is determined under perfect competition",
                    "Compute profit/loss for a firm in perfect competition",
                ]},
                {"name": "Monopoly", "objectives": [
                    "Define monopoly and identify its causes in Nigeria",
                    "Explain price and output determination under monopoly",
                    "Compare monopoly with perfect competition",
                ]},
                {"name": "Monopolistic Competition and Oligopoly", "objectives": [
                    "Identify features of monopolistic competition with Nigerian examples",
                    "Explain oligopoly and kinked demand curve",
                    "Describe non-price competition (advertising, branding)",
                ]},
            ]
        },
        {
            "number": 9, "name": "National Income",
            "subtopics": [
                {"name": "National Income Concepts", "objectives": [
                    "Define GDP, GNP, NNP, and National Income",
                    "Distinguish between gross and net, domestic and national income measures",
                    "Explain the difference between nominal and real national income",
                ]},
                {"name": "Measurement of National Income", "objectives": [
                    "Explain the three methods of measuring national income",
                    "Calculate national income given relevant data",
                    "Identify the practical difficulties in measuring national income in Nigeria",
                ]},
            ]
        },
        {
            "number": 10, "name": "Money and Banking",
            "subtopics": [
                {"name": "Money: Functions and Types", "objectives": [
                    "Define money and list its functions",
                    "Describe the characteristics of a good money",
                    "Distinguish between commodity money, paper money, and credit money",
                ]},
                {"name": "Commercial Banking", "objectives": [
                    "Describe the functions of commercial banks in Nigeria",
                    "Explain the process of credit creation by commercial banks",
                    "Identify the role of the Central Bank of Nigeria (CBN)",
                ]},
                {"name": "Inflation", "objectives": [
                    "Define inflation and distinguish between demand-pull and cost-push inflation",
                    "Explain the effects of inflation on the economy",
                    "Describe the monetary and fiscal measures to control inflation",
                ]},
            ]
        },
        {
            "number": 11, "name": "Financial Institutions",
            "subtopics": [
                {"name": "Banking and Non-Banking Institutions", "objectives": [
                    "Identify Nigerian financial institutions: CBN, commercial banks, development banks, microfinance banks",
                    "Explain the roles of insurance companies, stock exchange, and capital markets",
                    "Describe the Nigerian Stock Exchange and its functions",
                ]},
                {"name": "Public Finance", "objectives": [
                    "Define public finance and distinguish it from private finance",
                    "Explain sources of government revenue: taxes, fees, grants",
                    "Describe types of taxation: direct and indirect taxes in Nigeria",
                    "Explain the objectives of government expenditure and budget deficits",
                ]},
            ]
        },
        {
            "number": 12, "name": "Economic Development",
            "subtopics": [
                {"name": "Economic Growth vs Development", "objectives": [
                    "Distinguish between economic growth and economic development",
                    "List indicators of economic development: HDI, GDP per capita, literacy rate",
                    "Identify obstacles to economic development in Nigeria",
                ]},
                {"name": "Agriculture in Nigeria", "objectives": [
                    "Describe the role of agriculture in Nigeria's economy",
                    "Identify problems facing Nigerian agriculture",
                    "Explain government policies to improve agricultural output in Nigeria",
                ]},
                {"name": "Industrialisation in Nigeria", "objectives": [
                    "Explain the importance of industrialisation to Nigeria's development",
                    "Identify factors affecting industrial location",
                    "Describe problems of industrialisation in Nigeria and solutions",
                ]},
            ]
        },
        {
            "number": 13, "name": "International Trade",
            "subtopics": [
                {"name": "Basis and Benefits of International Trade", "objectives": [
                    "Explain the theory of comparative advantage",
                    "List the benefits and problems of international trade",
                    "Describe the balance of trade and balance of payments",
                ]},
                {"name": "Foreign Exchange and Trade Policy", "objectives": [
                    "Define exchange rate and distinguish between fixed and floating rates",
                    "Explain tariffs, quotas, and subsidies as trade protection tools",
                    "Describe the roles of IMF, World Bank, WTO, and ECOWAS",
                ]},
            ]
        },
        {
            "number": 14, "name": "Population and Labour",
            "subtopics": [
                {"name": "Population Theory", "objectives": [
                    "Explain Malthusian population theory",
                    "Describe factors affecting population growth in Nigeria",
                    "Distinguish between over-population, under-population, and optimum population",
                ]},
                {"name": "Labour Market", "objectives": [
                    "Define labour force and distinguish it from total population",
                    "Explain demand for and supply of labour",
                    "Describe wage determination and the role of trade unions in Nigeria",
                ]},
            ]
        },
        {
            "number": 15, "name": "Business Organisations",
            "subtopics": [
                {"name": "Forms of Business Organisation", "objectives": [
                    "Describe sole proprietorship, partnerships, private and public limited companies",
                    "Explain the features, advantages, and disadvantages of each form",
                    "Distinguish between public enterprises and privatised enterprises in Nigeria",
                ]},
                {"name": "Cooperatives and Multinationals", "objectives": [
                    "Explain the concept of cooperative societies in Nigeria",
                    "Describe the role of multinational corporations (MNCs) in Nigeria",
                    "Evaluate the advantages and disadvantages of MNCs to the Nigerian economy",
                ]},
            ]
        },
    ]
}

# ─────────────────────────────────────────────────────────────────────
# COMMERCE
# ─────────────────────────────────────────────────────────────────────
COMMERCE = {
    "subject": "Commerce",
    "topics": [
        {
            "number": 1, "name": "Nature and Scope of Commerce",
            "subtopics": [
                {"name": "Commerce and Trade", "objectives": [
                    "Define commerce and explain its scope",
                    "Distinguish between commerce, trade, and aids to trade",
                    "Explain the role of commerce in economic development",
                ]},
                {"name": "Occupations and Division of Labour", "objectives": [
                    "Classify occupations into primary, secondary, and tertiary",
                    "Explain division of labour and specialisation",
                    "Assess the advantages and disadvantages of specialisation",
                ]},
            ]
        },
        {
            "number": 2, "name": "Production",
            "subtopics": [
                {"name": "Types and Factors of Production", "objectives": [
                    "Define production and distinguish between direct and indirect production",
                    "Identify the four factors of production and their rewards",
                    "Explain scale of production: large-scale and small-scale",
                ]},
                {"name": "Chain of Distribution", "objectives": [
                    "Describe the chain of distribution from producer to consumer",
                    "Explain the roles of wholesalers, retailers, and agents",
                    "Discuss the trend towards cutting out middlemen (disintermediation)",
                ]},
            ]
        },
        {
            "number": 3, "name": "Home and Foreign Trade",
            "subtopics": [
                {"name": "Home Trade: Retail and Wholesale", "objectives": [
                    "Distinguish between retail and wholesale trade",
                    "Describe types of retailers: market traders, supermarkets, department stores, cooperative stores",
                    "Explain the functions and services of wholesalers",
                ]},
                {"name": "Trade Documents", "objectives": [
                    "List and explain essential trade documents: invoice, receipt, bill of lading, letter of credit",
                    "Explain the purpose of a pro forma invoice, delivery note, and statement of account",
                    "Distinguish between debit note and credit note",
                ]},
                {"name": "Foreign Trade", "objectives": [
                    "Explain the basis of international trade",
                    "Define balance of trade and balance of payments; distinguish between them",
                    "Describe the role of ECOWAS in promoting trade among West African countries",
                ]},
            ]
        },
        {
            "number": 4, "name": "Advertising",
            "subtopics": [
                {"name": "Types and Objectives of Advertising", "objectives": [
                    "Define advertising and explain its objectives",
                    "Classify advertising: informative, persuasive, reminder advertising",
                    "Identify media of advertising and their advantages/disadvantages",
                ]},
                {"name": "Effects of Advertising", "objectives": [
                    "Explain the benefits of advertising to producers, consumers, and society",
                    "Identify the negative effects of advertising (misleading ads, high prices)",
                ]},
            ]
        },
        {
            "number": 5, "name": "Banking",
            "subtopics": [
                {"name": "Types of Banks and Their Functions", "objectives": [
                    "Distinguish between the Central Bank of Nigeria (CBN) and commercial banks",
                    "Explain the functions of commercial banks",
                    "Describe the services provided by banks: savings, loans, transfers, foreign exchange",
                ]},
                {"name": "Negotiable Instruments", "objectives": [
                    "Define a cheque and describe different types; explain crossing a cheque",
                    "Explain a bill of exchange and its uses in commerce",
                    "Describe promissory notes and their role in trade",
                ]},
            ]
        },
        {
            "number": 6, "name": "Insurance",
            "subtopics": [
                {"name": "Principles of Insurance", "objectives": [
                    "Explain the principles of insurance: insurable interest, utmost good faith, indemnity, subrogation",
                    "Distinguish between life assurance and general insurance",
                    "Identify types of insurance: fire, motor, marine, fidelity guarantee",
                ]},
                {"name": "Insurance Documents and Terms", "objectives": [
                    "Explain the roles of a proposal form, policy, and premium",
                    "Describe the significance of over-insurance and under-insurance",
                    "Explain reinsurance and co-insurance",
                ]},
            ]
        },
        {
            "number": 7, "name": "Transportation and Communication",
            "subtopics": [
                {"name": "Modes of Transportation", "objectives": [
                    "Describe road, rail, water, air, and pipeline transport",
                    "Identify factors influencing choice of transport",
                    "Explain documents used in transportation: bill of lading, air waybill, consignment note",
                ]},
                {"name": "Communication in Commerce", "objectives": [
                    "Explain the importance of communication to commerce",
                    "Identify modes of communication: telephone, email, postal services, fax",
                    "Describe the role of ICT in modern commerce and e-commerce",
                ]},
            ]
        },
        {
            "number": 8, "name": "Warehousing",
            "subtopics": [
                {"name": "Functions and Types of Warehouses", "objectives": [
                    "Define warehousing and explain its importance to commerce",
                    "Describe types of warehouses: public, private, bonded warehouses",
                    "Explain the functions of a warehouse",
                ]},
            ]
        },
        {
            "number": 9, "name": "Business Organisations",
            "subtopics": [
                {"name": "Forms of Business Ownership", "objectives": [
                    "Describe sole proprietorship, partnerships, and limited liability companies",
                    "Explain the formation, advantages, and disadvantages of each type",
                    "Distinguish between private and public limited companies",
                ]},
                {"name": "Cooperative Societies", "objectives": [
                    "Define cooperative society and identify its types",
                    "Explain the principles and advantages of cooperatives in Nigeria",
                    "Describe public enterprises and their privatisation in Nigeria",
                ]},
            ]
        },
        {
            "number": 10, "name": "Financing Business",
            "subtopics": [
                {"name": "Sources of Business Finance", "objectives": [
                    "Identify short-term, medium-term, and long-term sources of finance",
                    "Explain debentures, shares, and retained profits as sources of finance",
                    "Describe the role of microfinance banks in financing small businesses",
                ]},
                {"name": "Stock Exchange", "objectives": [
                    "Describe the functions of the Nigerian Stock Exchange (NGX)",
                    "Distinguish between ordinary shares, preference shares, and debentures",
                    "Explain the role of stockbrokers and the process of buying/selling shares",
                ]},
            ]
        },
        {
            "number": 11, "name": "Marketing",
            "subtopics": [
                {"name": "Marketing Mix", "objectives": [
                    "Define marketing and explain the 4 Ps: product, price, place, promotion",
                    "Describe market research and its importance to business",
                    "Explain consumer behaviour and its influence on marketing strategy",
                ]},
            ]
        },
        {
            "number": 12, "name": "Tourism",
            "subtopics": [
                {"name": "Tourism and Its Importance", "objectives": [
                    "Define tourism and distinguish between domestic and international tourism",
                    "Explain the economic importance of tourism to Nigeria",
                    "Identify problems facing tourism development in Nigeria and solutions",
                ]},
            ]
        },
        {
            "number": 13, "name": "Money",
            "subtopics": [
                {"name": "Functions and Characteristics of Money", "objectives": [
                    "Define money and describe its functions: medium of exchange, store of value, unit of account",
                    "List the characteristics of a good money",
                    "Describe the forms of money: coins, notes, cheques, digital money",
                ]},
            ]
        },
    ]
}

# ─────────────────────────────────────────────────────────────────────
# GEOGRAPHY
# ─────────────────────────────────────────────────────────────────────
GEOGRAPHY = {
    "subject": "Geography",
    "topics": [
        {
            "number": 1, "name": "Practical Geography: Maps and Scale",
            "subtopics": [
                {"name": "Maps: Types and Uses", "objectives": [
                    "Define a map and identify different types of maps",
                    "Describe the uses of topographical, sketch, and thematic maps",
                    "Read conventional signs and symbols on topographical maps",
                ]},
                {"name": "Scale and Measurement", "objectives": [
                    "Apply different types of scale: statement scale, linear scale, and representative fraction",
                    "Measure distances, areas, and calculate gradients from topographical maps",
                    "Reduce and enlarge maps using scale",
                ]},
                {"name": "Map Reading and Interpretation", "objectives": [
                    "Draw cross-section profiles from contour lines",
                    "Identify and describe physical and human features on topographical maps",
                    "Determine directions and bearings from maps",
                ]},
            ]
        },
        {
            "number": 2, "name": "Statistical Data Interpretation",
            "subtopics": [
                {"name": "Graphs, Charts and Diagrams", "objectives": [
                    "Draw and interpret bar graphs, line graphs, and pie charts from data",
                    "Interpret dot maps, choropleth maps, and flow maps",
                    "Compute statistical information from geographical data",
                ]},
            ]
        },
        {
            "number": 3, "name": "Geographic Information System (GIS)",
            "subtopics": [
                {"name": "GIS Components and Applications", "objectives": [
                    "Define GIS and describe its key components",
                    "Identify data sources for GIS: remote sensing, GPS, map digitising",
                    "Explain the applications of GIS in Nigeria: agriculture, defence, urban planning",
                ]},
            ]
        },
        {
            "number": 4, "name": "The Earth as a Planet",
            "subtopics": [
                {"name": "Earth in the Solar System", "objectives": [
                    "Identify the relative positions of planets in the solar system",
                    "Explain the effects of the Earth's rotation: day and night, time zones",
                    "Explain the effects of the Earth's revolution: seasons, equinoxes, solstices",
                ]},
                {"name": "Latitudes and Longitudes", "objectives": [
                    "Define latitude and longitude and draw key parallels and meridians",
                    "Calculate local time differences using longitudes",
                    "Distinguish between the equator, tropics, and polar circles",
                ]},
            ]
        },
        {
            "number": 5, "name": "The Earth's Crust",
            "subtopics": [
                {"name": "Structure of the Earth", "objectives": [
                    "Describe the internal layers of the Earth: crust, mantle, outer core, inner core",
                    "Explain the interrelationship among atmosphere, biosphere, hydrosphere, and lithosphere",
                    "Distinguish between continental and oceanic crust",
                ]},
                {"name": "Rocks", "objectives": [
                    "Classify rocks into igneous, sedimentary, and metamorphic types",
                    "Describe the mode of formation and uses of each rock type",
                    "Explain the rock cycle",
                ]},
                {"name": "Earth Movements and Landforms", "objectives": [
                    "Distinguish between folding and faulting as tectonic processes",
                    "Describe landforms produced by folding (fold mountains) and faulting (rift valleys, horsts)",
                    "Identify and describe major landforms: mountains, plateaux, plains, coastal landforms",
                ]},
            ]
        },
        {
            "number": 6, "name": "Volcanism and Earthquakes",
            "subtopics": [
                {"name": "Volcanic Activity", "objectives": [
                    "Explain the causes of volcanic eruptions",
                    "Describe types of volcanoes: shield, composite, cinder cone",
                    "Identify landforms associated with volcanic activity",
                ]},
                {"name": "Earthquakes", "objectives": [
                    "Explain causes of earthquakes and define focus, epicentre, seismic waves",
                    "Describe the measurement of earthquakes using the Richter scale",
                    "Give examples of major earthquakes and their effects",
                ]},
            ]
        },
        {
            "number": 7, "name": "Weathering and Erosion",
            "subtopics": [
                {"name": "Weathering", "objectives": [
                    "Distinguish between physical, chemical, and biological weathering",
                    "Describe processes of weathering with Nigerian examples",
                    "Explain the importance of weathering in soil formation",
                ]},
                {"name": "Erosion and Transportation", "objectives": [
                    "Identify agents of erosion: wind, water, ice, sea",
                    "Describe Nigeria's erosion problem and its causes",
                    "Explain deposition and the landforms it produces",
                ]},
            ]
        },
        {
            "number": 8, "name": "Drainage and Water Bodies",
            "subtopics": [
                {"name": "Rivers and River Action", "objectives": [
                    "Describe the three stages of a river: youthful, mature, old age",
                    "Identify landforms produced by rivers: gorges, meanders, oxbow lakes, deltas",
                    "Explain the drainage patterns in Nigeria",
                ]},
                {"name": "Oceans, Lakes and Coasts", "objectives": [
                    "Describe ocean currents and their effects on climate and fishing",
                    "Classify lakes: tectonic, volcanic, glacial, man-made",
                    "Identify coastal landforms: cliffs, bays, beaches, spits, lagoons",
                ]},
            ]
        },
        {
            "number": 9, "name": "Weather and Climate",
            "subtopics": [
                {"name": "Elements and Factors of Climate", "objectives": [
                    "Distinguish between weather and climate",
                    "Identify elements of weather: temperature, rainfall, humidity, wind, pressure",
                    "Explain factors controlling climate: altitude, latitude, ocean currents, vegetation",
                ]},
                {"name": "Climate Types and Classification", "objectives": [
                    "Describe Koppen's climate classification",
                    "Identify Nigeria's climate types: tropical humid, tropical dry, savanna",
                    "Explain the concept of monsoon and its effects in West Africa",
                ]},
                {"name": "Climate Change", "objectives": [
                    "Define climate change and the greenhouse effect",
                    "Identify causes and effects of global warming",
                    "Describe Nigeria's response to climate change",
                ]},
            ]
        },
        {
            "number": 10, "name": "Vegetation and Soils",
            "subtopics": [
                {"name": "Vegetation Zones", "objectives": [
                    "Describe Nigeria's vegetation zones: mangrove, rainforest, Guinea savanna, Sudan savanna, Sahel",
                    "Relate vegetation distribution to climate and soil",
                    "Explain the impact of human activities on vegetation",
                ]},
                {"name": "Soils", "objectives": [
                    "Define soil and describe its formation processes",
                    "Describe the soil profile and its horizons",
                    "Identify major soil types in the tropics and their agricultural uses",
                    "Explain soil erosion, degradation, and conservation methods",
                ]},
            ]
        },
        {
            "number": 11, "name": "Population",
            "subtopics": [
                {"name": "Population Distribution and Growth", "objectives": [
                    "Describe global and Nigerian population distribution patterns",
                    "Explain factors affecting population distribution",
                    "Distinguish between under-population, over-population, and optimum population",
                ]},
                {"name": "Population Dynamics", "objectives": [
                    "Define birth rate, death rate, and natural increase",
                    "Describe the demographic transition model",
                    "Explain the effects of migration on population structure",
                ]},
            ]
        },
        {
            "number": 12, "name": "Settlements",
            "subtopics": [
                {"name": "Types and Patterns of Settlement", "objectives": [
                    "Distinguish between rural and urban settlements",
                    "Identify settlement patterns: dispersed, nucleated, linear",
                    "Explain factors influencing settlement location",
                ]},
                {"name": "Urban Settlements", "objectives": [
                    "Define urbanisation and describe its trends in Nigeria",
                    "Explain urban problems in Nigeria: congestion, pollution, unemployment, slums",
                    "Describe urban planning and the concept of garden cities",
                ]},
            ]
        },
        {
            "number": 13, "name": "Economic Activities",
            "subtopics": [
                {"name": "Agriculture", "objectives": [
                    "Classify farming systems: subsistence, commercial, intensive, extensive",
                    "Identify major crops and livestock in Nigeria and their distribution",
                    "Explain problems and prospects of agriculture in Nigeria",
                ]},
                {"name": "Industry and Trade", "objectives": [
                    "Classify industries: primary, secondary, tertiary",
                    "Explain factors of industrial location with Nigerian examples",
                    "Describe world trade patterns and Nigeria's major imports and exports",
                ]},
            ]
        },
        {
            "number": 14, "name": "Nigeria and West Africa",
            "subtopics": [
                {"name": "Physical and Human Geography of Nigeria", "objectives": [
                    "Describe Nigeria's location, political divisions, and major ethnic groups",
                    "Explain Nigeria's relief, drainage, climate, vegetation, and soils",
                    "Describe Nigeria's natural resources: petroleum, solid minerals, water, vegetation",
                ]},
                {"name": "ECOWAS and Regional Cooperation", "objectives": [
                    "State the meaning and objectives of ECOWAS",
                    "Identify ECOWAS member countries and locate them on a map",
                    "Evaluate the achievements, problems, and future of ECOWAS",
                ]},
            ]
        },
    ]
}


# ─────────────────────────────────────────────────────────────────────
# ENGLISH LANGUAGE
# ─────────────────────────────────────────────────────────────────────
ENGLISH = {
    "subject": "English",
    "topics": [
        {
            "number": 1, "name": "Comprehension",
            "subtopics": [
                {"name": "Reading for Comprehension", "objectives": [
                    "Identify the main idea and supporting details in a passage",
                    "Answer comprehension questions correctly using evidence from a passage",
                    "Infer the meaning of unfamiliar words from context",
                    "Recognise the tone, mood, and purpose of a passage",
                ]},
                {"name": "Summary Writing", "objectives": [
                    "Identify key points in a passage for summary",
                    "Write a concise, accurate summary in your own words",
                    "Avoid padding and irrelevant information in a summary",
                ]},
            ]
        },
        {
            "number": 2, "name": "Lexis and Structure",
            "subtopics": [
                {"name": "Vocabulary in Context", "objectives": [
                    "Use contextual clues to determine word meanings",
                    "Identify synonyms, antonyms, and homonyms",
                    "Understand collocations and idiomatic expressions",
                    "Select the most appropriate word to complete a sentence",
                ]},
                {"name": "Sentence Structure", "objectives": [
                    "Identify and write simple, compound, and complex sentences",
                    "Correctly use conjunctions, prepositions, and transitional words",
                    "Identify errors in sentence structure and correct them",
                ]},
            ]
        },
        {
            "number": 3, "name": "Grammar: Parts of Speech",
            "subtopics": [
                {"name": "Nouns and Pronouns", "objectives": [
                    "Identify types of nouns: common, proper, abstract, collective, countable, uncountable",
                    "Use pronouns correctly: personal, reflexive, relative, demonstrative, interrogative",
                    "Ensure pronoun-antecedent agreement",
                ]},
                {"name": "Verbs and Tenses", "objectives": [
                    "Identify types of verbs: transitive, intransitive, linking verbs",
                    "Use verb tenses correctly: present, past, future, perfect, progressive",
                    "Apply subject-verb agreement rules correctly",
                ]},
                {"name": "Adjectives and Adverbs", "objectives": [
                    "Identify and use adjectives correctly (attributive and predicative)",
                    "Distinguish between adjectives and adverbs",
                    "Form comparatives and superlatives correctly",
                ]},
            ]
        },
        {
            "number": 4, "name": "Grammar: Clauses and Phrases",
            "subtopics": [
                {"name": "Clauses", "objectives": [
                    "Identify main clauses and subordinate clauses",
                    "Distinguish between noun clauses, adjective clauses, and adverb clauses",
                    "Use relative clauses (defining and non-defining) correctly",
                ]},
                {"name": "Phrases", "objectives": [
                    "Identify noun phrases, verb phrases, prepositional phrases",
                    "Use participial phrases and infinitive phrases correctly",
                    "Identify dangling modifiers and correct them",
                ]},
            ]
        },
        {
            "number": 5, "name": "Phonology and Sound Patterns",
            "subtopics": [
                {"name": "English Vowel Sounds", "objectives": [
                    "Identify the 12 pure vowels (monophthongs) of English",
                    "Identify the 8 diphthongs of English",
                    "Pronounce words with correct vowel sounds and distinguish minimal pairs",
                ]},
                {"name": "English Consonants and Word Stress", "objectives": [
                    "Identify consonant sounds with special focus on plosives, fricatives, and nasals",
                    "Apply rules of word stress in two- and multi-syllable words",
                    "Identify primary stress in sentences (sentence stress)",
                ]},
                {"name": "Intonation and Connected Speech", "objectives": [
                    "Identify rising and falling intonation patterns",
                    "Explain liaison, assimilation, and elision in connected speech",
                    "Distinguish between weak forms of function words in connected speech",
                ]},
            ]
        },
        {
            "number": 6, "name": "Figures of Speech and Literary Devices",
            "subtopics": [
                {"name": "Figures of Speech", "objectives": [
                    "Identify and explain simile, metaphor, and personification",
                    "Identify hyperbole, irony, sarcasm, and understatement",
                    "Distinguish between litotes and oxymoron",
                ]},
                {"name": "Other Literary and Rhetorical Devices", "objectives": [
                    "Identify alliteration, assonance, and onomatopoeia",
                    "Explain rhetorical questions and their effect",
                    "Identify repetition, parallelism, and antithesis in texts",
                ]},
            ]
        },
        {
            "number": 7, "name": "Concord and Agreement",
            "subtopics": [
                {"name": "Subject-Verb Concord", "objectives": [
                    "Apply the rules of subject-verb agreement including irregular cases",
                    "Resolve concord with collective nouns, compound subjects, and inverted sentences",
                    "Correct errors of concord in sentences",
                ]},
                {"name": "Tense Consistency", "objectives": [
                    "Maintain consistent tense use in narratives and reports",
                    "Apply sequence of tenses in complex sentences",
                    "Identify and correct tense errors",
                ]},
            ]
        },
        {
            "number": 8, "name": "Oral Composition",
            "subtopics": [
                {"name": "Discourse and Register", "objectives": [
                    "Distinguish between formal and informal registers",
                    "Identify features of spoken and written discourse",
                    "Understand code-switching in Nigerian English contexts",
                ]},
            ]
        },
        {
            "number": 9, "name": "Written Composition",
            "subtopics": [
                {"name": "Formal Writing", "objectives": [
                    "Write formal letters: application letters, letters of complaint, official correspondence",
                    "Write reports in a correct formal structure",
                    "Write speeches and minutes of meetings",
                ]},
                {"name": "Creative Writing", "objectives": [
                    "Write narrative, descriptive, argumentative, and expository essays",
                    "Use appropriate paragraph structure: topic sentence, supporting details, conclusion",
                    "Develop coherence and cohesion in essay writing",
                ]},
            ]
        },
    ]
}


# ─────────────────────────────────────────────────────────────────────
# LITERATURE IN ENGLISH
# ─────────────────────────────────────────────────────────────────────
LITERATURE = {
    "subject": "Literature in English",
    "topics": [
        {
            "number": 1, "name": "Drama",
            "subtopics": [
                {"name": "Types of Drama", "objectives": [
                    "Define drama and identify its types: tragedy, comedy, tragicomedy, melodrama, farce",
                    "Distinguish between ancient Greek drama and modern drama",
                    "Identify at least two JAMB-prescribed dramatic texts",
                ]},
                {"name": "Dramatic Techniques", "objectives": [
                    "Explain characterisation, dialogue, soliloquy, and aside in drama",
                    "Identify the use of flashback, dramatic irony, and suspense",
                    "Describe the role of costume, setting, and stage directions",
                ]},
                {"name": "Analysis of Prescribed Dramatic Texts", "objectives": [
                    "Summarise the plot of a prescribed dramatic text",
                    "Identify major themes and how they are developed in the play",
                    "Analyse characters and their roles in the play",
                    "Explain the socio-political context of a prescribed play",
                ]},
            ]
        },
        {
            "number": 2, "name": "Prose",
            "subtopics": [
                {"name": "Types of Prose", "objectives": [
                    "Distinguish between fiction (novel, novella, short story) and non-fiction (biography, autobiography)",
                    "Describe the structure of a novel: exposition, rising action, climax, falling action, resolution",
                    "Identify faction as a blend of fact and fiction",
                ]},
                {"name": "Narrative Techniques", "objectives": [
                    "Explain point of view: first person, third person limited, third person omniscient",
                    "Describe methods of characterisation: direct and indirect",
                    "Explain the role of setting (temporal and spatial) in prose fiction",
                ]},
                {"name": "Analysis of Prescribed Prose Texts", "objectives": [
                    "Summarise the plot of a prescribed prose work",
                    "Identify and analyse themes in a prescribed novel or short story",
                    "Evaluate language and style: diction, tone, imagery",
                    "Interpret cultural and historical context of a prescribed prose work",
                ]},
            ]
        },
        {
            "number": 3, "name": "Poetry",
            "subtopics": [
                {"name": "Types of Poetry", "objectives": [
                    "Identify types of poems: sonnet, ode, elegy, ballad, lyric, epic, blank verse",
                    "Distinguish between African and Western poetic traditions",
                    "Explain the concept of oral poetry in African literature",
                ]},
                {"name": "Poetic Devices", "objectives": [
                    "Identify meter, rhythm, rhyme scheme, and line length",
                    "Explain diction, tone, mood, and persona in poetry",
                    "Identify figures of speech in poetry: metaphor, simile, personification, symbolism, imagery, irony",
                ]},
                {"name": "Interpretation of Poems", "objectives": [
                    "Paraphrase a poem accurately",
                    "Identify the theme, tone, and mood of a poem",
                    "Explain the effect of poetic devices on meaning",
                    "Analyse the relationship between form and content",
                ]},
            ]
        },
        {
            "number": 4, "name": "Aspects of Literature",
            "subtopics": [
                {"name": "Theme, Plot, and Setting", "objectives": [
                    "Define theme and identify themes common to African literature",
                    "Explain plot structure and identify the key elements: exposition, climax, denouement",
                    "Distinguish between setting as background and setting as integral to meaning",
                ]},
                {"name": "Characterisation and Conflict", "objectives": [
                    "Distinguish between protagonist, antagonist, minor, and flat characters",
                    "Identify types of conflict: man vs man, man vs nature, man vs self, man vs society",
                    "Evaluate how conflict drives the plot",
                ]},
                {"name": "Language and Style", "objectives": [
                    "Define style and identify elements: diction, sentence length, tone",
                    "Explain the use of symbols, Pidgin, and local languages in African literature",
                    "Identify irony (verbal, situational, dramatic) and its effects",
                ]},
            ]
        },
        {
            "number": 5, "name": "Literary Appreciation",
            "subtopics": [
                {"name": "Critical Evaluation", "objectives": [
                    "Write a literary appreciation of a poem using specified guidelines",
                    "Evaluate a passage from a prose or dramatic work",
                    "Support literary arguments with textual evidence",
                ]},
                {"name": "African Literature", "objectives": [
                    "Identify major themes in African literature: colonialism, identity, gender, conflict",
                    "Name major African writers: Chinua Achebe, Wole Soyinka, Ngugi wa Thiong'o, Buchi Emecheta",
                    "Explain post-colonial concerns in selected African literary works",
                ]},
            ]
        },
    ]
}


# ─────────────────────────────────────────────────────────────────────
# ACCOUNTING  — the existing JSON has topics but weak objectives;
#               let's enrich without overwriting structure.
# ─────────────────────────────────────────────────────────────────────
ACCOUNTING = {
    "subject": "Accounting",
    "topics": [
        {
            "number": 1, "name": "Principles of Double Entry",
            "subtopics": [
                {"name": "The Accounting Equation", "objectives": [
                    "State and apply the accounting equation: Assets = Liabilities + Capital",
                    "Explain the dual aspect concept underlying double entry bookkeeping",
                    "Record transactions using debit and credit entries in T-accounts",
                ]},
                {"name": "Ledger and Trial Balance", "objectives": [
                    "Distinguish between personal, real, and nominal accounts",
                    "Post transactions to the appropriate ledger accounts and balance them",
                    "Extract a trial balance and identify its limitations",
                ]},
            ]
        },
        {
            "number": 2, "name": "Ledger & Trial Balance",
            "subtopics": [
                {"name": "The Ledger", "objectives": [
                    "Explain the purpose and structure of the ledger",
                    "Classify accounts: sales ledger, purchases ledger, general ledger",
                    "Balance off ledger accounts at the end of a period",
                ]},
                {"name": "Trial Balance", "objectives": [
                    "Extract a trial balance from ledger balances",
                    "Identify errors not revealed by a trial balance",
                    "Use a suspense account to correct errors affecting the trial balance",
                ]},
            ]
        },
        {
            "number": 3, "name": "Books of Original Entry",
            "subtopics": [
                {"name": "Day Books and the Journal", "objectives": [
                    "Identify and use the books of original entry: sales, purchases, returns books, journal",
                    "Distinguish between the journal proper and other day books",
                    "Record transactions in the appropriate book of original entry",
                ]},
                {"name": "Cash Book and Petty Cash", "objectives": [
                    "Prepare single, double, and three-column cash books",
                    "Explain the imprest system and maintain a petty cash book",
                    "Record contra entries in the cash book",
                ]},
            ]
        },
        {
            "number": 4, "name": "Cashbook",
            "subtopics": [
                {"name": "Single and Double Column Cash Book", "objectives": [
                    "Record cash and bank transactions in a two-column cash book",
                    "Distinguish between cash discount and trade discount",
                    "Balance the cash book and carry down balances",
                ]},
                {"name": "Bank Reconciliation", "objectives": [
                    "Identify reasons for differences between the cash book and bank statement",
                    "Identify unpresented cheques, uncredited deposits, and bank charges",
                    "Prepare a bank reconciliation statement",
                ]},
            ]
        },
        {
            "number": 5, "name": "Trading/Profit & Loss Account",
            "subtopics": [
                {"name": "Trading Account", "objectives": [
                    "Prepare a trading account and calculate gross profit",
                    "Apply the trading account formula: Sales − Cost of Sales = Gross Profit",
                    "Adjust for opening and closing stock in the trading account",
                ]},
                {"name": "Profit and Loss Account", "objectives": [
                    "Prepare a profit and loss account and calculate net profit",
                    "Distinguish between revenue expenditure and capital expenditure",
                    "List the expenses that appear in the profit and loss account",
                ]},
            ]
        },
        {
            "number": 6, "name": "Balance Sheet",
            "subtopics": [
                {"name": "Preparing the Balance Sheet", "objectives": [
                    "Prepare a classified balance sheet with fixed assets, current assets, liabilities, and capital",
                    "Distinguish between current and non-current (fixed) assets and liabilities",
                    "Show capital, drawings, and retained profit correctly in the balance sheet",
                ]},
                {"name": "Adjustments in Final Accounts", "objectives": [
                    "Apply year-end adjustments: accruals, prepayments, depreciation, bad debts",
                    "Show the effect of each adjustment on the profit and loss account and balance sheet",
                    "Calculate depreciation using straight-line and reducing balance methods",
                ]},
            ]
        },
        {
            "number": 7, "name": "Adjustments",
            "subtopics": [
                {"name": "Accruals and Prepayments", "objectives": [
                    "Define and identify accrued expenses and prepaid (unexpired) expenses",
                    "Adjust profit and loss account entries for accruals and prepayments",
                    "Show accruals and prepayments on the balance sheet",
                ]},
                {"name": "Depreciation", "objectives": [
                    "Define depreciation and explain its causes",
                    "Calculate depreciation using straight-line and reducing balance methods",
                    "Record depreciation in the asset account and provision for depreciation account",
                ]},
                {"name": "Bad Debts and Provisions", "objectives": [
                    "Distinguish between bad debts written off and provision for bad debts",
                    "Calculate and record a new or revised provision for bad debts",
                    "Show the adjusted debtors (net realisable) figure in the balance sheet",
                ]},
            ]
        },
        {
            "number": 8, "name": "Incomplete Records",
            "subtopics": [
                {"name": "Statement of Affairs", "objectives": [
                    "Explain incomplete records and single entry bookkeeping",
                    "Prepare a statement of affairs to find opening or closing capital",
                    "Calculate profit or loss using the capital comparison method",
                ]},
                {"name": "Reconstructing Accounts", "objectives": [
                    "Use control accounts to find missing debtors and creditors figures",
                    "Calculate cash and bank figures from incomplete information",
                    "Prepare final accounts (trading, P&L, balance sheet) from incomplete records",
                ]},
            ]
        },
        {
            "number": 9, "name": "Manufacturing Accounts",
            "subtopics": [
                {"name": "Manufacturing Account", "objectives": [
                    "Distinguish between prime cost, factory cost of production, and cost of goods sold",
                    "Prepare a manufacturing account showing prime cost and factory overheads",
                    "Integrate the manufacturing account with the trading and profit & loss account",
                ]},
            ]
        },
        {
            "number": 10, "name": "Partnership Accounts",
            "subtopics": [
                {"name": "Partnership Formation and Appropriation", "objectives": [
                    "Explain the features of a partnership and the purpose of a partnership agreement",
                    "Prepare a partnership appropriation account (salaries, interest on capital, profit shares)",
                    "Maintain capital accounts (fixed or fluctuating) and current accounts for each partner",
                ]},
                {"name": "Changes in Partnership", "objectives": [
                    "Prepare accounts for the admission of a new partner including goodwill treatment",
                    "Prepare accounts for the retirement or death of a partner",
                    "Calculate new profit-sharing ratios and the effect on goodwill",
                ]},
            ]
        },
        {
            "number": 11, "name": "Company Accounts",
            "subtopics": [
                {"name": "Share Capital and Debentures", "objectives": [
                    "Distinguish between ordinary shares, preference shares, and debentures",
                    "Record the issue of shares at par, at a premium, and by instalments",
                    "Prepare a company balance sheet showing share capital and reserves",
                ]},
                {"name": "Company Final Accounts", "objectives": [
                    "Prepare a company profit and loss account and appropriation account",
                    "Distinguish between revenue reserves (retained earnings) and capital reserves",
                    "Explain dividends: declared, interim, and final dividends",
                ]},
            ]
        },
        {
            "number": 12, "name": "Departmental & Branch Accounts",
            "subtopics": [
                {"name": "Departmental Accounts", "objectives": [
                    "Prepare separate departmental trading accounts",
                    "Apportion shared expenses between departments using appropriate bases",
                    "Evaluate the profitability of each department",
                ]},
                {"name": "Branch Accounts", "objectives": [
                    "Explain the debtors system and stock and debtors system of branch accounting",
                    "Prepare branch accounts in the head office books",
                    "Reconcile branch stock at cost with branch stock at selling price",
                ]},
            ]
        },
        {
            "number": 13, "name": "Public Sector Accounting",
            "subtopics": [
                {"name": "Government Accounting Concepts", "objectives": [
                    "Explain the objectives of government (public sector) accounting in Nigeria",
                    "Distinguish between capital and recurrent budgets",
                    "Describe the roles of the Accountant-General and Auditor-General in Nigeria",
                ]},
                {"name": "Government Financial Statements", "objectives": [
                    "Prepare a government revenue and expenditure account",
                    "Explain fund accounting and the consolidated revenue fund",
                    "Identify and control irregularities in government accounts",
                ]},
            ]
        },
    ]
}


def rebuild_accounting():
    write("accounting", ACCOUNTING)



# ─────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Building / enriching syllabus JSONs…")
    write("economics_syllabus", ECONOMICS)
    write("commerce_syllabus", COMMERCE)
    write("geography_syllabus", GEOGRAPHY)
    write("english_language_syllabus", ENGLISH)
    write("literature_in_english_syllabus", LITERATURE)
    rebuild_accounting()
    print("\nDone.")
