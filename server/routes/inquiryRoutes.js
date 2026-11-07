// routes/inquiryRoutes.js - Inquiry endpoints for buyer/seller communication
const express = require('express');
const router = express.Router();
const {
  sendInquiry,
  getReceivedInquiries,
  getSentInquiries,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

// Send inquiry message to a seller
router.post('/', protect, sendInquiry);

// Get inquiries received by current user (Seller Inbox)
router.get('/received', protect, getReceivedInquiries);

// Get inquiries sent by current user
router.get('/sent', protect, getSentInquiries);

module.exports = router;
