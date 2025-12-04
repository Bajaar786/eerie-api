#!/bin/bash
# Database initialization script for Render

echo "🔧 Running Prisma migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Database initialized successfully!"
