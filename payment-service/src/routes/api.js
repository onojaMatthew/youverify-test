import { Router } from "express";
import { createPayment, getAllTransactions, getPaymentById, getPaymentList, refundPayment } from "../controllers/payment";
import { paramValidation, paymentValition } from "../middleware/validation";

const router = Router();

router.post("/initiate", paymentValition, createPayment);
router.get("/", getPaymentList);
router.get("/transactions", getAllTransactions);
router.get("/:paymentId", paramValidation, getPaymentById);
router.post("/:paymentId/refund", paymentValition, refundPayment);
router.get('/debug/routes', (req, res) => {
  const routes = [];
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  
  res.json({
    basePath: '/api/v1/customers', // or /api/v1/products, etc.
    routes: routes
  });
});

export { router as PaymentRoute }