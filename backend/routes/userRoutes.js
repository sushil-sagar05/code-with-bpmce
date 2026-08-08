const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, updateRole, deleteUser, getLeaderboard } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/role', protect, admin, updateRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
