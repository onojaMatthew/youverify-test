import { Router } from "express";
import { createOrder, saveCustomerData, saveProductData, saveTransactionRecord, updateStock } from "../controllers/order";

const router = Router();

router.post("/", createOrder);
router.post("/customers", saveCustomerData);
router.post("/products", saveProductData);
router.put("/products/:productId/stock", updateStock);
router.post("/payments", saveTransactionRecord);

export { router as OrderRoute }