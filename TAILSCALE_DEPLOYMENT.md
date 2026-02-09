# 🚀 Self-Hosting Sports Week Management Tool with Tailscale

This guide will help you deploy the Sports Week Management Tool on your home server (Ubuntu) and make it accessible via Tailscale.

## 📋 Prerequisites

- Ubuntu server (Dell laptop in your case)
- Sudo access
- Internet connection
- Tailscale account (free tier works!)

---

## 🎯 Quick Start (TL;DR)

```bash
# 1. Install dependencies
sudo apt update && sudo apt install -y docker.io docker-compose-v2

# 2. Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# 3. Enable Tailscale HTTPS
sudo tailscale cert $(tailscale status --json | jq -r '.Self.DNSName')

# 4. Clone and deploy
git clone <your-repo-url>
cd Sports-Week-Management-Tool
bash deploy-tailscale.sh
```

---

## 📦 Step-by-Step Installation

### Step 1: Install Docker & Docker Compose

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose V2
sudo apt install -y docker-compose-v2

# Verify installations
docker --version
docker compose version

# Restart session for group changes to take effect
newgrp docker
```

### Step 2: Install Tailscale

Tailscale creates a secure private network (mesh VPN) for your devices.

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale and authenticate
sudo tailscale up

# Follow the link to authenticate in your browser
# This links your device to your Tailscale account
```

**What this does:**
- Creates a private network (100.x.x.x addresses)
- Your server gets a stable hostname like `dell-laptop.tail-scale.ts.net`
- All connections are encrypted end-to-end

### Step 3: Enable MagicDNS and HTTPS Certificates (Optional but Recommended)

```bash
# Enable MagicDNS (allows using device names instead of IPs)
# Go to: https://login.tailscale.com/admin/dns
# Enable MagicDNS

# Get your Tailscale hostname
tailscale status

# Request HTTPS certificate from Tailscale
sudo tailscale cert $(tailscale status --json | jq -r '.Self.DNSName')

# This creates certificates in /var/lib/tailscale/certs/
```

### Step 4: Clone Repository

```bash
# Navigate to your preferred directory
cd ~

# Clone the repository
git clone https://github.com/Krish-Om/Sports-Week-Management-Tool.git
cd Sports-Week-Management-Tool
```

### Step 5: Configure Environment Variables

```bash
# Create environment file
cp .env.example .env

# Generate secure secrets
export JWT_SECRET=$(openssl rand -base64 32)
export DB_PASSWORD=$(openssl rand -base64 24)

# Edit .env file
nano .env
```

**Update the following in `.env`:**

```bash
# Database Configuration
DB_NAME=sports_week
DB_USER=sports_user
DB_PASSWORD=<paste DB_PASSWORD from above>
DB_PORT=5433

# Backend Configuration
JWT_SECRET=<paste JWT_SECRET from above>
PORT=3001
NODE_ENV=production

# Frontend Configuration - Use your Tailscale hostname
VITE_API_URL=http://$(tailscale status --json | jq -r '.Self.DNSName')/api
VITE_SOCKET_URL=http://$(tailscale status --json | jq -r '.Self.DNSName')
FRONTEND_URL=http://$(tailscale status --json | jq -r '.Self.DNSName')
```

Or use this command to auto-populate:

```bash
# Get your Tailscale hostname
TAILSCALE_HOST=$(tailscale status --json | jq -r '.Self.DNSName')

# Create .env with proper values
cat > .env << EOF
# Database Configuration
DB_NAME=sports_week
DB_USER=sports_user
DB_PASSWORD=$(openssl rand -base64 24)

# Backend Configuration
JWT_SECRET=$(openssl rand -base64 32)
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=http://${TAILSCALE_HOST}

# Frontend Configuration (will be baked into the build)
VITE_API_URL=http://${TAILSCALE_HOST}/api
VITE_SOCKET_URL=http://${TAILSCALE_HOST}
EOF

echo "✓ .env file created with Tailscale hostname: $TAILSCALE_HOST"
```

