import { Logger } from "../config/logger";
import { Product } from "../models/product";

class CustomerService {
  constructor() {
    this.baseURL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5200';
  }

  async saveCustomerRecord(transactionData) {
    try {
      const data = JSON.parse(transactionData);
      let product = await Product.findOne({ _id: data.productId });
      if (product) return;
      product.stock = product.stock - data.quantity;
      await newCustomer.save();
    } catch (err) {
      Logger.log({ level: "error", message: `Error saving customer data: ${err.message}`});
    }
  }

  async getCustomer(customerId) {
    try {
      const customer = await Customer.findOne({ customerId })
      
      if (customer) return customer
      
      return null;
    } catch (err) {
      Logger.log({ level: "error", message: `Error fetching customer ${customerId}: ${err.message}`});
      return null;
    }
  }
}

export const CustomerSrv = new CustomerService();