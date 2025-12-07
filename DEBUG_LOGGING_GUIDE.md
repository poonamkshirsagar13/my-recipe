# Image Debug Logging Guide

## What to Look For in Console Logs

### 1. Image Upload Flow

**Frontend Console Logs (when selecting image):**
```
[FRONTEND] onImageSelected - File selected: image.jpg Size: 45000
[FRONTEND] onImageSelected - FileReader complete
[FRONTEND] onImageSelected - Full data URL length: 60000
[FRONTEND] onImageSelected - First 100 chars: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
[FRONTEND] onImageSelected - Data URI prefix detected, extracting...
[FRONTEND] onImageSelected - Extracted base64 length: 59980
[FRONTEND] onImageSelected - Extracted base64 first 50 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
```

**Frontend Console Logs (when saving):**
```
[FRONTEND] saveRecipe - Saving recipe: My Recipe Title
[FRONTEND] saveRecipe - Photos length: 59980
[FRONTEND] saveRecipe - Photos first 100 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[FRONTEND] saveRecipe - Creating new recipe
```

**Backend Console Logs (POST /recipes):**
```
[BACKEND] POST /recipes - Creating recipe: My Recipe Title
[BACKEND] POST /recipes - Photos received, type: string
[BACKEND] POST /recipes - Photos length: 59980
[BACKEND] POST /recipes - Photos first 100 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[BACKEND] extractBase64 - Input type: string
[BACKEND] extractBase64 - Input length: 59980
[BACKEND] extractBase64 - First 100 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[BACKEND] extractBase64 - No data URI prefix, returning as-is
[BACKEND] extractBase64 - Output length: 59980
[BACKEND] extractBase64 - Output first 50 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[BACKEND] POST /recipes - After extractBase64, length: 59980
[BACKEND] POST /recipes - After extractBase64, first 50 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[BACKEND] POST /recipes - Recipe created with ID: 5
```

### 2. Image Load/Display Flow

**Backend Console Logs (GET /recipes/:id):**
```
[BACKEND] GET /recipes/5 - Recipe: My Recipe Title
[BACKEND] Photos type: string
[BACKEND] Photos length: 59980
[BACKEND] Photos first 100 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
```

**Frontend Console Logs (when loading recipe):**
```
[FRONTEND] loadRecipeDetails - Recipe loaded: My Recipe Title
[FRONTEND] loadRecipeDetails - Photos received from backend
[FRONTEND] loadRecipeDetails - Photos type: string
[FRONTEND] loadRecipeDetails - Photos length: 59980
[FRONTEND] loadRecipeDetails - Photos first 100 chars: /9j/4AAQSkZJRgABAQEAYABgAAD...
[FRONTEND] loadRecipeDetails - Adding data URI prefix for display
[FRONTEND] loadRecipeDetails - Final imagePreview length: 60020
[FRONTEND] loadRecipeDetails - Final imagePreview first 100 chars: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
```

**Frontend Console Logs (when displaying image):**
```
[FRONTEND] getSafeImageUrl - Processing image data
[FRONTEND] getSafeImageUrl - Input length: 60020
[FRONTEND] getSafeImageUrl - Input first 100 chars: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
[FRONTEND] getSafeImageUrl - Already has data URI prefix
```

## What to Check

### ✅ Correct Data Flow

1. **File size should stay consistent:**
   - FileReader output length = ~60,000 (includes `data:image/jpeg;base64,` prefix)
   - Extracted base64 = ~59,980 (removed ~20 char prefix)
   - Backend received = ~59,980 (pure base64)
   - Backend stored = ~59,980 (pure base64)
   - Backend retrieved = ~59,980 (pure base64)
   - Frontend received = ~59,980 (pure base64)
   - Frontend displayed = ~60,020 (added prefix back)

2. **Base64 content should start with `/9j/` (for JPEG) or `iVBOR` (for PNG):**
   - NOT `data:` (that's the prefix that should be removed)
   - NOT `ZGF0YTppbWFnZS9wbmc7YmFzZTY0LCk=` (this would indicate the data URI prefix was base64 encoded)

### ❌ Common Issues

**Issue: Double Encoding Detected**
If you see: `ZGF0YTppbWFnZS9wbmc7YmFzZTY0LCk=` at the start
This means: `data:image/png;base64,` has been base64 encoded
Solution: Check that extractBase64() is working correctly

**Issue: Data grows between steps**
If file size keeps increasing at each step, the prefix is being added multiple times
Solution: Ensure extractBase64() is removing the prefix before storage

**Issue: Image displays with wrong codec**
If you see `data:image/jpeg;base64,` but file is PNG, change to `data:image/png;base64,`
Solution: Detect image type from file or store it in database

## Steps to Debug

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Upload an image** and watch the logs
4. **Compare file sizes** at each step
5. **Check the first 100 characters** - should be base64 content (like `/9j/`) not encoded prefix
6. **Note any mismatches** and report the console output

## Quick Copy-Paste to Console

To check current imagePreview in console:
```javascript
// Check component state
console.log('imagePreview:', this.imagePreview?.substring(0, 100));
```
