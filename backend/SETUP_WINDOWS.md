# Eerie API - Windows Setup Guide (SQLite)

## Quick Setup Steps

### 1. Install Dependencies

Open PowerShell or Command Prompt in the `backend` folder:

```powershell
cd backend
npm install
```

### 2. Verify .env File

The `.env` file should already exist with:
```
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```powershell
npx prisma generate
```

### 4. Create Database and Run Migrations

```powershell
npx prisma migrate dev --name init
```

This will:
- Create the SQLite database file (`dev.db`)
- Apply the schema migrations
- Generate the Prisma Client

### 5. Seed the Database

```powershell
npx ts-node prisma/seed.ts
```

### 6. Verify Setup

Open Prisma Studio to view your data:
```powershell
npx prisma studio
```

This will open a browser at http://localhost:5555 where you can see all your entities, locations, and incidents.

## All-in-One Setup Command

If you want to run everything at once:

```powershell
npm run db:setup
```

## Troubleshooting

### Error: "ts-node is not recognized"

If you get this error, install ts-node globally:
```powershell
npm install -g ts-node
```

Or use npx:
```powershell
npx ts-node prisma/seed.ts
```

### Error: "prisma is not recognized"

Use npx to run Prisma commands:
```powershell
npx prisma generate
npx prisma migrate dev
```

### Database Reset

If you need to start fresh:
```powershell
npm run db:reset
```

Or manually:
```powershell
del prisma\dev.db
del prisma\dev.db-journal
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### Check Database File

After setup, you should see:
- `backend/prisma/dev.db` - Your SQLite database
- `backend/prisma/migrations/` - Migration history

## Default Users

After seeding, you'll have these test accounts:

**Admin:**
- Email: admin@eerie-api.com
- Password: admin123

**Investigator:**
- Email: investigator@eerie-api.com
- Password: investigator123

## Next Steps

1. Start the development server (when implemented):
   ```powershell
   npm run dev
   ```

2. View your data in Prisma Studio:
   ```powershell
   npx prisma studio
   ```

3. Test the API endpoints (when implemented)

## SQLite Benefits

- No separate database server needed
- Single file database (`dev.db`)
- Perfect for development
- Easy to reset and test
- Works great on Windows

## File Locations

- Database: `backend/prisma/dev.db`
- Schema: `backend/prisma/schema.prisma`
- Seed script: `backend/prisma/seed.ts`
- Migrations: `backend/prisma/migrations/`
- Config: `backend/.env`
