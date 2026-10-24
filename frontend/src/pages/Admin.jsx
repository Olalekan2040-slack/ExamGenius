/**
 * Admin Dashboard Page
 * Content management, question banking, bulk uploads, and admin controls
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import { request } from '../api';

const TABS = [
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'users', label: '👥 Users' },
  { key: 'questions', label: '❓ Questions' },
  { key: 'videos', label: '🎬 Videos' },
  { key: 'notes', label: '📝 Notes' },
  { key: 'hierarchy', label: '🗂️ Subjects' },
  { key: 'bulk-upload', label: '📤 Bulk Upload' },
  { key: 'pending', label: '⏳ Pending' },
  { key: 'analytics', label: '📈 Analytics' },
];

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await request('/admin/stats/content', { requireAuth: true });
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="admin-loading">⏳ Loading dashboard...</p>;
  if (error) return <p className="error">Failed to load dashboard: {error}</p>;

  const bySubject = stats?.by_subject || {};

  return (
    <div className="admin-dashboard-content">
      <h3>📈 Content Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.total_questions || 0}</div>
          <div className="stat-label">Total Questions</div>
          <div className="stat-subtext">{stats?.verified_questions || 0} verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.total_videos || 0}</div>
          <div className="stat-label">Learning Videos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.total_notes || 0}</div>
          <div className="stat-label">Study Notes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Object.keys(bySubject).length}</div>
          <div className="stat-label">Subjects</div>
        </div>
      </div>

      <div className="admin-section">
        <h4>Questions by Subject</h4>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(bySubject).map(([subject, count]) => (
              <tr key={subject}>
                <td>{subject}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h4>Quick Actions</h4>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('questions')}>
            ➕ Add Question
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('bulk-upload')}>
            📤 Bulk Upload
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('pending')}>
            ⏳ Review Pending
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Questions Tab ────────────────────────────────────────────────────────────

function QuestionsTab() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    subject: '', topic: '', text: '', difficulty: 'easy', year: '',
    optionA: '', optionB: '', optionC: '', optionD: '', correct: '', explanation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await request('/admin/questions', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject: form.subject,
          topic_id: form.topic || null,
          question: form.text,
          option_a: form.optionA,
          option_b: form.optionB,
          option_c: form.optionC,
          option_d: form.optionD,
          correct_answer: form.correct,
          explanation: form.explanation,
          difficulty: form.difficulty,
          year: form.year ? parseInt(form.year, 10) : null,
        },
      });
      addToast('✅ Question created!', 'success');
      setForm({
        subject: '', topic: '', text: '', difficulty: 'easy', year: '',
        optionA: '', optionB: '', optionC: '', optionD: '', correct: '', explanation: '',
      });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Question Management</h3>
      <div className="admin-section">
        <h4>Create New Question</h4>
        <form id="create-question-form" className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="q-subject">Subject *</label>
            <input
              type="text"
              id="q-subject"
              name="subject"
              required
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="q-topic">Topic</label>
            <input
              type="text"
              id="q-topic"
              name="topic"
              placeholder="Topic (optional)"
              value={form.topic}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="q-text">Question Text *</label>
            <textarea
              id="q-text"
              name="text"
              required
              placeholder="Enter question..."
              value={form.text}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="q-difficulty">Difficulty *</label>
              <select id="q-difficulty" name="difficulty" required value={form.difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="q-year">Year</label>
              <input
                type="number"
                id="q-year"
                name="year"
                placeholder="2024"
                value={form.year}
                onChange={handleChange}
              />
            </div>
          </div>

          {['A', 'B', 'C', 'D'].map((letter) => (
            <div className="form-group" key={letter}>
              <label htmlFor={`q-option-${letter.toLowerCase()}`}>Option {letter} *</label>
              <input
                type="text"
                id={`q-option-${letter.toLowerCase()}`}
                name={`option${letter}`}
                required
                placeholder={`Option ${letter}`}
                value={form[`option${letter}`]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="q-correct">Correct Answer *</label>
            <select id="q-correct" name="correct" required value={form.correct} onChange={handleChange}>
              <option value="">Select Correct Option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="q-explanation">Explanation</label>
            <textarea
              id="q-explanation"
              name="explanation"
              placeholder="Explain why this is correct..."
              value={form.explanation}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={submitting}>
            {submitting ? '⏳ Creating...' : '✅ Create Question'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Videos Tab ───────────────────────────────────────────────────────────────

function VideosTab() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    subject: '', topic: '', title: '', description: '', url: '', platform: 'gdrive', duration: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await request('/admin/videos', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject: form.subject,
          topic_id: form.topic || null,
          title: form.title,
          description: form.description,
          url: form.url,
          platform: form.platform,
          duration: form.duration ? parseInt(form.duration, 10) : null,
        },
      });
      addToast('✅ Video added!', 'success');
      setForm({ subject: '', topic: '', title: '', description: '', url: '', platform: 'gdrive', duration: '' });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Learning Videos Management</h3>
      <div className="admin-section">
        <h4>Add New Video</h4>
        <form id="create-video-form" className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="v-subject">Subject *</label>
            <input type="text" id="v-subject" name="subject" required placeholder="e.g. Mathematics" value={form.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="v-topic">Topic</label>
            <input type="text" id="v-topic" name="topic" placeholder="Topic (optional)" value={form.topic} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="v-title">Video Title *</label>
            <input type="text" id="v-title" name="title" required placeholder="Enter video title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="v-description">Description</label>
            <textarea id="v-description" name="description" placeholder="Video description..." value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="v-url">Video URL *</label>
            <input type="url" id="v-url" name="url" required placeholder="https://drive.google.com/file/d/..." value={form.url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="v-platform">Platform *</label>
            <select id="v-platform" name="platform" required value={form.platform} onChange={handleChange}>
              <option value="gdrive">Google Drive</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="v-duration">Duration (seconds)</label>
            <input type="number" id="v-duration" name="duration" placeholder="3600" value={form.duration} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-success" disabled={submitting}>
            {submitting ? '⏳ Adding...' : '✅ Add Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    subject: '', topic: '', title: '', content: '', format: 'markdown',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await request('/admin/notes', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject: form.subject,
          topic_id: form.topic || null,
          title: form.title,
          content: form.content,
          format: form.format,
        },
      });
      addToast('✅ Note created!', 'success');
      setForm({ subject: '', topic: '', title: '', content: '', format: 'markdown' });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Learning Notes Management</h3>
      <div className="admin-section">
        <h4>Create Study Notes</h4>
        <form id="create-notes-form" className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="n-subject">Subject *</label>
            <input type="text" id="n-subject" name="subject" required placeholder="e.g. Mathematics" value={form.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="n-topic">Topic</label>
            <input type="text" id="n-topic" name="topic" placeholder="Topic (optional)" value={form.topic} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="n-title">Note Title *</label>
            <input type="text" id="n-title" name="title" required placeholder="Enter note title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="n-content">Content *</label>
            <textarea
              id="n-content"
              name="content"
              required
              placeholder="Enter note content..."
              style={{ minHeight: '300px' }}
              value={form.content}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="n-format">Format</label>
            <select id="n-format" name="format" value={form.format} onChange={handleChange}>
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="plain">Plain Text</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success" disabled={submitting}>
            {submitting ? '⏳ Creating...' : '✅ Create Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Hierarchy Tab ────────────────────────────────────────────────────────────

function HierarchyTab() {
  const { addToast } = useToast();
  const [subjForm, setSubjForm] = useState({ name: '', icon: '', desc: '' });
  const [topicForm, setTopicForm] = useState({ subject: '', name: '', desc: '' });
  const [submittingSubj, setSubmittingSubj] = useState(false);
  const [submittingTopic, setSubmittingTopic] = useState(false);

  const handleSubjSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSubj(true);
    try {
      await request('/admin/subjects', {
        method: 'POST',
        requireAuth: true,
        body: { name: subjForm.name, icon: subjForm.icon, description: subjForm.desc },
      });
      addToast('✅ Subject created!', 'success');
      setSubjForm({ name: '', icon: '', desc: '' });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmittingSubj(false);
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTopic(true);
    try {
      await request('/admin/topics', {
        method: 'POST',
        requireAuth: true,
        body: { subject: topicForm.subject, name: topicForm.name, description: topicForm.desc },
      });
      addToast('✅ Topic created!', 'success');
      setTopicForm({ subject: '', name: '', desc: '' });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmittingTopic(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Subject &amp; Topic Hierarchy</h3>

      <div className="admin-section">
        <h4>Create Subject</h4>
        <form id="create-subject-form" className="admin-form-inline" onSubmit={handleSubjSubmit}>
          <input
            type="text"
            placeholder="Subject name"
            required
            value={subjForm.name}
            onChange={(e) => setSubjForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Icon (📚)"
            required
            value={subjForm.icon}
            onChange={(e) => setSubjForm((f) => ({ ...f, icon: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            value={subjForm.desc}
            onChange={(e) => setSubjForm((f) => ({ ...f, desc: e.target.value }))}
          />
          <button type="submit" className="btn btn-success" disabled={submittingSubj}>
            {submittingSubj ? '⏳ Adding...' : 'Add Subject'}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h4>Create Topic</h4>
        <form id="create-topic-form" className="admin-form-inline" onSubmit={handleTopicSubmit}>
          <input
            type="text"
            placeholder="Subject name"
            required
            value={topicForm.subject}
            onChange={(e) => setTopicForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Topic name"
            required
            value={topicForm.name}
            onChange={(e) => setTopicForm((f) => ({ ...f, name: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            value={topicForm.desc}
            onChange={(e) => setTopicForm((f) => ({ ...f, desc: e.target.value }))}
          />
          <button type="submit" className="btn btn-success" disabled={submittingTopic}>
            {submittingTopic ? '⏳ Adding...' : 'Add Topic'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Bulk Upload Tab ──────────────────────────────────────────────────────────

function BulkUploadTab() {
  const { addToast } = useToast();
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !subject) return;
    setUploading(true);
    setProgress('Uploading...');
    setResults(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      const data = await request('/admin/bulk-upload/questions', {
        method: 'POST',
        requireAuth: true,
        body: formData,
        isFormData: true,
        timeoutMs: 120000,
      });
      setProgress(null);
      setResults(data);
      addToast(`✅ Upload complete: ${data.created || 0} questions added`, 'success');
    } catch (err) {
      setProgress(null);
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const csv = `question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty,topic_id\n"What is the capital of France?","London","Paris","Berlin","Madrid","B","Paris is the capital and largest city of France.",2023,"easy",1\n"What is 2 + 2?","3","4","5","6","B","2 + 2 equals 4.",2023,"easy",2`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-section">
      <h3>Bulk Upload</h3>

      <div className="admin-section">
        <h4>Upload Questions (CSV)</h4>
        <p>CSV Columns: question, option_a, option_b, option_c, option_d, correct_answer, explanation, year, difficulty, topic_id</p>

        <form id="bulk-upload-form" className="admin-form" onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="bulk-subject">Select Subject *</label>
            <input
              type="text"
              id="bulk-subject"
              required
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bulk-file">Upload CSV File *</label>
            <input
              type="file"
              id="bulk-file"
              accept=".csv"
              required
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={uploading}>
            {uploading ? '⏳ Uploading...' : '📤 Upload'}
          </button>
        </form>

        {progress && (
          <div id="upload-progress">
            <p id="progress-text">{progress}</p>
            <div className="progress-bar">
              <div id="progress-fill" style={{ width: '50%' }} />
            </div>
          </div>
        )}

        {results && (
          <div id="upload-results" style={{ marginTop: '16px' }}>
            <p style={{ color: '#38a169', fontWeight: 600 }}>
              ✅ Upload complete — {results.created || 0} questions created
              {results.skipped ? `, ${results.skipped} skipped` : ''}
              {results.errors ? `, ${results.errors} errors` : ''}
            </p>
            {results.error_details && results.error_details.length > 0 && (
              <ul style={{ color: '#e53e3e', fontSize: '13px' }}>
                {results.error_details.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h4>Download Template</h4>
        <button className="btn btn-outline" onClick={downloadCSVTemplate}>
          📥 Download Questions CSV Template
        </button>
      </div>
    </div>
  );
}

// ─── Pending Tab ──────────────────────────────────────────────────────────────

function PendingTab() {
  const { addToast } = useToast();
  const [contentType, setContentType] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPending = useCallback(async (type) => {
    setContentType(type);
    setLoading(true);
    setItems([]);
    try {
      const data = await request(`/admin/pending-verification?content_type=${type}`, { requireAuth: true });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const approveContent = async (type, id) => {
    try {
      await request(`/admin/verify/${type}/${id}`, { method: 'POST', requireAuth: true });
      addToast('✅ Content approved!', 'success');
      loadPending(type);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    }
  };

  const rejectContent = async (type, id) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    try {
      await request(`/admin/reject/${type}/${id}`, {
        method: 'POST',
        requireAuth: true,
        body: { reason },
      });
      addToast('Content rejected', 'info');
      loadPending(type);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    }
  };

  return (
    <div className="admin-section">
      <h3>Pending Content Approval</h3>

      <div className="tab-buttons">
        <button className="btn" onClick={() => loadPending('questions')}>Questions</button>
        <button className="btn" onClick={() => loadPending('videos')}>Videos</button>
        <button className="btn" onClick={() => loadPending('notes')}>Notes</button>
      </div>

      <div id="pending-content-list" style={{ marginTop: '16px' }}>
        {loading && <p className="admin-loading">⏳ Loading...</p>}
        {!loading && contentType && items.length === 0 && (
          <p>No pending {contentType} for approval.</p>
        )}
        {!loading && items.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.text || item.title}</td>
                  <td>
                    <button
                      className="btn btn-small btn-success"
                      onClick={() => approveContent(contentType, item.id)}
                    >
                      ✅ Approve
                    </button>{' '}
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => rejectContent(contentType, item.id)}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = useCallback(async (searchVal, roleVal) => {
    setLoading(true);
    try {
      let url = '/admin/users?limit=50';
      if (searchVal) url += `&search=${encodeURIComponent(searchVal)}`;
      if (roleVal) url += `&role=${encodeURIComponent(roleVal)}`;
      const data = await request(url, { requireAuth: true });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      addToast(`❌ Error loading users: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadUsers('', '');
  }, [loadUsers]);

  const handleSearch = () => loadUsers(search, roleFilter);

  const changeRole = async (userId, newRole) => {
    if (!window.confirm(`Change user #${userId} role to '${newRole}'?`)) return;
    try {
      const data = await request(`/admin/users/${userId}/role?new_role=${newRole}`, {
        method: 'PATCH',
        requireAuth: true,
      });
      addToast(`✅ ${data.message || 'Role updated'}`, 'success');
      loadUsers(search, roleFilter);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
      loadUsers(search, roleFilter);
    }
  };

  const banUser = async (userId, banned) => {
    let reason = '';
    if (banned) {
      const r = window.prompt('Ban reason (optional):');
      if (r === null) return; // cancelled
      reason = r;
    }
    try {
      let url = `/admin/users/${userId}/ban?banned=${banned}`;
      if (reason) url += `&reason=${encodeURIComponent(reason)}`;
      const data = await request(url, { method: 'PATCH', requireAuth: true });
      addToast(`✅ ${data.message || 'Done'}`, 'success');
      loadUsers(search, roleFilter);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`⚠️ PERMANENTLY delete user "${name}" (ID: ${userId})? This cannot be undone.`)) return;
    if (!window.confirm('Are you absolutely sure? All their data will be deleted.')) return;
    try {
      const data = await request(`/admin/users/${userId}`, { method: 'DELETE', requireAuth: true });
      addToast(`✅ ${data.message || 'User deleted'}`, 'success');
      loadUsers(search, roleFilter);
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    }
  };

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0 }}>
          👥 User Management{' '}
          <span style={{ fontSize: '14px', color: '#666' }}>({total} total)</span>
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            id="user-search"
            type="text"
            placeholder="Search name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            style={{ padding: '7px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '200px' }}
          />
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); loadUsers(search, e.target.value); }}
            style={{ padding: '7px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="admin-loading">⏳ Loading users...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                <th>Verified</th><th>Points</th><th>Active Days</th>
                <th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={u.is_banned ? { background: '#fff0f0' } : {}}>
                  <td>{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ fontSize: '12px' }}>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{ fontSize: '12px', padding: '3px 6px', borderRadius: '4px' }}
                    >
                      <option value="student">student</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>{u.is_verified ? '✅' : '❌'}</td>
                  <td style={{ textAlign: 'center' }}>{u.points}</td>
                  <td style={{ textAlign: 'center' }}>{u.active_days}</td>
                  <td style={{ textAlign: 'center' }}>
                    {u.is_banned
                      ? <span style={{ color: '#e53e3e', fontWeight: 600 }}>Banned</span>
                      : <span style={{ color: '#38a169' }}>Active</span>
                    }
                  </td>
                  <td style={{ fontSize: '12px' }}>{u.created_at ? u.created_at.slice(0, 10) : ''}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {u.is_banned
                        ? (
                          <button
                            onClick={() => banUser(u.id, false)}
                            style={{ fontSize: '11px', padding: '3px 7px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => banUser(u.id, true)}
                            style={{ fontSize: '11px', padding: '3px 7px', background: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Ban
                          </button>
                        )
                      }
                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        style={{ fontSize: '11px', padding: '3px 7px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await request('/admin/stats/platform', { requireAuth: true });
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="admin-loading">⏳ Loading analytics...</p>;
  if (error) return <p className="admin-error">❌ Error loading analytics: {error}</p>;

  const s = stats || {};
  const dailyAct = s.daily_active_14d || [];
  const dailyReg = s.daily_registrations_14d || [];
  const bySubject = s.questions_by_subject || {};

  return (
    <div className="admin-section">
      <h3>📈 Platform Analytics</h3>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-number">{s.total_users || 0}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-subtext">{s.verified_users || 0} verified · {s.banned_users || 0} banned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{s.new_users_7d || 0}</div>
          <div className="stat-label">New Users (7d)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{s.active_users_7d || 0}</div>
          <div className="stat-label">Active Users (7d)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{s.total_questions || 0}</div>
          <div className="stat-label">Total Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{s.total_practice_attempts || 0}</div>
          <div className="stat-label">Practice Attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{s.overall_accuracy_pct || 0}%</div>
          <div className="stat-label">Overall Accuracy</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h4>Daily Active Users (14d)</h4>
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Active</th></tr></thead>
            <tbody>
              {dailyAct.length === 0
                ? <tr><td colSpan={2} style={{ color: '#999' }}>No data yet</td></tr>
                : dailyAct.map((d) => <tr key={d.date}><td>{d.date}</td><td>{d.active_users}</td></tr>)
              }
            </tbody>
          </table>
        </div>
        <div>
          <h4>Daily Registrations (14d)</h4>
          <table className="admin-table">
            <thead><tr><th>Date</th><th>New Users</th></tr></thead>
            <tbody>
              {dailyReg.length === 0
                ? <tr><td colSpan={2} style={{ color: '#999' }}>No data yet</td></tr>
                : dailyReg.map((d) => <tr key={d.date}><td>{d.date}</td><td>{d.registrations}</td></tr>)
              }
            </tbody>
          </table>
        </div>
        <div>
          <h4>Questions by Subject</h4>
          <table className="admin-table">
            <thead><tr><th>Subject</th><th>Count</th></tr></thead>
            <tbody>
              {Object.keys(bySubject).length === 0
                ? <tr><td colSpan={2} style={{ color: '#999' }}>No data</td></tr>
                : Object.entries(bySubject).map(([sub, cnt]) => <tr key={sub}><td>{sub}</td><td>{cnt}</td></tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Access guard
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <Layout>
        <div className="access-denied">
          <h2>⛔ Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardTab onNavigate={setCurrentTab} />;
      case 'questions':
        return <QuestionsTab />;
      case 'videos':
        return <VideosTab />;
      case 'notes':
        return <NotesTab />;
      case 'hierarchy':
        return <HierarchyTab />;
      case 'bulk-upload':
        return <BulkUploadTab />;
      case 'pending':
        return <PendingTab />;
      case 'users':
        return <UsersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <nav className="admin-nav">
          <div className="admin-nav-header">
            <h2>📊 Admin Panel</h2>
          </div>
          <ul className="admin-nav-menu">
            {TABS.map((tab) => (
              <li key={tab.key}>
                <a
                  href="#"
                  data-tab={tab.key}
                  className={`nav-link${currentTab === tab.key ? ' active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTab(tab.key);
                  }}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-content">
          <div id="admin-main">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
