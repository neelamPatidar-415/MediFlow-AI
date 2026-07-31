const amqplib = require('amqplib')

let channel, connection;

async function connectBroker(){

    if(connection) return connection;

    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
        return connection;
    }catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        throw error;
    }
} 

async function publishToQueue(queueName, data = {}) {
    if(!channel || !connection) {
        await connectBroker();
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`Message sent to queue ${queueName} ${data}`);
}

async function subscribeToQueue(queueName, callback) {

    if(!channel || !connection) {
        await connectBroker();
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (msg) => {
        if (msg) {
            try {
                const data = JSON.parse(msg.content.toString());
                await callback(data);
                channel.ack(msg);
            } catch (err) {
                console.error('Failed to process message', err);
                channel.nack(msg, false, false);
            }
        }
    });
}


module.exports = {
    channel,
    connection,
    connectBroker,
    publishToQueue,
    subscribeToQueue,
}