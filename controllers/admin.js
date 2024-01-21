const Products = require("../models/products");
const Users = require("../models/users");
const { validationResult } = require("express-validator");
const fileHandling = require("../utils/file-handling");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    error: null,
    oldInputs: {
      title: "",
      price: "",
      description: "",
    },
  });
};

exports.postAddProduct = async (req, res, next) => {
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      error: "Attached file should be in png/jpg/jpeg format",
      oldInputs: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  const product = new Products({
    ...req.body,
    imageUrl: image.path,
    userId: req.user._id,
  });
  // save method doesn't return promise but mongoose provide then and catch
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      error: errors.array()[0].msg,
      oldInputs: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  try {
    await product.save();
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const products = await Products.find({ userId: req.user._id });
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      products: products,
    });
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
};

exports.editProduct = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Products.findById({ _id: id });
    res.render("admin/edit-page", {
      error: null,
      pageTitle: "Edit Details",
      error: null,
      product: product,
    });
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const id = req.body.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-page", {
      pageTitle: "Edit Details",
      error: errors.array()[0].msg,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        _id: id,
      },
    });
  }

  try {
    const product = await Products.findById({
      _id: id,
      userId: req.user._id,
    });
    product.title = req.body.title;
    product.price = req.body.price;
    if (req.file) {
      product.imageUrl = req.file.path;
    }
    product.description = req.body.description;
    await product.save();
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Products.findOne({ _id: id, userId: req.user._id });
    if (!product) return res.redirect("/");
    const path = product.imageUrl;
    fileHandling.deleteFile(path);
    await Products.findOneAndDelete({ _id: id, userId: req.user._id });
    const users = await Users.find();
    const promiseArray = users.map(
      async (user) => await user.removeFromCart(id)
    );
    await Promise.all(promiseArray);
    res.redirect("/admin/edit-product");
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
};
