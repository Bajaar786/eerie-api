import axios from 'axios';
import type { Entity, Incident, Location, EntityStats, SearchFilters, AuthResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  register: (email: string, username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, username, password }),
};

// Entities
export const entityAPI = {
  getAll: () => api.get<Entity[]>('/entities'),
  getById: (id: string) => api.get<Entity>(`/entities/${id}`),
  search: (filters: SearchFilters) => api.get<Entity[]>('/entities/search', { params: filters }),
  getStats: () => api.get<EntityStats>('/entities/stats'),
  getIncidents: (id: string) => api.get<Incident[]>(`/entities/${id}/incidents`),
  getLocations: (id: string) => api.get<Location[]>(`/entities/${id}/locations`),
  create: (data: Partial<Entity>) => api.post<Entity>('/entities', data),
  update: (id: string, data: Partial<Entity>) => api.put<Entity>(`/entities/${id}`, data),
  delete: (id: string) => api.delete(`/entities/${id}`),
  calculateCompatibility: (entity1Id: string, entity2Id: string) =>
    api.post('/entities/compatibility', { entity1Id, entity2Id }),
};

// Incidents
export const incidentAPI = {
  getAll: (params?: any) => api.get<Incident[]>('/incidents', { params }),
  getById: (id: string) => api.get<Incident>(`/incidents/${id}`),
  create: (data: Partial<Incident>) => api.post<Incident>('/incidents', data),
  update: (id: string, data: Partial<Incident>) => api.put<Incident>(`/incidents/${id}`, data),
  verify: (id: string, verified: boolean, status: string) =>
    api.patch(`/incidents/${id}/verify`, { verified, status }),
  delete: (id: string) => api.delete(`/incidents/${id}`),
};

// Locations
export const locationAPI = {
  getAll: (params?: any) => api.get<Location[]>('/locations', { params }),
  getById: (id: string) => api.get<Location>(`/locations/${id}`),
  getEntities: (id: string) => api.get(`/locations/${id}/entities`),
  getIncidents: (id: string) => api.get<Incident[]>(`/locations/${id}/incidents`),
  create: (data: Partial<Location>) => api.post<Location>('/locations', data),
  update: (id: string, data: Partial<Location>) => api.put<Location>(`/locations/${id}`, data),
  delete: (id: string) => api.delete(`/locations/${id}`),
};

export default api;
