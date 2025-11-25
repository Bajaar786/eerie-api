# Eerie API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### User Roles
- **USER**: Can view entities and report incidents
- **INVESTIGATOR**: Can create/update entities and verify incidents
- **ADMIN**: Full access including delete operations

---

## Auth Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "USER"
  },
  "token": "jwt_token"
}
```

---

## Entity Endpoints

### Get All Entities
```http
GET /api/entities
```

### Get Entity by ID
```http
GET /api/entities/:id
```

### Search Entities (Advanced)
```http
GET /api/entities/search?classification=Cryptid&minThreatLevel=5&maxThreatLevel=10&status=ACTIVE&location=Scotland&search=Nessie
```

**Query Parameters:**
- `classification`: Apparition, Cryptid, Demonic, Extraterrestrial, Undead, Other
- `minThreatLevel`: 1-10
- `maxThreatLevel`: 1-10
- `status`: ACTIVE, DORMANT, CONTAINED, NEUTRALIZED, UNKNOWN
- `location`: Search in location name, city, or country
- `search`: Search in entity name or description

### Get Entity Statistics
```http
GET /api/entities/stats
```

**Response:**
```json
{
  "total": 15,
  "byClassification": [
    { "classification": "Cryptid", "_count": 5 }
  ],
  "byStatus": [
    { "status": "ACTIVE", "_count": 14 }
  ],
  "averageThreatLevel": 5.6,
  "mostDangerous": [...]
}
```

### Get Entity Incidents
```http
GET /api/entities/:id/incidents
```

### Get Entity Locations
```http
GET /api/entities/:id/locations
```

### Calculate Entity Compatibility
```http
POST /api/entities/compatibility
Content-Type: application/json

{
  "entity1Id": "uuid1",
  "entity2Id": "uuid2"
}
```

**Response:**
```json
{
  "entity1": "Mothman",
  "entity2": "Wendigo",
  "compatibilityScore": 35,
  "analysis": "Low compatibility - High risk of dangerous interactions",
  "warnings": [
    "Multiple demonic entities in proximity is extremely dangerous"
  ]
}
```

### Create Entity (INVESTIGATOR/ADMIN)
```http
POST /api/entities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Entity",
  "classification": "Cryptid",
  "threatLevel": 7,
  "description": "Description here",
  "abilities": ["Ability 1", "Ability 2"],
  "weaknesses": ["Weakness 1"],
  "status": "ACTIVE"
}
```

### Update Entity (INVESTIGATOR/ADMIN)
```http
PUT /api/entities/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "threatLevel": 8,
  "status": "CONTAINED"
}
```

### Delete Entity (ADMIN)
```http
DELETE /api/entities/:id
Authorization: Bearer <token>
```

---

## Incident Endpoints

### Get All Incidents
```http
GET /api/incidents?status=CONFIRMED&entityId=uuid&verified=true
```

**Query Parameters:**
- `status`: REPORTED, INVESTIGATING, CONFIRMED, RESOLVED, DEBUNKED
- `entityId`: Filter by entity
- `locationId`: Filter by location
- `verified`: true/false

### Get Incident by ID
```http
GET /api/incidents/:id
```

### Create Incident (Authenticated)
```http
POST /api/incidents
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Incident Title",
  "description": "Detailed description",
  "date": "2024-11-24T20:00:00Z",
  "severity": 7,
  "witnesses": 3,
  "evidence": ["photo1.jpg", "video1.mp4"],
  "entityId": "uuid",
  "locationId": "uuid"
}
```

### Update Incident (INVESTIGATOR/ADMIN)
```http
PUT /api/incidents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CONFIRMED",
  "severity": 8
}
```

### Verify Incident (INVESTIGATOR/ADMIN)
```http
PATCH /api/incidents/:id/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "verified": true,
  "status": "CONFIRMED"
}
```

### Delete Incident (ADMIN)
```http
DELETE /api/incidents/:id
Authorization: Bearer <token>
```

---

## Location Endpoints

### Get All Locations
```http
GET /api/locations?country=USA&city=Louisville
```

### Get Location by ID
```http
GET /api/locations/:id
```

### Get Location Entities
```http
GET /api/locations/:id/entities
```

### Get Location Incidents
```http
GET /api/locations/:id/incidents
```

### Create Location (INVESTIGATOR/ADMIN)
```http
POST /api/locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Location Name",
  "address": "123 Street",
  "city": "City",
  "state": "State",
  "country": "Country",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Description"
}
```

### Update Location (INVESTIGATOR/ADMIN)
```http
PUT /api/locations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

### Delete Location (ADMIN)
```http
DELETE /api/locations/:id
Authorization: Bearer <token>
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "status": 400
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Example Usage

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Search for Cryptids
```bash
curl "http://localhost:3000/api/entities/search?classification=Cryptid&minThreatLevel=5"
```

### 3. Report an Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Strange Sighting",
    "description": "Saw something unusual",
    "severity": 5,
    "witnesses": 2,
    "entityId": "ENTITY_UUID",
    "locationId": "LOCATION_UUID"
  }'
```

### 4. Check Entity Compatibility
```bash
curl -X POST http://localhost:3000/api/entities/compatibility \
  -H "Content-Type: application/json" \
  -d '{
    "entity1Id": "UUID1",
    "entity2Id": "UUID2"
  }'
```
