const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Mo626", "Mpamba", "Airtel Money", "PayChangu"], required: true },
  status: {
    type: String,
    enum: ["Pending Payment", "Payment Confirmed", "Shipped", "Delivered"],
    default: "Pending Payment",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);