// API Configuration
// Automatically detect environment based on hostname
const isProduction = window.location.hostname === 'examgenius.mooo.com' || 
                     window.location.hostname.includes('amazonaws.com') ||
                     window.location.hostname.includes('.mooo.com') ||
                     window.location.hostname.includes('examgenius.ng') ||
                     (window.location.protocol === 'https:');

// Get production URL from current hostname or use default
const getProductionURL = () => {
    if (window.location.hostname.includes('examgenius.ng')) {
        return 'https://examgenius.ng';
    }
    if (window.location.hostname.includes('amazonaws.com')) {
        return `${window.location.protocol}//${window.location.hostname}`;
    }
    return 'https://examgenius.mooo.com';
};

const API_CONFIG = {
    // Development: localhost
    // Production: auto-detected from hostname
    BASE_URL: isProduction ? getProductionURL() : 'http://127.0.0.1:8000',
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

