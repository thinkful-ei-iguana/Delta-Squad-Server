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
      .then(mealplan => {
        if (!mealplan) {
          logger.error(`Mealplan with id ${id} not found`);
          return res.status(404).send("Mealplan not found");
        } else {
          res.json({
            id: mealplan.id,
            title: mealplan.title,
            owner: mealplan.owner,
            planned_date: xss(mealplan.planned_date),
            prep_time: mealplan.prep_time,
            needed_inrgedients: mealplan.needed_inrgedients,
            mealplan_owner: mealplan.mealplan_owner
          });
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    planningService
      .deleteMealPlan(knexInstance, id)
      .then(mealplan => {
        if (mealplan === -1) {
          logger.error(`Mealplan with id ${id} not found`);
          return res.status(404).send("Mealplan not found");
        }
        logger.info(`Mealplan with id ${id} has been deleted`);
        res.status(204).end();
      })
      .catch(next);
  });

planningRouter.route("/").post(bodyParser, (req, res, next) => {
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
    .insertMealPlan(knexInstance, mealplan)
    .then(mealplan => {
      const { id } = mealplan;
      logger.info(`MealPlan with id of ${id} was created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${mealplan.id}`))
        .json(mealplan);
    })
    .catch(next);
});

planningRouter.patch("/edit/:id", bodyParser, (req, res, next) => {
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

module.exports = planningRouter;
