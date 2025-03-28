const express = require('express');
const { registerUser, loginUser } = require('../../Controller/auth-controller');
const router = express.Router();

const authenticatedMiddleware = require("../../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticatedMiddleware, (req, res) => {
    const user = req.user;
  
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      data: {
        user,
      },
    });
  });

module.exports = router;