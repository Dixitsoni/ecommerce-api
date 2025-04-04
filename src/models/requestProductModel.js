const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const requestProductModel = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'unknown user']
    },
    name: {
        type: String,
        required: [true, "product name is required"],
    },
    images: [
        {
            image: { type: String }
        }
    ],
    description: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: String,
        required: [true, "product description is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const RequestProductModel = mongoose.model("Request", requestProductModel);

module.exports = RequestProductModel;
