import { Router } from 'express';
import * as entityController from '../controllers/entityController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(entityController.getAllEntities));
router.get('/search', asyncHandler(entityController.searchEntities));
router.get('/stats', asyncHandler(entityController.getEntityStats));
router.get('/:id', asyncHandler(entityController.getEntityById));
router.get('/:id/incidents', asyncHandler(entityController.getEntityIncidents));
router.get('/:id/locations', asyncHandler(entityController.getEntityLocations));

// Compatibility calculator
router.post('/compatibility', asyncHandler(entityController.calculateCompatibility));

// Protected routes (require authentication)
router.post('/', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(entityController.createEntity));
router.put('/:id', authenticate, authorize('INVESTIGATOR', 'ADMIN'), asyncHandler(entityController.updateEntity));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(entityController.deleteEntity));

export default router;
