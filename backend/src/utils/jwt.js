import jwt from 'jsonwebtoken';

// Signs a token containing just enough to identify + authorize the user.
// Never put passwords or sensitive data in a JWT payload — it's base64, not encrypted.
export function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
