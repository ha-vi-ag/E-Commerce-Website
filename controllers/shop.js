const Products = require("../models/products");
const Users = require("../models/users");
const Orders = require("../models/orders");
const PdfDocument = require("pdfkit");

exports.getHome = (req, res, next) => {
  Products.find().then((products) => {
    res.render("shop/shop", {
      pageTitle: "Shop",
      products: products,
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.removeCartProduct = (req, res, next) => {
  const id = req.params.productId;
  req.user
    .removeFromCart(id)
    .then(() => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.addToCart = (req, res, next) => {
  const id = req.params.productId;
  req.user
    .addToCart(id)
    .then(() => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Orders.find({ "user.userId": req.user.id }).then((orders) => {
    orders = orders.map((rec) => ({
      products: rec.products,
      orderId: rec._id,
    }));
    res.render("shop/orders", {
      pageTitle: "Orders",
      orders: orders,
    });
  });
};

exports.purchaseItems = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const prods = user.cart.items.map((p) => {
      return {
        quantity: p.quantity,
        productDetails: { ...p.productId },
      };
    });
    const order = new Orders({
      products: prods,
      user: {
        email: req.user.email,
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
      .catch((err) => {
        next(err);
      });
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Orders.findById(orderId)
    .then((order) => {
      return order.products;
    })
    .then((products) => {
      const pdfDoc = new PdfDocument();
      pdfDoc.pipe(res);
      pdfDoc.fontSize(15).text("Order Id: " + orderId);
      pdfDoc.text("---");
      let totalPrice = 0;
      products.forEach((product) => {
        const productDetails = product.productDetails;
        const quantity = product.quantity;
        totalPrice += quantity * productDetails.price;
        pdfDoc.text(
          `${productDetails.title} - ${quantity} x ${productDetails.price}`
        );
      });
      pdfDoc.text("--------------------");
      pdfDoc.text("Total Price: " + totalPrice);
      pdfDoc.end();
    })
    .catch((err) => next(err));
};
