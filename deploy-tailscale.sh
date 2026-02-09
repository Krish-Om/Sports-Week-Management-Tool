#!/bin/bash
# Sports Week Management Tool - Tailscale Deployment Script
# Run this on your Ubuntu home server after cloning the repository

set -e

echo "=========================================="
echo "Sports Week Tailscale Deployment Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Prerequisites
echo -e "\n${BLUE}Step 1: Checking Prerequisites...${NC}"

command -v docker &> /dev/null || { 
    echo -e "${RED}✗ Docker not found. Installing Docker...${NC}"
    sudo apt update
    sudo apt install -y docker.io
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓ Docker installed. You may need to log out and back in.${NC}"
}

command -v docker compose &> /dev/null || { 
    echo -e "${RED}✗ Docker Compose not found. Installing...${NC}"
    sudo apt install -y docker-compose-v2
}

command -v tailscale &> /dev/null || { 
    echo -e "${RED}✗ Tailscale not found.${NC}"
    echo -e "${YELLOW}Installing Tailscale...${NC}"
    curl -fsSL https://tailscale.com/install.sh | sh
    echo -e "${GREEN}✓ Tailscale installed${NC}"
    echo -e "${YELLOW}⚠ Please run 'sudo tailscale up' to authenticate, then run this script again${NC}"
    exit 0
}

# Check if Tailscale is connected
if ! tailscale status &> /dev/null; then
    echo -e "${YELLOW}⚠ Tailscale is not authenticated. Please run:${NC}"
    echo "  sudo tailscale up"
    echo "Then run this script again."
    exit 0
fi

echo -e "${GREEN}✓ All prerequisites installed${NC}"

# Step 2: Get Tailscale Information
echo -e "\n${BLUE}Step 2: Getting Tailscale Information...${NC}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Installing jq for JSON parsing...${NC}"
    sudo apt install -y jq
fi

TAILSCALE_HOST=$(tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//')
TAILSCALE_IP=$(tailscale status --json | jq -r '.Self.TailscaleIPs[0]')

if [ -z "$TAILSCALE_HOST" ] || [ "$TAILSCALE_HOST" == "null" ]; then
    echo -e "${RED}✗ Could not get Tailscale hostname${NC}"
    echo "Please ensure Tailscale is running: sudo tailscale up"
    exit 1
fi

echo -e "${GREEN}✓ Tailscale Hostname: ${TAILSCALE_HOST}${NC}"
echo -e "${GREEN}✓ Tailscale IP: ${TAILSCALE_IP}${NC}"

# Step 3: Prepare environment
echo -e "\n${BLUE}Step 3: Setting up environment...${NC}"

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 24 | tr -d '=+/')
JWT_SECRET=$(openssl rand -hex 32)

# Create .env file with Tailscale configuration
cat > .env << EOF
# Database Configuration
DB_NAME=sports_week
DB_USER=sports_user
DB_PASSWORD=${DB_PASSWORD}
DB_PORT=5433

# Backend Configuration
JWT_SECRET=${JWT_SECRET}
PORT=3001
NODE_ENV=production

# CORS Configuration - Tailscale URL
FRONTEND_URL=http://${TAILSCALE_HOST}

# Frontend Configuration (will be baked into Docker build)
VITE_API_URL=http://${TAILSCALE_HOST}/api
VITE_SOCKET_URL=http://${TAILSCALE_HOST}
EOF

echo -e "${GREEN}✓ .env file created with Tailscale hostname${NC}"

# Step 4: Create SSL certificates (optional, for local HTTPS)
echo -e "\n${BLUE}Step 4: Creating SSL certificates...${NC}"
mkdir -p ssl

