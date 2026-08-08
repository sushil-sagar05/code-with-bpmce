const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/auth');

router.get('/my-application', protect, getMyApplication);

router.get('/', getApplications);
router.post('/', protect, createApplication);


router.put('/:id/status', protect, admin, updateApplicationStatus);
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
