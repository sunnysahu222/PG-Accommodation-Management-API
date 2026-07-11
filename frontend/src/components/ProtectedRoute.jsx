import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Wraps any route that needs login (and optionally a specific role).
// Usage: <ProtectedRoute roles={['OWNER']}><OwnerDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in, but wrong role — send them somewhere sensible rather than a blank 403 page.
    return <Navigate to="/" replace />;
  }

  return children;
}
