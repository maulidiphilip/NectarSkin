const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Middleware/authMiddleware");
const { getAllOrders, updateOrderStatus } = require("../../Controller/Order-Controller/index");

router.get("/orders", authMiddleware.authenticate, authMiddleware.isAdmin, getAllOrders);
router.put("/orders/:orderId/status", authMiddleware.authenticate, authMiddleware.isAdmin, updateOrderStatus);

module.exports = router;