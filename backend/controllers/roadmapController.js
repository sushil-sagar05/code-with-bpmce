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
    const roadmap = await Roadmap.create(req.body);
    res.status(201).json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: roadmap });
  } catch (err) {
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
