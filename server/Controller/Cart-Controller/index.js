const Cart = require("../../Models/Cart");

const cartController = {
  // Add item to cart (unauthenticated users return local data, authenticated sync to DB)
  addToCart: async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user?._id; // Optional, from auth middleware

      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }

      if (userId) {
        // Authenticated user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
          cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        return res.status(200).json({
          success: true,
          message: "Item added to cart",
          data: cart,
        });
      } else {
        // Unauthenticated user: Return the item to be stored locally
        return res.status(200).json({
          success: true,
          message: "Item added to local cart",
          data: { items: [{ productId, quantity }] },
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Failed to add to cart", error: error.message });
    }
  },

  // Update cart (similar logic)
  updateCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?._id;

      if (!productId || quantity === undefined) {
        return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
      }

      if (userId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
        if (itemIndex === -1) {
          return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();

        return res.status(200).json({
          success: true,
          message: "Cart updated",
          data: cart,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Cart updated locally",
          data: { items: [{ productId, quantity }] },
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ success: false, message: "Failed to update cart", error: error.message });
    }
  },

  // Delete from cart
  deleteFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user?._id;

      if (userId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
        if (itemIndex === -1) {
          return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        cart.items.splice(itemIndex, 1);
        cart.updatedAt = Date.now();
        await cart.save();

        return res.status(200).json({
          success: true,
          message: "Item removed from cart",
          data: cart,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Item removed from local cart",
          data: { items: [] },
        });
      }
    } catch (error) {
      console.error("Error deleting from cart:", error);
      res.status(500).json({ success: false, message: "Failed to remove from cart", error: error.message });
    }
  },

  // Get cart (authenticated only)
  getCart: async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required to fetch server cart" });
      }

      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) {
        return res.status(200).json({ success: true, message: "Cart is empty", data: { items: [] } });
      }

      res.status(200).json({
        success: true,
        message: "Cart retrieved",
        data: cart,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ success: false, message: "Failed to fetch cart", error: error.message });
    }
  },

  // Sync local cart after login (new endpoint)
  syncCart: async (req, res) => {
    try {
      const { items } = req.body; // Local cart items from frontend
      const userId = req.user._id;

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      items.forEach((localItem) => {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === localItem.productId
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += localItem.quantity;
        } else {
          cart.items.push(localItem);
        }
      });

      cart.updatedAt = Date.now();
      await cart.save();

      res.status(200).json({
        success: true,
        message: "Cart synced",
        data: cart,
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
      res.status(500).json({ success: false, message: "Failed to sync cart", error: error.message });
    }
  },
};

module.exports = cartController;