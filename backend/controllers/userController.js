const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { deleteCloudinaryImage } = require('../utils/cloudinaryHelper');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name avatar branch batch points leetcode codeforces github role email')
      .sort({ points: -1 })
      .limit(50);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('achievements').populate('projects');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, role, ...rest } = req.body;
    const existing = await User.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

    // Handle avatar cleanup on Cloudinary
    if (existing.avatar && rest.avatar !== undefined && existing.avatar !== rest.avatar) {
      await deleteCloudinaryImage(existing.avatar);
    }

    let addedPoints = 0;

    // Check newly added social links (+5 points each)
    if (!existing.linkedin && rest.linkedin && rest.linkedin.trim() !== '') addedPoints += 5;
    if (!existing.github && rest.github && rest.github.trim() !== '') addedPoints += 5;
    if (!existing.leetcode && rest.leetcode && rest.leetcode.trim() !== '') addedPoints += 5;
    if (!existing.codeforces && rest.codeforces && rest.codeforces.trim() !== '') addedPoints += 5;

    // Check newly added experience entries (+10 points for new entry)
    if (Array.isArray(rest.experience) && rest.experience.length > (existing.experience?.length || 0)) {
      const diff = rest.experience.length - (existing.experience?.length || 0);
      addedPoints += diff * 10;
    }

    if (addedPoints > 0) {
      rest.points = (existing.points || 0) + addedPoints;
    }

    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'admin'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('avatar');
    // Delete profile avatar from Cloudinary if it exists
    if (user?.avatar) await deleteCloudinaryImage(user.avatar);
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLeaderboard, getUsers, getUserById, updateUser, updateRole, deleteUser };
