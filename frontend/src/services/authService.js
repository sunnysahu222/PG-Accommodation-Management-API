import api from './api';

// Thin wrappers around endpoints. Components never call api.post(...) directly —
// they call authService.login(...). This means if a backend route path
// ever changes, you fix it in exactly one place, not in every component that uses it.
export const authService = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
};
