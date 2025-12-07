#!/bin/bash

# Script to recreate tables in the recipes database
# Usage: ./recreate-tables.sh
# This script connects to the running MySQL container and recreates all tables

set -e

echo "=========================================="
echo "Recipe Database Table Recreator"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose is running
if ! docker-compose ps | grep -q mysql_container; then
    echo -e "${RED}Error: MySQL container is not running${NC}"
    echo "Start it with: docker-compose up -d"
    exit 1
fi

echo -e "${YELLOW}Connecting to MySQL container...${NC}"
echo ""

# Drop existing tables
echo -e "${YELLOW}Dropping existing tables...${NC}"
docker-compose exec -T mysql mysql -u cook -pcook1234 recipes << EOF
DROP TABLE IF EXISTS Steps;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Recipes;
EOF

echo -e "${GREEN}✓ Tables dropped${NC}"
echo ""

# Recreate tables from initialization scripts
echo -e "${YELLOW}Recreating tables...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Execute each SQL file in order
for sql_file in "$SCRIPT_DIR"/01-*.sql "$SCRIPT_DIR"/02-*.sql "$SCRIPT_DIR"/03-*.sql "$SCRIPT_DIR"/04-*.sql; do
    if [ -f "$sql_file" ]; then
        echo "  Executing: $(basename $sql_file)"
        docker-compose exec -T mysql mysql -u cook -pcook1234 recipes < "$sql_file"
    fi
done

echo -e "${GREEN}✓ Tables recreated${NC}"
echo ""

# Verify tables
echo -e "${YELLOW}Verifying tables...${NC}"
docker-compose exec -T mysql mysql -u cook -pcook1234 recipes << EOF
SHOW TABLES;
EOF

echo ""
echo -e "${GREEN}✓ Tables recreated successfully!${NC}"
echo ""
echo "To insert sample data, run:"
echo "  docker-compose exec -T mysql mysql -u cook -pcook1234 recipes < mysql-init/05-sample-data.sql"
