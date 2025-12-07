-- Create additional indexes for better query performance

-- Composite index for common queries
CREATE INDEX idx_ingredients_recipe_ingredient 
ON Ingredients(RecipeId, Ingredient);

CREATE INDEX idx_steps_recipe 
ON Steps(RecipeId);

-- For recipe detail queries
CREATE INDEX idx_recipes_id 
ON Recipes(Id);
