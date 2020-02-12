const express = require("express");
const logger = require("../logger");
const PantryService = require("./pantry-service");
const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const pantryRouter = express.Router();

// need to build protected endpoints here and in recipe router

pantryRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    console.log("pantry ingredients user id GET req is", req.user.id);
    let user_id = req.user.id;
    PantryService.getIngredients(req.app.get('db'), user_id) // need to pull this data in from req once we know what is being sent from client
      .then((ingredients) => {
        console.log('ingredients list is', ingredients);
        res.json(ingredients);
      })
      .catch((err) => {
        next(err);
      });
  })

// haven't been able to test POST at all yet
//   .post(requireAuth, bodyParser, (req, res, next) => {
//     console.log('ingredient POST req.body is', req.body);
//     const newIngredient = { ingredient_name: , in_stock: , notes: , ingredient_owner: }

//     for (const [key, value] of Object.entries(newIngredient)) {
//       if (value === null) {
//         return res.status(400).json({
//           error: { message: `Missing ${key} in request body` }
//         });
//       }
//     }
//     PantryService.addIngredient(req.app.get('db'), newIngredient)
//       .then(ingredient => {
//         res
//           .status(201)
//           .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
//           .json({
//             ingredient_name: ingredient.ingredient_name,
//             in_stock: ingredient.in_stock,
//             notes: ingredient.notes,
//             ingredient_owner: ingredient.ingredient_owner
//           });
//       })
//       .catch((err) => {
//         next(err);
//       });
//   });

// pantryRouter
//   .route('/:ingredient_id')
//   .patch(requireAuth, bodyParser, (req, res, next) => {
//     let updatedIngredient = req.body.updatedIngredient
//     PantryService.updateIngredient(req.app.get('db'), updatedIngredient)
//       .then((updatedIngredientResponse) => {
//         res
//           .status(201)
//           .json({
//             ingredient_name: updatedIngredientResponse.ingredient_name,
//             in_stock: updatedIngredientResponse.in_stock,
//             notes: updatedIngredientResponse.notes,
//             ingredient_owner: updatedIngredientResponse.ingredient_owner
//           });
//       })
//       .catch((err) => {
//         next(err);
//       });
//   });



module.exports = pantryRouter;