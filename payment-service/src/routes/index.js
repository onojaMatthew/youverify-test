import { PaymentRoute } from "./api";

export const router = (app) => {
  app.use("/", PaymentRoute);
}