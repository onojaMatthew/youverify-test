import { config } from "dotenv"

config();

export const key = {
  MONGO_URL: process.env.MONGODB_URI,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
}