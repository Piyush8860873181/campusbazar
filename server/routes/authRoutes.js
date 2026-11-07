// routes/authRoutes.js - Authentication endpoints
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Get current logged-in user profile
router.get('/me', protect, getMe);

module.exports = router;
