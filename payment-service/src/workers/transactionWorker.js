import { Transaction } from '../models/transaction';
import { Logger } from '../config/logger';
import { consumeFromQueue } from '../service/rabbitmqService';
import { generateTransactionId } from '../utils/util';
import { QUEUE_TRANSACTION } from '../service/queue';

/**
 * Process transaction message from queue
 */
const processTransaction = async (transactionData) => {
  try {
    const { customerId, orderId, productId, amount, paymentId, timestamp, status } = transactionData;
    
    // Generate transaction ID
    const transactionId = generateTransactionId();
    
    // Create transaction record
    const transaction = new Transaction({
      transactionId,
      paymentId,
      customerId,
      orderId,
      productId,
      amount,
      paymentStatus: status,
      transactionStatus: 'completed',
      processedAt: new Date(),
      metadata: {
        source: 'queue_worker',
        queueTimestamp: timestamp
      }
    });

    await transaction.save();
    
    Logger.log({ level: "info", message: `Transaction saved to database: ${transactionId} for payment: ${paymentId}`});
    
    // Simulate additional processing (e.g., sending notifications, updating analytics, etc.)
    await simulateAdditionalProcessing(transaction);
  } catch (err) {
    Logger.log({ level: "error", message: `Error processing transaction: ${err.message}`});
    throw err;
  }
};

/**
 * Simulate additional processing that might happen after saving transaction
 */
const simulateAdditionalProcessing = async (transaction) => {
  try {
    // Simulate notification sending
    Logger.log({ level: "info", message: `Notification sent for transaction: ${transaction.transactionId}`});
    
    // Simulate analytics update
    Logger.log({ level: "info", message: `Analytics updated for transaction: ${transaction.transactionId}`});
    
    // Add small delay to simulate real processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (err) {
    Logger.log({ level: "error", message: `Error in additional processing: ${err.messagee}`});
  }
};

/**
 * Start the transaction worker
 */
const startTransactionWorker = async () => {
  try {
    await consumeFromQueue(QUEUE_TRANSACTION, processTransaction);
    Logger.log({ level: "info", message: 'Transaction worker started successfully' });
  } catch (err) {
    Logger.log({ level: "error", message: `Failed to start transaction worker: ${err.message}`});
    throw err;
  }
};

export {
  startTransactionWorker,
  processTransaction
};