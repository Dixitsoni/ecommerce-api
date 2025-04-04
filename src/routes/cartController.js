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

// Update product quantity in the cart (increment or decrement)
cartRouter.put('/cart/:userId/quantity', async (req, res) => {
    const { userId } = req.params;
    const { productId, action } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex !== -1) {
            if (action === 'increment') {
                cart.products[productIndex].quantity += 1;
            } else if (action === 'decrement' && cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Invalid action or quantity is already 1' });
            }

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not in cart' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete a product from the cart
cartRouter.delete('/cart/:userId/product', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);  
            await cart.save();
            return res.status(200).json({ message: 'Product removed from cart', cart });
        } else {
            return res.status(404).json({ message: 'Product not in cart' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



module.exports = cartRouter