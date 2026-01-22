# 🏆 Sports Week Management Tool - Complete Execution Guide

**Runtime:** Bun (v1.0+)  
**Framework:** Next.js 15 (App Router)  
**Database:** PostgreSQL (Supabase)  
**ORM:** Prisma  
**UI:** Tailwind CSS + Shadcn/UI + Lucide Icons  
**Real-time:** Supabase Realtime  

**Target Timeline:** 4-5 Days  
**Last Updated:** January 22, 2026

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Public Dashboard                          │
│  (Live Fixtures, Results, Leaderboard - Real-time Updates)  │
└──────────────────┬──────────────────────────────────────────┘
                   │ Supabase Realtime Subscription
                   ▼
         ┌─────────────────────┐
         │  PostgreSQL + RLS   │◄────────┐
         │   (Supabase)        │         │
         └─────────────────────┘         │
                   ▲                     │
                   │ Prisma Queries      │ Server Actions
                   │                     │
┌──────────────────┴─────────────────────┴─────────────────────┐
│              Next.js 15 App Router (Bun Runtime)             │
├──────────────────────────────────────────────────────────────┤
│  Admin Dashboard  │  Manager Dashboard  │  Auth Middleware   │
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
- [ ] Git configured
- [ ] Code editor ready (VS Code recommended)
- [ ] Supabase account created
- [ ] Domain model understood (see entity-relation.mermaid)

---

## 🗄️ Phase 1: Database Architecture (Day 1 - 4 hours)

### Step 1.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project: `sports-week-prod`
3. Note down:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon/Public Key: `eyJhbGc...`
   - Database Password: (secure storage)

### Step 1.2: Get Connection String

Navigate to: **Project Settings → Database → Connection String (Direct)**

Format:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### Step 1.3: Initialize Next.js Project with Bun

```bash
cd /home/krishom/Sports-Week-Management-Tool

# Create Next.js app in frontend folder
bunx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --use-bun \
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
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install essential components
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add card
bunx shadcn-ui@latest add badge
bunx shadcn-ui@latest add table
bunx shadcn-ui@latest add dialog
bunx shadcn-ui@latest add form
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

// Core Models
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
  name      String
  authId    String   @unique @map("auth_id") // Supabase User ID
  role      Role     @default(GAME_MANAGER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  games Game[]

  @@map("organizers")
}

model Game {
  id          String   @id @default(uuid())
  name        String   @unique // "Futsal", "Chess", "Valorant"
  type        GameType
  organizerId String   @map("organizer_id")
  organizer   Organizer @relation(fields: [organizerId], references: [id])
  rulesText   String?  @map("rules_text") @db.Text
  icon        String?  // Lucide icon name
  createdAt   DateTime @default(now()) @map("created_at")
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

model MatchParticipant {
  id       String       @id @default(uuid())
  matchId  String       @map("match_id")
  match    Match        @relation(fields: [matchId], references: [id], onDelete: Cascade)
  teamId   String?      @map("team_id") // NULL for individual games
  team     Team?        @relation(fields: [teamId], references: [id], onDelete: Cascade)
  playerId String?      @map("player_id") // NULL for team games
  player   Player?      @relation(fields: [playerId], references: [id], onDelete: Cascade)
  score    Int          @default(0)
  result   MatchResult?

  @@index([matchId])
  @@index([teamId])
  @@index([playerId])
  @@map("match_participants")
}
```

### Step 1.7: Push Schema to Database

```bash
cd frontend

# Initialize Prisma
bunx prisma generate

# Push schema to Supabase
bunx prisma db push

# Open Prisma Studio to verify
bunx prisma studio
```

### Step 1.8: Setup Prisma Client

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

---

## 🔐 Phase 2: Authentication & Authorization (Day 1-2 - 3 hours)

### Step 2.1: Setup Supabase Client

Create `frontend/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `frontend/lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}
```

### Step 2.2: Create Middleware for Route Protection

Create `frontend/middleware.ts`:

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Additional role check would go here
  }

  // Protect manager routes
  if (request.nextUrl.pathname.startsWith('/manager')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/manager/:path*'],
}
```

