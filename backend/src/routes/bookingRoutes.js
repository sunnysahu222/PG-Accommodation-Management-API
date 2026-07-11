import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema, updateBookingStatusSchema } from '../validators/bookingValidator.js';

const router = Router();

// All booking routes require login — no anonymous bookings,
// and "my bookings" inherently needs to know who "I" am.
router.post('/', requireAuth, validate(createBookingSchema), bookingController.createBooking);
router.get('/', requireAuth, bookingController.getBookings);
router.patch('/:id', requireAuth, validate(updateBookingStatusSchema), bookingController.updateBooking);

export default router;
