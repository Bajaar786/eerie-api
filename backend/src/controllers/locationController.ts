import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllLocations = async (req: Request, res: Response) => {
  const { country, city } = req.query;

  const where: any = {};
  if (country) where.country = { contains: country as string };
  if (city) where.city = { contains: city as string };

  const locations = await prisma.location.findMany({
    where,
    include: {
      _count: {
        select: {
          entities: true,
          incidents: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json(locations);
};

export const getLocationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      entities: {
        include: {
          entity: true,
        },
      },
      incidents: {
        include: {
          entity: true,
        },
      },
    },
  });

  if (!location) {
    throw new AppError('Location not found', 404);
  }

  res.json(location);
};

export const getLocationEntities = async (req: Request, res: Response) => {
  const { id } = req.params;

  const entityLocations = await prisma.entityLocation.findMany({
    where: { locationId: id },
    include: {
      entity: true,
    },
  });

  const parsedData = entityLocations.map(el => ({
    ...el,
    entity: {
      ...el.entity,
      abilities: JSON.parse(el.entity.abilities),
      weaknesses: JSON.parse(el.entity.weaknesses),
    },
  }));

  res.json(parsedData);
};

export const getLocationIncidents = async (req: Request, res: Response) => {
  const { id } = req.params;

  const incidents = await prisma.incident.findMany({
    where: { locationId: id },
    include: {
      entity: true,
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
    entity: {
      ...incident.entity,
      abilities: JSON.parse(incident.entity.abilities),
      weaknesses: JSON.parse(incident.entity.weaknesses),
    },
  }));

  res.json(parsedIncidents);
};

export const createLocation = async (req: Request, res: Response) => {
  const {
    name,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    description,
  } = req.body;

  if (!name || !city || !country || latitude === undefined || longitude === undefined) {
    throw new AppError('Name, city, country, latitude, and longitude are required', 400);
  }

  const location = await prisma.location.create({
    data: {
      name,
      address,
      city,
      state,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description,
    },
  });

  res.status(201).json(location);
};

export const updateLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
  if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);

  const location = await prisma.location.update({
    where: { id },
    data: updateData,
  });

  res.json(location);
};

export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.location.delete({
    where: { id },
  });

  res.json({ message: 'Location deleted successfully' });
};
