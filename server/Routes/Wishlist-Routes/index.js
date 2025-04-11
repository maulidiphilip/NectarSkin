const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Middleware/authMiddleware");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../../Controller/Wishlist-Controller");

router.get("/", authMiddleware.authenticate, getWishlist);
router.post("/add", authMiddleware.authenticate, addToWishlist);
router.delete("/remove/:productId", authMiddleware.authenticate, removeFromWishlist);

module.exports = router;