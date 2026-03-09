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

                <!-- ===== STRENGTHS & WEAKNESSES ROW ===== -->
                ${(stats.strengths && stats.strengths.length > 0) || (stats.weaknesses && stats.weaknesses.length > 0) ? (() => {
                const hasBoth = stats.strengths?.length > 0 && stats.weaknesses?.length > 0;
                return `
                    <div class="sw-row mt-3" style="display: grid; grid-template-columns: ${hasBoth ? '1fr 1fr' : '1fr'}; gap: 16px;">

                        <!-- STRENGTHS -->
                        ${stats.strengths && stats.strengths.length > 0 ? `
                        <div class="card" style="border-top: 4px solid var(--success);">
                            <div class="card-header" style="cursor:pointer;" onclick="toggleSection('strengths-body')">
                                <h2><i class="fas fa-star" style="color: var(--success);"></i> Your Strengths
                                    <i id="strengths-chevron" class="fas fa-chevron-down" style="margin-left:8px; font-size:13px; color:var(--text-secondary);"></i>
                                </h2>
                                <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Topics where you score ≥ 70%</p>
                            </div>
                            <div id="strengths-body" style="display:none;">
                            <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 8px;">
                                ${stats.strengths.map(s => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f0fdf4; border-radius: var(--radius-sm); border-left: 3px solid var(--success);">
                                        <div>
                                            <div style="font-size: 13px; font-weight: 600;">${s.topic}</div>
                                            <div style="font-size: 11px; color: var(--text-secondary);">${s.subject} · ${s.attempts} attempt${s.attempts !== 1 ? 's' : ''}</div>
                                        </div>
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #22c55e, #16a34a); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white;">
                                            ${Math.round(s.accuracy)}%
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- WEAKNESSES -->
                        ${stats.weaknesses && stats.weaknesses.length > 0 ? `
                        <div class="card" style="border-top: 4px solid var(--error);">
                            <div class="card-header" style="cursor:pointer;" onclick="toggleSection('weaknesses-body')">
                                <h2><i class="fas fa-exclamation-triangle" style="color: var(--error);"></i> Areas to Improve
                                    <i id="weaknesses-chevron" class="fas fa-chevron-down" style="margin-left:8px; font-size:13px; color:var(--text-secondary);"></i>
                                </h2>
                                <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Topics scoring below 70% — click to study</p>
                            </div>
                            <div id="weaknesses-body" style="display:none;">
                            <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 8px;">
                                ${stats.weaknesses.map(w => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fff1f2; border-radius: var(--radius-sm); border-left: 3px solid var(--error); cursor: pointer;"
                                         onclick="router.navigate('guided-learn', {subject: '${w.subject}', topic: '${w.topic}'})">
                                        <div>
                                            <div style="font-size: 13px; font-weight: 600;">${w.topic}</div>
                                            <div style="font-size: 11px; color: var(--text-secondary);">${w.subject} · ${w.attempts} attempt${w.attempts !== 1 ? 's' : ''}</div>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #b91c1c); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white;">
                                                ${Math.round(w.accuracy)}%
                                            </div>
                                            <i class="fas fa-chevron-right" style="color: var(--error); font-size: 12px;"></i>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    `;
            })() : ''}

                <!-- ===== RECENT TOPICS ===== -->
                ${stats.recent_topics && stats.recent_topics.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header">
                            <h2><i class="fas fa-clock" style="color: var(--primary-yellow-dark);"></i> Recently Studied Topics</h2>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; padding-top: 8px;">
                            ${stats.recent_topics.map(rt => `
                                <div onclick="router.navigate('guided-learn', {subject: '${rt.subject}', topic: '${rt.topic}'})"
                                     style="padding: 10px 16px; background: var(--primary-yellow-light); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;"
                                     onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='var(--primary-yellow-light)'">
                                    <i class="fas fa-book-open" style="color: var(--primary-yellow-dark); font-size: 14px;"></i>
                                    <div>
                                        <div style="font-size: 13px; font-weight: 600;">${rt.topic}</div>
                                        <div style="font-size: 11px; color: var(--text-secondary);">${rt.subject}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- ===== RECENT ACTIVITY ===== -->
                ${stats.recent_attempts && stats.recent_attempts.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                            <h2><i class="fas fa-history"></i> Recent Activity</h2>
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <select id="activity-filter" onchange="filterRecentActivity(this.value)" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                                    <option value="count-5">Last 5</option>
                                    <option value="count-10">Last 10</option>
                                    <option value="count-20">Last 20</option>
                                    <option value="days-1">Today</option>
                                    <option value="days-3">Last 3 Days</option>
                                    <option value="days-7">Last 7 Days</option>
                                    <option value="all">Show All</option>
                                </select>
                            </div>
                        </div>
                        <div id="activity-container" style="max-height: 340px; overflow-y: auto;">
                            ${stats.recent_attempts.slice(0, 5).map((attempt, idx) => renderActivityItem(attempt, idx)).join('')}
                        </div>
                    </div>

                ` : ''}
                
                <!-- CBT History (Collapsible) -->
                ${stats.cbt_history && stats.cbt_history.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                            <h2><i class="fas fa-laptop"></i> CBT Exam History (${stats.cbt_history.length})</h2>
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <select id="cbt-history-filter" onchange="filterCBTHistory(this.value)" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                                    <option value="count-3">Last 3</option>
                                    <option value="count-5">Last 5</option>
                                    <option value="count-10">Last 10</option>
                                    <option value="days-3">Last 3 Days</option>
                                    <option value="days-7">Last 7 Days</option>
                                    <option value="days-30">Last 30 Days</option>
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

                ` : ''}
                
                <!-- Year Practice History -->
                ${stats.year_practice_history && stats.year_practice_history.length > 0 ? `
                    <div class="card mt-3">
                        <div class="card-header" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="toggleSection('year-practice-body')">
                            <h2><i class="fas fa-calendar-alt" style="color:#1D4ED8;"></i> Year Practice History (${stats.year_practice_history.length})
                                <i id="year-practice-chevron" class="fas fa-chevron-down" style="margin-left:8px; font-size:13px; color:var(--text-secondary);"></i>
                            </h2>
                            <div style="display:flex; gap:12px; align-items:center;" onclick="event.stopPropagation()">
                                <select id="year-practice-filter" onchange="filterYearPracticeHistory(this.value)" style="padding:6px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                                    <option value="count-5">Last 5</option>
                                    <option value="count-10">Last 10</option>
                                    <option value="days-7">Last 7 Days</option>
                                    <option value="days-30">Last 30 Days</option>
                                    <option value="all">Show All</option>
                                </select>
                            </div>
                        </div>
                        <div id="year-practice-body" style="display:block;">
                            <div id="year-practice-history-container" style="max-height:400px; overflow-y:auto;">
                                ${stats.year_practice_history.slice(0, 5).map((yp, idx) => `
                                    <div class="yp-history-item" data-index="${idx}" style="padding:12px 16px; background:var(--bg-light); border-radius:var(--radius-md); border-left:4px solid #1D4ED8; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <strong>${yp.subject} — ${yp.year}</strong>
                                            <div style="font-size:12px; color:var(--text-secondary);">Accuracy: ${typeof yp.accuracy === 'number' ? yp.accuracy.toFixed(1) : yp.accuracy}% &nbsp;·&nbsp; ${utils.formatDate(yp.completed_at || yp.date)}</div>
                                        </div>
                                        <span style="font-size:18px; font-weight:700; color:#1D4ED8;">${yp.correct_answers}/${yp.total_questions}</span>
                                    </div>
                                `).join('')}
                            </div>
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

        // Assign data AFTER render so filter functions can access it (script tags inside innerHTML don't execute)
        window.recentActivityData = stats.recent_attempts || [];
        window.cbtHistoryData = stats.cbt_history || [];
        window.yearPracticeHistoryData = stats.year_practice_history || [];

        // Start real-time activity polling (every 30 seconds)
        if (window._activityPollTimer) clearInterval(window._activityPollTimer);
        window._activityPollTimer = setInterval(() => refreshDashboardActivity(), 30000);

        hideLoading();

        // Show onboarding tour for first-time users
        if (typeof tourManager !== 'undefined') tourManager.maybeStart();
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

// Filter recent activity based on dropdown (supports count-N and days-N prefixes)
function filterRecentActivity(value) {
    const container = document.getElementById('activity-container');
    if (!container || !window.recentActivityData) return;

    const data = window.recentActivityData;
    let items;

    if (value === 'all') {
        items = data;
    } else if (value.startsWith('days-')) {
        const days = parseInt(value.split('-')[1]);
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        items = data.filter(a => {
            const ts = new Date(a.timestamp).getTime();
            return !isNaN(ts) && ts >= cutoff;
        });
    } else if (value.startsWith('count-')) {
        const limit = parseInt(value.split('-')[1]);
        items = data.slice(0, limit);
    } else {
        items = data.slice(0, parseInt(value) || 5);
    }

    container.innerHTML = items.length === 0
        ? '<p style="color:var(--text-secondary);padding:12px;">No activity found for this period.</p>'
        : items.map((attempt, idx) => renderActivityItem(attempt, idx)).join('');
}

/**
 * Renders a single recent-activity row with a source badge
 * (CBT / Year Practice / Guided Learning) and correct/incorrect icon.
 */
function renderActivityItem(attempt, idx) {
    const sourceConfig = {
        cbt: { label: 'CBT', color: '#7C3AED', bg: '#F3E8FF' },
        year: { label: 'Year', color: '#1D4ED8', bg: '#EFF6FF' },
        guided: { label: 'Guided', color: '#D97706', bg: '#FFF9E6' },
        topic: { label: 'Topic', color: '#15803D', bg: '#F0FDF4' },
        revision: { label: 'Revision', color: '#BE123C', bg: '#FFF1F2' },
    };
    const src = sourceConfig[attempt.practice_type] || { label: attempt.practice_type || '—', color: '#6B7280', bg: '#F3F4F6' };

    // is_correct can be null (guided completions without a question)
    let resultIcon = '';
    if (attempt.is_correct === true) resultIcon = `<i class="fas fa-check-circle" style="color: var(--success); font-size: 15px;"></i>`;
    if (attempt.is_correct === false) resultIcon = `<i class="fas fa-times-circle" style="color: var(--error); font-size: 15px;"></i>`;

    return `
        <div class="activity-item" data-index="${idx}"
             style="display: flex; justify-content: space-between; align-items: center;
                    padding: 9px 14px; border-bottom: 1px solid var(--border-color); gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                ${resultIcon}
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${attempt.subject}${attempt.topic ? ' — ' + attempt.topic : ''}
                    </div>
                </div>
                <span style="
                    font-size: 11px; font-weight: 700; padding: 2px 8px;
                    border-radius: 10px; background: ${src.bg}; color: ${src.color};
                    white-space: nowrap; flex-shrink: 0;">
                    ${src.label}
                </span>
            </div>
            <span style="font-size: 11px; color: var(--text-secondary); white-space: nowrap; flex-shrink: 0; margin-left: 8px;">
                ${utils.formatDate(attempt.timestamp)}
            </span>
        </div>
    `;
}

// Filter year practice history
function filterYearPracticeHistory(value) {
    const container = document.getElementById('year-practice-history-container');
    if (!container || !window.yearPracticeHistoryData) return;

    const data = window.yearPracticeHistoryData;
    let items;

    if (value === 'all') {
        items = data;
    } else if (value.startsWith('days-')) {
        const days = parseInt(value.split('-')[1]);
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        items = data.filter(yp => {
            const ts = new Date(yp.completed_at || yp.date).getTime();
            return !isNaN(ts) && ts >= cutoff;
        });
    } else if (value.startsWith('count-')) {
        const limit = parseInt(value.split('-')[1]);
        items = data.slice(0, limit);
    } else {
        items = data.slice(0, parseInt(value) || 5);
    }

    container.innerHTML = items.length === 0
        ? '<p style="color:var(--text-secondary);padding:12px;">No records found for this period.</p>'
        : items.map((yp, idx) => `
        <div class="yp-history-item" data-index="${idx}" style="padding:12px 16px; background:var(--bg-light); border-radius:var(--radius-md); border-left:4px solid #1D4ED8; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${yp.subject} — ${yp.year}</strong>
                <div style="font-size:12px; color:var(--text-secondary);">Accuracy: ${typeof yp.accuracy === 'number' ? yp.accuracy.toFixed(1) : yp.accuracy}% &nbsp;·&nbsp; ${utils.formatDate(yp.completed_at || yp.date)}</div>
            </div>
            <span style="font-size:18px; font-weight:700; color:#1D4ED8;">${yp.correct_answers}/${yp.total_questions}</span>
        </div>
    `).join('');
}

// Toggle accordion section visibility
function toggleSection(bodyId) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    // Rotate chevron icon
    const chevronId = bodyId.replace('-body', '-chevron');
    const chevron = document.getElementById(chevronId);
    if (chevron) {
        chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        chevron.style.transition = 'transform 0.2s';
    }
}

// Real-time activity refresh (polls /dashboard/stats every 30 seconds)
async function refreshDashboardActivity() {
    try {
        const stats = await api.getDashboardStats();
        if (!stats) return;
        window.recentActivityData = stats.recent_attempts || [];

        // Re-apply the current filter selection
        const activityFilter = document.getElementById('activity-filter');
        const container = document.getElementById('activity-container');
        if (container) {
            const value = activityFilter ? activityFilter.value : 'count-5';
            filterRecentActivity(value);
        }
    } catch (e) {
        // Silently ignore network errors during background refresh
    }
}

// Export filter functions
window.filterCBTHistory = filterCBTHistory;
window.filterRecentActivity = filterRecentActivity;
window.filterYearPracticeHistory = filterYearPracticeHistory;
window.toggleSection = toggleSection;
window.refreshDashboardActivity = refreshDashboardActivity;

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
