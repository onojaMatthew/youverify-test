import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customer";

const router = Router();

router.post("/", createCustomer);
router.get("/:customerId", getCustomerById);
router.get("/list", getCustomers);
router.put("/:customerId/update", updateCustomer);

export { router as CustomerRoute }