#!/bin/sh

echo "🔄 Running database migrations..."
bun run db:push

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migrations failed"
  exit 1
fi

echo "🚀 Starting backend server..."
exec bun start
