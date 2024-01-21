// third party packages
const express = require("express");
const { check } = require("express-validator");
// user defined packages
const handlers = require("../controllers/auth");
const Users = require("../models/users");

const routes = express.Router();

routes.get("/login", handlers.getLogin);

routes.post("/login", handlers.postLogin);

routes.post("/logout", handlers.postLogout);

routes.get("/signup", handlers.getSignup);

// check() function will eventually return a middlware
routes.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter the valid email")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await Users.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already exists");
        }
      }),

    check(
      "password",
      "Password must contain only alphanumeric characters and minimum of length 5"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    check("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password should match");
        } else return true;
      }),
  ],
  handlers.postSignup
);

module.exports = routes;
