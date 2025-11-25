# Eerie API Database

This directory contains database initialization scripts and documentation.

## Files

- `init.sql` - Initial database creation script for PostgreSQL
- `schema.sql` - Generated schema (created by Prisma migrations)

## Setup

1. Install PostgreSQL 14 or higher
2. Run the init script:
   ```bash
   psql -U postgres -f init.sql
   ```
3. Configure your `.env` file in the backend directory
4. Run Prisma migrations from the backend directory:
   ```bash
   cd ../backend
   npm install
   npm run db:setup
   ```

## Schema Overview

The database includes four main models:

### User
- Authentication and authorization
- Roles: USER, INVESTIGATOR, ADMIN

### Entity
- Supernatural entities with classifications
- Threat levels (1-10)
- Abilities and weaknesses
- Status tracking

### Location
- Geographic locations with coordinates
- Associated with entities and incidents

### Incident
- Reported encounters and sightings
- Links entities, locations, and users
- Evidence tracking
- Verification status

### EntityLocation
- Many-to-many relationship
- Tracks frequency of entity appearances at locations

## Seed Data

The seed script creates:
- 2 users (admin and investigator)
- 5 famous paranormal locations
- 15 supernatural entities across all classifications
- 3 sample incidents with evidence

See `../docs/DATABASE_SETUP.md` for detailed setup instructions.
