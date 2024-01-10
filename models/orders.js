const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "Data", "orders.json");

module.exports = class Orders {
  static fetchRecords(callback) {
    fs.readFile(p, "utf-8", (err, records) => {
      let recordList = records.length > 0 ? JSON.parse(records) : [];
      callback(recordList);
    });
  }

  static writeRecordsIntoDb(records, resolve, reject) {
    fs.writeFile(p, JSON.stringify(records), (err) => {
      err ? reject(err) : resolve();
    });
  }

  static addDetails(products) {
    return new Promise((resolve, reject) => {
      Orders.fetchRecords((records) => {
        products.forEach((p) => {
          records.push({
            title: p.title,
            price: p.price,
            qty: p.qty,
            imageUrl: p.imageUrl,
            orderDate: new Date(),
          });
        });
        Orders.writeRecordsIntoDb(records, resolve, reject);
      });
    });
  }
};
