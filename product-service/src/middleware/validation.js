import { validationResult, body, check } from "express-validator";

export const productionValition = [
  body("name").isString().withMessage("Product name is required"),
  body("description").isString().withMessage("Product description is required"),
  body("price").isNumeric({ min: 10, }).withMessage("Please enter a valid product price"),
  body("category").isString().withMessage("Product category is required"),
  body("brand").isString().withMessage("Product brand name is required"),
  body("stock").isNumeric({ min: 0 }).withMessage("Product stock is required"),
  body("sku").isString().withMessage("Product sku is required"),
  (err, req, res, next) => {
    const error = validationResult(req);
    if (error) {}
    next();
  }
]