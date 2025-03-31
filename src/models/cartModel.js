const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name is required"],
  },
  description: {
    type: String,
    required: [true, "product description is required"],
  },
  image: {
    type: String,
    required: [true, "product image is required"],
  },
  price: {
    type: String,
    required: [true, "product price is required"],
  },
  category: {
    type: String,
    required: [true, "product category is required"],
  },
  location: {
    type: String,
    required: [true, "product location is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: [true, "product quantity is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
