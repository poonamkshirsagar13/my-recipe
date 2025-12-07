# 🚀 Quick Action Guide - Docker Database Setup

## Current Status: ✅ FIXED & VERIFIED

Your Docker MySQL database is now working correctly!

---

## What Was Wrong

❌ **Old Issue:**
- `docker-compose up` wasn't recreating tables
- Old MySQL data directory caused old version conflicts
- SQL syntax error in index creation script

✅ **Fixed:**
- Updated docker-compose.yml with proper MySQL 8.0 configuration
- Fixed SQL syntax in initialization scripts
- Created helper scripts for proper initialization
- Added comprehensive documentation

---

## What You Need To Do

### 1️⃣ First Time Setup (Do This Once)

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
- ✓ Removes old data
- ✓ Creates fresh containers
- ✓ Initializes database with DDL scripts
- ✓ Inserts sample data (3 recipes)
- ✓ Verifies everything works

**Expected Output:**
```
✅ SETUP COMPLETE
Database Status:
Table       Records
Recipes     3
Ingredients 14
Steps       12
```

### 2️⃣ Start Backend API

```bash
npm run backend:dev
```

**Expected Output:**
```
Server is running on http://localhost:3001
Swagger documentation available at http://localhost:3001/api-docs
```

### 3️⃣ Test API

```bash
curl http://localhost:3001/api/recipes
```

**Expected Output:**
```json
[
  {
    "Id": 1,
    "Title": "Chocolate Chip Cookies",
    "ServingSize": "24 cookies",
    "Photos": null,
    "CreatedAt": "2025-12-07T22:34:57.000Z",
    "UpdatedAt": "2025-12-07T22:34:57.000Z"
  },
  ...
]
```

### 4️⃣ Access API Documentation

Open in browser: **http://localhost:3001/api-docs**

---

## Ongoing Usage

### Development Work

```bash
# Start containers (data persists from previous sessions)
docker-compose up -d

# Work on your code
npm run backend:dev

# When done for the day
docker-compose down    # Keeps data
```

### Resetting Database (If Needed)

```bash
# Complete reset - removes all data
docker-compose down -v

# Start fresh with initialization
docker-compose up -d
sleep 20
```

---

## What Was Changed

### Files Modified
- ✅ `docker-compose.yml` - Updated configuration
- ✅ `mysql-init/04-create-indexes.sql` - Fixed SQL syntax

### Files Created
- ✅ `init-database.sh` - Initialization script (Unix)
- ✅ `init-database.bat` - Initialization script (Windows)
- ✅ `DOCKER_INITIALIZATION_GUIDE.md` - Full documentation
- ✅ `DOCKER_MYSQL_VERIFIED.md` - Verification report

---

## Verify It's Working

```bash
# Check container status
docker-compose ps

# Should show:
# mysql_container  ... Up ... (healthy)
```

```bash
# Check tables exist
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# Should show:
# Ingredients
# Recipes
# Steps
```

```bash
# Check sample data
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT COUNT(*) FROM Recipes;"

# Should show:
# 3
```

---

## Database Access

**Credentials:**
- Database: `recipes`
- User: `cook`
- Password: `cook1234`
- Host: `localhost`
- Port: `3306`

**Connect from terminal:**
```bash
docker-compose exec mysql mysql -u cook -pcook1234 recipes
```

---

## Troubleshooting Quick Fixes

### "Can't connect to MySQL"
```bash
# Give MySQL more time to initialize
sleep 30

# Then try again
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"
```

### "Table doesn't exist"
```bash
# Run initialization script
init-database.bat          # Windows
./init-database.sh         # Linux/macOS
```

### "Port 3306 already in use"
```bash
# Stop MySQL
docker-compose stop

# Or use different port in docker-compose.yml
```

---

## Directory Structure

```
my-recipe/
├── mysql-init/           ← DDL Scripts (auto-executed)
│   ├── 00-init-database.sql
│   ├── 01-create-recipes-table.sql
│   ├── 02-create-ingredients-table.sql
│   ├── 03-create-steps-table.sql
│   ├── 04-create-indexes.sql    ← FIXED
│   └── 05-sample-data.sql
├── mysql/                ← MySQL data (persists between runs)
├── docker-compose.yml    ← Updated configuration ✓
├── init-database.bat     ← NEW (Windows)
├── init-database.sh      ← NEW (Unix)
└── DOCKER_INITIALIZATION_GUIDE.md ← NEW Documentation
```

---

## Sample Data

Your database comes pre-loaded with:

**3 Recipes:**
1. Chocolate Chip Cookies (24 cookies)
2. Pasta Carbonara (4 servings)
3. Greek Salad (2 servings)

**14 Ingredients** distributed across recipes

**12 Steps** with durations and instructions

---

## Full Documentation

For complete details, see:
- **DOCKER_INITIALIZATION_GUIDE.md** - How it works and troubleshooting
- **DOCKER_MYSQL_VERIFIED.md** - Test results and verification
- **mysql-init/README.md** - Table structure and details

---

## Common Commands

```bash
# SETUP
init-database.bat                   # First time setup

# START/STOP
docker-compose up -d                # Start containers
docker-compose down                 # Stop containers (keep data)
docker-compose down -v              # Stop and delete data

# VERIFY
docker-compose ps                   # Check status
docker-compose logs mysql           # View logs
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# QUERY DATA
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"

# CONNECT
docker-compose exec mysql mysql -u cook -pcook1234 recipes  # Interactive shell

# API
npm run backend:dev                 # Start backend API
curl http://localhost:3001/api/recipes  # Test API
```

---

## Next Steps

✅ **Step 1** - Run initialization:
```bash
init-database.bat          # Windows
./init-database.sh         # Linux/macOS
```

✅ **Step 2** - Start backend:
```bash
npm run backend:dev
```

✅ **Step 3** - Test API:
```bash
curl http://localhost:3001/api/recipes
```

✅ **Step 4** - Start frontend (if needed):
```bash
npm start
```

---

**Everything is ready to go! 🎉**

For any issues, check: `DOCKER_INITIALIZATION_GUIDE.md`
