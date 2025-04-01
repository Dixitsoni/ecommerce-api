const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const productSchema = new mongoose.Schema({
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
    type: Number,
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
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
