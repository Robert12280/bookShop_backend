const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

const orderController = require("../controller/orderController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
    .route("/")
    .get(orderController.getAllOrder)
    .post(orderController.createOrder);

router.patch(
    "/:orderId",
    verifyRoles(ROLES_LIST.Admin),
    orderController.updateOrder
);

module.exports = router;
