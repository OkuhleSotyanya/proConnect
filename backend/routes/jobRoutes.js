// jobRoutes.js
const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Client books a contractor
router.post('/', authMiddleware(['client']), JobController.createJob);

// Contractor fetches their own jobs
router.get('/contractor', authMiddleware(['contractor']), JobController.getJobsForContractor);

// Get all jobs (Admins, Clients, Contractors see filtered)
router.get('/all', authMiddleware(['admin', 'client', 'contractor']), JobController.getAllJobs);

// Contractor or authorized user updates job status
router.put('/status', authMiddleware(['contractor', 'admin']), JobController.updateJobStatus);

module.exports = router;
