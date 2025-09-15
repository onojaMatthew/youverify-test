import { Router } from "express";
import { createPayment, getAllTransactions, getPaymentById, getPaymentList, refundPayment } from "../controllers/payment";
import { paramValidation, paymentValition } from "../middleware/validation";

const router = Router();

router.post("/", paymentValition, createPayment);
router.get("/", getPaymentList);
router.get("/transactions", getAllTransactions);
router.get("/:paymentId", paramValidation, getPaymentById);
router.post("/:paymentId/refund", paymentValition, refundPayment);

export { router as PaymentRoute }