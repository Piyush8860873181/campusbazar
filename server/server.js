// server.js - Main Express server entry point for CampusBazar
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const seedData = require('./seed');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// 1. CORS Configuration: Allow localhost, configured CLIENT_URL, and all Vercel domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, mobile, Postman)
      if (!origin) return callback(null, true);
      // Allow if explicitly in allowedOrigins, or any Vercel domain (*.vercel.app), or development mode
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked this origin: ' + origin));
    },
    credentials: true,
  })
);

// 2. Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Static files: Serve locally uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'CampusBazar API',
    description: 'Student Marketplace Backend',
    status: 'online',
    docs: '/api/health',
  });
});

// 5. 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 6. Central Error Handling Middleware
app.use(errorHandler);

// 7. Start server ONLY after MongoDB connects and auto-seed if empty
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed if database has 0 listings so app is never blank
    await seedData(false);

    app.listen(PORT, () => {
      console.log(`🚀 CampusBazar Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
