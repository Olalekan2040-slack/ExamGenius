// CBT Full Exam Simulation Screen

let cbtState = {
    sessionId: null,
    subjects: [],
    questions: [],
    currentSubjectIndex: 0,
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
    timeLimit: 180 * 60, // 3 hours in seconds
    timerInterval: null
};

async function showCBTScreen(params = {}) {
    if (params.mode === 'review' && params.sessionId) {
        await showCBTReview(params.sessionId);
    } else if (params.mode === 'resume' && params.sessionId) {
        await resumeCBTSession(params.sessionId);
    } else {
        await showCBTSelect();
    }
}

async function showCBTSelect() {
    showLoading('Loading...');

    try {
        const user = authManager.getUser();
        const subjects = await api.getSubjects();

        const content = `
            <div class="cbt-screen">
                <h1><i class="fas fa-laptop"></i> Full CBT Simulation</h1>
                <p style="margin-bottom: 32px; color: var(--text-secondary);">
                    Experience real JAMB exam conditions with 160 questions and 3-hour timer
                </p>
                
                <div class="card">
                    <div class="card-header">
                        <h2>Select Your 4 Subjects</h2>
                    </div>
                    
                    <div style="background: var(--primary-yellow-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                        <strong>⚠️ Important:</strong>
                        <ul style="margin: 8px 0 0 20px; line-height: 1.8;">
                            <li>Select exactly 4 subjects</li>
                            <li>You'll have 3 hours to complete 160 questions (40 per subject)</li>
                            <li>Timer starts immediately after you begin</li>
                            <li>You can switch between subjects during the exam</li>
                        </ul>
                    </div>
                    
                    <div id="subject-selection" style="display: grid; gap: 12px; margin-bottom: 20px;">
                        ${subjects.subjects.map(s => `
                            <label style="display: flex; align-items: center; padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); cursor: pointer; border: 2px solid transparent; transition: var(--transition);"
                                   onchange="updateCBTSubjectCount()" class="cbt-subject-option">
                                <input type="checkbox" name="cbt-subject" value="${s}" style="margin-right: 12px; width: 20px; height: 20px;">
                                <span style="font-weight: 600;">${s}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div id="subject-count" style="margin-bottom: 20px; padding: 12px; background: var(--bg-light); border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
                        0 of 4 subjects selected
                    </div>
                    
                    <button class="btn btn-primary btn-lg btn-block" onclick="startCBTExam()" id="start-cbt-btn" disabled>
                        <i class="fas fa-play-circle"></i> Start CBT Exam
                    </button>
                </div>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');

        // Add style for checked checkboxes
        const style = document.createElement('style');
        style.textContent = `
            .cbt-subject-option:has(input:checked) {
                border-color: var(--primary-yellow) !important;
                background: var(--primary-yellow-light) !important;
            }
        `;
        document.head.appendChild(style);

        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load: ' + error.message, 'error');
    }
}

function updateCBTSubjectCount() {
    const checked = document.querySelectorAll('input[name="cbt-subject"]:checked');
    const count = checked.length;
    const countDiv = document.getElementById('subject-count');
    const startBtn = document.getElementById('start-cbt-btn');

    countDiv.textContent = `${count} of 4 subjects selected`;
    countDiv.style.color = count === 4 ? 'var(--success)' : 'var(--text-primary)';
    startBtn.disabled = count !== 4;
}

async function startCBTExam() {
    const checked = Array.from(document.querySelectorAll('input[name="cbt-subject"]:checked'));
    const selectedSubjects = checked.map(cb => cb.value);

    if (selectedSubjects.length !== 4) {
        showToast('Please select exactly 4 subjects', 'warning');
        return;
    }

    const confirmed = confirm('Ready to start CBT exam? Timer will begin immediately.');
    if (!confirmed) return;

    showLoading('Creating exam session...');

    try {
        const data = await api.createCBTSession(selectedSubjects);

        cbtState.sessionId = data.session_id;
        cbtState.subjects = data.subjects;
        cbtState.currentSubjectIndex = 0;
        cbtState.currentQuestionIndex = 0;
        cbtState.answers = {};
        cbtState.startTime = Date.now();
        cbtState.timeLimit = data.time_limit_minutes * 60;

        // Fetch the questions for this session
        showLoading('Loading questions...');
        const questionsData = await api.getCBTQuestions(data.session_id);
        cbtState.questions = questionsData.questions || [];

        await showCBTExam();
        startCBTTimer();
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to create exam: ' + error.message, 'error');
    }
}

