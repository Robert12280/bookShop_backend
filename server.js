require("dotenv").config();
const app = require("./app");
const { logEvent } = require("./middleware/logger");
const connectDB = require("./config/dbConn");
const client = require("./config/redisConn");
const mongoose = require("mongoose");
require("./config/passportSetup");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

// if (!client.isOpen) {
//   client.connect();
// }

// client.on("error", (err) => console.log("Redis Client Error", err));

// client.on("ready", () => {
//     console.log("Connected on Redis");
// });

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
