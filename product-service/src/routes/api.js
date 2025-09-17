import { Router } from "express";
import { paramValidation, productionValition, stockUpdateValidation } from "../middleware/validation";
import { checkProductAvailability, createProduct, getProductById, searchProduct, updateProduct, updateStock } from "../controllers/product";

const router =  Router();

router.put("/", () => console.log("hitting the post router"), productionValition, createProduct);
router.get("/search", searchProduct);
router.get("/:productId", paramValidation, getProductById);
router.get("/:productId/available", paramValidation, checkProductAvailability);
router.patch("/:productId/stock", stockUpdateValidation, updateStock);
router.put("/:productId/update", updateProduct);
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

export { router as ProductRoute }