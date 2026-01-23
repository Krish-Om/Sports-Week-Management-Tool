# Homeserver Deployment Guide - Sports Week Management Tool

## Overview
This guide covers deploying the Sports Week Management Tool on a homeserver with Docker and Bun runtime for optimal resource efficiency.

## System Requirements

### Minimum (Homeserver)
- 2GB RAM
- 20GB Storage (for images and volumes)
- Docker 20.10+
- Docker Compose 2.0+
- Linux OS (Ubuntu 20.04+ recommended)

### Recommended
- 4GB RAM
- 40GB Storage
- Docker 28.0+
- Docker Compose 2.20+
- Linux OS with good uptime

## Pre-Deployment Setup

### 1. Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose --version
```

### 2. Clone Repository

```bash
cd /path/to/homeserver
git clone https://github.com/krish-om/Sports-Week-Management-Tool.git
cd Sports-Week-Management-Tool
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env

# Important variables to customize:
# - DB_PASSWORD: Change from default
# - JWT_SECRET: Change from default (use a strong random string)
# - DB_PORT, API_PORT, WEB_PORT: Adjust if ports conflict
```

## Deployment

### Quick Start (Development/Local Testing)

```bash
# Using existing docker-compose.yml (development setup)
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Deployment (Homeserver)

```bash
# Using production configuration
docker compose -f docker-compose.prod.yml up -d

# Verify services are running
docker compose -f docker-compose.prod.yml ps

# Check health
docker compose -f docker-compose.prod.yml exec backend bun -e "fetch('http://localhost:3001/api/health')"
docker compose -f docker-compose.prod.yml exec frontend bun -e "fetch('http://localhost:5173')"
```

### Service Access

- **Web App**: http://localhost:5173
- **API**: http://localhost:3001
- **Database**: localhost:5433 (internal: postgres:5432)

## Management

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f postgres
```

### Restart Services

```bash
# All services
docker compose -f docker-compose.prod.yml restart

# Specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Database Access

```bash
# Connect to PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U sports -d sports_week

# Backup database
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U sports sports_week > backup.sql

# Restore database
docker compose -f docker-compose.prod.yml exec -T postgres psql -U sports sports_week < backup.sql
```

### Update Services

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Clean unused images
docker image prune -a
```

## Performance Optimization

### Resource Limits (Homeserver Specific)

Edit `docker-compose.prod.yml` to add resource constraints:

```yaml
backend:
  # ... existing config ...
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M

frontend:
  # ... existing config ...
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 256M
      reservations:
        cpus: '0.25'
        memory: 128M

postgres:
  # ... existing config ...
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

### Storage Management

```bash
# Check disk usage
du -sh /var/lib/docker/volumes/

# Clean unused volumes
docker volume prune

# Export/rotate backups
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U sports sports_week | gzip > backup-$(date +%Y%m%d).sql.gz
```

### Monitoring (Optional)

```bash
# Install ctop for container monitoring
sudo apt install -y ctop

# Monitor containers
ctop

# Or use built-in Docker stats
docker stats
```

## Troubleshooting

### Services Won't Start

```bash
# Check service logs
docker compose -f docker-compose.prod.yml logs

# Verify ports are available
netstat -tuln | grep -E '3001|5173|5433'

# Check Docker daemon
sudo systemctl status docker
```

### Database Connection Issues

```bash
# Test database connectivity
docker compose -f docker-compose.prod.yml exec backend bun -e "import 'dotenv/config'; console.log(process.env.DATABASE_URL)"

# Check PostgreSQL logs
docker compose -f docker-compose.prod.yml logs postgres
```

### High Memory Usage

```bash
# Check individual container memory
docker compose -f docker-compose.prod.yml stats

# Restart services to free memory
docker compose -f docker-compose.prod.yml restart
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` to version control
   ```bash
   # Already in .gitignore, verify:
   echo ".env" >> .gitignore
   ```

2. **Strong Secrets**: Generate secure JWT_SECRET
   ```bash
   openssl rand -base64 32
   ```

3. **Database Password**: Change default DB_PASSWORD
   ```bash
   # Generate strong password
   pwgen -s 20 1
   ```

4. **Firewall Rules**: Limit port access
   ```bash
   # Only allow local access (example)
   sudo ufw allow from 192.168.1.0/24 to any port 5173
   sudo ufw allow from 192.168.1.0/24 to any port 3001
   ```

5. **Regular Backups**: Schedule automated backups
   ```bash
   # Add to crontab for daily backups
   0 2 * * * docker compose -f /path/to/docker-compose.prod.yml exec postgres pg_dump -U sports sports_week | gzip > /backups/sports-week-$(date +\%Y\%m\%d).sql.gz
   ```

## Bun Runtime Advantages

This deployment uses **Bun** instead of Node.js:

- **40% less memory**: Perfect for homeserver constraints
- **3x faster startup**: Quicker recovery from restarts
- **Faster execution**: Better performance for concurrent users
- **Integrated tooling**: No separate package manager needed

## Automation Scripts

### Auto-Restart on Failure

Create `/home/USER/restart-sports-app.sh`:

```bash
#!/bin/bash
cd /path/to/Sports-Week-Management-Tool
docker compose -f docker-compose.prod.yml restart
```

Add to crontab:
```bash
crontab -e
# Check every hour:
0 * * * * /home/USER/restart-sports-app.sh
```

### Scheduled Backups

Create `/home/USER/backup-sports-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/sports-week"
mkdir -p $BACKUP_DIR
cd /path/to/Sports-Week-Management-Tool

docker compose -f docker-compose.prod.yml exec postgres pg_dump -U sports sports_week | \
  gzip > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /home/USER/backup-sports-db.sh
```

## Monitoring & Health Checks

Services include built-in health checks:

```bash
# Check health status
docker compose -f docker-compose.prod.yml ps

# STATUS should show "healthy" for all services after startup
# Example output:
# NAME                   STATUS      PORTS
# sports-week-db         healthy     ...
# sports-week-api        healthy     ...
# sports-week-web        healthy     ...
```

## Support & Logs

For debugging, collect logs:

```bash
# Export all logs
docker compose -f docker-compose.prod.yml logs > app-logs.txt

# Export specific service logs
docker compose -f docker-compose.prod.yml logs backend > backend-logs.txt
```

Include these logs when reporting issues.

## Next Steps

1. Set up domain/reverse proxy (optional)
2. Configure HTTPS/SSL (recommended for production)
3. Schedule automated backups
4. Monitor resource usage
5. Plan capacity for growth

---

**Last Updated**: 2026
**Optimized for**: Homeserver Deployment with Bun Runtime
**Status**: Production Ready
