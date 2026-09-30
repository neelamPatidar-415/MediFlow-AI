const express = require('express');
const cors = require('cors');

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", // overall origin isnt' working exact hi daalna padha.
        credentials: true,
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'AI Buddy Service is up and running',
    });
});

module.exports = app;