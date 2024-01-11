const Products = require("../models/products");
const Users = require("../models/users");
const Orders = require("../models/orders");

exports.getHome = (req, res, next) => {
  Products.find().then((products) => {
    res.render("shop/shop", {
      pageTitle: "Shop",
      products: products,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};

exports.removeCartProduct = (req, res, next) => {
  const id = req.params.productId;
  req.user
    .removeFromCart(id)
    .then(() => res.redirect("/cart"))
    .catch(console.log);
};

exports.addToCart = (req, res, next) => {
  const id = req.params.productId;
  req.user
    .addToCart(id)
    .then(() => res.redirect("/cart"))
    .catch(console.log);
};

exports.getOrders = (req, res, next) => {
  Orders.find({ "user.userId": req.user.id }).then((records) => {
    records = records.map((rec) => rec.products);
    res.render("shop/orders", {
      pageTitle: "Orders",
      records: records,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.purchaseItems = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const prods = user.cart.items.map((p) => {
      return {
        quantity: p.quantity,
        products: { ...p.productId },
      };
    });
    const order = new Orders({
      products: prods,
      user: {
        name: req.user.name,
        userId: req.user,
      },
    });
    order
      .save()
      .then(() => {
        req.user.cart = { items: [] };
        return req.user.save();
      })
      .then(() => res.redirect("/"))
      .catch(console.log);
  });
};
