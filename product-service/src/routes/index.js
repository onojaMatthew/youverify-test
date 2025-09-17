import { ProductRoute } from "./api";


export const router = (app) => {
  app.use("/", ProductRoute)
}