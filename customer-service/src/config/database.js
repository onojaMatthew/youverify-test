import mongoose from "mongoose";
import { config } from "dotenv";
import { Logger } from "./logger";
import { key } from "./key";

config();

const connectDB = async () => {
  try {
    await mongoose.connect(key.MONGO_URL);
    Logger.log({ level: "info", message: 'MongoDB connected successfully'});
  } catch (err) {
    Logger.log({ level: "error", message: `MongoDB connection error: ${err.message}`});
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;