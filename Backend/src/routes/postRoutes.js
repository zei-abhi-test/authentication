const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/auth")
const { createPost, getPosts } = require("../controllers/postController")

router.post("/", authMiddleware, createPost)
router.get("/", authMiddleware, getPosts)

module.exports = router