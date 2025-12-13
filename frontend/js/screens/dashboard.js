// Dashboard Screen

async function showDashboard() {
    showLoading('Loading dashboard...');

    try {
        const user = authManager.getUser();
        const stats = await api.getDashboardStats();
        
        // Log for debugging
        console.log('Dashboard stats received:', stats);
        console.log('Recommended topics:', stats.recommended_topics);

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
                        <button class="btn btn-primary" onclick="showAnalyticsDashboard()">
                            <i class="fas fa-chart-line"></i> View Analytics
                        </button>
                    </div>
                </div>
                
                <!-- Recommended Topics (Based on Department & Performance) -->
                ${stats.recommended_topics && stats.recommended_topics.length > 0 ? `
                    <div class="card mt-3" style="border-top: 4px solid var(--success);">
                        <div class="card-header">
                            <h2><i class="fas fa-lightbulb" style="color: var(--primary-yellow);"></i> Recommended Topics for You</h2>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
                                ${stats.profile.department ? `Based on your <strong>${stats.profile.department}</strong> department and your performance` : 'Based on your performance'}
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                            ${stats.recommended_topics.map((topic, idx) => `
                                <div style="padding: 16px; background: linear-gradient(135deg, var(--primary-yellow-light) 0%, var(--white) 100%); border-radius: var(--radius-md); border-left: 4px solid var(--success); cursor: pointer; transition: var(--transition);" 
                                     onmouseover="this.style.boxShadow='var(--shadow-lg)'; this.style.transform='translateY(-4px)'" 
                                     onmouseout="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(0)'"
                                     onclick="router.navigate('learn', {subject: '${topic.subject}', topic: '${topic.topic}'})">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                        <span style="display: inline-block; width: 28px; height: 28px; background: var(--primary-yellow); color: var(--white); border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700;">${idx + 1}</span>
                                        <span style="font-weight: 600; color: var(--text-secondary);">${topic.subject}</span>
                                    </div>
                                    <h3 style="margin-bottom: 8px; color: var(--text-primary);">${topic.topic}</h3>
                                    ${topic.accuracy !== null && topic.accuracy !== undefined && topic.accuracy > 0 ? `
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-color);">
                                            <span style="font-size: 12px; color: var(--text-secondary);">Current Accuracy</span>
                                            <span style="font-size: 16px; font-weight: 700; color: var(--error);">${topic.accuracy.toFixed(1)}%</span>
                                        </div>
                                    ` : `
                                        <div style="padding-top: 12px; border-top: 1px solid var(--border-color);">
                                            <span style="font-size: 12px; color: var(--text-secondary);">Start learning this topic</span>
                                        </div>
                                    `}
                                </div>
                            `).join('')}
                        </div>
                        <div style="padding-top: 16px; border-top: 1px solid var(--border-color); margin-top: 16px;">
                            <button class="btn btn-primary" onclick="router.navigate('learn')" style="width: 100%; justify-content: center;">
                                <i class="fas fa-book-reader"></i> Start Learning
                            </button>
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
                ${stats.profile && stats.profile.registered_subjects && stats.profile.registered_subjects.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-book"></i> Your Registered Subjects (${stats.profile.department || 'JAMB'})</h2>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                            ${stats.profile.registered_subjects.map((sub, idx) => `
                                <div style="padding: 12px 20px; background: var(--primary-yellow-light); border-radius: var(--radius-sm); font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: var(--primary-yellow); color: var(--white); border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; flex-shrink: 0;">${sub.position}</span>
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
