import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ONE axios instance, used everywhere. If the backend URL ever changes,
// or we need to add a header to every request, this is the only place to touch.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: automatically attaches the JWT to every outgoing
// request, so individual API calls never have to remember to do this themselves.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: if the backend ever says "your token is invalid/expired"
// (401), automatically log the user out client-side instead of leaving them
// stuck in a broken logged-in-looking state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
