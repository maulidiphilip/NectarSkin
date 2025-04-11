const Cart = require("../../Models/Cart");
const Order = require("../../Models/Order");
const Products = require("../../Models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, shippingAddress, paymentIntentId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productId.name}. Available: ${item.productId.stock}`,
        });
      }
    }

    const orderData = {
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      })),
      totalPrice: cart.totalPrice,
      paymentMethod,
      shippingAddress,
    };

    if (paymentMethod === "Stripe" && !paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cart.totalPrice * 100),
        currency: "mwk",
        metadata: { userId: userId.toString() },
      });
      return res.status(200).json({
        success: true,
        data: { order: orderData, clientSecret: paymentIntent.client_secret },
      });
    }

    const order = new Order(orderData);

    if (paymentMethod === "Stripe" && paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ success: false, message: "Payment failed" });
      }
      order.status = "Payment Confirmed";
      await Promise.all(
        cart.items.map(async (item) => {
          const product = await Products.findById(item.productId._id);
          product.stock -= item.quantity;
          await product.save();
        })
      );
      await Cart.deleteOne({ userId });
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
          const product = await Products.findById(item.productId);
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
