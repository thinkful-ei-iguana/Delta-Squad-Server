const express = require("express");
const logger = require("../logger");
const RecipeService = require("./recipes-service");
const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const recipeRouter = express.Router();

recipeRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    console.log('require aut is', requireAuth);
    const knexInstance = req.app.get("db");
    const user_id = req.user.id;
    console.log("req recipe router is", req.user);
    RecipeService.getAllRecipes(knexInstance, user_id)
      .then(recipes => {
        console.log('recipes GET is', recipes);
        res.json(recipes);
      })
      .catch(next);
  });

recipeRouter
  .route("/:id")
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    RecipeService.getRecipeById(knexInstance, id)
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
            // date_created: recipe.date_created,
            created_by: recipe.created_by
          });
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    RecipeService
      .deleteRecipe(knexInstance, id)
      .then(recipe => {
        if (recipe === -1) {
          logger.error(`Recipe with id ${id} not found`);
          return res.status(404).send("Recipe not found");
        }
        logger.info(`Recipe with id ${id} has been deleted`);
        res.status(204).end();
      })
      .catch(next);
  });

recipeRouter.route("/").post(bodyParser, (req, res, next) => {
  const {
    title,
    owner,
    recipe_description,
    recipe_ingredients,
    time_to_make
  } = req.body;

  if (!title) {
    logger.error("Title is required");
    return res.status(400).send("Title required");
  }

  if (!recipe_description) {
    logger.error("Recipe description is required");
    return res.status(400).send("Recipe description required");
  }

  if (!recipe_ingredients) {
    logger.error("Recipe ingredients is required");
    return res.status(400).send("Recipe ingredients required");
  }

  if (!time_to_make) {
    logger.error("Time to make is required");
    return res.status(400).send("Time to make required");
  }

  const recipe = {
    title,
    owner,
    recipe_description,
    recipe_ingredients,
    time_to_make
  };

  const knexInstance = req.app.get("db");

  RecipeService
    .insertRecipe(knexInstance, recipe)
    .then(recipe => {
      const { id } = recipe;
      logger.info(`Recipe with id of ${id} was created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe);
    })
    .catch(next);
});

recipeRouter.patch("/edit/:id", bodyParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { id } = req.params;
  const {
    title,
    recipe_description,
    recipe_ingredients,
    time_to_make
  } = req.body;
  const updatedData = {
    title,
    recipe_description,
    recipe_ingredients,
    time_to_make
  };

  const numberOfValues = Object.values(updatedData).filter(Boolean).length;
  if (numberOfValues === 0) {
    return res.status(400).json({
      error: {
        message:
          "Request body must contain either 'title', 'recipe desription', 'recipe ingredients or 'time to make'"
      }
    });
  }

  RecipeService
    .updateRecipe(knexInstance, id, updatedData)
    .then(update => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = recipeRouter;