function startCBTTimer() {
    if (cbtState.timerInterval) {
        clearInterval(cbtState.timerInterval);
    }

    cbtState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - cbtState.startTime) / 1000);
        const remaining = cbtState.timeLimit - elapsed;

        if (remaining <= 0) {
            clearInterval(cbtState.timerInterval);
            showToast('Time is up! Auto-submitting exam...', 'warning');
            setTimeout(() => submitCBTExam(), 2000);
            return;
        }

        updateCBTTimerDisplay(remaining);
    }, 1000);
}

function updateCBTTimerDisplay(remaining) {
    const timerEl = document.getElementById('cbt-timer');
    if (!timerEl) return;

    timerEl.textContent = utils.formatTime(remaining);

    if (remaining < 300) { // Last 5 minutes
        timerEl.classList.add('warning');
    }
}

async function showCBTExam() {
    const user = authManager.getUser();
    const currentQuestions = cbtState.questions.filter((q, idx) =>
        Math.floor(idx / 40) === cbtState.currentSubjectIndex
    );
    const question = currentQuestions[cbtState.currentQuestionIndex];

    const content = `
        <div class="cbt-exam-screen">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
                <div class="timer-display" id="cbt-timer-container">
                    <i class="fas fa-clock"></i>
                    <span id="cbt-timer">3:00:00</span>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    ${cbtState.subjects.map((subj, idx) => `
                        <button class="btn ${idx === cbtState.currentSubjectIndex ? 'btn-primary' : 'btn-outline'}" 
                                onclick="switchCBTSubject(${idx})"
                                style="padding: 8px 16px; font-size: 12px;">
                            ${subj}
                        </button>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary" onclick="confirmSubmitCBT()">
                    <i class="fas fa-check-circle"></i> Submit
                </button>
            </div>
            
            <div class="card mb-3">
                <div style="padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                    <strong>${cbtState.subjects[cbtState.currentSubjectIndex]}</strong>
                    <span>Question ${cbtState.currentQuestionIndex + 1} of 40</span>
                </div>
            </div>
            
            <div class="question-card">
                <div class="question-number">Question ${question.subject_position}</div>
                <div class="question-text">${question.question}</div>
                
                ${question.image_path ? `
                    <img src="${API_CONFIG.BASE_URL}${question.image_path}" alt="Question image" style="max-width: 100%; border-radius: var(--radius-md); margin: 20px 0;">
                ` : ''}
                
                <div class="options-list">
                    ${Object.entries(question.options).map(([letter, text]) => `
                        <div class="option-item ${cbtState.answers[question.question_id] === letter ? 'selected' : ''}" 
                             onclick="selectCBTAnswer('${question.question_id}', '${letter}')">
                            <div class="option-letter">${letter}</div>
                            <div>${text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
                <button class="btn btn-outline" 
                        onclick="navigateCBTQuestion(-1)" 
                        ${cbtState.currentQuestionIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                
                <button class="btn btn-outline" 
                        onclick="navigateCBTQuestion(1)" 
                        ${cbtState.currentQuestionIndex === 39 ? 'disabled' : ''}>
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');

    updateCBTTimerDisplay(cbtState.timeLimit - Math.floor((Date.now() - cbtState.startTime) / 1000));
}

function switchCBTSubject(index) {
    cbtState.currentSubjectIndex = index;
    cbtState.currentQuestionIndex = 0;
    showCBTExam();
}

function selectCBTAnswer(questionId, answer) {
    cbtState.answers[questionId] = answer;
    showCBTExam();
}

function navigateCBTQuestion(direction) {
    cbtState.currentQuestionIndex += direction;
    showCBTExam();
}

function confirmSubmitCBT() {
    const answeredCount = Object.keys(cbtState.answers).length;
    const totalCount = 160;

    const confirmed = confirm(`You've answered ${answeredCount}/160 questions. Submit exam now?`);
    if (confirmed) {
        submitCBTExam();
    }
}

async function submitCBTExam() {
    if (cbtState.timerInterval) {
        clearInterval(cbtState.timerInterval);
    }

    showLoading('Submitting exam...');

    try {
        const answers = cbtState.questions.map(q => ({
            question_id: q.question_id,
            user_answer: cbtState.answers[q.question_id] || null
        }));

        const result = await api.submitCBT(cbtState.sessionId, answers);

        await showCBTResults(result);
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to submit: ' + error.message, 'error');
    }
}

async function showCBTResults(result) {
    const user = authManager.getUser();

    const content = `
        <div class="results-screen">
            <div class="text-center mb-3">
                <i class="fas fa-trophy" style="font-size: 80px; color: var(--primary-yellow);"></i>
                <h1 style="margin: 20px 0;">CBT Exam Complete!</h1>
                <div style="font-size: 56px; font-weight: 700; color: var(--primary-yellow-dark); margin-bottom: 8px;">
                    ${result.overall_score}/160
                </div>
                <div style="font-size: 20px; color: var(--text-secondary);">
                    ${result.overall_accuracy.toFixed(1)}% Overall Accuracy
                </div>
            </div>
            
            <div class="card mb-3">
                <div class="card-header">
                    <h2>Subject Breakdown</h2>
                </div>
                <div style="display: grid; gap: 16px;">
                    ${result.subject_breakdown.map(sub => `
                        <div style="padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 4px solid var(--primary-yellow);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <strong>${sub.subject}</strong>
                                <span style="font-size: 20px; font-weight: 600;">${sub.correct}/${sub.total}</span>
                            </div>
                            <div style="color: var(--text-secondary); margin-bottom: 8px;">
                                Accuracy: ${sub.accuracy.toFixed(1)}%
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${sub.accuracy}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-primary" onclick="router.navigate('cbt', {mode: 'review', sessionId: '${result.session_id}'})">
                    <i class="fas fa-eye"></i> Review Answers
                </button>
                <button class="btn btn-outline" onclick="router.navigate('cbt')">
                    <i class="fas fa-redo"></i> New Exam
                </button>
                <button class="btn btn-outline" onclick="router.navigate('dashboard')">
                    <i class="fas fa-home"></i> Dashboard
                </button>
            </div>
        </div>
    `;

    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = createAppLayout(user, content);
    mainApp.classList.remove('hidden');
}

async function showCBTReview(sessionId) {
    showLoading('Loading review...');

    try {
        const user = authManager.getUser();
        const data = await api.reviewCBT(sessionId);

        const content = `
            <div class="results-screen">
                <h1><i class="fas fa-eye"></i> CBT Review - ${data.score}/${data.total} (${data.accuracy.toFixed(1)}%)</h1>
                
                <div class="card mt-3">
                    <div class="card-header">
                        <h2>All Questions</h2>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${data.questions_with_answers.map((q, idx) => `
                            <div style="padding: 16px; border: 2px solid ${q.is_correct ? 'var(--success)' : 'var(--error)'}; border-radius: var(--radius-md); background: ${q.is_correct ? '#E8F5E9' : '#FFEBEE'};">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <strong>Q${q.question_number}: ${q.subject}</strong>
                                    <i class="fas fa-${q.is_correct ? 'check-circle' : 'times-circle'}" style="color: ${q.is_correct ? 'var(--success)' : 'var(--error)'}; font-size: 24px;"></i>
                                </div>
                                <p style="margin-bottom: 12px;">${q.question}</p>
                                <div>
                                    <div><strong style="color: var(--success);">Correct:</strong> ${q.correct_answer}</div>
                                    ${!q.is_correct ? `<div><strong style="color: var(--error);">Your answer:</strong> ${q.user_answer || 'None'}</div>` : ''}
                                </div>
                                ${q.explanation ? `
                                    <div style="margin-top: 12px; padding: 12px; background: var(--white); border-radius: var(--radius-sm);">
                                        <strong>Explanation:</strong> ${q.explanation}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button class="btn btn-outline mt-3" onclick="router.navigate('dashboard')">
                    <i class="fas fa-home"></i> Back to Dashboard
                </button>
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');

        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load review: ' + error.message, 'error');
    }
}

// Export
window.showCBTScreen = showCBTScreen;
window.updateCBTSubjectCount = updateCBTSubjectCount;
window.startCBTExam = startCBTExam;
window.switchCBTSubject = switchCBTSubject;
window.selectCBTAnswer = selectCBTAnswer;
window.navigateCBTQuestion = navigateCBTQuestion;
window.confirmSubmitCBT = confirmSubmitCBT;
