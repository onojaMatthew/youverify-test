import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, searchCustomers, updateCustomer } from "../controllers/customer";
import { customerValition, paramValidation } from "../middleware/validation";

const router = Router();

router.post("/", customerValition, createCustomer);
router.get("/", getCustomers)
router.get("/search", searchCustomers);
router.get("/:customerId", paramValidation, getCustomerById);
router.put("/:customerId", paramValidation, updateCustomer);

export { router as CustomerRoute }