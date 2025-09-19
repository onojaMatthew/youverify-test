import axios from "axios";
import { Logger } from "../config/logger";
import { Payment } from "../models/payment";
import { Order } from "../models/order";

class PaymentService {
  constructor() {
    this.baseURL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5002';
  }

  async processPayment({ customerId, orderReferenceId, productId, amount }) {
    try {
      const paymentData = {
        customerId,
        orderReferenceId,
        productId,
        amount
      };

      const response = await axios.post(`${this.baseURL}/initiate`, paymentData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) return response.data;
      
      return { success: false, error: 'Payment processing failed' };
    } catch (err) {
      Logger.log({ level: "error", message: `Error processing payment for order ${orderReferenceId}: ${err.message}`});
      return { success: false, error: err.message };
    }
  }

  async saveTransactionRecord(transactionData) {
    try {
      console.log(transactionData, " transaction data in save transaction record")
      const data = JSON.parse(transactionData);
      const payment = new Payment(data);
      await payment.save();
      Logger.log({ level: "info", message: `Transaction record saved: ${payment.transactionId}`});
    } catch (err) {
      Logger.log({ level: "error", message: `Error saving customer data:, ${err.message}`});
    }
  }

  async refundPayment(transactionData) {
    try {
      const data = JSON.parse(transactionData);
      const { orderReferenceId } = data;
      let order = await Order.findOne({ orderReferenceId });
      if (order) {
        order.paymentStatus = "refunded";
        await order.save();
      }

      Logger.log({ level: "info", message: `Payment refunded for order: ${orderReferenceId}`});
    } catch (err) {
      Logger.log({ level: "error", message: `Error refunding order payment:, ${err.message}`});
    }
  }
}

export const PaymentSrv = new PaymentService();