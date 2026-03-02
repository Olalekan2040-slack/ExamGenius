const BACKEND_URL = 'https://examgenius.mooo.com'; // No :8000 if using standard HTTPS

const API_CONFIG = {
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
               ? 'http://127.0.0.1:8000' 
               : BACKEND_URL,
    API_VERSION: '/api/v1',
    // ... rest of config
};
