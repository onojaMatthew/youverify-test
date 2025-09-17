import amqp from "amqplib";
import { ProductSrv } from "./productService";
const { Logger } = require('../config/logger');
import { QUEUE_TRANSACTION, PRODUCT_CREATED, STOCK_UPDATED, PRODUCT_UPDATED, CUSTOMER_CREATED } from "./queue";
import { CustomerSrv } from "./customerService";

let connection = null;
let channel = null;

const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://admin:password@localhost:5672';
const queues = [QUEUE_TRANSACTION, PRODUCT_CREATED, STOCK_UPDATED, PRODUCT_UPDATED, CUSTOMER_CREATED ];

/**
 * Initialize RabbitMQ connection and channel
 */
const initializeRabbitMQ = async () => {
  try {
    // Create connection with retry logic
    let retries = 5;
    while (retries > 0) {
      try {
        connection = await amqp.connect(RABBITMQ_URI);
        Logger.log({ level: "info", message: "rabbitMQ connection established"})
        break;
      } catch (error) {
        retries--;
        Logger.log({level: "warn", message: `Failed to connect to RabbitMQ, retries left: ${retries}`});
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    channel = await connection.createChannel();
    
    for (let queue of queues) {
      await channel.assertQueue(queue, {
        // Queue survives broker restarts
        durable: true, 
        // Write messages to queue
        persistent: true 
      });
    }
    

    // Handle connection events
    connection.on('error', (err) => {
      Logger.log({level: "error", message: `RabbitMQ connection error: ${err.message}`});
    });

    connection.on('close', () => {
      Logger.log({ level: "warn", message: 'RabbitMQ connection closed'});
    });

    Logger.log({ level: "info", message: `RabbitMQ initialized successfully` });
  } catch (err) {
    Logger.log({level: "error", message: `Failed to initialize RabbitMQ: ${err.message}`});
    throw err;
  }
};

/**
 * Publish message
 */
const publishToQueue = async (queueName, message) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    const published = channel.sendToQueue(queueName, messageBuffer, {
      // Message survives broker restarts
      persistent: true,
      timestamp: Date.now(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    });

    if (published) {
      Logger.log({level: "info", message: `Message published to queue ${queueName}: ${message}`});
      return true;
    } else {
      throw new Error('Failed to publish message to queue');
    }
  } catch (err) {
    Logger.log({level: "error", message: `Error publishing to queue: ${err.message}`});
    throw err;
  }
};

/**
 * Consume messages from queue
 */
const consumeFromQueue = async (queueName, callback) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await channel.consume(queueName, async (message) => {
      if (message !== null) {
        try {
          const content = JSON.parse(message.content.toString());
          Logger.log({level: "info", message: `Message received from queue ${queueName}: ${content}`});
          
          // Process message
          await callback(content);
          
          // Acknowledge message
          channel.ack(message);
          Logger.log({ level: "info", message: 'Message processed and acknowledged' });
        } catch (err) {
          Logger.log({ level: "error", message: `Error processing message: ${err.message}`});
          // Reject message and don't requeue
          channel.nack(message, false, false);
        }
      }
    }, {
      noAck: false // Manual acknowledgment
    });

    Logger.log({ level: "info", message: `Started consuming from queue: ${queueName}`});
  } catch (err) {
    Logger.log({level: "error", message: `Error consuming from queue: ${err.message}`});
    throw err;
  }
};

/**
 * Close RabbitMQ connection
 */
const closeConnection = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    Logger.log({level: "info", message: 'RabbitMQ connection closed'});
  } catch (err) {
    Logger.log({ level: "error", message: `Error closing RabbitMQ connection: ${err}`});
  }
};

export {
  initializeRabbitMQ,
  publishToQueue,
  consumeFromQueue,
  closeConnection,
};

export const listenToMultipleQueues = async (queues) => {
    for (let queue of queues) {
      switch(queue) {
        case "create-product":
          consumeFromQueue(queue, ProductSrv.saveProduct);
          break;
        case "udpate-product":
          consumeFromQueue(queue, ProductSrv.updateProduct);
          break;
        case "update-stock":
          consumeFromQueue(queue, ProductSrv.updateStock);
          break;
        // case "transaction-queue":
        //   consumeFromQueue(queue, ProductSrv.updateStock);
        //   break;
        case "create-customer":
          consumeFromQueue(queue, CustomerSrv.saveCustomerRecord);
          break;
      }
      
    }
}