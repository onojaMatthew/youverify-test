import { PaymentRoute } from "./api";

export default function (app) {
  app.use("/api/payment", PaymentRoute);
}