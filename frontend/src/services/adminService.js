import api from './api';

export const adminService = {
  getUsers: () => api.get('/admin/users').then((res) => res.data),
  getOwners: () => api.get('/admin/owners').then((res) => res.data),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`).then((res) => res.data),
  getPendingPgs: () => api.get('/admin/pgs/pending').then((res) => res.data),
  reviewPg: (id, status) => api.patch(`/admin/pgs/${id}/review`, { status }).then((res) => res.data),
  getAnalytics: () => api.get('/admin/analytics').then((res) => res.data),
};
