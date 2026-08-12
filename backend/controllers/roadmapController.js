const Roadmap = require('../models/Roadmap');

const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ isPublished: true });
    res.json({ success: true, data: roadmaps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRoadmapBySlug = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createRoadmap = async (req, res) => {
  try {
    let { slug, title } = req.body;
    if (!slug) {
      slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    // Check if slug exists and make unique if collision occurs
    const existing = await Roadmap.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    const roadmap = await Roadmap.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: roadmap });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A roadmap with this title or slug already exists. Please use a unique title or custom slug.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A roadmap with this title or slug already exists.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Roadmap deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRoadmaps, getRoadmapBySlug, createRoadmap, updateRoadmap, deleteRoadmap };
