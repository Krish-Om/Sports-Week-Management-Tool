# 🏗️ Tailscale Deployment Architecture

## System Architecture

```mermaid
graph TB
    subgraph Tailscale["Tailscale Network (Encrypted VPN)"]
        Student[👨‍🎓 Student Device]
        Faculty[👨‍🏫 Faculty Device]
        Admin[👨‍💼 Admin Device]
    end
    
    Student --> TailscaleURL[http://device.tail-scale.ts.net]
    Faculty --> TailscaleURL
    Admin --> TailscaleURL
    
    TailscaleURL --> TailscaleDaemon
    
    subgraph HomeServer["Ubuntu Home Server (Dell Laptop)"]
        TailscaleDaemon[Tailscale Daemon<br/>• Encrypted connections<br/>• Stable hostname<br/>• NAT traversal]
        
        TailscaleDaemon --> DockerStack
        
        subgraph DockerStack["Docker Compose Stack"]
            Nginx[Nginx :80<br/>Reverse Proxy<br/>• Route traffic<br/>• WebSocket support]
            
            Frontend[Frontend :5173<br/>React + Vite<br/>+ Tailwind CSS]
            
            Backend[Backend :3001<br/>Express API<br/>+ Socket.io<br/>+ Drizzle ORM]
            
            Postgres[(PostgreSQL :5432<br/>Database)]
            
            Nginx --> Frontend
            Nginx --> Backend
            Backend --> Postgres
            Frontend -- Socket.io --> Backend
        end
    end
    
    style Tailscale fill:#e1f5fe
    style HomeServer fill:#fff3e0
    style DockerStack fill:#f3e5f5
    style Nginx fill:#c8e6c9
    style Frontend fill:#bbdefb
    style Backend fill:#ffccbc
    style Postgres fill:#f8bbd0
```

## Data Flow

### User Request Flow

```mermaid
sequenceDiagram
    participant User as User Device
    participant TS as Tailscale VPN
    participant Nginx as Nginx Proxy
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL
    
    User->>TS: Connect via Tailscale
    TS->>Nginx: Encrypted tunnel to :80
    
    alt Static Content
        Nginx->>FE: Route to Frontend :5173
        FE-->>Nginx: HTML/CSS/JS
        Nginx-->>TS: Return content
        TS-->>User: Display page
    end
    
    alt API Request
        Nginx->>BE: Route /api/* to :3001
        BE->>DB: Query data
        DB-->>BE: Return results
        BE-->>Nginx: JSON response
        Nginx-->>TS: Return data
        TS-->>User: Update UI
    end
    
    alt WebSocket (Real-time)
        Nginx->>BE: Route /socket.io to :3001
        BE-->>Nginx: WebSocket upgrade
        Nginx-->>TS: Maintain connection
        BE->>User: Push live updates
    end
```

### Real-Time Updates (Socket.io)

```mermaid
graph TD
    Admin[Admin Updates Score] --> API[POST /api/matches/:id/score]
    API --> Backend[Backend API]
    Backend --> DB[(Save to Database)]
    Backend --> SocketIO[Socket.io Emit]
    
    SocketIO --> WS1[Manager Devices]
    SocketIO --> WS2[Student Devices]
    SocketIO --> WS3[Public Dashboard]
    
    WS1 --> Update1[Live Score Update]
    WS2 --> Update2[Live Score Update]
    WS3 --> Update3[Live Score Update]
    
    style Admin fill:#ffccbc
    style Backend fill:#bbdefb
    style DB fill:#f8bbd0
    style SocketIO fill:#c8e6c9
    style WS1 fill:#fff9c4
    style WS2 fill:#fff9c4
    style WS3 fill:#fff9c4
```

## Network Topology

### Internal (Docker Network)

```mermaid
graph LR
    subgraph DockerNetwork["Docker Network: sports-network"]
        N[Nginx<br/>:80]
        F[Frontend<br/>:5173]
        B[Backend<br/>:3001]
        P[(PostgreSQL<br/>:5432)]
        
        N -->|proxy /| F
        N -->|proxy /api| B
        N -->|proxy /socket.io| B
        B -->|query| P
    end
    
    Host[Host :80] --> N
    
    style DockerNetwork fill:#e8eaf6
    style N fill:#c8e6c9
    style F fill:#bbdefb
    style B fill:#ffccbc
    style P fill:#f8bbd0
```

### External Access

```mermaid
graph TD
    Internet[Internet Users<br/>Optional - with Funnel]
    Internet --> Funnel[Tailscale Funnel<br/>HTTPS Endpoint]
    Funnel --> TSNetwork
    
    TSUsers[Tailscale Network Users<br/>Primary Access] --> TSNetwork
    
    TSNetwork[Tailscale VPN<br/>100.x.x.x]
    TSNetwork --> HomeServer[Your Home Server<br/>Nginx:80]
    
    style Internet fill:#ffebee
    style Funnel fill:#e1f5fe
    style TSUsers fill:#e8f5e9
    style TSNetwork fill:#f3e5f5
    style HomeServer fill:#fff9c4
```

## File Structure