### Step 6: Create SSL Certificates (if not using Tailscale HTTPS)

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate (for local use)
openssl req -x509 -newkey rsa:4096 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -days 365 -nodes \
  -subj "/C=NP/ST=Kathmandu/L=Kathmandu/O=SportsWeek/CN=$(tailscale status --json | jq -r '.Self.DNSName')"

echo "✓ Self-signed SSL certificates created"
```

**Or use Tailscale certificates:**

```bash
# Copy Tailscale certs to project directory
mkdir -p ssl
TAILSCALE_HOST=$(tailscale status --json | jq -r '.Self.DNSName')
sudo cp "/var/lib/tailscale/certs/${TAILSCALE_HOST}.crt" ssl/cert.pem
sudo cp "/var/lib/tailscale/certs/${TAILSCALE_HOST}.key" ssl/key.pem
sudo chown $USER:$USER ssl/*.pem
```

### Step 7: Deploy with Docker Compose

```bash
# Pull latest images from GitHub Container Registry
docker pull ghcr.io/krish-om/sports-week-frontend:latest
docker pull ghcr.io/krish-om/sports-week-backend:latest

# Start all services
docker compose -f docker-compose.homeserver.yml up -d

# Check service status
docker compose -f docker-compose.homeserver.yml ps

# View logs
docker compose -f docker-compose.homeserver.yml logs -f
```

### Step 8: Verify Deployment

```bash
# Check all containers are running
docker ps

# Test backend health
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost:5173

# Test nginx proxy
curl http://localhost:80
```

### Step 9: Access Your Application

1. **From any device on Tailscale network:**
   ```
   http://<your-server-hostname>.tail-scale.ts.net
   ```
   Example: `http://dell-laptop.tail-scale.ts.net`

2. **Get your Tailscale hostname:**
   ```bash
   tailscale status
   ```

3. **Share access with others:**
   - Invite users to your Tailscale network (free for up to 100 devices)
   - Or enable Tailscale Funnel for public access (see below)

---

## 🌐 Making Your App Publicly Accessible

### Option 1: Tailscale Funnel (Easiest - Public HTTPS)

Tailscale Funnel exposes your service to the public internet with automatic HTTPS.

```bash
# Enable Funnel for your service
tailscale funnel 80

# Or for HTTPS on port 443
tailscale funnel 443
```

**What this does:**
- Creates a public URL: `https://<hostname>.ts.net`
- Automatic HTTPS certificates
- DDoS protection included
- No port forwarding needed
- Can be toggled on/off anytime

**Limitations:**
- Subject to Tailscale's fair use policy
- Some rate limiting may apply
- Check Tailscale's current pricing/limits

### Option 2: Tailscale Share Links

Share temporary access without adding users to your network:

```bash
# Create a share link (24-hour access)
tailscale share http://localhost:80

# Share the generated link with users
```

### Option 3: Add Users to Your Tailscale Network

1. Go to https://login.tailscale.com/admin/users
2. Invite users via email
3. They install Tailscale and access your server hostname
4. Free tier supports up to 100 devices

---

## 🔧 Management & Maintenance

### View Logs

```bash
# All services
docker compose -f docker-compose.homeserver.yml logs -f

# Specific service
docker compose -f docker-compose.homeserver.yml logs -f backend
docker compose -f docker-compose.homeserver.yml logs -f frontend
docker compose -f docker-compose.homeserver.yml logs -f postgres
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.homeserver.yml restart

# Restart specific service
docker compose -f docker-compose.homeserver.yml restart backend
```

### Update Application

```bash
# Pull latest images
docker pull ghcr.io/krish-om/sports-week-frontend:latest
docker pull ghcr.io/krish-om/sports-week-backend:latest

# Recreate containers with new images
docker compose -f docker-compose.homeserver.yml up -d --force-recreate

# Clean up old images
docker image prune -f
```

### Stop Services

```bash
# Stop all services
docker compose -f docker-compose.homeserver.yml down

# Stop and remove volumes (⚠️ deletes database!)
docker compose -f docker-compose.homeserver.yml down -v
```

### Database Backup

```bash
# Backup database
docker exec sports-week-db pg_dump -U sports_user sports_week > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
cat backup_20260209_120000.sql | docker exec -i sports-week-db psql -U sports_user sports_week
```

### System Resource Monitoring

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

---

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Only allow local connections (Tailscale handles external)
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow from 100.64.0.0/10  # Tailscale network

# Check status
sudo ufw status
```

### 2. Change Default Credentials

```bash
# Generate strong passwords
openssl rand -base64 32

# Update in .env file
nano .env
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Tailscale
sudo tailscale update

# Update Docker images (see Update Application section above)
```

### 4. Enable Auto-Updates (Optional)

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🚨 Troubleshooting

### Services Not Starting

```bash
# Check service logs
docker compose -f docker-compose.homeserver.yml logs

# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :3001
sudo lsof -i :5173

# Restart Docker
sudo systemctl restart docker
```

### Cannot Connect via Tailscale

```bash
# Check Tailscale status
tailscale status

# Restart Tailscale
sudo systemctl restart tailscaled

# Re-authenticate
sudo tailscale up
```

### Database Connection Issues

```bash
# Check if postgres is healthy
docker compose -f docker-compose.homeserver.yml ps

# View postgres logs
docker logs sports-week-db

# Verify connection
docker exec -it sports-week-db psql -U sports_user -d sports_week
```

### Frontend Can't Connect to Backend

1. Check environment variables in `.env`
2. Ensure VITE_API_URL matches your Tailscale hostname
3. Rebuild frontend if env vars changed:
   ```bash
   docker compose -f docker-compose.homeserver.yml up -d --build frontend
   ```

### Socket.io Connection Issues

```bash
# Check nginx logs
docker logs sports-week-proxy

# Verify WebSocket upgrade headers
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://localhost/socket.io/
```

---

## 📊 Service URLs

| Service | Internal URL | External URL (via Tailscale) |
|---------|-------------|------------------------------|
| Frontend | http://localhost:5173 | http://<hostname>.ts.net |
| Backend API | http://localhost:3001/api | http://<hostname>.ts.net/api |
| Nginx Proxy | http://localhost:80 | http://<hostname>.ts.net |
| Database | localhost:5432 (internal) | Not exposed |

---

## 🔄 Automated Deployment Script

I'll create a deployment script for you:

```bash
chmod +x deploy-tailscale.sh
./deploy-tailscale.sh
```

---

## 📚 Additional Resources

- [Tailscale Documentation](https://tailscale.com/kb/)
- [Tailscale Funnel Guide](https://tailscale.com/kb/1223/tailscale-funnel/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 💡 Tips

1. **Keep your server running 24/7** for continuous access
2. **Enable unattended upgrades** for automatic security updates
3. **Set up monitoring** (consider Uptime Kuma or similar)
4. **Regular backups** of your database
5. **Use Tailscale SSH** for secure remote management:
   ```bash
   tailscale ssh dell-laptop
   ```

---

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] Tailscale installed and authenticated
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Containers running (docker ps shows all healthy)
- [ ] Can access app via Tailscale hostname
- [ ] WebSocket connection working (real-time updates)
- [ ] Database accessible and seeded
- [ ] Backups configured

---

## 🎉 You're Done!

Your Sports Week Management Tool is now:
- ✅ Running on your home server
- ✅ Accessible via Tailscale network
- ✅ Secured with encryption
- ✅ Ready for production use

Access your app at: `http://<your-hostname>.tail-scale.ts.net`

Need help? Check the [main README](README.md) or [troubleshooting section](#-troubleshooting) above.
