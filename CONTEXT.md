# Project Context: Samriddhi College Sports Week (3-Day Event)

## 1. Project Identity & Roles
- **College:** Samriddhi College, Nepal.
- **Organizer:** 5th Semester CSIT Students.
- **Participating Faculties:** CSIT, BCA, BSW, BBS (Crucial for Leaderboard).

## 2. Technical Stack (Non-Supabase)
- **Framework:** Next.js 
- **Database:** Local Dockerize PostgreSQL.
- **ORM:** Prisma.
- **Auth:** NextAuth.js (Auth.js) using Credentials Provider (Local Login).
- **UI:** Tailwind CSS, Shadcn UI, Lucide Icons.
- **Real-time:** simple API Polling.

## 3. Database Entities & Logic (Hallucination Guardrails)
- **Faculty:** { id, name (CSIT, BCA, etc.), colorCode, totalPoints }
- **Game:** { id, name, type (TEAM | INDIVIDUAL), pointWeight }
- **Team:** { id, facultyId, gameId, name (e.g., 'CSIT 5th A') }
- **Match:** { id, gameId, venue, startTime, status (UPCOMING, LIVE, FINISHED), stage (League, Final) }
- **MatchParticipant:** { id, matchId, teamId?, playerId?, score, pointsEarned }

## 4. Business Rules
- **RBAC:** - `ADMIN` (5th Sem Lead): Can create Games, Teams, and assign Managers.
    - `MANAGER`: Can only manage the specific Game assigned to them.
    - `PUBLIC`: Viewing only.

## 5. UI Requirements
- High-energy "Sports" vibe (Dark mode preferred).
- Mobile-first score entry for managers on the field.
- Faculty Leaderboard (Medal Tally style).