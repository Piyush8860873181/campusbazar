// routes/wishlistRoutes.js - Wishlist endpoints for saving items
const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

// Get all wishlist items for current user
router.get('/', protect, getWishlist);

// Toggle listing in wishlist (add / remove)
router.post('/:listingId', protect, toggleWishlist);

module.exports = router;
