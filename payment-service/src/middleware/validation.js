

import { validationResult, body, param } from "express-validator";

export const paymentValition = [
  body("customerId").isMongoId().withMessage("Invalid customer ID"),
  body("orderReferenceId").isString().withMessage("Invalid order ID"),
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("amount").isNumeric().withMessage("Please enter a valid amount"),
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
  param("paymentId").isMongoId().withMessage("Invalid payment ID"),
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