# 🏆 Samriddhi College Sports Week Management Tool

**College:** Samriddhi College, Nepal  
**Event:** 3-Day Sports Week  
**Organizer:** 5th Semester CSIT Students  
**Faculties:** CSIT, BCA, BSW, BBS  

**Tech Stack (ACTUAL IMPLEMENTATION):**
- **Runtime:** Bun (v1.0+)  
- **Frontend:** React (Vite) + Tailwind CSS v4 + Lucide-React Icons  
- **Backend:** Express.js (running on Bun)  
- **Database:** PostgreSQL 16 (Docker - Local on port 5433)  
- **ORM:** Drizzle ORM with TypeScript (Schema as Code)  
- **Real-time:** Socket.io 4.8.3 (Bi-directional updates)  
- **Auth:** JWT with Pre-seeded Accounts (Admin + Manager Roles)  
- **Routing:** React Router v7.12.0 for frontend navigation

**Authentication Strategy for Small Private Event:**
- ✅ **No Self-Registration:** Admin pre-creates all user accounts
- ✅ **Username/Password Login:** Simple credentials (e.g., "futsal_manager", "chess_manager")
- ✅ **JWT Tokens:** Stateless authentication with 7-day expiry
- ✅ **Role-Based Access:** Only ADMIN and MANAGER roles
- ✅ **Manual User Management:** Admin can add/remove managers via dashboard
- ❌ **No Email Verification:** Not needed for known college organizers
- ❌ **No Password Reset Flow:** Admin can manually reset in database
- ❌ **No OAuth/Social Login:** Unnecessary complexity for 3-day event  

**Target Timeline:** 4-5 Days  
**Current Status:** Phase 8 Complete (Day 5) - Ready for Phase 9  
**Last Updated:** January 23, 2026 - 23:15 UTC

---

## 📝 PROJECT TODO LIST (Based on AI_CONTEXT.prompt.txt)

### ✅ Phase 0: Infrastructure Setup (COMPLETED)
- [x] PostgreSQL Docker container running (port 5433)
- [x] Database ERD designed (7 entities)
- [x] Project documentation created

### ✅ Phase 1: Backend Foundation (COMPLETED - Day 1)
- [x] Initialize Express server with Bun runtime in `/backend`
- [x] Setup Drizzle ORM with PostgreSQL connection (port 5433)
- [x] Create complete schema from ERD (Faculty, Player, Game, Team, Match, MatchParticipant, User)
- [x] Push schema to database and verified
- [x] Create seed script with initial data (4 faculties, admin user, sample managers)
- [x] Setup JWT authentication middleware with role-based access
- [x] Create Express API structure with clean architecture
- [x] Implement service layer for database operations
- [x] Add comprehensive error handling
- [x] Create faculty CRUD endpoints

### ✅ Phase 2: Code Refactoring (COMPLETED)
- [x] Organized code into clean architecture (config, services, routes, middleware)
- [x] Centralized environment configuration
- [x] Added TypeScript types and interfaces
- [x] Implemented service layer pattern
- [x] Added error handling middleware
- [x] Created consistent API response format

