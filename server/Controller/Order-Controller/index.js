const Cart = require("../../Models/Cart");
const Order = require("../../Models/Order");
const Products = require("../../Models/Products");


const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod } = req.body; // New field from frontend

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      })),
      totalPrice: cart.totalPrice,
      paymentMethod,
    });

    // Only reduce stock and clear cart for instant payment methods (future, e.g., PayChangu)
    if (paymentMethod === "PayChangu") {
      await Promise.all(
        cart.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          product.stock -= item.quantity;
          await product.save();
        })
      );
      await Cart.deleteOne({ userId });
      order.status = "Payment Confirmed";
    }

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId }).populate("items.productId");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    // console.log("Fetched all orders:", orders); // Debug log
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    if (status === "Payment Confirmed") {
      await Cart.deleteOne({ userId: order.userId });
      await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          product.stock -= item.quantity;
          await product.save();
        })
      );
    }
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createOrder, getOrders, getAllOrders, updateOrderStatus };
