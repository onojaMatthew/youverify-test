import { model, Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true },
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

export const Product = model("Product", productSchema);

// save the product data
// update the stock value