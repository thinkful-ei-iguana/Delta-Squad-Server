const calendarService = {
  getCalendar(db, user_id) {
    console.log("getting mealplans");
    return db("calendars")
      .select("*")
      .where("calendar_owner", user_id);
  },
  addCalendar(db, calendar) {
    return db
      .insert(calendar)
      .into("calendars")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  updateCalendar(db, updatedCalendar, calendarId) {
    return db("calendars")
      .where({ id: calendarId })
      .update(updatedCalendar)
      .returning("*");
  },
  getAllByUser(db, accounts) {
    return db("calendars")
      .select("*")
      .where("calendar_owner", accounts);
  },
  getCalendarById(db, id) {
    return db("calendars")
      .select("*")
      .where("calendars.id", id)
      .first();
  }
};

module.exports = calendarService;