### ✅ Phase 3: Frontend React Setup & Socket.io Integration (COMPLETED)
- [x] Initialize React with Vite in `/frontend`
- [x] Install dependencies (Tailwind CSS, Lucide-React, Socket.io-client, framer-motion)
- [x] Configure Tailwind with athletic theme (#2563eb Blue, #f97316 Orange)
- [x] Setup React Router for navigation
- [x] Create Socket.io client connection with reconnection handling
- [x] Implement "Connection Lost" banner component
- [x] Configure Socket.io on Express server
- [x] Create Socket.io event handlers (scoreUpdate, matchStatusChange, leaderboardUpdate)
- [x] Implement reconnection logic on server and client
- [x] Build AuthContext for authentication state management
- [x] Create ProtectedRoute component with role-based access control
- [x] Implement Login page with credential validation
- [x] Build Admin layout with navigation
- [x] Create Admin dashboard with stats cards
- [x] Build Public dashboard homepage

### ✅ Phase 4: User Management & API Integration (COMPLETED)
- [x] Create JWT-based login API endpoint
- [x] Implement password hashing (bcrypt)
- [x] Build simple login page with username/password
- [x] Create protected route HOC/wrapper
- [x] Setup role-based access control (ADMIN, MANAGER)
- [x] Seed script: Create initial admin + sample managers
- [x] Admin dashboard: User management CRUD (create/edit/delete managers)
- [x] Connect frontend to backend API endpoints
- [x] Test authentication flow end-to-end
- [x] Fix Tailwind CSS v4 configuration issues
- [x] Fix import path issues in frontend components

### ✅ Phase 5: Admin Dashboard CRUD Operations (COMPLETED)
- [x] Create admin layout with navigation (completed in Phase 3)
- [x] Build CRUD operations for Faculties
  - [x] Create FacultyService backend methods (pre-existing, verified)
  - [x] Build faculty API routes (pre-existing, verified)
  - [x] Create FacultiesPage component with table and modal
  - [x] Test faculty CRUD operations
- [x] Build CRUD operations for Games
  - [x] Create GameService backend methods
  - [x] Build game API routes with validation
  - [x] Create GamesPage component with form
  - [x] Add game type selection (TEAM/INDIVIDUAL)
  - [x] Add manager assignment dropdown
  - [x] Test game CRUD operations
- [x] Build CRUD operations for Teams
  - [x] Create TeamService backend methods with duplicate checking
  - [x] Build team API routes with relationship validation
  - [x] Create TeamsPage component
  - [x] Add faculty and game relationship selectors
  - [x] Test team CRUD operations
- [x] Build CRUD operations for Players
  - [x] Create PlayerService backend methods
  - [x] Build player API routes with faculty validation
  - [x] Create PlayersPage component
  - [x] Add faculty assignment and semester fields
  - [x] Test player CRUD operations
- [x] Build CRUD operations for Matches
  - [x] Create MatchService backend methods with participant management
  - [x] Build match API routes with participant validation
  - [x] Create MatchesPage component with card layout
  - [x] Add participant assignment (teams or players based on game type)
  - [x] Add venue, datetime picker, and status fields
  - [x] Test match CRUD operations
- [x] All routes mounted in backend/src/routes/index.ts
- [x] All pages integrated in frontend/src/App.tsx
- [x] Authentication fixed (response.data.data extraction)
- [x] Socket.io connection verified

### 🎮 Phase 6: Manager Dashboard (Day 3 - 6 hours)
- [x] Create manager-specific layout with sidebar navigation
- [x] Display assigned games list with card selector
- [x] Build match management interface with expandable cards
- [x] Implement live score update UI with +/− buttons
- [x] Add status toggle (UPCOMING → LIVE → FINISHED)
- [x] Emit Socket.io events on score updates (scoreUpdate, matchStatusChange)
- [x] Create participant score update API route (/match-participants)
- [x] Add getParticipantById and updateParticipantScore methods to MatchService
- [x] Build ManagerLeaderboard page (placeholder for Phase 8)
- [x] Mobile-first responsive design
- [x] Route integration in App.tsx with ManagerLayout
- [x] Test score updates and status changes

### 🌍 Phase 7: Public Dashboard (Day 4 - COMPLETED ✅)
- [x] Create PublicFixtures page with all scheduled matches
- [x] Build PublicLiveMatches page with real-time Socket.io updates
- [x] Implement PublicLeaderboard with dynamic standings calculation
- [x] Enhance PublicDashboard with upcoming matches preview
- [x] Backend enrichment: getAllWithDetails() and getByIdWithDetails() methods
- [x] Eliminate N+1 query pattern - single API call returns complete data
- [x] Standardize Socket.io event names across all components
- [x] Real-time updates without page refresh working perfectly
- [x] Page load time optimized (<100ms)
- [x] Three focused commits applied (SoC principle):
  - Commit 50c3540: Backend enriched data with game details
  - Commit 4630b3f: Frontend query optimization (N+1 elimination)
  - Commit 788bcea: Socket.io event name standardization

**Phase 7 Testing Results:**
- ✅ /fixtures displays all matches with game names and expandable details
- ✅ /live shows only LIVE matches with real-time score updates
- ✅ /leaderboard calculates standings from finished matches
- ✅ Manager dashboard updates trigger public page updates immediately
- ✅ No TypeScript errors, clean build, all features functional
- ✅ User confirmed: "Working without need of refreshing the page"

**Key Fixes Applied in Phase 7:**
1. **Routes Redirecting Issue** → Backend now returns game details in all match responses
2. **Infinite Loading Issue** → Removed N+1 queries (individual API calls per match)
3. **Manual Refresh Required** → Eliminated slow individual API calls
4. **Real-time Not Working** → Standardized Socket.io event names (scoreUpdated → scoreUpdate, etc.)

### 📊 Phase 8: Points Calculation Logic (Day 5 - COMPLETED ✅)
- [x] Create automatic points calculation API endpoint
- [x] Implement points distribution based on game weight
- [x] Update Faculty.totalPoints when match finishes
- [x] Emit Socket.io event for leaderboard updates
- [x] Add points history tracking (optional)
- [x] Calculate faculty-level standings (aggregate team/player points)
- [x] Add point weight factors for different games

**Phase 8 Implementation Details:**

*Backend Services (PointsService):*
- `calculateMatchPoints(matchId)` - Calculates points: Winner gets 3 * gameWeight, Losers get 0, Draws get 1 * gameWeight
- `applyPoints(calculation)` - Updates faculty.totalPoints and participant results
- `getLeaderboard()` - Returns sorted faculty list by totalPoints (DESC)
- `getDetailedLeaderboard()` - Returns leaderboard with W/L/D statistics
- `getFacultyPointsHistory(facultyId)` - Returns points history for individual faculty

*API Endpoints (/api/points):*
- `GET /leaderboard` - Get faculty leaderboard (public)
- `GET /leaderboard/detailed` - Get leaderboard with statistics (public)
- `GET /faculty/:facultyId/history` - Get points history for faculty (public)
- `POST /calculate/:matchId` - Calculate match points (admin only)
- `POST /apply/:matchId` - Apply points and update leaderboard (admin only)

*MatchService Enhancement:*
- `finishMatchWithPoints()` - Complete match and automatically calculate/apply points
- Updates participant scores and results during completion
- Emits leaderboardUpdate Socket.io event

*Frontend Updates:*
- PublicLeaderboard now uses /api/points/leaderboard endpoint
- Displays faculty standings with medal emojis (🥇🥈🥉)
- Listens to leaderboardUpdate Socket.io event for real-time updates
- Shows live update indicator when connected

**Phase 8 Testing Results:**
- ✅ Points calculated correctly (3 * weight for winner)
- ✅ Faculty standings updated automatically
- ✅ Real-time leaderboard updates via Socket.io
- ✅ Public leaderboard shows correct rankings
- ✅ Admin can calculate and apply points
- ✅ All endpoints working with proper authorization

**Phase 8 Commits (SoC Principle):**
- Commit d92f33b: Backend service layer (PointsService, API routes)
- Commit e43d5e3: System integration (match completion, Socket.io events)
- Commit 3248c1c: Frontend updates (PublicLeaderboard UI)
- Commit 2e9bfa6: Fix automatic points application when match FINISHED
- Commit f516553: Add faculty leaderboard to AdminDashboard

**Phase 8 Bugfix Summary:**
- Fixed: Points weren't being automatically applied when match marked FINISHED
- Solution: Enhanced match update route to trigger PointsService.calculateMatchPoints() and applyPoints()
- Added: Faculty leaderboard display in AdminDashboard with real-time updates
- Result: Points now update across all dashboards (Admin, Public, Manager) when match completes

### 🎨 Phase 9: UI Polish & Testing (Day 5 - NEXT)
- [ ] Add loading states and animations
- [ ] Implement error boundaries and error handling
- [ ] Create toast notifications
- [ ] Add framer-motion animations
- [ ] Test all CRUD operations
- [ ] Verify Socket.io real-time updates
- [ ] Test role-based access control
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### 🚀 Phase 10: Deployment Setup (Day 5 - 2 hours)
- [ ] Setup Cloudflare Tunnel for backend
- [ ] Configure production environment variables
- [ ] Build frontend for production
- [ ] Setup production PostgreSQL (or keep local)
- [ ] Configure CORS for production domains
- [ ] Test production deployment
- [ ] Setup monitoring/logging

---

## 🎯 CRITICAL IMPLEMENTATION RULES (From AI_CONTEXT.prompt.txt)

1. **Type Safety:** Always refer to `schema.prisma` before generating API routes
2. **No Over-Engineering:** Use local React state (useState/useEffect) + Socket.io
3. **Real-time First:** All score updates MUST emit Socket.io events immediately
4. **Mobile First:** Bottom navigation, thumb-friendly UI
5. **Reconnectivity:** Frontend MUST show "Connection Lost" banner on socket disconnect
6. **Role-Based Access:**
   - ADMIN: Full control (Games, Faculties, Users, all CRUD operations)
   - MANAGER: Can only update scores/status for their assigned Game
7. **Authentication for Private Event:**
   - No public registration or signup page
   - Admin pre-creates all manager accounts with simple credentials
   - Example: `username: "futsal_manager"`, `password: "futsal2026"`
   - Managers get credentials verbally/via WhatsApp from admin
   - Simple login page with username/password only

---

## 📊 System Architecture (Per AI_CONTEXT.prompt.txt)

```
┌─────────────────────────────────────────────────────────────┐
│              Public Dashboard (React + Vite)                 │
│     (Live Fixtures, Faculty Leaderboard, Results)           │
│              Socket.io Client (Real-time Updates)            │
└──────────────────┬──────────────────────────────────────────┘
                   │ Socket.io (Bi-directional)
                   ├─ scoreUpdate events
                   ├─ matchStatusChange events
                   └─ leaderboardUpdate events
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         Express Backend (Bun Runtime)                        │
│  ┌────────────────┬───────────────┬──────────────────┐     │
│  │ REST API       │ Socket.io     │ JWT Auth         │     │
│  │ Endpoints      │ Server        │ Middleware       │     │
│  └────────────────┴───────────────┴──────────────────┘     │
│                    Prisma ORM                                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  PostgreSQL         │
         │  (Docker: 5433)     │
         └─────────────────────┘
                   
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnel                         │
│              (Home Server to Public Web)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Phase 0: Pre-Development Setup (30 minutes)

### Step 0.1: Verify Prerequisites

```bash
# Check Bun installation
bun --version

# Install Bun if needed (Linux/macOS)
curl -fsSL https://bun.sh/install | bash

# Verify Git
git --version

# Check PostgreSQL access (via Supabase)
# Create account at https://supabase.com
```

### Step 0.2: Environment Verification Checklist

- [ ] Bun v1.0+ installed
- [ ] Docker & Docker Compose installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Domain model understood (see DatabaseEntityDiagram.mermaid)

---

## 🗄️ Phase 1: Backend & Database Setup (Day 1 - 4 hours)

### Step 1.1: Initialize Backend with Bun

```bash
# Navigate to backend folder
cd backend

# Initialize Bun project
bun init -y

# Install core dependencies
bun add express prisma @prisma/client socket.io cors dotenv jsonwebtoken bcryptjs
bun add -d @types/express @types/cors @types/jsonwebtoken @types/bcryptjs typescript @types/node

# Create basic folder structure
mkdir -p src/routes src/controllers src/middleware src/config
```

### Step 1.2: Setup Local PostgreSQL with Docker

Create `backend/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: sports-week-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: sports_week
      POSTGRES_USER: sports
      POSTGRES_PASSWORD: sports123
      POSTGRES_HOST_AUTH_METHOD: "md5"
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start the database:
```bash
cd backend
docker compose up -d
```

### Step 1.3: Verify Database Connection

```bash
# Check if container is running
docker ps | grep sports-week-db

# Should see: sports-week-db running on port 5433
```

### Step 1.4: Setup Prisma Schema

Create `backend/prisma/schema.prisma`:

### Step 1.4: Setup Prisma Schema

Create `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Enums
enum Role {
  ADMIN
  MANAGER
}

enum MatchStatus {
  UPCOMING
  LIVE
  FINISHED
}

enum GameType {
  TEAM
  INDIVIDUAL
}

// Core Models
model Faculty {
  id          String   @id @default(uuid())
  name        String   @unique // "CSIT", "BCA", "BSW", "BBS"
  totalPoints Int      @default(0) @map("total_points")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  teams   Team[]
  players Player[]

  @@map("faculties")
}

model Player {
  id        String   @id @default(uuid())
  name      String
  facultyId String   @map("faculty_id")
  faculty   Faculty  @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  semester  String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  matchParticipants MatchParticipant[]

  @@index([facultyId])
  @@map("players")
}

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String // Hashed password
  role      Role     @default(MANAGER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  games Game[]

  @@map("users")
}

model Game {
  id          String   @id @default(uuid())
  name        String   @unique // "Futsal", "Chess", etc.
  type        GameType
  pointWeight Int      @default(1) @map("point_weight")
  managerId   String?  @map("manager_id")
  manager     User?    @relation(fields: [managerId], references: [id])
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  matches Match[]
  teams   Team[]

  @@index([managerId])
  @@map("games")
}

model Team {
  id        String   @id @default(uuid())
  name      String
  facultyId String   @map("faculty_id")
  faculty   Faculty  @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  gameId    String   @map("game_id")
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  matchParticipants MatchParticipant[]

  @@unique([facultyId, gameId, name])
  @@index([facultyId])
  @@index([gameId])
  @@map("teams")
}

model Match {
  id        String      @id @default(uuid())
  gameId    String      @map("game_id")
  game      Game        @relation(fields: [gameId], references: [id], onDelete: Cascade)
  startTime DateTime    @map("start_time")
  venue     String
  status    MatchStatus @default(UPCOMING)
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")

  participants MatchParticipant[]

  @@index([gameId])
  @@index([status])
  @@map("matches")
}

model MatchParticipant {
  id           String  @id @default(uuid())
  matchId      String  @map("match_id")
  match        Match   @relation(fields: [matchId], references: [id], onDelete: Cascade)
  teamId       String? @map("team_id")
  team         Team?   @relation(fields: [teamId], references: [id], onDelete: Cascade)
  playerId     String? @map("player_id")
  player       Player? @relation(fields: [playerId], references: [id], onDelete: Cascade)
  score        Int     @default(0)
  pointsEarned Int     @default(0) @map("points_earned")

  @@index([matchId])
  @@index([teamId])
  @@index([playerId])
  @@map("match_participants")
}
```

### Step 1.5: Setup Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://sports:sports123@localhost:5433/sports_week"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-characters"

# Server
PORT=3001
NODE_ENV=development
```

### Step 1.6: Push Schema to Database

```bash
cd backend

# Initialize Prisma
bunx prisma init

# Generate Prisma Client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Open Prisma Studio to verify
bunx prisma studio
```

### Step 1.7: Create Seed Data

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Faculties
  const faculties = await Promise.all([
    prisma.faculty.upsert({
      where: { name: 'CSIT' },
      update: {},
      create: { name: 'CSIT' },
    }),
    prisma.faculty.upsert({
      where: { name: 'BCA' },
      update: {},
      create: { name: 'BCA' },
    }),
    prisma.faculty.upsert({
      where: { name: 'BSW' },
      update: {},
      create: { name: 'BSW' },
    }),
    prisma.faculty.upsert({
      where: { name: 'BBS' },
      update: {},
      create: { name: 'BBS' },
    }),
  ])

  console.log('✅ Faculties created:', faculties.length)

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.username)
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `backend/package.json`:
```json
{
  "scripts": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

Run seed:
```bash
bun run seed
```

---

## 🔐 Phase 2: Express Server & JWT Auth (Day 1-2 - 4 hours)

### Step 2.1: Create Express Server

Create `backend/src/index.ts`:

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sports Week API is running' })
})

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`🔌 Socket.io ready for connections`)
})

