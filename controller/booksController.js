const Book = require("../models/Book");
const asyncHandler = require("express-async-handler");
const client = require("../config/redisConn");

const DEFAULT_EXPIRATION = 3600;

// @desc Get all books
// @route GET /books
// @access Private
const getAllBooks = asyncHandler(async (req, res) => {
  //   const books = await getOrSetCache("books", async () => {
  //     const data = await Book.find().lean();
  //     return data;
  //   });

  const books = await Book.find().lean();

  if (!books?.length) {
    res.status(400).json({ message: "Not books found" });
  }
  res.json(books);
});

const getOrSetCache = async (key, callback) => {
  const response = await client.get(key);
  if (response) return JSON.parse(response);
  const freshData = await callback();
  client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));

  return freshData;
};

// @desc Create new book
// @route POST /books
// @access Private
const createNewBook = asyncHandler(async (req, res) => {
  const { bookname, author, publishYear, imgSrc, price, summary, type } =
    req.body;

  if (
    !bookname ||
    !price ||
    !author ||
    !publishYear ||
    !summary ||
    !Array.isArray(type) ||
    !type.length
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const bookObject = {
    bookname,
    price,
    author,
    publishYear,
    summary,
    type,
    imgSrc,
  };

  const book = await Book.create(bookObject);
  if (book) {
    res.status(201).json({ message: `New book ${bookname} created` });
  } else {
    res.status(400).json({ message: "Invalid book data received" });
  }
});

// @desc update a book
// @route PATCH /books
// @access Private
const updateBook = asyncHandler(async (req, res) => {
  const { bookname, price, author, publishYear, summary, type, id, imgSrc } =
    req.body;

  if (
    !bookname ||
    !price ||
    !author ||
    !publishYear ||
    !summary ||
    !imgSrc ||
    !Array.isArray(type) ||
    !type.length
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const book = await Book.findById(id).exec();
  if (!book) {
    return res.status(400).json({ message: "Book not found" });
  }

  book.bookname = bookname;
  book.price = price;
  book.author = author;
  book.publishYear = publishYear;
  book.summary = summary;
  book.type = type;
  book.imgSrc = imgSrc;

  const updatedBook = await book.save();

  res.json({ message: `${updatedBook.bookname} update` });
});

// @desc Delete a book
// @route DELETE /books
// @access Private
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Book ID Required" });
  }

  const book = await Book.findById(id).exec();
  if (!Book) {
    return res.status(400).json({ message: "Book not found" });
  }

  await book.deleteOne();

  const reply = `Bookname ${book.bookname} with ID ${book._id} deleted`;

  res.json(reply);
});

module.exports = { getAllBooks, createNewBook, updateBook, deleteBook };
