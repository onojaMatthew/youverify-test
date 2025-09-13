import { model, Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentId: {
    type: String,
    index: true
  },
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  productDetails: {
    name: String,
    brand: String,
    category: String,
    sku: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  orderNotes: String,
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('totalWithTax').get(function() {
  return this.amount * 1.10;
});

orderSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = model("Order", orderSchema)