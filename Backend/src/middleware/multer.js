const multer = require('multer')

const storage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true)
//   } else {
//     cb(new Error('Only image files are allowed'), false)
//   }
// }

const upload = multer({
  storage : new cloudinary.Storage({
    cloud: cloudinary,
    folder: 'uploads',
    params : { allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] , folder: 'uploads' }
  }), 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

module.exports = upload