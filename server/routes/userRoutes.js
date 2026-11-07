// routes/userRoutes.js - User profile endpoints
const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Update user profile (name, phone, city, role)
router.put('/profile', protect, updateProfile);

module.exports = router;
