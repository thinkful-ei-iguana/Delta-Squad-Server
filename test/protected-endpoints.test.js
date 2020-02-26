const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Protected Endpoints", function () {
  let db;

  const testUsers = helpers.makeUsersArray;
  const testRecipes = helpers.makeRecipes;
  const testIngredients = helpers.makeIngredients;



  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));


  beforeEach("insert", () =>
    helpers.seedTables(
      db,
      testUsers,
      testRecipes,
      testIngredients
    )
  );

  const protectedEndpoints = [
    {
      name: "GET /api/pantry",
      path: "/api/pantry",
      method: supertest(app).get,
    },
    {
      name: "POST /api/pantry",
      path: "/api/pantry",
      method: supertest(app).post,
    },
    {
      name: "PATCH /api/pantry/:ingredient_id",
      path: "/api/pantry/1",
      method: supertest(app).patch,
    },
    {
      name: "DELETE /api/pantry/:ingredient_id",
      path: "/api/pantry/1",
      method: supertest(app).delete,
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it("responds with 401 'Missing bearer token' when no bearer token", () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: "Missing bearer token" });
      });

      it("responds 401 Unauthorized Request when invalid JWT secret", () => {
        const validUser = testUsers[0];
        const invalidSecret = "bad-secret";
        return endpoint.method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: "Unauthorized Request" });
      });

      it("responds 401 'Unauthorized request' when invalid sub in payload", () => {
        const invalidUser = { email: "dontexist@nothere.com", id: 1 };
        return endpoint.method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: "Unauthorized Request" });
      });
    });
  });
}); 