```
Sports-Week-Management-Tool/
│
├── docker-compose.homeserver.yml    # Docker services configuration
├── nginx.conf                       # Nginx reverse proxy config
├── .env                            # Environment variables (created by script)
│
├── deploy-tailscale.sh             # 🚀 Main deployment script
│
├── TAILSCALE_DEPLOYMENT.md         # Complete deployment guide
├── QUICK_START_TAILSCALE.md        # Quick reference
├── DEPLOYMENT_COMPARISON.md        # Compare deployment options
├── DEPLOYMENT_CHECKLIST.md         # Step-by-step checklist
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   └── ...
│
└── frontend/
    ├── Dockerfile
    ├── src/
    └── ...
```

## Deployment Process Flow

```mermaid
flowchart TD
    Start([Start Deployment]) --> Check{Prerequisites<br/>Installed?}
    
    Check -->|No| Install[Install Docker,<br/>Docker Compose,<br/>Tailscale]
    Install --> Auth
    Check -->|Yes| Auth{Tailscale<br/>Authenticated?}
    
    Auth -->|No| TailscaleAuth[Run: tailscale up<br/>Authenticate in browser]
    TailscaleAuth --> GetInfo
    Auth -->|Yes| GetInfo[Get Tailscale<br/>Hostname & IP]
    
    GetInfo --> GenSecrets[Generate Secure<br/>Passwords & JWT]
    GenSecrets --> CreateEnv[Create .env file<br/>with Tailscale URLs]
    CreateEnv --> SSL{Tailscale<br/>Certs Exist?}
    
    SSL -->|Yes| CopySSL[Copy Tailscale<br/>Certificates]
    SSL -->|No| GenSSL[Generate<br/>Self-signed Cert]
    
    CopySSL --> Pull
    GenSSL --> Pull[Pull Docker Images<br/>from GHCR]
    
    Pull --> Compose[Start Docker Compose<br/>4 containers]
    Compose --> Wait[Wait for<br/>Health Checks]
    Wait --> Verify[Verify Services<br/>nginx, backend, postgres]
    
    Verify --> Success([✅ Deployment Complete!<br/>Access via Tailscale URL])
    
    style Start fill:#c8e6c9
    style Success fill:#81c784
    style Check fill:#fff9c4
    style Auth fill:#fff9c4
    style SSL fill:#fff9c4
```

## Security Layers

```mermaid
graph TD
    Internet[Internet/User Device]
    
    Internet --> Layer1
    
    subgraph Layer1["🔒 Layer 1: Tailscale Encryption"]
        TS[WireGuard Protocol<br/>End-to-end encryption<br/>Device authentication]
    end
    
    Layer1 --> Layer2
    
    subgraph Layer2["🛡️ Layer 2: Firewall UFW"]
        FW[Block all incoming<br/>Allow Tailscale subnet<br/>Allow SSH only]
    end
    
    Layer2 --> Layer3
    
    subgraph Layer3["🐳 Layer 3: Docker Network"]
        DN[Internal network isolation<br/>No direct port exposure<br/>Container-to-container only]
    end
    
    Layer3 --> Layer4
    
    subgraph Layer4["🔐 Layer 4: Application Auth"]
        Auth[JWT tokens<br/>Role-based access<br/>Password hashing bcrypt]
    end
    
    Layer4 --> App[Protected Application]
    
    style Layer1 fill:#e3f2fd
    style Layer2 fill:#f3e5f5
    style Layer3 fill:#e8f5e9
    style Layer4 fill:#fff3e0
    style App fill:#c8e6c9
```

## Traffic Patterns

### User Access Flow

```mermaid
graph LR
    subgraph AdminFlow["Admin Workflow"]
        A1[Login] --> A2[Create Games]
        A2 --> A3[Manage Teams]
        A3 --> A4[Schedule Matches]
        A4 --> A5[Update Scores]
        A5 --> A6[View Reports]
    end
    
    subgraph ManagerFlow["Manager Workflow"]
        M1[Login] --> M2[View Assigned Games]
        M2 --> M3[Update Match Scores]
        M3 --> M4[Monitor Leaderboard]
    end
    
    subgraph PublicFlow["Public/Student Workflow"]
        P1[View Dashboard] --> P2[Check Fixtures]
        P2 --> P3[Watch Live Scores]
        P3 --> P4[View Leaderboard]
    end
    
    A5 -- Socket.io Broadcast --> M4
    A5 -- Socket.io Broadcast --> P3
    M3 -- Socket.io Broadcast--> P3
    
    style AdminFlow fill:#ffccbc
    style ManagerFlow fill:#bbdefb
    style PublicFlow fill:#c8e6c9
```

### API Endpoints

**Admin/Manager:**
- Login: `POST /api/auth/login` → Receive JWT token
- Manage Games: `GET/POST/PUT /api/games`
- Update Scores: `PUT /api/matches/:id/score` → Socket.io broadcasts to all clients
- View Reports: `GET /api/points/summary`

**Public/Student:**
- View Dashboard: `GET /`
- View Fixtures: `GET /fixtures`
- View Leaderboard: `GET /leaderboard`
- WebSocket Connection → Receive live updates (score updates, match status, leaderboard changes)

