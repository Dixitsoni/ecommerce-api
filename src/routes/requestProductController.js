const express = require('express');
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

requestProductrRouter.put('/requestProduct/:userId', async (req, res) => {
    try {
        await RequestProductModel.findByIdAndUpdate({ userId: req.params.userId }, req.body, { new: true });
        res.status(200).json({ message: 'message updated customer query' });
    } catch (err) {
        console.log(err)
    }
});

// Get order details
requestProductrRouter.get('/requestProduct/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const request = await RequestProductModel.find({ userId });
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = requestProductrRouter;
