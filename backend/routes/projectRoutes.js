const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, likeProject, approveProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getProjects);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.put('/:id/approve', protect, admin, approveProject);
router.delete('/:id', protect, admin, deleteProject);
router.post('/:id/like', protect, likeProject);

module.exports = router;
