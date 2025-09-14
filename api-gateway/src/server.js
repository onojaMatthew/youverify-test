import express from 'express';
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import redis from 'ioredis';
import { authenticateToken } from './middleware/auth';
import { CircuitBreaker } from './service/circuitbreaker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Redis client for caching and session management
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Microservices configuration
const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5200',
    endpoints: ['/login', '/register', '/refresh', '/logout', '/profile']
  },
  users: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    endpoints: ['/customers', '/customers/:customerId', '/customers/:customerId/profile', '/customers/search']
  },
  products: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5100',
    endpoints: ['/products', '/products/:productId', '/products/search', '/products/:productId/available']
  },
  inventory: {
    url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004',
    endpoints: ['/inventory', '/inventory/:id', '/stock']
  },
  orders: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:5400',
    endpoints: ['/orders', '/orders/:id', '/orders/user/:userId']
  },
  payments: {
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5000',
    endpoints: ['/payments', '/payments/transactions', '/payments/:paymentId', '/payments/:paymentId/refunds']
  }
};

// JWT Authentication middleware


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: Object.keys(services)
  });
});

// Service discovery endpoint
app.get('/api/services', (req, res) => {
  const serviceInfo = Object.keys(services).map(serviceName => ({
    name: serviceName,
    url: services[serviceName].url,
    endpoints: services[serviceName].endpoints
  }));
  
  res.json({ services: serviceInfo });
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
};

const circuitBreakers = {};

// Get or create circuit breaker for service
const getCircuitBreaker = (serviceName) => {
  if (!circuitBreakers[serviceName]) {
    circuitBreakers[serviceName] = new CircuitBreaker();
  }
  return circuitBreakers[serviceName];
};

// Custom proxy middleware with circuit breaker
const createServiceProxy = (serviceName, serviceConfig) => {
  return createProxyMiddleware({
    target: serviceConfig.url,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/v1/${serviceName}`]: ''
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add correlation ID for tracing
      const correlationId = req.headers['x-correlation-id'] || 
                           `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      proxyReq.setHeader('x-correlation-id', correlationId);
      
      // Forward user information
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id);
        proxyReq.setHeader('x-user-role', req.user.role);
      }
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${serviceName}:`, err.message);
      
      const circuitBreaker = getCircuitBreaker(serviceName);
      circuitBreaker.onFailure();
      
      res.status(503).json({
        error: 'Service temporarily unavailable',
        service: serviceName,
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Protected routes that require authentication
const protectedServices = ['users', 'orders', 'payments', 'notifications'];

// Public routes (no authentication required)
app.use('/api/auth', requestLogger, createServiceProxy('auth', services.auth));
app.use('/api/v1/products', requestLogger, createServiceProxy('products', services.products));

// Protected routes
protectedServices.forEach(serviceName => {
  if (services[serviceName]) {
    app.use(`/api/v1/${serviceName}`, 
      requestLogger, 
      authenticateToken, 
      createServiceProxy(serviceName, services[serviceName])
    );
  }
});

// Special handling for inventory (may need different auth levels)
app.use('/api/inventory', 
  requestLogger, 
  (req, res, next) => {
    // Allow read operations without auth, require auth for write operations
    if (req.method === 'GET') {
      next();
    } else {
      authenticateToken(req, res, next);
    }
  },
  createServiceProxy('inventory', services.inventory)
);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    redisClient.quit();
  });
});

const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Available services:', Object.keys(services).join(', '));
});

module.exports = app;