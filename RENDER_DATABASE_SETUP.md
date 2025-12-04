# Render Database Setup Guide

## 🚨 Critical: Your database needs to be initialized!

The "Route not found" or timeout errors happen because the database isn't set up yet.

## Step-by-Step Fix

### 1. Check Your Render Logs
1. Go to https://dashboard.render.com/
2. Click on your `eerie-api-backend` service
3. Click **Logs** tab
4. Look for database connection errors

### 2. Verify DATABASE_URL is Set
1. In your service, go to **Environment** tab
2. Make sure `DATABASE_URL` is set to your PostgreSQL connection string
3. Format: `postgresql://user:password@host:port/database`
4. Get this from your `eerie-db` database in Render:
   - Click on the database
   - Copy the **Internal Database URL**
   - Paste it as `DATABASE_URL` in your web service

### 3. Run Database Migrations

You have two options:

#### Option A: Using Render Shell (Recommended)
1. Go to your service page
2. Click **Shell** tab (top right)
3. Run these commands:
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Option B: From Your Local Machine
1. Get the **External Database URL** from your Render database
2. Run locally:
```bash
cd backend
$env:DATABASE_URL="<paste_external_database_url_here>"
npx prisma migrate deploy
npx prisma db seed
```

### 4. Verify It Works

After running migrations, test these URLs:

**Health Check:**
```
https://eerie-api-8.onrender.com/health
```
Should return:
```json
{
  "status": "ok",
  "message": "Eerie API is running",
  "database": "connected",
  "entities": 10
}
```

**Get Entities:**
```
https://eerie-api-8.onrender.com/api/entities
```
Should return an array of entities.

### 5. Common Issues

#### "Route not found" on /api/entities
- Database isn't initialized
- Run migrations and seed (Step 3)

#### Connection timeout
- DATABASE_URL is wrong or not set
- Check Environment variables (Step 2)

#### "relation does not exist"
- Migrations haven't been run
- Run `npx prisma migrate deploy` (Step 3)

#### "No entities found"
- Database is empty
- Run `npx prisma db seed` (Step 3)

### 6. After Database is Initialized

Once the database works, your frontend will automatically connect if you set:
- Netlify environment variable: `VITE_API_URL=https://eerie-api-8.onrender.com/api`
- Render environment variable: `CORS_ORIGIN=https://prismatic-gumption-e04f83.netlify.app`

## Quick Test Commands

Test from your terminal:
```bash
# Health check
curl https://eerie-api-8.onrender.com/health

# Get entities
curl https://eerie-api-8.onrender.com/api/entities

# Login
curl -X POST https://eerie-api-8.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eerie.com","password":"admin123"}'
```

## Need Help?

If you're still stuck:
1. Share the Render logs
2. Share the output of the health check endpoint
3. Confirm DATABASE_URL is set correctly
