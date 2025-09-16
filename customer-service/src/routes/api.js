import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, searchCustomers, updateCustomer } from "../controllers/customer";
import { customerValition, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/", customerValition, createCustomer);
router.get("/", getCustomers)
router.get("/search", searchCustomers);
router.get("/:customerId", paramValidation, getCustomerById);
router.put("/:customerId", paramValidation, updateCustomer);
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

export { router as CustomerRoute }