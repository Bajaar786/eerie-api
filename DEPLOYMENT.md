# 🚀 Eerie API - Deployment Guide

## Deploying to Render

### Prerequisites

1. GitHub repository with your code
2. Render account (https://render.com)
3. PostgreSQL database (for production) or use Render's PostgreSQL

### Option 1: Deploy Backend Only (Recommended)

#### Step 1: Configure Render Service

In Render Dashboard:

**Build & Deploy Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node

#### Step 2: Set Environment Variables

Add these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your_database_url>
JWT_SECRET=<generate_random_secret>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=<your_frontend_url>
```

**For SQLite (Development):**
```
DATABASE_URL=file:./dev.db
```

**For PostgreSQL (Production - Recommended):**
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### Step 3: Update Prisma for PostgreSQL (Production)

If using PostgreSQL, update `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then update these field types:
- Change `String` to `String @db.Text` for long text fields
- Arrays work natively in PostgreSQL (no JSON.stringify needed)

### Option 2: Deploy from Root Directory

If Render detects root directory:

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

### Option 3: Use render.yaml (Blueprint)

The `render.yaml` file is already configured. Just:

1. Push to GitHub
2. In Render, click "New" → "Blueprint"
3. Connect your repository
4. Render will auto-configure from `render.yaml`

### Database Setup on Render

#### Option A: Render PostgreSQL (Recommended)

1. Create PostgreSQL database in Render
2. Copy the Internal Database URL
3. Add to environment variables as `DATABASE_URL`
4. Update schema to use PostgreSQL

#### Option B: SQLite (Not Recommended for Production)

SQLite works but has limitations:
- File-based (can be lost on redeploy)
- No concurrent writes
- Better for development only

### Post-Deployment Steps

#### 1. Run Migrations

Render will automatically run migrations if you add to build command:

```bash
npm install && npx prisma migrate deploy && npm run build
```

#### 2. Seed Database (Optional)

Add to build command:
```bash
npm install && npx prisma migrate deploy && npm run prisma:seed && npm run build
```

Or run manually via Render Shell:
```bash
npm run prisma:seed
```

### Troubleshooting

#### Error: Cannot find module 'dist/index.js'

**Fix 1: Check Build Command**
Ensure build command includes TypeScript compilation:
```bash
npm install && npm run build
```

**Fix 2: Verify tsconfig.json**
Check `outDir` is set to `./dist`:
```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

**Fix 3: Check Root Directory**
Set "Root Directory" to `backend` in Render settings

#### Error: Prisma Client not generated

**Fix:** Add to build command:
```bash
npm install && npx prisma generate && npm run build
```

Or use the `postinstall` script (already added):
```json
"postinstall": "prisma generate"
```

#### Error: Database connection failed

**Fix:** Verify `DATABASE_URL` environment variable is set correctly

#### Error: CORS issues

**Fix:** Set `CORS_ORIGIN` to your frontend URL:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Health Check

After deployment, test:
```bash
curl https://your-app.onrender.com/health
```

Should return:
```json
{"status":"ok","message":"Eerie API is running"}
```

## Deploying Frontend to Vercel/Netlify

### Vercel Deployment

1. Push frontend to GitHub
2. Import project in Vercel
3. Set Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Netlify Deployment

1. Push frontend to GitHub
2. Import project in Netlify
3. Base Directory: `frontend`
4. Build Command: `npm run build`
5. Publish Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Update Frontend API URL

In `frontend/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ...
});
```

## Production Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS_ORIGIN
- [ ] Run migrations: `prisma migrate deploy`
- [ ] Generate Prisma Client
- [ ] Build TypeScript: `npm run build`
- [ ] Test health endpoint

### Frontend
- [ ] Update API URL to production backend
- [ ] Build: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Configure CORS on backend

### Security
- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Set secure CORS policy
- [ ] Add rate limiting
- [ ] Enable helmet.js
- [ ] Validate all inputs

## Render-Specific Configuration

### Build Command (Recommended)
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

### Start Command
```bash
npm start
```

### Environment Variables (Required)
```
DATABASE_URL=<postgres_url>
JWT_SECRET=<random_secret>
NODE_ENV=production
CORS_ORIGIN=<frontend_url>
```

### Root Directory
Set to: `backend`

## Alternative: Deploy Both Together

If deploying as monorepo:

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

## Quick Fix for Your Current Error

The error `/opt/render/project/src/backend/dist/index.js` suggests Render is looking in the wrong path.

**Immediate Fix:**

1. In Render Dashboard → Settings
2. Set **Root Directory** to: `backend`
3. Set **Build Command** to: `npm install && npm run build`
4. Set **Start Command** to: `npm start`
5. Redeploy

This will make Render look in the correct directory structure.

## Testing Deployment Locally

Before deploying, test the production build:

```bash
cd backend

# Build
npm run build

# Check dist folder exists
ls dist

# Test production start
NODE_ENV=production npm start
```

The `dist/index.js` file should exist after running `npm run build`.

## Need Help?

- Check Render logs for specific errors
- Verify all environment variables are set
- Ensure PostgreSQL database is accessible
- Test build locally first

---

**Key Takeaway:** Set Root Directory to `backend` in Render settings!
