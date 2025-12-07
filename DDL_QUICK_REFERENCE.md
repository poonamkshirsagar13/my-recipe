# 🚀 DDL Setup - Quick Reference Card

## What Was Created ✅

**DDL Scripts** (Auto-executed by Docker):
- `00-init-database.sql` - Database & user
- `01-create-recipes-table.sql` - Recipes table
- `02-create-ingredients-table.sql` - Ingredients table  
- `03-create-steps-table.sql` - Steps table
- `04-create-indexes.sql` - Performance indexes
- `05-sample-data.sql` - 3 recipes with ingredients & steps

**Documentation**:
- `QUICK_START_DDL.md` - Quick start (read this first!)
- `COMPLETE_DDL_DOCUMENTATION.md` - Full reference
- `DDL_SETUP_INDEX.md` - Navigation guide
- `mysql-init/README.md` - Table details

**Utilities**:
- `verify-setup.sh` / `verify-setup.bat` - Verify installation
- `recreate-tables.sh` / `recreate-tables.bat` - Recreate tables

---

## Three Tables Created

### Recipes
```
Id, Title, ServingSize, Photos, CreatedAt, UpdatedAt
```

### Ingredients
```
Id, Ingredient, Qty, Unit, RecipeId (FK), CreatedAt, UpdatedAt
```

### Steps
```
Id, Steps, Duration, Photos, RecipeId (FK), CreatedAt, UpdatedAt
```

**Relationships**: Recipes (1) → (Many) Ingredients, Steps

---

## Two-Minute Setup

```bash
# 1. Start database (auto-initializes)
docker-compose up -d

# 2. Verify (wait 10-15 seconds first)
verify-setup.bat              # Windows
./verify-setup.sh             # Linux/macOS

# 3. Start API
npm run backend:dev

# 4. Test
curl http://localhost:3001/api/recipes
```

---

## Credentials

```
Database: recipes
User: cook
Password: cook1234
Host: localhost
Port: 3306
```

---

## Essential Commands

```bash
# Check container
docker-compose ps

# View tables
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SHOW TABLES;"

# Query data
docker-compose exec mysql mysql -u cook -pcook1234 recipes -e "SELECT * FROM Recipes;"

# Recreate tables (drop and recreate)
mysql-init\recreate-tables.bat          # Windows
./mysql-init/recreate-tables.sh         # Linux/macOS

# Reset everything
docker-compose down -v && docker-compose up -d

# Connect to MySQL shell
docker-compose exec mysql mysql -u cook -pcook1234 recipes
```

---

## Sample Data Included

- 3 Recipes: Chocolate Chip Cookies, Pasta Carbonara, Greek Salad
- 14 Ingredients
- 12 Steps

Ready to test API immediately!

---

## Key Features

✅ Automatic initialization via Docker  
✅ Foreign keys with cascade delete  
✅ Performance indexes  
✅ UTF-8MB4 character set  
✅ Auto timestamps (CreatedAt, UpdatedAt)  
✅ Sample data included  
✅ Cross-platform (Windows, Linux, macOS)  

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Tables not created | `docker-compose down -v && docker-compose up -d` |
| Connection refused | Wait 15 seconds after startup |
| Port 3306 in use | Change port in docker-compose.yml |
| Script permission error | `chmod +x *.sh` (Linux/macOS) |

---

## Documentation Map

| Document | Purpose |
|----------|---------|
| `QUICK_START_DDL.md` | Step-by-step setup |
| `COMPLETE_DDL_DOCUMENTATION.md` | Complete reference |
| `DDL_SETUP_INDEX.md` | Quick navigation |
| `mysql-init/README.md` | Table details |

---

## Files Created

```
mysql-init/
├── 00-init-database.sql
├── 01-create-recipes-table.sql
├── 02-create-ingredients-table.sql
├── 03-create-steps-table.sql
├── 04-create-indexes.sql
├── 05-sample-data.sql
├── README.md
├── recreate-tables.sh
└── recreate-tables.bat

Root Directory
├── QUICK_START_DDL.md
├── COMPLETE_DDL_DOCUMENTATION.md
├── DDL_IMPLEMENTATION.md
├── DDL_SETUP_INDEX.md
├── DDL_SETUP_COMPLETE.md
├── DDL_VISUAL_SUMMARY.txt
├── verify-setup.sh
└── verify-setup.bat
```

---

## Next Steps

1. `docker-compose up -d` - Start database
2. `verify-setup.bat` or `./verify-setup.sh` - Verify
3. `npm run backend:dev` - Start API
4. Test at `http://localhost:3001/api/recipes`

---

**Status**: ✅ Complete and Ready!

All DDL scripts auto-execute on `docker-compose up -d`. No manual setup needed.

For details, see: `QUICK_START_DDL.md` or `COMPLETE_DDL_DOCUMENTATION.md`
