import { model, Schema } from "mongoose";

const sequenceSchema = new Schema({
  _id: { type: Number },
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
  updatedBy: { type: String }
});

const sequece = model("Sequence", sequenceSchema);
export { sequece as Sequence };