-- Initialize database and user setup
-- This script ensures the recipes database and cook user are properly configured

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS recipes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the recipes database
USE recipes;

-- Create or update the cook user with full privileges on recipes database
CREATE USER IF NOT EXISTS 'cook'@'%' IDENTIFIED BY 'cook1234';

-- Grant all privileges on recipes database to cook user
GRANT ALL PRIVILEGES ON recipes.* TO 'cook'@'%';

-- Also allow cook user to connect from localhost
CREATE USER IF NOT EXISTS 'cook'@'localhost' IDENTIFIED BY 'cook1234';
GRANT ALL PRIVILEGES ON recipes.* TO 'cook'@'localhost';

-- Apply privilege changes
FLUSH PRIVILEGES;
