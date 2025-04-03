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

// Update product quantity in the wishlist (increment or decrement)
wishlistRouter.put('/wishlist/:userId/quantity', async (req, res) => {
    const { userId } = req.params;
    const { productId, action } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        const productIndex = wishlist.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex !== -1) {
            // For Wishlist, quantity management could be handled based on business logic
            // assuming no quantity or always 1 (wishlist typically holds products the user wants, not quantities)
            return res.status(400).json({ message: 'Quantity not supported in wishlist' });
        } else {
            return res.status(404).json({ message: 'Product not in wishlist' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete a product from the wishlist
wishlistRouter.delete('/wishlist/:userId/product', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        const productIndex = wishlist.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex !== -1) {
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ message: 'Product removed from wishlist', wishlist });
        } else {
            return res.status(404).json({ message: 'Product not in wishlist' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = wishlistRouter;
