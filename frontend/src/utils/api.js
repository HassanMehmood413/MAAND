const API_BASE_URL = 'https://maand-backend.vercel.app/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (userInfo && userInfo.token) {
    headers.Authorization = `Bearer ${userInfo.token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth related functions
export const auth = {
  signIn: async (email, password) => {
    return apiRequest('/users/signin', 'POST', { email, password });
  },

  signUp: async (userData) => {
    return apiRequest('/users/signup', 'POST', userData);
  },

  forgotPassword: async (email) => {
    return apiRequest('/users/forgot-password', 'POST', { email });
  },

  resetPassword: async (token, password) => {
    return apiRequest(`/users/reset-password/${token}`, 'POST', { password });
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  },

  isAuthenticated: () => {
    const userInfo = localStorage.getItem('userInfo');
    return !!userInfo;
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
};

// User related functions
export const users = {
  getAll: async () => {
    return apiRequest('/users');
  },

  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  getByEmail: async (email) => {
    return apiRequest(`/users/email/${email}`);
  },

  getUserIdByEmail: async (email) => {
    return apiRequest(`/users/id/${email}`);
  },

  update: async (id, updates) => {
    return apiRequest(`/users/${id}`, 'PUT', updates);
  },

  delete: async (id) => {
    return apiRequest(`/users/${id}`, 'DELETE');
  }
};

// Service Provider related functions
export const serviceProviders = {
  register: async (providerData) => {
    return apiRequest('/service-providers/register', 'POST', providerData);
  },

  getProfile: async () => {
    return apiRequest('/service-providers/profile');
  },

  updateProfile: async (updates) => {
    return apiRequest('/service-providers/profile', 'PUT', updates);
  }
};

// Helper function to handle file uploads
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const headers = {};

  if (userInfo && userInfo.token) {
    headers.Authorization = `Bearer ${userInfo.token}`;
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
};

// Export the base apiRequest function for custom requests
export { apiRequest }; 