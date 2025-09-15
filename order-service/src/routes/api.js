import { Router } from "express";
import { saveCustomerData, saveProductData, updateStock } from "../controllers/order";

const router = Router();

router.post("/customers", saveCustomerData);
router.post("/products", saveProductData);
router.put("/products/:productId/stock", updateStock);

export { router as OrderRoute }