const express = require('express');
const Order = require("../models/orderModel");
const RequestProductModel = require('../models/requestProductModel');
const requestProductrRouter = express.Router();

// Place an order
requestProductrRouter.post('/requestProduct', async (req, res) => {
    try {
        const requestQuery = new RequestProductModel(req.body)
        const result = await requestQuery.save();
        res.status(201).json(result);
    } catch (err) {
        console.log(err)
    }
});

// Get order details
requestProductrRouter.get('/requestProduct/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = requestProductrRouter;
