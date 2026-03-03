// Guided Learning Screen - Objective-by-Objective Learning Flow

let guidedLearnState = {
    subject: null,
    topicName: null,
    topicStructure: null,
    currentSubtopicIndex: 0,
    currentObjectiveIndex: 0,
    currentObjective: null,
    explanationData: null,
    questions: [],
    currentQuestionIndex: 0,
    questionAnswered: false,
    timeStarted: null,
    mode: 'subject-select', // subject-select, topic-list, learning, subtopic-complete, topic-complete
    useStaticContent: false,
    staticContent: null
};

// ============================================================
// STATIC CONTENT REGISTRY
// ============================================================

// Dynamic content lookup - checks PHYSICS_LEARNING_CONTENT for any Physics topic
function hasStaticContent(subject, topic) {
    if (subject === 'Physics') {
        // Check if topic exists in Physics content registry
        if (window.PHYSICS_LEARNING_CONTENT && window.PHYSICS_LEARNING_CONTENT[topic]) {
            return true;
        }
        // Special case: Motion has its own dedicated content file
        if (topic === 'Motion' && window.MOTION_LEARNING_CONTENT) {
            return true;
        }
    }
    // Chemistry content
    if (subject === 'Chemistry') {
        if (window.CHEMISTRY_LEARNING_CONTENT && window.CHEMISTRY_LEARNING_CONTENT[topic]) {
            return true;
        }
    }
    // Mathematics content
    if (subject === 'Mathematics') {
        if (window.MATHEMATICS_LEARNING_CONTENT && window.MATHEMATICS_LEARNING_CONTENT[topic]) {
            return true;
        }
    }
    // Government content
    if (subject === 'Government') {
        if (window.GOVERNMENT_LEARNING_CONTENT && window.GOVERNMENT_LEARNING_CONTENT[topic]) {
            return true;
        }
    }
    // Add more subjects here as content is created
    return false;
}

function getStaticTopicContent(subject, topic) {
    if (subject === 'Physics') {
        // Motion has dedicated content file
        if (topic === 'Motion' && window.MOTION_LEARNING_CONTENT) {
            return window.MOTION_LEARNING_CONTENT;
        }
        // Check comprehensive Physics content
        if (window.PHYSICS_LEARNING_CONTENT && window.PHYSICS_LEARNING_CONTENT[topic]) {
            return window.PHYSICS_LEARNING_CONTENT[topic];
        }
    }
    // Chemistry content
    if (subject === 'Chemistry' && window.CHEMISTRY_LEARNING_CONTENT && window.CHEMISTRY_LEARNING_CONTENT[topic]) {
        return window.CHEMISTRY_LEARNING_CONTENT[topic];
    }
    // Mathematics content
    if (subject === 'Mathematics' && window.MATHEMATICS_LEARNING_CONTENT && window.MATHEMATICS_LEARNING_CONTENT[topic]) {
        return window.MATHEMATICS_LEARNING_CONTENT[topic];
    }
    // Government content
    if (subject === 'Government' && window.GOVERNMENT_LEARNING_CONTENT && window.GOVERNMENT_LEARNING_CONTENT[topic]) {
        return window.GOVERNMENT_LEARNING_CONTENT[topic];
    }
    // Biology content
    if (subject === 'Biology' && window.BIOLOGY_LEARNING_CONTENT && window.BIOLOGY_LEARNING_CONTENT[topic]) {
        return window.BIOLOGY_LEARNING_CONTENT[topic];
    }
    // Add more subjects here
    return null;
}

// ============================================================
// NAVIGATION FUNCTIONS
// ============================================================

async function showGuidedLearnScreen(params = {}) {
    const user = authManager.getUser();

    if (params.subject && params.topic && params.subtopic !== undefined && params.objective !== undefined) {
        // Jump to specific objective
        guidedLearnState.subject = params.subject;
        guidedLearnState.topicName = params.topic;
        guidedLearnState.currentSubtopicIndex = parseInt(params.subtopic);
        guidedLearnState.currentObjectiveIndex = parseInt(params.objective);

        // Check for static content
        const staticContent = getStaticTopicContent(params.subject, params.topic);
        if (staticContent) {
            guidedLearnState.useStaticContent = true;
            guidedLearnState.staticContent = staticContent;
            await showStaticObjectiveLearning();
        } else {
            await loadTopicAndShowObjective();
        }
    } else if (params.subject && params.topic) {
        // Start or resume topic - check for static content
        guidedLearnState.subject = params.subject;
        guidedLearnState.topicName = params.topic;

        const staticContent = getStaticTopicContent(params.subject, params.topic);
        if (staticContent) {
            guidedLearnState.useStaticContent = true;
            guidedLearnState.staticContent = staticContent;
            await loadStaticTopicProgress();
        } else {
            await loadTopicProgress();
        }
    } else if (params.subject) {
        // Show topics for subject
        guidedLearnState.subject = params.subject;
        await showGuidedTopicList();
    } else {
        // Subject selection
        await showGuidedSubjectSelect();
    }
}

// ============================================================
// SUBJECT SELECTION
// ============================================================

