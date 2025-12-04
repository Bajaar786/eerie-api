# 🌙 Eerie API - Quick Reference Card

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run db:setup
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database GUI: `npx prisma studio` (in backend folder)

## 🔐 Demo Accounts

| Email | Password | Role | Reputation |
|-------|----------|------|------------|
| admin@eerie-api.com | admin123 | ADMIN | 1000 |
| moderator@eerie-api.com | moderator123 | MODERATOR | 500 |
| contributor@eerie-api.com | contributor123 | CONTRIBUTOR | 250 |

## 📊 Database Stats

- **15 Entities** (Apparition, Cryptid, Demonic, Extraterrestrial, Undead, Other)
- **5 Locations** (Waverly Hills, Aokigahara, Point Pleasant, Loch Ness, Stanley Hotel)
- **3 Incidents** (Sample reports)
- **2 Users** (Admin, Investigator)

## 🔌 Key API Endpoints

```bash
# Health Check
GET http://localhost:3000/health

# Get All Entities
GET http://localhost:3000/api/entities

# Search Entities
GET http://localhost:3000/api/entities/search?classification=Cryptid&minThreatLevel=5

# Get Statistics
GET http://localhost:3000/api/entities/stats

# Login
POST http://localhost:3000/api/auth/login
Body: { "email": "admin@eerie-api.com", "password": "admin123" }

# Submit Entity Suggestion (authenticated)
POST http://localhost:3000/api/suggestions
Body: { "name": "Entity Name", "classification": "Cryptid", ... }

# Vote on Incident (authenticated)
POST http://localhost:3000/api/votes/incidents/:incidentId
Body: { "voteType": "CREDIBLE" }

# Get User Stats (authenticated)
GET http://localhost:3000/api/users/me/stats

# Get Leaderboard
GET http://localhost:3000/api/users/leaderboard
```

## 🛠️ Useful Commands

### Backend
```bash
cd backend
npm run dev              # Start dev server
npm run db:setup         # Setup database
npm run db:reset         # Reset database
node test-api.js         # Run API tests
node verify-db.js        # Verify database
npx prisma studio        # Open database GUI
```

### Frontend
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
```

## 📁 Project Structure

```
eerie-api/
├── backend/             # Express.js API (Port 3000)
│   ├── src/            # TypeScript source
│   ├── prisma/         # Database schema & seed
│   └── .env            # Environment variables
├── frontend/           # React app (Port 5173)
│   ├── src/           # React components
│   └── vite.config.ts # Vite configuration
└── docs/              # Documentation
```

## 🎨 Design System

```css
--primary: #2D1B69      /* Deep purple */
--accent: #00FF88       /* Electric green */
--background: #0F0F23   /* Dark blue-black */
--text-primary: #FFFFFF
--text-secondary: #A0A0C0
```

## 🎯 Entity Classifications

- 🌫️ **Apparition** - Ghosts, spirits
- 🦎 **Cryptid** - Mothman, Nessie, etc.
- 😈 **Demonic** - Malevolent beings
- 👽 **Extraterrestrial** - Aliens
- 💀 **Undead** - Reanimated beings
- ❓ **Other** - Unclassified

## 🔥 Threat Levels

- **1-3**: Low threat (green)
- **4-7**: Moderate threat (yellow)
- **8-10**: High threat (red)

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats |
| `/entities` | Browse & search entities |
| `/entities/:id` | Entity details |
| `/suggest` | Suggest new entity (auth required) |
| `/moderation` | Review suggestions (MODERATOR+) |
| `/report` | Report incident (auth required) |
| `/map` | Location hotspots |
| `/login` | Authentication |

## 🧪 Testing

```bash
# Backend API Tests
cd backend
node test-api.js

# Database Verification
node verify-db.js

# Frontend (manual)
Open http://localhost:5173
Login with demo account
Test all features
```

## 🐛 Quick Fixes

**Port in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database issues:**
```bash
cd backend
npm run db:reset
npm run db:setup
```

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- `README.md` - Main project overview
- `SETUP_GUIDE.md` - Complete setup instructions
- `PROJECT_SUMMARY.md` - Detailed project summary
- `backend/API_DOCUMENTATION.md` - Full API reference
- `backend/QUICKSTART.md` - Backend quick start
- `frontend/README.md` - Frontend documentation

## 🎮 Feature Checklist

- ✅ Entity CRUD operations
- ✅ Advanced search & filtering
- ✅ Entity compatibility calculator
- ✅ Incident reporting (multi-step)
- ✅ Location management
- ✅ Statistics dashboard
- ✅ Authentication & authorization
- ✅ **Community contributions**
- ✅ **Entity suggestions system**
- ✅ **Moderation dashboard**
- ✅ **Incident voting & credibility**
- ✅ **Reputation points system**
- ✅ **User profiles & leaderboard**
- ✅ Responsive design
- ✅ Dark theme
- ✅ Real-time filtering

## 🔒 Security

- JWT authentication
- Bcrypt password hashing
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation

## 📊 Tech Stack

**Backend:**
- Express.js + TypeScript
- Prisma + SQLite
- JWT + Bcrypt

**Frontend:**
- React 18 + TypeScript
- Vite + React Router
- Axios + Lucide Icons

## 🎉 Quick Demo Flow

1. Start both servers
2. Open http://localhost:5173
3. Click "Login"
4. Use: admin@eerie-api.com / admin123
5. View Dashboard statistics
6. Click "Entities" → Filter by "Cryptid"
7. Click any entity for details
8. Click "Suggest" → Submit new entity
9. Click "Moderate" → Review suggestions (MODERATOR+)
10. Vote on incident credibility
11. Check user reputation & leaderboard
12. Click "Report" → Fill incident form
13. Click "Map" → View locations

## 💡 Pro Tips

- Use Prisma Studio for database management
- Check browser console for errors
- Use React DevTools for debugging
- Test API with `test-api.js` script
- Keep both terminals running
- Check documentation for details

---

**Need Help?** Check `SETUP_GUIDE.md` or documentation files.

**Happy Hunting! 👻🔍**
