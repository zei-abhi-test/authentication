// backend/src/routes/postRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} = require("../controllers/postController");

// All routes are protected
router.post("/", authMiddleware, createPost);           // POST /api/posts
router.get("/", authMiddleware, getPosts);              // GET  /api/posts?page=1&limit=5
router.get("/:id", authMiddleware, getPostById);        // GET  /api/posts/:id
router.put("/:id", authMiddleware, updatePost);         // PUT  /api/posts/:id
router.delete("/:id", authMiddleware, deletePost);      // DELETE /api/posts/:id

module.exports = router;