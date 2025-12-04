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

export type UserRole = 'VISITOR' | 'CONTRIBUTOR' | 'MODERATOR' | 'ADMIN';

export type SuggestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type VoteType = 'CREDIBLE' | 'NOT_CREDIBLE';

export type ActionType = 'ENTITY_SUGGESTED' | 'ENTITY_APPROVED' | 'INCIDENT_REPORTED' | 'VOTE_CAST';
