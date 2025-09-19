import { Logger } from "../config/logger";
import { Product } from "../models/product";

class CustomerService {
  constructor() {
    this.baseURL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5200';
  }

  async updateProductStock(transactionData) {
    try {
      const data = JSON.parse(transactionData);
      let product = await Product.findOne({ _id: data.productId });
      if (!product) return;
      product.stock = product.stock - data.quantity;
      await product.save();
    } catch (err) {
      Logger.log({ level: "error", message: `Error saving customer data: ${err.message}`});
    }
  }
}

export const CustomerSrv = new CustomerService();