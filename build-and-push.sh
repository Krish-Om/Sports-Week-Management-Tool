#!/bin/bash
# Build Docker images locally and push to GitHub Container Registry (GHCR)

set -e

echo "=========================================="
echo "Build and Push to GHCR"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REGISTRY="ghcr.io"
USERNAME="krish-om"
REPO_NAME="sports-week"

# Check if logged in to GHCR
echo -e "\n${BLUE}Step 1: Checking GHCR authentication...${NC}"
if ! docker info 2>/dev/null | grep -q "ghcr.io"; then
    echo -e "${YELLOW}⚠ Not logged in to GHCR${NC}"
    echo -e "${BLUE}Please create a GitHub Personal Access Token:${NC}"
    echo "  1. Go to: https://github.com/settings/tokens"
    echo "  2. Generate new token (classic)"
    echo "  3. Select scopes: write:packages, read:packages, delete:packages"
    echo "  4. Copy the token"
    echo ""
    echo -e "${BLUE}Then login with:${NC}"
    echo "  echo YOUR_TOKEN | docker login ghcr.io -u $USERNAME --password-stdin"
    echo ""
    read -p "Press Enter after you've logged in..."
fi

echo -e "${GREEN}✓ Ready to build and push${NC}"

# Build Backend
echo -e "\n${BLUE}Step 2: Building backend image...${NC}"
docker build -t ${REGISTRY}/${USERNAME}/${REPO_NAME}-backend:latest ./backend
echo -e "${GREEN}✓ Backend image built${NC}"

# Build Frontend
echo -e "\n${BLUE}Step 3: Building frontend image...${NC}"
docker build \
  --build-arg VITE_API_URL=/api \
  --build-arg VITE_SOCKET_URL=/ \
  -t ${REGISTRY}/${USERNAME}/${REPO_NAME}-frontend:latest \
  ./frontend
echo -e "${GREEN}✓ Frontend image built${NC}"

# Push Backend
echo -e "\n${BLUE}Step 4: Pushing backend to GHCR...${NC}"
docker push ${REGISTRY}/${USERNAME}/${REPO_NAME}-backend:latest
echo -e "${GREEN}✓ Backend pushed${NC}"

# Push Frontend
echo -e "\n${BLUE}Step 5: Pushing frontend to GHCR...${NC}"
docker push ${REGISTRY}/${USERNAME}/${REPO_NAME}-frontend:latest
echo -e "${GREEN}✓ Frontend pushed${NC}"

# Summary
echo -e "\n${BLUE}========== BUILD & PUSH COMPLETE ==========${NC}"
echo -e "\n${GREEN}✓ Images successfully pushed to GHCR:${NC}"
echo "  ${REGISTRY}/${USERNAME}/${REPO_NAME}-backend:latest"
echo "  ${REGISTRY}/${USERNAME}/${REPO_NAME}-frontend:latest"
echo ""
echo -e "${GREEN}✓ Next step:${NC}"
echo "  ./deploy-tailscale.sh"
echo ""
echo -e "${BLUE}These images are now available at:${NC}"
echo "  https://github.com/${USERNAME}?tab=packages"
echo ""
