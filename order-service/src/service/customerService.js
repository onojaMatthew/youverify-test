import axios from "axios";
import { Logger } from "../config/logger";

class CustomerService {
  constructor() {
    this.baseURL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001';
  }

  async getCustomer(customerId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/customers/${customerId}`, {
        timeout: 5000
      });
      
      if (response.data.success) return response.data.data;
      
      return null;
    } catch (err) {
      Logger.log({ level: "error", message: `Error fetching customer ${customerId}: ${err.message}`});
      return null;
    }
  }
}

export default { CustomerService: new CustomerService()}