// backend/src/routes/postRoutes.js
const express = require("react"); // Wait, fix: express
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");   // ← Added this (assuming your model path)

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");

// All routes are protected
router.post("/", authMiddleware, createPost);           // POST /api/posts
router.get("/", authMiddleware, getPosts);              // GET  /api/posts
router.get("/:id", authMiddleware, getPostById);        // GET  /api/posts/:id
router.put("/:id", authMiddleware, updatePost);         // PUT  /api/posts/:id
router.delete("/:id", authMiddleware, deletePost);      // DELETE /api/posts/:id

// Additional socket-enabled create route (kept exactly as per your request)
router.post("/create", authMiddleware, async (req, res) => {
  const post = await Post.create(req.body);

  // Emit real-time update
  const io = req.app.get("io");
  if (io) {
    io.emit("newPost", {
      message: "New post created!",
      post
    });
  }

  res.status(201).json(post);
});

module.exports = router;