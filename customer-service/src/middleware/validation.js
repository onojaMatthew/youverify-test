import { validationResult, body, check, param } from "express-validator";
import { AppError } from "../utils/errorHandler";
import { Logger } from "../config/logger";

export const customerValition = [
  body("firstName").isString().withMessage("First name is required"),
  body("lastName").isString().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone").isMobilePhone("any").withMessage("Please enter a valid phone number"),
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
  param("customerId").isMongoId().withMessage("Invalid customer ID"),
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