import { model, Schema } from "mongoose";

const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  orderId: {
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
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet'],
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  transactionStatus: {
    type: String,
    enum: ['initiated', 'processing', 'completed', 'failed'],
    default: 'initiated'
  },
  gatewayResponse: {
    gatewayTransactionId: String,
    gatewayStatus: String,
    gatewayMessage: String,
    processingFee: Number
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String
  },
  processedAt: Date,
  failureReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

transactionSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

transactionSchema.index({ customerId: 1, paymentStatus: 1 });
transactionSchema.index({ createdAt: -1 });

export const Transaction = model("Transaction", transactionSchema);