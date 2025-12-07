create components folder in src
in newly creatd components folder create below listed components
- header
- footer
- home
- about
make sure app displays components as below 
- show header in top 10% page
- show footer  in bottom 5% page
- show home and about component depending on router url using router output
- default display home componet if no router url given
create navbar component in header component in bottom 
navbar should have entries for home and about
header should have logo icon, title and profile icon


---
convert style to use dark mode across all components

Prefer `docker exec mysql_container mysql -u cook -pcook1234 -e` to query database information from server for planning required tasks
create Database service api for getting recipes,ingredients,steps entities records refer docker compose for database connectivity
create needed models by referring database schema, database table already exists use mcp tool to connect database and get information for entity schema
create a CRUD rest apis for each entity
create open spec documentation for created apis
create separate backend api project
integrate backend api on frontend home component to display list of availiable recipes

---
add component for display/edit recipes and save to data base all view details link to open concerned recipe in newly created component allow user to edit recipe for all fields and image 

even after successful image upload in recipe ,recipe component doesnot load buffer data for display in html img tag

---
modified UI of home page make it more reactive and apperence also add search recipe for help user

---
create needed ddl (data defination language) for creating neede entities from backend api , add ddl to mysql-init and use them while initialize docker compose up to recreate table if missing

---
docker compose up not recreating tables verify docker servise using mysqual-init to populate data on start up