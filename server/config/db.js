// config/db.js - Database connection setup
const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose.
 * In production, it connects strictly to the MONGO_URI from .env.
 * In development, if local MongoDB is not running or MONGO_URI is missing,
 * it seamlessly starts an in-memory MongoDB instance if USE_MEMORY_DB is enabled.
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // Strict check for production: MONGO_URI must exist
  if (!uri && process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL ERROR: MONGO_URI environment variable is missing.');
    console.error('👉 Please configure MONGO_URI in your environment or .env file.');
    process.exit(1);
  }

  // If no URI or explicitly requested memory DB
  if (!uri || process.env.USE_MEMORY_DB === 'true' && uri.includes('127.0.0.1')) {
    // Try connecting to local mongo first with short timeout; if unavailable, fallback to memory server
    try {
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/campusbazar', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return conn;
    } catch (localErr) {
      if (process.env.USE_MEMORY_DB === 'true' || process.env.NODE_ENV !== 'production') {
        console.log('ℹ️  Local MongoDB not running on port 27017. Starting embedded in-memory MongoDB...');
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memoryUri = mongod.getUri();
          const conn = await mongoose.connect(memoryUri);
          console.log(`✅ Embedded In-memory MongoDB Connected: ${conn.connection.host}`);
          return conn;
        } catch (memErr) {
          console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
          process.exit(1);
        }
      } else {
        console.error(`❌ MongoDB Connection Error: ${localErr.message}`);
        process.exit(1);
      }
    }
  }

  // Connect to standard Atlas / remote MONGO_URI
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
