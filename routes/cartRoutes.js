const express = require("express");
const router = express.Router();

const cartController = require("../controller/cartController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
    .route("/")
    .get(cartController.getCart)
    .patch(cartController.updateBookInCart);

module.exports = router;
