import { Router } from "express";
import { createPayment, getAllTransactions, getPaymentById, getPaymentList, refundPayment } from "../controllers/payment";
import { paramValidation, paymentValition } from "../middleware/validation";

const router = Router();

router.post("/payments/initiate", paymentValition, createPayment);
router.get("/payments", getPaymentList);
router.get("/payments/transactions", getAllTransactions);
router.get("/payments/:paymentId", paramValidation, getPaymentById);
router.post("/payments/:paymentId/refund", paymentValition, refundPayment);

export { router as PaymentRoute }