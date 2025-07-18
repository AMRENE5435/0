import axios from 'axios';

// API base URL - adjust for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://marrakech-admin-backend.vercel.app/api' 
  : 'http://localhost:5000/api'; // Or your local backend URL

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Main API object with all endpoints
export const api = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),

  // Articles endpoints
  getArticles: (params) => apiClient.get('/articles', { params }),
  getArticle: (id) => apiClient.get(`/articles/${id}`),
  createArticle: (data) => apiClient.post('/articles', data),
  updateArticle: (id, data) => apiClient.put(`/articles/${id}`, data),
  deleteArticle: (id) => apiClient.delete(`/articles/${id}`),
  getArticleCategories: () => apiClient.get('/articles/categories'),
  getArticleTags: () => apiClient.get('/articles/tags'),
  
  // SEO endpoints for articles
  getArticleSEO: (id) => apiClient.get(`/articles/${id}/seo`),
  updateArticleSEO: (id, data) => apiClient.put(`/articles/${id}/seo`, data),
  analyzeArticleSEO: (id) => apiClient.post(`/articles/${id}/seo/analyze`),

  // Contacts endpoints
  getContacts: (params) => apiClient.get('/contacts', { params }),
  getContact: (id) => apiClient.get(`/contacts/${id}`),
  updateContactStatus: (id, status) => apiClient.put(`/contacts/${id}/status`, { status }),
  deleteContact: (id) => apiClient.delete(`/contacts/${id}`),
  getContactStats: () => apiClient.get('/contacts/stats'),

  // Newsletter endpoints
  getSubscribers: (params) => apiClient.get('/newsletter/subscribers', { params }),
  getSubscriber: (id) => apiClient.get(`/newsletter/subscribers/${id}`),
  updateSubscriberStatus: (id, status) => apiClient.put(`/newsletter/subscribers/${id}/status`, { status }),
  deleteSubscriber: (id) => apiClient.delete(`/newsletter/subscribers/${id}`),
  getNewsletterStats: () => apiClient.get('/newsletter/stats'),
  exportSubscribers: () => apiClient.get('/newsletter/export'),
  sendNewsletter: (data) => apiClient.post('/newsletter/send', data),
  createCampaign: (data) => apiClient.post('/newsletter/campaigns', data),
  getCampaigns: (params) => apiClient.get('/newsletter/campaigns', { params }),

  // Reviews endpoints
  getReviews: (params) => apiClient.get('/reviews', { params }),
  getReview: (id) => apiClient.get(`/reviews/${id}`),
  updateReviewStatus: (id, status) => apiClient.put(`/reviews/${id}/status`, { status }),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  getReviewStats: () => apiClient.get('/reviews/stats'),
  getApprovedReviews: (params) => apiClient.get('/reviews/approved', { params }),

  // Analytics endpoints
  getAnalyticsOverview: () => apiClient.get('/analytics/overview'),
  getAnalyticsEvents: (params) => apiClient.get('/analytics/events', { params }),
  getAnalyticsChartData: (type, dateRange) => apiClient.get('/analytics/chart-data', { 
    params: { type, date_range: dateRange } 
  }),

  // Dashboard endpoints
  getDashboardStats: () => apiClient.get('/dashboard/stats'),
  getQuickActions: () => apiClient.get('/dashboard/quick-actions'),
  getPerformanceMetrics: (params) => apiClient.get('/dashboard/performance', { params }),

  // Settings endpoints
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
  getSettingsCategory: (category) => apiClient.get(`/settings/${category}`),
  updateSettingsCategory: (category, data) => apiClient.put(`/settings/${category}`, data),

  // Health check
  healthCheck: () => apiClient.get('/health'),
};

// Legacy API objects for backward compatibility
export const authAPI = {
  login: api.login,
  register: api.register,
  getCurrentUser: api.getCurrentUser,
  logout: api.logout,
};

export const articlesAPI = {
  getArticles: api.getArticles,
  getArticle: api.getArticle,
  createArticle: api.createArticle,
  updateArticle: api.updateArticle,
  deleteArticle: api.deleteArticle,
  getCategories: api.getArticleCategories,
  getTags: api.getArticleTags,
};

export const contactsAPI = {
  getContacts: api.getContacts,
  getContact: api.getContact,
  updateContactStatus: api.updateContactStatus,
  deleteContact: api.deleteContact,
  getContactStats: api.getContactStats,
};

export const newsletterAPI = {
  getSubscribers: api.getSubscribers,
  getSubscriber: api.getSubscriber,
  updateSubscriberStatus: api.updateSubscriberStatus,
  deleteSubscriber: api.deleteSubscriber,
  getNewsletterStats: api.getNewsletterStats,
  exportSubscribers: api.exportSubscribers,
};

export const reviewsAPI = {
  getReviews: api.getReviews,
  getReview: api.getReview,
  updateReviewStatus: api.updateReviewStatus,
  deleteReview: api.deleteReview,
  getReviewStats: api.getReviewStats,
  getApprovedReviews: api.getApprovedReviews,
};

export const analyticsAPI = {
  getOverview: api.getAnalyticsOverview,
  getEvents: api.getAnalyticsEvents,
  getChartData: api.getAnalyticsChartData,
};

export const dashboardAPI = {
  getStats: api.getDashboardStats,
  getQuickActions: api.getQuickActions,
  getPerformanceMetrics: api.getPerformanceMetrics,
};

export const healthAPI = {
  check: api.healthCheck,
};

export default apiClient;

