const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const loginLimiter = require("../middleware/loginLimiter");
const passport = require("passport");

router.post("/register", authController.register);

router.post("/login", loginLimiter, authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    authController.googleCallback
);

module.exports = router;
