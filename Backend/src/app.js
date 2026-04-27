// app.js (Cleaned & Fixed)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables based on NODE_ENV
// Example: NODE_ENV=test → loads .env.test
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
