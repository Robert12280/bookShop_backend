const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc Get cart
// @route GET /cart
// @access Private
const getCart = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(400).json({ message: "Please provide userId" });

    const cart = await Cart.findOne({ userId }).populate("bookList.book", [
        "bookname",
        "price",
        "bookId",
        "imgSrc",
    ]);

    if (!cart) return res.status(400).json({ message: "User is not found" });

    const formattedCartData = cart.bookList.map((cart) => ({
        book: cart.book._id,
        active: cart.active,
        bookname: cart.book.bookname,
        price: cart.book.price,
        quantity: cart.quantity,
        imgSrc: cart.book.imgSrc,
        bookId: cart.book.bookId,
    }));

    res.json(formattedCartData);
});

// @desc update cart
// @route POST /cart
// @access Private
const updateBookInCart = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const bookList = req.body;

    if (!userId)
        return res.status(400).json({ message: "Please provide userId" });

    const cart = await Cart.findOne({ userId }).exec();
    if (cart) {
        cart.bookList = bookList;
        const updatedCart = await cart.save();

        res.json({ message: `Cart of "${updatedCart.userId}" is update` });
    } else {
        const cartObject = {
            userId,
            bookList,
        };

        const newCart = await Cart.create(cartObject);
        if (newCart) {
            res.status(201).json({ message: "New cart is created" });
        } else {
            res.status(400).json({ message: "Invalid cart data received" });
        }
    }
});

module.exports = {
    getCart,
    updateBookInCart,
};
