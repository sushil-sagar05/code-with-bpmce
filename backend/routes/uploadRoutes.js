const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// POST /api/upload — upload a single image, return Cloudinary URL
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    url: req.file.path,          // Cloudinary secure URL
    publicId: req.file.filename, // Cloudinary public_id
  });
});

module.exports = router;
