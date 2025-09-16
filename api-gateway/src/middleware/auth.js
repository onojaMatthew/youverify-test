import jwt from "jsonwebtoken";
import { Logger } from "../config/logger";

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true'; // For development

// Routes that don't require authentication
const publicRoutes = [
  '/api/v1/customers', // GET only for browsing
  '/api/v1/products'   // GET only for browsing
];

// Routes that require authentication
const protectedRoutes = [
  '/api/v1/orders',
  '/api/v1/payments'
];

// Legacy routes (if enabled)
const legacyPublicRoutes = [
  '/api/customers',
  '/api/products'
];

const legacyProtectedRoutes = [
  '/api/orders',
  '/api/payments'
];

const authMiddleware = (req, res, next) => {
  // Skip authentication in development mode
  if (BYPASS_AUTH) {
    Logger.log({ level: "debug", message: 'Authentication bypassed for development'});
    return next();
  }

  // Check if route is public and method is GET
  const allPublicRoutes = [...publicRoutes];
  if (process.env.ENABLE_LEGACY_ROUTES === 'true') {
    allPublicRoutes.push(...legacyPublicRoutes);
  }

  const isPublicRoute = allPublicRoutes.some(route => req.path.startsWith(route));
  if (isPublicRoute && req.method === 'GET') {
    return next();
  }

  // Extract token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access token is missing or invalid',
      code: 'MISSING_TOKEN'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      customerId: decoded.customerId,
      email: decoded.email,
      role: decoded.role || 'customer'
    };

    // Log authenticated request
    logger.info(`Authenticated request: ${req.method} ${req.path} by user ${req.user.id}`);
    
    next();
  } catch (err) {
    Logger.log({ level: "error", message: `JWT verification failed: ${err.message}`});
    
    let errorMessage = 'Invalid access token';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Access token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Malformed access token';
    }

    return res.status(401).json({
      success: false,
      error: errorMessage,
      code: err.name
    });
  }
};

// Utility function to generate JWT token (for testing)
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};


export { authMiddleware };
export { generateToken };