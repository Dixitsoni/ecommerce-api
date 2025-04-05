const express = require('express');
const mongoose = require('mongoose');
const Order = require("../models/orderModel");
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel++');
const Shipping = require("../models/shippingModel");

const orderRouter = express.Router();

// Place an Order
orderRouter.post('/placeorder', async (req, res) => {
    const { userId } = req.body;

    // Start a transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId').session(session);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderProducts = [];
        const bulkUpdates = [];

        for (const item of cart.products) {
            const product = item.productId;
            if (!product || product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            totalAmount += product.price * item.quantity;
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // Prepare bulk update to reduce stock
            bulkUpdates.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { stock: -item.quantity } }
                }
            });
        }

        // Perform bulk stock update
        if (bulkUpdates.length > 0) {
            await Product.bulkWrite(bulkUpdates, { session });
        }

        // Create and save the order
        const order = await Order.create([{ userId, products: orderProducts, totalAmount }], { session });

        // Clear user's cart
        await Cart.updateOne({ userId }, { $set: { products: [] } }, { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Order placed successfully', order: order[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: `Order placement failed: ${error.message}` });
    }
});

// Get orders for a user
orderRouter.get('/order/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('products.productId');

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: `Error fetching orders: ${error.message}` });
    }
});

// Admin: Get all orders with shipping details
orderRouter.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('products.productId')
            .populate('shippingId'); // Fetch linked shipping info

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: `Error fetching admin orders: ${error.message}` });
    }
});

module.exports = orderRouter;
