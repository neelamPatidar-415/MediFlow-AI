const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const appointmentRouter = require("./routes/appointment.router");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/appointments", appointmentRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Appointment Service is up and running",
    });
});

module.exports = app;