import axios from 'axios';

// API base URL - adjust for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://marrakech-admin-backend.vercel.app' 
  : 'http://localhost:5000'; // Or your local backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Articles API
export const articlesAPI = {
  getArticles: (params) => api.get('/articles', { params }),
  getArticle: (id) => api.get(`/articles/${id}`),
  createArticle: (data) => api.post('/articles', data),
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  getCategories: () => api.get('/articles/categories'),
  getTags: () => api.get('/articles/tags'),
};

// Contacts API
export const contactsAPI = {
  getContacts: (params) => api.get('/contacts', { params }),
  getContact: (id) => api.get(`/contacts/${id}`),
  updateContactStatus: (id, status) => api.put(`/contacts/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  getContactStats: () => api.get('/contacts/stats'),
};

// Newsletter API
export const newsletterAPI = {
  getSubscribers: (params) => api.get('/newsletter/subscribers', { params }),
  getSubscriber: (id) => api.get(`/newsletter/subscribers/${id}`),
  updateSubscriberStatus: (id, status) => api.put(`/newsletter/subscribers/${id}/status`, { status }),
  deleteSubscriber: (id) => api.delete(`/newsletter/subscribers/${id}`),
  getNewsletterStats: () => api.get('/newsletter/stats'),
  exportSubscribers: () => api.get('/newsletter/export'),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params) => api.get('/reviews', { params }),
  getReview: (id) => api.get(`/reviews/${id}`),
  updateReviewStatus: (id, status) => api.put(`/reviews/${id}/status`, { status }),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getReviewStats: () => api.get('/reviews/stats'),
  getApprovedReviews: (params) => api.get('/reviews/approved', { params }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getEvents: (params) => api.get('/analytics/events', { params }),
  getChartData: (params) => api.get('/analytics/chart-data', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getQuickActions: () => api.get('/dashboard/quick-actions'),
  getPerformanceMetrics: (params) => api.get('/dashboard/performance', { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;

