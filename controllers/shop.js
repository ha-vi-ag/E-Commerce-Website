const Products = require("../models/products");
const Cart = require("../models/carts");

exports.getHome = (req, res, next) => {
  Products.fetchProducts((prods) => {
    res.render("shop/shop", { pageTitle: "Shop", products: prods });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchProducts((products) => {
    res.render("shop/cart", { pageTitle: "Cart", products: products });
  });
};

exports.addToCart = (req, res, next) => {
  const id = req.params.productId;
  Products.fetchProducts((products) => {
    const product = products.filter((product) => product.id == id)[0];

    Cart.addToCart(product, 1)
      .then(() => {
        res.redirect("/cart");
      })
      .catch(console.log);
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Orders" });
};
