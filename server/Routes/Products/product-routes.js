// server/Routes/Products/product-routes.js
const express = require("express");
const router = express.Router();
const productController = require("../../Controller/products-controller/product-controller");
const authMiddleware = require("../../Middleware/authMiddleware"); // Added import

// Protect all routes with token verification and admin check
router.use(authMiddleware.authenticate, authMiddleware.isAdmin);

// Create a product
router.post("/create", productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);

module.exports = router;