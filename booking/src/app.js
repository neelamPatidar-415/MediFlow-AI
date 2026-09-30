const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const bookingRouter = require("./routes/booking.routes");
const adverseReactionRoutes = require("./routes/adverseReaction.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());
const cors = require("cors");

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use("/api/bookings", bookingRouter);


app.use(
    "/api/adverse-reactions",
    adverseReactionRoutes
);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Booking Service is up and running",
    });
});

module.exports = app;