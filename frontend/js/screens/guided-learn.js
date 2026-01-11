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
                            <p>Complete objectives and answer questions correctly to earn learning points!</p>
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
    const questionKey = `${currentSubtopicIndex}_${currentObjectiveIndex}`;
    const alreadyAnswered = guidedLearnState.answeredQuestions && guidedLearnState.answeredQuestions[questionKey];
    
    guidedLearnState.questionAnswered = !!alreadyAnswered;
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
            
            <!-- Objective Title -->
            <div class="objective-banner">
                <h2>Objective: ${objective.title}</h2>
            </div>
            
            <!-- Main Content -->
            <div class="learning-content-grid">
                <!-- Left: Explanation -->
                <div class="explanation-section">
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
                            </div>
                        </div>
                    ` : ''}
                    
                    ${objective.visuals && objective.visuals.length > 0 ? `
                        <div class="visual-card">
                            ${renderStaticVisuals(objective.visuals)}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Right: Question -->
                <div class="question-section">
                    <div class="content-card question-card">
                        <div class="card-header">
                            <h3><i class="fas fa-question-circle"></i> Test Your Understanding</h3>
                            <span class="badge">JAMB Style</span>
                        </div>
                        <div class="card-body">
                            ${objective.question ? `
                                <div class="static-question" id="static-question-area">
                                    <p class="question-text">${objective.question.text}</p>
                                    <div class="options-list">
                                        ${Object.entries(objective.question.options).map(([key, text]) => {
                                            const isCorrect = key === objective.question.correctAnswer;
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
                                    <div class="feedback-box ${alreadyAnswered ? (alreadyAnswered === objective.question.correctAnswer ? 'correct' : 'incorrect') : 'hidden'}" id="static-feedback">
                                        ${alreadyAnswered ? `
                                            <div class="feedback-header">
                                                <i class="fas fa-${alreadyAnswered === objective.question.correctAnswer ? 'check-circle' : 'times-circle'}"></i>
                                                <strong>${alreadyAnswered === objective.question.correctAnswer ? 'Correct!' : 'Incorrect'}</strong>
                                            </div>
                                            <p>${objective.question.explanation}</p>
                                        ` : ''}
                                    </div>
                                </div>
                            ` : `
                                <div class="no-question">
                                    <i class="fas fa-check-circle"></i>
                                    <p>No practice question for this objective.</p>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Ask Question -->
                    <div class="content-card ask-card">
                        <div class="card-header">
                            <h3><i class="fas fa-comments"></i> Ask a question about this concept</h3>
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
            </div>
            
            <!-- Navigation -->
            <div class="learning-navigation">
                <button class="btn btn-outline" onclick="goToPrevStaticObjective()" ${currentSubtopicIndex === 0 && currentObjectiveIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                <button class="btn btn-primary" id="static-next-btn" onclick="goToNextStaticObjective()" ${!guidedLearnState.questionAnswered && objective.question ? 'disabled' : ''}>
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
        await api.request('/guided-learn/save-progress', {
            method: 'POST',
            requireAuth: true,
            body: JSON.stringify({
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic_index: guidedLearnState.currentSubtopicIndex,
                objective_index: guidedLearnState.currentObjectiveIndex,
                status: status,
                answered_correctly: answeredCorrectly,
                time_spent_seconds: 0
            })
        });
    } catch (e) {
        console.log('Could not save progress to server:', e);
    }
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
                    <p class="total-points-display">Total: <strong>${totalPoints}</strong> Learning Points</p>
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
        
        // Parse explanation data
        let explanation = data.explanation;
        if (typeof explanation.explanation === 'string') {
            try {
                explanation = JSON.parse(explanation.explanation);
            } catch (e) {
                // Keep as is if not JSON
            }
        }
        
        const content = `
            <div class="objective-learning-screen">
                <!-- Header -->
                <div class="objective-header">
                    <div class="breadcrumb">
                        <span onclick="showGuidedTopicList()" class="clickable">${guidedLearnState.subject}</span>
                        <i class="fas fa-chevron-right"></i>
                        <span>${guidedLearnState.topicName}</span>
                        <i class="fas fa-chevron-right"></i>
                        <span class="current">${data.subtopic_name}</span>
                    </div>
                    <div class="progress-indicator">
                        <span>${nav.current_position} of ${nav.total_objectives}</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${(nav.current_position / nav.total_objectives) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Objective Title -->
                <div class="objective-title-box">
                    <h2><i class="fas fa-bullseye"></i> Learning Objective</h2>
                    <p class="objective-text">${data.objective_text}</p>
                </div>
                
                <!-- Main Content Grid -->
                <div class="learning-grid">
                    <!-- Left Column: Explanation -->
                    <div class="explanation-column">
                        <div class="card explanation-card">
                            <div class="card-header">
                                <h3><i class="fas fa-lightbulb"></i> AI Explanation</h3>
                            </div>
                            <div class="card-body">
                                ${typeof explanation === 'object' ? `
                                    <div class="explanation-content">
                                        ${explanation.explanation || ''}
                                    </div>
                                    ${explanation.example ? `
                                        <div class="example-box">
                                            <h4><i class="fas fa-flask"></i> Example</h4>
                                            <p>${explanation.example}</p>
                                        </div>
                                    ` : ''}
                                    ${explanation.jamb_tip ? `
                                        <div class="jamb-tip-box">
                                            <h4><i class="fas fa-graduation-cap"></i> JAMB Tip</h4>
                                            <p>${explanation.jamb_tip}</p>
                                        </div>
                                    ` : ''}
                                    ${explanation.needs_diagram && explanation.diagram_description ? `
                                        <div class="diagram-placeholder">
                                            <i class="fas fa-image"></i>
                                            <p>Diagram: ${explanation.diagram_description}</p>
                                        </div>
                                    ` : ''}
                                ` : `
                                    <div class="explanation-content">${explanation}</div>
                                `}
                            </div>
                        </div>
                        
                        <!-- Ask Question Box -->
                        <div class="card ask-question-card">
                            <div class="card-header">
                                <h3><i class="fas fa-question-circle"></i> Ask a Question</h3>
                            </div>
                            <div class="card-body">
                                <div class="ask-input-group">
                                    <input type="text" id="student-question-input" 
                                           placeholder="I don't understand why..."
                                           onkeypress="if(event.key==='Enter') submitStudentQuestion()">
                                    <button class="btn btn-primary" onclick="submitStudentQuestion()">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                                <div id="qa-response-area"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column: Question -->
                    <div class="question-column">
                        <div class="card question-card">
                            <div class="card-header">
                                <h3><i class="fas fa-question"></i> Test Your Understanding</h3>
                                ${guidedLearnState.questions.length > 0 ? `
                                    <span class="question-badge">JAMB ${guidedLearnState.questions[0].year || 'Past Question'}</span>
                                ` : ''}
                            </div>
                            <div class="card-body" id="question-area">
                                ${guidedLearnState.questions.length > 0 ? renderObjectiveQuestion() : `
                                    <div class="no-question">
                                        <i class="fas fa-check-circle"></i>
                                        <p>No practice question for this objective.</p>
                                        <button class="btn btn-primary" onclick="goToNextObjective()">
                                            Continue <i class="fas fa-arrow-right"></i>
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="objective-navigation">
                    <button class="btn btn-outline" ${!nav.has_prev ? 'disabled' : ''} onclick="goToPrevObjective()">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="btn btn-outline" onclick="showTopicOverview()">
                        <i class="fas fa-list"></i> Overview
                    </button>
                    <button class="btn btn-primary" id="next-btn" ${!guidedLearnState.questionAnswered && guidedLearnState.questions.length > 0 ? 'disabled' : ''} onclick="goToNextObjective()">
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
        showToast('Failed to load objective: ' + error.message, 'error');
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
                    <img src="/static/${q.image_path}" alt="Question image" onerror="this.style.display='none'">
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
            body: JSON.stringify({
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic: guidedLearnState.currentObjective.subtopic_name,
                objective: guidedLearnState.currentObjective.objective_text,
                question_id: q.question_id,
                user_answer: key
            })
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
        document.getElementById('next-btn').disabled = false;
        
        // Save progress
        const timeSpent = Math.round((Date.now() - guidedLearnState.timeStarted) / 1000);
        await api.request('/guided-learn/save-progress', {
            method: 'POST',
            requireAuth: true,
            body: JSON.stringify({
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic_index: guidedLearnState.currentSubtopicIndex,
                objective_index: guidedLearnState.currentObjectiveIndex,
                status: 'completed',
                answered_correctly: result.is_correct,
                time_spent_seconds: timeSpent
            })
        });
        
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
            body: JSON.stringify({
                subject: guidedLearnState.subject,
                topic: guidedLearnState.topicName,
                subtopic: guidedLearnState.currentObjective.subtopic_name,
                objective: guidedLearnState.currentObjective.objective_text,
                explanation_context: explanationContext,
                question: question
            })
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
            
            <div class="next-preview">
                <h3>Up Next:</h3>
                <div class="next-subtopic-name">${nextSubtopic.name}</div>
                <p>${nextSubtopic.objectives.length} objectives</p>
            </div>
            
            <button class="btn btn-primary btn-lg" onclick="continueToNextSubtopic(${nextSubtopicIndex}, ${nextObjectiveIndex})">
                Continue <i class="fas fa-arrow-right"></i>
            </button>
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

async function showTopicComplete() {
    const user = authManager.getUser();
    
    // Get weaknesses
    let weaknesses = [];
    try {
        const weakData = await api.request(`/guided-learn/weaknesses/${encodeURIComponent(guidedLearnState.subject)}`, { requireAuth: true });
        weaknesses = weakData.weaknesses.filter(w => w.topic === guidedLearnState.topicName);
    } catch (e) {}
    
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
                    
                    ${question.question_image ? `
                        <div class="question-image">
                            <img src="${question.question_image}" alt="Question diagram">
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
            body: JSON.stringify({
                subject: params.subject,
                topic: params.topic,
                subtopic: params.subtopic || null,
                event_type: params.event_type,
                points: params.points,
                description: params.description || null
            })
        });
        
        // Show toast notification for points
        if (response.success) {
            showToast(`+${params.points} Learning Points!`, 'success');
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
