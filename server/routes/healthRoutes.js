// routes/healthRoutes.js - Health check endpoint for monitoring & deployment
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @desc    Check server and MongoDB connection health
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  // mongoose.connection.readyState:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';
  const isDbHealthy = mongoose.connection.readyState === 1;

  res.status(isDbHealthy ? 200 : 503).json({
    status: isDbHealthy ? 'healthy' : 'unhealthy',
    message: isDbHealthy ? 'CampusBazar API is running smoothly' : 'Database is not connected',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

module.exports = router;
