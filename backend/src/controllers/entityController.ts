import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { EntitySearchQuery, CompatibilityResult } from '../types';

export const getAllEntities = async (req: Request, res: Response) => {
  const entities = await prisma.entity.findMany({
    orderBy: { name: 'asc' },
  });

  // Parse JSON strings back to arrays
  const parsedEntities = entities.map(entity => ({
    ...entity,
    abilities: JSON.parse(entity.abilities),
    weaknesses: JSON.parse(entity.weaknesses),
  }));

  res.json(parsedEntities);
};

export const getEntityById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const entity = await prisma.entity.findUnique({
    where: { id },
    include: {
      incidents: {
        include: {
          location: true,
        },
      },
      locations: {
        include: {
          location: true,
        },
      },
    },
  });

  if (!entity) {
    throw new AppError('Entity not found', 404);
  }

  const parsedEntity = {
    ...entity,
    abilities: JSON.parse(entity.abilities),
    weaknesses: JSON.parse(entity.weaknesses),
    incidents: entity.incidents.map(incident => ({
      ...incident,
      evidence: JSON.parse(incident.evidence),
    })),
  };

  res.json(parsedEntity);
};

export const searchEntities = async (req: Request, res: Response) => {
  const {
    classification,
    minThreatLevel,
    maxThreatLevel,
    status,
    location,
    search,
  } = req.query as any;

  const where: any = {};

  if (classification) {
    where.classification = classification;
  }

  if (minThreatLevel || maxThreatLevel) {
    where.threatLevel = {};
    if (minThreatLevel) where.threatLevel.gte = parseInt(minThreatLevel);
    if (maxThreatLevel) where.threatLevel.lte = parseInt(maxThreatLevel);
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (location) {
    where.locations = {
      some: {
        location: {
          OR: [
            { name: { contains: location } },
            { city: { contains: location } },
            { country: { contains: location } },
          ],
        },
      },
    };
  }

  const entities = await prisma.entity.findMany({
    where,
    include: {
      locations: {
        include: {
          location: true,
        },
      },
    },
    orderBy: { threatLevel: 'desc' },
  });

  const parsedEntities = entities.map(entity => ({
    ...entity,
    abilities: JSON.parse(entity.abilities),
    weaknesses: JSON.parse(entity.weaknesses),
  }));

  res.json(parsedEntities);
};

export const getEntityStats = async (req: Request, res: Response) => {
  const [
    total,
    byClassification,
    byStatus,
    avgThreatLevel,
    mostDangerous,
  ] = await Promise.all([
    prisma.entity.count(),
    prisma.entity.groupBy({
      by: ['classification'],
      _count: true,
    }),
    prisma.entity.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.entity.aggregate({
      _avg: { threatLevel: true },
    }),
    prisma.entity.findMany({
      take: 5,
      orderBy: { threatLevel: 'desc' },
      select: {
        id: true,
        name: true,
        classification: true,
        threatLevel: true,
      },
    }),
  ]);

  res.json({
    total,
    byClassification,
    byStatus,
    averageThreatLevel: avgThreatLevel._avg.threatLevel,
    mostDangerous,
  });
};

export const getEntityIncidents = async (req: Request, res: Response) => {
  const { id } = req.params;

  const incidents = await prisma.incident.findMany({
    where: { entityId: id },
    include: {
      location: true,
      reportedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  const parsedIncidents = incidents.map(incident => ({
    ...incident,
    evidence: JSON.parse(incident.evidence),
  }));

  res.json(parsedIncidents);
};

export const getEntityLocations = async (req: Request, res: Response) => {
  const { id } = req.params;

  const entityLocations = await prisma.entityLocation.findMany({
    where: { entityId: id },
    include: {
      location: true,
    },
  });

  res.json(entityLocations);
};

export const calculateCompatibility = async (req: Request, res: Response) => {
  const { entity1Id, entity2Id } = req.body;

  if (!entity1Id || !entity2Id) {
    throw new AppError('Both entity IDs are required', 400);
  }

  const [entity1, entity2] = await Promise.all([
    prisma.entity.findUnique({ where: { id: entity1Id } }),
    prisma.entity.findUnique({ where: { id: entity2Id } }),
  ]);

  if (!entity1 || !entity2) {
    throw new AppError('One or both entities not found', 404);
  }

  // Calculate compatibility score
  let score = 50; // Base score
  const warnings: string[] = [];

  // Same classification bonus
  if (entity1.classification === entity2.classification) {
    score += 20;
  }

  // Threat level difference
  const threatDiff = Math.abs(entity1.threatLevel - entity2.threatLevel);
  if (threatDiff > 5) {
    score -= 15;
    warnings.push('Large threat level difference may cause instability');
  }

  // Demonic entities are dangerous together
  if (entity1.classification === 'Demonic' && entity2.classification === 'Demonic') {
    score -= 30;
    warnings.push('Multiple demonic entities in proximity is extremely dangerous');
  }

  // Extraterrestrial + Cryptid compatibility
  if (
    (entity1.classification === 'Extraterrestrial' && entity2.classification === 'Cryptid') ||
    (entity1.classification === 'Cryptid' && entity2.classification === 'Extraterrestrial')
  ) {
    score += 10;
  }

  // Apparitions are generally neutral
  if (entity1.classification === 'Apparition' || entity2.classification === 'Apparition') {
    score += 5;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let analysis = '';
  if (score >= 70) {
    analysis = 'High compatibility - These entities can coexist with minimal risk';
  } else if (score >= 40) {
    analysis = 'Moderate compatibility - Caution advised when both entities are present';
  } else {
    analysis = 'Low compatibility - High risk of dangerous interactions';
  }

  const result: CompatibilityResult = {
    entity1: entity1.name,
    entity2: entity2.name,
    compatibilityScore: score,
    analysis,
    warnings,
  };

  res.json(result);
};

export const createEntity = async (req: Request, res: Response) => {
  const {
    name,
    classification,
    threatLevel,
    description,
    abilities,
    weaknesses,
    firstSighted,
    lastSighted,
    status,
    imageUrl,
  } = req.body;

  if (!name || !classification || !description) {
    throw new AppError('Name, classification, and description are required', 400);
  }

  const entity = await prisma.entity.create({
    data: {
      name,
      classification,
      threatLevel: threatLevel || 1,
      description,
      abilities: JSON.stringify(abilities || []),
      weaknesses: JSON.stringify(weaknesses || []),
      firstSighted: firstSighted ? new Date(firstSighted) : null,
      lastSighted: lastSighted ? new Date(lastSighted) : null,
      status: status || 'ACTIVE',
      imageUrl,
    },
  });

  const parsedEntity = {
    ...entity,
    abilities: JSON.parse(entity.abilities),
    weaknesses: JSON.parse(entity.weaknesses),
  };

  res.status(201).json(parsedEntity);
};

export const updateEntity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  // Convert arrays to JSON strings
  if (updateData.abilities) {
    updateData.abilities = JSON.stringify(updateData.abilities);
  }
  if (updateData.weaknesses) {
    updateData.weaknesses = JSON.stringify(updateData.weaknesses);
  }

  // Convert date strings to Date objects
  if (updateData.firstSighted) {
    updateData.firstSighted = new Date(updateData.firstSighted);
  }
  if (updateData.lastSighted) {
    updateData.lastSighted = new Date(updateData.lastSighted);
  }

  const entity = await prisma.entity.update({
    where: { id },
    data: updateData,
  });

  const parsedEntity = {
    ...entity,
    abilities: JSON.parse(entity.abilities),
    weaknesses: JSON.parse(entity.weaknesses),
  };

  res.json(parsedEntity);
};

export const deleteEntity = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.entity.delete({
    where: { id },
  });

  res.json({ message: 'Entity deleted successfully' });
};
