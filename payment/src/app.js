require("dotenv").config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const Paymentrouter = require('./routers/payment.routes');

app.use(express.json());
app.use(cookieParser());

app.use('/api/payments', Paymentrouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Payment Service is up and running',
    });
});

module.exports = app;