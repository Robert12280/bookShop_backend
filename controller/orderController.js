const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc Get all orders
// @route GET /order
// @access Private
const getAllOrder = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(400).json({ message: "Please provide userId" });

    const order = await Order.find({ userId }).populate("bookList.book", [
        "bookname",
        "price",
        "bookId",
        "imgSrc",
    ]);

    if (!order) return res.status(400).json({ message: "User is not found" });

    const formattedOrderData = order.map((item) => ({
        orderId: item._id,
        orderStatus: item.orderStatus,
        deliveryStatus: item.deliveryStatus,
        bookList: item.bookList.map((order) => ({
            bookname: order.book.bookname,
            price: order.book.price,
            quantity: order.quantity,
            imgSrc: order.book.imgSrc,
            bookId: order.book.bookId,
        })),
        isDone: item.isDone,
        createdAt: item.createdAt,
    }));

    res.json(formattedOrderData);
});

// @desc create order
// @route POST /order
// @access Private
const createOrder = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const bookList = req.body;

    if (!userId)
        return res.status(400).json({ message: "Please provide userId" });

    const orderObject = {
        userId,
        bookList,
    };

    const newOrder = await Order.create(orderObject);
    const cart = await Cart.findOne({ userId }).exec();

    const newBookList = cart.bookList.filter((book) => !book.active);

    cart.bookList = newBookList;
    const updatedCart = await cart.save();

    if (newOrder && updatedCart) {
        res.status(201).json({ message: "New order is created" });
    } else {
        res.status(400).json({ message: "Invalid order data received" });
    }
});

// @desc Update order
// @route PATCH /order
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const { orderStatus, deliveryStatus, bookList, isDone } = req.body;
    console.log(orderId);

    if (!orderId)
        return res.status(400).json({ message: "Please provide orderId" });

    const order = await Order.findById(orderId).exec();
    if (!order) {
        return res.status(400).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    order.deliveryStatus = deliveryStatus;
    order.bookList = bookList;
    order.isDone = isDone;

    const updatedOrder = await order.save();
    res.json({ message: `${updatedOrder._id} update` });
});

module.exports = { getAllOrder, createOrder, updateOrder };
