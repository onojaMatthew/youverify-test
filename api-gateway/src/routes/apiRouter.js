import Router from "express";
import { getGatewayMetrics, getGatewayStatus, generateAuthToken, resetGatewayMetrics } from "../controllers/controller";

const router = Router();

/**
 * Gateway status endpoint
 * GET /gateway/status
 */
router.get('/status', getGatewayStatus);

/**
 * Gateway metrics endpoint
 * GET /gateway/metrics
 */
router.get('/metrics', getGatewayMetrics);

/**
 * Reset metrics (useful for testing)
 * POST /gateway/metrics/reset
 */
router.post('/metrics/reset', resetGatewayMetrics);

/**
 * Generate test JWT token (for development/testing)
 * POST /gateway/auth/token
 */
router.post('/auth/token', generateAuthToken);

export { router as GatewayRoutes }