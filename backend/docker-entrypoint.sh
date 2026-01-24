#!/bin/sh

echo "🔄 Running database migrations..."
echo "DATABASE_URL: $DATABASE_URL"
echo "FRONTEND_URL: $FRONTEND_URL"

# Ensure DATABASE_URL environment variable is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set!"
  exit 1
fi

bun run db:push

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migrations failed"
  exit 1
fi

echo "🚀 Starting backend server..."
# Pass NODE_ENV to prevent dotenv from loading .env
NODE_ENV=production exec bun index.ts
