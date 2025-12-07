# Docker Compose Database Initialization Guide

## Issue: Tables Not Being Recreated

**Problem**: When running `docker-compose up`, tables are not being recreated from the `mysql-init/` scripts.

**Root Cause**: MySQL initialization scripts (`/docker-entrypoint-initdb.d/`) only run on the **first container creation**. Once the MySQL data directory (`./mysql/`) contains data, Docker reuses it and skips the initialization scripts.

---

## Solution

### Option 1: Proper Initialization (Recommended for First Setup)

Use the initialization script that removes old data and starts fresh:

**Windows:**
```bash
init-database.bat
```

**Linux/macOS:**
```bash
chmod +x init-database.sh
./init-database.sh
```

This script:
1. ✅ Stops the current containers
2. ✅ Removes the MySQL volume (`./mysql/`)
3. ✅ Deletes all old data
4. ✅ Starts fresh containers
5. ✅ Waits for MySQL to fully initialize
6. ✅ Verifies tables were created
7. ✅ Shows sample data counts

### Option 2: Manual Reset (If You Prefer More Control)

```bash
# Stop and remove containers + volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait 20-30 seconds for MySQL to initialize

# Verify tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

### Option 3: Continue Current Setup Without Resetting

If you want to keep existing data but want to verify tables exist:

```bash
# Just start the containers (with or without existing data)
docker-compose up -d

# Verify what tables exist
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# If tables are missing, use Option 1 or 2
```

---

## How Docker MySQL Initialization Works

### First Time (Fresh Container)

```
docker-compose up -d
    ↓
MySQL creates /var/lib/mysql (empty)
    ↓
Docker checks /docker-entrypoint-initdb.d/ for scripts
    ↓
Executes all .sql files in alphabetical order:
  • 00-init-database.sql
  • 01-create-recipes-table.sql
  • 02-create-ingredients-table.sql
  • 03-create-steps-table.sql
  • 04-create-indexes.sql
  • 05-sample-data.sql
    ↓
Tables created with sample data
    ↓
✅ Ready to use
```

### Subsequent Times (After Container Exists)

```
docker-compose up -d
    ↓
MySQL finds existing /var/lib/mysql directory with data
    ↓
Starts using existing data
    ↓
Skips /docker-entrypoint-initdb.d/ scripts
    ↓
⚠️ No table recreation (if tables were deleted)
```

---

## Understanding Volumes in docker-compose.yml

```yaml
volumes:
  - ./mysql:/var/lib/mysql           # Data persistence (bind mount)
  - ./mysql-init:/docker-entrypoint-initdb.d:ro  # Init scripts
```

**Key Points:**
- `./mysql:/var/lib/mysql` - Persists data between container restarts
  - Created on first `docker-compose up`
  - Prevents losing data when container stops
  - Prevents re-running init scripts on restart

- `./mysql-init:/docker-entrypoint-initdb.d:ro` - Initialization scripts
  - Runs only on first container creation
  - Read-only (`:ro`) to prevent accidental changes
  - Scripts execute in alphabetical order

---

## What's in mysql-init/ (Your DDL Scripts)

| File | Purpose |
|------|---------|
| `00-init-database.sql` | Creates `recipes` database and `cook` user |
| `01-create-recipes-table.sql` | Creates Recipes table |
| `02-create-ingredients-table.sql` | Creates Ingredients table |
| `03-create-steps-table.sql` | Creates Steps table |
| `04-create-indexes.sql` | Creates performance indexes |
| `05-sample-data.sql` | Inserts 3 sample recipes |

All use `IF NOT EXISTS` to prevent errors on re-run.

---

## Verify Tables Were Created

### Quick Check
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

Expected output:
```
+-------------------+
| Tables_in_recipes |
+-------------------+
| Ingredients       |
| Recipes           |
| Steps             |
+-------------------+
```

### Detailed Check
```bash
# Check table counts
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "
    SELECT 
        'Recipes' as 'Table',
        (SELECT COUNT(*) FROM Recipes) as 'Records'
    UNION ALL
    SELECT 'Ingredients', (SELECT COUNT(*) FROM Ingredients)
    UNION ALL
    SELECT 'Steps', (SELECT COUNT(*) FROM Steps);
