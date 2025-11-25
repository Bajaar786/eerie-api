# Eerie API - Frontend

A React + TypeScript frontend for the Eerie API supernatural entity database with advanced search, interactive maps, and incident reporting.

## 🎨 Features

- **Entity Browser**: Grid/list views with advanced filtering
- **Search Sidebar**: Filter by classification, threat level, status, and location
- **Entity Details**: Expandable modal with abilities, weaknesses, and incidents
- **Dashboard**: Statistics, recent incidents, and most dangerous entities
- **Incident Reporting**: Multi-step form workflow for reporting encounters
- **Location Map**: Interactive location hotspots (Mapbox ready)
- **Authentication**: JWT-based login with role-based access
- **Responsive Design**: Mobile-friendly spooky dark theme

## 🎃 Design System

**Colors:**
- Primary: `#2D1B69` (deep purple)
- Accent: `#00FF88` (electric green)
- Background: `#0F0F23` (dark blue-black)
- Surface: `#1A1A2E`
- Text: `#FFFFFF` / `#A0A0C0` (secondary)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend runs at: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Main layout with navbar
│   │   ├── EntityCard.tsx       # Entity card component
│   │   ├── EntityModal.tsx      # Entity detail modal
│   │   └── SearchSidebar.tsx    # Advanced search filters
│   ├── pages/
│   │   ├── Dashboard.tsx        # Statistics dashboard
│   │   ├── EntityBrowser.tsx    # Entity search & browse
│   │   ├── EntityDetail.tsx     # Entity detail page
│   │   ├── IncidentReport.tsx   # Multi-step incident form
│   │   ├── LocationMap.tsx      # Location hotspots
│   │   └── Login.tsx            # Authentication
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth state management
│   ├── services/
│   │   └── api.ts               # API client
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── styles/
│   │   └── index.css            # Global styles
│   ├── App.tsx                  # App router
│   └── main.tsx                 # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3000/api` via Vite proxy.

**API Services:**
- `authAPI` - Login, register
- `entityAPI` - CRUD, search, stats, compatibility
- `incidentAPI` - Report, verify, manage incidents
- `locationAPI` - Locations and hotspots

## 🎯 Key Components

### Entity Browser
- Grid and list view modes
- Advanced search sidebar with filters:
  - Classification (Apparition, Cryptid, Demonic, etc.)
  - Threat level range (1-10)
  - Status (Active, Dormant, Contained, etc.)
  - Location search
  - Keyword search
- Real-time filtering
- Entity detail modal

### Dashboard
- Total entities count
- Average threat level
- Classification breakdown
- Most dangerous entities
- Recent incidents feed

### Incident Report
- Multi-step form workflow:
  1. Incident details (title, description, date, severity)
  2. Entity selection
  3. Location selection
  4. Review and submit
- Progress indicator
- Form validation

### Location Map
- Location cards with coordinates
- Detailed location information
- Mapbox integration ready (add token to enable)

## 🔐 Authentication

**Demo Accounts:**
- Admin: `admin@eerie-api.com` / `admin123`
- Investigator: `investigator@eerie-api.com` / `investigator123`

**User Roles:**
- USER: View entities, report incidents
- INVESTIGATOR: Create/update entities, verify incidents
- ADMIN: Full access

## 🗺️ Mapbox Integration

To enable interactive maps:

1. Get a Mapbox access token from https://mapbox.com
2. Add to your environment or component:
```typescript
const MAPBOX_TOKEN = 'your_token_here'
```

The LocationMap component is ready for Mapbox GL JS integration.

## 🎨 Styling

**Global Styles:** `src/styles/index.css`
- CSS custom properties for theming
- Utility classes (btn, card, badge, etc.)
- Responsive breakpoints
- Animations (fadeIn, slideIn, pulse)

**Component Styles:** Each component has its own CSS file
- Scoped styles
- Consistent spacing and colors
- Mobile-first responsive design

## 📱 Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Features:
- Collapsible navigation on mobile
- Stacked layouts for small screens
- Touch-friendly buttons and cards
- Optimized grid layouts

## 🧪 Development

```bash
# Start dev server with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

**Vite Config** (`vite.config.ts`):
- React plugin
- API proxy to backend
- Port 5173

**TypeScript Config** (`tsconfig.json`):
- Strict mode enabled
- React JSX
- ES2020 target

## 📦 Dependencies

**Core:**
- React 18.2
- React Router 6.20
- TypeScript 5.2
- Vite 5.0

**UI:**
- Lucide React (icons)
- Date-fns (date formatting)

**API:**
- Axios (HTTP client)

## 🎯 Features by Page

### Dashboard (`/`)
- Entity statistics
- Classification breakdown
- Most dangerous entities
- Recent incidents

### Entity Browser (`/entities`)
- Search and filter entities
- Grid/list view toggle
- Entity cards with threat levels
- Click to view details

### Entity Detail (`/entities/:id`)
- Full entity information
- Expandable sections
- Abilities and weaknesses
- Incident history

### Incident Report (`/report`)
- Multi-step form
- Entity selection
- Location selection
- Review before submit

### Location Map (`/map`)
- All locations with coordinates
- Location details
- Mapbox integration ready

### Login (`/login`)
- Login/Register tabs
- Form validation
- Demo account info

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output in dist/ folder
# Deploy to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Any static hosting
```

**Environment Variables:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=your_token_here
```

## 🎨 Customization

**Change Theme Colors:**
Edit CSS variables in `src/styles/index.css`:
```css
:root {
  --primary: #2D1B69;
  --accent: #00FF88;
  --background: #0F0F23;
  /* ... */
}
```

**Add New Entity Classifications:**
Update badge styles in `index.css`:
```css
.badge-yourtype {
  background: rgba(r, g, b, 0.2);
  color: #HEXCOLOR;
}
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port in vite.config.ts
server: { port: 5174 }
```

**API connection issues:**
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify proxy configuration in vite.config.ts

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Keep components small and focused
4. Add CSS files for component styles
5. Test on mobile and desktop

---

Built with 👻 for supernatural investigators worldwide
