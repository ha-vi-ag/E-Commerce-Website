// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/admin");

const routes = express.Router();

routes.get("/add-product", handlers.getAddProduct);

routes.post("/add-product", handlers.postAddProduct);

// for page rendering
routes.get("/edit-product", handlers.getEditProduct);

// for rendering of product details page with populated form
routes.get("/edit-page/:productId", handlers.editProduct);

// for making changes into product details
routes.post("/edit-product", handlers.updateProduct);

// for deleting a particular product
routes.get("/delete-product/:productId", handlers.deleteProduct);

module.exports = routes;
