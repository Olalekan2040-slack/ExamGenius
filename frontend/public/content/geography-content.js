/**
 * Geography Learning Content — JAMB
 * Topic keys and subtopic names match syllabus/parsed/geography_syllabus.json
 * so end-of-subtopic past questions resolve correctly.
 */

const GEOGRAPHY_LEARNING_CONTENT = {

  "Maps and Map Reading": {
    subject: "Geography",
    topic: "Maps and Map Reading",
    introduction: {
      title: "Maps and Map Reading",
      description: "Maps are the language of geography. This topic covers the types of maps, how scales work, how to measure distance and area, and how to read relief, drainage and settlement from a topographical map. It is the most reliable source of marks in JAMB Geography because the skills are practical and repeatable.",
      jambInfo: "JAMB asks 4-6 questions on maps every year, especially scale conversion, distance/area calculation and contour interpretation."
    },
    subtopics: [
      {
        name: "Types of Maps and Their Uses",
        objectives: [
          {
            title: "Identify types of maps and state their uses",
            explanation: `<p>A <strong>map</strong> is a representation, on a flat surface and to scale, of the whole or part of the earth's surface.</p>
<div class="key-points">
  <h4>Main Types of Maps</h4>
  <ul>
    <li><strong>Topographical maps</strong> — show relief, drainage, settlement and communication of a small area in detail. Used for fieldwork and planning.</li>
    <li><strong>Atlas maps</strong> — small-scale maps of large areas (countries, continents) showing general information.</li>
    <li><strong>Statistical (distribution) maps</strong> — show the distribution of data e.g. population (dot maps), rainfall (isohyets), using symbols, shading or lines.</li>
    <li><strong>Sketch maps</strong> — rough, not-to-scale maps used to show relative position.</li>
  </ul>
</div>
<div class="warning-box"><h4>Map vs Plan vs Globe</h4><p>A <strong>plan</strong> is a large-scale drawing of a very small area (e.g. a building) with great detail. A <strong>globe</strong> is the only true-to-shape model of the earth. A map distorts either shape, area, distance or direction because it flattens a curved surface.</p></div>`,
            question: {
              text: "Which type of map is most suitable for showing the relief, drainage and settlement of a small area in detail?",
              options: { "A": "Atlas map", "B": "Topographical map", "C": "Distribution map", "D": "Sketch map" },
              correctAnswer: "B",
              explanation: "Topographical maps are large-scale maps that show relief (contours), drainage, settlement and communication of a small area in detail."
            }
          }
        ]
      },
      {
        name: "Map Scales, Distances and Areas",
        objectives: [
          {
            title: "Identify scale types and convert between them",
            explanation: `<p><strong>Scale</strong> is the ratio of a distance on the map to the actual distance on the ground.</p>
<div class="key-points">
  <h4>Three Ways to Express Scale</h4>
  <ul>
    <li><strong>Statement scale:</strong> "1 cm represents 1 km".</li>
    <li><strong>Linear (bar) scale:</strong> a divided line you lay measurements against.</li>
    <li><strong>Representative Fraction (R.F.):</strong> a ratio such as 1:100,000 — 1 unit on the map equals 100,000 of the same units on the ground.</li>
  </ul>
</div>
<div class="example-box"><h4>Worked Example — Statement to R.F.</h4>
<p>Convert "1 cm to 2 km" to a representative fraction.</p>
<p>2 km = 2 × 100,000 cm = 200,000 cm.</p>
<p>So R.F. = <strong>1:200,000</strong>.</p></div>`,
            question: {
              text: "A map has a scale of 1 cm to 5 km. What is its representative fraction?",
              options: { "A": "1:5,000", "B": "1:50,000", "C": "1:500,000", "D": "1:5,000,000" },
              correctAnswer: "C",
              explanation: "5 km = 5 × 100,000 cm = 500,000 cm. Since 1 cm on the map represents 500,000 cm on the ground, the R.F. is 1:500,000."
            }
          },
          {
            title: "Calculate distance and area using scale",
            explanation: `<p>To find <strong>ground distance</strong>: measure the map distance, then multiply by the scale.</p>
<div class="example-box"><h4>Distance</h4>
<p>On a 1:50,000 map two towns are 6 cm apart. Ground distance = 6 × 50,000 cm = 300,000 cm = <strong>3 km</strong>.</p></div>
<div class="example-box"><h4>Area</h4>
<p>A forest covers 8 cm² on a 1:50,000 map (1 cm = 0.5 km).</p>
<p>Area scale = (0.5 km)² per cm² = 0.25 km² per cm².</p>
<p>Ground area = 8 × 0.25 = <strong>2 km²</strong>.</p></div>
<div class="warning-box"><h4>Trap</h4><p>For area you must square the linear scale. Students who forget to square it get answers that are far too large.</p></div>`,
            question: {
              text: "On a map of scale 1:100,000, a lake covers an area of 4 cm². What is its actual area on the ground?",
              options: { "A": "4 km²", "B": "40 km²", "C": "0.4 km²", "D": "400 km²" },
              correctAnswer: "A",
              explanation: "1 cm = 1 km at 1:100,000, so 1 cm² = 1 km². Therefore 4 cm² = 4 km²."
            }
          }
        ]
      },
      {
        name: "Map Reading and Interpretation",
        objectives: [
          {
            title: "Interpret relief from contours",
            explanation: `<p><strong>Contours</strong> are lines joining places of equal height above sea level. Their spacing and pattern reveal the shape of the land.</p>
<div class="key-points">
  <h4>Reading Contours</h4>
  <ul>
    <li><strong>Close contours</strong> = steep slope; <strong>widely spaced</strong> = gentle slope.</li>
    <li><strong>V-shapes pointing uphill</strong> = a valley (river flows through the V toward the open end).</li>
    <li><strong>V/U-shapes pointing downhill</strong> = a spur (ridge of high land).</li>
    <li><strong>Concentric closed loops</strong> = a hill or knoll; the innermost is highest.</li>
  </ul>
</div>
<div class="warning-box"><h4>Intervisibility</h4><p>Two points are intervisible if no higher ground or convex slope blocks the line of sight between them — test this by drawing a cross-profile.</p></div>`,
            question: {
              text: "On a contour map, closely spaced contour lines indicate a",
              options: { "A": "gentle slope", "B": "steep slope", "C": "flat plain", "D": "river valley" },
              correctAnswer: "B",
              explanation: "The closer the contour lines, the greater the change in height over a short horizontal distance — that is a steep slope."
            }
          }
        ]
      }
    ]
  },

  "Statistical Maps and Diagrams": {
    subject: "Geography",
    topic: "Statistical Maps and Diagrams",
    introduction: {
      title: "Statistical Maps and Diagrams",
      description: "Geographers present numerical data visually. This topic covers the graphs, charts and thematic maps used to display data, their advantages and disadvantages, and how to read and construct them.",
      jambInfo: "Expect 2-3 questions, usually asking which method best suits given data, or interpreting a chart."
    },
    subtopics: [
      {
        name: "Types of Statistical Maps and Diagrams",
        objectives: [
          {
            title: "Identify statistical diagrams and maps and their suitability",
            explanation: `<div class="key-points">
  <h4>Diagrams</h4>
  <ul>
    <li><strong>Bar graph</strong> — compares quantities (e.g. crop output by state).</li>
    <li><strong>Line graph</strong> — shows change over time (e.g. temperature through the year).</li>
    <li><strong>Pie chart / divided circle</strong> — shows proportions of a whole (e.g. share of exports).</li>
    <li><strong>Divided (compound) bar</strong> — shows composition and totals together.</li>
  </ul>
  <h4>Statistical Maps</h4>
  <ul>
    <li><strong>Dot map</strong> — each dot equals a fixed value; shows distribution and density.</li>
    <li><strong>Choropleth map</strong> — shading/density by administrative unit (darker = higher).</li>
    <li><strong>Isopleth (isoline) map</strong> — lines joining equal values (isohyets for rainfall, isotherms for temperature).</li>
    <li><strong>Flow map</strong> — arrows whose width shows movement/volume (e.g. trade, traffic).</li>
  </ul>
</div>`,
            question: {
              text: "Which method is most suitable for showing the proportion of Nigeria's total revenue contributed by each sector?",
              options: { "A": "Line graph", "B": "Pie chart", "C": "Dot map", "D": "Isopleth map" },
              correctAnswer: "B",
              explanation: "A pie chart (divided circle) is designed to show the proportions or shares that make up a whole, such as sectoral contributions to total revenue."
            }
          }
        ]
      },
      {
        name: "Construction and Interpretation of Statistical Data",
        objectives: [
          {
            title: "Compute simple values from data (e.g. pie chart angles, density)",
            explanation: `<div class="example-box"><h4>Pie Chart Angle</h4>
<p>If cocoa is 25% of total exports, its sector angle = 25% × 360° = <strong>90°</strong>.</p>
<p>General rule: angle = (value ÷ total) × 360°.</p></div>
<div class="example-box"><h4>Population Density</h4>
<p>Density = total population ÷ land area.</p>
<p>A state with 3,000,000 people over 15,000 km² has a density of 3,000,000 ÷ 15,000 = <strong>200 persons per km²</strong>.</p></div>`,
            question: {
              text: "In a pie chart, a commodity that forms 30% of total trade would be represented by an angle of",
              options: { "A": "30°", "B": "108°", "C": "120°", "D": "300°" },
              correctAnswer: "B",
              explanation: "Angle = 30% × 360° = 0.30 × 360 = 108°."
            }
          }
        ]
      }
    ]
  },

  "Elementary Surveying and GIS": {
    subject: "Geography",
    topic: "Elementary Surveying and GIS",
    introduction: {
      title: "Elementary Surveying and GIS",
      description: "Surveying is the measurement of relative positions on the earth's surface; GIS is the modern computer-based system for capturing, storing and analysing geographic data. This topic covers chain and prismatic surveying and the components and uses of GIS.",
      jambInfo: "Usually 1-2 questions, often on the purpose of a survey type or the components/uses of GIS."
    },
    subtopics: [
      {
        name: "Chain and Prismatic Surveying",
        objectives: [
          {
            title: "Describe chain and prismatic surveying",
            explanation: `<div class="key-points">
  <h4>Chain Survey</h4>
  <ul>
    <li>Measures <strong>distances only</strong> using a chain or tape; suitable for small, fairly level, open ground.</li>
    <li>Works by dividing the area into triangles (triangulation).</li>
  </ul>
  <h4>Prismatic Compass Survey</h4>
  <ul>
    <li>Measures <strong>bearings (directions)</strong> as well as distances, using a prismatic compass.</li>
    <li>Suitable for larger areas and traversing.</li>
  </ul>
</div>
<div class="warning-box"><h4>Key Difference</h4><p>A chain survey records distances only; a prismatic survey also records the bearing of each line, so it can map areas that are not simple triangles.</p></div>`,
            question: {
              text: "The main instrument used to measure bearings in the field is the",
              options: { "A": "chain", "B": "ranging pole", "C": "prismatic compass", "D": "arrow" },
              correctAnswer: "C",
              explanation: "The prismatic compass is used to read bearings (directions) of survey lines; chains, poles and arrows are used only for measuring and marking distances."
            }
          }
        ]
      },
      {
        name: "Geographic Information Systems (GIS)",
        objectives: [
          {
            title: "Define GIS and identify its components and uses",
            explanation: `<p><strong>GIS</strong> (Geographic Information System) is a computer-based system for capturing, storing, analysing, managing and displaying spatially referenced (geographic) data.</p>
<div class="key-points">
  <h4>Components of GIS</h4>
  <ul>
    <li><strong>Hardware</strong> — computers, GPS receivers, scanners, plotters.</li>
    <li><strong>Software</strong> — programs such as ArcGIS, QGIS.</li>
    <li><strong>Data</strong> — spatial (maps, coordinates) and attribute (tables).</li>
    <li><strong>People</strong> — trained users and analysts.</li>
    <li><strong>Methods/Procedures</strong> — the rules and workflows.</li>
  </ul>
  <h4>Uses</h4>
  <ul><li>Urban and regional planning, resource management, disaster monitoring, mapping and navigation.</li></ul>
</div>`,
            question: {
              text: "Which of the following is NOT a component of a Geographic Information System?",
              options: { "A": "Hardware", "B": "Software", "C": "Rainfall", "D": "Data" },
              correctAnswer: "C",
              explanation: "The components of GIS are hardware, software, data, people and methods. Rainfall is a type of data that could be analysed, not a component of the system itself."
            }
          }
        ]
      }
    ]
  },

  "The Earth as a Planet": {
    subject: "Geography",
    topic: "The Earth as a Planet",
    introduction: {
      title: "The Earth as a Planet",
      description: "This topic explains the earth's place in the solar system, its shape and movements, the grid of latitude and longitude, time calculation, and the earth's internal and external structure.",
      jambInfo: "A frequent source of 3-5 questions, especially longitude/time calculations and the effects of rotation and revolution."
    },
    subtopics: [
      {
        name: "The Earth in the Solar System",
        objectives: [
          {
            title: "Explain rotation, revolution and their effects",
            explanation: `<div class="key-points">
  <h4>Rotation</h4>
  <ul><li>The earth spins on its axis once in <strong>24 hours</strong> from west to east. Effects: day and night, apparent movement of the sun, deflection of winds and currents.</li></ul>
  <h4>Revolution</h4>
  <ul><li>The earth orbits the sun once in <strong>365¼ days</strong>. Combined with the tilt of the axis (23½°), it causes the <strong>seasons</strong>, varying day length and the leap year.</li></ul>
</div>
<div class="warning-box"><h4>Remember</h4><p>Rotation → day and night. Revolution + axial tilt → seasons. Do not confuse the two.</p></div>`,
            question: {
              text: "The occurrence of day and night is caused by the earth's",
              options: { "A": "revolution around the sun", "B": "rotation on its axis", "C": "tilt on its axis", "D": "spherical shape" },
              correctAnswer: "B",
              explanation: "Day and night result from the earth's rotation on its axis every 24 hours, which turns each part of the earth toward and away from the sun."
            }
          }
        ]
      },
      {
        name: "Latitude, Longitude and Time",
        objectives: [
          {
            title: "Calculate local time using longitude",
            explanation: `<p>The earth turns 360° in 24 hours, so <strong>15° of longitude = 1 hour</strong> (and 1° = 4 minutes).</p>
<div class="key-points"><ul>
  <li>Places <strong>east</strong> of a location are <strong>ahead</strong> in time; places <strong>west</strong> are <strong>behind</strong>.</li>
</ul></div>
<div class="example-box"><h4>Worked Example</h4>
<p>If it is 12:00 noon at Greenwich (0°), what is the time at 45°E?</p>
<p>45° ÷ 15 = 3 hours. Since 45°E is east, add 3 hours → <strong>3:00 p.m.</strong></p></div>`,
            question: {
              text: "If the time at Greenwich (0°) is 12:00 noon, what is the local time at longitude 30°W?",
              options: { "A": "10:00 a.m.", "B": "2:00 p.m.", "C": "9:00 a.m.", "D": "1:00 p.m." },
              correctAnswer: "A",
              explanation: "30° ÷ 15° = 2 hours. A place west of Greenwich is behind in time, so subtract 2 hours from 12 noon to get 10:00 a.m."
            }
          }
        ]
      },
      {
        name: "Structure of the Earth",
        objectives: [
          {
            title: "Describe the internal and external structure of the earth",
            explanation: `<div class="key-points">
  <h4>Internal Layers</h4>
  <ul>
    <li><strong>Crust</strong> — thin outer shell (SIAL: continental; SIMA: oceanic).</li>
    <li><strong>Mantle</strong> — thick layer of dense, semi-molten rock beneath the crust.</li>
    <li><strong>Core</strong> — outer core (liquid) and inner core (solid), rich in iron and nickel; source of the earth's magnetism.</li>
  </ul>
  <h4>External Spheres</h4>
  <ul><li><strong>Lithosphere</strong> (land), <strong>hydrosphere</strong> (water), <strong>atmosphere</strong> (air) and <strong>biosphere</strong> (living things).</li></ul>
</div>`,
            question: {
              text: "The innermost layer of the earth, made largely of iron and nickel, is the",
              options: { "A": "crust", "B": "mantle", "C": "core", "D": "lithosphere" },
              correctAnswer: "C",
              explanation: "The core is the innermost layer, composed mainly of iron and nickel, with a liquid outer core and a solid inner core."
            }
          }
        ]
      }
    ]
  },

  "Rocks": {
    subject: "Geography",
    topic: "Rocks",
    introduction: {
      title: "Rocks",
      description: "Rocks are the solid materials that make up the earth's crust. This topic classifies rocks by origin, describes how each type forms, and explains their uses and the rock cycle.",
      jambInfo: "Usually 2-3 questions, most often on classifying a named rock or identifying its mode of formation."
    },
    subtopics: [
      {
        name: "Types and Characteristics of Rocks",
        objectives: [
          {
            title: "Classify rocks and describe their formation",
            explanation: `<div class="key-points">
  <h4>Three Rock Types</h4>
  <ul>
    <li><strong>Igneous</strong> — formed from cooled and solidified magma/lava. Examples: granite (intrusive), basalt (extrusive). Usually crystalline and hard.</li>
    <li><strong>Sedimentary</strong> — formed from compacted and cemented sediments; occur in layers (strata) and may contain fossils. Examples: limestone, sandstone, shale, coal.</li>
    <li><strong>Metamorphic</strong> — formed when existing rocks are altered by heat and pressure. Examples: marble (from limestone), slate (from shale), gneiss (from granite).</li>
  </ul>
</div>
<div class="warning-box"><h4>Fossils</h4><p>Fossils are found almost exclusively in sedimentary rocks, because heat and pressure destroy them in igneous and metamorphic rocks.</p></div>`,
            question: {
              text: "Marble is a metamorphic rock formed from",
              options: { "A": "granite", "B": "limestone", "C": "sandstone", "D": "basalt" },
              correctAnswer: "B",
              explanation: "Marble forms when limestone (a sedimentary rock) is subjected to heat and pressure and is metamorphosed."
            }
          }
        ]
      },
      {
        name: "Importance and Uses of Rocks",
        objectives: [
          {
            title: "State the uses of rocks and the rock cycle",
            explanation: `<div class="key-points">
  <h4>Uses of Rocks</h4>
  <ul>
    <li>Source of <strong>minerals and fuels</strong> (iron ore, coal, limestone for cement).</li>
    <li><strong>Construction</strong> materials (granite chippings, sand, marble).</li>
    <li>Parent material for <strong>soil formation</strong> through weathering.</li>
  </ul>
  <h4>The Rock Cycle</h4>
  <ul><li>Rocks are continuously transformed: igneous → weathered to sediments → sedimentary → heat/pressure → metamorphic → melted to magma → igneous, and so on.</li></ul>
</div>`,
            question: {
              text: "Which rock is the main raw material for the production of cement?",
              options: { "A": "Granite", "B": "Limestone", "C": "Slate", "D": "Basalt" },
              correctAnswer: "B",
              explanation: "Limestone is the principal raw material used in cement manufacture, which is why cement factories are sited near limestone deposits."
            }
          }
        ]
      }
    ]
  },

  "Landforms and Earth Processes": {
    subject: "Geography",
    topic: "Landforms and Earth Processes",
    introduction: {
      title: "Landforms and Earth Processes",
      description: "The earth's surface is shaped by internal forces (folding, faulting, vulcanicity) and external forces (weathering, erosion and deposition by rivers, waves, wind and ice). This topic covers the processes and the landforms they create.",
      jambInfo: "One of the largest topics — expect 4-6 questions on landforms of rivers, coasts, deserts and glaciation, plus folding/faulting."
    },
    subtopics: [
      {
        name: "Internal (Endogenetic) Processes and Landforms",
        objectives: [
          {
            title: "Explain folding, faulting and vulcanicity",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Folding</strong> — compression of crustal rocks into up-folds (<strong>anticlines</strong>) and down-folds (<strong>synclines</strong>); produces <strong>fold mountains</strong> (e.g. the Atlas, Alps, Himalayas).</li>
    <li><strong>Faulting</strong> — fracture and displacement of rocks; produces <strong>block mountains (horsts)</strong> and <strong>rift valleys (graben)</strong> such as the East African Rift Valley.</li>
    <li><strong>Vulcanicity</strong> — movement of magma to or towards the surface; produces volcanoes, and intrusive features like batholiths, sills and dykes.</li>
  </ul>
</div>`,
            question: {
              text: "A rift valley is formed as a result of",
              options: { "A": "folding", "B": "faulting", "C": "vulcanicity", "D": "deposition" },
              correctAnswer: "B",
              explanation: "A rift valley (graben) forms when a block of land subsides between two roughly parallel faults — it is a product of faulting."
            }
          }
        ]
      },
      {
        name: "External (Exogenetic) Processes: Weathering and Mass Movement",
        objectives: [
          {
            title: "Distinguish types of weathering",
            explanation: `<p><strong>Weathering</strong> is the breakdown of rocks <em>in situ</em> (in place), without transport.</p>
<div class="key-points">
  <ul>
    <li><strong>Physical (mechanical)</strong> — rocks break without chemical change: exfoliation (onion peeling from temperature change), freeze-thaw, block disintegration. Dominant in deserts and cold regions.</li>
    <li><strong>Chemical</strong> — minerals are altered: solution, oxidation, carbonation (limestone dissolving), hydrolysis. Dominant in hot, wet tropics.</li>
    <li><strong>Biological</strong> — plants, animals and microbes assist breakdown (root action, burrowing).</li>
  </ul>
</div>
<div class="warning-box"><h4>Erosion vs Weathering</h4><p>Weathering breaks rock in place; <strong>erosion</strong> involves the wearing away AND removal/transport of the material.</p></div>`,
            question: {
              text: "The peeling off of rock in layers like an onion due to alternate heating and cooling is called",
              options: { "A": "carbonation", "B": "exfoliation", "C": "hydrolysis", "D": "oxidation" },
              correctAnswer: "B",
              explanation: "Exfoliation is a physical weathering process in which the outer layers of rock peel off in curved sheets due to repeated expansion (heating) and contraction (cooling)."
            }
          }
        ]
      },
      {
        name: "Landforms of Water, Wind and Ice Action",
        objectives: [
          {
            title: "Identify river, coastal, desert and glacial landforms",
            explanation: `<div class="key-points">
  <h4>Rivers</h4>
  <ul><li>Erosional: V-shaped valley, waterfall, gorge. Depositional: floodplain, levee, delta, meander.</li></ul>
  <h4>Coasts (wave action)</h4>
  <ul><li>Erosional: cliff, cave, arch, stack. Depositional: beach, spit, bar.</li></ul>
  <h4>Deserts (wind action)</h4>
  <ul><li>Erosional: zeugen, yardang, ventifact. Depositional: barchan and seif dunes.</li></ul>
  <h4>Glaciers (ice action)</h4>
  <ul><li>Erosional: corrie/cirque, arete, U-shaped valley. Depositional: moraine, drumlin.</li></ul>
</div>`,
            question: {
              text: "A crescent-shaped sand dune formed by wind in a desert is called a",
              options: { "A": "seif", "B": "barchan", "C": "yardang", "D": "moraine" },
              correctAnswer: "B",
              explanation: "A barchan is a crescent (moon) shaped dune whose horns point downwind, formed by wind deposition in deserts. A seif is a long ridge dune; a yardang is erosional; a moraine is glacial."
            }
          }
        ]
      }
    ]
  },

  "Water Bodies": {
    subject: "Geography",
    topic: "Water Bodies",
    introduction: {
      title: "Water Bodies",
      description: "This topic covers the oceans and seas — their salinity, temperature, currents and tides — and inland waters such as rivers, lakes and underground water.",
      jambInfo: "2-4 questions, commonly on ocean currents, salinity, and the origin/classification of lakes."
    },
    subtopics: [
      {
        name: "Oceans and Seas",
        objectives: [
          {
            title: "Explain ocean currents and salinity",
            explanation: `<div class="key-points">
  <h4>Ocean Currents</h4>
  <ul>
    <li><strong>Warm currents</strong> flow from the equator toward the poles (e.g. Gulf Stream, Guinea Current); <strong>cold currents</strong> flow from the poles toward the equator (e.g. Canary, Benguela).</li>
    <li>Currents are driven by prevailing winds, the earth's rotation and differences in water density; they moderate coastal climates and influence fishing grounds.</li>
  </ul>
  <h4>Salinity</h4>
  <ul><li>Average ocean salinity is about <strong>35 parts per thousand</strong>. It is higher where evaporation is high and freshwater inflow is low (enclosed seas), and lower near river mouths and where rainfall is heavy.</li></ul>
</div>`,
            question: {
              text: "Ocean salinity tends to be highest in areas with",
              options: { "A": "high rainfall and many rivers", "B": "high evaporation and little freshwater inflow", "C": "melting ice", "D": "cold currents" },
              correctAnswer: "B",
              explanation: "Salinity is highest where evaporation concentrates the salts and there is little dilution by rain or river water, such as enclosed seas in hot dry regions."
            }
          }
        ]
      },
      {
        name: "Rivers, Lakes and Underground Water",
        objectives: [
          {
            title: "Classify lakes by origin",
            explanation: `<div class="key-points">
  <h4>Lakes by Mode of Formation</h4>
  <ul>
    <li><strong>Tectonic</strong> — in rift valleys (Lake Tanganyika).</li>
    <li><strong>Volcanic (crater) lakes</strong> — in volcanic craters (Lake Nyos).</li>
    <li><strong>Glacial</strong> — in ice-scoured hollows (Great Lakes).</li>
    <li><strong>Ox-bow lakes</strong> — cut-off river meanders.</li>
    <li><strong>Man-made (artificial)</strong> — reservoirs behind dams (Lake Kainji, Lake Volta).</li>
  </ul>
</div>`,
            question: {
              text: "Lake Kainji in Nigeria is an example of a",
              options: { "A": "crater lake", "B": "tectonic lake", "C": "man-made lake", "D": "glacial lake" },
              correctAnswer: "C",
              explanation: "Lake Kainji is an artificial (man-made) lake formed by damming the River Niger for hydro-electric power."
            }
          }
        ]
      }
    ]
  },

  "Weather and Climate": {
    subject: "Geography",
    topic: "Weather and Climate",
    introduction: {
      title: "Weather and Climate",
      description: "Weather is the day-to-day state of the atmosphere; climate is the average over many years. This topic covers the elements of weather, their instruments, the factors controlling climate, and the world's major climate types.",
      jambInfo: "A major topic — 4-6 questions on instruments, rainfall types, factors of climate and climate classification."
    },
    subtopics: [
      {
        name: "Elements of Weather and Climate and Their Measurement",
        objectives: [
          {
            title: "Identify weather elements, instruments and rainfall types",
            explanation: `<div class="key-points">
  <h4>Elements and Instruments</h4>
  <ul>
    <li>Temperature — thermometer; Rainfall — rain gauge; Pressure — barometer.</li>
    <li>Wind direction — wind vane; Wind speed — anemometer; Humidity — hygrometer; Sunshine — sunshine recorder.</li>
  </ul>
  <h4>Types of Rainfall</h4>
  <ul>
    <li><strong>Convectional</strong> — heated air rises, cools and condenses (common in the tropics, afternoon storms).</li>
    <li><strong>Orographic (relief)</strong> — air forced to rise over highlands; the leeward side is a dry "rain shadow".</li>
    <li><strong>Cyclonic (frontal)</strong> — warm and cold air masses meet; common in temperate latitudes.</li>
  </ul>
</div>`,
            question: {
              text: "The instrument used to measure wind speed is the",
              options: { "A": "wind vane", "B": "anemometer", "C": "barometer", "D": "hygrometer" },
              correctAnswer: "B",
              explanation: "An anemometer measures wind speed. A wind vane shows wind direction, a barometer measures pressure, and a hygrometer measures humidity."
            }
          }
        ]
      },
      {
        name: "Factors Affecting Climate",
        objectives: [
          {
            title: "Explain the factors that control temperature and climate",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Latitude</strong> — temperature falls from the equator to the poles as the sun's rays become more slanted.</li>
    <li><strong>Altitude</strong> — temperature falls about 6.5°C per 1,000 m of ascent (lapse rate).</li>
    <li><strong>Continentality</strong> — interiors have hot summers and cold winters; coasts are milder.</li>
    <li><strong>Ocean currents</strong> — warm currents raise, cold currents lower, coastal temperatures.</li>
    <li><strong>Winds</strong> — bring the temperature and moisture of their source region.</li>
  </ul>
</div>`,
            question: {
              text: "Temperature generally decreases with increasing altitude because",
              options: { "A": "the air becomes denser", "B": "the air becomes thinner and less able to retain heat", "C": "there is more water vapour", "D": "the sun is farther away" },
              correctAnswer: "B",
              explanation: "As altitude increases the air becomes thinner (less dense) and holds less heat, so temperature falls at roughly 6.5°C per 1,000 metres."
            }
          }
        ]
      },
      {
        name: "Classification and Types of Climate",
        objectives: [
          {
            title: "Describe the major climate types",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Equatorial</strong> — hot and wet all year, double rainfall maxima, dense rainforest.</li>
    <li><strong>Tropical continental (Savanna)</strong> — distinct wet and dry seasons; grassland with scattered trees.</li>
    <li><strong>Hot desert</strong> — very hot days, cold nights, less than 250 mm rain.</li>
    <li><strong>Mediterranean</strong> — hot dry summers, warm wet winters.</li>
    <li><strong>Temperate</strong> and <strong>Tundra/Polar</strong> — cool to cold with the poles receiving least insolation.</li>
  </ul>
</div>`,
            question: {
              text: "A climate with distinct wet and dry seasons supporting grassland with scattered trees is the",
              options: { "A": "equatorial climate", "B": "tropical continental (savanna) climate", "C": "Mediterranean climate", "D": "desert climate" },
              correctAnswer: "B",
              explanation: "The tropical continental or savanna climate has alternating wet and dry seasons and supports savanna grassland with scattered trees."
            }
          }
        ]
      }
    ]
  },

  "Vegetation": {
    subject: "Geography",
    topic: "Vegetation",
    introduction: {
      title: "Vegetation",
      description: "Natural vegetation reflects climate and soil. This topic covers the world's major vegetation belts, their characteristics, and how human activity alters them.",
      jambInfo: "2-3 questions, usually matching vegetation to climate or identifying characteristics of a belt."
    },
    subtopics: [
      {
        name: "Types and Distribution of World Vegetation",
        objectives: [
          {
            title: "Identify vegetation belts and their characteristics",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Tropical rainforest</strong> — tall evergreen trees in layers, buttress roots, lianas; equatorial climate.</li>
    <li><strong>Savanna grassland</strong> — tall grasses with scattered fire- and drought-resistant trees; tropical continental climate.</li>
    <li><strong>Desert vegetation</strong> — sparse, xerophytic plants (cacti, thorn scrub) adapted to drought.</li>
    <li><strong>Temperate grassland</strong> — short grasses (prairies, steppes).</li>
    <li><strong>Coniferous forest (taiga)</strong> — needle-leaf evergreen trees adapted to cold.</li>
  </ul>
</div>`,
            question: {
              text: "Trees with buttress roots, lianas and an evergreen canopy in layers are characteristic of the",
              options: { "A": "savanna", "B": "tropical rainforest", "C": "coniferous forest", "D": "temperate grassland" },
              correctAnswer: "B",
              explanation: "The tropical rainforest is characterised by tall evergreen trees arranged in layers, buttress roots and climbing lianas, supported by the hot wet equatorial climate."
            }
          }
        ]
      },
      {
        name: "Importance and Human Impact on Vegetation",
        objectives: [
          {
            title: "Explain the value of vegetation and human impact",
            explanation: `<div class="key-points">
  <h4>Importance</h4>
  <ul><li>Provides timber, food, medicine; protects soil from erosion; regulates climate and the water cycle; habitat for wildlife.</li></ul>
  <h4>Human Impact</h4>
  <ul><li><strong>Deforestation</strong>, <strong>bush burning</strong> and <strong>overgrazing</strong> destroy vegetation, leading to soil erosion, desertification and loss of biodiversity.</li></ul>
</div>`,
            question: {
              text: "Which human activity most directly leads to desertification in the savanna?",
              options: { "A": "Irrigation", "B": "Overgrazing and bush burning", "C": "Afforestation", "D": "Terracing" },
              correctAnswer: "B",
              explanation: "Overgrazing and repeated bush burning strip the protective vegetation cover, exposing soil to erosion and accelerating desertification, especially at the desert margins."
            }
          }
        ]
      }
    ]
  },

  "Soils": {
    subject: "Geography",
    topic: "Soils",
    introduction: {
      title: "Soils",
      description: "Soil is the thin layer of weathered material that supports plant life. This topic covers soil formation, the soil profile, soil types, and soil erosion and conservation.",
      jambInfo: "2-3 questions, often on factors of soil formation, the soil profile, or erosion control."
    },
    subtopics: [
      {
        name: "Soil Formation, Profile and Types",
        objectives: [
          {
            title: "Explain soil formation and the soil profile",
            explanation: `<div class="key-points">
  <h4>Factors of Soil Formation</h4>
  <ul><li>Parent rock, climate, living organisms, relief and time (often summarised as CLORPT).</li></ul>
  <h4>Soil Profile (top to bottom)</h4>
  <ul>
    <li><strong>O/A horizon (topsoil)</strong> — rich in humus and organic matter.</li>
    <li><strong>B horizon (subsoil)</strong> — zone of accumulation of minerals leached from above.</li>
    <li><strong>C horizon</strong> — weathered parent material.</li>
    <li><strong>Bedrock</strong> — solid parent rock.</li>
  </ul>
</div>`,
            question: {
              text: "The layer of the soil profile richest in humus is the",
              options: { "A": "C horizon", "B": "bedrock", "C": "topsoil (A horizon)", "D": "B horizon" },
              correctAnswer: "C",
              explanation: "The topsoil or A horizon contains the most organic matter and humus, making it the most fertile layer for plant growth."
            }
          }
        ]
      },
      {
        name: "Soil Importance, Problems and Conservation",
        objectives: [
          {
            title: "Explain soil erosion and conservation methods",
            explanation: `<div class="key-points">
  <h4>Causes of Soil Erosion</h4>
  <ul><li>Removal of vegetation, overgrazing, cultivation on steep slopes, heavy rainfall on bare ground.</li></ul>
  <h4>Conservation Methods</h4>
  <ul>
    <li><strong>Afforestation</strong> and cover cropping.</li>
    <li><strong>Terracing</strong> and <strong>contour ploughing</strong> on slopes.</li>
    <li><strong>Crop rotation</strong> and controlled grazing.</li>
    <li>Building bunds and planting grass strips.</li>
  </ul>
</div>`,
            question: {
              text: "Which method is most effective for controlling soil erosion on a steep hillside?",
              options: { "A": "Continuous cultivation", "B": "Overgrazing", "C": "Terracing", "D": "Bush burning" },
              correctAnswer: "C",
              explanation: "Terracing breaks a long steep slope into level steps, reducing the speed of run-off and thereby controlling soil erosion on hillsides."
            }
          }
        ]
      }
    ]
  },

  "Environmental Resources": {
    subject: "Geography",
    topic: "Environmental Resources",
    introduction: {
      title: "Environmental Resources",
      description: "Resources are the parts of the environment that satisfy human needs. This topic classifies environmental resources and examines their conservation and management.",
      jambInfo: "1-2 questions, usually distinguishing renewable from non-renewable resources or on conservation."
    },
    subtopics: [
      {
        name: "Types of Environmental Resources",
        objectives: [
          {
            title: "Classify resources as renewable or non-renewable",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Renewable resources</strong> — can replenish naturally within a human timescale: solar energy, wind, water, forests, fish, soil.</li>
    <li><strong>Non-renewable resources</strong> — exist in fixed amounts and are depleted by use: petroleum, coal, natural gas, and metallic minerals.</li>
  </ul>
</div>
<div class="warning-box"><h4>Note</h4><p>Renewable resources can still be exhausted if used faster than they regenerate (e.g. overfishing, deforestation).</p></div>`,
            question: {
              text: "Which of the following is a non-renewable resource?",
              options: { "A": "Solar energy", "B": "Forest", "C": "Petroleum", "D": "Wind" },
              correctAnswer: "C",
              explanation: "Petroleum forms over millions of years and cannot be replaced within a human timescale, making it a non-renewable resource."
            }
          }
        ]
      },
      {
        name: "Resource Conservation and Management",
        objectives: [
          {
            title: "Explain the need for and methods of conservation",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Why conserve:</strong> to ensure sustainable supply for future generations, prevent depletion, and protect the environment.</li>
    <li><strong>Methods:</strong> recycling, afforestation, controlled/quota harvesting, use of alternative (renewable) energy, laws and protected areas, public education.</li>
  </ul>
</div>`,
            question: {
              text: "The best strategy for conserving non-renewable energy resources is to",
              options: { "A": "increase their extraction", "B": "develop renewable alternatives and recycle", "C": "export them faster", "D": "subsidise wasteful use" },
              correctAnswer: "B",
              explanation: "Developing renewable energy alternatives and recycling reduces the rate at which finite non-renewable resources are consumed, conserving them for the future."
            }
          }
        ]
      }
    ]
  },

  "Environmental Interaction and Hazards": {
    subject: "Geography",
    topic: "Environmental Interaction and Hazards",
    introduction: {
      title: "Environmental Interaction and Hazards",
      description: "The environment functions as interlinked ecosystems, and its balance can be disturbed by natural and human-induced hazards. This topic covers ecosystems, environmental hazards and global environmental issues.",
      jambInfo: "2-4 questions, increasingly on global warming, climate change and man-made hazards."
    },
    subtopics: [
      {
        name: "Ecosystems and Environmental Balance",
        objectives: [
          {
            title: "Explain ecosystems, food chains and energy flow",
            explanation: `<div class="key-points">
  <ul>
    <li>An <strong>ecosystem</strong> is a community of living organisms interacting with their non-living environment.</li>
    <li><strong>Producers</strong> (green plants) → <strong>primary consumers</strong> (herbivores) → <strong>secondary consumers</strong> (carnivores) → <strong>decomposers</strong>.</li>
    <li>Energy flows in one direction and decreases along the chain; nutrients are recycled.</li>
  </ul>
</div>`,
            question: {
              text: "In an ecosystem, green plants are referred to as",
              options: { "A": "consumers", "B": "producers", "C": "decomposers", "D": "predators" },
              correctAnswer: "B",
              explanation: "Green plants are producers because they manufacture their own food through photosynthesis and form the base of the food chain."
            }
          }
        ]
      },
      {
        name: "Environmental Hazards and Their Management",
        objectives: [
          {
            title: "Distinguish natural and man-made hazards; explain global issues",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Natural hazards:</strong> earthquakes, volcanic eruptions, droughts, flooding.</li>
    <li><strong>Man-induced hazards:</strong> deforestation, desertification, soil erosion, oil spillage, pollution, urban flooding.</li>
    <li><strong>Global issues:</strong> <strong>global warming</strong> (rise in temperature from greenhouse gases), <strong>climate change</strong>, and <strong>ozone layer depletion</strong> (from CFCs).</li>
  </ul>
</div>
<div class="warning-box"><h4>Greenhouse Effect</h4><p>Burning fossil fuels releases carbon dioxide, which traps heat in the atmosphere and raises global temperatures — the main driver of global warming.</p></div>`,
            question: {
              text: "The main gas responsible for global warming is",
              options: { "A": "oxygen", "B": "nitrogen", "C": "carbon dioxide", "D": "hydrogen" },
              correctAnswer: "C",
              explanation: "Carbon dioxide, released mainly by the burning of fossil fuels, is the principal greenhouse gas that traps heat and causes global warming."
            }
          }
        ]
      }
    ]
  },

  "Population": {
    subject: "Geography",
    topic: "Population",
    introduction: {
      title: "Population",
      description: "This topic examines how people are distributed over the earth, why population changes, its age-sex structure, migration, and the problems of over- and under-population.",
      jambInfo: "3-4 questions on factors of distribution, population change, migration and population pyramids."
    },
    subtopics: [
      {
        name: "World Population: Distribution, Growth and Structure",
        objectives: [
          {
            title: "Explain factors of distribution and population change",
            explanation: `<div class="key-points">
  <h4>Factors Affecting Distribution</h4>
  <ul><li>Physical: relief, climate, soil, water, vegetation. Human: industry, transport, government policy, history.</li></ul>
  <h4>Population Change</h4>
  <ul><li><strong>Natural increase</strong> = birth rate − death rate. Total change also depends on <strong>net migration</strong>.</li></ul>
</div>
<div class="example-box"><h4>Example</h4><p>A country with a birth rate of 40/1000 and a death rate of 15/1000 has a natural increase of 25/1000, i.e. <strong>2.5% per year</strong>.</p></div>`,
            question: {
              text: "If a country has a birth rate of 35 per 1,000 and a death rate of 10 per 1,000, its rate of natural increase is",
              options: { "A": "45 per 1,000", "B": "25 per 1,000", "C": "10 per 1,000", "D": "3.5 per 1,000" },
              correctAnswer: "B",
              explanation: "Natural increase = birth rate − death rate = 35 − 10 = 25 per 1,000 (2.5%)."
            }
          }
        ]
      },
      {
        name: "Migration and Population Problems",
        objectives: [
          {
            title: "Explain migration and problems of over-population",
            explanation: `<div class="key-points">
  <h4>Migration</h4>
  <ul><li><strong>Push factors</strong> drive people away (unemployment, insecurity, poor services); <strong>pull factors</strong> attract them (jobs, better amenities). Rural-urban migration is the commonest type in Nigeria.</li></ul>
  <h4>Population Problems</h4>
  <ul><li><strong>Over-population:</strong> pressure on resources, unemployment, congestion. <strong>Under-population:</strong> under-use of resources, small labour force and market.</li></ul>
</div>`,
            question: {
              text: "The movement of people from the countryside to towns in search of jobs is called",
              options: { "A": "emigration", "B": "rural-urban migration", "C": "immigration", "D": "commuting" },
              correctAnswer: "B",
              explanation: "Rural-urban migration is the movement of people from rural areas to urban centres, usually driven by the search for employment and better amenities."
            }
          }
        ]
      }
    ]
  },

  "Settlements": {
    subject: "Geography",
    topic: "Settlements",
    introduction: {
      title: "Settlements",
      description: "Settlements are places where people live. This topic covers rural and urban settlements, their patterns and functions, urbanization, and the relationships between settlements.",
      jambInfo: "2-3 questions on settlement patterns, functions and urbanization problems."
    },
    subtopics: [
      {
        name: "Types and Patterns of Settlement",
        objectives: [
          {
            title: "Identify settlement patterns and their causes",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Nucleated (clustered)</strong> — buildings grouped together, often around a resource like water or a market.</li>
    <li><strong>Dispersed (scattered)</strong> — isolated buildings spread out, common where farmland is individually held.</li>
    <li><strong>Linear</strong> — settlements strung along a road, river or valley.</li>
  </ul>
</div>`,
            question: {
              text: "A settlement in which houses are strung out along a major road is described as",
              options: { "A": "nucleated", "B": "dispersed", "C": "linear", "D": "radial" },
              correctAnswer: "C",
              explanation: "A linear settlement pattern develops when buildings are arranged in a line along a route such as a road, river or valley."
            }
          }
        ]
      },
      {
        name: "Urbanization and Settlement Interaction",
        objectives: [
          {
            title: "Explain urbanization and its problems",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Urbanization</strong> is the increase in the proportion of people living in towns, driven mainly by rural-urban migration and natural increase.</li>
    <li><strong>Problems:</strong> overcrowding, slums, unemployment, traffic congestion, pressure on housing and services, crime and pollution.</li>
  </ul>
</div>`,
            question: {
              text: "Which of the following is a common problem of rapid urbanization?",
              options: { "A": "Under-utilisation of resources", "B": "Development of slums and congestion", "C": "Shortage of labour", "D": "Depopulation of towns" },
              correctAnswer: "B",
              explanation: "Rapid urbanization outpaces the provision of housing and services, leading to slums, overcrowding and traffic congestion in cities."
            }
          }
        ]
      }
    ]
  },

  "Economic Activities": {
    subject: "Geography",
    topic: "Economic Activities",
    introduction: {
      title: "Economic Activities",
      description: "This topic classifies the ways people earn a living — primary, secondary and tertiary activities — and covers agriculture, mining, manufacturing, transport and trade.",
      jambInfo: "3-4 questions on classifying activities, factors of industrial location and transport."
    },
    subtopics: [
      {
        name: "Primary, Secondary and Tertiary Activities",
        objectives: [
          {
            title: "Classify economic activities and industrial location factors",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Primary</strong> — extracting from nature: farming, fishing, mining, lumbering.</li>
    <li><strong>Secondary</strong> — processing/manufacturing: factories, construction.</li>
    <li><strong>Tertiary</strong> — services: trade, transport, banking, teaching.</li>
  </ul>
  <h4>Factors of Industrial Location</h4>
  <ul><li>Raw materials, power, labour, market, transport, capital and government policy.</li></ul>
</div>`,
            question: {
              text: "Fishing, farming and mining are examples of",
              options: { "A": "secondary activities", "B": "tertiary activities", "C": "primary activities", "D": "quaternary activities" },
              correctAnswer: "C",
              explanation: "Primary activities involve the direct extraction or collection of natural resources, which includes fishing, farming, mining and lumbering."
            }
          }
        ]
      },
      {
        name: "Transportation, Communication and Trade",
        objectives: [
          {
            title: "Compare modes of transport and explain trade",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>Road</strong> — flexible, door-to-door, but limited for very heavy long-distance loads.</li>
    <li><strong>Rail</strong> — cheap for heavy bulky goods over land, but fixed routes.</li>
    <li><strong>Water</strong> — cheapest for very heavy goods over long distances, but slow.</li>
    <li><strong>Air</strong> — fastest, but most expensive and limited capacity.</li>
    <li><strong>Pipeline</strong> — efficient for liquids and gases (oil, gas).</li>
  </ul>
</div>`,
            question: {
              text: "The cheapest means of transporting very heavy and bulky goods over long distances is",
              options: { "A": "air transport", "B": "road transport", "C": "water transport", "D": "pipeline" },
              correctAnswer: "C",
              explanation: "Water transport is the cheapest for carrying very heavy, bulky goods over long distances, though it is slow and limited to navigable routes."
            }
          }
        ]
      }
    ]
  },

  "Nigeria: Location and Physical Setting": {
    subject: "Geography",
    topic: "Nigeria: Location and Physical Setting",
    introduction: {
      title: "Nigeria: Location and Physical Setting",
      description: "This topic covers Nigeria's position and size, its neighbours, and its physical geography — relief, drainage, climate and vegetation belts.",
      jambInfo: "3-5 questions, very commonly on Nigeria's neighbours, rivers, climate zones and vegetation belts."
    },
    subtopics: [
      {
        name: "Location, Size and Political Divisions",
        objectives: [
          {
            title: "Describe Nigeria's location, size and neighbours",
            explanation: `<div class="key-points">
  <ul>
    <li>Nigeria lies in West Africa, roughly between latitudes <strong>4°N and 14°N</strong> and longitudes <strong>3°E and 15°E</strong>.</li>
    <li>Neighbours: <strong>Niger</strong> (north), <strong>Chad</strong> (north-east), <strong>Cameroon</strong> (east), <strong>Benin</strong> (west); the Atlantic Ocean (Gulf of Guinea) to the south.</li>
    <li>It has <strong>36 states</strong> and the Federal Capital Territory, Abuja.</li>
  </ul>
</div>`,
            question: {
              text: "Which country shares Nigeria's eastern boundary?",
              options: { "A": "Niger", "B": "Benin", "C": "Cameroon", "D": "Chad" },
              correctAnswer: "C",
              explanation: "Cameroon lies to the east of Nigeria. Niger is to the north, Benin to the west, and Chad to the north-east."
            }
          }
        ]
      },
      {
        name: "Relief, Drainage, Climate and Vegetation of Nigeria",
        objectives: [
          {
            title: "Describe Nigeria's drainage, climate and vegetation belts",
            explanation: `<div class="key-points">
  <h4>Drainage</h4>
  <ul><li>Dominated by the <strong>River Niger</strong> and its tributary the <strong>Benue</strong>, which meet at Lokoja to form a "Y"; also Lake Chad in the north-east.</li></ul>
  <h4>Climate & Vegetation (south to north)</h4>
  <ul>
    <li>Mangrove/swamp forest → tropical rainforest → guinea savanna → sudan savanna → sahel savanna.</li>
    <li>Rainfall and vegetation decrease northwards as the dry season lengthens.</li>
  </ul>
</div>`,
            question: {
              text: "The Rivers Niger and Benue meet (confluence) at",
              options: { "A": "Onitsha", "B": "Lokoja", "C": "Makurdi", "D": "Yola" },
              correctAnswer: "B",
              explanation: "The River Niger and River Benue meet at Lokoja, forming the confluence that gives the town its importance."
            }
          }
        ]
      }
    ]
  },

  "Nigeria: Population, Resources and Economic Activities": {
    subject: "Geography",
    topic: "Nigeria: Population, Resources and Economic Activities",
    introduction: {
      title: "Nigeria: Population, Resources and Economic Activities",
      description: "This topic covers Nigeria's population, its agriculture and mineral resources (especially petroleum), and its industry, transport and trade.",
      jambInfo: "3-5 questions, frequently on crops and their growing areas, mineral locations, and the importance of petroleum."
    },
    subtopics: [
      {
        name: "Population and Settlement in Nigeria",
        objectives: [
          {
            title: "Describe Nigeria's population distribution",
            explanation: `<div class="key-points">
  <ul>
    <li>Nigeria is Africa's most populous country (over 200 million).</li>
    <li>Population is <strong>unevenly distributed</strong> — dense around Lagos, the south-east and the Kano region; sparse in the middle belt and parts of the north-east.</li>
    <li>Major urban centres: Lagos, Kano, Ibadan, Port Harcourt, Abuja.</li>
  </ul>
</div>`,
            question: {
              text: "Nigeria's population is best described as",
              options: { "A": "evenly distributed", "B": "unevenly distributed", "C": "concentrated only in the north", "D": "concentrated only in the middle belt" },
              correctAnswer: "B",
              explanation: "Nigeria's population is unevenly distributed, with dense clusters around Lagos, the south-east and Kano, and sparse populations in the middle belt and north-east."
            }
          }
        ]
      },
      {
        name: "Agriculture and Mineral Resources of Nigeria",
        objectives: [
          {
            title: "Identify Nigeria's crops and minerals",
            explanation: `<div class="key-points">
  <h4>Cash Crops and Areas</h4>
  <ul><li>Cocoa (south-west), oil palm (south-east/south-south), groundnut and cotton (north), rubber (mid-west).</li></ul>
  <h4>Minerals</h4>
  <ul><li><strong>Petroleum and natural gas</strong> (Niger Delta), tin and columbite (Jos Plateau), coal (Enugu), limestone (widely, for cement), iron ore (Itakpe).</li></ul>
</div>
<div class="warning-box"><h4>Petroleum</h4><p>Petroleum is Nigeria's main foreign-exchange earner and the largest contributor to government revenue, though over-dependence on it is a major weakness of the economy.</p></div>`,
            question: {
              text: "The mineral mined mainly on the Jos Plateau is",
              options: { "A": "petroleum", "B": "coal", "C": "tin", "D": "limestone" },
              correctAnswer: "C",
              explanation: "Tin (with columbite) is mined mainly on the Jos Plateau. Petroleum is from the Niger Delta, coal from Enugu, and limestone from several areas."
            }
          }
        ]
      },
      {
        name: "Industry, Transport and Trade in Nigeria",
        objectives: [
          {
            title: "Describe Nigeria's industry and transport",
            explanation: `<div class="key-points">
  <ul>
    <li>Major industrial zones: Lagos, Kano, Port Harcourt, Aba, Kaduna.</li>
    <li>Transport: road (dominant), rail (Lagos-Kano, standard-gauge lines), water (inland waterways and seaports at Lagos, Port Harcourt, CalABAR), air, and oil/gas pipelines.</li>
    <li>Trade: exports dominated by crude oil; imports include machinery, manufactured goods and refined fuel.</li>
  </ul>
</div>`,
            question: {
              text: "Nigeria's export trade is dominated by",
              options: { "A": "cocoa", "B": "crude petroleum", "C": "textiles", "D": "groundnut" },
              correctAnswer: "B",
              explanation: "Crude petroleum dominates Nigeria's export trade, accounting for the largest share of foreign-exchange earnings."
            }
          }
        ]
      }
    ]
  },

  "Nigeria: Environmental Problems and ECOWAS": {
    subject: "Geography",
    topic: "Nigeria: Environmental Problems and ECOWAS",
    introduction: {
      title: "Nigeria: Environmental Problems and ECOWAS",
      description: "This topic covers Nigeria's major environmental problems by region and the aims and workings of ECOWAS, the West African economic community.",
      jambInfo: "2-3 questions, often on regional environmental problems and the objectives of ECOWAS."
    },
    subtopics: [
      {
        name: "Environmental Problems in Nigeria",
        objectives: [
          {
            title: "Identify regional environmental problems",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>North:</strong> desertification and drought (Sahel), soil erosion by wind.</li>
    <li><strong>South-east:</strong> severe gully erosion (e.g. around Agulu-Nanka).</li>
    <li><strong>Niger Delta:</strong> oil pollution, gas flaring, mangrove destruction.</li>
    <li><strong>Coastal/urban:</strong> flooding, coastal erosion and poor waste disposal.</li>
  </ul>
</div>`,
            question: {
              text: "Gully erosion is a particularly serious environmental problem in which part of Nigeria?",
              options: { "A": "The north-west", "B": "The south-east", "C": "The Niger Delta", "D": "The Sahel" },
              correctAnswer: "B",
              explanation: "The south-east, with its sandy soils and heavy rainfall, suffers severe gully erosion, notably around Agulu-Nanka in Anambra State."
            }
          }
        ]
      },
      {
        name: "ECOWAS and Regional Cooperation",
        objectives: [
          {
            title: "State the aims and members of ECOWAS",
            explanation: `<div class="key-points">
  <ul>
    <li><strong>ECOWAS</strong> (Economic Community of West African States) was formed in <strong>1975</strong> by the Treaty of Lagos.</li>
    <li><strong>Aims:</strong> promote economic integration, free movement of people and goods, a common market and cooperation among member states.</li>
    <li>Nigeria is the largest member and a driving force; benefits include a larger market, easier trade and regional security cooperation (ECOMOG).</li>
  </ul>
</div>`,
            question: {
              text: "ECOWAS was established in the year",
              options: { "A": "1963", "B": "1975", "C": "1985", "D": "1991" },
              correctAnswer: "B",
              explanation: "ECOWAS was established in 1975 through the Treaty of Lagos to promote economic integration among West African states."
            }
          }
        ]
      }
    ]
  }

};

window.GEOGRAPHY_LEARNING_CONTENT = GEOGRAPHY_LEARNING_CONTENT;
