// frontend/src/routes/upload.js   (or backend/src/routes/uploadRoutes.js)
const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinaryconfig");
const authMiddleware = require("../middleware/auth");

// Stream upload helper (kept exactly as you wrote it)
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// ====================== MAIN UPLOAD ROUTE ======================
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const result = await streamUpload(req.file.buffer);

      // 🔥 Emit Socket.io event (kept from your second version)
      if (req.app.get("io")) {
        req.app.get("io").emit("newPost", {
          message: "New post uploaded!",
          imageUrl: result.secure_url,
          user: req.user ? req.user.email : "Unknown",
        });
      }

      res.status(200).json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        imageUrl: result.secure_url,        // kept both styles for compatibility
      });
    } catch (err) {
      next(err);
    }
  }
);

// ====================== ERROR HANDLER FOR MULTER (kept exactly) ======================
router.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: "Server Error" });
});

module.exports = router;