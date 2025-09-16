import { ProductRoute } from "./api";


export const router = (app) => {
  app.use("/api/v1/products", ProductRoute)
}