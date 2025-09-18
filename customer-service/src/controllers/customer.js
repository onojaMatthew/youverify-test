import { Logger } from "../config/logger";
import { Customer } from "../models/customer";
import { AppError } from "../utils/errorHandler";
import { publishToQueue } from "../service/rabbitmqService";

export const createCustomer = async (req, res, next) => {
  try {
    const { email } = req.body;
    const customerExists = await Customer.findOne({ email });
    if (customerExists) return next(new AppError(`Customer already exists`, 400));

    const customer = new Customer(req.body);
    await customer.save();
    
    Logger.log({ level: "info", message: `New customer created: ${customer.customerId}`});
    
    const customerData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      customerId: customer._id,
    }

    if (process.env.NODE_ENV !== "test") {
      publishToQueue("create-customer", JSON.stringify(customerData));
    }
    
    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error creating customer account: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getCustomers = async (req, res, next) => {
  try {
    const { page=1, limit=10 } = req.query;

    const customers = await Customer.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Customer.countDocuments();
    const totalPages = Math.ceil(total / limit)

    const responseData = {
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > parseInt(page),
        hasPrevPage: parseInt(page) > totalPages
      }
    }
    return res.json({ success: true, message: "Customer list fetched successfully", data: responseData });
  } catch (err) {
    Logger.log({ level: "error", message: `Error fetching customer list: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const searchCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchTerm } = req.query;
    const query = searchTerm ? 
      { $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]} : {};

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);
    const totalPages = Math.ceil(total / limit)
    const responseData = {
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > parseInt(page),
        hasPrevPage: parseInt(page) > totalPages
      }
    }
    res.json({
      success: true,
      message: "Customers fetched successfully",
      data: responseData,
      
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error fetching customer list: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getCustomerById = async (req, res, next) => {
  try {
    console.log(req.params)
    const { customerId } = req.params;

    const customer = await Customer.findOne({ _id: customerId });
    
    if (!customer) return next(new AppError(`Customer not found`, 404));

    return res.json({
      success: true,
      message: "Customer fetched successfully",
      data: customer
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error fetching customer by ID: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const updateCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findByIdAndUpdate({ _id: customerId }, req.body, { new: true });
    if (!customer) return next(new AppError("Customer not found", 404));
    Logger.log({ level: "info", message: `Customer updated. Customer: ${customer._id}`});
    return res.json({ success: true, message: "Account updated successfully", data: customer });
  } catch (err) {
    Logger.log({ level: "error", message: `Error updating customer: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}