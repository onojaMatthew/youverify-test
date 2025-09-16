import { Router } from "express";
import { cancelOrder, createOrder, filterOrders, getOrderById, saveCustomerData, saveProductData, saveTransactionRecord, updateOrderStatus, updateStock } from "../controllers/order";
import { orderValidation, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/orders", orderValidation, createOrder);
router.get("/orders", filterOrders);
router.post("/orders/customers", saveCustomerData);
router.post("/orders/products", saveProductData);
router.put("/orders/products/:productId/stock", updateStock);
router.post("/orders/payments", saveTransactionRecord);
router.get("/orders/:orderId", paramValidation, getOrderById);
router.patch("/orders/:orderId/cancel", cancelOrder);
router.put("/orders/:orderId/status", updateOrderStatus);

export { router as OrderRoute }