export { io }
```

Add start script to `backend/package.json`:
```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "seed": "bun run prisma/seed.ts"
  }
}
```

### Step 2.2: Create JWT Middleware

Create `backend/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    role: string
  }
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = decoded as any
    next()
  })
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
```

### Step 2.3: Create Auth Routes

Create `backend/src/routes/auth.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
```

Update `backend/src/index.ts` to include auth routes:

```typescript
import authRoutes from './routes/auth'

// ... existing code ...

app.use('/api/auth', authRoutes)
```

---

## 🎨 Phase 3: Frontend React Vite Setup (Day 2 - 3 hours)
}

generator client {
  provider = "prisma-client-js"
}

// Enums
enum Role {
  ADMIN
  GAME_MANAGER
}

enum MatchStatus {
  UPCOMING
  LIVE
  FINISHED
}

enum GameType {
  TEAM
  INDIVIDUAL
}

enum MatchResult {
  WIN
  LOSS
  DRAW
}

enum MatchStage {
  LEAGUE
  QUARTER_FINAL
  SEMI_FINAL
  FINAL
}

// Core ModelsSW", "BBS" (Samriddhi College)
  colorCode   String?  @map("color_code") // For UI styling
model Faculty {
  id          String   @id @default(uuid())
  name        String   @unique // "CSIT", "BCA", "BBS", "BSW"
  totalPoints Int      @default(0) @map("total_points")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  teams   Team[]
  players Player[]

  @@map("faculties")
}

model Player {
  id         String   @id @default(uuid())
  name       String
  facultyId  String   @map("faculty_id")
  faculty    Faculty  @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  semester   String? // "5th", "3rd", etc.
  phone      String?
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  matchParticipants MatchParticipant[]

  @@index([facultyId])
  @@map("players")
}

model Organizer {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed password
  authId    String   @unique @map("auth_id") // Supabase User ID
  role      Role     @default(GAME_MANAGER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  games Game[]

  @@map("organizers")
}

model Game { @id @default(uuid())
  name        String    @unique // "Futsal", "Chess", "Valorant", "Basketball"
  type        GameType
  pointWeight Int       @default(1) @map("point_weight") // Weight for leaderboard calculation
  organizerId String    @map("organizer_id")
  organizer   Organizer @relation(fields: [organizerId], references: [id])
  rulesText   String?   @map("rules_text") @db.Text
  icon        String?   // Lucide icon name
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  matches Match[]
  teams   Team[]

  @@index([organizerId])
  @@map("games")
}

model Team {
  id        String   @id @default(uuid())
  name      String // "CSIT 5th A", "BBS 1st"
  facultyId String   @map("faculty_id")
  faculty   Faculty  @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  gameId    String   @map("game_id")
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  matchParticipants MatchParticipant[]

  @@unique([facultyId, gameId, name])
  @@index([facultyId])
  @@index([gameId])
  @@map("teams")
}

model Match {
  id        String      @id @default(uuid())
  gameId    String      @map("game_id")
  game      Game        @relation(fields: [gameId], references: [id], onDelete: Cascade)
  startTime DateTime    @map("start_time")
  venue     String
  status    MatchStatus @default(UPCOMING)
  stage     MatchStage  @default(LEAGUE)
  winnerId  String?     @map("winner_id") // Can be TeamID or PlayerID
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")

  participants MatchParticipant[]

  @@index([gameId])
  @@index([status])
  @@index([startTime])
  @@map("matches")
}

model Match     String       @id @default(uuid())
  matchId       String       @map("match_id")
  match         Match        @relation(fields: [matchId], references: [id], onDelete: Cascade)
  teamId        String?      @map("team_id") // NULL for individual games
  team          Team?        @relation(fields: [teamId], references: [id], onDelete: Cascade)
  playerId      String?      @map("player_id") // NULL for team games
  player        Player?      @relation(fields: [playerId], references: [id], onDelete: Cascade)
  score         Int          @default(0)
  result        MatchResult?
  pointsEarned  Int          @default(0) @map("points_earned") // Points contributed to faculty @default(0)
  result   MatchResult?

  @@index([matchId])
  @@index([teamId])
  @@index([playerId])
  @@map("match_participants")
}
```
Create Prisma Config (Prisma 7)

