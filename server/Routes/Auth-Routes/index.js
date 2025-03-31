// server/Routes/Auth-Routes/index.js
const express = require('express');
const { registerUser, loginUser } = require('../../Controller/auth-controller');
const router = express.Router();
const authMiddleware = require("../../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authMiddleware.authenticate, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: { user },
  });
});

module.exports = router;