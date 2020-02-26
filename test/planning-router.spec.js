const app = require("../src/app");
const knex = require("knex");

describe("test planning router endpoint", () => {
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
      .expect(200, "hello boilerplate");
  });
});
