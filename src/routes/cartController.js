const express = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel');
const cartRouter = express.Router();

// Add a product to the cart
cartRouter.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouter.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouter.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Check if the product exists in the cart
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );
        if (productIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = cartRouter