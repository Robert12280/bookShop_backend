const express = require("express");
const router = express.Router();

const orderController = require("../controller/cartController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
    .route("/")
    .get(orderController.getAllOrder)
    .post(orderController.createOrder);

module.exports = router;
