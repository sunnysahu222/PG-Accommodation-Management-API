import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

// Checks for a valid JWT on incoming requests. If valid, attaches the
// decoded payload to req.user so every downstream controller can read
// "who is making this request" without re-checking auth each time.
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

// Role-based access control (RBAC): pass in which roles are allowed,
// get back middleware that blocks everyone else.
// Usage: router.post('/pgs', requireAuth, requireRole('OWNER'), ...)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}
