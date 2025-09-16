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

  async updateStock(data) {
    try {
      const {productId, quantity, action = 'set'} = data;

      let product = await Product.findOne({ productId });

      if (!product) return;

      let newStock;
      switch (action) {
        case 'add':
          newStock = product.stock + quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, product.stock - quantity);
          break;
        case 'set':
        default:
          newStock = quantity;
          break;
      }

      product.stock = newStock;
      await product.save();

      Logger.log({ level: "info", message: `Product stock updated. product ID: ${product.productId}`});
    } catch (err) {
      Logger.log({ level: "error", message: `Error updating prodoct stock: ${err.message}`})
    }
  }

  async saveProduct(productData) {
    try {
      let product = new Product(productData);
      await product.save();
      Logger.log({ level: "info", message: `Product record saved. product ID: ${product.productId}`})
    } catch (err) {
      Logger.log({ level: "error", message: `Error saving product record. Error: ${err.message}`});
    }
  }

  async updateProduct(productData) {
    try {
      let product = new Product.findOne({ productId: productData.productId }, productData, { new: true });
      await product.save();
      Logger.log({ level: "info", message: `Product record updated. product ID: ${product.productId}`})
    } catch (err) {
      Logger.log({ level: "error", message: `Error updating product record. Error: ${err.message}`});
    }
  }
}

export const ProductSrv = new ProductService()