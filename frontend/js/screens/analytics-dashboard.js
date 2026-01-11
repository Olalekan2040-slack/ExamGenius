// Analytics Dashboard Screen - World-Class Performance Analysis

async function showAnalyticsDashboard() {
    showLoading('Loading analytics...');

    try {
        const user = authManager.getUser();
        const analytics = await api.getLearningAnalytics();

        const overall = analytics.overall || { total_attempts: 0, correct_answers: 0, accuracy: 0 };
        const bySubject = analytics.by_subject || [];
        const streaks = analytics.streaks || { current: 0, longest: 0, total_active_days: 0 };
        const recent = analytics.recent_practice || [];
        const weekly = analytics.weekly_trend || [];
        const sw = analytics.strengths_weaknesses || {};

        const content = `
            <div class="analytics-dashboard" style="max-width: 1400px; margin: 0 auto;">
                <!-- Header -->
                <div style="margin-bottom: 32px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h1 style="margin: 0;"><i class="fas fa-chart-bar"></i> Performance Analytics</h1>
                        <button class="btn btn-outline" onclick="router.navigate('dashboard')" style="padding: 8px 16px;">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary);">Comprehensive insights into your learning journey</p>
                </div>

                <!-- Overall Performance Section -->
                <div style="background: linear-gradient(135deg, var(--primary-yellow)20, var(--success)20); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 32px; border: 2px solid var(--border-color);">
                    <h2 style="margin-top: 0; margin-bottom: 24px;"><i class="fas fa-trophy"></i> Overall Performance</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px;">
                        <div style="text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--primary-yellow-dark); margin-bottom: 8px;">
                                ${overall.accuracy?.toFixed(1) || 0}%
                            </div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Overall Accuracy</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--success); margin-bottom: 8px;">
                                ${overall.correct_answers || 0}
                            </div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Correct Answers</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--info); margin-bottom: 8px;">
                                ${overall.total_attempts || 0}
                            </div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Total Attempts</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--error); margin-bottom: 8px;">
                                ${(overall.total_attempts - overall.correct_answers) || 0}
                            </div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Need Review</div>
                        </div>
                    </div>
                </div>

                <!-- Streaks & Activity -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div class="card">
                        <div class="card-header">
                            <h3 style="margin: 0;"><i class="fas fa-fire" style="color: var(--error);"></i> Learning Streaks</h3>
                        </div>
                        <div style="padding: 24px; text-align: center;">
                            <div style="font-size: 56px; font-weight: 700; color: var(--error); margin-bottom: 8px;">
                                🔥 ${streaks.current}
                            </div>
                            <div style="color: var(--text-secondary); margin-bottom: 16px;">Current streak days</div>
                            <div style="padding: 12px; background: var(--bg-light); border-radius: var(--radius-md); margin-bottom: 16px;">
                                <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">Longest Streak</div>
                                <div style="font-weight: 700; color: var(--primary);">${streaks.longest} days</div>
                            </div>
                            <div style="padding: 12px; background: var(--bg-light); border-radius: var(--radius-md);">
                                <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">Total Active Days</div>
                                <div style="font-weight: 700; color: var(--success);">${streaks.total_active_days} days</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 style="margin: 0;"><i class="fas fa-calendar-alt" style="color: var(--info);"></i> Weekly Activity</h3>
                        </div>
                        <div style="padding: 20px;">
                            ${weekly && weekly.length > 0 ? `
                                <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; height: 150px; padding: 20px 0;">
                                    ${weekly.slice(-7).map(day => {
                                        const maxAccuracy = Math.max(...weekly.map(w => w.accuracy || 0), 100);
                                        const height = (day.accuracy / maxAccuracy) * 100;
                                        return `
                                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                                <div style="width: 100%; height: ${height}%; background: linear-gradient(180deg, var(--success), var(--success)80); border-radius: 4px 4px 0 0; transition: all 0.3s;" title="${day.accuracy.toFixed(1)}%"></div>
                                                <small style="color: var(--text-secondary); font-size: 10px;">${new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}</small>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                <small style="color: var(--text-secondary); text-align: center; display: block;">Last 7 days activity</small>
                            ` : `
                                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                                    <p>No activity in the last 7 days</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Performance by Subject -->
                ${bySubject && bySubject.length > 0 ? `
                <div class="card" style="margin-bottom: 32px;">
                    <div class="card-header">
                        <h3 style="margin: 0;"><i class="fas fa-book"></i> Performance by Subject</h3>
                    </div>
                    <div style="padding: 20px;">
                        <div style="display: grid; gap: 16px;">
                            ${bySubject.map((subject, idx) => `
                                <div style="padding: 16px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 4px solid ${getScoreColor(subject.accuracy)};">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                        <div>
                                            <div style="font-weight: 600; font-size: 16px;">${subject.subject}</div>
                                            <div style="font-size: 12px; color: var(--text-secondary);">${subject.attempts} attempts • ${subject.correct} correct</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-size: 28px; font-weight: 700; color: ${getScoreColor(subject.accuracy)};">${subject.accuracy?.toFixed(1) || 0}%</div>
                                        </div>
                                    </div>
                                    <div style="background: white; height: 8px; border-radius: 4px; overflow: hidden;">
                                        <div style="height: 100%; width: ${subject.accuracy || 0}%; background: ${getScoreColor(subject.accuracy)}; transition: width 0.3s;"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Strengths & Weaknesses -->
                ${sw && (sw.strengths || sw.weaknesses) ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    ${sw.strengths && sw.strengths.length > 0 ? `
                    <div class="card">
                        <div class="card-header">
                            <h3 style="margin: 0;"><i class="fas fa-star" style="color: var(--success);"></i> Your Strengths</h3>
                        </div>
                        <div style="padding: 16px;">
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Topics where you excel</p>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${sw.strengths.slice(0, 5).map((strength, idx) => `
                                    <div style="padding: 12px; background: #E8F5E920; border-radius: var(--radius-md); border-left: 3px solid var(--success);">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                            <div style="flex: 1;">
                                                <div style="font-weight: 600; margin-bottom: 4px;">${idx + 1}. ${strength.topic}</div>
                                                <div style="font-size: 12px; color: var(--text-secondary);">
                                                    ${strength.attempts} attempts • Trend: ${strength.trend}
                                                </div>
                                            </div>
                                            <div style="font-size: 20px; font-weight: 700; color: var(--success);">${strength.accuracy}%</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    ${sw.weaknesses && sw.weaknesses.length > 0 ? `
                    <div class="card">
                        <div class="card-header">
                            <h3 style="margin: 0;"><i class="fas fa-exclamation-triangle" style="color: var(--error);"></i> Focus Areas</h3>
                        </div>
                        <div style="padding: 16px;">
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Topics needing more practice</p>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${sw.weaknesses.slice(0, 5).map((weakness, idx) => `
                                    <div style="padding: 12px; background: #FFEBEE20; border-radius: var(--radius-md); border-left: 3px solid var(--error);">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                            <div style="flex: 1;">
                                                <div style="font-weight: 600; margin-bottom: 4px;">${idx + 1}. ${weakness.topic}</div>
                                                <div style="font-size: 12px; color: var(--text-secondary);">
                                                    ${weakness.attempts} attempts • Trend: ${weakness.trend}
                                                </div>
                                            </div>
                                            <div style="font-size: 20px; font-weight: 700; color: var(--error);">${weakness.accuracy}%</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <!-- Insights Summary -->
                ${sw.summary ? `
                <div class="card" style="background: linear-gradient(135deg, var(--primary-yellow)10, var(--success)10);">
                    <div class="card-header">
                        <h3 style="margin: 0;"><i class="fas fa-lightbulb"></i> AI Insights</h3>
                    </div>
                    <div style="padding: 20px;">
                        <p style="font-size: 16px; color: var(--text-primary); line-height: 1.6;">
                            ${sw.summary}
                        </p>
                    </div>
                </div>
                ` : ''}

                <!-- Recent Topics -->
                ${recent && recent.length > 0 ? `
                <div class="card" style="margin-top: 32px;">
                    <div class="card-header">
                        <h3 style="margin: 0;"><i class="fas fa-history"></i> Recent Topics Practiced</h3>
                    </div>
                    <div style="padding: 16px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
                            ${recent.slice(0, 8).map(topic => `
                                <div style="padding: 12px; background: var(--bg-light); border-radius: var(--radius-md); border-left: 3px solid ${getScoreColor(topic.accuracy)};">
                                    <div style="font-weight: 600; margin-bottom: 6px;">${topic.subject}</div>
                                    <div style="font-size: 14px; margin-bottom: 8px;">${topic.topic}</div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 12px; color: var(--text-secondary);">${topic.attempts} attempts</span>
                                        <span style="font-weight: 700; color: ${getScoreColor(topic.accuracy)};">${topic.accuracy}%</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Action Buttons -->
                <div style="display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="router.navigate('guided-learn')" style="flex: 1; min-width: 150px;">
                        <i class="fas fa-book-reader"></i> Continue Learning
                    </button>
                    <button class="btn btn-outline" onclick="router.navigate('year-practice')" style="flex: 1; min-width: 150px;">
                        <i class="fas fa-calendar-alt"></i> Year Practice
                    </button>
                    <button class="btn btn-outline" onclick="window.print()" style="flex: 1; min-width: 150px;">
                        <i class="fas fa-download"></i> Export Report
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
        showToast('Failed to load analytics: ' + error.message, 'error');
    }
}

// Helper functions
function getScoreColor(score) {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#EF4444';
    return '#DC2626';
}

// Export function
window.showAnalyticsDashboard = showAnalyticsDashboard;
