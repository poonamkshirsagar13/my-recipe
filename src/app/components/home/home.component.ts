import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  sortBy: 'name' | 'recent' = 'name';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.error = null;
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.error = 'Failed to load recipes. Make sure the backend server is running on http://localhost:3001';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    // Filter by search query
    let filtered = this.recipes.filter(recipe =>
      recipe.Title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      recipe.ServingSize.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    // Sort
    if (this.sortBy === 'name') {
      filtered.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (this.sortBy === 'recent') {
      // Sort by ID in descending order (assuming higher ID = more recent)
      filtered.sort((a, b) => (b.Id || 0) - (a.Id || 0));
    }

    this.filteredRecipes = filtered;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFiltersAndSort();
  }

  getImageUrl(recipe: Recipe): string {
    if (recipe.Photos) {
      if (recipe.Photos.startsWith('data:image')) {
        return recipe.Photos;
      }
      return `data:image/jpeg;base64,${recipe.Photos}`;
    }
    return '';
  }
}
