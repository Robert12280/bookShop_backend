const mongoose = require("mongoose");
const Cart = require("../models/Cart");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: [8, "Password should be greater than 8 characters"],
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password should be greater than 8 characters"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        roles: {
            type: [String],
            default: ["customer"],
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.pre("deleteOne", async function (next) {
    try {
        await Cart.deleteMany({ userId: this.getQuery()._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
