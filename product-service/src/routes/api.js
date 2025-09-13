import { Router } from "express";
import { paramValidation, productionValition, stockUpdateValidation } from "../middleware/validation";
import { checkProductAvailability, createProduct, getProductById, searchProduct, updateStock } from "../controllers/product";

const router =  Router();

router.post("/", productionValition, createProduct);
router.get("/search", searchProduct);
router.get("/:productId", paramValidation, getProductById);
router.get("/:productId/available", paramValidation, checkProductAvailability);
router.patch("/:productId/stock", stockUpdateValidation, updateStock);

export { router as ProductRoute }