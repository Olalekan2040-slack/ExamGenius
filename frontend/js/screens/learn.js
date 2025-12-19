// Learn Topics Screen

let currentLearnState = {
    subject: null,
    topic: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    mode: 'subject-select' // subject-select, topic-list, lesson, practice, results
};

async function showLearnScreen(params = {}) {
    const user = authManager.getUser();

    if (params.subject && params.topic) {
        currentLearnState.subject = params.subject;
        currentLearnState.topic = params.topic;
        await showTopicLesson();
    } else if (params.subject) {
        currentLearnState.subject = params.subject;
        await showTopicList();
    } else {
        await showSubjectSelect();
    }
}

async function showSubjectSelect() {
    showLoading('Loading subjects...');

    try {
        const user = authManager.getUser();
        const data = await api.getSubjects();

        const content = `
            <div class="learn-screen">
                <h1><i class="fas fa-book-reader"></i> Learn by Topics</h1>
                <p style="margin-bottom: 32px; color: var(--text-secondary);">
                    Select a subject to see topics and start learning
                </p>
                
                <div class="topic-grid">
                    ${data.subjects.map(subject => `
                        <div class="topic-card" onclick="selectSubject('${subject}')">
                            <div style="font-size: 48px; margin-bottom: 16px; text-align: center;">
                                ${getSubjectIcon(subject)}
                            </div>
                            <div class="topic-name" style="text-align: center;">${subject}</div>
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

async function selectSubject(subject) {
    currentLearnState.subject = subject;
    await showTopicList();
}

async function showTopicList() {
    showLoading(`Loading ${currentLearnState.subject} topics...`);

    try {
        const user = authManager.getUser();
        const data = await api.getTopicsWithStats(currentLearnState.subject);

        const content = `
            <div class="learn-screen">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <button class="btn btn-outline" onclick="showSubjectSelect()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 style="margin: 0;">${currentLearnState.subject} Topics</h1>
                </div>
                
                <div class="topic-grid">
                    ${data.topics.map(topic => `
                        <div class="topic-card" onclick="selectTopic('${topic.topic}')">
                            <div class="topic-name">${topic.topic}</div>
                            <div class="topic-stats">
                                <div><i class="fas fa-question-circle"></i> ${topic.question_count} questions</div>
                                ${topic.attempts > 0 ? `
                                    <div><i class="fas fa-redo"></i> ${topic.attempts} attempts</div>
                                    <div><i class="fas fa-bullseye"></i> Last score: ${topic.last_score ? topic.last_score.toFixed(1) + '%' : 'N/A'}</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">
                                        <i class="fas fa-clock"></i> ${utils.formatDate(topic.last_practiced)}
                                    </div>
                                ` : `
                                    <div style="color: var(--warning);"><i class="fas fa-star"></i> Not practiced yet</div>
                                `}
                            </div>
                            ${topic.last_score ? `
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${topic.last_score}%;"></div>
                                </div>
                            ` : ''}
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

async function selectTopic(topic) {
    currentLearnState.topic = topic;
    await showTopicLesson();
}

async function showTopicLesson() {
    showLoading('Loading lesson...');

    try {
        const user = authManager.getUser();
        const data = await api.getLesson(currentLearnState.subject, currentLearnState.topic);
        const videos = data.videos || [];
            const embedVideo = getTopicVideoEmbed(currentLearnState.subject, currentLearnState.topic);

        // Store lesson in state for interactive chat
        currentLearnState.lesson = data.lesson;
        currentLearnState.chatHistory = [];

        const content = `
            <div class="learn-screen" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100vh - 100px); max-height: 800px;">
                <!-- Left: Lesson Content -->
                <div style="overflow-y: auto;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <button class="btn btn-outline" onclick="showTopicList()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <h1 style="margin: 0; font-size: 20px;">${currentLearnState.subject}: ${currentLearnState.topic}</h1>
                    </div>
                        ${embedVideo ? `
                            <div class="card" style="margin-bottom: 16px; overflow: hidden;">
                                <div class="card-header">
                                    <h2><i class="fas fa-video"></i> ${embedVideo.title}</h2>
                                    <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${embedVideo.description}</p>
                                </div>
                                <div style="position: relative; padding-top: 56.25%; border-radius: var(--radius-md); overflow: hidden;">
                                    <iframe
                                        src="${embedVideo.embedUrl}"
                                        allow="autoplay; encrypted-media"
                                        allowfullscreen
                                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                                    ></iframe>
                                </div>
                            </div>
                        ` : ''}
                    
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fas fa-lightbulb"></i> Lesson</h2>
                        </div>
                        
                        ${data.lesson.objectives ? `
                            <div style="padding: 16px; background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: var(--radius-md); margin-bottom: 16px; border-left: 4px solid var(--primary-blue);">
                                <h3 style="margin-bottom: 8px; font-size: 14px; color: var(--primary-blue);"><i class="fas fa-bullseye"></i> Learning Objectives</h3>
                                <div style="white-space: pre-wrap; line-height: 1.6; font-size: 13px;">${data.lesson.objectives}</div>
                            </div>
                        ` : ''}
                        
                        ${data.lesson.key_idea ? `
                            <div style="padding: 16px; background: var(--primary-yellow-light); border-radius: var(--radius-md); margin-bottom: 16px;">
                                <h3 style="margin-bottom: 8px; font-size: 14px;"><i class="fas fa-key"></i> What JAMB Tests</h3>
                                <p style="line-height: 1.6; font-size: 13px;">${data.lesson.key_idea}</p>
                            </div>
                        ` : ''}
                        
                        ${data.lesson.steps ? `
                            <div style="padding: 16px; background: var(--white); border: 2px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 16px;">
                                <h3 style="margin-bottom: 8px; font-size: 14px;"><i class="fas fa-list-ol"></i> Key Concepts</h3>
                                <div style="white-space: pre-wrap; line-height: 1.6; font-size: 13px;">${data.lesson.steps}</div>
                            </div>
                        ` : ''}
                        
                        ${data.lesson.example ? `
                            <div style="padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); margin-bottom: 16px;">
                                <h3 style="margin-bottom: 8px; font-size: 14px;"><i class="fas fa-flask"></i> Worked Example</h3>
                                <div style="white-space: pre-wrap; line-height: 1.6; font-size: 13px;">${data.lesson.example}</div>
                            </div>
                        ` : ''}
                        
                        ${data.lesson.common_mistakes ? `
                            <div style="padding: 16px; background: #FFF3E0; border-radius: var(--radius-md); margin-bottom: 16px; border-left: 4px solid var(--warning);">
                                <h3 style="margin-bottom: 8px; font-size: 14px; color: #E65100;"><i class="fas fa-exclamation-triangle"></i> Common Mistakes</h3>
                                <div style="white-space: pre-wrap; line-height: 1.6; font-size: 13px;">${data.lesson.common_mistakes}</div>
                            </div>
                        ` : ''}
                        
                        ${data.lesson.quick_tip ? `
                            <div style="padding: 16px; background: linear-gradient(135deg, var(--success) 0%, #81C784 100%); color: var(--white); border-radius: var(--radius-md); margin-bottom: 16px;">
                                <h3 style="margin-bottom: 8px; font-size: 14px; color: var(--white);"><i class="fas fa-bolt"></i> Exam Tip</h3>
                                <p style="line-height: 1.6; font-size: 13px;">${data.lesson.quick_tip}</p>
                            </div>
                        ` : ''}

                        ${videos.length ? `
                            <div class="card" style="margin-top: 12px;">
                                <div class="card-header">
                                    <h2><i class="fas fa-play-circle"></i> Topic Videos</h2>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
                                    ${videos.map(renderVideoBlock).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Right: Interactive Chat -->
                <div style="display: flex; flex-direction: column; border: 2px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--white);">
                    <div style="padding: 16px; background: var(--primary-yellow); color: var(--white); font-weight: 600;">
                        <i class="fas fa-comments"></i> Ask AI Tutor
                    </div>
                    
                    <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: var(--bg-light);">
                        <div style="padding: 12px; background: var(--white); border-radius: var(--radius-md); color: var(--text-secondary); font-size: 13px;">
                            👋 Hi! I'm your AI tutor. Ask me anything about ${currentLearnState.topic}. I can explain concepts, give examples, or answer questions!
                        </div>
                        ${data.lesson.suggested_questions && data.lesson.suggested_questions.length > 0 ? `
                            <div style="padding: 12px; background: var(--primary-yellow-light); border-radius: var(--radius-md);">
                                <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">
                                    <i class="fas fa-lightbulb"></i> Try asking:
                                </p>
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    ${data.lesson.suggested_questions.map(q => `
                                        <button class="suggested-question-btn" onclick="askSuggestedQuestion('${q.replace(/'/g, "\\'")}')" 
                                            style="text-align: left; padding: 8px 12px; background: var(--white); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; cursor: pointer; color: var(--primary-blue); transition: all 0.2s;">
                                            <i class="fas fa-question-circle"></i> ${q}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="padding: 12px; border-top: 2px solid var(--border-color);">
                        <div style="display: flex; gap: 8px;">
                            <input 
                                id="chat-input" 
                                type="text" 
                                placeholder="Ask me a question..." 
                                style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px;"
                                onkeypress="if(event.key === 'Enter') sendChatMessage()">
                            <button class="btn btn-primary" onclick="sendChatMessage()" style="padding: 10px 16px;">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-primary btn-lg" onclick="startTopicPractice()">
                    <i class="fas fa-play-circle"></i> Start Practice Questions
                </button>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');

        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load lesson: ' + error.message, 'error');
    }
}

// Map specific subject/topic combinations to an embedded video for quick viewing alongside the AI-generated content
function getTopicVideoEmbed(subject, topic) {
    const s = (subject || '').toLowerCase();
    const t = (topic || '').toLowerCase();

    // Example: Biology → Reproduction
    if (s === 'biology' && t.includes('reproduction')) {
        return {
            title: 'Biology: Reproduction (Video)',
            description: 'Watch alongside the AI-generated notes. Video hosted on Google Drive.',
            embedUrl: 'https://drive.google.com/file/d/1PcrcQPjOkkK38QP92by-fvudiw9poCQg/preview'
        };
    }

    return null;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    const chatMessages = document.getElementById('chat-messages');
    const userDiv = document.createElement('div');
    userDiv.style.cssText = 'padding: 12px; background: var(--primary-yellow-light); border-radius: var(--radius-md); text-align: right; font-size: 13px;';
    userDiv.innerHTML = `<strong>You:</strong> ${message}`;
    chatMessages.appendChild(userDiv);

    // Store in history
    currentLearnState.chatHistory.push({ role: 'user', content: message });

    // Clear input
    input.value = '';
    input.focus();

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = 'padding: 12px; background: var(--white); border-radius: var(--radius-md); font-size: 13px; color: var(--text-secondary);';
    typingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Tutor is thinking...';
    chatMessages.appendChild(typingDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Get AI response
        const response = await api.askAITutor(
            currentLearnState.subject,
            currentLearnState.topic,
            message,
            currentLearnState.lesson,
            currentLearnState.chatHistory
        );

        // Remove typing indicator
        typingDiv.remove();

        // Add AI response
        const aiDiv = document.createElement('div');
        aiDiv.style.cssText = 'padding: 12px; background: var(--white); border-radius: var(--radius-md); border-left: 4px solid var(--primary-yellow); font-size: 13px; line-height: 1.6;';
        aiDiv.innerHTML = `<strong>🤖 AI Tutor:</strong> ${response.response}`;
        chatMessages.appendChild(aiDiv);

        // Add to history
        currentLearnState.chatHistory.push({ role: 'assistant', content: response.response });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        typingDiv.remove();
        showToast('Failed to get response: ' + error.message, 'error');
    }
}

// Function to handle clicking on suggested questions
function askSuggestedQuestion(question) {
    const input = document.getElementById('chat-input');
    input.value = question;
    sendChatMessage();
}

async function startTopicPractice() {
    showLoading('Loading practice questions...');

    try {
        const data = await api.getPracticeQuestions(currentLearnState.subject, currentLearnState.topic, 10);

        currentLearnState.questions = data.questions;
        currentLearnState.currentQuestionIndex = 0;
        currentLearnState.answers = {};

        await showPracticeQuestion();
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load questions: ' + error.message, 'error');
    }
}

async function showPracticeQuestion() {
    const user = authManager.getUser();
    const question = currentLearnState.questions[currentLearnState.currentQuestionIndex];
    const total = currentLearnState.questions.length;
    const current = currentLearnState.currentQuestionIndex + 1;

    const content = `
        <div class="practice-screen">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <button class="btn btn-outline" onclick="confirmExitPractice()">
                    <i class="fas fa-times"></i> Exit
                </button>
                <div style="font-weight: 600; font-size: 18px;">
                    Question ${current} of ${total}
                </div>
                <div style="width: 100px;"></div>
            </div>
            
            <div class="question-card">
                <div class="question-number">
                    ${currentLearnState.subject} - ${currentLearnState.topic}
                </div>
                <div class="question-text">${question.question}</div>
                
                ${question.image_path ? `
                    <img src="${API_CONFIG.BASE_URL}${question.image_path}" alt="Question image" style="max-width: 100%; border-radius: var(--radius-md); margin: 20px 0;">
                ` : ''}
                
                <div class="options-list">
                    ${Object.entries(question.options).map(([letter, text]) => `
                        <div class="option-item ${currentLearnState.answers[question.question_id] === letter ? 'selected' : ''}" 
                             onclick="selectAnswer('${question.question_id}', '${letter}')">
                            <div class="option-letter">${letter}</div>
                            <div>${text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
                <button class="btn btn-outline" 
                        onclick="navigatePracticeQuestion(-1)" 
                        ${current === 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                
                ${current === total ? `
                    <button class="btn btn-primary btn-lg" onclick="submitTopicPractice()">
                        <i class="fas fa-check-circle"></i> Submit Answers
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="navigatePracticeQuestion(1)">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                `}
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

function selectAnswer(questionId, answer) {
    currentLearnState.answers[questionId] = answer;
    showPracticeQuestion();
}

function navigatePracticeQuestion(direction) {
    currentLearnState.currentQuestionIndex += direction;
    showPracticeQuestion();
}

function confirmExitPractice() {
    const confirmed = confirm('Are you sure you want to exit? Your progress will be lost.');
    if (confirmed) {
        showTopicList();
    }
}

function getVideoEmbedUrl(url) {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/);
        const id = match ? match[1] : null;
        if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
}

function renderVideoBlock(video) {
    const embedUrl = getVideoEmbedUrl(video.url);
    const durationText = video.duration_seconds ? `${Math.round(video.duration_seconds / 60)} min` : '';

    return `
        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--white);">
            <div style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--bg-light);">
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 600;">${video.title || 'Topic Video'}</p>
                    ${video.description ? `<p style=\"margin: 4px 0 0; color: var(--text-secondary); font-size: 13px;\">${video.description}</p>` : ''}
                    ${durationText ? `<p style=\"margin: 4px 0 0; color: var(--text-secondary); font-size: 12px;\">Duration: ${durationText}</p>` : ''}
                </div>
                <a class="btn btn-outline" href="${video.url}" target="_blank" rel="noopener">
                    <i class="fas fa-external-link-alt"></i> Open
                </a>
            </div>
            ${embedUrl ? `
                <div style="position: relative; padding-top: 56.25%; background: #000;">
                    <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>
                </div>
            ` : ''}
        </div>
    `;
}

async function submitTopicPractice() {
    const answeredCount = Object.keys(currentLearnState.answers).length;
    const totalCount = currentLearnState.questions.length;

    if (answeredCount < totalCount) {
        const confirmed = confirm(`You've only answered ${answeredCount} out of ${totalCount} questions. Submit anyway?`);
        if (!confirmed) return;
    }

    showLoading('Submitting answers...');

    try {
        const answers = currentLearnState.questions.map(q => {
            const id = q.question_id ?? q.id;
            return {
                question_id: id,
                user_answer: currentLearnState.answers[id] || null
            };
        });

        const result = await api.submitTopicPractice(
            currentLearnState.subject,
            currentLearnState.topic,
            answers
        );

        await showPracticeResults(result);
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to submit: ' + error.message, 'error');
    }
}

async function showPracticeResults(result) {
    const user = authManager.getUser();
    const performanceLevel = result.summary.performance_level || 'good';
    const scoreColor = getScoreColor(result.summary.score);
    const performanceIcon = getPerformanceIcon(performanceLevel);
    const topicAnalysis = result.topic_analysis || {};
    const sw = result.strengths_weaknesses || {};

    const content = `
        <div class="results-screen" style="max-width: 1000px; margin: 0 auto;">
            <!-- Header Section -->
            <div style="text-align: center; margin-bottom: 40px; padding: 32px; background: linear-gradient(135deg, ${scoreColor}20, ${scoreColor}05); border-radius: var(--radius-lg); border-left: 6px solid ${scoreColor};">
                <div style="font-size: 72px; margin-bottom: 16px;">${performanceIcon}</div>
                <h1 style="margin: 0 0 8px 0; font-size: 28px;">Practice Complete!</h1>
                <div style="font-size: 16px; color: var(--text-secondary); margin-bottom: 24px;">
                    ${currentLearnState.subject} • ${currentLearnState.topic}
                </div>
                <div style="font-size: 64px; font-weight: 700; color: ${scoreColor}; margin: 20px 0;">
                    ${result.summary.score.toFixed(1)}%
                </div>
                <div style="font-size: 16px; color: var(--text-secondary); margin-bottom: 12px;">
                    ${result.summary.correct} <span style="color: var(--success); font-weight: 600;">correct</span> • 
                    ${result.summary.incorrect} <span style="color: var(--error); font-weight: 600;">incorrect</span>
                </div>
                <div style="display: inline-block; padding: 8px 16px; background: ${scoreColor}20; color: ${scoreColor}; border-radius: var(--radius-md); font-weight: 600; margin-top: 12px;">
                    ${formatPerformanceLevel(performanceLevel)}
                </div>
            </div>

            <!-- Quick Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 32px;">
                <div class="stat-card">
                    <div style="font-size: 24px; color: var(--success); margin-bottom: 8px;"><i class="fas fa-check-circle"></i></div>
                    <div style="font-size: 20px; font-weight: 700;">${result.summary.correct}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Correct Answers</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 24px; color: var(--error); margin-bottom: 8px;"><i class="fas fa-times-circle"></i></div>
                    <div style="font-size: 20px; font-weight: 700;">${result.summary.incorrect}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Incorrect Answers</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 24px; color: var(--info); margin-bottom: 8px;"><i class="fas fa-question-circle"></i></div>
                    <div style="font-size: 20px; font-weight: 700;">${result.summary.total}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Total Questions</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 24px; color: var(--primary-yellow-dark); margin-bottom: 8px;"><i class="fas fa-redo"></i></div>
                    <div style="font-size: 20px; font-weight: 700;">${result.updated_stats.total_attempts}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Total Attempts</div>
                </div>
            </div>

            <!-- Topic Analysis -->
            ${topicAnalysis.total_questions ? `
            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 style="margin: 0;"><i class="fas fa-chart-pie"></i> Topic Analysis</h3>
                </div>
                <div style="padding: 20px;">
                    ${Object.entries(topicAnalysis.difficulty_breakdown || {}).map(([difficulty, stats]) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                            <div>
                                <div style="font-weight: 600; text-transform: capitalize;">${difficulty} Questions</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${stats.correct} of ${stats.total} correct</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 20px; font-weight: 700; color: ${getScoreColor(stats.accuracy)}">${stats.accuracy.toFixed(1)}%</div>
                                <div class="progress-bar" style="width: 100px; height: 6px; background: var(--border-color); border-radius: 3px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: ${stats.accuracy}%; height: 100%; background: ${getScoreColor(stats.accuracy)}; transition: width 0.3s;"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Strengths & Weaknesses -->
            ${sw.strengths && sw.strengths.length > 0 || sw.weaknesses && sw.weaknesses.length > 0 ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                ${sw.strengths && sw.strengths.length > 0 ? `
                <div class="card">
                    <div class="card-header">
                        <h3 style="margin: 0;"><i class="fas fa-star" style="color: var(--success);"></i> Your Strengths</h3>
                    </div>
                    <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                        ${sw.strengths.slice(0, 3).map(strength => `
                            <div style="padding: 12px; background: #E8F5E920; border-radius: var(--radius-md); border-left: 3px solid var(--success);">
                                <div style="font-weight: 600; color: var(--success);">${strength.topic}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${strength.accuracy.toFixed(1)}% • ${strength.trend}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${sw.weaknesses && sw.weaknesses.length > 0 ? `
                <div class="card">
                    <div class="card-header">
                        <h3 style="margin: 0;"><i class="fas fa-exclamation-triangle" style="color: var(--error);"></i> Focus Areas</h3>
                    </div>
                    <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                        ${sw.weaknesses.slice(0, 3).map(weakness => `
                            <div style="padding: 12px; background: #FFEBEE20; border-radius: var(--radius-md); border-left: 3px solid var(--error);">
                                <div style="font-weight: 600; color: var(--error);">${weakness.topic}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${weakness.accuracy.toFixed(1)}% • ${weakness.trend}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- Detailed Review -->
            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 style="margin: 0;"><i class="fas fa-list-check"></i> Detailed Review</h3>
                </div>
                <div style="padding: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${result.results.map((res, idx) => {
                            const question = currentLearnState.questions.find(q => q.question_id === res.question_id);
                            const statusColor = res.correct ? 'var(--success)' : 'var(--error)';
                            const bgColor = res.correct ? '#E8F5E9' : '#FFEBEE';
                            return `
                                <div style="padding: 16px; border: 2px solid ${statusColor}30; background: ${bgColor}40; border-radius: var(--radius-md); transition: all 0.3s;">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                        <strong style="font-size: 14px;">Question ${idx + 1}</strong>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 12px; color: var(--text-secondary);">${res.correct ? 'Correct' : 'Incorrect'}</span>
                                            <i class="fas fa-${res.correct ? 'check-circle' : 'times-circle'}" style="color: ${statusColor}; font-size: 20px;"></i>
                                        </div>
                                    </div>
                                    <p style="margin: 12px 0; color: var(--text-primary);">${question.question}</p>
                                    <div style="display: grid; gap: 8px; margin-top: 12px;">
                                        <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid var(--success);">
                                            <small style="color: var(--text-secondary); font-weight: 600;">Correct Answer:</small>
                                            <div style="color: var(--success); font-weight: 600;">${res.correct_answer}</div>
                                        </div>
                                        ${!res.correct ? `
                                            <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid var(--error);">
                                                <small style="color: var(--text-secondary); font-weight: 600;">Your Answer:</small>
                                                <div style="color: var(--error); font-weight: 600;">${res.user_answer || 'Not answered'}</div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="startTopicPractice()" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-redo-alt"></i> Practice Again
                </button>
                <button class="btn btn-outline" onclick="showTopicList()" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-book"></i> Another Topic
                </button>
                <button class="btn btn-outline" onclick="showLearnScreen({ subject: '${currentLearnState.subject}' })" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-arrow-left"></i> Back to ${currentLearnState.subject}
                </button>
                <button class="btn btn-outline" onclick="router.navigate('dashboard')" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-chart-line"></i> View Analytics
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

function getScoreColor(score) {
    if (score >= 90) return '#10B981'; // excellent
    if (score >= 75) return '#3B82F6'; // good
    if (score >= 60) return '#F59E0B'; // fair
    if (score >= 40) return '#EF4444'; // poor
    return '#DC2626'; // needs improvement
}

function getPerformanceIcon(level) {
    const icons = {
        'excellent': '🎉',
        'good': '👏',
        'fair': '💪',
        'poor': '📚',
        'needs_improvement': '🚀'
    };
    return icons[level] || '📊';
}

function formatPerformanceLevel(level) {
    return level.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getSubjectIcon(subject) {
    const icons = {
        'Biology': '🧬',
        'Chemistry': '⚗️',
        'Physics': '⚛️',
        'Mathematics': '📐',
        'English Language': '📚',
        'Commerce': '💼',
        'Economics': '💰',
        'Government': '🏛️',
        'Literature': '📖',
        'Geography': '🗺️'
    };
    return icons[subject] || '📚';
}

// Export functions
window.showLearnScreen = showLearnScreen;
window.selectSubject = selectSubject;
window.selectTopic = selectTopic;
window.startTopicPractice = startTopicPractice;
window.selectAnswer = selectAnswer;
window.navigatePracticeQuestion = navigatePracticeQuestion;
window.confirmExitPractice = confirmExitPractice;
window.submitTopicPractice = submitTopicPractice;
