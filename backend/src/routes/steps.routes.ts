import express, { Router, Request, Response } from 'express';
import { StepService } from '../services/database.service';

const router = Router();

// GET all steps
router.get('/steps', async (req: Request, res: Response) => {
  try {
    const steps = await StepService.getAllSteps();
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

// GET step by ID
router.get('/steps/:id', async (req: Request, res: Response) => {
  try {
    const step = await StepService.getStepById(parseInt(req.params['id']));
    if (!step) {
      res.status(404).json({ error: 'Step not found' });
      return;
    }
    res.json(step);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch step' });
  }
});

// GET steps by recipe ID
router.get('/recipes/:recipeId/steps', async (req: Request, res: Response) => {
  try {
    const steps = await StepService.getStepsByRecipeId(parseInt(req.params['recipeId']));
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch steps for recipe' });
  }
});

// POST create step
router.post('/steps', async (req: Request, res: Response) => {
  try {
    const Steps = req.body['Steps'];
    const Duration = req.body['Duration'];
    const RecipeId = req.body['RecipeId'];
    const Photos = req.body['Photos'];
    if (!Steps || !RecipeId) {
      res.status(400).json({ error: 'Steps and RecipeId are required' });
      return;
    }
    const id = await StepService.createStep({
      Steps,
      Duration: Duration || null,
      RecipeId,
      Photos: Photos || null
    });
    res.status(201).json({ id, Steps, Duration, RecipeId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create step' });
  }
});

// PUT update step
router.put('/steps/:id', async (req: Request, res: Response) => {
  try {
    const Steps = req.body['Steps'];
    const Duration = req.body['Duration'];
    const RecipeId = req.body['RecipeId'];
    const Photos = req.body['Photos'];
    if (!RecipeId) {
      res.status(400).json({ error: 'RecipeId is required' });
      return;
    }
    const success = await StepService.updateStep(parseInt(req.params['id']), {
      Steps,
      Duration: Duration || null,
      RecipeId,
      Photos: Photos || null
    });
    if (!success) {
      res.status(404).json({ error: 'Step not found' });
      return;
    }
    res.json({ message: 'Step updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// DELETE step
router.delete('/steps/:id', async (req: Request, res: Response) => {
  try {
    const success = await StepService.deleteStep(parseInt(req.params['id']));
    if (!success) {
      res.status(404).json({ error: 'Step not found' });
      return;
    }
    res.json({ message: 'Step deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

export default router;
