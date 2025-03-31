const express = require("express");
const ProductModel = require("../models/productmodel");
const productRouter = express.Router();
const { verifyToken } = require("../middlewares/auth");

productRouter.post("/create-product", verifyToken, async (req, res) => {
  const createProduct = new ProductModel(req.body);
  await createProduct.save();
  res.status(200).json({ message: "Product added successfully!" });
});

productRouter.get("/product", async (req, res) => {
  const { category, location } = req.query;
  if (category || location) {
    const products = await ProductModel.find({
      category: category,
      location: location,
    });
    return res.status(200).json({ data: products });
  }
  const products = await ProductModel.find();
  res.status(200).json({ data: products });
});

productRouter.delete("/product/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.put("/product/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "Product updated successfully" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const product = await ProductModel.findById(id);
    return res.status(200).json({ data: product });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.delete("/product/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.put("/cart/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndUpdate(id, { cart: true }, {
      new: true,
    });
    return res.status(200).json({ message: "Product is added to your cart" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.delete("/cart/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndUpdate(id, { cart: false }, {
      new: true,
    });
    return res.status(200).json({ message: "Product removed from your cart" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.put("/wishlist/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndUpdate(id, { wishlist: true }, {
      new: true,
    });
    return res.status(200).json({ message: "Product is added to your wishlist" });
  }
  return res.status(400).json({ message: "Product not found" });
});

productRouter.delete("/wishlist/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ProductModel.findByIdAndUpdate(id, { wishlist: false }, {
      new: true,
    });
    return res.status(200).json({ message: "Product removed from your cart" });
  }
  return res.status(400).json({ message: "Product not found" });
});


module.exports = productRouter;
