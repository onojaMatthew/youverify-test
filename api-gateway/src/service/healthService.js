import axios from "axios"
import { services } from "../proxy/proxyConfig";
import { Logger } from "../config/logger";

/**
 * Check health of all microservices
 */
const healthCheck = async () => {
  const healthPromises = Object.entries(services).map(async ([serviceName, config]) => {
    try {
      const healthUrl = `${config.target}${config.healthEndpoint}`;
      const response = await axios.get(healthUrl, { timeout: 5000 });
      
      return {
        service: serviceName,
        status: 'healthy',
        response_time: response.headers['x-response-time'] || 'N/A',
        last_check: new Date().toISOString()
      };
    } catch (err) {
      Logger.log({ level: "error", message: `Health check failed for ${serviceName}: ${err.message}`});
      
      return {
        service: serviceName,
        status: 'unhealthy',
        error: err.message,
        last_check: new Date().toISOString()
      };
    }
  });

  const results = await Promise.all(healthPromises);
  
  // Calculate overall health
  const healthyServices = results.filter(result => result.status === 'healthy').length;
  const totalServices = results.length;
  
  return {
    overall_status: healthyServices === totalServices ? 'healthy' : 'degraded',
    healthy_services: healthyServices,
    total_services: totalServices,
    services: results
  };
};

export { healthCheck };