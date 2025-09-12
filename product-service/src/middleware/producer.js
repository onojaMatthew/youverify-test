import amqp from "amqplib";

export const producer = async (queue, message) => {
    try {
        // Connect to RabbitMQ (in Kubernetes, using the service name 'rabbitmq')
        const connection = await amqp.connect('amqp://rabbitmq-service.messaging:5672');
        const channel = await connection.createChannel();
    
        await channel.assertQueue(queue, {
          durable: false
        });
    
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(" [x] Sent '%s'", msg);
  
      } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
      }
}

