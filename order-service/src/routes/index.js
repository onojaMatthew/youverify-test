import { OrderRoute } from "./api"

export const router = (app) => {
  app.use("/", OrderRoute);
}