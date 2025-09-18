import mongoose from "mongoose";
import { config } from "dotenv";
import { Logger } from "./logger";
import { key } from "./key";

config();

const MONGO_URL = process.env.NODE_ENV === "test" ? "mongodb://localhost:27017/test_db" : key.MONGO_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    Logger.log({ level: "info", message: 'MongoDB connected successfully'});
  } catch (err) {
    Logger.log({ level: "error", message: `MongoDB connection error: ${err.message}`});
    // Exit process on failure
    process.exit(1); 
  }
};

export default connectDB;