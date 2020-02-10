require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { NODE_ENV } = require("./config");
const app = express();
const logger = require("logger");
var sys = require("util");
const recipeRouter = require("./recipe/recipes-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express());

app.use("/api/recipes", recipeRouter);
app.use("/api/accounts", usersRouter);
app.use("/api/auth", authRouter);

// first commit for third capstone
//   "Remove console.logs, check the recipes-router line 30ish in the backend, do media queries for mobile phones"

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});
console.log("first commit");
const PORT = process.env.PORT || 8000;

module.exports = app;
