const express = require("express");
const logger = require("../logger");
const planningService = require("../planning/planning-service");
const AccountService = require("../users/users-service");
const requireAuth = require("../middleware/jwt-auth");
const xss = require("xss");
const path = require("path");

const bodyParser = express.json();
const planningRouter = express.Router();

const serializeMealPlan = mealplan => {
  return {
    ...mealplan
  };
};

planningRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    console.log("require auth is", req.user.id);
    let user_id = req.user.id;
    planningService
      .getMealPlans(req.app.get("db"), user_id)
      .then(mealplans => {
        console.log("mealplans GET is", mealplans);
        res.status(200).json(mealplans);
      })
      .catch(err => {
        next(err);
      });
  })

  .post(requireAuth, bodyParser, (req, res, next) => {
    let { title, planned_date, prep_time, needed_ingredients } = req.body;
    console.log(req.body);
    console.log(req.user.id);
    let mealplan_owner = req.user.id;
    const newMealPlan = {
      title,
      planned_date,
      prep_time,
      needed_ingredients,
      mealplan_owner
    };
    for (const [key, value] of Object.entries(newMealPlan)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    planningService
      .addMealPlan(req.app.get("db"), newMealPlan)
      .then(mealplan => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${mealplan.id}`))
          .json(serializeMealPlan(mealplan));
      })
      .catch(err => {
        next(err);
      });
  });

planningRouter
  .route("/:mealplan_owner")
  .patch(requireAuth, bodyParser, (req, res, next) => {
    let { title, planned_date, prep_time, needed_ingredients } = req.body;
    let updatedMealPlan = {
      title,
      planned_date,
      prep_time,
      needed_ingredients
    };
    let mealPlanId = req.body.id;
    console.log("updatedMealPlan is", updatedMealPlan);
    console.log("req PATCH is", req);
    planningService
      .updateMealPlan(req.app.get("db"), updatedMealPlan, mealPlanId)
      .then(updatedMealPlanResponse => {
        console.log("updatedPatch is", updatedMealPlanResponse);
        res.status(201).json({
          id: updatedMealPlanResponse.id,
          title: updatedMealPlanResponse.title,
          owner: updatedMealPlanResponse.owner,
          planned_date: updatedMealPlanResponse.planned_date,
          prep_time: updatedMealPlanResponse.prep_time,
          needed_ingredients: updatedMealPlanResponse.needed_ingredients,
          mealplan_owner: updatedMealPlanResponse.mealplan_owner
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .delete(requireAuth, (req, res, next) => {
    console.log("ingredient id in delete is", req.params);
    planningService
      .deleteMealPlan(req.app.get("db"), req.params.mealplan_owner)
      .then(numRowsAffected => {
        res.status(204).end();
      })
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

// planningRouter.route("/").post(bodyParser, (req, res, next) => {
//   const { title, planned_date, prep_time, needed_ingredients } = req.body;

//   if (!title) {
//     logger.error("Title is required");
//     return res.status(400).send("Title required");
//   }
//   if (!planned_date) {
//     logger.error("Planned date is required");
//     return res.status(400).send("Planned Date required");
//   }

//   const mealplan = {
//     title,
//     planned_date,
//     prep_time,
//     needed_ingredients
//   };

//   const knexInstance = req.app.get("db");

//   planningService
//     .insertMealPlan(knexInstance, mealplan)
//     .then(mealplan => {
//       const { id } = mealplan;
//       logger.info(`MealPlan with id of ${id} was created`);
//       res
//         .status(201)
//         .location(path.posix.join(req.originalUrl, `/${mealplan.id}`))
//         .json(mealplan);
//     })
//     .catch(next);
// });

// planningRouter.patch("/edit/:id", bodyParser, (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   const { id } = req.params;
//   const { title, planned_date } = req.body;
//   const updatedData = {
//     title,
//     planned_date
//   };

//   const numberOfValues = Object.values(updatedData).filter(Boolean).length;
//   if (numberOfValues === 0) {
//     return res.status(400).json({
//       error: {
//         message: "Request body must contain either 'title' and 'planned date'"
//       }
//     });
//   }

//   planningService
//     .updateMealPlan(knexInstance, id, updatedData)
//     .then(update => {
//       res.status(204).end();
//     })
//     .catch(next);
// });

module.exports = planningRouter;
