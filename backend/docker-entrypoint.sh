#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
sleep 3

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🔍 Checking for migration files..."
if [ -d "/app/prisma/migrations" ] && [ "$(ls -A /app/prisma/migrations 2>/dev/null | grep -v migration_lock.toml | wc -l)" -gt 0 ]; then
    echo "✅ Migration files found, deploying migrations..."
    npx prisma migrate deploy
    echo "✅ Migrations deployed successfully!"
else
    echo "❌ ERROR: No migration files found!"
    echo "❌ Migrations should be committed to git and deployed to production."
    echo "❌ Run 'npx prisma migrate dev' in development to create migrations."
    exit 1
fi

echo "🚀 Starting application..."
exec node dist/server.js
