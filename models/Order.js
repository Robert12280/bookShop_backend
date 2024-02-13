const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderStatus: {
            type: String,
            required: true,
            default: "訂單已建立",
        },

        deliveryStatus: {
            type: String,
            required: true,
            default: "待出貨",
        },

        bookList: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],

        isDone: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
