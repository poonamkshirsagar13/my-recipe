# Quick Start Guide - Recipe Application

## Prerequisites
- Node.js v18 or higher installed
- Docker running with MySQL container (from docker-compose.yml)
- MySQL database initialized

## Step 1: Verify MySQL is Running
```bash
docker compose ps
# Should show mysql_container running on port 3306
```

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Start Backend Server (Terminal 1)
```bash
npm run backend:dev
```
You should see:
```
Server is running on http://localhost:3001
Swagger documentation available at http://localhost:3001/api-docs
```

## Step 4: Start Frontend (Terminal 2)
```bash
npm start
```
Angular development server will start on `http://localhost:4200`

## Step 5: View the Application
1. Open browser to `http://localhost:4200`
2. Navigate to the Home component
3. You should see a list of recipes fetched from the backend API

## Step 6: Test API Documentation
Visit `http://localhost:3001/api-docs` to see the Swagger documentation and test API endpoints directly

## Available Endpoints

### Recipes
- List recipes: `GET http://localhost:3001/api/recipes`
- Get recipe: `GET http://localhost:3001/api/recipes/1`
- Create recipe: `POST http://localhost:3001/api/recipes`
- Update recipe: `PUT http://localhost:3001/api/recipes/1`
- Delete recipe: `DELETE http://localhost:3001/api/recipes/1`

### Ingredients (by Recipe)
- List ingredients for recipe: `GET http://localhost:3001/api/recipes/1/ingredients`
- Create ingredient: `POST http://localhost:3001/api/ingredients`

### Steps (by Recipe)
- List steps for recipe: `GET http://localhost:3001/api/recipes/1/steps`
- Create step: `POST http://localhost:3001/api/steps`

## Project Structure

```
my-recipe/
├── backend/                    # Backend Express server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # TypeScript interfaces
│   │   ├── services/          # Database operations
│   │   ├── routes/            # API endpoints
│   │   ├── swagger/           # Swagger/OpenAPI spec
│   │   └── server.ts          # Express app
│   ├── tsconfig.json          # TypeScript config
│   └── README.md              # Backend documentation
├── src/
│   ├── app/
│   │   ├── services/          # RecipeService for API calls
│   │   ├── components/
│   │   │   ├── home/          # Home component with recipe list
│   │   │   ├── header/        # Header component
│   │   │   ├── footer/        # Footer component
│   │   │   └── about/         # About component
│   │   └── app.config.ts      # App configuration with HTTP client
│   └── ...
├── docker-compose.yml         # MySQL container configuration
├── package.json               # Frontend & backend dependencies
└── IMPLEMENTATION_SUMMARY.md  # Detailed implementation notes
```

## Troubleshooting

### Backend server won't start
- Check if port 3001 is available: `lsof -i :3001`
- Ensure MySQL is running: `docker compose ps`
- Check database credentials in `backend/src/config/database.ts`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3001/health`
- Check browser console for CORS errors
- Ensure backend CORS is configured (it is by default)

### No recipes displayed
- Check if data exists: `docker exec mysql_container mysql -u cook -pcook1234 -e "USE recipes; SELECT * FROM Recipes;"`
- Add sample data: `docker exec mysql_container mysql -u cook -pcook1234 recipes -e "INSERT INTO Recipes (Title, ServingSize) VALUES ('Test Recipe', '4 servings');"`

## Development Notes

- **Backend Port**: 3001
- **Frontend Port**: 4200
- **Database**: recipes (MySQL)
- **API Base URL**: http://localhost:3001/api
- **Swagger UI**: http://localhost:3001/api-docs

## Key Features Implemented

✅ Full CRUD REST API for Recipes, Ingredients, and Steps
✅ MySQL database integration with connection pooling
✅ TypeScript type safety for all entities
✅ OpenAPI/Swagger documentation
✅ Dark mode UI styling
✅ Frontend recipe list component
✅ CORS enabled for cross-origin requests
✅ Error handling and validation
✅ Responsive design with Bootstrap

## Learn More

- Backend API: See `backend/README.md`
- API Specification: Visit `http://localhost:3001/api-docs`
- Implementation Details: See `IMPLEMENTATION_SUMMARY.md`
