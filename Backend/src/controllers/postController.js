// backend/src/controllers/postController.js
const Post = require("../models/Post");   // Fixed import to match your model

// ====================== CREATE POST (First version + Second version merged) ======================
exports.createPost = async (req, res) => {
  try {
    const { title, content, coverImage } = req.body;

    const post = await Post.create({
      title,
      content,
      coverImage,
      // Support both possibilities from your code
      author: req.user.id || req.user.userId,
      user: req.user._id,                    // Kept both author and user fields
    });

    res.status(201).json({ 
      message: "Post created successfully", 
      post 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};

// ====================== GET ALL POSTS (with pagination) ======================
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userId = req.user.id || req.user.userId;   // Normalized userId

    const posts = await Post.find({ author: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ author: userId });

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// ====================== GET SINGLE POST ======================
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id || req.user.userId;
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this post" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE POST ======================
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id || req.user.userId;
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== DELETE POST ======================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id || req.user.userId;
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};