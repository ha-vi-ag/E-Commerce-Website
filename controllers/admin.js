const Products = require("../models/products");
const Users = require("../models/users");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    error: null,
    oldInputs: {
      title: "",
      price: "",
      imageUrl: "",
      description: "",
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Products({ ...req.body, userId: req.user._id });
  // save method doesn't return promise but mongoose provide then and catch
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      error: errors.array()[0].msg,
      oldInputs: {
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
      },
    });
  }
  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  // this is a static method
  Products.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.editProduct = (req, res, next) => {
  const id = req.params.productId;
  Products.findById({ _id: id })
    .then((product) => {
      res.render("admin/edit-page", {
        error: null,
        pageTitle: "Edit Details",
        error: null,
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.updateProduct = (req, res, next) => {
  const id = req.body.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-page", {
      pageTitle: "Edit Details",
      error: errors.array()[0].msg,
      product: {
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        _id: id,
      },
    });
  }

  Products.findById({ _id: id, userId: req.user._id })
    .then((product) => {
      // product here will not be just only javascript object
      // instead mongoose return it as mongoose object

      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      return product.save();
    })
    .then(() => res.redirect("/"))
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  // Products.findByIdAndDelete(id)
  Products.findOneAndDelete({ _id: id, userId: req.user._id })
    .then(() => {
      return Users.find();
    })
    .then((users) => {
      const promiseArray = users.map((user) => user.removeFromCart(id));
      return Promise.all(promiseArray);
    })
    .then(() => res.redirect("/admin/edit-product"))
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};
