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
                    <li><a href="#" data-tab="dashboard" class="nav-link active">Dashboard</a></li>
                    <li><a href="#" data-tab="questions" class="nav-link">Questions</a></li>
                    <li><a href="#" data-tab="videos" class="nav-link">Videos</a></li>
                    <li><a href="#" data-tab="notes" class="nav-link">Learning Notes</a></li>
                    <li><a href="#" data-tab="hierarchy" class="nav-link">Subjects & Topics</a></li>
                    <li><a href="#" data-tab="bulk-upload" class="nav-link">Bulk Upload</a></li>
                    <li><a href="#" data-tab="pending" class="nav-link">Pending Approval</a></li>
                    <li><a href="#" data-tab="analytics" class="nav-link">Analytics</a></li>
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

    async loadTab(tabName) {
        this.currentTab = tabName;
        const mainElement = document.getElementById('admin-main');
        
        switch (tabName) {
            case 'dashboard':
                mainElement.innerHTML = await this.renderDashboard();
                break;
            case 'questions':
                mainElement.innerHTML = await this.renderQuestionsTab();
                break;
            case 'videos':
                mainElement.innerHTML = await this.renderVideosTab();
                break;
            case 'notes':
                mainElement.innerHTML = await this.renderNotesTab();
                break;
            case 'hierarchy':
                mainElement.innerHTML = await this.renderHierarchyTab();
                break;
            case 'bulk-upload':
                mainElement.innerHTML = await this.renderBulkUploadTab();
                break;
            case 'pending':
                mainElement.innerHTML = await this.renderPendingTab();
                break;
            case 'analytics':
                mainElement.innerHTML = await this.renderAnalyticsTab();
                break;
        }
    }

    async renderDashboard() {
        try {
            const response = await fetch(`${API_BASE}/api/v1/admin/stats/content`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            const stats = await response.json();

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

    async renderAnalyticsTab() {
        return `
            <div class="admin-section">
                <h3>Platform Analytics</h3>
                <p>Coming soon: User engagement, content performance, and learning insights</p>
            </div>
        `;
    }

    renderAccessDenied() {
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
            const response = await fetch(`${API_BASE}/api/v1/admin/pending-verification?content_type=${contentType}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            const content = await response.json();

            const listElement = document.getElementById('pending-content-list');
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
            const response = await fetch(`${API_BASE}/api/v1/admin/verify/${contentType}/${contentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
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
            const response = await fetch(`${API_BASE}/api/v1/admin/reject/${contentType}/${contentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
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
    const container = document.getElementById('app');
    adminDash = new AdminDashboard(container);
    await adminDash.render();
}
