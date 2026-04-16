// backend/src/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);