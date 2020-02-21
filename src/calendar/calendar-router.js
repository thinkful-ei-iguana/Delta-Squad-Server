const express = require("express");
const logger = require("../logger");
const calendarService = require("./calendar-service");
const requireAuth = require("../middleware/jwt-auth");
const path = require("path");

const bodyParser = express.json();
const calendarRouter = express.Router();

const serializeCalendar = calendar => {
  return {
    ...calendar
  };
};

calendarRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    console.log("require auth is", req.user.id);
    let user_id = req.user.id;
    calendarService
      .getCalendars(req.app.get("db"), user_id)
      .then(calendars => {
        console.log("calendars GET is", calendars);
        res.status(200).json(calendars);
      })
      .catch(err => {
        next(err);
      });
  })

  .post(requireAuth, bodyParser, (req, res, next) => {
    let { date_selected, prep_time } = req.body;
    console.log(req.body);
    console.log(req.user.id);
    let calendar_owner = req.user.id;
    const newCalendar = {
      date_selected,
      prep_time,
      calendar_owner
    };
    for (const [key, value] of Object.entries(newCalendar)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    calendarService
      .addCalendar(req.app.get("db"), newCalendar)
      .then(calendar => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${calendar.id}`))
          .json(serializeCalendar(calendar));
      })
      .catch(err => {
        next(err);
      });
  });

calendarRouter
  .route("/:calendar_owner")
  .patch(requireAuth, bodyParser, (req, res, next) => {
    let { date_selected, prep_time } = req.body;
    let updatedCalendar = {
      date_selected,
      prep_time
    };
    let calendarId = req.body.id;
    console.log("updatedCalendar is", updatedCalendar);
    console.log("req PATCH is", req);
    calendarService
      .updateCalendar(req.app.get("db"), updatedCalendar, calendarId)
      .then(updatedCalendarResponse => {
        console.log("updatedPatch is", updatedCalendarResponse);
        res.status(201).json({
          id: updatedCalendarResponse.id,
          owner: updatedCalendarResponse.owner,
          date_selected: updatedCalendarResponse.date_selected,
          prep_time: updatedCalendarResponse.prep_time,
          calendar_owner: updatedCalendarResponse.calendar_owner
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .delete(requireAuth, (req, res, next) => {
    console.log("calendar id in delete is", req.params);
    calendarService
      .deleteCalendar(req.app.get("db"), req.params.calendar_owner)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .then(calendar => {
        if (calendar === -1) {
          logger.error(`Calendar with id ${id} not found`);
          return res.status(404).send("Calendar not found");
        }
        logger.info(`Calendar with id ${id} has been deleted`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = calendarRouter;
