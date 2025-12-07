import express, { Router, Request, Response } from 'express';
import { IngredientService } from '../services/database.service';

const router = Router();

// GET all ingredients
router.get('/ingredients', async (req: Request, res: Response) => {
  try {
    const ingredients = await IngredientService.getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// GET ingredient by ID
router.get('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const ingredient = await IngredientService.getIngredientById(parseInt(req.params['id']));
    if (!ingredient) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
});

// GET ingredients by recipe ID
router.get('/recipes/:recipeId/ingredients', async (req: Request, res: Response) => {
  try {
    const ingredients = await IngredientService.getIngredientsByRecipeId(
      parseInt(req.params['recipeId'])
    );
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ingredients for recipe' });
  }
});

// POST create ingredient
router.post('/ingredients', async (req: Request, res: Response) => {
  try {
    const Ingredient = req.body['Ingredient'];
    const Qty = req.body['Qty'];
    const Unit = req.body['Unit'];
    const RecipeId = req.body['RecipeId'];
    if (!Ingredient || !RecipeId) {
      res.status(400).json({ error: 'Ingredient and RecipeId are required' });
      return;
    }
    const id = await IngredientService.createIngredient({
      Ingredient,
      Qty: Qty || null,
      Unit: Unit || null,
      RecipeId
    });
    res.status(201).json({ id, Ingredient, Qty, Unit, RecipeId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// PUT update ingredient
router.put('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const Ingredient = req.body['Ingredient'];
    const Qty = req.body['Qty'];
    const Unit = req.body['Unit'];
    const RecipeId = req.body['RecipeId'];
    if (!RecipeId) {
      res.status(400).json({ error: 'RecipeId is required' });
      return;
    }
    const success = await IngredientService.updateIngredient(parseInt(req.params['id']), {
      Ingredient,
      Qty: Qty || null,
      Unit: Unit || null,
      RecipeId
    });
    if (!success) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }
    res.json({ message: 'Ingredient updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// DELETE ingredient
router.delete('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const success = await IngredientService.deleteIngredient(parseInt(req.params['id']));
    if (!success) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

export default router;
