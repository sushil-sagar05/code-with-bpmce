const express = require('express');
const router = express.Router();
const { getAchievements, getAchievementById, createAchievement, verifyAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', protect, createAchievement);
router.put('/:id/verify', protect, admin, verifyAchievement);
router.delete('/:id', protect, admin, deleteAchievement);

module.exports = router;
