const Products = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Products({ ...req.body });
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
  Products.find()
    .then((products) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};

exports.editProduct = (req, res, next) => {
  const id = req.params.productId;
  Products.find().then((products) => {
    const product = products.filter((product) => product.id == id);
    res.render("admin/edit-page", {
      pageTitle: "Edit Details",
      product: product[0],
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.updateProduct = (req, res, next) => {
  const id = req.body.id;
  Products.findById(id)
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
  Products.findByIdAndDelete(id)
    .then(() => Cart.findByIdAndDelete(id))
    .then(() => res.redirect("/admin/edit-product"))
    .catch(console.log);
};
