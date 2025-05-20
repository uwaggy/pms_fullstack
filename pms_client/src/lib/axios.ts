import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { toast } from 'sonner';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ignore Chrome extension errors
    if (error.message === 'permission error' && error.code === 403 && !error.httpError) {
      return Promise.resolve({ data: null });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    if (errorMessage !== 'permission error') {
      toast.error(errorMessage);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 