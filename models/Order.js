import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  orderItems: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, required: true, min: 1},
    price: {type: Number, required: true, min: 0}
  }],
  shippingAddress: {
    address: {type: String, required: true, trim: true},
    city: {type: String, required: true, trim: true},
    postalCode: {type: String, required: true, trim: true},
    country: {type: String, required: true, trim: true}
  },
  paymentMethod: {type: String, required: true, enum: ["card", "cash"]},
  paymentResult: {status: {type: String}, id: {type: String}},
  totalPrice: {type: Number, required: true, min: 0},
  isPaid: {type: Boolean, default: false},
  paidAt: {type: Date}
}, {timestamps: true, versionKey: false});

export default mongoose.model("Order", orderSchema);
