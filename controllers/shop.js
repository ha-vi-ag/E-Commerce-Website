const Products = require("../models/products");
const Cart = require("../models/carts");
const Orders = require("../models/orders");

exports.getHome = (req, res, next) => {
  Products.fetchAllProducts((prods) => {
    res.render("shop/shop", { pageTitle: "Shop", products: prods });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchProductsWithDetails((products) => {
    res.render("shop/cart", { pageTitle: "Cart", products: products });
  });
};

exports.removeCartProduct = (req, res, next) => {
  const id = req.params.productId;
  Cart.deleteItem(id)
    .then(() => res.redirect("/cart"))
    .catch(console.log);
};

exports.addToCart = (req, res, next) => {
  const id = req.params.productId;

  Cart.addToCart(id)
    .then(() => res.redirect("/cart"))
    .catch(console.log);
};

exports.getOrders = (req, res, next) => {
  Orders.fetchRecords((records) => {
    res.render("shop/orders", { pageTitle: "Orders", records: records });
  });
};

exports.purchaseItems = (req, res, next) => {
  Cart.fetchProductsWithDetails((products) => {
    Orders.addDetails(products)
      .then(() => Cart.emptyCart())
      .then(() => res.redirect("/"))
      .catch(console.log);
  });
};
