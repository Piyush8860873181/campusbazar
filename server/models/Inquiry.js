// models/Inquiry.js - Messages sent from buyers to sellers for an item
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing reference is required'],
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender user reference is required'],
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user reference is required'],
    },
    message: {
      type: String,
      required: [true, 'Inquiry message cannot be empty'],
      trim: true,
      maxlength: [1000, 'Inquiry message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index to retrieve inquiries efficiently
inquirySchema.index({ toUser: 1, createdAt: -1 });
inquirySchema.index({ fromUser: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
