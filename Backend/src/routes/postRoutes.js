const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/auth")
const { createPost, getPosts } = require("../controllers/postController")
const {updatePost , deletePost , getPostById} = require("../controllers/postController")

router.put("/:id", authMiddleware, updatePost)
router.delete("/:id", authMiddleware, deletePost)
router.get("/:id", authMiddleware, getPostById)

router.post("/create", authMiddleware, createPost)
router.get("/posts", authMiddleware, getPosts)

module.exports = router