if [ -f "/var/lib/tailscale/certs/${TAILSCALE_HOST}.crt" ]; then
    echo -e "${BLUE}Found Tailscale certificates, copying...${NC}"
    sudo cp "/var/lib/tailscale/certs/${TAILSCALE_HOST}.crt" ssl/cert.pem
    sudo cp "/var/lib/tailscale/certs/${TAILSCALE_HOST}.key" ssl/key.pem
    sudo chown $USER:$USER ssl/*.pem
    echo -e "${GREEN}✓ Using Tailscale HTTPS certificates${NC}"
elif [ ! -f ssl/cert.pem ]; then
    echo -e "${BLUE}Generating self-signed certificates...${NC}"
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
        -subj "/C=NP/ST=Kathmandu/L=Kathmandu/O=SportsWeek/CN=${TAILSCALE_HOST}"
    echo -e "${GREEN}✓ Self-signed certificates created${NC}"
else
    echo -e "${GREEN}✓ SSL certificates already exist${NC}"
fi

# Step 5: Pull latest images from GHCR
echo -e "\n${BLUE}Step 5: Pulling Docker images from GitHub Container Registry...${NC}"
docker pull ghcr.io/krish-om/sports-week-frontend:latest || echo -e "${YELLOW}⚠ Could not pull frontend image${NC}"
docker pull ghcr.io/krish-om/sports-week-backend:latest || echo -e "${YELLOW}⚠ Could not pull backend image${NC}"
echo -e "${GREEN}✓ Images pulled (or will be built locally)${NC}"

# Step 6: Start Docker services
echo -e "\n${BLUE}Step 6: Starting Docker services...${NC}"
docker compose -f docker-compose.homeserver.yml --env-file .env down 2>/dev/null || true
docker compose -f docker-compose.homeserver.yml --env-file .env up -d
echo -e "${GREEN}✓ Services starting...${NC}"

# Step 7: Wait for services to be healthy
echo -e "\n${BLUE}Step 7: Waiting for services to be healthy (30 seconds)...${NC}"
sleep 30

# Check status
echo -e "\n${BLUE}Checking service status...${NC}"
docker compose -f docker-compose.homeserver.yml ps

# Step 8: Verify services
echo -e "\n${BLUE}Step 8: Verifying services...${NC}"

# Test local connections
if curl -s http://localhost:80/health > /dev/null; then
    echo -e "${GREEN}✓ Nginx proxy is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Nginx proxy health check failed${NC}"
fi

if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✓ Backend API is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Backend API health check failed${NC}"
fi

# Step 9: Summary
echo -e "\n${BLUE}========== DEPLOYMENT COMPLETE ==========${NC}"
echo -e "\n${GREEN}✓ Your application is now running!${NC}"
echo ""
echo -e "${GREEN}Access URLs:${NC}"
echo "  Local:          http://localhost"
echo "  Tailscale:      http://${TAILSCALE_HOST}"
echo "  Tailscale IP:   http://${TAILSCALE_IP}"
echo ""
echo -e "${BLUE}Service Endpoints:${NC}"
echo "  Frontend:       http://${TAILSCALE_HOST}"
echo "  Backend API:    http://${TAILSCALE_HOST}/api"
echo "  WebSocket:      http://${TAILSCALE_HOST}/socket.io"
echo ""
echo -e "${GREEN}✓ Management Commands:${NC}"
echo "  View logs:      docker compose -f docker-compose.homeserver.yml logs -f"
echo "  Stop services:  docker compose -f docker-compose.homeserver.yml down"
echo "  Restart:        docker compose -f docker-compose.homeserver.yml restart"
echo "  Check status:   docker compose -f docker-compose.homeserver.yml ps"
echo ""
echo -e "${YELLOW}⚠ Important:${NC}"
echo "  1. Your Tailscale URL: http://${TAILSCALE_HOST}"
echo "  2. Share this URL with users on your Tailscale network"
echo "  3. For public access, enable Tailscale Funnel:"
echo "     tailscale funnel 80"
echo ""
echo -e "${BLUE}For more information, see TAILSCALE_DEPLOYMENT.md${NC}"
echo ""
echo -e "${GREEN}🎉 Happy hosting!${NC}"
