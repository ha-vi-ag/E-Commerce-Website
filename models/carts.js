const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "Data", "carts.json");

module.exports = class Cart {
  static fetchProducts(cb) {
    fs.readFile(p, "utf-8", (err, products) => {
      let prods = [];
      if (products.length > 0) prods = JSON.parse(products);
      cb(prods);
    });
  }

  static deleteItem(id) {
    return new Promise((resolve, reject) => {
      Cart.fetchProducts((products) => {
        const prods = products.filter((product) => product.id != id);

        fs.writeFile(p, JSON.stringify(prods), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  static addToCart(product, qty) {
    return new Promise((resolve, reject) => {
      Cart.fetchProducts((products) => {
        let flag = true;
        for (let i = 0; i < products.length; i++) {
          if (products[i].id == product.id) {
            const preQuantity = products[i].qty;
            products[i] = {
              ...product,
              qty: qty + preQuantity,
              price: product.price * (qty + preQuantity),
            };

            console.log(products[i]);
            flag = false;
            break;
          }
        }
        if (flag && qty > 0) products.push({ ...product, qty: qty });

        console.log(products);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }
};
