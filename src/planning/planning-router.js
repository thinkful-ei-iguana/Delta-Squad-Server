const express = require("express");
const logger = require("../logger");
const planningService = require("../planning/planning-service");
const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const planningRouter = express.Router();

planningRouter.route("/").get(requireAuth, (req, res, next) => {
  console.log("require auth is", requireAuth);
  const knexInstance = req.app.get("db");
  const user_id = req.user.id;
  console.log("req mealplans router is", req.user);
  planningService
    .getAllMealPlans(knexInstance, user_id)
    .then(mealplans => {
      console.log("mealplans GET is", mealplans);
      res.json(mealplans);
    })
    .catch(next);
});

planningRouter
  .route("/:id")
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    planningService
      .getMealPlanById(knexInstance, id)
      .then(recipe => {
        if (!recipe) {
          logger.error(`Mealplan with id ${mealplan.id} not found`);
          return res.status(404).send("Mealplan not found");
        } else {
          res.json({
            id: recipe.id,
            title: recipe.title,
            owner: recipe.owner,
            planned_date: xss(mealplan.planned_date),
            prep_time: mealplan.prep_time,
            needed_inrgedients: mealplan.needed_inrgedients,
            // date_created: recipe.date_created,
            created_by: mealplan.created_by
          });
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    planningService
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

PlanningRouter.route("/").post(bodyParser, (req, res, next) => {
  const { title, owner, planned_date } = req.body;

  if (!title) {
    logger.error("Title is required");
    return res.status(400).send("Title required");
  }
  if (!planned_date) {
    logger.error("Planned date is required");
    return res.status(400).send("Planned Date required");
  }

  const mealplan = {
    title,
    owner,
    planned_date
  };

  const knexInstance = req.app.get("db");

  planningService
    .insertMealPlan(knexInstance, recipe)
    .then(mealplan => {
      const { id } = mealplan;
      logger.info(`MealPlan with id of ${id} was created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe);
    })
    .catch(next);
});

PlanningRouter.patch("/edit/:id", bodyParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { id } = req.params;
  const { title, planned_date } = req.body;
  const updatedData = {
    title,
    planned_date
  };

  const numberOfValues = Object.values(updatedData).filter(Boolean).length;
  if (numberOfValues === 0) {
    return res.status(400).json({
      error: {
        message: "Request body must contain either 'title' and 'planned date'"
      }
    });
  }

  planningService
    .updateMealPlan(knexInstance, id, updatedData)
    .then(update => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = recipeRouter;
