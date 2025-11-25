# 🌙 Eerie API - Supernatural Entity Database

A full-stack application for documenting and tracking supernatural entities, incidents, and paranormal hotspots worldwide. Built with Express.js, React, TypeScript, and SQLite.

![Tech Stack](https://img.shields.io/badge/Stack-Express%20%7C%20React%20%7C%20TypeScript%20%7C%20SQLite-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

## 🎃 Features

### Backend API
- **Entity Management**: CRUD operations for supernatural entities
- **Advanced Search**: Filter by classification, threat level, location, status
- **Entity Compatibility Calculator**: Analyze interaction risks between entities
- **Incident Reporting**: Document encounters with evidence tracking
- **Location Tracking**: Geographic hotspots with coordinates
- **Authentication**: JWT-based auth with role-based access control
- **Statistics**: Entity analytics and threat assessments

### Frontend Application
- **Entity Browser**: Grid/list views with advanced filtering
- **Interactive Dashboard**: Statistics, charts, and recent activity
- **Incident Report Form**: Multi-step workflow for reporting encounters
- **Location Map**: Interactive hotspot visualization (Mapbox ready)
- **Entity Details**: Expandable modal with full information
- **Responsive Design**: Mobile-friendly spooky dark theme
- **Real-time Search**: Instant filtering and search results

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd eerie-api

# Setup Backend
cd backend
npm install
npm run db:setup
npm run dev

# Setup Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

## 📁 Project Structure

```
eerie-api/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database config
│   │   └── types/          # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Seed data
│   │   └── dev.db          # SQLite database
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API client
│   │   └── styles/        # CSS styles
│   └── package.json
├── database/              # Database scripts
├── docs/                  # Documentation
└── README.md
```

## 🎯 Entity Classifications

- **Apparition**: Ghosts, spirits, spectral entities
- **Cryptid**: Undiscovered creatures (Mothman, Nessie, etc.)
- **Demonic**: Malevolent supernatural beings
- **Extraterrestrial**: Alien entities and visitors
- **Undead**: Reanimated or cursed beings
- **Other**: Unclassified phenomena

## 🔐 Authentication

**Demo Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eerie-api.com | admin123 |
| Investigator | investigator@eerie-api.com | investigator123 |

**User Roles:**
- **USER**: View entities, report incidents
- **INVESTIGATOR**: Create/update entities, verify incidents
- **ADMIN**: Full access including delete operations

## 📊 Database

**Technology**: SQLite with Prisma ORM

**Seeded Data:**
- 15 supernatural entities across all classifications
- 5 famous paranormal locations
- 3 sample incidents
- 2 user accounts

**Models:**
- User (authentication)
- Entity (supernatural entities)
- Location (geographic locations)
- Incident (reported encounters)
- EntityLocation (many-to-many relationship)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Entities
- `GET /api/entities` - Get all entities
- `GET /api/entities/search` - Advanced search
- `GET /api/entities/stats` - Get statistics
- `GET /api/entities/:id` - Get entity by ID
- `POST /api/entities/compatibility` - Calculate compatibility
- `POST /api/entities` - Create entity (INVESTIGATOR+)
- `PUT /api/entities/:id` - Update entity (INVESTIGATOR+)
- `DELETE /api/entities/:id` - Delete entity (ADMIN)

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Report incident (authenticated)
- `PATCH /api/incidents/:id/verify` - Verify incident (INVESTIGATOR+)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `GET /api/locations/:id/entities` - Get location entities

See `backend/API_DOCUMENTATION.md` for full API reference.

## 🎨 Design System

**Colors:**
- Primary: `#2D1B69` (deep purple)
- Accent: `#00FF88` (electric green)
- Background: `#0F0F23` (dark blue-black)
- Surface: `#1A1A2E`
- Text: `#FFFFFF` / `#A0A0C0`

**Typography:**
- System fonts for optimal performance
- Responsive font sizes
- Clear hierarchy

## 🧪 Testing

### Backend
```bash
cd backend
node test-api.js        # Run API tests
node verify-db.js       # Verify database
npx prisma studio       # Open database GUI
```

### Frontend
```bash
cd frontend
npm run dev             # Development mode
npm run build           # Production build
```

## 📚 Documentation

- **Backend**: `backend/README.md`
- **Frontend**: `frontend/README.md`
- **API Reference**: `backend/API_DOCUMENTATION.md`
- **Quick Start**: `backend/QUICKSTART.md`
- **Database Setup**: `backend/SETUP_WINDOWS.md`

## 🛠️ Tech Stack

### Backend
- Express.js - Web framework
- Prisma - ORM
- SQLite - Database
- TypeScript - Type safety
- JWT - Authentication
- Bcrypt - Password hashing

### Frontend
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- React Router - Routing
- Axios - HTTP client
- Lucide React - Icons
- Date-fns - Date formatting

## 🗺️ Mapbox Integration

The frontend is ready for Mapbox GL JS integration:

1. Get a token from https://mapbox.com
2. Add to environment variables
3. Uncomment Mapbox components in LocationMap.tsx

## 🚀 Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

Deploy to:
- Heroku
- Railway
- Render
- DigitalOcean

### Frontend
```bash
cd frontend
npm run build
```

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=your_token_here
```

## 📈 Features Roadmap

- [ ] Real-time notifications
- [ ] Entity comparison tool
- [ ] Advanced analytics dashboard
- [ ] Export reports to PDF
- [ ] Mobile app (React Native)
- [ ] GraphQL API
- [ ] WebSocket for live updates
- [ ] Image upload for entities
- [ ] Social features (comments, ratings)

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 3000 is available
- Verify database exists: `backend/prisma/dev.db`
- Run `npm run db:setup` to recreate database

**Frontend won't start:**
- Check if port 5173 is available
- Clear node_modules and reinstall
- Verify backend is running

**API connection errors:**
- Check CORS settings in backend
- Verify proxy configuration in vite.config.ts
- Ensure both servers are running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Inspired by real paranormal investigation databases
- Entity data based on folklore and urban legends
- Built for educational purposes

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review API documentation

---

**Built with 👻 for supernatural investigators worldwide**

*"Documenting the unexplained since 2024"*
