const Products = require("../../Models/Products");

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category, imageUrl } = req.body;

      // Validation
      if (!name || !description || !price || !stock || !category) {
        return res.status(400).json({
          success: false,
          message: "All required fields (name, description, price, stock, category) must be provided",
        });
      }

      // Create product
      const newProduct = new Products({
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        createdBy: req.user._id, // From JWT token
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

  // Optional: Get all products (for listing in dashboard)
  getAllProducts: async (req, res) => {
    try {
      const products = await Products.find().populate("createdBy", "userName");
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
};

module.exports = productController;