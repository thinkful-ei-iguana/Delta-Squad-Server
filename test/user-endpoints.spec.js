const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");

// NEEDS MORE WORK

describe.only("User Endpoints", function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = helpers.makeKnexInstance();
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  /**
   * @description Register a user and populate their fields
   **/
  describe(`POST /api/accounts`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["user_name", "password", "first_name", "user_email"];

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        user_name: "test username",
        password: "test password",
        first_name: "test name",
        user_email: "test@test.1",
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field];

        return supertest(app)
          .post("/api/accounts")
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });

    it(`responds 400 'Password should be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        user_name: "test username",
        user_email: "test@test.1",
        password: "1234567",
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(userShortPassword)
        .expect(400, { error: `Password should be longer than 8 characters` });
    });

    it(`responds 400 'Password should be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        user_name: "test username",
        user_email: "test@test.1",
        password: "*".repeat(73),
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(userLongPassword)
        .expect(400, { error: `Password should be less than 72 characters` });
    });

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        user_name: "test username",
        user_email: "test@test.1",
        password: " 1Aa!2Bb@",
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(userPasswordStartsSpaces)
        .expect(400, {
          error: `Password must not start or end with empty spaces`
        });
    });

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        user_name: "test username",
        user_email: "test@test.1",
        password: "1Aa!2Bb@ ",
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(userPasswordEndsSpaces)
        .expect(400, {
          error: `Password must not start or end with empty spaces`
        });
    });

    it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        user_name: "test username",
        user_email: "test@test.1",
        password: "11AAaabb",
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(userPasswordNotComplex)
        .expect(400, {
          error: `Password must contain one upper case, lower case, number and special character`
        });
    });

    it(`responds 400 'User name already taken' when username isn't unique`, () => {
      const duplicateUser = {
        user_name: testUser.user_name,
        user_email: "test@test.1",
        password: "11AAaa!!",
        first_name: "test name"
      };
      return supertest(app)
        .post("/api/accounts")
        .send(duplicateUser)
        .expect(400, { error: `Username already taken` });
    });

    describe(`Given a valid user`, () => {
      it(`responds 201, serialized user with no password`, () => {
        const newUser = {
          user_name: "test username",
          user_email: "test@test.1",
          password: "11AAaa!!",
          first_name: "test name"
        };
        return supertest(app)
          .post("/api/accounts")
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(`/api/accounts/${res.body.id}`);
          });
      });

      it(`stores the new user in db with bcryped password`, () => {
        const newUser = {
          user_name: "test username",
          user_email: "test@test.1",
          password: "11AAaa!!",
          first_name: "test name"
        };
        return supertest(app)
          .post("/api/accounts")
          .send(newUser)
          .expect(res =>
            db
              .from("accounts")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.first_name).to.eql(newUser.first_name);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
