const Cart = require("../../Models/Cart");
const Products = require("../../Models/Products");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // From authMiddleware

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Products.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Product unavailable or insufficient stock" });
    }

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * product.price;
    }, 0);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json({ success: true, data: cart || { items: [], totalPrice: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not in cart" });

    const product = cart.items[itemIndex].productId; // Already populated
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
  
    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
  
      cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.quantity * item.productId.price;
      }, 0);
  
      await cart.save();
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };