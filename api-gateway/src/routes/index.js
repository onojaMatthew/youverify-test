import { GatewayRoutes } from "./apiRouter"

export const router = (app) => {
  app.use("/api/gateway", GatewayRoutes);
}