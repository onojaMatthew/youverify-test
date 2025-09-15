import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  orderReferenceId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  transactionId: {
    type: String,
    index: true
  },
  queuedAt: Date,
  processedAt: Date
}, {
  timestamps: true
});

export const Payment = model("Payment", paymentSchema);