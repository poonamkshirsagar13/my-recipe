import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'recipe-new', component: RecipeDetailComponent },
  { path: 'about', component: AboutComponent }
];
