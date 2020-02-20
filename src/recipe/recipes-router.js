const express = require("express");
const logger = require("../logger");
const recipesService = require("./recipes-service");
const pantryService = require("../pantry/pantry-service")
const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const recipeRouter = express.Router();

const serializeRecipe = recipe => {
  return {
    ...recipe
  };
};

recipeRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    console.log("require auth is", req.user.id);
    let user_id = req.user.id;
    console.log("req recipe router is", req.user);
    recipesService
      .getAllRecipes(req.app.get("db"), user_id)
      .then(recipes => {
        console.log("recipes GET is", recipes);
        res.status(200).json(recipes);
      })
      .catch(err => {
        next(err);
      });
  })

  .post(requireAuth, bodyParser, (req, res, next) => {
    //console.log("recipe POST req.body is", req.body);
    let { title, recipe_description, time_to_make, recipe_ingredients } = req.body;
    let recipe_owner = req.user.id;
    let recipeId = '';

    const newRecipe = { 
      title, 
      recipe_description, 
      time_to_make,
      recipe_owner };
    let ingredientIdArray = [];
    //console.log("new recipe from req is", newRecipe);
    for (const [key, value] of Object.entries(newRecipe)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }
    recipesService
      .insertRecipe(req.app.get("db"), newRecipe)
      .then(recipe => {
        recipeId = recipe.id;
        //console.log("res is", serializeRecipe(recipe));
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
          .json(serializeRecipe(recipe));
      })
      .then(res => {
        // check if ingredients exist in pantry
        // if it does not, add ingredient to pantry and
        // make in_stock and ingredient owner null
        recipe_ingredients.map(ingredient => {
          let newIngredient = { 
            ingredient_name: ingredient, 
            in_stock: null,  
            ingredient_owner: req.user.id };
          pantryService.addNewIngredientsFromRecipe(req.app.get("db"), newIngredient)
        })})
      .then(res => {
        // get all of the ingredient id and add to recipe_ingredients
        recipe_ingredients.map(ingredient => {
          pantryService.getIngredientsId(req.app.get("db"), ingredient, req.user.id)
            .then(result => {
              console.log('result: ', result)
              let recipeIngredient = {
                recipe_id: recipeId,
                ingredient_id: result.id,
              }
              recipesService.addRecipeIngredient(req.app.get("db"), recipeIngredient);
              console.log('we made it to the end...')
            })



          //console.log('ingredient id: ', result);
          //ingredientIdArray.push(result.id);
          //console.log('did we get here:', ingredientIdArray);
        }); 
      })
     /* .then(res => {
        console.log('ingredientIdArray:', ingredientIdArray);
        ingredientIdArray.map(id => {
          console.log("array created but now this service...")
          console.log("recipeId is", recipeId)
          let recipeIngredient = {
            recipe_id: recipeId,
            ingredient_id: id,
          }
          recipesService.addRecipeIngredient(req.app.get("db"), recipeIngredient);
        })
      })*/
      .catch(err => {
        next(err);
      });


 

  });

recipeRouter
  .route("/:recipe_Id")
  .patch(requireAuth, bodyParser, (req, res, next) => {
    let { title, recipe_description, time_to_make } = req.body;
    let updatedRecipe = { title, recipe_description, time_to_make };
    let recipeId = req.body.id;
    console.log("updatedRecipe is", updatedRecipe);
    console.log("req PATCH is", req);
    recipesService
      .updateRecipe(req.app.get("db"), updatedRecipe, recipeId)
      .then(updatedRecipeResponse => {
        console.log("updatedPatch is", updatedRecipeResponse);
        res.status(201).json({
          title: updatedRecipeResponse.title,
          recipe_description: updatedRecipeResponse.recipe_description,
          time_to_make: updatedRecipeResponse.time_to_make
        });
      })
      .catch(err => {
        next(err);
      });
  })
  .delete(requireAuth, (req, res, next) => {
    recipesService
      .deleteRecipe(req.app.get("db"), req.params.recipe_Id)
      .then(recipe => {
        if (recipe === -1) {
          logger.error(`Recipe with id ${id} not found`);
          return res.status(404).send("Recipe not found");
        }
        logger.info(`Recipe with id ${id} has been deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    //let user_id = req.user.id;
    let recipeid = req.params.recipe_Id;
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    recipesService
      .getRecipeById(req.app.get("db"), recipeid)
      .then(recipe => {
        if (!recipe) {
          logger.error(`Recipe with id ${recipe.id} not found`);
          return res.status(404).send("Recipe not found");
        } else {
          res.json({
            id: recipe.id,
            title: recipe.title,
            owner: recipe.owner,
            recipe_description: xss(recipe.recipe_description),
            recipe_ingredients: recipe.recipe_ingredients,
            time_to_make: recipe.time_to_make,
            //date_created: recipe.date_created,
            //created_by: recipe.created_by
          });
        }
      })
      .catch(next);
  });

// recipeRouter.route("/").post(bodyParser, (req, res, next) => {
//   const {
//     title,
//     owner,
//     recipe_description,
//     recipe_ingredients,
//     time_to_make
//   } = req.body;

//   if (!title) {
//     logger.error("Title is required");
//     return res.status(400).send("Title required");
//   }

//   if (!recipe_description) {
//     logger.error("Recipe description is required");
//     return res.status(400).send("Recipe description required");
//   }

//   if (!recipe_ingredients) {
//     logger.error("Recipe ingredients is required");
//     return res.status(400).send("Recipe ingredients required");
//   }

//   if (!time_to_make) {
//     logger.error("Time to make is required");
//     return res.status(400).send("Time to make required");
//   }

//   const recipe = {
//     title,
//     owner,
//     recipe_description,
//     recipe_ingredients,
//     time_to_make
//   };

//   const knexInstance = req.app.get("db");

//   recipesService
//     .insertRecipe(knexInstance, recipe)
//     .then(recipe => {
//       const { id } = recipe;
//       logger.info(`Recipe with id of ${id} was created`);
//       res
//         .status(201)
//         .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
//         .json(recipe);
//     })
//     .catch(next);
// });

module.exports = recipeRouter;
