// backend/src/routes/postRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");

// ====================== ALL PROTECTED ROUTES ======================
router.post("/", authMiddleware, createPost);           // POST /api/posts
router.get("/", authMiddleware, getPosts);              // GET  /api/posts?page=1&limit=5
router.get("/:id", authMiddleware, getPostById);        // GET  /api/posts/:id
router.put("/:id", authMiddleware, updatePost);         // PUT  /api/posts/:id
router.delete("/:id", authMiddleware, deletePost);      // DELETE /api/posts/:id

// Optional: Socket-enabled create route (if you still want it)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create(req.body);

    const io = req.app.get("io");
    if (io) {
      io.emit("newPost", {
        message: "New post created!",
        post
      });
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create post"
    });
  }
});

module.exports = router;