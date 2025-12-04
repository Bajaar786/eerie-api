import { Router } from 'express';
import * as suggestionController from '../controllers/suggestionController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(suggestionController.getAllSuggestions));
router.get('/pending-count', asyncHandler(suggestionController.getPendingCount));
router.get('/:id', asyncHandler(suggestionController.getSuggestionById));

// Protected routes
router.post('/', authenticate, asyncHandler(suggestionController.submitSuggestion));
router.delete('/:id', authenticate, asyncHandler(suggestionController.deleteSuggestion));

// Moderator/Admin routes
router.patch('/:id/review', authenticate, authorize('MODERATOR', 'ADMIN'), asyncHandler(suggestionController.reviewSuggestion));

export default router;
