
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://192.168.88.26:3001",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true // Important for CSRF token and session cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Axios request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    console.log("Axios response:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("Axios error:", {
      status: error.response?.status,
      url: originalRequest?.url,
      error: error.message
    });
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/refresh-token`, {
            refresh_token: refreshToken
          });
          
          if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            api.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Export empty function to avoid breaking imports in other files
// This can be removed later when all imports are updated
export const getCsrfToken = async () => {
  return null;
};

// Set the base URL dynamically
export const setBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export default api;
