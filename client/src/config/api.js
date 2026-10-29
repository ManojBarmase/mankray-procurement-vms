// client/src/config/api.js
// Centralized API configuration ensuring resilient URL normalization across dev & prod

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Sanitize URL: strip trailing slashes and trailing '/api' to prevent accidental '/api/api' duplicates
export const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default API_BASE_URL;

