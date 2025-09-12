import amqp from 'amqplib';

export const consumer = async (queue) => {
    let connection, channel;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const connectRabbitMQ = async () => {
        try {
            // Establish connection
            connection = await amqp.connect('amqp://rabbitmq-service.messaging:5672');
            channel = await connection.createChannel();

            // Assert the queue (create it if it doesn't exist)
            await channel.assertQueue(queue, { durable: true });  // Set to 'true' for durability

            console.log(`Waiting for messages in ${queue}...`);
    
            // Consume messages from the queue
            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    console.log(` [x] Received from ${queue}: '%s'`, msg.content.toString());
                    channel.ack(msg); // Acknowledge the message
                }
            });
        } catch (error) {
            console.error(`Error connecting to RabbitMQ or listening to queue ${queue}:`, error);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`Retrying in 5 seconds... (Attempt ${retryCount})`);
                setTimeout(connectRabbitMQ, 5000);
              } else {
                console.log("Max retries reached. Giving up.");
              }
        }
    };

    // Start the connection
    connectRabbitMQ();
}

export const listenToMultipleQueues = async (queues) => {
    for (let queue of queues) {
        consumer(queue);
    }
}
