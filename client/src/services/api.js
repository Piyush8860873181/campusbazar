// services/api.js - Central Axios instance configured with base URL and JWT interceptor
import axios from 'axios';

// Must read from VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT bearer token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid (401), clear local session
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRequest && localStorage.getItem('cb_token')) {
        localStorage.removeItem('cb_token');
        localStorage.removeItem('cb_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
