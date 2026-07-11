import api from './api';

export const roomService = {
  getForPg: (pgId) => api.get(`/rooms/pg/${pgId}`).then((res) => res.data),
  create: (pgId, data) => api.post(`/rooms/pg/${pgId}`, data).then((res) => res.data),
  update: (id, data) => api.put(`/rooms/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/rooms/${id}`).then((res) => res.data),
};
