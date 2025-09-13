import { model, Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, required: true, unique: true },
  images: [{ url: { type: String }}],
  specifications: {
    weight: { type: String },
    dimensions: { type: String },
    color: { type: String },
    material: { type: String }
  },
  isActive: { type: Boolean, default: true
  },
  tags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.plugin(mongoosePaginate);
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0 && this.isActive;
});

productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

export const Product = model("Product", productSchema);