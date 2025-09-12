import { ProductRoute } from "./api";

export default function (app) {
  app.use("/api/product", ProductRoute);
}