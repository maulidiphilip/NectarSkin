// server/Routes/Products/product-routes.js
const express = require("express");
const router = express.Router();
const { productController, uploadMiddleware } = require("../../Controller/products-controller/product-controller");
const authMiddleware = require("../../Middleware/authMiddleware");

// Public routes - no middleware
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Admin-only routes
router.use(authMiddleware.authenticate, authMiddleware.isAdmin);
router.post("/create", uploadMiddleware, productController.createProduct);
router.put("/:id", uploadMiddleware, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;