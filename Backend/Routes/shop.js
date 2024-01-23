// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const routes = express.Router();

routes.get("/", handlers.getHome);

routes.get("/cart", isAuth, handlers.getCart);

routes.get("/addtocart/:productId", isAuth, handlers.addToCart);

routes.get("/orders", isAuth, handlers.getOrders);

routes.get("/remove-from-cart/:productId", isAuth, handlers.removeCartProduct);

routes.get("/purchase", isAuth, handlers.purchaseItems);

routes.get("/order-invoice/:orderId", isAuth, handlers.getInvoice);

module.exports = routes;
