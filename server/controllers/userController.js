// controllers/userController.js - Handles user profile updates
const User = require('../models/User');

/**
 * @desc    Update logged-in user profile (name, phone, city, role)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, role } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields if provided
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (city) user.city = city.trim();
    if (role && ['school student', 'college student', 'other'].includes(role)) {
      user.role = role;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        role: updatedUser.role,
        wishlist: updatedUser.wishlist,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
};
