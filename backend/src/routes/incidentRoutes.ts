import { Router } from 'express';
import * as incidentController from '../controllers/incidentController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(incidentController.getAllIncidents));
router.get('/:id', asyncHandler(incidentController.getIncidentById));

// Protected routes
router.post('/', authenticate, asyncHandler(incidentController.createIncident));
router.put('/:id', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(incidentController.updateIncident));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(incidentController.deleteIncident));
router.patch('/:id/verify', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(incidentController.verifyIncident));

export default router;
