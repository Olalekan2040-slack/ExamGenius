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
                <div class="question-text">${question.question}</div>
                
                ${question.image_path ? `
                    <img src="${API_CONFIG.BASE_URL}${question.image_path}" alt="Question image" style="max-width: 100%; border-radius: var(--radius-md); margin: 20px 0;">
                ` : ''}
                
                <div class="options-list">
                    ${Object.entries(question.options).map(([letter, text]) => `
                        <div class="option-item ${yearPracticeState.answers[question.question_id] === letter ? 'selected' : ''}" 
                             onclick="selectYearAnswer('${question.question_id}', '${letter}')">
                            <div class="option-letter">${letter}</div>
                            <div>${text}</div>
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
                        return `
                            <div style="padding: 16px; border: 2px solid ${res.correct ? 'var(--success)' : 'var(--error)'}; border-radius: var(--radius-md); background: ${res.correct ? '#E8F5E9' : '#FFEBEE'};">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <strong>Q${idx + 1}: ${question.topic}</strong>
                                    <i class="fas fa-${res.correct ? 'check-circle' : 'times-circle'}" style="color: ${res.correct ? 'var(--success)' : 'var(--error)'}; font-size: 24px;"></i>
                                </div>
                                <p style="margin-bottom: 12px;">${question.question}</p>
                                <div>
                                    <div><strong style="color: var(--success);">Correct:</strong> ${res.correct_answer}</div>
                                    ${!res.correct ? `<div><strong style="color: var(--error);">Your answer:</strong> ${res.user_answer || 'None'}</div>` : ''}
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
