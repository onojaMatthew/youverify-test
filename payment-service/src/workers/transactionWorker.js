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
    console.log("processing transaction ", transactionData)
    const data = JSON.parse(transactionData)
    const { customerId, orderReferenceId, orderId, productId, amount, paymentId, timestamp, status } = data;
    
    // Generate transaction ID
    const transactionId = generateTransactionId();
    
    // Create transaction record
    const transaction = new Transaction({
      transactionId,
      orderReferenceId,
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
    
   
  } catch (err) {
    Logger.log({ level: "error", message: `Error processing transaction: ${err.message}`});
    throw err;
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