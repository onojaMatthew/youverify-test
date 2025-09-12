import { Router } from "express";
import { productionValition } from "../middleware/validation";
import { checkProductAvailability, createProduct, getProductById, searchProduct, updateStock } from "../controllers/product";

const router =  Router();

router.post("/", productionValition, createProduct);
router.get("/", searchProduct);
router.get("/:productId", getProductById);
router.get("/:productId/available", checkProductAvailability);
router.patch("/:productId/stock", updateStock);

export { router as ProductRoute }