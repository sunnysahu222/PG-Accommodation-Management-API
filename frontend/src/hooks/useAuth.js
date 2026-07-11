import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

// Auth uses plain useMutation (not a custom query hook) because there's
// no "cached data" to manage here — login/register are one-shot actions
// that update the Zustand auth store directly, not React Query's cache.
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(redirectPathForRole(data.user.role));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Account created!');
      navigate(redirectPathForRole(data.user.role));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };
}

function redirectPathForRole(role) {
  if (role === 'OWNER') return '/owner/dashboard';
  if (role === 'ADMIN') return '/admin/dashboard';
  return '/';
}
