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

// CORS first
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.options('*', cors());

// Logging
app.use(morgan("combined"));

// Body parsers
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  Logger.log({ 
    level: "info", 
    message: `${req.method} ${req.path} - Content-Type: ${req.get('Content-Type')} - Body: ${JSON.stringify(req.body)}`
  });
  next();
});
 
app.get("/health", (req, res, next) => {
  res.json({ success: true, message: "Status OK!", data: null });
});

app.use((req, res, next) => {
  // Set timeout for all requests
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

router(app);

app.use((req, res, next) => {
  return next(new AppError("Not Found", 404));
});

app.use((err, req, res, next) => {
  Logger.log({ level: "error", message: `Error: ${err.message} - Stack: ${err.stack}`});
  if (err.isOperational) return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Something went wrong", data: null });
  return res.status(500).json({ success: false, message: "Internal Server Error", data: null });
});

const startApp = async () =>  {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "test") {
      await initializeRabbitMQ();
    } 
    await seedProduct();
  } catch (error) {
    Logger.log({ level: "error", message: "Entry dependency connection error: "+ error.message});
  }

  app.listen(port, () => {
    Logger.log({ level: "info", message: `Product service is running @ http://localhost:${port}`})
  });

  const gracefulShutdown = () => {
    Logger.log({ level: "info", message: 'Received shutdown signal, closing server...' });
    server.close(() => {
      Logger.log({ level: "info", message: 'Server closed' });
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startApp();


export { app }