### Step 2.3: Enable Email Auth in Supabase

1. Go to: **Authentication → Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Disable email confirmation for development:
   - **Authentication → Settings → Enable email confirmations: OFF**

### Step 2.4: Setup Row Level Security (RLS)

Execute in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;

-- Create function to get organizer role
CREATE OR REPLACE FUNCTION get_organizer_role(user_id uuid)
RETURNS text AS $$
  SELECT role::text FROM organizers WHERE auth_id::uuid = user_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Public read access for faculties
CREATE POLICY "Public read access" ON faculties FOR SELECT USING (true);

-- Admins can do everything on faculties
CREATE POLICY "Admin full access" ON faculties FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Public read access for players
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON players FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Public read access for games
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON games FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Public read access for teams
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON teams FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Public read access for matches
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON matches FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Managers can update their assigned game matches
CREATE POLICY "Manager update assigned matches" ON matches FOR UPDATE
  USING (
    game_id IN (
      SELECT id FROM games WHERE organizer_id IN (
        SELECT id FROM organizers WHERE auth_id::uuid = auth.uid()
      )
    )
  );

-- Public read access for match_participants
CREATE POLICY "Public read access" ON match_participants FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON match_participants FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');

-- Managers can update participants for their assigned game matches
CREATE POLICY "Manager update participants" ON match_participants FOR ALL
  USING (
    match_id IN (
      SELECT m.id FROM matches m
      JOIN games g ON m.game_id = g.id
      JOIN organizers o ON g.organizer_id = o.id
      WHERE o.auth_id::uuid = auth.uid()
    )
  );

-- Organizers table policies
CREATE POLICY "Organizers can read all" ON organizers FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON organizers FOR ALL 
  USING (get_organizer_role(auth.uid()) = 'ADMIN');
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
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const organizer = await prisma.organizer.findUnique({
    where: { authId: user.id },
  })

  if (!organizer) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">🎮 Manager Panel</span>
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

Create `frontend/lib/hooks/use-realtime-matches.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Match } from '@prisma/client'

export function useRealtimeMatches(initialMatches: Match[]) {
  const [matches, setMatches] = useState(initialMatches)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMatches((prev) => [...prev, payload.new as Match])
          } else if (payload.eventType === 'UPDATE') {
            setMatches((prev) =>
              prev.map((match) =>
                match.id === payload.new.id ? (payload.new as Match) : match
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMatches((prev) =>
              prev.filter((match) => match.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return matches
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
- [ ] Public dashboard shows real-time updates
- [ ] Faculty points update correctly
- [ ] RLS policies work (test with different users)
- [ ] Mobile responsive on all pages
- [ ] Forms validate properly
- [ ] Error states display correctly

---

## 🚀 Phase 8: Deployment (Day 5 - 2 hours)

### Step 8.1: Prepare for Production

```bash
cd frontend

# Build the app
bun run build

# Test production build locally
bun run start
```

### Step 8.2: Deploy to Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel

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
# Create migration
bunx prisma migrate dev --name init

# Deploy migrations
bunx prisma migrate deploy

# Seed database
bunx prisma db seed
```

### Debugging

```bash
# Check Bun version
bun --version

# Clear cache
rm -rf .next
bun run build

# Check database connection
bunx prisma db pull
```

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

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set
- [ ] RLS policies enabled and tested
- [ ] Email auth configured
- [ ] Admin user created
- [ ] Sample data seeded
- [ ] Mobile responsiveness tested
- [ ] Real-time updates working
- [ ] Points calculation verified
- [ ] Error handling in place
- [ ] Production build successful
- [ ] Vercel deployment complete
- [ ] Custom domain configured (optional)

---

**Last Updated:** January 22, 2026  
**Version:** 1.0  
**Runtime:** Bun  
**Framework:** Next.js 15

---

*Good luck with your Sports Week Management Tool! 🏆*
