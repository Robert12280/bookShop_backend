const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientController");
const loginLimiter = require("../middleware/loginLimiter");

router.post("/register", clientController.userRegister);

router.post("/login", loginLimiter, clientController.userLogin);

router.get("/refresh", clientController.userRefresh);

router.post("/logout", clientController.userLogout);

module.exports = router;
