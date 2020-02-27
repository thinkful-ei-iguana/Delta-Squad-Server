// const jwt = require("jsonwebtoken");
// const app = require("../src/app");
// const helpers = require("./test-helpers");

// describe("/ mealplan endpoint", () => {
//   let db;

//   const testPlans = helpers.makeUsersArray();
//   const testPlan = testPlans[0];

//   before("make knex instance", () => {
//     db = helpers.makeKnexInstance();
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   before("cleanup", () => helpers.cleanTables(db));

//   afterEach("cleanup", () => helpers.cleanTables(db));

//   describe("GET /api/planner", () => {
//     beforeEach("get mealplan", () => helpers.seedMealPlans(db, testPlans));

//     const requiredFields = [
//       "id",
//       "title",
//       "planned_date",
//       "time_to_make",
//       "needed_ingredients",
//       "mealplan_owner"
//     ];

//     requiredFields.forEach(field => {
//       const mealPlanAttempt = {
//         id: 7,
//         title: "Scrambled Eggs with Cheddar Cheese",
//         planned_date: "2/14/2020",
//         time_to_make: "2",
//         needed_ingredients: "eggs, shredded cheddar cheese",
//         mealplan_owner: 3
//       };

//       it(`responds with 400 required error when '${field}' is missing`, () => {
//         delete mealPlanAttempt[field];
//         return supertest(app)
//           .get("/api/planner")
//           .send(mealPlanAttempt)
//           .expect(400, {
//             error: `Missing '${field}' in request body`
//           });
//       });

//       it("/GET mealplans responds with 200 containing a seeded mealplan", () => {
//         return supertest(app)
//           .get("/api/planner")
//           .expect((err, res) => {
//             if (err) {
//               console.error(err);
//             }
//             res.should.have.status(200);
//             res.body.should.be.a("array");
//             // res.body.length.should.be.eql(0)
//             done();
//           });
//       });
//     });
//   });
// });
