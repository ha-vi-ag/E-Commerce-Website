// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/auth");

const routes = express.Router();

routes.get("/login", handlers.getLogin);

routes.post("/login", handlers.postLogin);

routes.post("/logout", handlers.postLogout);

routes.get("/signup", handlers.getSignup);

routes.post("/signup", handlers.postSignup);

module.exports = routes;
