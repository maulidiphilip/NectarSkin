const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/Auth-Routes");
const productRoutes = require("./Routes/Products/product-routes")
const cartRoutes = require("./Routes/Cart-routes");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

// app.use(cors({
//   origin: 'http://localhost:5173', // Use specific frontend URL
//   credentials: true // Allow cookies to be sent
// }));

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

// cart route configuration for the application
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
