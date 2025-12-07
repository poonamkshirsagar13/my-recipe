#!/bin/bash

# Initialize Docker MySQL Database
# This script properly sets up the database with DDL scripts
# Usage: ./init-database.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Recipe Application - Database Initialization Script       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Check Docker
echo -e "${BLUE}[1/5]${NC} Checking Docker..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose installed${NC}"
echo ""

# Step 2: Stop and remove existing containers
echo -e "${BLUE}[2/5]${NC} Removing existing containers and volumes..."
echo -e "${YELLOW}  Note: This will delete all existing data${NC}"
docker-compose down -v --remove-orphans 2>/dev/null || true
echo -e "${GREEN}✓ Cleaned up${NC}"
echo ""

# Step 3: Start fresh containers
echo -e "${BLUE}[3/5]${NC} Starting MySQL container..."
docker-compose up -d
echo -e "${GREEN}✓ Container started${NC}"
echo ""

# Step 4: Wait for MySQL to be ready
echo -e "${BLUE}[4/5]${NC} Waiting for MySQL to initialize (20-30 seconds)..."
WAIT_TIME=0
MAX_WAIT=60
while ! docker-compose exec -T mysql mysqladmin ping -h localhost -u root -padmn1234 &> /dev/null; do
    if [ $WAIT_TIME -ge $MAX_WAIT ]; then
        echo -e "${RED}✗ MySQL initialization timeout${NC}"
        docker-compose logs mysql | tail -20
        exit 1
    fi
    sleep 2
    WAIT_TIME=$((WAIT_TIME + 2))
    echo -n "."
done
echo ""
echo -e "${GREEN}✓ MySQL is ready${NC}"
echo ""

# Step 5: Verify tables
echo -e "${BLUE}[5/5]${NC} Verifying database initialization..."
TABLES=$(docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='recipes';" 2>/dev/null || echo "0")

if [ "$TABLES" -gt 0 ]; then
    echo -e "${GREEN}✓ Database initialized successfully${NC}"
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                      ✅ SETUP COMPLETE                         ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Database Status:"
    docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -e "
        SELECT 
            'Recipes' as 'Table',
            (SELECT COUNT(*) FROM Recipes) as 'Records'
        UNION ALL
        SELECT 
            'Ingredients',
            (SELECT COUNT(*) FROM Ingredients)
        UNION ALL
        SELECT 
            'Steps',
            (SELECT COUNT(*) FROM Steps);
    "
    echo ""
    echo "Next steps:"
    echo "  1. Start the backend API:  npm run backend:dev"
    echo "  2. Start the frontend:     npm start"
    echo "  3. Access API docs:        http://localhost:3001/api-docs"
else
    echo -e "${RED}✗ Database initialization failed${NC}"
    echo ""
    echo "Checking container logs:"
    docker-compose logs mysql | tail -30
    exit 1
fi
