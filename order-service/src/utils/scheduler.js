import job from "node-cron";
import { Logger } from "../config/logger";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

/**
 * Use job runner to update order payment status in the background
 * in every 10 min using the transaction details consumed from the
 * message queue after payment was made
 */
export const jobRunner = async () => {
  try {
    job.schedule("*/1 * * * *", async () => { // Leave it at 1 minute for test purposes
      const orders = await Order.find({ orderStatus: "pending", paymentStatus: "processing" });
      // console.log(orders, " the orders")
      for(let order of orders) {
        const orderReferenceId = order.orderReferenceId;
        const payment = await Payment.findOne({ orderReferenceId });
        // console.log(payment, " the payment found")
        if (payment) {
          order.paymentStatus = payment.status;
          await order.save();
          Logger.log({ level: "info", message: `Job runner has updated order payment status for order: ${order.orderReferenceId}`});
        }
      }
    });
  } catch (err) {
    Logger.log({ level: "error", message: `Error running order payment status update: ${err.message}`});
  }
}