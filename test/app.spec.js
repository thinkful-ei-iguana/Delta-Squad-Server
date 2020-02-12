const app = require("../src/app");
const knex = require("knex");

describe("app", () => {
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

  it("GET / responds with 200 containing Hello, boilerplate!", () => {
    return supertest(app)
      .get("/")
      .expect(200, "Hello, boilerplate!");
  });

  // context("with no data in the database", () => {
  //   it("GET / responds with 200 and an empty array", () => {
  //     return supertest(app)
  //       .get("/")
  //       .expect(200, []);
  //   });
  // });
});
