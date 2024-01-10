const path = require("path");
const fs = require("fs");

const Products = require("./products");
const p = path.join(__dirname, "..", "Data", "carts.json");

module.exports = class Cart {
  static fetchProducts(callback) {
    fs.readFile(p, "utf-8", (err, products) => {
      let prods = [];
      if (products.length > 0) prods = JSON.parse(products);
      callback(prods);
    });
  }

  static fetchProductsWithDetails(callback) {
    Cart.fetchProducts((products) => {
      const productsList = products.map((p) => {
        return new Promise((resolve, reject) => {
          Products.findById(p.id)
            .then((product) => {
              const productDetails = {
                ...product,
                qty: p.qty,
                price: product.price * p.qty,
              };
              resolve(productDetails);
            })
            .catch(reject);
        });
      });
      Promise.all(productsList).then((products) => {
        callback(products);
      });
    });
  }

  static writeIntoDb(products, resolve, reject) {
    fs.writeFile(p, JSON.stringify(products), (err) => {
      err ? reject(err) : resolve();
    });
  }

  static deleteItem(id) {
    return new Promise((resolve, reject) => {
      Cart.fetchProducts((products) => {
        const prods = products.filter((product) => product.id != id);
        Cart.writeIntoDb(prods, resolve, reject);
      });
    });
  }

  static addToCart(productId) {
    return new Promise((resolve, reject) => {
      Cart.fetchProducts((products) => {
        const index = products.findIndex((p) => p.id == productId);
        if (index == -1) products.push({ id: productId, qty: 1 });
        else products[index].qty += 1;

        Cart.writeIntoDb(products, resolve, reject);
      });
    });
  }

  static emptyCart() {
    return new Promise((resolve, reject) => {
      Cart.writeIntoDb([], resolve, reject);
    });
  }
};
