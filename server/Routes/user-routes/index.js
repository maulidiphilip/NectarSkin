// Backend routes (e.g., routes/user.js)
const express = require("express");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../Controller/user-controller");
const auth = require("../../Middleware/authMiddleware");

const router = express.Router();

// USER ROUTES
router.get("/", auth.authenticate, getProfile);
router.put("/", auth.authenticate, updateProfile);
router.delete("/", auth.authenticate, deleteProfile);

// ADMIN ROUTES
router.get("/all", auth.authenticate, auth.isAdmin, getAllUsers); // New endpoint
router.get("/:id", auth.authenticate, auth.isAdmin, getUserById);
router.put("/:id", auth.authenticate, auth.isAdmin, updateUser);
router.delete("/:id", auth.authenticate, auth.isAdmin, deleteUser);

module.exports = router;