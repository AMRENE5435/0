// Authentication utilities
export const AUTH_TOKEN_KEY = 'admin_token';
export const AUTH_USER_KEY = 'admin_user';

export const authUtils = {
  // Get stored token
  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Set token
  setToken: (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Set user
  setUser: (user) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  // Remove user
  removeUser: () => {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authUtils.getToken();
    const user = authUtils.getUser();
    return !!(token && user);
  },

  // Clear all auth data
  clearAuth: () => {
    authUtils.removeToken();
    authUtils.removeUser();
  },

  // Login
  login: (token, user) => {
    authUtils.setToken(token);
    authUtils.setUser(user);
  },

  // Logout
  logout: () => {
    authUtils.clearAuth();
    window.location.href = '/login';
  },
};

