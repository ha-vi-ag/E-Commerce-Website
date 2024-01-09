// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/shop");

const routes = express.Router();

routes.get("/", handlers.getHome);

routes.get("/cart", handlers.getCart);

routes.get("/addtocart/:productId", handlers.addToCart);

routes.get("/orders", handlers.getOrders);

module.exports = routes;
