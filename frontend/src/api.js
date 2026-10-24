// API Service — all backend communication
// Auth callbacks are injected by AuthContext via configureAuth()

let _getToken = () => null;
let _refreshCallback = async () => false;
let _sessionExpiredCallback = () => {};

export function configureAuth({ getToken, onRefresh, onExpired }) {
  _getToken = getToken;
  _refreshCallback = onRefresh;
  _sessionExpiredCallback = onExpired;
}

const BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : '';

const API_VERSION = '/api/v1';

function getURL(endpoint) {
  return `${BASE_URL}${API_VERSION}${endpoint}`;
}

function buildHeaders(requireAuth, isFormData) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (requireAuth) {
    const token = _getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse(response) {
  const rawText = await response.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = rawText ? { detail: rawText } : {};
  }

  if (!response.ok) {
    const detail = data?.detail;
    const normalized = Array.isArray(detail)
      ? detail.map((d) => d.msg || d.detail || JSON.stringify(d)).join('; ')
      : typeof detail === 'object' && detail !== null
      ? JSON.stringify(detail)
      : detail || data.message || 'Request failed';
    throw new Error(normalized);
  }
  return data;
}

export async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    requireAuth = false,
    isFormData = false,
    timeoutMs = 12000,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const config = {
    method,
    headers: buildHeaders(requireAuth, isFormData),
    signal: controller.signal,
  };
  if (body) config.body = isFormData ? body : JSON.stringify(body);

  try {
    const response = await fetch(getURL(endpoint), config);

    if (response.status === 401 && requireAuth) {
      const refreshed = await _refreshCallback();
      if (refreshed) {
        config.headers = buildHeaders(true, isFormData);
        const retry = await fetch(getURL(endpoint), config);
        return parseResponse(retry);
      } else {
        _sessionExpiredCallback();
        throw new Error('Session expired. Please login again.');
      }
    }

    return parseResponse(response);
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// ── Auth ──────────────────────────────────────────────────────
export const register = (name, email, password) =>
  request('/auth/register', { method: 'POST', body: { name, email, password } });

export const verifyEmail = (token) =>
  request('/auth/verify-email', { method: 'POST', body: { token } });

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

export const refreshToken = (token) =>
  request('/auth/refresh', { method: 'POST', body: { refresh_token: token } });

export const logout = (token) =>
  request('/auth/logout', { method: 'POST', body: { refresh_token: token }, requireAuth: true });

export const requestPasswordReset = (email) =>
  request('/auth/request-reset', { method: 'POST', body: { email } });

export const resetPassword = (token, newPassword) =>
  request('/auth/reset-password', { method: 'POST', body: { token, new_password: newPassword } });

export const resendVerificationEmail = (email) =>
  request('/auth/resend-verification-email', { method: 'POST', body: { email } });

// ── User / Profile ────────────────────────────────────────────
export const getCurrentUser = () => request('/users/me', { requireAuth: true });

export const getProfile = () => request('/profile/me', { requireAuth: true });

export const updateProfile = (data) =>
  request('/profile/update', { method: 'PUT', body: data, requireAuth: true });

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/users/avatar', { method: 'POST', body: formData, requireAuth: true, isFormData: true });
};

export const completeProfile = (data) =>
  request('/profile/complete', { method: 'POST', body: data, requireAuth: true });

export const checkProfileCompletion = () =>
  request('/profile/check-completion', { requireAuth: true });

export const updateSubjects = (subjects) =>
  request('/profile/subjects', { method: 'PUT', body: { subjects }, requireAuth: true });

// ── JAMB (public) ─────────────────────────────────────────────
export const getSubjects = () => request('/jamb/subjects');
export const getYears = () => request('/jamb/years');
export const getTopicsBySubject = (subject) =>
  request(`/jamb/topics?subject=${encodeURIComponent(subject)}`);
export const getQuestions = (subject, year = null, topic = null, limit = 10) => {
  let url = `/jamb/questions?subject=${encodeURIComponent(subject)}&limit=${limit}`;
  if (year) url += `&year=${year}`;
  if (topic) url += `&topic=${encodeURIComponent(topic)}`;
  return request(url);
};

// ── Learn ─────────────────────────────────────────────────────
export const getTopicsWithStats = (subject) =>
  request(`/learn/topics/${encodeURIComponent(subject)}`, { requireAuth: true });

export const getLesson = (subject, topic, language = 'english') =>
  request(`/learn/lesson/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}?language=${language}`, {
    requireAuth: true,
    timeoutMs: 90000,
  });

export const getPracticeQuestions = (subject, topic, count = 10) =>
  request(`/learn/questions/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}?count=${count}`, {
    requireAuth: true,
  });

export const submitTopicPractice = (subject, topic, answers) =>
  request('/learn/practice/topic/submit', { method: 'POST', body: { subject, topic, answers }, requireAuth: true });

