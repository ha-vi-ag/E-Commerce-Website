const Products = require("../models/products");
const Cart = require("../models/carts");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.getEditProduct = (req, res, next) => {
  Products.fetchAllProducts((products) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      products: products,
    });
  });
};

exports.editProduct = (req, res, next) => {
  const id = req.params.productId;
  Products.fetchAllProducts((products) => {
    const product = products.filter((product) => product.id == id);
    res.render("admin/edit-page", {
      pageTitle: "Edit Details",
      product: product[0],
    });
  });
};

exports.updateProduct = (req, res, next) => {
  const id = req.body.id;
  Products.updateProduct(req.body)
    .then(() => res.redirect("/"))
    .catch(console.log);
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Products.deleteProduct(id)
    .then(() => Cart.deleteItem(id))
    .then(() => res.redirect("/admin/edit-product"))
    .catch(console.log);
};

exports.postAddProduct = (req, res, next) => {
  Products.addNewProduct(req.body)
    .then(() => res.redirect("/"))
    .catch(console.log);
};
