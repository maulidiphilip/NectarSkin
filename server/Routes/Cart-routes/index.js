const express = require("express");
const cartController = require("../../Controller/Cart-Controller"); // Ensure the correct path
const authMiddleware = require("../../Middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware.authenticate, cartController.addToCart);
router.put("/update", authMiddleware.authenticate, cartController.updateCart);
router.delete("/delete/:productId", authMiddleware.authenticate, cartController.deleteFromCart);
router.get("/", authMiddleware.authenticate, cartController.getCart);
router.post("/sync", authMiddleware.authenticate, cartController.syncCart);

module.exports = router;
