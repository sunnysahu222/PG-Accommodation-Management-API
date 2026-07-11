import { Router } from 'express';
import * as pgController from '../controllers/pgController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPgSchema, updatePgSchema } from '../validators/pgValidator.js';

const router = Router();

// Public routes — anyone can browse listings, no login required.
router.get('/home/top', pgController.getHomePgs);
router.get('/', pgController.getAllPgs);
router.get('/:id', pgController.getPgById);

// Protected — only logged-in OWNERs can create/edit/delete.
router.post('/', requireAuth, requireRole('OWNER'), validate(createPgSchema), pgController.createPg);
router.put('/:id', requireAuth, requireRole('OWNER'), validate(updatePgSchema), pgController.updatePg);
router.delete('/:id', requireAuth, requireRole('OWNER'), pgController.deletePg);

export default router;
