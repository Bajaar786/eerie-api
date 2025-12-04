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
  credibilityScore: number;
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
  reputationScore: number;
  bio?: string;
  createdAt: string;
}

export interface EntitySuggestion {
  id: string;
  name: string;
  classification: EntityClassification;
  threatLevel: number;
  description: string;
  abilities: string[];
  weaknesses: string[];
  firstSighted: string | null;
  lastSighted: string | null;
  imageUrl: string | null;
  sourceCitation: string;
  status: SuggestionStatus;
  reviewComment: string | null;
  reviewedAt: string | null;
  submittedById: string;
  submittedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentVote {
  id: string;
  voteType: VoteType;
  incidentId: string;
  userId: string;
  createdAt: string;
}

export interface ContributionLog {
  id: string;
  actionType: string;
  pointsEarned: number;
  description: string;
  createdAt: string;
}

export interface UserProfile extends User {
  _count: {
    incidents: number;
    entitySuggestions: number;
    incidentVotes: number;
  };
}

export interface UserStats {
  reputationScore: number;
  totalSuggestions: number;
  approvedSuggestions: number;
  totalIncidents: number;
  totalVotes: number;
  totalContributions: number;
  totalPointsEarned: number;
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
