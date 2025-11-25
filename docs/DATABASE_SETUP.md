# Eerie API - Database Setup Guide

## Prerequisites

- PostgreSQL 14+ installed and running
- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the init script
\i database/init.sql

# Or manually create database
CREATE DATABASE eerie_api;
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/eerie_api?schema=public"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Migrations and Seed Data

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with example data
npm run prisma:seed

# Or run all at once
npm run db:setup
```

## Database Schema Overview

### Models

- **User**: Authentication and authorization
  - Roles: USER, INVESTIGATOR, ADMIN
  
- **Entity**: Supernatural entities
  - Classifications: Apparition, Cryptid, Demonic, Extraterrestrial, Undead, Other
  - Threat levels: 1-10 scale
  
- **Location**: Geographic locations where entities appear
  - Includes coordinates for mapping
  
- **Incident**: Reported encounters and sightings
  - Links entities, locations, and users
  - Severity scale: 1-10
  
- **EntityLocation**: Many-to-many relationship tracking entity appearances

## Seed Data

The seed script creates:
- 2 users (admin and investigator)
- 5 locations (famous haunted/cryptid locations)
- 15 supernatural entities across all classifications
- 3 sample incidents
- Entity-location relationships

### Default Users

**Admin:**
- Email: admin@eerie-api.com
- Password: admin123
- Role: ADMIN

**Investigator:**
- Email: investigator@eerie-api.com
- Password: investigator123
- Role: INVESTIGATOR

⚠️ **Change these passwords in production!**

## Useful Commands

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate
```

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Check PostgreSQL is listening on port 5432
4. Ensure database exists: `psql -U postgres -l`

### Migration Errors

If migrations fail:
```bash
# Reset and try again
npx prisma migrate reset
npm run db:setup
```

### Seed Script Errors

If seeding fails:
```bash
# Check database connection
npx prisma db pull

# Try seeding again
npm run prisma:seed
```

## Next Steps

After database setup:
1. Implement authentication endpoints
2. Create CRUD operations for entities
3. Build incident reporting system
4. Add geolocation features
5. Implement search and filtering

## Database Backup

```bash
# Backup database
pg_dump -U postgres eerie_api > backup.sql

# Restore database
psql -U postgres eerie_api < backup.sql
```
