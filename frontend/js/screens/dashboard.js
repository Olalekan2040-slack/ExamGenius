// Dashboard Screen

async function showDashboard() {
    showLoading('Loading dashboard...');

    try {
        const user = authManager.getUser();
        const stats = await api.getDashboardStats();
        
        // Fetch unified points from all sources
        let pointsData = { total_points: 0, level: 1, level_name: 'Beginner', breakdown: {} };
        try {
            pointsData = await api.getPoints();
        } catch (e) {
            console.log('Could not fetch points:', e);
        }
        
        // Log for debugging
        console.log('Dashboard stats received:', stats);
        console.log('Points data:', pointsData);

        const breakdown = pointsData.breakdown || {};

        const content = `
            <div class="dashboard">
                <h1 style="margin-bottom: 24px;">Welcome back, ${user.name.split(' ')[0]}! 👋</h1>
                
                <!-- Stats Cards -->
                <div class="stats-grid">
                    ${createStatCard('Points', pointsData.total_points, 'fa-star', 'var(--primary-yellow)')}
                    ${createStatCard('Accuracy', stats.overall_stats.overall_accuracy.toFixed(1) + '%', 'fa-bullseye', 'var(--success)')}
                    ${createStatCard('Correct Answers', stats.overall_stats.correct_attempts, 'fa-check-circle', 'var(--success)')}
                    ${createStatCard('Active Days', stats.overall_stats.total_active_days, 'fa-calendar-check', 'var(--primary-yellow-dark)')}
                </div>
                
                <!-- Learning Level & Streak -->
                <div class="level-streak-row mt-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="learning-level-card card" style="border-top: 4px solid #8b5cf6;">
                        <div class="card-header">
                            <h2><i class="fas fa-trophy" style="color: #ffd700;"></i> Your Level</h2>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 20px 0;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ffd700, #ff8c00); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: white;">
                                ${pointsData.level}
                            </div>
                            <div>
                                <h3 style="margin: 0; font-size: 24px; color: var(--text-primary);">${pointsData.level_name}</h3>
                                <p style="margin: 4px 0 0; color: var(--text-secondary);">${pointsData.total_points} total points</p>
                                <div class="points-breakdown" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                                    ${breakdown.learning ? `<span class="points-badge" title="From guided learning"><i class="fas fa-book"></i> ${breakdown.learning}</span>` : ''}
                                    ${breakdown.cbt ? `<span class="points-badge" title="From CBT exams"><i class="fas fa-laptop"></i> ${breakdown.cbt}</span>` : ''}
                                    ${breakdown.year_practice ? `<span class="points-badge" title="From year practice"><i class="fas fa-calendar"></i> ${breakdown.year_practice}</span>` : ''}
                                    ${breakdown.topic_practice ? `<span class="points-badge" title="From topic practice"><i class="fas fa-pen"></i> ${breakdown.topic_practice}</span>` : ''}
                                    ${breakdown.streak_bonus ? `<span class="points-badge" title="Streak bonus"><i class="fas fa-fire"></i> ${breakdown.streak_bonus}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="streak-card" style="margin: 0;">
                        <div class="streak-icon">🔥</div>
                        <div class="streak-info">
                            <h3>${stats.streak.current_streak} Day Streak!</h3>
                            <p>Longest streak: ${stats.streak.longest_streak} days • Last activity: ${utils.formatDate(stats.streak.last_activity)}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <button class="btn btn-primary" onclick="router.navigate('guided-learn')">
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
                        <div class="recommended-topics-grid">
                            ${stats.recommended_topics.map((topic, idx) => {
                                const sourceLabels = { learning: 'Guided Learning', practice: 'Practice', cbt: 'CBT', year_practice: 'Year Practice', suggested: 'Suggested' };
                                const sourceLabel = sourceLabels[topic.source] || '';
                                return `
                                <div class="recommended-topic-card" 
                                     onclick="router.navigate('guided-learn', {subject: '${topic.subject}', topic: '${topic.topic}'})">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                        <span class="topic-number">${idx + 1}</span>
                                        <span style="font-weight: 600; color: var(--text-secondary); flex: 1;">${topic.subject}</span>
                                        ${sourceLabel ? `<span class="source-badge source-${topic.source || 'suggested'}">${sourceLabel}</span>` : ''}
                                    </div>
                                    <h3 style="margin-bottom: 8px; color: var(--text-primary); font-size: 15px;">${topic.topic}</h3>
                                    ${topic.accuracy !== null && topic.accuracy !== undefined && topic.accuracy > 0 ? `
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-color);">
                                            <span style="font-size: 12px; color: var(--text-secondary);">Current Accuracy</span>
                                            <span style="font-size: 16px; font-weight: 700; color: ${topic.accuracy < 50 ? 'var(--error)' : 'var(--primary-yellow-dark)'};">${topic.accuracy.toFixed(1)}%</span>
                                        </div>
                                    ` : `
                                        <div style="padding-top: 12px; border-top: 1px solid var(--border-color);">
                                            <span style="font-size: 12px; color: var(--text-secondary);">Start learning this topic</span>
                                        </div>
                                    `}
                                </div>
                            `}).join('')}
                        </div>
                        <div style="padding-top: 16px; border-top: 1px solid var(--border-color); margin-top: 16px;">
                            <button class="btn btn-primary" onclick="router.navigate('guided-learn')" style="width: 100%; justify-content: center;">
                                <i class="fas fa-book-reader"></i> Start Learning
                            </button>
                        </div>
                    </div>
                ` : ''}
                
                
                <!-- Recent Activity (Compact Collapsible) -->
                ${stats.recent_attempts && stats.recent_attempts.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                            <h2><i class="fas fa-history"></i> Recent Activity</h2>
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <select id="activity-filter" onchange="filterRecentActivity(this.value)" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                                    <option value="5">Last 5</option>
                                    <option value="10">Last 10</option>
                                    <option value="20">Last 20</option>
                                    <option value="all">Show All</option>
                                </select>
                            </div>
                        </div>
                        <div id="activity-container" style="max-height: 300px; overflow-y: auto;">
                            ${stats.recent_attempts.slice(0, 5).map((attempt, idx) => `
                                <div class="activity-item" data-index="${idx}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--border-color);">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <i class="fas ${attempt.is_correct ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${attempt.is_correct ? 'var(--success)' : 'var(--error)'}; font-size: 16px;"></i>
                                        <span style="font-size: 13px;"><strong>${attempt.subject}</strong>${attempt.topic ? ' - ' + attempt.topic : ''}</span>
                                    </div>
                                    <span style="font-size: 11px; color: var(--text-secondary);">${utils.formatDate(attempt.timestamp)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <script>
                        window.recentActivityData = ${JSON.stringify(stats.recent_attempts)};
                    </script>
                ` : ''}
                
                <!-- CBT History (Collapsible) -->
                ${stats.cbt_history && stats.cbt_history.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                            <h2><i class="fas fa-laptop"></i> CBT Exam History (${stats.cbt_history.length})</h2>
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <select id="cbt-history-filter" onchange="filterCBTHistory(this.value)" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                                    <option value="3">Last 3</option>
                                    <option value="5">Last 5</option>
                                    <option value="10">Last 10</option>
                                    <option value="all">Show All</option>
                                </select>
                            </div>
                        </div>
                        <div id="cbt-history-container" style="max-height: 400px; overflow-y: auto;">
                            ${stats.cbt_history.slice(0, 3).map((cbt, idx) => `
                                <div class="cbt-history-item" data-index="${idx}" style="padding: 12px 16px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 4px solid var(--primary-yellow); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong>${utils.formatDate(cbt.date)}</strong>
                                        <div style="font-size: 12px; color: var(--text-secondary);">Accuracy: ${cbt.accuracy.toFixed(1)}%</div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 18px; font-weight: 700; color: var(--primary-yellow-dark);">${cbt.score}/${cbt.total}</span>
                                        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="router.navigate('cbt', {mode: 'review', sessionId: '${cbt.session_id}'})">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <script>
                        window.cbtHistoryData = ${JSON.stringify(stats.cbt_history)};
                    </script>
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

// Filter CBT history based on dropdown
function filterCBTHistory(count) {
    const container = document.getElementById('cbt-history-container');
    if (!container || !window.cbtHistoryData) return;
    
    const data = window.cbtHistoryData;
    const limit = count === 'all' ? data.length : parseInt(count);
    const items = data.slice(0, limit);
    
    container.innerHTML = items.map((cbt, idx) => `
        <div class="cbt-history-item" data-index="${idx}" style="padding: 12px 16px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 4px solid var(--primary-yellow); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${utils.formatDate(cbt.date)}</strong>
                <div style="font-size: 12px; color: var(--text-secondary);">Accuracy: ${cbt.accuracy.toFixed(1)}%</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 18px; font-weight: 700; color: var(--primary-yellow-dark);">${cbt.score}/${cbt.total}</span>
                <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="router.navigate('cbt', {mode: 'review', sessionId: '${cbt.session_id}'})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

// Filter recent activity based on dropdown
function filterRecentActivity(count) {
    const container = document.getElementById('activity-container');
    if (!container || !window.recentActivityData) return;
    
    const data = window.recentActivityData;
    const limit = count === 'all' ? data.length : parseInt(count);
    const items = data.slice(0, limit);
    
    container.innerHTML = items.map((attempt, idx) => `
        <div class="activity-item" data-index="${idx}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${attempt.is_correct ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${attempt.is_correct ? 'var(--success)' : 'var(--error)'}; font-size: 16px;"></i>
                <span style="font-size: 13px;"><strong>${attempt.subject}</strong>${attempt.topic ? ' - ' + attempt.topic : ''}</span>
            </div>
            <span style="font-size: 11px; color: var(--text-secondary);">${utils.formatDate(attempt.timestamp)}</span>
        </div>
    `).join('');
}

// Export filter functions
window.filterCBTHistory = filterCBTHistory;
window.filterRecentActivity = filterRecentActivity;

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
