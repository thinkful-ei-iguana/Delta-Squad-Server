const express = require("express");
const logger = require("../logger");
const PantryService = require("./pantry-service");
const AccountService = require("../users/users-service");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const pantryRouter = express.Router();

// need to build protected endpoints here and in recipe router

pantryRouter
  .route('/')
  .get((req, res, next) => {

  })
  .post(bodyParser, (req, res, next) => {

  })
  .patch(bodyParser, (req, res, next) => {

  });



module.exports = pantryRouter;