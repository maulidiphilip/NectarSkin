const Product = require("../../Models/Products");
const cloudinary = require("../../Config/cloudinary");
const upload = require("../../Config/multer");

const productController = {
  // Create a new product with image upload
  createProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category, oldPrice } = req.body;

      // Validation
      if (!name || !description || !price || !stock || !category) {
        return res.status(400).json({
          success: false,
          message: "All required fields (name, description, price, stock, category) must be provided",
        });
      }

      let imageUrl = "";
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "nectarSkin_products" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        imageUrl = result.secure_url;
        console.log("Cloudinary upload successful, URL:", imageUrl); // Debug log
      }

      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        oldPrice,
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

  // Update a product with image upload
  updateProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category, oldPrice } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let imageUrl = product.imageUrl;
      if (req.file) {
        if (imageUrl) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`nectarSkin_products/${publicId}`);
        }
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "nectarSkin_products" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        imageUrl = result.secure_url;
        console.log("Cloudinary update successful, URL:", imageUrl); // Debug log
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category;
      product.imageUrl = imageUrl;
      product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;

      const updatedProduct = await product.save();

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.imageUrl) {
        const publicId = product.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`nectarSkin_products/${publicId}`);
      }

      await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: error.message,
      });
    }
  },

  // Existing getAllProducts and getProductById remain unchanged...
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

const uploadMiddleware = upload.single("image");

module.exports = { productController, uploadMiddleware };