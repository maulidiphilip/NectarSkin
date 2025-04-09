const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Middleware/authMiddleware");
const { addToCart, getCart, updateCartItem, removeFromCart } = require("../../Controller/Cart-Controller/index");

// All cart routes require authentication
router.post("/add", authMiddleware.authenticate, addToCart);
router.get("/", authMiddleware.authenticate, getCart);
router.put("/update", authMiddleware.authenticate, updateCartItem);
router.delete("/remove/:productId", authMiddleware.authenticate, removeFromCart);

module.exports = router;