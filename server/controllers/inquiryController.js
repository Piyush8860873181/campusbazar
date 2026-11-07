// controllers/inquiryController.js - Handles buyer messages and seller inquiries
const Inquiry = require('../models/Inquiry');
const Listing = require('../models/Listing');

/**
 * @desc    Send an inquiry message to the seller of a listing
 * @route   POST /api/inquiries
 * @access  Private
 */
const sendInquiry = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID and message content are required',
      });
    }

    // Find the target listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Optional: Prevent seller from messaging themselves
    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an inquiry on your own listing',
      });
    }

    // Create inquiry record in MongoDB
    const inquiry = await Inquiry.create({
      listing: listing._id,
      fromUser: req.user._id,
      toUser: listing.seller,
      message: message.trim(),
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('fromUser', 'name email phone city role')
      .populate('toUser', 'name email phone')
      .populate('listing', 'title price images isSold');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent to seller successfully',
      inquiry: populatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries received by the logged-in user (Seller Inbox)
 * @route   GET /api/inquiries/received
 * @access  Private
 */
const getReceivedInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ toUser: req.user._id })
      .populate('fromUser', 'name email phone city role')
      .populate('listing', 'title price images isSold')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries sent by the logged-in user
 * @route   GET /api/inquiries/sent
 * @access  Private
 */
const getSentInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ fromUser: req.user._id })
      .populate('toUser', 'name email phone city role')
      .populate('listing', 'title price images isSold')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendInquiry,
  getReceivedInquiries,
  getSentInquiries,
};
