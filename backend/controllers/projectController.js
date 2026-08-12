const Project = require('../models/Project');
const User = require('../models/User');

const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    const projects = await Project.find(filter)
      .populate('team', 'name avatar')
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, addedBy: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id },
      $inc: { points: 20 },
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const approveProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { isFeatured: true }, { new: true });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const idx = project.likes.indexOf(req.user._id);
    if (idx === -1) project.likes.push(req.user._id);
    else project.likes.splice(idx, 1);
    await project.save();
    res.json({ success: true, likes: project.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject, likeProject, approveProject };
