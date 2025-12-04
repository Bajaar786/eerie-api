# Production Deployment Guide

## ✅ Current Status
- **Frontend**: Deployed on Netlify at https://prismatic-gumption-e04f83.netlify.app
- **Backend**: Ready to deploy on Render

## 🚀 Step-by-Step Deployment

### 1. Deploy Backend on Render

#### A. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Name: `eerie-db`
4. Database: `eerie_api`
5. User: `eerie_user`
6. Region: Oregon (or same as your web service)
7. Plan: **Free**
8. Click **Create Database**
9. **Copy the Internal Database URL** (starts with `postgresql://`)

#### B. Deploy Backend Service
1. Click **New +** → **Blueprint**
2. Connect your GitHub repository
3. Select the repository with your code
4. Render will detect `render.yaml` automatically
5. Click **Apply**

#### C. Configure Environment Variables
After deployment starts, go to your service's **Environment** tab and set:

```
NODE_ENV=production
DATABASE_URL=<paste_internal_database_url_from_step_A>
JWT_SECRET=<generate_random_string>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://prismatic-gumption-e04f83.netlify.app
```

**To generate JWT_SECRET**, run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### D. Update Prisma Schema for PostgreSQL
Your `backend/prisma/schema.prisma` needs to use PostgreSQL instead of SQLite:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then redeploy or run migrations manually in Render shell.

### 2. Update Frontend on Netlify

#### A. Set Environment Variable
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: `prismatic-gumption-e04f83`
3. Go to **Site settings** → **Environment variables**
4. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
     (Replace with your actual Render backend URL once deployed)

#### B. Redeploy Frontend
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

### 3. Initialize Database

Once backend is deployed, you need to run migrations and seed data:

#### Option A: Using Render Shell
1. Go to your Render service
2. Click **Shell** tab
3. Run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Option B: Using Local Connection
1. Copy the External Database URL from Render
2. Run locally:
```bash
cd backend
DATABASE_URL="<external_database_url>" npx prisma migrate deploy
DATABASE_URL="<external_database_url>" npx prisma db seed
```

## 🔍 Verification

### Test Backend
```bash
curl https://your-backend-name.onrender.com/api/health
```

Should return: `{"status":"ok"}`

### Test Frontend
1. Visit https://prismatic-gumption-e04f83.netlify.app
2. Try logging in with seeded user:
   - Email: `admin@eerie.com`
   - Password: `admin123`

## 📝 Important Notes

### Database Considerations
- **Free Render PostgreSQL**: 
  - 90 days expiration
  - 1GB storage
  - Shared CPU
  - Consider upgrading for production

### Backend Considerations
- **Free Render Web Service**:
  - Spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free

### CORS Configuration
- Backend is configured to accept requests from your Netlify URL
- If you change frontend URL, update `CORS_ORIGIN` in Render

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure Prisma migrations ran successfully

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set in Netlify
- Check CORS_ORIGIN matches your Netlify URL
- Open browser console for error details

### Database connection errors
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check if database is active in Render
- Ensure migrations were run

## 🔄 Future Updates

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys from main branch

### Update Frontend
1. Push changes to GitHub
2. Netlify auto-deploys from main branch

### Database Migrations
After schema changes:
```bash
# Generate migration
cd backend
npx prisma migrate dev --name your_migration_name

# Deploy to production (in Render shell)
npx prisma migrate deploy
```

## 📊 Monitoring

- **Render**: Check logs and metrics in dashboard
- **Netlify**: Check deploy logs and analytics
- **Database**: Monitor usage in Render PostgreSQL dashboard

## 🔐 Security Checklist

- ✅ JWT_SECRET is random and secure
- ✅ DATABASE_URL is not exposed in frontend
- ✅ CORS is restricted to your frontend domain
- ✅ Environment variables are set in platform dashboards (not in code)
- ⚠️ Consider adding rate limiting for production
- ⚠️ Consider adding HTTPS-only cookies for auth tokens
