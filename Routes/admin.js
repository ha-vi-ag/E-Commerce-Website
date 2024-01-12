// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const routes = express.Router();

routes.get("/add-product", isAuth, handlers.getAddProduct);

routes.post("/add-product", isAuth, handlers.postAddProduct);

// for page rendering
routes.get("/edit-product", isAuth, handlers.getEditProduct);

// for rendering of product details page with populated form
routes.get("/edit-page/:productId", isAuth, handlers.editProduct);

// for making changes into product details
routes.post("/edit-product", isAuth, handlers.updateProduct);

// for deleting a particular product
routes.get("/delete-product/:productId", isAuth, handlers.deleteProduct);

module.exports = routes;
