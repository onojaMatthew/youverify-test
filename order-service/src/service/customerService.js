import axios from "axios";
import { Logger } from "../config/logger";
import { Customer } from "../models/customer";

class CustomerService {
  constructor() {
    this.baseURL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5200';
  }

  async saveCustomerRecord(data) {
    try {
      const customer = Customer.findOne({ customerId: data.customerid });
      if (customer) return;
      let newCustomer = new Customer(data);
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

export default { CustomerService: new CustomerService()}