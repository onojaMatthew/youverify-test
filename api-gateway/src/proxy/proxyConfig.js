import { createProxyMiddleware } from "http-proxy-middleware";
import { Logger } from "../config/logger";

// Service configuration
const services = {
  customer: {
    target: process.env.CUSTOMER_SERVICE_URL || "http://localhost:5200",
    pathPattern: '/api/v1/customers/customers', // ✅ Remove duplicate "customers"
    healthEndpoint: '/health',
    version: 'v1'
  },
  product: {
    target: process.env.PRODUCT_SERVICE_URL || "http://localhost:5100",
    pathPattern: '/api/v1/products/products', // ✅ Remove duplicate "products"
    healthEndpoint: '/health',
    version: 'v1'
  },
  order: {
    target: process.env.ORDER_SERVICE_URL || "http://localhost:5300",
    pathPattern: '/api/v1/orders/orders', // ✅ Remove duplicate "orders"
    healthEndpoint: '/health',
    version: 'v1'
  },
  payment: {
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:5000",
    pathPattern: '/api/v1/payments/payments', // ✅ Remove duplicate "payments"
    healthEndpoint: '/health',
    version: 'v1'
  }
};

const legacyServices = {
  customer: {
    target: process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:5200',
    pathPattern: '/api/customers/',
    healthEndpoint: '/health',
    version: 'legacy'
  },
  product: {
    target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:5100',
    pathPattern: '/api/products',
    healthEndpoint: '/health',
    version: 'legacy'
  },
  order: {
    target: process.env.ORDER_SERVICE_URL || 'http://order-service:5300',
    pathPattern: '/api/orders',
    healthEndpoint: '/health',
    version: 'legacy'
  },
  payment: {
    target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:5000',
    pathPattern: '/api/payments',
    healthEndpoint: '/health',
    version: 'legacy'
  }
};

// Proxy options factory
const createProxyOptions = (serviceName, config) => ({
  target: config.target,
  changeOrigin: true,
  pathRewrite: {
    // Rewrite /api/v1/{service}/* to /api/v1/* for the target service
    // Example: /api/v1/customers/search → /api/v1/search
    [`^/api/v1/${serviceName}`]: `/api/v1`
  },
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    Logger.log({ level: "error", message: `Proxy error for ${serviceName}: ${err.message}`});
    res.status(503).json({
      success: false,
      error: `Service ${serviceName} is currently unavailable`,
      service: serviceName,
      version: config.version,
      timestamp: new Date().toISOString()
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add custom headers
    const originalPath = req.originalUrl;
    const targetPath = proxyReq.path;
    
    Logger.log({ 
      level: "debug", 
      message: `Proxying: ${req.method} ${originalPath} → ${config.target}${targetPath}` 
    });
    
    proxyReq.setHeader('X-Forwarded-By', 'api-gateway');
    proxyReq.setHeader('X-Gateway-Version', '1.0.0');
    proxyReq.setHeader('X-API-Version', config.version || 'v1');
    proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
    
    // Logger.log({ level: "debug", message: `Proxying ${req.method} ${req.url} to ${serviceName} (${config.version || 'v1'})`});
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers if not present
    if (!proxyRes.headers['access-control-allow-origin']) {
      proxyRes.headers['access-control-allow-origin'] = '*';
    }
    
    // Add gateway identification
    proxyRes.headers['x-served-by'] = 'api-gateway';
    proxyRes.headers['x-api-version'] = config.version || 'v1';
    
    Logger.log({ level: "debug", message: `Response from ${req.url}: ${proxyRes.statusCode}`});
  },
  logLevel: 'warn'
});

const createLegacyProxyOptions = (serviceName, config) => ({
  target: config.target,
  changeOrigin: true,
  pathRewrite: {
    // Convert legacy paths to versioned paths
    '^/api/customers': '/api/v1/customers',
    '^/api/products': '/api/v1/products',
    '^/api/orders': '/api/v1/orders',
    '^/api/payments': '/api/v1/payments'
  },
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    logger.error(`Legacy proxy error for ${serviceName}:`, {
      error: err.message,
      originalUrl: req.originalUrl,
      target: config.target
    });
    res.status(503).json({
      success: false,
      error: `Service ${serviceName} is currently unavailable`,
      service: serviceName,
      version: 'legacy',
      originalUrl: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-By', 'api-gateway');
    proxyReq.setHeader('X-Gateway-Version', '1.0.0');
    proxyReq.setHeader('X-API-Version', 'legacy');
    proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
    proxyReq.setHeader('X-Original-URL', req.originalUrl);
    
    logger.info(`Legacy proxy request:`, {
      method: req.method,
      originalUrl: req.originalUrl,
      proxyPath: proxyReq.path,
      targetUrl: `${config.target}${proxyReq.path}`,
      service: serviceName
    });
  },
  onProxyRes: (proxyRes, req, res) => {
    if (!proxyRes.headers['access-control-allow-origin']) {
      proxyRes.headers['access-control-allow-origin'] = '*';
    }
    
    proxyRes.headers['x-served-by'] = 'api-gateway';
    proxyRes.headers['x-api-version'] = 'legacy';
    
    logger.info(`Legacy response received:`, {
      originalUrl: req.originalUrl,
      statusCode: proxyRes.statusCode,
      service: serviceName
    });
  },
  logLevel: 'warn'
});

const setupProxies = (app) => {
  // Setup versioned API routes (v1) - these should be first for priority
  Object.entries(services).forEach(([serviceName, config]) => {
    const proxyOptions = createProxyOptions(serviceName, config);
    const proxy = createProxyMiddleware(proxyOptions);
    
    app.use(config.pathPattern, proxy);
    Logger.log({ level: "info", message: `Proxy configured: ${config.pathPattern} -> ${config.target} (full path forwarding)`});
  });

  // Setup legacy routes for backward compatibility (optional)
  if (process.env.ENABLE_LEGACY_ROUTES === 'true') {
    Object.entries(legacyServices).forEach(([serviceName, config]) => {
      const legacyProxyOptions = createLegacyProxyOptions(serviceName + '_legacy', config);
      const legacyProxy = createProxyMiddleware(legacyProxyOptions);
      
      app.use(config.pathPattern, legacyProxy);
      Logger.log({ level: "info", message: `Legacy proxy configured: ${config.pathPattern} -> ${config.target} (with path rewrite to v1)`});
    });
  }

  // API version discovery endpoint
  app.get('/api/versions', (req, res) => {
    const availableVersions = {
      v1: {
        status: 'active',
        services: Object.keys(services),
        endpoints: Object.values(services).map(service => service.pathPattern)
      }
    };

    if (process.env.ENABLE_LEGACY_ROUTES === 'true') {
      availableVersions.legacy = {
        status: 'deprecated',
        services: Object.keys(legacyServices),
        endpoints: Object.values(legacyServices).map(service => service.pathPattern),
        deprecation_notice: 'Legacy endpoints are deprecated. Please migrate to v1 APIs.'
      };
    }

    res.json({
      success: true,
      versions: availableVersions,
      current_version: 'v1',
      timestamp: new Date().toISOString()
    });
  });
};

const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export { setupProxies, services };