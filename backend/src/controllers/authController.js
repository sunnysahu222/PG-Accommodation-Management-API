import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/apiError.js';
import { ApiError } from '../utils/apiError.js';
import { Owner, User } from '../models/index.js';
import { signToken } from '../utils/jwt.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, phone, role });

  if (role === 'OWNER') {
    await Owner.create({ user: user._id });
  }

  const token = signToken(user);
  res.status(201).json({ message: 'Registered successfully', user: sanitizeUser(user), token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user);
  res.status(200).json({ message: 'Logged in successfully', user: sanitizeUser(user), token });
});

export const logout = asyncHandler(async (req, res) => {
  // With plain JWT (no server-side session/refresh-token store in this
  // version), "logout" is mostly a client-side action: discard the token.
  // This endpoint exists so the frontend has a consistent API to call.
  res.status(200).json({ message: 'Logged out successfully' });
});

function sanitizeUser(user) {
  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
}
