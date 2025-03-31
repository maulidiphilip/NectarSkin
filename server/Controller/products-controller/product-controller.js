const Product = require("../../Models/Products");

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category, imageUrl, oldPrice } = req.body;

      // Validation
      if (!name || !description || !price || !stock || !category) {
        return res.status(400).json({
          success: false,
          message: "All required fields (name, description, price, stock, category) must be provided",
        });
      }

      // Create product
      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        oldPrice, // Added for deals
        createdBy: req.user._id,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    }
  },

  // Get all products (public)
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("createdBy", "userName");
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  },

  // Get product by ID (public)
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate("createdBy", "userName");
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  },
};

module.exports = productController;