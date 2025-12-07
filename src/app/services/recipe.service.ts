import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  Id?: number;
  Title: string;
  ServingSize: string;
  Photos?: string | null;
}

export interface Ingredient {
  Id?: number;
  Ingredient: string;
  Qty?: number | null;
  Unit?: string | null;
  RecipeId: number;
}

export interface Step {
  Id?: number;
  Steps: string;
  Duration?: string | null;
  RecipeId: number;
  Photos?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Recipe methods
  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`);
  }

  createRecipe(recipe: Recipe): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipes`, recipe);
  }

  updateRecipe(id: number, recipe: Recipe): Observable<any> {
    return this.http.put(`${this.apiUrl}/recipes/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recipes/${id}`);
  }

  // Ingredient methods
  getIngredientsByRecipeId(recipeId: number): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/recipes/${recipeId}/ingredients`);
  }

  // Step methods
  getStepsByRecipeId(recipeId: number): Observable<Step[]> {
    return this.http.get<Step[]>(`${this.apiUrl}/recipes/${recipeId}/steps`);
  }

  createIngredient(ingredient: Ingredient): Observable<any> {
    return this.http.post(`${this.apiUrl}/ingredients`, ingredient);
  }

  updateIngredient(id: number, ingredient: Ingredient): Observable<any> {
    return this.http.put(`${this.apiUrl}/ingredients/${id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ingredients/${id}`);
  }

  createStep(step: Step): Observable<any> {
    return this.http.post(`${this.apiUrl}/steps`, step);
  }

  updateStep(id: number, step: Step): Observable<any> {
    return this.http.put(`${this.apiUrl}/steps/${id}`, step);
  }

  deleteStep(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/steps/${id}`);
  }
}
