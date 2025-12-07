#!/bin/bash

# Verification script to check if DDL initialization was successful
# Usage: ./verify-setup.sh

set -e

echo "=========================================="
echo "Recipe Database Setup Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

# Check 1: Docker and Docker Compose installed
echo -e "${BLUE}[1/7]${NC} Checking Docker and Docker Compose..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not installed${NC}"
    ERRORS=$((ERRORS + 1))
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not installed${NC}"
    ERRORS=$((ERRORS + 1))
else
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose installed: $COMPOSE_VERSION${NC}"
fi
echo ""

# Check 2: MySQL container running
echo -e "${BLUE}[2/7]${NC} Checking MySQL container status..."
if docker-compose ps | grep -q mysql_container; then
    STATUS=$(docker-compose ps mysql | grep mysql_container | awk '{print $6}')
    echo -e "${GREEN}✓ MySQL container is running ($STATUS)${NC}"
else
    echo -e "${RED}✗ MySQL container is not running${NC}"
    echo -e "${YELLOW}  Start it with: docker-compose up -d${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: Check if database exists
echo -e "${BLUE}[3/7]${NC} Checking if recipes database exists..."
if docker-compose exec -T mysql mysql -u root -padmn1234 -e "USE recipes;" &> /dev/null; then
    echo -e "${GREEN}✓ Recipes database exists${NC}"
else
    echo -e "${RED}✗ Recipes database does not exist${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Check Recipes table
echo -e "${BLUE}[4/7]${NC} Checking Recipes table..."
if docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES LIKE 'Recipes';" | grep -q Recipes; then
    RECIPE_COUNT=$(docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Recipes;")
    echo -e "${GREEN}✓ Recipes table exists ($RECIPE_COUNT records)${NC}"
else
    echo -e "${RED}✗ Recipes table does not exist${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: Check Ingredients table
echo -e "${BLUE}[5/7]${NC} Checking Ingredients table..."
if docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES LIKE 'Ingredients';" | grep -q Ingredients; then
    INGREDIENT_COUNT=$(docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Ingredients;")
    echo -e "${GREEN}✓ Ingredients table exists ($INGREDIENT_COUNT records)${NC}"
else
    echo -e "${RED}✗ Ingredients table does not exist${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 6: Check Steps table
echo -e "${BLUE}[6/7]${NC} Checking Steps table..."
if docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES LIKE 'Steps';" | grep -q Steps; then
    STEPS_COUNT=$(docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Steps;")
    echo -e "${GREEN}✓ Steps table exists ($STEPS_COUNT records)${NC}"
else
    echo -e "${RED}✗ Steps table does not exist${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 7: Check foreign keys
echo -e "${BLUE}[7/7]${NC} Checking foreign key relationships..."
FK_COUNT=$(docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='recipes' AND REFERENCED_TABLE_NAME IS NOT NULL;")
if [ "$FK_COUNT" -ge 2 ]; then
    echo -e "${GREEN}✓ Foreign keys configured ($FK_COUNT relationships)${NC}"
else
    echo -e "${RED}✗ Foreign key constraints not properly set${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Database is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start the backend API:  npm run backend:dev"
    echo "  2. Start the frontend:     npm start"
    echo "  3. View API docs:          http://localhost:3001/api-docs"
    echo ""
    echo "Test a quick query:"
    echo "  docker-compose exec mysql mysql -u cook -pcook1234 recipes -e 'SELECT * FROM Recipes;'"
else
    echo -e "${RED}✗ Setup verification failed ($ERRORS error(s) found)${NC}"
    echo ""
    echo "To reset and reinitialize:"
    echo "  docker-compose down -v"
    echo "  docker-compose up -d"
    echo ""
    echo "Then run this script again:"
    echo "  ./verify-setup.sh"
fi
echo "=========================================="
