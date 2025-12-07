# MySQL Initialization Scripts (mysql-init)

This directory contains SQL scripts that automatically initialize the MySQL database when Docker Compose starts up. The scripts are executed in alphabetical order by the MySQL Docker container.

## Script Execution Order

### 00-init-database.sql
- Creates the `recipes` database if it doesn't exist
- Sets up UTF8MB4 character set and collation
- Creates/verifies the `cook` user with proper permissions

### 01-create-recipes-table.sql
- Creates the `Recipes` table with the following columns:
  - `Id` (INT, AUTO_INCREMENT, PRIMARY KEY)
  - `Title` (VARCHAR(255), NOT NULL)
  - `ServingSize` (VARCHAR(100), NOT NULL)
  - `Photos` (LONGTEXT, NULL) - Stores recipe photos in base64 format
  - `CreatedAt` (TIMESTAMP) - Auto-populated on insert
  - `UpdatedAt` (TIMESTAMP) - Auto-updated on record changes
- Includes indexes for optimized queries

### 02-create-ingredients-table.sql
- Creates the `Ingredients` table with the following columns:
  - `Id` (INT, AUTO_INCREMENT, PRIMARY KEY)
  - `Ingredient` (VARCHAR(255), NOT NULL) - Ingredient name
  - `Qty` (DECIMAL(10,2), NULL) - Quantity value
  - `Unit` (VARCHAR(50), NULL) - Unit of measurement
  - `RecipeId` (INT, NOT NULL, FOREIGN KEY) - Links to Recipes table
  - `CreatedAt` (TIMESTAMP)
  - `UpdatedAt` (TIMESTAMP)
- Includes CASCADE DELETE on Recipe deletion
- Indexes for recipe lookup and ingredient search

### 03-create-steps-table.sql
- Creates the `Steps` table with the following columns:
  - `Id` (INT, AUTO_INCREMENT, PRIMARY KEY)
  - `Steps` (TEXT, NOT NULL) - Step instructions
  - `Duration` (VARCHAR(50), NULL) - Time duration (e.g., "15 minutes")
  - `Photos` (LONGTEXT, NULL) - Step photos in base64 format
  - `RecipeId` (INT, NOT NULL, FOREIGN KEY) - Links to Recipes table
  - `CreatedAt` (TIMESTAMP)
  - `UpdatedAt` (TIMESTAMP)
- Includes CASCADE Delete on Recipe deletion
- Indexes for recipe lookup

### 04-create-indexes.sql
- Creates composite and additional indexes for query optimization
- Improves performance for common queries

### 05-sample-data.sql
- Populates the database with sample recipes, ingredients, and steps
- Uses `INSERT IGNORE` to prevent errors on re-initialization
- Sample data includes:
  - 3 recipes: Chocolate Chip Cookies, Pasta Carbonara, Greek Salad
  - 14 ingredients distributed across recipes
  - 12 cooking steps

## Database Relationships

### Recipes (Primary)
- One-to-Many relationship with Ingredients
- One-to-Many relationship with Steps

### Ingredients (Dependent)
- Many-to-One relationship with Recipes
- Foreign Key: `RecipeId` → Recipes.Id
- Delete Action: CASCADE (deletes all ingredients when recipe is deleted)

### Steps (Dependent)
- Many-to-One relationship with Recipes
- Foreign Key: `RecipeId` → Recipes.Id
- Delete Action: CASCADE (deletes all steps when recipe is deleted)

## Docker Compose Integration

The `docker-compose.yml` file is configured to:
1. Mount `./mysql-init` as a read-only volume to `/docker-entrypoint-initdb.d`
2. Execute all `.sql` files in this directory on first container startup
3. Persist data in the `./mysql` bind mount

```yaml
volumes:
  - ./mysql:/var/lib/mysql
  - ./mysql-init:/docker-entrypoint-initdb.d:ro
```

## Usage

### First Time Setup
```bash
docker-compose up -d
```
This will:
1. Create the MySQL container
2. Initialize the database
3. Create all tables
4. Insert sample data
5. Make the API ready to query

### Verify Tables Created
```bash
docker-compose exec mysql mysql -u root -p recipes -e "SHOW TABLES;"
```

### Connect to Database
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes
```

### View Table Structure
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Recipes;"
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Ingredients;"
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Steps;"
```

### Recreate Tables (Reset Database)
To recreate tables while preserving the container:

```bash
# Delete the existing mysql volume
docker-compose down -v

# Restart services
docker-compose up -d
```

Or connect and drop tables manually:
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "
  DROP TABLE IF EXISTS Steps;
  DROP TABLE IF EXISTS Ingredients;
  DROP TABLE IF EXISTS Recipes;
"
```

Then re-run the initialization scripts.

## Field Details

### Photos Field
- Stored as `LONGTEXT` to accommodate large base64-encoded images
- Typically contains data URIs like: `data:image/jpeg;base64,...`
- The backend extracts and stores only the base64 portion

### Duration Field
- Flexible format: "15 minutes", "1 hour 30 minutes", "30 secs", etc.
- Can be parsed and displayed by the frontend

### Foreign Keys
- Enforced at database level with FOREIGN KEY constraints
- CASCADE delete ensures referential integrity
- Updating recipe ID cascades to all ingredients and steps

## Character Set
- All tables use UTF8MB4 encoding
- Supports full Unicode character range including emojis
- Default collation: utf8mb4_unicode_ci (case-insensitive)

## Performance Considerations

### Indexes Created
- `idx_title` on Recipes.Title - Fast recipe title searches
- `idx_recipe_id` on Ingredients and Steps - Fast ingredient/step lookups by recipe
- `idx_created_at` - Fast chronological queries
- Composite indexes for common joined queries

### Timestamps
- `CreatedAt` - Set automatically on row insertion
- `UpdatedAt` - Automatically updated on any row modification
- Useful for auditing and sorting by recent changes

## Troubleshooting

### Tables not created on startup
1. Check if `./mysql` directory exists and has old data
2. The initialization scripts only run on first container creation
3. Delete the volume: `docker-compose down -v`
4. Restart: `docker-compose up -d`

### Permission errors
- Ensure the `cook` user credentials match in:
  - docker-compose.yml (MYSQL_USER, MYSQL_PASSWORD)
  - Backend database connection config
  - Any client connection strings

### Foreign Key Constraints Failed
- Verify RecipeId values exist in the Recipes table before inserting Ingredients/Steps
- Check that cascade delete rules are not being violated

## API Endpoints Using These Tables

- `GET /api/recipes` - Fetch all recipes
- `GET /api/recipes/:id` - Fetch recipe with ID
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:recipeId/ingredients` - Fetch recipe ingredients
- `GET /api/recipes/:recipeId/steps` - Fetch recipe steps
- `POST /api/ingredients` - Add ingredient to recipe
- `POST /api/steps` - Add step to recipe
