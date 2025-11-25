import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const getAllIncidents = async (req: Request, res: Response) => {
  const { status, entityId, locationId, verified } = req.query;

  const where: any = {};
  if (status) where.status = status;
  if (entityId) where.entityId = entityId;
  if (locationId) where.locationId = locationId;
  if (verified !== undefined) where.verified = verified === 'true';

  const incidents = await prisma.incident.findMany({
    where,
    include: {
      entity: {
        select: {
          id: true,
          name: true,
          classification: true,
          threatLevel: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
        },
      },
      reportedBy: {
        select: {
          id: true,
          username: true,
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

export const getIncidentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      entity: true,
      location: true,
      reportedBy: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  const parsedIncident = {
    ...incident,
    evidence: JSON.parse(incident.evidence),
    entity: {
      ...incident.entity,
      abilities: JSON.parse(incident.entity.abilities),
      weaknesses: JSON.parse(incident.entity.weaknesses),
    },
  };

  res.json(parsedIncident);
};

export const createIncident = async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    date,
    severity,
    witnesses,
    evidence,
    entityId,
    locationId,
  } = req.body;

  if (!title || !description || !entityId || !locationId) {
    throw new AppError('Title, description, entity, and location are required', 400);
  }

  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const incident = await prisma.incident.create({
    data: {
      title,
      description,
      date: date ? new Date(date) : new Date(),
      severity: severity || 1,
      witnesses: witnesses || 0,
      evidence: JSON.stringify(evidence || []),
      status: 'REPORTED',
      verified: false,
      entityId,
      locationId,
      reportedById: req.user.id,
    },
    include: {
      entity: {
        select: {
          id: true,
          name: true,
          classification: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });

  const parsedIncident = {
    ...incident,
    evidence: JSON.parse(incident.evidence),
  };

  res.status(201).json(parsedIncident);
};

export const updateIncident = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  if (updateData.evidence) {
    updateData.evidence = JSON.stringify(updateData.evidence);
  }

  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }

  const incident = await prisma.incident.update({
    where: { id },
    data: updateData,
  });

  const parsedIncident = {
    ...incident,
    evidence: JSON.parse(incident.evidence),
  };

  res.json(parsedIncident);
};

export const verifyIncident = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { verified, status } = req.body;

  const incident = await prisma.incident.update({
    where: { id },
    data: {
      verified: verified !== undefined ? verified : true,
      status: status || 'CONFIRMED',
    },
  });

  const parsedIncident = {
    ...incident,
    evidence: JSON.parse(incident.evidence),
  };

  res.json(parsedIncident);
};

export const deleteIncident = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.incident.delete({
    where: { id },
  });

  res.json({ message: 'Incident deleted successfully' });
};
