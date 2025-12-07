-- Create Ingredients table
CREATE TABLE IF NOT EXISTS Ingredients (
    Id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique ingredient identifier',
    Ingredient VARCHAR(255) NOT NULL COMMENT 'Ingredient name',
    Qty DECIMAL(10, 2) NULL COMMENT 'Ingredient quantity',
    Unit VARCHAR(50) NULL COMMENT 'Unit of measurement (e.g., cups, tablespoons, grams)',
    RecipeId INT NOT NULL COMMENT 'Reference to parent recipe',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ingredient creation timestamp',
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    CONSTRAINT fk_ingredients_recipe FOREIGN KEY (RecipeId) REFERENCES Recipes(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ingredient (Ingredient),
    INDEX idx_recipe_id (RecipeId),
    INDEX idx_created_at (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores ingredients for each recipe with quantity and unit information';
