// middleware/auth.js - Protects routes by validating JWT tokens
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware function that checks for a valid JWT in the request headers.
 * If valid, it attaches the authenticated user document to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header with 'Bearer <token>' exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from 'Bearer <token>'
      const parts = req.headers.authorization.split(' ');
      if (parts.length > 1) {
        token = parts[1].trim();
      }

      if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token missing or invalid',
        });
      }

      // Verify token with secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'campusbazar_secret_student_dev_key_2026'
      );

      // Fetch user from database excluding password field
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized, please log in',
  });
};

module.exports = { protect };
