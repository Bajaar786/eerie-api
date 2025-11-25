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

export interface Entity {
  id: string;
  name: string;
  classification: EntityClassification;
  threatLevel: number;
  description: string;
  abilities: string[];
  weaknesses: string[];
  firstSighted: string | null;
  lastSighted: string | null;
  status: EntityStatus;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  incidents?: Incident[];
  locations?: EntityLocation[];
}

export interface Location {
  id: string;
  name: string;
  address: string | null;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  date: string;
  severity: number;
  witnesses: number;
  verified: boolean;
  evidence: string[];
  status: IncidentStatus;
  entityId: string;
  locationId: string;
  reportedById: string;
  entity?: Entity;
  location?: Location;
  reportedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface EntityLocation {
  id: string;
  frequency: string;
  lastSeen: string | null;
  entityId: string;
  locationId: string;
  entity?: Entity;
  location?: Location;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EntityStats {
  total: number;
  byClassification: Array<{ classification: string; _count: number }>;
  byStatus: Array<{ status: string; _count: number }>;
  averageThreatLevel: number;
  mostDangerous: Entity[];
}

export interface SearchFilters {
  classification?: EntityClassification;
  minThreatLevel?: number;
  maxThreatLevel?: number;
  status?: EntityStatus;
  location?: string;
  search?: string;
}
