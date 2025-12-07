# Quick Start Guide - DDL & Database Setup

## Prerequisites
- Docker and Docker Compose installed
- The `docker-compose.yml` file is in the project root

## Step 1: Start Docker Containers

```bash
docker-compose up -d
```

This will:
- ✓ Start the MySQL container
- ✓ Create the `recipes` database
- ✓ Create `cook` user with appropriate permissions
- ✓ Create the three main tables: Recipes, Ingredients, Steps
- ✓ Create performance indexes
- ✓ Insert sample data for testing

## Step 2: Verify Tables Created

```bash
# List all tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# Expected output:
# +-------------------+
# | Tables_in_recipes |
# +-------------------+
# | Ingredients       |
# | Recipes           |
# | Steps             |
# +-------------------+
```

## Step 3: View Table Structures

```bash
# View Recipes table structure
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Recipes;"

# View Ingredients table structure
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Ingredients;"

# View Steps table structure
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Steps;"
```

## Step 4: Verify Sample Data

```bash
# Count recipes
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT COUNT(*) as RecipeCount FROM Recipes;"

# List all recipes
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"

# Get ingredients for recipe 1
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Ingredients WHERE RecipeId = 1;"

# Get steps for recipe 1
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Steps WHERE RecipeId = 1;"
```

## Step 5: Start the Backend API

```bash
# In a new terminal, start the Express backend
npm run backend:dev

# Expected output:
# Server is running on http://localhost:3001
# Swagger documentation available at http://localhost:3001/api-docs
```

## Step 6: Test API Endpoints

```bash
# Get all recipes
curl http://localhost:3001/api/recipes

# Get recipe by ID
curl http://localhost:3001/api/recipes/1

# Get ingredients for recipe 1
curl http://localhost:3001/api/recipes/1/ingredients

# Get steps for recipe 1
curl http://localhost:3001/api/recipes/1/steps
```

## Common Tasks

### View Logs
```bash
docker-compose logs -f mysql
```

### Connect to MySQL Shell
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes
```

### Stop Containers
```bash
docker-compose stop
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Remove Everything Including Data
```bash
docker-compose down -v
```

### Recreate Tables (drop and recreate)

**Windows:**
```bash
mysql-init\recreate-tables.bat
```

**Linux/Mac:**
```bash
./mysql-init/recreate-tables.sh
```

### Reset Entire Database
```bash
# Remove everything including volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Database Credentials

- **Database Name**: recipes
- **Root Password**: admn1234
- **User**: cook
- **User Password**: cook1234
- **Host**: localhost
- **Port**: 3306

## Files Location

| File | Purpose |
|------|---------|
| `mysql-init/00-init-database.sql` | Database initialization |
| `mysql-init/01-create-recipes-table.sql` | Recipes table |
| `mysql-init/02-create-ingredients-table.sql` | Ingredients table |
| `mysql-init/03-create-steps-table.sql` | Steps table |
| `mysql-init/04-create-indexes.sql` | Performance indexes |
| `mysql-init/05-sample-data.sql` | Sample test data |
| `mysql-init/README.md` | Detailed documentation |
| `mysql-init/recreate-tables.sh` | Table recreation (Unix) |
| `mysql-init/recreate-tables.bat` | Table recreation (Windows) |
| `docker-compose.yml` | Container configuration |
| `DDL_IMPLEMENTATION.md` | Implementation summary |

## Troubleshooting

### Tables not created?
1. Check if container started: `docker-compose ps`
2. Check logs: `docker-compose logs mysql`
3. If data exists from previous run, reset with: `docker-compose down -v && docker-compose up -d`

### Permission denied error?
- Verify credentials in docker-compose.yml match what you're using
- Default: user=cook, password=cook1234

### Connection refused?
- Ensure MySQL container is running: `docker-compose up -d`
- Wait 10-15 seconds for MySQL to fully initialize
- Check with: `docker-compose ps`

### Port 3306 already in use?
- Check what's using it: `netstat -ano | findstr :3306` (Windows)
- Stop the service: `docker-compose stop`
- Or change port in docker-compose.yml from `3306:3306` to `3307:3306`

## Next Steps

1. ✓ Database tables created
2. ✓ Sample data inserted
3. → Start the backend API: `npm run backend:dev`
4. → Start the frontend: `npm start`
5. → Test the full application

For detailed information, see `DDL_IMPLEMENTATION.md` and `mysql-init/README.md`
