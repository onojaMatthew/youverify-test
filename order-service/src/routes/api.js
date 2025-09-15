import { Router } from "express";
import { saveCustomerData } from "../controllers/order";

const router = Router();

router.post("/customers", saveCustomerData);

export { router as OrderRoute }