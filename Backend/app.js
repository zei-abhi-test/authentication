// app.js (Cleaned & Fixed)

const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");   // Uncomment if you need it

// Correct path from src/app.js → src/routes/userRoutes.js
const userRoutes = require("./src/routes/userRoutes");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes with proper prefix
app.use("/api/users", userRoutes);   // All your user routes will be under /api/users

// Example: Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// 404 handler (optional but good)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;