# Complete DDL Setup Documentation

## Project: Recipe Application with MySQL Backend

This document provides complete information about the DDL (Data Definition Language) implementation for the Recipe application's MySQL database.

---

## Table of Contents

1. [Overview](#overview)
2. [Files Created](#files-created)
3. [Database Schema](#database-schema)
4. [Entity Relationships](#entity-relationships)
5. [Getting Started](#getting-started)
6. [Docker Integration](#docker-integration)
7. [API Integration](#api-integration)
8. [Maintenance & Troubleshooting](#maintenance--troubleshooting)

---

## Overview

A complete DDL implementation has been created to support the Recipe application's backend API. The system includes:

- **Three main entities**: Recipes, Ingredients, Steps
- **Automatic initialization**: Tables created via Docker Compose on first startup
- **Data integrity**: Foreign keys with cascade delete
- **Performance optimization**: Strategic indexes on frequently queried columns
- **Sample data**: Pre-populated test data for development
- **Utilities**: Scripts to verify setup and recreate tables

### Key Features

✅ **Automatic DDL Execution**: No manual database setup required
✅ **Multi-platform Support**: Works on Windows, Linux, macOS
✅ **Character Set Support**: Full UTF-8 Unicode including emojis
✅ **Referential Integrity**: Foreign key constraints with cascade actions
✅ **Performance Optimized**: Indexes on common query patterns
✅ **Idempotent Scripts**: Safe to run multiple times
✅ **Sample Data Included**: Ready-to-use test data

---

## Files Created

### DDL Scripts (in `mysql-init/` directory)

Executed automatically by Docker in alphabetical order:

| # | File | Purpose | Size |
|---|------|---------|------|
| 1 | `00-init-database.sql` | Database and user setup | ~250 bytes |
| 2 | `01-create-recipes-table.sql` | Recipes table definition | ~450 bytes |
| 3 | `02-create-ingredients-table.sql` | Ingredients table definition | ~550 bytes |
| 4 | `03-create-steps-table.sql` | Steps table definition | ~500 bytes |
| 5 | `04-create-indexes.sql` | Performance indexes | ~300 bytes |
| 6 | `05-sample-data.sql` | Sample recipes, ingredients, steps | ~1.5 KB |

### Documentation & Utilities

| File | Purpose | Platform |
|------|---------|----------|
| `mysql-init/README.md` | Detailed table and usage documentation | All |
| `recreate-tables.sh` | Script to drop and recreate tables | Linux/macOS |
| `recreate-tables.bat` | Script to drop and recreate tables | Windows |
| `verify-setup.sh` | Verification script | Linux/macOS |
| `verify-setup.bat` | Verification script | Windows |
| `DDL_IMPLEMENTATION.md` | Implementation summary | All |
| `QUICK_START_DDL.md` | Quick start guide | All |
| `COMPLETE_DDL_DOCUMENTATION.md` | This file | All |

---

## Database Schema

### Recipes Table

Primary table storing recipe information.

```sql
CREATE TABLE Recipes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ServingSize VARCHAR(100) NOT NULL,
    Photos LONGTEXT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Columns:**
- `Id` - Unique identifier (auto-incrementing)
- `Title` - Recipe name/title (up to 255 characters)
- `ServingSize` - Number of servings (e.g., "4 servings", "24 cookies")
- `Photos` - Recipe photo in base64 format (supports large images)
- `CreatedAt` - Auto-populated on record creation
- `UpdatedAt` - Auto-updated on any modification

**Indexes:**
- Primary Key: `Id`
- Index: `idx_title` (for recipe name searches)
- Index: `idx_created_at` (for chronological sorting)

### Ingredients Table

Child table storing ingredients for each recipe.

```sql
CREATE TABLE Ingredients (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Ingredient VARCHAR(255) NOT NULL,
    Qty DECIMAL(10,2) NULL,
    Unit VARCHAR(50) NULL,
    RecipeId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(Id) ON DELETE CASCADE
)
```

**Columns:**
- `Id` - Unique ingredient identifier
- `Ingredient` - Ingredient name (e.g., "Flour", "Sugar")
- `Qty` - Quantity as decimal (e.g., 2.5)
- `Unit` - Unit of measurement (e.g., "cups", "grams", "teaspoons")
- `RecipeId` - Foreign key reference to parent recipe
- `CreatedAt` - Auto-populated on record creation
- `UpdatedAt` - Auto-updated on modification

**Constraints:**
- Foreign Key: `RecipeId` → `Recipes.Id`
- Delete Action: CASCADE (removes ingredients when recipe is deleted)

**Indexes:**
- Primary Key: `Id`
- Index: `idx_ingredient` (for ingredient searches)
- Index: `idx_recipe_id` (for recipe ingredient lookups)
- Composite: `idx_ingredients_recipe_ingredient` (RecipeId + Ingredient)

### Steps Table

Child table storing cooking steps for each recipe.

```sql
CREATE TABLE Steps (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Steps TEXT NOT NULL,
    Duration VARCHAR(50) NULL,
    Photos LONGTEXT NULL,
    RecipeId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(Id) ON DELETE CASCADE
)
```

**Columns:**
- `Id` - Unique step identifier
- `Steps` - Step description/instructions (unlimited text)
- `Duration` - Time required (e.g., "15 minutes", "1 hour 30 mins")
- `Photos` - Step photo in base64 format
- `RecipeId` - Foreign key reference to parent recipe
- `CreatedAt` - Auto-populated on record creation
- `UpdatedAt` - Auto-updated on modification

**Constraints:**
- Foreign Key: `RecipeId` → `Recipes.Id`
- Delete Action: CASCADE (removes steps when recipe is deleted)

**Indexes:**
- Primary Key: `Id`
- Index: `idx_recipe_id` (for recipe step lookups)
- Index: `idx_created_at` (for chronological sorting)

---

## Entity Relationships

```
┌─────────────────────────────────────────────────┐
│              RECIPES (Parent)                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Id (PK)                                 │   │
│  │ Title                                   │   │
│  │ ServingSize                             │   │
│  │ Photos                                  │   │
│  │ CreatedAt, UpdatedAt                    │   │
│  └─────────────────────────────────────────┘   │
│                       │                         │
│          ┌────────────┴────────────┐            │
│          │                         │            │
│          ▼                         ▼            │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  INGREDIENTS     │    │     STEPS        │  │
│  │  (Child 1:Many)  │    │  (Child 1:Many)  │  │
│  ├──────────────────┤    ├──────────────────┤  │
│  │ Id (PK)          │    │ Id (PK)          │  │
│  │ Ingredient       │    │ Steps            │  │
│  │ Qty              │    │ Duration         │  │
│  │ Unit             │    │ Photos           │  │
│  │ RecipeId (FK)    │    │ RecipeId (FK)    │  │
│  │ CreatedAt        │    │ CreatedAt        │  │
│  │ UpdatedAt        │    │ UpdatedAt        │  │
│  └──────────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────┘

Relationship: Recipes (1) → (Many) Ingredients
Relationship: Recipes (1) → (Many) Steps
```

### Referential Integrity

**Foreign Key Rules:**
- `Ingredients.RecipeId` must reference an existing `Recipes.Id`
- `Steps.RecipeId` must reference an existing `Recipes.Id`
- When a Recipe is deleted, all related Ingredients and Steps are automatically deleted (CASCADE DELETE)

**Data Integrity:**
- Cannot create an Ingredient without a valid RecipeId
- Cannot create a Step without a valid RecipeId
- Orphaned Ingredients/Steps cannot exist

---

## Getting Started

### Prerequisites

- Docker Desktop installed
- Docker Compose installed (usually bundled with Docker Desktop)
- At least 500MB free disk space

### Quick Start

#### Step 1: Initialize Database

```bash
# From project root
docker-compose up -d
```

This command:
1. Starts the MySQL container
2. Automatically executes all SQL scripts in `mysql-init/`
3. Creates the database, tables, and sample data
4. Exposes MySQL on `localhost:3306`

#### Step 2: Verify Setup

**Option A: Using verification script**

Windows:
```bash
verify-setup.bat
```

Linux/macOS:
```bash
./verify-setup.sh
```

**Option B: Manual verification**

```bash
# List tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# Count records
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "
    SELECT 
        (SELECT COUNT(*) FROM Recipes) as recipe_count,
        (SELECT COUNT(*) FROM Ingredients) as ingredient_count,
        (SELECT COUNT(*) FROM Steps) as step_count;
"
```

#### Step 3: Start Backend API

```bash
npm run backend:dev
```

Output should show:
```
Server is running on http://localhost:3001
Swagger documentation available at http://localhost:3001/api-docs
```

#### Step 4: Test API

```bash
# Get all recipes
curl http://localhost:3001/api/recipes

# Get recipe by ID
curl http://localhost:3001/api/recipes/1

# Get ingredients
curl http://localhost:3001/api/recipes/1/ingredients

# Get steps
curl http://localhost:3001/api/recipes/1/steps
```

### Sample Data Included

The database comes pre-populated with:

**Recipes (3 total):**
1. Chocolate Chip Cookies
2. Pasta Carbonara
3. Greek Salad

**Ingredients (14 total):**
- 4 ingredients for Cookies
- 5 ingredients for Pasta
- 5 ingredients for Salad

**Steps (12 total):**
- 5 steps for Cookies
- 4 steps for Pasta
- 3 steps for Salad

Use these for testing the API endpoints.

---

## Docker Integration

### How Docker Initialization Works

When `docker-compose up` is executed for the **first time**:

1. MySQL image is pulled
2. Container is created
3. `/docker-entrypoint-initdb.d/` directory is checked
4. All `.sql` files are executed in **alphabetical order**
5. Scripts run with `root` user privileges
6. Database and user are initialized
7. Tables are created
8. Sample data is inserted

### File Execution Order

```
1. 00-init-database.sql          ← Database & user setup
2. 01-create-recipes-table.sql   ← Create Recipes table
3. 02-create-ingredients-table.sql ← Create Ingredients table
4. 03-create-steps-table.sql     ← Create Steps table
5. 04-create-indexes.sql          ← Create performance indexes
6. 05-sample-data.sql             ← Insert sample data
```

### Important Notes

- Scripts only run on **first container creation**
- If you `docker-compose up` again (after down), scripts re-run because MySQL is reinitialized
- To reset the database completely: `docker-compose down -v && docker-compose up -d`
- Individual script files use `IF NOT EXISTS` to prevent errors on re-run

### Docker Compose Configuration

```yaml
services:
  mysql:
    image: mysql:latest
    container_name: mysql_container
    environment:
      MYSQL_ROOT_PASSWORD: admn1234
      MYSQL_DATABASE: recipes
      MYSQL_USER: cook
      MYSQL_PASSWORD: cook1234
    ports:
      - "3306:3306"
    volumes:
      - ./mysql:/var/lib/mysql          # Data persistence
      - ./mysql-init:/docker-entrypoint-initdb.d:ro  # Init scripts
```

**Key Points:**
- `MYSQL_ROOT_PASSWORD`: Root user password
- `MYSQL_DATABASE`: Database created on startup
- `MYSQL_USER` & `MYSQL_PASSWORD`: Regular user credentials
- Volume 1: `./mysql` - Persists data between container restarts
- Volume 2: `./mysql-init` - Read-only init scripts directory

---

## API Integration

### Supported Endpoints

All backend API endpoints are fully supported by the DDL structure:

#### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create new recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |

#### Ingredient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ingredients` | Get all ingredients |
| GET | `/api/ingredients/:id` | Get ingredient by ID |
| GET | `/api/recipes/:recipeId/ingredients` | Get recipe ingredients |
| POST | `/api/ingredients` | Create ingredient |
| PUT | `/api/ingredients/:id` | Update ingredient |
| DELETE | `/api/ingredients/:id` | Delete ingredient |

#### Step Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/steps` | Get all steps |
| GET | `/api/steps/:id` | Get step by ID |
| GET | `/api/recipes/:recipeId/steps` | Get recipe steps |
| POST | `/api/steps` | Create step |
| PUT | `/api/steps/:id` | Update step |
| DELETE | `/api/steps/:id` | Delete step |

### Backend Database Service Implementation

The backend service (`backend/src/services/database.service.ts`) directly uses these tables:

```typescript
// Recipe queries use Recipes table
SELECT * FROM Recipes WHERE Id = ?
INSERT INTO Recipes (Title, ServingSize, Photos) VALUES (?, ?, ?)
UPDATE Recipes SET ... WHERE Id = ?
DELETE FROM Recipes WHERE Id = ?

// Ingredient queries use Ingredients table
SELECT * FROM Ingredients WHERE RecipeId = ?
INSERT INTO Ingredients (...) VALUES (...)
UPDATE Ingredients SET ... WHERE Id = ?
DELETE FROM Ingredients WHERE Id = ?

// Step queries use Steps table
SELECT * FROM Steps WHERE RecipeId = ?
INSERT INTO Steps (...) VALUES (...)
UPDATE Steps SET ... WHERE Id = ?
DELETE FROM Steps WHERE Id = ?
```

### Example API Usage

```bash
# Create a recipe
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "Title": "Pasta Primavera",
    "ServingSize": "4 servings",
    "Photos": null
  }'

# Add ingredient to recipe
curl -X POST http://localhost:3001/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "Ingredient": "Fresh Pasta",
    "Qty": 1,
    "Unit": "pound",
    "RecipeId": 4
  }'

# Add step to recipe
curl -X POST http://localhost:3001/api/steps \
  -H "Content-Type: application/json" \
  -d '{
    "Steps": "Boil water and cook pasta",
    "Duration": "10 minutes",
    "RecipeId": 4
  }'

# Get recipe with all details
curl http://localhost:3001/api/recipes/4
curl http://localhost:3001/api/recipes/4/ingredients
curl http://localhost:3001/api/recipes/4/steps
```

---

## Maintenance & Troubleshooting

### Common Tasks

#### View Table Structure

```bash
# Single table
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "DESCRIBE Recipes;"

# All tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SHOW CREATE TABLE Recipes\G"
```

#### Query Data

```bash
# View all recipes with count
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SELECT Id, Title, ServingSize FROM Recipes;"

# View ingredients for recipe 1
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SELECT * FROM Ingredients WHERE RecipeId = 1;"

# View steps with recipe title
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SELECT s.*, r.Title 
       FROM Steps s 
       JOIN Recipes r ON s.RecipeId = r.Id 
       WHERE r.Id = 1;"
```

#### Backup Data

```bash
# Export entire database
docker-compose exec mysql mysqldump -u cook -pcook1234 recipes \
  > recipes_backup.sql

# Export single table
docker-compose exec mysql mysqldump -u cook -pcook1234 recipes Recipes \
  > recipes_table.sql
```

#### Restore Data

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u cook -pcook1234 recipes \
  < recipes_backup.sql
```

#### Recreate Tables

**Windows:**
```bash
mysql-init\recreate-tables.bat
```

**Linux/macOS:**
```bash
./mysql-init/recreate-tables.sh
```

This will:
1. Drop all tables
2. Recreate them from initialization scripts
3. Display verification results

### Troubleshooting

#### Issue: Tables not found on startup

**Cause:** MySQL data persists from previous run
**Solution:**
```bash
docker-compose down -v    # Remove volume
docker-compose up -d      # Restart fresh
verify-setup.bat          # Verify (Windows)
./verify-setup.sh         # Verify (Linux/macOS)
```

#### Issue: Connection refused or timeout

**Cause:** MySQL container needs time to initialize
**Solution:**
```bash
# Wait 10-15 seconds after docker-compose up
# Check status
docker-compose ps

# View logs
docker-compose logs mysql

# Retry connection
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SELECT 1;"
```

#### Issue: Foreign key constraint errors

**Cause:** Trying to insert Ingredient/Step without valid RecipeId
**Solution:**
```bash
# Verify RecipeId exists
docker-compose exec mysql mysql -u cook -pcook1234 recipes \
  -e "SELECT Id FROM Recipes WHERE Id = [RecipeId];"

# Create recipe first, then add ingredients/steps
```

#### Issue: Duplicate entry errors

**Cause:** Running sample data insertion twice with AUTO_INCREMENT issues
**Solution:**
```bash
# Scripts use INSERT IGNORE, shouldn't happen
# If it does, recreate tables
mysql-init\recreate-tables.bat
```

#### Issue: Permission denied on script files

**Cause:** Shell scripts not executable (Linux/macOS)
**Solution:**
```bash
chmod +x mysql-init/recreate-tables.sh
chmod +x verify-setup.sh
./verify-setup.sh
```

### Performance Optimization Tips

1. **Indexes**: Already created for common queries
2. **Batch Inserts**: Use multi-value inserts for bulk data
3. **Connection Pooling**: Backend already uses connection pool
4. **UTF8MB4**: Allows full Unicode without encoding issues
5. **Timestamps**: CreatedAt/UpdatedAt useful for sorting queries

### Best Practices

✅ Always backup before dropping tables
✅ Use foreign keys to maintain referential integrity
✅ Index columns used in WHERE and JOIN clauses
✅ Use DECIMAL for currency/quantities (not FLOAT)
✅ Store large data (images) as base64 in LONGTEXT
✅ Use CASCADE DELETE carefully (verify dependencies)
✅ Keep passwords secure in production

---

## Summary

The complete DDL implementation provides:

1. **Three interconnected tables**: Recipes, Ingredients, Steps
2. **Automatic initialization**: No manual setup needed
3. **Data integrity**: Foreign keys and cascade delete
4. **Performance**: Strategic indexes
5. **Development ready**: Sample data included
6. **Production ready**: Proper charset, collation, timestamps
7. **Easy maintenance**: Utility scripts for common tasks
8. **Full documentation**: Comprehensive guides and examples

The system is fully integrated with the Express.js backend API and ready for immediate use.

---

## Quick Reference

```bash
# Start database
docker-compose up -d

# Verify setup
verify-setup.bat                    # Windows
./verify-setup.sh                   # Linux/macOS

# Connect to MySQL
docker-compose exec mysql mysql -u cook -pcook1234 recipes

# View tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# Recreate tables
mysql-init\recreate-tables.bat      # Windows
./mysql-init/recreate-tables.sh     # Linux/macOS

# Reset entirely
docker-compose down -v && docker-compose up -d

# Start backend API
npm run backend:dev

# Test API
curl http://localhost:3001/api/recipes

# View API docs
http://localhost:3001/api-docs
```

---

For additional details, see:
- `mysql-init/README.md` - Detailed table documentation
- `DDL_IMPLEMENTATION.md` - Implementation summary
- `QUICK_START_DDL.md` - Quick start guide
