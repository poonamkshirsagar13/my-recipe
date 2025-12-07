# Recipe Backend API

The backend API is built with Express.js and MySQL, providing CRUD operations for recipes, ingredients, and steps.

## Prerequisites

- Node.js (v18 or higher)
- MySQL running on `localhost:3306`
- Database: `recipes`
- User: `cook` / Password: `cook1234`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MySQL connection pool configuration
│   ├── models/
│   │   └── entities.ts          # TypeScript interfaces for Recipe, Ingredient, Step
│   ├── services/
│   │   └── database.service.ts  # CRUD operations for all entities
│   ├── routes/
│   │   ├── recipes.routes.ts    # Recipe API endpoints
│   │   ├── ingredients.routes.ts # Ingredient API endpoints
│   │   └── steps.routes.ts      # Step API endpoints
│   ├── swagger/
│   │   └── swagger-spec.ts      # OpenAPI/Swagger specification
│   └── server.ts                # Express app configuration and server setup
├── tsconfig.json                # TypeScript configuration for backend
└── package.json                 # Backend dependencies
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run backend:dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Swagger Documentation
- `GET /api-docs` - Interactive API documentation (Swagger UI)

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:id` - Get ingredient by ID
- `GET /api/recipes/:recipeId/ingredients` - Get ingredients for a specific recipe
- `POST /api/ingredients` - Create new ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient

### Steps
- `GET /api/steps` - Get all steps
- `GET /api/steps/:id` - Get step by ID
- `GET /api/recipes/:recipeId/steps` - Get steps for a specific recipe
- `POST /api/steps` - Create new step
- `PUT /api/steps/:id` - Update step
- `DELETE /api/steps/:id` - Delete step

## Example API Calls

### Get all recipes
```bash
curl http://localhost:3001/api/recipes
```

### Create a recipe
```bash
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "Title": "My Recipe",
    "ServingSize": "4 servings"
  }'
```

### Get ingredients for a recipe
```bash
curl http://localhost:3001/api/recipes/1/ingredients
```

### Create an ingredient
```bash
curl -X POST http://localhost:3001/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "Ingredient": "Tomato",
    "Qty": 2,
    "Unit": "pieces",
    "RecipeId": 1
  }'
```

## Database Connection

The backend connects to MySQL using the `mysql2/promise` library. Connection configuration is in `backend/src/config/database.ts`:

- Host: `localhost`
- Port: `3306`
- User: `cook`
- Password: `cook1234`
- Database: `recipes`
- Connection Limit: 10

## Error Handling

All endpoints return standardized JSON responses:

Success response:
```json
{
  "Id": 1,
  "Title": "Recipe Name",
  "ServingSize": "4 servings"
}
```

Error response:
```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Build for Production

To build the TypeScript backend:
```bash
npm run backend:build
```

This generates compiled JavaScript in the `dist/backend` directory.

## Accessing Swagger Documentation

Visit `http://localhost:3001/api-docs` in your browser to view and test all API endpoints interactively.
