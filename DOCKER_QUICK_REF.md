# Docker Quick Reference - Sports Week Management Tool

## 🚀 Quick Start

```bash
# Navigate to project
cd /home/krishom/Sports-Week-Management-Tool

# Start everything
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

## 📍 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Web App | http://localhost:5173 | 5173 |
| API | http://localhost:3001 | 3001 |
| Database | localhost:5433 | 5433 |

## 🏗️ Images

```bash
# List local images
docker images | grep sports-week

# Image Details
# Frontend:  sports-week-frontend:latest (336MB, Bun)
# Backend:   sports-week-backend:latest (433MB, Bun)
```

## 🛠️ Common Commands

```bash
# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Connect to database
docker compose exec postgres psql -U sports -d sports_week

# Restart a service
docker compose restart backend

# Stop a service
docker compose stop frontend

# View resource usage
docker compose stats

# Backup database
docker compose exec postgres pg_dump -U sports sports_week > backup.sql

# Restore database
docker compose exec -T postgres psql -U sports sports_week < backup.sql
```

## 🔧 Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env

# Key Variables:
# DB_PASSWORD       - PostgreSQL password
# JWT_SECRET        - Application secret
# NODE_ENV          - production/development
# API_PORT          - Backend port (3001)
# WEB_PORT          - Frontend port (5173)
# DB_PORT           - Database port (5433)
```

## 🐛 Troubleshooting

### Services won't start
```bash
# Check all logs
docker compose logs

# Check if ports are in use
netstat -tuln | grep LISTEN

# Restart Docker daemon
sudo systemctl restart docker
```

### Database connection error
```bash
# Verify database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Check connection string in backend logs
docker compose logs backend | grep DATABASE_URL
```

### Memory/Resource issues
```bash
# Check container stats
docker compose stats

# Check disk space
df -h

# Prune unused images
docker image prune -a

# Prune unused volumes
docker volume prune
```

## 📤 GHCR Push

```bash
# Login to GitHub Container Registry
docker login ghcr.io

# Tag images
docker tag sports-week-frontend:latest ghcr.io/krish-om/sports-week-frontend:latest
docker tag sports-week-backend:latest ghcr.io/krish-om/sports-week-backend:latest

# Push to GHCR
docker push ghcr.io/krish-om/sports-week-frontend:latest
docker push ghcr.io/krish-om/sports-week-backend:latest
```

## 🏠 Homeserver Deployment

```bash
# Setup for homeserver
cp .env.example .env
cp docker-compose.prod.yml docker-compose.yml

# Configure for your homeserver
nano .env

# Deploy
docker compose up -d

# Monitor
docker compose logs -f
docker compose stats
```

## 📊 Health Checks

```bash
# Check service health
docker compose ps

# Test endpoints manually
curl http://localhost:3001/api/health
curl http://localhost:5173

# Check PostgreSQL health
docker compose exec postgres pg_isready -U sports
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker compose down

# Remove volumes (DATA LOSS!)
docker compose down -v

# Clean up unused Docker resources
docker system prune

# Remove all sports-week images
docker rmi sports-week-frontend sports-week-backend
```

## 📝 Files Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local/dev configuration |
| `docker-compose.prod.yml` | Production configuration |
| `.env.example` | Environment variable template |
| `frontend/Dockerfile` | Frontend image build |
| `backend/Dockerfile` | Backend image build |
| `DOCKER_BUILD_STATUS.md` | Build status & details |
| `HOMESERVER_DEPLOYMENT.md` | Deployment guide |
| `PHASE_10_SUMMARY.md` | Phase completion summary |

## 🔒 Security

- Change `JWT_SECRET` in production
- Change `DB_PASSWORD` in production
- Never commit `.env` to git
- Use `.env.local` for local overrides
- Enable firewall rules for ports
- Use HTTPS with reverse proxy in production

## 📚 Documentation

- **Build Details**: [DOCKER_BUILD_STATUS.md](./DOCKER_BUILD_STATUS.md)
- **Deployment Guide**: [HOMESERVER_DEPLOYMENT.md](./HOMESERVER_DEPLOYMENT.md)
- **Phase Summary**: [PHASE_10_SUMMARY.md](./PHASE_10_SUMMARY.md)

## 🎯 Optimization

- **Bun Runtime**: 40% less memory, 3x faster startup
- **Multi-stage Build**: Smaller frontend image (336MB vs 800MB+)
- **Alpine Linux**: Minimal PostgreSQL image
- **Health Checks**: Automatic service validation
- **Volume Persistence**: Database survives restarts

## 📞 Support

For issues, check:
1. Service logs: `docker compose logs`
2. Specific service: `docker compose logs <service>`
3. [HOMESERVER_DEPLOYMENT.md](./HOMESERVER_DEPLOYMENT.md) troubleshooting section
4. Docker documentation: https://docs.docker.com

---

**Version**: 1.0
**Last Updated**: 2026
**Status**: Production Ready ✅
