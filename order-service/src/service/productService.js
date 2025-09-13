import axios from "axios";
import { Logger } from "../config/logger";
import { key } from "../config/key";

class ProductService {
  constructor() {
    this.baseURL = key.PRODUCT_SERVICE_URL || 'http://localhost:3002';
  }

  async getProduct(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/products/${productId}`, {
        timeout: 5000
      });
      
      if (response.data.success) return response.data.data;
      return null;
    } catch (err) {
      Logger.log({ level: "error", message: `Error fetching product ${productId}: ${ err.message}`});
      return null;
    }
  }

  async checkAvailability(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/products/${productId}/available`, {
        timeout: 5000
      });
      
      if (response.data.success) return response.data.data;
      
      return null;
    } catch (err) {
      Logger.log({level: "error", message: `Error checking availability for product ${productId}: ${err.message}`, });
      return null;
    }
  }
}

export default { ProductService: new ProductService()}