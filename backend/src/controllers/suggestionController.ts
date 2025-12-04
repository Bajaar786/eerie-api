import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// Get all suggestions (with filters)
export const getAllSuggestions = async (req: Request, res: Response) => {
  const { status, submittedById } = req.query;

  const where: any = {};
  if (status) where.status = status;
  if (submittedById) where.submittedById = submittedById;

  const suggestions = await prisma.entitySuggestion.findMany({
    where,
    include: {
      submittedBy: {
        select: {
          id: true,
          username: true,
          reputationScore: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const parsedSuggestions = suggestions.map(suggestion => ({
    ...suggestion,
    abilities: JSON.parse(suggestion.abilities),
    weaknesses: JSON.parse(suggestion.weaknesses),
  }));

  res.json(parsedSuggestions);
};

// Get suggestion by ID
export const getSuggestionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const suggestion = await prisma.entitySuggestion.findUnique({
    where: { id },
    include: {
      submittedBy: {
        select: {
          id: true,
          username: true,
          email: true,
          reputationScore: true,
          createdAt: true,
        },
      },
    },
  });

  if (!suggestion) {
    throw new AppError('Suggestion not found', 404);
  }

  const parsedSuggestion = {
    ...suggestion,
    abilities: JSON.parse(suggestion.abilities),
    weaknesses: JSON.parse(suggestion.weaknesses),
  };

  res.json(parsedSuggestion);
};

// Submit entity suggestion
export const submitSuggestion = async (req: AuthRequest, res: Response) => {
  const {
    name,
    classification,
    threatLevel,
    description,
    abilities,
    weaknesses,
    firstSighted,
    lastSighted,
    imageUrl,
    sourceCitation,
  } = req.body;

  if (!name || !classification || !description || !sourceCitation) {
    throw new AppError('Name, classification, description, and source citation are required', 400);
  }

  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const suggestion = await prisma.entitySuggestion.create({
    data: {
      name,
      classification,
      threatLevel: threatLevel || 1,
      description,
      abilities: JSON.stringify(abilities || []),
      weaknesses: JSON.stringify(weaknesses || []),
      firstSighted: firstSighted ? new Date(firstSighted) : null,
      lastSighted: lastSighted ? new Date(lastSighted) : null,
      imageUrl,
      sourceCitation,
      submittedById: req.user.id,
    },
    include: {
      submittedBy: {
        select: {
          id: true,
          username: true,
          reputationScore: true,
        },
      },
    },
  });

  // Log contribution
  await prisma.contributionLog.create({
    data: {
      userId: req.user.id,
      actionType: 'ENTITY_SUGGESTED',
      pointsEarned: 10,
      description: `Suggested entity: ${name}`,
    },
  });

  // Update user reputation
  await prisma.user.update({
    where: { id: req.user.id },
    data: { reputationScore: { increment: 10 } },
  });

  const parsedSuggestion = {
    ...suggestion,
    abilities: JSON.parse(suggestion.abilities),
    weaknesses: JSON.parse(suggestion.weaknesses),
  };

  res.status(201).json(parsedSuggestion);
};

// Review suggestion (MODERATOR/ADMIN only)
export const reviewSuggestion = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, reviewComment } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new AppError('Status must be APPROVED or REJECTED', 400);
  }

  const suggestion = await prisma.entitySuggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new AppError('Suggestion not found', 404);
  }

  if (suggestion.status !== 'PENDING') {
    throw new AppError('Suggestion has already been reviewed', 400);
  }

  // Update suggestion
  const updatedSuggestion = await prisma.entitySuggestion.update({
    where: { id },
    data: {
      status,
      reviewComment,
      reviewedAt: new Date(),
    },
  });

  // If approved, create entity
  if (status === 'APPROVED') {
    await prisma.entity.create({
      data: {
        name: suggestion.name,
        classification: suggestion.classification,
        threatLevel: suggestion.threatLevel,
        description: suggestion.description,
        abilities: suggestion.abilities,
        weaknesses: suggestion.weaknesses,
        firstSighted: suggestion.firstSighted,
        lastSighted: suggestion.lastSighted,
        imageUrl: suggestion.imageUrl,
        contributorId: suggestion.submittedById,
        sourceCitation: suggestion.sourceCitation,
        status: 'ACTIVE',
      },
    });

    // Award points to contributor
    await prisma.contributionLog.create({
      data: {
        userId: suggestion.submittedById,
        actionType: 'ENTITY_APPROVED',
        pointsEarned: 50,
        description: `Entity approved: ${suggestion.name}`,
      },
    });

    await prisma.user.update({
      where: { id: suggestion.submittedById },
      data: { reputationScore: { increment: 50 } },
    });

    // Upgrade to CONTRIBUTOR if not already
    const user = await prisma.user.findUnique({
      where: { id: suggestion.submittedById },
    });

    if (user && user.role === 'VISITOR') {
      await prisma.user.update({
        where: { id: suggestion.submittedById },
        data: { role: 'CONTRIBUTOR' },
      });
    }
  }

  const parsedSuggestion = {
    ...updatedSuggestion,
    abilities: JSON.parse(updatedSuggestion.abilities),
    weaknesses: JSON.parse(updatedSuggestion.weaknesses),
  };

  res.json(parsedSuggestion);
};

// Delete suggestion
export const deleteSuggestion = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const suggestion = await prisma.entitySuggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new AppError('Suggestion not found', 404);
  }

  // Only allow deletion by submitter or admin
  if (suggestion.submittedById !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.entitySuggestion.delete({
    where: { id },
  });

  res.json({ message: 'Suggestion deleted successfully' });
};

// Get pending suggestions count
export const getPendingCount = async (req: Request, res: Response) => {
  const count = await prisma.entitySuggestion.count({
    where: { status: 'PENDING' },
  });

  res.json({ count });
};
