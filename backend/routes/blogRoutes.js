const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, likeBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);
router.post('/:id/like', protect, likeBlog);

module.exports = router;
