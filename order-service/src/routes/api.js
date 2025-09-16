import { Router } from "express";
import { cancelOrder, createOrder, filterOrders, getOrderById, saveCustomerData, saveProductData, saveTransactionRecord, updateOrderStatus, updateStock } from "../controllers/order";
import { orderValidation, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/", orderValidation, createOrder);
router.get("/", filterOrders);
router.post("/customers", saveCustomerData);
router.post("/products", saveProductData);
router.put("/products/:productId/stock", updateStock);
router.post("/payments", saveTransactionRecord);
router.get("/:orderId", paramValidation, getOrderById);
router.patch("/:orderId/cancel", cancelOrder);
router.put("/:orderId/status", updateOrderStatus);
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

export { router as OrderRoute }