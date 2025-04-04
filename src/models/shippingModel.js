const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryStatus: { type: String, default: 'Processing' } // Pending, Shipped, Delivered
});

const Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = Shipping;
