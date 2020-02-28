# Kitchen Helper:

    Kitchen Helper is a best friend in the kitchen.
    This app combines the ability to track the items in your pantry,
    the opportunity to plan your meals for a given time period and puts a
    large database of recipes at your fingertips. This app also allows
    you to create and add your own recipes. 


## Contributors:

- Maggie McClellan
- Calvin Rosehart
- Anugrah Lambogo
- Christina Chapman


## Visit Kitchen Helper:

  * [Client Side Repo](https://github.com/thinkful-ei-iguana/Delta-Squad-Front-End)

  * [Server Side Repo](https://github.com/thinkful-ei-iguana/Delta-Squad-Server)

  * [Live App](https://delta-squad-app.now.sh/)
  
  
## Screenshots:

   ![Landing Logo](src/Assets/LandingLogo.gif)

   ![Home Page](src/Assets/homePage.gif)

   ![Pantry Landing Page](src/Assets/pantryLanding.gif)   

   ![Recipe Landing Page](src/Assets/recipeLanding.gif)

   ![Recipe Detail Page](src/Assets/recipeDetail.gif)
   
   ![Meal Plan Add](src/Assets/planAdd.gif)
   
   ![Dark Mode Banner](src/Assets/DarkMode-Banner.gif)



## Technologies:

**Front End Tech:** HTML, CSS, Javascript, React, Modal, Widgets(Dark Mode)

**Back End Tech:** NodeJs, ExpressJs, PostgresQl

**Testing Tech:** Jest, Snapshot, Enzyme, Lodash


## Endpoints:

   ### Pantry: 

| **HTTP Verb** | **Path**                           | **Used for**         |
| --------- |:--------------------------------------:| --------------------:|
| GET       | / | PantryService.updateIngredients       pantry-search
| --------- |:--------------------------------------:| --------------------:|
| POST      | / | PantryService.newIngredient           pantry-add
| --------- |:--------------------------------------:| --------------------:|
| PATCH     | /:ingredient_id | -updatedIngredient      pantry-update
| --------- |:--------------------------------------:| --------------------:|
| DELETE    | /:ingredient_id | -deleteIngredient       pantry-delete


  ### Recipes:
  
| **HTTP Verb** | **Path**                           | **Used for**         |
| --------- |:--------------------------------------:| --------------------:|
| GET       | / | recipesService.getAllRecipe            recipes-search
| --------- |:--------------------------------------:| --------------------:|
| POST       | / | recipesService.insertRecipe           recipe-add
| --------- |:--------------------------------------:| --------------------:|
| PATCH     | /:recipe_Id | -updateRecipe                planner-update
| --------- |:--------------------------------------:| --------------------:|
| GET       | /:recipe_Id | -deleteRecipe                planner-delete


  ### Meal Plans: 
  
| **HTTP Verb** | **Path**                           | **Used for**         | 
| --------- |:--------------------------------------:| --------------------:|
| GET       | / | planningService.getMealPlans          planner-search
| --------- |:--------------------------------------:| --------------------:|
| POST      | / | planningService.addMealPlan           planner-add
| --------- |:--------------------------------------:| --------------------:|
| PATCH     | /:mealplan_owner | -updateMealPlan        planner-update
| --------- |:--------------------------------------:| --------------------:|
| GET       | /:mealplan_owner | -deleteMealPlan        planner-delete
| --------- |:--------------------------------------:| --------------------:|
