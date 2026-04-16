// backend/index.js  (or your main server file)
import dotenv from "dotenv";
dotenv.config(); // Must be at the very top

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import uploadRoutes from "./src/routes/upload.js";
import authMiddleware from "./src/middleware/auth.js";
import errorhandler from "./src/middleware/errorMiddleware.js";

const app = express();

// ---------- Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes (Register WITHOUT io) ----------
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);     // Keep if you intentionally want both paths
app.use("/api/posts", postRoutes);    // Main posts route
app.use("/api/upload", uploadRoutes);

// Protected route example
app.get("/api/users/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.json({
    status: "Server Running",
    message: "MERN Backend Connected",
  });
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ---------- Global Error Handler ----------
app.use(errorhandler);

// ---------- Create HTTP Server & Socket.io ----------
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Attach io to express app so any route can access it safely
app.set("io", io);

// ---------- Socket.io Authentication Middleware ----------
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

// ---------- Socket.io Connection Handler ----------
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id} | Email: ${socket.user?.email || "Unknown"}`);

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id} | Email: ${socket.user?.email || "Unknown"}`);
  });
});

// ---------- Start Server ----------
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();