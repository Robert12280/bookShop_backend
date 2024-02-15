const express = require("express");
const path = require("path");
const app = express();
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const passport = require("passport");

app.use(logger);

app.use(express.json());

app.use(passport.initialize());

app.use(cookieParser());

app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/books", require("./routes/bookRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/order", require("./routes/orderRoutes"));

app.use(errorHandler);

module.exports = app;
