import { z } from 'zod';

// Validating at the edge (before any DB call) means bad data never
// reaches business logic. If this fails, the request is rejected immediately
// with a clear message — no wasted DB queries, no cryptic database errors.

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['TENANT', 'OWNER']).default('TENANT'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
