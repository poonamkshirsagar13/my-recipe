@echo off
REM Initialize Docker MySQL Database (Windows)
REM This script properly sets up the database with DDL scripts
REM Usage: init-database.bat

setlocal enabledelayedexpansion

echo ============================================================
echo     Recipe Application - Database Initialization Script
echo ============================================================
echo.

REM Step 1: Check Docker
echo [1/5] Checking Docker...
where docker-compose >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose not found
    exit /b 1
)
echo [OK] Docker Compose installed
echo.

REM Step 2: Stop and remove existing containers
echo [2/5] Removing existing containers and volumes...
echo        Note: This will delete all existing data
docker-compose down -v --remove-orphans >nul 2>&1
echo [OK] Cleaned up
echo.

REM Step 3: Start fresh containers
echo [3/5] Starting MySQL container...
docker-compose up -d
echo [OK] Container started
echo.

REM Step 4: Wait for MySQL to be ready
echo [4/5] Waiting for MySQL to initialize (20-30 seconds)...
setlocal enabledelayedexpansion
set WAIT_TIME=0
set MAX_WAIT=60

:wait_loop
docker-compose exec -T mysql mysqladmin ping -h localhost -u root -padmn1234 >nul 2>&1
if errorlevel 0 (
    goto wait_done
)

if !WAIT_TIME! geq !MAX_WAIT! (
    echo Error: MySQL initialization timeout
    docker-compose logs mysql | findstr /C:"ERROR"
    exit /b 1
)

set /a WAIT_TIME+=2
timeout /t 2 /nobreak >nul
goto wait_loop

:wait_done
echo.
echo [OK] MySQL is ready
echo.

REM Step 5: Verify tables
echo [5/5] Verifying database initialization...
for /f "tokens=*" %%i in ('docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='recipes';" 2^>nul') do set TABLES=%%i

if defined TABLES (
    echo [OK] Database initialized successfully
    echo.
    echo ============================================================
    echo                  ✓ SETUP COMPLETE
    echo ============================================================
    echo.
    echo Database Status:
    docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -e "SELECT 'Recipes' as 'Table', (SELECT COUNT(*) FROM Recipes) as 'Records' UNION ALL SELECT 'Ingredients', (SELECT COUNT(*) FROM Ingredients) UNION ALL SELECT 'Steps', (SELECT COUNT(*) FROM Steps);"
    echo.
    echo Next steps:
    echo   1. Start the backend API:  npm run backend:dev
    echo   2. Start the frontend:     npm start
    echo   3. Access API docs:        http://localhost:3001/api-docs
) else (
    echo Error: Database initialization failed
    echo.
    echo Checking container logs:
    docker-compose logs mysql | findstr /C:"ERROR"
    exit /b 1
)
