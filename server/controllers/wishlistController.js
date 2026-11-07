// controllers/wishlistController.js - Handles saving and removing favorites from student wishlist
const User = require('../models/User');
const Listing = require('../models/Listing');

/**
 * @desc    Toggle item in user's wishlist (Add if not present, remove if present)
 * @route   POST /api/wishlist/:listingId
 * @access  Private
 */
const toggleWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.findIndex(
      (id) => id.toString() === listingId.toString()
    );

    let isAdded = false;
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      // Add to wishlist
      user.wishlist.push(listingId);
      isAdded = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isAdded ? 'Saved to your wishlist' : 'Removed from your wishlist',
      isAdded,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all listings saved in user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: {
        path: 'seller',
        select: 'name email phone city role',
      },
    });

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      listings: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleWishlist,
  getWishlist,
};
