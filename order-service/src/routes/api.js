import { Router } from "express";
import { saveCustomerData, saveProductData } from "../controllers/order";

const router = Router();

router.post("/customers", saveCustomerData);
router.post("/products", saveProductData);


export { router as OrderRoute }