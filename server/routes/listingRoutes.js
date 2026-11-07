// routes/listingRoutes.js - Listing endpoints for marketplace items
const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleSoldStatus,
  getMyListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route to fetch all listings (with search, category, sort, pagination)
router.get('/', getListings);

// Private route to fetch current user's own listings (Must be placed before /:id)
router.get('/mine', protect, getMyListings);

// Public route to fetch single listing details
router.get('/:id', getListingById);

// Private route to create a new listing (handles up to 4 image uploads)
router.post('/', protect, upload.array('images', 4), createListing);

// Private route to update an existing listing
router.put('/:id', protect, upload.array('images', 4), updateListing);

// Private route to delete a listing
router.delete('/:id', protect, deleteListing);

// Private route to toggle or mark listing as sold
router.patch('/:id/sold', protect, toggleSoldStatus);

module.exports = router;
