import pool from '../config/database';
import { Recipe, Ingredient, Step } from '../models/entities';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Helper function to convert Buffer to base64 string
function convertBufferToBase64(data: any): any {
  if (!data) return data;
  
  if (data.Photos) {
    console.log('[DATABASE] convertBufferToBase64 - Photos type:', typeof data.Photos);
    console.log('[DATABASE] convertBufferToBase64 - Is Buffer?', Buffer.isBuffer(data.Photos));
    
    if (Buffer.isBuffer(data.Photos)) {
      console.log('[DATABASE] convertBufferToBase64 - Converting Buffer to string');
      // It's a Buffer, convert to string directly (it's already base64 as stored in DB)
      const result = data.Photos.toString('utf8');
      console.log('[DATABASE] convertBufferToBase64 - Converted length:', result.length);
      console.log('[DATABASE] convertBufferToBase64 - First 100 chars:', result.substring(0, 100));
      return {
        ...data,
        Photos: result
      };
    } else if (typeof data.Photos === 'string') {
      console.log('[DATABASE] convertBufferToBase64 - Already a string, returning as-is');
      return data;
    }
  }
  return data;
}

// Recipe Service
export const RecipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM Recipes');
      return (rows as any[]).map(row => convertBufferToBase64(row)) as Recipe[];
    } finally {
      connection.release();
    }
  },

  async getRecipeById(id: number): Promise<Recipe | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Recipes WHERE Id = ?',
        [id]
      );
      return rows.length > 0 ? convertBufferToBase64(rows[0] as Recipe) : null;
    } finally {
      connection.release();
    }
  },

  async createRecipe(recipe: Recipe): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO Recipes (Title, ServingSize, Photos) VALUES (?, ?, ?)',
        [recipe.Title, recipe.ServingSize, recipe.Photos || null]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async updateRecipe(id: number, recipe: Recipe): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE Recipes SET Title = ?, ServingSize = ?, Photos = ? WHERE Id = ?',
        [recipe.Title, recipe.ServingSize, recipe.Photos || null, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async deleteRecipe(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM Recipes WHERE Id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
};

// Ingredient Service
export const IngredientService = {
  async getAllIngredients(): Promise<Ingredient[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM Ingredients');
      return rows as Ingredient[];
    } finally {
      connection.release();
    }
  },

  async getIngredientById(id: number): Promise<Ingredient | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Ingredients WHERE Id = ?',
        [id]
      );
      return rows.length > 0 ? (rows[0] as Ingredient) : null;
    } finally {
      connection.release();
    }
  },

  async getIngredientsByRecipeId(recipeId: number): Promise<Ingredient[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Ingredients WHERE RecipeId = ?',
        [recipeId]
      );
      return rows as Ingredient[];
    } finally {
      connection.release();
    }
  },

  async createIngredient(ingredient: Ingredient): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO Ingredients (Ingredient, Qty, Unit, RecipeId) VALUES (?, ?, ?, ?)',
        [ingredient.Ingredient, ingredient.Qty || null, ingredient.Unit || null, ingredient.RecipeId]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async updateIngredient(id: number, ingredient: Ingredient): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE Ingredients SET Ingredient = ?, Qty = ?, Unit = ?, RecipeId = ? WHERE Id = ?',
        [ingredient.Ingredient, ingredient.Qty || null, ingredient.Unit || null, ingredient.RecipeId, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async deleteIngredient(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM Ingredients WHERE Id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
};

// Step Service
export const StepService = {
  async getAllSteps(): Promise<Step[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM Steps');
      return rows as Step[];
    } finally {
      connection.release();
    }
  },

  async getStepById(id: number): Promise<Step | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Steps WHERE Id = ?',
        [id]
      );
      return rows.length > 0 ? (rows[0] as Step) : null;
    } finally {
      connection.release();
    }
  },

  async getStepsByRecipeId(recipeId: number): Promise<Step[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Steps WHERE RecipeId = ?',
        [recipeId]
      );
      return (rows as any[]).map(row => convertBufferToBase64(row)) as Step[];
    } finally {
      connection.release();
    }
  },

  async createStep(step: Step): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO Steps (Steps, Duration, RecipeId, Photos) VALUES (?, ?, ?, ?)',
        [step.Steps, step.Duration || null, step.RecipeId, step.Photos || null]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async updateStep(id: number, step: Step): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE Steps SET Steps = ?, Duration = ?, RecipeId = ?, Photos = ? WHERE Id = ?',
        [step.Steps, step.Duration || null, step.RecipeId, step.Photos || null, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async deleteStep(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM Steps WHERE Id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
};
