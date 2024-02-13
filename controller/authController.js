const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");

// @desc User register
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
    const { username, password, matchPassword, email } = req.body;

    if (!username || !password || !matchPassword || !email)
        return res.status(400).json({ message: "All fields are required" });

    if (username.length < 8)
        return res
            .status(400)
            .json({ message: "Username length must be greater than 8" });

    if (password.length < 8)
        return res
            .status(400)
            .json({ message: "Password length must be greater than 8" });

    if (password !== matchPassword)
        return res.status(400).json({ message: "Password is different" });

    const usernameDuplicated = await User.findOne({ username }).lean().exec();
    if (usernameDuplicated)
        return res.status(409).json({ message: "Duplicate username" });

    const emailDuplicated = await User.findOne({ email }).lean().exec();
    if (emailDuplicated)
        return res.status(409).json({ message: "Duplicate email" });

    const hashPwd = await bcrypt.hash(password, 10);

    const userObject = { username, password: hashPwd, email };

    const user = await User.create(userObject);
    if (user) {
        const cartObject = {
            userId: user._id,
            bookList: [],
        };

        // create new cart
        const newCart = await Cart.create(cartObject);
        if (newCart) {
            res.status(201).json({ message: "New user ${username} created" });
        } else {
            res.status(400).json({ message: "Create cart fail" });
        }
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc User login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ username }).lean().exec();

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: "User is not exist" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.status(401).json({ message: "Password is error" });
    }

    const accessToken = jwt.sign(
        {
            UserInfo: {
                userId: foundUser._id,
                username: foundUser.username,
                roles: foundUser.roles,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1m",
        }
    );

    const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
});

// @desc User refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const foundUser = await User.findOne({
                email: decoded.email,
            }).exec();
            if (!foundUser)
                return res.status(401).json({ message: "Unauthorized" });

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        userId: foundUser._id,
                        username: foundUser.username
                            ? foundUser.username
                            : foundUser.name,
                        roles: foundUser.roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "10s",
                }
            );

            res.json({ accessToken });
        })
    );
});

// @desc user logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    res.json({ message: "Cookie cleared" });
});

// @desc get google callback
// @route GET /auth/google/callback
// @access Private
const googleCallback = (req, res) => {
    const { user } = req;
    const refreshToken = jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.APP_URI}`);
};
module.exports = { register, login, refresh, logout, googleCallback };
