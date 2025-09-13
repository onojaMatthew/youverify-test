
import { Logger } from "../config/logger";
import { Order } from "../models/order";
import { AppError } from "../utils/errorHandler";

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
    // Step 1: Validate customer exists
    const customer = await CustomerService.getCustomer(customerId);
    if (!customer) {
      return res.status(400).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Step 2: Validate product exists and check availability
    const product = await ProductService.getProduct(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient product stock'
      });
    }

    // Step 3: Calculate order amount
    const unitPrice = product.price;
    const amount = unitPrice * quantity;

    // Step 4: Generate order ID and create order
    const orderId = generateOrderId();
    
    const orderData = {
      orderId,
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

    logger.info(`Order created: ${orderId} for customer: ${customerId}`);

    // Step 5: Process payment (call payment service)
    try {
      const paymentResult = await PaymentService.processPayment({
        customerId,
        orderId,
        productId,
        amount
      });

      if (paymentResult.success) {
        order.paymentId = paymentResult.paymentId;
        order.paymentStatus = 'processing';
        await order.save();
        
        logger.info(`Payment initiated for order: ${orderId}, paymentId: ${paymentResult.paymentId}`);
      } else {
        order.orderStatus = 'failed';
        order.paymentStatus = 'failed';
        await order.save();
        
        logger.error(`Payment failed for order: ${orderId}`);
      }
    } catch (paymentError) {
      logger.error('Payment service error:', paymentError);
      order.orderStatus = 'failed';
      order.paymentStatus = 'failed';
      await order.save();
    }

    // Step 6: Return response as specified in requirements
    const response = {
      success: true,
      data: {
        customerId: order.customerId,
        orderId: order.orderId,
        productId: order.productId,
        orderStatus: order.orderStatus,
        amount: order.amount,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      },
      message: 'Order created successfully'
    };

    res.status(201).json(response);

  } catch (error) {
    logger.error('Error creating order:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order with this ID already exists' 
      });
    }
    
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) return next(new AppError("Order not found", 400));

    if (orderStatus) { order.orderStatus = orderStatus }
    if (paymentStatus) { order.paymentStatus = paymentStatus; }

    await order.save();

    Logger.info(`Order status updated: ${order.orderId}`);
    
    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error updating order status:', ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const deleteOrder = async (req, res, next) => {
  
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return next(new AppError("Order not found", 404));

    if (order.orderStatus === 'delivered' || order.orderStatus === 'shipped') 
      return next(new AppError('Cannot cancel order that is already shipped or delivered'));

    order.orderStatus = 'cancelled';
    await order.save();

    Logger.log({ level: "info", message: `Order cancelled: ${order.orderId}`});
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error cancelling order:, ${err.message}`});
    return res.status(500).json({ success: false, error: `Internal server error: ${err.message}` });
  }
}