## Scaling Options

### Current Setup (Single Server)

All services on one machine
• Good for: 100-500 concurrent users
• Cost: $0 (home server)
• Maintenance: Manual

### Future Scaling Path

```mermaid
graph TB
    Current[Current: Single Server<br/>100-500 users<br/>$0 cost]
    
    Current --> Option1{Scaling Options}
    
    Option1 -->|Vertical| V[Upgrade Hardware<br/>More RAM/CPU<br/>500-1000 users]
    Option1 -->|Horizontal| H[Multiple Instances<br/>Load Balancer<br/>Shared DB<br/>1000+ users]
    Option1 -->|Cloud| C[AWS/GCP/DO<br/>Auto-scaling<br/>CDN<br/>Unlimited scale]
    
    V --> LB1[Single Server<br/>Enhanced]
    H --> LB2[Load Balancer]
    C --> LB3[Cloud Load Balancer]
    
    LB2 --> BE1[Backend 1]
    LB2 --> BE2[Backend 2]
    LB2 --> BE3[Backend N]
    
    BE1 --> SharedDB[(Shared PostgreSQL)]
    BE2 --> SharedDB
    BE3 --> SharedDB
    
    LB3 --> CDN[CloudFront CDN]
    LB3 --> AutoScale[Auto Scaling Group]
    AutoScale --> CloudDB[(RDS PostgreSQL)]
    
    style Current fill:#c8e6c9
    style V fill:#fff9c4
    style H fill:#bbdefb
    style C fill:#ffccbc
```

## Monitoring Points

```mermaid
graph TB
    Dashboard[Monitoring Dashboard]
    
    Dashboard --> System
    Dashboard --> Docker
    Dashboard --> App
    Dashboard --> TS
    
    subgraph System["System Metrics"]
        S1[CPU usage]
        S2[Memory usage]
        S3[Disk space]
        S4[Network traffic]
    end
    
    subgraph Docker["Docker Metrics"]
        D1[Container health]
        D2[Restart count]
        D3[Resource usage]
    end
    
    subgraph App["Application Metrics"]
        AP1[API response times]
        AP2[WebSocket connections]
        AP3[Database queries]
        AP4[Error rates]
    end
    
    subgraph TS["Tailscale Metrics"]
        T1[Connected devices]
        T2[Bandwidth usage]
        T3[Connection status]
    end
    
    style Dashboard fill:#e1f5fe
    style System fill:#fff9c4
    style Docker fill:#c8e6c9
    style App fill:#ffccbc
    style TS fill:#e8f5e9
```

**Key Monitoring Commands:**

```bash
# System Resources
htop                    # CPU/Memory
df -h                   # Disk space

# Docker Stats
docker stats            # Container resources
docker ps               # Container status

# Application Logs
docker compose logs -f backend
docker compose logs -f frontend

# Tailscale Status
tailscale status
tailscale netcheck
```

## Backup Strategy

```mermaid
graph TD
    Schedule[Backup Schedule]
    
    Schedule --> Daily
    Schedule --> Weekly
    Schedule --> Monthly
    
    subgraph Daily["Daily - Automated"]
        D1[Database Dump]
        D2[Full PostgreSQL backup]
        D3[Stored locally]
        D1 --> D2 --> D3
    end
    
    subgraph Weekly["Weekly - Automated"]
        W1[Configuration Backup]
        W2[.env file]
        W3[docker-compose.yml]
        W4[nginx.conf]
        W1 --> W2
        W1 --> W3
        W1 --> W4
    end
    
    subgraph Monthly["Monthly - Manual"]
        M1[Off-site Backup]
        M2[Copy to cloud storage]
        M3[Verify restore process]
        M1 --> M2 --> M3
    end
    
    style Schedule fill:#e1f5fe
    style Daily fill:#c8e6c9
    style Weekly fill:#fff9c4
    style Monthly fill:#ffccbc
```

**Backup Commands:**

```bash
# Daily Database Backup
docker exec sports-week-db pg_dump -U sports_user sports_week > backup_$(date +%Y%m%d).sql

# Weekly Config Backup
tar -czf config_backup_$(date +%Y%m%d).tar.gz .env docker-compose.homeserver.yml nginx.conf

# Restore Database
cat backup_20260209.sql | docker exec -i sports-week-db psql -U sports_user -d sports_week
```

---

## Quick Reference URLs

After deployment, bookmark these:

- **App**: `http://<your-device>.tail-scale.ts.net`
- **Health Check**: `http://<your-device>.tail-scale.ts.net/health`
- **API Health**: `http://<your-device>.tail-scale.ts.net/api/health`
- **Tailscale Admin**: https://login.tailscale.com/admin

## Useful Commands

```bash
# Check everything
./deploy-tailscale.sh

# View logs
docker compose -f docker-compose.homeserver.yml logs -f

# Restart all
docker compose -f docker-compose.homeserver.yml restart

# Stop all
docker compose -f docker-compose.homeserver.yml down

# Check Tailscale
tailscale status

# Enable public access
tailscale funnel 80
```

---

This architecture provides a secure, scalable, and easy-to-maintain deployment for your Sports Week Management Tool!
