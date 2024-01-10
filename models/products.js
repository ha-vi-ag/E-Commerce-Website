const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "Data", "db.json");

module.exports = class Products {
  static fetchAllProducts(callback) {
    fs.readFile(p, "utf-8", (err, products) => {
      let prods = products.length > 0 ? JSON.parse(products) : [];
      callback(prods);
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      Products.fetchAllProducts((products) => {
        const product = products.filter((p) => p.id == id)[0];
        resolve(product);
      });
    });
  }

  static writeIntoDb(products, resolve, reject) {
    fs.writeFile(p, JSON.stringify(products), (err) => {
      err ? reject(err) : resolve();
    });
  }

  static updateProduct(product) {
    return new Promise((resolve, reject) => {
      Products.fetchAllProducts((products) => {
        products = products.map((p) => (p.id != product.id ? p : product));
        Products.writeIntoDb(products, resolve, reject);
      });
    });
  }

  static deleteProduct(id) {
    return new Promise((resolve, reject) => {
      Products.fetchAllProducts((products) => {
        const newProductsList = products.filter((product) => product.id != id);
        Products.writeIntoDb(newProductsList, resolve, reject);
      });
    });
  }

  static addNewProduct(productDetails) {
    return new Promise((resolve, reject) => {
      Products.fetchAllProducts((prods) => {
        prods.push({ ...productDetails, id: new Date() });
        Products.writeIntoDb(prods, resolve, reject);
      });
    });
  }
};
