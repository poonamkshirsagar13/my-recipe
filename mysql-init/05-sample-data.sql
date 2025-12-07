-- Insert sample data for testing
-- Sample Recipe
INSERT IGNORE INTO Recipes (Id, Title, ServingSize, Photos) VALUES 
(1, 'Chocolate Chip Cookies', '24 cookies', NULL),
(2, 'Pasta Carbonara', '4 servings', NULL),
(3, 'Greek Salad', '2 servings', NULL);

-- Sample Ingredients
INSERT IGNORE INTO Ingredients (Id, Ingredient, Qty, Unit, RecipeId) VALUES 
(1, 'All-purpose flour', 2.25, 'cups', 1),
(2, 'Butter', 1, 'cup', 1),
(3, 'Brown sugar', 0.75, 'cup', 1),
(4, 'Chocolate chips', 2, 'cups', 1),
(5, 'Vanilla extract', 1, 'teaspoon', 1),
(6, 'Eggs', 2, 'whole', 1),
(7, 'Pasta', 1, 'pound', 2),
(8, 'Bacon', 6, 'strips', 2),
(9, 'Eggs', 4, 'whole', 2),
(10, 'Parmesan cheese', 2, 'cups', 2),
(11, 'Tomatoes', 3, 'medium', 3),
(12, 'Cucumber', 1, 'whole', 3),
(13, 'Feta cheese', 1, 'cup', 3),
(14, 'Olive oil', 3, 'tablespoons', 3);

-- Sample Steps
INSERT IGNORE INTO Steps (Id, Steps, Duration, Photos, RecipeId) VALUES 
(1, 'Preheat oven to 375°F and cream together butter and sugar', '5 minutes', NULL, 1),
(2, 'Beat in eggs and vanilla extract until well combined', '3 minutes', NULL, 1),
(3, 'Mix flour and salt, then combine with wet ingredients', '5 minutes', NULL, 1),
(4, 'Fold in chocolate chips and drop onto baking sheet', '5 minutes', NULL, 1),
(5, 'Bake for 9-11 minutes until golden brown', '10 minutes', NULL, 1),
(6, 'Bring a large pot of salted water to boil and cook pasta', '10 minutes', NULL, 2),
(7, 'Fry bacon until crispy and chop into pieces', '5 minutes', NULL, 2),
(8, 'Whisk eggs with grated Parmesan cheese and pepper', '2 minutes', NULL, 2),
(9, 'Toss hot pasta with egg mixture and bacon', '2 minutes', NULL, 2),
(10, 'Chop all vegetables into bite-sized pieces', '10 minutes', NULL, 3),
(11, 'Combine vegetables in a large bowl', '2 minutes', NULL, 3),
(12, 'Drizzle with olive oil and season with salt and pepper', '2 minutes', NULL, 3);