"
```

Expected output:
```
+-----------+--------+
| Table     | Records|
+-----------+--------+
| Recipes   | 3      |
| Ingredients| 14    |
| Steps     | 12     |
+-----------+--------+
```

### View Container Initialization Logs
```bash
# See what happened during startup
docker-compose logs mysql | grep -i "init\|error\|warning"
```

Look for messages like:
- `Using MySQL 8.0.x`
- `Initializing MySQL database`
- `Running SQL scripts from /docker-entrypoint-initdb.d/`
- `Initialization completed`

---

## Troubleshooting

### Issue: "Error: Can't connect to MySQL"

**Solution:**
```bash
# Wait for MySQL to fully start (30 seconds)
docker-compose logs mysql | tail -10

# Check container is running
docker-compose ps

# Check port is exposed
netstat -an | findstr :3306
```

### Issue: "Table not found" or Empty Tables

**Solution 1: Use initialization script**
```bash
init-database.bat          # Windows
./init-database.sh         # Linux/macOS
```

**Solution 2: Manual reset**
```bash
docker-compose down -v     # Remove everything including data
docker-compose up -d       # Start fresh
# Wait 20-30 seconds
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

### Issue: Port 3306 Already in Use

**Solution:**
```bash
# Find what's using port 3306
netstat -ano | findstr :3306

# Stop MySQL container
docker-compose stop

# Or change port in docker-compose.yml:
# Change "3306:3306" to "3307:3306"
```

### Issue: Health Check Failing

**Solution:**
```bash
# Check MySQL status
docker-compose logs mysql

# Ensure containers are healthy
docker-compose ps

# If unhealthy, restart
docker-compose restart mysql
```

---

## Updated docker-compose.yml Features

The updated configuration now includes:

✅ **Specific MySQL Version**: `mysql:8.0` (instead of `latest`)
✅ **Health Check**: Verifies MySQL is ready before API connects
✅ **Character Set**: UTF-8MB4 configured for full Unicode
✅ **Restart Policy**: `unless-stopped` to auto-restart on failure
✅ **Database Command**: Optimized MySQL startup parameters

---

## Complete Workflow

### Initial Setup (First Time)

```bash
# 1. Use initialization script
init-database.bat          # Windows
./init-database.sh         # Linux/macOS

# 2. Verify setup
docker-compose ps
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# 3. Start API
npm run backend:dev

# 4. Test API
curl http://localhost:3001/api/recipes
```

### Development Work (Container Already Running)

```bash
# Just start containers (data persists)
docker-compose up -d

# Work with API
npm run backend:dev

# When done
docker-compose down        # Stops containers, keeps data
```

### Complete Reset (When Data Gets Corrupted)

```bash
# Remove everything
docker-compose down -v

# Start fresh (will re-run init scripts)
docker-compose up -d

# Wait 20-30 seconds
# Verify
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

---

## Key Commands Reference

```bash
# Initialize fresh database
init-database.bat          # Windows
./init-database.sh         # Linux/macOS

# Start containers (with existing data)
docker-compose up -d

# Stop containers (keep data)
docker-compose down

# Reset everything (delete data)
docker-compose down -v

# Check container status
docker-compose ps

# View logs
docker-compose logs mysql

# Connect to MySQL
docker-compose exec mysql mysql -u cook -pcook1234 recipes

# Query tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"

# View table structure
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "DESCRIBE Recipes;"
```

---

## Summary

- **First time**: Use `init-database.bat` or `init-database.sh`
- **Subsequent runs**: Just use `docker-compose up -d`
- **Complete reset**: Use `docker-compose down -v && docker-compose up -d`
- **Verify**: Use `docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"`

The initialization scripts in `mysql-init/` will only run when the MySQL data directory doesn't exist. This is normal Docker behavior for data persistence.
