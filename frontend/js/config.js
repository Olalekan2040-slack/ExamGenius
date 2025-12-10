// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000',
    API_VERSION: '/api/v1',
    TIMEOUT: 30000,
};

// Get full API URL
const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

// Export configuration
window.API_CONFIG = API_CONFIG;
window.getApiUrl = getApiUrl;
