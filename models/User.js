const mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
