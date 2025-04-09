const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Middleware/authMiddleware");
const { createOrder, getOrders } = require("../../Controller/Order-Controller/index");

// All order routes require authentication
router.post("/", authMiddleware.authenticate, createOrder);
router.get("/", authMiddleware.authenticate, getOrders);

module.exports = router;