# 🚀 Quick Start Guide - Tailscale Deployment

## One-Line Install

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Krish-Om/Sports-Week-Management-Tool/main/deploy-tailscale.sh)
```

## Manual Installation (5 Minutes)

### 1. Install Dependencies (Ubuntu)
```bash
# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

### 2. Deploy Application
```bash
# Clone repository
git clone https://github.com/Krish-Om/Sports-Week-Management-Tool.git
cd Sports-Week-Management-Tool

# Run deployment script
chmod +x deploy-tailscale.sh
./deploy-tailscale.sh
```

### 3. Access Your App
```bash
# Get your Tailscale URL
tailscale status

# Access at: http://<your-device>.tail-scale.ts.net
```

## 🌐 Making It Public

### Enable Tailscale Funnel (Recommended)
```bash
tailscale funnel 80
```
Now anyone can access: `https://<your-device>.ts.net`

### Alternative: Add Users to Your Network
1. Go to https://login.tailscale.com/admin/users
2. Invite users (up to 100 devices free)
3. They can access your app after joining

## 📊 Management

```bash
# View logs
docker compose -f docker-compose.homeserver.yml logs -f

# Restart services
docker compose -f docker-compose.homeserver.yml restart

# Stop services
docker compose -f docker-compose.homeserver.yml down

# Update application
docker pull ghcr.io/krish-om/sports-week-frontend:latest
docker pull ghcr.io/krish-om/sports-week-backend:latest
docker compose -f docker-compose.homeserver.yml up -d --force-recreate
```

## 🔧 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker compose -f docker-compose.homeserver.yml logs

# Check ports
sudo lsof -i :80
```

### Can't Connect via Tailscale
```bash
# Check Tailscale status
tailscale status

# Restart Tailscale
sudo systemctl restart tailscaled
```

### Database Issues
```bash
# Check postgres logs
docker logs sports-week-db

# Connect to database
docker exec -it sports-week-db psql -U sports_user -d sports_week
```

## 📚 Full Documentation
See [TAILSCALE_DEPLOYMENT.md](TAILSCALE_DEPLOYMENT.md) for complete guide.

## ✅ Success Checklist
- [ ] Docker installed and running
- [ ] Tailscale installed and authenticated
- [ ] Services running (`docker ps` shows all containers)
- [ ] Can access via Tailscale URL
- [ ] WebSocket connection working (real-time updates)

## 🆘 Need Help?
1. Check logs: `docker compose -f docker-compose.homeserver.yml logs -f`
2. Verify Tailscale: `tailscale status`
3. Check services: `docker compose -f docker-compose.homeserver.yml ps`
4. Review [TAILSCALE_DEPLOYMENT.md](TAILSCALE_DEPLOYMENT.md)
