const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/auth');

// Public or optional auth route to submit application
router.post('/', createApplication);

// Admin routes
router.get('/', protect,  getApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
