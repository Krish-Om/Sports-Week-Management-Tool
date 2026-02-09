# 📦 Tailscale Deployment Package - Summary

## What Was Created

This package contains everything you need to self-host your Sports Week Management Tool on your Ubuntu home server using Tailscale.

---

## 📁 New Files Created

### 🚀 Deployment Scripts

1. **deploy-tailscale.sh** (⭐ Main deployment script)
   - Automated one-command deployment
   - Checks all prerequisites
   - Installs Tailscale if needed
   - Configures environment automatically
   - Starts all Docker services
   - Executable and ready to use

### 📚 Documentation

2. **TAILSCALE_DEPLOYMENT.md** (Complete guide)
   - Step-by-step installation instructions
   - Detailed explanations of each step
   - Troubleshooting section
   - Security best practices
   - Management and maintenance guide

3. **QUICK_START_TAILSCALE.md** (Quick reference)
   - TL;DR version
   - Essential commands only
   - Quick troubleshooting
   - One-line install option

4. **DEPLOYMENT_COMPARISON.md** (Decision guide)
   - Tailscale vs Cloudflare comparison
   - Pros and cons of each approach
   - Use case recommendations
   - Migration paths

5. **DEPLOYMENT_CHECKLIST.md** (Verification guide)
   - Pre-deployment checklist
   - Installation verification steps
   - Post-deployment checks
   - Regular maintenance schedule

6. **ARCHITECTURE.md** (Technical overview)
   - System architecture diagrams
   - Data flow explanations
   - Network topology
   - Scaling options

### 🔧 Configuration Files

7. **nginx.conf** (Fixed and improved)
   - Proper reverse proxy configuration
   - WebSocket support for Socket.io
   - Static asset caching
   - Health check endpoint

---

## 🎯 What to Do Next

### Option 1: Automated Deployment (Recommended)

```bash
# 1. Navigate to your project
cd ~/Sports-Week-Management-Tool

# 2. Run the deployment script
./deploy-tailscale.sh

# That's it! Follow the prompts
```

### Option 2: Manual Step-by-Step

Follow the guide in [TAILSCALE_DEPLOYMENT.md](TAILSCALE_DEPLOYMENT.md)

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites

Your Dell laptop with Ubuntu needs:
- Internet connection
- Sudo access
- At least 2GB RAM free
- At least 10GB disk space

### Installation Steps

```bash
# 1. Install Docker (if not installed)
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker

# 2. Install Tailscale (if not installed)
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
# Follow the browser link to authenticate

# 3. Clone repository (if not already)
cd ~
git clone https://github.com/Krish-Om/Sports-Week-Management-Tool.git
cd Sports-Week-Management-Tool

# 4. Deploy!
chmod +x deploy-tailscale.sh
./deploy-tailscale.sh

# 5. Get your URL
tailscale status
# Look for your device name, e.g., dell-laptop.tail-scale.ts.net

# 6. Access your app
# Open browser to: http://<your-device>.tail-scale.ts.net
```

---

## 🌐 Making It Publicly Accessible

### Option A: Add Users to Tailscale Network (Recommended)

1. Go to https://login.tailscale.com/admin/users
2. Click "Invite"
3. Share invite link with students/faculty
4. They install Tailscale and join your network
5. They can access: `http://<your-device>.tail-scale.ts.net`

**Advantages:**
- Private and secure
- No rate limits
- Perfect for college events
- Easy to manage

### Option B: Enable Tailscale Funnel (Public Access)

```bash
# Enable public HTTPS access
tailscale funnel 80

# Now accessible at: https://<your-device>.ts.net
# No Tailscale needed for users!
```

**Advantages:**
- Public URL (anyone can access)
- Automatic HTTPS
- No app installation needed

**Limitations:**
- Subject to fair use limits
- Some rate limiting may apply

---

## 📊 What Happens During Deployment

The deploy-tailscale.sh script will:

1. ✅ Check if Docker is installed (installs if needed)
2. ✅ Check if Tailscale is installed (installs if needed)
3. ✅ Get your Tailscale hostname and IP
4. ✅ Generate secure passwords (JWT secret, database password)
5. ✅ Create .env file with Tailscale URL configured
6. ✅ Set up SSL certificates
7. ✅ Pull Docker images from GitHub Container Registry
8. ✅ Start all services (postgres, backend, frontend, nginx)
9. ✅ Wait for services to be healthy
10. ✅ Display your access URLs

Total time: **~5 minutes**

---

## 🎯 Expected Outcome

After running the deployment script, you'll have:

### Running Services

```bash
docker ps
# Should show 4 containers:
# - sports-week-db (PostgreSQL)
# - sports-week-api (Backend)
# - sports-week-web (Frontend)
# - sports-week-proxy (Nginx)
```

### Access URLs

- **Local**: http://localhost
- **Tailscale**: http://<your-device>.tail-scale.ts.net
- **Public** (if Funnel enabled): https://<your-device>.ts.net

### What You Can Do

1. ✅ Access from any device on Tailscale network
2. ✅ Share URL with students/faculty
3. ✅ Log in as admin
4. ✅ Create games, teams, matches
5. ✅ Update scores in real-time
6. ✅ View live leaderboards
7. ✅ Access from mobile devices

---

## 🔒 Security Features

Your deployment includes:

1. **Tailscale Encryption**
   - WireGuard VPN protocol
   - End-to-end encryption
   - Device authentication

2. **Firewall Protection**
   - UFW configured
   - Only Tailscale traffic allowed
   - No ports exposed to internet

3. **Strong Credentials**
   - Auto-generated JWT secret
   - Secure database password
   - No default credentials

