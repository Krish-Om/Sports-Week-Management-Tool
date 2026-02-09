# ✅ Tailscale Deployment Checklist

Use this checklist to ensure a smooth deployment of your Sports Week Management Tool on your Ubuntu home server.

---

## 📋 Pre-Deployment Checklist

### System Requirements
- [ ] Ubuntu Linux installed (16.04+ or newer)
- [ ] Minimum 2GB RAM available
- [ ] Minimum 10GB free disk space
- [ ] Stable internet connection
- [ ] Sudo/root access

### Account Setup
- [ ] GitHub account (for pulling Docker images)
- [ ] Tailscale account created (https://login.tailscale.com/)
- [ ] Email for Tailscale verification

---

## 🔧 Installation Checklist

### Step 1: Install Docker
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

- [ ] Docker installed successfully (`docker --version` works)
- [ ] Docker Compose installed (`docker compose version` works)
- [ ] Current user added to docker group
- [ ] Logged out and back in (or run `newgrp docker`)

### Step 2: Install Tailscale
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

- [ ] Tailscale installed successfully
- [ ] Tailscale authentication completed in browser
- [ ] Can view Tailscale status (`tailscale status`)
- [ ] Device shows up in Tailscale admin panel

### Step 3: Clone Repository
```bash
cd ~
git clone https://github.com/Krish-Om/Sports-Week-Management-Tool.git
cd Sports-Week-Management-Tool
```

- [ ] Repository cloned successfully
- [ ] In correct directory (`pwd` shows project path)
- [ ] Can see project files (`ls -la`)

### Step 4: Run Deployment Script
```bash
chmod +x deploy-tailscale.sh
./deploy-tailscale.sh
```

- [ ] Script has execute permission
- [ ] Script ran without errors
- [ ] .env file created
- [ ] SSL certificates created
- [ ] Docker images pulled

---

## 🚀 Post-Deployment Checklist

### Verify Services

```bash
docker compose -f docker-compose.homeserver.yml ps
```

- [ ] All 4 containers running (postgres, backend, frontend, nginx)
- [ ] Containers show "Up" status
- [ ] Health checks passing (if shown)

### Test Local Access

```bash
curl http://localhost/health
curl http://localhost:3001/api/health
```

- [ ] Nginx responds with "healthy"
- [ ] Backend API accessible
- [ ] Frontend loads in browser (http://localhost)

### Test Tailscale Access

```bash
tailscale status  # Get your URL
```

- [ ] Can access app via Tailscale URL: `http://<device>.tail-scale.ts.net`
- [ ] Login page loads
- [ ] Can navigate between pages
- [ ] No console errors in browser

### Test Real-Time Features

- [ ] Can create/update matches (if admin)
- [ ] Live scores update without refresh
- [ ] WebSocket connection established (check browser console)
- [ ] Leaderboard updates automatically

---

## 🌐 Public Access Checklist (Optional)

### Enable Tailscale Funnel

```bash
tailscale funnel 80
```

- [ ] Funnel enabled successfully
- [ ] Can access via public URL: `https://<device>.ts.net`
- [ ] HTTPS works (lock icon in browser)
- [ ] External users (not on Tailscale) can access

### Alternative: Add Users to Network

- [ ] Invited users via Tailscale admin panel
- [ ] Users received invitation email
- [ ] Users installed Tailscale and joined
- [ ] Users can access via Tailscale URL

---

## 🔒 Security Checklist

### Firewall Configuration

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow from 100.64.0.0/10
sudo ufw status
```

- [ ] UFW firewall enabled
- [ ] SSH access allowed
- [ ] Tailscale subnet allowed
- [ ] Other incoming ports blocked

### Credentials

- [ ] .env file contains strong passwords (not defaults)
- [ ] JWT_SECRET is random and secure
- [ ] DB_PASSWORD is strong
- [ ] .env file permissions restricted (`chmod 600 .env`)

### Updates

```bash
sudo apt update && sudo apt upgrade -y
```

- [ ] System packages updated
- [ ] Docker updated to latest
- [ ] Tailscale updated (`sudo tailscale update`)

---

## 📊 Monitoring Checklist

### Log Monitoring

```bash
docker compose -f docker-compose.homeserver.yml logs -f
```

- [ ] Can view logs in real-time
- [ ] No critical errors in logs
- [ ] Database connection successful
- [ ] Socket.io connections working

### Resource Monitoring

```bash
docker stats
df -h
free -h
```

- [ ] Containers using reasonable resources
- [ ] Disk space sufficient (>5GB free)
- [ ] Memory usage acceptable (<80%)
- [ ] CPU usage normal

### Health Checks

```bash
# Check every 5 minutes
watch -n 300 'curl -s http://localhost/health'
```

- [ ] Health endpoint responds consistently
- [ ] Services remain up over time
- [ ] No container restarts (`docker ps` uptime column)

---

## 🔄 Backup Checklist

### Database Backup

```bash
# Create backup
docker exec sports-week-db pg_dump -U sports_user sports_week > backup.sql

# Verify backup
ls -lh backup.sql
```

- [ ] Backup script created
- [ ] Can create database backups
- [ ] Backups stored safely
- [ ] Tested restore process once

### Configuration Backup

```bash
# Backup important files
tar -czf config-backup.tar.gz .env docker-compose.homeserver.yml nginx.conf
```

- [ ] .env file backed up
- [ ] docker-compose backed up
- [ ] nginx.conf backed up
- [ ] Backups stored off-server

---

## 🚨 Troubleshooting Checklist

### If Services Won't Start

- [ ] Checked logs: `docker compose -f docker-compose.homeserver.yml logs`
- [ ] Verified ports not in use: `sudo lsof -i :80,3001,5173`
- [ ] Restarted Docker: `sudo systemctl restart docker`
- [ ] Removed old containers: `docker compose down && docker compose up -d`

### If Can't Connect via Tailscale

- [ ] Tailscale is running: `tailscale status`
- [ ] Device shows as online in admin panel
- [ ] MagicDNS is enabled (check Tailscale admin)
- [ ] Restarted Tailscale: `sudo systemctl restart tailscaled`

### If Database Connection Fails

- [ ] Postgres container is running: `docker ps | grep postgres`
- [ ] Database logs checked: `docker logs sports-week-db`
- [ ] Can connect manually: `docker exec -it sports-week-db psql -U sports_user sports_week`
- [ ] .env database credentials match docker-compose

### If Frontend Can't Connect to Backend

- [ ] VITE_API_URL in .env matches Tailscale hostname
- [ ] VITE_SOCKET_URL in .env is correct
- [ ] Rebuilt frontend after .env change: `docker compose up -d --build frontend`
- [ ] nginx.conf proxy settings correct

---

## 📈 Performance Checklist

### Optimization

- [ ] Docker images pruned: `docker image prune -f`
- [ ] Unused volumes removed: `docker volume prune -f`
- [ ] System logs rotated
- [ ] Database vacuumed (if large dataset)

### Scaling Preparation

- [ ] Documented current resource usage
- [ ] Identified bottlenecks
- [ ] Planned upgrade path if needed
- [ ] Backup and restore tested

---

## 📚 Documentation Checklist

### For Your Team

- [ ] Shared Tailscale URL with users
- [ ] Created user guide for accessing app
- [ ] Documented admin credentials (securely)
- [ ] Explained how to report issues

### For Maintenance

- [ ] Documented deployment process
- [ ] Created backup/restore procedure
- [ ] Listed common issues and solutions
- [ ] Scheduled regular maintenance tasks

---

## ✅ Final Verification

Before going live:

- [ ] Tested all major features
  - [ ] Login/logout
  - [ ] Create faculty/team/player
  - [ ] Schedule matches
  - [ ] Update scores
  - [ ] View leaderboards
  - [ ] Real-time updates

- [ ] Tested on multiple devices
  - [ ] Desktop browser
  - [ ] Mobile browser
  - [ ] iPad/tablet

- [ ] Security verified
  - [ ] Strong passwords set
  - [ ] Firewall configured
  - [ ] Only necessary ports open
  - [ ] SSL/TLS working (if using HTTPS)

- [ ] Performance acceptable
  - [ ] Pages load quickly (<2 seconds)
  - [ ] Real-time updates instant
  - [ ] Multiple concurrent users tested

- [ ] Backup working
  - [ ] Database backup successful
  - [ ] Restore tested once
  - [ ] Backup schedule set

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ All services running (4/4 containers up)  
✅ App accessible via Tailscale URL  
✅ Login works  
✅ Can create/edit data  
✅ Real-time updates working  
✅ Mobile access works  
✅ Backups configured  
✅ Team can access  

**Congratulations! Your Sports Week Management Tool is live! 🏆**

---

## 📞 Getting Help

If you encounter issues:

1. **Check logs**: `docker compose -f docker-compose.homeserver.yml logs -f`
2. **Review**: [TAILSCALE_DEPLOYMENT.md](TAILSCALE_DEPLOYMENT.md)
3. **Troubleshooting**: See the troubleshooting section in the deployment guide
4. **Community**: Check GitHub issues or discussions

---

## 🔄 Regular Maintenance Schedule

### Daily
- [ ] Check if services are running: `docker ps`
- [ ] Quick health check: `curl http://localhost/health`

### Weekly
- [ ] Review logs for errors
- [ ] Check disk space: `df -h`
- [ ] Verify backups working

### Monthly
- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Update Docker images
- [ ] Test backup restore
- [ ] Review security settings

---

**Keep this checklist handy during deployment and maintenance!**
