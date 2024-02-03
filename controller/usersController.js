const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
        res.status(400).json({ message: "Not users found" });
    }
    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, email, roles } = req.body;

    if (
        !username ||
        !password ||
        !email ||
        !Array.isArray(roles) ||
        !roles.length
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const usernameDuplicated = await User.findOne({ username }).exec();
    if (usernameDuplicated) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    const emailDuplicated = await User.findOne({ email }).lean().exec();
    if (emailDuplicated) {
        return res.status(409).json({ message: "Duplicate email" });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const userObject = { username, password: hashPwd, roles, email };

    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { username, password, email, roles, active, id } = req.body;

    if (
        !username ||
        !email ||
        !id ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean"
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const usernameDuplicated = await User.findOne({ username }).lean().exec();
    if (usernameDuplicated) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    const emailDuplicated = await User.findOne({ email }).lean().exec();
    if (emailDuplicated) {
        return res.status(409).json({ message: "Duplicate email" });
    }

    user.username = username;
    user.email = email;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} update` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "User ID Required" });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    await user.deleteOne();

    const reply = `Username ${user.username} with ID ${user._id} deleted`;

    res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
