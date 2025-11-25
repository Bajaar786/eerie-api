import { Router } from 'express';
import * as locationController from '../controllers/locationController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(locationController.getAllLocations));
router.get('/:id', asyncHandler(locationController.getLocationById));
router.get('/:id/entities', asyncHandler(locationController.getLocationEntities));
router.get('/:id/incidents', asyncHandler(locationController.getLocationIncidents));

// Protected routes
router.post('/', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(locationController.createLocation));
router.put('/:id', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(locationController.updateLocation));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(locationController.deleteLocation));

export default router;
