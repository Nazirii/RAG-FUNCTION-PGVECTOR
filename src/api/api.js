import axios from 'axios';
import { getSessionId } from '../utils/sessionManager';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add session ID to all requests (from sessionManager)
api.interceptors.request.use(config => {
  const sessionId = getSessionId();
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }
  return config;
});

// Menu API
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
  groupByCategory: (params) => api.get('/menu/group-by-category', { params }),
  search: (params) => api.get('/menu/search', { params }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
  checkout: (data) => api.post('/cart/checkout', data),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getByOrderNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
};

// AI API
export const aiAPI = {
  semanticSearch: (query, limit = 15, threshold = 0.5) => 
    api.post('/ai/search', { query, limit, threshold }),
  chat: (message, sessionId, conversationHistory = [], contextLimit = 8) => 
    api.post('/ai/chat', {
      message,
      session_id: sessionId,
      conversation_history: conversationHistory,
      context_limit: contextLimit,
    }),
};

// Default export with helper methods
const apiClient = {
  ...api,
  menu: menuAPI,
  cart: cartAPI,
  orders: ordersAPI,
  ai: aiAPI,
  
  // Convenience methods for AI Chat component
  chat: (message, sessionId, conversationHistory, contextLimit) => 
    aiAPI.chat(message, sessionId, conversationHistory, contextLimit).then(res => res.data),
  semanticSearch: (query, limit, threshold) => 
    aiAPI.semanticSearch(query, limit, threshold).then(res => res.data),
};

export default apiClient;
