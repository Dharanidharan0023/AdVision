import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            console.error(`API Error (${error.response.status}):`, error.response.data);
            
            if (error.response.status === 401 || error.response.status === 403) {
                // Unauthorized or Forbidden - clear token and redirect if needed
                localStorage.removeItem('token');
                if (!window.location.pathname.includes('/admin')) {
                    window.location.href = '/admin';
                }
            }
        } else if (error.request) {
            // Request was made but no response was received
            console.error('API Error: No response received from server. Check if backend is running.');
        } else {
            // Something happened in setting up the request
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
