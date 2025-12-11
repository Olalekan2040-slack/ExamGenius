// API Service - Handles all backend communication

class APIService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.apiVersion = API_CONFIG.API_VERSION;
    }

    // Helper to build full URL
    getURL(endpoint) {
        return `${this.baseURL}${this.apiVersion}${endpoint}`;
    }

    // Helper to get auth headers
    getHeaders(includeAuth = false, contentType = 'application/json') {
        const headers = {};

        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        if (includeAuth) {
            const token = authManager.getAccessToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        const { method = 'GET', body, requireAuth = false, isFormData = false } = options;

        const config = {
            method,
            headers: this.getHeaders(requireAuth, isFormData ? null : 'application/json'),
        };

        if (body) {
            config.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(this.getURL(endpoint), config);

            // Handle 401 - try to refresh token
            if (response.status === 401 && requireAuth) {
                const refreshed = await authManager.refreshToken();
                if (refreshed) {
                    // Retry request with new token
                    config.headers = this.getHeaders(true, isFormData ? null : 'application/json');
                    const retryResponse = await fetch(this.getURL(endpoint), config);
                    return this.handleResponse(retryResponse);
                } else {
                    authManager.logout();
                    router.navigate('login');
                    throw new Error('Session expired. Please login again.');
                }
            }

            return this.handleResponse(response);
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async handleResponse(response) {
        const rawText = await response.text();
        let data = {};
        try {
            data = rawText ? JSON.parse(rawText) : {};
        } catch (_) {
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

    // ===== AUTH ENDPOINTS =====

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { name, email, password }
        });
    }

    async verifyEmail(token) {
        return this.request('/auth/verify-email', {
            method: 'POST',
            body: { token }
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
    }

    async refreshToken(refreshToken) {
        return this.request('/auth/refresh', {
            method: 'POST',
            body: { refresh_token: refreshToken }
        });
    }

    async logout(refreshToken) {
        return this.request('/auth/logout', {
            method: 'POST',
            body: { refresh_token: refreshToken },
            requireAuth: true
        });
    }

    async requestPasswordReset(email) {
        return this.request('/auth/request-reset', {
            method: 'POST',
            body: { email }
        });
    }

    async resetPassword(token, newPassword) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: { token, new_password: newPassword }
        });
    }

    // ===== USER ENDPOINTS =====

    async getCurrentUser() {
        return this.request('/users/me', { requireAuth: true });
    }

    async updateProfile(fullName) {
        return this.request('/users/me', {
            method: 'PUT',
            body: { full_name: fullName },
            requireAuth: true
        });
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('file', file);

        return this.request('/users/avatar', {
            method: 'POST',
            body: formData,
            requireAuth: true,
            isFormData: true
        });
    }

    // ===== JAMB ENDPOINTS (Public) =====

    async getSubjects() {
        return this.request('/jamb/subjects');
    }

    async getYears() {
        return this.request('/jamb/years');
    }

    async getTopicsBySubject(subject) {
        return this.request(`/jamb/topics?subject=${encodeURIComponent(subject)}`);
    }

    async getQuestions(subject, year = null, topic = null, limit = 10) {
        let url = `/jamb/questions?subject=${encodeURIComponent(subject)}&limit=${limit}`;
        if (year) url += `&year=${year}`;
        if (topic) url += `&topic=${encodeURIComponent(topic)}`;
        return this.request(url);
    }

    // ===== LEARN ENDPOINTS =====

    async getTopicsWithStats(subject) {
        return this.request(`/learn/topics/${encodeURIComponent(subject)}`, {
            requireAuth: true
        });
    }

    async getLesson(subject, topic, language = 'english') {
        return this.request(
            `/learn/lesson/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}?language=${language}`,
            { requireAuth: true }
        );
    }

    async getPracticeQuestions(subject, topic, count = 10) {
        return this.request(
            `/learn/questions/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}?count=${count}`,
            { requireAuth: true }
        );
    }

    async submitTopicPractice(subject, topic, answers) {
        return this.request('/learn/practice/topic/submit', {
            method: 'POST',
            body: { subject, topic, answers },
            requireAuth: true
        });
    }

    // ===== YEAR PRACTICE ENDPOINTS =====

    async getYearPracticeInfo() {
        return this.request('/year-practice/info');
    }

    async getYearPracticeQuestions(subject, year, count = 20) {
        return this.request(
            `/year-practice/questions?subject=${encodeURIComponent(subject)}&year=${year}&count=${count}`,
            { requireAuth: true }
        );
    }

    async submitYearPractice(subject, year, answers) {
        return this.request('/year-practice/submit', {
            method: 'POST',
            body: { subject, year, answers },
            requireAuth: true
        });
    }

    // ===== CBT ENDPOINTS =====

    async createCBTSession(subjects) {
        return this.request('/cbt/create', {
            method: 'POST',
            body: { subjects },
            requireAuth: true
        });
    }

    async getCBTQuestions(sessionId, subjectPosition = null) {
        let url = `/cbt/${sessionId}/questions`;
        if (subjectPosition) {
            url += `?subject_position=${subjectPosition}`;
        }
        return this.request(url, {
            requireAuth: true
        });
    }

    async resumeCBTSession(sessionId) {
        return this.request(`/cbt/resume/${sessionId}`, {
            requireAuth: true
        });
    }

    async submitCBT(sessionId, answers) {
        return this.request(`/cbt/${sessionId}/submit`, {
            method: 'POST',
            body: { answers },
            requireAuth: true
        });
    }

    async reviewCBT(sessionId) {
        return this.request(`/cbt/${sessionId}/review`, {
            requireAuth: true
        });
    }

    // ===== DASHBOARD ENDPOINTS =====

    async getDashboardStats() {
        return this.request('/dashboard/stats', {
            requireAuth: true
        });
    }

    async getAccuracyTrend(subject = null, days = 30) {
        let url = `/dashboard/accuracy-trend?days=${days}`;
        if (subject) url += `&subject=${encodeURIComponent(subject)}`;
        return this.request(url, { requireAuth: true });
    }

    async getSubjectBreakdown() {
        return this.request('/dashboard/subject-breakdown', {
            requireAuth: true
        });
    }

    async getRecommendations() {
        return this.request('/dashboard/recommendations', {
            requireAuth: true
        });
    }

    async getGradePredictor() {
        return this.request('/dashboard/grade-predictor', {
            requireAuth: true
        });
    }

    async getLearningAnalytics() {
        return this.request('/learn/analytics', {
            requireAuth: true
        });
    }

    // ===== AI TUTOR ENDPOINTS =====

    async askAITutor(subject, topic, question, lesson, chatHistory) {
        return this.request('/learn/ask-tutor', {
            method: 'POST',
            body: {
                subject,
                topic,
                question,
                lesson_context: lesson,
                chat_history: chatHistory
            },
            requireAuth: true
        });
    }

    // ===== PROFILE ENDPOINTS =====

    async completeProfile(fullName, phoneNumber, classLevel, subjects) {
        return this.request('/api/profile/complete', {
            method: 'POST',
            body: {
                full_name: fullName,
                phone_number: phoneNumber,
                class_level: classLevel,
                subjects
            },
            requireAuth: true
        });
    }

    async checkProfileCompletion() {
        return this.request('/api/profile/check-completion', {
            requireAuth: true
        });
    }

    async updateSubjects(subjects) {
        return this.request('/api/profile/subjects', {
            method: 'PUT',
            body: { subjects },
            requireAuth: true
        });
    }
}

// Create singleton instance
const api = new APIService();
window.api = api;
