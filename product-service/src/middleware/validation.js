import { validationResult, body, check, param } from "express-validator";
import { AppError } from "../utils/errorHandler";
import { Logger } from "../config/logger";

export const productionValition = [
  body("name").isString().withMessage("Product name is required"),
  body("description").isString().withMessage("Product description is required"),
  body("price").isNumeric({ min: 10, }).withMessage("Please enter a valid product price"),
  body("category").isString().withMessage("Product category is required"),
  body("brand").isString().withMessage("Product brand name is required"),
  body("stock").isNumeric({ min: 0 }).withMessage("Product stock is required"),
  body("sku").isString().withMessage("Product sku is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errMessage = errors.array();
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errMessage.map(error => ({ path: error.path, msg: error.msg }))
      });
    }
    next();
  }
];

export const paramValidation = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errMessage = errors.array();
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errMessage.map(error => ({ path: error.path, msg: error.msg }))
      });
    }
    next();
  }
];

export const stockUpdateValidation = [
  body("quantity").isNumeric().withMessage("Invalid stock quantity"),
  body("action").isIn(["add", "set", "subtract"]).withMessage("Action must be one of add, set, or subtract"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errMessage = errors.array();
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errMessage.map(error => ({ path: error.path, msg: error.msg }))
      });
    }
    next();
  }
];