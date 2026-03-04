// Use relative URL in production so Nginx proxies /api/v1/* to the backend automatically.
// This works regardless of domain name or HTTP/HTTPS.
const BACKEND_URL = '';

const API_CONFIG = {
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
               ? 'http://127.0.0.1:8000'
               : BACKEND_URL,
    API_VERSION: '/api/v1',
    // ... rest of config
};
