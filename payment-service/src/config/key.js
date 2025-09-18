import { config } from "dotenv"

config();

export const key = {
  MONGO_URL: process.env.MONGODB_URI,
  SECRET: process.env.SECRET,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL
}