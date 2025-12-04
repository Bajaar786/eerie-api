import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// Vote on incident credibility
export const voteOnIncident = async (req: AuthRequest, res: Response) => {
  const { incidentId } = req.params;
  const { voteType } = req.body;

  if (!['CREDIBLE', 'NOT_CREDIBLE'].includes(voteType)) {
    throw new AppError('Vote type must be CREDIBLE or NOT_CREDIBLE', 400);
  }

  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  // Check if user already voted
  const existingVote = await prisma.incidentVote.findUnique({
    where: {
      incidentId_userId: {
        incidentId,
        userId: req.user.id,
      },
    },
  });

  if (existingVote) {
    // Update existing vote
    if (existingVote.voteType === voteType) {
      throw new AppError('You have already cast this vote', 400);
    }

    await prisma.incidentVote.update({
      where: { id: existingVote.id },
      data: { voteType },
    });

    // Update credibility score
    const scoreChange = voteType === 'CREDIBLE' ? 2 : -2; // Changed from old vote
    await prisma.incident.update({
      where: { id: incidentId },
      data: { credibilityScore: { increment: scoreChange } },
    });
  } else {
    // Create new vote
    await prisma.incidentVote.create({
      data: {
        incidentId,
        userId: req.user.id,
        voteType,
      },
    });

    // Update credibility score
    const scoreChange = voteType === 'CREDIBLE' ? 1 : -1;
    await prisma.incident.update({
      where: { id: incidentId },
      data: { credibilityScore: { increment: scoreChange } },
    });

    // Log contribution
    await prisma.contributionLog.create({
      data: {
        userId: req.user.id,
        actionType: 'VOTE_CAST',
        pointsEarned: 1,
        description: `Voted on incident: ${incident.title}`,
      },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { reputationScore: { increment: 1 } },
    });
  }

  // Get updated incident with vote counts
  const updatedIncident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      votes: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  const credibleVotes = updatedIncident?.votes.filter(v => v.voteType === 'CREDIBLE').length || 0;
  const notCredibleVotes = updatedIncident?.votes.filter(v => v.voteType === 'NOT_CREDIBLE').length || 0;

  res.json({
    message: 'Vote recorded successfully',
    credibilityScore: updatedIncident?.credibilityScore,
    credibleVotes,
    notCredibleVotes,
    totalVotes: credibleVotes + notCredibleVotes,
  });
};

// Get user's vote on incident
export const getUserVote = async (req: AuthRequest, res: Response) => {
  const { incidentId } = req.params;

  if (!req.user) {
    return res.json({ voted: false });
  }

  const vote = await prisma.incidentVote.findUnique({
    where: {
      incidentId_userId: {
        incidentId,
        userId: req.user.id,
      },
    },
  });

  if (!vote) {
    return res.json({ voted: false });
  }

  res.json({
    voted: true,
    voteType: vote.voteType,
  });
};

// Get incident vote statistics
export const getIncidentVoteStats = async (req: Request, res: Response) => {
  const { incidentId } = req.params;

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      votes: true,
    },
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  const credibleVotes = incident.votes.filter(v => v.voteType === 'CREDIBLE').length;
  const notCredibleVotes = incident.votes.filter(v => v.voteType === 'NOT_CREDIBLE').length;
  const totalVotes = credibleVotes + notCredibleVotes;

  res.json({
    credibilityScore: incident.credibilityScore,
    credibleVotes,
    notCredibleVotes,
    totalVotes,
    credibilityPercentage: totalVotes > 0 ? Math.round((credibleVotes / totalVotes) * 100) : 0,
  });
};
