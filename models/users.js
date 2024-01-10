const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  const items = this.cart.items;
  const index = items.findIndex((p) => p.productId == productId);

  if (index == -1) {
    items.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    items[index].quantity += 1;
  }
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const items = this.cart.items.filter((p) => p.productId != productId);
  this.cart.items = items;
  return this.save();
};

module.exports = mongoose.model("Users", userSchema);
