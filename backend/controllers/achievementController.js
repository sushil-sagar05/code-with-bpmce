const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { deleteCloudinaryImage } = require('../utils/cloudinaryHelper');

const getAchievements = async (req, res) => {
  try {
    const { type, verified, user } = req.query;
    const filter = {};
    // If user param is set (e.g. for student dashboard), don't force isVerified=true by default unless specified
    if (verified === 'false') filter.isVerified = false;
    else if (verified === 'true') filter.isVerified = true;
    else if (!user) filter.isVerified = true; // default public view only when not filtering by specific user
    if (type) filter.type = type;
    if (user) filter.student = user;
    const achievements = await Achievement.find(filter)
      .populate('student', 'name avatar branch batch email')
      .sort({ date: -1 });
    // Map student → user for frontend compatibility
    const data = achievements.map((a) => ({ ...a.toObject(), user: a.student }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create({ ...req.body, student: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { achievements: achievement._id },
      $inc: { points: achievement.points },
    });
    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json({ success: true, data: achievement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
    // Delete certificate/proof image from Cloudinary if it exists
    if (achievement.image) await deleteCloudinaryImage(achievement.image);
    await achievement.deleteOne();
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAchievements, createAchievement, verifyAchievement, deleteAchievement };
