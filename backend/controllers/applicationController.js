const Application = require('../models/Application');
const User = require('../models/User');

// Create a new application
const createApplication = async (req, res) => {
  try {
    const { name, email, phone, branch, year, tracks, motivation, github } = req.body;
    
    // Optional logged in user
    const userId = req.user ? req.user._id : null;

    const application = await Application.create({
      name,
      email,
      phone,
      branch,
      year,
      tracks: Array.isArray(tracks) ? tracks : [],
      motivation,
      github: github || '',
      user: userId,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all applications (Admin only)
const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('user', 'name avatar email branch batch')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update application status (Admin only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name avatar email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // If approved and associated with a user, mark user as verified club member
    if (status === 'approved' && application.user) {
      await User.findByIdAndUpdate(application.user._id || application.user, { isVerified: true });
    }

    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete application (Admin only)
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
};
