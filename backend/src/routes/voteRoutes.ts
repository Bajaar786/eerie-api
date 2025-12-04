import { Router } from 'express';
import * as voteController from '../controllers/voteController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.get('/incidents/:incidentId/stats', asyncHandler(voteController.getIncidentVoteStats));

// Protected routes
router.post('/incidents/:incidentId', authenticate, asyncHandler(voteController.voteOnIncident));
router.get('/incidents/:incidentId/user-vote', authenticate, asyncHandler(voteController.getUserVote));

export default router;
