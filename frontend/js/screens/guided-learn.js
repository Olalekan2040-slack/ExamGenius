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
    mode: 'subject-select' // subject-select, topic-list, learning, subtopic-complete, topic-complete
};

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
        await loadTopicAndShowObjective();
    } else if (params.subject && params.topic) {
        // Start or resume topic
        guidedLearnState.subject = params.subject;
        guidedLearnState.topicName = params.topic;
        await loadTopicProgress();
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
        const data = await api.request('/guided-learn/subjects');
        const user = authManager.getUser();
        
        const content = `
            <div class="guided-learn-screen">
                <div class="guided-header">
                    <h1><i class="fas fa-graduation-cap"></i> Guided Learning</h1>
                    <p>Master topics one objective at a time with AI-powered explanations</p>
                </div>
                
                <div class="subject-grid">
                    ${data.subjects.map(s => `
                        <div class="subject-card" onclick="selectGuidedSubject('${s.name}')">
                            <div class="subject-icon">${getSubjectIcon(s.name)}</div>
                            <div class="subject-name">${s.name}</div>
                            <div class="subject-meta">
                                <span><i class="fas fa-book"></i> ${s.topic_count} topics</span>
                            </div>
                        </div>
                    `).join('')}
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
        const data = await api.request(`/guided-learn/topics/${encodeURIComponent(guidedLearnState.subject)}`);
        const user = authManager.getUser();
        
        const content = `
            <div class="guided-learn-screen">
                <div class="guided-nav">
                    <button class="btn btn-outline" onclick="showGuidedSubjectSelect()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h2>${guidedLearnState.subject}</h2>
                </div>
                
                <div class="topic-list">
                    ${data.topics.map(t => `
                        <div class="guided-topic-card ${t.progress_percent === 100 ? 'completed' : ''}" 
                             onclick="selectGuidedTopic('${t.name.replace(/'/g, "\\'")}')">
                            <div class="topic-number">${t.number}</div>
                            <div class="topic-content">
                                <div class="topic-title">${t.name}</div>
                                <div class="topic-meta">
                                    <span><i class="fas fa-list"></i> ${t.subtopic_count} subtopics</span>
                                    <span><i class="fas fa-bullseye"></i> ${t.objective_count} objectives</span>
                                    ${t.weakness_count > 0 ? `<span class="weakness"><i class="fas fa-exclamation-triangle"></i> ${t.weakness_count} weak</span>` : ''}
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${t.progress_percent}%"></div>
                                </div>
                                <div class="progress-text">${t.completed_objectives}/${t.objective_count} completed (${t.progress_percent}%)</div>
                            </div>
                            <div class="topic-arrow"><i class="fas fa-chevron-right"></i></div>
                        </div>
                    `).join('')}
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
    await loadTopicProgress();
}

// ============================================================
// LOAD TOPIC AND PROGRESS
// ============================================================

async function loadTopicProgress() {
    showLoading('Loading your progress...');
    
    try {
        // Get topic structure
        const structure = await api.request(
            `/guided-learn/topic/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`
        );
        guidedLearnState.topicStructure = structure.topic;
        
        // Get progress
        const progress = await api.request(
            `/guided-learn/progress/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`
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

async function loadTopicAndShowObjective() {
    showLoading('Loading...');
    
    try {
        const structure = await api.request(
            `/guided-learn/topic/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}`
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
            `/guided-learn/objective/${encodeURIComponent(guidedLearnState.subject)}/${encodeURIComponent(guidedLearnState.topicName)}/${guidedLearnState.currentSubtopicIndex}/${guidedLearnState.currentObjectiveIndex}`
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
        const weakData = await api.request(`/guided-learn/weaknesses/${encodeURIComponent(guidedLearnState.subject)}`);
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
