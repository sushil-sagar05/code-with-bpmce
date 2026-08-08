const Resource = require('../models/Resource');

const getResources = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    const resources = await Resource.find(filter).populate('addedBy', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const upvoteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const idx = resource.upvotes.indexOf(req.user._id);
    if (idx === -1) resource.upvotes.push(req.user._id);
    else resource.upvotes.splice(idx, 1);
    await resource.save();
    res.json({ success: true, upvotes: resource.upvotes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getResources, createResource, upvoteResource, deleteResource };
