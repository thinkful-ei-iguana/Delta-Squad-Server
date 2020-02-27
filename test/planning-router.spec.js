const app = require("../src/app");
const planningRouter = require("../src/planning/planning-router");
const knex = require("knex");
const recipe_ingredients = require("../seeds");
const ingredients = require("../seeds");
const mealplans = require("../seeds");
const recipes = require("../seeds");
const accounts = require("../seeds");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("/Get mealplan endpoint", () => {
  let db;

  before("set up connection", () => {
    db = knex({
      client: "pg",
      connection: process.env.DATABASE_URL
    });
    app.set("db", db);
  });

  after("remove connection", () => {
    return db.destroy();
  });

  it("/GET mealplans responds with 200 containing a seeded mealplan", () => {
    return supertest(planningRouter)
      .get("/api/planner")
      .expect((err, res) => {
        if (err) {
          console.error(err);
        }
        res.should.have.status(200);
        res.body.should.be.a("array");
        // res.body.length.should.be.eql(0)
        done();
      });
  });
});
