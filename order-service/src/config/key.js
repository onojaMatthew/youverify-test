import { config } from "dotenv"

config();

export const key = {
  MONGO_URL: process.env.MONGODB_URI,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
}