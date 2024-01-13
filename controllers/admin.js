const Products = require("../models/products");
const Users = require("../models/users");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Products({ ...req.body, userId: req.user._id });
  // save method doesn't return promise but mongoose provide then and catch
  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch(console.log);
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
    .catch(console.log);
};

exports.editProduct = (req, res, next) => {
  const id = req.params.productId;
  Products.findById({ _id: id }).then((product) => {
    // const product = products.filter((product) => product.id == id);
    res.render("admin/edit-page", {
      pageTitle: "Edit Details",
      product: product,
    });
  });
};

exports.updateProduct = (req, res, next) => {
  const id = req.body.id;
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
    .catch(console.log);
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
    .catch(console.log);
};
