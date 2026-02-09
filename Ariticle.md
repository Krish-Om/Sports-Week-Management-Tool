# Sports Week Management Tool

## Problem Statement/Motive

The primary goals for this project are:

- **Scheduling**: Provide clear schedules for participants and organizers
- **Communication**: Ensure proper communication across cross-event managers
- **Centralization**: Centralize all games and schedules in one platform
- **Control**: Allow event managers to control match state
- **Real-time Updates**: Provide real-time match updates
- **Visibility**: Let all managers and audience (future feature) view live progress
- **Organization**: Reduce clutter during games

## Our Thought Process/Context

Keeping these motives in mind, we started this mini project. We utilized the GitHub Copilot premium (Claude Sonnet/Haiku) that we got from the GitHub Student Plan.

### Design Phase

First, we roughly designed our event flow in Excalidraw and fed that rough design to Copilot to design the ER diagram. With that ER diagram, we let it produce the database schema.

### Development Phase

Now came the development part—or rather, Copilot building the project while we were just hitting the accept button.

#### Initial Tech Stack (Planned)

Copilot first suggested a simple and minimal tech stack:

- **Frontend**: TypeScript + Next.js
- **Backend + DB + Real-time connection**: Supabase

However, we knew that in a live scenario, the free hosted CPUs wouldn't provide the snappy performance we needed, and the cloud connection wouldn't be reliable enough.

#### Final Tech Stack (Implemented)

We outlined to Copilot a system combining REST APIs and WebSocket:

- **Frontend**: React (TypeScript) + React Router + TailwindCSS + Framer Motion (mostly suggested by Copilot)
- **Backend**: Originally suggested Node (TypeScript, WebSocket, Express), but we opted for **Bun** instead for faster and snappier performance
- **Database**: PostgreSQL (the top database choice)

The project ran successfully in the local environment.

### Deployment Challenges

Copilot dockerized this project to deploy and host it on a home server. We pushed the Docker images onto GHCR (GitHub Container Registry) and code to GitHub, then pulled the images and code onto the server.

#### Local Testing
- Ran locally first
- Tested with curl—seamless and running perfectly

#### Network Environment
- Moved to network environment
- Issues with configs like Network IP
- **Nginx** resolved these configuration issues

#### Public Hosting Challenges

After moving to public hosting, we were stopped by our limited knowledge about public hosting. We suffered most here. After 2 days of tinkering and guiding the issue to Copilot, the root cause was **free tier plan limitations** from our tunneling services (Cloudflare and Tailscale), which we didn't know at the time.

**Decision**: We decided not to deploy on the home server.

### Final Development Approach

We added this context to Copilot and let it do the job.

#### Project Phases

Copilot structured the project into different phases:

- **Phase 0**: Infrastructure Setup
- **Phase 1**: Backend Foundation
- **Phase 2**: Code Refactoring
- **Phase 3**: Frontend & Socket.io
- **Phase 4**: User Management
- **Phase 5**: Admin CRUD
- **Phase 6**: Manager Dashboard
- **Phase 7**: Public Dashboard
- **Phase 8**: Points Calculation
- **Phase 9**: UI Polish & Testing
- **Phase 10**: Deployment

## Entities

### 1. Admin

- Creates Sports Week event
- Adds games (from list)
- Creates Event Manager accounts
- Controls permissions

### 2. Event Manager (Core role)

- Assigned to specific games
- Creates match schedules
- Starts/pauses/ends matches
- Updates live match status and scores
- Declares winners

### 3. Viewer

- Views game schedules
- Views live match updates
- Views results

## Flow

### Step 1: Event Manager Login

Event Manager logs in and sees only the games assigned to them.

### Step 2: Create Match

The Event Manager:

1. Selects game
2. Selects teams/players
3. Sets match details:
   - Date
   - Time
   - Venue/Court/Server/Class
4. Saves match

Match status defaults to: **Upcoming**

### Step 3: Schedule Published

The match appears instantly on:

- Public dashboard
- Manager dashboards