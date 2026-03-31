const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const cloudinary = require('../config/cloudinaryconfig')
const authMiddleware = require('../middleware/auth')

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )

    stream.end(buffer)
  })
}

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' })
      }

      const result = await streamUpload(req.file.buffer)

      res.status(200).json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      })
    } catch (err) {
      next(err)
    }
  }
)

router.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ success: false, message: err.message })
  }

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, message: err.message })
  }

  res.status(500).json({ success: false, message: 'Server Error' })
})

module.exports = router