const express = require('express');
const Order = require("../models/orderModel");
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel');
const orderRouter = express.Router();

// Place an order
orderRouter.post('/placeorder', async (req, res) => {
    const { userId } = req.body;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderProducts = cart.products.map(item => {
            const price = item.productId.price;
            totalAmount += price * item.quantity;
            return { productId: item.productId, quantity: item.quantity, price };
        });

        const order = new Order({
            userId,
            products: orderProducts,
            totalAmount
        });

        await order.save();
        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get order details
orderRouter.get('/order/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = orderRouter;
