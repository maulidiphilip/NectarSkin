const Cart = require("../../Models/Cart");
const Order = require("../../Models/Order");
const Products = require("../../Models/Products");


const createOrder = async (req, res) => {
  const userId = req.user._id;

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
    });

    await Promise.all(
      cart.items.map(async (item) => {
        const product = await Products.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      })
    );

    await order.save();
    await Cart.deleteOne({ userId });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
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

module.exports = { createOrder, getOrders };
