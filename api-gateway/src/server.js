import express from 'express';
import cors from "cors"
import helmet from 'helmet';
import morgan from 'morgan';
import compression from "compression";
import dotenv from "dotenv";
import { setupProxies } from './proxy/proxyConfig';
import { rateLimiter } from './middleware/rateLimiter';
import authMiddleware from './middleware/auth';
import { loggingMiddleware } from './middleware/logging';
import { metricsCollector } from './middleware/metrics';
import { router } from './routes';
import { Logger } from './config/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Middleware stack
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

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: message => Logger.log({ level: "info", message: message.trim()}) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(loggingMiddleware);
app.use(metricsCollector);
app.use(rateLimiter);

// Health check endpoint (before auth)
app.get('/health', (req, res) => {
  return res.json({
    success: true,
    message: "API Gateway OK!",
    data: {
      service: 'api-gateway',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    }
  });
});

// Gateway status and metrics
// router(app);

// Authentication middleware (applied to protected routes)
// app.use('/api', authMiddleware);

// Setup service proxies
setupProxies(app);

// Global error handler
app.use((err, req, res, next) => {
  if (err.isOperational) return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Something went wrong", data: null });
  return res.status(500).json({ success: false, message: "Internal Server Error", data: null });
})

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Route not found',
//     path: req.originalUrl,
//     method: req.method,
//     timestamp: new Date().toISOString()
//   });
// });

// Graceful shutdown
const gracefulShutdown = (signal) => {
  Logger.log({ level: "info", message: `Received ${signal}. Starting graceful shutdown...`});
  
  server.close(() => {
    Logger.log({ level: "info", message: 'HTTP server closed'});
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    Logger.log({ level: "error", message: 'Could not close connections in time, forcefully shutting down'});
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(PORT, () => {
  Logger.log({ level: "info", message: `API Gateway is running on port ${PORT}` });
  Logger.log({ level: "info", message: 'Available routes:' });
  Logger.log({ level: "info", message: '  GET  /health                    - Gateway health check' });
  Logger.log({ level: "info", message: '  GET  /gateway/status            - Gateway detailed status' });
  Logger.log({ level: "info", message: '  GET  /gateway/metrics           - Gateway metrics' });
  Logger.log({ level: "info", message: '  *    /api/v1/customers/*           - Customer Service' });
  Logger.log({ level: "info", message: '  *    /api/v1/products/*            - Product Service' });
  Logger.log({ level: "info", message: '  *    /api/v1/orders/*              - Order Service' });
  Logger.log({ level: "info", message: '  *    /api/v1/payments/*            - Payment Service' });
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));