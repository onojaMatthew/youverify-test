import { validationResult, body, param } from "express-validator";

export const orderValidation = [
  body("customerId").isMongoId().withMessage("Invalid customer ID"),
  body("productId").isString().withMessage("Invalid product ID"),
  body("quantity").isNumeric().withMessage("Please provide your desired quantity"),
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
  param("orderId").isMongoId().withMessage("Invalid order ID"),
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