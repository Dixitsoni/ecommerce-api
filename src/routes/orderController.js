const express = require('express');
const Order = require("../models/orderModel");
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel');
const orderRouter = express.Router();
const Shipping = require("../models/shippingModel");


orderRouter.post('/placeorder', async (req, res) => {
    const { userId, shippingAddress } = req.body;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderProducts = [];

        for (const item of cart.products) {
            const product = item.productId;
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            totalAmount += product.price * item.quantity;
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Deduct stock
        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Create order
        const order = new Order({
            userId,
            products: orderProducts,
            totalAmount
        });

        await order.save();

        // Create shipping entry
        const shipping = new Shi({
            orderId: order._id,
            userId,
            ...shippingAddress
        });

        await shipping.save();

        // Link shipping to order
        order.shippingId = shipping._id;
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

orderRouter.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('products.productId')
            .populate('shippingId'); // Get shipping details

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = orderRouter;
