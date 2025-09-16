import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, searchCustomers, updateCustomer } from "../controllers/customer";
import { customerValition, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/customers", customerValition, createCustomer);
router.get("/customers", getCustomers)
router.get("/customers/search", searchCustomers);
router.get("/customers/:customerId", paramValidation, getCustomerById);
router.put("/customers/:customerId", paramValidation, updateCustomer);

export { router as CustomerRoute }