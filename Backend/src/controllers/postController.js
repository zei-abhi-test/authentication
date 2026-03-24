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