const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const bookSchema = new mongoose.Schema(
    {
        bookname: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        imgSrc: {
            type: String,
            required: true,
        },
        type: [
            {
                type: String,
                required: true,
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        summary: String,
    },
    { timestamps: true }
);

bookSchema.plugin(AutoIncrement, { inc_field: "bookId" });

module.exports = mongoose.model("Book", bookSchema);
