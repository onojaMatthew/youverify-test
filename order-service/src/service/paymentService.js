import axios from "axios";
import { Logger } from "../config/logger";

class PaymentService {
  constructor() {
    this.baseURL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5000';
  }

  async processPayment({ customerId, orderReferenceId, productId, amount }) {
    try {
      const paymentData = {
        customerId,
        orderReferenceId,
        productId,
        amount
      };

      const response = await axios.post(`${this.baseURL}/api/v1/payments`, paymentData, {
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
}

export const PaymentSrv = new PaymentService();