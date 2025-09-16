import { Router } from "express";
import { paramValidation, productionValition, stockUpdateValidation } from "../middleware/validation";
import { checkProductAvailability, createProduct, getProductById, searchProduct, updateStock } from "../controllers/product";

const router =  Router();

router.post("/products", productionValition, createProduct);
router.get("/products/search", searchProduct);
router.get("/products/:productId", paramValidation, getProductById);
router.get("/products/:productId/available", paramValidation, checkProductAvailability);
router.patch("/products/:productId/stock", stockUpdateValidation, updateStock);

export { router as ProductRoute }