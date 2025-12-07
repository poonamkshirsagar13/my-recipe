@echo off
REM Script to recreate tables in the recipes database (Windows version)
REM Usage: recreate-tables.bat
REM This script connects to the running MySQL container and recreates all tables

setlocal enabledelayedexpansion

echo ==========================================
echo Recipe Database Table Recreator
echo ==========================================
echo.

REM Check if docker-compose is running
docker-compose ps | findstr /C:"mysql_container" >nul
if errorlevel 1 (
    echo Error: MySQL container is not running
    echo Start it with: docker-compose up -d
    exit /b 1
)

echo Connecting to MySQL container...
echo.

REM Drop existing tables
echo Dropping existing tables...
(
    echo DROP TABLE IF EXISTS Steps;
    echo DROP TABLE IF EXISTS Ingredients;
    echo DROP TABLE IF EXISTS Recipes;
) | docker-compose exec -T mysql mysql -u cook -pcook1234 recipes

echo [OK] Tables dropped
echo.

REM Recreate tables from initialization scripts
echo Recreating tables...

for %%f in (01-*.sql 02-*.sql 03-*.sql 04-*.sql) do (
    if exist "%%f" (
        echo   Executing: %%f
        type "%%f" | docker-compose exec -T mysql mysql -u cook -pcook1234 recipes
    )
)

echo [OK] Tables recreated
echo.

REM Verify tables
echo Verifying tables...
(
    echo SHOW TABLES;
) | docker-compose exec -T mysql mysql -u cook -pcook1234 recipes

echo.
echo [OK] Tables recreated successfully!
echo.
echo To insert sample data, run:
echo   type mysql-init\05-sample-data.sql ^| docker-compose exec -T mysql mysql -u cook -pcook1234 recipes
