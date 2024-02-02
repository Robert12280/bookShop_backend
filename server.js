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
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(express.json());

app.use(cookieParser());

app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/client", require("./routes/clientRoutes"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/books", require("./routes/bookRoutes"));
app.use("/cart", require("./routes/cartRoutes"));

app.use(errorHandler);

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
