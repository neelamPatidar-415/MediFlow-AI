const express = require('express');
const app = express();

const { connectBroker } = require('./broker/broker');
const setListener = require('./broker/listener');

connectBroker().then(() => {
    setListener();
});


///yaha koi route ka path pattern nhi he 
// still aaws deploy me to chahiye so i gave 
// /api/notifications/*


app.get('/', (req, res) => {
    res.send('Notification Service is up and running!');
});


module.exports = app;