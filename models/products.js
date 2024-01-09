const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "Data", "db.json");

module.exports = class Products {
  static fetchProducts(cb) {
    fs.readFile(p, "utf-8", (err, products) => {
      let prods = [];
      if (products.length > 0) prods = JSON.parse(products);
      cb(prods);
    });
  }

  static updateProduct(product) {
    return new Promise((resolve, reject) => {
      Products.fetchProducts((products) => {
        for (let i = 0; i < products.length; i++) {
          if (products[i].id == product.id) {
            products[i] = { ...product };
            break;
          }
        }

        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  static deleteProduct(id) {
    return new Promise((resolve, reject) => {
      Products.fetchProducts((products) => {
        const newProductsList = products.filter((product) => product.id != id);
        fs.writeFile(p, JSON.stringify(newProductsList), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  static addNewProduct(productDetails) {
    const title = productDetails.title;
    const price = productDetails.price;
    const imageUrl = productDetails.imageUrl;
    const description = productDetails.description;
    const id = new Date();

    return new Promise((resolve, reject) => {
      Products.fetchProducts((prods) => {
        prods.push({ title, price, imageUrl, description, id });

        fs.writeFile(p, JSON.stringify(prods), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }
};
