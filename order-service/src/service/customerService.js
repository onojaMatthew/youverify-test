import axios from "axios";
import { Logger } from "../config/logger";

class CustomerService {
  constructor() {
    this.baseURL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5200';
  }

  async getCustomer(customerId) {
    try {
      const response = await axios.get(`${this.baseURL}/${customerId}`, { timeout: 5000 });
      
      if (response.data.success) return response.data.data
      
      return null;
    } catch (err) {
      Logger.log({ level: "error", message: `Error fetching customer ${customerId}: ${err.message}`});
      return null;
    }
  }
}

export const CustomerSrv = new CustomerService();