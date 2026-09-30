require("dotenv").config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const Paymentrouter = require('./routers/payment.routes');

app.use(express.json());
app.use(cookieParser());
const cors = require("cors");

app.use(
    cors({
        origin: true, // not that secure but wanna keep it simple for now.
        credentials: true,
    })
);

app.use('/api/payments', Paymentrouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Payment Service is up and running',
    });
});

module.exports = app;