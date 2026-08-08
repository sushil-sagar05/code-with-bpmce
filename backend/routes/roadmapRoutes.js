const express = require('express');
const router = express.Router();
const { getRoadmaps, getRoadmapBySlug, createRoadmap, updateRoadmap, deleteRoadmap } = require('../controllers/roadmapController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getRoadmaps);
router.get('/:slug', getRoadmapBySlug);
router.post('/', protect, admin, createRoadmap);
router.put('/:id', protect, admin, updateRoadmap);
router.delete('/:id', protect, admin, deleteRoadmap);

module.exports = router;
