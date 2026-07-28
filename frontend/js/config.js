// Use relative URL in production so Nginx proxies /api/v1/* to the backend automatically.
// This works regardless of domain name or HTTP/HTTPS.
const BACKEND_URL = '';

const API_CONFIG = {
    BASE_URL: (window.location.hostname === 'backend' || window.location.hostname === '172.172.234.93')
               ? 'http://172.172.234.93:8000'
               : BACKEND_URL,
    API_VERSION: '/api/v1',
    // Request timeout in milliseconds — keep short so stale-token hangs don't block the UI
    TIMEOUT: 12000,
};
