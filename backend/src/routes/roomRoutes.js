import { Router } from 'express';
import * as roomController from '../controllers/roomController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRoomSchema, updateRoomSchema } from '../validators/pgValidator.js';

const router = Router();

router.get('/pg/:pgId', roomController.getRoomsForPg); // public — view rooms for a PG
router.post('/pg/:pgId', requireAuth, requireRole('OWNER'), validate(createRoomSchema), roomController.createRoom);
router.put('/:id', requireAuth, requireRole('OWNER'), validate(updateRoomSchema), roomController.updateRoom);
router.delete('/:id', requireAuth, requireRole('OWNER'), roomController.deleteRoom);

export default router;
