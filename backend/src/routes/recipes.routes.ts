import express, { Router, Request, Response } from 'express';
import { RecipeService } from '../services/database.service';

const router = Router();

// GET all recipes
router.get('/recipes', async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeService.getAllRecipes();
    console.log('[BACKEND] GET /recipes - Recipes fetched:', recipes.length);
    recipes.forEach((r, idx) => {
      if (r.Photos) {
        console.log(`[BACKEND] Recipe ${idx} (${r.Title}): Photos length=${(r.Photos as string).length}, First 50 chars=${(r.Photos as string).substring(0, 50)}...`);
      }
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET recipe by ID
router.get('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const recipe = await RecipeService.getRecipeById(parseInt(req.params['id']));
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    if (recipe.Photos) {
      console.log(`[BACKEND] GET /recipes/${req.params['id']} - Recipe: ${recipe.Title}`);
      console.log(`[BACKEND] Photos type: ${typeof recipe.Photos}`);
      console.log(`[BACKEND] Photos length: ${(recipe.Photos as string).length}`);
      console.log(`[BACKEND] Photos first 100 chars: ${(recipe.Photos as string).substring(0, 100)}`);
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Helper function to extract base64 from data URI
function extractBase64(photos: string | null): string | null {
  if (!photos) return null;
  
  console.log(`[BACKEND] extractBase64 - Input type: ${typeof photos}`);
  console.log(`[BACKEND] extractBase64 - Input length: ${(photos as string).length}`);
  console.log(`[BACKEND] extractBase64 - First 100 chars: ${(photos as string).substring(0, 100)}`);
  
  if (photos.startsWith('data:image')) {
    console.log('[BACKEND] extractBase64 - Data URI prefix detected, extracting...');
    // Extract only the base64 part after the comma
    const parts = photos.split(',');
    const result = parts.length > 1 ? parts[1] : photos;
    console.log(`[BACKEND] extractBase64 - Output length: ${result.length}`);
    console.log(`[BACKEND] extractBase64 - Output first 50 chars: ${result.substring(0, 50)}`);
    return result;
  }
  
  console.log('[BACKEND] extractBase64 - No data URI prefix, returning as-is');
  return photos;
}

// POST create recipe
router.post('/recipes', async (req: Request, res: Response) => {
  try {
    const Title = req.body['Title'];
    const ServingSize = req.body['ServingSize'];
    let Photos = req.body['Photos'];
    
    console.log(`[BACKEND] POST /recipes - Creating recipe: ${Title}`);
    if (Photos) {
      console.log(`[BACKEND] POST /recipes - Photos received, type: ${typeof Photos}`);
      console.log(`[BACKEND] POST /recipes - Photos length: ${(Photos as string).length}`);
      console.log(`[BACKEND] POST /recipes - Photos first 100 chars: ${(Photos as string).substring(0, 100)}`);
    }
    
    // Strip data URI prefix if present
    Photos = extractBase64(Photos);
    
    if (Photos) {
      console.log(`[BACKEND] POST /recipes - After extractBase64, length: ${(Photos as string).length}`);
      console.log(`[BACKEND] POST /recipes - After extractBase64, first 50 chars: ${(Photos as string).substring(0, 50)}`);
    }
    
    if (!Title || !ServingSize) {
      res.status(400).json({ error: 'Title and ServingSize are required' });
      return;
    }
    const id = await RecipeService.createRecipe({
      Title,
      ServingSize,
      Photos: Photos || null
    });
    console.log(`[BACKEND] POST /recipes - Recipe created with ID: ${id}`);
    res.status(201).json({ id, Title, ServingSize });
  } catch (error) {
    console.error('[BACKEND] POST /recipes - Error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// PUT update recipe
router.put('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const Title = req.body['Title'];
    const ServingSize = req.body['ServingSize'];
    let Photos = req.body['Photos'];
    
    console.log(`[BACKEND] PUT /recipes/${req.params['id']} - Updating recipe: ${Title}`);
    if (Photos) {
      console.log(`[BACKEND] PUT /recipes/${req.params['id']} - Photos received, type: ${typeof Photos}`);
      console.log(`[BACKEND] PUT /recipes/${req.params['id']} - Photos length: ${(Photos as string).length}`);
      console.log(`[BACKEND] PUT /recipes/${req.params['id']} - Photos first 100 chars: ${(Photos as string).substring(0, 100)}`);
    }
    
    // Strip data URI prefix if present
    Photos = extractBase64(Photos);
    
    if (Photos) {
      console.log(`[BACKEND] PUT /recipes/${req.params['id']} - After extractBase64, length: ${(Photos as string).length}`);
      console.log(`[BACKEND] PUT /recipes/${req.params['id']} - After extractBase64, first 50 chars: ${(Photos as string).substring(0, 50)}`);
    }
    
    const success = await RecipeService.updateRecipe(parseInt(req.params['id']), {
      Title,
      ServingSize,
      Photos: Photos || null
    });
    if (!success) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    console.log(`[BACKEND] PUT /recipes/${req.params['id']} - Recipe updated successfully`);
    res.json({ message: 'Recipe updated successfully' });
  } catch (error) {
    console.error(`[BACKEND] PUT /recipes/${req.params['id']} - Error:`, error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE recipe
router.delete('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const success = await RecipeService.deleteRecipe(parseInt(req.params['id']));
    if (!success) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
