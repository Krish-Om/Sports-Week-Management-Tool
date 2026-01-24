# Cloudflare Tunnel Setup - Sports Week Management Tool

## Prerequisites

- Cloudflare account with domain krishombasukala.com.np
- Cloudflared CLI installed on homeserver
- Docker and Docker Compose installed
- Domain registered and pointed to Cloudflare nameservers

## Step 1: Install Cloudflared

### On Linux (Homeserver)

```bash
# Download and install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Verify installation
cloudflared --version
```

### Alternative: Using Homebrew
```bash
brew install cloudflare/cloudflare/cloudflared
```

## Step 2: Authenticate with Cloudflare

```bash
# Login to your Cloudflare account
cloudflared login

# Follow the browser prompt to authorize
# A certificate will be saved to ~/.cloudflared/cert.pem
```

## Step 3: Create Tunnel Configuration

### Create directory for tunnel config
```bash
mkdir -p ~/.cloudflared
cd ~/.cloudflared
```

### Create `config.yml`

```yaml
tunnel: sports-week-tunnel
credentials-file: /home/USER/.cloudflared/sports-week-tunnel.json

ingress:
  - hostname: project-sports.krishombasukala.com.np
    service: https://localhost
    originRequest:
      originServerName: project-sports.krishombasukala.com.np
      noTLSVerify: false
  - service: http_status:404
```

**Replace `USER` with your username**

### Find Tunnel ID
```bash
# Create tunnel (will generate ID)
cloudflared tunnel create sports-week-tunnel

# Get the credentials file location - save it
# Then delete and recreate with proper config
cloudflared tunnel delete sports-week-tunnel
```

## Step 4: Create Tunnel with Proper Settings

```bash
# Create the tunnel
cloudflared tunnel create sports-week-tunnel

# You'll get a tunnel ID like: abcd1234-ef56-7890-ijkl-mnopqrstuvwx
# Save this output, you'll need the credentials JSON file
```

## Step 5: DNS Configuration in Cloudflare

### Option A: Using CNAME (Recommended)
```bash
# Run this command which sets up DNS automatically
cloudflared tunnel route dns sports-week-tunnel project-sports.krishombasukala.com.np
```

### Option B: Manual DNS Setup
1. Go to Cloudflare Dashboard
2. Select your domain: krishombasukala.com.np
3. Go to DNS records
4. Add new CNAME record:
   - Name: `project-sports`
   - Content: `<tunnel-id>.cfargotunnel.com`
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

## Step 6: Deploy with Docker Compose

### 1. Setup Environment File

```bash
cd /path/to/Sports-Week-Management-Tool
cp .env.example .env.homeserver
```

### 2. Edit `.env.homeserver`

```bash
# Database Configuration
DB_NAME=sports_week
DB_USER=sports
DB_PASSWORD=$(openssl rand -base64 32)  # Generate strong password
DB_PORT=5433

# Backend Configuration
JWT_SECRET=$(openssl rand -base64 32)  # Generate strong secret
PORT=3001
NODE_ENV=production

# Frontend Configuration  
WEB_PORT=5173

# Domain Configuration
DOMAIN=project-sports.krishombasukala.com.np
```

### 3. Create SSL certificates (self-signed for internal use)

```bash
# Create ssl directory
mkdir -p ssl

# Generate self-signed certificate (for nginx internal use)
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
  -subj "/C=NP/ST=State/L=City/O=Organization/CN=project-sports.krishombasukala.com.np"
```

### 4. Start Services

```bash
# Using the homeserver compose file
docker compose -f docker-compose.homeserver.yml --env-file .env.homeserver up -d

# Wait for services to start (usually 30-60 seconds)
sleep 30

# Check status
docker compose -f docker-compose.homeserver.yml ps
```

### 5. Verify All Services

```bash
# Check if all containers are healthy
docker compose -f docker-compose.homeserver.yml ps

# View logs
docker compose -f docker-compose.homeserver.yml logs -f

# Test endpoints
curl http://localhost:3001/api/health
curl http://localhost:5173
```

## Step 7: Run Cloudflared Tunnel

### Option A: Foreground (Testing)

```bash
cloudflared tunnel run sports-week-tunnel
```

### Option B: Background Service (Production)

```bash
# Install as systemd service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable on startup
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

## Step 8: Verify External Access

```bash
# Test tunnel connectivity
cloudflared tunnel status sports-week-tunnel

# Test from external machine (or wait a minute for DNS propagation)
curl https://project-sports.krishombasukala.com.np

