
import { Logger } from "../config/logger";
import { Order } from "../models/order";
import { CustomerSrv } from "../service/customerService";
import { PaymentSrv } from "../service/paymentService";
import { ProductSrv } from "../service/productService";
import { AppError } from "../utils/errorHandler";
import { generateOrderId } from "../utils/util";

export const filterOrders = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      customerId, 
      orderStatus, 
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (customerId) { query.customerId = customerId; }
    if (orderStatus) { query.orderStatus = orderStatus; }
    if (paymentStatus) { query.paymentStatus = paymentStatus; }

    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Order.countDocuments(query);

    const totalPages = Math.ceil(total / limit)
    const responseData = {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > parseInt(page),
        hasPrevPage: parseInt(page) > totalPages
      }
    }
    return res.json({ success: true, message: "Order fetched successfully", data: responseData });
  } catch (err) {
    Logger.log({level: "error", message: `Error fetching orders: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById({ _id: orderId });
    if (!order) return next(new AppError(`Order not found`, 404));
    return res.json({ success: true, message: "Order fetched successfully", data: order });
  } catch (err) {
    Logger.log({level: "error", message: `Error fetching order: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const createOrder = async (req, res, next) => {
  const { customerId, productId, quantity = 1, orderNotes } = req.body;
  
  try {
    // Check that customer exists
    const customer = await CustomerSrv.getCustomer(customerId);
    if (!customer) return next(new AppError("Customer not found", 404));

    // Check that product exists and check availability
    let product = await ProductSrv.getProduct(productId);
    if (!product) return next(new AppError("Product not found", 404));

    if (product.stock < quantity) return next(new AppError("Product in stock less than desired quantity", 400));

    // Calculate order amount
    const unitPrice = product.price;
    const amount = unitPrice * quantity;

    // Generate order ID and create order
    const orderReferenceId = generateOrderId();
    
    const orderData = {
      orderReferenceId,
      customerId,
      productId,
      quantity,
      unitPrice,
      amount,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      customerDetails: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      productDetails: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        sku: product.sku
      },
      shippingAddress: customer.address,
      orderNotes,
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        source: 'api'
      }
    };

    const order = new Order(orderData);
    await order.save();

    Logger.log({ level: "info", message: `Order created: ${orderReferenceId} for customer: ${customerId}`});

    // Process payment (call payment service)
    try {
      const paymentResult = await PaymentSrv.processPayment({
        customerId,
        orderReferenceId,
        productId,
        amount,
        quantity: orderData.quantity
      });

      if (paymentResult.success) {
        order.paymentId = paymentResult.paymentId;
        order.paymentStatus = 'processing';
        await order.save();
        Logger.log({level: "info", message: `Payment initiated for order: ${orderReferenceId}, paymentId: ${paymentResult.paymentId}`});
      } else {
        order.orderStatus = 'failed';
        order.paymentStatus = 'failed';
        await order.save();
        
        Logger.log({ level: "error", message: `Payment failed for order: ${orderReferenceId}`});
      }
    } catch (paymentError) {
      Logger.log({level: "error", message: `Payment service error: ${paymentError}`});
      order.orderStatus = 'failed';
      order.paymentStatus = 'failed';
      await order.save();
    }
   
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        customerId: order.customerId,
        _id: order._id,
        orderReferenceId: order.orderReferenceId,
        productId: order.productId,
        orderStatus: order.orderStatus,
        amount: order.amount,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      },
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error creating order: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId });
    
    if (!order) return next(new AppError("Order not found", 400));

    if (orderStatus) { order.orderStatus = orderStatus }
    if (paymentStatus) { order.paymentStatus = paymentStatus; }

    await order.save();

    Logger.info(`Order status updated: ${order.orderReferenceId}`);
    
    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderReferenceId: order.orderReferenceId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error updating order status:', ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById({ _id: req.params.orderId });
    if (!order) return next(new AppError("Order not found", 404));

    if (order.orderStatus === 'delivered' || order.orderStatus === 'shipped') 
      return next(new AppError('Cannot cancel order that is already shipped or delivered'));

    order.orderStatus = 'cancelled';
    await order.save();

    Logger.log({ level: "info", message: `Order cancelled: ${order.orderReferenceId}`});
    
    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderReferenceId: order.orderReferenceId,
        orderStatus: order.orderStatus
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error cancelling order:, ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}
