const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    bookList: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
                required: true,
            },
            active: {
                type: Boolean,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Cart", cartSchema);
