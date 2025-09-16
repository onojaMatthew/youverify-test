
// In-memory metrics store (in production, use Redis or dedicated metrics service)
const metrics = {
  requests: {
    total: 0,
    byMethod: {},
    byStatus: {},
    byService: {}
  },
  response_times: [],
  errors: {
    total: 0,
    byType: {}
  },
  startTime: new Date()
};

const metricsCollector = (req, res, next) => {
  const start = Date.now();

  // Increment total requests
  metrics.requests.total++;

  // Track by method
  metrics.requests.byMethod[req.method] = (metrics.requests.byMethod[req.method] || 0) + 1;

  // Determine service from path
  let service = 'unknown';
  if (req.path.startsWith('/api/v1/customers') || req.path.startsWith('/api/customers')) {
    service = 'customer-service';
  } else if (req.path.startsWith('/api/v1/products') || req.path.startsWith('/api/products')) {
    service = 'product-service';
  } else if (req.path.startsWith('/api/v1/orders') || req.path.startsWith('/api/orders')) {
    service = 'order-service';
  } else if (req.path.startsWith('/api/v1/payments') || req.path.startsWith('/api/payments')) {
    service = 'payment-service';
  }

  // Track by service
  metrics.requests.byService[service] = (metrics.requests.byService[service] || 0) + 1;

  // Track response metrics
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Track response time
    metrics.response_times.push(duration);
    
    // Keep only last 1000 response times
    if (metrics.response_times.length > 1000) {
      metrics.response_times = metrics.response_times.slice(-1000);
    }

    // Track by status code
    const statusCode = res.statusCode;
    metrics.requests.byStatus[statusCode] = (metrics.requests.byStatus[statusCode] || 0) + 1;

    // Track errors
    if (statusCode >= 400) {
      metrics.errors.total++;
      const errorType = statusCode >= 500 ? 'server_error' : 'client_error';
      metrics.errors.byType[errorType] = (metrics.errors.byType[errorType] || 0) + 1;
    }
  });

  next();
};

const getMetrics = () => {
  const avgResponseTime = metrics.response_times.length > 0 
    ? metrics.response_times.reduce((a, b) => a + b, 0) / metrics.response_times.length 
    : 0;

  const uptime = Date.now() - metrics.startTime.getTime();

  return {
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 1000)}s`,
    requests: {
      ...metrics.requests,
      avg_response_time: `${avgResponseTime.toFixed(2)}ms`,
      requests_per_second: (metrics.requests.total / (uptime / 1000)).toFixed(2)
    },
    errors: metrics.errors,
    health: {
      status: 'healthy',
      error_rate: ((metrics.errors.total / metrics.requests.total) * 100).toFixed(2) + '%'
    }
  };
};

const resetMetrics = () => {
  metrics.requests.total = 0;
  metrics.requests.byMethod = {};
  metrics.requests.byStatus = {};
  metrics.requests.byService = {};
  metrics.response_times = [];
  metrics.errors.total = 0;
  metrics.errors.byType = {};
  metrics.startTime = new Date();
};

export { metricsCollector, getMetrics, resetMetrics };