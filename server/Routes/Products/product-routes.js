// server/Routes/Products/product-routes.js
const express = require("express");
const router = express.Router();
const productController = require("../../Controller/products-controller/product-controller");
const authMiddleware = require("../../Middleware/authMiddleware");

// Public routes - no middleware
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById); // New route for single product

// Admin-only routes
router.use(authMiddleware.authenticate, authMiddleware.isAdmin);
router.post("/create", productController.createProduct);

module.exports = router;