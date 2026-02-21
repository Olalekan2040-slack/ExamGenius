// API Configuration
// Automatically detect environment based on hostname
const isProduction = window.location.hostname === 'examgenius.mooo.com' || 
                     window.location.hostname.includes('amazonaws.com') ||
                     window.location.hostname.includes('.mooo.com') ||
                     window.location.hostname.includes('examgenius.ng') ||
                     (window.location.protocol === 'https:');

// Get production URL from current hostname or use default
const getProductionURL = () => {
    // Priority 1: Check for your specific custom domain
    if (window.location.hostname.includes('examgenius.ng')) {
        return 'https://examgenius.ng'; // Assumes backend is on standard 443 for this domain
    }
    
    // Priority 2: Your current active production URL with port 8000
    if (window.location.hostname.includes('examgenius.mooo.com')) {
        return 'http://examgenius.mooo.com:8000';
    }

    // Fallback for AWS auto-generated hostnames
    if (window.location.hostname.includes('amazonaws.com')) {
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }

    return 'http://examgenius.mooo.com:8000';
};

const API_CONFIG = {
    // Development: localhost
    // Production: auto-detected from hostname
    BASE_URL: isProduction ? getProductionURL() : 'http://127.0.0.1:8000',
    API_VERSION: '/api/v1',
    TIMEOUT: 30000,
    AI_TIMEOUT: 90000,
    IS_PRODUCTION: isProduction
};

// ... remaining logic (logging and getApiUrl)