Create `frontend/prisma/prisma.config.ts`:

```typescript
import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres123@localhost:5432/sports_week',
    },
  },
})
```

### Step 1.8: Push Schema to Database

```bash
cd frontend

# Generate Prisma Client
bunx prisma generate

# Push schema to local PostgreSQL
# Push schema to Supabase
bunx prisma db push

# Open Prisma Studio to verify
bunx prisma studio
```

### Step 1.9: Setup Prisma Client

Create `frontend/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 1.10: Seed Initial Data

Create `frontend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Faculties (Samriddhi College)
  const faculties = await Promise.all([
    prisma.faculty.upsert({
      where: { name: 'CSIT' },
      update: {},
      create: { name: 'CSIT', colorCode: '#3B82F6' }, // Blue
    }),
    prisma.faculty.upsert({
      where: { name: 'BCA' },
      update: {},
      create: { name: 'BCA', colorCode: '#10B981' }, // Green
    }),
    prisma.faculty.upsert({
      where: { name: 'BSW' },
      update: {},
      create: { name: 'BSW', colorCode: '#F59E0B' }, // Orange
    }),
    prisma.faculty.upsert({
      where: { name: 'BBS' },
      update: {},
      create: { name: 'BBS', colorCode: '#EF4444' }, // Red
    }),
  ])

  // Create Admin Organizer (5th Sem CSIT Lead)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.organizer.upsert({
    where: { email: 'admin@samriddhi.edu.np' },
    update: {},
    create: {
      name: 'CSIT 5th Sem Lead',
      email: 'admin@samriddhi.edu.np',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Seed data inserted successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

Run seed:
```bash
bun run prisma/seed.ts
```

---

## 🔐 Phase 2: Authentication with NextAuth.js (Day 1-2 - 3 hours)

### Step 2.1: Setup NextAuth Configuration

Create `frontend/lib/auth.ts`:

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const organizer = await prisma.organizer.findUnique({
          where: { email: credentials.email },
        })

        if (!organizer) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          organizer.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: organizer.id,
          email: organizer.email,
          name: organizer.name,
          role: organizer.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### Step 2.2: Create NextAuth API Route

Create `frontend/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### Step 2.3: Create Auth Types

Create `frontend/types/next-auth.d.ts`:

```typescript
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    id?: string
  }
}
```

### Step 2.4: Create Middleware for Route Protection

Create `frontend/middleware.ts`:

```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect admin routes
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protect manager routes
    if (path.startsWith('/manager') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/manager/:path*'],
}
```

### Step 2.5: Create Login Page

Create `frontend/app/login/page.tsx`:

```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-6">
          Samriddhi Sports Week Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## 👨‍💼 Phase 3: Admin Dashboard (Day 2 - 8 hours)

