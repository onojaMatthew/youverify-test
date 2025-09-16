import { AppError } from '../utils/errorHandler';


import { getMetrics, resetMetrics } from '../middleware/metrics';
import { healthCheck } from '../service/healthService';
import { generateToken } from '../middleware/auth';
import { Logger } from '../config/logger';

/**
 * Gateway status endpoint
 * GET /gateway/status
 */
export const getGatewayStatus = async (req, res, next) => {
  try {
    const health = await healthCheck();
    
    return res.json({
      success: true,
      message: "Fetched gateway status",
      data: {
        gateway: {
          status: 'healthy',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        },
        services: health
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error getting gateway status: ${err}`});
    return next(AppError(`Failed to get gateway status: ${err.message}`, 500));
  }
}

/**
 * Gateway metrics endpoint
 * GET /gateway/metrics
 */
export const getGatewayMetrics = async (req, res, next) => {
  try {
    const metrics = getMetrics();
    return res.json({
      success: true,
      message: "Gateway metrics fetched successfully",
      metrics
    });
  } catch (err) {
    logger.log({ level: "error", message: `Error getting metrics: ${err}`});
    return next(new AppError(`Internal server error: ${err.message}`, 500));
  }
}


/**
 * Reset metrics (useful for testing)
 * POST /gateway/metrics/reset
 */
export const resetGatewayMetrics = async (req, res, next) => {
  try {
    resetMetrics();
    return res.json({
      success: true,
      message: 'Metrics reset successfully',
      data: null
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error resetting metrics: ${err}` });
    return next(new AppError(`Failed to reset metrics: ${err.message}`, 500));
  }
}


/**
 * Generate test JWT token (for development/testing)
 * POST /gateway/auth/token
 */
export const generateAuthToken = async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return next(new AppError("Token generated not available in production", 403))

  const { customerId = 'CUST-001', email = 'test@example.com', role = 'customer' } = req.body;

  try {
    const token = generateToken({
      userId: customerId,
      customerId,
      email,
      role
    });

    return res.json({
      success: true,
      message: "Token generated",
      data: {
        token,
        expiresIn: '24h',
        user: {
          customerId,
          email,
          role
        }
      }
    });
  } catch (error) {
    Logger.log({ level: "error", message: `Error generating token: ${err.message}`});
    return next(new AppError(`Failed to generate token: ${err.message}`, 500));
  }
}
