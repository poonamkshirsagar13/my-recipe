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
