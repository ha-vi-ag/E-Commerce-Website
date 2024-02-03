const Products = require("../models/products");
const Orders = require("../models/orders");
const PdfDocument = require("pdfkit");

exports.getHome = async (req, res, next) => {
  try {
    const products = await Products.find();
    // return res.render("shop/shop", {
    //   pageTitle: "Shop",
    //   products: products,
    // });
    return res.json({
      pageTitle: "Shop",
      products: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    // res.render("shop/cart", {
    //   pageTitle: "Cart",
    //   products: user.cart.items,
    // });
    return res.json({
      pageTitle: "Cart",
      products: user.cart.items,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeCartProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    await req.user.removeFromCart(id);
    res.redirect("/cart");
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  const id = req.params.productId;
  try {
    await req.user.addToCart(id);
    res.redirect("/cart");
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let orders = await Orders.find({ "user.userId": req.user.id });
    orders = orders.map((rec) => ({
      products: rec.products,
      orderId: rec._id,
    }));
    res.render("shop/orders", {
      pageTitle: "Orders",
      orders: orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.purchaseItems = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
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
    await order.save();
    req.user.cart = { items: [] };
    await req.user.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Orders.findById(orderId);
    const products = order.products;
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
  } catch (err) {
    next(err);
  }
};
