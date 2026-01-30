#!/bin/bash
# Sports Week Management Tool - Cloudflare Tunnel Deployment Script
# Run this on your homeserver after cloning the repository

set -e

echo "=========================================="
echo "Sports Week Deployment Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Prerequisites
echo -e "\n${BLUE}Step 1: Checking Prerequisites...${NC}"
command -v docker &> /dev/null || { echo "Docker not found. Install Docker first."; exit 1; }
command -v docker compose &> /dev/null || { echo "Docker Compose not found. Install it first."; exit 1; }
echo -e "${GREEN}✓ Docker and Docker Compose installed${NC}"

# Step 2: Prepare environment
echo -e "\n${BLUE}Step 2: Setting up environment...${NC}"
if [ ! -f .env.homeserver ]; then
    echo "Creating .env.homeserver..."
    cp .env.homeserver .env.homeserver.local 2>/dev/null || echo ".env.homeserver template not found"
fi

# Generate strong passwords if not set
if ! grep -q "DB_PASSWORD=CHANGE_ME" .env.homeserver; then
    echo -e "${GREEN}✓ .env.homeserver already configured${NC}"
else
    echo -e "${YELLOW}⚠ Update .env.homeserver with strong passwords:${NC}"
    echo "  DB_PASSWORD: $(openssl rand -base64 32)"
    echo "  JWT_SECRET:  $(openssl rand -base64 32)"
    echo ""
    echo "Edit and save .env.homeserver, then run this script again"
    exit 0
fi

# Step 3: Create SSL certificates
echo -e "\n${BLUE}Step 3: Creating SSL certificates...${NC}"
mkdir -p ssl
if [ ! -f ssl/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
        -subj "/C=NP/ST=Kathmandu/L=Kathmandu/O=SportWeek/CN=projectsports.krishombasukala.com.np"
    echo -e "${GREEN}✓ Self-signed certificates created${NC}"
else
    echo -e "${GREEN}✓ SSL certificates already exist${NC}"
fi

# Step 4: Pull latest images from GHCR
echo -e "\n${BLUE}Step 4: Pulling Docker images from GHCR...${NC}"
docker pull ghcr.io/krish-om/sports-week-frontend:latest
docker pull ghcr.io/krish-om/sports-week-backend:latest
echo -e "${GREEN}✓ Images pulled successfully${NC}"

# Step 5: Start Docker services
echo -e "\n${BLUE}Step 5: Starting Docker services...${NC}"
docker compose -f docker-compose.homeserver.yml --env-file .env.homeserver up -d
echo -e "${GREEN}✓ Services starting...${NC}"

# Step 6: Wait for services to be healthy
echo -e "\n${BLUE}Step 6: Waiting for services to be healthy (60 seconds)...${NC}"
sleep 60

# Check status
if docker compose -f docker-compose.homeserver.yml ps | grep -q "healthy"; then
    echo -e "${GREEN}✓ All services are healthy${NC}"
else
    echo -e "${YELLOW}⚠ Some services may still be starting. Check with:${NC}"
    echo "  docker compose -f docker-compose.homeserver.yml ps"
fi

# Step 7: Summary
echo -e "\n${BLUE}========== DEPLOYMENT COMPLETE ==========${NC}"
echo -e "\n${GREEN}✓ Next Steps:${NC}"
echo ""
echo "1. Install cloudflared on your homeserver:"
echo "   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
echo "   sudo dpkg -i cloudflared.deb"
echo ""
echo "2. Authenticate with Cloudflare:"
echo "   cloudflared login"
echo ""
echo "3. Create tunnel:"
echo "   cloudflared tunnel create sports-week-tunnel"
echo ""
echo "4. Get tunnel ID and save credentials"
echo ""
echo "5. Setup DNS in Cloudflare Dashboard:"
echo "   CNAME: projectsports → <tunnel-id>.cfargotunnel.com"
echo ""
echo "6. Run tunnel:"
echo "   cloudflared tunnel run sports-week-tunnel"
echo ""
echo -e "${GREEN}✓ Services are running at:${NC}"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:3001"
echo "  Database:  localhost:5433"
echo ""
echo -e "${GREEN}✓ View logs:${NC}"
echo "  docker compose -f docker-compose.homeserver.yml logs -f"
echo ""
echo -e "${YELLOW}For more details, see: CLOUDFLARE_TUNNEL_SETUP.md${NC}"
