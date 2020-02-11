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
    const db = req.app.get("db");

    PantryService.getIngredients(db)
      .then((ingredients) => {
        res.json(ingredients);
      })
      .catch((err) => {
        next(err);
      });
  })
  .post(requireAuth, bodyParser, (req, res, next) => {

  })
  .patch(requireAuth, bodyParser, (req, res, next) => {

  });



module.exports = pantryRouter;