const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/Auth-Routes");
const productRoutes = require("./Routes/Products/product-routes")
const userRoutes = require("./Routes/user-routes/index");
const cartRoutes = require("./Routes/Cart-Routes/index");
const orderRoutes = require("./Routes/Order-Routes/index");
const adminRoutes = require("./Routes/admin-Order-route/index");
const wishlistRoutes = require("./Routes/Wishlist-Routes/index");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({
  origin: CLIENT_URL, // Use specific frontend URL
  credentials: true // Allow cookies to be sent
}));

app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form-data (needed for multer)


app.use(express.json());

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

//routes

// auth route configuration for the application
app.use("/api/auth", authRoutes);

// products routes 
app.use("/api/products", productRoutes);

// user routes
app.use("/api/users", userRoutes);

// cart and order routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// admin order routes
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
