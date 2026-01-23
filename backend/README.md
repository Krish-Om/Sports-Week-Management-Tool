# Sports Week Management Tool - Backend

Express.js backend with Drizzle ORM, PostgreSQL, and Socket.io.

## 🚀 Quick Start

```bash
bun install
bun run db:push
bun run seed
bun run dev
```

## 📁 Structure

- `src/config/` - Configuration (env, database)
- `src/db/` - Drizzle schema
- `src/middleware/` - Auth, error handling
- `src/routes/` - API endpoints
- `src/services/` - Business logic
- `src/types/` - TypeScript types

## 🔐 Default Users

- Admin: `admin` / `admin123`
- Manager: `futsal_manager` / `futsal2026`

## 📡 API

- `POST /api/auth/login` - Login
- `GET /api/faculties` - List faculties
- `POST /api/faculties` - Create faculty (admin)

## 🛠️ Commands

- `bun run dev` - Start server
- `bun run seed` - Seed database
- `bun run db:push` - Update schema
- `bun run db:studio` - Open Drizzle Studio
