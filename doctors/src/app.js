const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();

const app = express();

const doctorRouter = require("./routes/doctors.routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api/doctors", doctorRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Doctor Service is up and running",
    });
});

module.exports = app;