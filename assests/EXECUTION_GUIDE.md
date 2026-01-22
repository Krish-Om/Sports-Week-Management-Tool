# 🏆 Samriddhi College Sports Week Management Tool

**College:** Samriddhi College, Nepal  
**Event:** 3-Day Sports Week  
**Organizer:** 5th Semester CSIT Students  
**Faculties:** CSIT, BCA, BSW, BBS  

**Tech Stack:**
- **Runtime:** Bun (v1.0+)  
- **Framework:** Next.js 15 (App Router)  
- **Database:** PostgreSQL (Docker - Local)  
- **ORM:** Prisma  
- **Auth:** NextAuth.js (Credentials Provider)  
- **UI:** Tailwind CSS + Shadcn/UI + Lucide Icons  
- **Real-time:** API Polling (No Supabase)  

**Target Timeline:** 4-5 Days  
**Last Updated:** January 22, 2026

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Public Dashboard                          │
│     (Live Fixtures, Faculty Leaderboard, Results)           │
│                  (API Polling for Updates)                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP Polling
                   ▼
         ┌─────────────────────┐
         │  PostgreSQL         │◄────────┐
         │  (Docker Local)     │         │
         └─────────────────────┘         │
                   ▲                     │
                   │ Prisma ORM          │ Server Actions
                   │                     │
┌──────────────────┴─────────────────────┴─────────────────────┐
│              Next.js 15 App Router (Bun Runtime)             │
├──────────────────────────────────────────────────────────────┤
│  Admin (CSIT 5th) │  Manager Dashboard  │  NextAuth.js      │
└──────────────────────────────────────────────────────────────┘
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
- [ ] Code editor ready (VS Code recommended)de recommended)
- [ ] Supabase account created
- [ ] Domain model understood (see entity-relation.mermaid)

---

## 🗄️ Phase 1: Database Architecture (Day 1 - 4 hours)

### Step 1.1: Setup Local PostgreSQL with Docker

Create `backend/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: sports-week-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: sports_week
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
    ports:
      - "5432:5432"
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

### Step 1.2: Verify Database Connection

```bash
# Check if container is running
docker ps | grep sports-week-db

# Should see: sports-week-db running on port 5432
```

cd frontend

# Core dependencies
bun add @prisma/client next-auth@beta bcryptjs
bun add -d prisma @types/bcryptjs

# UI Components
bunx shadcn-ui@latest init

# Select options:
# - Style: Default
# - Base color: Slate (or choose based on "Sports vibe")
  --no-src-dir \
  --import-alias "@/*"

cd frontend
```

### Step 1.4: Install Dependencies

```bash
# Core dependencies
bun add @supabase/supabase-js @supabase/ssr
bun add @prisma/client
bun add -d prisma

# UI Components
bunx shadcn-ui@latest init

# Select options:
# - Style: Default`:

```env
# Database (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/sports_week"
DIRECT_URL="postgresql://postgres:postgres123@localhost:5432/sports_week"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-in-production-min-32-chars"

# JWT Secret (for additional token signing if needed)
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-characters"
bunx shadcn-ui@latest add input
bunx shadcn-ui@latest add select
bunx shadcn-ui@latest add label
bunx shadcn-ui@latest add toast
bunx shadcn-ui@latest add dropdown-menu
bunx shadcn-ui@latest add tabs
```

### Step 1.5: Setup Environment Variables

Create `frontend/.env.local`:

```env
# Database
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..." # From API settings
```

### Step 1.6: Create Prisma Schema

Create `frontend/prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
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
