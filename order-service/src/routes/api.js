import { Router } from "express";
import { cancelOrder, createOrder, filterOrders, getOrderById, saveCustomerData, saveProductData, saveTransactionRecord, updateOrderStatus, updateStock } from "../controllers/order";
import { orderValidation } from "../middleware/validation";

const router = Router();

router.post("/", orderValidation, createOrder);
router.get("/", filterOrders);
router.post("/customers", saveCustomerData);
router.post("/products", saveProductData);
router.put("/products/:productId/stock", updateStock);
router.post("/payments", saveTransactionRecord);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);
router.put("/:orderId/status", updateOrderStatus);

export { router as OrderRoute }