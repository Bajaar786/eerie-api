import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/leaderboard', asyncHandler(userController.getLeaderboard));
router.get('/:id', asyncHandler(userController.getUserProfile));
router.get('/:id/contributions', asyncHandler(userController.getUserContributions));

// Protected routes
router.put('/:id', authenticate, asyncHandler(userController.updateUserProfile));
router.get('/me/stats', authenticate, asyncHandler(userController.getUserStats));

export default router;
