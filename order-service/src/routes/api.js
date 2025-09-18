import { Router } from "express";
import { cancelOrder, createOrder, filterOrders, getOrderById,  updateOrderStatus } from "../controllers/order";
import { orderValidation, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/", orderValidation, createOrder);
router.get("/", filterOrders);
router.get("/:orderId", paramValidation, getOrderById);
router.patch("/:orderId/cancel", cancelOrder);
router.put("/:orderId/status", updateOrderStatus);

export { router as OrderRoute }