4. **Docker Isolation**
   - Services in private network
   - No direct external access
   - Container-to-container communication only

---

## 📋 Verification Steps

After deployment, verify everything works:

### 1. Check Services
```bash
docker compose -f docker-compose.homeserver.yml ps
# All should show "Up" or "running"
```

### 2. Test Health
```bash
curl http://localhost/health
# Should return: healthy
```

### 3. Test Tailscale Access
```bash
# Get your URL
tailscale status

# Open in browser
# http://<your-device>.tail-scale.ts.net
```

### 4. Test Login
- Open the app
- Navigate to login page
- Default credentials should work (if you've seeded the database)

### 5. Test Real-Time
- Open app on two devices
- Update a score as admin
- Watch it update live on the other device

---

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker compose -f docker-compose.homeserver.yml logs -f

# Specific service
docker compose -f docker-compose.homeserver.yml logs -f backend
```

### Restart Services
```bash
# All services
docker compose -f docker-compose.homeserver.yml restart

# Specific service
docker compose -f docker-compose.homeserver.yml restart backend
```

### Stop Services
```bash
docker compose -f docker-compose.homeserver.yml down
```

### Update Application
```bash
# Pull latest images
docker pull ghcr.io/krish-om/sports-week-frontend:latest
docker pull ghcr.io/krish-om/sports-week-backend:latest

# Recreate containers
docker compose -f docker-compose.homeserver.yml up -d --force-recreate
```

### Backup Database
```bash
# Create backup
docker exec sports-week-db pg_dump -U sports_user sports_week > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20260209.sql | docker exec -i sports-week-db psql -U sports_user sports_week
```

---

## 🚨 Troubleshooting

### Script Shows "Tailscale not authenticated"

```bash
# Authenticate Tailscale
sudo tailscale up

# Follow the browser link
# Then run deployment script again
```

### Services Won't Start

```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :3001

# Check logs
docker compose -f docker-compose.homeserver.yml logs

# Restart Docker
sudo systemctl restart docker
```

### Can't Access via Tailscale URL

```bash
# Check Tailscale status
tailscale status

# Restart Tailscale
sudo systemctl restart tailscaled

# Verify MagicDNS is enabled
# Go to: https://login.tailscale.com/admin/dns
```

### Frontend Can't Connect to Backend

```bash
# Rebuild frontend with correct environment variables
docker compose -f docker-compose.homeserver.yml up -d --build frontend

# Check .env file has correct Tailscale URLs
cat .env | grep VITE
```

---

## 📚 Documentation Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **QUICK_START_TAILSCALE.md** | Quick commands | First read |
| **TAILSCALE_DEPLOYMENT.md** | Complete guide | Detailed setup |
| **DEPLOYMENT_CHECKLIST.md** | Verification steps | During deployment |
| **DEPLOYMENT_COMPARISON.md** | Choose deployment method | Planning stage |
| **ARCHITECTURE.md** | Technical details | Understanding system |
| **README.md** | Project overview | General info |

---

## 💡 Best Practices

### For Your College Event

1. **Use Private Network Access**
   - Add students/faculty to Tailscale
   - More secure than public access
   - Easier to manage

2. **Test Before Event**
   - Deploy a week before
   - Test with a small group
   - Fix any issues early

3. **Monitor During Event**
   - Keep logs open: `docker compose logs -f`
   - Check resource usage: `docker stats`
   - Have backup plan ready

4. **Keep It Running**
   - Don't close laptop lid (disable sleep)
   - Keep laptop plugged in
   - Ensure stable internet connection

### General Maintenance

1. **Daily**: Quick health check
2. **Weekly**: Review logs, check disk space
3. **Monthly**: Update system, test backups
4. **Before Event**: Full testing, database backup

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ All 4 containers running
- ✅ Health endpoints responding
- ✅ Can access via Tailscale URL
- ✅ Login page loads
- ✅ Can create and update data
- ✅ Real-time updates working
- ✅ Mobile access works
- ✅ Multiple users can connect

---

## 🎓 Your Specific Setup

Based on your requirements:

- **Server**: Dell laptop running Ubuntu ✅
- **Network**: Tailscale mesh VPN ✅
- **Access**: Private (Tailscale network) + Optional public (Funnel) ✅
- **Cost**: $0 (all free tier) ✅
- **Setup Time**: ~5 minutes ✅
- **Maintenance**: Minimal ✅

**Perfect match for your needs!**

---

## 🚀 Ready to Deploy?

### Run This Now:

```bash
cd ~/Sports-Week-Management-Tool
./deploy-tailscale.sh
```

### After Deployment:

1. Note your Tailscale URL
2. Test access from multiple devices
3. Share URL with your team
4. Start managing your sports week!

---

## 📞 Support Resources

If you need help:

1. **Check Documentation**
   - Start with QUICK_START_TAILSCALE.md
   - Review TAILSCALE_DEPLOYMENT.md for details
   - Use DEPLOYMENT_CHECKLIST.md to verify

2. **Check Logs**
   ```bash
   docker compose -f docker-compose.homeserver.yml logs -f
   ```

3. **Common Issues**
   - See "Troubleshooting" section above
   - Check TAILSCALE_DEPLOYMENT.md troubleshooting section

4. **Community**
   - GitHub Issues
   - Tailscale Community Forum
   - Docker Community

---

## 🎉 That's It!

You now have everything you need to self-host your Sports Week Management Tool using Tailscale.

**Next Step**: Run `./deploy-tailscale.sh` and you'll be live in 5 minutes!

Good luck with your sports week event! 🏆

---

**Created**: February 9, 2026  
**Version**: 1.0  
**Status**: Ready for deployment ✅
