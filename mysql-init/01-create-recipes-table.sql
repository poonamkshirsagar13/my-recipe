-- Create Recipes table
CREATE TABLE IF NOT EXISTS Recipes (
    Id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique recipe identifier',
    Title VARCHAR(255) NOT NULL COMMENT 'Recipe title/name',
    ServingSize VARCHAR(100) NOT NULL COMMENT 'Number of servings',
    Photos LONGTEXT NULL COMMENT 'Recipe photo in base64 format',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Recipe creation timestamp',
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    INDEX idx_title (Title),
    INDEX idx_created_at (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores recipe information including title, serving size, and photos';
