import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const productApi = {
  getAll: (params) => api.get('/products', { params }).then(r => r.data),
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),
  search: (q) => api.get('/products/search', { params: { q } }).then(r => r.data),
  getByCategory: (category) => api.get(`/products/category/${category}`).then(r => r.data)
};

export const compareApi = {
  compare: (ids) => api.get('/compare', { params: { ids: ids.join(',') } }).then(r => r.data)
};

export const priceApi = {
  getPrices: (productId) => api.get(`/prices/${productId}`).then(r => r.data),
  getHistory: (productId, days = 90) => api.get(`/prices/${productId}/history`, { params: { days } }).then(r => r.data),
  getSummary: (productId) => api.get(`/prices/${productId}/summary`).then(r => r.data)
};

export const recommendationApi = {
  getRecommendation: (productId) => api.get(`/recommendation/${productId}`).then(r => r.data),
  getValueScore: (productId) => api.get(`/value-score/${productId}`).then(r => r.data)
};

export const alertApi = {
  getAll: () => api.get('/alerts').then(r => r.data),
  create: (data) => api.post('/alerts', data).then(r => r.data),
  delete: (id) => api.delete(`/alerts/${id}`).then(r => r.data),
  simulateCheck: (payload = {}) => api.post('/alerts/simulate-check', payload).then(r => r.data)
};

export const miscApi = {
  getSalesEvents: () => api.get('/sales-events').then(r => r.data),
  getRefurbishedDeals: () => api.get('/refurbished-deals').then(r => r.data)
};

export default api;
