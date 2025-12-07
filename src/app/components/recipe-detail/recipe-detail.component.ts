import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RecipeService, Recipe, Ingredient, Step } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = { Title: '', ServingSize: '' };
  ingredients: Ingredient[] = [];
  steps: Step[] = [];
  loading = true;
  error: string | null = null;
  isSaving = false;
  successMessage: string | null = null;
  recipeId: number | null = null;
  isEditMode = false;

  // Image preview
  imagePreview: string | null = null;

  // New ingredient/step forms
  newIngredient: Ingredient = {
    Ingredient: '',
    Qty: null,
    Unit: '',
    RecipeId: 0
  };

  newStep: Step = {
    Steps: '',
    Duration: '',
    RecipeId: 0
  };

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.recipeId = parseInt(id);
        this.loadRecipeDetails();
      } else {
        this.isEditMode = true;
        this.loading = false;
        this.recipe.Id = 0;
      }
    });
  }

  loadRecipeDetails(): void {
    if (!this.recipeId) return;

    this.loading = true;
    this.error = null;

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        console.log('[FRONTEND] loadRecipeDetails - Recipe loaded:', recipe.Title);
        this.recipe = recipe;
        if (recipe.Photos) {
          console.log('[FRONTEND] loadRecipeDetails - Photos received from backend');
          console.log('[FRONTEND] loadRecipeDetails - Photos type:', typeof recipe.Photos);
          console.log('[FRONTEND] loadRecipeDetails - Photos length:', recipe.Photos.length);
          console.log('[FRONTEND] loadRecipeDetails - Photos first 100 chars:', recipe.Photos.substring(0, 100));
          
          // Backend now returns pure base64, so we just need to add the data URI prefix
          if (recipe.Photos.startsWith('data:image')) {
            console.log('[FRONTEND] loadRecipeDetails - Data URI prefix already present');
            // If it already has the prefix (shouldn\'t happen), use as-is
            this.imagePreview = recipe.Photos;
          } else {
            console.log('[FRONTEND] loadRecipeDetails - Adding data URI prefix for display');
            // Add data URI prefix for display (pure base64 from backend)
            this.imagePreview = `data:image/jpeg;base64,${recipe.Photos}`;
            console.log('[FRONTEND] loadRecipeDetails - Final imagePreview length:', this.imagePreview.length);
            console.log('[FRONTEND] loadRecipeDetails - Final imagePreview first 100 chars:', this.imagePreview.substring(0, 100));
          }
        } else {
          console.log('[FRONTEND] loadRecipeDetails - No photos in recipe');
        }
        this.loadIngredients();
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.error = 'Failed to load recipe details.';
        this.loading = false;
      }
    });
  }

  loadIngredients(): void {
    if (!this.recipeId) return;

    this.recipeService.getIngredientsByRecipeId(this.recipeId).subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.loadSteps();
      },
      error: (err) => {
        console.error('Error loading ingredients:', err);
        this.error = 'Failed to load ingredients.';
        this.loading = false;
      }
    });
  }

  loadSteps(): void {
    if (!this.recipeId) return;

    this.recipeService.getStepsByRecipeId(this.recipeId).subscribe({
      next: (steps) => {
        this.steps = steps;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading steps:', err);
        this.error = 'Failed to load steps.';
        this.loading = false;
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('[FRONTEND] onImageSelected - File selected:', file.name, 'Size:', file.size);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fullDataUrl = e.target?.result as string;
        console.log('[FRONTEND] onImageSelected - FileReader complete');
        console.log('[FRONTEND] onImageSelected - Full data URL length:', fullDataUrl.length);
        console.log('[FRONTEND] onImageSelected - First 100 chars:', fullDataUrl.substring(0, 100));
        
        this.imagePreview = fullDataUrl;
        
        // Extract only the base64 part (remove data URI prefix) for storage
        if (fullDataUrl.startsWith('data:image')) {
          console.log('[FRONTEND] onImageSelected - Data URI prefix detected, extracting...');
          // Extract base64 content after the comma
          const base64String = fullDataUrl.split(',')[1];
          console.log('[FRONTEND] onImageSelected - Extracted base64 length:', base64String.length);
          console.log('[FRONTEND] onImageSelected - Extracted base64 first 50 chars:', base64String.substring(0, 50));
          this.recipe.Photos = base64String;
        } else {
          console.log('[FRONTEND] onImageSelected - No data URI prefix found');
          this.recipe.Photos = fullDataUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveRecipe(): void {
    if (!this.recipe.Title.trim() || !this.recipe.ServingSize.trim()) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    console.log('[FRONTEND] saveRecipe - Saving recipe:', this.recipe.Title);
    if (this.recipe.Photos) {
      console.log('[FRONTEND] saveRecipe - Photos length:', this.recipe.Photos.length);
      console.log('[FRONTEND] saveRecipe - Photos first 100 chars:', this.recipe.Photos.substring(0, 100));
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;

    if (this.recipe.Id && this.recipe.Id > 0) {
      // Update existing recipe
      console.log('[FRONTEND] saveRecipe - Updating existing recipe ID:', this.recipe.Id);
      this.recipeService.updateRecipe(this.recipe.Id, this.recipe).subscribe({
        next: () => {
          console.log('[FRONTEND] saveRecipe - Update successful');
          this.isSaving = false;
          this.successMessage = 'Recipe updated successfully!';
          this.isEditMode = false;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Error updating recipe:', err);
          this.error = 'Failed to update recipe.';
          this.isSaving = false;
        }
      });
    } else {
      // Create new recipe
      console.log('[FRONTEND] saveRecipe - Creating new recipe');
      this.recipeService.createRecipe(this.recipe).subscribe({
        next: (response) => {
          console.log('[FRONTEND] saveRecipe - Create successful, ID:', response.id);
          this.recipe.Id = response.id;
          this.recipeId = response.id;
          this.newIngredient.RecipeId = response.id;
          this.newStep.RecipeId = response.id;
          this.isSaving = false;
          this.successMessage = 'Recipe created successfully!';
          this.isEditMode = false;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Error creating recipe:', err);
          this.error = 'Failed to create recipe.';
          this.isSaving = false;
        }
      });
    }
  }

  addIngredient(): void {
    if (!this.newIngredient.Ingredient.trim()) {
      this.error = 'Ingredient name is required.';
      return;
    }

    if (!this.recipeId) {
      this.error = 'Please save the recipe first before adding ingredients.';
      return;
    }

    this.newIngredient.RecipeId = this.recipeId;
    this.recipeService.createIngredient(this.newIngredient).subscribe({
      next: (response) => {
        this.newIngredient.Id = response.id;
        this.ingredients.push({ ...this.newIngredient });
        this.newIngredient = {
          Ingredient: '',
          Qty: null,
          Unit: '',
          RecipeId: this.recipeId || 0
        };
        this.successMessage = 'Ingredient added successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error adding ingredient:', err);
        this.error = 'Failed to add ingredient.';
      }
    });
  }

  updateIngredient(index: number): void {
    const ingredient = this.ingredients[index];
    if (!ingredient.Ingredient.trim()) {
      this.error = 'Ingredient name is required.';
      return;
    }

    if (!ingredient.Id) return;

    this.recipeService.updateIngredient(ingredient.Id, ingredient).subscribe({
      next: () => {
        this.successMessage = 'Ingredient updated successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error updating ingredient:', err);
        this.error = 'Failed to update ingredient.';
      }
    });
  }

  deleteIngredient(index: number): void {
    const ingredient = this.ingredients[index];
    if (!ingredient.Id) return;

    if (!confirm('Are you sure you want to delete this ingredient?')) return;

    this.recipeService.deleteIngredient(ingredient.Id).subscribe({
      next: () => {
        this.ingredients.splice(index, 1);
        this.successMessage = 'Ingredient deleted successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error deleting ingredient:', err);
        this.error = 'Failed to delete ingredient.';
      }
    });
  }

  addStep(): void {
    if (!this.newStep.Steps.trim()) {
      this.error = 'Step description is required.';
      return;
    }

    if (!this.recipeId) {
      this.error = 'Please save the recipe first before adding steps.';
      return;
    }

    this.newStep.RecipeId = this.recipeId;
    this.recipeService.createStep(this.newStep).subscribe({
      next: (response) => {
        this.newStep.Id = response.id;
        this.steps.push({ ...this.newStep });
        this.newStep = {
          Steps: '',
          Duration: '',
          RecipeId: this.recipeId || 0
        };
        this.successMessage = 'Step added successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error adding step:', err);
        this.error = 'Failed to add step.';
      }
    });
  }

  updateStep(index: number): void {
    const step = this.steps[index];
    if (!step.Steps.trim()) {
      this.error = 'Step description is required.';
      return;
    }

    if (!step.Id) return;

    this.recipeService.updateStep(step.Id, step).subscribe({
      next: () => {
        this.successMessage = 'Step updated successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error updating step:', err);
        this.error = 'Failed to update step.';
      }
    });
  }

  deleteStep(index: number): void {
    const step = this.steps[index];
    if (!step.Id) return;

    if (!confirm('Are you sure you want to delete this step?')) return;

    this.recipeService.deleteStep(step.Id).subscribe({
      next: () => {
        this.steps.splice(index, 1);
        this.successMessage = 'Step deleted successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        console.error('Error deleting step:', err);
        this.error = 'Failed to delete step.';
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  deleteRecipe(): void {
    if (!this.recipeId) return;

    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    this.recipeService.deleteRecipe(this.recipeId).subscribe({
      next: () => {
        this.successMessage = 'Recipe deleted successfully!';
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      error: (err) => {
        console.error('Error deleting recipe:', err);
        this.error = 'Failed to delete recipe.';
      }
    });
  }

  // Sanitize image URL for safe binding
  getSafeImageUrl(imageData: string | null): SafeUrl {
    if (!imageData) {
      console.log('[FRONTEND] getSafeImageUrl - No image data');
      return this.sanitizer.bypassSecurityTrustUrl('');
    }

    console.log('[FRONTEND] getSafeImageUrl - Processing image data');
    console.log('[FRONTEND] getSafeImageUrl - Input length:', imageData.length);
    console.log('[FRONTEND] getSafeImageUrl - Input first 100 chars:', imageData.substring(0, 100));

    if (imageData.startsWith('data:image')) {
      console.log('[FRONTEND] getSafeImageUrl - Already has data URI prefix');
      const result = this.sanitizer.bypassSecurityTrustUrl(imageData);
      return result;
    }

    // If it's just base64 without data URI prefix, add it
    console.log('[FRONTEND] getSafeImageUrl - Adding data URI prefix');
    const withPrefix = `data:image/jpeg;base64,${imageData}`;
    console.log('[FRONTEND] getSafeImageUrl - Output length:', withPrefix.length);
    const result = this.sanitizer.bypassSecurityTrustUrl(withPrefix);
    return result;
  }
}
