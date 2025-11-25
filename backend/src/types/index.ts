import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface EntitySearchQuery {
  classification?: string;
  minThreatLevel?: number;
  maxThreatLevel?: number;
  status?: string;
  location?: string;
  search?: string;
}

export interface CompatibilityResult {
  entity1: string;
  entity2: string;
  compatibilityScore: number;
  analysis: string;
  warnings: string[];
}

export type EntityClassification = 
  | 'Apparition' 
  | 'Cryptid' 
  | 'Demonic' 
  | 'Extraterrestrial' 
  | 'Undead' 
  | 'Other';

export type EntityStatus = 
  | 'ACTIVE' 
  | 'DORMANT' 
  | 'CONTAINED' 
  | 'NEUTRALIZED' 
  | 'UNKNOWN';

export type IncidentStatus = 
  | 'REPORTED' 
  | 'INVESTIGATING' 
  | 'CONFIRMED' 
  | 'RESOLVED' 
  | 'DEBUNKED';

export type UserRole = 'USER' | 'INVESTIGATOR' | 'ADMIN';