export const askAITutor = (subject, topic, question, lesson, chatHistory) =>
  request('/learn/ask-tutor', {
    method: 'POST',
    body: { subject, topic, question, lesson_context: lesson, chat_history: chatHistory },
    requireAuth: true,
  });

export const getLearningAnalytics = () => request('/learn/analytics', { requireAuth: true });

// ── Guided Learning ───────────────────────────────────────────
export const getGuidedSubjects = () => request('/guided-learn/subjects', { requireAuth: true });

export const getGuidedSyllabus = (subject, topic) =>
  request(`/guided-learn/syllabus?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`, {
    requireAuth: true,
  });

export const getObjectiveExplanation = (subject, topic, subtopicIndex, objectiveIndex) =>
  request('/guided-learn/objective-explanation', {
    method: 'POST',
    body: { subject, topic, subtopic_index: subtopicIndex, objective_index: objectiveIndex },
    requireAuth: true,
    timeoutMs: 90000,
  });

export const askGuidedTutor = (subject, topic, question, context, chatHistory) =>
  request('/guided-learn/ask-tutor', {
    method: 'POST',
    body: { subject, topic, question, context, chat_history: chatHistory },
    requireAuth: true,
    timeoutMs: 60000,
  });

export const submitGuidedAnswer = (subject, topic, subtopicIndex, objectiveIndex, answer, questionId) =>
  request('/guided-learn/submit-answer', {
    method: 'POST',
    body: { subject, topic, subtopic_index: subtopicIndex, objective_index: objectiveIndex, answer, question_id: questionId },
    requireAuth: true,
  });

export const getGuidedProgress = (subject, topic) =>
  request(`/guided-learn/progress?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`, {
    requireAuth: true,
  });

export const getSubtopicQuiz = (subject, topic, subtopicIndex) =>
  request('/guided-learn/subtopic-quiz', {
    method: 'POST',
    body: { subject, topic, subtopic_index: subtopicIndex },
    requireAuth: true,
    timeoutMs: 60000,
  });

export const submitSubtopicQuiz = (subject, topic, subtopicIndex, answers) =>
  request('/guided-learn/subtopic-quiz/submit', {
    method: 'POST',
    body: { subject, topic, subtopic_index: subtopicIndex, answers },
    requireAuth: true,
  });

// ── Year Practice ─────────────────────────────────────────────
export const getYearPracticeInfo = () => request('/year-practice/info');

export const getYearPracticeQuestions = (subject, year, count = 20) =>
  request(`/year-practice/questions?subject=${encodeURIComponent(subject)}&year=${year}&count=${count}`, {
    requireAuth: true,
  });

export const submitYearPractice = (subject, year, answers) =>
  request('/year-practice/submit', { method: 'POST', body: { subject, year, answers }, requireAuth: true });

export const getYearPracticeHistory = () => request('/year-practice/history', { requireAuth: true });

export const getYearPracticeSessionReview = (sessionId) =>
  request(`/year-practice/session/${sessionId}/review`, { requireAuth: true });

// ── CBT ───────────────────────────────────────────────────────
export const createCBTSession = (subjects) =>
  request('/cbt/create', { method: 'POST', body: { subjects }, requireAuth: true });

export const getCBTQuestions = (sessionId, subjectPosition = null) => {
  let url = `/cbt/${sessionId}/questions`;
  if (subjectPosition) url += `?subject_position=${subjectPosition}`;
  return request(url, { requireAuth: true });
};

export const resumeCBTSession = (sessionId) =>
  request(`/cbt/resume/${sessionId}`, { requireAuth: true });

export const submitCBT = (sessionId, answers) =>
  request(`/cbt/${sessionId}/submit`, {
    method: 'POST',
    body: { answers },
    requireAuth: true,
    timeoutMs: 120000,
  });

export const reviewCBT = (sessionId) =>
  request(`/cbt/${sessionId}/review`, { requireAuth: true });

// ── Dashboard ─────────────────────────────────────────────────
export const getDashboardStats = () => request('/dashboard/stats', { requireAuth: true });
export const getAccuracyTrend = (subject = null, days = 30) => {
  let url = `/dashboard/accuracy-trend?days=${days}`;
  if (subject) url += `&subject=${encodeURIComponent(subject)}`;
  return request(url, { requireAuth: true });
};
export const getSubjectBreakdown = () => request('/dashboard/subject-breakdown', { requireAuth: true });
export const getRecommendations = () => request('/dashboard/recommendations', { requireAuth: true });
export const getGradePredictor = () => request('/dashboard/grade-predictor', { requireAuth: true });
export const getPoints = () => request('/dashboard/points', { requireAuth: true });

// ── Admin ─────────────────────────────────────────────────────
export const adminGetStats = () => request('/admin/stats', { requireAuth: true });
export const adminGetUsers = (page = 1, limit = 20) =>
  request(`/admin/users?page=${page}&limit=${limit}`, { requireAuth: true });
export const adminGetQuestions = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/admin/questions?${params}`, { requireAuth: true });
};
