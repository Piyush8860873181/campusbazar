// models/Listing.js - Schema for items posted by students and users
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'School Books',
        'College Books',
        'Notes',
        'Drawing Equipment',
        'School Uniform',
        'Laptops and Computers',
        'Scientific Calculators',
        'Competitive Exam Books',
        'Other',
      ],
    },
    subCategory: {
      type: String,
      trim: true,
      default: '', // e.g. "Class 10 CBSE", "CSE 4th Sem", "Mechanical", "GATE 2026"
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Like New', 'Good', 'Fair'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be 0 or greater'],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 4;
        },
        message: 'A maximum of 4 images can be uploaded per listing',
      },
      default: [],
    },
    city: {
      type: String,
      required: [true, 'City or campus location is required'],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller reference is required'],
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast search and filtering
listingSchema.index({ title: 'text', description: 'text', subCategory: 'text' });
listingSchema.index({ category: 1, price: 1, isSold: 1, createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
