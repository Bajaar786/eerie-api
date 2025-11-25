# Eerie API - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Create SQLite database
- Run migrations
- Seed with 15 entities, 5 locations, and sample data

### 3. Start the Server
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

### 4. Test the API
```bash
node test-api.js
```

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript to JavaScript
npm start            # Run production server
npm run db:setup     # Setup database (migrate + seed)
npm run db:reset     # Reset database (WARNING: deletes all data)
node verify-db.js    # Verify database contents
node test-api.js     # Run API tests
npx prisma studio    # Open database GUI
```

## 🔑 Default Users

**Admin Account:**
- Email: `admin@eerie-api.com`
- Password: `admin123`
- Role: ADMIN (full access)

**Investigator Account:**
- Email: `investigator@eerie-api.com`
- Password: `investigator123`
- Role: INVESTIGATOR (can create/update entities)

## 🧪 Quick API Tests

### Health Check
```bash
curl http://localhost:3000/health
```

### Get All Entities
```bash
curl http://localhost:3000/api/entities
```

### Search Cryptids
```bash
curl "http://localhost:3000/api/entities/search?classification=Cryptid"
```

### Get Statistics
```bash
curl http://localhost:3000/api/entities/stats
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@eerie-api.com\",\"password\":\"admin123\"}"
```

### Test Compatibility
```bash
curl -X POST http://localhost:3000/api/entities/compatibility \
  -H "Content-Type: application/json" \
  -d "{\"entity1Id\":\"ENTITY_ID_1\",\"entity2Id\":\"ENTITY_ID_2\"}"
```

## 📚 Documentation

- **API Documentation**: `API_DOCUMENTATION.md`
- **Database Setup**: `SETUP_WINDOWS.md`
- **Full API Reference**: See API_DOCUMENTATION.md

## 🎯 Key Features

✅ **Entity Management**
- CRUD operations for supernatural entities
- Advanced search with filters
- Classification by type (Apparition, Cryptid, Demonic, etc.)
- Threat level tracking (1-10)

✅ **Incident Reporting**
- Report supernatural encounters
- Link to entities and locations
- Evidence tracking
- Verification system

✅ **Location Tracking**
- Geographic coordinates
- Entity frequency tracking
- Incident history

✅ **Entity Compatibility Calculator**
- Analyze interactions between entities
- Risk assessment
- Compatibility scoring

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (USER, INVESTIGATOR, ADMIN)
- Protected endpoints

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID> /F
```

### Database issues
```bash
# Reset and recreate database
npm run db:reset
```

### TypeScript errors
```bash
# Rebuild
npm run build
```

## 📊 Database Contents

After seeding, you'll have:
- **15 Entities** across all classifications
  - 3 Apparitions (Lady in White, Shadow Person, Hatman)
  - 4 Cryptids (Mothman, Nessie, Rake, Chupacabra)
  - 3 Demonic (Wendigo, Bloody Mary, Black Eyed Child)
  - 2 Extraterrestrial (Grey Visitor, Grinning Man)
  - 2 Undead (Yurei, The Nurse)
  - 1 Other (Smiling Man)

- **5 Locations**
  - Waverly Hills Sanatorium (USA)
  - Aokigahara Forest (Japan)
  - Point Pleasant (USA)
  - Loch Ness (Scotland)
  - Stanley Hotel (USA)

- **3 Sample Incidents**
  - Lady in White sighting
  - Mothman encounter
  - Nessie surface breach

## 🌐 Next Steps

1. Explore the API with Prisma Studio: `npx prisma studio`
2. Test endpoints with the test script: `node test-api.js`
3. Read full API docs: `API_DOCUMENTATION.md`
4. Build your frontend application
5. Customize entities and add your own data

## 💡 Tips

- Use Prisma Studio for visual database management
- Check server logs for request details
- All dates are stored in ISO 8601 format
- Arrays (abilities, weaknesses, evidence) are stored as JSON strings
- Authentication token expires in 7 days

Happy hunting! 👻🔍
