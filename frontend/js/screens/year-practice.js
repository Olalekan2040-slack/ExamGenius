// Year Practice Screen

let yearPracticeState = {
    subject: null,
    year: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {}
};

async function showYearPracticeScreen(params = {}) {
    if (params.mode === 'practice' && params.subject && params.year) {
        yearPracticeState.subject = params.subject;
        yearPracticeState.year = params.year;
        await startYearPractice();
    } else {
        await showYearPracticeSelect();
    }
}

async function showYearPracticeSelect() {
    showLoading('Loading...');

    try {
        const user = authManager.getUser();
        const [subjects, years] = await Promise.all([
            api.getSubjects(),
            api.getYears()
        ]);

        const content = `
            <div class="year-practice-screen">
                <h1><i class="fas fa-calendar-alt"></i> Practice by Year</h1>
                <p style="margin-bottom: 32px; color: var(--text-secondary);">
                    Select a subject and year to practice past JAMB questions
                </p>
                
                <div class="card">
                    <div class="card-header">
                        <h2>Select Practice Settings</h2>
                    </div>
                    
                    <div class="form-group">
                        <label for="year-subject">Subject</label>
                        <select id="year-subject" required>
                            <option value="">-- Select Subject --</option>
                            ${subjects.subjects.map(s => `
                                <option value="${s}">${s}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="year-year">Year</label>
                        <select id="year-year" required>
                            <option value="">-- Select Year --</option>
                            ${years.years.map(y => `
                                <option value="${y}">${y}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="year-count">Number of Questions</label>
                        <select id="year-count">
                            <option value="10">10 questions</option>
                            <option value="20" selected>20 questions</option>
                            <option value="30">30 questions</option>
                            <option value="40">40 questions</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary btn-lg btn-block" onclick="handleStartYearPractice()">
                        <i class="fas fa-play-circle"></i> Start Practice
                    </button>
                    <button class="btn btn-outline btn-block" style="margin-top:12px;" onclick="showYearPracticeHistory()">
                        <i class="fas fa-history"></i> View Practice History
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
        showToast('Failed to load: ' + error.message, 'error');
    }
}

async function handleStartYearPractice() {
    const subject = document.getElementById('year-subject').value;
    const year = document.getElementById('year-year').value;
    const count = parseInt(document.getElementById('year-count').value);

    if (!subject || !year) {
        showToast('Please select both subject and year', 'warning');
        return;
    }

    yearPracticeState.subject = subject;
    yearPracticeState.year = year;

    await startYearPractice(count);
}

async function startYearPractice(count = 20) {
    showLoading('Loading questions...');

    try {
        const data = await api.getYearPracticeQuestions(
            yearPracticeState.subject,
            yearPracticeState.year,
            count
        );

        if (data.incomplete_year_data) {
            showToast('Warning: Limited questions available for this year', 'warning');
        }

        yearPracticeState.questions = data.questions;
        yearPracticeState.currentQuestionIndex = 0;
        yearPracticeState.answers = {};

        await showYearPracticeQuestion();
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load questions: ' + error.message, 'error');
    }
}

async function showYearPracticeQuestion() {
    const user = authManager.getUser();
    const question = yearPracticeState.questions[yearPracticeState.currentQuestionIndex];
    const total = yearPracticeState.questions.length;
    const current = yearPracticeState.currentQuestionIndex + 1;

    const content = `
        <div class="practice-screen">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <button class="btn btn-outline" onclick="confirmExitYearPractice()">
                    <i class="fas fa-times"></i> Exit
                </button>
                <div style="text-align: center;">
                    <div style="font-weight: 600; font-size: 18px;">
                        Question ${current} of ${total}
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary);">
                        ${yearPracticeState.subject} ${yearPracticeState.year}
                    </div>
                </div>
                <div style="width: 100px;"></div>
            </div>
            
            <div class="question-card">
                <div class="question-number">${question.topic}</div>
                
                ${question.passage ? `
                    <div class="passage-box" style="background: var(--bg-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px; border-left: 4px solid var(--info);">
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--info);"><i class="fas fa-book-open"></i> Passage/Context:</div>
                        <div style="line-height: 1.6; color: var(--text-secondary);">${question.passage}</div>
                    </div>
                ` : ''}
                
                ${question.table_html ? `
                    <div class="table-context" style="overflow-x: auto; margin-bottom: 16px; border-left: 4px solid var(--primary-yellow); padding: 12px 12px 4px; background: var(--bg-light); border-radius: var(--radius-md);">
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--primary-yellow-dark);"><i class="fas fa-table"></i> Study the following:</div>
                        ${question.table_html}
                    </div>
                ` : ''}
                
                <div class="question-text">${utils.formatQuestionText(question.question, question.subject || yearPracticeState.subject)}</div>
                
                ${question.image_path ? `
                    <img src="${API_CONFIG.BASE_URL}/static/${question.image_path}" alt="Question image" style="max-width: 100%; border-radius: var(--radius-md); margin: 16px 0; display: block;" onerror="this.style.display='none'">
                ` : ''}
                
                <div class="options-list">
                    ${Object.entries(question.options).map(([letter, text]) => `
                        <div class="option-item ${yearPracticeState.answers[question.question_id] === letter ? 'selected' : ''}" 
                             onclick="selectYearAnswer('${question.question_id}', '${letter}')">
                            <div class="option-letter">${letter}</div>
                            <div>${utils.formatQuestionText(text, question.subject || yearPracticeState.subject)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
                <button class="btn btn-outline" 
                        onclick="navigateYearQuestion(-1)" 
                        ${current === 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                
                ${current === total ? `
                    <button class="btn btn-primary btn-lg" onclick="submitYearPractice()">
                        <i class="fas fa-check-circle"></i> Submit Answers
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="navigateYearQuestion(1)">
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

function selectYearAnswer(questionId, answer) {
    yearPracticeState.answers[questionId] = answer;
    showYearPracticeQuestion();
}

function navigateYearQuestion(direction) {
    yearPracticeState.currentQuestionIndex += direction;
    showYearPracticeQuestion();
}

function confirmExitYearPractice() {
    const confirmed = confirm('Exit practice? Your progress will be lost.');
    if (confirmed) {
        showYearPracticeSelect();
    }
}

async function submitYearPractice() {
    const answeredCount = Object.keys(yearPracticeState.answers).length;
    const totalCount = yearPracticeState.questions.length;

    if (answeredCount < totalCount) {
        const confirmed = confirm(`Only answered ${answeredCount}/${totalCount}. Submit anyway?`);
        if (!confirmed) return;
    }

    showLoading('Submitting...');

    try {
        const answers = yearPracticeState.questions.map(q => ({
            question_id: q.question_id,
            user_answer: yearPracticeState.answers[q.question_id] || null
        }));

        const result = await api.submitYearPractice(
            yearPracticeState.subject,
            yearPracticeState.year,
            answers
        );

        await showYearPracticeResults(result);
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to submit: ' + error.message, 'error');
    }
}

async function showYearPracticeResults(result) {
    const user = authManager.getUser();

    const content = `
        <div class="results-screen">
            <div class="text-center mb-3">
                <i class="fas fa-trophy" style="font-size: 64px; color: var(--primary-yellow);"></i>
                <h1 style="margin: 20px 0;">${yearPracticeState.subject} ${yearPracticeState.year} Results</h1>
                <div style="font-size: 48px; font-weight: 700; color: var(--primary-yellow-dark); margin-bottom: 8px;">
                    ${result.summary.score.toFixed(1)}%
                </div>
                <div style="color: var(--text-secondary);">
                    ${result.summary.correct}/${result.summary.total} correct
                </div>
            </div>
            
            <div class="stats-grid mb-3">
                ${createStatCard('Correct', result.summary.correct, 'fa-check', 'var(--success)')}
                ${createStatCard('Incorrect', result.summary.incorrect, 'fa-times', 'var(--error)')}
                ${createStatCard('Score', result.summary.score.toFixed(1) + '%', 'fa-trophy', 'var(--primary-yellow-dark)')}
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h2>Answer Review</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${result.results.map((res, idx) => {
        const question = yearPracticeState.questions.find(q => q.question_id === res.question_id);
        const isCorrect = res.is_correct !== undefined ? res.is_correct : res.correct; // backend returns is_correct
        return `
                            <div style="padding: 16px; border: 2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}; border-radius: var(--radius-md); background: ${isCorrect ? '#E8F5E9' : '#FFEBEE'};">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <strong>Q${idx + 1}: ${question.topic}</strong>
                                    <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}" style="color: ${isCorrect ? 'var(--success)' : 'var(--error)'}; font-size: 24px;"></i>
                                </div>
                                <p style="margin-bottom: 12px;">${utils.formatQuestionText(question.question, question.subject || yearPracticeState.subject)}</p>
                                ${question.passage ? `<div style="background: var(--bg-light); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 10px; border-left: 4px solid var(--info); font-size: 14px; line-height: 1.5;">${question.passage}</div>` : ''}
                                ${question.table_html ? `<div style="overflow-x: auto; margin-bottom: 10px; border-left: 4px solid var(--primary-yellow); padding: 8px 12px 4px; background: var(--bg-light); border-radius: var(--radius-md); font-size: 13px;">${question.table_html}</div>` : ''}
                                ${question.image_path ? `<img src="${API_CONFIG.BASE_URL}/static/${question.image_path}" alt="Question image" style="max-width: 100%; border-radius: var(--radius-md); margin: 8px 0 12px; display: block;" onerror="this.style.display='none'">` : ''}
                                <div>
                                    <div><strong style="color: var(--success);">Correct:</strong> ${res.correct_answer}</div>
                                    ${!isCorrect ? `<div><strong style="color: var(--error);">Your answer:</strong> ${res.user_answer || 'None'}</div>` : ''}
                                </div>
                                ${res.explanation ? `
                                    <div style="margin-top: 12px; padding: 12px; background: var(--white); border-radius: var(--radius-sm);">
                                        <strong>Explanation:</strong> ${res.explanation}
                                    </div>
                                ` : ''}
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn btn-primary" onclick="showYearPracticeSelect()">
                    <i class="fas fa-redo"></i> New Practice
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

// Export
window.showYearPracticeScreen = showYearPracticeScreen;
window.handleStartYearPractice = handleStartYearPractice;
window.selectYearAnswer = selectYearAnswer;
window.navigateYearQuestion = navigateYearQuestion;
window.confirmExitYearPractice = confirmExitYearPractice;
window.submitYearPractice = submitYearPractice;

async function showYearPracticeHistory() {
    showLoading('Loading history...');
    try {
        const user = authManager.getUser();
        const data = await api.getYearPracticeHistory();
        const history = data.history || [];

        const content = `
            <div class="year-practice-screen">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                    <button class="btn btn-outline" onclick="showYearPracticeSelect()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 style="margin:0;"><i class="fas fa-history"></i> Year Practice History</h1>
                </div>

                ${history.length === 0 ? `
                    <div class="card" style="text-align:center; padding:40px;">
                        <i class="fas fa-inbox" style="font-size:48px; color:var(--text-secondary); opacity:0.4;"></i>
                        <p style="margin-top:16px; color:var(--text-secondary);">No year practice sessions yet.</p>
                        <button class="btn btn-primary" style="margin-top:16px;" onclick="showYearPracticeSelect()">
                            <i class="fas fa-play-circle"></i> Start a Practice
                        </button>
                    </div>
                ` : `
                    <div class="card">
                        <div class="card-header">
                            <h2>${history.length} Session${history.length !== 1 ? 's' : ''}</h2>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px; padding-top:8px;">
                            ${history.map(session => `
                                <div style="padding:14px 16px; background:var(--bg-light); border-radius:var(--radius-md); border-left:4px solid #1D4ED8; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                                    <div>
                                        <div style="font-weight:700; font-size:15px;">${session.subject} &mdash; ${session.year}</div>
                                        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${utils.formatDate(session.date || session.completed_at)}</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:12px;">
                                        <span style="font-size:16px; font-weight:700; color:#1D4ED8;">${session.correct_answers}/${session.total_questions}</span>
                                        <span style="font-size:13px; font-weight:600; color:${session.accuracy >= 70 ? 'var(--success)' : session.accuracy >= 50 ? '#D97706' : 'var(--error)'}">${typeof session.accuracy === 'number' ? session.accuracy.toFixed(1) : session.accuracy}%</span>
                                        ${session.id ? `
                                            <button class="btn btn-outline" style="padding:4px 12px; font-size:12px;" onclick="reviewYearPracticeSession(${session.id})">
                                                <i class="fas fa-eye"></i> Review
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `}
            </div>
        `;

        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load history: ' + error.message, 'error');
    }
}

async function reviewYearPracticeSession(sessionId) {
    showLoading('Loading review...');
    try {
        const user = authManager.getUser();
        const session = await api.getYearPracticeSessionReview(sessionId);
        const results = session.results || [];

        const content = `
            <div class="results-screen">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
                    <button class="btn btn-outline" onclick="showYearPracticeHistory()">
                        <i class="fas fa-arrow-left"></i> Back to History
                    </button>
                    <h1 style="margin:0;">${session.subject} ${session.year} &mdash; Review</h1>
                </div>

                <div class="stats-grid mb-3">
                    ${createStatCard('Score', (session.accuracy || 0).toFixed(1) + '%', 'fa-trophy', 'var(--primary-yellow-dark)')}
                    ${createStatCard('Correct', session.correct_answers, 'fa-check', 'var(--success)')}
                    ${createStatCard('Incorrect', session.total_questions - session.correct_answers, 'fa-times', 'var(--error)')}
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2>Question Review (${results.length} questions)</h2>
                        <p style="font-size:13px; color:var(--text-secondary); margin-top:4px;">Completed: ${utils.formatDate(session.completed_at)}</p>
                    </div>
                    ${results.length === 0 ? `
                        <div style="padding:24px; text-align:center; color:var(--text-secondary);">
                            <i class="fas fa-info-circle"></i> Detailed review is only available for sessions completed after the latest update.
                        </div>
                    ` : `
                        <div style="display:flex; flex-direction:column; gap:16px; padding-top:8px;">
                            ${results.map((res, idx) => {
            const isCorrect = res.is_correct;
            const opts = res.options || {};
            return `
                                    <div style="padding:16px; border:2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}; border-radius:var(--radius-md); background:${isCorrect ? '#f0fdf4' : '#fff1f2'};">
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                            <div>
                                                <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">${res.subject || ''} &bull; ${res.topic || ''}</span>
                                                <div style="font-weight:700; margin-top:4px;">Q${idx + 1}</div>
                                            </div>
                                            <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}" style="color:${isCorrect ? 'var(--success)' : 'var(--error)'}; font-size:22px;"></i>
                                        </div>
                                        <p style="margin:0 0 12px; line-height:1.5;">${res.question || ''}</p>
                                        ${Object.keys(opts).length > 0 ? `
                                            <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">
                                                ${Object.entries(opts).map(([key, text]) => `
                                                    <div style="padding:7px 12px; border-radius:6px; font-size:13px;
                                                        background:${key === res.correct_answer ? '#dcfce7' : (key === res.user_answer && !isCorrect ? '#fee2e2' : 'var(--bg-light)')};
                                                        border:1px solid ${key === res.correct_answer ? 'var(--success)' : (key === res.user_answer && !isCorrect ? 'var(--error)' : 'var(--border-color)')};                                                        font-weight:${key === res.correct_answer || key === res.user_answer ? '600' : '400'};">
                                                        <strong>${key}.</strong> ${text}
                                                        ${key === res.correct_answer ? ' <span style="color:var(--success); font-size:11px;">&#10003; Correct</span>' : ''}
                                                        ${key === res.user_answer && !isCorrect ? ' <span style="color:var(--error); font-size:11px;">&#10005; Your answer</span>' : ''}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : `
                                            <div style="font-size:13px; margin-bottom:8px;">
                                                <strong style="color:var(--success);">Correct:</strong> ${res.correct_answer}
                                                ${!isCorrect ? ` &nbsp; <strong style="color:var(--error);">Yours:</strong> ${res.user_answer || 'None'}` : ''}
                                            </div>
                                        `}
                                        ${res.explanation ? `
                                            <div style="padding:10px 12px; background:white; border-radius:var(--radius-sm); font-size:13px;">
                                                <strong>Explanation:</strong> ${res.explanation}
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
        }).join('')}
                        </div>
                    `}
                </div>

                <div style="display:flex; gap:12px; margin-top:24px; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="showYearPracticeSelect()">
                        <i class="fas fa-play-circle"></i> New Practice
                    </button>
                    <button class="btn btn-outline" onclick="showYearPracticeHistory()">
                        <i class="fas fa-history"></i> History
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
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load review: ' + error.message, 'error');
    }
}

window.showYearPracticeHistory = showYearPracticeHistory;
window.reviewYearPracticeSession = reviewYearPracticeSession;
