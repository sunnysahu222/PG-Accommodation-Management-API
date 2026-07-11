import api from './api';

export const pgService = {
  getAll: (filters = {}) => api.get('/pgs', { params: filters }).then((res) => res.data),
  getById: (id) => api.get(`/pgs/${id}`).then((res) => res.data),
  create: (data) => api.post('/pgs', data).then((res) => res.data),
  update: (id, data) => api.put(`/pgs/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/pgs/${id}`).then((res) => res.data),
};
