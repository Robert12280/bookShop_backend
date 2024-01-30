const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc User register
// @route POST /client/register
// @access Public
const userRegister = asyncHandler(async (req, res) => {
    const { username, password, againPassword, email } = req.body;

    if (!username || !password || !againPassword || !email)
        return res.status(400).json({ message: "All fields are required" });

    if (password !== againPassword)
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
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc User login
// @route POST /client/login
// @access Public
const userLogin = asyncHandler(async (req, res) => {
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
                username: foundUser.username,
                roles: foundUser.roles,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );

    const refreshToken = jwt.sign(
        { username: foundUser.username },
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
// @route GET /client/refresh
// @access Private
const userRefresh = asyncHandler(async (req, res) => {
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
                username: decoded.username,
            }).exec();
            if (!foundUser)
                return res.status(401).json({ message: "Unauthorized" });

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
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
// @route POST /client/logout
// @access Private
const userLogout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    res.json({ message: "Cookie cleared" });
});

module.exports = { userRegister, userLogin, userRefresh, userLogout };
