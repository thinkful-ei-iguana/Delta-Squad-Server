const express = require("express");
// const logger = require("../logger");
const PantryService = require("./pantry-service");
// const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
// const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const pantryRouter = express.Router();

const serializeIngredient = (ingredient) => {
  return {
    ...ingredient
  };
};

pantryRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    let user_id = req.user.id;
    PantryService.getIngredients(req.app.get("db"), user_id)
      .then((ingredients) => {
        if (req.query.q) {
          const filterResults = ingredients.filter((ingredient) => {
            return ingredient.ingredient_name.toLowerCase().includes(req.query.q.toLowerCase());
          });
          res.json(filterResults.map(serializeIngredient));
        } else {
          res
            .status(200)
            .json(ingredients);
        }

      })
      .catch((err) => {
        next(err);
      });
  })

  .post(requireAuth, bodyParser, (req, res, next) => {
    let { ingredient_name, in_stock, notes } = req.body;
    let ingredient_owner = req.user.id;
    const newIngredient = {
      ingredient_name: ingredient_name.toLowerCase(),
      in_stock, notes,
      ingredient_owner
    };
    for (const [key, value] of Object.entries(newIngredient)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }
    PantryService.addIngredient(req.app.get("db"), newIngredient)
      .then(ingredient => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
          .json(serializeIngredient(ingredient));
      })
      .catch((err) => {
        next(err);
      });
  });

pantryRouter
  .route("/:ingredient_id")
  .patch(requireAuth, bodyParser, (req, res, next) => {
    let { ingredient_name, in_stock, notes } = req.body;
    let updatedIngredient = { ingredient_name, in_stock, notes };
    let ingredientId = req.body.id;
    console.log("updatedIngredient is", updatedIngredient);
    // console.log("req PATCH is", req);
    PantryService.updateIngredient(req.app.get("db"), updatedIngredient, ingredientId)
      .then((updatedIngredientResponse) => {
        console.log("updatedPatch is", updatedIngredientResponse);
        res
          .status(201)
          .json({
            ingredient_name: updatedIngredientResponse.ingredient_name,
            in_stock: updatedIngredientResponse.in_stock,
            notes: updatedIngredientResponse.notes,
            ingredient_owner: updatedIngredientResponse.ingredient_owner
          });
      })
      .catch((err) => {
        next(err);
      });
  })
  .delete(requireAuth, (req, res, next) => {
    PantryService.deleteIngredient(
      req.app.get("db"),
      req.params.ingredient_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });



module.exports = pantryRouter;