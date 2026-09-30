const express = require("express");

const cookieParser = require("cookie-parser");
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

// Register routes
const userRouter = require("./routes/auth.routes");
app.use("/api/auth", userRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Auth Service is up and running',
    });
});

module.exports = app;