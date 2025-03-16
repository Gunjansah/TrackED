import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Adding token to request:', config.headers['Authorization']);
    } else {
      console.log('No token found for request');
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error);
    
    if (!error.response) {
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Please log in to continue'));
    }
    
    if (error.response.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action'));
    }
    
    return Promise.reject(error.response.data?.message || error.message || 'An error occurred');
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const token = response.data.token;
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      console.log('Token stored after registration:', token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('Checking auth token:', token ? 'exists' : 'not found');
    return token !== null;
  }
};

// Grocery services
export const groceryService = {
  getItems: async () => {
    const response = await api.get('/grocery/items');
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/grocery/categories');
    return response.data;
  },
  
  addItem: async (itemData) => {
    // Format dates to YYYY-MM-DD
    const formattedData = {
      ...itemData,
      purchase_date: itemData.purchase_date ? new Date(itemData.purchase_date).toISOString().split('T')[0] : null,
      expiry_date: itemData.expiry_date ? new Date(itemData.expiry_date).toISOString().split('T')[0] : null,
      notes: itemData.notes || '' // Ensure notes are included
    };
    
    console.log('Sending item data:', formattedData);
    const response = await api.post('/grocery/items', formattedData);
    return response.data;
  },
  
  updateItem: async (id, itemData) => {
    // Format dates to YYYY-MM-DD
    const formattedData = {
      ...itemData,
      purchase_date: itemData.purchase_date ? new Date(itemData.purchase_date).toISOString().split('T')[0] : null,
      expiry_date: itemData.expiry_date ? new Date(itemData.expiry_date).toISOString().split('T')[0] : null,
      consumed_date: itemData.consumed_date ? new Date(itemData.consumed_date).toISOString().split('T')[0] : null,
      notes: itemData.notes || '' // Ensure notes are included
    };
    
    console.log('Updating item with data:', formattedData);
    const response = await api.put(`/grocery/items/${id}`, formattedData);
    return response.data;
  },
  
  deleteItem: async (id) => {
    const response = await api.delete(`/grocery/items/${id}`);
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  }
};

export default api; 