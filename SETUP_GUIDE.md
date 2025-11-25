# 🚀 Eerie API - Complete Setup Guide

This guide will walk you through setting up the complete Eerie API application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)
- A code editor (VS Code recommended)

## 🎯 Step-by-Step Setup

### Step 1: Project Setup

```bash
# Navigate to project directory
cd eerie-api

# Verify Node.js installation
node --version  # Should be 18+
npm --version
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database (creates SQLite DB, runs migrations, seeds data)
npm run db:setup

# Verify database
node verify-db.js
```

**Expected Output:**
```
🔍 Verifying Eerie API Database...

📊 Database Statistics:
   Users: 2
   Entities: 15
   Locations: 5
   Incidents: 3

✅ Database verification complete!
```

### Step 3: Start Backend Server

```bash
# Still in backend directory
npm run dev
```

**Expected Output:**
```
🌙 Eerie API server running on port 3000
📍 Health check: http://localhost:3000/health
👻 Entities: http://localhost:3000/api/entities
```

**Keep this terminal running!**

### Step 4: Frontend Setup (New Terminal)

```bash
# Open a NEW terminal window
cd eerie-api/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 2137 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running too!**

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health

## 🧪 Testing the Setup

### Test Backend API

In a new terminal:

```bash
cd backend
node test-api.js
```

This will run comprehensive API tests and should show:
```
✅ All tests completed successfully!
```

### Test Frontend

1. Open http://localhost:5173 in your browser
2. You should see the Eerie API dashboard
3. Click "Login" and use demo credentials:
   - Email: `admin@eerie-api.com`
   - Password: `admin123`

## 🎮 Quick Tour

### 1. Dashboard (Home)
- View entity statistics
- See classification breakdown
- Check recent incidents
- View most dangerous entities

### 2. Entity Browser
- Click "Entities" in navigation
- Use search sidebar to filter:
  - Try filtering by "Cryptid"
  - Set threat level 5-10
  - Search for "Mothman"
- Toggle between grid and list views
- Click any entity to see details

### 3. Report Incident
- Click "Report" in navigation
- Fill out the multi-step form:
  1. Enter incident details
  2. Select an entity
  3. Choose a location
  4. Review and submit
- Must be logged in!

### 4. Location Map
- Click "Map" in navigation
- View all paranormal hotspots
- Click locations for details
- See coordinates

## 🔐 Demo Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@eerie-api.com | admin123 | Full access |
| Investigator | investigator@eerie-api.com | investigator123 | Create/update entities |

## 📊 Database Contents

After setup, your database includes:

**15 Entities:**
- 3 Apparitions (Lady in White, Shadow Person, Hatman)
- 4 Cryptids (Mothman, Nessie, The Rake, Chupacabra)
- 3 Demonic (Wendigo, Bloody Mary, Black Eyed Child)
- 2 Extraterrestrial (Grey Visitor, Grinning Man)
- 2 Undead (Yurei, The Nurse)
- 1 Other (The Smiling Man)

**5 Locations:**
- Waverly Hills Sanatorium (USA)
- Aokigahara Forest (Japan)
- Point Pleasant (USA)
- Loch Ness (Scotland)
- Stanley Hotel (USA)

**3 Sample Incidents:**
- Lady in White sighting
- Mothman encounter
- Nessie surface breach

## 🛠️ Useful Commands

### Backend Commands

```bash
cd backend

# Development
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm start                # Run production server

# Database
npm run db:setup         # Setup database
npm run db:reset         # Reset database (WARNING: deletes data)
npx prisma studio        # Open database GUI
node verify-db.js        # Verify database contents
node test-api.js         # Run API tests

# Prisma
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create migration
npx prisma format        # Format schema
```

### Frontend Commands

```bash
cd frontend

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 🐛 Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=3001
```

**Database errors:**
```bash
cd backend
npm run db:reset
npm run db:setup
```

**Module not found:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port 5173 already in use:**
Edit `frontend/vite.config.ts`:
```typescript
server: { port: 5174 }
```

**API connection errors:**
1. Ensure backend is running on port 3000
2. Check `frontend/vite.config.ts` proxy settings
3. Verify CORS settings in backend

**Build errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Common Issues

**"Cannot find module '@prisma/client'":**
```bash
cd backend
npx prisma generate
```

**"EADDRINUSE" error:**
- Another process is using the port
- Kill the process or change the port

**TypeScript errors:**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npx tsc --noEmit
```

## 📱 Mobile Testing

The frontend is fully responsive. Test on mobile:

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address
   ```

2. Start frontend with host flag:
   ```bash
   cd frontend
   npm run dev -- --host
   ```

3. Access from mobile:
   ```
   http://YOUR_IP:5173
   ```

## 🎨 Customization

### Change Theme Colors

Edit `frontend/src/styles/index.css`:
```css
:root {
  --primary: #2D1B69;      /* Your color */
  --accent: #00FF88;       /* Your color */
  --background: #0F0F23;   /* Your color */
}
```

### Add New Entity Classification

1. Update backend types: `backend/src/types/index.ts`
2. Update frontend types: `frontend/src/types/index.ts`
3. Add badge style in `frontend/src/styles/index.css`

### Modify Database Schema

1. Edit `backend/prisma/schema.prisma`
2. Run migration:
   ```bash
   cd backend
   npx prisma migrate dev --name your_change_name
   ```

## 🚀 Next Steps

1. **Explore the API**: Check `backend/API_DOCUMENTATION.md`
2. **Add Your Data**: Use Prisma Studio to add entities
3. **Customize**: Change colors, add features
4. **Deploy**: See deployment guides in READMEs
5. **Integrate Mapbox**: Add token for interactive maps

## 📚 Additional Resources

- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **API Docs**: `backend/API_DOCUMENTATION.md`
- **Quick Start**: `backend/QUICKSTART.md`

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed
- [ ] Database created and seeded
- [ ] Backend server running on port 3000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can login with demo account
- [ ] API tests pass
- [ ] Database verified

## 🎉 Success!

If you've completed all steps, you should have:
- ✅ Backend API running with 15 entities
- ✅ Frontend application with full UI
- ✅ Authentication working
- ✅ Database populated with sample data
- ✅ All features functional

**Happy hunting! 👻🔍**

---

Need help? Check the troubleshooting section or review the documentation in `/docs`.
