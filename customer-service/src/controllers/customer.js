import { Logger } from "../config/logger";
import { Customer } from "../models/customer";
import { AppError } from "../utils/errorHandler";

export const createCustomer = async (req, res, next) => {
  try {
    const { email } = req.body;
    const customerExists = await Customer.findOne({ email });
    if (customerExists) return next(new AppError(`Customer already exists`, 400));

    const customer = new Customer(req.body);
    await customer.save();
    
    Logger.log({ level: "info", message: `New customer created: ${customer.customerId}`});
    
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
    
    const responseData = {
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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