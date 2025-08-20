const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getJobs,
  requestRefund
} = require('../controllers/profileController');

router.get('/', authenticateMiddleware, getProfile);       // GET /profile
router.put('/update', authenticateMiddleware, updateProfile); // PUT /profile/update
router.get('/jobs', authenticateMiddleware, getJobs);      // GET /profile/jobs
router.post('/refund', authenticateMiddleware, requestRefund); // POST /profile/refund

module.exports = router;