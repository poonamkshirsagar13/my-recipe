-- Create Steps table
CREATE TABLE IF NOT EXISTS Steps (
    Id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique step identifier',
    Steps TEXT NOT NULL COMMENT 'Step description/instructions',
    Duration VARCHAR(50) NULL COMMENT 'Time duration for this step (e.g., "15 minutes")',
    Photos LONGTEXT NULL COMMENT 'Step photo in base64 format',
    RecipeId INT NOT NULL COMMENT 'Reference to parent recipe',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Step creation timestamp',
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    CONSTRAINT fk_steps_recipe FOREIGN KEY (RecipeId) REFERENCES Recipes(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_recipe_id (RecipeId),
    INDEX idx_created_at (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores cooking steps for each recipe with duration and photos';
