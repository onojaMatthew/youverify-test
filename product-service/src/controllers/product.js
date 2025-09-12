import { Logger } from "../config/logger";
import { Product } from "../models/product";
import { AppError } from "../utils/errorHandler";

export const createProduct = async (req, res, next) => {
  try {
    const { productId, sku } = req.body;
    const itExists = await Product.findOne({ $or: [{ productId }, { sku }] });
    if (itExists) return next(new AppError(`A product with ${productId} ID or ${sku} sku already exists`, 400));
    let product = new Product(req.body);
    await product.save();
    return res.status(201).json({ success: true, message: "Product created successfully", data: product })
  } catch (err) {
    Logger.log({ level: "error", message:` Failed to create product: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const getProductById = async (req, res, next) => {
 
  try {
    const product = await Product.findOne({ productId: req.params.productId, isActive: true });
    if (!product) return next(new AppError("Product not found", 404));
    return res.json({ success: true, message: "request completed", data: product });
  } catch (err) {
    Logger.log({ level: "error", message:` Failed to fetch product: ${err.message}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}

export const checkProductAvailability = async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      productId: req.params.productId, 
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
    
    if (search) {
      query.$text = { $search: searchTerm };
    }
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }
    
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
    const responseData = {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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
    const { quantity, operation = 'set' } = req.body;
    if (typeof quantity !== 'number' || quantity < 0) return next(new AppError(`Please provide a valid product quantity`, 400));
    
    const product = await Product.findOne({ productId: req.params.productId });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    let newStock;
    switch (operation) {
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

    Logger.log({ level: "info", message: `Stock updated for product ${product.productId}` });
    return res.json({ success: true, message: `Stock updated for product: ${product}. New stock: ${newStock}`})
  } catch (err) {
     Logger.log({ level: "error", message: `Failed to update product stock: ${err.message}` });
     return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}