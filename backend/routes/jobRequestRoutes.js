const express = require('express');
const {
  acceptJobRequest,
  completeJob,
  getAllJobsCon,
  deleteJobRequestCon,
  denyJobRequest,
  getJobPendingCon,
  getJobRequestCon,
  createJobRequestCon,
  updateJobRequestCon,
  getJobsByClientCon
} = require("../controllers/jobRequestCon");

const router = express.Router();

// Fetch jobs for contractor
router.get('/jobRequest', getJobRequestCon);
router.get('/jobPending', getJobPendingCon);

// Client creates new booking
router.post('/jobRequests', createJobRequestCon);

// Client fetches all their created jobs
router.get('/jobRequests/client/:client_id', getJobsByClientCon);

// Admin: fetch all jobs
router.get('/jobs/all', getAllJobsCon);

// Job updates
router.patch('/jobRequest/:id/accept', acceptJobRequest);
router.patch('/jobRequest/:id/deny', denyJobRequest);
router.patch('/jobs/:job_id/completed', completeJob);

// Client updates or deletes their job request
router.patch('/jobRequests/:job_id', updateJobRequestCon);
router.delete('/jobRequests/:job_id', deleteJobRequestCon);

module.exports = router;