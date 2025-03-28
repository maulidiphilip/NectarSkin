const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/Auth-Routes");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // Use specific frontend URL
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

//routes

// auth route configuration for the application
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
