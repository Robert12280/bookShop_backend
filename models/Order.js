const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        deliveryStatus: {
            type: String,
            required: true,
            default: "訂單已建立",
        },

        bookList: [
            {
                active: {
                    type: Boolean,
                    required: true,
                },
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
