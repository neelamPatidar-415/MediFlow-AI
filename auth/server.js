require('dotenv').config();
const app = require("./src/app");

//this 2 line RabbitMQ setup for notification service 
const { connectBroker } = require("./src/broker/broker");
connectBroker();

// console.log("MONGO_URL =", process.env.MONGO_URL);

const connectdb = require("./src/db/db");

connectdb();

app.listen(3000,() => {
    console.log("server is running on port 3000");
})

