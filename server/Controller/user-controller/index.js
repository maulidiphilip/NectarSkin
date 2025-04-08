const User = require("../../Models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userName, userEmail, password } = req.body;
    const updates = { userName, userEmail };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ success: true, message: "User account deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete account", error: err.message });
  }
};

// ADMIN: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get users", error: err.message });
  }
};

// ADMIN: Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get user", error: err.message });
  }
};

// ADMIN: Update any user
const updateUser = async (req, res) => {
  try {
    const { userName, userEmail, role } = req.body;
    const updates = { userName, userEmail, role };

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "User updated", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update user", error: err.message });
  }
};

// ADMIN: Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
