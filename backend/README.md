# Eerie API - Backend

A RESTful API for managing a supernatural entity database with incident reporting, location tracking, and entity compatibility analysis.

## 🎃 Features

- **Entity Management**: CRUD operations for supernatural entities with classifications, threat levels, abilities, and weaknesses
- **Advanced Search**: Filter entities by classification, threat level, location, and keywords
- **Incident Reporting**: Report and track supernatural encounters with evidence
- **Location Tracking**: Geographic locations with entity frequency data
- **Compatibility Calculator**: Analyze interactions between different entities
- **Authentication**: JWT-based auth with role-based access control
- **Statistics**: Entity analytics and threat assessments

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database (SQLite)
npm run db:setup

# Start development server
npm run dev

# Test the API
node test-api.js
```

Server runs at: `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Prisma client configuration
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── entityController.ts  # Entity CRUD & search
│   │   ├── incidentController.ts # Incident management
│   │   └── locationController.ts # Location management
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Error handling
│   │   └── requestLogger.ts     # Request logging
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── entityRoutes.ts
│   │   ├── incidentRoutes.ts
│   │   └── locationRoutes.ts
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── index.ts                 # Express app entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Seed data
│   └── dev.db                   # SQLite database
├── .env                         # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Entities
- `GET /api/entities` - Get all entities
- `GET /api/entities/:id` - Get entity by ID
- `GET /api/entities/search` - Advanced search
- `GET /api/entities/stats` - Get statistics
- `GET /api/entities/:id/incidents` - Get entity incidents
- `GET /api/entities/:id/locations` - Get entity locations
- `POST /api/entities/compatibility` - Calculate compatibility
- `POST /api/entities` - Create entity (INVESTIGATOR+)
- `PUT /api/entities/:id` - Update entity (INVESTIGATOR+)
- `DELETE /api/entities/:id` - Delete entity (ADMIN)

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Report incident (authenticated)
- `PUT /api/incidents/:id` - Update incident (INVESTIGATOR+)
- `PATCH /api/incidents/:id/verify` - Verify incident (INVESTIGATOR+)
- `DELETE /api/incidents/:id` - Delete incident (ADMIN)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `GET /api/locations/:id/entities` - Get location entities
- `GET /api/locations/:id/incidents` - Get location incidents
- `POST /api/locations` - Create location (INVESTIGATOR+)
- `PUT /api/locations/:id` - Update location (INVESTIGATOR+)
- `DELETE /api/locations/:id` - Delete location (ADMIN)

## 🔐 Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your_token>
```

### User Roles
- **USER**: View entities, report incidents
- **INVESTIGATOR**: Create/update entities, verify incidents
- **ADMIN**: Full access including delete operations

## 🗄️ Database

**Technology**: SQLite (via Prisma ORM)

**Models**:
- User (authentication)
- Entity (supernatural entities)
- Location (geographic locations)
- Incident (reported encounters)
- EntityLocation (many-to-many relationship)

**Entity Classifications**:
- Apparition
- Cryptid
- Demonic
- Extraterrestrial
- Undead
- Other

## 📚 Documentation

- **Quick Start**: `QUICKSTART.md`
- **API Reference**: `API_DOCUMENTATION.md`
- **Database Setup**: `SETUP_WINDOWS.md`

## 🧪 Testing

```bash
# Run comprehensive API tests
node test-api.js

# Verify database contents
node verify-db.js

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🛠️ Development

```bash
# Development mode (auto-reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start

# Database commands
npm run db:setup    # Setup database
npm run db:reset    # Reset database
npx prisma studio   # Open database GUI
```

## 🌍 Environment Variables

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 📦 Dependencies

**Core**:
- Express.js - Web framework
- Prisma - ORM
- TypeScript - Type safety
- SQLite - Database

**Authentication**:
- jsonwebtoken - JWT tokens
- bcrypt - Password hashing

**Utilities**:
- cors - CORS support
- dotenv - Environment variables

## 🎯 Example Usage

### Search for High-Threat Cryptids
```bash
curl "http://localhost:3000/api/entities/search?classification=Cryptid&minThreatLevel=7"
```

### Calculate Entity Compatibility
```bash
curl -X POST http://localhost:3000/api/entities/compatibility \
  -H "Content-Type: application/json" \
  -d '{"entity1Id":"id1","entity2Id":"id2"}'
```

### Report an Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Strange Sighting",
    "description": "Detailed description",
    "severity": 7,
    "entityId": "entity_id",
    "locationId": "location_id"
  }'
```

## 🤝 Contributing

1. Follow RESTful conventions
2. Use TypeScript for type safety
3. Add error handling with AppError
4. Use asyncHandler for async routes
5. Document new endpoints

## 📄 License

MIT

---

Built with 👻 for supernatural investigators worldwide
