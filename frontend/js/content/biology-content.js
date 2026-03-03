// Biology Learning Content
// Topics: Living Organisms, Variety of Organisms, Evolution and Advancement of Organisms

const BIOLOGY_LEARNING_CONTENT = {

  // ─────────────────────────────────────────────
  //  TOPIC 1: LIVING ORGANISMS
  // ─────────────────────────────────────────────
  "Living Organisms": {
    subject: "Biology",
    topic: "Living Organisms",
    introduction: {
      title: "Living Organisms",
      description: "All living things share certain fundamental characteristics that distinguish them from non-living matter. In this topic, we explore what makes something alive, examine the basic unit of life — the cell — and understand how living things are organised and classified.",
      jambInfo: "Living organisms is a core JAMB Biology topic. Expect questions on MRS GREN, cell organelles and their functions, differences between plant and animal cells, and levels of biological organisation."
    },
    subtopics: [
      {
        name: "Characteristics of Living Things",
        objectives: [
          {
            title: "MRS GREN — The 7 Life Processes",
            explanation: `
              <p>All living organisms carry out seven life processes, remembered with the acronym <strong>MRS GREN</strong>:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;">
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>M</strong> — Movement: All living things move (animals move whole bodies; plants move parts — e.g. sunflower tracking sun)
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>R</strong> — Respiration: Release of energy from food (aerobic uses O₂; anaerobic does not)
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>S</strong> — Sensitivity (Irritability): Ability to detect and respond to stimuli (e.g. Mimosa plant folds when touched)
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>G</strong> — Growth: Permanent increase in size and dry mass
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>R</strong> — Reproduction: Producing offspring (sexual or asexual)
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>E</strong> — Excretion: Removal of metabolic waste products (CO₂, urine, sweat)
                </div>
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;border-radius:6px;">
                  <strong>N</strong> — Nutrition: Taking in and using food/energy (autotrophic or heterotrophic)
                </div>
              </div>
              <div style="background:#fef9c3;border:1px solid #fbbf24;border-radius:8px;padding:12px;margin-top:10px;">
                <strong>⚠️ JAMB Tip:</strong> A car can move and use fuel, but it does NOT reproduce, grow, or excrete metabolic waste — so it is non-living.
              </div>`,
            question: {
              text: "Which of the following best explains why a car is NOT considered a living organism?",
              options: { A: "It does not move", B: "It does not use energy", C: "It cannot reproduce or grow", D: "It has no parts" },
              correctAnswer: "C",
              explanation: "A car can move and uses fuel (energy), but it cannot reproduce or grow — essential life processes. Therefore it is non-living."
            }
          },
          {
            title: "Types of Respiration",
            explanation: `
              <p>Respiration is the process by which organisms release energy from food molecules.</p>
              <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.93em;">
                <thead>
                  <tr style="background:#dcfce7;">
                    <th style="padding:8px;border:1px solid #86efac;text-align:left;">Feature</th>
                    <th style="padding:8px;border:1px solid #86efac;text-align:left;">Aerobic Respiration</th>
                    <th style="padding:8px;border:1px solid #86efac;text-align:left;">Anaerobic Respiration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:8px;border:1px solid #bbf7d0;">Oxygen required?</td><td style="padding:8px;border:1px solid #bbf7d0;">Yes</td><td style="padding:8px;border:1px solid #bbf7d0;">No</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:8px;border:1px solid #bbf7d0;">Products</td><td style="padding:8px;border:1px solid #bbf7d0;">CO₂ + H₂O + energy</td><td style="padding:8px;border:1px solid #bbf7d0;">Lactic acid or ethanol + CO₂ + less energy</td></tr>
                  <tr><td style="padding:8px;border:1px solid #bbf7d0;">Energy yield</td><td style="padding:8px;border:1px solid #bbf7d0;">High (38 ATP)</td><td style="padding:8px;border:1px solid #bbf7d0;">Low (2 ATP)</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:8px;border:1px solid #bbf7d0;">Example</td><td style="padding:8px;border:1px solid #bbf7d0;">Humans running</td><td style="padding:8px;border:1px solid #bbf7d0;">Yeast fermentation, muscles during sprint</td></tr>
                </tbody>
              </table>
              <p><strong>Aerobic equation:</strong> C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy</p>`,
            question: {
              text: "Which type of respiration produces the MOST energy?",
              options: { A: "Anaerobic respiration", B: "Aerobic respiration", C: "Both produce equal energy", D: "Fermentation" },
              correctAnswer: "B",
              explanation: "Aerobic respiration produces 38 ATP molecules per glucose, whereas anaerobic respiration produces only 2 ATP. Aerobic releases far more energy."
            }
          },
          {
            title: "Types of Nutrition",
            explanation: `
              <p>Organisms obtain nutrients in two main ways:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0;">
                <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px;border-radius:8px;">
                  <h4 style="color:#1d4ed8;margin:0 0 6px;">Autotrophic Nutrition</h4>
                  <p style="margin:0;font-size:0.92em;">Organism makes its own food using light energy (photosynthesis) or chemical energy (chemosynthesis).<br><br><strong>Examples:</strong> Green plants, algae, some bacteria</p>
                </div>
                <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;border-radius:8px;">
                  <h4 style="color:#b45309;margin:0 0 6px;">Heterotrophic Nutrition</h4>
                  <p style="margin:0;font-size:0.92em;">Organism obtains food by consuming other organisms — holozoic (ingestion), saprophytic (decaying matter), or parasitic (host).<br><br><strong>Examples:</strong> Animals, fungi, most bacteria</p>
                </div>
              </div>`,
            question: {
              text: "An organism that manufactures its own food using sunlight is described as:",
              options: { A: "Heterotrophic", B: "Parasitic", C: "Saprophytic", D: "Autotrophic" },
              correctAnswer: "D",
              explanation: "Autotrophic organisms (like plants) manufacture their own food using light energy through photosynthesis. Heterotrophs rely on consuming other organisms."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Which of the following is NOT a characteristic of living organisms?",
            options: { A: "Respiration", B: "Reproduction", C: "Combustion", D: "Excretion" },
            correctAnswer: "C",
            explanation: "Combustion is a chemical reaction, not a life process. The seven life processes (MRS GREN) include Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition."
          },
          {
            text: "A car can move and use fuel but is non-living because it does not:",
            options: { A: "Produce heat", B: "Use energy", C: "Reproduce or grow", D: "Respond to touch" },
            correctAnswer: "C",
            explanation: "The key life processes missing in a car are reproduction and growth — it cannot produce offspring or undergo biological growth."
          },
          {
            text: "Anaerobic respiration in yeast produces:",
            options: { A: "Lactic acid and water", B: "Carbon dioxide and water", C: "Ethanol and carbon dioxide", D: "Oxygen and glucose" },
            correctAnswer: "C",
            explanation: "In yeast, anaerobic respiration (fermentation) produces ethanol (alcohol) and carbon dioxide. In animal muscles, it produces lactic acid."
          },
          {
            text: "Which statement correctly distinguishes aerobic from anaerobic respiration?",
            options: { A: "Aerobic respiration does not require glucose", B: "Aerobic respiration requires oxygen and releases more energy", C: "Anaerobic respiration releases more energy", D: "Both processes produce equal amounts of ATP" },
            correctAnswer: "B",
            explanation: "Aerobic respiration requires oxygen and produces 38 ATP per glucose. Anaerobic only produces 2 ATP per glucose."
          },
          {
            text: "Green plants use sunlight to make food — this mode of nutrition is called:",
            options: { A: "Holozoic", B: "Saprophytic", C: "Parasitic", D: "Autotrophic" },
            correctAnswer: "D",
            explanation: "Green plants are autotrophs — they synthesise their own food via photosynthesis using sunlight, water, and CO₂."
          }
        ]
      },
      {
        name: "The Cell — Basic Unit of Life",
        objectives: [
          {
            title: "Cell Theory and Discovery",
            explanation: `
              <p>The <strong>Cell Theory</strong> states:</p>
              <ol style="padding-left:18px;line-height:1.8;">
                <li>All living things are made of one or more cells</li>
                <li>The cell is the basic unit of life</li>
                <li>All cells come from pre-existing cells</li>
              </ol>
              <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:12px;border-radius:6px;margin:12px 0;">
                <strong>Key Scientists:</strong><br>
                • <strong>Robert Hooke (1665)</strong> — first observed dead cork cells; coined the term "cell"<br>
                • <strong>Matthias Schleiden (1838)</strong> — all plants are made of cells<br>
                • <strong>Theodor Schwann (1839)</strong> — all animals are made of cells<br>
                • <strong>Rudolf Virchow (1855)</strong> — all cells arise from pre-existing cells
              </div>`,
            question: {
              text: "Who first used the word 'cell' to describe the basic unit of life?",
              options: { A: "Theodor Schwann", B: "Matthias Schleiden", C: "Robert Hooke", D: "Rudolf Virchow" },
              correctAnswer: "C",
              explanation: "Robert Hooke first observed dead cork cells under a microscope in 1665 and coined the term 'cell' because the structures reminded him of monks' cells in a monastery."
            }
          },
          {
            title: "Cell Organelles and Their Functions",
            explanation: `
              <p>Cells contain specialised structures called <strong>organelles</strong> that perform specific functions:</p>
              <table style="width:100%;border-collapse:collapse;font-size:0.91em;margin:10px 0;">
                <thead>
                  <tr style="background:#ede9fe;">
                    <th style="padding:8px;border:1px solid #c4b5fd;text-align:left;">Organelle</th>
                    <th style="padding:8px;border:1px solid #c4b5fd;text-align:left;">Function</th>
                    <th style="padding:8px;border:1px solid #c4b5fd;text-align:left;">Found In</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:7px;border:1px solid #ddd8fe;">Nucleus</td><td style="padding:7px;border:1px solid #ddd8fe;">Controls cell activities; contains DNA/chromosomes</td><td style="padding:7px;border:1px solid #ddd8fe;">Both</td></tr>
                  <tr style="background:#f5f3ff;"><td style="padding:7px;border:1px solid #ddd8fe;">Cell membrane</td><td style="padding:7px;border:1px solid #ddd8fe;">Controls entry and exit of substances (selective permeability)</td><td style="padding:7px;border:1px solid #ddd8fe;">Both</td></tr>
                  <tr><td style="padding:7px;border:1px solid #ddd8fe;">Cytoplasm</td><td style="padding:7px;border:1px solid #ddd8fe;">Site of chemical reactions; contains organelles</td><td style="padding:7px;border:1px solid #ddd8fe;">Both</td></tr>
                  <tr style="background:#f5f3ff;"><td style="padding:7px;border:1px solid #ddd8fe;">Mitochondria</td><td style="padding:7px;border:1px solid #ddd8fe;">Site of aerobic respiration; "powerhouse of cell"</td><td style="padding:7px;border:1px solid #ddd8fe;">Both</td></tr>
                  <tr><td style="padding:7px;border:1px solid #ddd8fe;">Ribosome</td><td style="padding:7px;border:1px solid #ddd8fe;">Site of protein synthesis</td><td style="padding:7px;border:1px solid #ddd8fe;">Both</td></tr>
                  <tr style="background:#f5f3ff;"><td style="padding:7px;border:1px solid #ddd8fe;">Cell wall</td><td style="padding:7px;border:1px solid #ddd8fe;">Provides rigid support and shape (made of cellulose)</td><td style="padding:7px;border:1px solid #ddd8fe;">Plant only</td></tr>
                  <tr><td style="padding:7px;border:1px solid #ddd8fe;">Chloroplast</td><td style="padding:7px;border:1px solid #ddd8fe;">Site of photosynthesis; contains chlorophyll</td><td style="padding:7px;border:1px solid #ddd8fe;">Plant only</td></tr>
                  <tr style="background:#f5f3ff;"><td style="padding:7px;border:1px solid #ddd8fe;">Large vacuole</td><td style="padding:7px;border:1px solid #ddd8fe;">Stores cell sap; maintains turgidity</td><td style="padding:7px;border:1px solid #ddd8fe;">Plant only</td></tr>
                </tbody>
              </table>`,
            question: {
              text: "Which organelle is responsible for controlling all the activities of the cell?",
              options: { A: "Mitochondria", B: "Nucleus", C: "Ribosome", D: "Cell membrane" },
              correctAnswer: "B",
              explanation: "The nucleus contains DNA and acts as the control centre of the cell, directing all cellular activities including growth, reproduction, and metabolism."
            }
          },
          {
            title: "Plant Cell vs Animal Cell",
            explanation: `
              <p>Although plant and animal cells share many features, there are important differences:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0;">
                <div style="background:#dcfce7;padding:12px;border-radius:8px;border:1px solid #86efac;">
                  <h4 style="color:#15803d;margin:0 0 8px;">🌿 Plant Cell ONLY has:</h4>
                  <ul style="margin:0;padding-left:16px;line-height:1.9;">
                    <li>Cell wall (cellulose)</li>
                    <li>Chloroplasts (for photosynthesis)</li>
                    <li>Large permanent vacuole</li>
                    <li>Starch as storage food</li>
                  </ul>
                </div>
                <div style="background:#fce7f3;padding:12px;border-radius:8px;border:1px solid #f9a8d4;">
                  <h4 style="color:#9d174d;margin:0 0 8px;">🐾 Animal Cell ONLY has:</h4>
                  <ul style="margin:0;padding-left:16px;line-height:1.9;">
                    <li>Centrioles (for cell division)</li>
                    <li>Glycogen as storage food</li>
                    <li>Irregular shape</li>
                    <li>Small/no vacuoles</li>
                  </ul>
                </div>
              </div>
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>🔑 Both have:</strong> Nucleus, cell membrane, cytoplasm, mitochondria, ribosomes, endoplasmic reticulum, Golgi apparatus
              </div>`,
            question: {
              text: "Which of the following structures is found in a plant cell but NOT in an animal cell?",
              options: { A: "Nucleus", B: "Mitochondria", C: "Ribosome", D: "Chloroplast" },
              correctAnswer: "D",
              explanation: "Chloroplasts are found only in plant cells (and some algae). They contain chlorophyll and are the sites of photosynthesis. Animal cells lack chloroplasts."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Which organelle is known as the 'powerhouse of the cell'?",
            options: { A: "Nucleus", B: "Ribosome", C: "Mitochondria", D: "Chloroplast" },
            correctAnswer: "C",
            explanation: "Mitochondria are the site of aerobic respiration, where most of the cell's ATP (energy) is produced. Hence they are called the powerhouse of the cell."
          },
          {
            text: "The cell wall of a plant cell is composed of:",
            options: { A: "Protein", B: "Cellulose", C: "Chitin", D: "Starch" },
            correctAnswer: "B",
            explanation: "The plant cell wall is made of cellulose, a polysaccharide that provides rigid structural support. Fungal cell walls are made of chitin."
          },
          {
            text: "Which organelle is responsible for protein synthesis?",
            options: { A: "Vacuole", B: "Chloroplast", C: "Mitochondria", D: "Ribosome" },
            correctAnswer: "D",
            explanation: "Ribosomes are the sites of protein synthesis. They translate mRNA into amino acid chains that form proteins."
          },
          {
            text: "A structure found in animal cells but absent in plant cells is:",
            options: { A: "Cell membrane", B: "Centriole", C: "Nucleus", D: "Cytoplasm" },
            correctAnswer: "B",
            explanation: "Centrioles are found only in animal cells. They play a role in cell division (forming the spindle fibres). Plant cells use other mechanisms for cell division."
          },
          {
            text: "Where does photosynthesis take place in a plant cell?",
            options: { A: "Mitochondria", B: "Nucleus", C: "Chloroplast", D: "Ribosome" },
            correctAnswer: "C",
            explanation: "Photosynthesis occurs in the chloroplasts. These organelles contain the green pigment chlorophyll which absorbs light energy."
          }
        ]
      },
      {
        name: "Organisation and Classification",
        objectives: [
          {
            title: "Levels of Biological Organisation",
            explanation: `
              <p>Living things are organised from the simplest to the most complex level:</p>
              <div style="display:flex;flex-direction:column;gap:6px;margin:12px 0;">
                <div style="background:#dbeafe;padding:10px 14px;border-radius:6px;border-left:4px solid #3b82f6;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.3em;">🔬</span>
                  <div><strong>Cell</strong> — basic unit of life (e.g. red blood cell, nerve cell)</div>
                </div>
                <div style="text-align:center;color:#6b7280;">↓</div>
                <div style="background:#e0f2fe;padding:10px 14px;border-radius:6px;border-left:4px solid #0284c7;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.3em;">🧱</span>
                  <div><strong>Tissue</strong> — group of similar cells doing the same job (e.g. muscle tissue, xylem)</div>
                </div>
                <div style="text-align:center;color:#6b7280;">↓</div>
                <div style="background:#f0fdf4;padding:10px 14px;border-radius:6px;border-left:4px solid #16a34a;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.3em;">🫀</span>
                  <div><strong>Organ</strong> — group of tissues working together (e.g. heart, leaf, kidney)</div>
                </div>
                <div style="text-align:center;color:#6b7280;">↓</div>
                <div style="background:#fef9c3;padding:10px 14px;border-radius:6px;border-left:4px solid #ca8a04;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.3em;">🩸</span>
                  <div><strong>Organ System</strong> — organs working together for one function (e.g. circulatory, digestive system)</div>
                </div>
                <div style="text-align:center;color:#6b7280;">↓</div>
                <div style="background:#fce7f3;padding:10px 14px;border-radius:6px;border-left:4px solid #db2777;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.3em;">🧍</span>
                  <div><strong>Organism</strong> — a complete living thing (e.g. human being, mango tree)</div>
                </div>
              </div>`,
            question: {
              text: "What is the correct sequence of biological organisation from simplest to most complex?",
              options: {
                A: "Organ → Cell → Tissue → System → Organism",
                B: "Tissue → Cell → Organ → Organism → System",
                C: "Cell → Tissue → Organ → System → Organism",
                D: "Cell → Organ → Tissue → System → Organism"
              },
              correctAnswer: "C",
              explanation: "The correct sequence is: Cell → Tissue → Organ → Organ System → Organism. Each level is made up of the level below it."
            }
          },
          {
            title: "Unicellular vs Multicellular Organisms",
            explanation: `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0;">
                <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe;">
                  <h4 style="margin:0 0 6px;color:#1d4ed8;">Unicellular Organisms (single cell)</h4>
                  <ul style="margin:0;padding-left:16px;font-size:0.92em;line-height:1.9;">
                    <li>All life functions in one cell</li>
                    <li>Amoeba, Paramecium, Euglena</li>
                    <li>Also called protozoa (animal-like) or algae (plant-like)</li>
                  </ul>
                </div>
                <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #86efac;">
                  <h4 style="margin:0 0 6px;color:#15803d;">Multicellular Organisms (many cells)</h4>
                  <ul style="margin:0;padding-left:16px;font-size:0.92em;line-height:1.9;">
                    <li>Cells are specialised (division of labour)</li>
                    <li>All plants and animals</li>
                    <li>Cells organised into tissues, organs, systems</li>
                  </ul>
                </div>
              </div>
              <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Special case — Viruses:</strong> Viruses are NOT cells — they are acellular (non-cellular). They only show life characteristics (reproduction) inside a host cell.
              </div>`,
            question: {
              text: "An organism whose entire body consists of only one cell is described as:",
              options: { A: "Multicellular", B: "Unicellular", C: "Acellular", D: "Colonial" },
              correctAnswer: "B",
              explanation: "A unicellular organism (like Amoeba or Paramecium) consists of only a single cell that carries out all life functions. Multicellular organisms have many specialised cells."
            }
          },
          {
            title: "The Five Kingdoms of Classification",
            explanation: `
              <p>Living organisms are classified into <strong>five kingdoms</strong>:</p>
              <table style="width:100%;border-collapse:collapse;font-size:0.91em;">
                <thead>
                  <tr style="background:#fce7f3;">
                    <th style="padding:8px;border:1px solid #f9a8d4;">Kingdom</th>
                    <th style="padding:8px;border:1px solid #f9a8d4;">Key Features</th>
                    <th style="padding:8px;border:1px solid #f9a8d4;">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:7px;border:1px solid #fecdd3;"><strong>Monera</strong></td><td style="padding:7px;border:1px solid #fecdd3;">Prokaryotic (no nucleus), unicellular</td><td style="padding:7px;border:1px solid #fecdd3;">Bacteria, Blue-green algae</td></tr>
                  <tr style="background:#fff7ed;"><td style="padding:7px;border:1px solid #fecdd3;"><strong>Protista</strong></td><td style="padding:7px;border:1px solid #fecdd3;">Eukaryotic, unicellular, aquatic</td><td style="padding:7px;border:1px solid #fecdd3;">Amoeba, Paramecium, Euglena</td></tr>
                  <tr><td style="padding:7px;border:1px solid #fecdd3;"><strong>Fungi</strong></td><td style="padding:7px;border:1px solid #fecdd3;">Eukaryotic, saprophytic, cell wall of chitin</td><td style="padding:7px;border:1px solid #fecdd3;">Mushrooms, Yeast, Moulds</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:7px;border:1px solid #fecdd3;"><strong>Plantae</strong></td><td style="padding:7px;border:1px solid #fecdd3;">Eukaryotic, autotrophic, cell wall of cellulose</td><td style="padding:7px;border:1px solid #fecdd3;">Mosses, Ferns, Flowering plants</td></tr>
                  <tr><td style="padding:7px;border:1px solid #fecdd3;"><strong>Animalia</strong></td><td style="padding:7px;border:1px solid #fecdd3;">Eukaryotic, heterotrophic, no cell wall</td><td style="padding:7px;border:1px solid #fecdd3;">Insects, Fish, Mammals</td></tr>
                </tbody>
              </table>`,
            question: {
              text: "Bacteria are classified in which kingdom?",
              options: { A: "Protista", B: "Fungi", C: "Monera", D: "Plantae" },
              correctAnswer: "C",
              explanation: "Bacteria belong to Kingdom Monera. They are prokaryotes — they have no membrane-bound nucleus. This distinguishes them from all other kingdoms whose members are eukaryotes."
            }
          }
        ],
        quizQuestions: [
          {
            text: "What is the correct sequence of biological organisation?",
            options: { A: "Organ → Tissue → Cell → System", B: "Cell → Organ → Tissue → System", C: "Cell → Tissue → Organ → System → Organism", D: "Tissue → Cell → Organ → Organism" },
            correctAnswer: "C",
            explanation: "The correct ascending order is: Cell → Tissue → Organ → Organ System → Organism."
          },
          {
            text: "Which of the following organisms is unicellular?",
            options: { A: "Earthworm", B: "Amoeba", C: "Mushroom", D: "Fern" },
            correctAnswer: "B",
            explanation: "Amoeba is a unicellular protist — its entire body is made of a single cell that carries out all life processes."
          },
          {
            text: "Kingdom Fungi is characterised by:",
            options: { A: "Autotrophic nutrition and chlorophyll", B: "Prokaryotic cells", C: "Saprophytic nutrition and chitin cell walls", D: "Single cells with pseudopodia" },
            correctAnswer: "C",
            explanation: "Fungi are saprophytes (they break down dead organic matter) and have cell walls made of chitin, unlike plant cell walls which are made of cellulose."
          },
          {
            text: "Viruses are described as acellular because:",
            options: { A: "They are too small to see", B: "They have no cell structure but only reproduce inside host cells", C: "They are made of only RNA", D: "They are part of Kingdom Monera" },
            correctAnswer: "B",
            explanation: "Viruses are acellular — they lack cellular structure (no cytoplasm, no organelles) and can only replicate inside host cells. They are exceptions to the cell theory."
          },
          {
            text: "Which kingdom contains only prokaryotic organisms?",
            options: { A: "Protista", B: "Fungi", C: "Animalia", D: "Monera" },
            correctAnswer: "D",
            explanation: "Kingdom Monera contains prokaryotes (bacteria and blue-green algae/cyanobacteria) — organisms with no true membrane-bound nucleus."
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  //  TOPIC 2: VARIETY OF ORGANISMS
  // ─────────────────────────────────────────────
  "Variety of Organisms": {
    subject: "Biology",
    topic: "Variety of Organisms",
    introduction: {
      title: "Variety of Organisms",
      description: "The diversity of life on Earth is reflected in the countless ways organisms have adapted to survive in their environments. Adaptations may be structural (body features), functional (physiological processes), or behavioural (actions and responses). Understanding these adaptations is key to understanding ecology and natural selection.",
      jambInfo: "JAMB frequently tests structural adaptations of birds and insects, functional adaptations of desert animals, and behavioural adaptations such as countershading, warning colouration, hibernation, and social behaviour in termites."
    },
    subtopics: [
      {
        name: "Structural Adaptations",
        objectives: [
          {
            title: "Bird Beak and Leg Adaptations",
            explanation: `
              <p><strong>Structural adaptations</strong> are physical features of an organism's body that help it survive in its habitat.</p>
              <h4 style="color:#0369a1;margin:10px 0 6px;">Bird Beak Types:</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div style="background:#eff6ff;padding:10px;border-radius:6px;border-left:3px solid #3b82f6;">
                  <strong>🌰 Short, strong, conical</strong><br>
                  <small>Seed-crackers (e.g. weaver bird, finch) — crush hard seeds</small>
                </div>
                <div style="background:#f0fdf4;padding:10px;border-radius:6px;border-left:3px solid #16a34a;">
                  <strong>🌸 Long, slender, curved</strong><br>
                  <small>Nectar feeders (e.g. sunbird) — probe deep into flowers</small>
                </div>
                <div style="background:#fef2f2;padding:10px;border-radius:6px;border-left:3px solid #ef4444;">
                  <strong>🦅 Hooked, sharp</strong><br>
                  <small>Flesh-tearers (e.g. eagle, hawk) — tear meat from prey</small>
                </div>
                <div style="background:#fff7ed;padding:10px;border-radius:6px;border-left:3px solid #f59e0b;">
                  <strong>🐟 Long, pointed, spear-like</strong><br>
                  <small>Fish catchers (e.g. kingfisher, heron) — spear fish in water</small>
                </div>
              </div>
              <h4 style="color:#0369a1;margin:10px 0 6px;">Bird Leg Types:</h4>
              <ul style="line-height:1.9;padding-left:18px;">
                <li><strong>Webbed feet</strong> (ducks, geese) — for swimming and paddling</li>
                <li><strong>Sharp talons/claws</strong> (eagles, owls) — for gripping and killing prey</li>
                <li><strong>Long, thin legs</strong> (flamingo, heron) — for wading in shallow water</li>
                <li><strong>Perching feet</strong> (sparrows) — three toes forward, one back for gripping branches</li>
              </ul>`,
            question: {
              text: "A bird with a long, slender, curved beak is most likely adapted for:",
              options: { A: "Cracking hard seeds", B: "Feeding on nectar in deep flowers", C: "Tearing flesh from prey", D: "Spearing fish underwater" },
              correctAnswer: "B",
              explanation: "A long, slender, curved beak is perfectly shaped to probe deep into tubular flowers to reach nectar. This is seen in sunbirds and hummingbirds."
            }
          },
          {
            title: "Insect Mouthpart Adaptations",
            explanation: `
              <p>Insects have highly specialised mouthparts adapted to their diet:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 0;">
                <div style="background:#fce7f3;padding:10px;border-radius:6px;text-align:center;">
                  <div style="font-size:1.8em;margin-bottom:4px;">🦟</div>
                  <strong>Mosquito</strong><br>
                  <small>Piercing and sucking — needle-like stylet pierces skin to suck blood</small>
                </div>
                <div style="background:#f5f3ff;padding:10px;border-radius:6px;text-align:center;">
                  <div style="font-size:1.8em;margin-bottom:4px;">🦋</div>
                  <strong>Butterfly</strong><br>
                  <small>Siphoning/coiled proboscis — uncoils to suck nectar from flowers</small>
                </div>
                <div style="background:#f0fdf4;padding:10px;border-radius:6px;text-align:center;">
                  <div style="font-size:1.8em;margin-bottom:4px;">🦗</div>
                  <strong>Grasshopper</strong><br>
                  <small>Biting and chewing — strong mandibles tear and grind plant material</small>
                </div>
              </div>
              <div style="background:#eff6ff;padding:10px;border-radius:6px;margin-top:8px;">
                <strong>Housefly:</strong> Sponging mouthparts — sponge-like labellum absorbs liquid food and liquefied solids
              </div>`,
            question: {
              text: "Which insect uses a long coiled proboscis to siphon nectar from flowers?",
              options: { A: "Mosquito", B: "Grasshopper", C: "Butterfly", D: "Housefly" },
              correctAnswer: "C",
              explanation: "The butterfly has a coiled proboscis (siphoning mouthpart) that uncoils to reach deep into flowers and suck nectar. Mosquitoes pierce and suck, grasshoppers bite and chew."
            }
          },
          {
            title: "Camouflage, Defence, and Thermoregulation",
            explanation: `
              <p><strong>Camouflage (Cryptic Colouration): </strong>Body colour or pattern matches the environment to avoid detection.</p>
              <ul style="padding-left:18px;line-height:1.9;">
                <li><strong>Stick insect</strong> — looks exactly like a twig; predators cannot distinguish it from plant material</li>
                <li><strong>Leaf butterfly</strong> — wings resemble dead leaves; blends with forest floor</li>
                <li><strong>Chameleon</strong> — can actively change colour to match surroundings</li>
                <li><strong>Grasshopper</strong> — green body blends with grass</li>
              </ul>
              <p style="margin-top:10px;"><strong>Defensive Structures:</strong></p>
              <ul style="padding-left:18px;line-height:1.9;">
                <li><strong>Porcupine</strong> — sharp quills deter predators</li>
                <li><strong>Snail/Tortoise</strong> — hard shell for protection</li>
                <li><strong>Cactus spines</strong> — reduce water loss AND deter animals from eating them</li>
                <li><strong>Waxy cuticle</strong> (desert plants/reptile scales) — prevent water loss</li>
              </ul>
              <p style="margin-top:10px;"><strong>Thermoregulation:</strong></p>
              <ul style="padding-left:18px;line-height:1.9;">
                <li>Birds: feathers trap air → insulation; oil glands waterproof feathers</li>
                <li>Mammals: fur/hair → insulation; subcutaneous fat → warmth</li>
                <li>Desert reptiles: scales reduce water loss AND thick skin reflects heat</li>
              </ul>`,
            question: {
              text: "Which of the following is an example of structural adaptation for camouflage?",
              options: { A: "A toad burying itself during dry seasons", B: "A stick insect resembling a twig", C: "A bat sleeping upside down during the day", D: "A fish migrating to warmer waters" },
              correctAnswer: "B",
              explanation: "Camouflage is a structural adaptation. The stick insect's body shape and colour resembles a twig, making it nearly invisible to predators — a physical (structural) feature."
            }
          }
        ],
        quizQuestions: [
          {
            text: "A bird with webbed feet is most likely adapted for:",
            options: { A: "Perching on branches", B: "Running on land", C: "Swimming and wading", D: "Catching prey in air" },
            correctAnswer: "C",
            explanation: "Webbed feet create a paddle-like surface that gives propulsion in water, making them ideal for swimming. Ducks, geese, and pelicans have this adaptation."
          },
          {
            text: "The mosquito's piercing and sucking mouthpart is adapted for:",
            options: { A: "Chewing leaves", B: "Lapping up fluids", C: "Penetrating skin and sucking blood", D: "Siphoning nectar" },
            correctAnswer: "C",
            explanation: "The mosquito has a needle-like stylet that can pierce the skin of its host and suck blood. The female mosquito uses this to obtain blood for egg development."
          },
          {
            text: "Cactus plants have spines instead of flat broad leaves, primarily to:",
            options: { A: "Attract pollinating insects", B: "Reduce water loss and deter animals", C: "Increase the surface area for photosynthesis", D: "Store excess water in stem" },
            correctAnswer: "B",
            explanation: "Cactus spines are modified leaves. They reduce the surface area exposed to sun (reducing transpiration/water loss) and protect against herbivores. Photosynthesis occurs in the green stem."
          },
          {
            text: "An eagle's hooked beak is an adaptation for:",
            options: { A: "Cracking seeds", B: "Probing flowers for nectar", C: "Tearing flesh from prey", D: "Scooping fish from water" },
            correctAnswer: "C",
            explanation: "Eagles, hawks, and other raptors have strong, hooked beaks designed for tearing flesh from their prey."
          },
          {
            text: "The thick waxy cuticle on desert plant leaves is an adaptation to:",
            options: { A: "Increase photosynthesis", B: "Prevent excessive water loss", C: "Absorb minerals from soil", D: "Provide structural support" },
            correctAnswer: "B",
            explanation: "The thick waxy cuticle on desert plants acts as a waterproof barrier, reducing water loss through transpiration — critical for survival in arid environments."
          }
        ]
      },
      {
        name: "Functional Adaptations",
        objectives: [
          {
            title: "Physiological Adaptations for Survival",
            explanation: `
              <p><strong>Functional (Physiological) Adaptations</strong> are internal body processes that help an organism survive.</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0;">
                <div style="background:#fff7ed;padding:12px;border-radius:8px;border-left:4px solid #f97316;">
                  <h4 style="color:#c2410c;margin:0 0 6px;">🌵 Desert Animals</h4>
                  <ul style="margin:0;padding-left:16px;font-size:0.92em;line-height:1.8;">
                    <li><strong>Camel:</strong> Fat stored in hump (energy reserve and metabolic water); concentrated urine; dry faeces</li>
                    <li><strong>Kangaroo rat:</strong> Produces highly concentrated urine — excretes waste with minimal water loss</li>
                    <li><strong>Desert lizard:</strong> Scales prevent water loss; burrows in daytime to avoid heat</li>
                  </ul>
                </div>
                <div style="background:#eff6ff;padding:12px;border-radius:8px;border-left:4px solid #3b82f6;">
                  <h4 style="color:#1d4ed8;margin:0 0 6px;">🐍 Venom Production</h4>
                  <ul style="margin:0;padding-left:16px;font-size:0.92em;line-height:1.8;">
                    <li>Snakes produce venom in modified salivary glands</li>
                    <li>Used for both prey capture and self-defence</li>
                    <li>Venom contains enzymes that break down proteins, blood cells, or nerve tissue</li>
                  </ul>
                </div>
              </div>
              <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Key point:</strong> Functional adaptations are NOT visible body structures — they are internal biochemical or physiological processes.
              </div>`,
            question: {
              text: "A camel's ability to store fat in its hump as an energy reserve is an example of a:",
              options: { A: "Behavioural adaptation", B: "Structural adaptation", C: "Functional (physiological) adaptation", D: "Camouflage adaptation" },
              correctAnswer: "C",
              explanation: "The metabolic use of fat stored in the hump to produce energy and water is an internal physiological process — a functional adaptation. The hump itself is structural, but the fat metabolism is functional."
            }
          },
          {
            title: "Water Conservation and Metabolic Adaptations",
            explanation: `
              <p>Organisms in water-scarce environments have evolved remarkable ways to conserve water:</p>
              <table style="width:100%;border-collapse:collapse;font-size:0.92em;margin:10px 0;">
                <thead>
                  <tr style="background:#dcfce7;">
                    <th style="padding:8px;border:1px solid #86efac;">Organism</th>
                    <th style="padding:8px;border:1px solid #86efac;">Functional Adaptation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:7px;border:1px solid #bbf7d0;">Desert reptiles</td><td style="padding:7px;border:1px solid #bbf7d0;">Dry, scaly skin prevents water loss; uric acid excreted (not urine) — requires no water</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:7px;border:1px solid #bbf7d0;">Birds</td><td style="padding:7px;border:1px solid #bbf7d0;">Excrete uric acid paste — conserves water; highly efficient kidneys</td></tr>
                  <tr><td style="padding:7px;border:1px solid #bbf7d0;">Deep-sea fish</td><td style="padding:7px;border:1px solid #bbf7d0;">Produce large amounts of dilute urine to counteract osmotic water loss in salt water</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:7px;border:1px solid #bbf7d0;">Freshwater fish</td><td style="padding:7px;border:1px solid #bbf7d0;">Produce large amounts of very dilute urine to expel excess water gained by osmosis</td></tr>
                </tbody>
              </table>`,
            question: {
              text: "Which functional adaptation helps desert animals conserve water?",
              options: { A: "Bright warning colouration", B: "Producing highly concentrated urine", C: "Countershading pigmentation", D: "Thick feathers for insulation" },
              correctAnswer: "B",
              explanation: "Desert animals like the kangaroo rat produce highly concentrated urine, excreting waste products while losing minimal water — a key physiological adaptation for arid environments."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Snake venom is produced in modified:",
            options: { A: "Sweat glands", B: "Salivary glands", C: "Liver cells", D: "Pancreatic glands" },
            correctAnswer: "B",
            explanation: "Snake venom is produced in modified salivary glands. This venom is used to immobilize prey and for self-defence."
          },
          {
            text: "A desert animal that produces highly concentrated urine is showing which type of adaptation?",
            options: { A: "Structural adaptation", B: "Behavioural adaptation", C: "Functional (physiological) adaptation", D: "Camouflage adaptation" },
            correctAnswer: "C",
            explanation: "Producing concentrated urine is an internal physiological mechanism — a functional adaptation that minimizes water loss in arid environments."
          },
          {
            text: "Reptiles excrete nitrogen as uric acid rather than urea because uric acid:",
            options: { A: "Is more toxic", B: "Requires less water to excrete", C: "Provides more energy", D: "Is easier to produce" },
            correctAnswer: "B",
            explanation: "Uric acid is nearly insoluble and can be excreted as a paste with minimal water loss. This is a critical water-conserving adaptation for reptiles and birds in dry environments."
          },
          {
            text: "The camel stores fat in its hump mainly to:",
            options: { A: "Balance its weight", B: "Keep it cool in the desert", C: "Serve as an energy and metabolic water reserve", D: "Attract mates" },
            correctAnswer: "C",
            explanation: "When the camel metabolises the fat in its hump, it produces energy and water (metabolic water). This helps it survive long periods without food or water in the desert."
          },
          {
            text: "Which is an example of a functional adaptation in animals?",
            options: { A: "A bird's beak shape", B: "A porcupine's sharp quills", C: "The hibernation of bears during winter", D: "Production of concentrated urine by desert rodents" },
            correctAnswer: "D",
            explanation: "Production of concentrated urine is an internal physiological process — a functional adaptation. Beak shape and quills are structural; hibernation is behavioural."
          }
        ]
      },
      {
        name: "Behavioural Adaptations",
        objectives: [
          {
            title: "Countershading and Warning Colouration",
            explanation: `
              <p><strong>Behavioural adaptations</strong> are actions or activities that increase an organism's chance of survival.</p>
              <h4 style="color:#7c3aed;margin:10px 0 6px;">Countershading:</h4>
              <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:12px;border-radius:6px;margin-bottom:12px;">
                <p style="margin:0 0 6px;">Countershading is when an animal's back (dorsal surface) is <strong>darker</strong> than its belly (ventral surface). This makes the animal harder to see from above (dark against dark water/ground) and from below (light against bright sky).</p>
                <p style="margin:0;font-size:0.93em;"><strong>Examples:</strong> Fish (dark back, white belly), toads, many sharks, penguins (white front, black back)</p>
              </div>
              <h4 style="color:#b45309;margin:10px 0 6px;">Warning Colouration (Aposematism):</h4>
              <div style="background:#fef9c3;border-left:4px solid #ca8a04;padding:12px;border-radius:6px;">
                <p style="margin:0 0 6px;">Bright, conspicuous colours warn predators that the organism is <strong>toxic or dangerous</strong>.</p>
                <p style="margin:0;font-size:0.93em;"><strong>Examples:</strong> Poisonous mushrooms (red/orange caps), brightly coloured poison dart frogs, bees and wasps (yellow and black stripes), fire salamanders</p>
              </div>`,
            question: {
              text: "The dark dorsal and light ventral colouration of fish is an example of:",
              options: { A: "Warning colouration", B: "Mimicry", C: "Countershading", D: "Camouflage" },
              correctAnswer: "C",
              explanation: "Countershading describes the pattern where the back (dorsal surface) is darker than the belly (ventral surface). This makes the fish less visible from both above and below the water surface."
            }
          },
          {
            title: "Social Behaviour — Termite Castes",
            explanation: `
              <p>Termites display remarkable <strong>social organisation with division of labour</strong> among different castes:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;">
                <div style="background:#fef3c7;padding:10px;border-radius:6px;border-left:3px solid #f59e0b;">
                  <strong>👑 Queen</strong>
                  <p style="margin:4px 0 0;font-size:0.9em;">Largest individual; lays thousands of eggs per day; primarily reproductive role</p>
                </div>
                <div style="background:#dbeafe;padding:10px;border-radius:6px;border-left:3px solid #3b82f6;">
                  <strong>🤴 King</strong>
                  <p style="margin:4px 0 0;font-size:0.9em;">Fertilises the queen's eggs; stays permanently in the royal chamber</p>
                </div>
                <div style="background:#dcfce7;padding:10px;border-radius:6px;border-left:3px solid #16a34a;">
                  <strong>👷 Workers</strong>
                  <p style="margin:4px 0 0;font-size:0.9em;">Sterile; most numerous; build and repair nest mounds, gather food, feed queen and soldiers and young</p>
                </div>
                <div style="background:#fce7f3;padding:10px;border-radius:6px;border-left:3px solid #db2777;">
                  <strong>⚔️ Soldiers</strong>
                  <p style="margin:4px 0 0;font-size:0.9em;">Sterile; defend colony with large jaws or chemical sprays; cannot feed themselves (workers feed them)</p>
                </div>
              </div>
              <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Key concept:</strong> Division of labour in a termite colony is a behavioural adaptation — each caste performs a specific role, making the colony highly efficient as a unit.
              </div>`,
            question: {
              text: "In a termite colony, the soldiers are mainly responsible for:",
              options: { A: "Laying eggs for the colony", B: "Building and repairing the nest", C: "Fertilising the queen's eggs", D: "Defending the colony from attack" },
              correctAnswer: "D",
              explanation: "Soldier termites defend the colony. They have large mandibles (or chemical spray glands) for fighting off predators and intruders. They cannot feed themselves and must be fed by worker termites."
            }
          },
          {
            title: "Hibernation, Aestivation, and Other Behaviours",
            explanation: `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0;">
                <div style="background:#eff6ff;padding:12px;border-radius:8px;">
                  <h4 style="color:#1d4ed8;margin:0 0 6px;">❄️ Hibernation</h4>
                  <p style="margin:0;font-size:0.92em;">State of deep sleep/inactivity during <strong>cold winter</strong> periods when food is scarce. Heart rate, breathing, and metabolism slow dramatically to conserve energy.<br><br><strong>Examples:</strong> Bears, hedgehogs, bats, some squirrels</p>
                </div>
                <div style="background:#fff7ed;padding:12px;border-radius:8px;">
                  <h4 style="color:#c2410c;margin:0 0 6px;">☀️ Aestivation</h4>
                  <p style="margin:0;font-size:0.92em;">State of dormancy during <strong>hot, dry seasons</strong>. Animals reduce activity and burrow to avoid heat and desiccation.<br><br><strong>Examples:</strong> Toads, snails, lungfish — burrow in mud or soil</p>
                </div>
              </div>
              <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:12px;border-radius:6px;margin-top:8px;">
                <h4 style="margin:0 0 6px;color:#6d28d9;">🦎 Lizard Basking</h4>
                <p style="margin:0;font-size:0.92em;">Reptiles are ectothermic (cold-blooded) — they cannot generate their own body heat. Basking in sunlight raises their body temperature to the level needed for normal activity. The male Agama lizard basks on rocks in the morning and develops bright red-orange head colouration during the mating season (also a display behaviour to attract females and deter rival males).</p>
              </div>`,
            question: {
              text: "A lizard basking on a warm rock in the morning is demonstrating a behavioural adaptation for:",
              options: { A: "Warning predators of its toxicity", B: "Regulating its body temperature", C: "Attracting a mate", D: "Conserving water" },
              correctAnswer: "B",
              explanation: "Lizards are ectotherms (cold-blooded). By basking in sunlight they absorb heat to raise their body temperature to the level required for normal metabolic activities — this is thermoregulatory behaviour."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Bright colouration of poisonous mushrooms serves to:",
            options: { A: "Attract insects for pollination", B: "Absorb more sunlight", C: "Warn predators of their toxicity", D: "Help them blend into the environment" },
            correctAnswer: "C",
            explanation: "Warning colouration (aposematism) in poisonous mushrooms signals to potential predators that they are dangerous or unpalatable — discouraging them from eating the organism."
          },
          {
            text: "The division of labour observed in a termite colony is a form of:",
            options: { A: "Structural adaptation", B: "Functional adaptation", C: "Behavioural adaptation", D: "Mimicry" },
            correctAnswer: "C",
            explanation: "Division of labour — where different castes (queen, king, workers, soldiers) perform specific roles — is a social/behavioural adaptation that makes the termite colony highly efficient."
          },
          {
            text: "Toads and snails that become dormant during the dry, hot season are said to undergo:",
            options: { A: "Hibernation", B: "Aestivation", C: "Migration", D: "Countershading" },
            correctAnswer: "B",
            explanation: "Aestivation is dormancy during hot, dry conditions (opposite of hibernation which occurs in cold conditions). Toads and snails burrow into mud/soil and seal themselves to avoid desiccation."
          },
          {
            text: "Which of these is a behavioural adaptation?",
            options: { A: "A shark's streamlined body shape", B: "A frog's moist permeable skin", C: "A bear entering a cave and sleeping through winter", D: "A camel's long eyelashes to keep out sand" },
            correctAnswer: "C",
            explanation: "A bear entering a cave and sleeping (hibernating) through winter is a behavioural adaptation — it is an action the animal performs. Body shape, skin permeability, and eyelashes are structural."
          },
          {
            text: "In a countershaded fish, the back is darker than the belly in order to:",
            options: { A: "Warn predators", B: "Regulate body temperature", C: "Make the fish harder to see from above and below", D: "Assist in reproduction" },
            correctAnswer: "C",
            explanation: "Countershading makes fish difficult to see: the dark back is hard to spot from above (against dark water below) and the light belly is hard to spot from below (against bright sky above)."
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  //  TOPIC 3: EVOLUTION AND ADVANCEMENT OF ORGANISMS
  // ─────────────────────────────────────────────
  "Evolution and Advancement of Organisms": {
    subject: "Biology",
    topic: "Evolution and Advancement of Organisms",
    introduction: {
      title: "Evolution and Advancement of Organisms",
      description: "Evolution is the process of gradual change in the inherited characteristics of populations over successive generations. This topic traces the evolutionary progression from simple single-celled organisms through to complex plants and animals, examining the key features that mark each major advancement.",
      jambInfo: "JAMB commonly tests the evolutionary sequence of plant kingdoms (Thallophyta → Bryophyta → Pteridophyta → Spermatophyta), the advancement from invertebrates to vertebrates, and distinguishing features of each group (e.g. arthropods vs annelids, amphibians vs fish)."
    },
    subtopics: [
      {
        name: "Evolution of Plants",
        objectives: [
          {
            title: "The Five Kingdoms and Simple Organisms",
            explanation: `
              <p>Before tracing plant evolution, we review the kingdoms of simple organisms:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 0;">
                <div style="background:#fef2f2;padding:10px;border-radius:6px;border-left:3px solid #ef4444;">
                  <strong>Kingdom Monera</strong><br>
                  <small>Prokaryotes: bacteria and cyanobacteria. No membrane-bound nucleus. Reproduce by binary fission. Simplest living organisms.</small>
                </div>
                <div style="background:#fff7ed;padding:10px;border-radius:6px;border-left:3px solid #f97316;">
                  <strong>Kingdom Protista</strong><br>
                  <small>Simple eukaryotes: Amoeba (pseudopodia), Paramecium (cilia), Euglena (flagellum). Aquatic, mostly unicellular.</small>
                </div>
                <div style="background:#f5f3ff;padding:10px;border-radius:6px;border-left:3px solid #8b5cf6;">
                  <strong>Kingdom Fungi</strong><br>
                  <small>Made of hyphae (thread-like filaments) forming mycelium. Reproduce by spores. Include mushrooms, yeast, moulds. Saprophytic.</small>
                </div>
              </div>`,
            question: {
              text: "Which kingdom consists of prokaryotic organisms that reproduce by binary fission?",
              options: { A: "Protista", B: "Fungi", C: "Monera", D: "Plantae" },
              correctAnswer: "C",
              explanation: "Kingdom Monera contains prokaryotes (bacteria and cyanobacteria). They have no membrane-bound nucleus and reproduce asexually by binary fission — simply splitting in two."
            }
          },
          {
            title: "The Evolutionary Sequence of Plants",
            explanation: `
              <p>Plants evolved from simple aquatic organisms to complex land plants. The sequence is:</p>
              <div style="display:flex;flex-direction:column;gap:4px;margin:10px 0;">
                <div style="background:#dcfce7;padding:10px 14px;border-radius:6px;border-left:4px solid #16a34a;">
                  <strong>1. Thallophyta</strong> — Algae (seaweeds: Chlamydomonas, Spirogyra, Fucus). Aquatic; no roots, stems, or leaves; no vascular tissue. Simplest plants.
                </div>
                <div style="text-align:center;color:#6b7280;font-size:1.2em;">↓</div>
                <div style="background:#d1fae5;padding:10px 14px;border-radius:6px;border-left:4px solid #059669;">
                  <strong>2. Bryophyta</strong> — Mosses and liverworts. Still need moist areas; no true vascular tissue; have rhizoids (anchor to ground); true leaves and stems. First land plants.
                </div>
                <div style="text-align:center;color:#6b7280;font-size:1.2em;">↓</div>
                <div style="background:#a7f3d0;padding:10px 14px;border-radius:6px;border-left:4px solid #047857;">
                  <strong>3. Pteridophyta</strong> — Ferns. Have true vascular tissues (xylem and phloem) for water and mineral transport. Reproduce by spores. Can live in drier areas than bryophytes.
                </div>
                <div style="text-align:center;color:#6b7280;font-size:1.2em;">↓</div>
                <div style="background:#6ee7b7;padding:10px 14px;border-radius:6px;border-left:4px solid #065f46;">
                  <strong>4. Spermatophyta</strong> — Seed plants. Two subgroups:<br>
                  • <strong>Gymnosperms</strong> (naked seeds, e.g. pine, cycad — seeds not enclosed in fruit)<br>
                  • <strong>Angiosperms</strong> (enclosed seeds in fruit, e.g. mango, maize) — most advanced; monocots and dicots
                </div>
              </div>
              <div style="background:#fef9c3;border:1px solid #fbbf24;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Key evolutionary trend:</strong> Aquatic → Terrestrial; Spores → Seeds; No vascular tissue → Vascular tissue; Simplest → Most complex
              </div>`,
            question: {
              text: "What is the correct evolutionary sequence of plant groups from the most primitive to the most advanced?",
              options: {
                A: "Bryophyta → Thallophyta → Pteridophyta → Spermatophyta",
                B: "Thallophyta → Bryophyta → Pteridophyta → Spermatophyta",
                C: "Pteridophyta → Bryophyta → Thallophyta → Spermatophyta",
                D: "Spermatophyta → Pteridophyta → Bryophyta → Thallophyta"
              },
              correctAnswer: "B",
              explanation: "The correct evolutionary sequence is: Thallophyta (algae) → Bryophyta (mosses) → Pteridophyta (ferns) → Spermatophyta (seed plants). This traces the progression from aquatic, non-vascular plants to complex terrestrial seed-bearing plants."
            }
          },
          {
            title: "Key Evolutionary Advances in Plants",
            explanation: `
              <table style="width:100%;border-collapse:collapse;font-size:0.92em;margin:10px 0;">
                <thead>
                  <tr style="background:#d1fae5;">
                    <th style="padding:8px;border:1px solid #6ee7b7;">Group</th>
                    <th style="padding:8px;border:1px solid #6ee7b7;">Vascular Tissue</th>
                    <th style="padding:8px;border:1px solid #6ee7b7;">Reproduction</th>
                    <th style="padding:8px;border:1px solid #6ee7b7;">Habitat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:7px;border:1px solid #a7f3d0;">Thallophyta</td><td style="padding:7px;border:1px solid #a7f3d0;">None</td><td style="padding:7px;border:1px solid #a7f3d0;">Spores / fragmentation</td><td style="padding:7px;border:1px solid #a7f3d0;">Aquatic</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:7px;border:1px solid #a7f3d0;">Bryophyta</td><td style="padding:7px;border:1px solid #a7f3d0;">None (rhizoids)</td><td style="padding:7px;border:1px solid #a7f3d0;">Spores</td><td style="padding:7px;border:1px solid #a7f3d0;">Moist land</td></tr>
                  <tr><td style="padding:7px;border:1px solid #a7f3d0;">Pteridophyta</td><td style="padding:7px;border:1px solid #a7f3d0;">Yes (xylem+phloem)</td><td style="padding:7px;border:1px solid #a7f3d0;">Spores</td><td style="padding:7px;border:1px solid #a7f3d0;">Damp land</td></tr>
                  <tr style="background:#f0fdf4;"><td style="padding:7px;border:1px solid #a7f3d0;">Gymnosperms</td><td style="padding:7px;border:1px solid #a7f3d0;">Yes</td><td style="padding:7px;border:1px solid #a7f3d0;">Naked seeds</td><td style="padding:7px;border:1px solid #a7f3d0;">Terrestrial</td></tr>
                  <tr><td style="padding:7px;border:1px solid #a7f3d0;">Angiosperms</td><td style="padding:7px;border:1px solid #a7f3d0;">Yes (advanced)</td><td style="padding:7px;border:1px solid #a7f3d0;">Enclosed seeds</td><td style="padding:7px;border:1px solid #a7f3d0;">Terrestrial (diverse)</td></tr>
                </tbody>
              </table>`,
            question: {
              text: "The main advancement that allowed plants to move from aquatic to truly terrestrial environments was the development of:",
              options: { A: "Rhizoids for anchoring", B: "Broad flat leaves", C: "Vascular tissues and seeds", D: "Chlorophyll for photosynthesis" },
              correctAnswer: "C",
              explanation: "Vascular tissues (xylem and phloem) allowed efficient transport of water and nutrients throughout the plant body, reducing dependence on surrounding water. Seeds allowed reproduction on dry land without standing water."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Which group of plants has TRUE vascular tissues AND reproduces by spores?",
            options: { A: "Thallophyta", B: "Bryophyta", C: "Pteridophyta", D: "Gymnosperms" },
            correctAnswer: "C",
            explanation: "Pteridophyta (ferns) have true vascular tissues (xylem and phloem) but still reproduce by spores — placing them between bryophytes (no vascular tissue) and seed plants in the evolutionary sequence."
          },
          {
            text: "Which characteristic distinguishes Angiosperms from Gymnosperms?",
            options: { A: "Angiosperms reproduce by spores", B: "Gymnosperms have vascular tissue, Angiosperms do not", C: "Angiosperms have seeds enclosed in a fruit", D: "Gymnosperms produce flowers" },
            correctAnswer: "C",
            explanation: "The key distinction is that angiosperms have their seeds enclosed within a fruit (ovary wall), while gymnosperms bear naked seeds not enclosed in fruit (e.g., pine cones)."
          },
          {
            text: "Mosses and liverworts belong to the group:",
            options: { A: "Thallophyta", B: "Bryophyta", C: "Pteridophyta", D: "Spermatophyta" },
            correctAnswer: "B",
            explanation: "Mosses and liverworts are bryophytes. They are the most primitive land plants — they have no true vascular tissue and require moist conditions for reproduction."
          },
          {
            text: "The most primitive group of plants is:",
            options: { A: "Pteridophyta", B: "Bryophyta", C: "Thallophyta", D: "Spermatophyta" },
            correctAnswer: "C",
            explanation: "Thallophyta (algae) are the most primitive plants. They are aquatic, have no true roots/stems/leaves, and lack vascular tissue."
          },
          {
            text: "Plants that bear naked (uncovered) seeds belong to which group?",
            options: { A: "Angiosperms", B: "Bryophyta", C: "Pteridophyta", D: "Gymnosperms" },
            correctAnswer: "D",
            explanation: "Gymnosperms (meaning 'naked seed') bear seeds that are not enclosed in a fruit — they are exposed directly on the surface of cone scales. Examples include pine trees, cedars, and cycads."
          }
        ]
      },
      {
        name: "Evolution of Animals — Invertebrates",
        objectives: [
          {
            title: "Simple Invertebrates: Coelenterates to Annelids",
            explanation: `
              <p>Animals evolved from simple to complex body plans. The invertebrate sequence:</p>
              <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0;">
                <div style="background:#fef2f2;padding:10px;border-radius:6px;border-left:4px solid #ef4444;">
                  <strong>Coelenterata (Cnidaria)</strong> — e.g. Hydra, jellyfish, sea anemone<br>
                  <small>Radial symmetry; two cell layers; tentacles with stinging cells (nematocysts); only one body opening; no organs</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#fff7ed;padding:10px;border-radius:6px;border-left:4px solid #f97316;">
                  <strong>Platyhelminthes (Flatworms)</strong> — e.g. Taenia (tapeworm), Planaria, Fasciola<br>
                  <small>Bilateral symmetry; flat body; three cell layers; no body cavity; some are parasitic</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#fefce8;padding:10px;border-radius:6px;border-left:4px solid #ca8a04;">
                  <strong>Nematoda (Roundworms)</strong> — e.g. Ascaris, hookworm, filaria<br>
                  <small>Cylindrical body; complete digestive system (mouth AND anus — first to have this); many are parasites</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#f0fdf4;padding:10px;border-radius:6px;border-left:4px solid #16a34a;">
                  <strong>Annelida (Segmented worms)</strong> — e.g. Earthworm, leech<br>
                  <small>Segmented body; true coelom (body cavity); closed circulatory system; setae for movement</small>
                </div>
              </div>`,
            question: {
              text: "Which invertebrate phylum first shows a COMPLETE digestive system with both a mouth and an anus?",
              options: { A: "Coelenterata", B: "Platyhelminthes", C: "Nematoda", D: "Annelida" },
              correctAnswer: "C",
              explanation: "Nematoda (roundworms) are the first group in the evolutionary sequence to have a complete through-gut with both a mouth (for ingestion) and an anus (for egestion) — a significant evolutionary advance."
            }
          },
          {
            title: "Advanced Invertebrates: Molluscs and Arthropods",
            explanation: `
              <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0;">
                <div style="background:#e0f2fe;padding:10px;border-radius:6px;border-left:4px solid #0284c7;">
                  <strong>Mollusca</strong> — e.g. Snails, slugs, octopus, clams<br>
                  <small>Soft body; often with shell; muscular foot for locomotion; some have gills; some have lungs</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#ede9fe;padding:10px;border-radius:6px;border-left:4px solid #7c3aed;">
                  <strong>Arthropoda</strong> — most diverse and successful phylum<br>
                  <small>Jointed legs (arthropod = jointed legs); hard exoskeleton (chitin); segmented body; undergo moulting (ecdysis)</small><br>
                  <small><strong>Classes:</strong> Insecta (mosquito, butterfly, cockroach, bee), Crustacea (crab, prawn), Arachnida (spider, scorpion), Myriapoda (centipede, millipede)</small>
                </div>
              </div>
              <div style="background:#fef9c3;border:1px solid #fbbf24;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Evolutionary sequence of invertebrates:</strong><br>
                Coelenterates → Flatworms → Roundworms → Annelids → Molluscs → Arthropods<br>
                <small>(Increasing complexity: no organs → organs → segmentation → jointed appendages + exoskeleton)</small>
              </div>
              <p style="margin-top:10px;"><strong>Economic importance of Arthropods:</strong></p>
              <ul style="padding-left:18px;line-height:1.8;font-size:0.92em;">
                <li><strong>Beneficial:</strong> Bees → pollination and honey; Silkworm → silk production; Some crustaceans → food (crabs, prawns)</li>
                <li><strong>Harmful:</strong> Mosquitoes → malaria/dengue vectors; Locusts → crop destruction; Housefly → disease transmission</li>
              </ul>`,
            question: {
              text: "Arthropods are distinguished from Annelids mainly by the possession of:",
              options: { A: "A segmented body", B: "A hard exoskeleton and jointed legs", C: "A complete digestive system", D: "A closed circulatory system" },
              correctAnswer: "B",
              explanation: "Both annelids and arthropods have segmented bodies. What distinguishes arthropods is their hard chitinous exoskeleton and jointed appendages (legs/wings). This is the key diagnostic feature of Phylum Arthropoda."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Hydra belongs to which invertebrate phylum?",
            options: { A: "Platyhelminthes", B: "Coelenterata", C: "Annelida", D: "Arthropoda" },
            correctAnswer: "B",
            explanation: "Hydra is a coelenterate (cnidarian). It has radial symmetry, tentacles with stinging cells (nematocysts), and only one body opening serving as both mouth and anus."
          },
          {
            text: "Which phylum contains animals with jointed legs and a hard exoskeleton?",
            options: { A: "Mollusca", B: "Annelida", C: "Arthropoda", D: "Nematoda" },
            correctAnswer: "C",
            explanation: "Arthropoda is defined by jointed appendages (jointed legs) and a hard chitinous exoskeleton. This phylum includes insects, crustaceans, arachnids, and myriapods."
          },
          {
            text: "Tapeworms (Taenia) belong to which phylum?",
            options: { A: "Nematoda", B: "Coelenterata", C: "Platyhelminthes", D: "Annelida" },
            correctAnswer: "C",
            explanation: "Tapeworms (Taenia) are flatworms belonging to Phylum Platyhelminthes. They have flat, ribbon-like bodies and are internal parasites of vertebrate intestines."
          },
          {
            text: "Which is an economic benefit of arthropods?",
            options: { A: "Tapeworms decompose dead matter", B: "Bees pollinate crops and produce honey", C: "Earthworms transmit malaria", D: "Molluscs produce silk" },
            correctAnswer: "B",
            explanation: "Bees (Class Insecta, Phylum Arthropoda) are vital pollinators for crops and produce honey and beeswax, making them economically important. Silkworms also produce silk."
          },
          {
            text: "The correct evolutionary sequence of invertebrates from simplest to most complex is:",
            options: {
              A: "Arthropoda → Annelida → Platyhelminthes → Coelenterata",
              B: "Coelenterata → Platyhelminthes → Nematoda → Annelida → Arthropoda",
              C: "Nematoda → Coelenterata → Annelida → Platyhelminthes → Arthropoda",
              D: "Platyhelminthes → Coelenterata → Arthropoda → Nematoda → Annelida"
            },
            correctAnswer: "B",
            explanation: "The evolutionary sequence from simplest to most complex is: Coelenterates (radial, 2 layers) → Flatworms (bilateral, 3 layers) → Roundworms (complete gut) → Annelids (segmented) → Arthropods (exoskeleton, jointed legs)."
          }
        ]
      },
      {
        name: "Evolution of Animals — Vertebrates",
        objectives: [
          {
            title: "From Fish to Amphibians",
            explanation: `
              <p>Vertebrates (animals with backbones) evolved progressively from wholly aquatic to fully terrestrial.</p>
              <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0;">
                <div style="background:#dbeafe;padding:10px;border-radius:6px;border-left:4px solid #3b82f6;">
                  <strong>🐟 Class Pisces (Fish)</strong><br>
                  <small>Gills for breathing (aquatic); fins for swimming; scales; cold-blooded (ectothermic); lay eggs in water; two-chambered heart; lateral line for water pressure detection. Examples: Tilapia, sharks, eels</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#dcfce7;padding:10px;border-radius:6px;border-left:4px solid #16a34a;">
                  <strong>🐸 Class Amphibia</strong><br>
                  <small>Gills as larvae → lungs as adults; moist, smooth, permeable skin; cold-blooded; lay eggs in water; three-chambered heart; can live in water AND on land. Examples: Frogs, toads, salamanders<br>
                  <strong>Frog life cycle:</strong> Egg → Tadpole (aquatic, gills) → Young frog (lungs develop) → Adult frog (lungs + moist skin)</small>
                </div>
              </div>
              <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Key advancement of Amphibia over Fish:</strong> Development of <strong>lungs</strong> and limbs allowing them to breathe air and move on land — a major evolutionary milestone.
              </div>`,
            question: {
              text: "What is the main advancement of amphibians over fish that allowed them to live on land?",
              options: { A: "Development of scales", B: "Loss of a backbone", C: "Development of lungs for breathing air", D: "Ability to lay hard-shelled eggs" },
              correctAnswer: "C",
              explanation: "Amphibians advanced over fish primarily by developing lungs (in addition to starting life with gills) which allow them to breathe air on land. They also developed limbs for terrestrial locomotion."
            }
          },
          {
            title: "Reptiles, Birds, and Mammals",
            explanation: `
              <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0;">
                <div style="background:#fef9c3;padding:10px;border-radius:6px;border-left:4px solid #ca8a04;">
                  <strong>🦎 Class Reptilia</strong><br>
                  <small>Dry, scaly skin; cold-blooded; lungs; lay shelled (amniotic) eggs on land — no longer dependent on water for reproduction; three-chambered heart (most). Examples: Snakes, lizards, crocodiles, turtles</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#fce7f3;padding:10px;border-radius:6px;border-left:4px solid #db2777;">
                  <strong>🦅 Class Aves (Birds)</strong><br>
                  <small>Feathers and wings; warm-blooded (endothermic); hollow bones for flight; lay hard-shelled eggs; four-chambered heart; beak without teeth. Examples: Eagles, parrots, penguins</small>
                </div>
                <div style="text-align:center;font-size:1.1em;color:#6b7280;">↓</div>
                <div style="background:#ede9fe;padding:10px;border-radius:6px;border-left:4px solid #7c3aed;">
                  <strong>🐘 Class Mammalia</strong><br>
                  <small>Hair/fur; warm-blooded; mammary glands (suckle young); four-chambered heart; most give birth to live young (viviparous); highly developed brain. Examples: Humans, dogs, whales, bats</small>
                </div>
              </div>
              <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:8px;padding:10px;margin-top:8px;">
                <strong>Evolutionary sequence:</strong> Fish → Amphibians → Reptiles → Birds → Mammals<br>
                <strong>Evolutionary trend:</strong> Cold-blooded → Warm-blooded; Gills → Lungs; Eggs in water → Shelled eggs on land → Live birth; Simple brain → Complex brain
              </div>`,
            question: {
              text: "Which class of vertebrates is characterised by hair, mammary glands, and a four-chambered heart?",
              options: { A: "Reptilia", B: "Aves", C: "Amphibia", D: "Mammalia" },
              correctAnswer: "D",
              explanation: "Mammalia is characterised by: hair/fur on the body, mammary glands for feeding young milk, and a four-chambered heart. These are the defining characteristics of the most evolutionarily advanced class of vertebrates."
            }
          },
          {
            title: "Comparative Features of Vertebrate Classes",
            explanation: `
              <table style="width:100%;border-collapse:collapse;font-size:0.87em;margin:10px 0;">
                <thead>
                  <tr style="background:#e0e7ff;">
                    <th style="padding:7px;border:1px solid #a5b4fc;">Class</th>
                    <th style="padding:7px;border:1px solid #a5b4fc;">Body Covering</th>
                    <th style="padding:7px;border:1px solid #a5b4fc;">Temperature</th>
                    <th style="padding:7px;border:1px solid #a5b4fc;">Breathing</th>
                    <th style="padding:7px;border:1px solid #a5b4fc;">Heart</th>
                    <th style="padding:7px;border:1px solid #a5b4fc;">Reproduction</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:6px;border:1px solid #c7d2fe;">Pisces</td><td style="padding:6px;border:1px solid #c7d2fe;">Scales</td><td style="padding:6px;border:1px solid #c7d2fe;">Cold</td><td style="padding:6px;border:1px solid #c7d2fe;">Gills</td><td style="padding:6px;border:1px solid #c7d2fe;">2-chambered</td><td style="padding:6px;border:1px solid #c7d2fe;">Eggs (water)</td></tr>
                  <tr style="background:#eef2ff;"><td style="padding:6px;border:1px solid #c7d2fe;">Amphibia</td><td style="padding:6px;border:1px solid #c7d2fe;">Moist skin</td><td style="padding:6px;border:1px solid #c7d2fe;">Cold</td><td style="padding:6px;border:1px solid #c7d2fe;">Gills→Lungs</td><td style="padding:6px;border:1px solid #c7d2fe;">3-chambered</td><td style="padding:6px;border:1px solid #c7d2fe;">Eggs (water)</td></tr>
                  <tr><td style="padding:6px;border:1px solid #c7d2fe;">Reptilia</td><td style="padding:6px;border:1px solid #c7d2fe;">Dry scales</td><td style="padding:6px;border:1px solid #c7d2fe;">Cold</td><td style="padding:6px;border:1px solid #c7d2fe;">Lungs</td><td style="padding:6px;border:1px solid #c7d2fe;">3-chambered</td><td style="padding:6px;border:1px solid #c7d2fe;">Eggs (land)</td></tr>
                  <tr style="background:#eef2ff;"><td style="padding:6px;border:1px solid #c7d2fe;">Aves</td><td style="padding:6px;border:1px solid #c7d2fe;">Feathers</td><td style="padding:6px;border:1px solid #c7d2fe;">Warm</td><td style="padding:6px;border:1px solid #c7d2fe;">Lungs</td><td style="padding:6px;border:1px solid #c7d2fe;">4-chambered</td><td style="padding:6px;border:1px solid #c7d2fe;">Eggs (land)</td></tr>
                  <tr><td style="padding:6px;border:1px solid #c7d2fe;">Mammalia</td><td style="padding:6px;border:1px solid #c7d2fe;">Hair/Fur</td><td style="padding:6px;border:1px solid #c7d2fe;">Warm</td><td style="padding:6px;border:1px solid #c7d2fe;">Lungs</td><td style="padding:6px;border:1px solid #c7d2fe;">4-chambered</td><td style="padding:6px;border:1px solid #c7d2fe;">Live birth</td></tr>
                </tbody>
              </table>`,
            question: {
              text: "Which vertebrate group is characterised by feathers, a four-chambered heart, and warm-bloodedness?",
              options: { A: "Reptilia", B: "Mammalia", C: "Aves", D: "Amphibia" },
              correctAnswer: "C",
              explanation: "Class Aves (birds) are characterised by feathers, a four-chambered heart, warm-bloodedness (endothermy), hollow bones, and the ability to fly. They share the four-chambered heart with mammals but have feathers instead of hair."
            }
          }
        ],
        quizQuestions: [
          {
            text: "Which vertebrate class breathes through gills as larvae but switches to lungs as adults?",
            options: { A: "Pisces", B: "Reptilia", C: "Amphibia", D: "Mammalia" },
            correctAnswer: "C",
            explanation: "Amphibians (like frogs and toads) begin life as aquatic larvae (tadpoles) breathing through gills. As they metamorphose into adults, they develop lungs and can breathe air on land."
          },
          {
            text: "What key feature distinguishes reptiles from amphibians in reproduction?",
            options: { A: "Reptiles lay eggs in water", B: "Reptiles lay shelled eggs on land, free from dependence on water", C: "Amphibians give birth to live young", D: "Reptiles have no eggs at all" },
            correctAnswer: "B",
            explanation: "Reptiles lay amniotic (shelled) eggs on land, which do not dry out. This freed them from dependence on water for reproduction — a major evolutionary advancement over amphibians."
          },
          {
            text: "The correct evolutionary sequence of vertebrates from most primitive to most advanced is:",
            options: {
              A: "Mammals → Birds → Reptiles → Amphibians → Fish",
              B: "Fish → Amphibians → Reptiles → Birds → Mammals",
              C: "Amphibians → Fish → Birds → Reptiles → Mammals",
              D: "Fish → Reptiles → Amphibians → Mammals → Birds"
            },
            correctAnswer: "B",
            explanation: "The evolutionary sequence is: Fish (fully aquatic) → Amphibians (semi-aquatic) → Reptiles (mostly terrestrial) → Birds (terrestrial/aerial) → Mammals (most complex). This reflects increasing complexity and independence from water."
          },
          {
            text: "Which vertebrate class has a TWO-chambered heart?",
            options: { A: "Amphibia", B: "Pisces", C: "Reptilia", D: "Aves" },
            correctAnswer: "B",
            explanation: "Fish (Class Pisces) have a simple two-chambered heart (one atrium + one ventricle). The heart complexity increases through evolution: 2-chambered (fish) → 3-chambered (amphibians, most reptiles) → 4-chambered (birds and mammals)."
          },
          {
            text: "An animal with hair, mammary glands, and a four-chambered heart belongs to class:",
            options: { A: "Aves", B: "Reptilia", C: "Amphibia", D: "Mammalia" },
            correctAnswer: "D",
            explanation: "Hair (or fur), mammary glands (milk-producing), and a four-chambered heart are the three defining characteristics of Class Mammalia. These distinguish mammals from all other vertebrate classes."
          }
        ]
      }
    ]
  }

};

// Export for use in guided learning module
window.BIOLOGY_LEARNING_CONTENT = BIOLOGY_LEARNING_CONTENT;
