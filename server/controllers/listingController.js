// controllers/listingController.js - Handles CRUD operations and search/filtering for listings
const Listing = require('../models/Listing');

/**
 * Helper to normalize image paths returned by Multer.
 * Supports Cloudinary URLs (file.path) and local disk files (/uploads/filename).
 */
const extractImageUrls = (files) => {
  if (!files || files.length === 0) return [];
  return files.map((file) => {
    // If Cloudinary is used, file.path contains full secure URL (https://res.cloudinary.com/...)
    if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
      return file.path;
    }
    // If local disk storage is used, format as /uploads/filename
    return `/uploads/${file.filename}`;
  });
};

/**
 * @desc    Fetch all listings with search, filter, sort and pagination
 * @route   GET /api/listings
 * @access  Public
 */
const getListings = async (req, res, next) => {
  try {
    const {
      q,
      category,
      condition,
      city,
      minPrice,
      maxPrice,
      sort,
      isSold,
      page = 1,
      limit = 12,
    } = req.query;

    // 1. Build dynamic MongoDB query filter
    const filter = {};

    // Search keyword in title, description, or subCategory
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subCategory: searchRegex },
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by Condition
    if (condition) {
      filter.condition = condition;
    }

    // Filter by City (case-insensitive)
    if (city && city.trim()) {
      filter.city = new RegExp(city.trim(), 'i');
    }

    // Filter by Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Filter by Sold status: default shows all unless explicitly requested
    if (isSold !== undefined && isSold !== '') {
      filter.isSold = isSold === 'true';
    }

    // 2. Sorting logic
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    // 3. Pagination calculation
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    // 4. Query database
    const total = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter)
      .populate('seller', 'name email phone city role')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      hasMore: skip + listings.length < total,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch a single listing by its ID
 * @route   GET /api/listings/:id
 * @access  Public
 */
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'name email phone city role createdAt'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new listing
 * @route   POST /api/listings
 * @access  Private (Owner/Student)
 */
const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      condition,
      price,
      negotiable,
      city,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !condition || price === undefined || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, condition, price, city',
      });
    }

    // Process uploaded image files (if any)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = extractImageUrls(req.files);
    } else if (req.body.images) {
      // Support array or JSON-stringified array of existing image URLs
      if (Array.isArray(req.body.images)) {
        imageUrls = req.body.images;
      } else if (typeof req.body.images === 'string') {
        try {
          imageUrls = JSON.parse(req.body.images);
        } catch {
          imageUrls = [req.body.images];
        }
      }
    }

    // Create listing in database
    const listing = await Listing.create({
      title,
      description,
      category,
      subCategory: subCategory || '',
      condition,
      price: Number(price),
      negotiable: negotiable === true || negotiable === 'true',
      images: imageUrls.slice(0, 4),
      city,
      seller: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Listing published successfully',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing listing
 * @route   PUT /api/listings/:id
 * @access  Private (Owner only)
 */
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Verify ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this listing',
      });
    }

    const {
      title,
      description,
      category,
      subCategory,
      condition,
      price,
      negotiable,
      city,
      existingImages,
    } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (category) listing.category = category;
    if (subCategory !== undefined) listing.subCategory = subCategory;
    if (condition) listing.condition = condition;
    if (price !== undefined) listing.price = Number(price);
    if (negotiable !== undefined) listing.negotiable = negotiable === true || negotiable === 'true';
    if (city) listing.city = city;

    // Handle images: retain existing specified images + append newly uploaded files
    let updatedImages = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        updatedImages = [...existingImages];
      } else if (typeof existingImages === 'string') {
        try {
          updatedImages = JSON.parse(existingImages);
        } catch {
          updatedImages = [existingImages];
        }
      }
    } else {
      updatedImages = [...listing.images];
    }

    if (req.files && req.files.length > 0) {
      const newUrls = extractImageUrls(req.files);
      updatedImages = [...updatedImages, ...newUrls];
    }

    listing.images = updatedImages.slice(0, 4);

    const savedListing = await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: savedListing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a listing
 * @route   DELETE /api/listings/:id
 * @access  Private (Owner only)
 */
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Verify ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or set isSold status for a listing
 * @route   PATCH /api/listings/:id/sold
 * @access  Private (Owner only)
 */
const toggleSoldStatus = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Verify ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status of this listing',
      });
    }

    // If req.body.isSold is explicitly provided, use it; otherwise toggle
    if (req.body.isSold !== undefined) {
      listing.isSold = Boolean(req.body.isSold);
    } else {
      listing.isSold = !listing.isSold;
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: listing.isSold ? 'Listing marked as Sold' : 'Listing marked as Available',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all listings created by the logged-in user
 * @route   GET /api/listings/mine
 * @access  Private
 */
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleSoldStatus,
  getMyListings,
};
