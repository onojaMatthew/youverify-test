import axios from "axios";
import { Payment } from "../models/payment";
import { Transaction } from "../models/transaction";
import { AppError } from "../utils/errorHandler";
import { generatePaymentId, generateTransactionId } from "../utils/util";
import { key } from "../config/key";
import { Logger } from "../config/logger";
import { publishToQueue } from "../service/rabbitmqService";

export const getPaymentList = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      customerId, 
      status, 
      orderReferenceId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (customerId) query.customerId = customerId;
    if (status) query.status = status;
    if (orderReferenceId) query.orderReferenceId = orderReferenceId;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const payments = await Payment.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Payment.countDocuments(query);
    const totalPages = Math.ceil(total / limit)
    const responseData = {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > parseInt(page),
        hasPrevPage: parseInt(page) > totalPages
      }
    }
    res.json({
      success: true,
      message: "Payment list fetched successfully",
      data: responseData
    });
  } catch (err) {
    Logger.error({ level: "error", message: `Error fetching payments: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById({ _id: paymentId });
    
    if (!payment) return next(new AppError("Payment not found", 404));

    // Get associated transaction if exists
    let transaction = null;
    if (payment.transactionId) {
      transaction = await Transaction.findOne({ transactionId: payment.transactionId });
    }

    res.json({
      success: true,
      message: "Payment record fetched successfully",
      data: {
        payment,
        transaction
      }
    });
  } catch (err) {
    Logger.log({ level: "", message: `Error fetching payment: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const createPayment = async (req, res, next) => {
  try {
    const { customerId, orderReferenceId, productId, amount, quantity } = req.body;
    // Generate payment ID
    const paymentId = generatePaymentId();
    
    // Create payment record
    const paymentData = {
      paymentId,
      customerId,
      orderReferenceId,
      productId,
      amount,
      status: 'processing',
      queuedAt: new Date()
    };

    const payment = new Payment(paymentData);
    await payment.save();

    Logger.log({ level: "info", message: `Payment created: ${paymentId} for order: ${orderReferenceId}`});

    // Simulating payment processing for demonstration purpose
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (paymentSuccess) {
      // Transaction details for queue
      const transactionDetails = {
        customerId,
        orderReferenceId,
        productId,
        amount,
        quantity,
        paymentId,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      // Publish to RabbitMQ queue
      if (process.env.NODE_ENV !== "test") {
        publishToQueue('transaction-queue', transactionDetails);
      }
      
      
      payment.status = 'completed';
      payment.processedAt = new Date();
      await payment.save();

      Logger.log({ level: "info", message: `Payment processed successfully: ${paymentId}`});
      
      return res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          paymentId,
          status: 'completed',
        }
      });
    } else {
      // Payment failed
      payment.status = "failed";
      payment.processedAt = new Date();
      await payment.save();


      Logger.log({ level: "error", message: `Payment failed: ${paymentId}`});
     
      const failedTransactionDetails = {
        customerId,
        orderReferenceId,
        productId,
        amount,
        paymentId,
        timestamp: new Date().toISOString(),
        status: 'failed'
      };
      
      if (process.env.NODE_ENV !== "test") {
        publishToQueue('transaction-queue', failedTransactionDetails);
      }
      

      return res.status(400).json({
        success: false,
        error: "Payment processing failed",
        data: {
          paymentId,
          status: "failed",
        }
      });
    }

  } catch (err) {
    Logger.log({ level: "error", message: `Error processing payment: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getAllTransactions = async (req, res, next) => {
  try {
    const { 
      customerId, 
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1, 
      limit = 10
    } = req.query;

    let query = {};
    
    if (customerId) query.customerId = customerId;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const responseData = {
      pagination: {
        transactions,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > page,
        hasPrevPage: page < totalPages
      }
    }
    res.json({
      success: true,
      message: "Tansactions fetched successfully",
      data: responseData,
    });
  } catch (err) {
    Logger.log({level: "error", message: `Error fetching transactions:', ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById({ _id: paymentId });
    if (!payment) return next(new AppError("Payment not found", 404));

    if (payment.status !== 'completed') return next(new AppError(`This payment is not complete. Only completed payments can be refunded`, 400))
    // Update payment status
    payment.status = 'cancelled';
    await payment.save();

    // Update transaction if exists
    if (payment.transactionId) {
      await Transaction.findOneAndUpdate(
        { transactionId: payment.transactionId },
        { paymentStatus: 'refunded' },
        { new: true }
      );
    }

    Logger.log({ level: "error", message: `Payment refunded: ${payment.paymentId}`});
    const paymentData = {
      paymentId,
      orderReferenceId: payment.orderReferenceId,
    }

    if (process.env.NODE_ENV !== "test") {
      publishToQueue("refund-payment", JSON.stringify(paymentData));
    }
    
    return res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        paymentId: payment.paymentId,
        status: payment.status
      },
    });
  } catch(err) {
    Logger.log({level: "error", message: `Error refunding payment: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}