# Test API
curl https://project-sports.krishombasukala.com.np/api/health
```

## Access Your Application

- **Web App**: https://project-sports.krishombasukala.com.np
- **API**: https://project-sports.krishombasukala.com.np/api
- **Available internally on ports**: 
  - Frontend: 5173
  - Backend: 3001
  - Database: 5433

## Cloudflare Tunnel Security Features

- **Zero Trust**: No open ports on homeserver
- **Automatic HTTPS**: Cloudflare handles SSL/TLS
- **DDoS Protection**: Cloudflare's network shields you
- **WAF Rules**: Can add Web Application Firewall rules
- **Analytics**: View traffic in Cloudflare dashboard

## Monitoring & Maintenance

### Monitor Tunnel

```bash
# Check tunnel status
cloudflared tunnel status sports-week-tunnel

# View recent connections
cloudflared tunnel logs sports-week-tunnel
```

### View Service Logs

```bash
# All services
docker compose -f docker-compose.homeserver.yml logs -f

# Specific service
docker compose -f docker-compose.homeserver.yml logs -f backend
docker compose -f docker-compose.homeserver.yml logs -f frontend
docker compose -f docker-compose.homeserver.yml logs -f postgres
docker compose -f docker-compose.homeserver.yml logs -f nginx
```

### Database Backup

```bash
# Backup database through tunnel
docker compose -f docker-compose.homeserver.yml exec postgres pg_dump -U sports sports_week > backup-$(date +%Y%m%d).sql

# Restore from backup
docker compose -f docker-compose.homeserver.yml exec -T postgres psql -U sports sports_week < backup.sql
```

## Troubleshooting

### Tunnel Not Connecting

```bash
# Check if cloudflared can reach Cloudflare
cloudflared tunnel run sports-week-tunnel

# Should show connection status
# If fails, check:
# 1. Internet connection
# 2. Firewall rules (ensure HTTPS outbound allowed)
# 3. Cloudflare API credentials valid
```

### DNS Not Resolving

```bash
# Flush DNS cache
sudo systemctl restart systemd-resolved

# Or use nslookup to test
nslookup project-sports.krishombasukala.com.np

# Should resolve to your tunnel IP
```

### Services Returning 502 Bad Gateway

```bash
# Check if backend/frontend are running
docker compose -f docker-compose.homeserver.yml ps

# Check nginx logs
docker compose -f docker-compose.homeserver.yml logs nginx

# Verify services are healthy
docker compose -f docker-compose.homeserver.yml exec frontend wget -q -O - http://localhost:5173 | head -20
```

### High Memory Usage

```bash
# Check container resource usage
docker compose -f docker-compose.homeserver.yml stats

# If high, restart non-database services
docker compose -f docker-compose.homeserver.yml restart frontend backend
```

## Advanced: Custom Cloudflare Rules

### In Cloudflare Dashboard:

1. **Cache Rules**:
   - Cache static assets for 30 days
   - Set TTL for API responses

2. **Firewall Rules**:
   - Block suspicious traffic patterns
   - Require authentication for admin endpoints

3. **Page Rules**:
   - Set cache levels
   - Add custom headers
   - Force HTTPS

## Automation: Auto-start on Reboot

### 1. Create systemd service for Docker Compose

Create `/etc/systemd/system/sports-week.service`:

```ini
[Unit]
Description=Sports Week Management Tool
Requires=docker.service
After=docker.service

[Service]
Type=simple
WorkingDirectory=/path/to/Sports-Week-Management-Tool
ExecStart=/usr/bin/docker compose -f docker-compose.homeserver.yml --env-file .env.homeserver up
ExecStop=/usr/bin/docker compose -f docker-compose.homeserver.yml down
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Replace `/path/to/` with actual path.

### 2. Enable auto-start

```bash
sudo systemctl daemon-reload
sudo systemctl enable sports-week.service
sudo systemctl start sports-week.service
```

## Architecture Diagram

```
Internet (CloudFlare)
    ↓
Cloudflared Tunnel (No open ports!)
    ↓
Nginx Reverse Proxy (443 SSL)
    ├─→ Frontend (5173, Bun)
    ├─→ Backend (3001, Express + Bun)
    └─→ PostgreSQL (5432, Alpine)
```

## Security Best Practices

1. ✅ Never expose ports directly to internet
2. ✅ Use strong JWT_SECRET and DB_PASSWORD
3. ✅ Keep cloudflared and Docker updated
4. ✅ Monitor Cloudflare analytics for attacks
5. ✅ Regular database backups
6. ✅ Enable 2FA on Cloudflare account
7. ✅ Use WAF rules in Cloudflare
8. ✅ Rate limit sensitive endpoints

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/cloudflare-one/
- **Cloudflared Repo**: https://github.com/cloudflare/cloudflared
- **Project Repo**: https://github.com/krish-om/Sports-Week-Management-Tool

---

**Setup Date**: 2026
**Target Environment**: Homeserver with Cloudflare Tunnel
**Status**: Ready for deployment
