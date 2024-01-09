// third party packages
const express = require("express");

// user defined packages
const handlers = require("../controllers/admin");

const routes = express.Router();

routes.get("/add-product", handlers.getAddProduct);

routes.get("/edit-product", handlers.getEditProduct);

routes.get("/edit-page/:productId", handlers.editProduct);

routes.post("/edit-product", handlers.updateProduct);

routes.get("/delete-product/:productId", handlers.deleteProduct);

routes.post("/add-product", handlers.postAddProduct);

module.exports = routes;
