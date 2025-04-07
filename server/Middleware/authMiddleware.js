// server/Middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = {
  // General authentication (used in auth routes)
  authenticate: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated: No valid token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: error.message,
      });
    }
  },

  // Admin-only check (used in product routes)
  isAdmin: (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  },
};

module.exports = authMiddleware;