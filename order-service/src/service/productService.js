import axios from "axios";
import { Logger } from "../config/logger";
import { key } from "../config/key";
import { Product } from "../models/product";

class ProductService {
  constructor() {
    this.baseURL = key.PRODUCT_SERVICE_URL || 'http://localhost:5100';
  }

  async getProduct(productId) {
    try {
      const product = await Product.findOne({ productId });
      
      if (product) return product;

      return null;
    } catch (err) {
      Logger.log({ level: "error", message: `Error fetching product ${productId}: ${ err.message}`});
      return null;
    }
  }

  async checkAvailability(productId) {
    try {
      const product = await Product.findOne({ productId, isActive: true });
      
      if (product) {
        return {
          productId: product.productId,
          name: product.name,
          price: product.price,
          stock: product.stock,
          isAvailable: product.isAvailable
        }
      }
      
      return null;
    } catch (err) {
      Logger.log({level: "error", message: `Error checking availability for product ${productId}: ${err.message}`, });
      return null;
    }
  }


}

export default { ProductService: new ProductService()}