const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        productList: [
            {
                bookName: { type: String },
                amount: { type: Number },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
