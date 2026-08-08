const express = require('express');
const router = express.Router();
const { getResources, createResource, upvoteResource, deleteResource } = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getResources);
router.post('/', protect, admin, createResource);
router.post('/:id/upvote', protect, upvoteResource);
router.delete('/:id', protect, admin, deleteResource);

module.exports = router;
