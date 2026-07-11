import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import pgRoutes from './routes/pgRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getHomePgs } from './controllers/pgController.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

// --- Core middleware (order matters here) ---
app.use(helmet());                                   // sets safe HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());                              // parse JSON request bodies
app.use(cookieParser());                               // parse cookies (used later for refresh tokens)
app.use(morgan('dev'));                                 // log requests to console while developing

// Basic rate limiting on auth routes specifically — these are the routes
// most worth protecting from brute-force/credential-stuffing attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // generous limit so it doesn't get in your way during dev/demo
  message: { message: 'Too many attempts, please try again later' },
});

// --- Health check route ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PG Platform API is running' });
});

// Home-page data: top 5 PGs plus filter options for location, budget, room type, etc.
app.get('/api/home', getHomePgs);

// --- Feature routes ---
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/pgs', pgRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 + error handling (must be registered LAST) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

export default app;
