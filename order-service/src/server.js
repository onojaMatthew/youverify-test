import express from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { AppError } from "./utils/errorHandler";
import connectDB from "./config/database";
import { Logger } from "./config/logger";
import { router } from "./routes";
import { jobRunner } from "./utils/scheduler";
import { 
  initializeRabbitMQ, 
  listenToMultipleQueues, 
} from "./service/rabbitmqService";
import { 
  QUEUE_TRANSACTION,  
} from "./service/queue";

const app = express();

const port = process.env.PORT || 5300

const queues = [QUEUE_TRANSACTION ];

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
    await jobRunner();
    // if (process.env.NODE_ENV !== "test") {
      await initializeRabbitMQ()
      await listenToMultipleQueues(queues);
    // }
    
  } catch (error) {
    Logger.log({ level: "error", message: "Entry dependency connection error: "+ error.message });
  }

  app.listen(port, () => {
    Logger.log({ level: "info", message: `Order service is running @ http://localhost:${port}`})
  });

}

startApp();

process.on('SIGTERM', () => {
  Logger.log({ level: "info", message: 'SIGTERM received, shutting down gracefully'});
  process.exit(0);
});

export { app as appServer }
