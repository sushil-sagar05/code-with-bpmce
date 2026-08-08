const Blog = require('../models/Blog');
const { deleteCloudinaryImage } = require('../utils/cloudinaryHelper');

const getBlogs = async (req, res) => {
  try {
    const { author, category, all } = req.query;
    const filter = {};
    if (author) filter.author = author;
    else if (all !== 'true') filter.isPublished = true;
    if (category) filter.category = category;

    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id).populate('author', 'name avatar branch batch email');
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id }).populate('author', 'name avatar branch batch email');
    }
    if (!blog) return res.status(404).json({ success: false, message: 'Blog article not found' });
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const blog = await Blog.create({ ...req.body, author: req.user._id, slug, isPublished: false });
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    // If cover image is being replaced, delete the old one from Cloudinary
    if (existing && req.body.coverImage && existing.coverImage && existing.coverImage !== req.body.coverImage) {
      await deleteCloudinaryImage(existing.coverImage);
    }
    // If cover image is being removed (set to empty), delete old one
    if (existing && req.body.coverImage === '' && existing.coverImage) {
      await deleteCloudinaryImage(existing.coverImage);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    // Delete cover image from Cloudinary if it exists
    if (blog.coverImage) await deleteCloudinaryImage(blog.coverImage);
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const idx = blog.likes.indexOf(req.user._id);
    if (idx === -1) blog.likes.push(req.user._id);
    else blog.likes.splice(idx, 1);
    await blog.save();
    res.json({ success: true, likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, likeBlog };
