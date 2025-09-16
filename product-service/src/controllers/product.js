import axios from "axios";
import { key } from "../config/key";
import { Logger } from "../config/logger";
import { Product } from "../models/product";
import { AppError } from "../utils/errorHandler";
import { publishToQueue } from "../service/rabbitmqService";

const ORDER_SERVICE_URL = key.ORDER_SERVICE_URL || "http://localhost:5300";

export const createProduct = async (req, res, next) => {
  console.log("calling product creation")
  try {
    const { sku } = req.body;
    const itExists = await Product.findOne({ sku });
    if (itExists) return next(new AppError(`A product with ${sku} sku already exists`, 400));
    let product = new Product(req.body);
    await product.save();

    const productData = {
      productId: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      tags: product.tags,
      sku: product.sku,
      images: product.images,
      specifications: product.specifications,
      isActive: product.isActive
    }

    // To be replaced using RabbitMQ publisher
    publishToQueue("product_created", JSON.stringify(productData))
    console.log(product, " the product created")
    return res.status(201).json({ success: true, message: "Product created successfully", data: product })
  } catch (err) {
    Logger.log({ level: "error", message:` Failed to create product: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById({ _id: productId, isActive: true });
    if (!product) return next(new AppError("Product not found", 404));
    return res.json({ success: true, message: "request completed", data: product });
  } catch (err) {
    Logger.log({ level: "error", message:` Failed to fetch product: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const checkProductAvailability = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });
    
    if (!product) return next(new AppError(`Product not found`, 404));

    return res.json({
      success: true,
      message: "Request processed successfully",
      data: {
        productId: product.productId,
        name: product.name,
        price: product.price,
        stock: product.stock,
        isAvailable: product.isAvailable
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message:` Error checking product availability: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const searchProduct = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      searchTerm, 
      category, 
      brand, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { isActive: true };
    
    if (searchTerm) { query.$text = { $search: searchTerm } }
    if (category) { query.category = new RegExp(category, 'i') }
    if (brand) { query.brand = new RegExp(brand, 'i'); }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Create a sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query).limit(limit * 1).skip((page - 1) * limit).sort(sort);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const responseData = {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNextPage: totalPages > parseInt(page),
        hasPrevPage: parseInt(page) > totalPages
      }
    }

    return res.json({ success: true, message: "Request processed successfully", data: responseData });
  } catch (err) {
    Logger.log({ level: "error", message:` Failed to fetch product: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, action = 'set' } = req.body;
    if (typeof quantity !== 'number' || quantity < 0) return next(new AppError(`Please provide a valid product quantity`, 400));
    
    const product = await Product.findById({ _id: productId });
    
    if (!product) return next(new AppError("Product not found", 404));

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

    // To be replaced using RabbitMQ publisher
    publishToQueue("stock_updated", JSON.stringify(req.body))

    Logger.log({ level: "info", message: `Stock updated for product ${product._id}` });
    return res.json({ success: true, message: `Stock updated for product: ${product._id}. New stock: ${newStock}`, data: product })
  } catch (err) {
    Logger.log({ level: "error", message: `Failed to update product stock: ${err.message}` });
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate({ _id: productId }, req.body, { new: true });
    if (!product) return next(new AppError(`Product not found`, 404));
    const productData = {
      ...req.body,
      productId
    }
    publishToQueue("product_updated", JSON.stringify(productData));
    return res.json({ success: true, message: "Product updated", data: product });
  } catch (err) {
    return next(new AppError(`Internal server error: ${err.message}`, 500))
  }
}