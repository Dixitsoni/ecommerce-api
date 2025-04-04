const express = require('express');
const Shipping = require("../models/shippingModel");
const Order = require("../models/orderModel");
const shippingRouter = express.Router();

shippingRouter.post('/createshipping', async (req, res) => {
    const { orderId, userId, fullName, address, zipCode, phone } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        // Create shipping entry
        const shipping = new Shipping({
            orderId,
            userId,
            fullName,
            address,
            zipCode,
            phone
        });

        await shipping.save();

        // Update order with shippingId
        order.shippingId = shipping._id;
        await order.save();

        res.status(200).json({ message: "Shipping details added", shipping });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

shippingRouter.get('/shipping/:userId', async (req, res) => {
    try {
        const order = await Shipping.findById({ userId: req.params.userId });
        const getUserByOrder = await Order.findById({ userId: req.params.userId })
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        // Create shipping entry
        if (!getUserByOrder) {

            return res.status(400).json({ message: "user not found" });
        }

        res.status(200).json({ message: "Shipping details added", details: { order: order, shipping: getUserByOrder } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = shippingRouter;
