// Dashboard Screen

async function showDashboard() {
    showLoading('Loading dashboard...');
    
    try {
        const user = authManager.getUser();
        const stats = await api.getDashboardStats();
        
        const content = `
            <div class="dashboard">
                <h1 style="margin-bottom: 24px;">Welcome back, ${user.name.split(' ')[0]}! 👋</h1>
                
                <!-- Stats Cards -->
                <div class="stats-grid">
                    ${createStatCard('Total Attempts', stats.overall_stats.total_attempts, 'fa-question-circle', 'var(--info)')}
                    ${createStatCard('Accuracy', stats.overall_stats.overall_accuracy.toFixed(1) + '%', 'fa-bullseye', 'var(--success)')}
                    ${createStatCard('Correct Answers', stats.overall_stats.correct_attempts, 'fa-check-circle', 'var(--success)')}
                    ${createStatCard('Active Days', stats.overall_stats.total_active_days, 'fa-calendar-check', 'var(--primary-yellow-dark)')}
                </div>
                
                <!-- Streak Card -->
                <div class="streak-card mt-3">
                    <div class="streak-icon">🔥</div>
                    <div class="streak-info">
                        <h3>${stats.streak.current_streak} Day Streak!</h3>
                        <p>Longest streak: ${stats.streak.longest_streak} days • Last activity: ${utils.formatDate(stats.streak.last_activity)}</p>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <button class="btn btn-primary" onclick="router.navigate('learn')">
                            <i class="fas fa-book-reader"></i> Learn Topics
                        </button>
                        <button class="btn btn-primary" onclick="router.navigate('year-practice')">
                            <i class="fas fa-calendar-alt"></i> Year Practice
                        </button>
                        <button class="btn btn-primary" onclick="router.navigate('cbt')">
                            <i class="fas fa-laptop"></i> Start CBT
                        </button>
                    </div>
                </div>
                
                <!-- Weakest Topics -->
                ${stats.weakest_topics && stats.weakest_topics.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> Topics That Need Attention</h2>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${stats.weakest_topics.slice(0, 5).map(topic => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-light); border-radius: var(--radius-sm); cursor: pointer;" onclick="router.navigate('learn', {subject: '${topic.subject}', topic: '${topic.topic}'})">
                                    <div>
                                        <strong>${topic.subject} - ${topic.topic}</strong>
                                        <div style="font-size: 12px; color: var(--text-secondary);">${topic.attempts} attempts</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 20px; font-weight: 600; color: var(--error);">${topic.accuracy.toFixed(1)}%</div>
                                        <div style="font-size: 12px; color: var(--text-secondary);">accuracy</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Recent Activity -->
                ${stats.recent_attempts && stats.recent_attempts.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-history"></i> Recent Activity</h2>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${stats.recent_attempts.slice(0, 10).map(attempt => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-color);">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <i class="fas ${attempt.is_correct ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${attempt.is_correct ? 'var(--success)' : 'var(--error)'}; font-size: 20px;"></i>
                                        <div>
                                            <strong>${attempt.subject}${attempt.topic ? ' - ' + attempt.topic : ''}</strong>
                                            <div style="font-size: 12px; color: var(--text-secondary);">${attempt.practice_type}</div>
                                        </div>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">
                                        ${utils.formatDate(attempt.timestamp)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- CBT History -->
                ${stats.cbt_history && stats.cbt_history.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-laptop"></i> CBT Exam History</h2>
                        </div>
                        <div style="display: grid; gap: 16px;">
                            ${stats.cbt_history.map(cbt => `
                                <div style="padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 4px solid var(--primary-yellow);">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <strong>${utils.formatDate(cbt.date)}</strong>
                                        <span style="font-size: 24px; font-weight: 700; color: var(--primary-yellow-dark);">${cbt.score}/${cbt.total}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: var(--text-secondary);">Accuracy: ${cbt.accuracy.toFixed(1)}%</span>
                                        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="router.navigate('cbt', {mode: 'review', sessionId: '${cbt.session_id}'})">
                                            View Details
                                        </button>
                                    </div>
                                    <div class="progress-bar mt-2">
                                        <div class="progress-fill" style="width: ${cbt.accuracy}%;"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Registered Subjects -->
                ${stats.registered_subjects && stats.registered_subjects.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-book"></i> Your Registered Subjects</h2>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                            ${stats.registered_subjects.map((sub, idx) => `
                                <div style="padding: 12px 20px; background: var(--primary-yellow-light); border-radius: var(--radius-sm); font-weight: 600;">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: var(--primary-yellow); color: var(--white); border-radius: 50%; text-align: center; line-height: 24px; margin-right: 8px; font-size: 12px;">${sub.position}</span>
                                    ${sub.subject}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load dashboard: ' + error.message, 'error');
    }
}

function createStatCard(label, value, icon, color) {
    return `
        <div class="stat-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <p style="margin-bottom: 8px; color: var(--text-secondary);">${label}</p>
                    <h3 style="color: ${color};">${value}</h3>
                </div>
                <i class="fas ${icon}" style="font-size: 32px; color: ${color}; opacity: 0.3;"></i>
            </div>
        </div>
    `;
}

// Export function
window.showDashboard = showDashboard;
