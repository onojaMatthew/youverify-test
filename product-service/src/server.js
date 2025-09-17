import express from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { AppError } from "./utils/errorHandler";
import connectDB from "./config/database";
import { seedProduct } from "./seeders/productSeeder";
import { Logger } from "./config/logger";
import { router } from "./routes";
import { initializeRabbitMQ } from "./service/rabbitmqService";

const app = express();

const port = process.env.PORT || 5100

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res, next) => {
  res.json({ success: true, message: "Status OK!", data: null });
});

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

    await initializeRabbitMQ();
    Logger.log({ level: "info", message: 'RabbitMQ connection established'});

    await seedProduct();
  } catch (error) {
    Logger.log({ level: "error", message: "Failed to sync database: "+ error.message});
  }

  app.listen(port, () => {
    Logger.log({ level: "info", message: `Product service is running @ http://localhost:${port}`})
  });

}

startApp();

process.on('SIGTERM', () => {
  Logger.log({ level: "info", message: 'SIGTERM received, shutting down gracefully'});
  process.exit(0);
});

export { app }
