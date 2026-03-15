/**
 * Admin Dashboard Screen
 * Content management, question banking, bulk uploads, and admin controls
 */

class AdminDashboard {
    constructor(container) {
        this.container = container;
        this.currentTab = 'dashboard';
        this.selectedFile = null;
        this.uploadProgress = null;
    }

    async render() {
        if (!this.container) return;
        // Check admin access
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin' && user.role !== 'moderator') {
            return this.renderAccessDenied();
        }

        this.container.innerHTML = `
            <div class="admin-dashboard">
                ${this.renderNav()}
                <div class="admin-content">
                    <div id="admin-main"></div>
                </div>
            </div>
        `;

        this.addNavListeners();
        await this.loadTab('dashboard');
    }

    renderNav() {
        return `
            <nav class="admin-nav">
                <div class="admin-nav-header">
                    <h2>📊 Admin Panel</h2>
                </div>
                <ul class="admin-nav-menu">
                    <li><a href="#" data-tab="dashboard" class="nav-link active">📊 Dashboard</a></li>
                    <li><a href="#" data-tab="users" class="nav-link">👥 Users</a></li>
                    <li><a href="#" data-tab="questions" class="nav-link">❓ Questions</a></li>
                    <li><a href="#" data-tab="videos" class="nav-link">🎬 Videos</a></li>
                    <li><a href="#" data-tab="notes" class="nav-link">📝 Notes</a></li>
                    <li><a href="#" data-tab="hierarchy" class="nav-link">🗂️ Subjects</a></li>
                    <li><a href="#" data-tab="bulk-upload" class="nav-link">📤 Bulk Upload</a></li>
                    <li><a href="#" data-tab="pending" class="nav-link">⏳ Pending</a></li>
                    <li><a href="#" data-tab="analytics" class="nav-link">📈 Analytics</a></li>
                </ul>
            </nav>
        `;
    }

    addNavListeners() {
        document.querySelectorAll('.admin-nav-menu a').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Update active link
                document.querySelectorAll('.admin-nav-menu a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const tab = link.getAttribute('data-tab');
                await this.loadTab(tab);
            });
        });
    }

    _getMain() {
        return document.getElementById('admin-main');
    }

    async loadTab(tabName) {
        this.currentTab = tabName;
        let el = this._getMain();
        if (!el) return;

        switch (tabName) {
            case 'dashboard': {
                const html = await this.renderDashboard();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'questions': {
                const html = await this.renderQuestionsTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'videos': {
                const html = await this.renderVideosTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'notes': {
                const html = await this.renderNotesTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'hierarchy': {
                const html = await this.renderHierarchyTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'bulk-upload': {
                const html = await this.renderBulkUploadTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'pending': {
                const html = await this.renderPendingTab();
                el = this._getMain(); if (el) el.innerHTML = html;
                break;
            }
            case 'users':
                if (el) el.innerHTML = '<div class="admin-section"><p class="admin-loading">⏳ Loading users...</p></div>';
                await this.renderUsersTab();
                break;
            case 'analytics':
                if (el) el.innerHTML = '<div class="admin-section"><p class="admin-loading">⏳ Loading analytics...</p></div>';
                await this.renderAnalyticsTab();
                break;
        }
    }

    async renderDashboard() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/stats/content`, {
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const stats = await response.json();
            if (!response.ok) throw new Error(stats.detail || `Server error ${response.status}`);

            return `
                <div class="admin-dashboard-content">
                    <h3>📈 Content Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${stats.total_questions || 0}</div>
                            <div class="stat-label">Total Questions</div>
                            <div class="stat-subtext">${stats.verified_questions || 0} verified</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.total_videos || 0}</div>
                            <div class="stat-label">Learning Videos</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.total_notes || 0}</div>
                            <div class="stat-label">Study Notes</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${Object.keys(stats.by_subject || {}).length}</div>
                            <div class="stat-label">Subjects</div>
                        </div>
                    </div>

                    <div class="admin-section">
                        <h4>Questions by Subject</h4>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(stats.by_subject || {})
                                    .map(([subject, count]) => `
                                        <tr>
                                            <td>${subject}</td>
                                            <td>${count}</td>
                                        </tr>
                                    `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="admin-section">
                        <h4>Quick Actions</h4>
                        <div class="quick-actions">
                            <button class="btn btn-primary" onclick="adminDash.navigateTo('questions')">
                                ➕ Add Question
                            </button>
                            <button class="btn btn-primary" onclick="adminDash.navigateTo('bulk-upload')">
                                📤 Bulk Upload
                            </button>
                            <button class="btn btn-primary" onclick="adminDash.navigateTo('pending')">
                                ⏳ Review Pending
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Dashboard error:', error);
            return `<p class="error">Failed to load dashboard: ${error.message}</p>`;
        }
    }

    async renderQuestionsTab() {
        return `
            <div class="admin-section">
                <h3>Question Management</h3>
                
                <div class="admin-section">
                    <h4>Create New Question</h4>
                    <form id="create-question-form" class="admin-form">
                        <div class="form-group">
                            <label>Subject *</label>
                            <select id="q-subject" required>
                                <option value="">Select Subject</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Topic</label>
                            <select id="q-topic">
                                <option value="">Select Topic</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Question Text *</label>
                            <textarea id="q-text" required placeholder="Enter question..."></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Difficulty *</label>
                                <select id="q-difficulty" required>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Year</label>
                                <input type="number" id="q-year" placeholder="2024">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Option A *</label>
                            <input type="text" id="q-option-a" required placeholder="Option A">
                        </div>

                        <div class="form-group">
                            <label>Option B *</label>
                            <input type="text" id="q-option-b" required placeholder="Option B">
                        </div>

                        <div class="form-group">
                            <label>Option C *</label>
                            <input type="text" id="q-option-c" required placeholder="Option C">
                        </div>

                        <div class="form-group">
                            <label>Option D *</label>
                            <input type="text" id="q-option-d" required placeholder="Option D">
                        </div>

                        <div class="form-group">
                            <label>Correct Answer *</label>
                            <select id="q-correct" required>
                                <option value="">Select Correct Option</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Explanation</label>
                            <textarea id="q-explanation" placeholder="Explain why this is correct..."></textarea>
                        </div>

                        <button type="submit" class="btn btn-success">✅ Create Question</button>
                    </form>
                </div>
            </div>
        `;
    }

    async renderVideosTab() {
        return `
            <div class="admin-section">
                <h3>Learning Videos Management</h3>
                
                <div class="admin-section">
                    <h4>Add New Video</h4>
                    <form id="create-video-form" class="admin-form">
                        <div class="form-group">
                            <label>Subject *</label>
                            <select id="v-subject" required>
                                <option value="">Select Subject</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Topic</label>
                            <select id="v-topic">
                                <option value="">Select Topic</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Video Title *</label>
                            <input type="text" id="v-title" required placeholder="Enter video title">
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="v-description" placeholder="Video description..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Video URL *</label>
                            <input type="url" id="v-url" required placeholder="https://drive.google.com/file/d/...">
                        </div>

                        <div class="form-group">
                            <label>Platform *</label>
                            <select id="v-platform" required>
                                <option value="gdrive">Google Drive</option>
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Duration (seconds)</label>
                            <input type="number" id="v-duration" placeholder="3600">
                        </div>

                        <button type="submit" class="btn btn-success">✅ Add Video</button>
                    </form>
                </div>
            </div>
        `;
    }

    async renderNotesTab() {
        return `
            <div class="admin-section">
                <h3>Learning Notes Management</h3>
                
                <div class="admin-section">
                    <h4>Create Study Notes</h4>
                    <form id="create-notes-form" class="admin-form">
                        <div class="form-group">
                            <label>Subject *</label>
                            <select id="n-subject" required>
                                <option value="">Select Subject</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Topic</label>
                            <select id="n-topic">
                                <option value="">Select Topic</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Note Title *</label>
                            <input type="text" id="n-title" required placeholder="Enter note title">
                        </div>

                        <div class="form-group">
                            <label>Content *</label>
                            <textarea id="n-content" required placeholder="Enter note content..." style="min-height: 300px;"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Format</label>
                            <select id="n-format">
                                <option value="markdown">Markdown</option>
                                <option value="html">HTML</option>
                                <option value="plain">Plain Text</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-success">✅ Create Note</button>
                    </form>
                </div>
            </div>
        `;
    }

    async renderHierarchyTab() {
        return `
            <div class="admin-section">
                <h3>Subject & Topic Hierarchy</h3>
                
                <div class="admin-section">
                    <h4>Create Subject</h4>
                    <form id="create-subject-form" class="admin-form-inline">
                        <input type="text" id="subj-name" placeholder="Subject name" required>
                        <input type="text" id="subj-icon" placeholder="Icon (📚)" required>
                        <textarea id="subj-desc" placeholder="Description"></textarea>
                        <button type="submit" class="btn btn-success">Add Subject</button>
                    </form>
                </div>

                <div class="admin-section">
                    <h4>Create Topic</h4>
                    <form id="create-topic-form" class="admin-form-inline">
                        <select id="topic-subject" required>
                            <option value="">Select Subject</option>
                        </select>
                        <input type="text" id="topic-name" placeholder="Topic name" required>
                        <textarea id="topic-desc" placeholder="Description"></textarea>
                        <button type="submit" class="btn btn-success">Add Topic</button>
                    </form>
                </div>

                <div id="hierarchy-display"></div>
            </div>
        `;
    }

    async renderBulkUploadTab() {
        return `
            <div class="admin-section">
                <h3>Bulk Upload</h3>
                
                <div class="admin-section">
                    <h4>Upload Questions (CSV)</h4>
                    <p>CSV Columns: question, option_a, option_b, option_c, option_d, correct_answer, explanation, year, difficulty, topic_id</p>
                    
                    <form id="bulk-upload-form" class="admin-form">
                        <div class="form-group">
                            <label>Select Subject *</label>
                            <select id="bulk-subject" required>
                                <option value="">Select Subject</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Upload CSV File *</label>
                            <input type="file" id="bulk-file" accept=".csv" required>
                        </div>

                        <button type="submit" class="btn btn-success">📤 Upload</button>
                    </form>

                    <div id="upload-progress" style="display: none;">
                        <p id="progress-text"></p>
                        <div class="progress-bar">
                            <div id="progress-fill" style="width: 0%"></div>
                        </div>
                    </div>

                    <div id="upload-results"></div>
                </div>

                <div class="admin-section">
                    <h4>Download Template</h4>
                    <button class="btn btn-outline" onclick="adminDash.downloadCSVTemplate()">
                        📥 Download Questions CSV Template
                    </button>
                </div>
            </div>
        `;
    }

    async renderPendingTab() {
        return `
            <div class="admin-section">
                <h3>Pending Content Approval</h3>
                
                <div class="tab-buttons">
                    <button class="btn" onclick="adminDash.showPendingContent('questions')">Questions</button>
                    <button class="btn" onclick="adminDash.showPendingContent('videos')">Videos</button>
                    <button class="btn" onclick="adminDash.showPendingContent('notes')">Notes</button>
                </div>

                <div id="pending-content-list"></div>
            </div>
        `;
    }

    async renderUsersTab(searchQuery = '', roleFilter = '') {
        let mainElement = this._getMain();
        try {
            let url = `${API_CONFIG.BASE_URL}/api/v1/admin/users?limit=50`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (roleFilter) url += `&role=${encodeURIComponent(roleFilter)}`;

            const resp = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.detail || `Server error ${resp.status}`);
            const users = data.users || [];

            mainElement = this._getMain();
            if (!mainElement) return;
            mainElement.innerHTML = `
                <div class="admin-section">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
                        <h3 style="margin:0">👥 User Management <span style="font-size:14px;color:#666">(${data.total} total)</span></h3>
                        <div style="display:flex;gap:8px;flex-wrap:wrap">
                            <input id="user-search" type="text" placeholder="Search name/email..." value="${searchQuery}"
                                style="padding:7px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;width:200px"
                                onkeydown="if(event.key==='Enter') adminDash.renderUsersTab(this.value, document.getElementById('role-filter').value)">
                            <select id="role-filter" onchange="adminDash.renderUsersTab(document.getElementById('user-search').value, this.value)"
                                style="padding:7px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px">
                                <option value="" ${!roleFilter ? 'selected' : ''}>All Roles</option>
                                <option value="student" ${roleFilter==='student' ? 'selected' : ''}>Students</option>
                                <option value="moderator" ${roleFilter==='moderator' ? 'selected' : ''}>Moderators</option>
                                <option value="admin" ${roleFilter==='admin' ? 'selected' : ''}>Admins</option>
                            </select>
                        </div>
                    </div>
                    <div style="overflow-x:auto">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                                <th>Verified</th><th>Points</th><th>Active Days</th>
                                <th>Status</th><th>Joined</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => `
                                <tr style="${u.is_banned ? 'background:#fff0f0' : ''}">
                                    <td>${u.id}</td>
                                    <td><strong>${this.escHtml(u.name)}</strong></td>
                                    <td style="font-size:12px">${this.escHtml(u.email)}</td>
                                    <td>
                                        <select onchange="adminDash.changeRole(${u.id}, this.value)" style="font-size:12px;padding:3px 6px;border-radius:4px">
                                            <option value="student" ${u.role==='student'?'selected':''}>student</option>
                                            <option value="moderator" ${u.role==='moderator'?'selected':''}>moderator</option>
                                            <option value="admin" ${u.role==='admin'?'selected':''}>admin</option>
                                        </select>
                                    </td>
                                    <td style="text-align:center">${u.is_verified ? '✅' : '❌'}</td>
                                    <td style="text-align:center">${u.points}</td>
                                    <td style="text-align:center">${u.active_days}</td>
                                    <td style="text-align:center">${u.is_banned ? '<span style="color:#e53e3e;font-weight:600">Banned</span>' : '<span style="color:#38a169">Active</span>'}</td>
                                    <td style="font-size:12px">${u.created_at ? u.created_at.slice(0,10) : ''}</td>
                                    <td>
                                        <div style="display:flex;gap:4px">
                                            ${u.is_banned
                                                ? `<button onclick="adminDash.banUser(${u.id}, false)" style="font-size:11px;padding:3px 7px;background:#38a169;color:#fff;border:none;border-radius:4px;cursor:pointer">Unban</button>`
                                                : `<button onclick="adminDash.banUser(${u.id}, true)" style="font-size:11px;padding:3px 7px;background:#dd6b20;color:#fff;border:none;border-radius:4px;cursor:pointer">Ban</button>`
                                            }
                                            <button onclick="adminDash.deleteUser(${u.id}, '${this.escHtml(u.name)}')" style="font-size:11px;padding:3px 7px;background:#e53e3e;color:#fff;border:none;border-radius:4px;cursor:pointer">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    </div>
                </div>
            `;
        } catch (err) {
            const el = this._getMain();
            if (el) el.innerHTML = `<div class="admin-section"><p class="admin-error">❌ Error loading users: ${err.message}</p></div>`;
        }
    }

    escHtml(str) {
        return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    async changeRole(userId, newRole) {
        if (!confirm(`Change user #${userId} role to '${newRole}'?`)) return;
        try {
            const resp = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/users/${userId}/role?new_role=${newRole}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const data = await resp.json();
            if (resp.ok) {
                alert(`✅ ${data.message}`);
                this.renderUsersTab();
            } else {
                alert(`❌ ${data.detail || 'Failed to update role'}`);
                this.renderUsersTab();
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async banUser(userId, banned) {
        const reason = banned ? (prompt('Ban reason (optional):') || '') : null;
        if (banned && reason === null) return; // cancelled
        try {
            let url = `${API_CONFIG.BASE_URL}/api/v1/admin/users/${userId}/ban?banned=${banned}`;
            if (reason) url += `&reason=${encodeURIComponent(reason)}`;
            const resp = await fetch(url, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const data = await resp.json();
            if (resp.ok) {
                alert(`✅ ${data.message}`);
                this.renderUsersTab();
            } else {
                alert(`❌ ${data.detail || 'Failed'}`);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async deleteUser(userId, name) {
        if (!confirm(`⚠️ PERMANENTLY delete user "${name}" (ID: ${userId})? This cannot be undone.`)) return;
        if (!confirm('Are you absolutely sure? All their data will be deleted.')) return;
        try {
            const resp = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const data = await resp.json();
            if (resp.ok) {
                alert(`✅ ${data.message}`);
                this.renderUsersTab();
            } else {
                alert(`❌ ${data.detail || 'Failed to delete user'}`);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async renderAnalyticsTab() {
        let mainElement = this._getMain();
        try {
            const resp = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/stats/platform`, {
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const s = await resp.json();
            if (!resp.ok) throw new Error(s.detail || `Server error ${resp.status}`);

            const dailyActHTML = (s.daily_active_14d || []).map(d =>
                `<tr><td>${d.date}</td><td>${d.active_users}</td></tr>`
            ).join('') || '<tr><td colspan="2" style="color:#999">No data yet</td></tr>';

            const regHTML = (s.daily_registrations_14d || []).map(d =>
                `<tr><td>${d.date}</td><td>${d.registrations}</td></tr>`
            ).join('') || '<tr><td colspan="2" style="color:#999">No data yet</td></tr>';

            const bySubHTML = Object.entries(s.questions_by_subject || {}).map(([sub, cnt]) =>
                `<tr><td>${sub}</td><td>${cnt}</td></tr>`
            ).join('') || '<tr><td colspan="2" style="color:#999">No data</td></tr>';

            mainElement = this._getMain();
            if (!mainElement) return;
            mainElement.innerHTML = `
                <div class="admin-section">
                    <h3>📈 Platform Analytics</h3>

                    <div class="stats-grid" style="margin-bottom:24px">
                        <div class="stat-card">
                            <div class="stat-number">${s.total_users || 0}</div>
                            <div class="stat-label">Total Users</div>
                            <div class="stat-subtext">${s.verified_users || 0} verified · ${s.banned_users || 0} banned</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${s.new_users_7d || 0}</div>
                            <div class="stat-label">New Users (7d)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${s.active_users_7d || 0}</div>
                            <div class="stat-label">Active Users (7d)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${s.total_questions || 0}</div>
                            <div class="stat-label">Total Questions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${s.total_practice_attempts || 0}</div>
                            <div class="stat-label">Practice Attempts</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${s.overall_accuracy_pct || 0}%</div>
                            <div class="stat-label">Overall Accuracy</div>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;flex-wrap:wrap">
                        <div>
                            <h4>Daily Active Users (14d)</h4>
                            <table class="admin-table">
                                <thead><tr><th>Date</th><th>Active</th></tr></thead>
                                <tbody>${dailyActHTML}</tbody>
                            </table>
                        </div>
                        <div>
                            <h4>Daily Registrations (14d)</h4>
                            <table class="admin-table">
                                <thead><tr><th>Date</th><th>New Users</th></tr></thead>
                                <tbody>${regHTML}</tbody>
                            </table>
                        </div>
                        <div>
                            <h4>Questions by Subject</h4>
                            <table class="admin-table">
                                <thead><tr><th>Subject</th><th>Count</th></tr></thead>
                                <tbody>${bySubHTML}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            const el = this._getMain();
            if (el) el.innerHTML = `<div class="admin-section"><p class="admin-error">❌ Error loading analytics: ${err.message}</p></div>`;
        }
    }

    renderAccessDenied() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="access-denied">
                <h2>⛔ Access Denied</h2>
                <p>You don't have permission to access the admin panel.</p>
                <button class="btn btn-primary" onclick="window.location.href='/'">Go Home</button>
            </div>
        `;
    }

    navigateTo(tab) {
        const link = document.querySelector(`[data-tab="${tab}"]`);
        if (link) link.click();
    }

    downloadCSVTemplate() {
        const csv = `question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id
"What is the capital of France?","London","Paris","Berlin","Madrid","B","Paris is the capital and largest city of France.",2023,"easy",1
"What is 2 + 2?","3","4","5","6","B","2 + 2 equals 4.",2023,"easy",2`;
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions_template.csv';
        a.click();
    }

    async showPendingContent(contentType) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/pending-verification?content_type=${contentType}`, {
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            const content = await response.json();

            const listElement = document.getElementById('pending-content-list');
            if (!listElement) return;
            if (content.length === 0) {
                listElement.innerHTML = `<p>No pending ${contentType} for approval.</p>`;
                return;
            }

            listElement.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${content.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.text || item.title}</td>
                                <td>
                                    <button class="btn btn-small btn-success" 
                                            onclick="adminDash.approveContent('${contentType}', ${item.id})">
                                        ✅ Approve
                                    </button>
                                    <button class="btn btn-small btn-danger" 
                                            onclick="adminDash.rejectContent('${contentType}', ${item.id})">
                                        ❌ Reject
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error loading pending content:', error);
        }
    }

    async approveContent(contentType, contentId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/verify/${contentType}/${contentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` }
            });
            
            if (response.ok) {
                alert('✅ Content approved!');
                this.showPendingContent(contentType);
            } else {
                alert('❌ Failed to approve content');
            }
        } catch (error) {
            console.error('Error approving content:', error);
        }
    }

    async rejectContent(contentType, contentId) {
        const reason = prompt('Rejection reason:');
        if (!reason) return;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/admin/reject/${contentType}/${contentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authManager.getAccessToken()}` },
                body: JSON.stringify({ reason })
            });
            
            if (response.ok) {
                alert('❌ Content rejected');
                this.showPendingContent(contentType);
            }
        } catch (error) {
            console.error('Error rejecting content:', error);
        }
    }
}

// Global instance
let adminDash = null;

async function showAdminDashboard() {
    const user = authManager.getUser();
    const mainApp = document.getElementById('main-app');
    if (!mainApp) return;

    // Render the standard app layout (sidebar with Dashboard/navigation links) so
    // the user can always navigate back to their dashboard via the sidebar.
    mainApp.innerHTML = createAppLayout(user, '<div id="admin-container"></div>');
    mainApp.classList.remove('hidden');

    const container = document.getElementById('admin-container');
    adminDash = new AdminDashboard(container);
    await adminDash.render();
}
