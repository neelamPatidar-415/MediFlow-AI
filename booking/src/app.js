const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const bookingRouter = require("./routes/booking.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Booking Service is up and running",
    });
});

module.exports = app;