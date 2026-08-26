import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  price: {type: Number, required: true, min: 0},
  discountPercentage: {type: Number, default: 0, min: 0, max: 100},
  rating: {type: Number, default: 0, min: 0, max: 5},
  stock: {type: Number, required: true, min: 0, default: 0},
  brand: {type: String, trim: true, default: ""},
  category: {type: String, required: true, trim: true},
  thumbnail: {type: String, required: true, trim: true},
  images: {type: [String], default: []}
}, {timestamps: true, versionKey: false});

productSchema.virtual("id").get(function () { return this._id.toString(); });
productSchema.set("toJSON", {virtuals: true, transform: (_, value) => { delete value._id; return value; }});

export default mongoose.model("Product", productSchema);
