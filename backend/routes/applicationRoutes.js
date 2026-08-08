const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/auth');

// Public route to view approved club members & submit applications
router.get('/', getApplications);
router.post('/', createApplication);

// Admin routes
router.put('/:id/status', protect, admin, updateApplicationStatus);
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
