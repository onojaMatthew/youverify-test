import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppError } from "./utils/errorHandler";
import YAML from "yamljs";
import path from "path";
import connectDB from "./config/database";
import { Logger } from "./config/logger";
import { router } from "./routes";
import { seedCustomers } from "./seeders/customerSeed";

const swaggerJSDoc = YAML.load(path.resolve(__dirname, "../api.yaml"));

const app = express();

const port = process.env.PORT || 5200

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res, next) => {
  res.json({ success: true, message: "Status OK!", data: null });
});

app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));
router(app);

app.use((req, res, next) => {
  return next(new AppError("Not Found", 404));
});



app.use((err, req, res, next) => {
  if (err.isOperational) return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Something went wrong", data: null });
  return res.status(500).json({ success: false, message: "Internal Server Error", data: null });
});

const startApp = async () =>  {
  try {
    await connectDB();
    await seedCustomers();
  } catch (error) {
    Logger.log({ level: "error", message: "Failed to sync database: "+ error.message});
  }

  
  app.listen(port, () => {
    Logger.log({ level: "info", message: `Customer service is running @ http://localhost:${port}`})
  });

}

startApp();

process.on('SIGTERM', () => {
  Logger.log({ level: "info", message: 'SIGTERM received, shutting down gracefully'});
  process.exit(0);
});

export { app as appServer }
