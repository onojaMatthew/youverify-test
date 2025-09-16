const { Logger } = require('../config/logger');

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Add request ID to headers
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  // Log incoming request
  Logger.info(`Incoming request: ${req.method} ${req.url}`, {
    requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length')
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    Logger.info(`Outgoing response: ${req.method} ${req.url}`, {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(data).length
    });

    return originalJson.call(this, data);
  };

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info(`Request completed: ${req.method} ${req.url}`, {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export { loggingMiddleware }