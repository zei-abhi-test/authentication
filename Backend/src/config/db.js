const mongoose = require('mongoose');

// =============================================
// Database Connection Function
// =============================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed');
    process.exit(1);
  }
};

// =============================================
// Test / Environment-specific URI logic (preserved)
// =============================================
const uri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

// Direct connection (preserved as per your original code)
// Note: This runs immediately when this file is required.
// In clean architecture, it's better to call connectDB() explicitly from server.js
mongoose.connect(uri);

module.exports = connectDB;