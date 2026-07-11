import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Every route here requires ADMIN role — applied once at the router level
// instead of repeating requireRole('ADMIN') on every single line.
router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', adminController.getUsers);
router.get('/owners', adminController.getAllOwners);

router.patch('/users/:id/block', adminController.blockUser);
router.get('/pgs/pending', adminController.getPendingPgs);
router.patch('/pgs/:id/review', adminController.reviewPgListing);
router.get('/analytics', adminController.getAnalytics);

export default router;
