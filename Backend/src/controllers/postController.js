const Post = require("../Model/PostSchema")

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body

    const post = await Post.create({
      title,
      content,
      user: req.user.id
    })

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: "Error creating post" })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const skip = (page - 1) * limit

    const posts = await Post.find({ user: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Post.countDocuments({ user: req.user.id })

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" })
  }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};