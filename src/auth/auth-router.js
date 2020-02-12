const express = require("express");
const AuthService = require("./auth-service");
const requireAuth = require("../middleware/jwt-auth");

const authRouter = express.Router();
const jsonParser = express.json();

// only houses LOGIN endpoint... /api/auth/login
authRouter
  .post("/login", jsonParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const loginUser = { user_name, password };
    console.log('req.body auth router /login is', req.body);
    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });

    AuthService.getUserWithUserName(req.app.get("db"), loginUser.user_name)
      .then(dbUser => {
        if (!dbUser) {
          console.log('user is null', dbUser);
          return res.status(400).json({
            error: "Incorrect user_name or password"
          });
        }
        console.log('login pw vs db pw', loginUser.password, dbUser.password);
        return AuthService.comparePasswords(
          loginUser.password,
          dbUser.password
        ).then(compareMatch => {
          if (!compareMatch) {
            console.log('bad password match', compareMatch);
            return res.status(400).json({
              error: "Incorrect user_name or passwordV2"
            });
          }
          const sub = dbUser.user_name;
          const payload = { user_id: dbUser.id };

          res.send({
            authToken: AuthService.createJwt(sub, payload)
          });
        });
      })
      .catch(next);
  });

authRouter
  .put("/token", requireAuth, (req, res) => {

    const sub = req.user.user_name;
    const payload = {
      user_id: req.user.id,
      name: req.user.first_name,
    };
    res
      .send({
        authToken: AuthService.createJwt(sub, payload),
      });

  });

module.exports = authRouter;
