const express = require("express");
const router = express.Router();
const booksController = require("../controller/booksController");
const verifyJWT = require("../middleware/verifyJWT");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
    .route("/")
    .get(booksController.getAllBooks)
    .post(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        booksController.createNewBook
    )
    .patch(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        booksController.updateBook
    )
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        booksController.deleteBook
    );

module.exports = router;
