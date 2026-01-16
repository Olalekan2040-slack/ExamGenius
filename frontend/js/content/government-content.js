/**
 * Government Learning Content
 * Topics with explanations, visuals, and sample questions
 */

const GOVERNMENT_LEARNING_CONTENT = {
    
    // ============================================================
    // PART I - TOPIC 1: BASIC CONCEPTS IN GOVERNMENT
    // ============================================================
    "Basic Concepts in Government": {
        subject: "Government",
        topic: "Basic Concepts in Government",
        introduction: {
            title: "Basic Concepts in Government",
            description: "This topic covers the fundamental concepts that form the foundation of governance: Power, Authority, Legitimacy, Sovereignty, Society, State, Nation, and Political Processes. These concepts help you understand how societies are organized, ruled, and influenced. JAMB frequently tests definitions, differences between concepts, and Nigerian examples.",
            jambInfo: "JAMB usually asks 4-6 questions from this topic. It appears in almost every JAMB Government paper."
        },
        subtopics: [
            {
                name: "Meaning, Functions and Features of Government",
                objectives: [
                    {
                        title: "Define government and its meaning",
                        explanation: `<p><strong>Government</strong> is the agency, institution, or machinery through which a state or society exercises authority, maintains order, makes and enforces laws, and provides for the welfare of its people.</p>

<div class="key-points">
    <h4>Key Definitions (Memorize for JAMB):</h4>
    <ul>
        <li><strong>As an institution:</strong> The body of persons or officials who rule and direct the affairs of a state (e.g., President, Ministers, Legislature, Judiciary)</li>
        <li><strong>As a process:</strong> The art of making and implementing decisions for the common good</li>
        <li><strong>Narrow sense:</strong> The group of people currently in power (e.g., "the Tinubu administration")</li>
        <li><strong>Broad sense:</strong> The entire system of rule, including all arms and agencies</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-landmark"></i>
            <p><strong>Government as Institution</strong></p>
            <p>Executive + Legislature + Judiciary</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-cogs"></i>
            <p><strong>Government as Process</strong></p>
            <p>Decision-making and implementation</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Key Point for JAMB:</h4>
    <p>Government is NOT the state itself—government is the <strong>tool or agent</strong> of the state. The state is permanent (people + territory + sovereignty), but government can change through elections or coups.</p>
</div>`,
                        question: {
                            text: "Government as an institution refers to",
                            options: {
                                "A": "The process of making laws",
                                "B": "The body of persons who govern a state",
                                "C": "The relationship between states",
                                "D": "The study of politics"
                            },
                            correctAnswer: "B",
                            explanation: "Government as an institution refers to the body of persons, officials, or machinery through which a state exercises authority and administers public affairs. This includes the executive, legislature, and judiciary."
                        }
                    },
                    {
                        title: "Identify the functions of government",
                        explanation: `<p>Government performs core functions to maintain society and achieve state objectives. JAMB often asks "state five functions" or "which is NOT a function."</p>

<div class="key-points">
    <h4>Main Functions of Government:</h4>
    <ul>
        <li><strong>Maintenance of law and order:</strong> Enforces laws, prevents crime, provides security (police, army)</li>
        <li><strong>Protection of lives and property:</strong> Defends against internal/external threats</li>
        <li><strong>Administration of justice:</strong> Settles disputes through courts</li>
        <li><strong>Provision of social services:</strong> Builds schools, hospitals, roads; provides water, electricity</li>
        <li><strong>Regulation of the economy:</strong> Controls money supply, taxes, trade policies</li>
        <li><strong>Defence of the country:</strong> Foreign policy, military protection</li>
        <li><strong>Promotion of welfare:</strong> Poverty reduction, employment, infrastructure</li>
        <li><strong>Representation of the people:</strong> Through elections in democracy</li>
        <li><strong>Foreign relations:</strong> Diplomacy, treaties with other nations</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>The 1999 Constitution (Section 14–20) lists similar functions, like ensuring security, welfare, and justice for all Nigerians.</p>
</div>

<div class="warning-box">
    <h4>Common JAMB Trap:</h4>
    <p>Organizing religious activities is <strong>NOT</strong> a function of government in secular states like Nigeria.</p>
</div>`,
                        question: {
                            text: "Which of the following is NOT a function of government?",
                            options: {
                                "A": "Maintenance of law and order",
                                "B": "Provision of social services",
                                "C": "Organizing religious activities",
                                "D": "Defence of the country"
                            },
                            correctAnswer: "C",
                            explanation: "Organizing religious activities is not a function of government, especially in secular states like Nigeria where the constitution separates state from religion. The main functions include maintaining law and order, providing social services, defending the country, and administering justice."
                        }
                    },
                    {
                        title: "Describe the features of government",
                        explanation: `<p>These features distinguish government from other organizations:</p>

<div class="key-points">
    <h4>Key Features/Characteristics of Government:</h4>
    <ul>
        <li><strong>Authority:</strong> Has the legitimate right to make binding decisions</li>
        <li><strong>Power:</strong> Can enforce decisions (coercion if needed)</li>
        <li><strong>Territorial coverage:</strong> Operates within defined boundaries</li>
        <li><strong>Permanence:</strong> The institution lasts, even if leaders change</li>
        <li><strong>Sovereignty:</strong> Supreme authority (no higher power internally)</li>
        <li><strong>Monopoly of legitimate force:</strong> Only government can legally use force (police/army)</li>
        <li><strong>Hierarchy/organization:</strong> Structured (executive, legislature, judiciary)</li>
        <li><strong>Accountability (in democracy):</strong> To the people via elections</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Democratic Government</h4>
            <p>✓ Strong accountability</p>
            <p>✓ Regular elections</p>
            <p>✓ Rule of law</p>
        </div>
        <div class="comparison-card">
            <h4>Authoritarian Government</h4>
            <p>✗ Weak accountability</p>
            <p>✗ No free elections</p>
            <p>✗ Leader controls law</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Key Point:</h4>
    <p>In authoritarian systems, features like accountability may be weak or absent.</p>
</div>`,
                        question: {
                            text: "The exclusive right of government to use force legally is called",
                            options: {
                                "A": "Sovereignty",
                                "B": "Monopoly of legitimate force",
                                "C": "Authority",
                                "D": "Power"
                            },
                            correctAnswer: "B",
                            explanation: "Monopoly of legitimate force means only the government has the legal right to use coercion or force (through police, army) to enforce laws and maintain order. Private individuals or groups cannot legally use force."
                        }
                    }
                ]
            },
            {
                name: "Power, Authority, Legitimacy, Sovereignty",
                objectives: [
                    {
                        title: "Define and distinguish between power and authority",
                        explanation: `<p><strong>Power</strong> and <strong>Authority</strong> are closely related but different concepts that explain who controls society and why people obey.</p>

<div class="key-points">
    <h4>Power:</h4>
    <ul>
        <li><strong>Definition:</strong> The ability to influence or control the behaviour of others, even against their will</li>
        <li><strong>Can exist without acceptance</strong> (e.g., military dictator using force)</li>
        <li><strong>Types:</strong> Physical/coercive power, Economic power, Ideological power, Positional power</li>
    </ul>
</div>

<div class="key-points">
    <h4>Authority:</h4>
    <ul>
        <li><strong>Definition:</strong> Power that is accepted as rightful or legal by the people</li>
        <li><strong>Requires acceptance/legitimacy</strong> – people obey willingly</li>
        <li><strong>Max Weber's Types:</strong>
            <ul>
                <li><strong>Traditional:</strong> Based on customs (kings, emirs, obas)</li>
                <li><strong>Charismatic:</strong> Based on personal qualities (popular leaders)</li>
                <li><strong>Legal-rational:</strong> Based on laws and constitution (elected presidents)</li>
            </ul>
        </li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-left: 4px solid #e74c3c;">
            <h4>Power</h4>
            <p>Ability to control</p>
            <p>Can be illegitimate</p>
            <p>Example: Military dictatorship</p>
        </div>
        <div class="comparison-card" style="border-left: 4px solid #27ae60;">
            <h4>Authority</h4>
            <p>Rightful power</p>
            <p>Always legitimate</p>
            <p>Example: Elected president</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>An elected president exercises <strong>legal-rational authority</strong> derived from the 1999 Constitution. A military dictator has <strong>power</strong> through guns but may lack legitimacy.</p>
</div>`,
                        question: {
                            text: "What is the primary difference between power and authority?",
                            options: {
                                "A": "Power is exercised through elections while authority is inherited",
                                "B": "Power can exist without acceptance while authority requires legitimacy",
                                "C": "Authority uses force while power uses persuasion",
                                "D": "Power is temporary while authority is permanent"
                            },
                            correctAnswer: "B",
                            explanation: "Power is the ability to influence or control others even against their will and can exist without being accepted as rightful. Authority, however, is power that is accepted as legitimate by the people being governed."
                        }
                    },
                    {
                        title: "Explain Max Weber's classification of authority",
                        explanation: `<p>Max Weber, a German sociologist, classified authority into three types. This is <strong>very important for JAMB</strong>.</p>

<div class="key-points">
    <h4>Weber's Three Types of Authority:</h4>
</div>

<div class="visual-section">
    <div class="visual-grid" style="grid-template-columns: 1fr;">
        <div class="visual-card">
            <i class="fas fa-crown"></i>
            <p><strong>1. Traditional Authority</strong></p>
            <p>Based on customs, traditions, and hereditary succession</p>
            <p><em>Examples: Kings, Emirs, Obas in pre-colonial Nigeria</em></p>
        </div>
        <div class="visual-card">
            <i class="fas fa-star"></i>
            <p><strong>2. Charismatic Authority</strong></p>
            <p>Based on personal qualities, heroism, or exceptional characteristics</p>
            <p><em>Examples: Nnamdi Azikiwe, revolutionary leaders</em></p>
        </div>
        <div class="visual-card">
            <i class="fas fa-balance-scale"></i>
            <p><strong>3. Legal-Rational Authority</strong></p>
            <p>Based on established laws, rules, and constitution</p>
            <p><em>Examples: Elected presidents, judges in modern Nigeria</em></p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Nigerian Examples:</h4>
    <ul>
        <li><strong>Traditional:</strong> The Oba of Benin, Sultan of Sokoto</li>
        <li><strong>Charismatic:</strong> Chief Obafemi Awolowo (admired for personal qualities)</li>
        <li><strong>Legal-rational:</strong> President Tinubu (derives power from the Constitution)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>Legal-rational authority is the basis of <strong>modern democratic governance</strong>. It is based on laws, not personality or tradition.</p>
</div>`,
                        question: {
                            text: "According to Max Weber, which type of authority is based on customs and traditions?",
                            options: {
                                "A": "Legal-rational authority",
                                "B": "Charismatic authority",
                                "C": "Traditional authority",
                                "D": "Democratic authority"
                            },
                            correctAnswer: "C",
                            explanation: "Traditional authority is based on customs, traditions, and hereditary succession. Examples include kings, emirs, and obas in pre-colonial Nigerian societies. This type of authority was common before the emergence of modern constitutional governance."
                        }
                    },
                    {
                        title: "Define legitimacy and its sources",
                        explanation: `<p><strong>Legitimacy</strong> is the belief or acceptance by the people that a government or leader has the right to rule and make laws. It makes obedience voluntary rather than forced.</p>

<div class="key-points">
    <h4>Sources/Factors of Legitimacy:</h4>
    <ul>
        <li><strong>Popular consent:</strong> Elections, referendums, plebiscites</li>
        <li><strong>Good performance:</strong> Providing security, jobs, roads, development</li>
        <li><strong>Tradition or ideology:</strong> Long-established customs or beliefs</li>
        <li><strong>Respect for rule of law:</strong> Following the constitution and protecting rights</li>
        <li><strong>Charisma of the leader:</strong> Personal appeal and trust</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-left: 4px solid #27ae60;">
            <h4>Legitimate Government</h4>
            <p>✓ Free and fair elections</p>
            <p>✓ Good governance</p>
            <p>✓ Respects human rights</p>
            <p>✓ Voluntary obedience</p>
        </div>
        <div class="comparison-card" style="border-left: 4px solid #e74c3c;">
            <h4>Illegitimate Government</h4>
            <p>✗ Rigged elections</p>
            <p>✗ Corruption and misrule</p>
            <p>✗ Violates human rights</p>
            <p>✗ Relies on force</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>A government elected through free and fair elections gains legitimacy. If it rigs elections or becomes corrupt, legitimacy is lost → this may lead to protests or even coups.</p>
</div>`,
                        question: {
                            text: "The belief by citizens that a government has the right to rule is called",
                            options: {
                                "A": "Power",
                                "B": "Authority",
                                "C": "Legitimacy",
                                "D": "Sovereignty"
                            },
                            correctAnswer: "C",
                            explanation: "Legitimacy refers to the acceptance by the governed that the government has the rightful authority to rule. It makes obedience voluntary rather than forced. Sources include popular consent through elections, good governance, and respect for rule of law."
                        }
                    },
                    {
                        title: "Define sovereignty and its types",
                        explanation: `<p><strong>Sovereignty</strong> is the supreme power or authority of a state to govern itself without external control. It means the state is independent and makes its own laws.</p>

<div class="key-points">
    <h4>Types of Sovereignty:</h4>
    <ul>
        <li><strong>Internal sovereignty:</strong> Supreme control over citizens and territory inside the country</li>
        <li><strong>External sovereignty:</strong> Independence from other countries (no foreign interference)</li>
    </ul>
</div>

<div class="key-points">
    <h4>Key Features of Sovereignty:</h4>
    <ul>
        <li><strong>Permanence:</strong> Lasts as long as the state exists</li>
        <li><strong>Absoluteness:</strong> No higher authority within the state</li>
        <li><strong>Indivisibility:</strong> Cannot be shared or divided</li>
        <li><strong>Inalienability:</strong> Cannot be transferred to another</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Internal Sovereignty</h4>
            <p>Control within borders</p>
            <p>Making and enforcing laws</p>
            <p>Example: Nigeria's judicial system</p>
        </div>
        <div class="comparison-card">
            <h4>External Sovereignty</h4>
            <p>Independence from outside</p>
            <p>Own foreign policy</p>
            <p>Example: Nigeria at the UN</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Limitation in Practice:</h4>
    <p>Globalization, international laws (UN, ECOWAS), and treaties limit full sovereignty in practice, but legally the state remains sovereign.</p>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>Nigeria gained sovereignty from Britain on October 1, 1960. Since then, Nigeria makes its own laws and is not ruled by any foreign power.</p>
</div>`,
                        question: {
                            text: "Internal sovereignty refers to",
                            options: {
                                "A": "Recognition by other countries",
                                "B": "Membership in international organizations",
                                "C": "Supreme control over citizens and territory within the country",
                                "D": "Power to sign international treaties"
                            },
                            correctAnswer: "C",
                            explanation: "Internal sovereignty means the supreme authority of the state over all persons and institutions within its territorial boundaries. External sovereignty refers to independence from foreign control. Nigeria exercises internal sovereignty through its constitution and legal system."
                        }
                    }
                ]
            },
            {
                name: "Society, State, Nation, Nation-State",
                objectives: [
                    {
                        title: "Define and distinguish between society and state",
                        explanation: `<p>These concepts explain different levels of human organization.</p>

<div class="key-points">
    <h4>Society:</h4>
    <ul>
        <li>A group of people living together in a community</li>
        <li>Share common culture, values, and interactions</li>
        <li>Broader than politics – includes family, religion, economy</li>
        <li>Society exists <strong>before</strong> the state</li>
    </ul>
</div>

<div class="key-points">
    <h4>State:</h4>
    <ul>
        <li>A political organization with <strong>four essential elements:</strong>
            <ol>
                <li>Permanent population</li>
                <li>Defined territory</li>
                <li>Government</li>
                <li>Sovereignty</li>
            </ol>
        </li>
        <li>The state makes and enforces laws</li>
        <li>The state is the legal/political entity</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Society</h4>
            <p><i class="fas fa-users"></i> Social concept</p>
            <p>People living together</p>
            <p>Cultural and economic ties</p>
            <p>Can exist without a state</p>
        </div>
        <div class="comparison-card">
            <h4>State</h4>
            <p><i class="fas fa-landmark"></i> Political concept</p>
            <p>Population + Territory + Government + Sovereignty</p>
            <p>Makes and enforces laws</p>
            <p>Requires formal structure</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>Political parties are <strong>NOT</strong> an essential element of a state. A state can exist without political parties (e.g., one-party states, military regimes).</p>
</div>`,
                        question: {
                            text: "Which of the following is NOT an essential element of a state?",
                            options: {
                                "A": "Population",
                                "B": "Territory",
                                "C": "Political party",
                                "D": "Sovereignty"
                            },
                            correctAnswer: "C",
                            explanation: "The four essential elements of a state are: permanent population, defined territory, government, and sovereignty. Political parties are features of democratic governance but not essential elements that define a state."
                        }
                    },
                    {
                        title: "Define and distinguish between nation and nation-state",
                        explanation: `<p><strong>Nation</strong> and <strong>Nation-State</strong> are often confused but have different meanings.</p>

<div class="key-points">
    <h4>Nation:</h4>
    <ul>
        <li>A group of people who share common identity – history, language, culture, tradition</li>
        <li>It is more <strong>emotional/cultural</strong> than political</li>
        <li>A nation may or may not have its own state</li>
        <li>Example: The Kurds are a nation without a full state</li>
    </ul>
</div>

<div class="key-points">
    <h4>Nation-State:</h4>
    <ul>
        <li>When a nation has its own sovereign state (one nation = one state)</li>
        <li>Combines cultural unity with political independence</li>
        <li>Example: Japan (mostly one nation in one state)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid" style="grid-template-columns: 1fr;">
        <div class="visual-card" style="background: #fff3cd;">
            <i class="fas fa-flag"></i>
            <p><strong>Nigeria: Multi-National State</strong></p>
            <p>Many ethnic groups (Hausa, Yoruba, Igbo, etc.) in one state</p>
            <p>Over 250 ethnic groups with distinct identities</p>
            <p>This causes challenges like ethnic tensions</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Key Differences:</h4>
    <ul>
        <li><strong>Society →</strong> people living together (social)</li>
        <li><strong>State →</strong> political structure with power</li>
        <li><strong>Nation →</strong> cultural/emotional group</li>
        <li><strong>Nation-State →</strong> nation + state combined</li>
    </ul>
</div>`,
                        question: {
                            text: "Nigeria is described as a multi-national state because it",
                            options: {
                                "A": "Has many international embassies",
                                "B": "Contains several ethnic groups with distinct identities",
                                "C": "Practices federalism",
                                "D": "Has diplomatic relations with many countries"
                            },
                            correctAnswer: "B",
                            explanation: "A multi-national state contains multiple nations or ethnic groups with distinct cultural identities within a single sovereign state. Nigeria has over 250 ethnic groups including Hausa, Yoruba, Igbo, and many others. This differs from a nation-state where one dominant nation forms one state."
                        }
                    },
                    {
                        title: "Distinguish between state and nation",
                        explanation: `<p>Understanding the difference between <strong>state</strong> and <strong>nation</strong> is crucial for JAMB.</p>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-left: 4px solid #3498db;">
            <h4>State</h4>
            <p><strong>Political</strong> and legal entity</p>
            <p>Defined by: Territory, Population, Government, Sovereignty</p>
            <p>Has <strong>legal recognition</strong></p>
            <p>Examples: Nigeria, Ghana, France</p>
        </div>
        <div class="comparison-card" style="border-left: 4px solid #9b59b6;">
            <h4>Nation</h4>
            <p><strong>Cultural</strong> concept</p>
            <p>Defined by: Common history, language, culture, identity</p>
            <p>May or may not have a state</p>
            <p>Examples: Yoruba nation, Kurdish nation</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Key Points:</h4>
    <ul>
        <li>A <strong>nation without a state:</strong> Kurds (spread across Turkey, Iraq, Syria, Iran)</li>
        <li>A <strong>state with multiple nations:</strong> Nigeria (Hausa, Yoruba, Igbo, and 250+ others)</li>
        <li>A <strong>nation-state:</strong> Japan (mostly one nation = one state)</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Common JAMB Question Pattern:</h4>
    <p>"The main difference between state and nation is that..." – Answer: State is political while nation is cultural.</p>
</div>`,
                        question: {
                            text: "The main difference between a state and a nation is that",
                            options: {
                                "A": "A state is cultural while a nation is political",
                                "B": "A state is political while a nation is cultural",
                                "C": "Both are the same concept",
                                "D": "A nation has sovereignty while a state does not"
                            },
                            correctAnswer: "B",
                            explanation: "A state is a political and legal entity with defined territory, population, government, and sovereignty. A nation is a cultural concept referring to a group of people who share common history, language, culture, and sense of belonging."
                        }
                    }
                ]
            },
            {
                name: "Political Processes",
                objectives: [
                    {
                        title: "Explain political socialization and its agents",
                        explanation: `<p><strong>Political Socialization</strong> is the process by which individuals learn political values, beliefs, attitudes, and behaviours.</p>

<div class="key-points">
    <h4>Agents of Political Socialization:</h4>
    <ul>
        <li><strong>Family:</strong> The <em>primary/first</em> agent – children learn from parents</li>
        <li><strong>School/Education:</strong> Civic education, national anthem, pledge</li>
        <li><strong>Peer Groups:</strong> Friends influence political views</li>
        <li><strong>Mass Media:</strong> TV, radio, newspapers, social media</li>
        <li><strong>Religious Institutions:</strong> Churches, mosques shape values</li>
        <li><strong>Political Parties:</strong> Mobilize and educate citizens</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-home"></i>
            <p><strong>Family</strong></p>
            <p>Primary agent</p>
            <p>First political lessons</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-school"></i>
            <p><strong>School</strong></p>
            <p>Civic education</p>
            <p>National values</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-users"></i>
            <p><strong>Peer Groups</strong></p>
            <p>Friends' influence</p>
            <p>Political discussions</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-tv"></i>
            <p><strong>Mass Media</strong></p>
            <p>News, social media</p>
            <p>Information spread</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>Children learn patriotism through the national anthem in school. Family discussions during elections also shape political attitudes. Social media influenced Nigerian youth during #EndSARS protests.</p>
</div>`,
                        question: {
                            text: "The process by which individuals acquire political values, beliefs and attitudes is called",
                            options: {
                                "A": "Political participation",
                                "B": "Political culture",
                                "C": "Political socialization",
                                "D": "Political mobilization"
                            },
                            correctAnswer: "C",
                            explanation: "Political socialization is the lifelong process through which people develop their political opinions, beliefs, and values. Agents include family (primary agent), schools, peer groups, mass media, religious institutions, and political parties."
                        }
                    },
                    {
                        title: "Identify the primary agent of political socialization",
                        explanation: `<p>Among all agents of political socialization, the <strong>family</strong> is considered the <strong>primary (first)</strong> agent.</p>

<div class="key-points">
    <h4>Why Family is the Primary Agent:</h4>
    <ul>
        <li>Children spend their <strong>early formative years</strong> with family</li>
        <li>First exposure to political ideas and values</li>
        <li>Parents' political views strongly influence children</li>
        <li>Sets the foundation that other agents build upon</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-card" style="text-align: center; padding: 20px;">
        <i class="fas fa-home" style="font-size: 48px; color: #3498db;"></i>
        <h4>Family = Primary Agent</h4>
        <p>First teacher of political values</p>
        <p>Shapes initial political orientations</p>
        <p>Other agents (school, media, peers) are secondary</p>
    </div>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>When asked about the <strong>primary/first</strong> agent of political socialization, always answer <strong>FAMILY</strong>. Political parties and media are secondary agents.</p>
</div>`,
                        question: {
                            text: "Which of the following is a primary agent of political socialization?",
                            options: {
                                "A": "Political party",
                                "B": "Mass media",
                                "C": "Family",
                                "D": "Pressure group"
                            },
                            correctAnswer: "C",
                            explanation: "The family is the primary (first) agent of political socialization because children first learn political values, attitudes, and orientations from their parents and family members at an early age. Other agents like schools, media, peers, and political parties are secondary agents."
                        }
                    },
                    {
                        title: "Explain political participation and its forms",
                        explanation: `<p><strong>Political Participation</strong> is the active involvement of citizens in politics.</p>

<div class="key-points">
    <h4>Forms of Political Participation:</h4>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card" style="border-left: 4px solid #27ae60;">
            <h4>Conventional Participation</h4>
            <p>✓ Voting in elections</p>
            <p>✓ Joining political parties</p>
            <p>✓ Campaigning for candidates</p>
            <p>✓ Contacting elected officials</p>
            <p>✓ Running for office</p>
        </div>
        <div class="comparison-card" style="border-left: 4px solid #e67e22;">
            <h4>Unconventional Participation</h4>
            <p>✓ Protests and demonstrations</p>
            <p>✓ Strikes and boycotts</p>
            <p>✓ Signing petitions</p>
            <p>✓ Civil disobedience</p>
            <p>Example: #EndSARS in Nigeria</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Importance of Political Participation:</h4>
    <ul>
        <li>Strengthens democracy</li>
        <li>Ensures government accountability</li>
        <li>Gives citizens a voice</li>
        <li>Legitimizes the government</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>Voting in the 2023 elections is conventional participation. The #EndSARS protests against police brutality is an example of unconventional participation.</p>
</div>`,
                        question: {
                            text: "Which of the following is an example of unconventional political participation?",
                            options: {
                                "A": "Voting in an election",
                                "B": "Joining a political party",
                                "C": "Organizing a protest",
                                "D": "Contacting your representative"
                            },
                            correctAnswer: "C",
                            explanation: "Unconventional political participation includes activities outside the normal electoral process, such as protests, strikes, demonstrations, and civil disobedience. Voting, joining parties, and contacting representatives are conventional forms of participation."
                        }
                    },
                    {
                        title: "Explain political culture and its types",
                        explanation: `<p><strong>Political Culture</strong> refers to the shared attitudes, beliefs, and values that people have toward government and politics.</p>

<div class="key-points">
    <h4>Types of Political Culture (Almond & Verba):</h4>
</div>

<div class="visual-section">
    <div class="visual-grid" style="grid-template-columns: 1fr;">
        <div class="visual-card">
            <i class="fas fa-user-slash"></i>
            <p><strong>1. Parochial Culture</strong></p>
            <p>Little or no interest in politics</p>
            <p>Common in rural/traditional areas</p>
            <p>Citizens are unaware of political system</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-user-check"></i>
            <p><strong>2. Subject Culture</strong></p>
            <p>People obey but do not participate much</p>
            <p>Passive acceptance of government</p>
            <p>Citizens know about politics but don't engage</p>
        </div>
        <div class="visual-card" style="background: #d4edda;">
            <i class="fas fa-users"></i>
            <p><strong>3. Participant Culture</strong></p>
            <p>Active involvement and demand for rights</p>
            <p>Ideal for democracy</p>
            <p>Citizens engage fully in political process</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Nigeria's Mix:</h4>
    <p>Nigeria has a blend of political cultures:</p>
    <ul>
        <li><strong>Participant:</strong> Urban youth actively demanding accountability</li>
        <li><strong>Subject:</strong> Some citizens who vote but don't engage further</li>
        <li><strong>Parochial:</strong> Some rural areas with limited political awareness</li>
    </ul>
</div>`,
                        question: {
                            text: "Which type of political culture is characterized by active citizen involvement in political affairs?",
                            options: {
                                "A": "Parochial political culture",
                                "B": "Subject political culture",
                                "C": "Participant political culture",
                                "D": "Traditional political culture"
                            },
                            correctAnswer: "C",
                            explanation: "Participant political culture exists where citizens are actively involved in politics, demand accountability, and exercise their rights. Parochial culture shows little interest in politics, while subject culture involves passive obedience. Participant culture is ideal for democracy."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 2: FORMS OF GOVERNMENT
    // ============================================================
    "Forms of Government:": {
        subject: "Government",
        topic: "Forms of Government:",
        introduction: {
            title: "Forms of Government",
            description: "This topic explains the different ways societies organize and exercise political power. It covers Monarchy, Aristocracy, Oligarchy, Autocracy, Republicanism, and Democracy. JAMB frequently tests definitions, features, merits and demerits, or comparisons between forms.",
            jambInfo: "JAMB usually asks 2-4 questions from this topic, often requiring you to distinguish between forms."
        },
        subtopics: [
            {
                name: "Monarchy and Aristocracy",
                objectives: [
                    {
                        title: "Define and explain monarchy",
                        explanation: `<p><strong>Monarchy</strong> is a form of government in which supreme power is held by a single person (the monarch) who usually inherits the position and rules for life.</p>

<div class="key-points">
    <h4>Features of Monarchy:</h4>
    <ul>
        <li><strong>Hereditary succession:</strong> Power passes through family (king to prince)</li>
        <li><strong>Ruler for life:</strong> Unless they abdicate or are overthrown</li>
        <li><strong>Can be absolute or constitutional</strong></li>
        <li><strong>Often tied to tradition and religion</strong></li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Absolute Monarchy</h4>
            <p>Monarch has <strong>unlimited power</strong></p>
            <p>No constitutional limits</p>
            <p>Example: Saudi Arabia</p>
        </div>
        <div class="comparison-card">
            <h4>Constitutional Monarchy</h4>
            <p>Monarch is <strong>ceremonial</strong></p>
            <p>Real power with parliament</p>
            <p>Example: United Kingdom</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Merits:</h4>
    <ul>
        <li>Provides continuity and stability</li>
        <li>Symbol of national unity</li>
        <li>Quick decision-making (absolute)</li>
    </ul>
    <h4>Demerits:</h4>
    <ul>
        <li>Risk of incompetent ruler</li>
        <li>Lack of accountability (absolute)</li>
        <li>Hereditary privilege causes inequality</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Context:</h4>
    <p>Traditional monarchs (Obas, Emirs, Sultans) have cultural influence but no political sovereignty in modern Nigeria. They serve ceremonial and advisory roles.</p>
</div>`,
                        question: {
                            text: "In a constitutional monarchy, the real political power lies with the",
                            options: {
                                "A": "Monarch",
                                "B": "Parliament/Prime Minister",
                                "C": "Military",
                                "D": "Religious leaders"
                            },
                            correctAnswer: "B",
                            explanation: "In a constitutional monarchy, the monarch is ceremonial (a symbol of national unity) while real political power lies with elected representatives in parliament and the prime minister. The United Kingdom is a classic example."
                        }
                    },
                    {
                        title: "Define and explain aristocracy",
                        explanation: `<p><strong>Aristocracy</strong> is government by the few best or noblest persons. Power is held by a small privileged class based on birth, wealth, education, or ability.</p>

<div class="key-points">
    <h4>Features of Aristocracy:</h4>
    <ul>
        <li>Rule by an <strong>elite group</strong> (nobles, landowners, intellectuals)</li>
        <li>Positions often hereditary or based on status</li>
        <li>Not open to ordinary people</li>
        <li>From Greek: "rule by the best"</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-card" style="text-align: center;">
        <i class="fas fa-chess-king" style="font-size: 48px; color: #9b59b6;"></i>
        <h4>Aristocracy = Rule by the Elite</h4>
        <p>Based on birth, wealth, or special qualities</p>
        <p>Excludes ordinary citizens from power</p>
    </div>
</div>

<div class="key-points">
    <h4>Merits:</h4>
    <ul>
        <li>Rule by most qualified (theoretically)</li>
        <li>Stability if elite are wise</li>
        <li>Avoids "mob rule"</li>
    </ul>
    <h4>Demerits:</h4>
    <ul>
        <li>Excludes majority (undemocratic)</li>
        <li>Can become corrupt and self-serving</li>
        <li>Creates class inequality</li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li>Ancient Sparta (rule by warrior elite)</li>
        <li>Some pre-colonial Nigerian societies (rule by noble families)</li>
    </ul>
</div>`,
                        question: {
                            text: "Aristocracy is government by",
                            options: {
                                "A": "The military",
                                "B": "A small group of privileged elite",
                                "C": "Religious leaders",
                                "D": "The common people"
                            },
                            correctAnswer: "B",
                            explanation: "Aristocracy is government by a small group of privileged elite, usually based on birth, wealth, education, or noble status. The word comes from Greek meaning 'rule by the best.'"
                        }
                    }
                ]
            },
            {
                name: "Oligarchy and Autocracy",
                objectives: [
                    {
                        title: "Define and explain oligarchy",
                        explanation: `<p><strong>Oligarchy</strong> is government by a small group of people. The few may be wealthy individuals, military leaders, religious figures, or party bosses.</p>

<div class="key-points">
    <h4>Features of Oligarchy:</h4>
    <ul>
        <li>Power concentrated in <strong>few hands</strong></li>
        <li>Based on wealth, family, military, or party control</li>
        <li>Can disguise itself as democracy</li>
        <li>Not necessarily the "best" (unlike aristocracy)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Aristocracy</h4>
            <p>Rule by the "best"</p>
            <p>Based on merit/nobility</p>
            <p>Theoretically qualified</p>
        </div>
        <div class="comparison-card">
            <h4>Oligarchy</h4>
            <p>Rule by the "few"</p>
            <p>Based on power/wealth</p>
            <p>Not necessarily qualified</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Demerits:</h4>
    <ul>
        <li>Self-interest and corruption common</li>
        <li>Excludes majority → inequality</li>
        <li>Lacks broad legitimacy</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Context:</h4>
    <p>Critics sometimes describe politics dominated by "godfathers" or a few wealthy families as oligarchic – where a small group controls political outcomes.</p>
</div>`,
                        question: {
                            text: "The main difference between aristocracy and oligarchy is that",
                            options: {
                                "A": "Aristocracy is rule by many while oligarchy is rule by one",
                                "B": "Aristocracy is based on merit while oligarchy is based on power or wealth",
                                "C": "Oligarchy is democratic while aristocracy is not",
                                "D": "They are exactly the same"
                            },
                            correctAnswer: "B",
                            explanation: "Aristocracy is rule by the 'best' based on merit, education, or noble birth. Oligarchy is rule by 'the few' who may have gained power through wealth, military force, or connections – not necessarily through merit or qualification."
                        }
                    },
                    {
                        title: "Define and explain autocracy",
                        explanation: `<p><strong>Autocracy</strong> is government by one person with unlimited or absolute power. Similar to absolute monarchy but not necessarily hereditary.</p>

<div class="key-points">
    <h4>Features of Autocracy:</h4>
    <ul>
        <li><strong>Single ruler</strong> (dictator, despot) holds supreme power</li>
        <li>No effective checks or balances</li>
        <li>Opposition suppressed; no free elections</li>
        <li>Rule by force, not consent</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-card" style="text-align: center; background: #f8d7da;">
        <i class="fas fa-user-shield" style="font-size: 48px; color: #c0392b;"></i>
        <h4>Autocracy = One Person, Absolute Power</h4>
        <p>No accountability • No free press • No opposition</p>
    </div>
</div>

<div class="key-points">
    <h4>Merits:</h4>
    <ul>
        <li>Quick and decisive action</li>
        <li>Unity of command</li>
    </ul>
    <h4>Demerits:</h4>
    <ul>
        <li>High risk of tyranny and abuse</li>
        <li>No accountability → corruption</li>
        <li>Suppression of freedom</li>
        <li>Instability when ruler dies</li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <ul>
        <li>North Korea (Kim dynasty)</li>
        <li>Historical: Idi Amin (Uganda), Sani Abacha (Nigeria military era)</li>
    </ul>
</div>`,
                        question: {
                            text: "Which of the following is a characteristic of autocracy?",
                            options: {
                                "A": "Regular free and fair elections",
                                "B": "Separation of powers",
                                "C": "Absolute power held by one person",
                                "D": "Independent judiciary"
                            },
                            correctAnswer: "C",
                            explanation: "Autocracy is characterized by absolute power held by one person (dictator or despot) with no effective checks, no free elections, and suppression of opposition. It is the opposite of democracy."
                        }
                    }
                ]
            },
            {
                name: "Republicanism and Democracy",
                objectives: [
                    {
                        title: "Define and explain republicanism",
                        explanation: `<p><strong>Republicanism</strong> is a form of government in which the head of state is not a monarch but an elected or nominated person (president), and power comes from the people.</p>

<div class="key-points">
    <h4>Features of Republicanism:</h4>
    <ul>
        <li><strong>No hereditary ruler</strong></li>
        <li>Head of state usually <strong>elected</strong> (directly or indirectly)</li>
        <li>Emphasis on constitution and rule of law</li>
        <li>Can be democratic or authoritarian</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Monarchy</h4>
            <p>Hereditary head of state</p>
            <p>King/Queen for life</p>
            <p>Example: UK, Saudi Arabia</p>
        </div>
        <div class="comparison-card">
            <h4>Republic</h4>
            <p>Elected head of state</p>
            <p>President with term limits</p>
            <p>Example: Nigeria, USA, France</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Merits:</h4>
    <ul>
        <li>Accountability through elections</li>
        <li>Equality (no hereditary privilege)</li>
        <li>Can combine with democracy</li>
    </ul>
    <h4>Demerits:</h4>
    <ul>
        <li>Risk of instability if elections are disputed</li>
        <li>Can become authoritarian (e.g., one-party republics)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>Nigeria became a republic in 1963 when it adopted a republican constitution with an elected president. Before that (1960-1963), it was a constitutional monarchy with the British Queen as head of state.</p>
</div>`,
                        question: {
                            text: "Nigeria became a republic in",
                            options: {
                                "A": "1960",
                                "B": "1963",
                                "C": "1979",
                                "D": "1999"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria became a republic on October 1, 1963, when it adopted a republican constitution with Dr. Nnamdi Azikiwe as the first President. Before 1963, Nigeria was a constitutional monarchy with the British Queen as the ceremonial head of state."
                        }
                    },
                    {
                        title: "Define and explain democracy",
                        explanation: `<p><strong>Democracy</strong> is government of the people, by the people, for the people (Abraham Lincoln). Rule where supreme power lies with the citizens, exercised directly or through elected representatives.</p>

<div class="key-points">
    <h4>Features of Democracy:</h4>
    <ul>
        <li>Periodic <strong>free and fair elections</strong></li>
        <li><strong>Rule of law</strong> and fundamental human rights</li>
        <li><strong>Separation of powers</strong>, checks and balances</li>
        <li><strong>Majority rule</strong> with minority rights</li>
        <li>Freedom of expression, association, press</li>
    </ul>
</div>

<div class="visual-section">
    <div class="comparison-cards">
        <div class="comparison-card">
            <h4>Direct Democracy</h4>
            <p>People vote directly on issues</p>
            <p>Rare in modern times</p>
            <p>Example: Ancient Athens</p>
        </div>
        <div class="comparison-card">
            <h4>Representative Democracy</h4>
            <p>People elect representatives</p>
            <p>Common modern form</p>
            <p>Example: Nigeria, USA, UK</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Merits:</h4>
    <ul>
        <li>Government accountability to citizens</li>
        <li>Protection of rights and freedoms</li>
        <li>Peaceful change of government</li>
        <li>Popular participation</li>
    </ul>
    <h4>Demerits:</h4>
    <ul>
        <li>Slow decision-making</li>
        <li>Can lead to tyranny of the majority</li>
        <li>Expensive elections</li>
        <li>Manipulation possible (money politics)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Democracy:</h4>
    <p>Nigeria practices representative (indirect) democracy where citizens elect the President, Governors, National Assembly members, and State Assembly members to represent them.</p>
</div>`,
                        question: {
                            text: "In a representative democracy, citizens",
                            options: {
                                "A": "Vote directly on every issue",
                                "B": "Elect representatives to make decisions on their behalf",
                                "C": "Have no say in government",
                                "D": "Are ruled by hereditary monarchs"
                            },
                            correctAnswer: "B",
                            explanation: "In representative (indirect) democracy, citizens elect representatives to make decisions on their behalf. This is the common modern form of democracy practiced in Nigeria, USA, UK, and most countries. Direct democracy where citizens vote on every issue is rare."
                        }
                    },
                    {
                        title: "Compare democracy with other forms of government",
                        explanation: `<p>Understanding how democracy differs from other forms of government is essential for JAMB.</p>

<div class="visual-section">
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8f9fa;">
            <th style="padding: 12px; border: 1px solid #ddd;">Form</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Who Rules?</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Key Feature</th>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Democracy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">The people (through representatives)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Free elections, accountability</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Monarchy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">King/Queen (hereditary)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Rule for life, succession by birth</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Autocracy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">One person (dictator)</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Absolute power, no checks</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Oligarchy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Small powerful group</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Rule by wealthy/powerful few</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Aristocracy</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Elite/nobles</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Rule by "the best"</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>When asked to "distinguish between" forms of government, focus on: <strong>who holds power</strong>, <strong>how they got power</strong>, and <strong>accountability</strong>.</p>
</div>`,
                        question: {
                            text: "Which form of government is characterized by popular sovereignty and periodic elections?",
                            options: {
                                "A": "Autocracy",
                                "B": "Oligarchy",
                                "C": "Democracy",
                                "D": "Monarchy"
                            },
                            correctAnswer: "C",
                            explanation: "Democracy is characterized by popular sovereignty (power belongs to the people) and periodic free and fair elections. It also features rule of law, protection of rights, separation of powers, and government accountability."
                        }
                    }
                ]
            }
        ]
    },
    
    // ============================================================
    // PART I - TOPIC 3: ARMS OF GOVERNMENT
    // ============================================================
    "Arms of Government:": {
        subject: "Government",
        topic: "Arms of Government:",
        introduction: {
            title: "Arms of Government",
            description: "This topic explains how power is divided and exercised in modern governments to prevent abuse and ensure efficiency. It covers the Legislature, Executive, and Judiciary - their functions, powers, and how they interrelate through separation of powers and checks and balances.",
            jambInfo: "This is one of the most frequently tested areas in JAMB Government. Questions often ask for functions of each arm, how they relate, or examples of checks and balances (especially in Nigeria)."
        },
        subtopics: [
            {
                name: "The Legislature",
                objectives: [
                    {
                        title: "Understand the Legislature and its functions",
                        explanation: `<p><strong>The Legislature</strong> is the law-making arm of government. It represents the people and makes, amends, and repeals laws.</p>

<div class="key-points">
    <h4>Types of Legislature:</h4>
    <ul>
        <li><strong>Unicameral:</strong> One chamber (e.g., New Zealand Parliament)</li>
        <li><strong>Bicameral:</strong> Two chambers (e.g., Nigeria's National Assembly: Senate + House of Representatives)</li>
    </ul>
</div>

<div class="key-points">
    <h4>Structure in Nigeria (1999 Constitution):</h4>
    <ul>
        <li><strong>National Assembly (Federal):</strong> Senate (109 members – 3 per state + 1 FCT) + House of Representatives (360 members)</li>
        <li><strong>State Houses of Assembly:</strong> Unicameral, one per state</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-scroll"></i>
            <p><strong>Primary Function</strong></p>
            <p>Law-making</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-money-bill-wave"></i>
            <p><strong>Financial Control</strong></p>
            <p>Budget approval</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-search"></i>
            <p><strong>Oversight</strong></p>
            <p>Scrutiny of executive</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-users"></i>
            <p><strong>Representation</strong></p>
            <p>Representing the people</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Functions of the Legislature:</h4>
    <table class="styled-table">
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><strong>Law-making</strong></td>
            <td>Introduces, debates, and passes bills into laws</td>
        </tr>
        <tr>
            <td><strong>Budget approval</strong></td>
            <td>Appropriates money and controls government spending</td>
        </tr>
        <tr>
            <td><strong>Oversight</strong></td>
            <td>Investigates and questions ministers, conducts public hearings</td>
        </tr>
        <tr>
            <td><strong>Representation</strong></td>
            <td>Represents constituents and addresses their concerns</td>
        </tr>
        <tr>
            <td><strong>Constitutional amendment</strong></td>
            <td>Amends the constitution with special majority</td>
        </tr>
        <tr>
            <td><strong>Impeachment</strong></td>
            <td>Can remove certain officials (president, governors, judges)</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>The National Assembly passed the Petroleum Industry Act (2021) after debates and public hearings.</p>
</div>`,
                        question: {
                            text: "The primary function of the legislature is to:",
                            options: {
                                "A": "Interpret laws",
                                "B": "Execute laws",
                                "C": "Make laws",
                                "D": "Appoint judges"
                            },
                            correctAnswer: "C",
                            explanation: "The primary function of the legislature is law-making. It introduces, debates, and passes bills into laws. The executive implements laws, and the judiciary interprets them."
                        }
                    }
                ]
            },
            {
                name: "The Executive",
                objectives: [
                    {
                        title: "Understand the Executive arm and its functions",
                        explanation: `<p><strong>The Executive</strong> is the arm responsible for implementing laws, policies, and day-to-day administration of the country.</p>

<div class="key-points">
    <h4>Types of Executive:</h4>
    <ul>
        <li><strong>Presidential:</strong> Head of state and head of government are the same person (elected president). Examples: Nigeria, USA</li>
        <li><strong>Parliamentary:</strong> Head of government (prime minister) is separate from head of state. Examples: UK, India</li>
        <li><strong>Semi-presidential:</strong> Mix of both (e.g., France – president + prime minister)</li>
    </ul>
</div>

<div class="key-points">
    <h4>Structure in Nigeria (Presidential System):</h4>
    <ul>
        <li>President (head of state and government)</li>
        <li>Vice President</li>
        <li>Ministers (Federal Executive Council)</li>
        <li>Ministries, Departments, Agencies (MDAs)</li>
        <li>Governors (at state level)</li>
    </ul>
</div>

<div class="table-container">
    <h4>Functions of the Executive:</h4>
    <table class="styled-table">
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><strong>Law implementation</strong></td>
            <td>Enforces and implements laws passed by legislature</td>
        </tr>
        <tr>
            <td><strong>Policy formulation</strong></td>
            <td>Develops and executes government policies</td>
        </tr>
        <tr>
            <td><strong>Maintenance of order</strong></td>
            <td>Through police and security agencies</td>
        </tr>
        <tr>
            <td><strong>Foreign relations</strong></td>
            <td>Handles diplomacy and international relations</td>
        </tr>
        <tr>
            <td><strong>Appointments</strong></td>
            <td>Appoints key officials (with legislative approval)</td>
        </tr>
        <tr>
            <td><strong>Budget preparation</strong></td>
            <td>Prepares and presents annual budget</td>
        </tr>
        <tr>
            <td><strong>Defence</strong></td>
            <td>Commander-in-Chief of armed forces</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Powers of the Executive:</h4>
    <ul>
        <li>Executive powers (wide discretion in administration)</li>
        <li>Power to appoint and dismiss ministers</li>
        <li>Prerogative of mercy (power to pardon)</li>
        <li>Emergency powers</li>
        <li>Veto power over legislation</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>The President signs international agreements (e.g., AfCFTA) and appoints INEC Chairman (subject to Senate confirmation).</p>
</div>`,
                        question: {
                            text: "In a presidential system, the head of state and head of government is:",
                            options: {
                                "A": "The Prime Minister",
                                "B": "The same person (the President)",
                                "C": "Different persons",
                                "D": "The Chief Justice"
                            },
                            correctAnswer: "B",
                            explanation: "In a presidential system, the President is both the head of state and head of government. This is the case in Nigeria and the USA. In parliamentary systems, these roles are held by different persons."
                        }
                    }
                ]
            },
            {
                name: "The Judiciary",
                objectives: [
                    {
                        title: "Understand the Judiciary and its functions",
                        explanation: `<p><strong>The Judiciary</strong> is the arm that interprets laws, settles disputes, and administers justice.</p>

<div class="key-points">
    <h4>Components/Structure in Nigeria:</h4>
    <ul>
        <li><strong>Supreme Court:</strong> Apex court (highest in the land)</li>
        <li><strong>Court of Appeal:</strong> Appellate court</li>
        <li><strong>Federal High Court, State High Courts</strong></li>
        <li><strong>Sharia/Customary Courts of Appeal</strong></li>
        <li><strong>Magistrate/District Courts:</strong> Lower courts</li>
        <li><strong>National Industrial Court:</strong> Specialized labor court</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Hierarchy of Courts in Nigeria:</h4>
    <div class="hierarchy-pyramid">
        <div style="background: linear-gradient(to right, #0d47a1, #1976d2); color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
            <strong>Supreme Court</strong> (Apex)
        </div>
        <div style="background: #1976d2; color: white; padding: 12px; text-align: center;">
            Court of Appeal
        </div>
        <div style="background: #42a5f5; color: white; padding: 12px; text-align: center;">
            Federal/State High Courts
        </div>
        <div style="background: #90caf9; color: #1a237e; padding: 12px; text-align: center; border-radius: 0 0 5px 5px;">
            Magistrate Courts, Customary Courts
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Functions of the Judiciary:</h4>
    <table class="styled-table">
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><strong>Interpretation</strong></td>
            <td>Interprets the constitution and laws</td>
        </tr>
        <tr>
            <td><strong>Adjudication</strong></td>
            <td>Settles civil and criminal disputes</td>
        </tr>
        <tr>
            <td><strong>Rights protection</strong></td>
            <td>Protects fundamental human rights</td>
        </tr>
        <tr>
            <td><strong>Judicial review</strong></td>
            <td>Power to declare laws/actions unconstitutional</td>
        </tr>
        <tr>
            <td><strong>Punishment</strong></td>
            <td>Punishes offenders and enforces contracts</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Powers of the Judiciary:</h4>
    <ul>
        <li><strong>Judicial review:</strong> Striking down unconstitutional laws/actions</li>
        <li><strong>Constitutional interpretation:</strong> Final say on constitutional meaning</li>
        <li><strong>Contempt of court power:</strong> Punishing disrespect of court</li>
        <li><strong>Independence:</strong> Secured by tenure and salary protection</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>The Supreme Court resolved the 2023 presidential election petitions and has declared some state actions unconstitutional.</p>
</div>`,
                        question: {
                            text: "Which of the following is a function of the judiciary?",
                            options: {
                                "A": "Making laws",
                                "B": "Implementing policies",
                                "C": "Interpreting the constitution",
                                "D": "Preparing the budget"
                            },
                            correctAnswer: "C",
                            explanation: "The judiciary's key function is interpreting the constitution and laws. The legislature makes laws, while the executive implements policies and prepares the budget."
                        }
                    }
                ]
            },
            {
                name: "Separation of Powers and Checks & Balances",
                objectives: [
                    {
                        title: "Understand how the arms interrelate",
                        explanation: `<p>The three arms are designed to work together but remain independent (<strong>separation of powers</strong>) while checking each other (<strong>checks and balances</strong>).</p>

<div class="key-points">
    <h4>Key Principles:</h4>
    <ul>
        <li><strong>Separation of Powers:</strong> Each arm has distinct functions (Montesquieu's theory). No arm can exercise another's functions.</li>
        <li><strong>Checks and Balances:</strong> Mechanisms to prevent any arm from becoming too powerful.</li>
    </ul>
</div>

<div class="table-container">
    <h4>Examples of Checks and Balances in Nigeria:</h4>
    <table class="styled-table">
        <tr>
            <th>Check</th>
            <th>Example</th>
        </tr>
        <tr>
            <td><strong>Legislature checks Executive</strong></td>
            <td>Confirms ministerial appointments; Can impeach president/governor; Investigates executive actions</td>
        </tr>
        <tr>
            <td><strong>Executive checks Legislature</strong></td>
            <td>Can veto bills; Initiates most bills (especially money bills)</td>
        </tr>
        <tr>
            <td><strong>Judiciary checks Both</strong></td>
            <td>Declares executive actions or laws unconstitutional; Protects citizens from abuse</td>
        </tr>
        <tr>
            <td><strong>Legislature checks Judiciary</strong></td>
            <td>Confirms judicial appointments; Can impeach judges</td>
        </tr>
        <tr>
            <td><strong>Executive checks Judiciary</strong></td>
            <td>Appoints judges (on recommendation of NJC); Provides funding</td>
        </tr>
    </table>
</div>

<div class="visual-section">
    <h4>The Interrelationship:</h4>
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin: 20px 0;">
        <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 10px; flex: 1; min-width: 150px;">
            <i class="fas fa-landmark" style="font-size: 2em; color: #1976d2;"></i>
            <p><strong>Legislature</strong></p>
            <p>Makes Laws</p>
        </div>
        <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 10px; flex: 1; min-width: 150px;">
            <i class="fas fa-user-tie" style="font-size: 2em; color: #f57c00;"></i>
            <p><strong>Executive</strong></p>
            <p>Implements Laws</p>
        </div>
        <div style="text-align: center; padding: 20px; background: #e8f5e9; border-radius: 10px; flex: 1; min-width: 150px;">
            <i class="fas fa-gavel" style="font-size: 2em; color: #388e3c;"></i>
            <p><strong>Judiciary</strong></p>
            <p>Interprets Laws</p>
        </div>
    </div>
</div>

<div class="warning-box">
    <h4>Nigerian Context:</h4>
    <p>The 1999 Constitution (Sections 4, 5, 6) clearly separates powers. However, in practice, executive dominance (e.g., control of funds) sometimes weakens checks.</p>
</div>`,
                        question: {
                            text: "Separation of powers means:",
                            options: {
                                "A": "All powers concentrated in the executive",
                                "B": "Each arm of government has distinct functions",
                                "C": "The legislature controls everything",
                                "D": "The judiciary makes laws"
                            },
                            correctAnswer: "B",
                            explanation: "Separation of powers means each arm of government (legislature, executive, judiciary) has distinct functions and operates independently. This prevents concentration of power and abuse. It was advocated by Montesquieu."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 4: STRUCTURES OF GOVERNANCE
    // ============================================================
    "Structures of Governance:": {
        subject: "Government",
        topic: "Structures of Governance:",
        introduction: {
            title: "Structures of Governance",
            description: "This topic examines the major ways power is distributed between the central government and other units (regions, states, etc.). It covers Unitary, Federal, and Confederal systems - their features, merits, and demerits.",
            jambInfo: "This is very important in JAMB because Nigeria practises federalism. Questions often ask for comparisons, merits/demerits, or reasons why Nigeria adopted federalism."
        },
        subtopics: [
            {
                name: "Unitary System",
                objectives: [
                    {
                        title: "Understand the Unitary System of Government",
                        explanation: `<p>A <strong>Unitary System</strong> is a system of government in which all powers are concentrated in one central (national) government. Sub-units (local governments, provinces) exist only as administrative arms of the centre and derive their authority from it.</p>

<div class="key-points">
    <h4>Features of Unitary System:</h4>
    <ul>
        <li>Single central authority with supreme power</li>
        <li>No constitutional division of powers between centre and regions</li>
        <li>Local units can be created, altered, or abolished by the centre</li>
        <li>Uniform laws, policies, and administration across the country</li>
        <li>Single constitution and single citizenship</li>
    </ul>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Promotes national unity and uniformity</td>
            <td>Over-centralization can neglect local needs</td>
        </tr>
        <tr>
            <td>Quick and efficient decision-making</td>
            <td>Risk of dictatorship or abuse of power</td>
        </tr>
        <tr>
            <td>Easier coordination and resource allocation</td>
            <td>May cause ethnic/regional resentment</td>
        </tr>
        <tr>
            <td>Less duplication of government functions</td>
            <td>Slow response to local emergencies</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Reasons for Adoption:</h4>
    <ul>
        <li>Small size of country</li>
        <li>Homogeneous population (similar culture, language, religion)</li>
        <li>Desire for strong central control and national unity</li>
        <li>Historical tradition of central rule</li>
    </ul>
</div>

<div class="example-box">
    <h4>Examples of Unitary States:</h4>
    <p>United Kingdom, France, Ghana (unitary with strong centre)</p>
</div>`,
                        question: {
                            text: "Which of the following is a major feature of a unitary system of government?",
                            options: {
                                "A": "Power is shared equally between central and regional governments",
                                "B": "Local governments derive their powers from the central authority",
                                "C": "Regions have independent constitutions",
                                "D": "The central government can be overruled by regional units"
                            },
                            correctAnswer: "B",
                            explanation: "In a unitary system, local governments derive their powers from the central authority. The central government has supreme power and can create, alter, or abolish local units at will."
                        }
                    }
                ]
            },
            {
                name: "Federal System",
                objectives: [
                    {
                        title: "Understand the Federal System of Government",
                        explanation: `<p>A <strong>Federal System</strong> is a system in which governmental powers are constitutionally divided between a central (federal) government and component units (states/regions), each operating independently within its sphere.</p>

<div class="key-points">
    <h4>Features of Federalism:</h4>
    <ul>
        <li>Written constitution that divides powers (exclusive, concurrent, residual lists)</li>
        <li>Supremacy of the federal constitution</li>
        <li>Independent legislative, executive, and judicial powers at both levels</li>
        <li>Bicameral legislature at federal level (often)</li>
        <li>Dual citizenship (federal + state)</li>
        <li>Independent sources of revenue for both levels</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Division of Powers in Nigeria:</h4>
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
        <div style="background: #1976d2; color: white; padding: 15px; border-radius: 10px; flex: 1; min-width: 180px;">
            <strong>Exclusive List</strong>
            <p style="font-size: 0.9em;">Federal only: Defence, Currency, Aviation, Immigration</p>
        </div>
        <div style="background: #7b1fa2; color: white; padding: 15px; border-radius: 10px; flex: 1; min-width: 180px;">
            <strong>Concurrent List</strong>
            <p style="font-size: 0.9em;">Shared: Education, Health, Agriculture</p>
        </div>
        <div style="background: #388e3c; color: white; padding: 15px; border-radius: 10px; flex: 1; min-width: 180px;">
            <strong>Residual List</strong>
            <p style="font-size: 0.9em;">States only: Markets, Local roads</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Accommodates diversity and reduces ethnic tension</td>
            <td>Duplication of functions and high cost</td>
        </tr>
        <tr>
            <td>Allows local experimentation and initiative</td>
            <td>Conflicts over revenue allocation</td>
        </tr>
        <tr>
            <td>Promotes unity while preserving local identity</td>
            <td>Risk of secessionist movements</td>
        </tr>
        <tr>
            <td>Provides checks against central tyranny</td>
            <td>Slower decision-making</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>Why Nigeria Adopted Federalism:</h4>
    <p>Nigeria adopted federalism because of its large geographical size and ethnic, cultural, religious, and linguistic diversity. It helps balance unity with regional autonomy.</p>
</div>

<div class="example-box">
    <h4>Examples of Federal States:</h4>
    <p>Nigeria, United States, India, Canada, Germany</p>
</div>`,
                        question: {
                            text: "Nigeria adopted federalism mainly because of:",
                            options: {
                                "A": "Small size and cultural similarity",
                                "B": "Ethnic and regional diversity",
                                "C": "Desire for absolute central control",
                                "D": "Influence of military rule only"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria adopted federalism mainly because of its ethnic and regional diversity. The federal system helps accommodate different ethnic groups, cultures, and religions while maintaining national unity."
                        }
                    }
                ]
            },
            {
                name: "Confederal System",
                objectives: [
                    {
                        title: "Understand the Confederal System",
                        explanation: `<p>A <strong>Confederal System</strong> is a loose union of independent states where the central authority is weak and subordinate to the component units. The centre exists mainly to coordinate common interests.</p>

<div class="key-points">
    <h4>Features of Confederalism:</h4>
    <ul>
        <li>Component states retain most sovereignty</li>
        <li>Central government has limited powers (e.g., defence, foreign affairs only)</li>
        <li>States can secede easily</li>
        <li>No strong central executive or judiciary</li>
        <li>Decisions often require unanimous consent</li>
    </ul>
</div>

<div class="table-container">
    <h4>Comparison: Unitary vs Federal vs Confederal</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Unitary</th>
            <th>Federal</th>
            <th>Confederal</th>
        </tr>
        <tr>
            <td><strong>Power distribution</strong></td>
            <td>Centralized</td>
            <td>Divided</td>
            <td>Decentralized</td>
        </tr>
        <tr>
            <td><strong>Central authority</strong></td>
            <td>Supreme</td>
            <td>Shared</td>
            <td>Weak</td>
        </tr>
        <tr>
            <td><strong>Constitution</strong></td>
            <td>Single</td>
            <td>Written, supreme</td>
            <td>Treaty-based</td>
        </tr>
        <tr>
            <td><strong>Secession</strong></td>
            <td>Not allowed</td>
            <td>Usually not allowed</td>
            <td>Allowed</td>
        </tr>
        <tr>
            <td><strong>Examples</strong></td>
            <td>UK, France</td>
            <td>Nigeria, USA</td>
            <td>Early USA, Switzerland (historically)</td>
        </tr>
    </table>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Maximum regional/state autonomy</td>
            <td>Very weak central authority → inefficiency</td>
        </tr>
        <tr>
            <td>Protects minority interests</td>
            <td>Difficulty in collective decision-making</td>
        </tr>
        <tr>
            <td>Flexible and voluntary union</td>
            <td>Easy dissolution of the union</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p>Early United States (under Articles of Confederation 1781-1789), Commonwealth of Independent States (CIS)</p>
</div>`,
                        question: {
                            text: "In a confederal system, the central government is:",
                            options: {
                                "A": "Supreme over all component units",
                                "B": "Weak and subordinate to component states",
                                "C": "Equal in power with states",
                                "D": "Non-existent"
                            },
                            correctAnswer: "B",
                            explanation: "In a confederal system, the central government is weak and subordinate to the component states. States retain most of their sovereignty and can even secede from the union."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 5: SYSTEMS OF GOVERNANCE
    // ============================================================
    "Systems of Governance:": {
        subject: "Government",
        topic: "Systems of Governance:",
        introduction: {
            title: "Systems of Governance",
            description: "This topic focuses on the different ways the executive and legislature relate to each other in running the government. It covers Presidential, Parliamentary, and Monarchical systems.",
            jambInfo: "JAMB often tests this by asking for distinctions, features, or which system Nigeria uses. This topic is closely linked to Arms of Government."
        },
        subtopics: [
            {
                name: "Presidential System",
                objectives: [
                    {
                        title: "Understand the Presidential System",
                        explanation: `<p>A <strong>Presidential System</strong> is a system of government in which the president is both head of state and head of government, elected directly or indirectly by the people, and operates independently of the legislature.</p>

<div class="key-points">
    <h4>Features of Presidential System:</h4>
    <ul>
        <li>Separation of powers between executive and legislature is strict</li>
        <li>President is elected for a fixed term (usually 4 years in Nigeria)</li>
        <li>President is not a member of the legislature</li>
        <li>President appoints ministers (often from outside the legislature)</li>
        <li>Legislature cannot dissolve the executive; executive cannot dissolve legislature</li>
        <li>Clear checks and balances (veto power, impeachment)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-user-tie"></i>
            <p><strong>Head of State</strong></p>
            <p>= President</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-user-cog"></i>
            <p><strong>Head of Government</strong></p>
            <p>= President (Same person)</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-calendar-check"></i>
            <p><strong>Term</strong></p>
            <p>Fixed (4 years)</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-vote-yea"></i>
            <p><strong>Selection</strong></p>
            <p>Elected by people</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Stability due to fixed tenure</td>
            <td>Risk of gridlock (if president and legislature differ)</td>
        </tr>
        <tr>
            <td>Strong and independent executive leadership</td>
            <td>Can lead to executive dominance</td>
        </tr>
        <tr>
            <td>Clear accountability to the people</td>
            <td>Impeachment is difficult</td>
        </tr>
        <tr>
            <td>Prevents frequent changes of government</td>
            <td>May encourage personality cult</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p>Nigeria (since 1979 Constitution), United States, Brazil, most Latin American countries</p>
</div>`,
                        question: {
                            text: "In a presidential system of government, the president is:",
                            options: {
                                "A": "Chosen by the legislature",
                                "B": "Both head of state and head of government",
                                "C": "Removable at any time by a vote of no confidence",
                                "D": "Required to be a member of parliament"
                            },
                            correctAnswer: "B",
                            explanation: "In a presidential system, the president is both head of state and head of government. The president is elected by the people (not chosen by legislature) and cannot be easily removed by a vote of no confidence."
                        }
                    }
                ]
            },
            {
                name: "Parliamentary System",
                objectives: [
                    {
                        title: "Understand the Parliamentary System",
                        explanation: `<p>A <strong>Parliamentary System</strong> is a system in which the executive (prime minister and cabinet) is drawn from and responsible to the legislature (parliament). The head of state (monarch or ceremonial president) is separate from the head of government.</p>

<div class="key-points">
    <h4>Features of Parliamentary System:</h4>
    <ul>
        <li><strong>Fusion of powers:</strong> Executive members are also legislators</li>
        <li>Prime minister is leader of the majority party/coalition in parliament</li>
        <li>Prime minister can be removed by a vote of no confidence</li>
        <li>Parliament can be dissolved by the executive</li>
        <li><strong>Collective responsibility:</strong> Cabinet members resign together if defeated</li>
        <li>Head of state is ceremonial (e.g., monarch or president)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-crown"></i>
            <p><strong>Head of State</strong></p>
            <p>Ceremonial (King/President)</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-user-tie"></i>
            <p><strong>Head of Government</strong></p>
            <p>Prime Minister</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-users"></i>
            <p><strong>Cabinet</strong></p>
            <p>From Parliament</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-thumbs-down"></i>
            <p><strong>Removal</strong></p>
            <p>Vote of No Confidence</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Flexible – government can change quickly</td>
            <td>Instability if no clear majority</td>
        </tr>
        <tr>
            <td>Executive directly accountable to legislature</td>
            <td>Prime minister may dominate parliament</td>
        </tr>
        <tr>
            <td>Promotes cooperation between arms</td>
            <td>Frequent changes of government possible</td>
        </tr>
        <tr>
            <td>Faster law-making due to fusion of powers</td>
            <td>Weak separation of powers</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p>United Kingdom, Canada, India, Australia, pre-1966 Nigeria (First Republic)</p>
</div>`,
                        question: {
                            text: "In a parliamentary system, the prime minister can lose office through:",
                            options: {
                                "A": "Fixed term expiry only",
                                "B": "A vote of no confidence in parliament",
                                "C": "Direct election by the people",
                                "D": "Impeachment by the judiciary"
                            },
                            correctAnswer: "B",
                            explanation: "In a parliamentary system, the prime minister can be removed by a vote of no confidence in parliament. This is a key feature distinguishing it from the presidential system where the president has a fixed term."
                        }
                    }
                ]
            },
            {
                name: "Monarchical System",
                objectives: [
                    {
                        title: "Understand the Monarchical System",
                        explanation: `<p>A <strong>Monarchical System</strong> is a system of government in which a monarch (king, queen, emperor) is the head of state. It can be absolute or constitutional.</p>

<div class="key-points">
    <h4>Types of Monarchy:</h4>
    <ul>
        <li><strong>Absolute Monarchy:</strong> Monarch has unlimited powers (makes laws, executes, judges)</li>
        <li><strong>Constitutional Monarchy:</strong> Monarch performs ceremonial duties; real power lies with elected officials (usually parliamentary system)</li>
    </ul>
</div>

<div class="table-container">
    <h4>Comparison: Absolute vs Constitutional Monarchy</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Absolute Monarchy</th>
            <th>Constitutional Monarchy</th>
        </tr>
        <tr>
            <td><strong>Monarch's power</strong></td>
            <td>Unlimited</td>
            <td>Ceremonial only</td>
        </tr>
        <tr>
            <td><strong>Law-making</strong></td>
            <td>By monarch</td>
            <td>By parliament</td>
        </tr>
        <tr>
            <td><strong>Government</strong></td>
            <td>Monarch rules</td>
            <td>Prime minister governs</td>
        </tr>
        <tr>
            <td><strong>Examples</strong></td>
            <td>Saudi Arabia, Brunei</td>
            <td>UK, Sweden, Japan</td>
        </tr>
    </table>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Provides continuity and national symbol</td>
            <td>In absolute form: High risk of tyranny</td>
        </tr>
        <tr>
            <td>Stability in constitutional form</td>
            <td>Hereditary rule may produce incompetent rulers</td>
        </tr>
        <tr>
            <td>Preserves cultural/traditional values</td>
            <td>Monarchy is expensive (royalty costs)</td>
        </tr>
        <tr>
            <td>In absolute form: Quick decisions</td>
            <td>Can be undemocratic if absolute</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Key Features:</h4>
    <ul>
        <li>Hereditary head of state (rules for life)</li>
        <li>In modern times, often combined with parliamentary system</li>
        <li>Monarch serves as symbol of national unity</li>
    </ul>
</div>`,
                        question: {
                            text: "In a constitutional monarchy, the monarch:",
                            options: {
                                "A": "Exercises real executive and legislative powers",
                                "B": "Performs mainly ceremonial functions",
                                "C": "Is elected by the people every four years",
                                "D": "Can veto all parliamentary decisions"
                            },
                            correctAnswer: "B",
                            explanation: "In a constitutional monarchy, the monarch performs mainly ceremonial functions. Real power lies with the elected government (usually headed by a prime minister). Examples include the United Kingdom, Sweden, and Japan."
                        }
                    }
                ]
            },
            {
                name: "Comparison of Systems",
                objectives: [
                    {
                        title: "Compare Presidential and Parliamentary Systems",
                        explanation: `<p>Understanding the differences between presidential and parliamentary systems is crucial for JAMB. Here's a comprehensive comparison:</p>

<div class="table-container">
    <h4>Presidential vs Parliamentary System:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Presidential</th>
            <th>Parliamentary</th>
        </tr>
        <tr>
            <td><strong>Head of State/Government</strong></td>
            <td>Same person (President)</td>
            <td>Different persons</td>
        </tr>
        <tr>
            <td><strong>Separation of powers</strong></td>
            <td>Strict separation</td>
            <td>Fusion of powers</td>
        </tr>
        <tr>
            <td><strong>Tenure</strong></td>
            <td>Fixed term</td>
            <td>Not fixed (depends on confidence)</td>
        </tr>
        <tr>
            <td><strong>Removal</strong></td>
            <td>By impeachment</td>
            <td>By vote of no confidence</td>
        </tr>
        <tr>
            <td><strong>Ministers from</strong></td>
            <td>Outside legislature (usually)</td>
            <td>Inside parliament</td>
        </tr>
        <tr>
            <td><strong>Dissolution of legislature</strong></td>
            <td>Not possible</td>
            <td>Possible</td>
        </tr>
        <tr>
            <td><strong>Nigerian example</strong></td>
            <td>Current (since 1979)</td>
            <td>First Republic (1960-1966)</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>When distinguishing systems, focus on: <strong>Who is head of state/government?</strong> <strong>Is there separation or fusion of powers?</strong> <strong>How is the executive removed?</strong></p>
</div>`,
                        question: {
                            text: "A key difference between parliamentary and presidential systems is that in parliamentary system:",
                            options: {
                                "A": "The executive is independent of the legislature",
                                "B": "There is fusion of executive and legislative powers",
                                "C": "The head of government has a fixed term",
                                "D": "Ministers are appointed from outside parliament"
                            },
                            correctAnswer: "B",
                            explanation: "In a parliamentary system, there is fusion of executive and legislative powers - ministers are members of parliament. In contrast, presidential systems have strict separation of powers."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 6: POLITICAL IDEOLOGIES
    // ============================================================
    "Political Ideologies:": {
        subject: "Government",
        topic: "Political Ideologies:",
        introduction: {
            title: "Political Ideologies",
            description: "This topic explores the major belief systems or philosophies that guide how societies organize politically, economically, and socially. Political ideologies provide frameworks for governance, resource distribution, and human relations.",
            jambInfo: "This is a high-scoring area in JAMB. Questions often require you to define an ideology, list its features, compare modes of production, or evaluate merits/demerits."
        },
        subtopics: [
            {
                name: "Communalism and Feudalism",
                objectives: [
                    {
                        title: "Understand Communalism",
                        explanation: `<p><strong>Communalism</strong> is a political and economic ideology that emphasizes collective ownership, cooperation, and community-based decision-making, where resources are shared for the common good rather than individual profit.</p>

<div class="key-points">
    <h4>Key Features of Communalism:</h4>
    <ul>
        <li>Collective ownership of resources (land, tools, produce) by the community</li>
        <li>Decision-making through consensus or elders' councils</li>
        <li>Emphasis on reciprocity (mutual help) and social bonds</li>
        <li>Limited social classes; wealth is redistributed</li>
        <li>Subsistence economy: Production for needs, not surplus</li>
    </ul>
</div>

<div class="key-points">
    <h4>Mode of Production:</h4>
    <p>Community-based and labor-intensive, relying on cooperative farming, hunting, or crafting. Goods are produced for immediate use or sharing, not market exchange.</p>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Promotes social equality</td>
            <td>Limits individual initiative and innovation</td>
        </tr>
        <tr>
            <td>Fosters strong community ties</td>
            <td>Inefficient for large-scale production</td>
        </tr>
        <tr>
            <td>Environmentally sustainable</td>
            <td>Difficult to scale in diverse societies</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>In pre-colonial Igbo societies, land was communally owned, with decisions by village assemblies (e.g., "Ama-ala" system).</p>
</div>`,
                        question: {
                            text: "Which of the following best describes the mode of production in communalism?",
                            options: {
                                "A": "Private ownership with profit maximization",
                                "B": "Community-based sharing for subsistence needs",
                                "C": "Feudal exploitation by lords",
                                "D": "State control of all resources"
                            },
                            correctAnswer: "B",
                            explanation: "In communalism, production is community-based with resources shared for subsistence needs. There is no private ownership for profit or state control - it's about collective sharing within the community."
                        }
                    },
                    {
                        title: "Understand Feudalism",
                        explanation: `<p><strong>Feudalism</strong> is a medieval socio-political and economic ideology characterized by a hierarchical system of land ownership and obligations, where lords (nobles) control land and provide protection in exchange for labor and loyalty from vassals (serfs or peasants).</p>

<div class="key-points">
    <h4>Key Features of Feudalism:</h4>
    <ul>
        <li>Hierarchical structure: King → Lords/Nobles → Vassals → Serfs</li>
        <li>Land (fiefs) granted in exchange for military service or labor</li>
        <li>Mutual obligations: Lords protect vassals; vassals pay tribute or work</li>
        <li>Decentralized power: Local lords have autonomy</li>
        <li>Manorial system: Self-sufficient estates with peasants bound to land</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Feudal Hierarchy:</h4>
    <div class="hierarchy-pyramid">
        <div style="background: linear-gradient(to right, #ffd700, #ffb300); color: #333; padding: 12px; text-align: center; border-radius: 5px 5px 0 0;">
            <strong>KING</strong> (Apex)
        </div>
        <div style="background: #7b1fa2; color: white; padding: 10px; text-align: center;">
            Lords/Nobles (Land owners)
        </div>
        <div style="background: #512da8; color: white; padding: 10px; text-align: center;">
            Knights/Vassals (Military service)
        </div>
        <div style="background: #311b92; color: white; padding: 10px; text-align: center; border-radius: 0 0 5px 5px;">
            Serfs/Peasants (Labor)
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Provided security and stability</td>
            <td>Extreme inequality and exploitation</td>
        </tr>
        <tr>
            <td>Decentralized administration</td>
            <td>Stifled economic growth</td>
        </tr>
        <tr>
            <td>Encouraged loyalty and social order</td>
            <td>Rigid class system, no mobility</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Relevance:</h4>
    <p>Pre-colonial Hausa-Fulani emirates had feudal elements (emirs as lords, peasants paying tribute).</p>
</div>`,
                        question: {
                            text: "A key demerit of feudalism is:",
                            options: {
                                "A": "Promotion of rapid technological advancement",
                                "B": "Rigid class divisions and lack of social mobility",
                                "C": "Emphasis on individual freedoms",
                                "D": "Efficient centralized governance"
                            },
                            correctAnswer: "B",
                            explanation: "Feudalism was characterized by rigid class divisions with little to no social mobility. Serfs were bound to the land and could not rise in status, making this a major demerit of the system."
                        }
                    }
                ]
            },
            {
                name: "Capitalism and Socialism",
                objectives: [
                    {
                        title: "Understand Capitalism",
                        explanation: `<p><strong>Capitalism</strong> is an ideology advocating private ownership of the means of production (factories, land, capital), free market competition, and profit maximization. It emphasizes individual liberty, entrepreneurship, and minimal government intervention.</p>

<div class="key-points">
    <h4>Key Features of Capitalism:</h4>
    <ul>
        <li>Private property rights and individual ownership</li>
        <li>Free enterprise and market competition</li>
        <li>Profit motive as driver of innovation</li>
        <li>Limited government role (laissez-faire)</li>
        <li>Class structure: Capitalists (owners) vs. Workers (labor)</li>
        <li>Consumer sovereignty (markets respond to demand)</li>
    </ul>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-building"></i>
            <p><strong>Private Ownership</strong></p>
            <p>Individuals own businesses</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-chart-line"></i>
            <p><strong>Profit Motive</strong></p>
            <p>Drives innovation</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-balance-scale"></i>
            <p><strong>Free Market</strong></p>
            <p>Supply & demand set prices</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-hands-helping"></i>
            <p><strong>Competition</strong></p>
            <p>Benefits consumers</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Encourages innovation and economic growth</td>
            <td>Widens inequality (rich-poor gap)</td>
        </tr>
        <tr>
            <td>Rewards hard work and risk-taking</td>
            <td>Exploitation of workers</td>
        </tr>
        <tr>
            <td>Provides consumer choice</td>
            <td>Economic cycles (booms/recessions)</td>
        </tr>
        <tr>
            <td>Flexible adaptation to changes</td>
            <td>Environmental degradation</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Example:</h4>
    <p>Post-1999 privatization of telecoms and oil sectors reflects capitalism. Nigeria operates a mixed economy with capitalist elements.</p>
</div>`,
                        question: {
                            text: "The mode of production in capitalism is characterized by:",
                            options: {
                                "A": "State ownership and central planning",
                                "B": "Private investment, wage labor, and market competition",
                                "C": "Communal sharing for subsistence",
                                "D": "Feudal dues and land tenure"
                            },
                            correctAnswer: "B",
                            explanation: "Capitalism is characterized by private investment, wage labor, and market competition. Private owners invest capital, hire workers for wages, and compete in markets for profit."
                        }
                    },
                    {
                        title: "Understand Socialism",
                        explanation: `<p><strong>Socialism</strong> is an ideology advocating collective or state ownership of the means of production, with the goal of reducing inequality and ensuring social welfare. It emphasizes equitable distribution of wealth and government intervention in the economy.</p>

<div class="key-points">
    <h4>Key Features of Socialism:</h4>
    <ul>
        <li>Collective/state ownership of means of production</li>
        <li>Central planning or regulation of economy</li>
        <li>Goal of reducing inequality and ensuring welfare</li>
        <li>Social safety nets (free healthcare, education)</li>
        <li>Workers' rights and labor protections</li>
        <li>Redistribution of wealth through taxation</li>
    </ul>
</div>

<div class="table-container">
    <h4>Capitalism vs Socialism:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Capitalism</th>
            <th>Socialism</th>
        </tr>
        <tr>
            <td><strong>Ownership</strong></td>
            <td>Private</td>
            <td>Collective/State</td>
        </tr>
        <tr>
            <td><strong>Motive</strong></td>
            <td>Profit</td>
            <td>Social welfare</td>
        </tr>
        <tr>
            <td><strong>Distribution</strong></td>
            <td>Market-based</td>
            <td>Planned/regulated</td>
        </tr>
        <tr>
            <td><strong>Government role</strong></td>
            <td>Minimal</td>
            <td>Significant</td>
        </tr>
        <tr>
            <td><strong>Examples</strong></td>
            <td>USA, UK</td>
            <td>Cuba, Nordic countries (mixed)</td>
        </tr>
    </table>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Reduces inequality and poverty</td>
            <td>May stifle individual initiative</td>
        </tr>
        <tr>
            <td>Provides social safety nets</td>
            <td>Bureaucratic inefficiency</td>
        </tr>
        <tr>
            <td>Protects workers' rights</td>
            <td>Risk of authoritarian control</td>
        </tr>
    </table>
</div>`,
                        question: {
                            text: "A major goal of socialism is to:",
                            options: {
                                "A": "Maximize private profits",
                                "B": "Reduce inequality and ensure social welfare",
                                "C": "Eliminate all government intervention",
                                "D": "Maintain feudal hierarchies"
                            },
                            correctAnswer: "B",
                            explanation: "The major goal of socialism is to reduce inequality and ensure social welfare through collective ownership and redistribution of resources. It contrasts with capitalism's focus on private profit."
                        }
                    }
                ]
            },
            {
                name: "Communism and Totalitarianism",
                objectives: [
                    {
                        title: "Understand Communism",
                        explanation: `<p><strong>Communism</strong> is an ideology advocating a classless, stateless society where all property is communally owned and each person contributes and receives according to their needs. It is the extreme form of socialism, based on Karl Marx's theories.</p>

<div class="key-points">
    <h4>Key Features of Communism:</h4>
    <ul>
        <li>Abolition of private property</li>
        <li>Classless society (no bourgeoisie or proletariat)</li>
        <li>Common ownership of all means of production</li>
        <li>Central planning of the economy</li>
        <li>Goal: "From each according to ability, to each according to need"</li>
        <li>One-party state (in practice)</li>
    </ul>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr>
            <td>Eliminates class exploitation</td>
            <td>Suppresses individual freedom</td>
        </tr>
        <tr>
            <td>Ensures basic needs for all</td>
            <td>Economic inefficiency</td>
        </tr>
        <tr>
            <td>Promotes equality</td>
            <td>Often leads to authoritarian rule</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p>Soviet Union (1917-1991), China (1949-present, modified), Cuba, North Korea</p>
</div>`,
                        question: {
                            text: "Which ideology advocates for a classless, stateless society with communal ownership of property?",
                            options: {
                                "A": "Capitalism",
                                "B": "Feudalism",
                                "C": "Communism",
                                "D": "Fascism"
                            },
                            correctAnswer: "C",
                            explanation: "Communism advocates for a classless, stateless society where all property is communally owned. It aims to eliminate class distinctions and private ownership of the means of production."
                        }
                    },
                    {
                        title: "Understand Totalitarianism",
                        explanation: `<p><strong>Totalitarianism</strong> is a system of government that is centralized, dictatorial, and requires complete subservience to the state. The state seeks to control all aspects of public and private life.</p>

<div class="key-points">
    <h4>Key Features of Totalitarianism:</h4>
    <ul>
        <li>Single-party rule with absolute power</li>
        <li>Complete control over all aspects of life (political, economic, social, cultural)</li>
        <li>Use of propaganda and censorship</li>
        <li>Secret police and surveillance</li>
        <li>Suppression of all opposition</li>
        <li>Personality cult around the leader</li>
        <li>State-controlled media and education</li>
    </ul>
</div>

<div class="table-container">
    <h4>Totalitarianism vs Authoritarianism:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Totalitarianism</th>
            <th>Authoritarianism</th>
        </tr>
        <tr>
            <td><strong>Scope</strong></td>
            <td>Controls ALL aspects of life</td>
            <td>Controls mainly political life</td>
        </tr>
        <tr>
            <td><strong>Ideology</strong></td>
            <td>Often has official ideology</td>
            <td>May not have ideology</td>
        </tr>
        <tr>
            <td><strong>Mobilization</strong></td>
            <td>Mass mobilization required</td>
            <td>Demobilizes population</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Examples:</h4>
    <p>Nazi Germany (Hitler), Soviet Union (Stalin), North Korea (Kim dynasty)</p>
</div>`,
                        question: {
                            text: "Totalitarianism is characterized by:",
                            options: {
                                "A": "Limited government and individual freedom",
                                "B": "Complete state control over all aspects of life",
                                "C": "Free and fair elections",
                                "D": "Power sharing among multiple parties"
                            },
                            correctAnswer: "B",
                            explanation: "Totalitarianism is characterized by complete state control over all aspects of life - political, economic, social, and cultural. The state demands total obedience and uses propaganda, censorship, and force to maintain control."
                        }
                    }
                ]
            },
            {
                name: "Fascism and Nazism",
                objectives: [
                    {
                        title: "Understand Fascism and Nazism",
                        explanation: `<p><strong>Fascism</strong> is a far-right authoritarian ideology that emphasizes dictatorial power, extreme nationalism, suppression of opposition, and strong regimentation of society and the economy.</p>

<p><strong>Nazism</strong> (National Socialism) is a specific form of fascism practiced in Nazi Germany under Adolf Hitler, adding racial ideology and anti-Semitism.</p>

<div class="key-points">
    <h4>Key Features of Fascism:</h4>
    <ul>
        <li>Extreme nationalism ("nation above all")</li>
        <li>Dictatorial leadership (personality cult)</li>
        <li>Suppression of opposition and civil liberties</li>
        <li>Glorification of military and violence</li>
        <li>State control of economy (corporatism)</li>
        <li>Rejection of democracy and liberalism</li>
    </ul>
</div>

<div class="key-points">
    <h4>Nazism added:</h4>
    <ul>
        <li>Racial ideology: "Aryan supremacy"</li>
        <li>Anti-Semitism (hatred of Jews)</li>
        <li>Lebensraum: Territorial expansion</li>
        <li>Holocaust: Genocide of Jews and others</li>
    </ul>
</div>

<div class="table-container">
    <h4>Comparison:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Fascism</th>
            <th>Nazism</th>
        </tr>
        <tr>
            <td><strong>Focus</strong></td>
            <td>Nation/State</td>
            <td>Race</td>
        </tr>
        <tr>
            <td><strong>Example</strong></td>
            <td>Italy (Mussolini)</td>
            <td>Germany (Hitler)</td>
        </tr>
        <tr>
            <td><strong>Racial ideology</strong></td>
            <td>Less emphasized</td>
            <td>Central to ideology</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>Important Note:</h4>
    <p>Both fascism and Nazism led to World War II and massive human suffering. They are universally condemned ideologies that represent extreme abuse of power.</p>
</div>`,
                        question: {
                            text: "Fascism is characterized by:",
                            options: {
                                "A": "Democratic elections and individual freedom",
                                "B": "Extreme nationalism and dictatorial power",
                                "C": "Classless society and communal ownership",
                                "D": "Free market capitalism without government"
                            },
                            correctAnswer: "B",
                            explanation: "Fascism is characterized by extreme nationalism, dictatorial power, suppression of opposition, and strong regimentation of society. It glorifies the nation/state above all and rejects democracy."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 7: CONSTITUTION
    // ============================================================
    "Constitution:": {
        subject: "Government",
        topic: "Constitution:",
        introduction: {
            title: "Constitution",
            description: "This topic covers the fundamental legal framework that defines how a government operates, allocates power, and protects rights. A constitution is the 'supreme law' that binds rulers and citizens alike.",
            jambInfo: "This is a core JAMB area with questions frequently requiring definitions, sources, functions, and comparisons of types (written vs. unwritten, rigid vs. flexible). Nigerian examples are commonly tested."
        },
        subtopics: [
            {
                name: "Meaning and Importance of Constitution",
                objectives: [
                    {
                        title: "Define Constitution and its Importance",
                        explanation: `<p>A <strong>Constitution</strong> is the fundamental and supreme law of a state or nation that establishes the structure, powers, and limits of government; allocates authority among institutions; defines the relationship between government and citizens; and outlines fundamental rights, duties, and principles of governance.</p>

<div class="key-points">
    <h4>Two Senses of Constitution:</h4>
    <ul>
        <li><strong>Narrow/Legal Sense:</strong> A single written document codifying the rules (e.g., Nigeria's 1999 Constitution)</li>
        <li><strong>Broad/Political Sense:</strong> Includes unwritten conventions, judicial precedents, and customs (e.g., UK's constitution)</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Key Principles of a Constitution:</h4>
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-crown"></i>
            <p><strong>Supremacy</strong></p>
            <p>Overrides all other laws</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-balance-scale"></i>
            <p><strong>Fundamental</strong></p>
            <p>Basic framework for governance</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-link"></i>
            <p><strong>Binding</strong></p>
            <p>Applies to all - government & citizens</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-sync-alt"></i>
            <p><strong>Evolutionary</strong></p>
            <p>Can be amended over time</p>
        </div>
    </div>
</div>

<div class="table-container">
    <h4>Importance of a Constitution:</h4>
    <table class="styled-table">
        <tr>
            <th>Importance</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><strong>Provides stability</strong></td>
            <td>Ensures continuity in governance</td>
        </tr>
        <tr>
            <td><strong>Protects rights</strong></td>
            <td>Safeguards citizens against abuse</td>
        </tr>
        <tr>
            <td><strong>Limits power</strong></td>
            <td>Ensures accountability of rulers</td>
        </tr>
        <tr>
            <td><strong>Promotes unity</strong></td>
            <td>Defines shared national values</td>
        </tr>
        <tr>
            <td><strong>Facilitates resolution</strong></td>
            <td>Provides framework for settling disputes</td>
        </tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Context:</h4>
    <p>Nigeria's 1999 Constitution defines federalism, rights (Chapter IV), and government arms. It serves as the basis for democracy since 1999.</p>
</div>`,
                        question: {
                            text: "A constitution is best defined as the:",
                            options: {
                                "A": "Set of ordinary laws passed by the legislature",
                                "B": "Fundamental law establishing government structure and rights",
                                "C": "Collection of unwritten traditions only",
                                "D": "Military decrees during emergencies"
                            },
                            correctAnswer: "B",
                            explanation: "A constitution is the fundamental law establishing government structure, powers, limits, and citizens' rights. It is the supreme law that overrides all other laws in the state."
                        }
                    }
                ]
            },
            {
                name: "Sources of Constitution",
                objectives: [
                    {
                        title: "Identify Sources of a Constitution",
                        explanation: `<p><strong>Sources of a constitution</strong> refer to the origins or materials from which its provisions are derived. These are the building blocks that shape its content.</p>

<div class="key-points">
    <h4>Common Sources of Constitutions:</h4>
    <ul>
        <li><strong>Historical Documents/Acts:</strong> Past laws or charters (e.g., Magna Carta for UK)</li>
        <li><strong>Conventions/Customs:</strong> Unwritten practices that have become binding</li>
        <li><strong>Judicial Precedents:</strong> Court rulings (e.g., Marbury v. Madison for judicial review)</li>
        <li><strong>Statutes/Acts of Parliament:</strong> Legislated laws</li>
        <li><strong>Common Law:</strong> Judge-made law from cases</li>
        <li><strong>Opinions of Jurists:</strong> Writings of legal experts (e.g., Dicey, Montesquieu)</li>
        <li><strong>International Treaties:</strong> Global standards (e.g., UN Human Rights Declaration)</li>
        <li><strong>Constituent Assemblies:</strong> Deliberative bodies that draft constitutions</li>
    </ul>
</div>

<div class="visual-section">
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0;">
        <div style="background: #e3f2fd; padding: 10px 15px; border-radius: 20px; border: 2px solid #1976d2;">Historical Documents</div>
        <div style="background: #e8f5e9; padding: 10px 15px; border-radius: 20px; border: 2px solid #388e3c;">Customs & Conventions</div>
        <div style="background: #fff3e0; padding: 10px 15px; border-radius: 20px; border: 2px solid #f57c00;">Judicial Precedents</div>
        <div style="background: #fce4ec; padding: 10px 15px; border-radius: 20px; border: 2px solid #e91e63;">Statutes</div>
        <div style="background: #f3e5f5; padding: 10px 15px; border-radius: 20px; border: 2px solid #9c27b0;">International Treaties</div>
    </div>
</div>

<div class="example-box">
    <h4>Nigerian Sources:</h4>
    <p>Nigeria's 1999 Constitution sources include: past constitutions (1979, 1963), colonial legacies (British Westminster model), indigenous customs, judicial decisions (Supreme Court precedents), and international treaties (African Charter on Human Rights).</p>
</div>`,
                        question: {
                            text: "One source of a constitution is:",
                            options: {
                                "A": "Military decrees only",
                                "B": "Judicial precedents and court decisions",
                                "C": "Ordinary newspaper articles",
                                "D": "Personal opinions of leaders"
                            },
                            correctAnswer: "B",
                            explanation: "Judicial precedents and court decisions are important sources of constitutions. Courts interpret laws and their decisions become binding, contributing to constitutional development. Examples include landmark Supreme Court cases."
                        }
                    }
                ]
            },
            {
                name: "Functions of Constitution",
                objectives: [
                    {
                        title: "Explain the Functions of a Constitution",
                        explanation: `<p><strong>Functions of a constitution</strong> are the roles or purposes it serves in organizing society, governing effectively, and safeguarding freedoms.</p>

<div class="key-points">
    <h4>Primary Functions:</h4>
    <ul>
        <li><strong>Establishes Government Structure:</strong> Defines the arms, powers, and organization</li>
        <li><strong>Allocates Power:</strong> Separation and checks to prevent abuse</li>
        <li><strong>Protects Fundamental Rights:</strong> Bill of rights (e.g., freedom of speech)</li>
        <li><strong>Promotes Rule of Law:</strong> Ensures equality before the law</li>
        <li><strong>Provides for Amendments:</strong> Mechanism for change</li>
        <li><strong>Defines Citizenship:</strong> Rights and duties of citizens</li>
        <li><strong>Ensures National Unity:</strong> In diverse states like Nigeria</li>
        <li><strong>Guides Policy:</strong> Framework for economic/social development</li>
    </ul>
</div>

<div class="table-container">
    <h4>Constitutional Functions in Nigeria's 1999 Constitution:</h4>
    <table class="styled-table">
        <tr>
            <th>Section</th>
            <th>Function</th>
        </tr>
        <tr>
            <td>Chapter I</td>
            <td>Establishes Nigeria as a federation</td>
        </tr>
        <tr>
            <td>Chapter II</td>
            <td>Fundamental Objectives and Directive Principles</td>
        </tr>
        <tr>
            <td>Chapter IV</td>
            <td>Protects Fundamental Rights</td>
        </tr>
        <tr>
            <td>Sections 4, 5, 6</td>
            <td>Separates powers among Legislature, Executive, Judiciary</td>
        </tr>
        <tr>
            <td>Second Schedule</td>
            <td>Divides powers (Exclusive, Concurrent, Residual lists)</td>
        </tr>
    </table>
</div>`,
                        question: {
                            text: "A primary function of a constitution is to:",
                            options: {
                                "A": "Establish the structure and powers of government",
                                "B": "Create military decrees",
                                "C": "Regulate daily business activities",
                                "D": "Appoint individual leaders"
                            },
                            correctAnswer: "A",
                            explanation: "A primary function of a constitution is to establish the structure and powers of government. It defines the arms of government, allocates powers, and sets limits to prevent abuse."
                        }
                    }
                ]
            },
            {
                name: "Types of Constitution",
                objectives: [
                    {
                        title: "Compare Written and Unwritten Constitutions",
                        explanation: `<p>Constitutions can be classified based on their form (written/unwritten) and their flexibility (rigid/flexible).</p>

<div class="table-container">
    <h4>Written vs Unwritten Constitution:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Written Constitution</th>
            <th>Unwritten Constitution</th>
        </tr>
        <tr>
            <td><strong>Form</strong></td>
            <td>Single document or set of documents</td>
            <td>Collection of customs, conventions, precedents</td>
        </tr>
        <tr>
            <td><strong>Clarity</strong></td>
            <td>Clear and precise provisions</td>
            <td>May be vague or scattered</td>
        </tr>
        <tr>
            <td><strong>Amendment</strong></td>
            <td>Usually requires special procedure</td>
            <td>Easier to modify</td>
        </tr>
        <tr>
            <td><strong>Accessibility</strong></td>
            <td>Easy to reference</td>
            <td>Requires expert knowledge</td>
        </tr>
        <tr>
            <td><strong>Examples</strong></td>
            <td>Nigeria, USA, India</td>
            <td>United Kingdom, Israel</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Merits of Written Constitution:</h4>
    <ul>
        <li>Clear and accessible to all</li>
        <li>Provides definite reference point</li>
        <li>Protects against arbitrary changes</li>
        <li>Easier to enforce</li>
    </ul>
</div>

<div class="key-points">
    <h4>Merits of Unwritten Constitution:</h4>
    <ul>
        <li>Flexible and adaptable</li>
        <li>Evolves with society</li>
        <li>Less rigid formalities</li>
        <li>Based on practical experience</li>
    </ul>
</div>`,
                        question: {
                            text: "Which country is an example of an unwritten constitution?",
                            options: {
                                "A": "Nigeria",
                                "B": "United States",
                                "C": "United Kingdom",
                                "D": "India"
                            },
                            correctAnswer: "C",
                            explanation: "The United Kingdom has an unwritten constitution - a collection of customs, conventions, statutes, and judicial precedents rather than a single written document. Nigeria, USA, and India all have written constitutions."
                        }
                    },
                    {
                        title: "Compare Rigid and Flexible Constitutions",
                        explanation: `<p><strong>Rigid</strong> and <strong>Flexible</strong> constitutions differ in how easily they can be amended.</p>

<div class="table-container">
    <h4>Rigid vs Flexible Constitution:</h4>
    <table class="styled-table">
        <tr>
            <th>Feature</th>
            <th>Rigid Constitution</th>
            <th>Flexible Constitution</th>
        </tr>
        <tr>
            <td><strong>Amendment</strong></td>
            <td>Requires special procedure (e.g., 2/3 majority, referendum)</td>
            <td>Amended by ordinary legislative process</td>
        </tr>
        <tr>
            <td><strong>Stability</strong></td>
            <td>More stable, less frequent changes</td>
            <td>Can change frequently</td>
        </tr>
        <tr>
            <td><strong>Supremacy</strong></td>
            <td>Constitution is supreme over legislature</td>
            <td>Parliament is often supreme</td>
        </tr>
        <tr>
            <td><strong>Protection</strong></td>
            <td>Better protection of rights</td>
            <td>Rights can be easily changed</td>
        </tr>
        <tr>
            <td><strong>Adaptability</strong></td>
            <td>Slow to adapt to changes</td>
            <td>Quick adaptation</td>
        </tr>
        <tr>
            <td><strong>Examples</strong></td>
            <td>Nigeria, USA</td>
            <td>United Kingdom, New Zealand</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Amendment Process in Nigeria:</h4>
    <p>To amend the 1999 Constitution:</p>
    <ul>
        <li>Requires 2/3 majority in both National Assembly houses</li>
        <li>Plus approval by at least 24 of 36 State Houses of Assembly</li>
        <li>This makes it a <strong>rigid constitution</strong></li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>Remember: <strong>Written ≠ Rigid</strong>. A written constitution can be flexible (easily amended), and an unwritten constitution can be rigid (hard to change due to strong conventions). However, in practice, most written constitutions (like Nigeria's) are also rigid.</p>
</div>`,
                        question: {
                            text: "Nigeria's 1999 Constitution is classified as:",
                            options: {
                                "A": "Unwritten and flexible",
                                "B": "Written and rigid",
                                "C": "Unwritten and rigid",
                                "D": "Written and flexible"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria's 1999 Constitution is written (contained in a single document) and rigid (requires 2/3 majority in National Assembly plus approval by at least 24 State Houses of Assembly to amend)."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 10: CITIZENSHIP
    // ============================================================
    "Citizenship:": {
        subject: "Government",
        topic: "Citizenship:",
        introduction: {
            title: "Citizenship",
            description: "This topic covers the legal and political relationship between an individual and a state. It includes modes of acquiring citizenship, citizenship rights, dual citizenship, and the duties of citizens and the state.",
            jambInfo: "This is one of the most frequently examined topics in JAMB Government. Questions require you to differentiate methods of acquiring citizenship, list rights, and state duties/obligations."
        },
        subtopics: [
            {
                name: "Meaning and Types of Citizenship",
                objectives: [
                    {
                        title: "Understand the meaning and modes of acquiring citizenship",
                        explanation: `<p><strong>Citizenship</strong> is the legal and political relationship between an individual and a state that confers full membership rights and imposes corresponding duties/obligations.</p>

<div class="key-points">
    <h4>Key Distinctions:</h4>
    <ul>
        <li><strong>Citizen:</strong> Full legal member of a state with rights and duties</li>
        <li><strong>National:</strong> Someone connected by ethnic/cultural ties (not legal status)</li>
        <li><strong>Subject:</strong> Under monarchy, implying subjection to a ruler</li>
    </ul>
</div>

<div class="table-container">
    <h4>Modes of Acquiring Nigerian Citizenship (1999 Constitution, Sections 25-32):</h4>
    <table class="styled-table">
        <tr>
            <th>Mode</th>
            <th>Requirements</th>
            <th>Key Features</th>
        </tr>
        <tr>
            <td><strong>By Birth</strong></td>
            <td>Either parent or any grandparent is/was Nigerian</td>
            <td>Automatic and unconditional</td>
        </tr>
        <tr>
            <td><strong>By Registration</strong></td>
            <td>Commonwealth citizens or foreign spouses of Nigerians</td>
            <td>Requires application, good character, intent to reside</td>
        </tr>
        <tr>
            <td><strong>By Naturalization</strong></td>
            <td>Non-Commonwealth foreigners</td>
            <td>Requires 15 years continuous residence, good character</td>
        </tr>
    </table>
</div>

<div class="warning-box">
    <h4>Note:</h4>
    <p><strong>Citizenship by adoption</strong> is NOT a mode of acquiring Nigerian citizenship. This is a common JAMB trick question!</p>
</div>`,
                        question: {
                            text: "Which of the following is NOT a mode of acquiring Nigerian citizenship?",
                            options: {
                                "A": "By birth",
                                "B": "By registration",
                                "C": "By adoption",
                                "D": "By naturalization"
                            },
                            correctAnswer: "C",
                            explanation: "Adoption is NOT a mode of acquiring Nigerian citizenship. The three legal modes are: by birth, by registration, and by naturalization."
                        }
                    }
                ]
            },
            {
                name: "Citizenship Rights",
                objectives: [
                    {
                        title: "Understand the fundamental rights of citizens",
                        explanation: `<p><strong>Citizenship rights</strong> are the entitlements and freedoms guaranteed to citizens by the state, enshrined in a bill of rights.</p>

<div class="key-points">
    <h4>Fundamental Rights in Nigeria (1999 Constitution, Chapter IV):</h4>
    <ul>
        <li><strong>Section 33:</strong> Right to life</li>
        <li><strong>Section 34:</strong> Dignity of human person (no torture)</li>
        <li><strong>Section 35:</strong> Personal liberty (no arbitrary arrest)</li>
        <li><strong>Section 36:</strong> Right to fair hearing</li>
        <li><strong>Section 37:</strong> Right to private/family life</li>
        <li><strong>Section 38:</strong> Freedom of thought, conscience, religion</li>
        <li><strong>Section 39:</strong> Freedom of expression</li>
        <li><strong>Section 40:</strong> Right to peaceful assembly and association</li>
        <li><strong>Section 41:</strong> Freedom of movement</li>
        <li><strong>Section 42:</strong> Freedom from discrimination</li>
        <li><strong>Section 43:</strong> Right to acquire and own property</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Limitations on Rights:</h4>
    <ul>
        <li>Rights can be limited during <strong>states of emergency</strong></li>
        <li>Restrictions for <strong>public order, morality, and national security</strong></li>
    </ul>
</div>`,
                        question: {
                            text: "The right to freedom of movement is contained in which section of the 1999 Constitution?",
                            options: {
                                "A": "Section 33",
                                "B": "Section 41",
                                "C": "Section 44",
                                "D": "Section 46"
                            },
                            correctAnswer: "B",
                            explanation: "The right to freedom of movement is contained in Section 41 of the 1999 Constitution."
                        }
                    }
                ]
            },
            {
                name: "Dual Citizenship, Renunciation, and Deprivation",
                objectives: [
                    {
                        title: "Understand dual citizenship, renunciation, and deprivation",
                        explanation: `<p>Understanding how citizenship can be held, given up, or taken away is important for JAMB.</p>

<div class="table-container">
    <h4>Key Concepts:</h4>
    <table class="styled-table">
        <tr>
            <th>Concept</th>
            <th>Definition</th>
            <th>Nigerian Position</th>
        </tr>
        <tr>
            <td><strong>Dual Citizenship</strong></td>
            <td>Holding two citizenships</td>
            <td>Allowed since 1999</td>
        </tr>
        <tr>
            <td><strong>Renunciation</strong></td>
            <td>Voluntarily giving up citizenship</td>
            <td>Adult can renounce by declaration to President</td>
        </tr>
        <tr>
            <td><strong>Deprivation</strong></td>
            <td>State withdrawal of citizenship</td>
            <td>Only for naturalized citizens (not by birth)</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Grounds for Deprivation (Only for Naturalized Citizens):</h4>
    <ul>
        <li>Fraud in the naturalization application</li>
        <li>Disloyalty (e.g., treason, sedition)</li>
        <li>Serving an enemy state in war</li>
        <li>Imprisonment for more than 12 months within 5 years of naturalization</li>
    </ul>
</div>

<div class="warning-box">
    <h4>Important:</h4>
    <p>Citizens by <strong>birth</strong> cannot be deprived of citizenship. Only <strong>naturalized</strong> citizens can have their citizenship revoked.</p>
</div>`,
                        question: {
                            text: "Deprivation of citizenship in Nigeria can only apply to:",
                            options: {
                                "A": "Citizens by birth",
                                "B": "Citizens by naturalization",
                                "C": "Citizens by registration",
                                "D": "All citizens equally"
                            },
                            correctAnswer: "B",
                            explanation: "Deprivation of citizenship in Nigeria can only apply to citizens by naturalization, not citizens by birth or descent."
                        }
                    }
                ]
            },
            {
                name: "Duties of Citizens and the State",
                objectives: [
                    {
                        title: "Understand the duties of citizens and obligations of the state",
                        explanation: `<p>Citizenship involves both rights and responsibilities. Citizens have duties to the state, and the state has obligations to its citizens.</p>

<div class="table-container">
    <h4>Duties of Citizens (Section 24, 1999 Constitution):</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Duty</th></tr>
        <tr><td>1</td><td>Abide by the Constitution and respect its ideals</td></tr>
        <tr><td>2</td><td>Respect national symbols (flag, anthem, pledge)</td></tr>
        <tr><td>3</td><td>Defend Nigeria and render national service (e.g., NYSC)</td></tr>
        <tr><td>4</td><td>Pay taxes and other levies as prescribed by law</td></tr>
        <tr><td>5</td><td>Vote in elections and participate in governance</td></tr>
    </table>
</div>

<div class="table-container">
    <h4>Duties of the State (Chapter II - Fundamental Objectives):</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Duty</th></tr>
        <tr><td>1</td><td>Maintain security and welfare of the people</td></tr>
        <tr><td>2</td><td>Ensure fundamental rights are respected</td></tr>
        <tr><td>3</td><td>Provide free and compulsory education</td></tr>
        <tr><td>4</td><td>Provide adequate medical/health facilities</td></tr>
        <tr><td>5</td><td>Conduct free and fair elections</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Note:</h4>
    <p>Chapter II duties of the state are <strong>Directive Principles</strong> - they are <strong>not justiciable</strong> (cannot be enforced in court). Chapter IV rights ARE justiciable.</p>
</div>`,
                        question: {
                            text: "One constitutional duty of Nigerian citizens is to:",
                            options: {
                                "A": "Disobey unlawful orders",
                                "B": "Defend Nigeria and render national service",
                                "C": "Avoid paying taxes",
                                "D": "Promote ethnic division"
                            },
                            correctAnswer: "B",
                            explanation: "Citizens are constitutionally required to defend Nigeria and render national service (e.g., NYSC)."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 11: THE ELECTORAL PROCESS
    // ============================================================
    "The Electoral Process:": {
        subject: "Government",
        topic: "The Electoral Process:",
        introduction: {
            title: "The Electoral Process",
            description: "This topic covers how citizens participate in selecting leaders through elections. It includes suffrage, types of elections, electoral systems, and electoral commissions.",
            jambInfo: "This is a high-yield area in JAMB. Questions often ask about suffrage, ingredients of free/fair elections, electoral systems, or INEC's functions."
        },
        subtopics: [
            {
                name: "Suffrage (Franchise)",
                objectives: [
                    {
                        title: "Understand suffrage and its types",
                        explanation: `<p><strong>Suffrage (Franchise)</strong> is the right or privilege to vote in public elections.</p>

<div class="key-points">
    <h4>Types of Suffrage:</h4>
    <ul>
        <li><strong>Universal Adult Suffrage:</strong> All adults (18+) can vote. Used in Nigeria.</li>
        <li><strong>Limited/Restricted Suffrage:</strong> Based on property, education, or gender. Historical.</li>
        <li><strong>Equal Suffrage:</strong> Each voter has one vote (one-person-one-vote).</li>
        <li><strong>Compulsory Suffrage:</strong> Voting is mandatory (e.g., Australia).</li>
    </ul>
</div>

<div class="table-container">
    <h4>Evolution of Suffrage in Nigeria:</h4>
    <table class="styled-table">
        <tr><th>Period</th><th>Development</th></tr>
        <tr><td>Colonial Era</td><td>Limited to educated/property owners</td></tr>
        <tr><td>1950s (South)</td><td>Women gained voting rights</td></tr>
        <tr><td>1979</td><td>Universal adult suffrage; Northern women gained voting rights</td></tr>
        <tr><td>Present</td><td>All citizens 18+ can vote</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Qualifications to Vote in Nigeria:</h4>
    <ul>
        <li>Be at least 18 years old</li>
        <li>Be a Nigerian citizen</li>
        <li>Be of sound mind</li>
        <li>Be registered with INEC</li>
    </ul>
</div>`,
                        question: {
                            text: "A type of suffrage where voting is based on education or property is:",
                            options: {
                                "A": "Universal adult suffrage",
                                "B": "Limited or restricted suffrage",
                                "C": "Equal suffrage",
                                "D": "Compulsory suffrage"
                            },
                            correctAnswer: "B",
                            explanation: "Limited or restricted suffrage is based on qualifications like education or property ownership."
                        }
                    }
                ]
            },
            {
                name: "Types of Elections",
                objectives: [
                    {
                        title: "Understand the different types of elections",
                        explanation: `<p><strong>An election</strong> is the formal process by which citizens select representatives through voting.</p>

<div class="table-container">
    <h4>Types of Elections:</h4>
    <table class="styled-table">
        <tr><th>Type</th><th>Definition</th><th>Example</th></tr>
        <tr><td><strong>General Election</strong></td><td>Nationwide election for officials</td><td>Every 4 years in Nigeria</td></tr>
        <tr><td><strong>By-Election</strong></td><td>Fills a vacancy (death, resignation)</td><td>When a legislator dies mid-term</td></tr>
        <tr><td><strong>Primary Election</strong></td><td>Party internal to select candidates</td><td>APC/PDP primaries</td></tr>
        <tr><td><strong>Referendum</strong></td><td>Direct vote on a specific issue</td><td>UK Brexit vote 2016</td></tr>
        <tr><td><strong>Plebiscite</strong></td><td>Vote on territorial status</td><td>Cameroon 1961</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Ingredients of Free and Fair Elections:</h4>
    <ul>
        <li>Independent electoral body (e.g., INEC)</li>
        <li>Up-to-date voter register</li>
        <li>Secret ballot and secure polling</li>
        <li>Equal access to media/campaigning</li>
        <li>No intimidation or violence</li>
        <li>Transparent counting and result announcement</li>
        <li>Judicial redress for disputes</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Context:</h4>
    <p>The 2023 election introduced <strong>BVAS</strong> for biometric verification and <strong>IReV</strong> for electronic result transmission.</p>
</div>`,
                        question: {
                            text: "A by-election is held to:",
                            options: {
                                "A": "Elect all national officials",
                                "B": "Fill a vacant seat in the legislature",
                                "C": "Decide on a policy issue",
                                "D": "Select party candidates"
                            },
                            correctAnswer: "B",
                            explanation: "A by-election is held to fill a vacancy in a constituency, usually caused by death, resignation, or removal."
                        }
                    }
                ]
            },
            {
                name: "Electoral Systems",
                objectives: [
                    {
                        title: "Understand the different types of electoral systems",
                        explanation: `<p><strong>An electoral system</strong> is the method by which votes are translated into seats or outcomes.</p>

<div class="table-container">
    <h4>Major Electoral Systems:</h4>
    <table class="styled-table">
        <tr><th>System</th><th>How It Works</th><th>Used By</th></tr>
        <tr>
            <td><strong>First-Past-The-Post (FPTP)</strong></td>
            <td>Winner takes seat with most votes (even if less than 50%)</td>
            <td>Nigeria, UK, USA</td>
        </tr>
        <tr>
            <td><strong>Absolute Majority / Two-Round</strong></td>
            <td>Candidate needs over 50%; if not, run-off</td>
            <td>France</td>
        </tr>
        <tr>
            <td><strong>Proportional Representation (PR)</strong></td>
            <td>Seats allocated by vote proportion</td>
            <td>South Africa, Israel</td>
        </tr>
        <tr>
            <td><strong>Mixed Member (MMP)</strong></td>
            <td>Combines FPTP + PR</td>
            <td>Germany, New Zealand</td>
        </tr>
    </table>
</div>

<div class="visual-section">
    <h4>Nigeria uses:</h4>
    <div style="background: linear-gradient(to right, #1976d2, #42a5f5); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0;">First-Past-The-Post (FPTP)</h3>
        <p style="margin: 10px 0 0 0;">Simple Majority System - Used since independence</p>
    </div>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>In FPTP you only need the <strong>most votes</strong> (simple majority). In Absolute Majority you need <strong>more than 50%</strong>.</p>
</div>`,
                        question: {
                            text: "In the first-past-the-post system, the winner needs:",
                            options: {
                                "A": "An absolute majority (over 50%)",
                                "B": "The most votes, even if less than 50%",
                                "C": "Proportional allocation of votes",
                                "D": "Ranking by voters"
                            },
                            correctAnswer: "B",
                            explanation: "In the first-past-the-post (FPTP) system, the winner only needs the most votes, even if less than 50%."
                        }
                    }
                ]
            },
            {
                name: "Electoral Commission (INEC)",
                objectives: [
                    {
                        title: "Understand the functions and problems of electoral commissions",
                        explanation: `<p><strong>INEC (Independent National Electoral Commission)</strong> is Nigeria's electoral body responsible for organizing and supervising elections.</p>

<div class="key-points">
    <h4>INEC's Composition:</h4>
    <ul>
        <li>Chairman appointed by the President (Senate confirmation)</li>
        <li>12 National Commissioners</li>
        <li>Resident Electoral Commissioners in each state</li>
    </ul>
</div>

<div class="table-container">
    <h4>Functions of INEC:</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Function</th></tr>
        <tr><td>1</td><td>Conduct and supervise all elections</td></tr>
        <tr><td>2</td><td>Register voters and maintain voter register</td></tr>
        <tr><td>3</td><td>Conduct voter education</td></tr>
        <tr><td>4</td><td>Delimit constituencies</td></tr>
        <tr><td>5</td><td>Register and regulate political parties</td></tr>
        <tr><td>6</td><td>Monitor campaign finance</td></tr>
        <tr><td>7</td><td>Announce election results</td></tr>
    </table>
</div>

<div class="table-container">
    <h4>Problems Facing INEC:</h4>
    <table class="styled-table">
        <tr><th>Problem</th><th>Description</th></tr>
        <tr><td><strong>Political interference</strong></td><td>Government influence on operations</td></tr>
        <tr><td><strong>Inadequate funding</strong></td><td>Insufficient resources</td></tr>
        <tr><td><strong>Electoral violence</strong></td><td>Intimidation and insecurity</td></tr>
        <tr><td><strong>Vote buying/rigging</strong></td><td>Manipulation of votes</td></tr>
        <tr><td><strong>Logistics challenges</strong></td><td>Poor infrastructure, late materials</td></tr>
    </table>
</div>`,
                        question: {
                            text: "One major function of INEC is to:",
                            options: {
                                "A": "Appoint ministers",
                                "B": "Register voters and conduct elections",
                                "C": "Interpret election laws",
                                "D": "Impeach elected officials"
                            },
                            correctAnswer: "B",
                            explanation: "INEC's primary functions include registering voters and conducting all elections in Nigeria."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 13: PRESSURE GROUPS
    // ============================================================
    "Pressure Groups:": {
        subject: "Government",
        topic: "Pressure Groups:",
        introduction: {
            title: "Pressure Groups",
            description: "This topic examines organized groups that seek to influence public policy and government decisions without directly contesting elections. Pressure groups are vital in democracies as they articulate interests that political parties may overlook.",
            jambInfo: "JAMB questions often ask you to define pressure groups, distinguish them from political parties, identify types and functions, and give Nigerian examples."
        },
        subtopics: [
            {
                name: "Definition and Types of Pressure Groups",
                objectives: [
                    {
                        title: "Understand pressure groups and their types",
                        explanation: `<p>A <strong>pressure group</strong> (also called interest group or lobby group) is an organized collection of individuals or organizations that share common interests and actively seek to influence government policies without contesting elections or seeking to form a government.</p>

<div class="key-points">
    <h4>Key Features:</h4>
    <ul>
        <li><strong>Goal-oriented:</strong> Focus on specific, narrow interests</li>
        <li><strong>Non-electoral:</strong> Do not field candidates in elections</li>
        <li><strong>Influence-focused:</strong> Seek to shape policy, not implement it</li>
        <li><strong>Voluntary membership:</strong> Based on shared concerns</li>
    </ul>
</div>

<div class="table-container">
    <h4>Types of Pressure Groups:</h4>
    <table class="styled-table">
        <tr><th>Type</th><th>Description</th><th>Nigerian Examples</th></tr>
        <tr>
            <td><strong>Economic/Sectional Groups</strong></td>
            <td>Represent occupational/economic interests</td>
            <td>NLC, ASUU, NBA, NMA, MAN</td>
        </tr>
        <tr>
            <td><strong>Promotional/Cause Groups</strong></td>
            <td>Advocate broad causes or values</td>
            <td>SERAP, Amnesty International, CLO</td>
        </tr>
        <tr>
            <td><strong>Ethnic/Regional Groups</strong></td>
            <td>Advocate ethnic or regional interests</td>
            <td>Afenifere, Ohanaeze Ndigbo, Arewa Consultative Forum</td>
        </tr>
        <tr>
            <td><strong>Professional Groups</strong></td>
            <td>Represent specific professions</td>
            <td>Nigerian Bar Association, Nigerian Medical Association</td>
        </tr>
    </table>
</div>

<div class="key-points">
    <h4>Insider vs Outsider Groups:</h4>
    <ul>
        <li><strong>Insider Groups:</strong> Have regular access to policymakers (e.g., NBA influencing justice policy)</li>
        <li><strong>Outsider Groups:</strong> Rely on public campaigns and protests (e.g., #EndSARS protesters)</li>
    </ul>
</div>`,
                        question: {
                            text: "A pressure group differs from a political party mainly because it:",
                            options: {
                                "A": "Contests elections to form government",
                                "B": "Seeks to influence policy without seeking power",
                                "C": "Is always funded by the government",
                                "D": "Has no organized structure"
                            },
                            correctAnswer: "B",
                            explanation: "Pressure groups seek to influence policy without seeking to capture state power or form government. Political parties contest elections to win power."
                        }
                    }
                ]
            },
            {
                name: "Functions of Pressure Groups",
                objectives: [
                    {
                        title: "Understand the functions of pressure groups",
                        explanation: `<p>Pressure groups perform vital functions in a democratic society.</p>

<div class="table-container">
    <h4>Functions of Pressure Groups:</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Function</th><th>Example</th></tr>
        <tr><td>1</td><td><strong>Interest Articulation</strong> - Voice grievances and demands</td><td>ASUU strikes for better university funding</td></tr>
        <tr><td>2</td><td><strong>Policy Influence/Lobbying</strong> - Shape legislation through direct contact</td><td>NBA submitting memoranda on justice reform</td></tr>
        <tr><td>3</td><td><strong>Political Education</strong> - Raise awareness, mobilize public opinion</td><td>#BringBackOurGirls campaign</td></tr>
        <tr><td>4</td><td><strong>Checks on Government</strong> - Expose abuses, monitor implementation</td><td>SERAP suing for budget transparency</td></tr>
        <tr><td>5</td><td><strong>Alternative Participation</strong> - Channel for those disillusioned with parties</td><td>#EndSARS movement</td></tr>
        <tr><td>6</td><td><strong>Recruitment of Leaders</strong> - Political leaders emerge from groups</td><td>Union leaders becoming politicians</td></tr>
    </table>
</div>

<div class="table-container">
    <h4>Merits vs Demerits:</h4>
    <table class="styled-table">
        <tr>
            <th style="background: #4caf50;">Merits</th>
            <th style="background: #f44336;">Demerits</th>
        </tr>
        <tr><td>Represent diverse interests parties ignore</td><td>Promote narrow interests over national good</td></tr>
        <tr><td>Alternative avenue beyond voting</td><td>Wealthy groups dominate (unequal influence)</td></tr>
        <tr><td>Check government excesses</td><td>Strikes/protests cause economic disruption</td></tr>
        <tr><td>Provide specialist expertise</td><td>Corruption in lobbying (bribery)</td></tr>
    </table>
</div>`,
                        question: {
                            text: "One function of pressure groups in a democracy is to:",
                            options: {
                                "A": "Appoint ministers to cabinet",
                                "B": "Articulate the interests of their members",
                                "C": "Conduct elections",
                                "D": "Make laws in parliament"
                            },
                            correctAnswer: "B",
                            explanation: "Interest articulation is a key function of pressure groups - they voice the grievances and demands of their members to the government."
                        }
                    }
                ]
            },
            {
                name: "Modes of Operation",
                objectives: [
                    {
                        title: "Understand how pressure groups operate",
                        explanation: `<p>Pressure groups use various methods to influence government policy.</p>

<div class="table-container">
    <h4>Modes of Operation (Modus Operandi):</h4>
    <table class="styled-table">
        <tr><th>Method</th><th>Description</th><th>Example</th></tr>
        <tr><td><strong>Lobbying</strong></td><td>Direct contact with policymakers</td><td>Meetings, position papers, memoranda</td></tr>
        <tr><td><strong>Mass Protests</strong></td><td>Public demonstrations and marches</td><td>#EndSARS protests (2020)</td></tr>
        <tr><td><strong>Media Campaigns</strong></td><td>Press conferences, social media</td><td>Twitter campaigns, TV appearances</td></tr>
        <tr><td><strong>Litigation</strong></td><td>Court cases and judicial activism</td><td>SERAP suing government</td></tr>
        <tr><td><strong>Strikes/Boycotts</strong></td><td>Economic pressure</td><td>NLC nationwide strikes</td></tr>
        <tr><td><strong>Electoral Support</strong></td><td>Campaign for sympathetic candidates</td><td>Endorsing candidates</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Examples:</h4>
    <ul>
        <li><strong>NLC/ASUU:</strong> Regular strikes for workers' rights</li>
        <li><strong>#EndSARS (2020):</strong> Youth-led movement against police brutality</li>
        <li><strong>SERAP:</strong> Legal advocacy for accountability</li>
        <li><strong>Ethnic associations:</strong> Influence political zoning</li>
    </ul>
</div>`,
                        question: {
                            text: "One major mode of operation used by pressure groups is:",
                            options: {
                                "A": "Fielding candidates in elections",
                                "B": "Organizing strikes and public demonstrations",
                                "C": "Suspending the constitution",
                                "D": "Appointing ministers"
                            },
                            correctAnswer: "B",
                            explanation: "Pressure groups use strikes, demonstrations, and protests as a key mode of operation to draw attention to their causes and pressure government."
                        }
                    }
                ]
            },
            {
                name: "Pressure Groups vs Political Parties",
                objectives: [
                    {
                        title: "Distinguish between pressure groups and political parties",
                        explanation: `<p>While both are important in politics, pressure groups and political parties have fundamental differences.</p>

<div class="table-container">
    <h4>Comparison:</h4>
    <table class="styled-table">
        <tr><th>Aspect</th><th>Pressure Groups</th><th>Political Parties</th></tr>
        <tr><td><strong>Main Goal</strong></td><td>Influence policy</td><td>Win elections and form government</td></tr>
        <tr><td><strong>Elections</strong></td><td>Do NOT contest</td><td>Contest elections</td></tr>
        <tr><td><strong>Scope of Interest</strong></td><td>Narrow, specific issues</td><td>Broad range of issues (manifesto)</td></tr>
        <tr><td><strong>Membership</strong></td><td>Based on shared interest</td><td>Based on ideology/political belief</td></tr>
        <tr><td><strong>Accountability</strong></td><td>To members only</td><td>To the entire electorate</td></tr>
        <tr><td><strong>Power</strong></td><td>Seek to influence</td><td>Seek to capture and exercise</td></tr>
        <tr><td><strong>Examples</strong></td><td>NLC, ASUU, NBA</td><td>APC, PDP, LP</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Tip:</h4>
    <p>The KEY distinction is: Pressure groups <strong>influence</strong> power; political parties <strong>seek to capture</strong> power through elections.</p>
</div>`,
                        question: {
                            text: "The main difference between a pressure group and a political party is that:",
                            options: {
                                "A": "Pressure groups have members while parties don't",
                                "B": "Political parties contest elections while pressure groups don't",
                                "C": "Pressure groups make laws while parties don't",
                                "D": "Both contest elections equally"
                            },
                            correctAnswer: "B",
                            explanation: "Political parties contest elections to win power and form government, while pressure groups only seek to influence policy without contesting elections."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 15: THE CIVIL SERVICE
    // ============================================================
    "The Civil Service:": {
        subject: "Government",
        topic: "The Civil Service:",
        introduction: {
            title: "The Civil Service",
            description: "This topic focuses on the permanent bureaucracy that supports government operations and implements policies. The civil service ensures continuity of administration regardless of changes in political leadership.",
            jambInfo: "JAMB questions frequently ask you to define the civil service, state its characteristics, list its functions, and evaluate its problems in Nigeria."
        },
        subtopics: [
            {
                name: "Definition and Characteristics",
                objectives: [
                    {
                        title: "Understand the civil service and its characteristics",
                        explanation: `<p>The <strong>civil service</strong> is the permanent body of professional, non-partisan, salaried public officials employed by the government to assist in the formulation, implementation, and administration of public policies.</p>

<div class="key-points">
    <h4>Key Distinctions:</h4>
    <ul>
        <li><strong>Civil Service vs Public Service:</strong> Civil service is the core bureaucracy (ministries); public service is broader (includes parastatals, police, teachers)</li>
        <li><strong>Civil Servants vs Political Appointees:</strong> Civil servants are permanent/career; political appointees (ministers) are temporary</li>
    </ul>
</div>

<div class="table-container">
    <h4>Characteristics of the Civil Service:</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Characteristic</th><th>Explanation</th></tr>
        <tr><td>1</td><td><strong>Permanence</strong></td><td>Remain in office regardless of government changes</td></tr>
        <tr><td>2</td><td><strong>Anonymity</strong></td><td>Act in the name of ministers; don't take personal credit/blame</td></tr>
        <tr><td>3</td><td><strong>Neutrality</strong></td><td>Serve any government loyally without political bias</td></tr>
        <tr><td>4</td><td><strong>Merit-based</strong></td><td>Recruitment and promotion based on exams and performance</td></tr>
        <tr><td>5</td><td><strong>Hierarchy</strong></td><td>Clear chain of command (Permanent Secretary at top)</td></tr>
        <tr><td>6</td><td><strong>Security of Tenure</strong></td><td>Protected from arbitrary dismissal</td></tr>
        <tr><td>7</td><td><strong>Confidentiality</strong></td><td>Oath of secrecy; cannot disclose official information</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The civil service is best defined as:",
                            options: {
                                "A": "Temporary political appointees of the government",
                                "B": "The permanent, professional body that implements policies",
                                "C": "Elected members of the legislature",
                                "D": "Military officers in government"
                            },
                            correctAnswer: "B",
                            explanation: "The civil service is the permanent, professional body of officials who implement government policies and ensure administrative continuity."
                        }
                    }
                ]
            },
            {
                name: "Functions of the Civil Service",
                objectives: [
                    {
                        title: "Understand the functions of the civil service",
                        explanation: `<p>The civil service performs vital functions that keep government running smoothly.</p>

<div class="table-container">
    <h4>Functions of the Civil Service:</h4>
    <table class="styled-table">
        <tr><th>#</th><th>Function</th><th>Description</th></tr>
        <tr><td>1</td><td><strong>Policy Advice</strong></td><td>Provide expert, objective advice to ministers on policy options</td></tr>
        <tr><td>2</td><td><strong>Policy Implementation</strong></td><td>Translate laws and policies into action</td></tr>
        <tr><td>3</td><td><strong>Administration</strong></td><td>Day-to-day running of ministries and departments</td></tr>
        <tr><td>4</td><td><strong>Record Keeping</strong></td><td>Maintain official records and statistics (institutional memory)</td></tr>
        <tr><td>5</td><td><strong>Service Delivery</strong></td><td>Provide public services (education, health support)</td></tr>
        <tr><td>6</td><td><strong>Revenue Collection</strong></td><td>Support tax administration and financial management</td></tr>
        <tr><td>7</td><td><strong>Continuity</strong></td><td>Ensure government functions during political transitions</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Significance in Governance:</h4>
    <ul>
        <li>Ensures continuity (politicians come and go)</li>
        <li>Provides expertise (career professionals)</li>
        <li>Promotes efficiency and rule-based administration</li>
        <li>Maintains institutional memory</li>
        <li>Acts as stabilizing force in fragile democracies</li>
    </ul>
</div>`,
                        question: {
                            text: "A major function of the civil service in governance is to:",
                            options: {
                                "A": "Make laws",
                                "B": "Provide continuity and implement government policies",
                                "C": "Conduct elections",
                                "D": "Appoint political leaders"
                            },
                            correctAnswer: "B",
                            explanation: "The civil service provides continuity and implements government policies. Law-making is the legislature's function, and elections are conducted by INEC."
                        }
                    }
                ]
            },
            {
                name: "Structure and Control",
                objectives: [
                    {
                        title: "Understand the structure and control of the civil service",
                        explanation: `<p>The Nigerian civil service has a hierarchical structure with various control mechanisms.</p>

<div class="key-points">
    <h4>Structure (Federal Level):</h4>
    <ul>
        <li><strong>Head of Civil Service of the Federation (HCSF):</strong> Administrative head</li>
        <li><strong>Ministries:</strong> Over 40 (Finance, Education, Health, etc.)</li>
        <li><strong>Permanent Secretaries:</strong> Administrative heads of ministries</li>
        <li><strong>Directors:</strong> Head various departments</li>
        <li><strong>Grade Levels:</strong> From GL 01 (entry) to GL 17 (top directors)</li>
    </ul>
</div>

<div class="table-container">
    <h4>Control Mechanisms:</h4>
    <table class="styled-table">
        <tr><th>Type</th><th>Description</th></tr>
        <tr><td><strong>Political Control</strong></td><td>Ministers (political heads) direct policy</td></tr>
        <tr><td><strong>Administrative Control</strong></td><td>Permanent Secretaries, HCSF supervise</td></tr>
        <tr><td><strong>Financial Control</strong></td><td>Budget approval, audits by Auditor-General</td></tr>
        <tr><td><strong>Disciplinary Control</strong></td><td>Public Service Commission handles discipline</td></tr>
        <tr><td><strong>Judicial Control</strong></td><td>Courts can review unlawful actions</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The administrative head of a federal ministry in Nigeria is the:",
                            options: {
                                "A": "Minister",
                                "B": "Permanent Secretary",
                                "C": "Director General",
                                "D": "President"
                            },
                            correctAnswer: "B",
                            explanation: "The Permanent Secretary is the administrative head of a ministry. The Minister is the political head who provides policy direction."
                        }
                    }
                ]
            },
            {
                name: "Problems of the Civil Service",
                objectives: [
                    {
                        title: "Understand the problems facing the Nigerian civil service",
                        explanation: `<p>The Nigerian civil service faces several challenges that affect its effectiveness.</p>

<div class="table-container">
    <h4>Major Problems:</h4>
    <table class="styled-table">
        <tr><th>Problem</th><th>Description</th></tr>
        <tr><td><strong>Politicization</strong></td><td>Appointments influenced by "federal character," party loyalty rather than merit</td></tr>
        <tr><td><strong>Corruption</strong></td><td>Bribery, ghost workers, embezzlement</td></tr>
        <tr><td><strong>Red-tapism</strong></td><td>Excessive bureaucracy, slow service delivery</td></tr>
        <tr><td><strong>Poor Motivation</strong></td><td>Low salaries, poor conditions, delayed promotions</td></tr>
        <tr><td><strong>Overstaffing</strong></td><td>Bloated lower grades; shortage of skilled professionals</td></tr>
        <tr><td><strong>Ghost Workers</strong></td><td>Payment to non-existent staff (billions lost)</td></tr>
        <tr><td><strong>Lack of Training</strong></td><td>Outdated skills in the digital age</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Reforms and Solutions:</h4>
    <ul>
        <li><strong>Udoji Commission (1972-74):</strong> Salary increases, efficiency reforms</li>
        <li><strong>1988 Reforms:</strong> Presidential model, decentralization</li>
        <li><strong>IPPIS:</strong> Integrated Payroll system to curb ghost workers</li>
        <li><strong>Oronsaye Report (2012):</strong> Recommendations to merge agencies, reduce waste</li>
        <li><strong>Digitalization:</strong> Ongoing efforts to modernize</li>
    </ul>
</div>`,
                        question: {
                            text: "One significant problem facing the Nigerian civil service is:",
                            options: {
                                "A": "Complete absence of bureaucracy",
                                "B": "Politicization, corruption, and red-tapism",
                                "C": "Over-motivation of workers",
                                "D": "Lack of any hierarchy"
                            },
                            correctAnswer: "B",
                            explanation: "The Nigerian civil service suffers from politicization (appointments based on federal character rather than merit), corruption, and red-tapism (excessive bureaucracy)."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART II - TOPIC 10: PUBLIC CORPORATIONS AND PARASTATALS
    // ============================================================
    "Public Corporations and Parastatals:": {
        subject: "Government",
        topic: "Public Corporations and Parastatals:",
        introduction: {
            title: "Public Corporations and Parastatals",
            description: "This topic examines government-owned enterprises created to provide essential public services, promote economic development, and achieve socio-economic objectives. Nigeria has a long history of state involvement in the economy through these entities, followed by major policy shifts (privatization, commercialization) since the 1980s-1990s.",
            jambInfo: "JAMB usually asks 2-4 questions on public corporations, focusing on definition, types, problems, and privatization/commercialization."
        },
        subtopics: [
            {
                name: "Definition, Types and Functions of Public Corporations",
                objectives: [
                    {
                        title: "Define and classify public corporations",
                        explanation: `<p><strong>Public corporations</strong> (also called statutory corporations or state enterprises) are government-owned organizations established by a special Act of Parliament (or decree during military rule) to carry out commercial or quasi-commercial activities on behalf of the state.</p>

<div class="key-points">
    <h4>Key Characteristics of Public Corporations:</h4>
    <ul>
        <li><strong>Government ownership:</strong> Wholly or majority shares owned by government</li>
        <li><strong>Created by statute:</strong> Established by Act or Decree</li>
        <li><strong>Semi-autonomous:</strong> Separate legal personality from government</li>
        <li><strong>Commercial orientation:</strong> Generate revenue or provide social services</li>
        <li><strong>Board of directors:</strong> Appointed by government</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Types of Public Corporations:</h4>
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-chart-line"></i>
            <p><strong>Commercial/Profit-oriented</strong></p>
            <p>NNPC, NPA, Nigerian Railway</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-broadcast-tower"></i>
            <p><strong>Service-oriented</strong></p>
            <p>NTA, FRCN, former NITEL</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-balance-scale"></i>
            <p><strong>Regulatory</strong></p>
            <p>CBN, SEC, NCC, NAFDAC</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-flask"></i>
            <p><strong>Research/Educational</strong></p>
            <p>NIMR, NASENI, Universities</p>
        </div>
    </div>
</div>

<div class="example-box">
    <h4>Difference: Public Corporations vs. Parastatals</h4>
    <p><strong>Public corporation</strong> is a narrower term (commercial entities), while <strong>parastatal</strong> is broader, covering all semi-autonomous government bodies including regulatory agencies and research institutes.</p>
</div>`,
                        question: {
                            text: "Public corporations are primarily established to:",
                            options: {
                                "A": "Regulate private businesses",
                                "B": "Provide essential services and promote economic development",
                                "C": "Conduct elections",
                                "D": "Make laws"
                            },
                            correctAnswer: "B",
                            explanation: "Public corporations are established by government to provide essential public services, promote economic development, and achieve socio-economic objectives that the private sector may be unwilling or unable to provide."
                        }
                    },
                    {
                        title: "Understand purposes and functions of public corporations",
                        explanation: `<p>Public corporations are created to fulfill specific national objectives and perform essential functions in the economy and society.</p>

<div class="key-points">
    <h4>Purposes/Reasons for Establishment:</h4>
    <ul>
        <li><strong>Provide essential services:</strong> Where private sector is unwilling (e.g., rural electrification)</li>
        <li><strong>Promote economic development:</strong> Industrialization and import substitution</li>
        <li><strong>Achieve national self-reliance:</strong> Control strategic sectors (e.g., oil via NNPC)</li>
        <li><strong>Generate revenue:</strong> Earnings for government coffers</li>
        <li><strong>Ensure social equity:</strong> Subsidized services for all citizens</li>
        <li><strong>Control strategic sectors:</strong> Oil, power, transport, telecommunications</li>
    </ul>
</div>

<div class="key-points">
    <h4>Main Functions:</h4>
    <ul>
        <li><strong>Provide public utilities:</strong> Electricity, water, transport</li>
        <li><strong>Generate revenue and foreign exchange:</strong> (e.g., NNPC oil sales)</li>
        <li><strong>Promote industrialization and employment</strong></li>
        <li><strong>Regulate private sector activities:</strong> (e.g., NAFDAC regulates drugs)</li>
        <li><strong>Undertake research and development</strong></li>
        <li><strong>Implement government policies:</strong> In key sectors</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Historical Context:</h4>
    <p><strong>1970s Peak:</strong> Oil boom led to nationalization of banks, oil companies, and expansion of state enterprises.</p>
    <p><strong>1986 Decline:</strong> Structural Adjustment Programme (SAP) introduced privatization push.</p>
</div>`,
                        question: {
                            text: "Which of the following is NOT a function of public corporations?",
                            options: {
                                "A": "Provide essential services",
                                "B": "Generate revenue for government",
                                "C": "Make laws for the country",
                                "D": "Regulate private sector activities"
                            },
                            correctAnswer: "C",
                            explanation: "Making laws is a function of the legislature, not public corporations. Public corporations provide services, generate revenue, and regulate specific sectors."
                        }
                    }
                ]
            },
            {
                name: "Finance, Control and Problems",
                objectives: [
                    {
                        title: "Identify sources of finance and control mechanisms",
                        explanation: `<p>Public corporations require funding to operate and are subject to various control mechanisms to ensure accountability.</p>

<div class="key-points">
    <h4>Sources of Finance:</h4>
    <ul>
        <li><strong>Government subventions/grants:</strong> Regular budget allocations</li>
        <li><strong>Loans:</strong> From government or commercial banks</li>
        <li><strong>Internally generated revenue:</strong> Sales, fees, charges</li>
        <li><strong>Foreign loans/grants:</strong> International financial institutions</li>
        <li><strong>Equity participation:</strong> Government-held shares</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Control Mechanisms:</h4>
    <table class="comparison-table">
        <tr><th>Control Type</th><th>Description</th></tr>
        <tr><td><strong>Ministerial Control</strong></td><td>Supervising minister gives policy direction</td></tr>
        <tr><td><strong>Board of Directors</strong></td><td>Government-appointed board oversees management</td></tr>
        <tr><td><strong>Legislative Control</strong></td><td>National Assembly approves budgets, conducts probes</td></tr>
        <tr><td><strong>Judicial Control</strong></td><td>Courts review ultra vires (beyond power) actions</td></tr>
        <tr><td><strong>Audit/Financial Control</strong></td><td>Auditor-General audits accounts</td></tr>
        <tr><td><strong>Anti-corruption agencies</strong></td><td>EFCC, PCC investigate maladministration</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The supervising minister of a public corporation exercises:",
                            options: {
                                "A": "Judicial control",
                                "B": "Ministerial/political control",
                                "C": "Legislative control",
                                "D": "Financial audit"
                            },
                            correctAnswer: "B",
                            explanation: "The supervising minister exercises ministerial or political control over a public corporation by giving policy direction and general oversight."
                        }
                    },
                    {
                        title: "Analyze major problems of public corporations",
                        explanation: `<p>Nigerian public corporations have faced numerous challenges that have affected their efficiency and effectiveness.</p>

<div class="warning-box">
    <h4>Major Problems (JAMB Favorites):</h4>
</div>

<div class="visual-section">
    <table class="comparison-table">
        <tr><th>Problem</th><th>Description</th></tr>
        <tr><td><strong>Political Interference</strong></td><td>Ministers appoint cronies; boards become political</td></tr>
        <tr><td><strong>Corruption & Mismanagement</strong></td><td>Embezzlement, inflated contracts</td></tr>
        <tr><td><strong>Inefficiency/Red-tapism</strong></td><td>Slow decision-making, excessive bureaucracy</td></tr>
        <tr><td><strong>Financial Dependence</strong></td><td>Heavy reliance on government subventions</td></tr>
        <tr><td><strong>Poor Performance/Losses</strong></td><td>Many run at a loss (e.g., former NEPA, NRC)</td></tr>
        <tr><td><strong>Overstaffing/Ghost Workers</strong></td><td>Bloated workforce, non-existent staff on payroll</td></tr>
        <tr><td><strong>Lack of Autonomy</strong></td><td>Excessive ministerial control</td></tr>
        <tr><td><strong>Technological Backwardness</strong></td><td>Outdated equipment and systems</td></tr>
        <tr><td><strong>Monopoly Abuse</strong></td><td>No competition leads to poor service</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Examples:</h4>
    <ul>
        <li><strong>NNPC:</strong> Oil revenue but allegations of opacity and corruption</li>
        <li><strong>Former PHCN:</strong> Chronic power failures led to privatization</li>
        <li><strong>Ajaokuta Steel:</strong> Billions spent, still not operational</li>
    </ul>
</div>

<div class="key-points">
    <h4>JAMB Memory Trick - Problems:</h4>
    <p><strong>P-I-C-L-M</strong>: Political interference – Inefficiency – Corruption – Low morale – Mismanagement</p>
</div>`,
                        question: {
                            text: "A major problem of public corporations in Nigeria is:",
                            options: {
                                "A": "Complete absence of government control",
                                "B": "Political interference, corruption, and inefficiency",
                                "C": "Over-privatization",
                                "D": "Lack of any commercial activity"
                            },
                            correctAnswer: "B",
                            explanation: "Nigerian public corporations suffer from political interference (appointments based on politics rather than merit), widespread corruption, and inefficiency due to poor management."
                        }
                    }
                ]
            },
            {
                name: "Privatization, Commercialization and Deregulation",
                objectives: [
                    {
                        title: "Define and differentiate privatization, commercialization, and deregulation",
                        explanation: `<p>These are economic reform strategies adopted to address the problems of public corporations.</p>

<div class="visual-section">
    <table class="comparison-table">
        <tr><th>Reform Type</th><th>Definition</th><th>Key Feature</th></tr>
        <tr><td><strong>Privatization</strong></td><td>Transfer of ownership from government to private individuals/companies</td><td>Government sells shares</td></tr>
        <tr><td><strong>Commercialization</strong></td><td>Operating on profit principles while retaining government ownership</td><td>Self-financing, no subsidies</td></tr>
        <tr><td><strong>Deregulation</strong></td><td>Removal of government rules to allow more private participation</td><td>Open up sector to competition</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Privatization Methods:</h4>
    <ul>
        <li><strong>Public offer:</strong> Shares sold to the public</li>
        <li><strong>Core investor sale:</strong> Strategic buyer takes majority stake</li>
        <li><strong>Concession:</strong> Private operation under government ownership</li>
        <li><strong>Management contract:</strong> Private management of public assets</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigerian Context:</h4>
    <p><strong>1986:</strong> Started with Structural Adjustment Programme (SAP)</p>
    <p><strong>Bureau of Public Enterprises (BPE):</strong> Oversees privatization</p>
    <p><strong>Success story:</strong> Telecom privatization (GSM revolution)</p>
    <p><strong>Mixed results:</strong> Power sector privatization</p>
</div>`,
                        question: {
                            text: "The process of making public enterprises operate strictly on profit principles while retaining government ownership is called:",
                            options: {
                                "A": "Privatization",
                                "B": "Commercialization",
                                "C": "Deregulation",
                                "D": "Nationalization"
                            },
                            correctAnswer: "B",
                            explanation: "Commercialization involves reforming public enterprises to operate on commercial (profit-oriented) principles while the government retains ownership. Privatization would involve selling the enterprise."
                        }
                    },
                    {
                        title: "Evaluate merits and demerits of reforms",
                        explanation: `<p>Each reform type has advantages and disadvantages that must be considered.</p>

<div class="visual-section">
    <h4>Privatization:</h4>
    <table class="comparison-table">
        <tr><th>Merits</th><th>Demerits</th></tr>
        <tr><td>Improved efficiency and service</td><td>Job losses (retrenchment)</td></tr>
        <tr><td>Reduces government expenditure</td><td>Higher prices (no subsidies)</td></tr>
        <tr><td>Raises revenue from sales</td><td>Private monopoly possible</td></tr>
        <tr><td>Attracts foreign investment</td><td>Loss of strategic control</td></tr>
        <tr><td>Reduces corruption opportunities</td><td>Corruption in sale process</td></tr>
    </table>
</div>

<div class="visual-section">
    <h4>Commercialization:</h4>
    <table class="comparison-table">
        <tr><th>Merits</th><th>Demerits</th></tr>
        <tr><td>Self-financing (less treasury burden)</td><td>May neglect social objectives</td></tr>
        <tr><td>Professional management</td><td>Still vulnerable to interference</td></tr>
        <tr><td>Improved accountability</td><td>Price increases for consumers</td></tr>
    </table>
</div>

<div class="visual-section">
    <h4>Deregulation:</h4>
    <table class="comparison-table">
        <tr><th>Merits</th><th>Demerits</th></tr>
        <tr><td>Competition lowers prices</td><td>Market failure possible</td></tr>
        <tr><td>Innovation and consumer choice</td><td>Poor service in rural areas</td></tr>
        <tr><td>Attracts private investment</td><td>Exploitation without regulation</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>JAMB Memory Trick - Reforms:</h4>
    <p><strong>P-C-D</strong>: Privatization (sell) – Commercialization (profit focus) – Deregulation (remove controls)</p>
</div>`,
                        question: {
                            text: "Which of the following is a merit of privatization?",
                            options: {
                                "A": "Guaranteed job security for all workers",
                                "B": "Improved efficiency and service delivery",
                                "C": "Complete elimination of competition",
                                "D": "Increased government subventions"
                            },
                            correctAnswer: "B",
                            explanation: "Privatization often leads to improved efficiency and better service delivery as private owners have profit incentive to run the business well. However, it can also lead to job losses."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART III - TOPIC 1: FOREIGN POLICY
    // ============================================================
    "Foreign Policy:": {
        subject: "Government",
        topic: "Foreign Policy:",
        introduction: {
            title: "Foreign Policy",
            description: "Foreign policy refers to the strategies, principles, and actions adopted by a sovereign state in its relations with other states and international organizations. This topic covers definition, purposes, determinants, and how foreign policy is formulated and implemented, with special focus on Nigeria.",
            jambInfo: "JAMB frequently tests foreign policy definitions, determinants (internal/external factors), and Nigeria's foreign policy principles."
        },
        subtopics: [
            {
                name: "Definition and Purpose of Foreign Policy",
                objectives: [
                    {
                        title: "Define foreign policy and its key elements",
                        explanation: `<p><strong>Foreign policy</strong> refers to the set of strategies, principles, objectives, decisions, and actions adopted by a sovereign state in its relations with other states, international organizations, and non-state actors in the international system.</p>

<div class="key-points">
    <h4>Key Elements:</h4>
    <ul>
        <li><strong>Strategies and actions:</strong> Concrete steps like diplomacy, treaties, military action</li>
        <li><strong>Sovereign state:</strong> Only independent countries have foreign policy</li>
        <li><strong>Other actors:</strong> States, international organizations (UN, AU), non-state actors (NGOs, MNCs)</li>
        <li><strong>National interest:</strong> Core driver – security, economy, prestige</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Foreign vs. Domestic Policy:</h4>
    <table class="comparison-table">
        <tr><th>Foreign Policy</th><th>Domestic Policy</th></tr>
        <tr><td>External relations with other countries</td><td>Internal affairs within borders</td></tr>
        <tr><td>Trade agreements, defense pacts</td><td>Economy, education, healthcare</td></tr>
        <tr><td>Peacekeeping, diplomacy</td><td>Security, infrastructure</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigeria's Foreign Policy Slogan:</h4>
    <p><strong>"Africa as the centrepiece"</strong> + Non-alignment + Good neighbourliness</p>
</div>`,
                        question: {
                            text: "Foreign policy is primarily concerned with:",
                            options: {
                                "A": "Internal economic planning",
                                "B": "A country's relations with other states and international actors",
                                "C": "Local government administration",
                                "D": "Judicial interpretation of laws"
                            },
                            correctAnswer: "B",
                            explanation: "Foreign policy deals with a country's external relations with other sovereign states, international organizations, and non-state actors in the international system."
                        }
                    },
                    {
                        title: "Identify the purposes/objectives of foreign policy",
                        explanation: `<p>Foreign policy aims to protect and advance the national interest of a state in the international arena.</p>

<div class="key-points">
    <h4>Universal Objectives:</h4>
    <ul>
        <li><strong>Protection of sovereignty:</strong> Territorial integrity and independence</li>
        <li><strong>National security:</strong> Defence against external threats</li>
        <li><strong>Economic prosperity:</strong> Trade, investment, foreign aid</li>
        <li><strong>International peace:</strong> Conflict prevention and resolution</li>
        <li><strong>National prestige:</strong> Enhance influence and respect</li>
        <li><strong>Citizen protection:</strong> Welfare of diaspora</li>
    </ul>
</div>

<div class="key-points">
    <h4>Nigeria-Specific Objectives:</h4>
    <ul>
        <li><strong>Africa as centrepiece:</strong> Liberation, unity, conflict resolution in Africa</li>
        <li><strong>Non-alignment:</strong> Avoiding Cold War blocs (in theory)</li>
        <li><strong>Promotion of African unity:</strong> Support for OAU → AU</li>
        <li><strong>Peacekeeping:</strong> ECOMOG, UN missions</li>
        <li><strong>Economic diplomacy:</strong> Attract FDI, debt relief</li>
        <li><strong>Good neighbourliness:</strong> Peaceful borders</li>
    </ul>
</div>`,
                        question: {
                            text: "The centrepiece of Nigeria's foreign policy since independence has been:",
                            options: {
                                "A": "Europe and America",
                                "B": "Africa and African unity",
                                "C": "Asia and China",
                                "D": "The Middle East"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria's foreign policy has consistently placed Africa at its centre, focusing on African liberation, unity, peacekeeping, and regional cooperation."
                        }
                    }
                ]
            },
            {
                name: "Determinants of Foreign Policy",
                objectives: [
                    {
                        title: "Explain internal/domestic determinants of foreign policy",
                        explanation: `<p>Foreign policy is shaped by various internal factors within the state.</p>

<div class="key-points">
    <h4>Internal/Domestic Determinants:</h4>
    <ul>
        <li><strong>Geography/Size:</strong> Large territory and population → regional power aspirations</li>
        <li><strong>Natural Resources:</strong> Oil dependence → OPEC membership, energy diplomacy</li>
        <li><strong>Historical Experience:</strong> Colonial rule → anti-imperial stance</li>
        <li><strong>Political System/Ideology:</strong> Democracy vs military → shifts in foreign policy style</li>
        <li><strong>Economic Needs:</strong> Poverty, debt → aid-seeking, investment diplomacy</li>
        <li><strong>Ethnic/Religious Composition:</strong> Diversity → careful balancing in relations</li>
        <li><strong>Public Opinion/Pressure Groups:</strong> Domestic pressure shapes policy</li>
        <li><strong>Leadership Personality:</strong> Personal style affects approach (e.g., Obasanjo's Afrocentrism)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Nigeria's Internal Factors:</h4>
    <p><strong>Oil economy</strong> → OPEC membership, energy focus</p>
    <p><strong>Ethnic diversity</strong> → Careful relations with neighbors</p>
    <p><strong>Military history</strong> → Peacekeeping expertise</p>
</div>

<div class="key-points">
    <h4>Memory Trick - Internal Determinants:</h4>
    <p><strong>G-H-P-E-L-R</strong>: Geography – History – Political system – Economy – Leadership – Religion/Ethnicity</p>
</div>`,
                        question: {
                            text: "Which of the following is NOT an internal determinant of foreign policy?",
                            options: {
                                "A": "Geography and natural resources",
                                "B": "Leadership personality",
                                "C": "Global power structure",
                                "D": "Ethnic composition"
                            },
                            correctAnswer: "C",
                            explanation: "Global power structure is an EXTERNAL determinant of foreign policy. Internal determinants include geography, resources, leadership, ethnic composition, and political system."
                        }
                    },
                    {
                        title: "Explain external/international determinants of foreign policy",
                        explanation: `<p>External factors in the international environment also shape a country's foreign policy choices.</p>

<div class="key-points">
    <h4>External/International Determinants:</h4>
    <ul>
        <li><strong>Global Power Structure:</strong> Cold War → non-alignment; post-Cold War → US influence</li>
        <li><strong>Bilateral Relations:</strong> UK (colonial ties), US (aid), China (investment)</li>
        <li><strong>Regional Dynamics:</strong> West African neighbors → ECOWAS leadership</li>
        <li><strong>International Organizations:</strong> UN, AU, Commonwealth, OPEC obligations</li>
        <li><strong>Global Events/Crises:</strong> Oil crises, terrorism, pandemics, climate change</li>
        <li><strong>International Law/Norms:</strong> Human rights, WTO rules constrain behavior</li>
    </ul>
</div>

<div class="visual-section">
    <table class="comparison-table">
        <tr><th>Internal Determinants</th><th>External Determinants</th></tr>
        <tr><td>Geography, size, resources</td><td>Global power structure</td></tr>
        <tr><td>Historical experience</td><td>Bilateral relations</td></tr>
        <tr><td>Political system</td><td>Regional dynamics</td></tr>
        <tr><td>Economic needs</td><td>International organizations</td></tr>
        <tr><td>Leadership style</td><td>Global events and crises</td></tr>
    </table>
</div>`,
                        question: {
                            text: "International organizations like the UN and AU are examples of:",
                            options: {
                                "A": "Internal determinants of foreign policy",
                                "B": "External determinants of foreign policy",
                                "C": "Domestic economic factors",
                                "D": "Local government influences"
                            },
                            correctAnswer: "B",
                            explanation: "International organizations are external determinants that shape foreign policy through membership obligations, treaties, and collective decision-making processes."
                        }
                    }
                ]
            },
            {
                name: "Formulation and Implementation",
                objectives: [
                    {
                        title: "Identify who formulates foreign policy in Nigeria",
                        explanation: `<p>Foreign policy formulation involves key actors who make policy decisions.</p>

<div class="key-points">
    <h4>Formulation (Who Makes Policy?):</h4>
    <ul>
        <li><strong>Principal Actor - President:</strong> Head of State and Chief Diplomat (1999 Constitution, Section 5)</li>
        <li><strong>Key Advisers:</strong>
            <ul>
                <li>Minister of Foreign Affairs</li>
                <li>National Security Adviser</li>
                <li>Chief of Defence Staff</li>
                <li>Intelligence agencies (DSS, NIA)</li>
            </ul>
        </li>
        <li><strong>Supporting Institutions:</strong>
            <ul>
                <li>Ministry of Foreign Affairs (technical input, drafting)</li>
                <li>National Assembly (ratifies treaties - Section 12)</li>
                <li>Federal Executive Council (approves major decisions)</li>
            </ul>
        </li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>The <strong>President</strong> is the principal formulator of foreign policy, while the <strong>Ministry of Foreign Affairs</strong> provides technical support and implements policy.</p>
</div>`,
                        question: {
                            text: "In Nigeria, the principal formulator of foreign policy is:",
                            options: {
                                "A": "The Minister of Foreign Affairs",
                                "B": "The President",
                                "C": "The National Assembly",
                                "D": "The Chief of Defence Staff"
                            },
                            correctAnswer: "B",
                            explanation: "The President is the principal formulator of foreign policy as the Head of State and Chief Diplomat. The Minister of Foreign Affairs advises and helps implement policy."
                        }
                    },
                    {
                        title: "Identify who implements foreign policy",
                        explanation: `<p>Foreign policy implementation is the execution of policy decisions through diplomacy and other means.</p>

<div class="key-points">
    <h4>Implementation (Who Carries It Out?):</h4>
    <ul>
        <li><strong>Primary Organ:</strong> Ministry of Foreign Affairs (career diplomats)</li>
        <li><strong>Key Actors:</strong>
            <ul>
                <li>Ambassadors and High Commissioners (in missions abroad)</li>
                <li>Consular officers</li>
                <li>Permanent missions (UN, AU, ECOWAS)</li>
            </ul>
        </li>
        <li><strong>Other Agencies:</strong>
            <ul>
                <li>Directorate of Technical Aid Corps (TAC)</li>
                <li>Nigerian Institute of International Affairs (NIIA)</li>
                <li>Nigerians in Diaspora Commission (NIDCOM)</li>
            </ul>
        </li>
    </ul>
</div>

<div class="visual-section">
    <h4>Foreign Policy Cycle:</h4>
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-lightbulb"></i>
            <p><strong>Step 1: Formulation</strong></p>
            <p>President + Advisers</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-check-circle"></i>
            <p><strong>Step 2: Approval</strong></p>
            <p>FEC + National Assembly (treaties)</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-globe"></i>
            <p><strong>Step 3: Implementation</strong></p>
            <p>Ministry of Foreign Affairs</p>
        </div>
    </div>
</div>`,
                        question: {
                            text: "The main organ responsible for implementing Nigeria's foreign policy is:",
                            options: {
                                "A": "The National Intelligence Agency",
                                "B": "The Ministry of Foreign Affairs",
                                "C": "The Federal Executive Council",
                                "D": "The Nigerian Army"
                            },
                            correctAnswer: "B",
                            explanation: "The Ministry of Foreign Affairs is the primary organ responsible for implementing Nigeria's foreign policy through embassies, high commissions, and diplomatic missions worldwide."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART II - TOPIC 1: PRE-COLONIAL POLITIES
    // ============================================================
    "Pre - colonial Polities:": {
        subject: "Government",
        topic: "Pre - colonial Polities:",
        introduction: {
            title: "Pre-colonial Political Systems in Nigeria",
            description: "This topic examines the political systems that existed in Nigeria before colonialism: Pre-jihad Hausa states, Sokoto Emirate, Tiv, Igbo, and Yoruba systems. Understanding these systems explains Nigeria's ethnic diversity, federal character, and governance traditions.",
            jambInfo: "JAMB tests structural organization, functions, effectiveness, and comparison of these systems. Expect 2-3 questions."
        },
        subtopics: [
            {
                name: "Centralized Systems: Hausa and Yoruba",
                objectives: [
                    {
                        title: "Describe the Pre-jihad Hausa political system",
                        explanation: `<p>Before Usman dan Fodio's jihad (1804-1808), the Hausa states were independent city-states with centralized monarchical systems.</p>

<div class="key-points">
    <h4>Structural Organization:</h4>
    <ul>
        <li><strong>Centralized kingship:</strong> Each state had a king (Sarki) at the top</li>
        <li><strong>Council of kingmakers/nobles:</strong> Limited the king's power</li>
        <li><strong>Administrative divisions:</strong> Districts headed by Hakimi</li>
        <li><strong>Hierarchy:</strong> Sarki → Galadima/Madaki → District heads → Village heads → Commoners</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Functions of Political Institutions:</h4>
    <table class="comparison-table">
        <tr><th>Institution</th><th>Functions</th></tr>
        <tr><td><strong>Sarki (King)</strong></td><td>Head of state, commander-in-chief, chief judge, tax collector</td></tr>
        <tr><td><strong>Kingmakers</strong></td><td>Advised king, checked abuse, selected successor</td></tr>
        <tr><td><strong>Alkali Courts</strong></td><td>Administered Islamic law (Sharia)</td></tr>
        <tr><td><strong>Village Heads</strong></td><td>Local administration, tax collection</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Effectiveness:</h4>
    <p><strong>Strengths:</strong> Highly centralized and stable; efficient taxation and trade (trans-Saharan)</p>
    <p><strong>Weaknesses:</strong> Internal rivalries; frequent wars between states</p>
</div>`,
                        question: {
                            text: "In the pre-jihad Hausa political system, the king was called:",
                            options: {
                                "A": "Oba",
                                "B": "Sarki",
                                "C": "Obi",
                                "D": "Sultan"
                            },
                            correctAnswer: "B",
                            explanation: "The king in the pre-jihad Hausa system was called Sarki. He was the central authority figure with powers over administration, military, and justice."
                        }
                    },
                    {
                        title: "Describe the Yoruba political system",
                        explanation: `<p>The Yoruba (Southwest) had centralized constitutional monarchies with checks and balances on the king's power.</p>

<div class="key-points">
    <h4>Structural Organization:</h4>
    <ul>
        <li><strong>Oba (King):</strong> Hereditary ruler (e.g., Ooni of Ife, Alaafin of Oyo)</li>
        <li><strong>Council of chiefs:</strong> Oyomesi in Oyo, Ogboni in others - advised and checked king</li>
        <li><strong>Checks on king:</strong> Oyomesi could compel suicide of bad king (empty calabash ritual)</li>
        <li><strong>Administrative hierarchy:</strong> Palace chiefs → Provincial governors → Village heads (Bale)</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Functions of Institutions:</h4>
    <table class="comparison-table">
        <tr><th>Institution</th><th>Functions</th></tr>
        <tr><td><strong>Oba</strong></td><td>Spiritual leader, judge, administrator, commander</td></tr>
        <tr><td><strong>Oyomesi/Ogboni</strong></td><td>Advised, checked abuse, selected king</td></tr>
        <tr><td><strong>Bale</strong></td><td>Local governance at village level</td></tr>
        <tr><td><strong>Age-grades</strong></td><td>Labour and defence</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>The Yoruba system had <strong>checks and balances</strong> - the Oyomesi could remove a tyrannical king through the "empty calabash" ritual.</p>
</div>`,
                        question: {
                            text: "In the Oyo Yoruba system, the Oyomesi council served mainly to:",
                            options: {
                                "A": "Collect taxes only",
                                "B": "Check the power of the Alaafin and depose bad rulers",
                                "C": "Lead military campaigns",
                                "D": "Administer Islamic law"
                            },
                            correctAnswer: "B",
                            explanation: "The Oyomesi council in Oyo served as a check on the Alaafin's power and could even compel a tyrannical king to commit suicide through the 'empty calabash' ritual."
                        }
                    }
                ]
            },
            {
                name: "Decentralized Systems: Igbo and Tiv",
                objectives: [
                    {
                        title: "Describe the Igbo political system",
                        explanation: `<p>The Igbo (Southeast) practised a republican/democratic/acephalous (headless) village democracy system with no centralized authority.</p>

<div class="key-points">
    <h4>Structural Organization:</h4>
    <ul>
        <li><strong>Village assembly (Ama-ala):</strong> All adult males participated in decision-making</li>
        <li><strong>Council of elders (Ndi Ichie/Ozo title holders):</strong> Advised and led</li>
        <li><strong>Age-grades:</strong> Enforced decisions, defence, community work</li>
        <li><strong>Title societies (Ozo, Ekpe):</strong> Prestige-based leadership</li>
        <li><strong>Decentralized:</strong> Each village autonomous; no paramount ruler</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Functions of Institutions:</h4>
    <table class="comparison-table">
        <tr><th>Institution</th><th>Functions</th></tr>
        <tr><td><strong>Village Assembly</strong></td><td>Made laws, settled disputes, declared war/peace</td></tr>
        <tr><td><strong>Elders/Ozo holders</strong></td><td>Interpreted customs, mediated conflicts</td></tr>
        <tr><td><strong>Age-grades</strong></td><td>Implemented decisions, policing, communal labour</td></tr>
        <tr><td><strong>Women's associations</strong></td><td>Handled women's affairs, moral policing (Umuada)</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Effectiveness:</h4>
    <p><strong>Strengths:</strong> Highly participatory and democratic; effective local governance</p>
    <p><strong>Weaknesses:</strong> Slow decision-making; difficult to unite for large-scale defence</p>
</div>`,
                        question: {
                            text: "The pre-colonial Igbo political system was characterized by:",
                            options: {
                                "A": "Absolute monarchy",
                                "B": "Village democracy and acephalous structure",
                                "C": "Centralized emirate system",
                                "D": "Hereditary paramount chiefs"
                            },
                            correctAnswer: "B",
                            explanation: "The Igbo system was acephalous (headless) with no centralized authority. Decisions were made democratically in village assemblies where adult males participated."
                        }
                    },
                    {
                        title: "Describe the Tiv political system",
                        explanation: `<p>The Tiv (Middle Belt) operated a segmentary lineage/stateless/acephalous system with no centralized king or chief.</p>

<div class="key-points">
    <h4>Structural Organization:</h4>
    <ul>
        <li><strong>Patrilineal clans:</strong> Society organized into segments (ipaven → larger tar)</li>
        <li><strong>Elders' councils:</strong> Age-grade elders and lineage heads made decisions</li>
        <li><strong>No single ruler:</strong> Power diffused among elders and age-sets</li>
        <li><strong>Consensus-based:</strong> Disputes settled through moots (council meetings)</li>
        <li><strong>Age-grade system:</strong> Young men formed defence and labour units</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Functions of Institutions:</h4>
    <table class="comparison-table">
        <tr><th>Institution</th><th>Functions</th></tr>
        <tr><td><strong>Elders/lineage heads</strong></td><td>Resolved disputes, allocated land, performed rituals</td></tr>
        <tr><td><strong>Age-grades</strong></td><td>Defence, communal labour, enforcement of decisions</td></tr>
        <tr><td><strong>Moot/council</strong></td><td>Collective decision-making, conflict resolution</td></tr>
        <tr><td><strong>Religious leaders (Tsav)</strong></td><td>Spiritual guidance</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Effectiveness:</h4>
    <p><strong>Strengths:</strong> Highly democratic and egalitarian; effective conflict resolution through consensus</p>
    <p><strong>Weaknesses:</strong> Difficult to unite against external threats; vulnerable to segmentation</p>
</div>`,
                        question: {
                            text: "The effectiveness of the Tiv segmentary system lay in its:",
                            options: {
                                "A": "Strong centralized kingship",
                                "B": "Consensus-based decision-making and egalitarianism",
                                "C": "Reliance on appointed emirs",
                                "D": "Hereditary succession rules"
                            },
                            correctAnswer: "B",
                            explanation: "The Tiv system was effective because of its consensus-based decision-making through elders' councils and its egalitarian structure where no single person dominated."
                        }
                    }
                ]
            },
            {
                name: "Comparison of Pre-colonial Systems",
                objectives: [
                    {
                        title: "Compare centralized and decentralized systems",
                        explanation: `<p>Pre-colonial Nigerian political systems can be broadly classified as centralized or decentralized.</p>

<div class="visual-section">
    <h4>Comparison Table:</h4>
    <table class="comparison-table">
        <tr><th>Aspect</th><th>Centralized (Hausa, Yoruba)</th><th>Decentralized (Igbo, Tiv)</th></tr>
        <tr><td><strong>Leadership</strong></td><td>Single ruler (Sarki, Oba)</td><td>No paramount ruler</td></tr>
        <tr><td><strong>Decision-making</strong></td><td>Top-down through hierarchy</td><td>Consensus in assemblies</td></tr>
        <tr><td><strong>Structure</strong></td><td>Hierarchical bureaucracy</td><td>Segmentary/lineage-based</td></tr>
        <tr><td><strong>Checks on power</strong></td><td>Councils (Oyomesi)</td><td>Community participation</td></tr>
        <tr><td><strong>Military</strong></td><td>Standing army</td><td>Age-grade warriors</td></tr>
        <tr><td><strong>Taxation</strong></td><td>Organized tribute system</td><td>Communal contributions</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Strengths and Weaknesses:</h4>
    <ul>
        <li><strong>Centralized:</strong> More efficient but risk of tyranny; better for large-scale coordination</li>
        <li><strong>Decentralized:</strong> More democratic but slower decisions; weak against external threats</li>
    </ul>
</div>

<div class="key-points">
    <h4>JAMB Memory Trick:</h4>
    <p><strong>C-D-C</strong>: Centralized (Hausa/Emirate/Yoruba) – Decentralized/Democratic (Tiv/Igbo)</p>
</div>

<div class="example-box">
    <h4>Legacy in Modern Nigeria:</h4>
    <p>Nigeria's diversity explains federalism, ethnic associations, and ongoing debates about restructuring.</p>
</div>`,
                        question: {
                            text: "Which pre-colonial system had the strongest checks on the ruler through a council that could force suicide?",
                            options: {
                                "A": "Pre-jihad Hausa",
                                "B": "Sokoto Emirate",
                                "C": "Yoruba (Oyo)",
                                "D": "Igbo"
                            },
                            correctAnswer: "C",
                            explanation: "The Yoruba (Oyo) system had the strongest check on the king through the Oyomesi council, which could force a tyrannical Alaafin to commit suicide through the 'empty calabash' ritual."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART II - TOPIC 12: THE MILITARY IN NIGERIAN POLITICS
    // ============================================================
    "The Military in Nigerian Politics:": {
        subject: "Government",
        topic: "The Military in Nigerian Politics:",
        introduction: {
            title: "The Military in Nigerian Politics",
            description: "This topic covers military interventions in Nigeria's governance from 1966-1999, including reasons for coups, structure of military regimes, impacts, and processes of transition to civilian rule. Military rule shaped Nigeria's institutions, economy, and democracy for over 30 years.",
            jambInfo: "JAMB frequently asks about reasons for military intervention, achievements/failures, and transition processes. Expect 2-4 questions."
        },
        subtopics: [
            {
                name: "Factors for Military Intervention",
                objectives: [
                    {
                        title: "Identify reasons for military coups in Nigeria",
                        explanation: `<p>Nigeria experienced six successful military coups between 1966 and 1993. The military cited various justifications each time.</p>

<div class="key-points">
    <h4>Main Factors/Reasons Given by Coup Leaders:</h4>
    <ul>
        <li><strong>Corruption and Mismanagement:</strong> Embezzlement, nepotism by politicians</li>
        <li><strong>Political Instability and Violence:</strong> Rigged elections, political assassinations, ethnic riots</li>
        <li><strong>Ethnic and Regional Conflicts:</strong> North-South tensions, fear of domination</li>
        <li><strong>Economic Mismanagement:</strong> Inflation, unemployment, balance-of-payments crisis</li>
        <li><strong>Electoral Malpractices:</strong> Vote-rigging, intimidation (especially 1983)</li>
        <li><strong>Weak Institutions:</strong> Compromised judiciary, partisan police</li>
        <li><strong>Military Ambition:</strong> Officers saw politicians as incompetent</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Timeline of Major Coups:</h4>
    <table class="comparison-table">
        <tr><th>Date</th><th>Leader</th><th>Stated Reason</th></tr>
        <tr><td>January 15, 1966</td><td>Ironsi</td><td>Corruption, tribalism, election rigging</td></tr>
        <tr><td>July 29, 1966</td><td>Gowon</td><td>Revenge for perceived Igbo domination</td></tr>
        <tr><td>July 29, 1975</td><td>Murtala</td><td>Corruption, inefficiency under Gowon</td></tr>
        <tr><td>December 31, 1983</td><td>Buhari</td><td>Rigged 1983 elections, economic decay</td></tr>
        <tr><td>August 27, 1985</td><td>Babangida</td><td>Inhumanity of Buhari regime</td></tr>
        <tr><td>November 17, 1993</td><td>Abacha</td><td>Annulment crisis after June 12, 1993</td></tr>
    </table>
</div>`,
                        question: {
                            text: "One major reason given for military intervention in Nigeria in 1966 was:",
                            options: {
                                "A": "Too much democracy",
                                "B": "Corruption, election rigging, and political violence",
                                "C": "Excessive economic growth",
                                "D": "Complete absence of ethnic conflict"
                            },
                            correctAnswer: "B",
                            explanation: "The 1966 coup was justified by the military as a response to widespread corruption, rigged elections (1964-65), and political violence in the First Republic."
                        }
                    }
                ]
            },
            {
                name: "Structure and Impact of Military Rule",
                objectives: [
                    {
                        title: "Describe the structure of military regimes",
                        explanation: `<p>Military regimes in Nigeria were highly centralized and hierarchical, with power concentrated in the Head of State.</p>

<div class="key-points">
    <h4>Common Structural Features:</h4>
    <ul>
        <li><strong>Supreme Military Council (SMC)/AFRC:</strong> Highest decision-making body</li>
        <li><strong>Head of State:</strong> Absolute power; combined executive, legislative, judicial roles</li>
        <li><strong>Federal Military Government (FMG):</strong> Replaced civilian federal structure</li>
        <li><strong>Military Governors/Administrators:</strong> Appointed to rule states</li>
        <li><strong>Ministries:</strong> Continued under civil servants but directed by military</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Evolution of Military Structures:</h4>
    <table class="comparison-table">
        <tr><th>Regime</th><th>Key Features</th></tr>
        <tr><td><strong>Ironsi (1966)</strong></td><td>Unified command, unitary decree</td></tr>
        <tr><td><strong>Gowon (1966-75)</strong></td><td>SMC, 12 states created</td></tr>
        <tr><td><strong>Murtala/Obasanjo (1975-79)</strong></td><td>SMC, anti-corruption, 19 states</td></tr>
        <tr><td><strong>Buhari (1983-85)</strong></td><td>AFRC, War Against Indiscipline</td></tr>
        <tr><td><strong>Babangida (1985-93)</strong></td><td>AFRC, structural adjustment, endless transition</td></tr>
        <tr><td><strong>Abacha (1993-98)</strong></td><td>PRC, extreme centralization</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The highest decision-making body during military rule was typically the:",
                            options: {
                                "A": "National Assembly",
                                "B": "Supreme Military Council or Armed Forces Ruling Council",
                                "C": "Federal Executive Council",
                                "D": "State Governors' Forum"
                            },
                            correctAnswer: "B",
                            explanation: "The Supreme Military Council (SMC) or Armed Forces Ruling Council (AFRC) was the highest decision-making body during military rule, chaired by the Head of State."
                        }
                    },
                    {
                        title: "Evaluate the impact of military rule",
                        explanation: `<p>Military rule had both positive and negative impacts on Nigeria's political, economic, and social development.</p>

<div class="visual-section">
    <h4>Political Impact:</h4>
    <table class="comparison-table">
        <tr><th>Positive</th><th>Negative</th></tr>
        <tr><td>Creation of states (3 → 36)</td><td>Suspension of constitution/democracy</td></tr>
        <tr><td>Local government reforms (1976)</td><td>Suppression of press, judiciary, opposition</td></tr>
        <tr><td>Constitutional development (1979)</td><td>Human rights abuses</td></tr>
        <tr><td>Reduced regional dominance</td><td>Militarization of politics (coup culture)</td></tr>
    </table>
</div>

<div class="visual-section">
    <h4>Economic Impact:</h4>
    <table class="comparison-table">
        <tr><th>Positive</th><th>Negative</th></tr>
        <tr><td>Infrastructure development</td><td>Institutionalized corruption</td></tr>
        <tr><td>Indigenization Decree (1972)</td><td>Debt crisis</td></tr>
        <tr><td>SAP liberalization (1986)</td><td>Oil dependency, neglect of agriculture</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Key Achievement:</h4>
    <p>State creation from 3 regions to 36 states reduced the fear of regional domination and strengthened federalism.</p>
</div>`,
                        question: {
                            text: "The creation of 12 states in 1967 under Gowon was a significant:",
                            options: {
                                "A": "Economic achievement",
                                "B": "Political impact of military rule to reduce regional dominance",
                                "C": "Social welfare programme",
                                "D": "Judicial reform"
                            },
                            correctAnswer: "B",
                            explanation: "The creation of states was a major political achievement that reduced the power of the three regions and addressed fears of regional domination in Nigerian politics."
                        }
                    }
                ]
            },
            {
                name: "Military Disengagement and Transition",
                objectives: [
                    {
                        title: "Describe the processes of military disengagement",
                        explanation: `<p>Military regimes (except Abacha's) announced transition programmes to return power to civilians.</p>

<div class="key-points">
    <h4>Common Steps in Disengagement:</h4>
    <ol>
        <li><strong>Announcement:</strong> Setting timeline (usually 2-5 years)</li>
        <li><strong>Constitution Review:</strong> Constituent Assembly or committee</li>
        <li><strong>Political Transition Bodies:</strong> Bureau, conferences</li>
        <li><strong>Party Formation:</strong> Registration of political parties</li>
        <li><strong>Elections:</strong> Local → State → National (step-by-step)</li>
        <li><strong>Handover:</strong> Power transfer to elected president</li>
    </ol>
</div>

<div class="visual-section">
    <h4>Transition Outcomes:</h4>
    <table class="comparison-table">
        <tr><th>Successful</th><th>Failed/Aborted</th></tr>
        <tr><td>1979: Obasanjo → Shagari (Second Republic)</td><td>1993: Babangida annulled June 12 election</td></tr>
        <tr><td>1999: Abubakar → Obasanjo (Fourth Republic)</td><td>1998: Abacha died before handover</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Conditions that Necessitated Withdrawal:</h4>
    <ul>
        <li><strong>Internal pressure:</strong> Economic failure, protests</li>
        <li><strong>External pressure:</strong> Sanctions, debt relief conditions</li>
        <li><strong>Military fatigue:</strong> Factionalism within the military</li>
        <li><strong>Death of leader:</strong> (Abacha 1998)</li>
        <li><strong>Elite consensus:</strong> Agreement that democracy was needed</li>
    </ul>
</div>`,
                        question: {
                            text: "The military regime that annulled the June 12, 1993 election was:",
                            options: {
                                "A": "Gowon",
                                "B": "Buhari",
                                "C": "Babangida",
                                "D": "Abacha"
                            },
                            correctAnswer: "C",
                            explanation: "General Ibrahim Babangida annulled the June 12, 1993 presidential election, widely believed to have been won by MKO Abiola. This triggered a major political crisis."
                        }
                    },
                    {
                        title: "Analyze factors for the 1999 transition",
                        explanation: `<p>The 1999 transition to the Fourth Republic was enabled by specific conditions following Abacha's death.</p>

<div class="key-points">
    <h4>Key Factors for 1999 Transition:</h4>
    <ul>
        <li><strong>Death of Abacha (June 8, 1998):</strong> Removed the obstacle to transition</li>
        <li><strong>General Abubakar's reforms:</strong> Quick transition programme</li>
        <li><strong>International pressure:</strong> Sanctions, isolation during Abacha era</li>
        <li><strong>Domestic pressure:</strong> Pro-democracy movements (NADECO)</li>
        <li><strong>Economic crisis:</strong> Need for international engagement</li>
        <li><strong>Elite consensus:</strong> Agreement across regions for democracy</li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>The death of General Abacha and the reforms of General Abdulsalami Abubakar, combined with domestic and international pressure, enabled the successful 1999 transition.</p>
</div>

<div class="key-points">
    <h4>JAMB Memory Trick - Coups Timeline:</h4>
    <p><strong>1966 Jan</strong> – Ironsi (corruption) → <strong>1966 Jul</strong> – Gowon (revenge) → <strong>1975</strong> – Murtala (inefficiency) → <strong>1983</strong> – Buhari (rigging) → <strong>1985</strong> – Babangida (inhumanity) → <strong>1993</strong> – Abacha (annulment crisis)</p>
</div>`,
                        question: {
                            text: "A major condition that forced military disengagement in 1999 was:",
                            options: {
                                "A": "Sudden economic boom",
                                "B": "Death of Abacha and domestic/international pressure",
                                "C": "Complete success of transition programme",
                                "D": "Absence of any opposition"
                            },
                            correctAnswer: "B",
                            explanation: "The death of General Abacha in 1998 and the combined domestic (pro-democracy movements) and international pressure (sanctions) created the conditions for the 1999 transition."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART IV - TOPIC 1: INTERNATIONAL ORGANIZATIONS
    // ============================================================
    "International Organizations:": {
        subject: "Government",
        topic: "International Organizations:",
        introduction: {
            title: "International Organizations",
            description: "This topic covers major international organizations including ECOWAS, African Union (AU), Commonwealth, OPEC, United Nations (UN), and their origin, objectives, structure, functions, achievements, problems, and Nigeria's role.",
            jambInfo: "JAMB frequently asks about objectives, achievements, problems, and Nigeria's involvement in these organizations. Expect 3-5 questions."
        },
        subtopics: [
            {
                name: "ECOWAS",
                objectives: [
                    {
                        title: "Understand the origin and objectives of ECOWAS",
                        explanation: `<p>The <strong>Economic Community of West African States (ECOWAS)</strong> is a regional organization for economic integration and cooperation.</p>

<div class="key-points">
    <h4>Origin:</h4>
    <ul>
        <li><strong>Established:</strong> May 28, 1975 in Lagos, Nigeria</li>
        <li><strong>Founding members:</strong> 15 West African states</li>
        <li><strong>Nigeria's role:</strong> Led the initiative; General Gowon hosted signing</li>
        <li><strong>Treaty revised:</strong> 1993 (expanded mandate)</li>
    </ul>
</div>

<div class="key-points">
    <h4>Objectives (ECOWAS Treaty):</h4>
    <ul>
        <li><strong>Economic integration:</strong> Promote cooperation among member states</li>
        <li><strong>Common market:</strong> Single currency (Eco - planned)</li>
        <li><strong>Free movement:</strong> Of persons, goods, services, capital</li>
        <li><strong>Peace and security:</strong> Promote stability in the region</li>
        <li><strong>Policy harmonization:</strong> In industry, agriculture, transport, energy</li>
    </ul>
</div>

<div class="example-box">
    <h4>Key Achievement:</h4>
    <p>ECOWAS successfully deployed <strong>ECOMOG</strong> (ECOWAS Monitoring Group) peacekeeping forces in Liberia, Sierra Leone, and Guinea-Bissau, ending civil wars and restoring peace.</p>
</div>`,
                        question: {
                            text: "The Economic Community of West African States (ECOWAS) was founded mainly to:",
                            options: {
                                "A": "Promote military alliances only",
                                "B": "Foster economic integration and cooperation in West Africa",
                                "C": "Replace the United Nations in Africa",
                                "D": "Eliminate all borders permanently"
                            },
                            correctAnswer: "B",
                            explanation: "ECOWAS was established primarily to promote economic integration and cooperation among West African states, though it has expanded to include peacekeeping and security."
                        }
                    },
                    {
                        title: "Analyze ECOWAS structure, achievements and challenges",
                        explanation: `<p>ECOWAS has a complex structure and has achieved significant milestones despite facing challenges.</p>

<div class="key-points">
    <h4>Structure/Main Organs:</h4>
    <ul>
        <li><strong>Authority of Heads of State:</strong> Supreme organ</li>
        <li><strong>Council of Ministers:</strong> Policy-making</li>
        <li><strong>ECOWAS Commission:</strong> Executive body (Abuja)</li>
        <li><strong>Community Parliament:</strong> Advisory</li>
        <li><strong>Community Court of Justice:</strong> Settles disputes</li>
        <li><strong>ECOWAS Bank (EBID):</strong> Investment and development</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Achievements vs Challenges:</h4>
    <table class="comparison-table">
        <tr><th>Achievements</th><th>Challenges</th></tr>
        <tr><td>Successful peacekeeping (Liberia, Sierra Leone)</td><td>Frequent military coups (Mali, Niger, Burkina Faso)</td></tr>
        <tr><td>Free movement protocol</td><td>Funding dependence on Nigeria (~70%)</td></tr>
        <tr><td>Regional trade growth (ETLS)</td><td>Poor implementation of protocols</td></tr>
        <tr><td>Single currency roadmap (Eco)</td><td>Border closures and xenophobia</td></tr>
        <tr><td>COVID-19 coordination</td><td>Weak enforcement of Court decisions</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigeria's Role:</h4>
    <p>Nigeria is the largest contributor (funds and troops), hosts the Commission and Parliament, led ECOMOG, and mediates conflicts in the region.</p>
</div>`,
                        question: {
                            text: "A major challenge facing ECOWAS is:",
                            options: {
                                "A": "Too much funding from all member states",
                                "B": "Frequent military coups and poor protocol implementation",
                                "C": "Complete absence of any peacekeeping role",
                                "D": "Nigeria's refusal to participate"
                            },
                            correctAnswer: "B",
                            explanation: "ECOWAS faces challenges including frequent military coups in member states (Mali, Niger, Burkina Faso) and poor implementation of its protocols and decisions."
                        }
                    }
                ]
            },
            {
                name: "African Union (AU)",
                objectives: [
                    {
                        title: "Understand the origin and transformation from OAU to AU",
                        explanation: `<p>The African Union succeeded the Organization of African Unity, with expanded objectives and structures.</p>

<div class="key-points">
    <h4>Origin:</h4>
    <ul>
        <li><strong>OAU Established:</strong> May 25, 1963 in Addis Ababa (32 founding members)</li>
        <li><strong>AU Launched:</strong> July 9, 2002 in Durban, South Africa</li>
        <li><strong>Reason for transformation:</strong> OAU had limited powers; AU has broader mandate</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Objectives Comparison:</h4>
    <table class="comparison-table">
        <tr><th>OAU (1963)</th><th>AU (2002)</th></tr>
        <tr><td>Unity and solidarity</td><td>Political and economic integration</td></tr>
        <tr><td>Eradicate colonialism/apartheid</td><td>Democratic principles, human rights</td></tr>
        <tr><td>Defend sovereignty</td><td>Peace, security, stability</td></tr>
        <tr><td>International cooperation</td><td>Sustainable development, Agenda 2063</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Main Organs (AU):</h4>
    <ul>
        <li><strong>Assembly of Heads of State:</strong> Supreme organ</li>
        <li><strong>Executive Council:</strong> Ministers of Foreign Affairs</li>
        <li><strong>AU Commission:</strong> Secretariat (Addis Ababa)</li>
        <li><strong>Pan-African Parliament:</strong> Advisory</li>
        <li><strong>Peace and Security Council (PSC):</strong> Conflict prevention</li>
        <li><strong>African Court:</strong> Human and Peoples' Rights</li>
    </ul>
</div>`,
                        question: {
                            text: "The Organization of African Unity (OAU) was transformed into the African Union (AU) primarily to:",
                            options: {
                                "A": "Reduce African unity",
                                "B": "Expand mandate beyond decolonization to include development and democracy",
                                "C": "Eliminate all African organizations",
                                "D": "Remove Nigeria from membership"
                            },
                            correctAnswer: "B",
                            explanation: "The OAU transformed into AU to expand its mandate beyond decolonization (which was largely achieved) to include political/economic integration, democracy, human rights, and sustainable development."
                        }
                    },
                    {
                        title: "Evaluate AU achievements and Nigeria's role",
                        explanation: `<p>The AU has achieved significant milestones while facing ongoing challenges.</p>

<div class="key-points">
    <h4>Key Achievements:</h4>
    <ul>
        <li><strong>Ended colonialism and apartheid:</strong> Complete decolonization</li>
        <li><strong>Peacekeeping missions:</strong> AMISOM (Somalia), MNJTF</li>
        <li><strong>AfCFTA (2019):</strong> African Continental Free Trade Area - world's largest by countries</li>
        <li><strong>Africa CDC:</strong> COVID-19 vaccine procurement</li>
        <li><strong>Agenda 2063:</strong> 50-year development plan</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Challenges:</h4>
    <table class="comparison-table">
        <tr><th>Problem</th><th>Details</th></tr>
        <tr><td>Funding dependence</td><td>~70% from foreign donors</td></tr>
        <tr><td>Weak enforcement</td><td>Non-compliance with decisions</td></tr>
        <tr><td>Coups</td><td>PSC struggles with unconstitutional changes</td></tr>
        <tr><td>Slow integration</td><td>AfCFTA implementation challenges</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigeria's Role:</h4>
    <ul>
        <li>Founding OAU member</li>
        <li>Key in AU transformation (Obasanjo era)</li>
        <li>Largest peacekeeping contributor</li>
        <li>Pushes for self-financing (0.2% levy)</li>
    </ul>
</div>`,
                        question: {
                            text: "One of Nigeria's major contributions to the African Union is its:",
                            options: {
                                "A": "Refusal to participate in peacekeeping",
                                "B": "Leadership in peacekeeping missions and conflict mediation",
                                "C": "Complete financial dependence on the AU",
                                "D": "Opposition to Agenda 2063"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria has been a major contributor to AU peacekeeping missions, providing troops and leadership in conflict resolution across Africa."
                        }
                    }
                ]
            },
            {
                name: "United Nations (UN)",
                objectives: [
                    {
                        title: "Understand UN origin, objectives and structure",
                        explanation: `<p>The United Nations is the principal global organization for maintaining international peace and cooperation.</p>

<div class="key-points">
    <h4>Origin:</h4>
    <ul>
        <li><strong>Founded:</strong> October 24, 1945 (post-World War II)</li>
        <li><strong>Nigeria joined:</strong> October 7, 1960</li>
        <li><strong>Purpose:</strong> Prevent another world war</li>
        <li><strong>Headquarters:</strong> New York</li>
    </ul>
</div>

<div class="key-points">
    <h4>Objectives (UN Charter):</h4>
    <ul>
        <li><strong>Maintain peace and security:</strong> Prevent and resolve conflicts</li>
        <li><strong>Friendly relations:</strong> Among nations based on equality</li>
        <li><strong>Human rights:</strong> Promote fundamental freedoms</li>
        <li><strong>International cooperation:</strong> Solve economic, social, humanitarian problems</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Main Organs:</h4>
    <table class="comparison-table">
        <tr><th>Organ</th><th>Function</th></tr>
        <tr><td><strong>General Assembly</strong></td><td>All members deliberate (one vote each)</td></tr>
        <tr><td><strong>Security Council</strong></td><td>15 members; 5 permanent with veto (P5)</td></tr>
        <tr><td><strong>ECOSOC</strong></td><td>Economic and social issues</td></tr>
        <tr><td><strong>ICJ</strong></td><td>International Court of Justice (The Hague)</td></tr>
        <tr><td><strong>Secretariat</strong></td><td>Administrative (Secretary-General)</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The primary purpose of the United Nations is to:",
                            options: {
                                "A": "Promote global economic competition",
                                "B": "Maintain international peace and security",
                                "C": "Establish a world government",
                                "D": "Control all national militaries"
                            },
                            correctAnswer: "B",
                            explanation: "The UN was founded primarily to maintain international peace and security, preventing another devastating world war like World War II."
                        }
                    },
                    {
                        title: "Evaluate UN achievements and Nigeria's role",
                        explanation: `<p>The UN has achieved major successes but also faces significant challenges.</p>

<div class="visual-section">
    <h4>Achievements vs Challenges:</h4>
    <table class="comparison-table">
        <tr><th>Achievements</th><th>Challenges</th></tr>
        <tr><td>Prevented World War III</td><td>P5 veto power abuse</td></tr>
        <tr><td>Decolonization (80+ countries)</td><td>Funding shortages</td></tr>
        <tr><td>Human rights framework (UDHR)</td><td>Bureaucracy and slow response</td></tr>
        <tr><td>Development goals (MDGs → SDGs)</td><td>Selective enforcement</td></tr>
        <tr><td>Peacekeeping operations</td><td>Reform resistance (UNSC)</td></tr>
    </table>
</div>

<div class="key-points">
    <h4>Nigeria's Role:</h4>
    <ul>
        <li><strong>Top peacekeeping contributor:</strong> Over 200,000 troops deployed</li>
        <li><strong>UNSC member:</strong> Non-permanent member multiple times</li>
        <li><strong>Advocates for reform:</strong> Permanent African seat on Security Council</li>
        <li><strong>Benefits:</strong> Prestige, training, development aid</li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>Nigeria is one of the world's <strong>top contributors to UN peacekeeping</strong> operations and has consistently advocated for UN Security Council reform to include permanent African representation.</p>
</div>`,
                        question: {
                            text: "A major problem of the United Nations is:",
                            options: {
                                "A": "Complete absence of any peacekeeping role",
                                "B": "Veto power abuse by permanent Security Council members",
                                "C": "Too many permanent members",
                                "D": "Nigeria's dominance of the organization"
                            },
                            correctAnswer: "B",
                            explanation: "The veto power held by the five permanent Security Council members (P5) has been criticized as undemocratic and has sometimes blocked action on important issues."
                        }
                    }
                ]
            },
            {
                name: "Commonwealth and OPEC",
                objectives: [
                    {
                        title: "Understand the Commonwealth of Nations",
                        explanation: `<p>The Commonwealth is a voluntary association of mostly former British colonies.</p>

<div class="key-points">
    <h4>Origin:</h4>
    <ul>
        <li><strong>Evolution:</strong> British Empire → British Commonwealth (1926) → Modern Commonwealth (1949)</li>
        <li><strong>Members:</strong> 56 independent states</li>
        <li><strong>Nigeria joined:</strong> 1960 (at independence)</li>
    </ul>
</div>

<div class="key-points">
    <h4>Objectives:</h4>
    <ul>
        <li>Promote democracy, human rights, rule of law</li>
        <li>Economic development and trade</li>
        <li>Peace and international understanding</li>
        <li>Youth and education programmes</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Nigeria and the Commonwealth:</h4>
    <table class="comparison-table">
        <tr><th>Event</th><th>Details</th></tr>
        <tr><td>Joined</td><td>1960 at independence</td></tr>
        <tr><td>Suspended</td><td>1995-1999 (Abacha's human rights abuses)</td></tr>
        <tr><td>Hosted CHOGM</td><td>2003 (Abuja)</td></tr>
        <tr><td>Benefits</td><td>Scholarships, election observation, technical cooperation</td></tr>
    </table>
</div>`,
                        question: {
                            text: "Nigeria was suspended from the Commonwealth between 1995 and 1999 primarily due to:",
                            options: {
                                "A": "Failure to pay dues",
                                "B": "Human rights violations under General Abacha",
                                "C": "Withdrawal from ECOWAS",
                                "D": "Refusal to join OPEC"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria was suspended from the Commonwealth from 1995 to 1999 due to human rights abuses under General Sani Abacha, including the execution of Ken Saro-Wiwa and the Ogoni Nine."
                        }
                    },
                    {
                        title: "Understand OPEC and Nigeria's membership",
                        explanation: `<p>OPEC coordinates petroleum policies among major oil-producing countries.</p>

<div class="key-points">
    <h4>Origin:</h4>
    <ul>
        <li><strong>Founded:</strong> September 14, 1960 in Baghdad</li>
        <li><strong>Founding members:</strong> Iran, Iraq, Kuwait, Saudi Arabia, Venezuela</li>
        <li><strong>Nigeria joined:</strong> 1971</li>
        <li><strong>Headquarters:</strong> Vienna, Austria</li>
    </ul>
</div>

<div class="key-points">
    <h4>Objectives:</h4>
    <ul>
        <li><strong>Coordinate petroleum policies:</strong> Among member states</li>
        <li><strong>Stabilize oil markets:</strong> Through production quotas</li>
        <li><strong>Fair returns:</strong> Ensure producers get fair prices</li>
        <li><strong>Efficient supply:</strong> To consuming nations</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Achievements vs Challenges:</h4>
    <table class="comparison-table">
        <tr><th>Achievements</th><th>Challenges</th></tr>
        <tr><td>Price stabilization (1970s)</td><td>Non-OPEC producers (US shale)</td></tr>
        <tr><td>Revenue for members</td><td>Renewable energy transition</td></tr>
        <tr><td>Global energy dialogue</td><td>Internal quota disagreements</td></tr>
        <tr><td>OPEC Fund for Development</td><td>Price volatility</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigeria's Role:</h4>
    <p>Nigeria is Africa's largest oil producer and a major OPEC member. Benefits include revenue stability, but production cuts can hurt the economy.</p>
</div>`,
                        question: {
                            text: "Nigeria joined OPEC in:",
                            options: {
                                "A": "1960",
                                "B": "1971",
                                "C": "1999",
                                "D": "1975"
                            },
                            correctAnswer: "B",
                            explanation: "Nigeria joined the Organization of Petroleum Exporting Countries (OPEC) in 1971, becoming a major player in global oil politics as Africa's largest producer."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 9: PROCESSES OF LEGISLATION
    // ============================================================
    "Processes of Legislation:": {
        subject: "Government",
        topic: "Processes of Legislation:",
        introduction: {
            title: "Processes of Legislation",
            description: "This topic explains how laws are made in a democratic system, covering types of legislative enactments (Acts, Decrees, Edicts, Bye-laws, Delegated legislation) and the step-by-step law-making process.",
            jambInfo: "JAMB frequently asks about types of enactments, stages of bill passage, and delegated legislation. Expect 2-4 questions."
        },
        subtopics: [
            {
                name: "Types of Legislative Enactments",
                objectives: [
                    {
                        title: "Differentiate between Acts, Decrees, and Edicts",
                        explanation: `<p>Different types of legislative enactments are made by different authorities and have different characteristics.</p>

<div class="visual-section">
    <h4>Comparison of Enactments:</h4>
    <table class="comparison-table">
        <tr><th>Type</th><th>Made By</th><th>Characteristics</th></tr>
        <tr><td><strong>Acts</strong></td><td>Civilian legislature (National/State Assembly)</td><td>Full legislative process; executive assent; highest civilian law</td></tr>
        <tr><td><strong>Decrees</strong></td><td>Military Head of State (Federal)</td><td>No debate; supreme during military rule; can suspend constitution</td></tr>
        <tr><td><strong>Edicts</strong></td><td>Military Governor (State level)</td><td>Unilateral; subordinate to decrees; state matters</td></tr>
        <tr><td><strong>Bye-laws</strong></td><td>Local councils/delegated bodies</td><td>Local matters; must conform to parent act</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Nigerian Examples:</h4>
    <ul>
        <li><strong>Acts:</strong> Electoral Act 2022, Petroleum Industry Act 2021</li>
        <li><strong>Decrees:</strong> Decree No. 34 of 1966 (Unification), Decree No. 1 of 1984</li>
        <li><strong>Edicts:</strong> Various state edicts during military regimes</li>
        <li><strong>Bye-laws:</strong> Lagos traffic bye-laws, market regulations</li>
    </ul>
</div>

<div class="warning-box">
    <h4>JAMB Key Distinction:</h4>
    <p><strong>Acts</strong> require legislative debate and executive assent. <strong>Decrees</strong> are issued unilaterally by military authorities without any legislative process.</p>
</div>`,
                        question: {
                            text: "An Act is a legislative enactment passed by:",
                            options: {
                                "A": "A military governor",
                                "B": "A civilian legislature with executive assent",
                                "C": "Local government councils only",
                                "D": "The judiciary"
                            },
                            correctAnswer: "B",
                            explanation: "An Act is a law passed by a civilian legislature (National Assembly or State House of Assembly) and signed into law by the executive (President or Governor)."
                        }
                    },
                    {
                        title: "Understand delegated legislation",
                        explanation: `<p><strong>Delegated legislation</strong> (also called subsidiary/secondary legislation) refers to laws made by bodies or persons authorized by the legislature through a parent act.</p>

<div class="key-points">
    <h4>Types of Delegated Legislation:</h4>
    <ul>
        <li><strong>Statutory Instruments:</strong> Detailed rules under an Act</li>
        <li><strong>Orders:</strong> Executive orders implementing policy</li>
        <li><strong>Regulations:</strong> Technical rules (e.g., health, safety)</li>
        <li><strong>Bye-laws:</strong> Local government rules</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Merits vs Demerits:</h4>
    <table class="comparison-table">
        <tr><th>Merits</th><th>Demerits</th></tr>
        <tr><td>Speed and flexibility</td><td>Risk of executive overreach</td></tr>
        <tr><td>Expert technical input</td><td>Lack of public debate</td></tr>
        <tr><td>Saves legislative time</td><td>Possible inconsistency with parent law</td></tr>
        <tr><td>Adapts to changing needs</td><td>Over-delegation weakens legislature</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Why Delegated Legislation?</h4>
    <ul>
        <li><strong>Technical complexity:</strong> Health/safety regulations need expert input</li>
        <li><strong>Quick response:</strong> Emergencies require fast action</li>
        <li><strong>Detail handling:</strong> Legislature focuses on major policy</li>
    </ul>
</div>`,
                        question: {
                            text: "Delegated legislation is made by:",
                            options: {
                                "A": "The National Assembly directly",
                                "B": "Bodies or persons authorized by an Act of Parliament",
                                "C": "Military heads of state only",
                                "D": "Traditional rulers"
                            },
                            correctAnswer: "B",
                            explanation: "Delegated legislation is made by ministers, agencies, or councils that have been given law-making power by a parent Act of Parliament (enabling legislation)."
                        }
                    }
                ]
            },
            {
                name: "The Legislative Process",
                objectives: [
                    {
                        title: "Describe the stages of law-making in a democracy",
                        explanation: `<p>In Nigeria's democracy, a bill goes through several stages before becoming law.</p>

<div class="key-points">
    <h4>Stages of Law-Making (How a Bill Becomes an Act):</h4>
    <ol>
        <li><strong>First Reading:</strong> Bill introduced, title read; no debate; ordered printed</li>
        <li><strong>Second Reading:</strong> General debate on principles and merits; referred to committee if approved</li>
        <li><strong>Committee Stage:</strong> Detailed clause-by-clause scrutiny; amendments proposed</li>
        <li><strong>Report Stage:</strong> Committee reports back with amendments; House votes on amendments</li>
        <li><strong>Third Reading:</strong> Final debate (limited); final vote; sent to other chamber</li>
        <li><strong>Concurrence:</strong> If versions differ, Joint Committee harmonizes</li>
        <li><strong>Assent:</strong> President/Governor signs; or veto (can be overridden by 2/3 majority)</li>
        <li><strong>Publication:</strong> Published in Official Gazette; becomes law</li>
    </ol>
</div>

<div class="visual-section">
    <div class="visual-grid">
        <div class="visual-card">
            <i class="fas fa-file-alt"></i>
            <p><strong>1st Reading</strong></p>
            <p>Introduction</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-comments"></i>
            <p><strong>2nd Reading</strong></p>
            <p>Principle Debate</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-search"></i>
            <p><strong>Committee</strong></p>
            <p>Detailed Review</p>
        </div>
        <div class="visual-card">
            <i class="fas fa-gavel"></i>
            <p><strong>3rd Reading</strong></p>
            <p>Final Vote</p>
        </div>
    </div>
</div>

<div class="key-points">
    <h4>Memory Trick:</h4>
    <p><strong>I-S-C-R-T-C-A-P</strong>: Introduction → Second Reading → Committee → Report → Third Reading → Concurrence → Assent → Publication</p>
</div>`,
                        question: {
                            text: "The stage where a bill is debated in detail clause-by-clause is called:",
                            options: {
                                "A": "First Reading",
                                "B": "Second Reading",
                                "C": "Committee Stage",
                                "D": "Assent Stage"
                            },
                            correctAnswer: "C",
                            explanation: "The Committee Stage is where detailed clause-by-clause scrutiny of a bill takes place and amendments are proposed. This is done by a Committee of the Whole or a Standing Committee."
                        }
                    },
                    {
                        title: "Understand special legislative procedures",
                        explanation: `<p>Certain types of legislation require special procedures in Nigeria.</p>

<div class="key-points">
    <h4>Special Cases:</h4>
    <ul>
        <li><strong>Money Bills:</strong> Can only originate in the House of Representatives (not Senate)</li>
        <li><strong>Constitutional Amendment:</strong> Requires 2/3 majority in both chambers + approval by 24 State Assemblies</li>
        <li><strong>Veto Override:</strong> If President withholds assent, both chambers can pass with 2/3 majority</li>
    </ul>
</div>

<div class="visual-section">
    <table class="comparison-table">
        <tr><th>Bill Type</th><th>Special Requirement</th></tr>
        <tr><td>Money Bill</td><td>Must originate in House of Reps</td></tr>
        <tr><td>Constitutional Amendment</td><td>2/3 in both chambers + 24 State Assemblies</td></tr>
        <tr><td>Veto Override</td><td>2/3 majority in both chambers</td></tr>
        <tr><td>Appropriation Bill</td><td>Annual budget; originates in House of Reps</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>In Nigeria, <strong>money bills</strong> (including the annual budget) can only be introduced in the House of Representatives, not the Senate. This follows the principle that the lower chamber represents the people who are taxed.</p>
</div>`,
                        question: {
                            text: "Money bills in Nigeria can only be introduced in:",
                            options: {
                                "A": "The Senate",
                                "B": "The House of Representatives",
                                "C": "The State House of Assembly",
                                "D": "The Federal Executive Council"
                            },
                            correctAnswer: "B",
                            explanation: "Under the 1999 Constitution, money bills (including the Appropriation Bill/budget) can only be introduced in the House of Representatives, which directly represents the people who are taxed."
                        }
                    }
                ]
            }
        ]
    },

    // ============================================================
    // PART I - TOPIC 8: PRINCIPLES OF DEMOCRATIC GOVERNMENT
    // ============================================================
    "Principles of Democratic Government:": {
        subject: "Government",
        topic: "Principles of Democratic Government:",
        introduction: {
            title: "Principles of Democratic Government",
            description: "This topic covers the essential principles that distinguish genuine democracy from other systems: Separation of Powers, Checks and Balances, Rule of Law, Constitutionalism, and Accountability. These principles prevent abuse of power.",
            jambInfo: "JAMB frequently asks about these principles, their application, and Nigerian examples. Expect 3-5 questions."
        },
        subtopics: [
            {
                name: "Separation of Powers and Checks and Balances",
                objectives: [
                    {
                        title: "Explain the principle of separation of powers",
                        explanation: `<p><strong>Separation of powers</strong> is the division of governmental authority into three independent branches to prevent concentration of power.</p>

<div class="key-points">
    <h4>The Three Branches:</h4>
    <ul>
        <li><strong>Legislature:</strong> Makes laws (deliberative function)</li>
        <li><strong>Executive:</strong> Implements/enforces laws (active function)</li>
        <li><strong>Judiciary:</strong> Interprets laws (adjudicative function)</li>
    </ul>
</div>

<div class="example-box">
    <h4>Historical Origin:</h4>
    <p>Proposed by <strong>Baron de Montesquieu</strong> in "The Spirit of the Laws" (1748) to prevent tyranny. Influenced by John Locke's earlier ideas.</p>
</div>

<div class="visual-section">
    <h4>Merits vs Demerits:</h4>
    <table class="comparison-table">
        <tr><th>Merits</th><th>Demerits</th></tr>
        <tr><td>Prevents dictatorship</td><td>Can cause gridlock</td></tr>
        <tr><td>Promotes efficiency (specialization)</td><td>Executive often dominates in practice</td></tr>
        <tr><td>Enhances accountability</td><td>Overlap inevitable in complex governance</td></tr>
        <tr><td>Protects liberty</td><td>Weak institutions undermine separation</td></tr>
    </table>
</div>`,
                        question: {
                            text: "The principle of separation of powers was propounded by:",
                            options: {
                                "A": "John Locke",
                                "B": "Baron de Montesquieu",
                                "C": "Thomas Hobbes",
                                "D": "Jean-Jacques Rousseau"
                            },
                            correctAnswer: "B",
                            explanation: "Baron de Montesquieu propounded the theory of separation of powers in his book 'The Spirit of the Laws' (1748), dividing government into legislature, executive, and judiciary."
                        }
                    },
                    {
                        title: "Explain checks and balances",
                        explanation: `<p><strong>Checks and balances</strong> is the system whereby each branch of government can limit the powers of the other branches to prevent abuse.</p>

<div class="key-points">
    <h4>Examples of Checks:</h4>
    <ul>
        <li><strong>Executive checks Legislature:</strong> Veto power on bills</li>
        <li><strong>Legislature checks Executive:</strong> Impeachment, budget approval, confirmation of appointments</li>
        <li><strong>Judiciary checks both:</strong> Judicial review (can declare laws/actions unconstitutional)</li>
        <li><strong>Legislature checks Judiciary:</strong> Confirmation of judges, amendment of laws</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Nigerian Examples:</h4>
    <table class="comparison-table">
        <tr><th>Branch</th><th>Check on Others</th></tr>
        <tr><td>President</td><td>Can veto bills; appoints judges</td></tr>
        <tr><td>National Assembly</td><td>Approves budget; confirms appointments; can impeach</td></tr>
        <tr><td>Supreme Court</td><td>Can strike down unconstitutional laws/actions</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Key Distinction:</h4>
    <p><strong>Separation of powers</strong> = each branch has distinct functions. <strong>Checks and balances</strong> = each branch can limit the others. They work together to prevent tyranny.</p>
</div>`,
                        question: {
                            text: "The power of the judiciary to declare a law unconstitutional is an example of:",
                            options: {
                                "A": "Separation of powers",
                                "B": "Checks and balances",
                                "C": "Rule of law",
                                "D": "Delegated legislation"
                            },
                            correctAnswer: "B",
                            explanation: "Judicial review (declaring laws unconstitutional) is a check by the judiciary on the legislature. This is an example of checks and balances in action."
                        }
                    }
                ]
            },
            {
                name: "Rule of Law and Constitutionalism",
                objectives: [
                    {
                        title: "Explain the concept of rule of law",
                        explanation: `<p><strong>Rule of law</strong> means that all persons and institutions, including the government, are subject to and accountable under the law.</p>

<div class="key-points">
    <h4>Principles of Rule of Law (A.V. Dicey):</h4>
    <ul>
        <li><strong>Supremacy of Law:</strong> No one is above the law; law is supreme over arbitrary power</li>
        <li><strong>Equality before the Law:</strong> All persons are equal in the eyes of the law regardless of status</li>
        <li><strong>Protection of Rights:</strong> Individual rights are guaranteed and protected by the courts</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Requirements for Rule of Law:</h4>
    <table class="comparison-table">
        <tr><th>Requirement</th><th>Meaning</th></tr>
        <tr><td>Independent Judiciary</td><td>Courts free from executive/legislative control</td></tr>
        <tr><td>Fair Hearing</td><td>No punishment without trial (natural justice)</td></tr>
        <tr><td>Presumption of Innocence</td><td>Accused presumed innocent until proven guilty</td></tr>
        <tr><td>Access to Justice</td><td>Citizens can seek redress in courts</td></tr>
    </table>
</div>

<div class="example-box">
    <h4>Limitations in Nigeria:</h4>
    <ul>
        <li>Executive immunity (immunity clause for President/Governors)</li>
        <li>Delayed justice (cases take years)</li>
        <li>Poverty limits access to legal representation</li>
        <li>Military rule suspended rule of law historically</li>
    </ul>
</div>`,
                        question: {
                            text: "The principle that all persons are equal before the law is associated with:",
                            options: {
                                "A": "Separation of powers",
                                "B": "Checks and balances",
                                "C": "Rule of law",
                                "D": "Political sovereignty"
                            },
                            correctAnswer: "C",
                            explanation: "Equality before the law is one of the three main principles of rule of law as propounded by A.V. Dicey. It means no one is above the law, regardless of status."
                        }
                    },
                    {
                        title: "Explain constitutionalism",
                        explanation: `<p><strong>Constitutionalism</strong> is the principle that government power must be limited by a constitution and exercised according to its provisions.</p>

<div class="key-points">
    <h4>Key Features:</h4>
    <ul>
        <li><strong>Limited government:</strong> Government cannot do whatever it wants</li>
        <li><strong>Constitutional supremacy:</strong> Constitution is the highest law</li>
        <li><strong>Fundamental rights:</strong> Citizens' rights are protected</li>
        <li><strong>Judicial review:</strong> Courts can check government actions</li>
        <li><strong>Amendment procedures:</strong> Constitution cannot be changed easily</li>
    </ul>
</div>

<div class="visual-section">
    <h4>Constitutionalism vs Having a Constitution:</h4>
    <table class="comparison-table">
        <tr><th>Having a Constitution</th><th>Constitutionalism</th></tr>
        <tr><td>Document exists</td><td>Document is actually followed</td></tr>
        <tr><td>Formal structure</td><td>Government acts within limits</td></tr>
        <tr><td>May be ignored in practice</td><td>Rights are truly protected</td></tr>
    </table>
</div>

<div class="warning-box">
    <h4>JAMB Key Point:</h4>
    <p>Constitutionalism is different from merely having a constitution. A country can have a constitution but not practice constitutionalism if the government ignores constitutional limits.</p>
</div>`,
                        question: {
                            text: "Constitutionalism means:",
                            options: {
                                "A": "Having a written constitution",
                                "B": "Government power is limited and exercised according to constitutional provisions",
                                "C": "The military can suspend the constitution",
                                "D": "Citizens have no rights"
                            },
                            correctAnswer: "B",
                            explanation: "Constitutionalism means that government power is limited by a constitution and must be exercised according to its provisions. It's about actually following constitutional limits, not just having a constitution."
                        }
                    }
                ]
            }
        ]
    }
};

// Make available globally
window.GOVERNMENT_LEARNING_CONTENT = GOVERNMENT_LEARNING_CONTENT;
