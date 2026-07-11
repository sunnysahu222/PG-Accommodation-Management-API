import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings', data).then((res) => res.data),
  getMine: () => api.get('/bookings').then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }).then((res) => res.data),
};