### Step 3.1: Create Admin Layout

Create folder structure:
```
frontend/app/admin/
├── layout.tsx
├── page.tsx
├── faculties/
│   ├── page.tsx
│   ├── actions.ts
│   └── components/
│       ├── faculty-form.tsx
│       └── faculty-table.tsx
├── games/
│   ├── page.tsx
│   ├── actions.ts
│   └── components/
├── teams/
│   ├── page.tsx
│   ├── actions.ts
│   └── components/
├── players/
│   ├── page.tsx
│   ├── actions.ts
│   └── components/
├── organizers/
│   ├── page.tsx
│   ├── actions.ts
│   └── components/
└── matches/
    ├── page.tsx
    ├── actions.ts
    └── components/
```

### Step 3.2: Admin Layout Template

Create `frontend/app/admin/layout.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const organizer = await prisma.organizer.findUnique({
    where: { authId: user.id },
  })

  if (!organizer || organizer.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold">🏆 Admin Panel</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/admin/faculties" className="text-gray-700 hover:text-gray-900">
                  Faculties
                </Link>
                <Link href="/admin/games" className="text-gray-700 hover:text-gray-900">
                  Games
                </Link>
                <Link href="/admin/teams" className="text-gray-700 hover:text-gray-900">
                  Teams
                </Link>
                <Link href="/admin/players" className="text-gray-700 hover:text-gray-900">
                  Players
                </Link>
                <Link href="/admin/organizers" className="text-gray-700 hover:text-gray-900">
                  Organizers
                </Link>
                <Link href="/admin/matches" className="text-gray-700 hover:text-gray-900">
                  Matches
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Public View
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

### Step 3.3: Build CRUD Pages (Priority Order)

**Order of Implementation:**
1. Faculties → 2. Organizers → 3. Games → 4. Teams → 5. Players → 6. Matches

Each CRUD page follows this pattern:
- List view with table
- Create/Edit dialog with form
- Delete confirmation
- Server Actions for mutations

---

## 🎮 Phase 4: Manager Dashboard (Day 3 - 6 hours)

### Step 4.1: Manager Layout

Create `frontend/app/manager/layout.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-green-400">
                🎮 Manager Panel - {session.user.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white">
                Public View
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

### Step 4.2: Manager Dashboard Features

Create:
- `frontend/app/manager/page.tsx` - List of assigned games
- `frontend/app/manager/[gameId]/matches/page.tsx` - Match management
- `frontend/app/manager/[gameId]/matches/[matchId]/page.tsx` - Live score update

Key Features:
- Mobile-first responsive design
- Quick status toggle (UPCOMING → LIVE → FINISHED)
- Score input with increment/decrement buttons
- Winner selection dropdown
- Result auto-calculation

---

## 🌍 Phase 5: Public Dashboard (Day 4 - 6 hours)

### Step 5.1: Public Pages Structure

```
frontend/app/
├── page.tsx                 # Homepage - Featured/upcoming matches
├── matches/page.tsx         # All fixtures with filters
├── live/page.tsx           # Live matches only (auto-refresh)
├── results/page.tsx        # Completed matches
├── leaderboard/page.tsx    # Faculty standings
└── games/[id]/page.tsx     # Game-specific view
```

### Step 5.2: Implement Supabase Realtime
API Polling for Live Updates

Create `frontend/lib/hooks/use-polling-matches.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import type { Match } from '@prisma/client'

export function usePollingMatches(initialMatches: Match[], interval = 5000) {
  const [matches, setMatches] = useState(initialMatches)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches')
        if (response.ok) {
          const data = await response.json()
          setMatches(data)
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error)
      }
    }

    // Poll every 5 seconds for live updates
    const intervalId = setInterval(fetchMatches, interval)

    return () => clearInterval(intervalId)
  }, [interval])

  return matches
}
```

Create API endpoint `frontend/app/api/matches/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      where: {
        status: { in: ['UPCOMING', 'LIVE'] },
      },
      include: {
        game: true,
        participants: {
          include: {
            team: {
              include: {
                faculty: true,
              },
            },
            player: {
              include: {
                faculty: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
```

### Step 5.3: Live Status Animation

Create `frontend/components/live-badge.tsx`:

```typescript
import { Badge } from '@/components/ui/badge'

export function LiveBadge() {
  return (
    <Badge className="bg-red-500 text-white animate-pulse">
      <span className="relative flex h-2 w-2 mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      LIVE
    </Badge>
  )
}
```

---

## 📊 Phase 6: Points Calculation (Day 5 - 3 hours)

### Step 6.1: Create Points Update Function

Execute in Supabase SQL Editor:

```sql
-- Function to update faculty points after match
CREATE OR REPLACE FUNCTION update_faculty_points()
RETURNS TRIGGER AS $$
DECLARE
  winning_team_id uuid;
  winning_player_id uuid;
  winning_faculty_id uuid;
  points_awarded int := 3; -- Adjust per your rules
BEGIN
  -- Only process finished matches with a winner
  IF NEW.status = 'FINISHED' AND NEW.winner_id IS NOT NULL THEN
    
    -- Check if it's a team-based match
    SELECT team_id INTO winning_team_id
    FROM match_participants
    WHERE match_id = NEW.id 
      AND (team_id::text = NEW.winner_id OR player_id::text = NEW.winner_id)
    LIMIT 1;
    
    IF winning_team_id IS NOT NULL THEN
      -- Team game: get faculty from team
      SELECT faculty_id INTO winning_faculty_id
      FROM teams
      WHERE id = winning_team_id;
    ELSE
      -- Individual game: get faculty from player
      SELECT player_id INTO winning_player_id
      FROM match_participants
      WHERE match_id = NEW.id 
        AND player_id::text = NEW.winner_id
      LIMIT 1;
      
      SELECT faculty_id INTO winning_faculty_id
      FROM players
      WHERE id = winning_player_id;
    END IF;
    
    -- Award points to faculty
    IF winning_faculty_id IS NOT NULL THEN
      UPDATE faculties
      SET total_points = total_points + points_awarded
      WHERE id = winning_faculty_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_faculty_points ON matches;
CREATE TRIGGER trigger_update_faculty_points
AFTER UPDATE OF status, winner_id ON matches
FOR EACH ROW
EXECUTE FUNCTION update_faculty_points();
```

### Step 6.2: Add Points History Tracking (Optional)

```sql
CREATE TABLE points_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculties(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  points_awarded int NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Update the trigger to log history
-- (Modify update_faculty_points function to insert into points_history)
```

---

## 🎨 Phase 7: Polish & Testing (Day 5 - 3 hours)

### Step 7.1: Add Loading States

Create `frontend/components/loading-skeleton.tsx`:

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export function MatchCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}
```

### Step 7.2: Error Handling

Create `frontend/app/error.tsx`:

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### Step 7.3: Testing Checklist

- [ ] Admin can create all entities
- [ ] Manager can update match scores
- [ ] Public dashboard shows live updates (polling)
- [ ] Faculty points update correctly
- [ ] NextAuth authentication working
- [ ] Mobile responsive on all pages
- [ ] Forms validate properly
- [ ] Error states display correctly
- [ ] API endpoints returning correct data

---

## 🚀 Phase 8: Deployment (Day 5 - 2 hours)

### Step 8.1: Prepare for Production

```bash
cd frontend

