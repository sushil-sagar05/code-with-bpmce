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
    const pointsToAward = req.body.points || 50;
    const achievement = await Achievement.create({ ...req.body, points: pointsToAward, student: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { achievements: achievement._id },
      $inc: { points: pointsToAward },
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

const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('student', 'name avatar branch batch email');
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
    res.json({ success: true, data: { ...achievement.toObject(), user: achievement.student } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAchievements, getAchievementById, createAchievement, verifyAchievement, deleteAchievement };
