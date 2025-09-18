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
    // Leave it at 2 minute for test purposes
    job.schedule("*/2 * * * *", async () => { 
      const orders = await Order.find({ orderStatus: "pending", paymentStatus: "processing" });
      for(let order of orders) {
        const orderReferenceId = order.orderReferenceId;
        const payment = await Payment.findOne({ orderReferenceId });
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