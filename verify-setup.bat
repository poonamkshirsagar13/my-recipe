@echo off
REM Verification script to check if DDL initialization was successful (Windows)
REM Usage: verify-setup.bat

setlocal enabledelayedexpansion

echo ==========================================
echo Recipe Database Setup Verification
echo ==========================================
echo.

set ERRORS=0

REM Check 1: Docker and Docker Compose installed
echo [1/6] Checking Docker and Docker Compose...
where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not installed
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('docker --version') do echo [OK] Docker installed: %%i
)

where docker-compose >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose not installed
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('docker-compose --version') do echo [OK] Docker Compose installed: %%i
)
echo.

REM Check 2: MySQL container running
echo [2/6] Checking MySQL container status...
docker-compose ps | findstr /C:"mysql_container" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MySQL container is not running
    echo          Start it with: docker-compose up -d
    set /a ERRORS+=1
) else (
    echo [OK] MySQL container is running
)
echo.

REM Check 3: Check if database exists
echo [3/6] Checking if recipes database exists...
docker-compose exec -T mysql mysql -u root -padmn1234 -e "USE recipes;" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Recipes database does not exist
    set /a ERRORS+=1
) else (
    echo [OK] Recipes database exists
)
echo.

REM Check 4: Check Recipes table
echo [4/6] Checking Recipes table...
for /f "tokens=*" %%i in ('docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Recipes;" 2^>nul') do set RECIPE_COUNT=%%i
if defined RECIPE_COUNT (
    echo [OK] Recipes table exists (!RECIPE_COUNT! records)
) else (
    echo [ERROR] Recipes table does not exist
    set /a ERRORS+=1
)
echo.

REM Check 5: Check Ingredients table
echo [5/6] Checking Ingredients table...
for /f "tokens=*" %%i in ('docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Ingredients;" 2^>nul') do set INGREDIENT_COUNT=%%i
if defined INGREDIENT_COUNT (
    echo [OK] Ingredients table exists (!INGREDIENT_COUNT! records)
) else (
    echo [ERROR] Ingredients table does not exist
    set /a ERRORS+=1
)
echo.

REM Check 6: Check Steps table
echo [6/6] Checking Steps table...
for /f "tokens=*" %%i in ('docker-compose exec -T mysql mysql -u cook -pcook1234 recipes -N -e "SELECT COUNT(*) FROM Steps;" 2^>nul') do set STEPS_COUNT=%%i
if defined STEPS_COUNT (
    echo [OK] Steps table exists (!STEPS_COUNT! records)
) else (
    echo [ERROR] Steps table does not exist
    set /a ERRORS+=1
)
echo.

REM Summary
echo ==========================================
if %ERRORS% equ 0 (
    echo [OK] All checks passed! Database is ready to use.
    echo.
    echo Next steps:
    echo   1. Start the backend API:  npm run backend:dev
    echo   2. Start the frontend:     npm start
    echo   3. View API docs:          http://localhost:3001/api-docs
    echo.
    echo Test a quick query:
    echo   docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"
) else (
    echo [ERROR] Setup verification failed (!ERRORS! error^(s^) found)
    echo.
    echo To reset and reinitialize:
    echo   docker-compose down -v
    echo   docker-compose up -d
    echo.
    echo Then run this script again:
    echo   verify-setup.bat
)
echo ==========================================

endlocal
