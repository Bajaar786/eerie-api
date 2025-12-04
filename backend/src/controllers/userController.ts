import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      reputationScore: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          incidents: true,
          entitySuggestions: true,
          incidentVotes: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user);
};

// Get user contributions
export const getUserContributions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const [suggestions, incidents, votes, logs] = await Promise.all([
    prisma.entitySuggestion.findMany({
      where: { submittedById: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.incident.findMany({
      where: { reportedById: id },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.incidentVote.findMany({
      where: { userId: id },
      include: {
        incident: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.contributionLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  const parsedSuggestions = suggestions.map(s => ({
    ...s,
    abilities: JSON.parse(s.abilities),
    weaknesses: JSON.parse(s.weaknesses),
  }));

  const parsedIncidents = incidents.map(i => ({
    ...i,
    evidence: JSON.parse(i.evidence),
  }));

  res.json({
    suggestions: parsedSuggestions,
    incidents: parsedIncidents,
    votes,
    logs,
  });
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!req.user || (req.user.id !== id && req.user.role !== 'ADMIN')) {
    throw new AppError('Unauthorized', 403);
  }

  const { bio } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { bio },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      reputationScore: true,
      bio: true,
      createdAt: true,
    },
  });

  res.json(user);
};

// Get leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      reputationScore: true,
      _count: {
        select: {
          entitySuggestions: true,
          incidents: true,
          incidentVotes: true,
        },
      },
    },
    orderBy: { reputationScore: 'desc' },
    take: parseInt(limit as string),
  });

  res.json(users);
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const [user, approvedSuggestions, totalPoints] = await Promise.all([
    prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: {
            entitySuggestions: true,
            incidents: true,
            incidentVotes: true,
            contributionLogs: true,
          },
        },
      },
    }),
    prisma.entitySuggestion.count({
      where: {
        submittedById: req.user.id,
        status: 'APPROVED',
      },
    }),
    prisma.contributionLog.aggregate({
      where: { userId: req.user.id },
      _sum: { pointsEarned: true },
    }),
  ]);

  res.json({
    reputationScore: user?.reputationScore || 0,
    totalSuggestions: user?._count.entitySuggestions || 0,
    approvedSuggestions,
    totalIncidents: user?._count.incidents || 0,
    totalVotes: user?._count.incidentVotes || 0,
    totalContributions: user?._count.contributionLogs || 0,
    totalPointsEarned: totalPoints._sum.pointsEarned || 0,
  });
};
