import { CustomerRoute } from "./api"

export const router = (app) => {
  app.use("/", CustomerRoute);
}