import { config } from "dotenv"

config();

export const key = {
  MONGO_URL: process.env.MONGODB_URI,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  SECRET: process.env.SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
}