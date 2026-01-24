import axios from 'axios'

// Construct API base URL that works both locally and in production
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL
  
  // If local dev environment, use the env URL directly
  if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
    return envUrl
  }
  
  // For production/tunnel, use current origin (same domain as frontend)
  // This ensures API calls go through Nginx proxy like everything else
  return window.location.origin
})()

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
