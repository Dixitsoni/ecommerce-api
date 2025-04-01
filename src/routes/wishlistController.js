const express = require('express');
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productmodel');
const wishlistRouter = express.Router();

// Add a product to the wishlist
wishlistRouter.post('/wishlist', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        const existingProductIndex = wishlist.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingProductIndex === -1) {
            wishlist.products.push({ productId });
            await wishlist.save();
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get wishlist items
wishlistRouter.get('/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = wishlistRouter;
