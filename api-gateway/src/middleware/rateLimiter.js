import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Logger } from '../config/logger';

// Basic rate limiter for all requests
const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    Logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for write operations
const strictLimiter = new RateLimiterMemory({
  keyPrefix: 'strict_limit',
  points: 50, // Number of requests
  duration: 60, // Per 60 seconds
});

// Custom rate limiting middleware
const customRateLimiter = async (req, res, next) => {
  // Apply strict limiting to POST, PUT, DELETE operations
  const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  
  if (isWriteOperation) {
    try {
      await strictLimiter.consume(req.ip);
    } catch (rateLimiterRes) {
      const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      
      Logger.warn(`Strict rate limit exceeded for IP: ${req.ip}, method: ${req.method}`);
      
      return res.status(429).json({
        success: false,
        error: 'Too many write operations, please try again later',
        retryAfter: `${secs} seconds`
      });
    }
  }

  next();
};

// Combine both rate limiters
export const rateLimiter = [basicLimiter, customRateLimiter];

