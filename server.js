require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const { logger, logEvent } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const client = require("./config/redisConn");
const mongoose = require("mongoose");
const passport = require("passport");
require("./config/passportSetup");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

if (!client.isOpen) {
    client.connect();
}

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

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("ready", () => {
    console.log("Connected on Redis");
});

mongoose.connection.once("open", () => {
    console.log("Connected on MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvent(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});
