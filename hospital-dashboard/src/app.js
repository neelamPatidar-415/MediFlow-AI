const express = require("express");
const cookieParser = require("cookie-parser");

const dashboardRoutes = require("./routes/dashboard.routes");

const { connectBroker } = require("./broker/broker");
const setListener = require("./broker/listener");

const app = express();

connectBroker().then(() => {
    setListener();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hospital Dashboard Service is up and running",
    });
});

module.exports = app;