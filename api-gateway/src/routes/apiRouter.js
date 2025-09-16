import Router from "express";
import { getGatewayMetrics, getGatewayStatus, generateAuthToken, resetGatewayMetrics } from "../controllers/controller";

const router = Router();

/**
 * Gateway status endpoint
 * GET /api/gateway/status
 */
router.get('/status', getGatewayStatus);

/**
 * Gateway metrics endpoint
 * GET /api/gateway/metrics
 */
router.get('/metrics', getGatewayMetrics);

/**
 * Reset metrics (useful for testing)
 * POST /api/gateway/metrics/reset
 */
router.post('/metrics/reset', resetGatewayMetrics);

/**
 * Generate test JWT token (for development/testing)
 * POST /api/gateway/auth/token
 */
router.post('/auth/token', generateAuthToken);

export { router as GatewayRoutes }