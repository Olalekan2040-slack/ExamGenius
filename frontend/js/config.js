// Replace this with your BACKEND EC2 Public IP or Backend Domain
const BACKEND_PUBLIC_IP = "examgenius.mooo.com"; 

const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

const API_CONFIG = {
    // If not on localhost, use the actual Backend EC2 IP
    BASE_URL: isProduction 
        ? `https://${BACKEND_PUBLIC_IP}:8000` 
        : 'https://127.0.0.1:8000',
    API_VERSION: '/api/v1',
    TIMEOUT: 30000,
    AI_TIMEOUT: 90000,
    IS_PRODUCTION: isProduction
};
