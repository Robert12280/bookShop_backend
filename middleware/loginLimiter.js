const rateLimit = require("express-rate-limit");
const { logEvent } = require("../middleware/logger");

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message:
            "Too many login attemps from this IP, please try again after a 60 second pause",
    },
    handler: (req, res, next, options) => {
        logEvent(
            `Too Many Request: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
            "errLog.log"
        );
        res.status(options.statusCode).send(options.message);
    },
    standarHeaders: true,
    legacyHeaders: false,
});

module.exports = loginLimiter;
