// API Configuration
// Automatically detect environment based on hostname
const isProduction = window.location.hostname === 'examgenius.mooo.com' || 
                     window.location.hostname.includes('amazonaws.com') ||
                     window.location.hostname.includes('.mooo.com');

const API_CONFIG = {
    // Development: localhost
    // Production: examgenius.mooo.com
    BASE_URL: isProduction ? 'https://examgenius.mooo.com' : 'http://127.0.0.1:8000',
    API_VERSION: '/api/v1',
    TIMEOUT: 30000,
    AI_TIMEOUT: 90000,  // 90 seconds for AI operations
    IS_PRODUCTION: isProduction
};

// Log environment for debugging
console.log(`[API Config] Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`[API Config] Base URL: ${API_CONFIG.BASE_URL}`);

// Get full API URL
const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

// Export configuration
window.API_CONFIG = API_CONFIG;
window.getApiUrl = getApiUrl;