async function showGuidedSubjectSelect() {
    showLoading('Loading subjects...');

    try {
        const data = await api.request('/guided-learn/subjects', { requireAuth: true });
        const user = authManager.getUser();

        // Get subject colors
        const subjectColors = {
            'Physics': { bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', icon: '⚛️' },
            'Chemistry': { bg: 'linear-gradient(135deg, #10B981, #059669)', icon: '🧪' },
            'Biology': { bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', icon: '🧬' },
            'Mathematics': { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', icon: '📐' },
            'English': { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', icon: '📚' },
            'Government': { bg: 'linear-gradient(135deg, #6366F1, #4F46E5)', icon: '🏛️' },
            'Economics': { bg: 'linear-gradient(135deg, #14B8A6, #0D9488)', icon: '📊' },
            'Literature': { bg: 'linear-gradient(135deg, #F472B6, #EC4899)', icon: '📖' },
            'Commerce': { bg: 'linear-gradient(135deg, #F97316, #EA580C)', icon: '💼' },
            'Accounting': { bg: 'linear-gradient(135deg, #22C55E, #16A34A)', icon: '🧮' }
        };

        const content = `
            <div class="guided-learn-screen">
                <!-- Hero Section -->
                <div class="learn-hero">
                    <div class="hero-content">
                        <div class="hero-badge">
                            <i class="fas fa-bolt"></i> SMART LEARNING
                        </div>
                        <h1>Master Your Subjects</h1>
                        <p>Learn topic-by-topic with structured objectives, clear explanations, and practice questions designed for JAMB success.</p>
                    </div>
                    <div class="hero-illustration">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                </div>
                
                <!-- Subject Cards -->
                <div class="section-header">
                    <h2><i class="fas fa-books"></i> Choose a Subject</h2>
                    <p>Select a subject to explore its topics and start learning</p>
                </div>
                
                <div class="subject-grid">
                    ${data.subjects.map(s => {
            const colors = subjectColors[s.name] || { bg: 'linear-gradient(135deg, #64748B, #475569)', icon: '📘' };
            return `
                            <div class="subject-card-modern" onclick="selectGuidedSubject('${s.name}')">
                                <div class="subject-card-bg" style="background: ${colors.bg}">
                                    <div class="subject-card-icon">${colors.icon}</div>
                                </div>
                                <div class="subject-card-body">
                                    <h3>${s.name}</h3>
                                    <div class="subject-stats">
                                        <span><i class="fas fa-book-open"></i> ${s.topic_count} Topics</span>
                                    </div>
                                    <div class="subject-card-arrow">
                                        <i class="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                
                <!-- Tips Section -->
                <div class="learning-tips">
                    <div class="tip-card">
                        <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
                        <div class="tip-content">
                            <h4>Study Tip</h4>
                            <p>Focus on one topic at a time and complete all objectives before moving on.</p>
                        </div>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon"><i class="fas fa-star"></i></div>
                        <div class="tip-content">
                            <h4>Earn Points</h4>
                            <p>Complete objectives and answer questions correctly to earn points!</p>
                        </div>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon"><i class="fas fa-sync-alt"></i></div>
                        <div class="tip-content">
                            <h4>Review Weaknesses</h4>
                            <p>Topics you struggle with will be highlighted for extra practice.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        hideLoading();

    } catch (error) {
        hideLoading();
        showToast('Failed to load subjects: ' + error.message, 'error');
    }
}

function selectGuidedSubject(subject) {
    guidedLearnState.subject = subject;
    showGuidedTopicList();
}

// ============================================================
// TOPIC LIST
// ============================================================

async function showGuidedTopicList() {
    showLoading(`Loading ${guidedLearnState.subject} topics...`);

    try {
        const data = await api.request(`/guided-learn/topics/${encodeURIComponent(guidedLearnState.subject)}`, { requireAuth: true });
        const user = authManager.getUser();

        // Calculate overall progress
        const totalObjectives = data.topics.reduce((sum, t) => sum + t.objective_count, 0);
        const completedObjectives = data.topics.reduce((sum, t) => sum + t.completed_objectives, 0);
        const overallProgress = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
        const completedTopics = data.topics.filter(t => t.progress_percent === 100).length;

        const content = `
            <div class="guided-learn-screen">
                <!-- Subject Header -->
                <div class="subject-header-banner">
                    <button class="back-btn" onclick="showGuidedSubjectSelect()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="subject-header-content">
                        <h1>${guidedLearnState.subject}</h1>
                        <p>${data.topics.length} Topics • ${totalObjectives} Learning Objectives</p>
                    </div>
                </div>
                
                <!-- Progress Overview -->
                <div class="progress-overview-card">
                    <div class="progress-circle-container">
                        <div class="progress-circle" style="--progress: ${overallProgress}">
                            <span class="progress-value">${overallProgress}%</span>
                        </div>
                    </div>
                    <div class="progress-details">
                        <h3>Your Progress</h3>
                        <div class="progress-stats-row">
                            <div class="progress-stat">
                                <span class="stat-number">${completedTopics}</span>
                                <span class="stat-label">Topics Done</span>
                            </div>
                            <div class="progress-stat">
                                <span class="stat-number">${completedObjectives}</span>
                                <span class="stat-label">Objectives</span>
                            </div>
                            <div class="progress-stat">
                                <span class="stat-number">${data.topics.length - completedTopics}</span>
                                <span class="stat-label">Remaining</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Topic Cards -->
                <div class="topics-section">
                    <h2 class="section-title"><i class="fas fa-list-check"></i> Topics</h2>
                    
                    <div class="topic-cards-grid">
                        ${data.topics.map(t => {
            const statusClass = t.progress_percent === 100 ? 'completed' : t.progress_percent > 0 ? 'in-progress' : 'not-started';
            const hasStatic = hasStaticContent(guidedLearnState.subject, t.name);
            return `
                                <div class="topic-card-modern ${statusClass}" onclick="selectGuidedTopic('${t.name.replace(/'/g, "\\'")}')">
                                    <div class="topic-card-header">
                                        <div class="topic-number-badge">${t.number}</div>
                                        ${t.progress_percent === 100 ? '<div class="completed-check"><i class="fas fa-check-circle"></i></div>' : ''}
                                        ${hasStatic ? '<div class="static-indicator" title="Optimized content"><i class="fas fa-bolt"></i></div>' : ''}
                                    </div>
                                    <div class="topic-card-body">
                                        <h3 class="topic-card-title">${t.name}</h3>
                                        <div class="topic-card-meta">
                                            <span><i class="fas fa-layer-group"></i> ${t.subtopic_count} subtopics</span>
                                            <span><i class="fas fa-bullseye"></i> ${t.objective_count} objectives</span>
                                        </div>
                                        ${t.weakness_count > 0 ? `
                                            <div class="weakness-indicator">
                                                <i class="fas fa-exclamation-triangle"></i> ${t.weakness_count} areas need review
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="topic-card-footer">
                                        <div class="topic-progress-bar">
                                            <div class="topic-progress-fill" style="width: ${t.progress_percent}%"></div>
                                        </div>
                                        <div class="topic-progress-text">
                                            <span>${t.completed_objectives}/${t.objective_count} completed</span>
                                            <span class="progress-percent">${t.progress_percent}%</span>
                                        </div>
                                    </div>
                                    <div class="topic-card-action">
                                        <span>${t.progress_percent === 0 ? 'Start Learning' : t.progress_percent === 100 ? 'Review' : 'Continue'}</span>
                                        <i class="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        hideLoading();

    } catch (error) {
        hideLoading();
        showToast('Failed to load topics: ' + error.message, 'error');
    }
}

async function selectGuidedTopic(topicName) {
    guidedLearnState.topicName = topicName;

    // Check if static content is available for this topic
    const staticContent = getStaticTopicContent(guidedLearnState.subject, topicName);
    if (staticContent) {
        guidedLearnState.useStaticContent = true;
        guidedLearnState.staticContent = staticContent;
        await loadStaticTopicProgress();
    } else {
        guidedLearnState.useStaticContent = false;
        guidedLearnState.staticContent = null;
        await loadTopicProgress();
    }
}

// ============================================================
// LOAD TOPIC AND PROGRESS
// ============================================================

async function loadTopicProgress() {
    showLoading('Loading your progress...');

    try {
        // Get topic structure
        const structure = await api.request(
            `/guided-learn/topic/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`,
            { requireAuth: true }
        );
        guidedLearnState.topicStructure = structure.topic;

        // Get progress
        const progress = await api.request(
            `/guided-learn/progress/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`,
            { requireAuth: true }
        );

        // Find next uncompleted objective
        let foundNext = false;
        for (let st_idx = 0; st_idx < structure.topic.subtopics.length; st_idx++) {
            const subtopic = structure.topic.subtopics[st_idx];
            for (let obj_idx = 0; obj_idx < subtopic.objectives.length; obj_idx++) {
                const obj = subtopic.objectives[obj_idx];
                if (obj.status !== 'completed') {
                    guidedLearnState.currentSubtopicIndex = st_idx;
                    guidedLearnState.currentObjectiveIndex = obj_idx;
                    foundNext = true;
                    break;
                }
            }
            if (foundNext) break;
        }

        if (!foundNext) {
            // Topic complete!
            await showTopicComplete();
        } else {
            await showObjectiveLearning();
        }

    } catch (error) {
        hideLoading();
        showToast('Failed to load topic: ' + error.message, 'error');
    }
}

// ============================================================
// STATIC CONTENT LEARNING FLOW
// ============================================================

async function loadStaticTopicProgress() {
    const content = guidedLearnState.staticContent;

    // Get progress from localStorage
    const progressKey = `guided_progress_${guidedLearnState.subject}_${guidedLearnState.topicName}`;
    const savedProgress = localStorage.getItem(progressKey);

    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        guidedLearnState.currentSubtopicIndex = progress.subtopicIndex || 0;
        guidedLearnState.currentObjectiveIndex = progress.objectiveIndex || 0;
        guidedLearnState.answeredQuestions = progress.answered || {};
        guidedLearnState.weaknesses = progress.weaknesses || [];
        guidedLearnState.hasStarted = progress.hasStarted || false;
    } else {
        guidedLearnState.currentSubtopicIndex = 0;
        guidedLearnState.currentObjectiveIndex = 0;
        guidedLearnState.answeredQuestions = {};
        guidedLearnState.weaknesses = [];
        guidedLearnState.hasStarted = false;
    }

    // Check if topic is complete
    const lastSubtopic = content.subtopics.length - 1;
    const lastObjective = content.subtopics[lastSubtopic].objectives.length - 1;

    if (guidedLearnState.currentSubtopicIndex > lastSubtopic ||
        (guidedLearnState.currentSubtopicIndex === lastSubtopic &&
            guidedLearnState.currentObjectiveIndex > lastObjective)) {
        await showStaticTopicComplete();
    } else if (!guidedLearnState.hasStarted) {
        // Show topic introduction first
        showStaticTopicIntro();
    } else {
        await showStaticObjectiveLearning();
    }
}

function showStaticTopicIntro() {
    const user = authManager.getUser();
    const content = guidedLearnState.staticContent;
    const intro = content.introduction;

    // Count total objectives
    let totalObjectives = 0;
    content.subtopics.forEach(st => totalObjectives += st.objectives.length);

    const pageContent = `
        <div class="static-learn-screen">
            <div class="topic-intro-card">
                <div class="intro-icon">
                    <i class="fas fa-rocket"></i>
                </div>
                
                <h1 class="intro-title">${intro.title}</h1>
                
                <p class="intro-description">${intro.description}</p>
                
                <div class="jamb-info-box">
                    <i class="fas fa-info-circle"></i>
                    <span>${intro.jambInfo}</span>
                </div>
                
                <button class="btn btn-primary btn-lg start-btn" onclick="startStaticLearningFlow()">
                    <i class="fas fa-play"></i> Start
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function startStaticLearningFlow() {
    guidedLearnState.hasStarted = true;
    guidedLearnState.currentSubtopicIndex = 0;
    guidedLearnState.currentObjectiveIndex = 0;

    // Save that we've started
    const progressKey = `guided_progress_${guidedLearnState.subject}_${guidedLearnState.topicName}`;
    const progress = {
        subtopicIndex: 0,
        objectiveIndex: 0,
        answered: {},
        weaknesses: [],
        hasStarted: true,
        lastUpdated: Date.now()
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));

    showStaticObjectiveLearning();
}

async function showStaticObjectiveLearning() {
    const user = authManager.getUser();
    const content = guidedLearnState.staticContent;
    const { currentSubtopicIndex, currentObjectiveIndex } = guidedLearnState;

    const subtopic = content.subtopics[currentSubtopicIndex];
    const objective = subtopic.objectives[currentObjectiveIndex];

    // Calculate progress
    let totalObjectives = 0;
    let currentPosition = 0;
    content.subtopics.forEach((st, stIdx) => {
        st.objectives.forEach((obj, objIdx) => {
            totalObjectives++;
            if (stIdx < currentSubtopicIndex || (stIdx === currentSubtopicIndex && objIdx < currentObjectiveIndex)) {
                currentPosition++;
            }
        });
    });
    currentPosition++;

    const progressPercent = (currentPosition / totalObjectives) * 100;
    const hasQuestion = !!objective.question;

    guidedLearnState.timeStarted = Date.now();

    const pageContent = `
        <div class="static-learn-screen">
            <!-- Header -->
            <div class="objective-header">
                <div class="breadcrumb">
                    <span class="clickable" onclick="showGuidedTopicList()">${content.subject}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span class="clickable" onclick="showGuidedTopicList()">${content.topic}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span class="current">${subtopic.name}</span>
                </div>
                <div class="progress-indicator">
                    <span>${currentPosition} of ${totalObjectives}</span>
                    <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>

            <!-- Step Indicator -->
            <div class="learn-step-indicator">
                <div class="step-item active">
                    <div class="step-circle active"><i class="fas fa-book-open"></i></div>
                    <span>Learn</span>
                </div>
                <div class="step-connector ${hasQuestion ? '' : 'inactive'}"></div>
                <div class="step-item ${hasQuestion ? '' : 'inactive'}">
                    <div class="step-circle"><i class="fas fa-pencil-alt"></i></div>
                    <span>Practice</span>
                </div>
            </div>

            <!-- Objective Title -->
            <div class="objective-banner">
                <div class="objective-label"><i class="fas fa-bullseye"></i> Objective ${currentPosition}</div>
                <h2>${objective.title}</h2>
            </div>
            
            <!-- Full-Width Explanation Content -->
            <div class="explanation-full">
                <div class="content-card">
                    <div class="card-header">
                        <h3><i class="fas fa-lightbulb"></i> Explanation</h3>
                    </div>
                    <div class="card-body explanation-text">
                        ${objective.explanation}
                    </div>
                </div>
                
                ${objective.workedExample ? `
                    <div class="content-card worked-example">
                        <div class="card-header">
                            <h3><i class="fas fa-calculator"></i> Worked Example</h3>
                        </div>
                        <div class="card-body">
                            <div class="problem-box">
                                <strong>Problem:</strong> ${objective.workedExample.problem}
                            </div>
                            <div class="solution-box">
                                <strong>Solution:</strong>
                                <p>${objective.workedExample.solution}</p>
                            </div>
                            ${objective.workedExample.explanation ? `
                                <div class="explanation-box">
                                    <strong>Why:</strong>
                                    <p>${objective.workedExample.explanation}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${objective.visuals && objective.visuals.length > 0 ? `
                    <div class="visual-card">
                        ${renderStaticVisuals(objective.visuals)}
                    </div>
                ` : ''}

                <!-- Ask Question -->
                <div class="content-card ask-card">
                    <div class="card-header">
                        <h3><i class="fas fa-comments"></i> Ask about this concept</h3>
                    </div>
                    <div class="card-body">
                        <div class="ask-input-wrapper">
                            <input type="text" id="static-ask-input" placeholder="I don't understand why...">
                            <button class="btn btn-primary" onclick="handleStaticAskQuestion()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="static-ask-response"></div>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <div class="learning-navigation step-navigation">
                <button class="btn btn-outline" onclick="goToPrevStaticObjective()" ${currentSubtopicIndex === 0 && currentObjectiveIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                ${hasQuestion ? `
                    <button class="btn btn-primary btn-practice-cta" onclick="showStaticObjectivePractice()">
                        <i class="fas fa-pencil-alt"></i> Practice
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="goToNextStaticObjective()">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                `}
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function showStaticObjectivePractice() {
    const user = authManager.getUser();
    const content = guidedLearnState.staticContent;
    const { currentSubtopicIndex, currentObjectiveIndex } = guidedLearnState;

    const subtopic = content.subtopics[currentSubtopicIndex];
    const objective = subtopic.objectives[currentObjectiveIndex];

    // Calculate progress
    let totalObjectives = 0;
    let currentPosition = 0;
    content.subtopics.forEach((st, stIdx) => {
        st.objectives.forEach((obj, objIdx) => {
            totalObjectives++;
            if (stIdx < currentSubtopicIndex || (stIdx === currentSubtopicIndex && objIdx < currentObjectiveIndex)) {
                currentPosition++;
            }
        });
    });
    currentPosition++;

    const progressPercent = (currentPosition / totalObjectives) * 100;
    const questionKey = `${currentSubtopicIndex}_${currentObjectiveIndex}`;
    const alreadyAnswered = guidedLearnState.answeredQuestions && guidedLearnState.answeredQuestions[questionKey];
    const question = objective.question;

    guidedLearnState.questionAnswered = !!alreadyAnswered;

    const pageContent = `
        <div class="static-learn-screen">
            <!-- Header -->
            <div class="objective-header">
                <div class="breadcrumb">
                    <span class="clickable" onclick="showGuidedTopicList()">${content.subject}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span class="clickable" onclick="showGuidedTopicList()">${content.topic}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span class="current">${subtopic.name}</span>
                </div>
                <div class="progress-indicator">
                    <span>${currentPosition} of ${totalObjectives}</span>
                    <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>

            <!-- Step Indicator -->
            <div class="learn-step-indicator">
                <div class="step-item completed" onclick="showStaticObjectiveLearning()" title="Back to Explanation">
                    <div class="step-circle completed"><i class="fas fa-check"></i></div>
                    <span>Learn</span>
                </div>
                <div class="step-connector active"></div>
                <div class="step-item active">
                    <div class="step-circle active"><i class="fas fa-pencil-alt"></i></div>
                    <span>Practice</span>
                </div>
            </div>

            <!-- Practice Header -->
            <div class="objective-banner practice-banner">
                <div class="objective-label"><i class="fas fa-brain"></i> Test Your Understanding</div>
                <h2>${objective.title}</h2>
            </div>

            <!-- Full-Width Question -->
            <div class="practice-full">
                <div class="content-card question-card-full">
                    <div class="card-header">
                        <h3><i class="fas fa-question-circle"></i> Practice Question</h3>
                        <span class="badge">JAMB Style</span>
                    </div>
                    <div class="card-body">
                        <div class="static-question" id="static-question-area">
                            <p class="question-text">${question.text}</p>
                            <div class="options-list">
                                ${Object.entries(question.options).map(([key, text]) => {
        const isCorrect = key === question.correctAnswer;
        const wasSelected = alreadyAnswered === key;
        let optionClass = '';
        if (alreadyAnswered) {
            if (isCorrect) optionClass = 'correct';
            else if (wasSelected) optionClass = 'incorrect';
        }
        return `
                                        <div class="option-item ${optionClass}" 
                                             id="static-option-${key}"
                                             onclick="selectStaticOption('${key}')"
                                             ${alreadyAnswered ? 'style="pointer-events: none;"' : ''}>
                                            <span class="option-key">${key}</span>
                                            <span class="option-text">${text}</span>
                                            ${alreadyAnswered && isCorrect ? '<i class="fas fa-check"></i>' : ''}
                                            ${alreadyAnswered && wasSelected && !isCorrect ? '<i class="fas fa-times"></i>' : ''}
                                        </div>
                                    `;
    }).join('')}
                            </div>
                            <div class="feedback-box ${alreadyAnswered ? (alreadyAnswered === question.correctAnswer ? 'correct' : 'incorrect') : 'hidden'}" id="static-feedback">
                                ${alreadyAnswered ? `
                                    <div class="feedback-header">
                                        <i class="fas fa-${alreadyAnswered === question.correctAnswer ? 'check-circle' : 'times-circle'}"></i>
                                        <strong>${alreadyAnswered === question.correctAnswer ? 'Correct!' : 'Incorrect'}</strong>
                                    </div>
                                    <p>${question.explanation}</p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <div class="learning-navigation step-navigation">
                <button class="btn btn-outline" onclick="showStaticObjectiveLearning()">
                    <i class="fas fa-arrow-left"></i> Back to Explanation
                </button>
                <button class="btn btn-primary" id="static-next-btn" onclick="goToNextStaticObjective()" ${!guidedLearnState.questionAnswered ? 'disabled' : ''}>
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function renderStaticVisuals(visuals) {
    return visuals.map(visual => {
        switch (visual.type) {
            case 'icon-grid':
                return `
                    <div class="icon-grid-visual">
                        ${visual.items.map(item => `
                            <div class="icon-item">
                                <div class="icon-circle"><i class="fas ${item.icon}"></i></div>
                                <div class="icon-label">${item.label}</div>
                                <div class="icon-desc">${item.description}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'formula-cards':
                const formulas = visual.formulas || visual.items || [];
                return `
                    <div class="formula-cards">
                        ${formulas.map(f => `
                            <div class="formula-item">
                                <span class="formula">${f.formula}</span>
                                <span class="formula-use">${f.use}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'graph-comparison':
                return `
                    <div class="graph-comparison">
                        ${visual.graphs.map(g => `
                            <div class="graph-item">
                                <div class="graph-placeholder"><i class="fas fa-chart-line"></i></div>
                                <div class="graph-title">${g.title}</div>
                                <div class="graph-desc">${g.description}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'projectile-diagram':
                return `
                    <div class="projectile-visual">
                        <div class="projectile-diagram">
                            <svg viewBox="0 0 400 200" class="projectile-svg">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/>
                                    </marker>
                                </defs>
                                <line x1="20" y1="180" x2="380" y2="180" stroke="#1E293B" stroke-width="2"/>
                                <path d="M 40 180 Q 200 20 360 180" stroke="#EAB308" stroke-width="3" fill="none" stroke-dasharray="8,4"/>
                                <circle cx="40" cy="180" r="8" fill="#10B981"/>
                                <circle cx="200" cy="50" r="6" fill="#3B82F6"/>
                                <circle cx="360" cy="180" r="8" fill="#EF4444"/>
                                <line x1="40" y1="180" x2="100" y2="120" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowhead)"/>
                                <text x="40" y="195" font-size="12" fill="#1E293B">Launch</text>
                                <text x="185" y="40" font-size="12" fill="#1E293B">Max Height</text>
                                <text x="340" y="195" font-size="12" fill="#1E293B">Landing</text>
                            </svg>
                        </div>
                        <div class="diagram-caption">${visual.caption || 'Projectile Motion Path'}</div>
                    </div>
                `;
            default:
                return '';
        }
    }).join('');
}

function selectStaticOption(key) {
    if (guidedLearnState.questionAnswered) return;

    const content = guidedLearnState.staticContent;
    const subtopic = content.subtopics[guidedLearnState.currentSubtopicIndex];
    const objective = subtopic.objectives[guidedLearnState.currentObjectiveIndex];
    const question = objective.question;
    const correctAnswer = question.correctAnswer;
    const isCorrect = key === correctAnswer;

    // Mark as answered
    guidedLearnState.questionAnswered = true;
    const questionKey = `${guidedLearnState.currentSubtopicIndex}_${guidedLearnState.currentObjectiveIndex}`;
    if (!guidedLearnState.answeredQuestions) guidedLearnState.answeredQuestions = {};
    guidedLearnState.answeredQuestions[questionKey] = key;

    // Track weakness if wrong
    if (!isCorrect) {
        if (!guidedLearnState.weaknesses) guidedLearnState.weaknesses = [];
        guidedLearnState.weaknesses.push({
            subtopicIndex: guidedLearnState.currentSubtopicIndex,
            objectiveIndex: guidedLearnState.currentObjectiveIndex,
            subtopicName: subtopic.name,
            objectiveTitle: objective.title
        });
    }

    // Award points for completing objective (10 pts) + bonus for correct answer (5 pts)
    const objectivePoints = 10;
    const correctBonus = isCorrect ? 5 : 0;
    const totalPoints = objectivePoints + correctBonus;

    awardLearningPoints({
        subject: content.subject,
        topic: content.topic,
        subtopic: subtopic.name,
        event_type: isCorrect ? 'correct_answer' : 'objective_complete',
        points: totalPoints,
        description: `Completed: ${objective.title}${isCorrect ? ' (correct!)' : ''}`
    });

    // Update UI
    Object.keys(question.options).forEach(optKey => {
        const el = document.getElementById(`static-option-${optKey}`);
        if (!el) return;
        el.style.pointerEvents = 'none';
        if (optKey === correctAnswer) {
            el.classList.add('correct');
            el.innerHTML += '<i class="fas fa-check"></i>';
        } else if (optKey === key) {
            el.classList.add('incorrect');
            el.innerHTML += '<i class="fas fa-times"></i>';
        }
    });

    // Show feedback with points
    const feedbackEl = document.getElementById('static-feedback');
    feedbackEl.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = `
        <div class="feedback-header">
            <strong>Correct answer: ${correctAnswer}</strong>
            <span class="points-badge">+${totalPoints} pts</span>
        </div>
        <p><strong>Explanation:</strong> ${question.explanation}</p>
    `;

    // Enable next button
    const nextBtn = document.getElementById('static-next-btn');
    if (nextBtn) nextBtn.disabled = false;

    // Save progress with completed status
    saveStaticProgress('completed', isCorrect);
}

async function saveStaticProgress(status = 'in_progress', answeredCorrectly = null) {
    // Save to localStorage
    const progressKey = `guided_progress_${guidedLearnState.subject}_${guidedLearnState.topicName}`;
    const progress = {
        subtopicIndex: guidedLearnState.currentSubtopicIndex,
        objectiveIndex: guidedLearnState.currentObjectiveIndex,
        answered: guidedLearnState.answeredQuestions,
        weaknesses: guidedLearnState.weaknesses,
        hasStarted: true,
        lastUpdated: Date.now()
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));

    // Also save to backend database for cross-device sync and recommendations
    try {
        const result = await api.request('/guided-learn/save-progress', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic_index: guidedLearnState.currentSubtopicIndex,
                objective_index: guidedLearnState.currentObjectiveIndex,
                status: status,
                answered_correctly: answeredCorrectly,
                time_spent_seconds: 0
            }
        });

        // Show points notification if points were awarded
        if (result && result.points_awarded > 0) {
            showPointsNotification(result.points_awarded);
        }
    } catch (e) {
        console.log('Could not save progress to server:', e);
    }
}

function showPointsNotification(points) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `🎉 +${points} Points!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function goToNextStaticObjective() {
    const content = guidedLearnState.staticContent;
    const subtopic = content.subtopics[guidedLearnState.currentSubtopicIndex];

    // Move to next objective
    if (guidedLearnState.currentObjectiveIndex < subtopic.objectives.length - 1) {
        guidedLearnState.currentObjectiveIndex++;
        saveStaticProgress('in_progress');
        showStaticObjectiveLearning();
    } else if (guidedLearnState.currentSubtopicIndex < content.subtopics.length - 1) {
        // Show subtopic complete, then move to next subtopic
        showStaticSubtopicComplete();
    } else {
        // Topic complete!
        showStaticTopicComplete();
    }
}

function goToPrevStaticObjective() {
    if (guidedLearnState.currentObjectiveIndex > 0) {
        guidedLearnState.currentObjectiveIndex--;
        showStaticObjectiveLearning();
    } else if (guidedLearnState.currentSubtopicIndex > 0) {
        guidedLearnState.currentSubtopicIndex--;
        const prevSubtopic = guidedLearnState.staticContent.subtopics[guidedLearnState.currentSubtopicIndex];
        guidedLearnState.currentObjectiveIndex = prevSubtopic.objectives.length - 1;
        showStaticObjectiveLearning();
    }
}

function showStaticSubtopicComplete() {
    const user = authManager.getUser();
    const content = guidedLearnState.staticContent;
    const completedSubtopic = content.subtopics[guidedLearnState.currentSubtopicIndex];
    const nextSubtopic = content.subtopics[guidedLearnState.currentSubtopicIndex + 1];

    // Award subtopic completion bonus (25 pts)
    awardLearningPoints({
        subject: content.subject,
        topic: content.topic,
        subtopic: completedSubtopic.name,
        event_type: 'subtopic_complete',
        points: 25,
        description: `Completed subtopic: ${completedSubtopic.name}`
    });

    const pageContent = `
        <div class="static-learn-screen">
            <div class="subtopic-complete-card">
                <div class="complete-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Subtopic Complete!</h2>
                <p class="completed-name">${completedSubtopic.name}</p>
                
                <div class="points-earned-banner">
                    <i class="fas fa-star"></i>
                    <span>+25 Bonus Points!</span>
                </div>
                
                <div class="next-preview">
                    <h3>Up Next:</h3>
                    <p class="next-name">${nextSubtopic.name}</p>
                </div>
                
                <button class="btn btn-primary btn-lg" onclick="continueToNextStaticSubtopic()">
                    <i class="fas fa-arrow-right"></i> Continue
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function continueToNextStaticSubtopic() {
    guidedLearnState.currentSubtopicIndex++;
    guidedLearnState.currentObjectiveIndex = 0;
    saveStaticProgress('in_progress');
    showStaticObjectiveLearning();
}

async function showStaticTopicComplete() {
    const user = authManager.getUser();
    const content = guidedLearnState.staticContent;

    // Calculate stats
    const totalQuestions = Object.keys(guidedLearnState.answeredQuestions || {}).length;
    const weaknessCount = (guidedLearnState.weaknesses || []).length;
    const correctCount = totalQuestions - weaknessCount;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

    let totalObjectives = 0;
    content.subtopics.forEach(st => totalObjectives += st.objectives.length);

    const trophyClass = scorePercent >= 80 ? 'gold' : scorePercent >= 60 ? 'silver' : 'bronze';

    // Award topic completion bonus (50 pts) + performance bonus
    const baseBonus = 50;
    const performanceBonus = scorePercent >= 80 ? 30 : scorePercent >= 60 ? 15 : 0;
    const totalBonus = baseBonus + performanceBonus;

    await awardLearningPoints({
        subject: content.subject,
        topic: content.topic,
        subtopic: null,
        event_type: 'topic_complete',
        points: totalBonus,
        description: `Completed topic: ${content.topic} (${scorePercent}% score)`
    });

    // Get updated total points
    let totalPoints = 0;
    try {
        const pointsData = await api.request('/guided-learn/points', { requireAuth: true });
        totalPoints = pointsData.total_points || 0;
    } catch (e) {
        console.log('Could not fetch points:', e);
    }

    const pageContent = `
        <div class="static-learn-screen">
            <div class="topic-summary-card">
                <div class="summary-header">
                    <div class="trophy-icon ${trophyClass}">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h1>Topic Complete!</h1>
                    <h2>${content.topic}</h2>
                </div>
                
                <div class="points-earned-section">
                    <div class="big-points-badge">
                        <i class="fas fa-star"></i>
                        <span>+${totalBonus} Points!</span>
                    </div>
                    <p class="total-points-display">Total: <strong>${totalPoints}</strong> Points</p>
                </div>
                
                <div class="summary-stats">
                    <div class="stat-card">
                        <div class="stat-value">${totalObjectives}</div>
                        <div class="stat-label">Objectives Learned</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${correctCount}/${totalQuestions}</div>
                        <div class="stat-label">Questions Correct</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${scorePercent}%</div>
                        <div class="stat-label">Score</div>
                    </div>
                </div>
                
                ${weaknessCount > 0 ? `
                    <div class="weakness-section">
                        <h3><i class="fas fa-exclamation-triangle"></i> Areas to Review</h3>
                        <ul>
                            ${guidedLearnState.weaknesses.map((w, idx) => `
                                <li onclick="jumpToStaticWeakness(${idx})">
                                    <span>${w.subtopicName}: ${w.objectiveTitle}</span>
                                    <i class="fas fa-chevron-right"></i>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : `
                    <div class="perfect-section">
                        <i class="fas fa-star"></i>
                        <p>Perfect! You answered all questions correctly!</p>
                    </div>
                `}
                
                <!-- Practice Quiz Section -->
                <div class="practice-quiz-section">
                    <div class="quiz-section-header">
                        <div class="quiz-icon-wrapper">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="quiz-section-info">
                            <h3>Ready to Test Your Knowledge?</h3>
                            <p>Challenge yourself with real JAMB past questions on <strong>${content.topic}</strong></p>
                        </div>
                    </div>
                    
                    <div class="quiz-cards-container">
                        <div class="quiz-card quick" onclick="startTopicPracticeQuiz(10)">
                            <div class="quiz-card-icon">
                                <i class="fas fa-bolt"></i>
                            </div>
                            <div class="quiz-card-content">
                                <span class="quiz-card-count">10</span>
                                <span class="quiz-card-label">Questions</span>
                            </div>
                            <div class="quiz-card-tag">Quick Quiz</div>
                            <div class="quiz-card-time"><i class="fas fa-clock"></i> ~5 mins</div>
                        </div>
                        
                        <div class="quiz-card standard" onclick="startTopicPracticeQuiz(20)">
                            <div class="quiz-card-badge">RECOMMENDED</div>
                            <div class="quiz-card-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="quiz-card-content">
                                <span class="quiz-card-count">20</span>
                                <span class="quiz-card-label">Questions</span>
                            </div>
                            <div class="quiz-card-tag">Standard</div>
                            <div class="quiz-card-time"><i class="fas fa-clock"></i> ~10 mins</div>
                        </div>
                        
                        <div class="quiz-card full" onclick="startTopicPracticeQuiz(30)">
                            <div class="quiz-card-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="quiz-card-content">
                                <span class="quiz-card-count">30</span>
                                <span class="quiz-card-label">Questions</span>
                            </div>
                            <div class="quiz-card-tag">Full Practice</div>
                            <div class="quiz-card-time"><i class="fas fa-clock"></i> ~15 mins</div>
                        </div>
                    </div>
                    
                    <div class="custom-quiz-section">
                        <div class="custom-quiz-divider">
                            <span>or customize your quiz</span>
                        </div>
                        <div class="custom-quiz-controls">
                            <div class="custom-input-group">
                                <label for="quizCount">Number of questions:</label>
                                <input type="number" id="quizCount" min="5" max="50" value="15">
                            </div>
                            <button class="btn btn-primary btn-custom-start" onclick="startTopicPracticeQuiz(parseInt(document.getElementById('quizCount').value) || 10)">
                                <i class="fas fa-play-circle"></i> Start Custom Quiz
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="key-points-section">
                    <h3><i class="fas fa-key"></i> Key Points</h3>
                    <ul>
                        ${content.subtopics.slice(0, 5).map(st => `
                            <li><i class="fas fa-check"></i> ${st.name}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="summary-actions">
                    ${weaknessCount > 0 ? `
                        <button class="btn btn-outline" onclick="reviewStaticWeakAreas()">
                            <i class="fas fa-redo"></i> Review Weak Areas
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="restartStaticTopic()">
                        <i class="fas fa-sync"></i> Restart Topic
                    </button>
                    <button class="btn btn-secondary" onclick="showGuidedTopicList()">
                        <i class="fas fa-list"></i> Back to Topics
                    </button>
                </div>
            </div>
        </div>
    `;

    // Mark topic as complete in localStorage
    const progressKey = `guided_progress_${guidedLearnState.subject}_${guidedLearnState.topicName}`;
    const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    progress.completed = true;
    progress.completedAt = Date.now();
    progress.finalScore = scorePercent;
    localStorage.setItem(progressKey, JSON.stringify(progress));

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function jumpToStaticWeakness(weaknessIdx) {
    const weakness = guidedLearnState.weaknesses[weaknessIdx];
    guidedLearnState.currentSubtopicIndex = weakness.subtopicIndex;
    guidedLearnState.currentObjectiveIndex = weakness.objectiveIndex;
    showStaticObjectiveLearning();
}

function reviewStaticWeakAreas() {
    if (guidedLearnState.weaknesses && guidedLearnState.weaknesses.length > 0) {
        jumpToStaticWeakness(0);
    }
}

function restartStaticTopic() {
    // Clear progress
    const progressKey = `guided_progress_${guidedLearnState.subject}_${guidedLearnState.topicName}`;
    localStorage.removeItem(progressKey);

    // Reset state
    guidedLearnState.currentSubtopicIndex = 0;
    guidedLearnState.currentObjectiveIndex = 0;
    guidedLearnState.answeredQuestions = {};
    guidedLearnState.weaknesses = [];

    showStaticObjectiveLearning();
}

function handleStaticAskQuestion() {
    const input = document.getElementById('static-ask-input');
    const question = input.value.trim();
    if (!question) return;

    const responseEl = document.getElementById('static-ask-response');
    const content = guidedLearnState.staticContent;
    const subtopic = content.subtopics[guidedLearnState.currentSubtopicIndex];
    const objective = subtopic.objectives[guidedLearnState.currentObjectiveIndex];

    // Provide contextual help without AI
    responseEl.innerHTML = `
        <div class="ask-response-box">
            <p><strong>Your question:</strong> ${question}</p>
            <div class="response-note">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <p>This objective focuses on: <strong>${objective.title}</strong></p>
                    <p>Key point: ${objective.jambTip || 'Review the explanation above and pay attention to the worked example.'}</p>
                    ${objective.commonMistakes ? `<p><strong>Watch out for:</strong> ${objective.commonMistakes}</p>` : ''}
                </div>
            </div>
        </div>
    `;

    input.value = '';
}

async function loadTopicAndShowObjective() {
    showLoading('Loading...');

    try {
        const structure = await api.request(
            `/guided-learn/topic/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`,
            { requireAuth: true }
        );
        guidedLearnState.topicStructure = structure.topic;
        await showObjectiveLearning();
    } catch (error) {
        hideLoading();
        showToast('Failed to load: ' + error.message, 'error');
    }
}

// ============================================================
// OBJECTIVE LEARNING PAGE
// ============================================================

async function showObjectiveLearning() {
    showLoading('Loading objective...');

    try {
        const data = await api.request(
            `/guided-learn/objective/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}/${guidedLearnState.currentSubtopicIndex}/${guidedLearnState.currentObjectiveIndex}`,
            { requireAuth: true }
        );

        guidedLearnState.currentObjective = data;
        guidedLearnState.questions = data.questions || [];
        guidedLearnState.currentQuestionIndex = 0;
        guidedLearnState.questionAnswered = false;
        guidedLearnState.timeStarted = Date.now();

        const user = authManager.getUser();
        const nav = data.navigation;

        // Parse explanation data - handle both new rich format and legacy
        let explanation = data.explanation;
        if (typeof explanation.explanation === 'string') {
            try {
                explanation = { ...data.explanation, ...JSON.parse(explanation.explanation) };
            } catch (e) {
                // Keep as is
            }
        }

        // Build the rich explanation content
        const explanationHTML = buildRichExplanation(explanation);

        const content = `
            <div class="objective-learning-screen enhanced">
                <!-- Header -->
                <div class="objective-header">
                    <div class="breadcrumb">
                        <span onclick="showGuidedTopicList()" class="clickable">${guidedLearnState.subject}</span>
                        <i class="fas fa-chevron-right"></i>
                        <span onclick="showTopicOverview()" class="clickable">${guidedLearnState.topicName}</span>
                        <i class="fas fa-chevron-right"></i>
                        <span class="current">${data.subtopic_name}</span>
                    </div>
                    <div class="progress-indicator">
                        <span class="progress-text">${nav.current_position} of ${nav.total_objectives}</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${(nav.current_position / nav.total_objectives) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Objective Title -->
                <div class="objective-title-box">
                    <div class="objective-title-left">
                        <span class="objective-badge"><i class="fas fa-bullseye"></i> Objective ${nav.current_position}</span>
                        <h2>${data.objective_text}</h2>
                    </div>
                </div>

                <!-- Step Indicator -->
                <div class="learn-step-indicator">
                    <div class="step-item active">
                        <div class="step-circle active"><i class="fas fa-book-open"></i></div>
                        <span>Learn</span>
                    </div>
                    <div class="step-connector ${guidedLearnState.questions.length > 0 ? '' : 'inactive'}"></div>
                    <div class="step-item ${guidedLearnState.questions.length > 0 ? '' : 'inactive'}">
                        <div class="step-circle"><i class="fas fa-pencil-alt"></i></div>
                        <span>Practice</span>
                    </div>
                </div>
                
                <!-- Explanation Content (Full Width) -->
                <div class="learning-content-flow">
                    
                    <!-- AI Explanation Section (Collapsible) -->
                    <div class="content-section explanation-section" id="explanation-section">
                        <div class="section-header-bar" onclick="toggleExplanationSection()">
                            <div class="section-title">
                                <i class="fas fa-lightbulb"></i>
                                <h3>Explanation</h3>
                            </div>
                            <div class="section-controls">
                                <button class="btn-icon" id="re-explain-btn" onclick="event.stopPropagation(); requestReExplanation()" title="Get a different explanation">
                                    <i class="fas fa-sync-alt"></i> Re-explain
                                </button>
                                <i class="fas fa-chevron-up section-toggle" id="explanation-toggle"></i>
                            </div>
                        </div>
                        <div class="section-content" id="explanation-content">
                            ${explanationHTML}
                        </div>
                    </div>
                    
                    <!-- Ask Question Section -->
                    <div class="content-section ask-section">
                        <div class="ask-input-row">
                            <div class="ask-avatar"><i class="fas fa-question-circle"></i></div>
                            <input type="text" id="student-question-input" 
                                   placeholder="Ask AI about this topic... e.g. 'Why does this happen?'"
                                   onkeypress="if(event.key==='Enter') submitStudentQuestion()">
                            <button class="btn btn-primary btn-ask" onclick="submitStudentQuestion()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="qa-response-area"></div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="objective-navigation step-navigation">
                    <button class="btn btn-outline" ${!nav.has_prev ? 'disabled' : ''} onclick="goToPrevObjective()">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="btn btn-outline" onclick="showTopicOverview()">
                        <i class="fas fa-list"></i> Overview
                    </button>
                    ${guidedLearnState.questions.length > 0 ? `
                        <button class="btn btn-primary btn-practice-cta" onclick="showObjectivePractice()">
                            <i class="fas fa-pencil-alt"></i> Practice
                        </button>
                    ` : `
                        <button class="btn btn-primary" id="next-btn" onclick="goToNextObjective()">
                            ${nav.has_next ? (nav.subtopic_complete ? 'Finish Subtopic <i class="fas fa-flag-checkered"></i>' : 'Next <i class="fas fa-arrow-right"></i>') : 'Complete Topic <i class="fas fa-trophy"></i>'}
                        </button>
                    `}
                </div>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        hideLoading();

        // Auto-save progress as started
        saveObjectiveProgress('in_progress');

    } catch (error) {
        hideLoading();
        showToast('Failed to load objective: ' + error.message, 'error');
    }
}

function showObjectivePractice() {
    const user = authManager.getUser();
    const data = guidedLearnState.currentObjective;
    const nav = data.navigation;

    const pageContent = `
        <div class="objective-learning-screen enhanced">
            <!-- Header -->
            <div class="objective-header">
                <div class="breadcrumb">
                    <span onclick="showGuidedTopicList()" class="clickable">${guidedLearnState.subject}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span onclick="showTopicOverview()" class="clickable">${guidedLearnState.topicName}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span class="current">${data.subtopic_name}</span>
                </div>
                <div class="progress-indicator">
                    <span class="progress-text">${nav.current_position} of ${nav.total_objectives}</span>
                    <div class="mini-progress">
                        <div class="mini-progress-fill" style="width: ${(nav.current_position / nav.total_objectives) * 100}%"></div>
                    </div>
                </div>
            </div>

            <!-- Step Indicator -->
            <div class="learn-step-indicator">
                <div class="step-item completed" onclick="showObjectiveLearning()" title="Back to Explanation">
                    <div class="step-circle completed"><i class="fas fa-check"></i></div>
                    <span>Learn</span>
                </div>
                <div class="step-connector active"></div>
                <div class="step-item active">
                    <div class="step-circle active"><i class="fas fa-pencil-alt"></i></div>
                    <span>Practice</span>
                </div>
            </div>

            <!-- Practice Header -->
            <div class="objective-title-box practice-banner">
                <div class="objective-title-left">
                    <span class="objective-badge practice-badge"><i class="fas fa-brain"></i> Test Your Understanding</span>
                    <h2>${data.objective_text}</h2>
                </div>
            </div>

            <!-- Full-Width Question -->
            <div class="practice-full">
                <div class="content-section question-section-full">
                    <div class="section-header-bar">
                        <div class="section-title">
                            <i class="fas fa-question-circle"></i>
                            <h3>Practice Question</h3>
                            ${guidedLearnState.questions[0] && guidedLearnState.questions[0].year ? `<span class="question-badge">JAMB ${guidedLearnState.questions[0].year}</span>` : '<span class="question-badge">JAMB Style</span>'}
                        </div>
                    </div>
                    <div class="section-content" id="question-area">
                        ${renderObjectiveQuestion()}
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="objective-navigation step-navigation">
                <button class="btn btn-outline" onclick="showObjectiveLearning()">
                    <i class="fas fa-arrow-left"></i> Back to Explanation
                </button>
                <button class="btn btn-outline" onclick="showTopicOverview()">
                    <i class="fas fa-list"></i> Overview
                </button>
                <button class="btn btn-primary" id="next-btn" onclick="goToNextObjective()" disabled>
                    ${nav.has_next ? (nav.subtopic_complete ? 'Finish Subtopic <i class="fas fa-flag-checkered"></i>' : 'Next <i class="fas fa-arrow-right"></i>') : 'Complete Topic <i class="fas fa-trophy"></i>'}
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}


// Build rich HTML explanation from AI response
function buildRichExplanation(explanation) {
    let html = '';

    // Main explanation
    if (explanation.explanation_html) {
        html += `<div class="rich-explanation-body">${explanation.explanation_html}</div>`;
    } else if (explanation.explanation) {
        html += `<div class="rich-explanation-body"><p>${explanation.explanation}</p></div>`;
    }

    // SVG Diagram
    if (explanation.svg_diagram) {
        html += `
            <div class="diagram-container">
                <div class="diagram-wrapper">
                    ${explanation.svg_diagram}
                </div>
                ${explanation.diagram_caption ? `<p class="diagram-caption"><i class="fas fa-info-circle"></i> ${explanation.diagram_caption}</p>` : ''}
            </div>
        `;
    }

    // Key Points
    if (explanation.key_points && explanation.key_points.length > 0) {
        html += `
            <div class="key-points-box">
                <h4><i class="fas fa-key"></i> Key Points</h4>
                <ul>
                    ${explanation.key_points.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Worked Example
    if (explanation.worked_example) {
        html += `
            <div class="worked-example-box">
                <h4><i class="fas fa-flask"></i> Worked Example</h4>
                <div class="example-problem">
                    <strong>Problem:</strong> ${explanation.worked_example.problem || ''}
                </div>
                ${explanation.worked_example.solution_html ? `
                    <div class="example-solution">
                        <strong>Solution:</strong>
                        ${explanation.worked_example.solution_html}
                    </div>
                ` : ''}
            </div>
        `;
    } else if (explanation.example) {
        html += `
            <div class="worked-example-box">
                <h4><i class="fas fa-flask"></i> Example</h4>
                <p>${explanation.example}</p>
            </div>
        `;
    }

    // Common Mistakes
    if (explanation.common_mistakes && explanation.common_mistakes.length > 0) {
        html += `
            <div class="common-mistakes-box">
                <h4><i class="fas fa-exclamation-triangle"></i> Common Mistakes</h4>
                <ul>
                    ${explanation.common_mistakes.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // JAMB Tip
    if (explanation.jamb_tip) {
        html += `
            <div class="jamb-tip-box">
                <h4><i class="fas fa-graduation-cap"></i> JAMB Tip</h4>
                <p>${explanation.jamb_tip}</p>
            </div>
        `;
    }

    // Summary
    if (explanation.summary) {
        html += `
            <div class="summary-box">
                <h4><i class="fas fa-compress-alt"></i> Summary</h4>
                <p>${explanation.summary}</p>
            </div>
        `;
    }

    return html;
}


// Toggle explanation section visibility
function toggleExplanationSection() {
    const content = document.getElementById('explanation-content');
    const toggle = document.getElementById('explanation-toggle');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('fa-chevron-down');
        toggle.classList.add('fa-chevron-up');
    } else {
        content.classList.add('collapsed');
        toggle.classList.remove('fa-chevron-up');
        toggle.classList.add('fa-chevron-down');
    }
}


// Request a re-explanation with different teaching approach
async function requestReExplanation() {
    const btn = document.getElementById('re-explain-btn');
    const contentEl = document.getElementById('explanation-content');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
        const data = guidedLearnState.currentObjective;
        const result = await api.request('/guided-learn/re-explain', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic: data.subtopic_name,
                objective: data.objective_text
            }
        });

        if (result.explanation) {
            const newHTML = buildRichExplanation(result.explanation);
            contentEl.innerHTML = newHTML;

            // Ensure section is expanded
            contentEl.classList.remove('collapsed');
            document.getElementById('explanation-toggle').classList.remove('fa-chevron-down');
            document.getElementById('explanation-toggle').classList.add('fa-chevron-up');

            showToast('Fresh explanation generated!', 'success');
        }

    } catch (error) {
        showToast('Failed to re-explain: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Re-explain';
    }
}


// Save progress helper
async function saveObjectiveProgress(status, answeredCorrectly = null) {
    try {
        const timeSpent = Math.round((Date.now() - guidedLearnState.timeStarted) / 1000);
        await api.request('/guided-learn/save-progress', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic_index: guidedLearnState.currentSubtopicIndex,
                objective_index: guidedLearnState.currentObjectiveIndex,
                status: status,
                answered_correctly: answeredCorrectly,
                time_spent_seconds: timeSpent
            }
        });
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

function renderObjectiveQuestion() {
    if (guidedLearnState.questions.length === 0) return '';

    const q = guidedLearnState.questions[guidedLearnState.currentQuestionIndex];

    return `
        <div class="objective-question">
            ${q.passage ? `
                <div class="passage-box">
                    <h4><i class="fas fa-book-open"></i> Passage</h4>
                    <p>${q.passage}</p>
                </div>
            ` : ''}
            ${q.image_path ? `
                <div class="question-image">
                    <img src="${API_CONFIG.BASE_URL}/static/${q.image_path}" alt="Question image" onerror="this.style.display='none'">
                </div>
            ` : ''}
            <p class="question-text">${q.question}</p>
            <div class="options-list">
                ${Object.entries(q.options).map(([key, text]) => `
                    <div class="option-item" id="option-${key}" onclick="selectObjectiveAnswer('${key}')">
                        <span class="option-key">${key}</span>
                        <span class="option-text">${text}</span>
                    </div>
                `).join('')}
            </div>
            <div id="answer-feedback" class="answer-feedback hidden"></div>
        </div>
    `;
}

async function selectObjectiveAnswer(key) {
    if (guidedLearnState.questionAnswered) return;

    const q = guidedLearnState.questions[guidedLearnState.currentQuestionIndex];
    guidedLearnState.questionAnswered = true;

    // Highlight selected
    document.querySelectorAll('.option-item').forEach(el => {
        el.classList.remove('selected', 'correct', 'incorrect');
    });

    const selectedEl = document.getElementById(`option-${key}`);
    selectedEl.classList.add('selected');

    // Show loading
    const feedbackEl = document.getElementById('answer-feedback');
    feedbackEl.classList.remove('hidden');
    feedbackEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

    try {
        // Submit answer
        const result = await api.request('/guided-learn/answer-question', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic: guidedLearnState.currentObjective.subtopic_name,
                objective: guidedLearnState.currentObjective.objective_text,
                question_id: q.question_id,
                user_answer: key
            }
        });

        // Show result
        if (result.is_correct) {
            selectedEl.classList.add('correct');
            feedbackEl.className = 'answer-feedback correct';
            feedbackEl.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Correct!</strong>
                <p>${result.explanation}</p>
            `;
        } else {
            selectedEl.classList.add('incorrect');
            document.getElementById(`option-${result.correct_answer}`).classList.add('correct');
            feedbackEl.className = 'answer-feedback incorrect';
            feedbackEl.innerHTML = `
                <i class="fas fa-times-circle"></i>
                <strong>Not quite right</strong>
                <p>${result.explanation}</p>
            `;
        }

        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.disabled = false;

        // Save progress
        await saveObjectiveProgress('completed', result.is_correct);

    } catch (error) {
        feedbackEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${error.message}`;
    }
}

async function submitStudentQuestion() {
    const input = document.getElementById('student-question-input');
    const question = input.value.trim();
    if (!question) return;

    const responseArea = document.getElementById('qa-response-area');
    responseArea.innerHTML = `
        <div class="qa-loading">
            <i class="fas fa-spinner fa-spin"></i> AI is thinking...
        </div>
    `;
    input.value = '';

    try {
        // Get explanation context
        let explanationContext = '';
        if (guidedLearnState.currentObjective && guidedLearnState.currentObjective.explanation) {
            const exp = guidedLearnState.currentObjective.explanation;
            if (typeof exp.explanation === 'string') {
                try {
                    const parsed = JSON.parse(exp.explanation);
                    explanationContext = parsed.explanation || '';
                } catch (e) {
                    explanationContext = exp.explanation;
                }
            }
        }

        const result = await api.request('/guided-learn/ask-question', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic: guidedLearnState.currentObjective.subtopic_name,
                objective: guidedLearnState.currentObjective.objective_text,
                explanation_context: explanationContext,
                question: question
            }
        });

        responseArea.innerHTML = `
            <div class="qa-exchange">
                <div class="qa-question">
                    <i class="fas fa-user"></i> ${question}
                </div>
                <div class="qa-answer">
                    <i class="fas fa-robot"></i> ${result.response}
                    ${result.cached ? '<span class="cached-badge">cached</span>' : ''}
                </div>
            </div>
        `;

    } catch (error) {
        responseArea.innerHTML = `
            <div class="qa-error">
                <i class="fas fa-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

// ============================================================
// NAVIGATION
// ============================================================

async function goToNextObjective() {
    const nav = guidedLearnState.currentObjective.navigation;

    if (!nav.has_next) {
        await showTopicComplete();
        return;
    }

    if (nav.subtopic_complete) {
        await showSubtopicComplete(nav.next_subtopic_index, nav.next_objective_index);
        return;
    }

    guidedLearnState.currentSubtopicIndex = nav.next_subtopic_index;
    guidedLearnState.currentObjectiveIndex = nav.next_objective_index;
    await showObjectiveLearning();
}

async function goToPrevObjective() {
    const st_idx = guidedLearnState.currentSubtopicIndex;
    const obj_idx = guidedLearnState.currentObjectiveIndex;

    if (obj_idx > 0) {
        guidedLearnState.currentObjectiveIndex = obj_idx - 1;
    } else if (st_idx > 0) {
        guidedLearnState.currentSubtopicIndex = st_idx - 1;
        const prevSubtopic = guidedLearnState.topicStructure.subtopics[st_idx - 1];
        guidedLearnState.currentObjectiveIndex = prevSubtopic.objectives.length - 1;
    }

    await showObjectiveLearning();
}

async function showSubtopicComplete(nextSubtopicIndex, nextObjectiveIndex) {
    const user = authManager.getUser();
    const currentSubtopic = guidedLearnState.topicStructure.subtopics[guidedLearnState.currentSubtopicIndex];
    const nextSubtopic = guidedLearnState.topicStructure.subtopics[nextSubtopicIndex];

    const content = `
        <div class="subtopic-complete-screen">
            <div class="complete-animation">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Subtopic Complete!</h2>
            <p>You've completed all objectives in:</p>
            <div class="completed-name">${currentSubtopic.name}</div>
            
            <div class="subtopic-quiz-prompt">
                <h3><i class="fas fa-brain"></i> Test Your Knowledge</h3>
                <p>Take a quick quiz on what you just learned before moving on.</p>
                <button class="btn btn-primary btn-lg" onclick="showSubtopicQuiz(${nextSubtopicIndex}, ${nextObjectiveIndex})">
                    <i class="fas fa-clipboard-check"></i> Take Quiz
                </button>
            </div>
            
            <div class="skip-quiz">
                <button class="btn btn-outline" onclick="continueToNextSubtopic(${nextSubtopicIndex}, ${nextObjectiveIndex})">
                    Skip &amp; Continue to ${nextSubtopic.name} <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

function continueToNextSubtopic(stIdx, objIdx) {
    guidedLearnState.currentSubtopicIndex = stIdx;
    guidedLearnState.currentObjectiveIndex = objIdx;
    showObjectiveLearning();
}


// ============================================================
// SUBTOPIC QUIZ 
// ============================================================

async function showSubtopicQuiz(nextSubtopicIndex, nextObjectiveIndex) {
    showLoading('Generating quiz...');

    const user = authManager.getUser();
    const currentSubtopic = guidedLearnState.topicStructure.subtopics[guidedLearnState.currentSubtopicIndex];
    const nextSubtopic = guidedLearnState.topicStructure.subtopics[nextSubtopicIndex];

    try {
        const quizData = await api.request(
            `/guided-learn/subtopic-quiz/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}/${guidedLearnState.currentSubtopicIndex}`,
            { requireAuth: true }
        );

        const questions = quizData.questions || [];

        if (questions.length === 0) {
            showToast('No quiz questions available. Continuing...', 'info');
            continueToNextSubtopic(nextSubtopicIndex, nextObjectiveIndex);
            return;
        }

        // Store quiz state
        guidedLearnState.subtopicQuiz = {
            questions: questions,
            currentIndex: 0,
            answers: {},
            score: 0,
            total: questions.length,
            nextSubtopicIndex: nextSubtopicIndex,
            nextObjectiveIndex: nextObjectiveIndex,
            completed: false
        };

        const content = `
            <div class="subtopic-quiz-screen">
                <div class="quiz-header">
                    <div class="quiz-title">
                        <i class="fas fa-clipboard-check"></i>
                        <h2>${currentSubtopic.name} - Quiz</h2>
                    </div>
                    <div class="quiz-progress">
                        <span id="quiz-counter">Question 1 of ${questions.length}</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" id="quiz-progress-bar" style="width: ${(1 / questions.length) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-body" id="quiz-body">
                    ${renderSubtopicQuizQuestion(0)}
                </div>
                
                <div class="quiz-footer" id="quiz-footer">
                    <button class="btn btn-outline" onclick="continueToNextSubtopic(${nextSubtopicIndex}, ${nextObjectiveIndex})">
                        <i class="fas fa-times"></i> Skip Quiz
                    </button>
                    <button class="btn btn-primary" id="quiz-next-btn" disabled onclick="nextQuizQuestion()">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        hideLoading();

    } catch (error) {
        hideLoading();
        showToast('Failed to load quiz: ' + error.message, 'error');
        continueToNextSubtopic(nextSubtopicIndex, nextObjectiveIndex);
    }
}

function renderSubtopicQuizQuestion(index) {
    const quiz = guidedLearnState.subtopicQuiz;
    const q = quiz.questions[index];
    const optionKeys = ['A', 'B', 'C', 'D'];

    // Handle both object and array options
    let options = {};
    if (Array.isArray(q.options)) {
        q.options.forEach((opt, i) => {
            if (i < optionKeys.length) options[optionKeys[i]] = opt;
        });
    } else {
        options = q.options;
    }

    return `
        <div class="quiz-question-card">
            ${q.objective ? `<div class="quiz-objective-tag"><i class="fas fa-bullseye"></i> ${q.objective}</div>` : ''}
            <p class="quiz-question-text">${q.question}</p>
            <div class="quiz-options">
                ${Object.entries(options).map(([key, text]) => `
                    <div class="quiz-option" id="quiz-opt-${key}" onclick="selectQuizAnswer('${key}')">
                        <span class="option-key">${key}</span>
                        <span class="option-text">${text}</span>
                    </div>
                `).join('')}
            </div>
            <div id="quiz-feedback" class="quiz-feedback hidden"></div>
        </div>
    `;
}

function selectQuizAnswer(key) {
    const quiz = guidedLearnState.subtopicQuiz;
    if (quiz.answers[quiz.currentIndex] !== undefined) return; // Already answered

    const q = quiz.questions[quiz.currentIndex];
    quiz.answers[quiz.currentIndex] = key;

    // Determine correct answer
    const correctAnswer = q.correct_answer || q.answer;
    const isCorrect = key.toUpperCase() === correctAnswer.toUpperCase();

    if (isCorrect) quiz.score++;

    // Highlight options
    document.querySelectorAll('.quiz-option').forEach(el => el.classList.add('disabled'));

    const selectedEl = document.getElementById(`quiz-opt-${key}`);
    selectedEl.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        const correctEl = document.getElementById(`quiz-opt-${correctAnswer}`);
        if (correctEl) correctEl.classList.add('correct');
    }

    // Show feedback
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.remove('hidden');
    feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    const explanation = q.explanation || '';
    feedbackEl.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}</div>
        <div class="feedback-text">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            ${explanation ? `<p>${explanation}</p>` : ''}
        </div>
    `;

    // Enable next button
    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = false;

    // Change button text if last question
    if (quiz.currentIndex === quiz.total - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-chart-bar"></i>';
    }
}

function nextQuizQuestion() {
    const quiz = guidedLearnState.subtopicQuiz;

    if (quiz.currentIndex >= quiz.total - 1) {
        // Show results
        showQuizResults();
        return;
    }

    quiz.currentIndex++;

    // Update counter and progress
    document.getElementById('quiz-counter').textContent = `Question ${quiz.currentIndex + 1} of ${quiz.total}`;
    document.getElementById('quiz-progress-bar').style.width = `${((quiz.currentIndex + 1) / quiz.total) * 100}%`;

    // Render next question
    document.getElementById('quiz-body').innerHTML = renderSubtopicQuizQuestion(quiz.currentIndex);

    // Disable next button until answered
    document.getElementById('quiz-next-btn').disabled = true;
    document.getElementById('quiz-next-btn').innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
}

function showQuizResults() {
    const quiz = guidedLearnState.subtopicQuiz;
    const percentage = Math.round((quiz.score / quiz.total) * 100);
    const currentSubtopic = guidedLearnState.topicStructure.subtopics[guidedLearnState.currentSubtopicIndex];
    const nextSubtopic = guidedLearnState.topicStructure.subtopics[quiz.nextSubtopicIndex];

    let gradeClass = 'poor';
    let gradeIcon = 'fa-sad-tear';
    let gradeMessage = 'Keep practicing!';

    if (percentage >= 80) {
        gradeClass = 'excellent';
        gradeIcon = 'fa-trophy';
        gradeMessage = 'Excellent work!';
    } else if (percentage >= 60) {
        gradeClass = 'good';
        gradeIcon = 'fa-thumbs-up';
        gradeMessage = 'Good job!';
    } else if (percentage >= 40) {
        gradeClass = 'fair';
        gradeIcon = 'fa-meh';
        gradeMessage = 'Not bad, but room to improve.';
    }

    const body = document.getElementById('quiz-body');
    body.innerHTML = `
        <div class="quiz-results">
            <div class="result-icon ${gradeClass}">
                <i class="fas ${gradeIcon}"></i>
            </div>
            <h2>${gradeMessage}</h2>
            <div class="result-score ${gradeClass}">
                <span class="score-number">${quiz.score}</span>
                <span class="score-divider">/</span>
                <span class="score-total">${quiz.total}</span>
            </div>
            <p class="score-percentage">${percentage}%</p>
            <p class="result-subtopic">${currentSubtopic.name} Quiz</p>
            
            <div class="quiz-question-review">
                ${quiz.questions.map((q, i) => {
        const correctAnswer = q.correct_answer || q.answer;
        const userAnswer = quiz.answers[i];
        const isCorrect = userAnswer && userAnswer.toUpperCase() === correctAnswer.toUpperCase();
        return `
                        <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                            <span class="review-num">${i + 1}</span>
                            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;

    const footer = document.getElementById('quiz-footer');
    footer.innerHTML = `
        <button class="btn btn-outline" onclick="showSubtopicQuiz(${quiz.nextSubtopicIndex}, ${quiz.nextObjectiveIndex})">
            <i class="fas fa-redo"></i> Retake Quiz
        </button>
        <button class="btn btn-primary" onclick="continueToNextSubtopic(${quiz.nextSubtopicIndex}, ${quiz.nextObjectiveIndex})">
            Continue to ${nextSubtopic.name} <i class="fas fa-arrow-right"></i>
        </button>
    `;
}

async function showTopicComplete() {
    const user = authManager.getUser();

    // Get weaknesses
    let weaknesses = [];
    try {
        const weakData = await api.request(`/guided-learn/weaknesses/${encodeURIComponent(guidedLearnState.subject)}`, { requireAuth: true });
        weaknesses = weakData.weaknesses.filter(w => w.topic === guidedLearnState.topicName);
    } catch (e) { }

    const content = `
        <div class="topic-complete-screen">
            <div class="complete-animation big">
                <i class="fas fa-trophy"></i>
            </div>
            <h1>Topic Mastered!</h1>
            <p>You've completed all objectives in:</p>
            <div class="completed-topic-name">${guidedLearnState.topicName}</div>
            
            ${weaknesses.length > 0 ? `
                <div class="weakness-summary">
                    <h3><i class="fas fa-exclamation-triangle"></i> Areas to Review</h3>
                    <p>${weaknesses.length} objective(s) need more practice</p>
                    <button class="btn btn-warning" onclick="reviewWeaknesses()">
                        <i class="fas fa-redo"></i> Review Weak Areas
                    </button>
                </div>
            ` : `
                <div class="perfect-score">
                    <i class="fas fa-star"></i>
                    <p>Perfect! You answered all questions correctly!</p>
                </div>
            `}
            
            <div class="complete-actions">
                <button class="btn btn-outline" onclick="showGuidedTopicList()">
                    <i class="fas fa-list"></i> Choose Another Topic
                </button>
                <button class="btn btn-primary" onclick="startTopicPractice()">
                    <i class="fas fa-play"></i> Practice Questions
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

function reviewWeaknesses() {
    // Go back to first objective and start over
    guidedLearnState.currentSubtopicIndex = 0;
    guidedLearnState.currentObjectiveIndex = 0;
    showObjectiveLearning();
}

function startTopicPractice() {
    showTopicOverview();
}

async function showTopicOverview() {
    const user = authManager.getUser();
    const topic = guidedLearnState.topicStructure;

    const content = `
        <div class="topic-overview-screen">
            <div class="overview-header">
                <button class="btn btn-outline" onclick="showObjectiveLearning()">
                    <i class="fas fa-arrow-left"></i> Back to Learning
                </button>
                <h2>${topic.name}</h2>
            </div>
            
            <div class="subtopics-overview">
                ${topic.subtopics.map((st, stIdx) => `
                    <div class="subtopic-overview-card">
                        <div class="subtopic-header">
                            <h3>${st.name}</h3>
                            <span class="completed-badge">${st.completed_count}/${st.objectives.length}</span>
                        </div>
                        <div class="objectives-list">
                            ${st.objectives.map((obj, objIdx) => `
                                <div class="objective-item ${obj.status}" 
                                     onclick="jumpToObjective(${stIdx}, ${objIdx})">
                                    <span class="status-icon">
                                        ${obj.status === 'completed' ? '<i class="fas fa-check-circle"></i>' :
            obj.status === 'in_progress' ? '<i class="fas fa-play-circle"></i>' :
                '<i class="fas fa-circle"></i>'}
                                    </span>
                                    <span class="objective-text">${obj.text}</span>
                                    ${obj.is_weakness ? '<span class="weakness-icon"><i class="fas fa-exclamation-triangle"></i></span>' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

function jumpToObjective(stIdx, objIdx) {
    guidedLearnState.currentSubtopicIndex = stIdx;
    guidedLearnState.currentObjectiveIndex = objIdx;
    showObjectiveLearning();
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSubjectIcon(subject) {
    const icons = {
        'Physics': '⚛️',
        'Mathematics': '📐',
        'English': '📚',
        'Biology': '🧬',
        'Chemistry': '🧪',
        'Economics': '📊',
        'Government': '🏛️',
        'Literature': '📖',
        'Commerce': '💼',
        'Accounting': '📋',
    };
    return icons[subject] || '📘';
}

// ============================================================
// TOPIC PRACTICE QUIZ FUNCTIONS
// ============================================================

let topicQuizState = {
    questions: [],
    currentIndex: 0,
    answers: {},
    startTime: null,
    subject: null,
    topic: null
};

async function startTopicPracticeQuiz(count) {
    showLoading(`Loading ${count} JAMB questions...`);

    const subject = guidedLearnState.subject;
    const topic = guidedLearnState.topicName;

    try {
        // Fetch questions from database for this topic
        const data = await api.request(
            `/guided-learn/questions/by-topic?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&limit=${count}`,
            { requireAuth: true }
        );

        if (!data.questions || data.questions.length === 0) {
            hideLoading();
            showToast('No JAMB questions found for this topic. Try a different quiz size.', 'warning');
            return;
        }

        topicQuizState = {
            questions: data.questions,
            currentIndex: 0,
            answers: {},
            startTime: Date.now(),
            subject: subject,
            topic: topic
        };

        hideLoading();
        showTopicQuizQuestion();

    } catch (error) {
        hideLoading();
        showToast('Failed to load questions: ' + error.message, 'error');
    }
}

function showTopicQuizQuestion() {
    const user = authManager.getUser();
    const { questions, currentIndex, answers } = topicQuizState;
    const question = questions[currentIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((currentIndex / totalQuestions) * 100);

    // Check if already answered
    const previousAnswer = answers[question.id];

    const pageContent = `
        <div class="topic-quiz-screen">
            <div class="quiz-header">
                <div class="quiz-nav">
                    <button class="btn btn-outline btn-sm" onclick="exitTopicQuiz()">
                        <i class="fas fa-times"></i> Exit Quiz
                    </button>
                    <div class="quiz-title">
                        <h2>${topicQuizState.topic}</h2>
                        <span class="quiz-subtitle">${topicQuizState.subject} Practice</span>
                    </div>
                    <div class="quiz-progress-info">
                        <span>${currentIndex + 1} / ${totalQuestions}</span>
                    </div>
                </div>
                <div class="quiz-progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="quiz-question-card">
                    ${question.year ? `<div class="question-year">JAMB ${question.year}</div>` : ''}
                    <div class="question-number">Question ${currentIndex + 1}</div>
                    <div class="question-text">${question.question_text}</div>
                    
                    ${question.image_path ? `
                        <div class="question-image">
                            <img src="${API_CONFIG.BASE_URL}/static/${question.image_path}" alt="Question diagram" onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                    
                    <div class="quiz-options" id="quiz-options">
                        ${['A', 'B', 'C', 'D'].map(key => {
        const optionText = question.options?.[key] || question[`option_${key.toLowerCase()}`] || '';
        if (!optionText) return '';

        let optionClass = 'quiz-option';
        if (previousAnswer) {
            if (key === question.correct_option_key) {
                optionClass += ' correct';
            } else if (key === previousAnswer) {
                optionClass += ' incorrect';
            }
        }

        return `
                                <div class="${optionClass}" 
                                     onclick="selectTopicQuizOption('${key}')"
                                     data-key="${key}"
                                     ${previousAnswer ? 'style="pointer-events: none;"' : ''}>
                                    <span class="option-key">${key}</span>
                                    <span class="option-text">${optionText}</span>
                                </div>
                            `;
    }).join('')}
                    </div>
                    
                    <div class="quiz-feedback ${previousAnswer ? '' : 'hidden'}" id="quiz-feedback">
                        ${previousAnswer ? (previousAnswer === question.correct_option_key ? `
                            <div class="feedback-correct">
                                <i class="fas fa-check-circle"></i> Correct!
                            </div>
                        ` : `
                            <div class="feedback-incorrect">
                                <i class="fas fa-times-circle"></i> Incorrect. The answer is ${question.correct_option_key}.
                            </div>
                        `) : ''}
                        ${question.explanation && previousAnswer ? `
                            <div class="feedback-explanation">
                                <strong>Explanation:</strong> ${question.explanation}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="quiz-navigation">
                <button class="btn btn-outline" onclick="prevTopicQuizQuestion()" ${currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                
                <div class="quiz-dots">
                    ${questions.slice(Math.max(0, currentIndex - 3), currentIndex + 4).map((q, i) => {
        const actualIdx = Math.max(0, currentIndex - 3) + i;
        const isAnswered = answers[questions[actualIdx].id];
        const isCurrent = actualIdx === currentIndex;
        return `<span class="quiz-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}" 
                                      onclick="jumpToTopicQuizQuestion(${actualIdx})"></span>`;
    }).join('')}
                </div>
                
                ${currentIndex === totalQuestions - 1 ? `
                    <button class="btn btn-primary" onclick="finishTopicQuiz()">
                        <i class="fas fa-flag-checkered"></i> Finish Quiz
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="nextTopicQuizQuestion()">
                        Next <i class="fas fa-chevron-right"></i>
                    </button>
                `}
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function selectTopicQuizOption(key) {
    const question = topicQuizState.questions[topicQuizState.currentIndex];

    // Already answered
    if (topicQuizState.answers[question.id]) return;

    // Store answer
    topicQuizState.answers[question.id] = key;

    // Update UI
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        const optKey = opt.dataset.key;
        if (optKey === question.correct_option_key) {
            opt.classList.add('correct');
        } else if (optKey === key && key !== question.correct_option_key) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });

    // Show feedback
    const feedback = document.getElementById('quiz-feedback');
    const isCorrect = key === question.correct_option_key;
    feedback.innerHTML = `
        ${isCorrect ? `
            <div class="feedback-correct">
                <i class="fas fa-check-circle"></i> Correct!
            </div>
        ` : `
            <div class="feedback-incorrect">
                <i class="fas fa-times-circle"></i> Incorrect. The answer is ${question.correct_option_key}.
            </div>
        `}
        ${question.explanation ? `
            <div class="feedback-explanation">
                <strong>Explanation:</strong> ${question.explanation}
            </div>
        ` : ''}
    `;
    feedback.classList.remove('hidden');
}

function prevTopicQuizQuestion() {
    if (topicQuizState.currentIndex > 0) {
        topicQuizState.currentIndex--;
        showTopicQuizQuestion();
    }
}

function nextTopicQuizQuestion() {
    if (topicQuizState.currentIndex < topicQuizState.questions.length - 1) {
        topicQuizState.currentIndex++;
        showTopicQuizQuestion();
    }
}

function jumpToTopicQuizQuestion(idx) {
    if (idx >= 0 && idx < topicQuizState.questions.length) {
        topicQuizState.currentIndex = idx;
        showTopicQuizQuestion();
    }
}

function exitTopicQuiz() {
    if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
        showStaticTopicComplete();
    }
}

function finishTopicQuiz() {
    const { questions, answers, startTime, subject, topic } = topicQuizState;
    const user = authManager.getUser();

    // Calculate results
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(q => {
        if (answers[q.id]) {
            if (answers[q.id] === q.correct_option_key) {
                correct++;
            } else {
                incorrect++;
            }
        } else {
            unanswered++;
        }
    });

    const totalQuestions = questions.length;
    const scorePercent = Math.round((correct / totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    const trophyClass = scorePercent >= 80 ? 'gold' : scorePercent >= 60 ? 'silver' : 'bronze';

    const pageContent = `
        <div class="quiz-result-screen">
            <div class="result-card">
                <div class="result-header">
                    <div class="trophy-icon ${trophyClass}">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h1>Quiz Complete!</h1>
                    <h2>${topic}</h2>
                    <p class="subject-label">${subject} Practice Quiz</p>
                </div>
                
                <div class="result-score">
                    <div class="score-circle ${trophyClass}">
                        <span class="score-value">${scorePercent}%</span>
                    </div>
                </div>
                
                <div class="result-stats">
                    <div class="stat-item correct">
                        <i class="fas fa-check-circle"></i>
                        <span class="stat-value">${correct}</span>
                        <span class="stat-label">Correct</span>
                    </div>
                    <div class="stat-item incorrect">
                        <i class="fas fa-times-circle"></i>
                        <span class="stat-value">${incorrect}</span>
                        <span class="stat-label">Incorrect</span>
                    </div>
                    <div class="stat-item unanswered">
                        <i class="fas fa-minus-circle"></i>
                        <span class="stat-value">${unanswered}</span>
                        <span class="stat-label">Skipped</span>
                    </div>
                    <div class="stat-item time">
                        <i class="fas fa-clock"></i>
                        <span class="stat-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                        <span class="stat-label">Time</span>
                    </div>
                </div>
                
                <div class="result-message">
                    ${scorePercent >= 80 ? `
                        <p><i class="fas fa-star"></i> Excellent! You've mastered this topic!</p>
                    ` : scorePercent >= 60 ? `
                        <p><i class="fas fa-thumbs-up"></i> Good job! Keep practicing to improve.</p>
                    ` : `
                        <p><i class="fas fa-book-reader"></i> Review the topic and try again.</p>
                    `}
                </div>
                
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="reviewTopicQuizAnswers()">
                        <i class="fas fa-eye"></i> Review Answers
                    </button>
                    <button class="btn btn-primary" onclick="startTopicPracticeQuiz(${totalQuestions})">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button class="btn btn-secondary" onclick="showStaticTopicComplete()">
                        <i class="fas fa-arrow-left"></i> Back to Summary
                    </button>
                </div>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}

function reviewTopicQuizAnswers() {
    const user = authManager.getUser();
    const { questions, answers, subject, topic } = topicQuizState;

    const pageContent = `
        <div class="quiz-review-screen">
            <div class="review-header">
                <button class="btn btn-outline" onclick="finishTopicQuiz()">
                    <i class="fas fa-arrow-left"></i> Back to Results
                </button>
                <h2>Answer Review: ${topic}</h2>
            </div>
            
            <div class="review-questions">
                ${questions.map((q, idx) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correct_option_key;
        const isSkipped = !userAnswer;

        return `
                        <div class="review-question-card ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}">
                            <div class="review-question-header">
                                <span class="question-num">Q${idx + 1}</span>
                                ${q.year ? `<span class="question-year">JAMB ${q.year}</span>` : ''}
                                <span class="status-badge ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}">
                                    ${isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                            </div>
                            
                            <div class="review-question-text">${q.question_text}</div>
                            
                            ${q.image_path ? `
                                <div class="question-image" style="margin: 12px 0;">
                                    <img src="${API_CONFIG.BASE_URL}/static/${q.image_path}" alt="Question image" style="max-width: 100%; border-radius: 8px;" onerror="this.style.display='none'">
                                </div>
                            ` : ''}
                            
                            <div class="review-options">
                                ${['A', 'B', 'C', 'D'].map(key => {
            const optionText = q.options?.[key] || q[`option_${key.toLowerCase()}`] || '';
            if (!optionText) return '';

            let optClass = 'review-option';
            if (key === q.correct_option_key) optClass += ' correct-answer';
            if (key === userAnswer && key !== q.correct_option_key) optClass += ' wrong-answer';

            return `
                                        <div class="${optClass}">
                                            <span class="opt-key">${key}</span>
                                            <span class="opt-text">${optionText}</span>
                                            ${key === q.correct_option_key ? '<i class="fas fa-check"></i>' : ''}
                                            ${key === userAnswer && key !== q.correct_option_key ? '<i class="fas fa-times"></i>' : ''}
                                        </div>
                                    `;
        }).join('')}
                            </div>
                            
                            ${q.explanation ? `
                                <div class="review-explanation">
                                    <strong>Explanation:</strong> ${q.explanation}
                                </div>
                            ` : ''}
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, pageContent);
    mainApp.classList.remove('hidden');
}


// ============================================================
// GAMIFICATION POINTS HELPER
// ============================================================

async function awardLearningPoints(params) {
    try {
        const response = await api.request('/guided-learn/award-points', {
            method: 'POST',
            requireAuth: true,
            body: {
                subject: params.subject,
                topic: params.topic,
                subtopic: params.subtopic || null,
                event_type: params.event_type,
                points: params.points,
                description: params.description || null
            }
        });

        // Show toast notification for points
        if (response.success) {
            showToast(`+${params.points} Points!`, 'success');
        }

        return response;
    } catch (error) {
        console.error('Failed to award points:', error);
        // Silently fail - don't interrupt learning flow
        return null;
    }
}

// Make function globally available
window.awardLearningPoints = awardLearningPoints;
window.showGuidedLearnScreen = showGuidedLearnScreen;
window.showGuidedSubjectSelect = showGuidedSubjectSelect;
window.selectGuidedSubject = selectGuidedSubject;
window.showGuidedTopicList = showGuidedTopicList;
window.selectGuidedTopic = selectGuidedTopic;
window.startStaticLearningFlow = startStaticLearningFlow;
window.selectStaticOption = selectStaticOption;
window.goToNextStaticObjective = goToNextStaticObjective;
window.goToPrevStaticObjective = goToPrevStaticObjective;
window.continueToNextStaticSubtopic = continueToNextStaticSubtopic;
window.jumpToStaticWeakness = jumpToStaticWeakness;
window.startPracticeQuiz = startPracticeQuiz;
window.selectPracticeOption = selectPracticeOption;
window.nextPracticeQuestion = nextPracticeQuestion;
window.finishPracticeQuiz = finishPracticeQuiz;
window.restartPracticeQuiz = restartPracticeQuiz;
// Enhanced guided learning functions
window.selectObjectiveAnswer = selectObjectiveAnswer;
window.submitStudentQuestion = submitStudentQuestion;
window.goToNextObjective = goToNextObjective;
window.goToPrevObjective = goToPrevObjective;
window.showTopicOverview = showTopicOverview;
window.continueToNextSubtopic = continueToNextSubtopic;
window.toggleExplanationSection = toggleExplanationSection;
window.requestReExplanation = requestReExplanation;
window.showSubtopicQuiz = showSubtopicQuiz;
window.selectQuizAnswer = selectQuizAnswer;
window.nextQuizQuestion = nextQuizQuestion;
window.reviewWeaknesses = reviewWeaknesses;
window.startTopicPractice = startTopicPractice;
window.startTopicPracticeQuiz = startTopicPracticeQuiz;
window.selectTopicQuizOption = selectTopicQuizOption;
window.prevTopicQuizQuestion = prevTopicQuizQuestion;
window.nextTopicQuizQuestion = nextTopicQuizQuestion;
window.jumpToTopicQuizQuestion = jumpToTopicQuizQuestion;
window.exitTopicQuiz = exitTopicQuiz;
window.finishTopicQuiz = finishTopicQuiz;
window.reviewTopicQuizAnswers = reviewTopicQuizAnswers;
window.showObjectivePractice = showObjectivePractice;
window.showStaticObjectivePractice = showStaticObjectivePractice;
window.handleStaticAskQuestion = handleStaticAskQuestion;
window.reviewStaticWeakAreas = reviewStaticWeakAreas;
window.restartStaticTopic = restartStaticTopic;