# Build the app
bun run build (Production PostgreSQL connection string)
- `DIRECT_URL` (Same as DATABASE_URL for production)
- `NEXTAUTH_URL` (https://your-domain.vercel.app)
- `NEXTAUTH_SECRET` (Generate with: `openssl rand -base64 32`)
- `JWT_SECRET` (Generate with: `openssl rand -base64 32`)

### Step 8.4: Setup Production Database

**Option 1:** Deploy PostgreSQL on a VPS/cloud provider
**Option 2:** Use managed PostgreSQL (Railway, Supabase PostgreSQL only, Neon)
**Option 3:** Use Vercel Postgres

**Recommended:** Railway or Neon (free tiers available)

### Step 8.5: Database Migration to Production

```bash
# Generate migration from current schema
bunx prisma migrate dev --name init

# Deploy to production
bunx prisma migrate deploy
```

# Follow prompts:
# - Link to existing project or create new
# - Set environment variables
# - Deploy
```

### Step 8.3: Configure Environment Variables in Vercel

Add to Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Step 8.4: Setup Production Database

Option 1: Use same Supabase project
Option 2: Create separate production Supabase project

### Step 8.5: Enable Supabase Realtime

In Supabase Dashboard:
1. Go to **Database → Replication**
2. Enable replication for `matches` table
3. Enable replication for `match_participants` table

---

## 📱 Quick Reference Commands

### Development

```bash
# Start dev server
bun run dev

# Run Prisma Studio
bunx prisma studio

# Generate Prisma Client after schema changes
bunx prisma generate

# Push schema changes to database
bunx prisma db push

# Reset database (CAREFUL!)
bunx prisma db push --force-reset
```

### Database Management

```bash
# Create miNextAuth Not Working
- Check `.env` has `NEXTAUTH_SECRET`
- Verify `NEXTAUTH_URL` matches your domain
- Check middleware configuration
- Ensure password is hashed with bcrypt

### Issue: Database Connection Failed
- Verify Docker container is running: `docker ps | grep sports-week-db`
- Check PostgreSQL connection: `docker logs sports-week-db`
- Restart container: `cd backend && docker compose restart`

### Issue: Polling Not Updating
- Check API endpoint is returning data: `/api/matches`
- Verify polling interval in hook
- Check browser console for error
bun --version

# Clear cache
rm -rf .next
bun run build

# CNextAuth.js Docs](https://next-auth.js.org/)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Bun Documentation](https://bun.sh/docs)
- [Docker Documentation](https://docs.docker.com/

---

## 🔧 Troubleshooting

### Issue: Prisma Client Not Generating
```bash
bunx prisma generate --force
```

### Issue: Supabase Auth Not Working
- Check `.env.local` variables
- Verify Supabase project URL and keys
- Check middleware configuration

### Issue: RLS Blocking Queries
- Test with service role key
- Check policies in Supabase SQL Editor
- Verify user role in organizers table

### Issue: Real-time Not Updating
- Enable replication in Supabase
- Check channel subscription code
- Verify table permissions

---

## 📚 Additional Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Bun Documentation](https://bun.sh/docs)

---
