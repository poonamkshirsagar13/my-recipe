# DDL Implementation Summary

## Overview
Complete Data Definition Language (DDL) has been created for the Recipe application's MySQL database. All DDL scripts are located in the `mysql-init/` directory and will be automatically executed during Docker Compose initialization.

## Files Created

### DDL Scripts (executed automatically on docker-compose up)

1. **00-init-database.sql** - Database and user initialization
   - Creates the `recipes` database with UTF8MB4 charset
   - Sets up the `cook` user with appropriate permissions
   - Executed first (alphabetically)

2. **01-create-recipes-table.sql** - Recipes table
   - Primary entity table for storing recipe information
   - Columns: Id, Title, ServingSize, Photos
   - Timestamps: CreatedAt, UpdatedAt
   - Indexes for optimized queries

3. **02-create-ingredients-table.sql** - Ingredients table
   - Stores ingredients for each recipe
   - Columns: Id, Ingredient, Qty, Unit, RecipeId
   - Foreign Key constraint to Recipes table
   - CASCADE DELETE on recipe deletion

4. **03-create-steps-table.sql** - Steps table
   - Stores cooking steps for each recipe
   - Columns: Id, Steps, Duration, Photos, RecipeId
   - Foreign Key constraint to Recipes table
   - CASCADE DELETE on recipe deletion

5. **04-create-indexes.sql** - Additional indexes
   - Composite indexes for common queries
   - Performance optimization indexes

6. **05-sample-data.sql** - Sample data
   - 3 sample recipes
   - 14 sample ingredients
   - 12 sample steps
   - Uses INSERT IGNORE for safe re-initialization

### Documentation & Utilities

7. **README.md** - Complete documentation
   - Detailed explanation of each table
   - Entity relationships
   - Usage instructions
   - Troubleshooting guide
   - API endpoint references

8. **recreate-tables.sh** - Linux/Mac utility script
   - Drops and recreates all tables
   - Connects via Docker Compose
   - Verifies successful creation

9. **recreate-tables.bat** - Windows utility script
   - Same functionality as .sh version
   - Compatible with Windows command prompt

## Database Schema

### Recipes Table
```
Id (INT, PK, Auto-increment)
Title (VARCHAR(255), NOT NULL)
ServingSize (VARCHAR(100), NOT NULL)
Photos (LONGTEXT, NULL)
CreatedAt (TIMESTAMP)
UpdatedAt (TIMESTAMP)
```

### Ingredients Table
```
Id (INT, PK, Auto-increment)
Ingredient (VARCHAR(255), NOT NULL)
Qty (DECIMAL(10,2), NULL)
Unit (VARCHAR(50), NULL)
RecipeId (INT, NOT NULL, FK → Recipes.Id)
CreatedAt (TIMESTAMP)
UpdatedAt (TIMESTAMP)
```

### Steps Table
```
Id (INT, PK, Auto-increment)
Steps (TEXT, NOT NULL)
Duration (VARCHAR(50), NULL)
Photos (LONGTEXT, NULL)
RecipeId (INT, NOT NULL, FK → Recipes.Id)
CreatedAt (TIMESTAMP)
UpdatedAt (TIMESTAMP)
```

## Entity Relationships

```
Recipes (1) ─────── (Many) Ingredients
   ↓
Recipes (1) ─────── (Many) Steps
```

- **Recipes**: Primary/Parent table
- **Ingredients**: Child table, depends on Recipes
- **Steps**: Child table, depends on Recipes
- **Foreign Keys**: Enforce referential integrity
- **CASCADE DELETE**: Automatically removes ingredients and steps when recipe is deleted

## Docker Integration

The `docker-compose.yml` file is already configured with:
- Volume mount: `./mysql-init:/docker-entrypoint-initdb.d:ro`
- This ensures all `.sql` files in `mysql-init/` are executed on container startup
- Scripts execute in alphabetical order by filename

## How to Use

### Initial Setup
```bash
# Start containers (tables will be created automatically)
docker-compose up -d

# Verify tables are created
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

### Recreate Tables (if needed)
```bash
# On Linux/Mac
./mysql-init/recreate-tables.sh

# On Windows
mysql-init\recreate-tables.bat
```

### Connect to Database
```bash
# Interactive MySQL shell
docker-compose exec mysql mysql -u cook -pcook1234 recipes

# Run specific query
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"
```

### Reset Database (complete)
```bash
# Stop containers and remove volumes
docker-compose down -v

# Restart (tables will be recreated from scripts)
docker-compose up -d
```

## Key Features

✅ **Automatic Initialization**: Tables created on first `docker-compose up`
✅ **Character Support**: UTF8MB4 for full Unicode including emojis
✅ **Referential Integrity**: Foreign key constraints with cascade delete
✅ **Performance**: Strategic indexes on commonly queried columns
✅ **Timestamps**: CreatedAt and UpdatedAt on all tables
✅ **Safe Recreation**: INSERT IGNORE prevents errors on re-initialization
✅ **Sample Data**: Ready-to-use test recipes included
✅ **Multi-platform**: Scripts for Windows, Linux, and macOS

## API Compatibility

The DDL directly supports all backend API endpoints:
- ✓ GET /api/recipes
- ✓ GET /api/recipes/:id
- ✓ POST /api/recipes
- ✓ PUT /api/recipes/:id
- ✓ DELETE /api/recipes/:id
- ✓ GET /api/recipes/:recipeId/ingredients
- ✓ POST /api/ingredients
- ✓ PUT /api/ingredients/:id
- ✓ DELETE /api/ingredients/:id
- ✓ GET /api/recipes/:recipeId/steps
- ✓ POST /api/steps
- ✓ PUT /api/steps/:id
- ✓ DELETE /api/steps/:id

## Notes

- All initialization scripts use `IF NOT EXISTS` clauses for idempotency
- `INSERT IGNORE` in sample data prevents errors on container restarts
- Foreign key constraints are enforced at database level
- Passwords and usernames match docker-compose.yml configuration
- Photos stored as base64-encoded LONGTEXT fields
- Supports large image files through LONGTEXT data type

## File Execution Order in Docker

When `docker-compose up` is run for the first time, MySQL automatically executes:
1. 00-init-database.sql
2. 01-create-recipes-table.sql
3. 02-create-ingredients-table.sql
4. 03-create-steps-table.sql
5. 04-create-indexes.sql
6. 05-sample-data.sql

This ensures proper table creation order (Recipes before Ingredients/Steps due to foreign key dependencies).
